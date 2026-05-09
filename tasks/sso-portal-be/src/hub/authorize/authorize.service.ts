import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { STATUS } from '../../core/enum/status.enum'
import { JwtManager } from '../../core/manager/jwt.manager'
import { HashingManager } from '../../core/manager/hashing.manager'
import { DateTimeManager } from '../../core/manager/date-time.manager'
import { TransactionManager } from '../../core/manager/transaction.manager'
import { Artifact } from '../../core/database/artifact.model'
import { Client } from '../../core/database/client.model'
import { Connection } from '../../core/database/connection.model'
import { BusinessException } from '../../core/exception/business.exception'
import { JwtPayload } from '../../core/interface/jwt-payload.interface'
import { AuthorizeReqBody } from './dto/authorize.req-body'

@Injectable()
export class AuthorizeService {
  constructor(
    private jwtManager: JwtManager,
    private hashingManager: HashingManager,
    private dateTimeManager: DateTimeManager,
    private transactionManager: TransactionManager,
    @InjectModel(Client) private clientModel: typeof Client,
    @InjectModel(Connection) private connectionModel: typeof Connection
  ) {}

  /**
   * Do authorization for the connection
   *
   * @param clientToken
   * @param params
   */
  async authorize(clientToken: string, params: AuthorizeReqBody) {
    const transaction = await this.transactionManager.open()
    try {
      // Decode client token
      const clientTokenPayload = await this.jwtManager.decode(clientToken)

      // Check token
      if (!clientTokenPayload) {
        throw new UnauthorizedException('Incorrect authorization token.')
      }

      // Retrieve client
      const client = await this.clientModel.findOne({
        include: [{ model: Artifact, required: false, where: { status: STATUS.ACTIVE } }],
        where: { eid: clientTokenPayload.key, status: STATUS.ACTIVE },
        transaction,
        raw: true,
        nest: true
      })

      // Check client
      if (!client) {
        throw new UnauthorizedException('The client is not active')
      }

      // Check secret
      if (!(await this.hashingManager.compare(client.secret, clientTokenPayload.secret))) {
        throw new UnauthorizedException('Invalid client secret')
      }

      // Check artifact
      if (!client.artifact?.aid) {
        throw new UnauthorizedException('The artifact is not active')
      }

      // Retrieve connection
      const connection = await this.connectionModel.findOne({
        where: { key: params.key },
        transaction,
        raw: true,
        nest: true
      })

      // Check connection
      if (!connection) {
        throw new BusinessException(1, 'Did not connected yet')
      }

      // Check secret
      if (!(await this.hashingManager.compare(connection.secret, params.secret))) {
        throw new BusinessException(2, 'Invalid connection secret')
      }

      // Match client with connection
      if (connection.eid !== client.eid) {
        throw new BusinessException(3, 'Not match the connection with the client')
      }

      // Check connection
      if (connection.status !== STATUS.READY) {
        throw new BusinessException(4, 'The connection was changed')
      }

      // Active connection
      await this.connectionModel.update(
        {
          status: STATUS.ACTIVE,
          connectedAt: await this.dateTimeManager.currentDateTime()
        },
        {
          where: { key: params.key },
          transaction
        }
      )

      // Connect token payload
      const authorizeTokenPayload: JwtPayload = {}
      authorizeTokenPayload.key = connection.key
      authorizeTokenPayload.secret = await this.hashingManager.hash(connection.secret)

      const authorizeToken = await this.jwtManager.signToken(authorizeTokenPayload)

      // Commit transaction & return result
      await this.transactionManager.commit(transaction)
      return {
        key: connection.key,
        eid: connection.eid,
        sid: connection.sid,
        token: authorizeToken
      }
    } catch (ex) {
      await this.transactionManager.rollback(transaction)
      throw ex
    }
  }
}
