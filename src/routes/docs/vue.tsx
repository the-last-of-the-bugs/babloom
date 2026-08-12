import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "@/components/site/CodeBlock";
import { DocsPage, H2, P } from "@/components/site/DocsPage";
import React from "react";

export const Route = createFileRoute("/docs/vue")({
  head: () => ({
    meta: [
      { title: "Vue Adapter – BaBloom Editor" },
      { name: "description", content: "Use BaBloom in Vue 3 with the useEditor composable or the BabloomEditor component." },
      { property: "og:title", content: "Vue Adapter – BaBloom Editor" },
      { property: "og:description", content: "useEditor composable and component usage for Vue 3." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DocsPage title="Vue" description="The @tlob/babloom-vue adapter ships a useEditor composable and a ready-made component.">
      <H2>Composable</H2>
      <CodeBlock
        lang="vue"
        code={`<script setup lang="ts">
import { StarterKit } from "@tlob/babloom-core";
import { useEditor } from "@tlob/babloom-vue";
import "@tlob/babloom-core/styles.css";

const { editor, element } = useEditor({
  content: "<p>Hello BaBloom</p>",
  extensions: [StarterKit()],
  onUpdate: ({ editor }) => console.log(editor.getJSON()),
});
</script>

<template>
  <button @mousedown.prevent="editor?.toggleBold()">Bold</button>
  <div ref="element" />
</template>`}
      />

      <H2>Component</H2>
      <CodeBlock
        lang="vue"
        code={`<script setup lang="ts">
import { BabloomEditor } from "@tlob/babloom-vue";
import { StarterKit } from "@tlob/babloom-core";
</script>

<template>
  <BabloomEditor :options="{ extensions: [StarterKit()] }" class="prose" />
</template>`}
      />

      <P>The editor instance is disposed automatically on unmount via onBeforeUnmount.</P>
    </DocsPage>
  );
}