import { useEffect } from 'react';
import { isEqual, cloneDeep } from 'lodash-es';
import { diffById, shouldReset, patchStore, findRemovedItems, mergeArrays } from './dataHelpers/diffById';
import { GanttStatic, Link, Task } from "@dhx/gantt";
import { shouldGroupTasks, preventTaskDisplay } from './useGroupTasks';
export function useData(
	ganttRef: any | null,
	prevTasksRef: any,
	prevLinksRef: any,
	prevResourcesRef: any,
	prevResourceAssignmentsRef: any,
	prevBaselinesRef: any,
	prevGroupConfigRef: any,
	tasks: any[],
	links: any[],
	resources: any[],
	resourceAssignments: any[],
	baselines: any[],
	groupConfig: any,
	debounceRender: () => void
) {
	useEffect(() => {
		if (!ganttRef.current) return;
		let tasksChanged = !isEqual(prevTasksRef.current, tasks);
		let linksChanged = !isEqual(prevLinksRef.current, links);
		let resourcesChanged = !isEqual(prevResourcesRef.current, resources);
		let resourceAssignmentsChanged = !isEqual(prevResourceAssignmentsRef.current, resourceAssignments);
		let baselinesChanged = !isEqual(prevBaselinesRef.current, baselines);
		if (!(tasksChanged || linksChanged || resourcesChanged || resourceAssignmentsChanged || baselinesChanged)) return;

		let resetTasks = false;
		let resetLinks = false;
		let tasksDiff = null;
		let linksDiff = null;

		if(tasksChanged){
			tasksDiff = diffById(prevTasksRef.current, tasks);
			const localRemovedTasks = findRemovedItems(ganttRef.current.$data.tasksStore.getItems(), tasks);
			if(localRemovedTasks.length){
				tasksDiff.removed = mergeArrays(tasksDiff.removed, localRemovedTasks);
			}
			resetTasks = shouldReset(prevTasksRef.current, tasks, tasksDiff);
		}
		if(linksChanged){
			linksDiff = diffById(prevLinksRef.current, links);
			const localRemovedLinks = findRemovedItems(ganttRef.current.$data.linksStore.getItems(), links);
			if(localRemovedLinks.length){
				linksDiff.removed = mergeArrays(linksDiff.removed, localRemovedLinks);
			}
			resetLinks = shouldReset(prevLinksRef.current, links, linksDiff);
		}

		prevTasksRef.current = tasks;
		prevLinksRef.current = links;
		prevResourcesRef.current = resources;
		prevResourceAssignmentsRef.current = resourceAssignments;
		prevBaselinesRef.current = baselines;

		const gantt = ganttRef.current;

		let scrollPos = gantt.getScrollState();

		

		if(tasksChanged || linksChanged){
			if(resetTasks)
				gantt.$data.tasksStore.clearAll();
			if(resetLinks)
				gantt.$data.linksStore.clearAll();
		}

		if(resourcesChanged){
			if (!resources.length && !gantt.$data.resourceStore.count()) return;
			gantt.$data.resourcesStore.clearAll();
			gantt.$data.resourcesStore.parse(resources);
		}

		if(resourceAssignmentsChanged){
			if (!resourceAssignments.length && !gantt.$data.assignmentsStore.count()) return;
			gantt.$data.assignmentsStore.clearAll();
			gantt.$data.assignmentsStore.parse(resourceAssignments);
		}

		if(baselinesChanged){
			if (!baselines.length && !gantt.$data.baselineStore.count()) return;
			gantt.$data.baselineStore.clearAll();
			gantt.$data.baselineStore.parse(baselines);
		}

		const willGroupTasks = () => shouldGroupTasks(groupConfig, prevGroupConfigRef);
		const suppressTaskDisplay = (callback) => preventTaskDisplay(gantt, callback);

		if(tasksChanged || linksChanged){
			let undoStack = null;
			let redoStack = null;
			if(gantt.plugins().undo){
				undoStack = gantt.ext.undo.getUndoStack();
				redoStack = gantt.ext.undo.getRedoStack();
			}

			if(resetTasks || resetLinks){
				const dataset: any = {};
				if(resetTasks){
					dataset.tasks = tasks;
				}
				if(resetLinks){
					dataset.links = links;
				}

				if(willGroupTasks()){
					suppressTaskDisplay(() => {
						gantt.parse(dataset);
					});
				}else{
					gantt.parse(dataset);
				}
				
			}

			if(!resetTasks || !resetLinks){
				gantt.batchUpdate(() => {
					gantt.silent(() => {
						if(tasksChanged && !resetTasks){
							const initTask = gantt.getDatastore("task").$initItem.bind(gantt.getDatastore("task"));
							const selectedTask = gantt.getSelectedId();
							let selectedIndex = -1;
							if(selectedTask){
								selectedIndex = gantt.getGlobalTaskIndex(selectedTask);
							}
							patchStore<Task>(tasksDiff, {
								add: task => {
									if(!gantt.isTaskExists(task.id)){
										gantt.addTask(cloneDeep(task), task.parent);
									}else {
		  								gantt.updateTask(task.id as any, initTask(cloneDeep(task)));
									}
								},
								update: task => {
									if(!gantt.isTaskExists(task.id)){
		  								gantt.addTask(cloneDeep(task), task.parent);
									}else {
										gantt.updateTask(task.id as any, initTask(cloneDeep(task)));
									}
								},
								remove: id => {
									if(gantt.isTaskExists(id)) gantt.deleteTask(id)
								},
							});

							if(selectedTask && !gantt.isTaskExists(selectedTask) && selectedIndex !== -1){
								// if selected task was replaced, select new task on it's place
								const replacementTask = gantt.getTaskByIndex(selectedIndex);
								if(replacementTask){
									gantt.selectTask(replacementTask.id);
								}
							}
						}
						if(linksChanged && !resetLinks){
							const initLink = gantt.getDatastore("link").$initItem.bind(gantt.getDatastore("link"));
							patchStore<Link>(linksDiff, {
								add: link => {
									if(!gantt.isLinkExists(link.id)){
										gantt.addLink(cloneDeep(link));
									} else {
										gantt.updateLink(link.id as any, initLink(cloneDeep(link)));
									}
								},
								update: link => {
									if(!gantt.isLinkExists(link.id)){
										gantt.addLink(cloneDeep(link));
									} else {
										gantt.updateLink(link.id as any, initLink(cloneDeep(link)));
									}
								},
								remove: id => {
									if(gantt.isLinkExists(id)) gantt.deleteLink(id);
								},
							});
						}
					});
				});
			}
			

			if(undoStack && redoStack){
				gantt.ext.undo.setUndoStack(undoStack);
				gantt.ext.undo.setRedoStack(redoStack);
			}
			gantt.scrollTo(scrollPos.x, scrollPos.y);
		}else {
			debounceRender();
		}

	}, [tasks, links, resources, resourceAssignments, baselines]);
}