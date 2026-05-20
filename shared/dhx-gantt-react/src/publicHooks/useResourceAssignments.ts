import { useMemo } from 'react';
import { ReactGanttRef } from '../types/types';

export function useResourceAssignments(ganttRef: React.RefObject<ReactGanttRef>) {
  return useMemo(() => {

    return {
      getResourceAssignments(resourceId: string | number, taskId?: string | number) {
        const gantt = ganttRef.current?.instance;
        if (!gantt) return [];
        return gantt.getResourceAssignments(resourceId, taskId);
      },
      getTaskResources(taskId: string | number) {
        const gantt = ganttRef.current?.instance;
        if (!gantt) return [];
        return gantt.getTaskResources(taskId);
      }
    };
  }, [ganttRef]);
}