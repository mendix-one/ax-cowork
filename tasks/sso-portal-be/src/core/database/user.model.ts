import {
  Model,
  Table,
  Column,
  PrimaryKey,
  CreatedAt,
  DeletedAt,
  UpdatedAt,
  DataType,
  AllowNull
} from 'sequelize-typescript'

@Table({
  tableName: 'sso_user',
  underscored: true,
  timestamps: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'deletedBy', 'deletedAt']
    }
  }
})
export class User extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  cid: string

  @AllowNull(true)
  @Column(DataType.STRING)
  fullName: string

  @AllowNull(true)
  @Column(DataType.DATEONLY)
  dateOfBirth: string

  @AllowNull(true)
  @Column(DataType.ENUM('MALE', 'FEMALE', 'UNKNOWN'))
  gender: string

  @AllowNull(true)
  @Column(DataType.STRING)
  email: string

  @AllowNull(true)
  @Column(DataType.STRING)
  phoneNumber: string

  @AllowNull(true)
  @Column(DataType.STRING)
  facebook: string

  @AllowNull(true)
  @Column(DataType.STRING(2))
  countryCode: string

  @AllowNull(true)
  @Column(DataType.STRING)
  countryName: string

  @AllowNull(true)
  @Column(DataType.STRING(2))
  regionCode: string

  @AllowNull(true)
  @Column(DataType.STRING)
  regionName: string

  @AllowNull(true)
  @Column(DataType.STRING(3))
  districtCode: string

  @AllowNull(true)
  @Column(DataType.STRING)
  districtName: string

  @AllowNull(true)
  @Column(DataType.STRING(5))
  wardCode: string

  @AllowNull(true)
  @Column(DataType.STRING)
  wardName: string

  @AllowNull(true)
  @Column(DataType.TEXT)
  address: string

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
