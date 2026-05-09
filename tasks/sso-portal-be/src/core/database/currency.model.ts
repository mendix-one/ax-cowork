import { AllowNull, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript'

@Table({
  tableName: 'mst_currency',
  underscored: true,
  timestamps: false,
  createdAt: false,
  updatedAt: false,
  deletedAt: false,
  paranoid: false
})
export class Currency extends Model {
  @PrimaryKey
  @Column(DataType.STRING(3))
  code: string

  @AllowNull(true)
  @Column(DataType.STRING)
  symbol: string

  @AllowNull(true)
  @Column(DataType.STRING)
  symbolNative: string

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string

  @AllowNull(true)
  @Column(DataType.STRING)
  namePlural: string

  @AllowNull(true)
  @Column(DataType.STRING)
  decimalDigits: string

  @AllowNull(true)
  @Column(DataType.STRING)
  rounding: string
}
