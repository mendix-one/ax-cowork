import { AllowNull, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript'

@Table({
  tableName: 'mst_timezone',
  underscored: true,
  timestamps: false,
  createdAt: false,
  updatedAt: false,
  deletedAt: false,
  paranoid: false
})
export class Timezone extends Model {
  @PrimaryKey
  @Column(DataType.STRING)
  timezone: string

  @AllowNull(true)
  @Column(DataType.STRING)
  name: string

  @AllowNull(true)
  @Column(DataType.STRING)
  group: string

  @AllowNull(true)
  @Column(DataType.STRING)
  utcOffset: string
}
