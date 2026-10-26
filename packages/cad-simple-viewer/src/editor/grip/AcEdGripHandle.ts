import { AcGePoint2dLike } from '@mlightcad/data-model'
import { injectMlGripHandleCss } from '@mlightcad/three-renderer'

import {
  type AcEdGripAppearance,
  applyGripAppearanceToHost
} from './AcEdGripAppearance'

/** Visual state of a grip handle. */
export type AcEdGripHandleState = 'normal' | 'hover' | 'hot'

/**
 * Shape of a grip handle: a round `point` grip moves one point, a pill-shaped
 * `edge` grip lies along a segment and moves the whole segment.
 */
export type AcEdGripHandleShape = 'point' | 'edge'

/**
 * Interactive DOM grip handle rendered in container-local screen coordinates.
 */
export class AcEdGripHandle {
  private readonly _el: HTMLElement
  private _state: AcEdGripHandleState = 'normal'

  constructor(
    private readonly _host: HTMLElement,
    appearance: AcEdGripAppearance,
    private readonly _shape: AcEdGripHandleShape = 'point'
  ) {
    injectMlGripHandleCss()

    const hostPosition = getComputedStyle(this._host).position
    if (hostPosition === 'static') {
      this._host.style.position = 'relative'
    }

    this._el = document.createElement('div')
    this._el.className = this.classNameFor('normal')
    this.applyAppearance(appearance)
    this._host.appendChild(this._el)
  }

  get element(): HTMLElement {
    return this._el
  }

  get state(): AcEdGripHandleState {
    return this._state
  }

  setState(state: AcEdGripHandleState) {
    if (this._state === state) return
    this._state = state
    this._el.className = this.classNameFor(state)
  }

  /**
   * Turns an `edge` handle to lie along its segment.
   *
   * @param radians - Segment direction on screen (y down), in radians.
   */
  setAngle(radians: number) {
    this._el.style.setProperty('--ml-grip-angle', `${radians}rad`)
  }

  setPosition(pos: AcGePoint2dLike) {
    this._el.style.left = `${pos.x}px`
    this._el.style.top = `${pos.y}px`
  }

  applyAppearance(appearance: AcEdGripAppearance) {
    applyGripAppearanceToHost(this._host, appearance)
  }

  private classNameFor(state: AcEdGripHandleState) {
    return `ml-grip-handle ml-grip-handle-${this._shape} ml-grip-handle-${state}`
  }

  destroy() {
    this._el.remove()
  }
}
