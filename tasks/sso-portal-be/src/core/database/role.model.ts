import {
  AllowNull,
  BelongsTo,
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
import { Artifact } from './artifact.model'
import { Unit } from './unit.model'

@Table({
  tableName: 'sso_role',
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
export class Role extends Model {
  @AllowNull(false)
  @Column(DataType.UUID)
  aid: string

  @AllowNull(true)
  @Column(DataType.UUID)
  uid: string

  @PrimaryKey
  @Column(DataType.STRING)
  key: string

  @AllowNull(false)
  @Default(999999999)
  @Column(DataType.INTEGER)
  level: number

  @AllowNull(true)
  @Column(DataType.STRING)
  icon: string

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string

  @AllowNull(true)
  @Column(DataType.TEXT)
  description: string

  @AllowNull(true)
  @Column(DataType.STRING)
  type: string

  @AllowNull(false)
  @Default('ACTIVE')
  @Column(DataType.ENUM('READY', 'ACTIVE', 'LOCKED'))
  status: string

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  isDefault: boolean

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

  @BelongsTo(() => Unit, 'uid')
  unit: Unit
}
