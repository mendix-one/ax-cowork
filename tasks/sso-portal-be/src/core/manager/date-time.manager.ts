import { Sequelize } from 'sequelize-typescript'
import { Injectable } from '@nestjs/common'
import { QueryTypes } from 'sequelize'
import { DateRange } from '../interface/date-range.interface'

@Injectable()
export class DateTimeManager {
  constructor(private sequelize: Sequelize) {}

  /**
   * Get current timestamp from database
   *
   * @param timezone
   */
  async currentTimestamp(timezone: string = 'UTC'): Promise<Date> {
    const sqlNowQuery: string = `SELECT CONVERT_TZ(CURRENT_TIMESTAMP, 'UTC', :timezone) AS CURRENT_DATE_TIME`

    const nowQueryResults = await this.sequelize.query(sqlNowQuery, {
      replacements: { timezone },
      type: QueryTypes.SELECT
    })

    return new Date(nowQueryResults[0]['CURRENT_DATE_TIME'])
  }

  /**
   * Get current date time from database
   *
   * @param timezone
   */
  async currentDateTime(timezone: string = 'UTC'): Promise<Date> {
    const sqlNowQuery: string = `SELECT CONVERT_TZ(CURRENT_TIMESTAMP, 'UTC', :timezone) AS CURRENT_DATE_TIME`

    const nowQueryResults = await this.sequelize.query(sqlNowQuery, {
      replacements: { timezone },
      type: QueryTypes.SELECT
    })

    return new Date(nowQueryResults[0]['CURRENT_DATE_TIME'])
  }

  /**
   * Get current date only from database
   *
   * @param timezone
   */
  async currentDateOnly(timezone: string = 'UTC'): Promise<string> {
    const sqlNowQuery: string = `SELECT DATE(CONVERT_TZ(CURRENT_DATE, 'UTC', :timezone)) AS CURRENT_DATE_ONLY`

    const nowQueryResults = await this.sequelize.query(sqlNowQuery, {
      replacements: { timezone },
      type: QueryTypes.SELECT
    })

    return nowQueryResults[0]['CURRENT_DATE_ONLY']
  }

  /**
   * Get next date only from database
   *
   * @param timezone
   * @param nextDays
   */
  async nextDateOnly(timezone: string = 'UTC', nextDays: number): Promise<string> {
    const sqlNowQuery: string = `SELECT DATE(CONVERT_TZ(DATE_ADD(CURRENT_DATE, INTERVAL :nextDays DAY), 'UTC', :timezone)) AS NEXT_DATE_ONLY`

    const nowQueryResults = await this.sequelize.query(sqlNowQuery, {
      replacements: { timezone, nextDays },
      type: QueryTypes.SELECT
    })

    return nowQueryResults[0]['NEXT_DATE_ONLY']
  }

  /**
   * Get date range from database
   *
   * @param timezone
   * @param range
   * @param selectDate
   */
  async dateRange(timezone: string = 'UTC', range: number = 12, selectDate: string = null): Promise<DateRange> {
    const sqlDatesRangeQuery = selectDate
      ? `
      SELECT
        DATE_FORMAT(DATE_SUB(:date, INTERVAL :left MONTH),'%Y-%m-01') AS FROM_DATE,
        DATE(:date) AS SELECT_DATE,
        LAST_DAY(DATE_ADD(:date, INTERVAL :right MONTH)) AS TO_DATE
    `
      : `
      SELECT
          DATE_FORMAT(CONVERT_TZ(DATE_SUB(CURRENT_DATE, INTERVAL :left MONTH), 'UTC', :timezone),'%Y-%m-01') AS FROM_DATE,
          DATE(CONVERT_TZ(CURRENT_DATE, 'UTC', :timezone)) AS SELECT_DATE,
          LAST_DAY(CONVERT_TZ(DATE_ADD(CURRENT_DATE, INTERVAL :right MONTH), 'UTC', :timezone)) AS TO_DATE
    `

    const rangeQueryResults = await this.sequelize.query(sqlDatesRangeQuery, {
      replacements: { timezone, left: range, right: range - 1, date: selectDate },
      type: QueryTypes.SELECT
    })

    return {
      selectDate: rangeQueryResults[0]['SELECT_DATE'],
      fromDate: rangeQueryResults[0]['FROM_DATE'],
      toDate: rangeQueryResults[0]['TO_DATE']
    }
  }
}
