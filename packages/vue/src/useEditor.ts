import { Editor, type EditorOptions } from "@tlob/babloom-core";
import { onBeforeUnmount, onMounted, ref, shallowRef, triggerRef } from "vue";

export function useEditor(options: Omit<EditorOptions, "element"> = {}) {
  const element = ref<HTMLElement | null>(null);
  const editor = shallowRef<Editor | null>(null);

  onMounted(() => {
    if (!element.value) return;
    editor.value = new Editor({
      ...options,
      element: element.value,
      onUpdate: (payload: any) => {
        options.onUpdate?.(payload);
        triggerRef(editor);
      },
      onSelectionUpdate: (payload: any) => {
        options.onSelectionUpdate?.(payload);
        triggerRef(editor);
      },
    });
  });

  onBeforeUnmount(() => {
    editor.value?.destroy();
    editor.value = null;
  });

  return { editor, element };
}
