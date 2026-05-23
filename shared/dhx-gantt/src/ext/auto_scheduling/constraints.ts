import * as helpers from '../../utils/helpers'
import { ConstraintTypes } from './constraint_types'
import { TaskPlan } from './task_plan'

export class ConstraintsHelper {
  static Create(gantt: any): ConstraintsHelper {
    return new ConstraintsHelper(gantt)
  }

  private _gantt: any
  private constructor(gantt: any) {
    this._gantt = gantt
  }

  isAsapTask = (task: ITask): boolean => {
    const constraintType = this.getConstraintType(task)
    if (this._gantt.config.schedule_from_end) {
      if (constraintType === ConstraintTypes.ASAP) {
        return true
      } else {
        return false
      }
    } else {
      if (constraintType === ConstraintTypes.ALAP) {
        return false
      } else {
        return true
      }
    }
  }

  isAlapTask = (task: ITask): boolean => {
    return !this.isAsapTask(task)
  }

  getConstraintType = (task: ITask): ConstraintTypes => {
    // GS-1487. Don't add a constraint if auto-scheduling is cancelled
    if (!this._gantt._isAutoSchedulable(task)) {
      return
    }

    const constraint = this._getTaskConstraint(task)

    // in case of backward scheduling, tasks without explicit constraints are considered ALAP tasks
    if (constraint.constraint_type) {
      return constraint.constraint_type
    } else if (this._gantt.config.schedule_from_end) {
      return ConstraintTypes.ALAP
    } else {
      return ConstraintTypes.ASAP
    }
  }

  _getTaskConstraint = (task: ITask) => {
    let constraint = this._getOwnConstraint(task)

    // GS-2231. Child task shouldn't inherit constraints in the group mode
    if (this._gantt.config.auto_scheduling_project_constraint && !this._gantt.getState().group_mode) {
      let defaultConstraintType = ConstraintTypes.ASAP
      if (this._gantt.config.schedule_from_end) {
        defaultConstraintType = ConstraintTypes.ALAP
      }

      if ((constraint && constraint.constraint_type) === defaultConstraintType || !constraint) {
        constraint = this._getParentConstraint(task)
      }
    }

    return constraint
  }

  _getOwnConstraint = (task: ITask) => {
    return {
      constraint_type: task.constraint_type,
      constraint_date: task.constraint_date,
    }
  }

  _getParentConstraint = (task: ITask) => {
    let defaultConstraintType = ConstraintTypes.ASAP
    if (this._gantt.config.schedule_from_end) {
      defaultConstraintType = ConstraintTypes.ALAP
    }

    let constraint = {
      constraint_type: defaultConstraintType,
      constraint_date: null,
    }

    this._gantt.eachParent((parent) => {
      if (constraint.constraint_type !== defaultConstraintType) {
        return
      }
      if (parent.constraint_type && parent.constraint_type !== defaultConstraintType) {
        constraint = {
          constraint_type: parent.constraint_type,
          constraint_date: parent.constraint_date,
        }
      }
    }, task.id)
    return constraint
  }

  hasConstraint = (task: ITask): boolean => {
    return !!this.getConstraintType(task)
  }

  processConstraint = (task: ITask, plan: TaskPlan): TaskPlan => {
    const constraint = this._getTaskConstraint(task)

    if (constraint) {
      if (constraint.constraint_type === ConstraintTypes.ALAP || constraint.constraint_type === ConstraintTypes.ASAP) {
        // this kind of constraint is calculated after main scheduling
      } else if (helpers.isValidDate(constraint.constraint_date)) {
        const constraintDate = constraint.constraint_date

        const newPlan = TaskPlan.Create(plan)
        newPlan.task = task.id

        switch (constraint.constraint_type) {
          case ConstraintTypes.SNET:
            newPlan.earliestStart = new Date(constraintDate)
            newPlan.earliestEnd = this._gantt.calculateEndDate({
              start_date: newPlan.earliestStart,
              duration: task.duration,
              task,
            })
            newPlan.link = null
            break
          case ConstraintTypes.SNLT:
            newPlan.latestStart = new Date(constraintDate)
            newPlan.latestEnd = this._gantt.calculateEndDate({
              start_date: newPlan.latestStart,
              duration: task.duration,
              task,
            })
            newPlan.link = null
            break
          case ConstraintTypes.FNET:
            newPlan.earliestStart = this._gantt.calculateEndDate({
              start_date: constraintDate,
              duration: -task.duration,
              task,
            })
            newPlan.earliestEnd = new Date(constraintDate)
            newPlan.link = null
            break
          case ConstraintTypes.FNLT:
            newPlan.latestStart = this._gantt.calculateEndDate({
              start_date: constraintDate,
              duration: -task.duration,
              task,
            })
            newPlan.latestEnd = new Date(constraintDate)
            newPlan.link = null
            break
          case ConstraintTypes.MSO:
            newPlan.earliestStart = new Date(constraintDate)
            newPlan.earliestEnd = this._gantt.calculateEndDate({
              start_date: newPlan.earliestStart,
              duration: task.duration,
              task,
            })
            newPlan.latestStart = newPlan.earliestStart
            newPlan.latestEnd = newPlan.earliestEnd
            newPlan.link = null
            break
          case ConstraintTypes.MFO:
            newPlan.earliestStart = this._gantt.calculateEndDate({
              start_date: constraintDate,
              duration: -task.duration,
              task,
            })
            newPlan.earliestEnd = this._gantt.calculateEndDate({
              start_date: newPlan.earliestStart,
              duration: task.duration,
              task,
            })
            newPlan.latestStart = newPlan.earliestStart
            newPlan.latestEnd = newPlan.earliestEnd
            newPlan.link = null
            break
        }

        return newPlan
      }
    }

    return plan
  }

  getConstraints = (id: TaskID, relations: IInternalLink[]): ITask[] => {
    const result = []
    const tasks = {}

    const store = (task: any) => {
      if (tasks[task.id]) {
        return
      }

      if (this.hasConstraint(task) && !this._gantt.isSummaryTask(task)) {
        tasks[task.id] = task
      }
    }

    if (this._gantt.isTaskExists(id)) {
      const task = this._gantt.getTask(id)
      store(task)
    }

    this._gantt.eachTask((task) => store(task), id)

    let current
    if (relations) {
      for (let i = 0; i < relations.length; i++) {
        const rel = relations[i]
        if (!tasks[rel.target]) {
          current = this._gantt.getTask(rel.target)
          store(current)
        }
        if (!tasks[rel.source]) {
          current = this._gantt.getTask(rel.source)
          store(current)
        }
      }
    }

    for (const taskId in tasks) {
      // GS-745 do not auto-schedule placeholders
      if (tasks[taskId].type !== this._gantt.config.types.placeholder) {
        result.push(tasks[taskId])
      }
    }

    return result
  }
}
