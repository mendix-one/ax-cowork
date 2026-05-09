import { AllowNull, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript'

@Table({
  tableName: 'mst_language',
  underscored: true,
  timestamps: false,
  createdAt: false,
  updatedAt: false,
  deletedAt: false,
  paranoid: false
})
export class Language extends Model {
  @PrimaryKey
  @Column(DataType.STRING(2))
  code: string

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string

  @AllowNull(true)
  @Column(DataType.STRING)
  fullName: string

  @AllowNull(true)
  @Column(DataType.STRING)
  globalName: string
}
