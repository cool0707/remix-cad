<template>
  <div class="ml-group-list" data-testid="group-list">
    <div class="ml-group-list__header">
      <span class="ml-group-list__count">
        {{ t('main.toolPalette.groupManager.count', { count: groupCount }) }}
      </span>
      <el-input
        v-model="searchText"
        clearable
        size="small"
        class="ml-group-list__search"
        :placeholder="t('main.toolPalette.groupManager.searchPlaceholder')"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <div class="ml-group-list__toolbar">
      <el-button
        text
        size="small"
        class="ml-group-list__btn"
        :title="newGroupTitle"
        :aria-label="newGroupTitle"
        :disabled="!canGroup"
        data-testid="group-new"
        @click="handleNewGroup"
      >
        <el-icon :size="16"><FolderAdd /></el-icon>
      </el-button>
      <el-button
        text
        size="small"
        class="ml-group-list__btn"
        :title="t('main.toolPalette.groupManager.toolbar.rename')"
        :aria-label="t('main.toolPalette.groupManager.toolbar.rename')"
        :disabled="!selectedGroup || !canEdit"
        data-testid="group-rename"
        @click="handleRename"
      >
        <el-icon :size="16"><EditPen /></el-icon>
      </el-button>
      <el-button
        text
        size="small"
        class="ml-group-list__btn"
        :title="t('main.toolPalette.groupManager.toolbar.ungroup')"
        :aria-label="t('main.toolPalette.groupManager.toolbar.ungroup')"
        :disabled="!selectedGroup || !canEdit"
        data-testid="group-ungroup"
        @click="handleUngroup"
      >
        <el-icon :size="16"><FolderRemove /></el-icon>
      </el-button>
      <span class="ml-group-list__sep" aria-hidden="true" />
      <el-button
        text
        size="small"
        class="ml-group-list__btn"
        :class="{ 'is-active': settings.groupSelection }"
        :title="groupSelectionTitle"
        :aria-label="groupSelectionTitle"
        :aria-pressed="settings.groupSelection"
        data-testid="group-selection-toggle"
        @click="toggleGroupSelection"
      >
        <el-icon :size="16"><Link /></el-icon>
      </el-button>
    </div>

    <div class="ml-group-list__body">
      <div
        v-if="groupCount === 0"
        class="ml-group-list__empty"
        data-testid="group-empty"
      >
        <p>{{ t('main.toolPalette.groupManager.empty') }}</p>
        <p class="ml-group-list__hint">{{ emptyHint }}</p>
      </div>
      <div v-else-if="treeData.length === 0" class="ml-group-list__empty">
        {{ t('main.toolPalette.groupManager.noMatch') }}
      </div>
      <el-tree
        v-else
        class="ml-group-list__tree"
        :data="treeData"
        node-key="key"
        :props="{ label: 'label', children: 'children' }"
        :default-expanded-keys="expandedKeys"
        :expand-on-click-node="false"
        highlight-current
        :current-node-key="currentKey"
        data-testid="group-tree"
        @node-click="handleNodeClick"
        @node-expand="handleExpand"
        @node-collapse="handleCollapse"
      >
        <template #default="{ data }">
          <div
            class="ml-group-list__row"
            :class="`is-${data.kind}`"
            :data-testid="`group-row-${data.kind}`"
            @dblclick.stop="zoomTo(data)"
          >
            <el-icon class="ml-group-list__icon" aria-hidden="true">
              <FolderOpened v-if="data.kind === 'group'" />
              <Document v-else-if="data.kind === 'entity'" />
              <MoreFilled v-else />
            </el-icon>
            <span class="ml-group-list__label" :title="data.label">
              {{ data.label }}
            </span>
            <span v-if="data.detail" class="ml-group-list__detail">
              {{ data.detail }}
            </span>
            <span class="ml-group-list__actions">
              <button
                v-if="data.kind === 'group' && canEdit && selectionIds.length"
                type="button"
                class="ml-group-list__action"
                :title="t('main.toolPalette.groupManager.addSelection')"
                :aria-label="t('main.toolPalette.groupManager.addSelection')"
                data-testid="group-add-selection"
                @click.stop="addSelection(data)"
              >
                <el-icon><Plus /></el-icon>
              </button>
              <button
                v-if="data.kind === 'entity' && canEdit"
                type="button"
                class="ml-group-list__action"
                :title="t('main.toolPalette.groupManager.removeFromGroup')"
                :aria-label="t('main.toolPalette.groupManager.removeFromGroup')"
                data-testid="group-remove-entity"
                @click.stop="removeEntity(data)"
              >
                <el-icon><Minus /></el-icon>
              </button>
            </span>
          </div>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Document,
  EditPen,
  FolderAdd,
  FolderOpened,
  FolderRemove,
  Link,
  Minus,
  MoreFilled,
  Plus,
  Search
} from '@element-plus/icons-vue'
import {
  AcApDocManager,
  type AcApGroupNode,
  acapIsGroupNameFree,
  acapRemoveGroups,
  acapRenameGroup,
  acapSetGroupMembers,
  AcApSettingManager
} from '@mlightcad/cad-simple-viewer'
import { AcDbObjectId, AcGeBox2d } from '@mlightcad/data-model'
import {
  ElButton,
  ElIcon,
  ElInput,
  ElMessage,
  ElMessageBox,
  ElTree
} from 'element-plus'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  useGroups,
  useSelectionSet,
  useSettings,
  useSymbolEdit,
  useSymbolLayer
} from '../../composable'
import { entityName } from '../../locale'

interface Props {
  editor: AcApDocManager
}

/** One row of the tree: a group, a member entity, or "n more". */
interface GroupTreeRow {
  key: string
  kind: 'group' | 'entity' | 'more'
  label: string
  detail?: string
  /** Group id (group rows) or the id of the group holding the entity */
  groupId: AcDbObjectId
  /** Entities the row stands for */
  entityIds: AcDbObjectId[]
  children?: GroupTreeRow[]
}

/** Entities listed under one group before "n more". */
const MAX_ENTITY_ROWS = 100

const props = defineProps<Props>()
const { t } = useI18n()
const settings = useSettings()
const { groups } = useGroups(props.editor)
const { selectionSet: selectionIds } = useSelectionSet()
const symbolEdit = useSymbolEdit()
const symbolLayer = useSymbolLayer()

/** Layer name as the layer list shows it. */
const layerLabel = (name: string) =>
  symbolLayer.isSymbolLayer(name) ? t('main.symbolLayer.name') : name

const searchText = ref('')
const currentKey = ref<string>()
const selectedGroupId = ref<AcDbObjectId>()
const expanded = new Set<string>()
const expandedKeys = ref<string[]>([])

const isMac =
  typeof navigator !== 'undefined' && /mac/i.test(navigator.platform ?? '')
const groupKey = isMac ? '⌘G' : 'Ctrl+G'

const db = () => props.editor.curDocument?.database

/** Groups can be changed (not inside a symbol). */
const canEdit = computed(() => !symbolEdit.isEditing.value)
const canGroup = computed(() => canEdit.value && selectionIds.value.length > 0)

const newGroupTitle = computed(
  () => `${t('main.toolPalette.groupManager.toolbar.newGroup')} (${groupKey})`
)
const groupSelectionTitle = computed(() =>
  settings.groupSelection
    ? t('main.toolPalette.groupManager.toolbar.groupSelectionOn')
    : t('main.toolPalette.groupManager.toolbar.groupSelectionOff')
)
const emptyHint = computed(() =>
  t('main.toolPalette.groupManager.emptyHint', { key: groupKey })
)

const countGroups = (nodes: AcApGroupNode[]): number =>
  nodes.reduce((sum, node) => sum + 1 + countGroups(node.children), 0)
const groupCount = computed(() => countGroups(groups.value))

const groupLabel = (node: AcApGroupNode) =>
  node.unnamed ? t('main.toolPalette.groupManager.unnamed') : node.name

const entityRows = (node: AcApGroupNode): GroupTreeRow[] => {
  const blockTable = db()?.tables.blockTable
  const rows: GroupTreeRow[] = []
  for (const id of node.entityIds.slice(0, MAX_ENTITY_ROWS)) {
    const entity = blockTable?.getEntityById(id)
    if (!entity) continue
    rows.push({
      key: `${node.id}:${id}`,
      kind: 'entity',
      label: entityName(entity),
      detail: layerLabel(entity.layer),
      groupId: node.id,
      entityIds: [id]
    })
  }
  const rest = node.entityIds.length - MAX_ENTITY_ROWS
  if (rest > 0) {
    rows.push({
      key: `${node.id}:more`,
      kind: 'more',
      label: t('main.toolPalette.groupManager.more', { count: rest }),
      groupId: node.id,
      entityIds: node.entityIds.slice(MAX_ENTITY_ROWS)
    })
  }
  return rows
}

const matches = (node: AcApGroupNode, query: string): boolean =>
  groupLabel(node).toLowerCase().includes(query) ||
  node.description.toLowerCase().includes(query) ||
  node.children.some(child => matches(child, query))

const toRows = (nodes: AcApGroupNode[], query: string): GroupTreeRow[] =>
  nodes
    .filter(node => !query || matches(node, query))
    .map(node => ({
      key: node.id,
      kind: 'group' as const,
      label: groupLabel(node),
      detail: t('main.toolPalette.groupManager.memberCount', {
        count: node.memberIds.length
      }),
      groupId: node.id,
      entityIds: node.memberIds,
      // A matching group keeps all its contents.
      children: [
        ...toRows(
          node.children,
          query && !groupLabel(node).toLowerCase().includes(query) ? query : ''
        ),
        ...entityRows(node)
      ]
    }))

const treeData = computed(() =>
  toRows(groups.value, searchText.value.trim().toLowerCase())
)

const findGroup = (
  nodes: AcApGroupNode[],
  id: AcDbObjectId | undefined
): AcApGroupNode | undefined => {
  if (!id) return undefined
  for (const node of nodes) {
    if (node.id === id) return node
    const found = findGroup(node.children, id)
    if (found) return found
  }
  return undefined
}

const selectedGroup = computed(() =>
  findGroup(groups.value, selectedGroupId.value)
)

watch(groups, () => {
  if (selectedGroupId.value && !selectedGroup.value) {
    selectedGroupId.value = undefined
    currentKey.value = undefined
  }
})

const handleExpand = (data: GroupTreeRow) => {
  expanded.add(data.key)
  expandedKeys.value = [...expanded]
}
const handleCollapse = (data: GroupTreeRow) => {
  expanded.delete(data.key)
  expandedKeys.value = [...expanded]
}

/** Selects the row's entities on the canvas (exactly those). */
const selectOnCanvas = (ids: AcDbObjectId[]) => {
  const view = props.editor.curView
  view.selectionSet.clear()
  if (ids.length > 0) view.selectionSet.add(ids.slice())
}

const handleNodeClick = (data: GroupTreeRow) => {
  currentKey.value = data.key
  selectedGroupId.value = data.groupId
  selectOnCanvas(data.entityIds)
}

const zoomTo = (data: GroupTreeRow) => {
  const blockTable = db()?.tables.blockTable
  if (!blockTable) return
  const box = new AcGeBox2d()
  for (const id of data.entityIds) {
    const extents = blockTable.getEntityById(id)?.geometricExtents
    if (!extents || extents.isEmpty()) continue
    box.expandByPoint({ x: extents.min.x, y: extents.min.y })
    box.expandByPoint({ x: extents.max.x, y: extents.max.y })
  }
  if (box.isEmpty()) return
  props.editor.curView.zoomTo(box, 1.3)
}

const promptName = async (title: string, value: string) => {
  try {
    const result = await ElMessageBox.prompt(
      t('main.toolPalette.groupManager.prompts.name'),
      title,
      {
        confirmButtonText: t('main.toolPalette.layerManager.prompts.confirm'),
        cancelButtonText: t('main.toolPalette.layerManager.prompts.cancel'),
        inputValue: value,
        inputPattern: /\S+/,
        inputErrorMessage: t('main.toolPalette.groupManager.prompts.name')
      }
    )
    return result.value.trim()
  } catch {
    return null
  }
}

const handleNewGroup = () => {
  if (!canGroup.value) return
  props.editor.sendStringToExecute('group')
}

const handleRename = async () => {
  const group = selectedGroup.value
  const database = db()
  if (!group || !database) return
  const name = await promptName(
    t('main.toolPalette.groupManager.prompts.renameTitle'),
    group.unnamed ? '' : group.name
  )
  if (!name || name === group.name) return
  if (!acapIsGroupNameFree(database, name, group.id)) {
    ElMessage({
      message: t('main.toolPalette.groupManager.messages.nameTaken', { name }),
      type: 'warning'
    })
    return
  }
  acapRenameGroup(database, group.id, name)
}

const handleUngroup = () => {
  const group = selectedGroup.value
  const database = db()
  if (!group || !database) return
  acapRemoveGroups(database, [group.id])
  ElMessage({
    message: t('main.toolPalette.groupManager.messages.ungrouped', {
      name: groupLabel(group)
    }),
    type: 'success',
    grouping: true
  })
}

const addSelection = (data: GroupTreeRow) => {
  const database = db()
  if (!database) return
  acapSetGroupMembers(database, data.groupId, selectionIds.value.slice())
}

const removeEntity = (data: GroupTreeRow) => {
  const database = db()
  if (!database) return
  acapSetGroupMembers(database, data.groupId, [], data.entityIds)
}

const toggleGroupSelection = () => {
  AcApSettingManager.instance.groupSelection = !settings.groupSelection
}
</script>

<style scoped>
.ml-group-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
}

.ml-group-list__header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px 4px;
  flex-shrink: 0;
}

.ml-group-list__count {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
}

.ml-group-list__search {
  width: 160px;
  flex-shrink: 0;
}

.ml-group-list__toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px;
  flex-shrink: 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.ml-group-list__btn {
  padding: 4px;
  margin: 0 !important;
  min-height: 24px;
}

.ml-group-list__btn.is-active {
  color: var(--el-color-primary);
  background: var(--ml-brand-soft, var(--el-fill-color-light));
}

.ml-group-list__sep {
  width: 1px;
  height: 16px;
  margin: 0 4px;
  background: var(--el-border-color);
}

.ml-group-list__body {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.ml-group-list__empty {
  padding: 16px 12px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
}

.ml-group-list__empty p {
  margin: 0 0 6px;
}

.ml-group-list__hint {
  color: var(--el-text-color-placeholder);
}

.ml-group-list__tree {
  padding: 4px 0;
  background: transparent;
  font-size: 12px;
}

.ml-group-list__tree :deep(.el-tree-node__content) {
  height: 26px;
}

.ml-group-list__row {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  padding-right: 4px;
}

.ml-group-list__icon {
  flex: 0 0 auto;
  color: var(--el-text-color-secondary);
}

.ml-group-list__row.is-group .ml-group-list__icon {
  color: var(--ml-brand, var(--el-color-primary));
}

.ml-group-list__row.is-group .ml-group-list__label {
  font-weight: 600;
}

.ml-group-list__row.is-more .ml-group-list__label {
  color: var(--el-text-color-secondary);
}

.ml-group-list__label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ml-group-list__detail {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--el-text-color-secondary);
}

.ml-group-list__actions {
  margin-inline-start: auto;
  display: inline-flex;
  align-items: center;
  visibility: hidden;
}

.ml-group-list__row:hover .ml-group-list__actions,
:deep(.is-current) > .el-tree-node__content .ml-group-list__actions {
  visibility: visible;
}

.ml-group-list__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 0;
  border-radius: 3px;
  background: transparent;
  color: var(--el-text-color-secondary);
  cursor: pointer;
}

.ml-group-list__action:hover {
  color: var(--el-text-color-primary);
  background: var(--el-fill-color);
}
</style>
