import { AcDbSysVarManager } from '@mlightcad/data-model'

import {
  AcEdCommandPalette,
  type AcEdCommandPaletteAnchor,
  type AcEdCommandPaletteItem
} from '../editor/commandpalette/AcEdCommandPalette'
import { AcEdContextMenu } from '../editor/contextmenu/AcEdContextMenu'
import { AcEdMTextEditor } from '../editor/input/ui/AcEdMTextEditor'
import type { AcEdBaseView } from '../editor/view/AcEdBaseView'
import { acapNavigateToFindHit } from '../find/AcApFindNavigator'
import { type AcApFindLayoutHit, acapFindText } from '../find/findDrawing'
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

/** Options of {@link AcApCommandPaletteController.open}. */
export interface AcApCommandPaletteOpenOptions {
  /** Text already in the search box */
  query?: string
  /**
   * What comes first: the commands (Ctrl / Cmd + K, default) or the text
   * found in the drawing (Ctrl / Cmd + F).
   */
  focus?: 'commands' | 'text'
  /** Opens the palette over this field (the top bar's search field). */
  anchor?: AcEdCommandPaletteAnchor
}

/** Text hits shown in the palette (the rest are in the Find palette). */
const TEXT_HIT_LIMIT = 5
/** Hits counted for the "all results" line. */
const TEXT_COUNT_LIMIT = 100
/** Characters of a hit's text shown on its line. */
const TEXT_LABEL_LENGTH = 80

/** Commands picked from the palette, the most recent first (all views). */
const recent: string[] = []
const RECENT_LIMIT = 5

/**
 * The view's command palette (Ctrl / Cmd + K): find a command by its plain
 * name, its CAD term or its command name and run it; also the right-click
 * menu's edit actions and the layers (picking one makes it current).
 */
export class AcApCommandPaletteController {
  /**
   * Shows every text hit of a query (the host's Find palette). Without it,
   * the palette lists the first hits only.
   */
  static onShowAllTextResults?: (query: string) => void

  /**
   * Where the palette opens when the caller gives no anchor (the host's
   * search field, when it shows one). `undefined`: near the top of the window.
   */
  static defaultAnchor?: () => AcEdCommandPaletteAnchor | undefined

  private palette?: AcEdCommandPalette
  /** Text hits of the last query, for picking one. */
  private textHits: AcApFindLayoutHit[] = []
  private textQuery = ''

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
  toggle(options: AcApCommandPaletteOpenOptions = {}): boolean {
    if (this.openPalette) {
      this.palette!.close()
      return false
    }
    return this.open(options)
  }

  /**
   * Opens the palette.
   *
   * @returns Whether it opened (not while text is edited in place or without
   *   a document).
   */
  open(options: AcApCommandPaletteOpenOptions = {}): boolean {
    if (this.openPalette) this.palette!.close()
    const state = this.collectState()
    if (!state) return false
    AcEdContextMenu.closeAll()
    const entries = acapBuildCommandPalette(state)
    const layerTag = AcApI18n.t('main.commandPalette.layer')
    const commandsGroup = AcApI18n.t('main.commandPalette.groupCommands')
    const textFirst = options.focus === 'text'
    this.textHits = []
    this.textQuery = ''
    this.palette = new AcEdCommandPalette({
      title: AcApI18n.t('main.commandPalette.title'),
      placeholder: AcApI18n.t(
        textFirst
          ? 'main.commandPalette.placeholderText'
          : 'main.commandPalette.placeholder'
      ),
      emptyText: AcApI18n.t('main.commandPalette.empty'),
      initialQuery: options.query,
      anchor: options.anchor ?? AcApCommandPaletteController.defaultAnchor?.(),
      search: query => {
        const text = this.searchText(query)
        const commands: AcEdCommandPaletteItem[] = acapSearchCommandPalette(
          entries,
          query
        ).map(entry => ({
          id: entry.id,
          label: entry.label,
          detail: entry.detail,
          tag: entry.kind === 'layer' ? layerTag : undefined,
          command: entry.command,
          shortcut: entry.shortcut,
          // Headings only when the text group is there too.
          group: text.length ? commandsGroup : undefined
        }))
        return textFirst ? [...text, ...commands] : [...commands, ...text]
      },
      onPick: id => this.run(id),
      onClose: () => {
        this.palette = undefined
      }
    })
    return true
  }

  /** Lines of the text found in the drawing for a query. */
  private searchText(query: string): AcEdCommandPaletteItem[] {
    this.textHits = []
    this.textQuery = query
    const trimmed = query.trim()
    const docManager = AcApDocManager.instance
    const db = docManager?.curDocument?.database
    const view = docManager?.curView
    if (!trimmed || !db || !view) return []
    const result = acapFindText(db, trimmed, {
      scope: 'drawing',
      currentLayoutId: view.activeLayoutBtrId,
      maxResults: TEXT_COUNT_LIMIT
    })
    const hits = result.hits
    if (!hits.length) return []
    this.textHits = hits.slice(0, TEXT_HIT_LIMIT)
    const group = AcApI18n.t('main.commandPalette.groupText')
    const items: AcEdCommandPaletteItem[] = this.textHits.map((hit, index) => {
      const label =
        hit.text.length > TEXT_LABEL_LENGTH
          ? `${hit.text.slice(0, TEXT_LABEL_LENGTH)}…`
          : hit.text
      const where = [hit.layoutName, hit.layer].filter(Boolean).join(' / ')
      return { id: `text:${index}`, label, detail: where, group }
    })
    if (AcApCommandPaletteController.onShowAllTextResults) {
      const count =
        result.truncated || hits.length >= TEXT_COUNT_LIMIT
          ? `${TEXT_COUNT_LIMIT}+`
          : String(hits.length)
      items.push({
        id: 'textAll:',
        label: AcApI18n.t('main.commandPalette.textAll').replace(
          '{count}',
          count
        ),
        group
      })
    }
    return items
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
      case 'text': {
        const hit = this.textHits[Number(value)]
        if (hit) void acapNavigateToFindHit(AcApDocManager.instance, hit)
        break
      }
      case 'textAll':
        AcApCommandPaletteController.onShowAllTextResults?.(this.textQuery.trim())
        break
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
