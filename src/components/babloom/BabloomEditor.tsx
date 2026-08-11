import {
  ImageExtension,
  LinkExtension,
  PlaceholderExtension,
  StarterKit,
  type Editor,
  type UploadResult,
} from "@babloom/core";
import { useEditor } from "@babloom/react";
import {
  Bold,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from "lucide-react";
import React from "react";
import { useMemo, useState } from "react";

/** Demo upload handler: turns the picked file into a data URL (no backend needed). */
function localUpload(file: File): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ src: String(reader.result), alt: file.name });
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

const initialContent = `<h2>Welcome to BaBloom</h2>
<p>A framework-agnostic rich-text editor written in <strong>TypeScript</strong>. Select some text to format it, or try Markdown shortcuts like <code># </code> and <code>- </code>.</p>
<ul><li>Bold, italic, underline, strike, inline code</li><li>Headings, lists, quotes, rules</li><li>Image upload with your own handler</li></ul>`;

export function BabloomEditor({
  onChange,
  content = initialContent,
}: {
  onChange?: (payload: { html: string; json: unknown }) => void;
  content?: string;
}) {
  const [error, setError] = useState<string | null>(null);

  const extensions = useMemo(
    () => [
      StarterKit(),
      LinkExtension({ openOnClick: false }),
      PlaceholderExtension({ text: "Start writing…" }),
      ImageExtension({
        accept: ["image/png", "image/jpeg", "image/webp", "image/gif"],
        maxSize: 5 * 1024 * 1024,
        upload: localUpload,
        onError: (err: { message: any; }) => setError(err.message),
      }),
    ],
    [],
  );

  const { editor, ref } = useEditor({
    content,
    extensions,
    onUpdate: ({ editor: instance }: { editor: Editor }) =>
      onChange?.({ html: instance.getHTML(), json: instance.getJSON() }),
  });

  const groups = [
    [
      { icon: Bold, label: "Bold", run: () => editor?.toggleBold(), active: "bold" },
      { icon: Italic, label: "Italic", run: () => editor?.toggleItalic(), active: "italic" },
      { icon: Underline, label: "Underline", run: () => editor?.toggleUnderline(), active: "underline" },
      { icon: Strikethrough, label: "Strike", run: () => editor?.toggleStrike(), active: "strike" },
      { icon: Code2, label: "Inline code", run: () => editor?.toggleCode(), active: "code" },
    ],
    [
      { icon: Heading1, label: "Heading 1", run: () => editor?.setBlock("h1"), active: "heading1" },
      { icon: Heading2, label: "Heading 2", run: () => editor?.setBlock("h2"), active: "heading2" },
      { icon: Heading3, label: "Heading 3", run: () => editor?.setBlock("h3"), active: "heading3" },
      { icon: Quote, label: "Blockquote", run: () => editor?.setBlock("blockquote"), active: "blockquote" },
    ],
    [
      { icon: List, label: "Bullet list", run: () => editor?.toggleBulletList(), active: "bulletList" },
      { icon: ListOrdered, label: "Ordered list", run: () => editor?.toggleOrderedList(), active: "orderedList" },
      { icon: Minus, label: "Divider", run: () => editor?.setHorizontalRule(), active: "" },
    ],
    [
      {
        icon: Link2,
        label: "Link",
        run: () => {
          const href = window.prompt("Link URL", "https://");
          if (href) editor?.setLink(href);
        },
        active: "link",
      },
      { icon: ImagePlus, label: "Insert image", run: () => editor?.command("pickImage"), active: "" },
    ],
    [
      { icon: Undo2, label: "Undo", run: () => editor?.undo(), active: "" },
      { icon: Redo2, label: "Redo", run: () => editor?.redo(), active: "" },
    ],
  ];

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex flex-wrap items-center gap-1 border-b bg-muted/40 p-1.5">
        {groups.map((group, groupIndex) => (
          <div key={groupIndex} className="flex items-center gap-0.5 pr-1.5 not-last:border-r">
            {group.map((item) => {
              const Icon = item.icon;
              const isActive = item.active ? Boolean(editor?.isActive(item.active)) : false;
              return (
                <button
                  key={item.label}
                  type="button"
                  title={item.label}
                  aria-label={item.label}
                  aria-pressed={isActive}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    setError(null);
                    item.run();
                  }}
                  className={`inline-flex size-8 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground ${
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="size-4" />
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div ref={ref} className="px-5 py-4 text-[15px]" />
      {error ? (
        <p className="border-t bg-destructive/10 px-5 py-2 text-sm text-destructive">{error}</p>
      ) : null}
    </div>
  );
}
