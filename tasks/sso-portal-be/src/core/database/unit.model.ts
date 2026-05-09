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
  tableName: 'sso_unit',
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
export class Unit extends Model {
  @AllowNull(false)
  @Column(DataType.UUID)
  aid: string

  @PrimaryKey
  @Column(DataType.UUID)
  uid: string

  @AllowNull(true)
  @Column(DataType.UUID)
  parentId: string

  @AllowNull(true)
  @Column(DataType.UUID)
  ownerCid: string

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string

  @AllowNull(true)
  @Column(DataType.STRING)
  logo: string

  @AllowNull(true)
  @Column(DataType.STRING)
  image: string

  @AllowNull(true)
  @Column(DataType.STRING)
  avatar: string

  @AllowNull(true)
  @Column(DataType.TEXT)
  description: string

  @AllowNull(true)
  @Column(DataType.STRING)
  type: string

  @AllowNull(false)
  @Default('ACTIVE')
  @Column(DataType.ENUM('READY', 'ACTIVE', 'LOCKED', 'CLOSED'))
  status: string

  @AllowNull(true)
  @Column(DataType.UUID)
  cdnLogoId: string

  @AllowNull(true)
  @Column(DataType.UUID)
  cdnImageId: string

  @AllowNull(true)
  @Column(DataType.UUID)
  cdnAvatarId: string

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

  @BelongsTo(() => Unit, 'parentId')
  parent: Unit
}
