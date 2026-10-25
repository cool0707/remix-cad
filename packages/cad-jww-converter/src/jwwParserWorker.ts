/// <reference lib="webworker" />
/**
 * Web Worker that parses JWW files with ezjww (WebAssembly) and returns DXF
 * text, and writes JWW files from exported drawings. Built as a standalone
 * bundle (`jww-parser-worker.js`).
 */
import * as ezjww from 'ezjww'

import { JWW_PARSER_WASM_FILE } from './constants'
import { writeJwwBytes } from './jwwExport'
import { convertJwwToDxf, cropJwwImages } from './jwwToDxf'
import type { JwwWorkerRequest, JwwWorkerResponse } from './jwwWorkerProtocol'

let ready: Promise<void> | undefined

function init(wasmUrl?: string) {
  if (!ready) {
    const url = new URL(wasmUrl ?? JWW_PARSER_WASM_FILE, self.location.href)
    ready = fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(
            `Failed to load ${url.href} (HTTP ${response.status})`
          )
        }
        return response.arrayBuffer()
      })
      .then(bytes => ezjww.initAsync(bytes))
    ready.catch(() => {
      ready = undefined
    })
  }
  return ready
}

self.onmessage = async (event: MessageEvent<JwwWorkerRequest>) => {
  const request = event.data
  const { id, wasmUrl } = request
  let response: JwwWorkerResponse
  let transfer: Transferable[] = []
  try {
    await init(wasmUrl)
    if (request.kind === 'write') {
      const result = writeJwwBytes(ezjww, request.drawing, request.options)
      self.postMessage({ id, ok: true, kind: 'write', ...result }, [
        result.bytes.buffer as ArrayBuffer
      ])
      return
    }
    const { data, scaleMode } = request
    const result = await cropJwwImages(
      convertJwwToDxf(ezjww, new Uint8Array(data), { scaleMode })
    )
    response = { id, ok: true, ...result }
    // An image left whole for a trim shares its buffer with the original.
    transfer = [
      ...new Set(result.images.map(image => image.data.buffer as ArrayBuffer))
    ]
  } catch (error) {
    response = {
      id,
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
  self.postMessage(response, transfer)
}
