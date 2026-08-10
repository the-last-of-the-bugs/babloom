import type { BabloomDoc, BabloomNode, Mark, MarkType, TextNode } from "./types";

const MARK_TAGS: Record<string, MarkType> = {
  STRONG: "bold",
  B: "bold",
  EM: "italic",
  I: "italic",
  U: "underline",
  S: "strike",
  STRIKE: "strike",
  DEL: "strike",
  CODE: "code",
  A: "link",
};

const BLOCK_TAGS: Record<string, string> = {
  P: "paragraph",
  H1: "heading",
  H2: "heading",
  H3: "heading",
  BLOCKQUOTE: "blockquote",
  UL: "bulletList",
  OL: "orderedList",
  LI: "listItem",
  IMG: "image",
  HR: "horizontalRule",
  DIV: "paragraph",
};

function parseInline(node: Node, marks: Mark[]): BabloomNode[] {
  if (node.nodeType === 3) {
    const text = node.textContent ?? "";
    if (!text) return [];
    const t: TextNode = { type: "text", text };
    if (marks.length) t.marks = marks;
    return [t];
  }
  if (node.nodeType !== 1) return [];
  const el = node as HTMLElement;
  if (el.tagName === "BR") return [{ type: "hardBreak" }];
  if (el.tagName === "IMG") {
    return [
      {
        type: "image",
        attrs: {
          src: el.getAttribute("src") ?? "",
          alt: el.getAttribute("alt") ?? "",
        },
      },
    ];
  }
  const markType = MARK_TAGS[el.tagName];
  const nextMarks = markType
    ? [
        ...marks,
        markType === "link"
          ? ({ type: "link", attrs: { href: el.getAttribute("href") ?? "" } } as Mark)
          : ({ type: markType } as Mark),
      ]
    : marks;
  const out: BabloomNode[] = [];
  el.childNodes.forEach((child) => out.push(...parseInline(child, nextMarks)));
  return out;
}

function parseBlock(el: HTMLElement): BabloomNode | null {
  const tag = el.tagName;
  const type = BLOCK_TAGS[tag];
  if (!type) return null;
  if (type === "horizontalRule") return { type: "horizontalRule" };
  if (type === "image") {
    return {
      type: "image",
      attrs: { src: el.getAttribute("src") ?? "", alt: el.getAttribute("alt") ?? "" },
    };
  }
  if (type === "bulletList" || type === "orderedList" || type === "blockquote") {
    const content: BabloomNode[] = [];
    Array.from(el.children).forEach((child) => {
      const parsed = parseBlock(child as HTMLElement);
      if (parsed) content.push(parsed);
    });
    if (!content.length && type === "blockquote") {
      content.push({ type: "paragraph", content: parseInline(el, []) });
    }
    return { type, content };
  }
  const node: BabloomNode = { type, content: parseInline(el, []) };
  if (type === "heading") {
    (node as any).attrs = { level: Number(tag.slice(1)) || 1 };
  }
  return node;
}

export function htmlToJSON(html: string): BabloomDoc {
  const container = document.createElement("div");
  container.innerHTML = html;
  const content: BabloomNode[] = [];
  container.childNodes.forEach((child) => {
    if (child.nodeType === 3) {
      const text = child.textContent?.trim();
      if (text) content.push({ type: "paragraph", content: [{ type: "text", text }] });
      return;
    }
    if (child.nodeType !== 1) return;
    const parsed = parseBlock(child as HTMLElement);
    if (parsed) content.push(parsed);
  });
  if (!content.length) content.push({ type: "paragraph", content: [] });
  return { type: "doc", content };
}

function escapeHTML(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderMarks(text: string, marks?: Mark[]) {
  let out = escapeHTML(text);
  for (const mark of marks ?? []) {
    switch (mark.type) {
      case "bold":
        out = `<strong>${out}</strong>`;
        break;
      case "italic":
        out = `<em>${out}</em>`;
        break;
      case "underline":
        out = `<u>${out}</u>`;
        break;
      case "strike":
        out = `<s>${out}</s>`;
        break;
      case "code":
        out = `<code>${out}</code>`;
        break;
      case "link":
        out = `<a href="${escapeHTML(String(mark.attrs?.['href'] ?? "#"))}" rel="noopener noreferrer">${out}</a>`;
        break;
    }
  }
  return out;
}

export function nodeToHTML(node: BabloomNode): string {
  if (node.type === "text") return renderMarks((node as TextNode).text, (node as TextNode).marks);
  const el = node as Exclude<BabloomNode, TextNode>;
  const inner = (el.content ?? []).map(nodeToHTML).join("");
  switch (el.type) {
    case "paragraph":
      return `<p>${inner || "<br>"}</p>`;
    case "heading": {
      const level = Number(el.attrs?.['level'] ?? 1);
      return `<h${level}>${inner}</h${level}>`;
    }
    case "blockquote":
      return `<blockquote>${inner}</blockquote>`;
    case "bulletList":
      return `<ul>${inner}</ul>`;
    case "orderedList":
      return `<ol>${inner}</ol>`;
    case "listItem":
      return `<li>${inner}</li>`;
    case "horizontalRule":
      return "<hr>";
    case "hardBreak":
      return "<br>";
    case "image":
      return `<img src="${escapeHTML(String(el.attrs?.['src'] ?? ""))}" alt="${escapeHTML(String(el.attrs?.['alt'] ?? ""))}">`;
    default:
      return inner;
  }
}

export function jsonToHTML(doc: BabloomDoc): string {
  return (doc.content ?? []).map(nodeToHTML).join("");
}

export function jsonToText(doc: BabloomDoc): string {
  const walk = (node: BabloomNode): string =>
    node.type === "text"
      ? (node as TextNode).text
      : ((node as ElementNodeLike).content ?? []).map(walk).join("");
  type ElementNodeLike = { content?: BabloomNode[] };
  return (doc.content ?? []).map(walk).join("\n");
}
