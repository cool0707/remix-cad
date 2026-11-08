import { reactive } from 'vue'

export const store = reactive({
  dialogs: {
    /**
     * The palette (layers, properties, ...) is always shown: it can only be
     * collapsed to its title bar, never closed.
     */
    layerManager: true,
    activePaletteTab: 'layerManager',
    /**
     * Task panels (find, measurements, ...) opened as closable tabs, in the
     * order they were opened. A panel shows as a tab only once something
     * opens it.
     */
    openTaskTabs: [] as string[],
    /** Sub-tab inside Missing / External Resources palette */
    activeMissingResourceTab: 'font' as 'font' | 'xref',
    /**
     * Dev-oriented Open Performance tab. Hidden until OPENPERF runs so it
     * does not clutter the palette for ordinary users.
     */
    openFileProfileTabVisible: false,
    /** Bumped by the FIND command so the Find palette focuses its query field. */
    findFocusTick: 0,
    /**
     * Query the Find palette searches for when it shows next (set by the
     * command palette's "all results" line). Cleared once used.
     */
    findQuery: ''
  },
  features: {
    /** Set when `@mlightcad/cad-agent-plugin` is installed and registered. */
    agentPlugin: false,
    /** Set when `@mlightcad/cad-script-plugin` is installed and registered. */
    scriptPlugin: false
  },
  /**
   * Bumped by the MEM command after publishing a fresh snapshot so an already
   * mounted Memory palette can pick it up without remounting.
   */
  memoryProfileTick: 0,
  /**
   * Bumped by the OPENPERF command after publishing the latest open profile.
   */
  openFileProfileTick: 0,
  /**
   * Pixels of the main area taken by the docked palette on each side. The
   * canvas is shrunk by these so the drawing is never hidden behind it.
   * All zero while the palette floats.
   */
  paletteDockInsets: { left: 0, right: 0, top: 0, bottom: 0 }
})
