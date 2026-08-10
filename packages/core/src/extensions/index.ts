import type { Extension, UploadHandler, UploadResult } from "../types";

/* -------------------------------------------------------------- starter kit */

export function StarterKit(): Extension {
  return {
    name: "starterKit",
    tags: ["p", "h1", "h2", "h3", "ul", "ol", "li", "blockquote", "hr"],
    keymap: {
      "Mod-b": (editor) => editor.toggleBold(),
      "Mod-i": (editor) => editor.toggleItalic(),
      "Mod-u": (editor) => editor.toggleUnderline(),
      "Mod-Shift-x": (editor) => editor.toggleStrike(),
      "Mod-e": (editor) => editor.toggleCode(),
      "Mod-Alt-1": (editor) => editor.setBlock("h1"),
      "Mod-Alt-2": (editor) => editor.setBlock("h2"),
      "Mod-Alt-3": (editor) => editor.setBlock("h3"),
      "Mod-Alt-0": (editor) => editor.setBlock("p"),
      "Mod-Shift-8": (editor) => editor.toggleBulletList(),
      "Mod-Shift-7": (editor) => editor.toggleOrderedList(),
      "Mod-Shift-b": (editor) => editor.setBlock("blockquote"),
    },
    inputRules: [
      { match: /^#\s(.*)$/, handler: (editor) => replaceBlock(editor, "h1", 2) },
      { match: /^##\s(.*)$/, handler: (editor) => replaceBlock(editor, "h2", 3) },
      { match: /^###\s(.*)$/, handler: (editor) => replaceBlock(editor, "h3", 4) },
      { match: /^>\s(.*)$/, handler: (editor) => replaceBlock(editor, "blockquote", 2) },
      { match: /^[-*]\s(.*)$/, handler: (editor) => replaceList(editor, "bullet", 2) },
      { match: /^1\.\s(.*)$/, handler: (editor) => replaceList(editor, "ordered", 3) },
    ],
  };
}

function stripPrefix(editor: any, prefixLength: number) {
  const block = editor.currentBlock();
  if (!block) return;
  const text = block.textContent ?? "";
  block.textContent = text.slice(prefixLength);
  placeCaretAtEnd(block);
}

function replaceBlock(editor: any, tag: string, prefixLength: number) {
  stripPrefix(editor, prefixLength);
  editor.setBlock(tag);
}

function replaceList(editor: any, kind: "bullet" | "ordered", prefixLength: number) {
  stripPrefix(editor, prefixLength);
  if (kind === "bullet") editor.toggleBulletList();
  else editor.toggleOrderedList();
}

function placeCaretAtEnd(el: HTMLElement) {
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const selection = document.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

/* -------------------------------------------------------------------- link */

export function LinkExtension(options: { openOnClick?: boolean } = {}): Extension {
  return {
    name: "link",
    tags: ["a"],
    commands: {
      setLink: (editor, href: string) => editor.setLink(href),
      unsetLink: (editor) => editor.unsetLink(),
    },
    onCreate: (editor) => {
      if (!options.openOnClick) return;
      editor.element?.addEventListener("click", (event: MouseEvent) => {
        const anchor = (event.target as HTMLElement)?.closest("a");
        if (anchor?.href) window.open(anchor.href, "_blank", "noopener");
      });
    },
  };
}

/* ------------------------------------------------------------- placeholder */

export function PlaceholderExtension(options: { text?: string } = {}): Extension {
  const text = options.text ?? "Write something…";
  return {
    name: "placeholder",
    onCreate: (editor) => {
      const sync = () => {
        if (!editor.element) return;
        editor.element.setAttribute("data-placeholder", text);
        editor.element.toggleAttribute("data-empty", editor.isEmpty());
      };
      sync();
      editor.on("update", sync);
      editor.on("blur", sync);
      editor.on("focus", sync);
    },
  };
}

/* ------------------------------------------------------------------- image */

export interface ImageOptions {
  accept?: string[];
  maxSize?: number;
  upload: UploadHandler;
  onError?: (error: Error) => void;
}

export function ImageExtension(options: ImageOptions): Extension {
  const accept = options.accept ?? ["image/png", "image/jpeg", "image/webp", "image/gif"];
  const maxSize = options.maxSize ?? 5 * 1024 * 1024;

  const validate = (file: File) => {
    if (!accept.includes(file.type)) {
      throw new Error(`Unsupported file type: ${file.type}. Allowed: ${accept.join(", ")}`);
    }
    if (file.size > maxSize) {
      throw new Error(`File too large: max ${(maxSize / 1024 / 1024).toFixed(1)} MB`);
    }
  };

  const uploadAndInsert = async (editor: any, file: File) => {
    try {
      validate(file);
      editor.emit("image:upload:start", { file });
      const result: UploadResult = await options.upload(file);
      editor.insertImage({ src: result.src, alt: result.alt ?? file.name, width: result.width });
      editor.emit("image:upload:done", { file, result });
    } catch (error) {
      options.onError?.(error as Error);
      editor.emit("image:upload:error", { file, error });
    }
  };

  return {
    name: "image",
    tags: ["img"],
    commands: {
      uploadImage: (editor, file: File) => {
        void uploadAndInsert(editor, file);
      },
      pickImage: (editor) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = accept.join(",");
        input.onchange = () => {
          const file = input.files?.[0];
          if (file) void uploadAndInsert(editor, file);
        };
        input.click();
      },
      setImageAlt: (editor, alt: string) => {
        const img = editor.element?.querySelector("img[data-selected]") as HTMLImageElement | null;
        if (img) img.alt = alt;
      },
      deleteImage: (editor) => {
        editor.element?.querySelector("img[data-selected]")?.remove();
      },
    },
    onCreate: (editor) => {
      const element = editor.element as HTMLElement | null;
      if (!element) return;
      element.addEventListener("click", (event) => {
        element.querySelectorAll("img[data-selected]").forEach((img) => img.removeAttribute("data-selected"));
        const target = event.target as HTMLElement;
        if (target.tagName === "IMG") target.setAttribute("data-selected", "true");
      });
      element.addEventListener("drop", (event: DragEvent) => {
        const file = event.dataTransfer?.files?.[0];
        if (!file) return;
        event.preventDefault();
        void uploadAndInsert(editor, file);
      });
      element.addEventListener("paste", (event: ClipboardEvent) => {
        const file = Array.from(event.clipboardData?.files ?? [])[0];
        if (!file) return;
        event.preventDefault();
        void uploadAndInsert(editor, file);
      });
    },
  };
}
