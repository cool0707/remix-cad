import { AcEdSelectionSet } from '../src/editor/input/AcEdSelectionSet'
import { AcEdBaseView } from '../src/editor/view/AcEdBaseView'

// The app layer pulls in the whole viewer (MText editor, renderer, ...);
// applySelection only needs it for locked-layer filtering, stubbed below.
jest.mock('../src/app', () => ({}))
jest.mock('../src/i18n', () => ({}))
jest.mock('@mlightcad/mtext-input-box', () => ({ MTextInputBox: class {} }), {
  virtual: true
})

/**
 * Builds a view stub that only carries the state `applySelection` reads, so
 * the selection logic can be tested without a renderer.
 */
function createView(selected: string[], locked: string[] = []) {
  const selectionSet = new AcEdSelectionSet(selected)
  const view = Object.create(AcEdBaseView.prototype) as AcEdBaseView
  Object.defineProperties(view, {
    selectionSet: { get: () => selectionSet },
    entitySelectionEnabled: { get: () => true },
    // No groups here (picking a group member is tested in AcApGroupService).
    expandToGroups: { value: (ids: string[]) => ids },
    selectableIds: {
      value: (ids: string[], action: string) =>
        action === 'remove' || action === 'toggle'
          ? ids
          : ids.filter(id => !locked.includes(id))
    }
  })
  return { view, selectionSet }
}

describe('AcEdBaseView.applySelection toggle', () => {
  test('removes selected ids and adds the others', () => {
    const { view, selectionSet } = createView(['a', 'b'])
    view.applySelection(['b', 'c'], 'toggle')
    expect([...selectionSet.ids].sort()).toEqual(['a', 'c'])
  })

  test('toggling the same id twice restores the selection set', () => {
    const { view, selectionSet } = createView(['a'])
    view.applySelection(['b'], 'toggle')
    view.applySelection(['b'], 'toggle')
    expect([...selectionSet.ids]).toEqual(['a'])
  })

  test('does not add entities on locked layers but still removes them', () => {
    const { view, selectionSet } = createView(['x'], ['x', 'y'])
    view.applySelection(['x', 'y'], 'toggle')
    expect([...selectionSet.ids]).toEqual([])
  })

  test('replace keeps only the picked ids', () => {
    const { view, selectionSet } = createView(['a', 'b'])
    view.applySelection(['c'], 'replace')
    expect([...selectionSet.ids]).toEqual(['c'])
  })
})
