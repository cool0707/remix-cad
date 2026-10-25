# RemixCAD

[English](./README.md) | [日本語](./README.ja.md) | [简体中文](./README.zh-CN.md) | [한국어](./README.ko.md) | [Español](./README.es.md) | [Português](./README.pt.md) | [Русский](./README.ru.md) | [Čeština](./README.cs.md)

> **Esto es un fork.** RemixCAD es un fork de
> [mlightcad/cad-viewer](https://github.com/mlightcad/cad-viewer) (licencia MIT).
> Se mantiene de forma independiente y **no está afiliado ni soportado por el
> autor original**. Informe de los problemas de este fork en
> [los issues de este repositorio](https://github.com/cool0707/remix-cad/issues),
> no en el proyecto original.

Visor y editor de DXF/DWG que funciona completamente en el navegador: el
análisis de los planos, el procesamiento geométrico y el renderizado
(Three.js / WebGL) se realizan en el cliente, por lo que los planos nunca salen
del dispositivo del usuario.

## Cambios de este fork

- **Interfaz en japonés**: locale `ja` completo para todos los paquetes (visor,
  cinta de opciones, línea de comandos, diálogos, plugins, visor de diferencias,
  exportación a HTML sin conexión). El idioma se detecta desde el navegador.
- **Fuentes autoalojadas, sin CDN de CAD**: las fuentes y plantillas se sirven
  desde la propia aplicación (`resources/cad-data` → `./cad-data/`).
  - Texto de los planos: se incluyen **BIZ UD Gothic / Mincho**, usadas para
    MS Gothic / MS Mincho y como fuente de respaldo predeterminada.
  - Otros sistemas de escritura se cargan bajo demanda desde **Google Fonts**
    (Arial → Arimo, SimSun → Noto Serif SC, Malgun Gothic → Noto Sans KR, …).
  - Texto de la interfaz: **Noto Sans JP** (autoalojada con
    `@fontsource-variable/noto-sans-jp`).
- **Nombres de páginas de impresión localizados** en los planos nuevos, en lugar de
  los nombres en chino de la plantilla.
- **Términos sencillos para quien no usa CAD** — la interfaz usa palabras cotidianas: bloque → símbolo,
  atributo de bloque → propiedad del símbolo, espacio modelo → lienzo, presentación → página de impresión,
  sombreado → relleno de patrón, referencia externa → plano vinculado, selección rápida → seleccionar por criterios, etc.
  Las descripciones emergentes mantienen el término CAD entre paréntesis (todos los idiomas).
- **Barra de herramientas movible** — arrastra el asa (⠿) para moverla a cualquier lugar; el menú ⋯ junto a
  ella la cambia entre vertical y horizontal o la devuelve a su posición inicial: el borde izquierdo del área
  de dibujo, o el derecho cuando el panel flotante (capas, etc.) tapa la izquierda. Si el panel la tapa, vuelve allí sola. Los
  submenús se abren hacia el centro de la pantalla y la posición se recuerda.
- **Perfiles de uso: Simple (predeterminado) / CAD** — un botón de la barra de estado los alterna.
  Simple: un clic reemplaza la selección (Mayús + clic añade o quita, un clic en vacío la borra),
  herramientas de una tecla (V Seleccionar / H Desplazar / L Línea / R Rectángulo / T Texto; mantén Espacio y arrastra para desplazar),
  la herramienta en uso se ve en la forma del cursor, junto al cursor y en la barra de estado, se vuelve a Seleccionar
  después de cada dibujo (una línea es un segmento; «Seguir dibujando» en Ajustes mantiene la herramienta)
  y Esc actúa por etapas (cancelar la operación → volver a Seleccionar → borrar la selección).
  CAD conserva el manejo clásico (cada clic añade, LÍNEA sigue hasta Intro).
- **Edición directa (Simple)** — la selección muestra un marco: arrastre una esquina para escalar (mantiene la proporción, Alt desde el centro)
  o justo fuera de una esquina para girar (Mayús: pasos de 15°). Arrastre un objeto seleccionado para moverlo (Alt + arrastrar copia, Mayús lo
  limita a horizontal o vertical); el punto agarrado se ajusta a las referencias a objetos y, si no hay ninguna, los bordes y centros se alinean con
  objetos cercanos (guías de alineación). Las flechas desplazan la selección un paso redondo de aproximadamente un píxel (Mayús: ×10). Doble clic en
  un objeto para editar sus vértices con los pinzamientos de CAD. El ajuste es un único botón de activar/desactivar en la barra de estado; los modos están en Configuración.
- **Diálogo de ajustes** — Archivo → Ajustes, o el engranaje junto al selector de idioma (también el comando `OPTIONS`),
  abre un único diálogo para el perfil de uso, la selección, seguir dibujando y lo que se muestra
  (tema, cinta, barra de herramientas, línea de comandos, coordenadas, selector de idioma, información del objeto, estadísticas).
- **Escala de visualización** — la barra de estado muestra la vista como escala de plano (`1/100` = 1 mm en pantalla muestra 100 mm del plano,
  según las unidades del dibujo y 96 px por pulgada), con botones −/+ y un control deslizante. Al hacer clic se elige Mostrar todo o 1/1 … 1/5000.
- **Inspector de propiedades** — la pestaña Propiedades agrupa los valores en secciones (General,
  Ubicación, Símbolo…) y los edita directamente (un paso de deshacer por cambio). Con varios objetos
  seleccionados, una sección Selección muestra X / Y / An / Al con un punto de referencia de 9 posiciones,
  el número de objetos por tipo (clic para quedarse solo con ese tipo) y la longitud y el área totales;
  los valores distintos aparecen como «Mixto» y se pueden cambiar a la vez. Las propiedades de símbolo
  (atributos de bloque) se editan en el mismo panel; al reemplazar con clic, un doble clic en un símbolo
  lleva a su campo.
- **Importación de JWW / JWC (Jw_cad)** — la app de ejemplo abre archivos `.jww` y `.jwc` (formato antiguo) con
  `@mlightcad/cad-jww-converter` (MIT; analizador [ezjww](https://github.com/monozukuri-ai/ezjww),
  Rust → WebAssembly, en un Web Worker). Las coordenadas pasan de milímetros de papel a
  milímetros reales con la escala del grupo de capas y la hoja se usa como límites del dibujo.
- **Importación de SXF** (estándar japonés de intercambio CAD para obra pública) — la app de ejemplo abre
  `.sfc`, `.p21` y sus versiones ZIP `.sfz` / `.p2z` con `@mlightcad/cad-sxf-converter` (MIT, TypeScript,
  portado de [ezsxf](https://github.com/monozukuri-ai/ezsxf)). Los dibujos parciales se muestran a tamaño
  real de la vista principal y la hoja se usa como límites del dibujo.
- **Exportación a JWW / SXF** — Archivo → Exportar guarda el dibujo como JWW (Jw_cad), SXF SFC o
  SXF P21 (comandos `cjww`, `csfc`, `cp21`). Los bloques, cotas y sombreados se descomponen; el
  formato de hoja y la escala salen de los límites del dibujo (los dibujos leídos de JWW / SXF
  conservan los suyos) o se eligen automáticamente (A3, la menor escala normalizada que cabe).
  Antes de exportar, un diálogo pregunta la hoja, la orientación y la escala (Auto por defecto); la exportación a DXF
  la escribe como límites del dibujo y la exportación a PDF puede imprimir el espacio modelo en una hoja a escala.
  Exportar a imagen usa el mismo encuadre (vista, extensión u hoja y escala con ppp) y escribe PNG, JPEG, BMP o TIFF;
  la exportación de una ventana elegida sigue disponible aparte.
- **Escritura vertical (縦書き)** — el texto con una fuente vertical de Windows (`@ＭＳ ゴシック`,
  p. ej. el 縦字 de Jw_cad) y el TEXT cuyo estilo tiene el indicador «vertical» de AutoCAD se
  escriben de arriba abajo en pantalla y al exportar a SVG / PDF, con las fuentes BIZ UD
  incluidas (`@mlightcad/cad-vertical-text`).

## Demo

- En línea: <https://cool0707.github.io/remix-cad/>
- Local:

  ```bash
  pnpm install
  pnpm demo:build   # compila todos los paquetes y genera demo-dist/
  pnpm demo         # http://localhost:4300/
  ```

## Primeros pasos

Requiere [Node.js](https://nodejs.org/) >= 24 y [pnpm](https://pnpm.io/) >= 10.

```bash
git clone https://github.com/cool0707/remix-cad.git
cd remix-cad
pnpm install
pnpm dev          # visor completo
pnpm dev:simple   # visor simple
pnpm build
pnpm test
```

## Fuentes y recursos

Todo lo que el visor descarga en tiempo de ejecución está en `resources/cad-data/`
(consulte su [README](./resources/cad-data/README.md)). Al integrar los paquetes,
pase `baseUrl` a `AcApDocManager` y ajuste las fuentes de respaldo con las
opciones `defaultFonts` / `symbolFonts`. Las fuentes SHX no se incluyen; el texto
que las usa se muestra con BIZ UD Gothic.

## Soporte DWG

DXF se lee con el analizador MIT integrado. DWG es opcional mediante
`@mlightcad/libredwg-converter`, basado en
[LibreDWG](https://github.com/LibreDWG/libredwg) y con licencia **GPL-3.0**;
revise las implicaciones de la GPL antes de distribuirlo.

## Soporte JWW / JWC

`@mlightcad/cad-jww-converter` lee dibujos de Jw_cad (`.jww` / `.jwc`): los analiza con ezjww (MIT) en un
Web Worker, los convierte a DXF y los carga con el lector DXF integrado. Regístrelo y publique
`jww-parser-worker.js` y `jww-parser.wasm` (en `dist/` del paquete) en la misma carpeta:

```ts
import { registerJwwConverter } from '@mlightcad/cad-jww-converter'

registerJwwConverter('./assets/jww-parser-worker.js')
```

JWW guarda las coordenadas en milímetros de papel. Por defecto todo se escala con la escala del
grupo de capas principal (el que tiene más entidades), de modo que el dibujo se ve como en
Jw_cad y el dibujo principal se mide en milímetros reales. `scaleMode: 'layer-group'` usa la
escala de cada grupo y `scaleMode: 'paper'` conserva los milímetros de papel. El formato antiguo
JWC se convierte igual (no guarda fuentes, así que el texto usa ＭＳ ゴシック).
Las imágenes colocadas con `^@BM` se muestran como imágenes raster: las incrustadas en el JWW se ven
directamente y las que apuntan a archivos externos aparecen como imágenes faltantes que puede indicar desde
el visor. El recorte de imágenes aún no se aplica.

## Soporte SXF

`@mlightcad/cad-sxf-converter` lee dibujos SXF Ver.3.1: SFC (`.sfc`), P21 (`.p21`, AP202) y sus versiones
ZIP (`.sfz`, `.p2z`). El analizador está escrito en TypeScript (sin WebAssembly) y el tratamiento de las
entidades está portado de ezsxf (MIT). El dibujo se convierte en líneas, curvas, textos, rellenos y
sombreados y se carga con el lector DXF integrado.

```ts
import { registerSxfConverter } from '@mlightcad/cad-sxf-converter'

registerSxfConverter()
```

Las coordenadas SXF están en milímetros de papel y los dibujos parciales se colocan con una escala. Por
defecto todo se escala con la escala del dibujo parcial principal: la hoja se ve como impresa y la vista
principal se mide en milímetros reales; `scaleMode: 'paper'` conserva los milímetros de papel. Círculos,
arcos y elipses siguen siendo curvas y el texto se ajusta a su caja SXF. Las imágenes raster (atributos de
imagen de SXF 3.1) se muestran si el archivo de imagen va incluido en el `.sfz` / `.p2z`; el TIFF monocromo
(G4) se convierte para el navegador y el JPEG se usa tal cual. Un `.sfc` / `.p21` suelto muestra el marco de
la imagen como imagen faltante. No se cargan los archivos de atributos (SAF).

## Exportación a JWW / SXF

Primero `@mlightcad/cad-export-model` convierte el dibujo en líneas, arcos / elipses, texto de una
línea, puntos y rellenos en milímetros reales (bloques, cotas, directrices, splines y patrones de
sombreado se descomponen) y determina la hoja (formato + escala). Después los escritores generan:

| Formato | Escritor | Notas |
| --- | --- | --- |
| JWW | `AcDbJwwConverter.exportDatabase()` (escritor de ezjww, en el worker del analizador) | Hoja A0–A4 (horizontal), todos los grupos de capas a la escala de la hoja, las capas `<grupo>-<capa> …` vuelven a su posición, colores → plumas 1–9, tipos de línea → tipos de Jw_cad, fuentes `@` → texto vertical, rellenos → sólidos |
| SFC / P21 | `exportSxf(db, 'sfc' \| 'p21' \| 'sfz' \| 'p2z')` (TypeScript) | Un dibujo parcial (部分図) a la escala de la hoja; colores predefinidos y RGB de usuario, tipos y grosores de línea predefinidos; SFC en Shift_JIS, P21 como grafo AP202 (verificado con ezsxf) |

```ts
import { registerJwwConverter } from '@mlightcad/cad-jww-converter'
import { exportSxf } from '@mlightcad/cad-sxf-converter'

const jww = registerJwwConverter('./assets/jww-parser-worker.js')
const { bytes } = await jww.exportDatabase(db, { title: 'plan' })
const sfc = exportSxf(db, 'sfc', { title: 'plan', paper: 'A1', scale: 100 })
```

La aplicación de ejemplo registra ambos con `acapRegisterDrawingExporter()` (`cad-simple-viewer`).
Las imágenes ráster se incrustan en JWW (aún no en SXF) y la exportación a DWG no está disponible (la compilación
npm de LibreDWG usada para leer tiene la escritura desactivada).

## Licencia

[MIT](./LICENSE). Se conserva el aviso de copyright original de mlightcad, tal
como exige la licencia. Las fuentes incluidas BIZ UD (© Morisawa Inc.) y
Noto Sans JP usan la SIL Open Font License 1.1.
