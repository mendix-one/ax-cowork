import { AllowNull, BelongsTo, Column, DataType, Default, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { Account } from './account.model'
import { Unit } from './unit.model'

@Table({
  tableName: 'sso_unit_account',
  underscored: true,
  timestamps: true,
  createdAt: false,
  updatedAt: false,
  deletedAt: false,
  paranoid: false
})
export class UnitAccount extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  uid: string

  @PrimaryKey
  @Column(DataType.UUID)
  cid: string

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  ownership: boolean

  @AllowNull(false)
  @Default(999999999)
  @Column(DataType.INTEGER)
  level: number

  @BelongsTo(() => Unit, 'uid')
  unit: Unit

  @BelongsTo(() => Account, 'cid')
  account: Account
}
