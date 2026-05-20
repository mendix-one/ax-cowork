import { isEqual } from "lodash-es";

/**
 * Recursively sync layout config properties into gantt.$layout cells
 */
export function updateLayoutCells(
	storedCell: any,      // gantt.$layout
	newLayoutNode: any,   // new config
	oldLayoutNode: any    // previous config
) {
	if (Array.isArray(storedCell) &&
		Array.isArray(newLayoutNode) &&
		Array.isArray(oldLayoutNode)
	) {
		const length = Math.min(
			storedCell.length,
			newLayoutNode.length,
			oldLayoutNode.length
		);

		for (let i = 0; i < length; i++) {
			updateLayoutCells(storedCell[i], newLayoutNode[i], oldLayoutNode[i]);
		}
		return;
	}

	if (storedCell?.$cells && newLayoutNode?.rows && oldLayoutNode?.rows) {
		updateLayoutCells(storedCell.$cells, newLayoutNode.rows, oldLayoutNode.rows);
		return;
	}
	if (storedCell?.$cells && newLayoutNode?.cols && oldLayoutNode?.cols) {
		updateLayoutCells(storedCell.$cells, newLayoutNode.cols, oldLayoutNode.cols);
		return;
	}

	if (storedCell?.$config) {
		for (const prop in newLayoutNode) {
			if (prop === "rows" || prop === "cols") {
				continue;
			}

			const newVal = newLayoutNode[prop];
			const oldVal = oldLayoutNode[prop];

			if (!isEqual(newVal, oldVal)) {
				storedCell.$config[prop] = newVal;
			}
		}
	}

}
