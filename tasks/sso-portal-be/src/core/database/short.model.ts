import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript'

@Table({
  tableName: 'sso_short',
  underscored: true,
  timestamps: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  paranoid: true,
  indexes: [
    {
      fields: ['code'],
      unique: true
    }
  ],
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt']
    }
  }
})
export class Short extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number

  @AllowNull(false)
  @Column(DataType.STRING(18))
  code: string

  @AllowNull(true)
  @Column(DataType.TEXT)
  alias: string

  @AllowNull(true)
  @Column(DataType.TEXT)
  target: string

  @AllowNull(false)
  @Column(DataType.DATE)
  issuedAt: Date

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  attempt: number

  @AllowNull(true)
  @Column(DataType.DATE)
  lastUsedAt: Date

  @AllowNull(false)
  @Default('ACTIVE')
  @Column(DataType.ENUM('READY', 'ACTIVE', 'EXPIRED'))
  status: string

  @AllowNull(false)
  @Default(1000 * 60 * 60 * 24)
  @Column(DataType.INTEGER)
  expiresIn: Date

  @AllowNull(true)
  @Column(DataType.DATE)
  expiredAt: Date

  @CreatedAt
  @AllowNull(false)
  @Column(DataType.DATE)
  createdAt: Date

  @AllowNull(true)
  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date

  @AllowNull(true)
  @DeletedAt
  @Column(DataType.DATE)
  deletedAt: Date
}
