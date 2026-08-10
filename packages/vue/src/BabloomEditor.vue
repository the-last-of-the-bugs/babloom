<script setup lang="ts">
import type { EditorOptions } from "@babloom/core";
import { useEditor } from "./useEditor";

const props = defineProps<{ options?: Omit<EditorOptions, "element">; class?: string }>();
const { editor, element } = useEditor(props.options ?? {});
defineExpose({ editor });
</script>

<template>
  <div ref="element" :class="props.class" />
</template>
