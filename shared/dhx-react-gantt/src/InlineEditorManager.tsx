import React from 'react'
import ReactDOM from 'react-dom'
import { GanttStatic, Task } from '@dhx/gantt'
import { InlineEditorMethods } from './InlineEditorMethods'

export interface ActiveInlineEditor {
  id: string
  placeholder: HTMLElement
  editorType: string
  initialValue: any
  task: Task
  onMount?: () => void
}

export interface EditorComponentProps {
  initialValue: any
  task: Task
  save: () => void
  cancel: () => void
  ganttInstance: GanttStatic
}

export interface InlineEditorProps extends EditorComponentProps {
  ref?: React.Ref<InlineEditorMethods>
}

export interface PortalBridgeInlineEditorProps extends ActiveInlineEditor {
  ganttInstance: GanttStatic
  save: () => void
  cancel: () => void
}

interface PortalBridgeProps {
  editor: PortalBridgeInlineEditorProps
  EditorComponent: React.ComponentType<InlineEditorProps>
  onUnmount: () => void
}

const PortalBridge: React.FC<PortalBridgeProps> = function InlineEditorBridge({ editor, EditorComponent, onUnmount }) {
  const { placeholder, initialValue, onMount, task, save, cancel, ganttInstance } = editor
  const editorRef = React.useRef<InlineEditorMethods>(null)

  React.useEffect(() => {
    ;(placeholder as any)._editorRef = editorRef
    onMount?.()

    if (typeof (placeholder as any)._onReMount === 'function') {
      ;(placeholder as any)._onReMount()
    }
    return () => {
      setTimeout(() => {
        if (!placeholder.isConnected) {
          delete (placeholder as any)._editorRef
          onUnmount()
        }
      }, 0)
    }
  }, [onUnmount])

  return ReactDOM.createPortal(
    <EditorComponent ref={editorRef} initialValue={initialValue} task={task} save={save} cancel={cancel} ganttInstance={ganttInstance} />,
    placeholder,
  )
}

interface InlineEditorsManagerProps {
  activeEditors: ActiveInlineEditor[]
  inlineEditors: { [key: string]: any }
  closeEditor: (placeholder: HTMLElement) => void
  ganttInstance: GanttStatic
}

export const InlineEditorsManager: React.FC<InlineEditorsManagerProps> = React.memo(({ activeEditors, inlineEditors, closeEditor, ganttInstance }) => {
  return (
    <>
      {activeEditors.map((editor) => (
        <PortalBridge
          key={editor.id}
          editor={{
            ...editor,
            ganttInstance: ganttInstance,
            save: () => setTimeout(() => ganttInstance.ext.inlineEditors.save(), 0), // ensure save is called after component state is recalculated
            cancel: () => ganttInstance.ext.inlineEditors.hide(),
          }}
          EditorComponent={inlineEditors[editor.editorType]}
          onUnmount={() => closeEditor(editor.placeholder)}
        />
      ))}
    </>
  )
})
