/**
 * common type definitions for auto scheduling extension
 */

interface ITaskPlan {
  link: string | number
  task: string | number
  // tslint:disable-next-line variable-name
  start_date: Date | null
  // tslint:disable-next-line variable-name
  end_date: Date | null

  latestStart: Date
  earliestStart: Date
  earliestEnd: Date
  latestEnd: Date

  latestSchedulingStart: Date
  earliestSchedulingStart: Date
  latestSchedulingEnd: Date
  earliestSchedulingEnd: Date

  kind: string
  conflict: boolean
}

interface IPlansHash {
  [taskId: string]: ITaskPlan
}

interface ITaskRelations {
  predecessors: IInternalLink[]
  successors: IInternalLink[]
}

interface ITaskLinksMap {
  [taskId: string]: ITaskRelations
}

interface ISchedulingStrategy {
  resolveRelationDate(taskId: TaskID, adjacentLinks: ITaskRelations, plansHash: IPlansHash): ITaskPlan
}
