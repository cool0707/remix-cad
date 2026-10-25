import {
  AcDbDatabase,
  AcDbEntity,
  AcDbHatch,
  AcDbHatchPatternType,
  AcDbHatchStyle,
  AcDbObjectId,
  AcDbSystemVariables,
  AcDbSysVarManager,
  type AcDbSysVarType,
  AcGeBox2d,
  AcGeLoop2dType,
  HATCH_PATTERN_SOLID
} from '@mlightcad/data-model'

import { AcApContext, AcApDocManager } from '../../app'
import {
  AcEdCommand,
  AcEdOpenMode,
  AcEdPromptDoubleOptions,
  AcEdPromptKeywordOptions,
  AcEdPromptPointOptions,
  AcEdPromptSelectionOptions,
  AcEdPromptStatus,
  AcEdPromptStringOptions
} from '../../editor'
import { AcApI18n } from '../../i18n'
import {
  ACAP_HATCH_MAX_SEGMENTS,
  AcApHatchBoundaryFinder,
  type AcApHatchBounds,
  acapHatchBounds,
  acapHatchPointInPolygon,
  type AcApHatchPolyline,
  acapHatchSignedArea,
  acapHatchSnapEnds
} from './AcApHatchBoundary'
import {
  acapCollectHatchBoundarySet,
  type AcApHatchBoundarySet,
  acapHatchLoopFor
} from './AcApHatchBoundarySet'

/**
 * Persisted HATCH command options reused between command invocations.
 */
export interface HatchSettings {
  /** Hatch pattern name, e.g. a predefined hatch pattern or `SOLID`. */
  patternName: string
  /** Pattern scale factor in drawing units (must be positive). */
  patternScale: number
  /** Pattern angle in degrees, converted to radians when writing entity data. */
  patternAngleDeg: number
  /** Hatch style that controls island handling behavior. */
  style: AcDbHatchStyle
  /** Whether the command should operate in associative mode. */
  associative: boolean
}

/** The boundary set pick points trace in, with its finder. */
interface PickBoundary {
  set: AcApHatchBoundarySet
  finder: AcApHatchBoundaryFinder
  /** Layer visibility the set was collected under. */
  signature: string
}

/**
 * Command-line HATCH command (no dialog), following AutoCAD's -HATCH.
 *
 * - Pick internal point (the default): the smallest closed area around the
 *   point, traced through the visible objects with lines split where they
 *   cross, with islands handled by the hatch style.
 * - Select objects: closed objects, or groups of objects that close an area.
 * - Command-line option branches (pattern/scale/angle/style/associative).
 */
export class AcApHatchCmd extends AcEdCommand {
  /**
   * Last-used command settings shared by all `AcApHatchCmd` instances.
   */
  private static _lastSettings: HatchSettings = {
    patternName: HATCH_PATTERN_SOLID,
    patternScale: 1,
    patternAngleDeg: 0,
    style: AcDbHatchStyle.Normal,
    associative: true
  }

  /**
   * Creates one HATCH command instance and marks it as write-mode only.
   */
  constructor() {
    super()
    this.mode = AcEdOpenMode.Write
  }

  /**
   * Current settings used by this command instance when creating hatches.
   */
  protected get settings(): HatchSettings {
    return AcApHatchCmd._lastSettings
  }

  private normalizeSysVarNumber(value: unknown, fallback: number) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : fallback
  }

  private normalizePositiveSysVarNumber(value: unknown, fallback: number) {
    const parsed = this.normalizeSysVarNumber(value, fallback)
    return parsed > 0 ? parsed : fallback
  }

  private sysVarRadiansToDegrees(value: number) {
    return Math.round(((value * 180) / Math.PI) * 1e6) / 1e6
  }

  private getSysVar(
    sysVarManager: AcDbSysVarManager,
    name: string,
    database: AcDbDatabase
  ) {
    try {
      return sysVarManager.getVar(name, database)
    } catch {
      return undefined
    }
  }

  private getDatabaseSysVarSettings(database?: AcDbDatabase): HatchSettings {
    const settings = this.settings
    if (!(database instanceof AcDbDatabase)) return settings

    try {
      const sysVarManager = AcDbSysVarManager.instance()
      const associative = this.getSysVar(
        sysVarManager,
        AcDbSystemVariables.HPASSOC,
        database
      )
      return {
        ...settings,
        patternName: this.normalizePatternName(
          (this.getSysVar(
            sysVarManager,
            AcDbSystemVariables.HPNAME,
            database
          ) as string) ?? settings.patternName
        ),
        patternScale: this.normalizePositiveSysVarNumber(
          this.getSysVar(sysVarManager, AcDbSystemVariables.HPSCALE, database),
          settings.patternScale
        ),
        patternAngleDeg: this.sysVarRadiansToDegrees(
          this.normalizeSysVarNumber(
            this.getSysVar(sysVarManager, AcDbSystemVariables.HPANG, database),
            (settings.patternAngleDeg * Math.PI) / 180
          )
        ),
        associative:
          associative == null ? settings.associative : Number(associative) !== 0
      }
    } catch {
      return settings
    }
  }

  private getActiveSettings(): HatchSettings {
    return this.getDatabaseSysVarSettings(
      AcApDocManager.instance.curDocument?.database
    )
  }

  private setActiveSysVar(name: string, value: AcDbSysVarType) {
    const database = AcApDocManager.instance.curDocument?.database
    if (!database) return
    AcDbSysVarManager.instance().setVar(name, value, database)
  }

  /**
   * Normalizes pattern name input.
   *
   * @param value Raw user-entered pattern name.
   * @returns Trimmed name, or `SOLID` when input is empty.
   */
  protected normalizePatternName(value: string) {
    const name = value.trim().toUpperCase()
    return name.length > 0 ? name : HATCH_PATTERN_SOLID
  }

  /**
   * Converts hatch style enum to command keyword string.
   *
   * @param style Hatch style enum value.
   * @returns Command keyword name used by keyword prompts.
   */
  protected styleToKeyword(style: AcDbHatchStyle) {
    switch (style) {
      case AcDbHatchStyle.Outer:
        return 'Outer'
      case AcDbHatchStyle.Ignore:
        return 'Ignore'
      case AcDbHatchStyle.Normal:
      default:
        return 'Normal'
    }
  }

  /**
   * Converts command keyword string to hatch style enum.
   *
   * @param keyword Keyword returned by prompt API.
   * @returns Matching hatch style enum, defaulting to `Normal`.
   */
  protected keywordToStyle(keyword: string) {
    switch (keyword) {
      case 'Outer':
        return AcDbHatchStyle.Outer
      case 'Ignore':
        return AcDbHatchStyle.Ignore
      case 'Normal':
      default:
        return AcDbHatchStyle.Normal
    }
  }

  /**
   * Boundary set for pick points, kept while the layer visibility it was
   * built under stays the same (HATCH never adds boundary objects itself).
   */
  private _pickBoundary: PickBoundary | undefined

  /** Layer visibility under which the whole drawing was too much to analyze. */
  private _wholeDrawingTooComplex: string | undefined

  /** Outer loops hatched by picks in this run, so one area is not hatched twice. */
  private _pickedAreas: Array<{ area: number; bounds: AcApHatchBounds }> = []

  /**
   * Forgets the boundary set and the areas picked so far. Called when a
   * HATCH run starts.
   */
  protected resetBoundaryState() {
    this._pickBoundary = undefined
    this._wholeDrawingTooComplex = undefined
    this._pickedAreas = []
  }

  /** Shows a warning as a notification. */
  private warn(key: string) {
    this.notify(AcApI18n.t(key), 'warning')
  }

  private finderFor(set: AcApHatchBoundarySet) {
    // Line ends that stop just short of another curve (a flattened arc, a
    // T junction drawn a hair short) are moved onto it first.
    const polys = acapHatchSnapEnds(set.polys, set.outlineTol, set.tol)
    return new AcApHatchBoundaryFinder(polys, set.tol)
  }

  /** On / frozen state of every layer, to notice layer changes during HATCH. */
  private layerSignature(database: AcDbDatabase) {
    const parts: string[] = []
    for (const layer of database.tables.layerTable.newIterator()) {
      parts.push(
        `${layer.name}:${layer.isOff ? 1 : 0}${layer.isFrozen ? 1 : 0}`
      )
    }
    return parts.join('|')
  }

  /** Model-space objects that touch the visible part of the view. */
  private entitiesInView(context: AcApContext): AcDbEntity[] {
    const view = context.view
    const a = view.screenToWorld({ x: 0, y: 0 })
    const b = view.screenToWorld({ x: view.width, y: view.height })
    const modelSpace = context.doc.database.tables.blockTable.modelSpace
    const out: AcDbEntity[] = []
    for (const item of view.search(
      new AcGeBox2d().expandByPoint(a).expandByPoint(b)
    )) {
      const entity = modelSpace.getIdAt(item.id)
      if (entity) out.push(entity)
    }
    return out
  }

  /**
   * The boundary set pick points trace in, like AutoCAD's default boundary
   * set: every visible object in model space. When that is too much to
   * analyze, only the objects in the current view are used.
   *
   * @returns The set and its finder, or `undefined` when it is too complex.
   */
  private pickBoundary(context: AcApContext): PickBoundary | undefined {
    const database = context.doc.database
    const signature = this.layerSignature(database)
    if (this._pickBoundary?.signature === signature) return this._pickBoundary

    if (this._wholeDrawingTooComplex !== signature) {
      const all = acapCollectHatchBoundarySet(
        database,
        database.tables.blockTable.modelSpace.newIterator()
      )
      if (all.segmentCount <= ACAP_HATCH_MAX_SEGMENTS) {
        const finder = this.finderFor(all)
        if (finder.usable) {
          this._pickBoundary = { set: all, finder, signature }
          return this._pickBoundary
        }
      }
      this._wholeDrawingTooComplex = signature
    }
    // Not kept: it depends on the view.
    this._pickBoundary = undefined
    const inView = acapCollectHatchBoundarySet(
      database,
      this.entitiesInView(context)
    )
    if (inView.segmentCount > ACAP_HATCH_MAX_SEGMENTS) return undefined
    const finder = this.finderFor(inView)
    return finder.usable ? { set: inView, finder, signature } : undefined
  }

  /** Whether loop `outer` contains loop `inner` (they never cross). */
  private loopContains(outer: AcApHatchPolyline, inner: AcApHatchPolyline) {
    return (
      Math.abs(acapHatchSignedArea(outer)) >
        Math.abs(acapHatchSignedArea(inner)) &&
      acapHatchPointInPolygon(outer, inner[0])
    )
  }

  /**
   * Hatches the area enclosed around an internal point, like AutoCAD's
   * "pick internal point": the smallest closed area around the point, with
   * the islands inside it handled by the hatch style.
   *
   * @param context - Active command context.
   * @param point - The internal point.
   * @returns `true` when a hatch was created.
   */
  protected hatchAtPoint(
    context: AcApContext,
    point: { x: number; y: number }
  ) {
    const pick = this.pickBoundary(context)
    if (!pick) {
      this.warn('jig.hatch.tooComplex')
      return false
    }
    const found = pick.finder.boundaryAt(point)
    if (!found) {
      this.warn('jig.hatch.boundaryNotFound')
      return false
    }

    const area = Math.abs(acapHatchSignedArea(found.outer))
    const bounds = acapHatchBounds(found.outer)
    const slack = pick.set.outlineTol
    const picked = this._pickedAreas.some(
      p =>
        Math.abs(p.area - area) <= area * 1e-6 + slack * slack &&
        Math.abs(p.bounds.minX - bounds.minX) <= slack &&
        Math.abs(p.bounds.minY - bounds.minY) <= slack &&
        Math.abs(p.bounds.maxX - bounds.maxX) <= slack &&
        Math.abs(p.bounds.maxY - bounds.maxY) <= slack
    )
    if (picked) {
      this.warn('jig.hatch.alreadyHatched')
      return false
    }

    const style = this.settings.style
    let islands = found.islands
    if (style === AcDbHatchStyle.Ignore) {
      islands = []
    } else if (style === AcDbHatchStyle.Outer) {
      islands = islands.filter(
        island =>
          !islands.some(
            other =>
              other !== island &&
              this.loopContains(other.outline, island.outline)
          )
      )
    }

    const loops = [
      acapHatchLoopFor(pick.set, found.outer, found.outerSources),
      ...islands.map(island =>
        acapHatchLoopFor(pick.set, island.outline, island.sources)
      )
    ]
    if (!this.appendHatch(context, loops)) return false
    this._pickedAreas.push({ area, bounds })
    this.showMessage(
      islands.length
        ? AcApI18n.t('jig.hatch.boundaryFoundIslands').replace(
            '{count}',
            String(islands.length)
          )
        : AcApI18n.t('jig.hatch.boundaryFound')
    )
    return true
  }

  /**
   * Hatches the areas enclosed by selected objects, like AutoCAD's "select
   * objects": every closed object, or group of objects that closes an area
   * (four lines around a square), is a boundary; boundaries inside others are
   * islands handled by the hatch style.
   *
   * @param context - Active command context.
   * @param ids - Selected object ids.
   * @returns `true` when at least one hatch was created.
   */
  protected hatchSelectedObjects(
    context: AcApContext,
    ids: ReadonlyArray<AcDbObjectId>
  ) {
    const database = context.doc.database
    const modelSpace = database.tables.blockTable.modelSpace
    const entities: AcDbEntity[] = []
    ids.forEach(id => {
      const entity = modelSpace.getIdAt(id)
      if (entity) entities.push(entity)
    })
    const set = acapCollectHatchBoundarySet(database, entities, false)
    if (set.segmentCount > ACAP_HATCH_MAX_SEGMENTS) {
      this.warn('jig.hatch.tooComplex')
      return false
    }
    const finder = this.finderFor(set)
    if (set.polys.length && !finder.usable) {
      this.warn('jig.hatch.tooComplex')
      return false
    }
    const outlines = finder.closedOutlines()
    if (!outlines.length) {
      this.warn('jig.hatch.invalidBoundary')
      return false
    }

    // Nesting depth of every boundary: how many others contain it.
    const depth = outlines.map(
      (o, i) =>
        outlines.filter(
          (p, j) => j !== i && this.loopContains(p.outline, o.outline)
        ).length
    )
    const style = this.settings.style
    const maxDepth =
      style === AcDbHatchStyle.Ignore
        ? 0
        : style === AcDbHatchStyle.Outer
          ? 1
          : Infinity
    let created = 0
    outlines.forEach((top, i) => {
      if (depth[i] !== 0) return
      const loops = [acapHatchLoopFor(set, top.outline, top.sources)]
      outlines.forEach((inner, j) => {
        if (depth[j] === 0 || depth[j] > maxDepth) return
        if (!this.loopContains(top.outline, inner.outline)) return
        loops.push(acapHatchLoopFor(set, inner.outline, inner.sources))
      })
      if (this.appendHatch(context, loops)) created++
    })

    const closedOwners = new Set(
      outlines.flatMap(o => o.sources.map(i => set.owners[i]))
    )
    const notClosed = entities.filter(e => !closedOwners.has(e)).length
    this.showMessage(
      AcApI18n.t('jig.hatch.selectFound').replace(
        '{count}',
        String(outlines.filter((_, i) => depth[i] <= maxDepth).length)
      )
    )
    if (notClosed > 0) {
      this.notify(
        AcApI18n.t('jig.hatch.selectNotClosed').replace(
          '{count}',
          String(notClosed)
        ),
        'warning'
      )
    }
    return created > 0
  }

  /**
   * Point prompt for internal points. Object snap is off: a snapped point
   * lands on a boundary line instead of inside the area.
   *
   * @param message - Prompt message.
   */
  protected createInternalPointOptions(message: string) {
    const options = new AcEdPromptPointOptions(message)
    options.disableOSnap = true
    return options
  }

  /**
   * Creates and appends one hatch entity from computed loops.
   *
   * @param context Active command context.
   * @param loops Boundary loops to be added to the hatch.
   * @returns `true` when hatch entity was created; otherwise `false`.
   */
  protected appendHatch(
    context: AcApContext,
    loops: ReadonlyArray<AcGeLoop2dType>
  ) {
    if (!loops.length) return false

    const hatch = new AcDbHatch()
    if (context.doc.database instanceof AcDbDatabase) {
      hatch.database = context.doc.database
    }
    const settings = this.getDatabaseSysVarSettings(context.doc.database)
    const patternName = this.normalizePatternName(settings.patternName)
    const isSolidFill = patternName === HATCH_PATTERN_SOLID
    hatch.patternName = patternName
    hatch.patternType = AcDbHatchPatternType.Predefined
    hatch.patternScale = settings.patternScale
    hatch.patternAngle = (settings.patternAngleDeg * Math.PI) / 180
    hatch.hatchStyle = settings.style
    hatch.isSolidFill = isSolidFill
    this.configureHatch(hatch)

    loops.forEach(loop => hatch.add(loop))
    context.doc.database.tables.blockTable.modelSpace.appendEntity(hatch)
    // Show it now: HATCH goes on picking boundaries until it is ended.
    context.view.addEntity(hatch)
    return true
  }

  /**
   * Allows specialized hatch commands to apply additional entity properties
   * before the hatch is added to model space.
   *
   * @param _hatch Hatch entity being created.
   */
  protected configureHatch(_hatch: AcDbHatch) {}

  /**
   * Prompts for pattern name and updates persisted command settings.
   *
   * @returns Promise resolved when prompt flow completes.
   */
  protected async promptPatternName() {
    const strOptions = new AcEdPromptStringOptions(
      AcApI18n.t('jig.hatch.patternName')
    )
    strOptions.allowEmpty = false
    const settings = this.getActiveSettings()
    strOptions.defaultValue = settings.patternName
    strOptions.useDefaultValue = true
    const result = await AcApDocManager.instance.editor.getString(strOptions)
    if (result.status !== AcEdPromptStatus.OK) return
    const patternName = this.normalizePatternName(
      result.stringResult ?? strOptions.defaultValue
    )
    this.settings.patternName = patternName
    this.setActiveSysVar(AcDbSystemVariables.HPNAME, patternName)
  }

  /**
   * Prompts for pattern scale and updates persisted command settings.
   *
   * @returns Promise resolved when prompt flow completes.
   */
  protected async promptPatternScale() {
    const options = new AcEdPromptDoubleOptions(AcApI18n.t('jig.hatch.scale'))
    options.allowNone = true
    options.allowNegative = false
    options.allowZero = false
    const settings = this.getActiveSettings()
    options.defaultValue = settings.patternScale
    options.useDefaultValue = true
    const result = await AcApDocManager.instance.editor.getDouble(options)
    if (result.status !== AcEdPromptStatus.OK) return
    const value = result.value ?? options.defaultValue
    if (value > 0) {
      this.settings.patternScale = value
      this.setActiveSysVar(AcDbSystemVariables.HPSCALE, value)
    }
  }

  /**
   * Prompts for pattern angle (degrees) and updates persisted settings.
   *
   * @returns Promise resolved when prompt flow completes.
   */
  protected async promptPatternAngle() {
    const options = new AcEdPromptDoubleOptions(AcApI18n.t('jig.hatch.angle'))
    options.allowNone = true
    options.allowNegative = true
    options.allowZero = true
    const settings = this.getActiveSettings()
    options.defaultValue = settings.patternAngleDeg
    options.useDefaultValue = true
    const result = await AcApDocManager.instance.editor.getDouble(options)
    if (result.status !== AcEdPromptStatus.OK) return
    const angleDeg = result.value ?? options.defaultValue
    this.settings.patternAngleDeg = angleDeg
    this.setActiveSysVar(AcDbSystemVariables.HPANG, (angleDeg * Math.PI) / 180)
  }

  /**
   * Prompts for hatch style (`Normal` / `Outer` / `Ignore`).
   *
   * @returns Promise resolved when prompt flow completes.
   */
  protected async promptStyle() {
    const settings = this.getActiveSettings()
    const current = this.styleToKeyword(settings.style)
    const options = new AcEdPromptKeywordOptions(AcApI18n.t('jig.hatch.style'))
    options.allowNone = true
    const normal = options.keywords.add(
      AcApI18n.t('jig.hatch.keywords.normal.display'),
      AcApI18n.t('jig.hatch.keywords.normal.global'),
      AcApI18n.t('jig.hatch.keywords.normal.local')
    )
    const outer = options.keywords.add(
      AcApI18n.t('jig.hatch.keywords.outer.display'),
      AcApI18n.t('jig.hatch.keywords.outer.global'),
      AcApI18n.t('jig.hatch.keywords.outer.local')
    )
    const ignore = options.keywords.add(
      AcApI18n.t('jig.hatch.keywords.ignore.display'),
      AcApI18n.t('jig.hatch.keywords.ignore.global'),
      AcApI18n.t('jig.hatch.keywords.ignore.local')
    )
    options.keywords.default =
      current === 'Outer' ? outer : current === 'Ignore' ? ignore : normal

    const result = await AcApDocManager.instance.editor.getKeywords(options)
    if (
      (result.status === AcEdPromptStatus.OK ||
        result.status === AcEdPromptStatus.Keyword) &&
      result.stringResult
    ) {
      this.settings.style = this.keywordToStyle(result.stringResult)
    }
  }

  /**
   * Prompts for associative mode switch (`Yes` / `No`).
   *
   * @returns Promise resolved when prompt flow completes.
   */
  protected async promptAssociative() {
    const settings = this.getActiveSettings()
    const options = new AcEdPromptKeywordOptions(
      AcApI18n.t('jig.hatch.associative')
    )
    options.allowNone = true
    const yes = options.keywords.add(
      AcApI18n.t('jig.hatch.keywords.yes.display'),
      AcApI18n.t('jig.hatch.keywords.yes.global'),
      AcApI18n.t('jig.hatch.keywords.yes.local')
    )
    const no = options.keywords.add(
      AcApI18n.t('jig.hatch.keywords.no.display'),
      AcApI18n.t('jig.hatch.keywords.no.global'),
      AcApI18n.t('jig.hatch.keywords.no.local')
    )
    options.keywords.default = settings.associative ? yes : no
    const result = await AcApDocManager.instance.editor.getKeywords(options)
    if (
      result.status === AcEdPromptStatus.OK ||
      result.status === AcEdPromptStatus.Keyword
    ) {
      const associative = result.stringResult === 'Yes'
      this.settings.associative = associative
      this.setActiveSysVar(AcDbSystemVariables.HPASSOC, associative ? 1 : 0)
    }
  }

  /**
   * Executes object-selection branch of HATCH.
   *
   * @param context Active command context.
   * @returns `true` if a hatch was created from selected objects.
   */
  protected async doSelectObjects(context: AcApContext) {
    const options = new AcEdPromptSelectionOptions(
      AcApI18n.t('jig.hatch.select')
    )
    options.allowObjectOnLockedLayer = true
    const result = await AcApDocManager.instance.editor.getSelection(options)
    if (result.status !== AcEdPromptStatus.OK || !result.value) return false
    return this.hatchSelectedObjects(context, result.value.ids)
  }

  /**
   * Executes pick-points branch of HATCH.
   *
   * The user can place multiple internal points. Each accepted point hatches
   * the area around it, and pressing Enter terminates this branch.
   *
   * @param context Active command context.
   * @returns `true` if at least one hatch was created.
   */
  protected async doPickPoints(context: AcApContext) {
    let created = false
    while (true) {
      const pointOptions = this.createInternalPointOptions(
        AcApI18n.t('jig.hatch.pickPoint')
      )
      pointOptions.allowNone = true
      const pointResult =
        await AcApDocManager.instance.editor.getPoint(pointOptions)
      if (pointResult.status !== AcEdPromptStatus.OK || !pointResult.value)
        break
      if (this.hatchAtPoint(context, pointResult.value)) {
        created = true
      }
    }

    return created
  }

  /**
   * Runs the interactive command-line HATCH workflow, like AutoCAD's -HATCH.
   *
   * Main loop behavior:
   * - Point: hatch the area around the internal point.
   * - Keyword branches: select objects, or option editing.
   * - Enter/Cancel: exits command.
   *
   * @param context Active command context.
   * @returns Promise resolved when command ends.
   */
  async execute(context: AcApContext) {
    this.resetBoundaryState()
    let running = true
    while (running) {
      const options = this.createInternalPointOptions(
        AcApI18n.t('jig.hatch.prompt')
      )
      options.allowNone = true
      options.keywords.add(
        AcApI18n.t('jig.hatch.keywords.select.display'),
        AcApI18n.t('jig.hatch.keywords.select.global'),
        AcApI18n.t('jig.hatch.keywords.select.local')
      )
      options.keywords.add(
        AcApI18n.t('jig.hatch.keywords.pattern.display'),
        AcApI18n.t('jig.hatch.keywords.pattern.global'),
        AcApI18n.t('jig.hatch.keywords.pattern.local')
      )
      options.keywords.add(
        AcApI18n.t('jig.hatch.keywords.scale.display'),
        AcApI18n.t('jig.hatch.keywords.scale.global'),
        AcApI18n.t('jig.hatch.keywords.scale.local')
      )
      options.keywords.add(
        AcApI18n.t('jig.hatch.keywords.angle.display'),
        AcApI18n.t('jig.hatch.keywords.angle.global'),
        AcApI18n.t('jig.hatch.keywords.angle.local')
      )
      options.keywords.add(
        AcApI18n.t('jig.hatch.keywords.style.display'),
        AcApI18n.t('jig.hatch.keywords.style.global'),
        AcApI18n.t('jig.hatch.keywords.style.local')
      )
      options.keywords.add(
        AcApI18n.t('jig.hatch.keywords.associative.display'),
        AcApI18n.t('jig.hatch.keywords.associative.global'),
        AcApI18n.t('jig.hatch.keywords.associative.local')
      )

      const result = await AcApDocManager.instance.editor.getPoint(options)
      if (result.status === AcEdPromptStatus.OK && result.value) {
        this.hatchAtPoint(context, result.value)
        continue
      }

      if (result.status === AcEdPromptStatus.Keyword) {
        const keyword = result.stringResult ?? ''
        if (keyword === 'SelectObjects') {
          await this.doSelectObjects(context)
        } else if (keyword === 'Pattern') {
          await this.promptPatternName()
        } else if (keyword === 'Scale') {
          await this.promptPatternScale()
        } else if (keyword === 'Angle') {
          await this.promptPatternAngle()
        } else if (keyword === 'HatchStyle') {
          await this.promptStyle()
        } else if (keyword === 'AssociativeMode') {
          await this.promptAssociative()
        }
        continue
      }

      running = false
    }
  }
}
