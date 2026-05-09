import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript'

@Table({
  tableName: 'sso_access',
  underscored: true,
  timestamps: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: false,
  paranoid: false,
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  }
})
export class Access extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  id: string

  @AllowNull(false)
  @Column(DataType.DATE)
  issuedAt: Date

  @AllowNull(false)
  @Default('UNKNOWN')
  @Column(DataType.ENUM('UNKNOWN', 'SSO', 'WEBSITE', 'PORTAL', 'GATEWAY'))
  type: string

  @AllowNull(true)
  @Column(DataType.UUID)
  aid: string

  @AllowNull(true)
  @Column(DataType.UUID)
  eid: string

  @AllowNull(true)
  @Column(DataType.UUID)
  sid: string

  @AllowNull(true)
  @Column(DataType.UUID)
  cid: string

  @AllowNull(true)
  @Column(DataType.UUID)
  key: string

  @AllowNull(true)
  @Column(DataType.TEXT)
  request: string

  @AllowNull(true)
  @Column(DataType.STRING)
  method: string

  @AllowNull(true)
  @Column(DataType.STRING)
  host: string

  @AllowNull(true)
  @Column(DataType.STRING)
  xForwardedFor: string

  @AllowNull(true)
  @Column(DataType.STRING)
  xForwardedProto: string

  @AllowNull(true)
  @Column(DataType.STRING)
  xForwardedPort: string

  @AllowNull(true)
  @Column(DataType.TEXT)
  userAgent: string

  @AllowNull(true)
  @Column(DataType.TEXT)
  metadata: string

  @CreatedAt
  @AllowNull(false)
  @Column(DataType.DATE)
  createdAt: Date

  @UpdatedAt
  @AllowNull(true)
  @Column(DataType.DATE)
  updatedAt: Date
}
