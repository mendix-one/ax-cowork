import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { InlineEditorMethods } from '../InlineEditorMethods';
export function useInlineEditors(
	ganttRef: any | null,
	openEditor: any,
	closeEditor: any,
	inlineEditors?: { [key: string]: any }
) {
	useEffect(() => {
		if (!ganttRef.current) return;
		const gantt = ganttRef.current;

		if (inlineEditors) {
			Object.entries(inlineEditors).forEach(([key, EditorComponent]) => {
				gantt.config.editor_types[key] = {
					show(id, column, config, placeholder) {
						let initialValue = null;
						const task = gantt.getTask(id);
						if(column.editor.map_to === "auto") {
							initialValue = null;
						}else{
							initialValue = task[column.editor.map_to];
						}

						return openEditor( placeholder, key, initialValue, task );
					},
					hide(node) {
						closeEditor(node);
					},
					set_value(value, id, column, node) {
						const editorRef = node._editorRef;
						editorRef.current?.setValue?.(value);
					},
					get_value(id, column, node) {
						return node._editorRef.current?.getValue();
					},
					is_changed(value, id, column, node) {
						return node._editorRef.current?.isChanged?.(value) ?? true;
					},
					is_valid(value, id, column, node) {
						return node._editorRef.current?.isValid?.() ?? true;
					},
					save(id, column, node) {
						node._editorRef.current?.save?.();
					},
					focus(node) {
						node._editorRef.current?.focus?.();
					}
				};
			});
		}

	}, [inlineEditors]);
}