import * as fs from 'fs'
import { InjectModel } from '@nestjs/sequelize'
import { Injectable, Logger } from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'
import { PartitionManager } from '../../core/manager/partition.manager'
import { TransactionManager } from '../../core/manager/transaction.manager'
import { Country } from '../../core/database/country.model'
import { Region } from '../../core/database/region.model'
import { District } from '../../core/database/district.model'
import { Ward } from '../../core/database/ward.model'
import { Language } from '../../core/database/language.model'
import { Display } from '../../core/database/display.model'
import { Timezone } from '../../core/database/timezone.model'
import { Currency } from '../../core/database/currency.model'
import { User } from '../../core/database/user.model'
import { Setting } from '../../core/database/setting.model'
import { Account } from '../../core/database/account.model'
import { Artifact } from '../../core/database/artifact.model'
import { Client } from '../../core/database/client.model'
import { Role } from '../../core/database/role.model'
import { AccountRole } from '../../core/database/account-role.model'
import { ArtifactAccount } from '../../core/database/artifact-account.model'

@Injectable()
export class InitialWorkerService {
  constructor(
    private sequelize: Sequelize,
    private partitionManager: PartitionManager,
    private transactionManager: TransactionManager,
    @InjectModel(Country) private countryModel: typeof Country,
    @InjectModel(Region) private regionModel: typeof Region,
    @InjectModel(District) private districtModel: typeof District,
    @InjectModel(Ward) private wardModel: typeof Ward,
    @InjectModel(Language) private languageModel: typeof Language,
    @InjectModel(Display) private displayModel: typeof Display,
    @InjectModel(Timezone) private timezoneModel: typeof Timezone,
    @InjectModel(Currency) private currencyModel: typeof Currency,
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Setting) private settingModel: typeof Setting,
    @InjectModel(Account) private accountModel: typeof Account,
    @InjectModel(Artifact) private artifactModel: typeof Artifact,
    @InjectModel(Client) private clientModel: typeof Client,
    @InjectModel(Role) private roleModel: typeof Role,
    @InjectModel(AccountRole) private accountRoleModel: typeof AccountRole,
    @InjectModel(ArtifactAccount) private artifactAccountModel: typeof ArtifactAccount
  ) {}

  async handle() {
    let transaction = null
    try {
      transaction = await this.transactionManager.open()

      await this.partitionManager.reorganize(1)

      const countries = fs.readFileSync('./data/countries.json', { encoding: 'utf-8' })
      const regions = fs.readFileSync('./data/regions.json', { encoding: 'utf-8' })
      const districts = fs.readFileSync('./data/districts.json', { encoding: 'utf-8' })
      const wards = fs.readFileSync('./data/wards.json', { encoding: 'utf-8' })
      const languages = fs.readFileSync('./data/languages.json', { encoding: 'utf-8' })
      const display = fs.readFileSync('./data/display.json', { encoding: 'utf-8' })
      const timezones = fs.readFileSync('./data/timezones.json', { encoding: 'utf-8' })
      const currencies = fs.readFileSync('./data/currencies.json', { encoding: 'utf-8' })

      await this.countryModel.bulkCreate(JSON.parse(countries))
      await this.regionModel.bulkCreate(JSON.parse(regions))
      await this.districtModel.bulkCreate(JSON.parse(districts))
      await this.wardModel.bulkCreate(JSON.parse(wards))
      await this.languageModel.bulkCreate(JSON.parse(languages))
      await this.displayModel.bulkCreate(JSON.parse(display))
      await this.timezoneModel.bulkCreate(JSON.parse(timezones))
      await this.currencyModel.bulkCreate(JSON.parse(currencies))

      const data = JSON.parse(fs.readFileSync('./data/default.json', { encoding: 'utf-8' }))

      await this.userModel.bulkCreate(data['account'].map(x => x.user))
      await this.settingModel.bulkCreate(data['account'].map(x => x.setting))
      await this.accountModel.bulkCreate(data['account'])
      await this.artifactModel.bulkCreate(data['artifact'])
      await this.clientModel.bulkCreate(data['client'])
      await this.roleModel.bulkCreate(data['role'])

      await this.accountRoleModel.bulkCreate(data['accountRole'])
      await this.artifactAccountModel.bulkCreate(data['artifactAccount'])

      const sql =
        'UPDATE `sso_artifact_account` membership ' +
        'SET ' +
        'membership.`level` = (' +
        '    SELECT  ' +
        '        COALESCE(MIN(role.`level`),999999999) ' +
        '    FROM  ' +
        '        `sso_account_role` account_role ' +
        '          INNER JOIN `sso_role` role ' +
        '            ON account_role.`key` = role.`key` ' +
        '            AND  role.aid = membership.aid  ' +
        '            AND  role.uid IS NULL ' +
        '    WHERE  ' +
        '        account_role.cid = membership.cid ' +
        ')'
      await this.sequelize.query(sql, { transaction })

      await this.transactionManager.commit(transaction)
    } catch (e) {
      await this.transactionManager.rollback(transaction)
      Logger.error(e)
      throw e
    }
  }
}
