import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "@/components/site/CodeBlock";
import { DocsPage, H2, P } from "@/components/site/DocsPage";
import React from "react";

export const Route = createFileRoute("/docs/svelte")({
  head: () => ({
    meta: [
      { title: "Svelte Adapter – BaBloom Editor" },
      { name: "description", content: "Use BaBloom in Svelte 5 with the BabloomEditor component or the raw core." },
      { property: "og:title", content: "Svelte Adapter – BaBloom Editor" },
      { property: "og:description", content: "Component and core usage for Svelte 5." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DocsPage title="Svelte" description="The @babloom/svelte adapter wraps the core in a small component.">
      <H2>Component</H2>
      <CodeBlock
        lang="svelte"
        code={`<script lang="ts">
  import { BabloomEditor } from "@babloom/svelte";
  import { StarterKit, type Editor } from "@babloom/core";
  import "@babloom/core/styles.css";

  let editor: Editor | null = null;
</script>

<button on:mousedown|preventDefault={() => editor?.toggleBold()}>Bold</button>
<BabloomEditor bind:editor options={{ extensions: [StarterKit()] }} />`}
      />

      <H2>Raw core</H2>
      <CodeBlock
        lang="svelte"
        code={`<script lang="ts">
  import { createEditor, StarterKit } from "@babloom/core";
  import { onMount, onDestroy } from "svelte";

  let element: HTMLDivElement;
  let editor = null;

  onMount(() => { editor = createEditor({ element, extensions: [StarterKit()] }); });
  onDestroy(() => editor?.destroy());
</script>

<div bind:this={element}></div>`}
      />

      <P>Both approaches share the exact same command API as React and Vue.</P>
    </DocsPage>
  );
}