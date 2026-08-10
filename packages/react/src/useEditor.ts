import { Editor, type EditorOptions } from "@babloom/core";
import { useEffect, useRef, useState } from "react";

/**
 * Creates a BaBloom editor instance bound to a React component lifecycle.
 * Attach the returned `ref` to a div (or use <EditorContent editor={editor} />).
 */
export function useEditor(options: Omit<EditorOptions, "element"> = {}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [, forceRender] = useState(0);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (!ref.current) return;
    const instance = new Editor({
      ...optionsRef.current,
      element: ref.current,
      onUpdate: (payload: any) => {
        optionsRef.current.onUpdate?.(payload);
        forceRender((n: number) => n + 1);
      },
      onSelectionUpdate: (payload: any) => {
        optionsRef.current.onSelectionUpdate?.(payload);
        forceRender((n: number) => n + 1);
      },
    });
    setEditor(instance);
    return () => instance.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { editor, ref };
}
