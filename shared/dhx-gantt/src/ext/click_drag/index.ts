import { EventsManager } from "./eventsManager";
import { ISelectedRegionConfig, SelectedRegion } from "./selectedRegion";

export default function(gantt: any){
	if (!gantt.ext) {
		gantt.ext = {};
	}

	const defaultConfig: ISelectedRegionConfig = {
		className: "gantt_click_drag_rect",
		useRequestAnimationFrame: true,
		callback: undefined,
		singleRow: false
	};

	function setClickDrag(){
		const config: ISelectedRegionConfig = { viewPort: gantt.$task_data, ...defaultConfig };
		if (gantt.ext.clickDrag){
			gantt.ext.clickDrag.destructor();
		}
		gantt.ext.clickDrag = new EventsManager(gantt);
		const clickDrag = gantt.config.click_drag;
		config.render = clickDrag.render || defaultConfig.render;
		config.className = clickDrag.className || defaultConfig.className;
		config.callback = clickDrag.callback || defaultConfig.callback;
		config.viewPort = clickDrag.viewPort || gantt.$task_data;
		config.useRequestAnimationFrame = clickDrag.useRequestAnimationFrame === undefined ?
			defaultConfig.useRequestAnimationFrame : clickDrag.useRequestAnimationFrame;

		config.singleRow = clickDrag.singleRow === undefined ? defaultConfig.singleRow : clickDrag.singleRow;
		const timeline = gantt.$ui.getView("timeline");
		const selectedRegion = new SelectedRegion(config, gantt, timeline);
		gantt.ext.clickDrag.attach(selectedRegion, clickDrag.useKey, clickDrag.ignore);
	}

	gantt.attachEvent("onGanttReady", () => {
		if (gantt.config.click_drag){
			setClickDrag();
		}
	});

	gantt.attachEvent("onGanttLayoutReady", function(){
		if (gantt.$container && gantt.config.click_drag){
			gantt.attachEvent("onGanttRender", function(){
				setClickDrag();
			}, {once:true});
		}
	});

	gantt.attachEvent("onDestroy", () => {
		if (gantt.ext.clickDrag){
			gantt.ext.clickDrag.destructor();
		}
	});

}