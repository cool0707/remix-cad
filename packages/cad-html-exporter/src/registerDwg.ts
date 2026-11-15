import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'

import { AcDbAcadrustConverter } from '@mlightcad/cad-acadrust-converter'
import {
  type AcDbDatabaseConverter,
  AcDbDatabaseConverterManager,
  AcDbFileType
} from '@mlightcad/data-model'

/**
 * Which DWG parser {@link exportFileToHtml} registers for `AcDbFileType.DWG`.
 *
 * - `'acadrust'` — `@mlightcad/cad-acadrust-converter` (default; a dependency
 *   of this package). acadrust is MPL-2.0; nothing here is GPL.
 * - `'dwg'` — commercial `@mlightcad/dwg-converter` (not a declared dependency;
 *   install it yourself when you have registry access + license/trial).
 */
export type AcExDwgParser = 'acadrust' | 'dwg'

export interface AcExDwgParserRegisterOptions {
  /**
   * DWG parser to register. Defaults to `'acadrust'`.
   */
  dwgParser?: AcExDwgParser
  /**
   * Offline license key for `@mlightcad/dwg-converter`.
   * Omit to use that package's evaluation period when still active.
   * Ignored when {@link AcExDwgParserRegisterOptions.dwgParser} is `'acadrust'`.
   */
  dwgLicenseKey?: string
}

let registeredParser: AcExDwgParser | null = null
let registeredLicenseKey: string | undefined

/**
 * Registers the selected DWG parser on the Node main thread.
 *
 * Safe to call multiple times with the same parser (and same license key for
 * `'dwg'`). Switching parsers or license keys replaces the manager registration.
 */
export async function ensureDwgParserRegistered(
  options: AcExDwgParserRegisterOptions = {}
): Promise<void> {
  const parser: AcExDwgParser = options.dwgParser ?? 'acadrust'
  if (
    registeredParser === parser &&
    (parser !== 'dwg' || registeredLicenseKey === options.dwgLicenseKey)
  ) {
    return
  }

  if (parser === 'acadrust') {
    registerAcadrust()
    registeredLicenseKey = undefined
  } else {
    await registerCommercialDwg(options.dwgLicenseKey)
    registeredLicenseKey = options.dwgLicenseKey
  }
  registeredParser = parser
}

/**
 * Registers acadrust for DWG reads (same as
 * {@link ensureDwgParserRegistered} with `dwgParser: 'acadrust'`).
 */
export function ensureAcadrustRegistered(): void {
  if (registeredParser === 'acadrust') {
    return
  }
  registerAcadrust()
  registeredParser = 'acadrust'
  registeredLicenseKey = undefined
}

function registerAcadrust(): void {
  // No worker: the engine runs on this thread. Its JavaScript is bundled into
  // this package (so it shares this build's data-model); the WebAssembly is
  // read from the converter package installed next to it.
  const converter = new AcDbAcadrustConverter({
    useWorker: false,
    wasm: loadAcadrustWasm
  })
  AcDbDatabaseConverterManager.instance.register(AcDbFileType.DWG, converter)
}

async function loadAcadrustWasm(): Promise<Uint8Array> {
  const require = createRequire(import.meta.url)
  return readFile(
    require.resolve('@mlightcad/cad-acadrust-converter/acadrust-engine.wasm')
  )
}

async function registerCommercialDwg(licenseKey?: string): Promise<void> {
  let mod: typeof import('@mlightcad/dwg-converter')
  try {
    mod = await import('@mlightcad/dwg-converter')
  } catch (cause) {
    const detail = cause instanceof Error ? cause.message : String(cause)
    throw new Error(
      'DWG parser "dwg" requires the optional package @mlightcad/dwg-converter. ' +
        'Install it from GitHub Packages (or your private registry), or use ' +
        'dwgParser: "acadrust" (default). ' +
        `Import failed: ${detail}`
    )
  }

  try {
    const converter = new mod.AcDbDwgConverter({
      convertByEntityType: false,
      useWorker: false,
      licenseKey
    })
    // Ambient typings are intentionally minimal when the peer is absent.
    AcDbDatabaseConverterManager.instance.register(
      AcDbFileType.DWG,
      converter as unknown as AcDbDatabaseConverter
    )
  } catch (cause) {
    const detail = cause instanceof Error ? cause.message : String(cause)
    throw new Error(
      'Failed to initialize @mlightcad/dwg-converter. Provide a valid ' +
        'dwgLicenseKey, or wait until a trial is available, or use ' +
        'dwgParser: "acadrust". ' +
        `Detail: ${detail}`
    )
  }
}
