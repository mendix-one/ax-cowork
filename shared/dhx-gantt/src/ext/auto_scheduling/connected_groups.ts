interface IFlagHash {
	[id: string]: boolean;
}

function findGroups(links: IInternalLink[]): IConnectedGroup[] {
	const visited: IFlagHash = {};
	const groups = [];
	let source: TaskID;
	let target: TaskID;
	let root: TaskID;
	// main loop - find any unvisited vertex from the input array and
	// treat it as the source, then perform a breadth first search from
	// it. All vertices visited from this search belong to the same group
	for (let i = 0; i < links.length; i++) {
		source = links[i].source;
		target = links[i].target;
		root = null;
		if (!visited[source]) {
			root = source;
		} else if (!visited[target]) {
			root = target;
		}
		if (root) {
			// there is an unvisited vertex in this pair.
			// perform a breadth first search, and push the resulting
			// group onto the list of all groups
			const length = links.length;
			groups.push(breadthFirstSearch(root, links, visited));
			if (length !== links.length) {
				i = -1;
			}
		}
	}
	return groups;
}

// Breadth First Search function
// v is the source vertex
// links is the input array, which contains all gantt relations
// visited is a dictionary for keeping track of whether a node is visited
function breadthFirstSearch(
	v: TaskID,
	links: IInternalLink[],
	visited: IFlagHash
): IConnectedGroupsDetailed {
	const queue: TaskID[] = [v];
	const groupTasks: TaskID[] = [];
	const groupLinksInternal: { [hashSum: string]: IInternalLink } = {};
	const groupLinksPublic: { [id: string]: boolean } = {};

	let currentVertex: TaskID;
	while (queue.length > 0) {
		currentVertex = queue.shift();
		if (!visited[currentVertex]) {
			visited[currentVertex] = true;
			groupTasks.push(currentVertex);
			// go through the input array to find vertices that are
			// directly adjacent to the current vertex, and put them
			// onto the queue
			for (let i = 0; i < links.length; i++) {
				const link = links[i];
				// tslint:disable-next-line triple-equals
				if ((link.source == currentVertex || link.sourceParent == currentVertex)) {
					if (!visited[link.target]) {
						queue.push(link.target);
						groupLinksPublic[link.id] = true;
						links.splice(i, 1);
						i--;
					}
					groupLinksInternal[link.hashSum] = link;

					// tslint:disable-next-line triple-equals
				} else if ((link.target == currentVertex || link.targetParent == currentVertex)) {
					if (!visited[link.source]) {
						queue.push(link.source);
						groupLinksPublic[link.id] = true;
						links.splice(i, 1);
						i--;
					}
					groupLinksInternal[link.hashSum] = link;
				}
			}
		}
	}

	const linksArray: LinkID[] = [];
	let linksObjects: IInternalLink[] = [];
	for (const i in groupLinksPublic) {
		linksArray.push(i);
	}
	for (const i in groupLinksInternal) {
		linksObjects.push(groupLinksInternal[i]);
	}
	// GS-1689. If we have several levels of projects, the code above might not add the links
	// so, we need to return the original `links` object
	if (!linksObjects.length){
		linksObjects = links;
	}
	// return everything in the current "group"
	return { tasks: groupTasks, links: linksArray, processedLinks: linksObjects };
}

export class ConnectedGroupsHelper {
	private _linksBuilder: any;
	private _gantt: any;
	constructor(gantt: any, linksBuilder: any) {
		this._linksBuilder = linksBuilder;
		this._gantt = gantt;
	}

	getConnectedGroupRelations = (id: TaskID): IInternalLink[] => {
		const links = this._linksBuilder.getLinkedTasks();
		const group = breadthFirstSearch(id, links, {});
		return group.processedLinks;
	};

	getConnectedGroup = (id: TaskID): IConnectedGroup | IConnectedGroup[] => {
		const links = this._linksBuilder.getLinkedTasks();
		if (id !== undefined) {
			if (this._gantt.getTask(id).type === this._gantt.config.types.project) {
				return { tasks: [], links: [] };
			}

			const group = breadthFirstSearch(id, links, {});
			return {
				tasks: group.tasks,
				links: group.links
			};
		} else {
			return findGroups(links).map(group => ({ tasks: group.tasks, links: group.links }));
		}
	};
}
