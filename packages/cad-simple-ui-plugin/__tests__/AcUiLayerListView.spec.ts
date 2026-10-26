/** @jest-environment jsdom */

const layers = [
  {
    name: 'Wall',
    color: '1',
    cssColor: '#ff0000',
    isOn: true,
    isFrozen: false,
    isLocked: false
  },
  {
    name: 'Door',
    color: '2',
    cssColor: '#ffff00',
    isOn: true,
    isFrozen: false,
    isLocked: false
  },
  {
    name: 'A-Anno',
    color: '3',
    cssColor: '#00ff00',
    isOn: false,
    isFrozen: false,
    isLocked: false
  }
]

const layerStore = {
  getLayers: jest.fn(() => [...layers]),
  getCurrentLayerName: jest.fn(() => 'Door'),
  setAllLayersOn: jest.fn(),
  setAllLayersOffExceptCurrent: jest.fn(),
  setLayerOn: jest.fn(),
  setLayerColor: jest.fn(),
  setCurrentLayer: jest.fn(() => true),
  events: {
    changed: {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }
  }
}

const documentActivated = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
}

const editor = {
  curDocument: { layerStore },
  events: { documentActivated }
}

jest.mock('@mlightcad/cad-simple-viewer', () => {
  const { createCadSimpleViewerMock } = require('./helpers/mockCadSimpleViewer')
  return createCadSimpleViewerMock({
    AcApDocManager: {
      instance: {
        curView: undefined
      }
    },
    AcApI18n: {
      t: (_key: string, opts?: { fallback?: string }) => opts?.fallback ?? _key,
      mergeLocaleMessage: jest.fn(),
      events: {
        localeChanged: {
          addEventListener: jest.fn(),
          removeEventListener: jest.fn()
        }
      },
      currentLocale: 'en'
    },
    AcApLayerStore: class {}
  })
})

jest.mock('@mlightcad/data-model', () => ({
  AcCmColor: {
    fromString: jest.fn(() => null)
  }
}))

import { AcUiI18n, acuiRegisterSimpleUiI18n } from '../src/i18n'
import { AcUiLayerListView } from '../src/ui/AcUiLayerListView'

function createView() {
  acuiRegisterSimpleUiI18n()
  const host = document.createElement('div')
  document.body.appendChild(host)
  return new AcUiLayerListView({
    editor: editor as never,
    i18n: new AcUiI18n(),
    host
  })
}

function getLayerNames(view: AcUiLayerListView) {
  return Array.from(view.element.querySelectorAll('.ml-ex-ui-layer-name')).map(
    el => el.textContent ?? ''
  )
}

describe('AcUiLayerListView', () => {
  afterEach(() => {
    document.body.replaceChildren()
    document.getElementById('ml-ex-ui-styles')?.remove()
    jest.clearAllMocks()
  })

  it('sorts layers by name when the name header is clicked', () => {
    const view = createView()
    const sortButton = view.element.querySelector(
      '.ml-ex-ui-layer-name-sort'
    ) as HTMLButtonElement

    expect(getLayerNames(view)).toEqual(['Wall', 'Door', 'A-Anno'])

    sortButton.click()
    expect(getLayerNames(view)).toEqual(['A-Anno', 'Door', 'Wall'])
    expect(
      view.element
        .querySelector('.ml-ex-ui-layer-name-header')
        ?.getAttribute('aria-sort')
    ).toBe('ascending')

    sortButton.click()
    expect(getLayerNames(view)).toEqual(['Wall', 'Door', 'A-Anno'])
    expect(
      view.element
        .querySelector('.ml-ex-ui-layer-name-header')
        ?.getAttribute('aria-sort')
    ).toBe('descending')

    sortButton.click()
    expect(getLayerNames(view)).toEqual(['Wall', 'Door', 'A-Anno'])
    expect(
      view.element
        .querySelector('.ml-ex-ui-layer-name-header')
        ?.getAttribute('aria-sort')
    ).toBe('none')

    view.destroy()
  })

  it('marks the current layer with a pencil button that switches layers', () => {
    const view = createView()
    const buttons = Array.from(
      view.element.querySelectorAll<HTMLButtonElement>(
        '.ml-ex-ui-layer-current-button'
      )
    )

    expect(buttons).toHaveLength(3)
    expect(
      buttons.map(button => button.classList.contains('is-current'))
    ).toEqual([false, true, false])
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true')

    buttons[1].click()
    expect(layerStore.setCurrentLayer).not.toHaveBeenCalled()

    buttons[0].click()
    expect(layerStore.setCurrentLayer).toHaveBeenCalledWith('Wall')

    view.destroy()
  })
})
