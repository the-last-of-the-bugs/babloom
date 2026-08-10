import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "@/components/site/CodeBlock";
import { DocsPage, H2, P } from "@/components/site/DocsPage";
import React from "react";

export const Route = createFileRoute("/docs/installation")({
  head: () => ({
    meta: [
      { title: "Installation – BaBloom Editor" },
      { name: "description", content: "Install the BaBloom editor core and the adapter for React, Vue or Svelte." },
      { property: "og:title", content: "Installation – BaBloom Editor" },
      { property: "og:description", content: "Install BaBloom core and your framework adapter from npm." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DocsPage title="Installation" description="Install the core plus the adapter for your framework.">
      <H2>React</H2>
      <CodeBlock lang="bash" code={`npm install @babloom/core @babloom/react`} />
      <H2>Vue 3</H2>
      <CodeBlock lang="bash" code={`npm install @babloom/core @babloom/vue`} />
      <H2>Svelte 5</H2>
      <CodeBlock lang="bash" code={`npm install @babloom/core @babloom/svelte`} />

      <H2>Styles</H2>
      <P>Import the base content styles once in your app entry:</P>
      <CodeBlock lang="ts" code={`import "@babloom/core/styles.css";`} />

      <H2>Vanilla TypeScript</H2>
      <P>No framework? Use the core directly.</P>
      <CodeBlock
        lang="ts"
        code={`import { createEditor, StarterKit } from "@babloom/core";

const editor = createEditor({
  element: document.querySelector("#editor")!,
  content: "<p>Hello</p>",
  extensions: [StarterKit()],
  onUpdate: ({ editor }) => console.log(editor.getJSON()),
});`}
      />
    </DocsPage>
  );
}