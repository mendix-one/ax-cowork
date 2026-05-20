import { isEqual } from 'lodash-es';


export function diffById<T extends { id: string | number }>(
	prev: T[],
	next: T[]
) {


	const added: T[] = [];
	const removed: T[] = [];
	const updated: T[] = [];

	const result = { added, removed, updated };

	if(!prev || !prev.length){
		result.added = next;
		return result;
	}

	if(!next || !next.length){
		result.removed = prev;
		return result;
	}
	const prevMap = new Map(prev.map(t => [t.id, t]));
	const nextMap = new Map(next.map(t => [t.id, t]));

	next.forEach(item => {
		const old = prevMap.get(item.id);
		if (!old) {
			added.push(item);
		} else if (!isEqual(old, item)) {
			updated.push(item);
		}
	});

	prev.forEach(item => {
		if (!nextMap.has(item.id)) removed.push(item);
	});

	return { added, removed, updated };
}

export function findRemovedItems<T extends { id: string | number }>(
	prev: T[],
	next: T[]
) {
	let removed: T[] = [];

	if(!next || !next.length){
		removed = prev;
		return removed;
	}

	const nextMap = new Map(next.map(t => [t.id, t]));
	prev.forEach(item => {
		if (!nextMap.has(item.id) && !(item as any).$virtual) {
			removed.push(item);
		}
	});

	return removed;
}

export function mergeArrays<T extends { id: string | number }>(
	arr1: T[],
	arr2: T[]
): T[] {
	const mergedMap = new Map<string | number, T>();

	arr1.forEach(item => mergedMap.set(item.id, item));
	arr2.forEach(item => mergedMap.set(item.id, item));

	return Array.from(mergedMap.values());
}

export function shouldReset<T extends { id: string | number }>(prev:T[], next:T[], diff: {added: T[], removed: T[], updated:T[]} ){

	if(!prev || !prev.length){
		return true;
	}
	if(diff.added.length / Math.max(next.length, 1) > 0.8 || diff.removed.length / Math.max(prev.length, 1) > 0.8){
		return true;
	}

	return false;
}




export function patchStore<T extends { id: string | number }>(
  diff: { added: T[]; removed: T[]; updated: T[] },
  {
    add,
    update,
    remove,
  }: {
    add: (item: T) => void;
    update: (item: T) => void;
    remove: (id: string | number) => void;
  }
) {
  diff.removed.forEach(item => remove(item.id));
  diff.added.forEach(add);
  diff.updated.forEach(update);
}