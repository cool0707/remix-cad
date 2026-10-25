# RemixCAD

[English](./README.md) | [日本語](./README.ja.md) | [简体中文](./README.zh-CN.md) | [한국어](./README.ko.md) | [Español](./README.es.md) | [Português](./README.pt.md) | [Русский](./README.ru.md) | [Čeština](./README.cs.md)

> **이 저장소는 포크입니다.** RemixCAD는
> [mlightcad/cad-viewer](https://github.com/mlightcad/cad-viewer)(MIT 라이선스)의
> 포크로, 독립적으로 유지 관리됩니다. **원 저작자와는 관계가 없으며 원 프로젝트의
> 지원 대상도 아닙니다.** 문제는 원 프로젝트가 아니라
> [이 저장소의 Issues](https://github.com/cool0707/remix-cad/issues)에 보고해 주세요.

브라우저에서만 동작하는 DXF/DWG 뷰어 겸 편집기입니다. 도면 해석, 형상 처리, 렌더링
(Three.js / WebGL)은 모두 클라이언트에서 수행되므로 도면이 사용자 기기를 벗어나지 않습니다.

## 이 포크의 변경 사항

- **일본어 UI**: 모든 패키지(뷰어, 리본, 명령줄, 대화상자, 플러그인, 비교 뷰어,
  오프라인 HTML 내보내기)에 `ja` 로캘을 추가했으며 브라우저 언어에 따라 자동으로 선택됩니다.
- **글꼴 자체 호스팅(CAD CDN 불필요)**: 글꼴과 도면 템플릿은 앱에서 직접 제공합니다
  (`resources/cad-data` → `./cad-data/`).
  - 도면 문자: **BIZ UD Gothic / Mincho**를 포함하여 MS Gothic / MS Mincho 대체 및 기본
    대체 글꼴로 사용합니다.
  - 그 밖의 문자는 필요할 때 **Google Fonts**에서 불러옵니다(Arial → Arimo,
    SimSun → Noto Serif SC, 맑은 고딕 → Noto Sans KR 등).
  - UI 문자: **Noto Sans JP**(`@fontsource-variable/noto-sans-jp`로 자체 호스팅).
- **새 도면의 인쇄 페이지 이름 현지화**: 템플릿의 중국어 이름 대신 현재 UI 언어의 이름을 표시합니다.
- **CAD 비경험자를 위한 쉬운 용어**: UI에서 일상적인 단어를 사용합니다. 블록 → 심볼, 블록 속성 → 심볼 속성,
  모형 공간 → 캔버스, 배치 → 인쇄 페이지, 해치 → 패턴 채우기, 외부 참조 → 연결된 도면,
  빠른 선택 → 조건으로 선택 등. 도구 설명에는 CAD 용어를 괄호로 함께 표시합니다(모든 로캘).
- **이동 가능한 도구 모음** — 손잡이(⠿)를 드래그해 원하는 위치로 옮길 수 있고, 옆의 ⋯ 메뉴에서 세로/가로 전환과
  원래 위치로 되돌리기를 할 수 있습니다. 원래 위치는 도면 영역의 왼쪽이며, 떠 있는 패널(레이어 등)이 왼쪽을 가리면 오른쪽입니다.
  패널에 가려지면 자동으로 원래 위치로 돌아갑니다. 하위 메뉴는 화면 중앙 쪽으로 열리며 위치는 기억됩니다.
- **조작 프로필: 심플(기본) / CAD** — 상태 표시줄 버튼으로 전환합니다.
  심플에서는 클릭하면 선택을 바꾸고(Shift + 클릭으로 추가·해제, 빈 곳 클릭으로 선택 해제),
  키 하나로 도구를 바꾸며(V 선택 / H 이동 / L 선 / R 직사각형 / T 문자, Space를 누른 채 드래그하면 이동),
  사용 중인 도구를 커서 모양·커서 옆·상태 표시줄에 표시하고, 그린 뒤에는 선택 도구로 돌아갑니다
  (선은 한 개로 끝남. 환경 설정의 "계속 그리기"로 연속 작도). Esc는 단계적으로 동작합니다
  (작업 취소 → 선택 도구로 복귀 → 선택 해제). CAD는 기존 조작 그대로입니다(클릭할 때마다 추가, 선은 Enter까지 계속).
- **직접 편집 (심플)** — 선택 범위에 테두리가 생기며, 네 모서리를 드래그하면 크기 조정 (가로세로 비율 유지, Alt는 중심 기준),
  모서리 바로 바깥을 드래그하면 회전 (Shift: 15° 단위)합니다. 선택한 객체를 드래그하면 이동 (Alt + 드래그는 복사, Shift는 수평·수직만)하고,
  잡은 점은 객체 스냅에 붙으며 스냅이 없으면 주변 객체의 가장자리·중심에 맞춰지는 정렬 가이드가 표시됩니다. 화살표 키는 화면 약 1px에 해당하는
  깔끔한 값만큼 이동합니다 (Shift: ×10). 객체를 더블클릭하면 CAD 그립으로 정점을 편집합니다. 스냅은 상태 표시줄의 켜기/끄기 버튼 하나이며, 스냅 모드는 환경 설정에 있습니다.
  선택할 수 있는 객체에 커서를 올리면 테마 색으로 강조됩니다(두 프로필 공통). 선택한 객체 위에서는 커서가 드래그로 이동할 수 있음을 표시합니다.
- **환경 설정** — "파일" → "설정" 또는 언어 선택 옆의 톱니바퀴(`OPTIONS` 명령도 가능)로 여는 화면에
  조작 프로필, 선택 방식, 계속 그리기, 표시(테마, 리본, 도구 모음, 명령줄, 좌표, 언어 선택, 객체 정보, 통계) 설정을 모았습니다.
- **표시 배율** — 상태 표시줄에 현재 화면을 도면 축척 형식(`1/100` = 화면의 1 mm가 도면의 100 mm, 도면 단위와 96 px/inch로 계산)으로 표시하고,
  −/+ 버튼과 슬라이더로 확대·축소합니다. 클릭하면 "전체 표시"와 1/1 … 1/5000 중에서 고를 수 있습니다.
- **속성 패널** — 속성 탭을 일반·배치·심볼 등의 그룹으로 나누고 그 자리에서 편집합니다(변경 1회 = 실행 취소 1회).
  여러 개를 선택하면 선택 범위에 X / Y / 폭 / 높이(9점 기준점), 종류별 개수(클릭하면 그 종류만 선택),
  길이·면적 합계를 표시합니다. 값이 다른 항목은 '혼재'로 표시되며 한 번에 바꿀 수 있습니다.
  심볼 속성(블록 속성)도 같은 패널에서 편집하며, 클릭하면 바꾸는 방식에서는 심볼을 더블클릭하면 해당 칸으로 이동합니다.
- **JWW / JWC(Jw_cad) 가져오기** — 예제 앱에서 `.jww` 및 구 형식 `.jwc` 파일을 열 수 있습니다
  (`@mlightcad/cad-jww-converter`, MIT. 파서는 [ezjww](https://github.com/monozukuri-ai/ezjww),
  Rust → WebAssembly, Web Worker에서 실행). 좌표는 레이어 그룹 축척으로 용지 mm에서
  실제 mm로 변환하고, 용지를 도면 한계로 설정합니다.
- **SXF 가져오기**(일본 공공 공사 CAD 데이터 교환 표준) — 예제 앱에서 `.sfc`, `.p21` 및 ZIP 형식
  `.sfz` / `.p2z`를 열 수 있습니다(`@mlightcad/cad-sxf-converter`, MIT, TypeScript,
  [ezsxf](https://github.com/monozukuri-ai/ezsxf)에서 이식). 부분도는 주 뷰의 축척으로 실제 크기로
  표시하고, 용지를 도면 한계로 설정합니다.
- **JWW / SXF로 내보내기** — 파일 → 내보내기에서 도면을 JWW(Jw_cad), SXF SFC, SXF P21로 저장할 수
  있습니다(명령 `cjww`, `csfc`, `cp21`). 블록·치수·해치는 분해됩니다. 용지와 축척은 도면 한계에서
  정하며(JWW / SXF에서 읽은 도면은 원래 값 유지), 없으면 자동으로 정합니다(A3, 들어가는 가장 작은 표준 축척).
  내보내기 전에 용지·방향·축척을 고르는 대화 상자가 나옵니다(기본값은 자동). DXF 내보내기에서는 도면 한계로 기록하고,
  PDF 내보내기에서도 캔버스를 용지 크기에 축척대로 배치할 수 있습니다.
  「이미지로 내보내기」도 같은 방식(표시 화면·객체 범위·용지와 축척 + 해상도)으로 PNG·JPEG·BMP·TIFF를 고를 수 있으며,
  범위를 지정하는 기존 방식은 「선택 영역을 이미지로 내보내기」로 남아 있습니다.
- **세로쓰기(縦書き)** — Windows 세로쓰기 글꼴(`@ＭＳ ゴシック` 등, Jw_cad 縦字 포함)의 문자와
  문자 스타일에 AutoCAD "세로" 플래그가 있는 TEXT를 화면과 SVG / PDF 내보내기에서 위에서 아래로
  씁니다. 번들된 BIZ UD 글꼴을 그대로 사용합니다(`@mlightcad/cad-vertical-text`).

## 데모

- 온라인: <https://cool0707.github.io/remix-cad/>
- 로컬:

  ```bash
  pnpm install
  pnpm demo:build   # 모든 패키지를 빌드하고 demo-dist/ 생성
  pnpm demo         # http://localhost:4300/
  ```

## 시작하기

[Node.js](https://nodejs.org/) 24 이상과 [pnpm](https://pnpm.io/) 10 이상이 필요합니다.

```bash
git clone https://github.com/cool0707/remix-cad.git
cd remix-cad
pnpm install
pnpm dev          # 전체 기능 뷰어
pnpm dev:simple   # 간단한 뷰어
pnpm build
pnpm test
```

## 글꼴과 리소스

실행 중에 불러오는 리소스는 모두 `resources/cad-data/`에 있습니다(자세한 내용은
[README](./resources/cad-data/README.md)). 패키지를 직접 포함할 때는 `AcApDocManager`에
`baseUrl`을 전달하고 `defaultFonts` / `symbolFonts` 옵션으로 대체 글꼴을 바꿀 수 있습니다.
SHX 글꼴은 포함하지 않으며, SHX를 사용하는 문자는 BIZ UD Gothic으로 표시됩니다.

## DWG 지원

DXF는 내장된 MIT 파서로 읽습니다. DWG는 선택적으로
[LibreDWG](https://github.com/LibreDWG/libredwg) 기반의 `@mlightcad/libredwg-converter`를
사용할 수 있으며, 라이선스는 **GPL-3.0**입니다. 배포 전에 GPL 영향을 확인하세요.

## JWW / JWC 지원

`@mlightcad/cad-jww-converter`는 Jw_cad 도면(`.jww` / `.jwc`)을 읽습니다. Web Worker에서 ezjww(MIT)로
파싱하고 DXF로 변환한 뒤 내장 DXF 리더로 불러옵니다. 등록한 다음 패키지 `dist/`의
`jww-parser-worker.js`와 `jww-parser.wasm`을 같은 위치에 배포하세요.

```ts
import { registerJwwConverter } from '@mlightcad/cad-jww-converter'

registerJwwConverter('./assets/jww-parser-worker.js')
```

JWW는 좌표를 용지 mm로 저장합니다. 기본적으로 주 레이어 그룹(엔티티가 가장 많은 그룹)의
축척으로 전체를 확대하므로 Jw_cad와 같은 모양으로 보이고 주 도면은 실제 mm로 측정됩니다.
`scaleMode: 'layer-group'`은 그룹별 축척을, `scaleMode: 'paper'`는 용지 mm를 그대로 사용합니다.
구 형식 JWC도 같은 방식으로 변환합니다(JWC에는 글꼴 정보가 없으므로 문자는 ＭＳ ゴシック으로 표시).
`^@BM`으로 배치된 이미지는 래스터 이미지로 표시합니다. JWW에 포함된 이미지는 그대로 표시하고,
외부 파일을 참조하는 이미지는 누락된 이미지로 표시되며 뷰어에서 파일을 지정할 수 있습니다.
이미지 자르기는 아직 반영하지 않습니다.

## SXF 지원

`@mlightcad/cad-sxf-converter`는 SXF Ver.3.1 도면을 읽습니다: SFC(`.sfc`), P21(`.p21`, AP202) 및 ZIP
형식(`.sfz`, `.p2z`). 파서는 TypeScript로 작성되었고(WebAssembly 불필요) 피처 처리는 ezsxf(MIT)에서
이식했습니다. 도면을 선, 곡선, 문자, 채우기, 해치로 펼친 뒤 내장 DXF 리더로 불러옵니다.

```ts
import { registerSxfConverter } from '@mlightcad/cad-sxf-converter'

registerSxfConverter()
```

SXF 좌표는 용지 mm이며 부분도는 축척 비율로 배치됩니다. 기본적으로 주 부분도의 축척으로 전체를 확대하므로
인쇄와 같은 모양으로 보이고 주 뷰는 실제 mm로 측정됩니다. `scaleMode: 'paper'`는 용지 mm를 유지합니다.
원, 원호, 타원은 곡선 그대로이며 문자는 SXF 문자 상자 크기에 맞춥니다. 래스터 이미지(SXF 3.1 이미지 속성)는
이미지 파일이 `.sfz` / `.p2z`에 포함되어 있으면 표시합니다(흑백 TIFF(G4)는 브라우저용으로 변환하고
JPEG는 그대로 사용). `.sfc` / `.p21` 단독으로는 이미지 테두리를 누락된 이미지로 표시합니다.
속성 파일(SAF)은 읽지 않습니다.

## JWW / SXF로 내보내기

먼저 `@mlightcad/cad-export-model`이 도면을 실제 mm 단위의 선, 호/타원, 한 줄 문자, 점, 채우기로
평탄화하고(블록, 치수, 지시선, 스플라인, 해치 패턴은 분해) 용지와 축척을 정합니다. 그다음 각 형식으로 씁니다.

| 형식 | 작성기 | 비고 |
| --- | --- | --- |
| JWW | `AcDbJwwConverter.exportDatabase()` (ezjww 작성기, 파서 Worker에서 실행) | 용지 A0–A4(가로), 모든 레이어 그룹에 도면 축척, `<그룹>-<레이어> …` 이름의 레이어는 원래 위치로, 색 → 펜 1–9, 선종류 → Jw_cad 선종류, `@` 글꼴 → 세로 쓰기, 채우기 → 솔리드 |
| SFC / P21 | `exportSxf(db, 'sfc' \| 'p21' \| 'sfz' \| 'p2z')` (TypeScript) | 도면 축척의 부분도 하나에 배치. 기본 색 + 사용자 RGB 색, 기본 선종류·선폭. SFC는 Shift_JIS, P21은 AP202 표현 그래프(ezsxf로 검증) |

```ts
import { registerJwwConverter } from '@mlightcad/cad-jww-converter'
import { exportSxf } from '@mlightcad/cad-sxf-converter'

const jww = registerJwwConverter('./assets/jww-parser-worker.js')
const { bytes } = await jww.exportDatabase(db, { title: 'plan' })
const sfc = exportSxf(db, 'sfc', { title: 'plan', paper: 'A1', scale: 100 })
```

예제 앱은 `acapRegisterDrawingExporter()`(`cad-simple-viewer`)로 둘 다 등록합니다.
래스터 이미지는 JWW에 포함해 내보내며(SXF에는 아직 쓰지 않음), DWG 내보내기는 지원하지 않습니다(읽기에 쓰는 LibreDWG npm 빌드는
쓰기 기능이 빠져 있습니다).

## 라이선스

[MIT](./LICENSE). 라이선스 조건에 따라 mlightcad의 원 저작권 표시를 유지합니다.
포함된 BIZ UD 글꼴(© Morisawa Inc.)과 Noto Sans JP는 SIL Open Font License 1.1을 따릅니다.
