import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "@/components/site/CodeBlock";
import { DocsPage, H2, P } from "@/components/site/DocsPage";
import { BabloomEditor } from "@/components/babloom/BabloomEditor";
import React from "react";

export const Route = createFileRoute("/docs/react")({
  head: () => ({
    meta: [
      { title: "React Adapter – BaBloom Editor" },
      { name: "description", content: "Use BaBloom in React with the useEditor hook and a live editable demo." },
      { property: "og:title", content: "React Adapter – BaBloom Editor" },
      { property: "og:description", content: "useEditor hook, toolbar wiring and a live React demo." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DocsPage title="React" description="The @tlob/babloom-react adapter exposes a useEditor hook and re-renders your toolbar on every state change.">
      <H2>Live demo</H2>
      <P>This editor on the page is powered by the real core running in React.</P>
      <div className="my-6">
        <BabloomEditor />
      </div>

      <H2>Usage</H2>
      <CodeBlock
        lang="tsx"
        code={`import { StarterKit, PlaceholderExtension } from "@tlob/babloom-core";
import { useEditor } from "@tlob/babloom-react";
import "@tlob/babloom-core/styles.css";

export function Editor() {
  const { editor, ref } = useEditor({
    content: "<p>Hello BaBloom</p>",
    extensions: [StarterKit(), PlaceholderExtension({ text: "Start writing…" })],
    onUpdate: ({ editor }) => console.log(editor.getHTML()),
  });

  return (
    <div>
      <button
        onMouseDown={(e) => { e.preventDefault(); editor?.toggleBold(); }}
        data-active={editor?.isActive("bold")}
      >
        Bold
      </button>
      <div ref={ref} />
    </div>
  );
}`}
      />

      <H2>Notes</H2>
      <P>
        Use onMouseDown with preventDefault on toolbar buttons so the selection inside the editor is
        preserved. The hook destroys the editor instance automatically on unmount.
      </P>
    </DocsPage>
  );
}