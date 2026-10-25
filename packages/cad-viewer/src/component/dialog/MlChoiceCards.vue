<template>
  <el-radio-group v-model="model" class="ml-choice-cards">
    <label
      v-for="option in options"
      :key="option.value"
      class="ml-choice-cards__card"
      :class="{ 'is-selected': model === option.value }"
    >
      <el-radio :value="option.value" class="ml-choice-cards__radio" />
      <span class="ml-choice-cards__body">
        <span class="ml-choice-cards__title">{{ option.title }}</span>
        <span class="ml-choice-cards__hint">{{ option.hint }}</span>
      </span>
    </label>
  </el-radio-group>
</template>

<script setup lang="ts" generic="T extends string">
/**
 * Row of selectable cards (radio buttons with a title and a hint), used by
 * the export dialogs.
 */
import { ElRadio, ElRadioGroup } from 'element-plus'

defineProps<{
  options: { value: T; title: string; hint: string }[]
}>()

const model = defineModel<T>({ required: true })
</script>

<style scoped>
.ml-choice-cards {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  gap: 8px;
  width: 100%;
  align-items: stretch;
}

.ml-choice-cards__card {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
  padding: 10px 10px 10px 8px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  background: var(--el-fill-color-blank);
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease,
    box-shadow 0.15s ease;
}

.ml-choice-cards__card:hover {
  border-color: var(--el-color-primary-light-5);
}

.ml-choice-cards__card.is-selected {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
  box-shadow: inset 0 0 0 1px var(--el-color-primary-light-7);
}

.ml-choice-cards__radio {
  flex: 0 0 auto;
  margin-right: 0;
  height: auto;
}

.ml-choice-cards__radio :deep(.el-radio__label) {
  display: none;
}

.ml-choice-cards__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.ml-choice-cards__title {
  font-size: var(--ml-dialog-font-size, 12px);
  font-weight: 600;
  color: var(--el-text-color-primary);
  line-height: 1.35;
}

.ml-choice-cards__hint {
  font-size: 11px;
  color: var(--el-text-color-secondary);
  line-height: 1.35;
}
</style>
