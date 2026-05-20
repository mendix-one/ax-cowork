export interface IDurationFormatter {
	canParse(value: string) : boolean;
	format(value: number) : string;
	parse(value: string) : number;
}