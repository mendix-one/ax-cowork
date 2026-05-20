export default class ExtensionsManager{
	private _extensions:{[key:string]: GanttPlugin };

	constructor(config: {[key:string]: GanttPlugin }){
		this._extensions = {};
		for(const i in config){
			this._extensions[i] = config[i];
		}
	}

	addExtension = (name: string, ext: GanttPlugin) => {
		this._extensions[name] = ext;
	};

	getExtension = (name: string): GanttPlugin => {
		return this._extensions[name];
	};
}