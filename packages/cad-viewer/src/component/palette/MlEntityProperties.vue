<template>
  <div ref="rootRef" class="ml-entity-properties">
    <template v-if="entities.length">
      <div v-if="someLocked || allLocked" class="ml-inspector-note">
        <el-icon><Lock /></el-icon>
        <span>{{ lockedNote }}</span>
      </div>

      <!-- ===== Selection (multiple entities) ===== -->
      <section v-if="entities.length > 1" class="ml-inspector-section">
        <button
          type="button"
          class="ml-inspector-section__header"
          :aria-expanded="!isCollapsed(SELECTION_SECTION)"
          @click="toggleSection(SELECTION_SECTION)"
        >
          <el-icon class="ml-inspector-section__caret">
            <ArrowRight v-if="isCollapsed(SELECTION_SECTION)" />
            <ArrowDown v-else />
          </el-icon>
          <span>{{ panelText('selection') }}</span>
          <span class="ml-inspector-section__badge">
            {{
              panelText('multipleEntitySelected', { count: entities.length })
            }}
          </span>
        </button>
        <div
          v-show="!isCollapsed(SELECTION_SECTION)"
          class="ml-inspector-section__body"
        >
          <div v-if="boxValues" class="ml-inspector-box">
            <ml-anchor-picker v-model="anchor" :disabled="allLocked" />
            <div class="ml-inspector-box__fields">
              <label
                v-for="field in BOX_FIELDS"
                :key="field"
                class="ml-inspector-box__field"
                :title="
                  field === 'width' || field === 'height'
                    ? panelText('keepAspectHint')
                    : undefined
                "
              >
                <span class="ml-inspector-box__label">
                  {{ panelText(field) }}
                </span>
                <ml-inspector-input
                  numeric
                  :decimals="precision.length"
                  :model-value="boxValues[field]"
                  :disabled="
                    allLocked ||
                    ((field === 'width' || field === 'height') &&
                      !(boxValues[field] > 0))
                  "
                  @commit="
                    (v: string | number) =>
                      setBoxField(anchor, field, v as number)
                  "
                />
              </label>
            </div>
          </div>

          <div class="ml-inspector-types">
            <button
              v-for="item in summary.types"
              :key="item.type"
              type="button"
              class="ml-inspector-types__item"
              :title="
                panelText('selectOnlyType', { type: entityTypeName(item.type) })
              "
              :disabled="summary.types.length < 2"
              @click="selectOnlyType(item.type)"
            >
              <span>{{ entityTypeName(item.type) }}</span>
              <span class="ml-inspector-types__count">{{ item.count }}</span>
            </button>
          </div>

          <div
            v-if="summary.lengthCount || summary.areaCount"
            class="ml-inspector-rows"
          >
            <template v-if="summary.lengthCount">
              <div class="ml-inspector-row__label">
                {{ panelText('totalLength') }}
              </div>
              <div
                class="ml-inspector-row__value ml-readonly-value"
                @dblclick="
                  copyText(
                    formatInspectorNumber(summary.totalLength, precision.length)
                  )
                "
              >
                {{
                  formatInspectorNumber(summary.totalLength, precision.length)
                }}
                <span class="ml-inspector-muted">
                  {{ panelText('itemCount', { count: summary.lengthCount }) }}
                </span>
              </div>
            </template>
            <template v-if="summary.areaCount">
              <div class="ml-inspector-row__label">
                {{ panelText('totalArea') }}
              </div>
              <div
                class="ml-inspector-row__value ml-readonly-value"
                @dblclick="
                  copyText(
                    formatInspectorNumber(summary.totalArea, precision.length)
                  )
                "
              >
                {{ formatInspectorNumber(summary.totalArea, precision.length) }}
                <span class="ml-inspector-muted">
                  {{ panelText('itemCount', { count: summary.areaCount }) }}
                </span>
              </div>
            </template>
          </div>
        </div>
      </section>

      <!-- ===== Property groups ===== -->
      <template v-for="group in displayGroups" :key="group.groupName">
        <section class="ml-inspector-section">
          <button
            type="button"
            class="ml-inspector-section__header"
            :aria-expanded="!isCollapsed(group.groupName)"
            @click="toggleSection(group.groupName)"
          >
            <el-icon class="ml-inspector-section__caret">
              <ArrowRight v-if="isCollapsed(group.groupName)" />
              <ArrowDown v-else />
            </el-icon>
            <span>{{ entityPropName(group.groupName) }}</span>
          </button>
          <div
            v-show="!isCollapsed(group.groupName)"
            class="ml-inspector-section__body ml-inspector-rows"
          >
            <template v-for="row in group.rows" :key="row.key">
              <div class="ml-inspector-row__label" :title="propertyName(row)">
                {{ propertyName(row) }}
              </div>
              <div class="ml-inspector-row__value">
                <!-- Array (vertices…): index + read-only item values -->
                <template v-if="row.type === 'array'">
                  <el-input-number
                    controls-position="right"
                    :model-value="arrayIndex(row)"
                    :min="1"
                    :max="Math.max(1, arrayItems(row).length)"
                    :step="1"
                    :precision="0"
                    @change="(v: number | undefined) => setArrayIndex(row, v)"
                  />
                </template>

                <!-- Read-only -->
                <template v-else-if="!canEdit(row)">
                  <ml-color-dropdown
                    v-if="row.type === 'color' && !row.mixed"
                    :model-value="row.value as AcCmColor"
                    disabled
                  />
                  <span
                    v-else
                    :title="formatDisplayValue(row)"
                    class="ml-readonly-value"
                    :class="{ 'ml-inspector-muted': row.mixed }"
                    @dblclick="copyText(formatDisplayValue(row))"
                  >
                    {{ formatDisplayValue(row) }}
                  </span>
                </template>

                <!-- Editable -->
                <template v-else>
                  <ml-hatch-pattern-dropdown
                    v-if="isHatchPatternField(row)"
                    :model-value="String(row.value ?? '')"
                    @update:modelValue="(v: string) => setProperty(row, v)"
                  />

                  <ml-layer-select
                    v-else-if="row.name === 'layer'"
                    :model-value="
                      row.mixed ? undefined : String(row.value ?? '')
                    "
                    :options="layerOptions"
                    :placeholder="mixedText"
                    @update:modelValue="(v: string) => setProperty(row, v)"
                  />

                  <ml-line-type-select
                    v-else-if="row.type === 'linetype'"
                    :model-value="
                      row.mixed ? undefined : String(row.value ?? '')
                    "
                    :placeholder="mixedText"
                    @update:modelValue="(v: string) => setProperty(row, v)"
                  />

                  <ml-line-weight-select
                    v-else-if="row.type === 'lineweight'"
                    :model-value="
                      row.mixed ? undefined : (row.value as AcGiLineWeight)
                    "
                    :placeholder="mixedText"
                    @update:modelValue="
                      (v: AcGiLineWeight) => setProperty(row, v)
                    "
                  />

                  <ml-color-dropdown
                    v-else-if="row.type === 'color'"
                    :model-value="
                      row.mixed ? undefined : (row.value as AcCmColor)
                    "
                    :placeholder="mixedText"
                    @update:modelValue="
                      (v: AcCmColor | undefined) => v && setProperty(row, v)
                    "
                  />

                  <el-select
                    v-else-if="row.type === 'enum'"
                    :model-value="enumValue(row)"
                    :placeholder="mixedText"
                    @change="(v: unknown) => setProperty(row, v)"
                  >
                    <el-option
                      v-for="opt in row.options || []"
                      :key="String(opt.value)"
                      :label="entityPropEnum(opt.label)"
                      :value="enumOptionValue(opt.value)"
                    />
                  </el-select>

                  <div
                    v-else-if="row.type === 'boolean'"
                    class="ml-inspector-switch"
                  >
                    <el-switch
                      :model-value="!!row.value"
                      @change="
                        (v: string | number | boolean) => setProperty(row, !!v)
                      "
                    />
                    <span v-if="row.mixed" class="ml-inspector-muted">
                      {{ mixedText }}
                    </span>
                  </div>

                  <ml-inspector-input
                    v-else-if="row.type === 'int' || row.type === 'float'"
                    numeric
                    :integer="row.type === 'int'"
                    :decimals="decimalsOf(row)"
                    :model-value="row.value"
                    :mixed="row.mixed"
                    :mixed-placeholder="mixedText"
                    @commit="(v: string | number) => setProperty(row, v)"
                  />

                  <ml-inspector-input
                    v-else
                    :model-value="row.value"
                    :mixed="row.mixed"
                    :mixed-placeholder="mixedText"
                    @commit="(v: string | number) => setProperty(row, v)"
                  />
                </template>
              </div>

              <!-- Item values of an array property -->
              <template v-if="row.type === 'array'">
                <template
                  v-for="item in arrayItemRows(row)"
                  :key="`${row.key}.${item.name}`"
                >
                  <div
                    class="ml-inspector-row__label ml-inspector-row__label--sub"
                  >
                    {{ entityPropName(item.name) }}
                  </div>
                  <div
                    class="ml-inspector-row__value ml-readonly-value"
                    @dblclick="copyText(item.text)"
                  >
                    {{ item.text }}
                  </div>
                </template>
              </template>
            </template>
          </div>
        </section>

        <!-- ===== Symbol properties (attributes), after the symbol group ===== -->
        <section
          v-if="
            group.groupName === symbolPropertiesAfter &&
            symbolPropertyRows.length
          "
          class="ml-inspector-section"
        >
          <button
            type="button"
            class="ml-inspector-section__header"
            :aria-expanded="!isCollapsed(ATTRIBUTE_SECTION)"
            @click="toggleSection(ATTRIBUTE_SECTION)"
          >
            <el-icon class="ml-inspector-section__caret">
              <ArrowRight v-if="isCollapsed(ATTRIBUTE_SECTION)" />
              <ArrowDown v-else />
            </el-icon>
            <span>{{ entityPropName('attribute') }}</span>
          </button>
          <div
            v-show="!isCollapsed(ATTRIBUTE_SECTION)"
            class="ml-inspector-section__body ml-inspector-rows"
          >
            <template v-for="row in symbolPropertyRows" :key="row.tagKey">
              <div
                class="ml-inspector-row__label ml-inspector-attr-label"
                :class="{ 'is-invisible': row.isInvisible }"
                :title="symbolPropertyTitle(row)"
              >
                <el-icon v-if="row.isInvisible" class="ml-inspector-attr-icon">
                  <Hide />
                </el-icon>
                <el-icon v-else-if="row.isConst" class="ml-inspector-attr-icon">
                  <Lock />
                </el-icon>
                <span class="ml-inspector-attr-text">{{ row.label }}</span>
              </div>
              <div
                class="ml-inspector-row__value"
                :class="{ 'is-invisible': row.isInvisible }"
                :data-symbol-tag="row.tagKey"
              >
                <span
                  v-if="row.isConst || allLocked"
                  class="ml-readonly-value"
                  :class="{ 'ml-inspector-muted': row.mixed }"
                  :title="row.mixed ? mixedText : row.value"
                  @dblclick="copyText(row.value ?? '')"
                >
                  {{ row.mixed ? mixedText : row.value }}
                </span>
                <ml-inspector-input
                  v-else
                  :ref="el => registerSymbolInput(row.tagKey, el)"
                  :model-value="row.value"
                  :mixed="row.mixed"
                  :mixed-placeholder="mixedText"
                  @commit="
                    (v: string | number) =>
                      setSymbolProperty(row.tagKey, String(v))
                  "
                />
              </div>
            </template>
          </div>
        </section>
      </template>
    </template>

    <div v-else class="ml-no-entity-selected">
      {{ panelText('noEntitySelected') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowDown, ArrowRight, Hide, Lock } from '@element-plus/icons-vue'
import { AcApDocManager } from '@mlightcad/cad-simple-viewer'
import {
  AcCmColor,
  AcCmTransparency,
  AcDbEntity,
  AcDbObjectId,
  AcGiLineWeight,
  log
} from '@mlightcad/data-model'
import {
  ElIcon,
  ElInputNumber,
  ElMessage,
  ElOption,
  ElSelect,
  ElSwitch
} from 'element-plus'
import { computed, nextTick, reactive, ref, toRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  ADVANCED_GROUP,
  boxFields,
  formatInspectorNumber,
  type MlAnchor,
  type MlInspectorRow,
  type MlSymbolPropertyRow,
  numberKind,
  pendingSymbolPropertyFocus,
  SYMBOL_GROUP,
  useEntityInspector,
  useLayers
} from '../../composable'
import {
  colorName,
  entityName,
  entityPropEnum,
  entityPropName,
  lineTypeName,
  symbolicName
} from '../../locale'
import {
  MlColorDropdown,
  MlHatchPatternDropdown,
  MlLayerSelect,
  MlLineTypeSelect,
  MlLineWeightSelect
} from '../common'
import MlAnchorPicker from './inspector/MlAnchorPicker.vue'
import MlInspectorInput from './inspector/MlInspectorInput.vue'

const { t } = useI18n()

const props = defineProps<{
  /** Object ids of the selected entities. */
  selectionIds: AcDbObjectId[]
}>()

const SELECTION_SECTION = '__selection'
const ATTRIBUTE_SECTION = '__attribute'
const BOX_FIELDS = ['x', 'y', 'width', 'height'] as const

const {
  entities,
  groups,
  symbols,
  symbolPropertyRows,
  summary,
  box,
  precision,
  allLocked,
  someLocked,
  setProperty,
  setSymbolProperty,
  setBoxField,
  selectOnlyType
} = useEntityInspector(toRef(props, 'selectionIds'))

const { layers } = useLayers(AcApDocManager.instance)
const layerOptions = computed(() =>
  layers.map(layer => ({
    value: layer.name,
    name: layer.name,
    cssColor: layer.cssColor || '#7b8794',
    isOn: layer.isOn,
    isLocked: layer.isLocked,
    isFrozen: layer.isFrozen,
    lineType: layer.linetype
  }))
)

/* ================= text ================= */

function panelText(key: string, params?: Record<string, unknown>) {
  // eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys -- keys under propertyPanel
  return t(
    `main.toolPalette.entityProperties.propertyPanel.${key}`,
    params ?? {}
  )
}

const mixedText = computed(() => panelText('mixed'))

const lockedNote = computed(() =>
  allLocked.value ? panelText('allLocked') : panelText('someLocked')
)

function entityTypeName(type: string) {
  return entityName({ type } as AcDbEntity)
}

function propertyName(row: MlInspectorRow) {
  return row.skipTranslation ? row.name : entityPropName(row.name)
}

/** Decimals for a numeric row, following the drawing's precision. */
function decimalsOf(row: MlInspectorRow) {
  if (row.type === 'int') return 0
  const kind = numberKind(row)
  if (kind === 'angle') return precision.value.angle
  if (kind === 'length') return precision.value.length
  return undefined
}

function formatValue(row: MlInspectorRow, v: unknown): string {
  switch (row.type) {
    case 'boolean':
      return v ? 'True' : 'False'
    case 'enum':
      return entityPropEnum(row.options?.find(o => o.value === v)?.label ?? '')
    case 'color':
      return colorName((v as AcCmColor | undefined)?.toString() ?? '')
    case 'linetype':
      return lineTypeName(String(v ?? ''))
    case 'lineweight':
      return formatLineWeight(v as number)
    case 'transparency':
      return (v as AcCmTransparency | undefined)?.toString() ?? ''
    default:
      if (typeof v === 'number') {
        return formatInspectorNumber(v, decimalsOf(row))
      }
      return v != null ? String(v) : ''
  }
}

function formatLineWeight(v: number): string {
  switch (v) {
    case AcGiLineWeight.ByLayer:
      return symbolicName('byLayer')
    case AcGiLineWeight.ByBlock:
      return symbolicName('byBlock')
    case AcGiLineWeight.ByLineWeightDefault:
      return symbolicName('default')
    default:
      return AcGiLineWeight[v] ?? String(v ?? '')
  }
}

function formatDisplayValue(row: MlInspectorRow): string {
  if (row.mixed) return mixedText.value
  return formatValue(row, row.value)
}

function symbolPropertyTitle(row: MlSymbolPropertyRow) {
  const parts = [row.label === row.tag ? row.tag : `${row.label} (${row.tag})`]
  if (row.isInvisible) parts.push(panelText('invisibleAttribute'))
  if (row.isConst) parts.push(panelText('constantAttribute'))
  return parts.join(' — ')
}

async function copyText(value: string) {
  if (!value) return
  try {
    await navigator.clipboard.writeText(value)
    ElMessage({
      message: panelText('propValCopied'),
      grouping: true,
      type: 'success'
    })
  } catch (e) {
    log.error(e)
    ElMessage({
      message: panelText('failedToCopyPropVal'),
      grouping: true,
      type: 'error'
    })
  }
}

/* ================= sections ================= */

const collapsed = reactive(new Set<string>([ADVANCED_GROUP]))

function isCollapsed(name: string) {
  return collapsed.has(name)
}

function toggleSection(name: string) {
  if (collapsed.has(name)) collapsed.delete(name)
  else collapsed.add(name)
}

const displayGroups = computed(() => groups.value)

/** Symbol properties go right after the symbol group (or general). */
const symbolPropertiesAfter = computed(() => {
  if (!symbols.value.length) return undefined
  const names = displayGroups.value.map(group => group.groupName)
  if (names.includes(SYMBOL_GROUP)) return SYMBOL_GROUP
  return names.filter(name => name !== ADVANCED_GROUP).pop()
})

/* ================= editing ================= */

function enumValue(row: MlInspectorRow) {
  return row.mixed ? undefined : (row.value as string | number)
}

function enumOptionValue(value: unknown) {
  return value as string | number
}

function canEdit(row: MlInspectorRow) {
  return row.editable && !allLocked.value
}

function isHatchPatternField(row: MlInspectorRow) {
  if (entities.value[0]?.type.toLowerCase() !== 'hatch') return false
  const name = row.name.toLowerCase()
  return name === 'patternname' || name === 'pattern'
}

/* ================= arrays (single entity) ================= */

const arrayIndices = reactive(new Map<string, number>())

function arrayItems(row: MlInspectorRow): Record<string, unknown>[] {
  if (!row.property) return []
  try {
    const items = row.property.accessor.get()
    return Array.isArray(items) ? items : []
  } catch {
    return []
  }
}

function arrayIndex(row: MlInspectorRow) {
  const count = arrayItems(row).length
  const index = arrayIndices.get(row.key) ?? 1
  return Math.min(Math.max(1, index), Math.max(1, count))
}

function setArrayIndex(row: MlInspectorRow, value: number | undefined) {
  if (value == null) return
  arrayIndices.set(row.key, Math.round(value))
}

function arrayItemRows(row: MlInspectorRow) {
  const item = arrayItems(row)[arrayIndex(row) - 1]
  const schema = row.property?.itemSchema
  if (!item || !schema) return []
  return schema.properties.map(prop => ({
    name: prop.name,
    text: formatValue(
      { ...row, type: prop.type } as MlInspectorRow,
      item[prop.name]
    )
  }))
}

/* ================= selection box ================= */

const anchor = ref<MlAnchor>({ x: 0, y: 0 })

const boxValues = computed(() =>
  box.value ? boxFields(box.value, anchor.value) : undefined
)

/* ================= focus from double-click ================= */

const rootRef = ref<HTMLElement>()
const symbolInputs = new Map<string, { focus: () => void }>()

function registerSymbolInput(tagKey: string, el: unknown) {
  if (el && typeof (el as { focus?: unknown }).focus === 'function') {
    symbolInputs.set(tagKey, el as { focus: () => void })
  } else {
    symbolInputs.delete(tagKey)
  }
}

watch(
  [pendingSymbolPropertyFocus, symbolPropertyRows],
  async ([request]) => {
    if (!request) return
    if (!props.selectionIds.includes(request.objectId)) return
    await nextTick()
    collapsed.delete(ATTRIBUTE_SECTION)
    await nextTick()
    const wanted = request.tag?.trim().toUpperCase()
    const rows = symbolPropertyRows.value
    const target =
      rows.find(row => row.tagKey === wanted && symbolInputs.has(row.tagKey)) ??
      rows.find(row => symbolInputs.has(row.tagKey))
    pendingSymbolPropertyFocus.value = null
    if (!target) return
    rootRef.value
      ?.querySelector(`[data-symbol-tag="${CSS.escape(target.tagKey)}"]`)
      ?.scrollIntoView({ block: 'nearest' })
    symbolInputs.get(target.tagKey)?.focus()
  },
  { immediate: true }
)
</script>

<style scoped>
.ml-entity-properties {
  padding: 4px 6px 8px;
  flex: 1;
  min-height: 0;
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
  font-size: 12px;
}

.ml-inspector-note {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 2px 0 6px;
  padding: 4px 6px;
  border-radius: 4px;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
}

.ml-inspector-section + .ml-inspector-section {
  border-top: 1px solid var(--el-border-color-lighter);
}

.ml-inspector-section__header {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 6px 2px;
  border: none;
  background: transparent;
  color: var(--el-text-color-primary);
  font: inherit;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

.ml-inspector-section__header:hover {
  color: var(--el-color-primary);
}

.ml-inspector-section__caret {
  font-size: 11px;
}

.ml-inspector-section__badge {
  margin-left: auto;
  font-weight: normal;
  color: var(--el-text-color-secondary);
}

.ml-inspector-section__body {
  padding: 0 2px 8px 17px;
}

.ml-inspector-rows {
  display: grid;
  grid-template-columns: minmax(64px, 40%) minmax(0, 1fr);
  column-gap: 8px;
  row-gap: 4px;
  align-items: center;
}

.ml-inspector-row__label {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--el-text-color-regular);
}

.ml-inspector-row__label--sub {
  padding-left: 10px;
  color: var(--el-text-color-secondary);
}

.ml-inspector-row__value {
  min-width: 0;
  min-height: 24px;
  display: flex;
  align-items: center;
}

.ml-inspector-row__value > * {
  width: 100%;
}

.ml-readonly-value {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--el-text-color-regular);
}

.ml-inspector-muted {
  color: var(--el-text-color-secondary);
  font-style: italic;
}

.ml-inspector-row__value > .ml-inspector-muted {
  width: auto;
  margin-left: 4px;
}

.ml-inspector-switch {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ml-inspector-box {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin-bottom: 8px;
}

.ml-inspector-box__fields {
  flex: 1;
  min-width: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4px 6px;
}

.ml-inspector-box__field {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
}

.ml-inspector-box__label {
  flex: 0 0 auto;
  min-width: 1.5em;
  color: var(--el-text-color-secondary);
}

.ml-inspector-types {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.ml-inspector-types__item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border: 1px solid var(--el-border-color);
  border-radius: 10px;
  background: var(--el-fill-color-blank);
  color: var(--el-text-color-regular);
  font: inherit;
  cursor: pointer;
}

.ml-inspector-types__item:hover:not(:disabled) {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}

.ml-inspector-types__item:disabled {
  cursor: default;
}

.ml-inspector-types__count {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.ml-inspector-attr-label {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ml-inspector-attr-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.ml-inspector-attr-icon {
  flex: 0 0 auto;
  color: var(--el-text-color-secondary);
}

.is-invisible {
  opacity: 0.55;
}

.ml-no-entity-selected {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-style: italic;
  font-size: 0.875rem;
  padding: 0.5rem;
}
</style>
