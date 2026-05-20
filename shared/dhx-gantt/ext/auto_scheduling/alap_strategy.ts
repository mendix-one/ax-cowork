import DateComparator from "./date_comparator";
import { TaskPlan } from "./task_plan";

export class AlapStrategy implements ISchedulingStrategy {
	static Create(gantt: any): AlapStrategy {
		const instance = new AlapStrategy();
		instance._gantt = gantt;
		instance._comparator = new DateComparator(gantt);
		return instance;
	}

	protected _gantt: any;
	protected _comparator: DateComparator;

	resolveRelationDate(taskId: TaskID, adjacentLinks: ITaskRelations, plansHash: IPlansHash): TaskPlan {
		let maxEnd = null;
		let linkId = null;
		let maxStart = null;
		let defaultStart = null;
		const task = this._gantt.getTask(taskId);
		const relations = adjacentLinks.successors;
		let maxRelationDate = null;
		const masterPlan = plansHash[taskId];
		for (let i = 0; i < relations.length; i++) {
			const relation = relations[i];

			// .preferredStart still exists only to emulate pre 6.1 auto scheduling behavior
			// will be removed in future versions
			// TODO: remove .preferredStart in v7.0
			defaultStart = relation.preferredStart;
			const constraintDate = this.getLatestEndDate(relation, plansHash, task);
			const constraintStartDate = this._gantt.calculateEndDate({ start_date: constraintDate, duration: - task.duration, task });

			if (this._comparator.isGreaterOrDefault(maxRelationDate, constraintDate, task)) {
				maxRelationDate = constraintDate;
			}
			if (this._comparator.isGreaterOrDefault(defaultStart, constraintStartDate, task) && this._comparator.isGreaterOrDefault(maxEnd, constraintDate, task)) {
				maxEnd = constraintDate;
				maxStart = constraintStartDate;
				linkId = relation.id;
			}
		}

		if (!relations.length && this._gantt.config.project_end) {
			if (this._comparator.isGreaterOrDefault(this._gantt.config.project_end, task.end_date, task)) {
				maxEnd = this._gantt.config.project_end;
			}
			// GS-1152. don't process tasks with cancelled auto-scheduling
			if (this._gantt.callEvent("onBeforeTaskAutoSchedule", [task, task.end_date]) === false) {
				maxEnd = task.end_date;
			}
		}

		if (maxEnd) {
			// GS-1556. Tasks with zero duration shouldn't violate the project_end date
			if (task.duration){
				maxEnd = this._gantt.getClosestWorkTime({ date: maxEnd, dir: "future", task });
				maxStart = this._gantt.calculateEndDate({ start_date: maxEnd, duration: - task.duration, task });
			} else {
				maxStart = maxEnd = this._gantt.getClosestWorkTime({ date: maxEnd, dir: "past", task });
			}
		}

		const currentPlan = TaskPlan.Create(masterPlan);

		currentPlan.link = linkId;
		currentPlan.task = taskId;
		currentPlan.end_date = maxEnd;
		currentPlan.start_date = maxStart;
		currentPlan.kind = "alap";

		if (maxRelationDate) {
			currentPlan.latestSchedulingStart = this._gantt.calculateEndDate({ start_date: maxRelationDate, duration: - task.duration, task });
			currentPlan.latestSchedulingEnd = maxRelationDate;
		}

		return currentPlan;

	}

	protected getSuccessorStartDate(id: TaskID, plansHash: IPlansHash): Date {
		const plan = plansHash[id];
		const task = this._gantt.getTask(id);
		let res;

		if (!(plan && (plan.start_date || plan.end_date))) {
			res = task.start_date;
		} else if (plan.start_date) {
			res = plan.start_date;
		} else {
			res = this._gantt.calculateEndDate({ start_date: plan.end_date, duration: - task.duration, task });
		}

		return res;
	}

	protected getLatestEndDate(relation: IInternalLink, plansHash: IPlansHash, task: ITask) {
		const successorStart = this.getSuccessorStartDate(relation.target, plansHash);
		const predecessor = task;

		let predecessorEnd = this._gantt.getClosestWorkTime({ date: successorStart, dir: "past", task: predecessor });

		if (predecessorEnd && relation.lag && relation.lag * 1 === relation.lag * 1) {
			predecessorEnd = this._gantt.calculateEndDate({ start_date: predecessorEnd, duration: -relation.lag * 1, task: predecessor });
		}

		return predecessorEnd;
	}
}