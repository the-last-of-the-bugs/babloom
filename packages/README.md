# BaBloom

Framework-agnostic TypeScript rich-text editor with an extension-first architecture for React, Vue and Svelte.

## Packages

| Package | Description |
| --- | --- |
| `@babloom/core` | Editor core: document model, commands, selection, history, extensions, serialization |
| `@babloom/react` | React adapter (`useEditor`, `EditorContent`, `EditorToolbar`) |
| `@babloom/vue` | Vue 3 adapter (`useEditor`, `BabloomEditor`) |
| `@babloom/svelte` | Svelte 5 adapter (`BabloomEditor`) |

## Development

```bash
pnpm install
pnpm -r build      # build every package
pnpm -r test       # vitest
```

## Release

```bash
pnpm changeset
pnpm changeset version
pnpm -r publish --access public
```

The documentation site lives in this repository under `src/` and is deployed separately.