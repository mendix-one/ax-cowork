import { Injectable, Logger } from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'

@Injectable()
export class PartitionManager {
  private readonly logger = new Logger(PartitionManager.name)

  private partitionTables = []

  constructor(private sequelize: Sequelize) {}

  async partition(table: string, idx: number): Promise<boolean> {
    try {
      const command = `ALTER TABLE ${table} REORGANIZE PARTITION p_0 INTO (PARTITION p_${idx} VALUES IN (${idx}), PARTITION p_0 VALUES IN (0));`
      await this.sequelize.query(command)
      return true
    } catch (e) {
      if (e.name === 'SequelizeDatabaseError' && e.parent?.code === 'ER_SAME_NAME_PARTITION') {
        return true
      } else if (e.name === 'SequelizeDatabaseError' && e.parent?.code === 'ER_PARTITION_MGMT_ON_NONPARTITIONED') {
        const partitions = ['PARTITION p_0 VALUES IN (0)']

        for (let i = 1; i <= idx; i++) {
          partitions.push(`PARTITION p_${i} VALUES IN (${i})`)
        }

        const command = `ALTER TABLE ${table} PARTITION BY LIST (idx) (${partitions.join(',')});`
        await this.sequelize.query(command)
        return true
      } else {
        this.logger.error(e)
        throw e
      }
    }
  }

  async reorganize(idx: number) {
    const tasks = []
    for (const table of this.partitionTables) {
      this.logger.log(`Reorganize partition of table ${table} with new value ${idx}`)
      tasks.push(this.partition(table, idx))
    }
    const results = await Promise.allSettled(tasks)
    const failedTasks = []

    for (let i = 0; i < results.length; i++) {
      if (results[i].status === 'rejected') {
        failedTasks.push(this.partitionTables[i])
      }
    }

    if (failedTasks.length > 0) {
      throw new Error(`Failed to reorganize partition for tables: ${failedTasks.join(',')}`)
    }
  }
}
