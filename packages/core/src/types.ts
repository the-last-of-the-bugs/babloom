export type MarkType = "bold" | "italic" | "underline" | "strike" | "code" | "link";

export interface Mark {
  type: MarkType;
  attrs?: Record<string, string | number | boolean | null>;
}

export interface TextNode {
  type: "text";
  text: string;
  marks?: Mark[];
}

export interface ElementNode {
  type: string;
  attrs?: Record<string, string | number | boolean | null>;
  content?: BabloomNode[];
}

export type BabloomNode = TextNode | ElementNode;

export interface BabloomDoc {
  type: "doc";
  content: BabloomNode[];
}

export interface UploadResult {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
}

export type UploadHandler = (file: File) => Promise<UploadResult>;

export interface EditorEvents {
  update: (payload: { editor: EditorLike }) => void;
  selection: (payload: { editor: EditorLike }) => void;
  focus: (payload: { editor: EditorLike }) => void;
  blur: (payload: { editor: EditorLike }) => void;
}

export interface EditorLike {
  getHTML(): string;
  getJSON(): BabloomDoc;
  isActive(name: string): boolean;
}

export interface InputRule {
  /** matched against the text of the current block, before the caret */
  match: RegExp;
  handler: (editor: any, match: RegExpMatchArray) => void;
}

export interface Extension {
  name: string;
  /** keyboard shortcuts, e.g. "Mod-b" */
  keymap?: Record<string, (editor: any) => boolean | void>;
  inputRules?: InputRule[];
  commands?: Record<string, (editor: any, ...args: any[]) => void>;
  /** tag names this extension owns, used for isActive() lookups */
  tags?: string[];
  onCreate?: (editor: any) => void;
  onDestroy?: (editor: any) => void;
}
