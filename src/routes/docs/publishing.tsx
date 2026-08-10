import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "@/components/site/CodeBlock";
import { DocsPage, H2, P, UL } from "@/components/site/DocsPage";
import React from "react";

export const Route = createFileRoute("/docs/publishing")({
  head: () => ({
    meta: [
      { title: "Publishing to npm – BaBloom Editor" },
      { name: "description", content: "Build ESM bundles, generate types and release the BaBloom packages to npm with Changesets." },
      { property: "og:title", content: "Publishing to npm – BaBloom Editor" },
      { property: "og:description", content: "Changesets + GitHub Actions release flow for the BaBloom packages." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <DocsPage title="Publishing to npm" description="Release @babloom/* packages with pnpm workspaces and Changesets.">
      <H2>1. Build every package</H2>
      <CodeBlock lang="bash" code={`pnpm install\npnpm -r build`} />
      <P>Each package emits ESM output plus .d.ts declarations into dist/, which is the only folder shipped via the files field.</P>

      <H2>2. Create a changeset</H2>
      <CodeBlock lang="bash" code={`pnpm changeset\npnpm changeset version\npnpm install`} />

      <H2>3. Publish</H2>
      <CodeBlock lang="bash" code={`npm login\npnpm -r publish --access public`} />
      <P>The @babloom scope must exist on npm and be public before the first publish.</P>

      <H2>4. Automate with GitHub Actions</H2>
      <CodeBlock
        lang="yaml"
        code={`name: release
on:
  push:
    branches: [main]
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm -r build
      - uses: changesets/action@v1
        with:
          publish: pnpm -r publish --access public
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: \${{ secrets.NPM_TOKEN }}`}
      />

      <H2>Checklist</H2>
      <UL
        items={[
          "ESM build output with type declarations",
          "sideEffects: false for tree shaking",
          "peerDependencies for react, vue and svelte",
          "README and LICENSE in every package",
          "Vitest unit tests and Playwright end-to-end tests green in CI",
        ]}
      />
    </DocsPage>
  );
}