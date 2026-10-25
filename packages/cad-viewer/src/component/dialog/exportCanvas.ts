/** How the model (canvas) is framed by the PDF and image exports. */
export type MlExportCanvasFit = 'display' | 'extents' | 'sheet'

/** Choice cards for {@link MlExportCanvasFit}, shared by the export dialogs. */
export function canvasFitOptions(t: (key: string) => string) {
  return [
    {
      value: 'display' as const,
      title: t('dialog.exportPdfDlg.modelSpaceDisplay'),
      hint: t('dialog.exportPdfDlg.modelSpaceDisplayHint')
    },
    {
      value: 'extents' as const,
      title: t('dialog.exportPdfDlg.modelSpaceExtents'),
      hint: t('dialog.exportPdfDlg.modelSpaceExtentsHint')
    },
    {
      value: 'sheet' as const,
      title: t('dialog.exportPdfDlg.modelSpaceSheet'),
      hint: t('dialog.exportPdfDlg.modelSpaceSheetHint')
    }
  ]
}
