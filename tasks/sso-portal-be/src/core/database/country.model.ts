import { Model, Table, Column, PrimaryKey, DataType, AllowNull, HasMany } from 'sequelize-typescript'
import { Region } from './region.model'

@Table({
  tableName: 'mst_country',
  underscored: true,
  timestamps: false,
  createdAt: false,
  updatedAt: false,
  deletedAt: false,
  paranoid: false
})
export class Country extends Model {
  @PrimaryKey
  @Column(DataType.STRING(2))
  code: string

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string

  @AllowNull(true)
  @Column(DataType.STRING)
  nativeName: string

  @AllowNull(true)
  @Column(DataType.STRING)
  fullName: string

  @AllowNull(true)
  @Column(DataType.STRING)
  langCode: string

  @AllowNull(true)
  @Column(DataType.STRING)
  langName: string

  @AllowNull(true)
  @Column(DataType.STRING)
  langNativeName: string

  @AllowNull(true)
  @Column(DataType.STRING)
  continentCode: string

  @AllowNull(true)
  @Column(DataType.STRING)
  continentName: string

  @HasMany(() => Region, 'countryCode')
  regions: Region[]
}
