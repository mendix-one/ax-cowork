import { useState, useEffect } from 'react';

interface LightboxData {
  id: number | string;
  task: any;
}

interface UseCustomLightboxResult {
  lightboxData: LightboxData | null;
  handleSave: (updatedTask: any) => void;
  handleCancel: () => void;
  handleDelete: () => void;
}


export function useCustomLightbox(
  ganttRef: React.MutableRefObject<any>,
  customLightbox: React.ReactElement | null
): UseCustomLightboxResult {
  const [lightboxData, setLightboxData] = useState<LightboxData | null>(null);

  useEffect(() => {
    const gantt = ganttRef.current;
    if (!gantt) return;

    if (!customLightbox) return;

    // override the built-in lightbox methods so we can open/close our React lightbox
    const originalShowLightbox = gantt.showLightbox;
    const originalHideLightbox = gantt.hideLightbox;

    gantt.showLightbox = (id: number | string) => {
      const task = gantt.getTask(id);
      setLightboxData({ id, task });
    };

    gantt.hideLightbox = () => {
      setLightboxData(null);
    };


    return () => {
      gantt.showLightbox = originalShowLightbox;
      gantt.hideLightbox = originalHideLightbox;
    };
  }, [ganttRef, customLightbox]);


  const handleSave = (updatedTask: any) => {
    const gantt = ganttRef.current;
    if (!gantt || !lightboxData) return;

    const { task } = lightboxData;
    Object.assign(task, updatedTask);

    // if it was a newly created task, add it to Gantt
    if (task.$new) {
      delete task.$new;
      gantt.addTask(task, task.parent);
    } else {
      gantt.updateTask(task.id);
    }
    gantt.hideLightbox();
  };

  const handleCancel = () => {
    const gantt = ganttRef.current;
    if (!gantt || !lightboxData) return;

    const { task } = lightboxData;
    if (task.$new) {
      gantt.deleteTask(task.id);
    }
    gantt.hideLightbox();
  };

  const handleDelete = () => {
    const gantt = ganttRef.current;
    if (!gantt || !lightboxData) return;
    gantt.deleteTask(lightboxData.id);
    gantt.hideLightbox();
  };

  return {
    lightboxData,
    handleSave,
    handleCancel,
    handleDelete
  };
}