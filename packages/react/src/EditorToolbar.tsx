import React from "react";
import type { Editor } from "@babloom/core";

export interface ToolbarItem {
  name: string;
  label: string;
  run: (editor: Editor) => void;
  isActive?: (editor: Editor) => boolean;
}

export const defaultItems: ToolbarItem[] = [
  { name: "bold", label: "B", run: (e) => e.toggleBold(), isActive: (e) => e.isActive("bold") },
  { name: "italic", label: "I", run: (e) => e.toggleItalic(), isActive: (e) => e.isActive("italic") },
  { name: "underline", label: "U", run: (e) => e.toggleUnderline(), isActive: (e) => e.isActive("underline") },
  { name: "strike", label: "S", run: (e) => e.toggleStrike(), isActive: (e) => e.isActive("strike") },
  { name: "code", label: "</>", run: (e) => e.toggleCode(), isActive: (e) => e.isActive("code") },
  { name: "h1", label: "H1", run: (e) => e.setBlock("h1"), isActive: (e) => e.isActive("heading1") },
  { name: "h2", label: "H2", run: (e) => e.setBlock("h2"), isActive: (e) => e.isActive("heading2") },
  { name: "h3", label: "H3", run: (e) => e.setBlock("h3"), isActive: (e) => e.isActive("heading3") },
  { name: "bulletList", label: "• List", run: (e) => e.toggleBulletList() },
  { name: "orderedList", label: "1. List", run: (e) => e.toggleOrderedList() },
  { name: "blockquote", label: "❝", run: (e) => e.setBlock("blockquote") },
  { name: "hr", label: "—", run: (e) => e.setHorizontalRule() },
  { name: "image", label: "Image", run: (e) => e.command("pickImage") },
  { name: "undo", label: "Undo", run: (e) => e.undo() },
  { name: "redo", label: "Redo", run: (e) => e.redo() },
];

export interface EditorToolbarProps {
  editor: Editor | null;
  items?: ToolbarItem[];
  className?: string;
}

export function EditorToolbar({ editor, items = defaultItems, className }: EditorToolbarProps) {
  if (!editor) return null;
  return (
    <div className={className} role="toolbar" aria-label="Editor toolbar">
      {items.map((item) => (
        <button
          key={item.name}
          type="button"
          data-active={item.isActive?.(editor) ? "true" : undefined}
          onMouseDown={(event) => {
            event.preventDefault();
            item.run(editor);
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
