const sendStringToExecute = jest.fn()

jest.mock('../src/app/AcApDocManager', () => ({
  AcApDocManager: { instance: { sendStringToExecute } }
}))

jest.mock('../src/i18n', () => ({
  AcApI18n: {
    t: (key: string) => (key === 'main.prompt.orConnector' ? 'or' : key)
  }
}))

jest.mock('../src/editor/input/AcEdCursorManager', () => ({
  AcEdCorsorType: {
    NoSpecialCursor: -1,
    Crosshair: 0,
    Grab: 13
  }
}))

import { AcCmEventManager } from '@mlightcad/data-model'

import { AcApSettingManager } from '../src/app/AcApSettingManager'
import { AcApToolManager } from '../src/app/AcApToolManager'
import { AcEdPromptStatus } from '../src/editor/input/prompt/AcEdPromptStatus'
import { AcEdViewMode } from '../src/editor/view/AcEdViewMode'

const ARROW = -1
const CROSSHAIR = 0
const GRAB = 13

function installLocalStorageMock() {
  const store = new Map<string, string>()
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
      removeItem: (key: string) => store.delete(key)
    },
    configurable: true
  })
}

function createView() {
  const scriptInputs: string[] = []
  const view = {
    mode: AcEdViewMode.SELECTION,
    cursor: undefined as number | undefined,
    promptBadge: '',
    container: { focus: jest.fn() },
    setCursor(cursor: number) {
      view.cursor = cursor
    },
    editor: {
      events: {
        commandWillStart: new AcCmEventManager<{ command: unknown }>(),
        commandEnded: new AcCmEventManager<{ command: unknown }>(),
        promptStarted: new AcCmEventManager<{ message: string }>(),
        promptEnded: new AcCmEventManager<{ status: AcEdPromptStatus }>()
      },
      hasScriptInputs: () => scriptInputs.length > 0,
      enqueueScriptInputs: (inputs: string[]) => scriptInputs.push(...inputs)
    },
    scriptInputs
  }
  return view
}

type FakeView = ReturnType<typeof createView>

function command(name: string) {
  return { globalName: name, localName: name }
}

/** Runs one command; each status is one prompt answered that way. */
function runCommand(
  view: FakeView,
  name: string,
  statuses: AcEdPromptStatus[]
) {
  const cmd = command(name)
  const events = view.editor.events
  events.commandWillStart.dispatch({ command: cmd })
  for (const status of statuses) {
    events.promptStarted.dispatch({ message: 'Specify next point or' })
    events.promptEnded.dispatch({ status })
  }
  events.commandEnded.dispatch({ command: cmd })
}

describe('AcApToolManager', () => {
  let view: FakeView
  let tools: AcApToolManager

  const body = {}
  let activeElement: unknown

  beforeAll(() => {
    Object.defineProperty(globalThis, 'document', {
      value: {
        body,
        get activeElement() {
          return activeElement
        }
      },
      configurable: true
    })
  })

  afterAll(() => {
    delete (globalThis as { document?: unknown }).document
  })

  beforeEach(() => {
    activeElement = body
    jest.useFakeTimers()
    installLocalStorageMock()
    AcApSettingManager.resetInstanceForTesting()
    sendStringToExecute.mockClear()
    view = createView()
    tools = new AcApToolManager(view as never)
    // The view calls this from initialize(), once its layout view exists.
    tools.syncCursor()
  })

  afterEach(() => {
    tools.dispose()
    jest.useRealTimers()
  })

  it('shows an arrow for the select tool and a crosshair while a command asks', () => {
    expect(view.cursor).toBe(ARROW)

    const cmd = command('line')
    view.editor.events.commandWillStart.dispatch({ command: cmd })
    expect(view.cursor).toBe(CROSSHAIR)
    expect(view.promptBadge).toBe('main.tool.line')

    view.editor.events.promptStarted.dispatch({
      message: 'Specify next point or'
    })
    expect(tools.state).toMatchObject({
      tool: 'line',
      label: 'main.tool.line',
      prompt: 'Specify next point'
    })

    view.editor.events.commandEnded.dispatch({ command: cmd })
    expect(view.cursor).toBe(ARROW)
    expect(view.promptBadge).toBe('')
    expect(tools.state).toMatchObject({ tool: 'select', prompt: '' })
  })

  it('ends LINE after one segment', () => {
    const cmd = command('line')
    const events = view.editor.events
    events.commandWillStart.dispatch({ command: cmd })
    events.promptStarted.dispatch({ message: 'first' })
    events.promptEnded.dispatch({ status: AcEdPromptStatus.OK })
    expect(view.scriptInputs).toEqual([])
    events.promptStarted.dispatch({ message: 'next' })
    events.promptEnded.dispatch({ status: AcEdPromptStatus.OK })
    // An empty input answers the third prompt like Enter.
    expect(view.scriptInputs).toEqual([''])
  })

  it('leaves scripted LINE runs alone', () => {
    view.scriptInputs.push('0,0', '10,0', '10,10', '')
    const cmd = command('line')
    const events = view.editor.events
    events.commandWillStart.dispatch({ command: cmd })
    view.scriptInputs.length = 0
    events.promptEnded.dispatch({ status: AcEdPromptStatus.OK })
    events.promptEnded.dispatch({ status: AcEdPromptStatus.OK })
    expect(view.scriptInputs).toEqual([])
  })

  it('goes back to the select tool after a command', () => {
    view.mode = AcEdViewMode.PAN
    runCommand(view, 'circle', [AcEdPromptStatus.OK, AcEdPromptStatus.OK])
    expect(view.mode).toBe(AcEdViewMode.SELECTION)
    jest.runAllTimers()
    expect(sendStringToExecute).not.toHaveBeenCalled()
  })

  it('gives the focus back to the view when a prompt leaves it on <body>', () => {
    runCommand(view, 'circle', [AcEdPromptStatus.OK, AcEdPromptStatus.OK])
    expect(view.container.focus).toHaveBeenCalledTimes(1)

    activeElement = { tagName: 'INPUT' }
    runCommand(view, 'circle', [AcEdPromptStatus.OK, AcEdPromptStatus.OK])
    expect(view.container.focus).toHaveBeenCalledTimes(1)
  })

  it('keeps the pan tool after commands without prompts', () => {
    view.mode = AcEdViewMode.PAN
    runCommand(view, 'pan', [])
    expect(view.mode).toBe(AcEdViewMode.PAN)
    expect(view.cursor).toBe(GRAB)
  })

  it('restarts drawing tools with continuous drawing on', () => {
    AcApSettingManager.instance.continuousDraw = true
    runCommand(view, 'circle', [AcEdPromptStatus.OK, AcEdPromptStatus.OK])
    jest.runAllTimers()
    expect(sendStringToExecute).toHaveBeenCalledWith('circle')
  })

  it('stages Esc with continuous drawing: cancel the drawing, then leave the tool', () => {
    AcApSettingManager.instance.continuousDraw = true
    // Esc after the first point: cancel this circle, keep the tool.
    runCommand(view, 'circle', [AcEdPromptStatus.OK, AcEdPromptStatus.Cancel])
    jest.runAllTimers()
    expect(sendStringToExecute).toHaveBeenCalledTimes(1)

    // Esc before any point: back to the select tool.
    runCommand(view, 'circle', [AcEdPromptStatus.Cancel])
    jest.runAllTimers()
    expect(sendStringToExecute).toHaveBeenCalledTimes(1)
    expect(view.mode).toBe(AcEdViewMode.SELECTION)
  })

  it('does not restart when another command starts first', () => {
    AcApSettingManager.instance.continuousDraw = true
    runCommand(view, 'circle', [AcEdPromptStatus.OK, AcEdPromptStatus.Cancel])
    view.editor.events.commandWillStart.dispatch({ command: command('move') })
    jest.runAllTimers()
    expect(sendStringToExecute).not.toHaveBeenCalled()
  })

  it('Esc goes from the pan tool back to the select tool', () => {
    expect(tools.handleEscape()).toBe(false)
    view.mode = AcEdViewMode.PAN
    expect(tools.handleEscape()).toBe(true)
    expect(sendStringToExecute).toHaveBeenCalledWith('select')
  })

  it('pans while Space is held and restores the tool', () => {
    expect(tools.beginSpacePan()).toBe(true)
    expect(view.mode).toBe(AcEdViewMode.PAN)
    expect(view.cursor).toBe(GRAB)
    tools.endSpacePan()
    expect(view.mode).toBe(AcEdViewMode.SELECTION)
    expect(view.cursor).toBe(ARROW)
  })

  it('keeps the CAD profile behavior', () => {
    AcApSettingManager.instance.operationProfile = 'cad'
    expect(view.cursor).toBe(CROSSHAIR)

    view.mode = AcEdViewMode.PAN
    runCommand(view, 'line', [
      AcEdPromptStatus.OK,
      AcEdPromptStatus.OK,
      AcEdPromptStatus.OK
    ])
    expect(view.scriptInputs).toEqual([])
    expect(view.mode).toBe(AcEdViewMode.PAN)
    expect(view.promptBadge).toBe('')
  })
})
