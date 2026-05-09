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
  Default,
  BelongsTo
} from 'sequelize-typescript'
import { Artifact } from './artifact.model'

@Table({
  tableName: 'sso_client',
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
export class Client extends Model {
  @Column(DataType.UUID)
  aid: string

  @PrimaryKey
  @Column(DataType.UUID)
  eid: string

  @AllowNull(false)
  @Column(DataType.STRING(80))
  secret: string

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string

  @AllowNull(true)
  @Column(DataType.TEXT)
  domain: string

  @AllowNull(true)
  @Column(DataType.STRING)
  image: string

  @AllowNull(true)
  @Column(DataType.TEXT)
  description: string

  @AllowNull(false)
  @Default('WEB_SERVER')
  @Column(DataType.ENUM('WEB_SERVICE', 'WEB_SERVER', 'OTHER'))
  type: string

  @AllowNull(false)
  @Default('ACTIVE')
  @Column(DataType.ENUM('READY', 'ACTIVE', 'LOCKED'))
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

  @BelongsTo(() => Artifact, 'aid')
  artifact: Artifact
}
