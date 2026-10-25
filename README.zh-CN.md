# RemixCAD

[English](./README.md) | [日本語](./README.ja.md) | [简体中文](./README.zh-CN.md) | [한국어](./README.ko.md) | [Español](./README.es.md) | [Português](./README.pt.md) | [Русский](./README.ru.md) | [Čeština](./README.cs.md)

> **这是一个分支（fork）。** RemixCAD 分支自
> [mlightcad/cad-viewer](https://github.com/mlightcad/cad-viewer)（MIT 许可证），
> 由本仓库独立维护，**与上游作者无关，也不在上游的支持范围内**。
> 如有问题，请在[本仓库的 Issues](https://github.com/cool0707/remix-cad/issues)
> 中反馈，不要提交到上游。

一个完全在浏览器中运行的 DXF/DWG 查看器和编辑器。图纸解析、几何处理和渲染
（Three.js / WebGL）都在客户端完成，图纸不会离开用户的设备。

## 本分支的改动

- **日文界面**：为所有包（查看器、功能区、命令行、对话框、插件、对比查看器、离线 HTML 导出）
  添加了完整的 `ja` 语言包，并根据浏览器语言自动选择。
- **字体自托管，不依赖 CAD CDN**：字体和图纸模板由应用自身提供
  （`resources/cad-data` → `./cad-data/`）。
  - 图纸文字：内置 **BIZ UD Gothic / Mincho**，用于替代 MS Gothic / MS Mincho，并作为默认回退字体。
  - 其他文字按需从 **Google Fonts** 加载（Arial → Arimo，SimSun → Noto Serif SC，
    Malgun Gothic → Noto Sans KR 等）。
  - 界面文字：**Noto Sans JP**（通过 `@fontsource-variable/noto-sans-jp` 自托管）。
- **新建图纸的打印页名称本地化**：显示为当前界面语言的名称，而不是模板中固定的中文名称。
- **面向非 CAD 用户的通俗术语**：界面使用日常用语，例如 块 → 符号、块属性 → 符号属性、模型空间 → 画布、
  布局 → 打印页、外部参照 → 链接图纸、快速选择 → 按条件选择 等。工具提示会在括号中保留 CAD 术语（所有语言）。
- **可移动的工具栏** — 拖动手柄（⠿）即可移动工具栏；旁边的「⋯」菜单可切换竖排／横排或恢复原位。
  原位是绘图区左侧，浮动面板（图层等）遮住左侧时为右侧；被面板遮挡时会自动恢复原位。子菜单向屏幕中心方向展开，位置会被记住。
- **切换选择方式** — 状态栏按钮可在 CAD 方式（每次单击都添加）与单击替换
  （Shift + 单击添加或取消，单击空白处取消选择）之间切换。目前默认仍为 CAD 方式。
- **属性面板** — “属性”选项卡按“常规”“位置”“符号”等分组，可直接编辑（每次修改为一步撤销）。
  多选时“选择范围”显示 X / Y / 宽 / 高（9 点参考点）、各类型数量（单击仅保留该类型）以及长度与面积合计；
  值不一致的项显示为“多种”，可一次性修改。符号属性（块属性）也在同一面板中编辑；在单击替换方式下，
  双击符号会跳到对应的输入框。
- **导入 JWW / JWC（Jw_cad）** — 示例应用可打开 `.jww` 及旧格式 `.jwc` 文件（`@mlightcad/cad-jww-converter`，MIT；
  解析器为 [ezjww](https://github.com/monozukuri-ai/ezjww)，Rust → WebAssembly，在 Web Worker 中运行）。
  坐标按图层组比例从图纸毫米换算为实际毫米，图纸幅面作为图形界限。
- **导入 SXF**（日本公共工程 CAD 数据交换标准）— 示例应用可打开 `.sfc`、`.p21` 及其 ZIP 形式
  `.sfz` / `.p2z`（`@mlightcad/cad-sxf-converter`，MIT，TypeScript，移植自
  [ezsxf](https://github.com/monozukuri-ai/ezsxf)）。局部图按主视图比例以实际尺寸显示，图纸幅面作为图形界限。
- **导出为 JWW / SXF** — 通过 文件 → 导出 可将图纸保存为 JWW（Jw_cad）、SXF SFC 或 SXF P21
  （命令 `cjww`、`csfc`、`cp21`）。块、标注和填充图案会被分解；图纸幅面和比例取自图形界限
  （从 JWW / SXF 读入的图纸保持原样），否则自动选择（A3、能容纳的最小标准比例）。
  导出前会弹出选择图纸、方向和比例的对话框（默认为自动）；导出 DXF 时写入为图形界限，导出 PDF 时也可按比例将画布放到所选图纸上。
  “导出为图像”也采用相同的方式（显示画面、对象范围或图纸与比例 + 分辨率），可选择 PNG、JPEG 或 BMP；原有的框选区域导出保留为“导出选定区域为图像”。
- **竖排文字（縦書き）** — 使用 Windows 竖排字体（`@ＭＳ ゴシック` 等，包括 Jw_cad 的縦字）的文字，
  以及文字样式设置了 AutoCAD“垂直”标志的 TEXT，在屏幕上和 SVG / PDF 导出中都会从上到下书写，
  直接使用内置的 BIZ UD 字体（`@mlightcad/cad-vertical-text`）。

## 演示

- 在线：<https://cool0707.github.io/remix-cad/>
- 本地：

  ```bash
  pnpm install
  pnpm demo:build   # 构建所有包并生成 demo-dist/
  pnpm demo         # http://localhost:4300/
  ```

## 快速开始

需要 [Node.js](https://nodejs.org/) >= 24 和 [pnpm](https://pnpm.io/) >= 10。

```bash
git clone https://github.com/cool0707/remix-cad.git
cd remix-cad
pnpm install
pnpm dev          # 完整查看器
pnpm dev:simple   # 简易查看器
pnpm build
pnpm test
```

## 字体与资源

运行时加载的所有资源都位于 `resources/cad-data/`（详见其
[README](./resources/cad-data/README.md)）。嵌入这些包时，可以向 `AcApDocManager`
传入 `baseUrl`，并通过 `defaultFonts` / `symbolFonts` 选项修改回退字体。
未内置 SHX 字体，使用 SHX 的文字将以 BIZ UD Gothic 显示。

## DWG 支持

DXF 由内置的 MIT 解析器读取。DWG 可选使用基于
[LibreDWG](https://github.com/LibreDWG/libredwg) 的 `@mlightcad/libredwg-converter`，
其许可证为 **GPL-3.0**，分发前请确认 GPL 的影响。

## JWW / JWC 支持

`@mlightcad/cad-jww-converter` 用于读取 Jw_cad 图纸（`.jww` / `.jwc`）：在 Web Worker 中用 ezjww（MIT）
解析，转换为 DXF 后由内置 DXF 读取器加载。注册后，请将包 `dist/` 中的
`jww-parser-worker.js` 与 `jww-parser.wasm` 部署在同一目录：

```ts
import { registerJwwConverter } from '@mlightcad/cad-jww-converter'

registerJwwConverter('./assets/jww-parser-worker.js')
```

JWW 以图纸毫米保存坐标。默认按主图层组（实体最多的组）的比例整体放大，因此外观与 Jw_cad
一致，主图可按实际毫米测量。`scaleMode: 'layer-group'` 按各组自身比例放大，
`scaleMode: 'paper'` 保持图纸毫米。旧格式 JWC 以同样方式转换（JWC 不含字体信息，文字按 ＭＳ ゴシック 显示）。
用 `^@BM` 放置的图像显示为光栅图像：JWW 内嵌的图像直接显示，引用外部文件的图像显示为缺失图像，
可在查看器中指定图像文件。暂不应用图像裁剪。

## SXF 支持

`@mlightcad/cad-sxf-converter` 读取 SXF Ver.3.1 图纸：SFC（`.sfc`）、P21（`.p21`，AP202）及其 ZIP 形式
（`.sfz`、`.p2z`）。解析器以 TypeScript 编写（无需 WebAssembly），要素处理移植自 ezsxf（MIT）。
图纸被展开为线、曲线、文字、填充和图案线，并通过内置 DXF 读取器加载。

```ts
import { registerSxfConverter } from '@mlightcad/cad-sxf-converter'

registerSxfConverter()
```

SXF 坐标为图纸毫米，局部图带比例放置。默认按主局部图的比例整体放大，外观与打印一致，主视图可按实际
毫米测量；`scaleMode: 'paper'` 保持图纸毫米。圆、圆弧、椭圆保持为曲线，文字按 SXF 文字框尺寸显示。
光栅图像（SXF 3.1 图像属性）在图像文件随 `.sfz` / `.p2z` 打包时显示（黑白 TIFF（G4）会转换为浏览器可显示的格式，
JPEG 直接使用）；单独的 `.sfc` / `.p21` 会把图像框显示为缺失图像。不读取属性文件（SAF）。

## 导出为 JWW / SXF

`@mlightcad/cad-export-model` 先把图纸展平为以实际毫米表示的直线、圆弧／椭圆、单行文字、点和填充
（块、标注、引线、样条和填充图案都会被分解），并确定图纸幅面和比例，然后由各写入器输出：

| 格式 | 写入器 | 说明 |
| --- | --- | --- |
| JWW | `AcDbJwwConverter.exportDatabase()`（ezjww 写入器，在解析 Worker 中运行） | 幅面 A0–A4（横向），所有图层组使用图纸比例，`<组>-<图层> …` 形式的图层回到原位置，颜色 → 笔 1–9，线型 → Jw_cad 线型，`@` 字体 → 竖排，填充 → 实体 |
| SFC / P21 | `exportSxf(db, 'sfc' \| 'p21' \| 'sfz' \| 'p2z')`（TypeScript） | 按图纸比例放置一个局部图；预定义颜色＋用户 RGB 颜色、预定义线型和线宽；SFC 为 Shift_JIS，P21 为 AP202 表示图（已用 ezsxf 校验） |

```ts
import { registerJwwConverter } from '@mlightcad/cad-jww-converter'
import { exportSxf } from '@mlightcad/cad-sxf-converter'

const jww = registerJwwConverter('./assets/jww-parser-worker.js')
const { bytes } = await jww.exportDatabase(db, { title: 'plan' })
const sfc = exportSxf(db, 'sfc', { title: 'plan', paper: 'A1', scale: 100 })
```

示例应用通过 `acapRegisterDrawingExporter()`（`cad-simple-viewer`）注册了这两种格式。
光栅图像会嵌入 JWW（尚不写入 SXF）；尚不支持导出 DWG（读取所用的 LibreDWG npm 构建关闭了写入功能）。

## 许可证

[MIT](./LICENSE)。按照许可证要求保留了 mlightcad 的原始版权声明。内置的
BIZ UD 字体（© Morisawa Inc.）和 Noto Sans JP 采用 SIL Open Font License 1.1。
