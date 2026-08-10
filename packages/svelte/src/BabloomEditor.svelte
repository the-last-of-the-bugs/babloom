<script lang="ts">
  import { Editor, type EditorOptions } from "@babloom/core";
  import { onDestroy, onMount } from "svelte";

  export let options: Omit<EditorOptions, "element"> = {};
  export let editor: Editor | null = null;
  let element: HTMLDivElement;

  onMount(() => {
    editor = new Editor({ ...options, element });
  });

  onDestroy(() => {
    editor?.destroy();
    editor = null;
  });
</script>

<div bind:this={element} class={$$props.class}></div>
