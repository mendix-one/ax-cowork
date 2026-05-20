import { useEffect } from 'react';
import { isEqual } from 'lodash-es';
import { GanttStatic } from '@dhx/gantt';


export function applyMarkers(gantt: GanttStatic, markers: any[], prevMarkersRef:any) {
	if(!markers){
		return;
	}
	if(!gantt.plugins().marker){
		gantt.plugins({
			marker: true
		})
	}
	
	const existingMarkers = gantt._markers.getVisibleItems();
	const markerIds = markers.map((marker: any) => marker.id);

	markers.forEach((marker: any) => {
		if (!existingMarkers.find((m: any) => m.id === marker.id)) {
			gantt.addMarker(marker);
		} else {
			const existingMarker = gantt.getMarker(marker.id);
			Object.assign(existingMarker, marker);
			gantt.updateMarker(marker.id);
		}
	});

	existingMarkers.forEach((marker: any) => {
		if (!markerIds.includes(marker.id)) {
			gantt.deleteMarker(marker.id);
		}
	});

	prevMarkersRef.current = markers;
}

export function useMarkers(
	ganttRef: any | null,
	prevMarkersRef: any,
	markers: any[],
	debounceRender: () => void
) {
	useEffect(() => {

		if(!markers){
			return;
		}
		if (ganttRef.current && ganttRef.current._markers) {
			if(isEqual(prevMarkersRef.current, markers)){
				return;
			}
			const gantt = ganttRef.current;
			applyMarkers(gantt, markers, prevMarkersRef);

			debounceRender();
		}
	}, [markers]);
}