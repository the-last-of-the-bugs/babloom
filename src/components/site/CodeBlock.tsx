import { Check, Copy } from "lucide-react";
import React from "react";
import { useState } from "react";

export function CodeBlock({ code, lang = "ts" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="group relative my-5 overflow-hidden rounded-xl border bg-card">
      <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-2">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {lang}
        </span>
        <button
          type="button"
          aria-label="Copy code"
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          onClick={() => {
            void navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}