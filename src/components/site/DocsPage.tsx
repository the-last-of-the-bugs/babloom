import type { ReactNode } from "react";
import React from "react";

export function DocsPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <article className="min-w-0 max-w-3xl pb-24">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{description}</p>
      <div className="mt-8 space-y-4 text-[15px] leading-7">{children}</div>
    </article>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="mt-10 border-b pb-2 text-xl font-semibold">{children}</h2>;
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="mt-6 text-base font-semibold">{children}</h3>;
}

export function P({ children }: { children: ReactNode }) {
  return <p className="text-muted-foreground">{children}</p>;
}

export function UL({ items }: { items: ReactNode[] }) {
  return (
    <ul className="ml-5 list-disc space-y-1.5 text-muted-foreground">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export function PropsTable({
  rows,
}: {
  rows: { name: string; type: string; description: string }[];
}) {
  return (
    <div className="my-5 overflow-x-auto rounded-xl border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-2.5 font-medium">Name</th>
            <th className="px-4 py-2.5 font-medium">Type</th>
            <th className="px-4 py-2.5 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-t align-top">
              <td className="px-4 py-2.5 font-mono text-[13px] text-foreground">{row.name}</td>
              <td className="px-4 py-2.5 font-mono text-[13px] text-primary">{row.type}</td>
              <td className="px-4 py-2.5 text-muted-foreground">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
