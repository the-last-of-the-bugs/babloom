import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BabloomEditor } from "@/components/babloom/BabloomEditor";
import { SiteHeader } from "@/components/site/SiteHeader";
import React from "react";

export const Route = createFileRoute("/playground")({
  head: () => ({
    meta: [
      { title: "Playground – BaBloom Editor" },
      { name: "description", content: "Try the BaBloom rich-text editor live and inspect the HTML and JSON output as you type." },
      { property: "og:title", content: "Playground – BaBloom Editor" },
      { property: "og:description", content: "Live BaBloom editor with real-time HTML and JSON output." },
    ],
  }),
  component: Playground,
});

function Playground() {
  const [output, setOutput] = useState<{ html: string; json: unknown } | null>(null);
  const [tab, setTab] = useState<"json" | "html">("json");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight">Playground</h1>
        <p className="mt-2 text-muted-foreground">
          Type, format, drop an image — the document output updates live.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <BabloomEditor onChange={setOutput} />
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="flex items-center gap-1 border-b bg-muted/40 p-1.5">
              {(["json", "html"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTab(value)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors ${
                    tab === value ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <pre className="max-h-128 overflow-auto p-4 text-[12px] leading-relaxed text-muted-foreground">
              <code>
                {tab === "json"
                  ? JSON.stringify(output?.json ?? {}, null, 2)
                  : (output?.html ?? "")}
              </code>
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}
