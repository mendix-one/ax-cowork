import { ConnectedGroupsHelper } from "./connected_groups";

export function attachUIHandlers(
	gantt: any,
	linksBuilder: any,
	loopsFinder: any,
	connectedGroupsHelper: ConnectedGroupsHelper
) {
	const _attachAutoSchedulingHandlers = function() {
		let _scheduleAfterBatchUpdate = false;
		gantt.attachEvent("onAfterBatchUpdate", function(){

			if(_scheduleAfterBatchUpdate){
				gantt.autoSchedule();
			}
			_scheduleAfterBatchUpdate = false;
		});

		function _autoScheduleAfterLinkChange(id: LinkID, link: ILink) {
			if (gantt.config.auto_scheduling && !gantt._autoscheduling_in_progress) {
				if(gantt.getState().batch_update){
					_scheduleAfterBatchUpdate = true;
				}else{
					gantt.autoSchedule(link.source);
				}
			}
		}

		gantt.attachEvent("onAfterLinkUpdate", _autoScheduleAfterLinkChange);
		gantt.attachEvent("onAfterLinkAdd", _autoScheduleAfterLinkChange);

		gantt.attachEvent("onAfterLinkDelete", function(id: LinkID, link: ILink) {
			if (
				gantt.config.auto_scheduling &&
				!gantt._autoscheduling_in_progress &&
				gantt.isTaskExists(link.target)
			) {
				// after link deleted - auto schedule target for other relations that may be left
				const target = gantt.getTask(link.target);
				const predecessors = gantt._getPredecessors(target);
				if (predecessors.length) {
					if(gantt.getState().batch_update){
						_scheduleAfterBatchUpdate = true;
					}else{
						gantt.autoSchedule(predecessors[0].source, false);
					}
				}
			}
		});

		gantt.attachEvent("onParse", function() {
			if (
				gantt.config.auto_scheduling &&
				gantt.config.auto_scheduling_initial
			) {
				gantt.autoSchedule();
			}
		});

		function _preventCircularLink(id: LinkID, link: ILink): boolean {
			const slackConfigValue = gantt.config.auto_scheduling_use_progress;
			gantt.config.auto_scheduling_use_progress = false;

			if (gantt.isCircularLink(link)) {
				gantt.callEvent("onCircularLinkError", [
					link,
					loopsFinder.getLoopContainingLink(link)
				]);
				gantt.config.auto_scheduling_use_progress = slackConfigValue;
				return false;
			} else {
				gantt.config.auto_scheduling_use_progress = slackConfigValue;
				return true;
			}
		}

		function _preventDescendantLink(id: LinkID, link: ILink): boolean {
			const source = gantt.getTask(link.source);
			const target = gantt.getTask(link.target);

			if (!gantt.config.auto_scheduling_descendant_links) {
				if (
					(gantt.isChildOf(source.id, target.id) &&
						gantt.isSummaryTask(target)) ||
					(gantt.isChildOf(target.id, source.id) && gantt.isSummaryTask(source))
				) {
					return false;
				}
			}
			return true;
		}

		gantt.attachEvent("onBeforeLinkAdd", _preventCircularLink);
		gantt.attachEvent("onBeforeLinkAdd", _preventDescendantLink);
		gantt.attachEvent("onBeforeLinkUpdate", _preventCircularLink);
		gantt.attachEvent("onBeforeLinkUpdate", _preventDescendantLink);

		function _datesNotEqual(
			dateA: Date,
			dateB: Date,
			taskA: ITask,
			taskB: ITask
		): boolean {
			if (!!dateA !== !!dateB) {
				// if one of dates is empty or null and the other is not
				return true;
			}

			if (!dateA && !dateB) {
				return false;
			}

			if (dateA.valueOf() > dateB.valueOf()) {
				return gantt._hasDuration({
					start_date: dateB,
					end_date: dateA,
					task: taskB
				});
			} else {
				return gantt._hasDuration({
					start_date: dateA,
					end_date: dateB,
					task: taskA
				});
			}
		}
		function _notEqualTaskDates(task1: ITask, task2: ITask): boolean {
			if (_datesNotEqual(task1.start_date, task2.start_date, task1, task2)) {
				return true;
			}

			if (gantt.getConstraintType(task1) !== gantt.getConstraintType(task2)) {
				return true;
			}

			if (
				_datesNotEqual(
					task1.constraint_date,
					task2.constraint_date,
					task1,
					task2
				)
			) {
				return true;
			}

			if (
				_datesNotEqual(task1.start_date, task2.start_date, task1, task2) ||
				((_datesNotEqual(task1.end_date, task2.end_date, task1, task2) ||
					task1.duration !== task2.duration) &&
					task1.type !== gantt.config.types.milestone)
			) {
				return true;
			}
		}

		function getRelations(id: TaskID) {
			// collect relations before drag and drop  in order to have original positions of subtasks within project since they are used as lag when moving dependent project

			// TODO: remove in 7.0
			if (gantt.config.auto_scheduling_compatibility) {
				// collect only downstream dependencies since there is no backward or ALAP scheduling in pre 6.1 auto scheduling
				return linksBuilder.getLinkedTasks(id, true);
			} else {
				// get all connected group (both upstream and downstream dependencies)
				return connectedGroupsHelper.getConnectedGroupRelations(id);
			}
		}

		let relations;
		let movedTask;
		gantt.attachEvent("onBeforeTaskDrag", function(
			id: TaskID,
			mode: string,
			task: ITask
		) {
			if (
				gantt.config.auto_scheduling
				// We need to get the movedTask so that we can use it later internally
				// && gantt.config.auto_scheduling_move_projects
			) {
				// collect relations before drag and drop  in order to have original positions of subtasks within project since they are used as lag when moving dependent project
				if(gantt.getState().drag_mode !== "progress"){
					relations = getRelations(id);
				}

				movedTask = id;
			}
			return true;
		});

		function resetToStartLinksLags(taskId, relationsArray) {
			// task duration is used as lag when converting start_to_start and start_to_finish into finish_to_start links
			// recalculate these links if task duration has changed

			let skipped = false;
			for (let i = 0; i < relations.length; i++) {
				const originalLink = gantt.getLink(relationsArray[i].id);
				if (
					originalLink &&
					(originalLink.type === gantt.config.links.start_to_start ||
						originalLink.type === gantt.config.links.start_to_finish)
				) {
					relationsArray.splice(i, 1);
					i--;
					skipped = true;
				}
			}

			if (skipped) {
				const presentLinks = {};
				for (let i = 0; i < relationsArray.length; i++) {
					presentLinks[relationsArray[i].id] = true;
				}

				const updatedLinks = getRelations(taskId);

				for (let i = 0; i < updatedLinks.length; i++) {
					if (!presentLinks[updatedLinks[i].id]) {
						relationsArray.push(updatedLinks[i]);
					}
				}
			}
		}

		// GS-686. We shouldn't change the constraint after changing only the duration or end_date
		function shouldKeepConstraints(task, oldTask){
			if (gantt.config.schedule_from_end) {
				if (oldTask.end_date && task.end_date && task.end_date.valueOf() === oldTask.end_date.valueOf()){
					return true;
				}
			} else {
				if (oldTask.start_date && task.start_date && task.start_date.valueOf() === oldTask.start_date.valueOf()){
					return true;
				}
			}
		}

		function updateTaskConstraints(task){
			// GS-1487. Don't add a constraint if auto-scheduling is cancelled
			if (task.auto_scheduling === false){
				return;
			}

			// GS-2452. We should keep the constraints type if it doesn't affect the task dates
			const constraintTypes = gantt.config.constraint_types;
			const backwardConstraints = [
				constraintTypes.SNLT,
				constraintTypes.FNLT,
				constraintTypes.MSO,
				constraintTypes.MFO
			];
			const forwardConstraints = [
				constraintTypes.SNET,
				constraintTypes.FNET,
				constraintTypes.MSO,
				constraintTypes.MFO
			];

			if (gantt.config.schedule_from_end) {
				if (backwardConstraints.indexOf(task.constraint_type) > -1) {
					// keep the constraint type
					if (task.constraint_type == constraintTypes.SNLT ||
						task.constraint_type == constraintTypes.MSO) {
						task.constraint_date = new Date(task.start_date);
					} else {
						task.constraint_date = new Date(task.end_date);
					}
				} else {
					// set the default constraint
					task.constraint_type = constraintTypes.FNLT;
					task.constraint_date = new Date(task.end_date);
				}
			} else {
				if (forwardConstraints.indexOf(task.constraint_type) > -1) {
					// keep the constraint type
					if (task.constraint_type == constraintTypes.SNET ||
						task.constraint_type == constraintTypes.MSO) {
						task.constraint_date = new Date(task.start_date);
					} else {
						task.constraint_date = new Date(task.end_date);
					}
				} else {
					// set the default constraint
					task.constraint_type = constraintTypes.SNET;
					task.constraint_date = new Date(task.start_date);
				}
			}
		}

		function finalizeTaskConstraints(task){
			// TODO: remove in 7.0
			if (gantt.config.auto_scheduling_compatibility) {
				if (task.constraint_type === gantt.config.constraint_types.SNET ||
					task.constraint_type === gantt.config.constraint_types.FNLT) {
						task.constraint_type = null;
						task.constraint_date = null;
				}
			}
		}

		const _processConstraints = function(taskId, oldTask) {
			const newTask = gantt.getTask(taskId);
			if (shouldKeepConstraints(newTask, oldTask)) {
				// don't change constraints
			} else {
				updateTaskConstraints(newTask);
			}
		};

		const _autoScheduleAfterDND = function(taskId, task) {
			if (gantt.config.auto_scheduling && !gantt._autoscheduling_in_progress) {
				const newTask = gantt.getTask(taskId);

				const progressScheduling = (gantt.config.auto_scheduling_use_progress && ((task.progress === 1) !== (newTask.progress === 1)));

				if (_notEqualTaskDates(task, newTask)) {
					_processConstraints(taskId, task);

					if (
						gantt.config.auto_scheduling_move_projects &&
						// tslint:disable-next-line triple-equals
						movedTask == taskId
					) {
						let shouldResetSSandSFLinkLags = true;
						if (
							gantt.calculateDuration(task) !== gantt.calculateDuration(newTask)
						) {
							// task duration is used as lag when converting start_to_start and start_to_finish into finish to start links
							// recalculate these links if task duration has changed
							resetToStartLinksLags(taskId, relations);
							// to not call the function above twice
							shouldResetSSandSFLinkLags = false;
						}

						if(progressScheduling){
							gantt.autoSchedule();
						}else{
							// GS-2588. The duration of the project tasks can be changed after the child drag,
							// so, we need to update that information for the SS and SF links
							if (shouldResetSSandSFLinkLags) {
								resetToStartLinksLags(taskId, relations);
							}					
							gantt._autoSchedule(taskId, relations);
						}
					} else {
						gantt.autoSchedule(newTask.id);
					}

					finalizeTaskConstraints(newTask);
				}
			}
			relations = null;
			movedTask = null;
			return true;
		};




		let modifiedTaskId = null;
		if (gantt.ext && gantt.ext.inlineEditors) {
			const inlineEditors = gantt.ext.inlineEditors;
			const autoscheduleColumns = {
				start_date: true,
				end_date: true,
				duration: true,
				constraint_type: true,
				constraint_date: true
			};

			inlineEditors.attachEvent("onBeforeSave", function(state) {
				if (autoscheduleColumns[state.columnName]) {
					modifiedTaskId = state.id;
					// GS-711. The constraint type set by the user should be saved
					if (state.columnName === "constraint_type"){
						changedConstraint = true;
					}
					// GS-686. We shouldn't change the constraint after changing only the duration or end_date
					const durationColumn = state.columnName === "duration";
					const startDateColumn = gantt.config.schedule_from_end && (state.columnName === "start_date");
					const endDateColumn = !gantt.config.schedule_from_end && (state.columnName === "end_date");

					const linkedDateModification = gantt.config.inline_editors_date_processing !== "keepDuration";
					const linkedColumnEdit = linkedDateModification && (startDateColumn || endDateColumn);

					const constraintDateColumn = state.columnName === "constraint_date";

					const keepConstraints = durationColumn || linkedColumnEdit || constraintDateColumn;

					if (keepConstraints) {
						const task = gantt.getTask(state.id);
						task.$keep_constraints = true;
					}
				}
				return true;
			});
		}

		let changedConstraint;
		function onBeforeLigthboxSaveHandler(taskId: TaskID, task: ITask): boolean {
			if (gantt.config.auto_scheduling && !gantt._autoscheduling_in_progress) {
				changedConstraint = false;
				const oldTask = gantt.getTask(taskId);
				if (_notEqualTaskDates(task, oldTask)) {
					modifiedTaskId = taskId;
					if (shouldKeepConstraints(task, oldTask)){
						task.$keep_constraints = true;
					}
					if(gantt.getConstraintType(task) !== gantt.getConstraintType(oldTask) ||
						+task.constraint_date !== +oldTask.constraint_date
					){
						changedConstraint = true;
					}
				}
			}
			return true;
		}
		function onAfterTaskUpdateHandler(taskId: TaskID, task: ITask): boolean {
			if (gantt.config.auto_scheduling && !gantt._autoscheduling_in_progress) {
				if (
					modifiedTaskId !== null &&
					// tslint:disable-next-line triple-equals
					modifiedTaskId == taskId
				) {
					modifiedTaskId = null;
					if (task.$keep_constraints){
						delete task.$keep_constraints;
					} else if(!changedConstraint){
						updateTaskConstraints(task);
					}
					gantt.autoSchedule(task.id);

					if(!changedConstraint){
						finalizeTaskConstraints(task);
					}
				}
			}
			return true;
		}

		const draggedTask = {};
		let timeout;
		gantt.attachEvent("onBeforeTaskChanged", function(
			id: TaskID,
			mode: string,
			task: ITask
		) {
			_processConstraints(id, task);
			draggedTask[id] = task;
			return true;
		});

		// GS-499, GS-264 and GS-836. Autoschedule only after finishing dragging the task
		gantt.attachEvent("onAfterTaskDrag", function(id, mode, e) {
			if (id === movedTask) {
				clearTimeout(timeout);
				timeout = setTimeout(function() {
					_autoScheduleAfterDND(id, draggedTask[id]);
				});
			}
		});

		if(gantt.ext.inlineEditors){
			gantt.ext.inlineEditors.attachEvent("onBeforeSave", function(state){
				if (gantt.config.auto_scheduling && !gantt._autoscheduling_in_progress) {
					const api = gantt.ext.inlineEditors;
					const editorConfig = api.getEditorConfig(state.columnName);
					if(editorConfig.map_to === "start_date" || editorConfig.map_to === "end_date" || editorConfig.map_to === "duration"){
						modifiedTaskId = state.id;
					}
				}
				return true;
			});
		}

		gantt.attachEvent("onLightboxSave", onBeforeLigthboxSaveHandler);
		gantt.attachEvent("onAfterTaskUpdate", onAfterTaskUpdateHandler);
	};

	gantt.attachEvent("onGanttReady", function() {
		_attachAutoSchedulingHandlers();
		// attach handlers only when initialized for the first time
	}, {once: true});
}
