
export interface IWorkUnitCache{
	getItem(unit: string, timestamp: string, value: Date): number|boolean;
	setItem(unit: string, timestamp: string, value: boolean, rawValue: Date): void;
	clear(): void;
}