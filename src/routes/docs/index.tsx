import { createFileRoute, Link } from "@tanstack/react-router";
import { CodeBlock } from "@/components/site/CodeBlock";
import { DocsPage, H2, P, UL } from "@/components/site/DocsPage";
import React from "react";

export const Route = createFileRoute("/docs/")({
  head: () => ({
    meta: [
      { title: "Introduction – BaBloom Editor Docs" },
      {
        name: "description",
        content:
          "BaBloom is a framework-agnostic TypeScript rich-text editor with an extension-first architecture for React, Vue and Svelte.",
      },
      { property: "og:title", content: "Introduction – BaBloom Editor Docs" },
      {
        property: "og:description",
        content: "Framework-agnostic TypeScript rich-text editor for React, Vue and Svelte.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DocsPage
      title="Introduction"
      description="BaBloom is a framework-agnostic TypeScript rich-text editor with an extension-first architecture for React, Vue and Svelte."
    >
      <P>
        The editor core has zero framework dependencies. It owns the document model, selection,
        commands, transactions, history, extensions and serialization. Thin adapters expose the same
        API to each UI framework, so a feature written once works everywhere.
      </P>

      <H2>Why BaBloom</H2>
      <UL
        items={[
          "Core never imports React, Vue or Svelte — it only touches the DOM.",
          "Every feature is an extension instead of hardcoded editor behaviour.",
          "Structured JSON document made of nodes and marks, plus HTML serialization.",
          "UI calls commands; it never mutates document state directly.",
          "Image storage is delegated to a user-provided upload handler.",
          "React, Vue and Svelte adapters expose a consistent editor API.",
        ]}
      />

      <H2>Quick look</H2>
      <CodeBlock
        lang="tsx"
        code={`import { StarterKit, ImageExtension } from "@babloom/core";
import { useEditor } from "@babloom/react";

const { editor, ref } = useEditor({
  content: "<p>Hello from BaBloom</p>",
  extensions: [StarterKit(), ImageExtension({ upload: uploadImage })],
});

return <div ref={ref} className="babloom-content" />;`}
      />

      <P>
        Head to <Link to="/docs/installation" className="text-primary underline underline-offset-4">Installation</Link>{" "}
        or try the{" "}
        <Link to="/playground" className="text-primary underline underline-offset-4">Playground</Link>.
      </P>
    </DocsPage>
  );
}