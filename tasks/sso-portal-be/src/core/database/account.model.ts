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
import { User } from './user.model'
import { Setting } from './setting.model'

@Table({
  tableName: 'sso_account',
  underscored: true,
  timestamps: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  paranoid: true,
  indexes: [
    {
      fields: ['username']
    },
    {
      fields: ['email']
    },
    {
      fields: ['phone_number']
    }
  ],
  defaultScope: {
    attributes: {
      exclude: [
        'temporary',
        'password',
        'textSearch',
        'createdBy',
        'createdAt',
        'updatedBy',
        'updatedAt',
        'deletedBy',
        'deletedAt'
      ]
    }
  }
})
export class Account extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  cid: string

  @AllowNull(true)
  @Column(DataType.STRING)
  username: string

  @AllowNull(true)
  @Column(DataType.TEXT)
  password: string

  @AllowNull(true)
  @Column(DataType.STRING)
  email: string

  @AllowNull(true)
  @Column(DataType.STRING)
  phoneNumber: string

  @AllowNull(false)
  @Default('ACTIVE')
  @Column(DataType.ENUM('READY', 'ACTIVE', 'LOCKED', 'CLOSED'))
  status: string

  @AllowNull(true)
  @Column(DataType.DATE)
  verifiedAt: Date

  @AllowNull(true)
  @Column(DataType.DATE)
  emailVerifiedAt: Date

  @AllowNull(true)
  @Column(DataType.DATE)
  phoneVerifiedAt: Date

  @AllowNull(true)
  @Column(DataType.STRING)
  displayName: string

  @AllowNull(true)
  @Column(DataType.STRING)
  avatar: string

  @AllowNull(true)
  @Column(DataType.UUID)
  cdnAvatarId: string

  @AllowNull(true)
  @Column(DataType.UUID)
  cdnOwnerId: string

  @AllowNull(true)
  @Column(DataType.STRING)
  temporary: string

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

  @AllowNull(true)
  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date

  @AllowNull(true)
  @Column(DataType.UUID)
  deletedBy: string

  @AllowNull(true)
  @DeletedAt
  @Column(DataType.DATE)
  deletedAt: Date

  @BelongsTo(() => User, 'cid')
  user: User

  @BelongsTo(() => Setting, 'cid')
  setting: Setting
}
