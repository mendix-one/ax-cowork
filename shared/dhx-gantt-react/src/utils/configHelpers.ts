import { GanttStatic } from "@dhx/gantt";
import { isEqual } from "lodash-es";

export function handleZoomChange(gantt: GanttStatic, oldConfig: any, newConfig: any) {
	const oldZoom = oldConfig?.zoom?.current;
	const newZoom = newConfig?.zoom?.current;
	if (!newZoom || newZoom === oldZoom) return;

	if (gantt.config.zoom?.levels && !(gantt.ext.zoom as any)._initialized) {
		gantt.ext.zoom.init(gantt.config.zoom);
	}
	gantt.ext.zoom.setLevel(newZoom);
}

export function applyConfigProperties(
	gantt: GanttStatic,
	newConfig: any,
	oldConfig: any,
	partial: boolean
) {
	for (const key in newConfig) {
		if (partial && key === "layout") continue; // skip layout in partial
		const oldVal = oldConfig?.[key];
		const newVal = newConfig[key];
		if (partial && isEqual(newVal, oldVal)) {
			continue;
		}
		gantt.config[key] = newVal;
	}
}

export function syncLayoutProps(storedLayout: any, newLayout: any, oldLayout: any) {
	if (!storedLayout || !newLayout || !oldLayout) return;

	if (Array.isArray(storedLayout) && Array.isArray(newLayout) && Array.isArray(oldLayout)) {
		for (let i = 0; i < storedLayout.length; i++) {
			syncLayoutProps(storedLayout[i], newLayout[i], oldLayout[i]);
		}
		return;
	}

	if (storedLayout.rows && newLayout.rows && oldLayout.rows) {
		syncLayoutProps(storedLayout.rows, newLayout.rows, oldLayout.rows);
	} else if (storedLayout.cols && newLayout.cols && oldLayout.cols) {
		syncLayoutProps(storedLayout.cols, newLayout.cols, oldLayout.cols);
	}

	for (const prop in newLayout) {
		if (prop === "rows" || prop === "cols") continue;
		const newVal = newLayout[prop];
		const oldVal = oldLayout[prop];
		if (!isEqual(newVal, oldVal)) {
			storedLayout[prop] = newVal;
		}
	}
}

export function applyFullConfig(
	gantt: GanttStatic,
	newConfig: any,
	prevConfigRef: { current: any }
) {
	const oldConfig = prevConfigRef.current || {};
	applyConfigProperties(gantt, newConfig, oldConfig, false);
	handleZoomChange(gantt, oldConfig, newConfig);
	prevConfigRef.current = newConfig;
}

export function applyPartialConfig(gantt: GanttStatic, newConfig: any, oldConfig: any) {
	applyConfigProperties(gantt, newConfig, oldConfig, true);
	handleZoomChange(gantt, oldConfig, newConfig);
}
