export default {
  command: {
    ACAD: {
      quit: {
        description: 'Exits the application and closes all open drawings'
      },
      exit: {
        description: 'Exits the application and closes all open drawings'
      }
    }
  },

  example: {
    fileUpload: {
      title: 'Select CAD File to View',
      subtitle: 'Import DWG, DXF, JWW / JWC (Jw_cad) or SXF drawings into the viewer',
      fontCdnNotice:
        'Japanese fonts (BIZ UD) are bundled with this viewer. Fonts for other scripts (Chinese, Korean, Latin substitutes, etc.) are downloaded from Google Fonts when a drawing needs them; if Google Fonts is unreachable, that text may not display correctly.',
      newDrawing: 'New Drawing',
      or: 'or',
      dropFile: 'Drop file or',
      browse: 'browse',

      openOptions: 'Open options',

      initialView: 'Initial view',
      auto: 'Auto',
      autoHint: 'Based on access mode',
      extents: 'Extents',
      extentsHint: 'Fit drawing',
      saved: 'Saved',
      savedHint: 'AutoCAD saved view',
      limits: 'Limits',
      limitsHint: 'Drawing limits / paper sheet',

      accessMode: 'Access mode',
      read: 'Read',
      readHint: 'View only',
      review: 'Comments',
      reviewHint: 'View & comment',
      write: 'Write',
      writeHint: 'Full access',

      textRendering: 'Text rendering',
      worker: 'Worker',
      workerHint: 'Faster, more memory',
      mainThread: 'Main thread',
      mainThreadHint: 'Slower, less memory',

      progressive: 'Progressive',
      progressiveRendering: 'Progressive rendering',
      on: 'On',
      progressiveOnHint:
        'Lock UI until parse/convert finish; then pan/zoom while scene loads',
      off: 'Off',
      progressiveOffHint: 'Wait until entities and text are fully converted',

      nonPlottable: 'Non-plottable',
      nonPlottableLayers: 'Non-plottable layers',
      hide: 'Hide',
      hideHint: 'Web viewer default',
      show: 'Show',
      showHint: 'AutoCAD editor semantics',

      curveQuality: 'Curve quality',
      curveDraft: 'Memory',
      curveDraftHint: 'Fewer vertices, smaller files',
      curveStandard: 'Standard',
      curveStandardHint: 'Balanced (100 sides per circle)',
      curveHigh: 'Quality',
      curveHighHint: 'Smoother curves, more memory',

      paperSpaceBackground: 'Paper background',
      paperSpaceWhite: 'White',
      paperSpaceWhiteHint: 'Desktop CAD / print preview',
      paperSpaceBlack: 'Black',
      paperSpaceBlackHint: 'Web viewer preference',

      export: 'Export',
      exportEnable: 'Enable',
      exportEnableHint: 'Allow DXF/HTML/PDF/SVG/PNG export',
      exportDisable: 'Disable',
      exportDisableHint: 'Hide export commands and File menu items',

      invalidFileType:
        'Invalid file type. Please upload DWG, DXF, JWW, JWC or SXF (SFC / P21 / SFZ / P2Z) files.'
    }
  }
}
