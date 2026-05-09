import {
  Model,
  Table,
  Column,
  PrimaryKey,
  CreatedAt,
  DeletedAt,
  UpdatedAt,
  DataType,
  AllowNull,
  Default,
  BelongsTo
} from 'sequelize-typescript'
import { Account } from './account.model'

@Table({
  tableName: 'sso_code',
  underscored: true,
  timestamps: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  paranoid: true,
  indexes: [
    {
      fields: ['code']
    }
  ],
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt']
    }
  }
})
export class Code extends Model {
  @AllowNull(false)
  @Column(DataType.UUID)
  cid: string

  @PrimaryKey
  @Column(DataType.UUID)
  key: string

  @AllowNull(false)
  @Column(DataType.STRING(80))
  secret: string

  @AllowNull(false)
  @Column(DataType.STRING(6))
  code: string

  @AllowNull(false)
  @Default('OTHER')
  @Column(DataType.ENUM('INITIAL_ACCOUNT', 'REGISTRY_ACCOUNT', 'RESET_PASSWORD', 'OTHER'))
  type: string

  @AllowNull(true)
  @Column(DataType.JSON)
  payload: string

  @AllowNull(false)
  @Default('ACTIVE')
  @Column(DataType.ENUM('READY', 'ACTIVE', 'EXPIRED'))
  status: string

  @AllowNull(false)
  @Column(DataType.DATE)
  issuedAt: Date

  @AllowNull(false)
  @Default(1000 * 60 * 60 * 24)
  @Column(DataType.INTEGER)
  expiresIn: number

  @AllowNull(true)
  @Column(DataType.DATE)
  expiredAt: Date

  @AllowNull(true)
  @Column(DataType.DATE)
  usedAt: Date

  @CreatedAt
  @AllowNull(false)
  @Column(DataType.DATE)
  createdAt: Date

  @AllowNull(true)
  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date

  @AllowNull(true)
  @DeletedAt
  @Column(DataType.DATE)
  deletedAt: Date

  @BelongsTo(() => Account, 'cid')
  account: Account
}
