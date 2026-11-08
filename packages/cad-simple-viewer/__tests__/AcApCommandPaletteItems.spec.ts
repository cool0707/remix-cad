import {
  acapBuildCommandPalette,
  type AcApCommandPaletteState,
  acapFoldSearchText,
  acapIsCommandPaletteShortcut,
  acapSearchCommandPalette
} from '../src/app/AcApCommandPaletteItems'

const TEXTS: Record<string, string> = {
  'main.commandPalette.commands.layer': 'レイヤー',
  'main.commandPalette.commands.erase': '削除',
  'main.commandPalette.commands.undo': '元に戻す',
  'main.commandPalette.commands.laydel': 'レイヤーを削除',
  'main.commandPalette.keywords.layer': '画層',
  'main.commandPalette.keywords.laydel': '画層',
  'main.commandPalette.keywords.line': '線分 直線',
  'main.commandPalette.layer': 'レイヤー',
  'main.commandPalette.layerCurrent': '編集レイヤー',
  'main.commandPalette.layerSetCurrent': '編集レイヤーにする',
  'main.tool.line': '線',
  'main.tool.rectang': '矩形',
  'main.contextMenu.copy': 'コピー',
  'main.contextMenu.selectAll': 'すべて選択',
  'main.contextMenu.zoomExtents': '全体表示'
}

const DESCRIPTIONS: Record<string, string> = {
  line: '線分を作成します',
  rectang: '矩形を作成します',
  angbase: '基準角度を設定します',
  log: 'デバッグ情報を出力します'
}

function state(
  partial: Partial<AcApCommandPaletteState> = {}
): AcApCommandPaletteState {
  return {
    commands: [
      { name: 'LINE', aliases: ['L'], group: 'ACAD' },
      { name: 'RECTANG', aliases: ['REC'], group: 'ACAD' },
      { name: 'LAYER', aliases: ['LA'], group: 'ACAD' },
      { name: 'LAYDEL', aliases: [], group: 'ACAD' },
      { name: 'ERASE', aliases: ['E'], group: 'ACAD' },
      { name: 'UNDO', aliases: ['U'], group: 'ACAD' },
      { name: 'LOG', aliases: [], group: 'ACAD' },
      { name: 'ANGBASE', aliases: [], group: 'ACAD', isSysVar: true },
      { name: 'MYCMD', aliases: [], group: 'USER' }
    ],
    layers: [
      { name: '0', current: true },
      { name: '壁', current: false }
    ],
    actions: { copy: true, selectAll: true, zoomExtents: true },
    simple: true,
    t: key => TEXTS[key],
    description: (_group, name) => DESCRIPTIONS[name],
    ...partial
  }
}

const ids = (entries: { id: string }[]) => entries.map(entry => entry.id)

describe('acapBuildCommandPalette', () => {
  it('lists only plainly named commands and user commands in the simple profile', () => {
    const entries = acapBuildCommandPalette(state())
    const commands = ids(entries.filter(entry => entry.kind === 'command'))
    expect(commands).toEqual(
      expect.arrayContaining([
        'command:line',
        'command:rectang',
        'command:layer',
        'command:erase',
        'command:mycmd'
      ])
    )
    expect(commands).not.toContain('command:log')
    expect(commands).not.toContain('command:angbase')
  })

  it('lists every command in the CAD profile, system variables last', () => {
    const entries = acapBuildCommandPalette(state({ simple: false }))
    const commands = ids(entries.filter(entry => entry.kind === 'command'))
    expect(commands).toContain('command:log')
    expect(commands[commands.length - 1]).toBe('command:angbase')
    // Without a plain name the description is the label.
    expect(entries.find(entry => entry.id === 'command:log')?.label).toBe(
      'デバッグ情報を出力します'
    )
  })

  it('shows the command name, aliases and shortcuts', () => {
    const entries = acapBuildCommandPalette(state())
    const line = entries.find(entry => entry.id === 'command:line')!
    expect(line.label).toBe('線')
    expect(line.detail).toBe('線分を作成します')
    expect(line.command).toBe('LINE (L)')
    expect(line.shortcut).toBe('L')
    expect(entries.find(entry => entry.id === 'command:undo')?.shortcut).toBe(
      'Ctrl+Z'
    )
    expect(entries.find(entry => entry.id === 'command:erase')?.shortcut).toBe(
      'Delete'
    )
    // Single-key tools only in the simple profile.
    const cad = acapBuildCommandPalette(state({ simple: false, isMac: true }))
    expect(cad.find(entry => entry.id === 'command:line')?.shortcut).toBe(
      undefined
    )
    expect(cad.find(entry => entry.id === 'command:undo')?.shortcut).toBe('⌘Z')
  })

  it('lists the possible edit actions and the layers', () => {
    const entries = acapBuildCommandPalette(state())
    expect(ids(entries.filter(entry => entry.kind === 'action'))).toEqual([
      'action:copy',
      'action:selectAll',
      'action:zoomExtents'
    ])
    const layers = entries.filter(entry => entry.kind === 'layer')
    expect(ids(layers)).toEqual(['layer:0', 'layer:壁'])
    expect(layers[0]!.current).toBe(true)
    expect(layers[1]!.detail).toBe('編集レイヤーにする')
  })

  it('puts recently picked commands first', () => {
    const entries = acapBuildCommandPalette(state({ recent: ['rectang'] }))
    expect(entries[0]!.id).toBe('command:rectang')
  })
})

describe('acapSearchCommandPalette', () => {
  const entries = acapBuildCommandPalette(state())

  it('lists everything but the layers for an empty query', () => {
    const result = acapSearchCommandPalette(entries, '  ')
    expect(result.some(entry => entry.kind === 'layer')).toBe(false)
    expect(result.length).toBe(
      entries.filter(entry => entry.kind !== 'layer').length
    )
  })

  it('finds a command by its plain name, CAD term, command name or alias', () => {
    expect(acapSearchCommandPalette(entries, '線')[0]!.id).toBe('command:line')
    expect(acapSearchCommandPalette(entries, '直線')[0]!.id).toBe(
      'command:line'
    )
    expect(acapSearchCommandPalette(entries, 'line')[0]!.id).toBe(
      'command:line'
    )
    expect(acapSearchCommandPalette(entries, 'LA')[0]!.id).toBe('command:layer')
    expect(acapSearchCommandPalette(entries, '画層')[0]!.id).toBe(
      'command:layer'
    )
  })

  it('matches katakana with hiragana and full-width letters', () => {
    expect(acapSearchCommandPalette(entries, 'れいやー')[0]!.id).toBe(
      'command:layer'
    )
    expect(acapSearchCommandPalette(entries, 'ＬＩＮＥ')[0]!.id).toBe(
      'command:line'
    )
  })

  it('needs every word to match', () => {
    expect(ids(acapSearchCommandPalette(entries, 'レイヤー 削除'))).toEqual([
      'command:laydel'
    ])
  })

  it('finds layers by name, after the layer commands', () => {
    expect(ids(acapSearchCommandPalette(entries, '壁'))).toEqual(['layer:壁'])
    const result = ids(acapSearchCommandPalette(entries, 'レイヤー'))
    expect(result.slice(0, 2)).toEqual(['command:layer', 'command:laydel'])
    expect(result).toContain('layer:壁')
    expect(ids(acapSearchCommandPalette(entries, 'レイヤー 壁'))).toEqual([
      'layer:壁'
    ])
  })

  it('finds a command by words of its description', () => {
    expect(ids(acapSearchCommandPalette(entries, '作成します')).sort()).toEqual(
      ['command:line', 'command:rectang']
    )
  })

  it('returns nothing when nothing matches and honors the limit', () => {
    expect(acapSearchCommandPalette(entries, 'zzz')).toEqual([])
    expect(acapSearchCommandPalette(entries, '', 2)).toHaveLength(2)
  })
})

describe('acapFoldSearchText', () => {
  it('folds width, case and katakana', () => {
    expect(acapFoldSearchText('ＬＩＮＥ レイヤー')).toBe('line れいやー')
  })
})

describe('acapIsCommandPaletteShortcut', () => {
  const key = (partial: Partial<KeyboardEvent>) =>
    ({
      code: 'KeyK',
      ctrlKey: false,
      metaKey: false,
      altKey: false,
      shiftKey: false,
      isComposing: false,
      ...partial
    }) as KeyboardEvent

  it('is Ctrl+K or Cmd+K only', () => {
    expect(acapIsCommandPaletteShortcut(key({ ctrlKey: true }))).toBe(true)
    expect(acapIsCommandPaletteShortcut(key({ metaKey: true }))).toBe(true)
    expect(acapIsCommandPaletteShortcut(key({}))).toBe(false)
    expect(
      acapIsCommandPaletteShortcut(key({ ctrlKey: true, shiftKey: true }))
    ).toBe(false)
    expect(
      acapIsCommandPaletteShortcut(key({ ctrlKey: true, code: 'KeyL' }))
    ).toBe(false)
  })
})
