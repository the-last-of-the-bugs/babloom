import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { docsNav } from "@/components/site/nav";
import React from "react";

export const Route = createFileRoute("/docs")({
  component: DocsLayout,
});

function DocsLayout() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto flex max-w-7xl gap-10 px-4 sm:px-6">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-y-auto py-8 md:block">
          <nav className="space-y-6">
            {docsNav.map((section) => (
              <div key={section.title}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {section.title}
                </p>
                <ul className="space-y-0.5 border-l">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        activeOptions={{ exact: true }}
                        activeProps={{
                          className: "border-primary text-foreground font-medium",
                        }}
                        className="-ml-px block border-l border-transparent py-1.5 pl-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 flex-1 py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}