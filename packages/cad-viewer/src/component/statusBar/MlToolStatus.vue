<template>
  <span class="ml-tool-status" :title="text" aria-live="polite">
    <span class="ml-tool-status-label">{{ label }}</span>
    <span v-if="prompt" class="ml-tool-status-prompt">{{ prompt }}</span>
  </span>
</template>

<script lang="ts" setup>
import { useActiveTool } from '../../composable'

/** The tool in use and what it is waiting for (e.g. `線  次の点を指定`). */
const { label, prompt, text } = useActiveTool()
</script>

<style scoped>
.ml-tool-status {
  /* Sits in an el-button-group, whose buttons float left. */
  float: left;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 320px;
  height: 100%;
  padding: 0 8px;
  box-sizing: border-box;
  overflow: hidden;
  font-size: var(--el-font-size-small);
  color: var(--el-text-color-regular);
  white-space: nowrap;
}

.ml-tool-status-label {
  flex: 0 0 auto;
  font-weight: 600;
  color: var(--ml-brand);
}

.ml-tool-status-prompt {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
