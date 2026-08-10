import { Link } from "@tanstack/react-router";
import { Flower2 } from "lucide-react";
import React from "react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-base font-bold tracking-tight">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Flower2 className="size-4" />
          </span>
          BaBloom
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
          <Link to="/docs" className="transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>
            Docs
          </Link>
          <Link to="/playground" className="transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>
            Playground
          </Link>
          <Link to="/docs/api" className="transition-colors hover:text-foreground">
            API
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden rounded-full border px-2.5 py-1 font-mono text-[11px] text-muted-foreground sm:inline">
            v0.1.0
          </span>
          <a
            href="https://github.com/the-last-of-the-bugs/babloom"
            target="_blank"
            rel="noreferrer"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="GitHub repository"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-4"
              fill="currentColor"
            >
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.53-1.35-1.31-1.71-1.31-1.71-1.07-.73.08-.72.08-.72 1.18.08 1.8 1.21 1.8 1.21 1.05 1.8 2.75 1.28 3.42.98.11-.76.41-1.28.75-1.58-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.47.11-3.06 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.82 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.77.11 3.06.75.81 1.2 1.84 1.2 3.1 0 4.42-2.69 5.39-5.25 5.67.41.36.79 1.08.79 2.18v3.23c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
