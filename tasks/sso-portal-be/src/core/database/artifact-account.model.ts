import { AllowNull, BelongsTo, Column, DataType, Default, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { Account } from './account.model'
import { Artifact } from './artifact.model'

@Table({
  tableName: 'sso_artifact_account',
  underscored: true,
  timestamps: false,
  createdAt: false,
  updatedAt: false,
  deletedAt: false,
  paranoid: false
})
export class ArtifactAccount extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  aid: string

  @PrimaryKey
  @Column(DataType.UUID)
  cid: string

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  ownership: boolean

  @AllowNull(false)
  @Default(999999999)
  @Column(DataType.INTEGER)
  level: number

  @BelongsTo(() => Artifact, 'aid')
  artifact: Artifact

  @BelongsTo(() => Account, 'cid')
  account: Account
}
