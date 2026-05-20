
import ExtensionsManager from "../ext/extension_manager";
import scope from "../utils/global";

class GanttFactory implements IGanttFactory{
	protected _seed: number;
	protected _ganttPlugin: GanttPlugin[];
	protected _factoryMethod: (bundledExtensions: {[key:string]: GanttPlugin}) => any;
	protected _bundledExtensions: {[key:string]: GanttPlugin};
	protected _extensionsManager: ExtensionsManager;

	constructor(factoryMethod: ()=>any, _bundledExtensions:{[key:string]: GanttPlugin}) {
		this._seed = 0;
		this._ganttPlugin = [];
		this._factoryMethod = factoryMethod;
		this._bundledExtensions = _bundledExtensions;
		this._extensionsManager = new ExtensionsManager(_bundledExtensions);
	}

	plugin = (code: GanttPlugin):void => {
		this._ganttPlugin.push(code);

		if(scope.gantt !== undefined && scope.gantt.getTask){
			code(scope.gantt);
		}
	};

	getGanttInstance = (initConfig?: IGanttInitializationConfig):any => {
		const gantt = this._factoryMethod(this._bundledExtensions);
		for (let i=0; i<this._ganttPlugin.length; i++) {
			this._ganttPlugin[i](gantt);
		}
		gantt._internal_id = (this._seed++);

		if(initConfig){
			this._initFromConfig(gantt, initConfig);
		}

		return gantt;
	};

	protected _initFromConfig = (gantt: any, initConfig: IGanttInitializationConfig):any => {
		if(initConfig.plugins){
			for(const i in initConfig.plugins){
				const ext = this._extensionsManager.getExtension(i);
				if(ext){
					gantt.plugins({[i]: true});
				}
			}
		}

		if(initConfig.config){
			gantt.mixin(gantt.config, initConfig.config, true);
		}

		if(initConfig.templates){
			gantt.attachEvent("onTemplatesReady", function(){
				gantt.mixin(gantt.templates, initConfig.templates, true);
			}, {once: true});
		}

		if(initConfig.events){
			for(const event in initConfig.events){
				gantt.attachEvent(event, initConfig.events[event]);
			}
		}

		if(initConfig.locale){
			gantt.i18n.setLocale(initConfig.locale);
		}

		if(Array.isArray(initConfig.calendars)){
			initConfig.calendars.forEach(function(calendar){
				gantt.addCalendar(calendar);
			});
		}

		if(initConfig.container){
			gantt.init(initConfig.container);
		} else {
			gantt.init();
		}

		if(initConfig.data){
			if(typeof initConfig.data === "string"){
				gantt.load(initConfig.data);
			}else{
				gantt.parse(initConfig.data);
			}
		}


	};
}

export default GanttFactory;