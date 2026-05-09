import { AllowNull, BelongsTo, Column, DataType, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { Region } from './region.model'
import { Ward } from './ward.model'

@Table({
  tableName: 'mst_district',
  underscored: true,
  timestamps: false,
  createdAt: false,
  updatedAt: false,
  deletedAt: false,
  paranoid: false
})
export class District extends Model {
  @Column(DataType.STRING(2))
  regionCode: string

  @PrimaryKey
  @Column(DataType.STRING(3))
  code: string

  @AllowNull(true)
  @Column(DataType.STRING)
  prefix: string

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string

  @BelongsTo(() => Region, 'regionCode')
  region: Region

  @HasMany(() => Ward, 'districtCode')
  wards: Ward[]
}
