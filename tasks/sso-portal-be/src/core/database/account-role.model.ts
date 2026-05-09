import { AllowNull, BelongsTo, Column, DataType, Default, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { Account } from './account.model'
import { Role } from './role.model'

@Table({
  tableName: 'sso_account_role',
  underscored: true,
  timestamps: false,
  createdAt: false,
  updatedAt: false,
  deletedAt: false,
  paranoid: false
})
export class AccountRole extends Model {
  @PrimaryKey
  @Column(DataType.STRING)
  key: string

  @PrimaryKey
  @Column(DataType.UUID)
  cid: string

  @AllowNull(false)
  @Default('ACTIVE')
  @Column(DataType.ENUM('READY', 'ACTIVE', 'LOCKED'))
  status: string

  @BelongsTo(() => Account, 'cid')
  account: Account

  @BelongsTo(() => Role, 'key')
  role: Role
}
