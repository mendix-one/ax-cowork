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
import { Account } from './account.model'

@Table({
  tableName: 'sso_session',
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
export class Session extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  sid: string

  @AllowNull(false)
  @Default('ACTIVE')
  @Column(DataType.ENUM('READY', 'ACTIVE', 'LOCKED', 'EXPIRED'))
  status: string

  @AllowNull(false)
  @Column(DataType.DATE)
  issuedAt: Date

  @AllowNull(true)
  @Column(DataType.UUID)
  cid: string

  @AllowNull(true)
  @Column(DataType.DATE)
  signedAt: Date

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

  @BelongsTo(() => Account, 'cid')
  account: Account
}
