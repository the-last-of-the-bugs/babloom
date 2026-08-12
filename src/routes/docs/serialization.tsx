import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "@/components/site/CodeBlock";
import { DocsPage, H2, P } from "@/components/site/DocsPage";
import React from "react";

export const Route = createFileRoute("/docs/serialization")({
  head: () => ({
    meta: [
      { title: "Serialization – BaBloom Editor" },
      { name: "description", content: "Convert BaBloom documents between JSON, HTML and plain text." },
      { property: "og:title", content: "Serialization – BaBloom Editor" },
      { property: "og:description", content: "htmlToJSON, jsonToHTML and jsonToText helpers." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DocsPage title="Serialization" description="Store JSON, render HTML, index plain text.">
      <H2>Helpers</H2>
      <CodeBlock
        lang="ts"
        code={`import { htmlToJSON, jsonToHTML, jsonToText } from "@tlob/babloom-core";

const doc = htmlToJSON("<p>Hello <strong>world</strong></p>");
const html = jsonToHTML(doc);
const text = jsonToText(doc);`}
      />

      <H2>From an instance</H2>
      <CodeBlock
        lang="ts"
        code={`editor.getJSON();  // BabloomDoc
editor.getHTML();  // string
editor.getText();  // string
editor.isEmpty();  // boolean
editor.setContent(doc);`}
      />

      <P>
        Persist getJSON() in your database: it is stable, framework independent and safe to render
        on the server through jsonToHTML.
      </P>
    </DocsPage>
  );
}