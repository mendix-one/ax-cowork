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
  Default
} from 'sequelize-typescript'

@Table({
  tableName: 'sso_setting',
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
export class Setting extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  cid: string

  @AllowNull(true)
  @Default('vi')
  @Column(DataType.STRING(2))
  lang: string

  @AllowNull(true)
  @Default('Tiếng Việt (Vietnamese)')
  @Column(DataType.STRING)
  language: string

  @AllowNull(true)
  @Default('Asia/Ho_Chi_Minh')
  @Column(DataType.STRING)
  timezone: string

  @AllowNull(true)
  @Default('VND')
  @Column(DataType.STRING(3))
  currency: string

  @AllowNull(true)
  @Default('Việt Nam Đồng')
  @Column(DataType.STRING)
  currencyName: string

  @AllowNull(true)
  @Default('đ')
  @Column(DataType.STRING)
  currencySymbol: string

  @AllowNull(true)
  @Default(0)
  @Column(DataType.INTEGER)
  currencyDecimal: number

  @AllowNull(true)
  @Default(0)
  @Column(DataType.FLOAT(3, 2))
  currencyRounding: number

  @AllowNull(true)
  @Default('NUMBER_TYPE_01')
  @Column(DataType.STRING)
  numberType: string

  @AllowNull(true)
  @Column(DataType.STRING)
  numberFormat: string

  @AllowNull(true)
  @Default('3.456.789,12')
  @Column(DataType.STRING)
  numberSample: string

  @AllowNull(true)
  @Default('CURRENCY_TYPE_01')
  @Column(DataType.STRING)
  currencyType: string

  @AllowNull(true)
  @Column(DataType.STRING)
  currencyFormat: string

  @AllowNull(true)
  @Default('3.456.789đ')
  @Column(DataType.STRING)
  currencySample: string

  @AllowNull(true)
  @Default('ACCOUNTING_TYPE_01')
  @Column(DataType.STRING)
  accountingType: string

  @AllowNull(true)
  @Column(DataType.STRING)
  accountingFormat: string

  @AllowNull(true)
  @Default('đ 3.456.789')
  @Column(DataType.STRING)
  accountingSample: string

  @AllowNull(true)
  @Default('DATE_ONLY_TYPE_01')
  @Column(DataType.STRING)
  dateOnlyType: string

  @AllowNull(true)
  @Default('DD-MM-YYYY')
  @Column(DataType.STRING)
  dateOnlyFormat: string

  @AllowNull(true)
  @Default('20-08-1990')
  @Column(DataType.STRING)
  dateOnlySample: string

  @AllowNull(true)
  @Default('DATE_TIME_TYPE_01')
  @Column(DataType.STRING)
  dateTimeType: string

  @AllowNull(true)
  @Default('HH:MM:SS DD-MM-YYYY')
  @Column(DataType.STRING)
  dateTimeFormat: string

  @AllowNull(true)
  @Default('21:12:21 20-08-1990')
  @Column(DataType.STRING)
  dateTimeSample: string

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
