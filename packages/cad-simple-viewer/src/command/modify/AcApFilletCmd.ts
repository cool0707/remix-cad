import {
  AcDbArc,
  AcDbEntity,
  AcDbLine,
  AcDbPolyline,
  AcGePoint3d
} from '@mlightcad/data-model'

import { AcApContext, AcApDocManager } from '../../app'
import {
  AcEdCommand,
  AcEdOpenMode,
  AcEdPromptDistanceOptions,
  AcEdPromptEntityOptions,
  AcEdPromptEntityResult,
  AcEdPromptStatus
} from '../../editor'
import { AcApI18n } from '../../i18n'
import { AcApEntityService } from '../../service'
import { AcApCurveEditSession } from './AcApCurveEditSession'
import {
  acapBulgeSeg,
  acapCorner,
  acapCornerReach,
  acapLineLineIntersection,
  acapNormAngle,
  acapParallelJoin,
  acapPolylineVertices,
  acapProjectOnPath,
  acapReadCurvePath,
  AcApSeg,
  acapVec,
  AcApXY
} from './AcApCurvePath'

type CornerMode = { radius: number } | { d1: number; d2: number }

/** One picked object of a corner command. */
interface Pick {
  entity: AcDbEntity
  point: AcApXY
}

const { sub, mul, dot, len } = acapVec

const unit = (v: AcApXY) => {
  const l = len(v)
  return l > 0 ? mul(v, 1 / l) : v
}

/**
 * Shared flow of FILLET and CHAMFER: pick two lines (or two neighbouring
 * straight sides of one polyline) near the parts to keep, with an option to
 * set the radius / distances first.
 */
abstract class AcApCornerCmd extends AcEdCommand {
  protected abstract readonly key: 'fillet' | 'chamfer'

  constructor() {
    super()
    this.mode = AcEdOpenMode.Write
  }

  /** Current radius / distances */
  protected abstract get cornerMode(): CornerMode

  /** Message with the current setting, e.g. "(半径 = 10)" */
  protected abstract settingText(): string

  /** Asks for the radius / distances. Returns false when cancelled. */
  protected abstract promptSetting(): Promise<boolean>

  protected abstract optionKeyword(): {
    display: string
    global: string
    local: string
  }

  private async pick(messageKey: string, withOption: boolean) {
    while (true) {
      const prompt = new AcEdPromptEntityOptions(
        `${AcApI18n.t(`jig.${this.key}.${messageKey}`)} ${this.settingText()}`
      )
      if (withOption) {
        const kw = this.optionKeyword()
        prompt.keywords.add(kw.display, kw.global, kw.local)
      }
      prompt.setRejectMessage(AcApI18n.t(`jig.${this.key}.unsupported`))
      const result: AcEdPromptEntityResult =
        await AcApDocManager.instance.editor.getEntity(prompt)
      if (result.status === AcEdPromptStatus.Keyword) {
        if (!(await this.promptSetting())) return undefined
        continue
      }
      if (result.status !== AcEdPromptStatus.OK || !result.objectId) {
        return undefined
      }
      return result
    }
  }

  async execute(context: AcApContext) {
    context.view.selectionSet.clear()
    const db = context.doc.database
    const session = new AcApCurveEditSession(context)

    const first = await this.pick('firstObject', true)
    if (!first) return
    const e1 = db.tables.blockTable.getEntityById(first.objectId!)
    if (!e1) return
    const second = await this.pick('secondObject', false)
    if (!second) return
    const e2 = db.tables.blockTable.getEntityById(second.objectId!)
    if (!e2) return

    if (session.isLocked(e1) || session.isLocked(e2)) {
      this.showMessage(AcApI18n.t('main.message.onLockedLayer'), 'warning')
      return
    }
    const p1 = first.pickedPoint ?? context.view.curPos
    const p2 = second.pickedPoint ?? context.view.curPos
    const warning = this.apply(
      session,
      { entity: e1, point: p1 },
      { entity: e2, point: p2 }
    )
    if (warning) {
      this.showMessage(AcApI18n.t(`jig.${this.key}.${warning}`), 'warning')
    }
  }

  /** Returns a message key when the corner cannot be made. */
  private apply(session: AcApCurveEditSession, a: Pick, b: Pick) {
    if (a.entity instanceof AcDbLine && b.entity instanceof AcDbLine) {
      if (a.entity === b.entity) return 'sameObject'
      return this.applyLines(session, a, b)
    }
    if (
      a.entity instanceof AcDbPolyline &&
      a.entity === b.entity
    ) {
      return this.applyPolyline(session, a.entity, a.point, b.point)
    }
    return 'unsupported'
  }

  private applyLines(session: AcApCurveEditSession, a: Pick, b: Pick) {
    const l1 = a.entity as AcDbLine
    const l2 = b.entity as AcDbLine
    const s1 = l1.startPoint
    const e1 = l1.endPoint
    const s2 = l2.startPoint
    const e2 = l2.endPoint
    const p = acapLineLineIntersection(s1, sub(e1, s1), s2, sub(e2, s2))
    if (!p) {
      return this.key === 'fillet'
        ? this.applyParallel(session, a, b)
        : 'parallel'
    }
    const side = (s: AcApXY, e: AcApXY, pick: AcApXY) => {
      const d = unit(sub(e, s))
      let u = mul(d, Math.sign(dot(sub(pick, p), d)) || 1)
      // Picked right at the corner: keep the longer part.
      if (Math.abs(dot(sub(pick, p), d)) < 1e-9) {
        u = dot(sub(s, p), d) + dot(sub(e, p), d) >= 0 ? d : mul(d, -1)
      }
      const keepStart = dot(sub(s, p), u) >= dot(sub(e, p), u)
      const reach = Math.max(dot(sub(s, p), u), dot(sub(e, p), u))
      return { u, keepStart, reach }
    }
    const k1 = side(s1, e1, a.point)
    const k2 = side(s2, e2, b.point)
    const [r1, r2] = acapCornerReach(k1.u, k2.u, this.cornerMode)
    if (k1.reach < r1 - 1e-9 || k2.reach < r2 - 1e-9) return 'tooLarge'
    const corner = acapCorner(p, k1.u, k2.u, this.cornerMode)
    if (!corner) return 'parallel'

    const z1 = s1.z
    const z2 = s2.z
    session.begin()
    try {
      const setEnd = (
        line: AcDbLine,
        keepStart: boolean,
        point: AcApXY,
        z: number
      ) => {
        const before = acapReadCurvePath(line)!
        const target = new AcGePoint3d(point.x, point.y, z)
        const after = keepStart
          ? { s: line.startPoint, e: target }
          : { s: target, e: line.endPoint }
        session.modify(line, before, {
          ...before,
          segs: [
            {
              kind: 'line',
              a: { x: after.s.x, y: after.s.y },
              b: { x: after.e.x, y: after.e.y }
            }
          ]
        })
      }
      setEnd(l1, k1.keepStart, corner.t1, z1)
      setEnd(l2, k2.keepStart, corner.t2, z2)
      const joint = this.jointEntity(corner, z1)
      if (joint) {
        AcApEntityService.copyDisplayTraits(l1, joint)
        session.add([joint], l1)
      }
    } finally {
      session.end()
    }
    return undefined
  }

  /** FILLET of parallel lines: a half circle joins them. */
  private applyParallel(session: AcApCurveEditSession, a: Pick, b: Pick) {
    const l1 = a.entity as AcDbLine
    const l2 = b.entity as AcDbLine
    const join = acapParallelJoin(
      l1.startPoint,
      l1.endPoint,
      a.point,
      l2.startPoint,
      l2.endPoint
    )
    if (!join) return 'parallel'
    const z = l1.startPoint.z
    session.begin()
    try {
      const before = acapReadCurvePath(l2)!
      const s = l2.startPoint
      const e = l2.endPoint
      const segs: AcApSeg[] = [
        {
          kind: 'line',
          a: join.moveStart2 ? join.end2 : { x: s.x, y: s.y },
          b: join.moveStart2 ? { x: e.x, y: e.y } : join.end2
        }
      ]
      session.modify(l2, before, { ...before, segs })
      const arc = this.jointEntity(
        { t1: join.end2, t2: join.end2, arc: join.arc },
        z
      )!
      AcApEntityService.copyDisplayTraits(l1, arc)
      session.add([arc], l1)
    } finally {
      session.end()
    }
    return undefined
  }

  /** The fillet arc or chamfer line between the two new ends. */
  private jointEntity(
    corner: NonNullable<ReturnType<typeof acapCorner>>,
    z: number
  ): AcDbEntity | undefined {
    if (corner.arc) {
      const arc = corner.arc
      const start = arc.sweep >= 0 ? arc.a0 : arc.a0 + arc.sweep
      const end = arc.sweep >= 0 ? arc.a0 + arc.sweep : arc.a0
      return new AcDbArc(
        new AcGePoint3d(arc.c.x, arc.c.y, z),
        arc.r,
        acapNormAngle(start),
        acapNormAngle(end)
      )
    }
    if (len(sub(corner.t1, corner.t2)) < 1e-9) return undefined
    return new AcDbLine(
      new AcGePoint3d(corner.t1.x, corner.t1.y, z),
      new AcGePoint3d(corner.t2.x, corner.t2.y, z)
    )
  }

  /** Corner between two neighbouring straight sides of one polyline. */
  private applyPolyline(
    session: AcApCurveEditSession,
    pl: AcDbPolyline,
    pick1: AcApXY,
    pick2: AcApXY
  ) {
    const path = acapReadCurvePath(pl)
    if (!path) return 'unsupported'
    const n = path.segs.length
    const i1 = Math.min(Math.floor(acapProjectOnPath(path, pick1).t), n - 1)
    const i2 = Math.min(Math.floor(acapProjectOnPath(path, pick2).t), n - 1)
    let a: number
    if ((i1 + 1) % n === i2 && (path.closed || i1 + 1 < n)) a = i1
    else if ((i2 + 1) % n === i1 && (path.closed || i2 + 1 < n)) a = i2
    else return 'notAdjacent'
    const b = (a + 1) % n
    const segA = path.segs[a]
    const segB = path.segs[b]
    if (segA.kind !== 'line' || segB.kind !== 'line') return 'arcSegment'

    const p = segA.b
    const u1 = unit(sub(segA.a, p))
    const u2 = unit(sub(segB.b, p))
    const [r1, r2] = acapCornerReach(u1, u2, this.cornerMode)
    if (len(sub(segA.a, p)) < r1 - 1e-9 || len(sub(segB.b, p)) < r2 - 1e-9) {
      return 'tooLarge'
    }
    const corner = acapCorner(p, u1, u2, this.cornerMode)
    if (!corner) return 'parallel'
    if (len(sub(corner.t1, corner.t2)) < 1e-9) return undefined

    // Vertex `b` (the corner) becomes two vertices.
    const vertices = acapPolylineVertices(pl)
    const v = vertices[b]
    const bulge = corner.arc ? Math.tan(corner.arc.sweep / 4) : 0
    const next = [
      ...vertices.slice(0, b),
      { ...v, x: corner.t1.x, y: corner.t1.y, bulge },
      { ...v, x: corner.t2.x, y: corner.t2.y },
      ...vertices.slice(b + 1)
    ]
    const count = next.length
    const segs = Array.from({ length: path.closed ? count : count - 1 }, (_, i) => {
      const from = next[i]
      const to = next[(i + 1) % count]
      return acapBulgeSeg(from, to, from.bulge ?? 0, from.startWidth, from.endWidth)
    })
    session.begin()
    try {
      session.modify(pl, path, { ...path, segs })
    } finally {
      session.end()
    }
    return undefined
  }
}

/**
 * FILLET: rounds the corner of two lines (or of two neighbouring straight
 * sides of a polyline) with an arc of the given radius. Radius 0 makes a
 * sharp corner (trims / extends both lines to meet).
 */
export class AcApFilletCmd extends AcApCornerCmd {
  protected readonly key = 'fillet'
  private static _radius = 0

  protected get cornerMode(): CornerMode {
    return { radius: AcApFilletCmd._radius }
  }

  protected settingText() {
    return AcApI18n.t('jig.fillet.current').replace(
      '{radius}',
      formatNumber(AcApFilletCmd._radius)
    )
  }

  protected optionKeyword() {
    return {
      display: AcApI18n.t('jig.fillet.keywords.radius.display'),
      global: AcApI18n.t('jig.fillet.keywords.radius.global'),
      local: AcApI18n.t('jig.fillet.keywords.radius.local')
    }
  }

  protected async promptSetting() {
    const value = await promptDistance(
      AcApI18n.t('jig.fillet.radius'),
      AcApFilletCmd._radius
    )
    if (value == null) return false
    AcApFilletCmd._radius = value
    return true
  }
}

/**
 * CHAMFER: cuts the corner of two lines (or of two neighbouring straight
 * sides of a polyline) with a line at the given distances from the corner.
 */
export class AcApChamferCmd extends AcApCornerCmd {
  protected readonly key = 'chamfer'
  private static _d1 = 0
  private static _d2 = 0

  protected get cornerMode(): CornerMode {
    return { d1: AcApChamferCmd._d1, d2: AcApChamferCmd._d2 }
  }

  protected settingText() {
    return AcApI18n.t('jig.chamfer.current')
      .replace('{d1}', formatNumber(AcApChamferCmd._d1))
      .replace('{d2}', formatNumber(AcApChamferCmd._d2))
  }

  protected optionKeyword() {
    return {
      display: AcApI18n.t('jig.chamfer.keywords.distance.display'),
      global: AcApI18n.t('jig.chamfer.keywords.distance.global'),
      local: AcApI18n.t('jig.chamfer.keywords.distance.local')
    }
  }

  protected async promptSetting() {
    const d1 = await promptDistance(
      AcApI18n.t('jig.chamfer.firstDistance'),
      AcApChamferCmd._d1
    )
    if (d1 == null) return false
    const d2 = await promptDistance(AcApI18n.t('jig.chamfer.secondDistance'), d1)
    if (d2 == null) return false
    AcApChamferCmd._d1 = d1
    AcApChamferCmd._d2 = d2
    return true
  }
}

function formatNumber(value: number) {
  return String(Number(value.toFixed(6)))
}

async function promptDistance(message: string, current: number) {
  const prompt = new AcEdPromptDistanceOptions(message)
  prompt.allowNegative = false
  prompt.allowZero = true
  prompt.useDefaultValue = true
  prompt.defaultValue = current
  prompt.allowNone = true
  const result = await AcApDocManager.instance.editor.getDistance(prompt)
  if (result.status === AcEdPromptStatus.None) return current
  if (result.status !== AcEdPromptStatus.OK || result.value == null) {
    return undefined
  }
  return result.value
}
