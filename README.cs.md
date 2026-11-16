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
- **Karty tiskových stránek jako v desktopovém CAD** — tlačítko **+** vedle karet přidá tiskovou stránku; pravým
  kliknutím (nebo dlouhým stiskem) na kartu ji lze přejmenovat (také dvojklikem), nastavit vzhled stránky
  (papír A0–A4, na výšku / na šířku), zkopírovat nebo odstranit; karty se řadí přetažením. Tiskové stránky vždy zašedí vše mimo papír.
- **Srozumitelné pojmy i pro uživatele bez zkušeností s CAD** — rozhraní používá běžná slova:
  blok → symbol, atribut bloku → vlastnost symbolu, modelový prostor → plátno,
  rozvržení → tisková stránka, šrafování → vzorová výplň, externí reference → propojený výkres,
  rychlý výběr → výběr podle kritérií atd. Popisky nástrojů uvádějí CAD pojem v závorce (všechna národní prostředí).
- **Přetahování souborů** — přetažením výkresu (DWG, DXF, JWW, JWC, SXF) do prohlížeče jej otevřete.
  Přetažený obrázek (PNG, JPEG, BMP, GIF, TIFF) se vloží do otevřeného výkresu na místo puštění ve velikosti podle pohledu (lze vrátit).
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
- **Přímé úpravy (Jednoduchý)** — výběr dostane rámeček: tažením rohu se mění velikost (se zachováním poměru stran, Alt od středu),
  tažením těsně vně rohu se otáčí (Shift: po 15°). Tažením vybraného objektu jej přesunete (Alt + tažení kopíruje, Shift jen vodorovně nebo svisle);
  uchopený bod se přichytí k uchopení objektů, jinak se okraje a středy zarovnají s okolními objekty (vodítka zarovnání). Šipky posunou výběr o zaokrouhlený
  krok přibližně jednoho pixelu obrazovky (Shift: ×10). Dvojklikem na objekt upravíte jeho vrcholy uzlovými body CAD. Uchopení je jedno tlačítko zapnout/vypnout
  ve stavovém řádku; režimy uchopení jsou v Nastavení.
  Objekty, které lze vybrat, se pod kurzorem zvýrazní barvou motivu (v obou profilech); nad vybraným objektem kurzor ukazuje, že jej lze přetáhnout.
- **Nástroje úprav** — Zrcadlit, Pole (obdélníkové / kruhové), Oříznout, Prodloužit, Zaoblit, Zkosit, Přerušit, Protáhnout a Měřítko.
  Oříznout a Prodloužit pracují v „rychlém“ režimu (hranicí jsou všechny ostatní objekty) a každý krok lze vrátit zvlášť.
  Najdete je ve skupině Upravit na pásu karet (CAD) a v nabídce Upravit levého panelu nástrojů (Jednoduchý).
- **Místní nabídka** — pravým tlačítkem na výkresu se otevře nabídka jen s tím, co lze právě udělat (Jednoduchý i CAD).
  S výběrem: vyjmout, kopírovat, vložit, duplikovat, odstranit, vybrat stejnou hladinu, zobrazit vlastnosti; bez výběru: opakovat poslední příkaz,
  vytvořit (úsečka, křivka, obdélník, kružnice…), symbol, komentář (text, obláček…), vložit, vybrat vše, zobrazit vše, zpět / znovu.
  V Jednoduchém režimu pravé tlačítko na nevybraném objektu ho nejdřív vybere. Při kreslení v Jednoduchém režimu je nabídka Hotovo / Zpět
  (poslední bod, pokud to příkaz umožňuje) / Zrušit (CAD ponechává pravé tlačítko = Enter). Ctrl+X / C / V / D / A (⌘ na Macu) vyjímají,
  kopírují, vkládají (na kurzor), duplikují a vybírají vše.
- **Paleta příkazů (Ctrl+K / ⌘K)** — příkazy hledejte běžným názvem, pojmem z CADu („blok“, „šrafa“, „externí reference“) nebo názvem / zkratkou
  příkazu (`LINE`, `L`) a spusťte je; najdete i úpravy z místní nabídky (kopírovat, vybrat vše…) a hladiny (výběrem se stane aktuální).
  U výsledků jsou klávesové zkratky. Otevře se i vyhledávacím polem horní lišty (jednoduchý profil) nebo tlačítkem **Hledat** ve stavovém řádku (CAD). V profilu Jednoduchý je příkazový řádek skrytý
  a objeví se jen tehdy, když příkaz žádá o výběr možnosti (v Možnostech jej lze opět trvale zobrazit).
- **Horní lišta a boční panel (jednoduchý profil)** — jednoduchý profil místo pásu karet zobrazuje tenkou horní lištu
  (nabídka ≡, název souboru, zpět / znovu, vyhledávací pole, tisk, export). Vyhledávací pole (Ctrl+K / Ctrl+F) najde příkazy,
  hladiny i text ve výkresu; „Zobrazit všechny výsledky“ je vypíše v panelu Hledat. Volby úprav textu a tvorby šrafy se nad
  výkresem zobrazí jen během práce s nimi. Boční panel má hladiny ve vlastní sekci pod vlastnostmi (sbalená sekce ukazuje
  aktuální hladinu); Hledat, Měření a další panely se objeví jako zavíratelné karty až po otevření. Hladiny lze vrátit
  do karet (výchozí v profilu CAD); každý profil si rozvržení pamatuje.
- **Dialog Nastavení** — Soubor → Nastavení nebo ozubené kolečko vedle výběru jazyka (také příkaz `OPTIONS`)
  otevře jedno okno pro profil ovládání, výběr, pokračování v kreslení a zobrazené prvky
  (motiv, pás karet, panel nástrojů, příkazový řádek, souřadnice, výběr jazyka, informace o objektu, statistiky).
- **Skupiny** — vyberte objekty a v místní nabídce zvolte Seskupit (Ctrl+G / ⌘G): kliknutí na kterýkoli z nich pak vybere a přesune celou skupinu.
  Oddíl hladin v bočním panelu má karty Hladiny a Skupiny; karta Skupiny zobrazuje skupiny jako strom (skupina → vnořené skupiny → objekty).
  Kliknutím na řádek vyberete jeho objekty, dvojklikem je přiblížíte; skupinu lze přejmenovat, zrušit (Ctrl+Shift+G), přidat do ní výběr nebo z ní objekt odebrat.
  Po vypnutí výběru skupin se objekty vybírají jednotlivě. Skupiny se ukládají jako objekty GROUP v DXF / DWG a skupiny z AutoCADu a jiných CAD se načtou i s názvy.
- **Najít stejný tvar** — vyberte tvar (symbol nebo více objektů) a pravým tlačítkem → Najít stejný tvar… (také přes Ctrl+K):
  panel vypíše všechna další místa, kde je stejný tvar nakreslen: stejný symbol vložený jinde, **rozložené symboly i obyčejné kopie**
  (křivka se počítá stejně jako čáry, ze kterých se skládá). Lze zvolit, zda se počítají otočené, zrcadlené a jinak velké kopie.
  Kliknutím na řádek se místo vybere a přiblíží, Vybrat vše vybere všechna, Nahradit symbolem změní volné kopie zpět na vložení symbolu
  (jeden krok zpět; pokud tvar ještě není symbol, vytvoří se nový). Hodnoty vlastností, které rozložení zanechalo jako text, se vrátí do vlastností.
- **Tisková oblast** — tlačítko ve stavovém řádku vedle „Zobrazit tloušťky čar“ zašedí plátno mimo papír, na který se výkres tiskne / exportuje
  (meze výkresu, jinak A3 ve standardním měřítku), jako artboard v Illustratoru, a označí ho (např. `A3 1:100`).
- **Měřítko zobrazení** — stavový řádek ukazuje zobrazení jako měřítko výkresu (`1/100` = 1 mm na obrazovce ukazuje 100 mm výkresu,
  podle jednotek výkresu a 96 px na palec), s tlačítky −/+ a posuvníkem. Kliknutím zvolíte Zobrazit vše nebo 1/1 … 1/5000.
- **Panel vlastností** — karta Vlastnosti dělí hodnoty do skupin (Obecné, Umístění, Symbol…)
  a upravuje je přímo (jedna změna = jeden krok zpět). Při výběru více objektů ukazuje sekce Výběr
  X / Y / Š / V s 9bodovým referenčním bodem, počty podle typu (kliknutím ponecháte jen daný typ)
  a celkovou délku a plochu; rozdílné hodnoty se zobrazí jako „Různé“ a lze je nastavit najednou.
  Vlastnosti symbolu (atributy bloku) se upravují ve stejném panelu; při nahrazení kliknutím
  dvojklik na text vlastnosti přesune kurzor do jejího pole.
- **Úpravy symbolů na místě** — v Jednoduchém režimu dvojklik na symbol (blok) vstoupí dovnitř a jeho obsah lze
  upravit běžnými nástroji; vše ostatní se ztlumí a nahoře se zobrazí cesta (Plátno › název symbolu).
  **Hotovo**, Esc nebo dvojklik mimo obsah úpravy ukončí a aktualizuje všechny kopie symbolu; celá návštěva je
  jeden krok zpět. Do symbolů uvnitř symbolů se vstupuje stejně a **Přidat vlastnost** přidá vlastnost všem
  kopiím. Hladina 0 se zobrazuje jako **hladina pro úpravy symbolů** (tvary v ní přebírají hladinu, do které je
  symbol vložen): v seznamu je jen během úprav symbolu, nebo s varováním, pokud výkres už v ní má tvary mimo
  symboly; při kreslení na plátno se přepne na jinou hladinu (nový výkres dostane „Hladina1“).
- **Import JWW / JWC (Jw_cad)** — ukázková aplikace otevírá soubory `.jww` a `.jwc` (starý formát) pomocí
  `@mlightcad/cad-jww-converter` (MIT; parser [ezjww](https://github.com/monozukuri-ai/ezjww),
  Rust → WebAssembly, ve Web Workeru). Souřadnice se převádějí z milimetrů na papíře na skutečné
  milimetry podle měřítka skupiny hladin a list se použije jako meze výkresu.
- **Import SXF** (japonský standard výměny dat CAD pro veřejné stavby) — ukázková aplikace otevírá `.sfc`,
  `.p21` a jejich ZIP verze `.sfz` / `.p2z` pomocí `@mlightcad/cad-sxf-converter` (MIT, TypeScript,
  převzato z [ezsxf](https://github.com/monozukuri-ai/ezsxf)). Dílčí výkresy se zobrazí ve skutečné velikosti
  hlavního pohledu a list se použije jako meze výkresu.
- **DWG bez GPL a export do DWG** — DWG čte i zapisuje
  [acadrust](https://github.com/hakanaktt/acadrust) (Rust, MPL-2.0) přeložený do WebAssembly a
  spuštěný ve Web Workeru; převodník LibreDWG (GPL) byl odstraněn. Soubor → Export uloží DWG
  (2000–2018, příkaz `cdwg`) a DXF v jiných verzích (R12).
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

DXF se načítá vestavěným čtecím modulem s licencí MIT. DWG čte i zapisuje
`@mlightcad/cad-acadrust-converter`, který spouští
[acadrust](https://github.com/hakanaktt/acadrust) (Rust, **MPL-2.0**) jako
WebAssembly ve Web Workeru. **Žádná závislost není pod GPL** – převodník
založený na LibreDWG byl odstraněn. Export podporuje DWG (2000–2018) a DXF
v jiných verzích (R12, binární).

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

Ukázková aplikace registruje JWW, SXF a DWG pomocí `acapRegisterDrawingExporter()` (`cad-simple-viewer`).
Rastrové obrázky se vkládají do JWW (do SXF zatím ne). DWG zapisuje acadrust se zachováním bloků, kót
a rozvržení ve zvolené verzi (2000–2018).

## Licence

[MIT](./LICENSE). Původní upozornění na autorská práva mlightcad je zachováno,
jak licence vyžaduje. Přiložená písma BIZ UD (© Morisawa Inc.) a Noto Sans JP
jsou licencována pod SIL Open Font License 1.1. Knihovna acadrust použitá pro čtení a zápis DWG má licenci MPL-2.0 (používá se beze změn).
