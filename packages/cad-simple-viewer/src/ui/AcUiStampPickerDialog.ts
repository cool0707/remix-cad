/**
 * Dialog for choosing a review stamp from a gallery (like the stamp menus in
 * Acrobat / Illustrator) instead of typing a stamp id on the command line.
 *
 * @module AcUiStampPickerDialog
 * @packageDocumentation
 */

import type { AcEdUiTheme } from '../editor/global/AcEdUiTheme'
import { AcUiDialog } from './AcUiDialog'

/** One selectable built-in stamp. */
export interface AcUiStampPickerItem {
  /** Stamp id stored in the markup record (e.g. `approved`). */
  id: string
  /** Localized text drawn on the stamp badge (matches the placed stamp). */
  badge: string
}

/** Values returned when the user picks a stamp. */
export interface AcUiStampPickerResult {
  /** Built-in stamp id, or `custom` for an image stamp. */
  stampId: string
  /** Data URL of the chosen image when {@link stampId} is `custom`. */
  imageUrl?: string
  /** Optional caption shown under the stamp. */
  caption?: string
}

/** Localized labels for {@link AcUiStampPickerDialog}. */
export interface AcUiStampPickerDialogLabels {
  title: string
  close: string
  cancel: string
  /** Label of the optional caption field. */
  caption: string
  /** Placeholder of the caption field. */
  captionPlaceholder: string
  /** Name of the "stamp from an image file" tile. */
  custom: string
  /** Helper text under the custom tile name. */
  customHint: string
}

/** Options for {@link AcUiStampPickerDialog.open}. */
export interface AcUiStampPickerDialogOptions {
  labels: AcUiStampPickerDialogLabels
  items: AcUiStampPickerItem[]
  /** CSS color used for the previews (the current markup color). */
  accentColor: string
  host?: HTMLElement
  theme?: AcEdUiTheme
  /** Stamp id highlighted when the dialog opens. */
  initialStampId?: string
  /** Caption prefilled in the caption field. */
  initialCaption?: string
}

const STYLE_ID = 'ml-ui-stamp-picker-dialog-styles'

const DIALOG_CSS = `
  .ml-ui-stamp-picker-dialog .ml-ui-stamp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(132px, 1fr));
    gap: 10px;
  }
  .ml-ui-stamp-picker-dialog .ml-ui-stamp-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-height: 96px;
    padding: 14px 8px;
    border: 1px solid var(--ml-ui-border, #dcdfe6);
    border-radius: 8px;
    background: var(--ml-ui-bg, #fff);
    color: var(--ml-ui-text, inherit);
    font: inherit;
    cursor: pointer;
    box-sizing: border-box;
  }
  .ml-ui-stamp-picker-dialog .ml-ui-stamp-tile:hover,
  .ml-ui-stamp-picker-dialog .ml-ui-stamp-tile:focus-visible {
    border-color: var(--ml-ui-accent, var(--ml-brand, #409eff));
    outline: none;
  }
  .ml-ui-stamp-picker-dialog .ml-ui-stamp-tile[data-selected='true'] {
    border-color: var(--ml-ui-accent, var(--ml-brand, #409eff));
    box-shadow: 0 0 0 1px var(--ml-ui-accent, var(--ml-brand, #409eff));
  }
  .ml-ui-stamp-picker-dialog .ml-ui-stamp-badge {
    padding: 6px 10px;
    border: 3px solid currentColor;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.92);
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.06em;
    white-space: nowrap;
  }
  .ml-ui-stamp-picker-dialog .ml-ui-stamp-custom-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 36px;
    border: 2px dashed var(--ml-ui-border, #dcdfe6);
    border-radius: 6px;
    font-size: 22px;
    line-height: 1;
    color: var(--ml-ui-text-muted, #909399);
  }
  .ml-ui-stamp-picker-dialog .ml-ui-stamp-name {
    font-size: 13px;
    font-weight: 600;
    line-height: 1.3;
    text-align: center;
  }
  .ml-ui-stamp-picker-dialog .ml-ui-stamp-hint {
    margin-top: -6px;
    font-size: 11px;
    line-height: 1.35;
    text-align: center;
    color: var(--ml-ui-text-muted, #909399);
  }
  .ml-ui-stamp-picker-dialog .ml-ui-stamp-caption {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 14px;
    font-size: 13px;
  }
  .ml-ui-stamp-picker-dialog .ml-ui-stamp-caption input {
    height: 32px;
    padding: 0 8px;
    border: 1px solid var(--ml-ui-border, #dcdfe6);
    border-radius: 4px;
    background: var(--ml-ui-bg, #fff);
    color: inherit;
    font-size: 13px;
    box-sizing: border-box;
  }
`

function ensureStyles(): void {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = DIALOG_CSS
  document.head.appendChild(style)
}

/** Reads a local image file as a data URL (`undefined` on failure). */
function readImageFile(file: File): Promise<string | undefined> {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = () =>
      resolve(typeof reader.result === 'string' ? reader.result : undefined)
    reader.onerror = () => resolve(undefined)
    reader.readAsDataURL(file)
  })
}

/**
 * Modal stamp gallery. Clicking a tile picks that stamp and closes the dialog.
 */
export class AcUiStampPickerDialog extends AcUiDialog {
  private result: AcUiStampPickerResult | null = null
  private readonly captionInput: HTMLInputElement

  private constructor(options: AcUiStampPickerDialogOptions) {
    super({
      host: options.host,
      title: options.labels.title,
      closeLabel: options.labels.close,
      dialogClassName: 'ml-ui-stamp-picker-dialog',
      theme: options.theme
    })
    ensureStyles()

    const grid = document.createElement('div')
    grid.className = 'ml-ui-stamp-grid'

    let focusTarget: HTMLButtonElement | undefined
    for (const item of options.items) {
      const tile = this.createTile()
      tile.dataset.stampId = item.id
      tile.setAttribute('aria-label', item.badge)
      const badge = document.createElement('span')
      badge.className = 'ml-ui-stamp-badge'
      badge.style.color = options.accentColor
      badge.textContent = item.badge
      tile.appendChild(badge)
      tile.addEventListener('click', () => this.pick({ stampId: item.id }))
      if (item.id === options.initialStampId) {
        tile.dataset.selected = 'true'
        focusTarget = tile
      }
      grid.appendChild(tile)
    }

    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = 'image/*'
    fileInput.hidden = true
    fileInput.addEventListener('change', async () => {
      const file = fileInput.files?.[0]
      if (!file) return
      const imageUrl = await readImageFile(file)
      if (imageUrl) this.pick({ stampId: 'custom', imageUrl })
    })

    const customTile = this.createTile()
    customTile.dataset.stampId = 'custom'
    const customIcon = document.createElement('span')
    customIcon.className = 'ml-ui-stamp-custom-icon'
    customIcon.textContent = '+'
    const customName = document.createElement('div')
    customName.className = 'ml-ui-stamp-name'
    customName.textContent = options.labels.custom
    customTile.append(customIcon, customName)
    const hint = document.createElement('div')
    hint.className = 'ml-ui-stamp-hint'
    hint.textContent = options.labels.customHint
    customTile.appendChild(hint)
    customTile.addEventListener('click', () => fileInput.click())
    grid.appendChild(customTile)

    const captionLabel = document.createElement('label')
    captionLabel.className = 'ml-ui-stamp-caption'
    captionLabel.append(document.createTextNode(options.labels.caption))
    this.captionInput = document.createElement('input')
    this.captionInput.type = 'text'
    this.captionInput.placeholder = options.labels.captionPlaceholder
    this.captionInput.value = options.initialCaption ?? ''
    captionLabel.appendChild(this.captionInput)

    this.bodyEl.append(grid, captionLabel, fileInput)

    const cancelBtn = document.createElement('button')
    cancelBtn.type = 'button'
    cancelBtn.className = 'ml-ui-dialog-btn ml-ui-dialog-btn-secondary'
    cancelBtn.textContent = options.labels.cancel
    cancelBtn.addEventListener('click', () => this.close())
    this.footerEl.appendChild(cancelBtn)

    this.focusAfterOpen(focusTarget ?? grid.querySelector('button')!)
  }

  /**
   * Opens the gallery and resolves with the picked stamp, or `null` if cancelled.
   *
   * @param options - Labels, stamps and preview color.
   */
  static open(
    options: AcUiStampPickerDialogOptions
  ): Promise<AcUiStampPickerResult | null> {
    const dialog = new AcUiStampPickerDialog(options)
    return dialog.show().then(() => dialog.result)
  }

  private createTile(): HTMLButtonElement {
    const tile = document.createElement('button')
    tile.type = 'button'
    tile.className = 'ml-ui-stamp-tile'
    return tile
  }

  private pick(result: AcUiStampPickerResult): void {
    const caption = this.captionInput.value.trim()
    this.result = caption ? { ...result, caption } : result
    this.close()
  }
}
