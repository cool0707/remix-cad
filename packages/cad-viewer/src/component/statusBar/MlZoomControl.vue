<template>
  <div class="ml-zoom-control">
    <el-tooltip :content="t('main.statusBar.zoom.zoomOut')" :hide-after="0">
      <el-button
        class="ml-zoom-control__step"
        text
        :aria-label="t('main.statusBar.zoom.zoomOut')"
        :disabled="scale <= 0"
        :icon="Minus"
        @click="zoomBy(1 / ZOOM_STEP)"
      />
    </el-tooltip>
    <el-slider
      v-if="!isMobile"
      class="ml-zoom-control__slider"
      :model-value="sliderValue"
      :min="VIEW_SCALE_LOG_MIN"
      :max="VIEW_SCALE_LOG_MAX"
      :step="0.01"
      :show-tooltip="false"
      :disabled="scale <= 0"
      :aria-label="t('main.statusBar.zoom.tooltip')"
      size="small"
      @input="handleSlider"
    />
    <el-tooltip :content="t('main.statusBar.zoom.zoomIn')" :hide-after="0">
      <el-button
        class="ml-zoom-control__step"
        text
        :aria-label="t('main.statusBar.zoom.zoomIn')"
        :disabled="scale <= 0"
        :icon="Plus"
        @click="zoomBy(ZOOM_STEP)"
      />
    </el-tooltip>
    <el-dropdown
      trigger="click"
      placement="top-end"
      :disabled="scale <= 0"
      @command="handleCommand"
    >
      <el-button class="ml-zoom-control__value" :title="t('main.statusBar.zoom.tooltip')">
        {{ formatViewScale(scale) }}
      </el-button>
      <template #dropdown>
        <el-dropdown-menu class="ml-zoom-control__menu">
          <el-dropdown-item command="extents">
            {{ t('main.statusBar.zoom.fitAll') }}
          </el-dropdown-item>
          <el-dropdown-item
            v-for="(preset, index) in VIEW_SCALE_PRESETS"
            :key="preset"
            :command="String(index)"
            :divided="index === 0"
            :class="{ 'is-current': isCurrent(preset) }"
          >
            {{ formatViewScale(preset) }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { Minus, Plus } from '@element-plus/icons-vue'
import {
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElSlider,
  ElTooltip
} from 'element-plus'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useIsMobile, useViewScale } from '../../composable'
import {
  formatViewScale,
  VIEW_SCALE_LOG_MAX,
  VIEW_SCALE_LOG_MIN,
  VIEW_SCALE_PRESETS
} from '../../composable/viewScale'

/** Each − / + press zooms by this factor. */
const ZOOM_STEP = Math.SQRT2

const { t } = useI18n()
const { isMobile } = useIsMobile()
const { scale, setScale, zoomBy, zoomExtents } = useViewScale()

/** Slider position: log10 of the scale, so each decade gets the same room. */
const sliderValue = computed(() =>
  scale.value > 0
    ? Math.min(
        VIEW_SCALE_LOG_MAX,
        Math.max(VIEW_SCALE_LOG_MIN, Math.log10(scale.value))
      )
    : VIEW_SCALE_LOG_MIN
)

const handleSlider = (value: number | number[]) => {
  const log = Array.isArray(value) ? value[0] : value
  if (Math.abs(log - sliderValue.value) < 1e-6) return
  setScale(10 ** log)
}

const handleCommand = (command: string) => {
  if (command === 'extents') {
    zoomExtents()
    return
  }
  const preset = VIEW_SCALE_PRESETS[Number(command)]
  if (preset) setScale(preset)
}

const isCurrent = (preset: number) =>
  scale.value > 0 && Math.abs(Math.log(scale.value / preset)) < 0.01
</script>

<style scoped>
.ml-zoom-control {
  /* Sits in an el-button-group, whose buttons float left. */
  float: left;
  display: inline-flex;
  align-items: center;
  height: 100%;
  padding: 0 4px;
}

.ml-zoom-control__step {
  border: none;
  width: 22px;
  height: 30px;
  padding: 0;
  font-size: 12px;
}

.ml-zoom-control__slider {
  --el-slider-height: 4px;
  --el-slider-button-size: 12px;
  --el-slider-button-wrapper-size: 24px;
  --el-slider-button-wrapper-offset: -10px;
  width: 96px;
  margin: 0 6px;
}

/*
 * Element Plus centres the knob with vertical-align: middle on a text line,
 * which puts it a few pixels below the thin runway. Centre it with flex.
 */
.ml-zoom-control__slider :deep(.el-slider__button-wrapper) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ml-zoom-control__slider :deep(.el-slider__button-wrapper::after) {
  display: none;
}

.ml-zoom-control__value {
  border: none;
  height: 30px;
  min-width: 64px;
  padding: 0 6px;
  font-variant-numeric: tabular-nums;
}
</style>

<style>
.ml-zoom-control__menu .el-dropdown-menu__item.is-current {
  color: var(--el-color-primary);
  font-weight: 600;
}
</style>
