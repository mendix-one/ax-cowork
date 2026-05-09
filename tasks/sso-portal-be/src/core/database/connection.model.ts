import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript'
import { Client } from './client.model'
import { Session } from './session.model'

@Table({
  tableName: 'sso_connection',
  underscored: true,
  timestamps: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: false,
  paranoid: false,
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  }
})
export class Connection extends Model {
  @AllowNull(false)
  @Column(DataType.UUID)
  eid: string

  @AllowNull(false)
  @Column(DataType.UUID)
  sid: string

  @PrimaryKey
  @Column(DataType.UUID)
  key: string

  @AllowNull(false)
  @Column(DataType.STRING(80))
  secret: string

  @AllowNull(false)
  @Default('ACTIVE')
  @Column(DataType.ENUM('READY', 'ACTIVE', 'LOCKED', 'EXPIRED'))
  status: string

  @AllowNull(false)
  @Column(DataType.TEXT)
  redirect: string

  @AllowNull(false)
  @Column(DataType.DATE)
  issuedAt: Date

  @AllowNull(true)
  @Column(DataType.DATE)
  connectedAt: Date

  @AllowNull(true)
  @Column(DataType.DATE)
  lastRequestedAt: Date

  @AllowNull(true)
  @Column(DataType.STRING)
  host: string

  @AllowNull(true)
  @Column(DataType.STRING)
  xForwardedFor: string

  @AllowNull(true)
  @Column(DataType.STRING)
  xForwardedProto: string

  @AllowNull(true)
  @Column(DataType.STRING)
  xForwardedPort: string

  @AllowNull(true)
  @Column(DataType.TEXT)
  userAgent: string

  @AllowNull(true)
  @Column(DataType.TEXT)
  metadata: string

  @CreatedAt
  @AllowNull(false)
  @Column(DataType.DATE)
  createdAt: Date

  @UpdatedAt
  @AllowNull(true)
  @Column(DataType.DATE)
  updatedAt: Date

  @BelongsTo(() => Client, 'eid')
  client: Client

  @BelongsTo(() => Session, 'sid')
  session: Session
}
