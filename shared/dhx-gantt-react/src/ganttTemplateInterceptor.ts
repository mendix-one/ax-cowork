import React, {ReactElement} from 'react';
import ReactDOM from "react-dom";
import * as ReactDOMClient from "react-dom/client";

import { PortalRegistry } from './PortalRegistry';


function renderToString(element: ReactElement): string {
  if (ReactDOMClient.createRoot) {
    // React 18+
    const container = document.createElement("div");
    const root = ReactDOMClient.createRoot(container);
    if (ReactDOM.flushSync) {
      ReactDOM.flushSync(() => root.render(element));
    } else {
      root.render(element);
    }
    const html = container.innerHTML;
    queueMicrotask(() => root.unmount());

    return html;
  }

  // React 16/17
  const container = document.createElement("div");
  ReactDOM.render(element, container);
  const html = container.innerHTML;
  queueMicrotask(() => ReactDOM.unmountComponentAtNode(container));
  return html;
}

export default function createGanttTemplateInterceptor() {
  let reactComponentId = 0;
  const reactComponentIdSeed = Math.random();
  return function ganttTemplateInterceptor(ganttInstance, templateWrapper: (el: React.ReactElement) => React.ReactElement, imperativeRef) {
    const mountedComponents = new Map();

    function createId(){
      return `${reactComponentIdSeed}-${reactComponentId++}`;
    }

    const pendingRegistrations: { id: string; element: React.ReactElement }[] = [];
    let rafScheduled = false;
    function schedulePortalRegistration(throttledCleanup: () => void) {
      if (!rafScheduled) {
        rafScheduled = true;
        requestAnimationFrame(() => {
          pendingRegistrations.forEach(({ id, element }) => {
            PortalRegistry.registerPortal(id, element);
          });

          pendingRegistrations.length = 0;
          rafScheduled = false;
          throttledCleanup();
        });
      }
    }

    function renderWithoutLayoutEffectWarning(renderFunction: () => string): string {
      const originalConsoleError = console.error;
      console.error = (...args: any[]) => {
        if (
          typeof args[0] === 'string' &&
          args[0].includes('flushSync was called from inside a lifecycle method. React cannot flush ')
        ) {
          return;
        }
        originalConsoleError(...args);
      };
    
      let result: string;
      try {
        result = renderFunction();
      } finally {
        console.error = originalConsoleError;
      }
      return result;
    }
    


    const beforeGanttRender = ganttInstance.attachEvent('onBeforeGanttRender', () => {
      const originalTemplates = { ...ganttInstance.templates };

      Object.keys(originalTemplates).forEach((templateName) => {
        const originalTemplateFunction = originalTemplates[templateName];
        if (originalTemplateFunction) {
          ganttInstance.templates[templateName] = interceptTemplate(originalTemplateFunction);
        }
      });

      ganttInstance.config.scales.forEach(s => {
        if (typeof s.format === 'function') {
          s.format = interceptTemplate(s.format);
        }
      });
      ganttInstance.config.columns.forEach(c => {
        if (c.template) {
          c.template = interceptTemplate(c.template);
        }
      });

      if(ganttInstance.$layout){
        ganttInstance.$layout._eachChild((cell) => {
          if(cell.$config.templates) {
            Object.keys(cell.$config.templates).forEach((templateName) => {
              const originalTemplateFunction = cell.$config.templates[templateName];
              if (originalTemplateFunction) {
                cell.$config.templates[templateName] = interceptTemplate(originalTemplateFunction);
              }
            });
          }
          if(cell.$config.config) {
            cell.$config.config.scales.forEach(s => {
              if (typeof s.format === 'function') {
                s.format = interceptTemplate(s.format);
              }
            });
            cell.$config.config.columns.forEach(c => {
              if (c.template) {
                c.template = interceptTemplate(c.template);
              }
            });
          }
        });
      }


    });

    ganttInstance.config.external_render = { 
      isElement: (element) => {
          return React.isValidElement(element);
      },
      renderElement: (element, container) => {
        container.dataset.isStatic = "true";
        if(!container.id){
          container.id = createId();
        }

        const html = renderWithoutLayoutEffectWarning(() =>
          renderToString(element)
        );
        container.innerHTML = html;
        PortalRegistry.registerPortal(container.id, element);
      }
  };


    function interceptTemplate(originalTemplateFunction) {

      if (originalTemplateFunction.isIntercepted) {
        return originalTemplateFunction;
      }
      function interceptedFunction(...args) {
        if(imperativeRef && !imperativeRef.current){
          return "";
        }
        const result = originalTemplateFunction.apply(this, args);
        return renderReactTemplate(result, args);
      }
      interceptedFunction.isIntercepted = true;

      return interceptedFunction;
    }

    function throttle(func, delay) {
      let lastCall = 0;

      return function (...args) {
        const now = new Date().getTime();

        if (now - lastCall >= delay) {
          lastCall = now;
          func.apply(this, args);
        }
      };
    }

   // const throttledCleanup = throttle(cleanupReactComponents, 100);
   function throttledCleanupBase() {
    const allPortals = PortalRegistry.getAllPortals(); 
  
    for (const [id, element] of allPortals) {
      const container = document.getElementById(id);
      if (!container || !container.isConnected) {
        PortalRegistry.unregisterPortal(id);
      }
    }
  }
  const throttledCleanup = throttle(throttledCleanupBase, 100);

    function renderReactTemplate(result, args) {
      if (React.isValidElement(result)) {
        const id = `react-component-${createId()}`;

        const elementForPlaceholder = templateWrapper  ? templateWrapper(result) : result;
        // suppress the useLayoutEffect warning during static rendering.
        // hopefully temporary fix won't be needed in future versions of react
        // currently needed to prevent console warning while rendering placeholders for MUI elements
        const html = renderWithoutLayoutEffectWarning(() =>
          renderToString(elementForPlaceholder)
        );

        const placeholder = `<div id="${id}" data-is-static="true">${html}</div>`;

        pendingRegistrations.push({ id, element: result });
        schedulePortalRegistration(throttledCleanup);

        return placeholder;
      } else {
        return result;
      }
    }

    function unmountReactComponents() {
      mountedComponents.forEach(({ root }, id) => {
        root.unmount();
        mountedComponents.delete(id);
      });
    }

    const beforeGanttRender2 = ganttInstance.attachEvent('onBeforeGanttRender', () => {
      unmountReactComponents();
    });

    ganttInstance.attachEvent("onDestroy", () => {
      ganttInstance.detachEvent(beforeGanttRender);
      ganttInstance.detachEvent(beforeGanttRender2);
      unmountReactComponents();
    });

    return {

      unmountReactComponents,
    };

  };
}
