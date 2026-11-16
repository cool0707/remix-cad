<template>
  <div class="ml-same-shape" data-testid="same-shape-palette">
    <div class="ml-same-shape-pattern">
      <div class="ml-same-shape-label">
        {{ t('main.toolPalette.sameShape.pattern') }}
      </div>
      <div class="ml-same-shape-pattern-row">
        <span
          class="ml-same-shape-pattern-name"
          data-testid="same-shape-pattern"
        >
          {{ patternText }}
        </span>
        <el-button
          size="small"
          :title="t('main.toolPalette.sameShape.usePatternHint')"
          data-testid="same-shape-use-selection"
          :disabled="isEditing"
          @click="useSelection"
        >
          {{ t('main.toolPalette.sameShape.usePattern') }}
        </el-button>
      </div>
      <div v-if="ignoredCount" class="ml-same-shape-note">
        {{ t('main.toolPalette.sameShape.ignored', { count: ignoredCount }) }}
      </div>
    </div>

    <div class="ml-same-shape-options">
      <div class="ml-same-shape-label">
        {{ t('main.toolPalette.sameShape.differences') }}
      </div>
      <el-checkbox
        v-model="options.rotate"
        size="small"
        data-testid="same-shape-rotate"
      >
        {{ t('main.toolPalette.sameShape.rotate') }}
      </el-checkbox>
      <el-checkbox
        v-model="options.mirror"
        size="small"
        data-testid="same-shape-mirror"
      >
        {{ t('main.toolPalette.sameShape.mirror') }}
      </el-checkbox>
      <el-checkbox
        v-model="options.scale"
        size="small"
        data-testid="same-shape-scale"
      >
        {{ t('main.toolPalette.sameShape.scale') }}
      </el-checkbox>
    </div>

    <div
      class="ml-same-shape-status"
      data-testid="same-shape-status"
      role="status"
      aria-live="polite"
    >
      <template v-if="isEditing">
        {{ t('main.toolPalette.sameShape.editingSymbol') }}
      </template>
      <template v-else-if="searching">
        {{ t('main.toolPalette.sameShape.searching') }}
      </template>
      <template v-else-if="!patternIds.length || !result?.pattern.length">
        {{ t('main.toolPalette.sameShape.noPattern') }}
      </template>
      <template v-else>
        <div data-testid="same-shape-count">
          {{
            result.found.length
              ? t('main.toolPalette.sameShape.foundCount', {
                  count: result.found.length
                })
              : t('main.toolPalette.sameShape.foundNone')
          }}
        </div>
        <div v-if="result.found.length" class="ml-same-shape-note">
          {{
            t('main.toolPalette.sameShape.foundBreakdown', {
              symbols: symbolCount,
              shapes: result.found.length - symbolCount
            })
          }}
        </div>
        <div v-if="result.truncated" class="ml-same-shape-note">
          {{ t('main.toolPalette.sameShape.truncated') }}
        </div>
      </template>
      <div v-if="stale && !searching" class="ml-same-shape-stale">
        {{ t('main.toolPalette.sameShape.stale') }}
        <el-button
          size="small"
          link
          type="primary"
          data-testid="same-shape-search-again"
          @click="search"
        >
          {{ t('main.toolPalette.sameShape.searchAgain') }}
        </el-button>
      </div>
    </div>

    <div
      v-if="result?.found.length && !isEditing"
      class="ml-same-shape-actions"
    >
      <el-button
        size="small"
        type="primary"
        :title="t('main.toolPalette.sameShape.selectAllHint')"
        data-testid="same-shape-select-all"
        @click="selectAll"
      >
        {{ t('main.toolPalette.sameShape.selectAll') }}
      </el-button>
      <el-button
        v-if="canReplace"
        size="small"
        :title="replaceHint"
        data-testid="same-shape-to-symbol"
        :disabled="stale"
        @click="replaceWithSymbol"
      >
        {{ t('main.toolPalette.sameShape.toSymbol') }}
      </el-button>
    </div>
    <div
      v-if="canReplace && result?.found.length && !isEditing"
      class="ml-same-shape-note"
    >
      {{ replaceHint }}
    </div>

    <ul
      v-if="result && !isEditing"
      class="ml-same-shape-list"
      data-testid="same-shape-list"
    >
      <li
        v-for="(row, index) in rows"
        :key="index"
        class="ml-same-shape-row"
        :class="{ 'is-selected': index === activeRow }"
        tabindex="0"
        data-testid="same-shape-row"
        @click="goTo(index)"
        @keydown.enter.space.prevent="goTo(index)"
      >
        <div class="ml-same-shape-row-name">{{ row.name }}</div>
        <div class="ml-same-shape-row-meta">{{ row.meta }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {
  acapCanMakeSameShapeSymbols,
  AcApDocManager,
  acapLooseSameShapes,
  type AcApSameShapeFound,
  type AcApSameShapeResult,
  acapSameShapeSymbolName,
  type AcApShapeMatchOptions,
  type AcTrView2d,
  eventBus
} from '@mlightcad/cad-simple-viewer'
import { AcDbObjectId } from '@mlightcad/data-model'
import { ElButton, ElCheckbox, ElMessage, ElMessageBox } from 'element-plus'
import {
  computed,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  shallowRef,
  watch
} from 'vue'
import { useI18n } from 'vue-i18n'

import { store } from '../../app'
import { zoomToCountListInstances } from '../../composable/useCountList'
import { useSymbolEdit } from '../../composable/useSymbolEdit'

const { t } = useI18n()
const { isEditing } = useSymbolEdit()

const OPTIONS_KEY = 'ml-cad-viewer.sameShapeOptions'

/** Options last used (a per-viewer convenience). */
const readOptions = (): AcApShapeMatchOptions => {
  const defaults = { rotate: true, mirror: true, scale: false }
  try {
    const stored = JSON.parse(localStorage.getItem(OPTIONS_KEY) ?? 'null')
    if (stored && typeof stored === 'object') {
      return {
        rotate: stored.rotate !== false,
        mirror: stored.mirror !== false,
        scale: stored.scale === true
      }
    }
  } catch {
    // Storage blocked or broken: defaults.
  }
  return defaults
}

const options = reactive<AcApShapeMatchOptions>(readOptions())
const patternIds = ref<AcDbObjectId[]>([])
const result = shallowRef<AcApSameShapeResult>()
const searching = ref(false)
const stale = ref(false)
const activeRow = ref(-1)
let searchTimer: ReturnType<typeof setTimeout> | undefined

const view = () => AcApDocManager.instance?.curView as AcTrView2d | undefined
const actions = () => view()?.editActions

const patternText = computed(() => {
  const current = result.value
  if (!current?.pattern.length) return '—'
  if (current.patternBlockName) {
    return t('main.toolPalette.sameShape.patternSymbol', {
      name: current.patternBlockName
    })
  }
  return t('main.toolPalette.sameShape.patternShapes', {
    count: current.pattern.length
  })
})

const ignoredCount = computed(() => result.value?.ignored.length ?? 0)

const symbolCount = computed(
  () => result.value?.found.filter(found => found.blockName).length ?? 0
)

const canReplace = computed(() => {
  const current = result.value
  return (
    !!current &&
    current.found.length > 0 &&
    !!actions()?.canEdit &&
    acapCanMakeSameShapeSymbols(current)
  )
})

/** Places that become symbols: loose copies, and the selection if loose. */
const replaceCount = computed(() => {
  const current = result.value
  if (!current) return 0
  return (
    acapLooseSameShapes(current).length + (current.patternBlockName ? 0 : 1)
  )
})

const replaceHint = computed(() => {
  const current = result.value
  if (!current) return ''
  const name = acapSameShapeSymbolName(current)
  if (name) {
    return t('main.toolPalette.sameShape.toSymbolExisting', {
      count: replaceCount.value,
      name
    })
  }
  return t('main.toolPalette.sameShape.toSymbolNew', {
    count: replaceCount.value - 1
  })
})

const formatNumber = (value: number, digits: number) =>
  String(Number(value.toFixed(digits)))

const describe = (found: AcApSameShapeFound) => {
  const parts: string[] = []
  const degrees = (found.rotation * 180) / Math.PI
  const turn = ((degrees % 360) + 360) % 360
  if (Math.abs(turn) > 0.05 && Math.abs(turn - 360) > 0.05) {
    parts.push(
      t('main.toolPalette.sameShape.listTurn', {
        angle: formatNumber(turn, 1)
      })
    )
  }
  if (found.mirrored) parts.push(t('main.toolPalette.sameShape.listMirrored'))
  if (Math.abs(found.scale - 1) > 1e-6) {
    parts.push(
      t('main.toolPalette.sameShape.listScale', {
        scale: formatNumber(found.scale, 3)
      })
    )
  }
  return parts.join(' · ')
}

interface Row {
  ids: AcDbObjectId[]
  name: string
  meta: string
}

const rows = computed<Row[]>(() => {
  const current = result.value
  if (!current?.pattern.length) return []
  const name = (ids: AcDbObjectId[], blockName?: string) =>
    blockName
      ? t('main.toolPalette.sameShape.listSymbol', { name: blockName })
      : t('main.toolPalette.sameShape.listShapes', { count: ids.length })
  return [
    {
      ids: current.pattern,
      name: name(current.pattern, current.patternBlockName),
      meta: t('main.toolPalette.sameShape.listSelected')
    },
    ...current.found.map(found => ({
      ids: found.ids,
      name: name(found.ids, found.blockName),
      meta: describe(found)
    }))
  ]
})

/** Searches with the current pattern and options. */
const search = () => {
  if (searchTimer) clearTimeout(searchTimer)
  activeRow.value = -1
  if (isEditing.value || !patternIds.value.length) {
    result.value = undefined
    stale.value = false
    return
  }
  searching.value = true
  // Let the "searching" text paint before a long search.
  searchTimer = setTimeout(() => {
    searchTimer = undefined
    try {
      result.value = actions()?.findSameShape({ ...options }, patternIds.value)
    } finally {
      searching.value = false
      stale.value = false
    }
  }, 30)
}

/** Takes the selection as the shape and searches. */
const useSelection = () => {
  const edit = actions()
  patternIds.value = edit
    ? edit.selectedEntities(false).map(entity => entity.objectId)
    : []
  search()
}

const selectAll = () => {
  const current = result.value
  if (!current) return
  actions()?.select([
    ...current.pattern,
    ...current.found.flatMap(found => found.ids)
  ])
}

const goTo = (index: number) => {
  const row = rows.value[index]
  if (!row) return
  activeRow.value = index
  actions()?.select(row.ids)
  zoomToCountListInstances(row.ids)
}

/** A free name for a new symbol ("Symbol1", "Symbol2" …). */
const freeSymbolName = () => {
  const blocks = AcApDocManager.instance.curDocument.database.tables.blockTable
  for (let n = 1; ; n++) {
    const name = t('main.toolPalette.sameShape.newNameDefault', { n })
    if (!blocks.has(name)) return name
  }
}

const askSymbolName = async (): Promise<string | undefined> => {
  const blocks = AcApDocManager.instance.curDocument.database.tables.blockTable
  try {
    const answer = await ElMessageBox.prompt(
      t('main.toolPalette.sameShape.newNamePrompt'),
      t('main.toolPalette.sameShape.newNameTitle'),
      {
        confirmButtonText: t('main.toolPalette.sameShape.confirm'),
        cancelButtonText: t('main.toolPalette.sameShape.cancel'),
        inputValue: freeSymbolName(),
        inputPattern: /\S+/,
        inputErrorMessage: t('main.toolPalette.sameShape.newNamePrompt'),
        inputValidator: value =>
          blocks.has(value.trim())
            ? t('main.toolPalette.sameShape.nameTaken', { name: value.trim() })
            : true
      }
    )
    return answer.value.trim() || undefined
  } catch {
    return undefined
  }
}

const replaceWithSymbol = async () => {
  const current = result.value
  const edit = actions()
  if (!current || !edit || stale.value) return
  let newName = ''
  if (!acapSameShapeSymbolName(current)) {
    const name = await askSymbolName()
    if (!name) return
    newName = name
  }
  if (result.value !== current || stale.value) return
  const replaced = edit.replaceSameShapesWithSymbol(current, newName)
  if (!replaced?.inserts.length) {
    ElMessage({
      message: t('main.toolPalette.sameShape.toSymbolNothing'),
      type: 'warning'
    })
    return
  }
  ElMessage({
    message: t('main.toolPalette.sameShape.replaced', {
      count: replaced.inserts.length,
      name: replaced.blockName
    }),
    type: 'success',
    grouping: true
  })
  // Look again from the symbol that took the selection's place.
  if (!current.patternBlockName) {
    patternIds.value = [replaced.inserts[0].objectId]
  }
  search()
  // The search above selects nothing: show the new symbols selected.
  edit.select(replaced.inserts.map(insert => insert.objectId))
}

const markStale = () => {
  if (result.value && !searching.value) stale.value = true
}

const onDocumentActivated = () => {
  patternIds.value = []
  result.value = undefined
  stale.value = false
}

watch(
  options,
  value => {
    try {
      localStorage.setItem(OPTIONS_KEY, JSON.stringify(value))
    } catch {
      // Storage blocked: not remembered.
    }
    search()
  },
  { deep: true }
)

watch(
  () => store.dialogs.sameShapeTick,
  () => useSelection()
)

watch(isEditing, () => search())

onMounted(() => {
  useSelection()
  eventBus.on('undo-stack-changed', markStale)
  AcApDocManager.instance.events.documentActivated.addEventListener(
    onDocumentActivated
  )
})

onUnmounted(() => {
  if (searchTimer) clearTimeout(searchTimer)
  eventBus.off('undo-stack-changed', markStale)
  AcApDocManager.instance.events.documentActivated.removeEventListener(
    onDocumentActivated
  )
})
</script>

<style scoped>
.ml-same-shape {
  font-size: 13px;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  gap: 8px;
  padding: 8px;
  box-sizing: border-box;
}

.ml-same-shape-label {
  color: var(--el-text-color-secondary);
  font-size: 12px;
  margin-bottom: 2px;
}

.ml-same-shape-pattern-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ml-same-shape-pattern-name {
  flex: 1;
  min-width: 0;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ml-same-shape-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0 16px;
  flex-shrink: 0;
}

.ml-same-shape-options .ml-same-shape-label {
  flex-basis: 100%;
}

.ml-same-shape-options :deep(.el-checkbox) {
  height: auto;
  margin-right: 0;
}

.ml-same-shape-status {
  flex-shrink: 0;
}

.ml-same-shape-note,
.ml-same-shape-stale {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.ml-same-shape-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex-shrink: 0;
}

.ml-same-shape-actions .el-button + .el-button {
  margin-left: 0;
}

.ml-same-shape-list {
  flex: 1;
  min-height: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow: auto;
  border-top: 1px solid var(--el-border-color-lighter);
}

.ml-same-shape-row {
  padding: 6px 8px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  cursor: pointer;
}

.ml-same-shape-row:hover {
  background: var(--el-fill-color-light);
}

.ml-same-shape-row.is-selected {
  background: var(--el-color-primary-light-9);
}

.ml-same-shape-row-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ml-same-shape-row-meta {
  color: var(--el-text-color-secondary);
  font-size: 11px;
  min-height: 1em;
}
</style>
