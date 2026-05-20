import DateComparator from "./date_comparator";
import { TaskPlan } from "./task_plan";

export class AsapStrategy implements ISchedulingStrategy {
	static Create(gantt: any): AsapStrategy {
		const instance = new AsapStrategy();
		instance._gantt = gantt;
		instance._comparator = new DateComparator(gantt);
		return instance;
	}

	protected _gantt: any;
	protected _comparator: DateComparator;

	resolveRelationDate(
		taskId: TaskID,
		adjacentLinks: ITaskRelations,
		plansHash: IPlansHash
	): TaskPlan {
		let minStart = null;
		let linkId = null;

		let defaultStart = null;
		const task = this._gantt.getTask(taskId);
		const relations = adjacentLinks.predecessors;

		const autoScheduledDates = {};
		let minRelationDate = null;
		for (let i = 0; i < relations.length; i++) {
			const relation = relations[i];

			// .preferredStart still exists only to emulate pre 6.1 auto scheduling behavior
			// will be removed in future versions
			// TODO: remove .preferredStart in v7.0
			defaultStart = relation.preferredStart;

			const constraintDate = this.getEarliestStartDate(
				relation,
				plansHash,
				task
			);

			if (this._comparator.isSmallerOrDefault(minRelationDate, constraintDate, task)) {
				minRelationDate = constraintDate;
			}
			if (
				this._comparator.isSmallerOrDefault(defaultStart, constraintDate, task) &&
				this._comparator.isSmallerOrDefault(minStart, constraintDate, task)
			) {
				minStart = constraintDate;
				linkId = relation.id;
			}
			if (!task.duration){
				const link = this._gantt.getLink(relation.id);
				if (autoScheduledDates[link.type] === undefined){
					autoScheduledDates[link.type] = +constraintDate;
				}
				else if (autoScheduledDates[link.type] < +constraintDate){
					autoScheduledDates[link.type] = +constraintDate;
				};
			}
		}

		if (!relations.length && this._gantt.config.project_start) {
			if (this._comparator.isSmallerOrDefault(task.start_date, this._gantt.config.project_start, task) ||
			// GS-403 - auto_scheduling_strict = true to schedule independent asap tasks to the earliest date, auto_scheduling_strict=false to keep the old behavior
			(this._gantt.config.auto_scheduling_strict && this._comparator.isGreaterOrDefault(task.start_date, this._gantt.config.project_start, task)
			)
			) {
				minStart = this._gantt.config.project_start;
			}
			// GS-1152. don't process tasks with cancelled auto-scheduling
			if (this._gantt.callEvent("onBeforeTaskAutoSchedule", [task, task.start_date]) === false) {
				minStart = task.start_date;
			}
		}

		let maxEnd = null;
		if (minStart) {
			if (task.duration) {
				minStart = this._gantt.getClosestWorkTime({
					date: minStart,
					dir: "future",
					task
				});
				maxEnd = this._gantt.calculateEndDate({
					start_date: minStart,
					duration: task.duration,
					task
				});
			} else {
				// GS-1340 and GS-2508. For FF links, the milestones should start before the weekends
				// When there are multiple links, other types have a higher priority over FF links
				let milestoneWorktimeDirection = "future";
				const linkProps = this._gantt.config.links;
				if (autoScheduledDates[linkProps.finish_to_finish] !== undefined){
					const onlyFFLink = relations.length === 1;
					let noRelevantLinks = true;
					for (const linkType in autoScheduledDates){
						if (linkType != linkProps.finish_to_finish &&
							autoScheduledDates[linkProps.finish_to_finish] < autoScheduledDates[linkType]){
								noRelevantLinks = false;
								break;
						}
					}

					if (onlyFFLink || noRelevantLinks){
						milestoneWorktimeDirection = "past";
					}
				}
				minStart = maxEnd = this._gantt.getClosestWorkTime({ date: minStart, dir: milestoneWorktimeDirection, task });
			}

		}

		const masterPlan = plansHash[taskId];
		const currentPlan = TaskPlan.Create(masterPlan);

		currentPlan.link = linkId;
		currentPlan.task = taskId;
		currentPlan.start_date = minStart;
		currentPlan.end_date = maxEnd;
		currentPlan.kind = "asap";

		if (minRelationDate) {
			currentPlan.earliestSchedulingStart = minRelationDate;
			currentPlan.earliestSchedulingEnd = this._gantt.calculateEndDate({
				start_date: minRelationDate,
				duration: task.duration,
				task
			});
		}

		return currentPlan;
	}

	protected getPredecessorEndDate(id: TaskID, plansHash: IPlansHash): Date {
		const plan = plansHash[id];
		const task = this._gantt.getTask(id);
		let res;

		if (!(plan && (plan.start_date || plan.end_date))) {
			res = task.end_date;
		} else if (plan.end_date) {
			res = plan.end_date;
		} else {
			res = this._gantt.calculateEndDate({
				start_date: plan.start_date,
				duration: task.duration,
				task
			});
		}

		return res;
	}

	protected getEarliestStartDate(relation: IInternalLink, plansHash: IPlansHash, task: ITask): Date {
		const predecessorEnd = this.getPredecessorEndDate(
			relation.source,
			plansHash
		);
		const successor = task;
		const predecessor = this._gantt.getTask(relation.source);
		let successorStart: Date;

		if (
			(predecessorEnd &&
			relation.lag &&
			relation.lag * 1 === relation.lag * 1)
		) {
			// GS-2330. If it is a subtask link and we move projects, we should use the project calendar
			let taskCalendar = successor;
			if (this._gantt.config.auto_scheduling_move_projects && relation.subtaskLink && this._gantt.isTaskExists(relation.targetParent)){
				taskCalendar = this._gantt.getTask(relation.targetParent);
			}

			successorStart = this._gantt.getClosestWorkTime({
				date: predecessorEnd,
				dir: "future",
				task: predecessor
			});

			if(relation.sourceLag){
				successorStart = this._gantt.calculateEndDate({
					start_date: successorStart,
					duration: relation.sourceLag * 1,
					task: predecessor
				});
			}

			if(relation.targetLag){
				successorStart = this._gantt.calculateEndDate({
					start_date: successorStart,
					duration: relation.targetLag * 1,
					task: taskCalendar
				});
			}

			successorStart = this._gantt.calculateEndDate({
				start_date: successorStart,
				duration: relation.trueLag * 1,
				task: taskCalendar
			});

		} else {
			const ffLink = this._gantt.getLink(relation.id).type === this._gantt.config.links.finish_to_finish;

			if (!successor.duration && ffLink) {
				successorStart = this._gantt.getClosestWorkTime({
					date: predecessorEnd,
					dir: "past",
					task: successor
				});
			} else {
				successorStart = this._gantt.getClosestWorkTime({
					date: predecessorEnd,
					dir: "future",
					task: successor
				});
			}

		}

		return successorStart;
	}
}
