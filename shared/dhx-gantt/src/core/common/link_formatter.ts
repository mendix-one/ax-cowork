import LinkFormatterSimple from "./link_formatter_simple";

export default class LinkFormatter extends LinkFormatterSimple implements ILinkFormatter {
	static create = (settings: ILinkFormatterConfig = null, gantt: any): LinkFormatter => {
		return new LinkFormatter(settings, gantt);
	};
	protected _config: ILinkFormatterConfig;

	constructor(settings: ILinkFormatterConfig, gantt: any) {
		super(gantt);
		this._config = this._defaultSettings(settings);
		this._linkReg = /^[0-9\.]+[a-zA-Z]*/;
	}

	format = (link: ILink) : string => {
		const formattedType = this._getFormattedLinkType(this._getLinkTypeName(link.type));
		const wbs = this._getWBSCode(link.source);
		const lag = this._getLagString(link.lag);

		if(link.type === this._gantt.config.links.finish_to_start && !link.lag){
			return wbs;
		}else{
			return `${wbs}${formattedType}${lag}`;
		}
	};

	parse = (value: string) : ILink => {
		if(!this.canParse(value)){
			return null;
		}

		const linkPart = this._linkReg.exec(value)[0].trim();
		const lagPart = value.replace(linkPart, "").trim();

		const typeFormat = this._findTypeFormat(linkPart);
		const typeNumber = this._getLinkTypeNumber(typeFormat);
		const source = this._findSource(linkPart) || null;
		const lag = this._parseLag(lagPart);

		return {
			id: undefined,
			source,
			target: null,
			type: typeNumber,
			lag
		};
	};

	protected _defaultSettings(settings: ILinkFormatterConfig = null) : ILinkFormatterConfig{
		const preparedSettings: ILinkFormatterConfig = {
			durationFormatter: this._gantt.ext.formatters.durationFormatter(),
			labels: {
				finish_to_finish: "FF",
				finish_to_start: "FS",
				start_to_start: "SS",
				start_to_finish: "SF"
			}
		};

		if(settings && settings.durationFormatter){
			preparedSettings.durationFormatter = settings.durationFormatter;
		}

		if(settings && settings.labels){
			for(const i in settings.labels){
				preparedSettings.labels[i] = settings.labels[i];
			}
		}
		return preparedSettings;
	}

	protected _getLinkTypeName = (value: string) => {
		let linkName = "";
		for(linkName in this._config.labels){
			if(String(this._gantt.config.links[linkName]).toLowerCase() === String(value).toLowerCase()){
				break;
			}
		}
		return linkName;
	};

	protected _getLinkTypeNumber = (value: string) => {
		let linkName = "";
		for(linkName in this._gantt.config.links){
			if(linkName.toLowerCase() === value.toLowerCase()){
				break;
			}
		}
		return this._gantt.config.links[linkName];
	};

	protected _getFormattedLinkType = (name: string) => {
		return this._config.labels[name] || "";
	};

	protected _getLagString = (lag: number) => {
		if(!lag){
			return "";
		}

		const formatted = this._config.durationFormatter.format(lag);
		if(lag < 0) {
			return formatted;// -3 days
		}else{
			return `+${formatted}`;// + 3 days
		}
	};

	protected _findTypeFormat = (value: string) => {
		const format = value.replace(/[^a-zA-Z]/gi, ""); // leave only letters
		let name = "finish_to_start";
		for(const i in this._config.labels){
			if(this._config.labels[i].toLowerCase() === format.toLowerCase()){
				name = i;
			}
		}
		return name;
	};

	protected _parseLag = (value: string) => {
		if(!value){
			return 0;
		}
		return this._config.durationFormatter.parse(value);
	};
}