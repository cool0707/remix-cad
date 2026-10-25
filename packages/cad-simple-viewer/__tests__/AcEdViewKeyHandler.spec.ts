jest.mock('../src/app', () => ({
  AcApDocManager: {
    instance: {
      sendStringToExecute: jest.fn(),
      lookupGlobalCmd: jest.fn(() => ({}))
    }
  }
}))

jest.mock('../src/editor/input/ui/AcEdMTextEditor', () => ({
  AcEdMTextEditor: {
    getActiveInputBox: jest.fn(() => null)
  }
}))

import { AcApDocManager } from '../src/app'
import {
  AcApMarkupHistory,
  AcApSessionUndo
} from '../src/command/markup/AcApMarkupHistory'
import { acapSetMarkupBagFactory } from '../src/command/markup/AcApMarkupSession'
import { AcApMarkupStore } from '../src/command/markup/AcApMarkupStore'
import { AcEdViewKeyHandler } from '../src/view/AcEdViewKeyHandler'
import type { AcTrView2d } from '../src/view/AcTrView2d'

acapSetMarkupBagFactory(() => ({
  store: new AcApMarkupStore(),
  presenter: {} as never,
  history: new AcApMarkupHistory(),
  sessionUndo: new AcApSessionUndo()
}))

function keyboardEvent(partial: Partial<KeyboardEvent>): KeyboardEvent {
  return {
    code: 'KeyZ',
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    target: null,
    isComposing: false,
    keyCode: 0,
    preventDefault: jest.fn(),
    ...partial
  } as KeyboardEvent
}

function createMockView(
  isEditorActive = false,
  htmlSelection: {
    hasSelection?: boolean
    deleted?: boolean
    groups?: { id: string; layer: string }[]
  } = {},
  toolManager: Record<string, unknown> = { isSimple: false }
): AcTrView2d {
  return {
    editor: { isActive: isEditorActive },
    toolManager,
    selectionSet: { clear: jest.fn() },
    htmlTransientManager: {
      hasSelection: jest.fn(() => htmlSelection.hasSelection ?? false),
      deleteSelected: jest.fn(() => htmlSelection.deleted ?? false),
      deselectAll: jest.fn(),
      getSelectedGroups: jest.fn(() => htmlSelection.groups ?? []),
      detach: jest.fn((id: string) => ({ id })),
      groupsOnLayer: jest.fn(() => []),
      has: jest.fn(() => false)
    },
    isDirty: false,
    isHtmlDirty: false
  } as unknown as AcTrView2d
}

describe('AcEdViewKeyHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('handleKeyDown maps platform undo/redo keys to commands', () => {
    const handler = new AcEdViewKeyHandler(createMockView())
    const sendCommand = AcApDocManager.instance.sendStringToExecute as jest.Mock

    handler.handleKeyDown(
      keyboardEvent({ code: 'KeyZ', ctrlKey: true, shiftKey: false })
    )
    expect(sendCommand).toHaveBeenLastCalledWith('undo')

    handler.handleKeyDown(
      keyboardEvent({ code: 'KeyZ', metaKey: true, shiftKey: false })
    )
    expect(sendCommand).toHaveBeenLastCalledWith('undo')

    handler.handleKeyDown(
      keyboardEvent({ code: 'KeyY', ctrlKey: true, shiftKey: false })
    )
    expect(sendCommand).toHaveBeenLastCalledWith('redo')

    handler.handleKeyDown(
      keyboardEvent({ code: 'KeyZ', metaKey: true, shiftKey: true })
    )
    expect(sendCommand).toHaveBeenLastCalledWith('redo')

    handler.handleKeyDown(
      keyboardEvent({ code: 'KeyZ', ctrlKey: true, shiftKey: true })
    )
    expect(sendCommand).toHaveBeenLastCalledWith('redo')

    sendCommand.mockClear()
    handler.handleKeyDown(keyboardEvent({ code: 'KeyA', ctrlKey: true }))
    expect(sendCommand).not.toHaveBeenCalled()
  })

  test('handleKeyDown skips undo/redo while editor input is active', () => {
    const handler = new AcEdViewKeyHandler(createMockView(true))
    const sendCommand = AcApDocManager.instance.sendStringToExecute as jest.Mock

    const handled = handler.handleKeyDown(
      keyboardEvent({ code: 'KeyZ', ctrlKey: true })
    )

    expect(handled).toBe(false)
    expect(sendCommand).not.toHaveBeenCalled()
  })

  test('Delete detaches a selected measurement overlay without dispatching erase', () => {
    const view = createMockView(false, {
      hasSelection: true,
      groups: [{ id: 'm1', layer: 'measurement' }]
    })
    const handler = new AcEdViewKeyHandler(view)
    const sendCommand = AcApDocManager.instance.sendStringToExecute as jest.Mock
    const event = keyboardEvent({ code: 'Delete' })

    expect(handler.handleKeyDown(event)).toBe(true)
    expect(view.htmlTransientManager.detach).toHaveBeenCalledWith('m1')
    expect(view.htmlTransientManager.deleteSelected).not.toHaveBeenCalled()
    expect(sendCommand).not.toHaveBeenCalled()
    expect(event.preventDefault).toHaveBeenCalled()
  })

  test('Backspace detaches a selected measurement overlay (macOS delete key)', () => {
    const view = createMockView(false, {
      hasSelection: true,
      groups: [{ id: 'm1', layer: 'measurement' }]
    })
    const handler = new AcEdViewKeyHandler(view)
    const sendCommand = AcApDocManager.instance.sendStringToExecute as jest.Mock
    const event = keyboardEvent({ code: 'Backspace' })

    expect(handler.handleKeyDown(event)).toBe(true)
    expect(view.htmlTransientManager.detach).toHaveBeenCalledWith('m1')
    expect(view.htmlTransientManager.deleteSelected).not.toHaveBeenCalled()
    expect(sendCommand).not.toHaveBeenCalled()
    expect(event.preventDefault).toHaveBeenCalled()
  })

  test('Delete removes a selected HTML overlay without dispatching erase', () => {
    const view = createMockView(false, { hasSelection: true, deleted: true })
    const handler = new AcEdViewKeyHandler(view)
    const sendCommand = AcApDocManager.instance.sendStringToExecute as jest.Mock
    const event = keyboardEvent({ code: 'Delete' })

    expect(handler.handleKeyDown(event)).toBe(true)
    expect(view.htmlTransientManager.deleteSelected).toHaveBeenCalled()
    expect(sendCommand).not.toHaveBeenCalled()
    expect(event.preventDefault).toHaveBeenCalled()
  })

  test('Delete falls through to erase when HTML overlay deletion fails', () => {
    const view = createMockView(false, { hasSelection: true, deleted: false })
    const handler = new AcEdViewKeyHandler(view)
    const sendCommand = AcApDocManager.instance.sendStringToExecute as jest.Mock

    expect(handler.handleKeyDown(keyboardEvent({ code: 'Delete' }))).toBe(false)
    expect(view.htmlTransientManager.deleteSelected).toHaveBeenCalled()
    expect(sendCommand).toHaveBeenCalledWith('erase')
  })

  test('Delete dispatches erase when no HTML overlay is selected', () => {
    const handler = new AcEdViewKeyHandler(createMockView())
    const sendCommand = AcApDocManager.instance.sendStringToExecute as jest.Mock

    expect(handler.handleKeyDown(keyboardEvent({ code: 'Backspace' }))).toBe(
      false
    )
    expect(sendCommand).toHaveBeenCalledWith('erase')
  })

  test('Delete skips erase in read/review mode when no HTML overlay is selected', () => {
    const lookup = AcApDocManager.instance.lookupGlobalCmd as jest.Mock
    lookup.mockReturnValueOnce(undefined)
    const handler = new AcEdViewKeyHandler(createMockView())
    const sendCommand = AcApDocManager.instance.sendStringToExecute as jest.Mock

    expect(handler.handleKeyDown(keyboardEvent({ code: 'Delete' }))).toBe(false)
    expect(lookup).toHaveBeenCalledWith('erase')
    expect(sendCommand).not.toHaveBeenCalled()
  })

  test('Delete still removes measurement overlay in read/review mode', () => {
    const lookup = AcApDocManager.instance.lookupGlobalCmd as jest.Mock
    lookup.mockReturnValue(undefined)
    const view = createMockView(false, {
      hasSelection: true,
      groups: [{ id: 'm1', layer: 'measurement' }]
    })
    const handler = new AcEdViewKeyHandler(view)
    const sendCommand = AcApDocManager.instance.sendStringToExecute as jest.Mock
    const event = keyboardEvent({ code: 'Delete' })

    expect(handler.handleKeyDown(event)).toBe(true)
    expect(view.htmlTransientManager.detach).toHaveBeenCalledWith('m1')
    expect(sendCommand).not.toHaveBeenCalled()
    expect(lookup).not.toHaveBeenCalled()
    expect(event.preventDefault).toHaveBeenCalled()
  })

  describe('simple profile', () => {
    beforeEach(() => {
      ;(AcApDocManager.instance.lookupGlobalCmd as jest.Mock).mockReturnValue(
        {}
      )
    })

    const tools = (overrides: Record<string, unknown> = {}) => ({
      isSimple: true,
      isCommandRunning: false,
      activate: jest.fn(),
      handleEscape: jest.fn(() => false),
      ...overrides
    })

    const commandLine = (value = '', userFocus = false) =>
      ({
        tagName: 'INPUT',
        classList: { contains: (name: string) => name === 'ml-cli-text' },
        value,
        readOnly: false,
        dataset: userFocus ? { userFocus: 'true' } : {}
      }) as unknown as EventTarget

    test('single keys start tools', () => {
      const toolManager = tools()
      const handler = new AcEdViewKeyHandler(
        createMockView(false, {}, toolManager)
      )
      const event = keyboardEvent({ code: 'KeyL' })

      expect(handler.handleKeyDown(event)).toBe(true)
      expect(toolManager.activate).toHaveBeenCalledWith('line')
      expect(event.preventDefault).toHaveBeenCalled()

      // Also when a prompt left the focus in the empty command line.
      handler.handleKeyDown(
        keyboardEvent({ code: 'KeyV', target: commandLine() })
      )
      expect(toolManager.activate).toHaveBeenLastCalledWith('select')
    })

    test('single keys are ignored while typing, with modifiers or during a command', () => {
      const toolManager = tools()
      const handler = new AcEdViewKeyHandler(
        createMockView(false, {}, toolManager)
      )
      handler.handleKeyDown(
        keyboardEvent({ code: 'KeyL', target: commandLine('LI') })
      )
      handler.handleKeyDown(
        keyboardEvent({ code: 'KeyL', target: commandLine('', true) })
      )
      handler.handleKeyDown(keyboardEvent({ code: 'KeyL', ctrlKey: true }))
      handler.handleKeyDown(keyboardEvent({ code: 'KeyL', shiftKey: true }))

      const busy = tools({ isCommandRunning: true })
      new AcEdViewKeyHandler(createMockView(false, {}, busy)).handleKeyDown(
        keyboardEvent({ code: 'KeyL' })
      )

      expect(toolManager.activate).not.toHaveBeenCalled()
      expect(busy.activate).not.toHaveBeenCalled()
    })

    test('single keys skip tools the document cannot run', () => {
      const lookup = AcApDocManager.instance.lookupGlobalCmd as jest.Mock
      lookup.mockReturnValue(undefined)
      const toolManager = tools()
      const handler = new AcEdViewKeyHandler(
        createMockView(false, {}, toolManager)
      )
      expect(handler.handleKeyDown(keyboardEvent({ code: 'KeyL' }))).toBe(false)
      expect(toolManager.activate).not.toHaveBeenCalled()
    })

    test('arrow keys nudge the selection, Shift ten times as far', () => {
      const view = createMockView(false, {}, tools())
      const nudge = jest.fn(() => true)
      ;(view as unknown as Record<string, unknown>).selectionTransformer = {
        nudge
      }
      const handler = new AcEdViewKeyHandler(view)

      const event = keyboardEvent({ code: 'ArrowLeft' })
      expect(handler.handleKeyDown(event)).toBe(true)
      expect(nudge).toHaveBeenLastCalledWith(-1, 0, false)
      expect(event.preventDefault).toHaveBeenCalled()

      handler.handleKeyDown(keyboardEvent({ code: 'ArrowUp', shiftKey: true }))
      expect(nudge).toHaveBeenLastCalledWith(0, 1, true)

      // Fields (the command line too) keep their arrow keys.
      nudge.mockClear()
      handler.handleKeyDown(
        keyboardEvent({ code: 'ArrowDown', target: commandLine() })
      )
      handler.handleKeyDown(keyboardEvent({ code: 'ArrowDown', ctrlKey: true }))
      expect(nudge).not.toHaveBeenCalled()

      // Nothing to move: the key is not consumed.
      nudge.mockReturnValue(false)
      const idle = keyboardEvent({ code: 'ArrowRight' })
      expect(handler.handleKeyDown(idle)).toBe(false)
      expect(idle.preventDefault).not.toHaveBeenCalled()
    })

    test('Esc keeps the selection while a command runs or the pan tool is left', () => {
      const running = createMockView(true, {}, tools())
      new AcEdViewKeyHandler(running).handleKeyDown(
        keyboardEvent({ code: 'Escape' })
      )
      expect(running.selectionSet.clear).not.toHaveBeenCalled()

      const panning = createMockView(
        false,
        {},
        tools({ handleEscape: jest.fn(() => true) })
      )
      new AcEdViewKeyHandler(panning).handleKeyDown(
        keyboardEvent({ code: 'Escape' })
      )
      expect(panning.selectionSet.clear).not.toHaveBeenCalled()

      const idle = createMockView(false, {}, tools())
      new AcEdViewKeyHandler(idle).handleKeyDown(
        keyboardEvent({ code: 'Escape', target: commandLine() })
      )
      expect(idle.selectionSet.clear).toHaveBeenCalled()
    })
  })
})
