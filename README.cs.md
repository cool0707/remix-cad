# RemixCAD

[English](./README.md) | [日本語](./README.ja.md) | [简体中文](./README.zh-CN.md) | [한국어](./README.ko.md) | [Español](./README.es.md) | [Português](./README.pt.md) | [Русский](./README.ru.md) | [Čeština](./README.cs.md)

> **Toto je fork.** RemixCAD je fork projektu
> [mlightcad/cad-viewer](https://github.com/mlightcad/cad-viewer) (licence MIT).
> Je udržován nezávisle a **není spojen s autorem původního projektu ani jím
> podporován**. Problémy tohoto forku hlaste v
> [issues tohoto repozitáře](https://github.com/cool0707/remix-cad/issues),
> nikoli u původního projektu.

Prohlížeč a editor DXF/DWG, který běží celý v prohlížeči: načítání výkresů,
zpracování geometrie i vykreslování (Three.js / WebGL) probíhá na klientovi,
takže výkresy nikdy neopustí zařízení uživatele.

## Co tento fork přidává

- **Japonské rozhraní**: úplné národní prostředí `ja` pro všechny balíčky
  (prohlížeč, pás karet, příkazový řádek, dialogy, pluginy, porovnání výkresů,
  offline export do HTML). Jazyk se zjišťuje z prohlížeče.
- **Vlastní hostování písem bez CAD CDN**: písma a šablony výkresů poskytuje
  samotná aplikace (`resources/cad-data` → `./cad-data/`).
  - Text výkresů: přiložena písma **BIZ UD Gothic / Mincho**, která nahrazují
    MS Gothic / MS Mincho a slouží jako výchozí záložní písmo.
  - Ostatní písma se podle potřeby načítají z **Google Fonts**
    (Arial → Arimo, SimSun → Noto Serif SC, Malgun Gothic → Noto Sans KR, …).
  - Text rozhraní: **Noto Sans JP** (hostováno pomocí
    `@fontsource-variable/noto-sans-jp`).
- **Lokalizované názvy tiskových stránek** v nových výkresech místo čínských názvů ze šablony.
- **Srozumitelné pojmy i pro uživatele bez zkušeností s CAD** — rozhraní používá běžná slova:
  blok → symbol, atribut bloku → vlastnost symbolu, modelový prostor → plátno,
  rozvržení → tisková stránka, šrafování → vzorová výplň, externí reference → propojený výkres,
  rychlý výběr → výběr podle kritérií atd. Popisky nástrojů uvádějí CAD pojem v závorce (všechna národní prostředí).
- **Přesouvatelný panel nástrojů** — přetažením úchytu (⠿) panel přesunete kamkoli; nabídka ⋯ vedle něj
  ho přepne na svislý nebo vodorovný nebo vrátí na výchozí místo: k levému okraji plochy výkresu, nebo k pravému,
  když plovoucí panel (vrstvy apod.) zakrývá levý okraj. Pokud by ho panel zakryl, vrátí se tam sám. Podnabídky se otevírají směrem ke
  středu obrazovky a poloha se pamatuje.
- **Profily ovládání: Jednoduchý (výchozí) / CAD** — přepínají se tlačítkem ve stavovém řádku.
  Jednoduchý: kliknutí nahradí výběr (Shift + kliknutí přidá nebo odebere, kliknutí do prázdna výběr zruší),
  nástroje jednou klávesou (V Výběr / H Posun / L Úsečka / R Obdélník / T Text; posun tažením s podrženým mezerníkem),
  použitý nástroj ukazuje tvar kurzoru, popisek u kurzoru i stavový řádek, po každém kreslení se vrátí nástroj Výběr
  (úsečka je jedna; „Pokračovat v kreslení“ v Nastavení nástroj ponechá) a Esc funguje postupně
  (zrušit operaci → zpět na Výběr → zrušit výběr). CAD zachovává klasické ovládání (každé kliknutí přidá, úsečka pokračuje do Enter).
- **Dialog Nastavení** — Soubor → Nastavení nebo ozubené kolečko vedle výběru jazyka (také příkaz `OPTIONS`)
  otevře jedno okno pro profil ovládání, výběr, pokračování v kreslení a zobrazené prvky
  (motiv, pás karet, panel nástrojů, příkazový řádek, souřadnice, výběr jazyka, informace o objektu, statistiky).
- **Měřítko zobrazení** — stavový řádek ukazuje zobrazení jako měřítko výkresu (`1/100` = 1 mm na obrazovce ukazuje 100 mm výkresu,
  podle jednotek výkresu a 96 px na palec), s tlačítky −/+ a posuvníkem. Kliknutím zvolíte Zobrazit vše nebo 1/1 … 1/5000.
- **Panel vlastností** — karta Vlastnosti dělí hodnoty do skupin (Obecné, Umístění, Symbol…)
  a upravuje je přímo (jedna změna = jeden krok zpět). Při výběru více objektů ukazuje sekce Výběr
  X / Y / Š / V s 9bodovým referenčním bodem, počty podle typu (kliknutím ponecháte jen daný typ)
  a celkovou délku a plochu; rozdílné hodnoty se zobrazí jako „Různé“ a lze je nastavit najednou.
  Vlastnosti symbolu (atributy bloku) se upravují ve stejném panelu; při nahrazení kliknutím
  dvojklik na symbol přesune kurzor do jeho pole.
- **Import JWW / JWC (Jw_cad)** — ukázková aplikace otevírá soubory `.jww` a `.jwc` (starý formát) pomocí
  `@mlightcad/cad-jww-converter` (MIT; parser [ezjww](https://github.com/monozukuri-ai/ezjww),
  Rust → WebAssembly, ve Web Workeru). Souřadnice se převádějí z milimetrů na papíře na skutečné
  milimetry podle měřítka skupiny hladin a list se použije jako meze výkresu.
- **Import SXF** (japonský standard výměny dat CAD pro veřejné stavby) — ukázková aplikace otevírá `.sfc`,
  `.p21` a jejich ZIP verze `.sfz` / `.p2z` pomocí `@mlightcad/cad-sxf-converter` (MIT, TypeScript,
  převzato z [ezsxf](https://github.com/monozukuri-ai/ezsxf)). Dílčí výkresy se zobrazí ve skutečné velikosti
  hlavního pohledu a list se použije jako meze výkresu.
- **Export do JWW / SXF** — Soubor → Export uloží výkres jako JWW (Jw_cad), SXF SFC nebo SXF P21
  (příkazy `cjww`, `csfc`, `cp21`). Bloky, kóty a šrafy se rozloží; formát listu a měřítko se berou
  z limitů výkresu (výkresy načtené z JWW / SXF si je ponechají), jinak se zvolí automaticky
  (A3, nejmenší standardní měřítko, do kterého se výkres vejde).
  Před exportem se dialog zeptá na papír, orientaci a měřítko (výchozí Automaticky); export do DXF je zapíše jako
  limity výkresu a export do PDF umí vytisknout modelový prostor na daný papír v měřítku.
  Export do obrázku používá stejné volby (zobrazení, rozsah nebo papír a měřítko s rozlišením) a zapisuje PNG, JPEG,
  BMP nebo TIFF; výběr oblasti zůstává jako „Exportovat vybranou oblast jako obrázek“.
- **Svislé písmo (縦書き)** — text ve svislém písmu Windows (`@ＭＳ ゴシック`, např. 縦字 z Jw_cad)
  a TEXT se stylem s příznakem AutoCAD „svislý“ se píše shora dolů na obrazovce i v exportu
  SVG / PDF, s přibalenými písmy BIZ UD (`@mlightcad/cad-vertical-text`).

## Ukázka

- Online: <https://cool0707.github.io/remix-cad/>
- Lokálně:

  ```bash
  pnpm install
  pnpm demo:build   # sestaví všechny balíčky a vytvoří demo-dist/
  pnpm demo         # http://localhost:4300/
  ```

## Začínáme

Vyžaduje [Node.js](https://nodejs.org/) >= 24 a [pnpm](https://pnpm.io/) >= 10.

```bash
git clone https://github.com/cool0707/remix-cad.git
cd remix-cad
pnpm install
pnpm dev          # plnohodnotný prohlížeč
pnpm dev:simple   # jednoduchý prohlížeč
pnpm build
pnpm test
```

## Písma a zdroje

Vše, co prohlížeč za běhu stahuje, je v `resources/cad-data/` (viz
[README](./resources/cad-data/README.md)). Při vkládání balíčků předejte `baseUrl`
do `AcApDocManager` a záložní písma upravte volbami `defaultFonts` / `symbolFonts`.
Písma SHX nejsou přiložena; text, který je používá, se zobrazí písmem BIZ UD Gothic.

## Podpora DWG

DXF se načítá vestavěným parserem s licencí MIT. DWG je volitelně podporováno
přes `@mlightcad/libredwg-converter` založený na
[LibreDWG](https://github.com/LibreDWG/libredwg) s licencí **GPL-3.0**; před
distribucí zvažte důsledky GPL.

## Podpora JWW / JWC

`@mlightcad/cad-jww-converter` čte výkresy Jw_cad (`.jww` / `.jwc`): soubor zpracuje pomocí ezjww (MIT)
ve Web Workeru, převede jej na DXF a načte vestavěnou čtečkou DXF. Zaregistrujte jej a umístěte
`jww-parser-worker.js` a `jww-parser.wasm` (z `dist/` balíčku) do stejné složky:

```ts
import { registerJwwConverter } from '@mlightcad/cad-jww-converter'

registerJwwConverter('./assets/jww-parser-worker.js')
```

JWW ukládá souřadnice v milimetrech na papíře. Ve výchozím stavu se vše zvětší měřítkem hlavní
skupiny hladin (s nejvíce objekty), takže výkres vypadá jako v Jw_cad a hlavní výkres se měří ve
skutečných milimetrech. `scaleMode: 'layer-group'` použije měřítko každé skupiny a
`scaleMode: 'paper'` ponechá milimetry na papíře. Starý formát JWC se převádí stejně (neobsahuje písma, text se zobrazí jako ＭＳ ゴシック).
Obrázky vložené pomocí `^@BM` se zobrazí jako rastrové obrázky: obrázky uložené v souboru JWW se zobrazí přímo,
obrázky odkazující na externí soubory se zobrazí jako chybějící a soubor lze doplnit v prohlížeči.
Oříznutí obrázku se zatím nepoužije.

## Podpora SXF

`@mlightcad/cad-sxf-converter` čte výkresy SXF Ver.3.1: SFC (`.sfc`), P21 (`.p21`, AP202) a jejich ZIP verze
(`.sfz`, `.p2z`). Parser je napsán v TypeScriptu (bez WebAssembly) a zpracování prvků je převzato z ezsxf
(MIT). Výkres se rozloží na čáry, křivky, texty, výplně a šrafy a načte se vestavěnou čtečkou DXF.

```ts
import { registerSxfConverter } from '@mlightcad/cad-sxf-converter'

registerSxfConverter()
```

Souřadnice SXF jsou v milimetrech na papíře a dílčí výkresy se umisťují s měřítkem. Ve výchozím stavu se vše
zvětší měřítkem hlavního dílčího výkresu: list vypadá jako vytištěný a hlavní pohled se měří ve skutečných
milimetrech; `scaleMode: 'paper'` ponechá milimetry na papíře. Kružnice, oblouky a elipsy zůstávají
křivkami a text odpovídá rámečku SXF. Rastrové obrázky (obrazové atributy SXF 3.1) se zobrazí, pokud je soubor obrázku přibalen v `.sfz` / `.p2z`;
černobílý TIFF (G4) se převede pro prohlížeč, JPEG se použije beze změny. Samostatný `.sfc` / `.p21`
zobrazí rámeček obrázku jako chybějící obrázek. Atributové soubory (SAF) se nenačítají.

## Export do JWW / SXF

Nejprve `@mlightcad/cad-export-model` převede výkres na úsečky, oblouky / elipsy, jednořádkový text,
body a výplně ve skutečných milimetrech (bloky, kóty, odkazy, spliny a vzory šraf se rozloží) a určí
list (formát + měřítko). Poté zapisovače vytvoří:

| Formát | Zapisovač | Poznámky |
| --- | --- | --- |
| JWW | `AcDbJwwConverter.exportDatabase()` (zapisovač ezjww ve workeru parseru) | List A0–A4 (na šířku), všechny skupiny hladin v měřítku listu, hladiny `<skupina>-<hladina> …` se vrátí na své místo, barvy → pera 1–9, typy čar → typy čar Jw_cad, písma `@` → svislý text, výplně → solidy |
| SFC / P21 | `exportSxf(db, 'sfc' \| 'p21' \| 'sfz' \| 'p2z')` (TypeScript) | Jeden dílčí výkres (部分図) v měřítku listu; předdefinované a uživatelské barvy RGB, předdefinované typy a tloušťky čar; SFC v Shift_JIS, P21 jako graf AP202 (ověřeno pomocí ezsxf) |

```ts
import { registerJwwConverter } from '@mlightcad/cad-jww-converter'
import { exportSxf } from '@mlightcad/cad-sxf-converter'

const jww = registerJwwConverter('./assets/jww-parser-worker.js')
const { bytes } = await jww.exportDatabase(db, { title: 'plan' })
const sfc = exportSxf(db, 'sfc', { title: 'plan', paper: 'A1', scale: 100 })
```

Ukázková aplikace registruje obojí pomocí `acapRegisterDrawingExporter()` (`cad-simple-viewer`).
Rastrové obrázky se vkládají do JWW (do SXF zatím ne) a export do DWG není k dispozici (sestavení LibreDWG z npm
použité pro čtení má zápis vypnutý).

## Licence

[MIT](./LICENSE). Původní upozornění na autorská práva mlightcad je zachováno,
jak licence vyžaduje. Přiložená písma BIZ UD (© Morisawa Inc.) a Noto Sans JP
jsou licencována pod SIL Open Font License 1.1.
