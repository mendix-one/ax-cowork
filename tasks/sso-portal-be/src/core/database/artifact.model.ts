import {
  AllowNull,
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
  tableName: 'sso_artifact',
  underscored: true,
  timestamps: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['textSearch', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'deletedBy', 'deletedAt']
    }
  }
})
export class Artifact extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  aid: string

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string

  @AllowNull(true)
  @Column(DataType.STRING)
  image: string

  @AllowNull(true)
  @Column(DataType.TEXT)
  description: string

  @AllowNull(true)
  @Column(DataType.STRING)
  homepage: string

  @AllowNull(true)
  @Column(DataType.STRING)
  ssoAlias: string

  @AllowNull(true)
  @Column(DataType.TEXT)
  apiKey: string

  @AllowNull(false)
  @Default('EXTERNAL')
  @Column(DataType.ENUM('DEFAULT', 'INTERNAL', 'EXTERNAL'))
  type: string

  @AllowNull(false)
  @Default('ACTIVE')
  @Column(DataType.ENUM('READY', 'ACTIVE', 'LOCKED', 'CLOSED'))
  status: string

  @AllowNull(true)
  @Column(DataType.UUID)
  cdnImageId: string

  @AllowNull(true)
  @Column(DataType.UUID)
  cdnOwnerId: string

  @AllowNull(true)
  @Column(DataType.STRING(500))
  textSearch: string

  @AllowNull(true)
  @Column(DataType.UUID)
  createdBy: string

  @CreatedAt
  @AllowNull(false)
  @Column(DataType.DATE)
  createdAt: Date

  @AllowNull(true)
  @Column(DataType.UUID)
  updatedBy: string

  @UpdatedAt
  @AllowNull(true)
  @Column(DataType.DATE)
  updatedAt: Date

  @AllowNull(true)
  @Column(DataType.UUID)
  deletedBy: string

  @DeletedAt
  @AllowNull(true)
  @Column(DataType.DATE)
  deletedAt: Date
}
