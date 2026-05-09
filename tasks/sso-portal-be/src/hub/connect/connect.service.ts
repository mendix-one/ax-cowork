import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { STATUS } from '../../core/enum/status.enum'
import { Generator } from '../../core/util/generator'
import { JwtManager } from '../../core/manager/jwt.manager'
import { HashingManager } from '../../core/manager/hashing.manager'
import { DateTimeManager } from '../../core/manager/date-time.manager'
import { TransactionManager } from '../../core/manager/transaction.manager'
import { Artifact } from '../../core/database/artifact.model'
import { Client } from '../../core/database/client.model'
import { Connection } from '../../core/database/connection.model'
import { BusinessException } from '../../core/exception/business.exception'
import { JwtPayload } from '../../core/interface/jwt-payload.interface'
import { Authentication } from '../../core/interface/authentication.interface'
import { HeaderParams } from '../../core/interface/header-params.interface'
import { ConnectReqQuery } from './dto/connect.req-query'

@Injectable()
export class ConnectService {
  constructor(
    private generator: Generator,
    private jwtManager: JwtManager,
    private hashingManager: HashingManager,
    private dateTimeManager: DateTimeManager,
    private transactionManager: TransactionManager,
    @InjectModel(Client) private clientModel: typeof Client,
    @InjectModel(Connection) private connectionModel: typeof Connection
  ) {}

  /**
   * Check redirect match with client domain
   *
   * @param domain
   * @param redirect
   */
  isValidRedirect(domain: string, redirect: string) {
    // Allow all domain
    if (domain.includes('*')) {
      return true
    }

    // Check include redirect domain
    const listDomains = domain.split(';')
    for (const e of listDomains) {
      if (redirect.startsWith(`https://${e}`) || redirect.startsWith(`http://${e}`)) {
        return true
      }
    }

    return false
  }

  /**
   * Do connection for the client
   *
   * @param auth
   * @param params
   * @param headers
   */
  async connect(auth: Authentication, params: ConnectReqQuery, headers: HeaderParams) {
    const transaction = await this.transactionManager.open()
    try {
      // Decode client JWT token
      const clientCodePayload = await this.jwtManager.decode(params.code)

      // Check token
      if (!clientCodePayload) {
        throw new BusinessException(1, 'Missing client code')
      }

      // Retrieve client
      const client = await this.clientModel.findOne({
        include: [{ model: Artifact, required: false, where: { status: STATUS.ACTIVE } }],
        where: { eid: clientCodePayload.key, status: STATUS.ACTIVE },
        raw: true,
        nest: true
      })

      // Check client
      if (!client) {
        throw new BusinessException(2, 'Invalid client key')
      }

      // Check secret
      if (!(await this.hashingManager.compare(client.secret, clientCodePayload.secret))) {
        throw new BusinessException(3, 'Invalid client secret')
      }

      // Check artifact
      if (!client.artifact?.aid) {
        throw new BusinessException(4, 'The artifact is not active')
      }

      // Check redirect
      if (!this.isValidRedirect(client.domain, params.redirect)) {
        throw new BusinessException(5, 'Invalid client redirect')
      }

      // Declare connection
      let connection: any = undefined

      // Find connection by key
      if (params.key) {
        connection = await this.connectionModel.findOne({
          where: { key: params.key },
          raw: true,
          nest: true
        })
      }

      // Check connection
      if (connection) {
        // Match client with connection
        if (connection.eid !== client.eid) {
          throw new BusinessException(6, 'Not match the connection with the client')
        }

        // Match client with session
        if (connection.sid !== auth.sid) {
          throw new BusinessException(7, 'Not match the connection with the session')
        }

        // Change connection to ready
        await this.connectionModel.update(
          {
            ...headers,
            status: STATUS.READY,
            issuedAt: await this.dateTimeManager.currentDateTime(),
            connectedAt: null
          },
          {
            where: { key: params.key },
            transaction
          }
        )
      } else {
        // Create connect data
        connection = { ...headers }
        connection.sid = auth.sid
        connection.eid = client.eid
        connection.key = params.key || this.generator.key()
        connection.secret = this.generator.secret()
        connection.redirect = params.redirect
        connection.status = STATUS.READY
        connection.issuedAt = await this.dateTimeManager.currentDateTime()

        // Create connect
        await this.connectionModel.create(connection, { transaction })
      }

      // JWT connection code payload
      const connectionCodePayload: JwtPayload = {}
      connectionCodePayload.key = connection.key
      connectionCodePayload.secret = await this.hashingManager.hash(connection.secret)

      // JWT connection code
      const connectionCode = await this.jwtManager.signCode(connectionCodePayload)

      // Commit transaction & return result
      await this.transactionManager.commit(transaction)
      return connectionCode
    } catch (ex) {
      await this.transactionManager.rollback(transaction)
      throw ex
    }
  }
}
