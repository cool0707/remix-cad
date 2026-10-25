import { acapRunServiceEdit } from '../src/service/AcApServiceEdit'

function layer(name: string) {
  return {
    name,
    isOff: false,
    standardFlags: 0,
    linetype: 'Continuous',
    lineWeight: -3,
    isPlottable: true,
    color: { toString: () => '7' },
    transparency: { toString: () => 'ByLayer' }
  }
}

function database(inTransaction: boolean) {
  const layers = [layer('0'), layer('DOORS')]
  return {
    layers,
    db: {
      transactionManager: { hasTransaction: () => inTransaction },
      tables: { layerTable: { newIterator: () => layers.values() } },
      events: { layerModified: { dispatch: jest.fn() } },
      isUndoRecording: () => false,
      runDatabaseEdit: jest.fn((_label: string, edit: () => void) => edit())
    }
  }
}

describe('acapRunServiceEdit', () => {
  it('inside a command: reports changed layers right away', () => {
    const { db, layers } = database(true)
    const result = acapRunServiceEdit(db as never, 'Layer', () => {
      layers[1].isOff = true
      return 42
    })

    expect(result).toBe(42)
    expect(db.runDatabaseEdit).not.toHaveBeenCalled()
    expect(db.events.layerModified.dispatch).toHaveBeenCalledTimes(1)
    expect(db.events.layerModified.dispatch).toHaveBeenCalledWith({
      database: db,
      layer: layers[1],
      changes: { isOff: true }
    })
  })

  it('inside a command: entity edits run directly without layer events', () => {
    const { db } = database(true)
    expect(acapRunServiceEdit(db as never, 'Entity', () => 'ok')).toBe('ok')
    expect(db.events.layerModified.dispatch).not.toHaveBeenCalled()
  })

  it('outside a command: one undo step, events left to the database', () => {
    const { db, layers } = database(false)
    acapRunServiceEdit(db as never, 'Layer', () => {
      layers[0].isOff = true
    })
    expect(db.runDatabaseEdit).toHaveBeenCalledWith(
      'Layer',
      expect.any(Function)
    )
    expect(db.events.layerModified.dispatch).not.toHaveBeenCalled()
  })
})
