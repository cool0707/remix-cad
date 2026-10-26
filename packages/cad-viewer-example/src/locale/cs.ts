export default {
  command: {
    ACAD: {
      quit: {
        description: 'Ukončí aplikaci a zavře všechny otevřené výkresy'
      },
      exit: {
        description: 'Ukončí aplikaci a zavře všechny otevřené výkresy'
      }
    }
  },

  example: {
    fileUpload: {
      title: 'Vyberte soubor CAD k zobrazení',
      subtitle: 'Importujte výkresy DWG, DXF, JWW / JWC (Jw_cad) nebo SXF do prohlížeče',
      fontCdnNotice:
        'Japanese fonts (BIZ UD) are bundled with this viewer. Fonts for other scripts (Chinese, Korean, Latin substitutes, etc.) are downloaded from Google Fonts when a drawing needs them; if Google Fonts is unreachable, that text may not display correctly.',
      newDrawing: 'Nový výkres',
      or: 'nebo',
      dropFile: 'Přetáhněte soubor nebo',
      browse: 'procházet',

      openOptions: 'Možnosti otevření',

      initialView: 'Počáteční pohled',
      auto: 'Automaticky',
      autoHint: 'Podle režimu přístupu',
      extents: 'Rozsah',
      extentsHint: 'Přizpůsobit výkres',
      saved: 'Uložený',
      savedHint: 'Uložený pohled AutoCADu',
      limits: 'Meze',
      limitsHint: 'Meze výkresu / papír',

      accessMode: 'Režim přístupu',
      read: 'Čtení',
      readHint: 'Pouze zobrazení',
      review: 'Komentáře',
      reviewHint: 'Zobrazení a komentáře',
      write: 'Zápis',
      writeHint: 'Plný přístup',

      textRendering: 'Vykreslování textu',
      worker: 'Worker',
      workerHint: 'Rychlejší, více paměti',
      mainThread: 'Hlavní vlákno',
      mainThreadHint: 'Pomalejší, méně paměti',

      progressive: 'Průběžné',
      progressiveRendering: 'Průběžné vykreslování',
      on: 'Zapnuto',
      progressiveOnHint:
        'Zamknout UI do dokončení parse/převodu; poté pan/zoom při načítání scény',
      off: 'Vypnuto',
      progressiveOffHint: 'Čekat na dokončení převodu entit i textu',

      nonPlottable: 'Netisknutelné',
      nonPlottableLayers: 'Netisknutelné hladiny',
      hide: 'Skrýt',
      hideHint: 'Výchozí pro webový prohlížeč',
      show: 'Zobrazit',
      showHint: 'Chování editoru AutoCAD',

      curveQuality: 'Kvalita křivek',
      curveDraft: 'Paměť',
      curveDraftHint: 'Méně vrcholů, menší soubory',
      curveStandard: 'Standardní',
      curveStandardHint: 'Vyvážené (100 stran na kružnici)',
      curveHigh: 'Kvalita',
      curveHighHint: 'Hladší křivky, více paměti',

      paperSpaceBackground: 'Pozadí papíru',
      paperSpaceWhite: 'Bílé',
      paperSpaceWhiteHint: 'Desktop CAD / náhled tisku',
      paperSpaceBlack: 'Černé',
      paperSpaceBlackHint: 'Preferované pro webový prohlížeč',

      export: 'Export',
      exportEnable: 'Povolit',
      exportEnableHint: 'Povolit export DXF/HTML/PDF/SVG/PNG',
      exportDisable: 'Zakázat',
      exportDisableHint: 'Skrýt příkazy exportu a položky nabídky File',

      invalidFileType:
        'Neplatný typ souboru. Nahrajte soubory DWG, DXF, JWW, JWC nebo SXF (SFC / P21 / SFZ / P2Z).'
    }
  }
}
