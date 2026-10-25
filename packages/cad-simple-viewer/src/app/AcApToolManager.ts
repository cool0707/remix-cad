import { AcCmEventManager } from '@mlightcad/data-model'

import type { AcEdCommand } from '../editor/command/AcEdCommand'
import { AcEdCorsorType } from '../editor/input/AcEdCursorManager'
import type {
  AcEdCommandEventArgs,
  AcEdPromptEndedEventArgs,
  AcEdPromptStartedEventArgs
} from '../editor/input/AcEditor'
import { AcEdPromptStatus } from '../editor/input/prompt/AcEdPromptStatus'
import type { AcEdBaseView } from '../editor/view/AcEdBaseView'
import { AcEdViewMode } from '../editor/view/AcEdViewMode'
import { AcApI18n } from '../i18n'
import { AcApDocManager } from './AcApDocManager'
import { AcApSettingManager } from './AcApSettingManager'

/**
 * The tool in use, as shown in the status bar and next to the cursor.
 */
export interface AcApToolState {
  /** View the state belongs to */
  view: AcEdBaseView
  /**
   * Global name of the tool's command (`'select'`, `'pan'`, `'line'`, ...).
   * Between commands it is `'select'` or `'pan'`, whichever mode the view is in.
   */
  tool: string
  /** Localized tool name */
  label: string
  /** Message of the prompt waiting for input; `''` when nothing is asked */
  prompt: string
}

/** Drawing commands the simple profile restarts when continuous drawing is on. */
const DRAW_TOOLS = new Set([
  'arc',
  'circle',
  'ellipse',
  '-hatch',
  'hatch',
  'line',
  'mline',
  'mtext',
  'pline',
  'point',
  'polygon',
  'ray',
  'rectang',
  'revcloud',
  'sketch',
  'spline',
  'xline'
])

/**
 * Commands that keep asking for points until Enter in AutoCAD, but that the
 * simple profile ends after this many picked points (one line = two points).
 */
const SINGLE_SHOT_POINTS: Readonly<Record<string, number>> = {
  line: 2
}

/** Tools with a localized name under `main.tool.*`. */
const NAMED_TOOLS = new Set([
  'select',
  'pan',
  'line',
  'pline',
  'circle',
  'arc',
  'rectang',
  'polygon',
  'ellipse',
  'spline',
  'mtext',
  'hatch',
  'point'
])

/** One run of a command, from `commandWillStart` to `commandEnded`. */
interface AcApToolRun {
  command: AcEdCommand
  /** Lower-case global name */
  name: string
  /** Started by the user, not by a script carrying its own inputs */
  interactive: boolean
  /** Number of prompts the run asked */
  prompts: number
  /** Number of prompts answered with a value (picked point, typed value...) */
  answered: number
  /** Status of the last settled prompt */
  lastStatus?: AcEdPromptStatus
}

/**
 * Tool layer of the viewer: which tool is in use, and the simple profile's
 * tool behavior on top of the existing commands.
 *
 * Tools are the existing commands (`select`, `pan`, `line`, ...) — running a
 * tool is running its command, so undo, snapping and previews stay the same.
 * With the `'simple'` operation profile this class also:
 *
 * - shows the tool by the cursor shape (arrow for select, hand for pan,
 *   crosshair while a command asks for input) and puts the tool name in front
 *   of the prompt next to the cursor;
 * - ends LINE after one segment;
 * - single-key tools (`ACAP_TOOL_SHORTCUTS`, handled by the view's key
 *   handler);
 * - goes back to the select tool after each command, or restarts the drawing
 *   command when {@link AcApSettingManager.continuousDraw} is on;
 * - stages Esc: cancel the operation, then back to the select tool, then
 *   clear the selection (see {@link handleEscape}).
 *
 * With the `'cad'` profile only the tool state is reported; behavior is
 * unchanged.
 */
export class AcApToolManager {
  /** Fired whenever the tool or its prompt changes, for any view. */
  static readonly events = {
    changed: new AcCmEventManager<AcApToolState>()
  }

  private _run?: AcApToolRun
  private _prompt = ''
  /** Command restarted for continuous drawing, until it starts */
  private _restartTimer?: ReturnType<typeof setTimeout>

  /**
   * Creates the tool manager of a view and hooks it to the view's editor.
   * The view calls {@link syncCursor} once its layout view exists.
   *
   * @param view - The view whose editor runs the tools.
   */
  constructor(private readonly view: AcEdBaseView) {
    const events = view.editor.events
    events.commandWillStart.addEventListener(this.onCommandWillStart)
    events.commandEnded.addEventListener(this.onCommandEnded)
    events.promptStarted.addEventListener(this.onPromptStarted)
    events.promptEnded.addEventListener(this.onPromptEnded)
    AcApSettingManager.instance.events.modified.addEventListener(
      this.onSettingsModified
    )
  }

  /** Removes the listeners added by the constructor. */
  dispose() {
    clearTimeout(this._restartTimer)
    const events = this.view.editor.events
    events.commandWillStart.removeEventListener(this.onCommandWillStart)
    events.commandEnded.removeEventListener(this.onCommandEnded)
    events.promptStarted.removeEventListener(this.onPromptStarted)
    events.promptEnded.removeEventListener(this.onPromptEnded)
    AcApSettingManager.instance.events.modified.removeEventListener(
      this.onSettingsModified
    )
  }

  /** Whether the simple operation profile is on. */
  get isSimple() {
    return AcApSettingManager.instance.operationProfile === 'simple'
  }

  /** The tool in use and the prompt it shows. */
  get state(): AcApToolState {
    const tool =
      this._run?.name ??
      (this.view.mode === AcEdViewMode.PAN ? 'pan' : 'select')
    return {
      view: this.view,
      tool,
      label: this.labelOf(tool),
      prompt: this._prompt
    }
  }

  /** Whether a command is running (between its start and end events). */
  get isCommandRunning() {
    return this._run != null
  }

  /**
   * Localized name of a tool (`main.tool.*`), or its command name in upper
   * case for tools without one.
   *
   * @param tool - Command global name.
   */
  labelOf(tool: string) {
    const name = tool.toLowerCase()
    if (NAMED_TOOLS.has(name)) {
      return AcApI18n.t(`main.tool.${name}`)
    }
    return name.replace(/^-/, '').toUpperCase()
  }

  /**
   * Starts a tool: runs its command (which cancels a running command first).
   *
   * @param tool - Command global name (`'select'`, `'pan'`, `'line'`, ...).
   */
  activate(tool: string) {
    clearTimeout(this._restartTimer)
    AcApDocManager.instance.sendStringToExecute(tool)
  }

  /**
   * Simple profile Esc while no command runs: from the pan tool go back to
   * the select tool. Cancelling a running command is done by the prompt
   * itself, and clearing the selection by the caller.
   *
   * @returns `true` when Esc was used to go back to the select tool.
   */
  handleEscape(): boolean {
    if (this.view.mode !== AcEdViewMode.PAN) return false
    this.activate('select')
    return true
  }

  private readonly onCommandWillStart = ({ command }: AcEdCommandEventArgs) => {
    clearTimeout(this._restartTimer)
    const name = (command.globalName || command.localName).toLowerCase()
    this._run = {
      command,
      name,
      interactive: !this.view.editor.hasScriptInputs(),
      prompts: 0,
      answered: 0
    }
    this._prompt = ''
    this.view.promptBadge =
      this.isSimple && name !== 'select' && name !== 'pan'
        ? this.labelOf(name)
        : ''
    this.syncCursor()
    this.notify()
  }

  private readonly onCommandEnded = ({ command }: AcEdCommandEventArgs) => {
    const run = this._run
    if (!run || run.command !== command) return
    this._run = undefined
    this._prompt = ''
    this.view.promptBadge = ''

    if (this.isSimple && run.prompts > 0) {
      const cancelled = run.lastStatus === AcEdPromptStatus.Cancel
      // Continuous drawing: start the next one, unless Esc was pressed before
      // anything was picked (Esc on a fresh tool leaves the tool).
      const restart =
        run.interactive &&
        AcApSettingManager.instance.continuousDraw &&
        DRAW_TOOLS.has(run.name) &&
        (!cancelled || run.answered > 0)
      if (restart) {
        // After the command stack settles; skipped when another command
        // (e.g. a toolbar button that cancelled this one) starts first.
        this._restartTimer = setTimeout(() => {
          if (!this._run) this.activate(run.name)
        })
      } else {
        this.view.mode = AcEdViewMode.SELECTION
      }
      this.reclaimFocus()
    }
    this.syncCursor()
    this.notify()
  }

  /**
   * A prompt's input box takes the focus with it when it goes, leaving it on
   * `<body>`, where the view's single-key tools and Esc do not reach. Give it
   * back to the view (never taking it from another field).
   */
  private reclaimFocus() {
    const active = document.activeElement
    if (active && active !== document.body) return
    this.view.container.focus({ preventScroll: true })
  }

  private readonly onPromptStarted = ({
    message
  }: AcEdPromptStartedEventArgs) => {
    const run = this._run
    if (!run) return
    run.prompts++
    this._prompt = this.stripOrConnector(message)
    this.notify()
  }

  private readonly onPromptEnded = ({ status }: AcEdPromptEndedEventArgs) => {
    const run = this._run
    if (!run) return
    run.lastStatus = status
    if (status === AcEdPromptStatus.OK) {
      run.answered++
      const limit = SINGLE_SHOT_POINTS[run.name]
      if (
        this.isSimple &&
        run.interactive &&
        limit != null &&
        run.answered === limit
      ) {
        // An empty input answers the next prompt like Enter: the command
        // ends normally, keeping what was drawn.
        this.view.editor.enqueueScriptInputs([''])
      }
    }
  }

  private readonly onSettingsModified = ({ key }: { key: string }) => {
    if (key !== 'operationProfile') return
    this.view.promptBadge =
      this.isSimple && this._run ? this.labelOf(this._run.name) : ''
    this.syncCursor()
    this.notify()
  }

  /**
   * Sets the cursor of the tool in use. The CAD profile keeps its crosshair
   * (and the hand of the pan tool).
   */
  syncCursor() {
    let cursor: AcEdCorsorType
    if (this.view.mode === AcEdViewMode.PAN && !this._run) {
      cursor = AcEdCorsorType.Grab
    } else if (this.isSimple && !this._run) {
      cursor = AcEdCorsorType.NoSpecialCursor
    } else {
      cursor = AcEdCorsorType.Crosshair
    }
    this.view.setCursor(cursor)
  }

  /** Drops the trailing "or" that introduces keywords (`... または`). */
  private stripOrConnector(message: string) {
    const connector = AcApI18n.t('main.prompt.orConnector')
    const trimmed = message.trim()
    return connector && trimmed.endsWith(connector)
      ? trimmed.slice(0, -connector.length).trim()
      : trimmed
  }

  private notify() {
    AcApToolManager.events.changed.dispatch(this.state)
  }
}
