import type { AcEdUiTheme } from '../editor/global/AcEdUiTheme'
import { AcUiDialog } from './AcUiDialog'

/** Options for {@link AcUiConfirmDialog.open}. */
export interface AcUiConfirmDialogOptions {
  title: string
  /** Text of the question (one paragraph per line). */
  message: string
  /** Text of the button that answers "yes". */
  ok: string
  /** Text of the button that answers "no". */
  cancel: string
  /** Accessible label of the × button. */
  close?: string
  host?: HTMLElement
  theme?: AcEdUiTheme
}

/**
 * Yes / no question. Closing it any other way (×, Esc, the backdrop) is "no".
 */
export class AcUiConfirmDialog extends AcUiDialog {
  private result = false

  private constructor(options: AcUiConfirmDialogOptions) {
    super({
      host: options.host,
      theme: options.theme,
      title: options.title,
      closeLabel: options.close,
      layoutWidth: false
    })
    for (const line of options.message.split('\n')) {
      const p = document.createElement('p')
      p.style.margin = '0 0 8px'
      p.style.overflowWrap = 'anywhere'
      p.textContent = line
      this.bodyEl.appendChild(p)
    }

    const cancelBtn = document.createElement('button')
    cancelBtn.type = 'button'
    cancelBtn.className = 'ml-ui-dialog-btn ml-ui-dialog-btn-secondary'
    cancelBtn.textContent = options.cancel
    cancelBtn.addEventListener('click', () => this.close())

    const okBtn = document.createElement('button')
    okBtn.type = 'button'
    okBtn.className = 'ml-ui-dialog-btn ml-ui-dialog-btn-primary'
    okBtn.textContent = options.ok
    okBtn.addEventListener('click', () => {
      this.result = true
      this.close()
    })

    this.footerEl.append(cancelBtn, okBtn)
    this.focusAfterOpen(okBtn)
  }

  /**
   * Shows the question.
   *
   * @returns `true` when the "yes" button was pressed.
   */
  static open(options: AcUiConfirmDialogOptions): Promise<boolean> {
    const dialog = new AcUiConfirmDialog(options)
    return dialog.show().then(() => dialog.result)
  }
}
