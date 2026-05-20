export class TaskPlan implements ITaskPlan {
	static Create(parent?: TaskPlan): TaskPlan {
		const plan = new TaskPlan();
		if (parent) {
			for (const i in plan) {
				if (parent[i] !== undefined) {
					plan[i] = parent[i];
				}
			}
		}
		return plan;
	}

	public link: string | number;
	public task: string | number;
	// tslint:disable-next-line variable-name
	public start_date: Date | null;
	// tslint:disable-next-line variable-name
	public end_date: Date | null;

	public latestStart: Date;
	public earliestStart: Date;
	public earliestEnd: Date;
	public latestEnd: Date;

	public latestSchedulingStart: Date;
	public earliestSchedulingStart: Date;
	public latestSchedulingEnd: Date;
	public earliestSchedulingEnd: Date;

	public kind: string;
	public conflict: boolean;

	constructor() {
		this.link = null;
		this.task = null;
		this.start_date = null;
		this.end_date = null;
		this.latestStart = null;
		this.earliestStart = null;
		this.earliestEnd = null;
		this.latestEnd = null;
		this.latestSchedulingStart = null;
		this.earliestSchedulingStart = null;
		this.latestSchedulingEnd = null;
		this.earliestSchedulingEnd = null;
		this.kind = "asap";
		this.conflict = false;
	}
}