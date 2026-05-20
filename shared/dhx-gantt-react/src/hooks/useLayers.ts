import { useEffect } from 'react';

export function useLayers(
	ganttRef: any | null,
	taskLayers: any[]
) {
	useEffect(() => {
		if (ganttRef.current && taskLayers) {
			const gantt = ganttRef.current;
			taskLayers.forEach(({ id, render }: any) => {
				gantt.addTaskLayer(render);
			});
		}
	}, [taskLayers]);
}