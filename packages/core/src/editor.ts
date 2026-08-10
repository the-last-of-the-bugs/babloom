import { htmlToJSON, jsonToHTML, jsonToText } from "./serialization";
import type { BabloomDoc, Extension, InputRule, UploadHandler } from "./types";

export interface EditorOptions {
  element?: HTMLElement | null;
  /** initial content, HTML string or a Babloom JSON document */
  content?: string | BabloomDoc;
  extensions?: Extension[];
  editable?: boolean;
  autofocus?: boolean;
  onUpdate?: (payload: { editor: Editor }) => void;
  onSelectionUpdate?: (payload: { editor: Editor }) => void;
  onFocus?: (payload: { editor: Editor }) => void;
  onBlur?: (payload: { editor: Editor }) => void;
}

const HISTORY_LIMIT = 100;

function isMac() {
  return typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
}

export class Editor {
  element: HTMLElement | null = null;
  extensions: Extension[] = [];
  options: EditorOptions;
  uploadHandler: UploadHandler | null = null;

  private undoStack: string[] = [];
  private redoStack: string[] = [];
  private lastSnapshot = "";
  private listeners = new Map<string, Set<(payload: any) => void>>();
  private destroyed = false;

  constructor(options: EditorOptions = {}) {
    this.options = options;
    this.extensions = options.extensions ?? [];
    if (options.element) this.mount(options.element);
  }

  /* ---------------------------------------------------------------- mount */

  mount(element: HTMLElement) {
    if (this.element) this.unmount();
    this.element = element;
    element.setAttribute("contenteditable", String(this.options.editable !== false));
    element.setAttribute("role", "textbox");
    element.setAttribute("aria-multiline", "true");
    element.classList.add("babloom-content");

    const initial = this.options.content ?? "<p></p>";
    element.innerHTML = typeof initial === "string" ? initial || "<p></p>" : jsonToHTML(initial);
    this.lastSnapshot = element.innerHTML;

    element.addEventListener("input", this.handleInput);
    element.addEventListener("keydown", this.handleKeydown);
    element.addEventListener("focus", this.handleFocus);
    element.addEventListener("blur", this.handleBlur);
    document.addEventListener("selectionchange", this.handleSelectionChange);

    this.extensions.forEach((ext) => ext.onCreate?.(this));
    if (this.options.autofocus) this.focus();
    return this;
  }

  unmount() {
    const element = this.element;
    if (!element) return;
    element.removeEventListener("input", this.handleInput);
    element.removeEventListener("keydown", this.handleKeydown);
    element.removeEventListener("focus", this.handleFocus);
    element.removeEventListener("blur", this.handleBlur);
    document.removeEventListener("selectionchange", this.handleSelectionChange);
    this.element = null;
  }

  destroy() {
    this.extensions.forEach((ext) => ext.onDestroy?.(this));
    this.unmount();
    this.listeners.clear();
    this.destroyed = true;
  }

  get isDestroyed() {
    return this.destroyed;
  }

  /* --------------------------------------------------------------- events */

  on(event: string, handler: (payload: any) => void) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(handler);
    return () => this.off(event, handler);
  }

  off(event: string, handler: (payload: any) => void) {
    this.listeners.get(event)?.delete(handler);
  }

  emit(event: string, payload: any = { editor: this }) {
    this.listeners.get(event)?.forEach((handler) => handler(payload));
  }

  /* -------------------------------------------------------------- handlers */

  private handleFocus = () => {
    this.options.onFocus?.({ editor: this });
    this.emit("focus");
  };

  private handleBlur = () => {
    this.options.onBlur?.({ editor: this });
    this.emit("blur");
  };

  private handleSelectionChange = () => {
    if (!this.element) return;
    const selection = document.getSelection();
    if (!selection || !selection.anchorNode) return;
    if (!this.element.contains(selection.anchorNode)) return;
    this.options.onSelectionUpdate?.({ editor: this });
    this.emit("selection");
  };

  private handleInput = () => {
    this.runInputRules();
    this.commit();
  };

  private handleKeydown = (event: KeyboardEvent) => {
    const mod = isMac() ? event.metaKey : event.ctrlKey;
    const parts: string[] = [];
    if (mod) parts.push("Mod");
    if (event.shiftKey) parts.push("Shift");
    if (event.altKey) parts.push("Alt");
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    parts.push(key);
    const combo = parts.join("-");

    if (combo === "Mod-z") {
      event.preventDefault();
      this.undo();
      return;
    }
    if (combo === "Mod-Shift-z" || combo === "Mod-y") {
      event.preventDefault();
      this.redo();
      return;
    }

    for (const ext of this.extensions) {
      const handler = ext.keymap?.[combo];
      if (handler && handler(this) !== false) {
        event.preventDefault();
        this.commit();
        return;
      }
    }
  };

  /* -------------------------------------------------------------- history */

  private commit() {
    if (!this.element) return;
    const html = this.element.innerHTML;
    if (html === this.lastSnapshot) return;
    this.undoStack.push(this.lastSnapshot);
    if (this.undoStack.length > HISTORY_LIMIT) this.undoStack.shift();
    this.redoStack = [];
    this.lastSnapshot = html;
    this.options.onUpdate?.({ editor: this });
    this.emit("update");
  }

  undo() {
    if (!this.element || !this.undoStack.length) return this;
    const previous = this.undoStack.pop()!;
    this.redoStack.push(this.element.innerHTML);
    this.element.innerHTML = previous;
    this.lastSnapshot = previous;
    this.options.onUpdate?.({ editor: this });
    this.emit("update");
    return this;
  }

  redo() {
    if (!this.element || !this.redoStack.length) return this;
    const next = this.redoStack.pop()!;
    this.undoStack.push(this.element.innerHTML);
    this.element.innerHTML = next;
    this.lastSnapshot = next;
    this.options.onUpdate?.({ editor: this });
    this.emit("update");
    return this;
  }

  can(action: "undo" | "redo") {
    return action === "undo" ? this.undoStack.length > 0 : this.redoStack.length > 0;
  }

  /* ---------------------------------------------------------- input rules */

  private runInputRules() {
    const rules: InputRule[] = this.extensions.flatMap((ext) => ext.inputRules ?? []);
    if (!rules.length) return;
    const block = this.currentBlock();
    if (!block) return;
    const text = block.textContent ?? "";
    for (const rule of rules) {
      const match = text.match(rule.match);
      if (match) {
        rule.handler(this, match);
        return;
      }
    }
  }

  /* ------------------------------------------------------------- commands */

  focus() {
    this.element?.focus();
    return this;
  }

  exec(command: string, value?: string) {
    if (!this.element) return this;
    this.element.focus();
    document.execCommand("styleWithCSS", false, "false");
    document.execCommand(command, false, value);
    this.commit();
    return this;
  }

  currentBlock(): HTMLElement | null {
    const selection = document.getSelection();
    if (!selection || !selection.anchorNode || !this.element) return null;
    let node: Node | null = selection.anchorNode;
    while (node && node !== this.element) {
      if (node.nodeType === 1 && /^(P|H1|H2|H3|LI|BLOCKQUOTE|DIV)$/.test((node as HTMLElement).tagName)) {
        return node as HTMLElement;
      }
      node = node.parentNode;
    }
    return null;
  }

  setBlock(tag: "p" | "h1" | "h2" | "h3" | "blockquote") {
    return this.exec("formatBlock", `<${tag}>`);
  }

  toggleBold() {
    return this.exec("bold");
  }
  toggleItalic() {
    return this.exec("italic");
  }
  toggleUnderline() {
    return this.exec("underline");
  }
  toggleStrike() {
    return this.exec("strikeThrough");
  }
  toggleBulletList() {
    return this.exec("insertUnorderedList");
  }
  toggleOrderedList() {
    return this.exec("insertOrderedList");
  }
  setHorizontalRule() {
    return this.exec("insertHorizontalRule");
  }
  setLink(href: string) {
    return href ? this.exec("createLink", href) : this.exec("unlink");
  }
  unsetLink() {
    return this.exec("unlink");
  }
  clearFormatting() {
    return this.exec("removeFormat");
  }

  toggleCode() {
    const selection = document.getSelection();
    if (!selection || selection.isCollapsed || !this.element) return this;
    if (this.isActive("code")) {
      const node = selection.anchorNode?.parentElement?.closest("code");
      if (node?.parentNode) {
        while (node.firstChild) node.parentNode.insertBefore(node.firstChild, node);
        node.parentNode.removeChild(node);
      }
    } else {
      const range = selection.getRangeAt(0);
      const code = document.createElement("code");
      code.appendChild(range.extractContents());
      range.insertNode(code);
    }
    this.commit();
    return this;
  }

  insertHTML(html: string) {
    return this.exec("insertHTML", html);
  }

  insertImage(attrs: { src: string; alt?: string; width?: number }) {
    const width = attrs.width ? ` width="${attrs.width}"` : "";
    return this.insertHTML(
      `<img src="${attrs.src}" alt="${attrs.alt ?? ""}"${width} class="babloom-image">`,
    );
  }

  command(name: string, ...args: any[]) {
    for (const ext of this.extensions) {
      const fn = ext.commands?.[name];
      if (fn) {
        fn(this, ...args);
        this.commit();
        return this;
      }
    }
    return this;
  }

  /* ---------------------------------------------------------------- state */

  isActive(name: string): boolean {
    if (typeof document === "undefined" || !this.element) return false;
    const queryMap: Record<string, string> = {
      bold: "bold",
      italic: "italic",
      underline: "underline",
      strike: "strikeThrough",
      bulletList: "insertUnorderedList",
      orderedList: "insertOrderedList",
    };
    if (queryMap[name]) {
      try {
        return document.queryCommandState(queryMap[name]);
      } catch {
        return false;
      }
    }
    const selection = document.getSelection();
    const anchor = selection?.anchorNode;
    if (!anchor || !this.element.contains(anchor)) return false;
    const el = anchor.nodeType === 1 ? (anchor as HTMLElement) : anchor.parentElement;
    const selectorMap: Record<string, string> = {
      paragraph: "p",
      heading1: "h1",
      heading2: "h2",
      heading3: "h3",
      blockquote: "blockquote",
      code: "code",
      link: "a",
    };
    const selector = selectorMap[name];
    if (!selector) return false;
    return Boolean(el?.closest(selector));
  }

  setEditable(editable: boolean) {
    this.element?.setAttribute("contenteditable", String(editable));
    return this;
  }

  getHTML(): string {
    return this.element?.innerHTML ?? "";
  }

  getJSON(): BabloomDoc {
    return htmlToJSON(this.getHTML());
  }

  getText(): string {
    return jsonToText(this.getJSON());
  }

  isEmpty(): boolean {
    return this.getText().trim().length === 0 && !this.getHTML().includes("<img");
  }

  setContent(content: string | BabloomDoc) {
    if (!this.element) return this;
    this.element.innerHTML = typeof content === "string" ? content : jsonToHTML(content);
    this.commit();
    return this;
  }
}

export function createEditor(options: EditorOptions = {}) {
  return new Editor(options);
}
