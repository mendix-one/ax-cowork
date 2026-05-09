import { Op } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { TransactionManager } from './transaction.manager'
import { Generator } from '../util/generator'
import { Job } from '../database/job.model'

@Injectable()
export class JobManager {
  constructor(
    @InjectModel(Job) private jobModel: typeof Job,
    private sequelize: Sequelize,
    private generator: Generator,
    private eventEmitter: EventEmitter2,
    private transactionManager: TransactionManager
  ) {}

  /**
   * Scan job by name
   * @param name
   */
  async scan(name: string) {
    return await this.jobModel.findAll({
      where: {
        name
      },
      order: [['createdAt', 'ASC']],
      raw: true,
      nest: true
    })
  }

  /**
   * Pull must process jobs
   *
   * @param max
   */
  async pull(max = 5): Promise<Job[]> {
    return await this.jobModel.findAll({
      where: {
        status: {
          [Op.in]: ['READY', 'FAILED']
        },
        createdAt: {
          [Op.lte]: this.sequelize.literal('NOW() - INTERVAL 1 MINUTE')
        },
        attempt: {
          [Op.lte]: 5 // Max 5 times
        }
      },
      order: [['createdAt', 'ASC']],
      limit: max,
      raw: true,
      nest: true
    })
  }

  /**
   * Retry processing job
   *
   * @param job
   */
  async retry(job: Job) {
    this.eventEmitter.emit(job.name, { id: job.id, name: job.name, status: job.status, attempt: job.attempt })
  }

  /**
   * Create new job & start processing it
   *
   * @param name
   * @param payload
   */
  async create(name: string, payload: any) {
    const transaction = await this.transactionManager.open()
    try {
      const insertData = {
        id: this.generator.uuid(),
        name,
        status: 'READY',
        attempt: 0,
        payload
      }

      const job = await this.jobModel.create(insertData, { transaction })
      await this.transactionManager.commit(transaction)

      this.eventEmitter.emit(job.name, { id: job.id, name: job.name, status: job.status, attempt: job.attempt })

      return job
    } catch (e) {
      await this.transactionManager.rollback(transaction)
      throw e
    }
  }

  /**
   * Start processing a job
   *
   * @param id
   */
  async start(id: string) {
    const transaction = await this.transactionManager.open()
    let updated = null
    try {
      updated = await this.jobModel.update(
        {
          status: 'PROCESSING',
          attempt: this.sequelize.literal('attempt + 1'),
          startedAt: this.sequelize.literal('NOW()')
        },
        {
          where: {
            id,
            status: ['READY', 'FAILED']
          },
          transaction
        }
      )

      await this.transactionManager.commit(transaction)
    } catch (e) {
      await this.transactionManager.rollback(transaction)
      throw e
    }

    if (updated[0] > 0) {
      return await this.jobModel.findOne({ where: { id } })
    } else {
      return
    }
  }

  /**
   * Complete processing a job
   *
   * @param id
   */
  async complete(id: string) {
    const transaction = await this.transactionManager.open()
    try {
      const updated = await this.jobModel.update(
        {
          status: 'COMPLETED',
          error: null,
          finishedAt: this.sequelize.literal('NOW()')
        },
        {
          where: {
            id,
            status: 'PROCESSING'
          },
          transaction
        }
      )

      await this.transactionManager.commit(transaction)
      return updated[0] > 0
    } catch (e) {
      await this.transactionManager.rollback(transaction)
      throw e
    }
  }

  /**
   * Failed processing a job
   *
   * @param id
   * @param error
   */
  async failed(id: string, error: string) {
    const transaction = await this.transactionManager.open()
    try {
      const updated = await this.jobModel.update(
        {
          status: 'FAILED',
          error: error,
          finishedAt: this.sequelize.literal('NOW()')
        },
        {
          where: {
            id,
            status: 'PROCESSING'
          },
          transaction
        }
      )

      await this.transactionManager.commit(transaction)
      return updated[0] > 0
    } catch (e) {
      await this.transactionManager.rollback(transaction)
      throw e
    }
  }
}
