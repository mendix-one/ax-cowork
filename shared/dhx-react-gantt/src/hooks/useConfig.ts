import { useEffect, useRef } from 'react';
import { isEqual } from 'lodash-es';
import {
	applyFullConfig,
	applyPartialConfig,
	syncLayoutProps
} from '../utils/configHelpers';
import { updateLayoutCells } from "../utils/layoutSync";
import buildLayoutDescriptor from '../utils/ganttLayoutDescriptor';

export function useConfig(
	ganttRef,
	prevConfigRef,
	config,
	debounceRender,
	debounceInit
) {
	const prevLayoutRef = useRef<any>(null);

	useEffect(() => {
		const gantt = ganttRef.current;
		if (!gantt) return;

		const prevConfig = prevConfigRef.current;
		if (!prevConfig) {
			// first render
			prevLayoutRef.current = config.layout;
			return;
		}

		const oldLayout = prevLayoutRef.current || prevConfig.layout;
		const newLayout = config.layout;
		const shapeOld = buildLayoutDescriptor(oldLayout);
		const shapeNew = buildLayoutDescriptor(newLayout);

		let layoutChanged = false;
		if (oldLayout || newLayout) {
			if (!isEqual(shapeOld, shapeNew)) {
				layoutChanged = true;
			}
		}

		if (layoutChanged) {
			applyFullConfig(gantt, config, prevConfigRef);
			debounceInit();
		} else {
			applyPartialConfig(gantt, config, prevConfig);

			if (prevLayoutRef.current) {
				const storedLayout = gantt.config.layout;
				syncLayoutProps(storedLayout, newLayout, oldLayout);

				const storedRootCell = gantt.$layout;
				updateLayoutCells(storedRootCell, config.layout, prevLayoutRef.current);
			}

			prevConfigRef.current = config;
			debounceRender();
		}

		prevLayoutRef.current = newLayout;
	}, [config]);
}
