import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript'
import { Account } from './account.model'
import { Session } from './session.model'

@Table({
  tableName: 'sso_session_history',
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
export class SessionHistory extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  id: string

  @AllowNull(false)
  @Default('ISSUE')
  @Column(DataType.ENUM('ISSUE', 'SIGNIN', 'SIGNOUT', 'DESTROY'))
  action: string

  @AllowNull(true)
  @Column(DataType.DATE)
  issuedAt: Date

  @AllowNull(false)
  @Column(DataType.UUID)
  sid: string

  @AllowNull(true)
  @Column(DataType.UUID)
  cid: string

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

  @BelongsTo(() => Session, 'sid')
  session: Session

  @BelongsTo(() => Account, 'cid')
  account: Account
}
