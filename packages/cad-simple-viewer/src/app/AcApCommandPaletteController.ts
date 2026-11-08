import { AcDbSysVarManager } from '@mlightcad/data-model'

import { AcEdCommandPalette } from '../editor/commandpalette/AcEdCommandPalette'
import { AcEdContextMenu } from '../editor/contextmenu/AcEdContextMenu'
import { AcEdMTextEditor } from '../editor/input/ui/AcEdMTextEditor'
import type { AcEdBaseView } from '../editor/view/AcEdBaseView'
import { AcApI18n } from '../i18n'
import { AcApLayerService } from '../service/AcApLayerService'
import {
  acapBuildCommandPalette,
  type AcApCommandPaletteCommand,
  type AcApCommandPaletteState,
  acapSearchCommandPalette
} from './AcApCommandPaletteItems'
import { acapIsMacPlatform } from './AcApContextMenuController'
import { AcApDocManager } from './AcApDocManager'
import type { AcApEditActions } from './AcApEditActions'
import { AcApSettingManager } from './AcApSettingManager'
import type { AcApToolManager } from './AcApToolManager'

/** Parts of the view the palette works with. */
export interface AcApCommandPaletteControllerOptions {
  /** Starts the picked command */
  toolManager: AcApToolManager
  /** Clipboard, duplicate, select all ... */
  editActions: AcApEditActions
}

/** Commands picked from the palette, the most recent first (all views). */
const recent: string[] = []
const RECENT_LIMIT = 5

/**
 * The view's command palette (Ctrl / Cmd + K): find a command by its plain
 * name, its CAD term or its command name and run it; also the right-click
 * menu's edit actions and the layers (picking one makes it current).
 */
export class AcApCommandPaletteController {
  private palette?: AcEdCommandPalette

  /**
   * @param view - View the commands run in.
   * @param options - Parts of the view the palette works with.
   */
  constructor(
    private readonly view: AcEdBaseView,
    private readonly options: AcApCommandPaletteControllerOptions
  ) {}

  /** The open palette, if any (for tests). */
  get openPalette() {
    return this.palette?.isOpen ? this.palette : undefined
  }

  /** Closes the palette. */
  dispose() {
    this.palette?.close()
  }

  /**
   * Opens the palette, or closes it when it is open.
   *
   * @returns Whether the palette is open afterwards.
   */
  toggle(): boolean {
    if (this.openPalette) {
      this.palette!.close()
      return false
    }
    return this.open()
  }

  /**
   * Opens the palette.
   *
   * @returns Whether it opened (not while text is edited in place or without
   *   a document).
   */
  open(): boolean {
    if (this.openPalette) return true
    const state = this.collectState()
    if (!state) return false
    AcEdContextMenu.closeAll()
    const entries = acapBuildCommandPalette(state)
    const layerTag = AcApI18n.t('main.commandPalette.layer')
    this.palette = new AcEdCommandPalette({
      title: AcApI18n.t('main.commandPalette.title'),
      placeholder: AcApI18n.t('main.commandPalette.placeholder'),
      emptyText: AcApI18n.t('main.commandPalette.empty'),
      search: query =>
        acapSearchCommandPalette(entries, query).map(entry => ({
          id: entry.id,
          label: entry.label,
          detail: entry.detail,
          tag: entry.kind === 'layer' ? layerTag : undefined,
          command: entry.command,
          shortcut: entry.shortcut
        })),
      onPick: id => this.run(id),
      onClose: () => {
        this.palette = undefined
      }
    })
    return true
  }

  /** What the palette can offer, or `undefined` when it must not open. */
  private collectState(): AcApCommandPaletteState | undefined {
    if (AcEdMTextEditor.getActiveInputBox()) return undefined
    const docManager = AcApDocManager.instance
    const doc = docManager?.curDocument
    if (!doc) return undefined
    const t = (key: string) => {
      const text = AcApI18n.t(key)
      return text === key ? undefined : text
    }
    const actions = this.options.editActions
    const hasSelection = actions.selectedEntities(false).length > 0
    const editable =
      actions.canEdit && actions.selectedEntities(true).length > 0
    const db = doc.database
    return {
      commands: this.availableCommands(),
      layers: actions.canEdit
        ? Array.from(db.tables.layerTable.newIterator(), layer => ({
            name: layer.name,
            current: layer.name === db.clayer
          }))
        : [],
      actions: {
        cut: editable,
        copy: hasSelection,
        paste: actions.canPaste,
        duplicate: editable,
        selectAll: true,
        selectSameLayer: hasSelection,
        zoomExtents: true
      },
      simple: AcApSettingManager.instance.operationProfile === 'simple',
      isMac: acapIsMacPlatform(),
      t,
      description: (group, name) =>
        t(AcApI18n.cmdKey(group, name, 'description')),
      recent
    }
  }

  /** Commands that can run in the document (its open mode allows them). */
  private availableCommands(): AcApCommandPaletteCommand[] {
    const docManager = AcApDocManager.instance
    const stack = docManager.commandManager
    const sysVars = new Set(
      AcDbSysVarManager.instance()
        .getAllDescriptors()
        .map(descriptor => descriptor.name.toUpperCase())
    )
    const result: AcApCommandPaletteCommand[] = []
    const iter = stack.iterator()
    for (let item = iter.next(); !item.done; item = iter.next()) {
      const { command, commandGroup } = item.value
      const name = command.globalName
      // Command-line versions of dialog commands (-LAYER, -HATCH ...).
      if (name.startsWith('-')) continue
      if (docManager.lookupGlobalCmd(name) !== command) continue
      result.push({
        name,
        group: commandGroup,
        aliases: stack.getCommandAliases(command, commandGroup),
        isSysVar: sysVars.has(name.toUpperCase())
      })
    }
    return result
  }

  /** Runs a picked entry. */
  private run(id: string) {
    const separator = id.indexOf(':')
    const kind = id.slice(0, separator)
    const value = id.slice(separator + 1)
    const view = this.view
    const actions = this.options.editActions
    switch (kind) {
      case 'command': {
        const index = recent.indexOf(value)
        if (index >= 0) recent.splice(index, 1)
        recent.unshift(value)
        recent.length = Math.min(recent.length, RECENT_LIMIT)
        this.options.toolManager.activate(value)
        break
      }
      case 'layer': {
        const db = AcApDocManager.instance.curDocument.database
        new AcApLayerService(db).setCurrentLayer(value)
        break
      }
      case 'action':
        switch (value) {
          case 'cut':
            actions.cut()
            break
          case 'copy':
            actions.copy()
            break
          case 'paste':
            actions.paste(
              view.hasCursorPos
                ? view.screenToWorld(view.curMousePos)
                : undefined
            )
            break
          case 'duplicate':
            actions.duplicate()
            break
          case 'selectAll':
            actions.selectAll()
            break
          case 'selectSameLayer':
            actions.selectSameLayer()
            break
          case 'zoomExtents':
            view.zoomToFitDrawing()
            break
        }
        break
    }
    // Keys (Esc, single-key tools, shortcuts) go to the view again.
    const active = document.activeElement
    if (!active || active === document.body) {
      view.container.focus({ preventScroll: true })
    }
  }
}
