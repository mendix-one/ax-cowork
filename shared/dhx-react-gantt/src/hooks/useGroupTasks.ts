import { useEffect } from 'react';
import { isEqual } from 'lodash-es';

export function useGroupTasks(
	ganttRef: any | null,
	prevGroupConfigRef: any,
	groupConfig: any
) {
	useEffect(() => {
		if (!ganttRef.current) return;
		const gantt = ganttRef.current;
		applyGroupTasks(gantt, groupConfig, prevGroupConfigRef);

	}, [groupConfig]);
}

export function shouldGroupTasks(groupConfig: any, prevGroupConfigRef: any) {
	if (!groupConfig && !prevGroupConfigRef.current)
		return false;

	return !isEqual(prevGroupConfigRef.current, groupConfig);
}

export function preventTaskDisplay(gantt: any, callback: any) {
	if (!gantt) return;
	const skipRenderHandler = gantt.attachEvent("onBeforeTaskDisplay", () => false);
	let e = null;
	try {
		callback();
	} catch (error) {
		e = error;
	}

	gantt.detachEvent(skipRenderHandler);
	if(e){
		throw e;
	}
}

export function applyGroupTasks(gantt: any, groupConfig: any, prevGroupConfigRef: any) {
	if (!gantt) return;
	if(shouldGroupTasks(groupConfig, prevGroupConfigRef)){
		if(!gantt.plugins().grouping){
			gantt.plugins({
				grouping: true
			})
		}

		gantt.groupBy(groupConfig);
		prevGroupConfigRef.current = groupConfig;
	}
}