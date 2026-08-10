import React from "react";
import type { Editor } from "@babloom/core";
import type { RefObject } from "react";

export interface EditorContentProps {
  editor?: Editor | null;
  editorRef: RefObject<HTMLDivElement | null>;
  className?: string;
}

export function EditorContent({ editorRef, className }: EditorContentProps) {
  return <div ref={editorRef} className={className} />;
}
