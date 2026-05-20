import React, {
  useImperativeHandle,
  useEffect,
  useRef,
  useState,
  forwardRef,
  ReactElement
} from 'react';

import { GanttStatic, Gantt, Task, Link, GanttEventCallback, RouterFunction, GanttConfigOptions, GanttPlugins, GroupConfig } from './GanttCore';
export type *  from './GanttCore';
export *  from './GanttCore';
import interceptorCreator from './ganttTemplateInterceptor';
import { PortalManager } from './PortalManager';

import { useCustomLightbox } from './hooks/useCustomLightbox';

import { useMarkers, applyMarkers } from './hooks/useMarkers';
//import { useLayers } from './hooks/useLayers';
import { useSkin } from './hooks/useSkin';
import { useLocale } from './hooks/useLocale';
import { useData } from './hooks/useData';
import { useConfig } from './hooks/useConfig';
import { applyFullConfig } from './utils/configHelpers';
import { useTemplates } from './hooks/useTemplates';
import { useFilters, TaskFilter } from './hooks/useFilters';
import { useResourceFilters, ResourceFilter } from './hooks/useResourcesFilters';
import { useCalendars, applyCalendars, Calendar } from './hooks/useCalendars';
import { useGroupTasks, applyGroupTasks, shouldGroupTasks, preventTaskDisplay } from './hooks/useGroupTasks';

import { useInlineEditors } from './hooks/useInlineEditors';

export type { Calendar } from './hooks/useCalendars';

export type { TaskFilter as TaskFilteringFunction } from './hooks/useFilters';
export type { InlineEditorMethods } from './InlineEditorMethods';
export type { InlineEditorProps } from './InlineEditorManager';
import { InlineEditorsManager, ActiveInlineEditor } from './InlineEditorManager';

export type GanttConfig = Partial<GanttConfigOptions>;
import { ReactGanttTemplates as GanttTemplates } from "./types/react-gantt-templates";
export type { ReactGanttTemplates as GanttTemplates } from "./types/react-gantt-templates";

export type * from "./types/types";
import {ReactGanttRef, BatchChanges, GanttModals, Marker} from "./types/types";

export { useWorkTime } from './publicHooks/useWorkTime';
export { useResourceAssignments } from "./publicHooks/useResourceAssignments";
export { useGanttDatastore } from "./publicHooks/useGanttDatastore";

import debounceCalls from './utils/debounceCalls';

export interface ReactGanttProps {
  tasks?: Task[];
  links?: Link[];
  calendars?: Calendar[];
  resources?: any[];
  baselines?: any;
  resourceAssignments?: any[];
  markers?: Marker[];
  //taskLayers?: any[];
  plugins?: GanttPlugins;
  data?: { load?: any; save?: string|RouterFunction, batchSave?: (changes: BatchChanges) => void } | null;
  //dataProcessor?: any;
  locale?: string;
  theme?: string;
  templates?: GanttTemplates;
  config?: GanttConfig;
  filter?: TaskFilter;
  resourceFilter?: ResourceFilter;
  modals?: GanttModals;
  groupTasks?: GroupConfig | boolean | null;

  inlineEditors?: { [key: string]: any };

  // for modal-based custom lightbox (renders inside the Gantt view)
  customLightbox?: ReactElement | null;

   /**
   * a function to wrap template React elements with any needed providers.
   * needed to avoid flickering on repaint during rendertToString stage
   * 
   * For example, for MUI you might do:
   *   (element) => (
   *     <ThemeProvider theme={myTheme}>
   *       {element}
   *     </ThemeProvider>
   *   )
   */
  templateWrapper?: (element: React.ReactElement) => React.ReactElement;

  // event handlers or props
  [key: string]: any;
}
const ReactWrapper = forwardRef<any, ReactGanttProps>(function ReactGantt({
  tasks = [],
  links = [],
  calendars = null,
  resources = null,
  baselines = null,
  resourceAssignments = null,
  markers = null,
 // taskLayers = null,
  plugins = {},
  data = null,
 // dataProcessor = null,
  locale = "en",
  theme = "terrace",
  templates = {},
  config = {},
  customLightbox = null,
  inlineEditors = {},
  templateWrapper = null,
  filter = null,
  resourceFilter = null,
  modals = null,
  groupTasks = false,
  onTaskEdit,
  ...eventHandlers
}, ref) {
  const ganttContainer = useRef<HTMLDivElement>(null);
  const internalInstance = useRef<any>(null);
  // const debounceTimeout = useRef<number | undefined>(undefined);
  const templatesProxifier = useRef<any>(null);


  const previousConfig = useRef<any>(null);
  const previousTemplates = useRef<any>(null);
  const prevTasks = useRef<any>(null);
  const prevLinks = useRef<any>(null);
  const prevResources = useRef<any>(null);
  const prevResourceAssignments = useRef<any>(null);
  const prevBaselines = useRef<any>(null);
  const prevMarkers = useRef<any>(null);
  const prevFilter = useRef<TaskFilter>(null);
  const prevResourceFilter = useRef<ResourceFilter>(null);
  const prevGroupTasks = useRef<any>(null);

  const [activeEditors, setActiveEditors] = useState<ActiveInlineEditor[]>([]);


  useImperativeHandle(ref, () => ({
    get instance() {
      return internalInstance.current;
    }
  }), [internalInstance]);

  const {debounceRender, debounceInit, cancelPendingOperation} = debounceCalls(
    () => {
      const gantt = internalInstance.current;
      if (!gantt || gantt.$destroyed) return;
      gantt.init(gantt.$container.parentNode);
      
    },
    () => {
      const gantt = internalInstance.current;
      if (!gantt || gantt.$destroyed) return;
      gantt.render();
  });

  useEffect(() => {
    const gantt = Gantt.getGanttInstance();
    gantt.config.deepcopy_on_parse = true;

    internalInstance.current = gantt;
    gantt.attachEvent("onBeforeGanttRender", () => {
      cancelPendingOperation();
      return true;
    });


    templatesProxifier.current = interceptorCreator()(gantt, templateWrapper, ref);

    gantt.plugins(plugins);

    if (templates) {
      previousTemplates.current = templates;
      Object.keys(templates).forEach((templateName) => {
        gantt.templates[templateName] = templates[templateName];
      });
    }

    Object.entries(eventHandlers).forEach(([eventName, handler]) => {
      if (typeof handler === "function") {
        gantt.attachEvent(eventName as keyof GanttEventCallback, handler);
      }
    });


    applyFullConfig(gantt, config, previousConfig);

    applyCalendars(gantt, calendars);
    applyMarkers(gantt, markers, prevMarkers);


    const willGroupTasks = () => shouldGroupTasks(groupTasks, prevGroupTasks);
    const suppressTaskDisplay = (callback) => preventTaskDisplay(gantt, callback);

    if(modals){
      if(modals.onBeforeTaskDelete){

        gantt._delete_task_confirm = function ({task, message, title, callback}){
          modals.onBeforeTaskDelete({task, callback, message, title, ganttInstance: gantt});
        };
      }
      if(modals.onBeforeLinkDelete){
        gantt._delete_link_confirm = function({link, message, title, callback}){
          modals.onBeforeLinkDelete({link, callback, message, title, ganttInstance: gantt});
        };
      }
    }

    if (ganttContainer.current) {
      gantt.init(ganttContainer.current);
    }

    if (data) {
      
      if(data.load){
        if(typeof data.load === "function"){
          const result = data.load(gantt);
          if(result && result.then){
            result.then((data) => {
              if(willGroupTasks()){
                suppressTaskDisplay(() => {
                  gantt.parse(data)
                });
              }else{
                gantt.parse(data);
              }
              applyGroupTasks(internalInstance, prevGroupTasks, groupTasks);
            });
          } else if (result) {
            if(willGroupTasks()){
              suppressTaskDisplay(() => {
                gantt.parse(result)
              });
            }else{
              gantt.parse(data);
            }
            applyGroupTasks(internalInstance, prevGroupTasks, groupTasks);
          }
        }else if (data.load){
          gantt.load(data.load);
        }
      }
      
      if(typeof data.batchSave === "function"){
        let changesQueue = {};
        const changesCallback = (changes) => data.batchSave(changes);
        let timeoutId = null;
        gantt.createDataProcessor(function(entity, action, data, id){
    
          const collection = entity + 's';
          if(!changesQueue[collection]){
            changesQueue[collection] = {};
          }
          if(data["!nativeeditor_status"]){
            delete data["!nativeeditor_status"];
          }

          if (changesQueue[collection][id]) {
            const existing = changesQueue[collection][id];
            if (existing.action === "create") {
              if(action === "update"){
                existing.data = data;
              } else if (action === "delete"){
                delete changesQueue[collection][id];
              }
              
            } else if (existing.action === "update") {
              existing.data = data;
            } else {
              changesQueue[collection][id] = { entity, action, data, id };
            }
          } else {
            changesQueue[collection][id] = { entity, action, data, id };
          }
          clearTimeout(timeoutId);
          timeoutId = setTimeout(function(){
        
            const finalChanges = {};
            for (const entity in changesQueue) {
              finalChanges[entity] = Object.values(changesQueue[entity]);
            }
            changesCallback(finalChanges);
            changesQueue = {};
          }, 20);
        } as RouterFunction);
      }else if(data.save){
        gantt.createDataProcessor(data.save);
      }
    }

    return () => {
      cancelPendingOperation();
      internalInstance.current?.destructor();
      internalInstance.current = null;
      templatesProxifier.current.unmountReactComponents();

      previousConfig.current = null;
      previousTemplates.current = null;
      prevTasks.current = null;
      prevLinks.current = null;
      prevMarkers.current = null;
      prevResources.current = null;
      prevResourceAssignments.current = null;
      prevBaselines.current = null;
      prevFilter.current = null;
      prevResourceFilter.current = null;
      prevGroupTasks.current = null;
      setActiveEditors([]);

    };
  }, []);

  const {
    lightboxData,
    handleSave,
    handleCancel,
    handleDelete
  } = useCustomLightbox(internalInstance, customLightbox);

  useConfig(internalInstance, previousConfig, config, debounceRender, debounceInit);
  useTemplates(internalInstance, previousTemplates, templates, debounceRender);

  useLocale(internalInstance, locale, debounceRender);
  useSkin(internalInstance, theme, debounceRender);
  useData(
    internalInstance, 
    prevTasks, 
    prevLinks,
    prevResources,
    prevResourceAssignments,
    prevBaselines,
    prevGroupTasks,
    tasks,
    links, 
    resources, 
    resourceAssignments, 
    baselines,
    groupTasks,
    debounceRender);

  useGroupTasks(internalInstance, prevGroupTasks, groupTasks);
  useMarkers(internalInstance, prevMarkers, markers, debounceRender);
  //useLayers(internalInstance, taskLayers);
  useCalendars(internalInstance, calendars);

  useFilters(internalInstance, prevFilter, filter, debounceRender);
  useResourceFilters(internalInstance, prevResourceFilter, resourceFilter, debounceRender);

  useInlineEditors(internalInstance, openEditor, closeEditor, inlineEditors);
  function openEditor(placeholder: HTMLElement, editorType: string, initialValue: any, task: Task) {
    return new Promise<void>((resolve) => {
      const id = `inline-editor-${Date.now()}-${Math.random()}`;
      setActiveEditors(editors => [
        ...editors,
        { id, placeholder, editorType, initialValue, task, onMount: resolve }
      ]);
    });
  }
  
  function closeEditor(placeholder: HTMLElement) {
    setActiveEditors(editors =>
      editors.filter(e => e.placeholder !== placeholder)
    );
  }

  return (
    <div style={{ height: '100%', minHeight: '200px' }}>
      <div ref={ganttContainer} style={{ width: '100%', height: '100%' }} />
      <PortalManager />
      {customLightbox && lightboxData && (
        React.cloneElement(customLightbox, {
          data: lightboxData.task,
          onSave: handleSave,
          onCancel: handleCancel,
          onDelete: handleDelete
        })
      )}

      <InlineEditorsManager
        activeEditors={activeEditors}
        inlineEditors={inlineEditors}

        closeEditor={closeEditor}
        ganttInstance={internalInstance.current}
      />
    </div>
  );
});

export default ReactWrapper;
