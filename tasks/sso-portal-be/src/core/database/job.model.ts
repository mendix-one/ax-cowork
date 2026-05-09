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
  Default
} from 'sequelize-typescript'

@Table({
  tableName: 'sso_job',
  underscored: true,
  timestamps: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  paranoid: true,
  indexes: [
    {
      fields: ['name']
    }
  ]
})
export class Job extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  id: string

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string

  @AllowNull(false)
  @Default('READY')
  @Column(DataType.ENUM('READY', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELED'))
  status: string

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  attempt: number

  @AllowNull(true)
  @Column(DataType.JSON)
  payload: string

  @AllowNull(true)
  @Column(DataType.TEXT)
  error: string

  @AllowNull(true)
  @Column(DataType.DATE)
  startedAt: string

  @AllowNull(true)
  @Column(DataType.DATE)
  finishedAt: string

  @CreatedAt
  @AllowNull(false)
  @Column(DataType.DATE)
  createdAt: Date

  @UpdatedAt
  @AllowNull(true)
  @Column(DataType.DATE)
  updatedAt: Date

  @DeletedAt
  @AllowNull(true)
  @Column(DataType.DATE)
  deletedAt: Date
}
