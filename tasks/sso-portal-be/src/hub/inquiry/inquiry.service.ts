import { Op } from 'sequelize'
import { InjectModel } from '@nestjs/sequelize'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { STATUS } from '../../core/enum/status.enum'
import { EVENT_NAME } from '../../core/event/event-name.enum'
import { JwtManager } from '../../core/manager/jwt.manager'
import { HashingManager } from '../../core/manager/hashing.manager'
import { Artifact } from '../../core/database/artifact.model'
import { Role } from '../../core/database/role.model'
import { Client } from '../../core/database/client.model'
import { Session } from '../../core/database/session.model'
import { Connection } from '../../core/database/connection.model'
import { Account } from '../../core/database/account.model'
import { Setting } from '../../core/database/setting.model'
import { AccountRole } from '../../core/database/account-role.model'
import { ArtifactAccount } from '../../core/database/artifact-account.model'
import { HeaderParams } from '../../core/interface/header-params.interface'
import { CacheService } from '../../core/cache/cache.service'
import { Authorization } from './authorization.interface'

@Injectable()
export class InquiryService {
  private readonly logger = new Logger(InquiryService.name)

  constructor(
    private jwtManager: JwtManager,
    private hashingManager: HashingManager,
    private eventEmitter: EventEmitter2,
    private cacheService: CacheService,
    @InjectModel(Connection) private connectionModel: typeof Connection,
    @InjectModel(AccountRole) private accountRoleModel: typeof AccountRole,
    @InjectModel(ArtifactAccount) private artifactAccountModel: typeof ArtifactAccount
  ) {}

  /**
   * Get account roles related to an artifact
   *
   * @param aid
   * @param cid
   */
  async roles(aid: string, cid: string): Promise<Partial<Role>[]> {
    if (!cid) {
      return []
    }

    const accountRoles = await this.accountRoleModel.findAll({
      include: [{ model: Role, required: true, where: { aid, status: STATUS.ACTIVE, uid: { [Op.is]: null } } }],
      where: { cid, status: STATUS.ACTIVE },
      raw: true,
      nest: true
    })

    return accountRoles.map(x => {
      return {
        key: x.role.key,
        name: x.role.name,
        level: x.role.level
      }
    })
  }

  /**
   * Inquire authorization data
   *
   * @param authorizationToken
   * @param headerParams
   */
  async inquiry(authorizationToken: string, headerParams: HeaderParams): Promise<Authorization> {
    // Decode authorization token
    const authorizationTokenPayload = await this.jwtManager.decode(authorizationToken)

    // Check token
    if (!authorizationTokenPayload || !authorizationTokenPayload.key) {
      throw new UnauthorizedException('Incorrect authorization token.')
    }

    // Get connection key
    const key = authorizationTokenPayload.key
    const secret = authorizationTokenPayload.secret

    // Get cache data
    let data = await this.cacheService.get<any>(`CONNECTION_${key}`)

    // Get cache session
    const session = data?.sid ? await this.cacheService.get<any>(`SESSION_${data?.sid}`) : undefined

    // Just log
    if (data && session) {
      this.logger.log(`Use cache connection data: CONNECTION_${key}`)
    }

    if (!data || !session) {
      // Log info
      this.logger.log(`Connection was not cached: CONNECTION_${key}`)

      // Retrieve connection
      const connection = await this.connectionModel.findOne({
        include: [
          {
            model: Client,
            required: false,
            where: { status: STATUS.ACTIVE },
            include: [{ model: Artifact, required: false, where: { status: STATUS.ACTIVE } }]
          },
          {
            model: Session,
            required: false,
            where: { status: STATUS.ACTIVE },
            include: [
              {
                model: Account,
                required: false,
                where: { status: [STATUS.ACTIVE, STATUS.LOCKED] },
                include: [{ model: Setting, required: true }]
              }
            ]
          }
        ],
        where: { key: authorizationTokenPayload.key, status: STATUS.ACTIVE },
        raw: true,
        nest: true
      })

      // Check connection
      if (!connection) {
        throw new UnauthorizedException('The connection was expired.')
      }

      // Check secret
      if (!(await this.hashingManager.compare(connection.secret, secret))) {
        throw new UnauthorizedException('Invalid connection secret')
      }

      // Check client
      if (!connection.client) {
        throw new UnauthorizedException('Client is not active')
      }

      // Check artifact
      if (!connection.client?.artifact?.aid) {
        throw new UnauthorizedException('Artifact is not active')
      }

      // Check session
      if (!connection.session) {
        throw new UnauthorizedException('Session is not active')
      }

      // Get membership
      let membership = {}
      if (connection.session.cid) {
        membership = await this.artifactAccountModel.findOne({
          where: {
            aid: connection.client.aid,
            cid: connection.session.cid
          },
          raw: true,
          nest: true
        })
      }

      // Get account roles
      const roles = await this.roles(connection.client.aid, connection.session.cid)

      // Make data
      data = {
        key,
        aid: connection.client?.aid,
        eid: connection.client?.eid,
        sid: connection.session?.sid,
        cid: connection.session?.cid,
        account: connection.session?.cid ? connection.session?.account : undefined,
        membership,
        roles
      }

      // Cache connection data
      this.logger.log(`Cache connection data: CONNECTION_${key}`)
      await this.cacheService.set(`CONNECTION_${key}`, data)

      // Cache session data
      if (session) {
        this.logger.log(`Cache session data: SESSION_${data.sid}`)
        await this.cacheService.set(`SESSION_${data.sid}`, connection.session)
      }
    }

    // Emit event
    this.eventEmitter.emit(EVENT_NAME.ACCESSING, {
      key,
      aid: data.aid,
      eid: data.eid,
      sid: data.sid,
      cid: data.cid,
      ...headerParams
    })

    // Connect token payload
    const newToken = await this.jwtManager.signToken({ key, secret })

    // return result
    return <Authorization>{
      key,
      aid: data.aid,
      eid: data.eid,
      sid: data.sid,
      token: newToken,
      account: data.account,
      membership: data.membership,
      roles: data.roles
    }
  }
}
