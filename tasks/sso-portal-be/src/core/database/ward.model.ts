import { AllowNull, BelongsTo, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { District } from './district.model'

@Table({
  tableName: 'mst_ward',
  underscored: true,
  timestamps: false,
  createdAt: false,
  updatedAt: false,
  deletedAt: false,
  paranoid: false
})
export class Ward extends Model {
  @Column(DataType.STRING(3))
  districtCode: string

  @PrimaryKey
  @Column(DataType.STRING(5))
  code: string

  @AllowNull(true)
  @Column(DataType.STRING)
  prefix: string

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string

  @BelongsTo(() => District, 'districtCode')
  district: District
}
