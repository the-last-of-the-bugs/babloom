import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "@/components/site/CodeBlock";
import { DocsPage, H2, PropsTable } from "@/components/site/DocsPage";
import React from "react";

export const Route = createFileRoute("/docs/api")({
  head: () => ({
    meta: [
      { title: "Editor API – BaBloom Editor" },
      { name: "description", content: "Complete reference of BaBloom editor options, commands, state helpers and events." },
      { property: "og:title", content: "Editor API – BaBloom Editor" },
      { property: "og:description", content: "Options, commands, state helpers and events reference." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DocsPage title="Editor API" description="Everything createEditor gives you.">
      <H2>Options</H2>
      <PropsTable
        rows={[
          { name: "element", type: "HTMLElement", description: "Host element made contenteditable." },
          { name: "content", type: "string | BabloomDoc", description: "Initial HTML or JSON document." },
          { name: "extensions", type: "Extension[]", description: "Extensions to register." },
          { name: "editable", type: "boolean", description: "Defaults to true." },
          { name: "autofocus", type: "boolean", description: "Focus the editor on mount." },
          { name: "onUpdate", type: "({ editor }) => void", description: "Fired after every document change." },
          { name: "onSelectionUpdate", type: "({ editor }) => void", description: "Fired when the selection moves." },
          { name: "onFocus / onBlur", type: "({ editor }) => void", description: "Focus lifecycle callbacks." },
        ]}
      />

      <H2>Commands</H2>
      <PropsTable
        rows={[
          { name: "toggleBold / Italic / Underline / Strike / Code", type: "Editor", description: "Toggle inline marks." },
          { name: "setBlock(tag)", type: "Editor", description: 'p, h1, h2, h3 or blockquote.' },
          { name: "toggleBulletList / toggleOrderedList", type: "Editor", description: "List toggles." },
          { name: "setHorizontalRule()", type: "Editor", description: "Insert a divider." },
          { name: "setLink(href) / unsetLink()", type: "Editor", description: "Link marks." },
          { name: "insertImage({ src, alt, width })", type: "Editor", description: "Insert an image node." },
          { name: "insertHTML(html)", type: "Editor", description: "Insert raw HTML at the caret." },
          { name: "clearFormatting()", type: "Editor", description: "Remove all marks from the selection." },
          { name: "undo() / redo() / can(action)", type: "Editor | boolean", description: "History." },
          { name: "command(name, ...args)", type: "Editor", description: "Run an extension command." },
        ]}
      />

      <H2>State</H2>
      <PropsTable
        rows={[
          { name: "isActive(name)", type: "boolean", description: "bold, italic, underline, strike, code, link, heading1-3, blockquote, bulletList, orderedList." },
          { name: "getHTML() / getJSON() / getText()", type: "string | BabloomDoc", description: "Serialize the document." },
          { name: "setContent(content)", type: "Editor", description: "Replace the document." },
          { name: "setEditable(boolean)", type: "Editor", description: "Toggle read-only mode." },
          { name: "focus() / destroy()", type: "void", description: "Lifecycle." },
        ]}
      />

      <H2>Events</H2>
      <CodeBlock
        lang="ts"
        code={`const off = editor.on("update", ({ editor }) => save(editor.getJSON()));
editor.on("selection", () => refreshToolbar());
editor.on("image:upload:error", ({ error }) => toast.error(error.message));
off(); // unsubscribe`}
      />
    </DocsPage>
  );
}
