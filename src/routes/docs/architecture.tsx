import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "@/components/site/CodeBlock";
import { DocsPage, H2, P, PropsTable } from "@/components/site/DocsPage";
import React from "react";

export const Route = createFileRoute("/docs/architecture")({
  head: () => ({
    meta: [
      { title: "Architecture – BaBloom Editor" },
      { name: "description", content: "Monorepo structure, design principles and the layered architecture behind BaBloom." },
      { property: "og:title", content: "Architecture – BaBloom Editor" },
      { property: "og:description", content: "Monorepo layout and core design principles of the BaBloom editor." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DocsPage
      title="Architecture"
      description="How the core, extensions, adapters and docs fit together."
    >
      <H2>Layers</H2>
      <CodeBlock
        lang="text"
        code={`Your app (React / Vue / Svelte)
        |
   Framework adapter  (@tlob/babloom-react | vue | svelte)
        |
   Editor core        (@tlob/babloom-core)
   - document model   - commands
   - selection        - history
   - extensions       - serialization
        |
   Extensions  ->  starter-kit | image | link | placeholder`}
      />

      <H2>Monorepo structure</H2>
      <CodeBlock
        lang="text"
        code={`babloom/
  apps/
    docs/                 # documentation site
  packages/
    core/                 # framework-agnostic editor
      src/editor, document, commands, extensions,
          selection, history, events, serialization
    react/                # React adapter
    vue/                  # Vue 3 adapter
    svelte/               # Svelte 5 adapter
  examples/react | vue | svelte
  pnpm-workspace.yaml
  turbo.json`}
      />

      <H2>Design principles</H2>
      <PropsTable
        rows={[
          { name: "Framework agnostic", type: "core", description: "Core must not depend on React, Vue or Svelte." },
          { name: "Extension first", type: "extensions", description: "Features are extensions, not hardcoded behaviour." },
          { name: "Document model", type: "json", description: "Structured JSON document of nodes and marks." },
          { name: "Commands", type: "api", description: "UI calls commands instead of mutating state." },
          { name: "Transactions", type: "state", description: "Changes flow through snapshots so history and collaboration are possible." },
          { name: "Upload abstraction", type: "media", description: "Image storage is delegated to a user-provided handler." },
          { name: "Framework parity", type: "adapters", description: "Every adapter exposes the same editor API." },
        ]}
      />

      <H2>Document model</H2>
      <P>Blocks: paragraph, heading, blockquote, bullet list, ordered list, list item, image, horizontal rule. Inline: text with bold, italic, underline, strike, code and link marks.</P>
      <CodeBlock
        lang="json"
        code={`{
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Hello " },
        { "type": "text", "text": "world", "marks": [{ "type": "bold" }] }
      ]
    }
  ]
}`}
      />
    </DocsPage>
  );
}