import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Blocks, Braces, ImagePlus, Keyboard, Layers, Zap } from "lucide-react";
import { BabloomEditor } from "@/components/babloom/BabloomEditor";
import { CodeBlock } from "@/components/site/CodeBlock";
import { SiteHeader } from "@/components/site/SiteHeader";
import React from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BaBloom – TypeScript Rich-Text Editor for React, Vue & Svelte" },
      {
        name: "description",
        content:
          "BaBloom is a framework-agnostic TypeScript rich-text editor with an extension-first architecture, image uploads and adapters for React, Vue and Svelte.",
      },
      { property: "og:title", content: "BaBloom – TypeScript Rich-Text Editor" },
      {
        property: "og:description",
        content: "Framework-agnostic rich-text editing for React, Vue and Svelte. Extension first, image ready.",
      },
    ],
  }),
  component: Index,
});

const features = [
  { icon: Layers, title: "Framework agnostic", body: "The core never imports React, Vue or Svelte. Adapters are thin." },
  { icon: Blocks, title: "Extension first", body: "Marks, nodes, keymaps and input rules are all plain extensions." },
  { icon: Braces, title: "JSON document model", body: "Structured nodes and marks, with HTML and text serialization." },
  { icon: ImagePlus, title: "Image uploads", body: "Pick, drop or paste. Validation built in, storage is yours." },
  { icon: Keyboard, title: "Shortcuts & Markdown", body: "Mod-B, Mod-Alt-1, plus `# `, `- ` and `> ` input rules." },
  { icon: Zap, title: "Typed & tiny", body: "Written in TypeScript, ESM only, tree-shakeable, zero runtime deps." },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden border-b">
        <div className="bloom-grid absolute inset-0 opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              v0.1.0 · React · Vue · Svelte
            </span>
            <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-6xl">
              The rich-text editor that <span className="text-primary">blooms</span> in any framework
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
              BaBloom is a framework-agnostic TypeScript editor core with an extension-first
              architecture, image uploads and one consistent API across React, Vue and Svelte.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/docs"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Get started <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/playground"
                className="inline-flex items-center gap-2 rounded-lg border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Open playground
              </Link>
            </div>
            <p className="mt-6 font-mono text-xs text-muted-foreground">
              npm install @tlob/babloom-core @tlob/babloom-react
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-3xl">
            <BabloomEditor />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight">Built for real products</h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="rounded-xl border bg-card p-6 transition-colors hover:border-primary/40">
                <Icon className="size-5 text-primary" />
                <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{feature.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">One API, three frameworks</h2>
            <p className="mt-3 text-muted-foreground">
              Adapters only handle mounting and reactivity. Commands, extensions and serialization
              are identical everywhere, so your editor features port for free.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <Link to="/docs/react" className="rounded-lg border bg-card px-4 py-2 hover:bg-accent">React</Link>
              <Link to="/docs/vue" className="rounded-lg border bg-card px-4 py-2 hover:bg-accent">Vue 3</Link>
              <Link to="/docs/svelte" className="rounded-lg border bg-card px-4 py-2 hover:bg-accent">Svelte 5</Link>
            </div>
          </div>
          <CodeBlock
            lang="tsx"
            code={`import { StarterKit, ImageExtension } from "@tlob/babloom-core";
import { useEditor } from "@tlob/babloom-react";

const { editor, ref } = useEditor({
  extensions: [
    StarterKit(),
    ImageExtension({ maxSize: 5_000_000, upload: uploadImage }),
  ],
  onUpdate: ({ editor }) => save(editor.getJSON()),
});`}
          />
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <p>BaBloom — MIT licensed. Built with TypeScript.</p>
          <div className="flex gap-4">
            <Link to="/docs" className="hover:text-foreground">Docs</Link>
            <Link to="/docs/publishing" className="hover:text-foreground">Releases</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
