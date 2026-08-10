import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "@/components/site/CodeBlock";
import { DocsPage, H2, P, PropsTable } from "@/components/site/DocsPage";
import React from "react";

export const Route = createFileRoute("/docs/extensions")({
  head: () => ({
    meta: [
      { title: "Extensions – BaBloom Editor" },
      { name: "description", content: "Starter kit, link and placeholder extensions plus how to author your own BaBloom extension." },
      { property: "og:title", content: "Extensions – BaBloom Editor" },
      { property: "og:description", content: "Extension API: keymaps, input rules and custom commands." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DocsPage title="Extensions" description="Everything the editor can do is an extension: keymaps, input rules and commands.">
      <H2>Bundled extensions</H2>
      <PropsTable
        rows={[
          { name: "StarterKit()", type: "Extension", description: "Headings, lists, quote, marks, shortcuts and Markdown input rules." },
          { name: "LinkExtension()", type: "Extension", description: "setLink / unsetLink commands and optional open-on-click." },
          { name: "PlaceholderExtension()", type: "Extension", description: "Shows placeholder text while the document is empty." },
          { name: "ImageExtension()", type: "Extension", description: "File picker, validation, drag & drop, paste and upload handling." },
        ]}
      />

      <H2>Markdown shortcuts</H2>
      <P>StarterKit registers input rules for `# `, `## `, `### `, `&gt; `, `- ` and `1. `.</P>

      <H2>Writing your own</H2>
      <CodeBlock
        lang="ts"
        code={`import type { Extension } from "@babloom/core";

export function HighlightExtension(): Extension {
  return {
    name: "highlight",
    keymap: {
      "Mod-Shift-h": (editor) => editor.insertHTML("<mark>" + window.getSelection() + "</mark>"),
    },
    inputRules: [
      { match: /^==\\s(.*)$/, handler: (editor) => editor.insertHTML("<mark></mark>") },
    ],
    commands: {
      clearHighlights: (editor) =>
        editor.element?.querySelectorAll("mark").forEach((m) => m.replaceWith(m.textContent ?? "")),
    },
    onCreate: (editor) => console.log("highlight ready", editor.name),
  };
}`}
      />
      <P>Register it like any other extension and call it with editor.command("clearHighlights").</P>
    </DocsPage>
  );
}