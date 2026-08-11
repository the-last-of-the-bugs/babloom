import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [svelte()],

  build: {
    lib: {
      entry: fileURLToPath(
        new URL("./src/lib/index.ts", import.meta.url),
      ),
      formats: ["es"],
      fileName: "index",
    },

    rollupOptions: {
      external: ["svelte", "@babloom/core"],
    },
  },
});