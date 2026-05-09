import { AllowNull, BelongsTo, Column, DataType, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { Country } from './country.model'
import { District } from './district.model'

@Table({
  tableName: 'mst_region',
  underscored: true,
  timestamps: false,
  createdAt: false,
  updatedAt: false,
  deletedAt: false,
  paranoid: false
})
export class Region extends Model {
  @AllowNull(false)
  @Column(DataType.STRING(2))
  countryCode: string

  @PrimaryKey
  @Column(DataType.STRING(2))
  code: string

  @AllowNull(true)
  @Column(DataType.STRING)
  prefix: string

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string

  @AllowNull(true)
  @Column(DataType.STRING)
  domainCode: string

  @AllowNull(true)
  @Column(DataType.STRING)
  domainName: string

  @BelongsTo(() => Country, 'countryCode')
  country: Country

  @HasMany(() => District, 'regionCode')
  districts: District[]
}
