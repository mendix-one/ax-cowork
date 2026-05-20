import { AlapStrategy } from "./alap_strategy";
import { AsapStrategy } from "./asap_strategy";
import { ConstraintTypes } from "./constraint_types";
import { ConstraintsHelper } from "./constraints";
import { TaskPlan } from "./task_plan";

export class AutoSchedulingPlanner {
	private _gantt: any;
	private _constraintsHelper: ConstraintsHelper;
	private _graphHelper: any;
	private _asapStrategy: AsapStrategy;
	private _alapStrategy: AlapStrategy;
	private _secondIterationRequired?: boolean;
	private _secondIteration: boolean = false;

	constructor(
		gantt: any,
		graphHelper: any,
		constraintsHelper: ConstraintsHelper
	) {
		this._gantt = gantt;
		this._constraintsHelper = constraintsHelper;
		this._graphHelper = graphHelper;
		this._asapStrategy = AsapStrategy.Create(gantt);
		this._alapStrategy = AlapStrategy.Create(gantt);
		this._secondIterationRequired = false;
	}

	generatePlan(relations: IInternalLink[], constraints: ITask[]): TaskPlan[] {
		const graphHelper = this._graphHelper;
		const gantt = this._gantt;
		const constraintsHelper = this._constraintsHelper;
		const alapStrategy = this._alapStrategy;
		const asapStrategy = this._asapStrategy;

		const {
			orderedIds,
			reversedIds,
			relationsMap,
			plansHash } = this.buildWorkCollections(relations, constraints, graphHelper);

		let result: TaskPlan[];

		this.processConstraints(orderedIds, plansHash, gantt, constraintsHelper);

		if (gantt.config.schedule_from_end) {
			// when scheduling from end - iterate tasks from end and schedule them as late as possible
			// after that - iterate tasks from start and schedule asap tasks
			result = this.iterateTasks(reversedIds, orderedIds, constraintsHelper.isAlapTask, alapStrategy, asapStrategy, relationsMap, plansHash);
		} else {
			// when scheduling from end - iterate tasks from start and schedule them as soon as possible
			// after that - iterate tasks from end and schedule asap alap
			result = this.iterateTasks(orderedIds, reversedIds, constraintsHelper.isAsapTask, asapStrategy, alapStrategy, relationsMap, plansHash);
		}
		return result;
	}

	applyProjectPlan(projectPlan: TaskPlan[]): ITask[] {
		const gantt = this._gantt;

		let plan: TaskPlan;
		let task: ITask;
		let link: ILink;
		let reason: ITask;

		const updateTasks = [];
		for (let i = 0; i < projectPlan.length; i++) {
			link = null;
			reason = null;
			plan = projectPlan[i];

			if (!gantt.isTaskExists(plan.task)) {
				continue;
			}

			task = gantt.getTask(plan.task);
			if (plan.link) {
				link = gantt.getLink(plan.link);
				if (plan.kind === "asap") {
					reason = this._gantt.getTask(link.source);
				} else {
					// alap tasks are scheduled by their successors
					reason = this._gantt.getTask(link.target);
				}
			}

			let newDate = null;
			if (
				plan.start_date &&
				task.start_date.valueOf() !== plan.start_date.valueOf()
			) {
				newDate = plan.start_date;
			}

			if (!newDate) {
				continue;
			}

			task.start_date = newDate;
			task.end_date = gantt.calculateEndDate(task);

			updateTasks.push(task.id);
			gantt.callEvent("onAfterTaskAutoSchedule", [
				task,
				newDate,
				link,
				reason
			]);
		}
		return updateTasks;
	}

	protected iterateTasks(
		mainSequence: TaskID[],
		secondarySequence: TaskID[],
		isMainSequence: (task: ITask) => boolean,
		mainSequenceStrategy: ISchedulingStrategy,
		secondarySequenceStrategy: ISchedulingStrategy,
		relationsMap: ITaskLinksMap,
		plansHash: IPlansHash

	): TaskPlan[] {
		const gantt = this._gantt;
		const result: TaskPlan[] = [];

		for (let i = 0; i < mainSequence.length; i++) {
			const currentId = mainSequence[i];
			const task = gantt.getTask(currentId);
			if (!gantt._isAutoSchedulable(task)){
				continue;
			}
			const plan = mainSequenceStrategy.resolveRelationDate(
				currentId,
				relationsMap[currentId],
				plansHash
			);
			this.limitPlanDates(task, plan);
			if (isMainSequence(task)) {
				this.processResolvedDate(task, plan, result, plansHash);
			} else {
				plansHash[task.id] = plan;
			}
		}

		for (let i = 0; i < secondarySequence.length; i++) {
			const currentId = secondarySequence[i];
			const task = gantt.getTask(currentId);
			if (!gantt._isAutoSchedulable(task)){
				continue;
			}
			if (!isMainSequence(task)) {
				const plan = secondarySequenceStrategy.resolveRelationDate(
					currentId,
					relationsMap[currentId],
					plansHash
				);
				this.limitPlanDates(task, plan);
				this.processResolvedDate(task, plan, result, plansHash);
			}
		}

		if (this._secondIterationRequired){
			if (this._secondIteration){
				this._secondIteration = false;
			} else {
				this._secondIteration = true;

				// if the duration of the project tasks changed, the lag value is updated
				// so, we need to auto-schedule tasks again with the updated dates
				if (this.summaryLagChanged(gantt, relationsMap, plansHash)){
					return this.iterateTasks(
						mainSequence,
						secondarySequence,
						isMainSequence,
						mainSequenceStrategy,
						secondarySequenceStrategy,
						relationsMap,
						plansHash
					);
				}
			}
		}
		return result;
	}

	protected summaryLagChanged(gantt, relationsMap, plansHash){
		// update projects and relations from plans
		const projectUpdates = {};
		const linksToUpdate = {};

		// get minimal and maximal dates for target and source projects
		for (const taskId in relationsMap){
			relationsMap[taskId].predecessors.forEach((relation)=>{
				if (relation.subtaskLink){
					const link = gantt.getLink(relation.id);
					this.getProjectUpdates(gantt, plansHash, relation, link, "source", projectUpdates, linksToUpdate);
					this.getProjectUpdates(gantt, plansHash, relation, link, "target", projectUpdates, linksToUpdate);
				}
			});
		}

		// update project tasks
		let shouldReschedule = false;

		for (const projectId in projectUpdates){
			const updatedProject = projectUpdates[projectId];
			if (!updatedProject.min || !updatedProject.max){
				continue;
			}
			const task = gantt.getTask(projectId);
			// we cannot rely on the `duration` parameter as it can have a different value for project tasks
			// during the initial scheduling
			const initialDuration = gantt.calculateDuration({start_date: task.start_date, end_date: task.end_date, task});
			// we need to modify the dates and duration of the project tasks as
			// the _formatLink and the functions that follow rely on these parameters
			// it shouldn't impact logic as project tasks ignore the date parameters
			const newDuration = gantt.calculateDuration({start_date: updatedProject.min, end_date: updatedProject.max, task});
			if (newDuration === initialDuration){
				// no need to reschedule
				continue;
			}
			task.start_date = updatedProject.min;
			task.end_date = updatedProject.max;
			task.duration = newDuration;
		}
		
		for (const linkId in linksToUpdate){
			const link = linksToUpdate[linkId];
			let sourceDates, targetDates;

			const updatedSource = projectUpdates[link.source];
			const updatedTarget = projectUpdates[link.target];
			if (updatedSource){
				sourceDates = {
					start_date: updatedSource.start_date,
					end_date: updatedSource.end_date
				};
			}
			if (updatedTarget){
				sourceDates = {
					start_date: updatedTarget.start_date,
					end_date: updatedTarget.end_date
				};
			}

			// get updated formatted link with updated dates
			const updatedRelations = gantt._formatLink(link, sourceDates, targetDates);
			// update relationsMap
			updatedRelations.forEach(function(updatedRelation){
			for (const taskId in relationsMap){
				relationsMap[taskId].predecessors.forEach(function(relation){
						const idMatch = relation.id === updatedRelation.id;
						const targetMatch = relation.target === updatedRelation.target;
						const sourceMatch = relation.source === updatedRelation.source;
						if (idMatch && targetMatch && sourceMatch){
							relation.lag = updatedRelation.lag;
							relation.sourceLag = updatedRelation.sourceLag;
							relation.targetLag = updatedRelation.targetLag;
							relation.hashSum = updatedRelation.hashSum;
						}
					});
				}
			});
			shouldReschedule = true;
		}
		return shouldReschedule;
	}

	protected getProjectUpdates(gantt, plansHash, relation, link, relationProp, projectUpdates, linksToUpdate){
		const task = gantt.getTask(link[relationProp]);
		if (task.type === gantt.config.types.project){
			projectUpdates[link[relationProp]] = projectUpdates[link[relationProp]] || {id: link[relationProp], link};
			const projectForUpdate = projectUpdates[link[relationProp]];
			let childTask = plansHash[relation[relationProp]];
			if (childTask){
				if (relationProp == "source" && (!childTask.start_date || !childTask.end_date)){
					childTask = gantt.getTask(childTask.task);
				}

				projectForUpdate.min = projectForUpdate.min || childTask.start_date;
				if (projectForUpdate.min > childTask.start_date){
					projectForUpdate.min = childTask.start_date;
				}
				projectForUpdate.max = projectForUpdate.max || childTask.end_date;
				if (projectForUpdate.max < childTask.end_date){
					projectForUpdate.max = childTask.end_date;
				}
				linksToUpdate[link.id] = link;
			}
		}
	}

	protected processResolvedDate(
		task: ITask,
		plan: TaskPlan,
		result: TaskPlan[],
		plansHash: any
	): void {
		if (plan.start_date && this._gantt.isLinkExists(plan.link)) {
			let link = null;
			let reason = null;
			if (plan.link) {
				link = this._gantt.getLink(plan.link);
				if (plan.kind === "asap") {
					reason = this._gantt.getTask(link.source);
				} else {
					// alap tasks are scheduled by their successors
					reason = this._gantt.getTask(link.target);
				}
			}

			if (
				task.start_date.valueOf() !== plan.start_date.valueOf() &&
				this._gantt.callEvent("onBeforeTaskAutoSchedule", [
					task,
					plan.start_date,
					link,
					reason
				]) === false
			) {
				return;
			}
		}

		plansHash[task.id] = plan;
		if (plan.start_date) {
			result.push(plan);
		}
	}

	protected limitPlanDates(task: ITask, plan: TaskPlan): TaskPlan {
		const effectiveStart = plan.start_date || task.start_date;

		if (plan.earliestStart) {
			if (effectiveStart < plan.earliestStart) {
				plan.start_date = plan.earliestStart;
				plan.end_date = plan.earliestEnd;
			}
		}

		if (plan.latestStart) {
			if (effectiveStart > plan.latestStart) {
				plan.start_date = plan.latestStart;
				plan.end_date = plan.latestEnd;
			}
		}

		if (plan.latestSchedulingStart && effectiveStart > plan.latestSchedulingStart) {
			plan.start_date = plan.latestSchedulingStart;
			plan.end_date = plan.latestSchedulingEnd;
		}

		if (plan.earliestSchedulingStart && effectiveStart < plan.earliestSchedulingStart) {
			plan.start_date = plan.earliestSchedulingStart;
			plan.end_date = plan.earliestSchedulingEnd;
		}

		if (plan.start_date) { // start/end dates are either both defined or both not
			if (plan.start_date > plan.latestSchedulingStart ||
				plan.start_date < plan.earliestSchedulingStart ||
				plan.start_date > plan.latestStart ||
				plan.start_date < plan.earliestStart ||
				plan.end_date > plan.latestSchedulingEnd ||
				plan.end_date < plan.earliestSchedulingEnd ||
				plan.end_date > plan.latestEnd ||
				plan.end_date < plan.earliestEnd) {

				plan.conflict = true;
			}
		}
		return plan;
	}

	protected buildWorkCollections(relations: IInternalLink[], constraints: ITask[], graphHelper: any) {
		const gantt = this._gantt;
		const orderedIds: TaskID[] = graphHelper.topologicalSort(relations);
		const reversedIds: TaskID[] = orderedIds.slice().reverse();
		const plansHash: IPlansHash = {};

		const relationsMap: ITaskLinksMap = {};
		for (let i = 0, len = orderedIds.length; i < len; i++) {
			const id = orderedIds[i];
			const task = gantt.getTask(id);
			if (!gantt._isAutoSchedulable(task)) {
				continue;
			}
			relationsMap[id] = {
				successors: [],
				predecessors: []
			};

			plansHash[id] = null;
		}

		for (let i = 0, len = constraints.length; i < len; i++) {
			const task = constraints[i];

			if (plansHash[task.id] === undefined) {
				reversedIds.unshift(task.id);
				orderedIds.unshift(task.id);
				plansHash[task.id] = null;
				relationsMap[task.id] = {
					successors: [],
					predecessors: []
				};
			}
		}

		for (let i = 0, len = relations.length; i < len; i++) {
			const rel = relations[i];
			if (relationsMap[rel.source]) {
				relationsMap[rel.source].successors.push(rel);
			}

			if (relationsMap[rel.target]) {
				relationsMap[rel.target].predecessors.push(rel);
			}
		}

		return {
			orderedIds,
			reversedIds,
			relationsMap,
			plansHash
		};
	}

	protected processConstraints(orderedIds: TaskID[], plansHash: IPlansHash, gantt: any, constraintsHelper: ConstraintsHelper) {
		for (let i = 0; i < orderedIds.length; i++) {
			const currentId = orderedIds[i];
			const task = gantt.getTask(currentId);

			const constraintType = constraintsHelper.getConstraintType(task);
			if (
				constraintType &&
				constraintType !== ConstraintTypes.ASAP &&
				constraintType !== ConstraintTypes.ALAP
			) {
				const plan = constraintsHelper.processConstraint(
					task,
					TaskPlan.Create()
				);
				plansHash[task.id] = plan;
			}
		}
	}
}
