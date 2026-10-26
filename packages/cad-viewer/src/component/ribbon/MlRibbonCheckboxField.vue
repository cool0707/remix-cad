<template>
  <el-checkbox
    :model-value="modelValue"
    size="small"
    class="ml-ribbon-checkbox-field"
    @update:model-value="emit('update:modelValue', $event === true)"
  >
    {{ label }}
  </el-checkbox>
</template>

<script setup lang="ts">
import { ElCheckbox } from 'element-plus'

/**
 * Compact one-row checkbox for ribbon `custom` items (same row height as the
 * Measurement units fields).
 */
defineProps<{
  modelValue: boolean
  label: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<style scoped>
.ml-ribbon-checkbox-field {
  --ml-ribbon-checkbox-scale: var(--ml-rb-scale, 1);
  height: var(--ml-rb-compact-height, 28px);
  margin-right: 0;
}

.ml-ribbon-checkbox-field :deep(.el-checkbox__label) {
  font-size: calc(11px * var(--ml-ribbon-checkbox-scale));
  color: var(--el-text-color-regular);
  white-space: nowrap;
}
</style>
