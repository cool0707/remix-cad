import{W as Le,x as _,C as ce,h as L,r as Y,I as Me,a as De,b as Ae,c as Ve,d as Re,e as Oe,f as Ne,g as Ie,i as Be,y as fe,j as me,t as Fe,k as pe,l as He,m as Ce,G as je,n as ze,Q as Ue,o as Ke}from"./cad-simple-viewer-C3nzHaNb.js";import{AcGeBox2d as he,AcDbSysVarManager as Z,AcDbSystemVariables as S,ACDB_COMPAREPROPS_COLOR as _e,ACDB_COMPAREPROPS_LAYER as Ge,ACDB_COMPAREPROPS_LINETYPE as $e,ACDB_COMPAREPROPS_LINETYPESCALE as Xe,ACDB_COMPAREPROPS_LINEWEIGHT as Ye,ACDB_COMPAREPROPS_TRANSPARENCY as We,ACDB_COMPAREPROPS_THICKNESS as qe,ACDB_COMPAREPROPS_DEFAULT as Ze,ACDB_COMPAREHATCH_DEFAULT as Je,ACDB_COMPARERCMARGIN_DEFAULT as Qe,ACDB_COMPARERCMARGIN_MIN as et,ACDB_COMPARERCMARGIN_MAX as tt,ACDB_COMPARETEXT_DEFAULT as it,ACDB_COMPARETOLERANCE_DEFAULT as st,ACDB_COMPARETOLERANCE_MIN as nt,ACDB_COMPARETOLERANCE_MAX as ot}from"./data-model-CTHNX8Hm.js";function rt(a){const e=[];for(const t of a.kinds)t!=="added"&&t!=="deleted"&&t!=="modified"||e.includes(t)||e.push(t);return e.length===1?e[0]:"modified"}function at(a,e){e!=="unchanged"&&(a.includes(e)||a.push(e))}function lt(a,e){const t=Math.max(1,Math.min(25,Math.trunc(e)));return Math.max(a,1)*(t/250)}function W(a,e){return{minX:a.minX-e,minY:a.minY-e,maxX:a.maxX+e,maxY:a.maxY+e}}function dt(a,e){return a.minX<=e.maxX&&a.maxX>=e.minX&&a.minY<=e.maxY&&a.maxY>=e.minY}function ct(a,e){return{minX:Math.min(a.minX,e.minX),minY:Math.min(a.minY,e.minY),maxX:Math.max(a.maxX,e.maxX),maxY:Math.max(a.maxY,e.maxY)}}function ft(a,e,t){const i=[];for(const d of a){if(d.kind==="unchanged")continue;const c=d.extents;c&&i.push({box:{minX:c.minX,minY:c.minY,maxX:c.maxX,maxY:c.maxY},objectId:d.objectId,side:d.side,kind:d.kind})}if(i.length===0)return[];const n=lt(e,t),o=i.map(d=>W(d.box,n)),s=i.map((d,c)=>c),r=d=>{let c=d;for(;s[c]!==c;)c=s[c];let f=d;for(;s[f]!==c;){const h=s[f];s[f]=c,f=h}return c};for(let d=0;d<i.length;d++)for(let c=d+1;c<i.length;c++)if(dt(o[d],o[c])){const f=r(d),h=r(c);f!==h&&(s[h]=f)}const l=new Map;for(let d=0;d<i.length;d++){const c=r(d),f=i[d],h=l.get(c);if(!h){l.set(c,{extents:W(f.box,n),objectIds:[f.objectId],hasLeft:f.side==="left",hasRight:f.side==="right",kinds:[f.kind]});continue}h.extents=ct(h.extents,W(f.box,n)),h.objectIds.push(f.objectId),f.side==="left"?h.hasLeft=!0:h.hasRight=!0,at(h.kinds,f.kind)}return[...l.values()]}function C(a,e){const t=typeof a=="number"?a:Number(a);return Number.isFinite(t)?Math.trunc(t):e}const J=C(_e,1),$=C(Ge,2),Q=C($e,4),ee=C(Xe,8),te=C(Ye,16),ie=C(We,32),se=C(qe,64),ne=C(Ze,0),oe=C(Je,0),re=C(Qe,5),mt=C(et,1),pt=C(tt,25),ae=C(it,1),X=C(st,6),Se=C(nt,0),Pe=C(ot,14);function V(a,e){const t=typeof a=="number"?a:Number(a);return Number.isFinite(t)?Math.trunc(t):e}function le(){const a=Z.instance();return{compareprops:V(a.getDefaultValue(S.COMPAREPROPS),ne),comparehatch:V(a.getDefaultValue(S.COMPAREHATCH),oe),comparercmargin:V(a.getDefaultValue(S.COMPARERCMARGIN),re),comparetext:V(a.getDefaultValue(S.COMPARETEXT),ae),comparetolerance:V(a.getDefaultValue(S.COMPARETOLERANCE),X)}}function ht(a,e){const t=Z.instance(),i=le(),n=a??e,o=a??e;return{compareprops:n?V(t.getVar(S.COMPAREPROPS,n),i.compareprops):i.compareprops,comparehatch:o?V(t.getVar(S.COMPAREHATCH,o),i.comparehatch):i.comparehatch,comparercmargin:o?V(t.getVar(S.COMPARERCMARGIN,o),i.comparercmargin):i.comparercmargin,comparetext:o?V(t.getVar(S.COMPARETEXT,o),i.comparetext):i.comparetext,comparetolerance:o?V(t.getVar(S.COMPARETOLERANCE,o),i.comparetolerance):i.comparetolerance}}function ue(a,e){if(e.length===0)return;const t=Z.instance(),i=e[0];t.setVar(S.COMPAREPROPS,a.compareprops,i);for(const n of e)t.setVar(S.COMPAREHATCH,a.comparehatch,n),t.setVar(S.COMPARERCMARGIN,a.comparercmargin,n),t.setVar(S.COMPARETEXT,a.comparetext,n),t.setVar(S.COMPARETOLERANCE,a.comparetolerance,n)}function ut(a){const e=C(a,X);return 10**-Math.max(Se,Math.min(Pe,e))}const gt={color:J,layer:$,lineType:Q,lineTypeScale:ee,lineWeight:te,transparency:ie,thickness:se},yt=new Set(["HATCH"]),bt=new Set(["TEXT","MTEXT","ATTRIB","ATTDEF"]);function v(a,e){return Number.isFinite(a)?Math.round(a/e)*e:0}function de(a){try{const e=a.geometricExtents;return!(e!=null&&e.min)||!(e!=null&&e.max)?void 0:{minX:e.min.x,minY:e.min.y,maxX:e.max.x,maxY:e.max.y}}catch{return}}function R(a,e){return a?`${v(a.x??0,e)},${v(a.y??0,e)},${v(a.z??0,e)}`:""}function A(a){return Number.isFinite(a)?String(Number(a.toFixed(6))):String(a)}function j(a){const e=A(a.x??0),t=A(a.y??0),i=a.z??0;return Math.abs(i)<1e-9?`(${e}, ${t})`:`(${e}, ${t}, ${A(i)})`}function q(a){return`${A(a*180/Math.PI)}°`}function vt(a,e){var t,i,n,o;const s=a,r=[],l=(u,g,b)=>{r.push({id:u,display:g,key:b})};l("layer",String(s.layer??""),String(s.layer??""));const d=((i=(t=s.color)==null?void 0:t.toString)==null?void 0:i.call(t))??"";l("color",d,d);const c=s.lineType??"";l("lineType",c,c),l("lineWeight",s.lineWeight!=null?String(s.lineWeight):"",String(s.lineWeight??"")),typeof s.linetypeScale=="number"&&l("lineTypeScale",A(s.linetypeScale),String(v(s.linetypeScale,e)));const f=(o=(n=s.transparency)==null?void 0:n.toString)==null?void 0:o.call(n);f!=null&&f!==""&&l("transparency",f,f),typeof s.thickness=="number"&&l("thickness",A(s.thickness),String(v(s.thickness,e)));const h=r.length;if(s.startPoint&&s.endPoint){const u=s.startPoint,g=s.endPoint;l("startPoint",j(u),R(u,e)),l("endPoint",j(g),R(g,e))}if(s.center){const u=s.center;l("center",j(u),R(u,e))}if(typeof s.radius=="number"&&l("radius",A(s.radius),String(v(s.radius,e))),typeof s.startAngle=="number"&&typeof s.endAngle=="number"&&(l("startAngle",q(s.startAngle),String(v(s.startAngle,e))),l("endAngle",q(s.endAngle),String(v(s.endAngle,e)))),s.position){const u=s.position;l("position",j(u),R(u,e))}if(s.location){const u=s.location;l("location",j(u),R(u,e))}if(typeof s.rotation=="number"&&l("rotation",q(s.rotation),String(v(s.rotation,e))),typeof s.height=="number"&&l("height",A(s.height),String(v(s.height,e))),typeof s.blockName=="string"&&l("blockName",s.blockName,s.blockName),s.scaleFactors){const u=s.scaleFactors;l("scale",`${A(u.x??1)}, ${A(u.y??1)}, ${A(u.z??1)}`,`${v(u.x??1,e)},${v(u.y??1,e)},${v(u.z??1,e)}`)}typeof s.textString=="string"&&l("text",s.textString,s.textString),typeof s.contents=="string"&&l("mtext",s.contents,s.contents);const p=de(a);return p&&r.length===h&&l("extents",`${j({x:p.minX,y:p.minY})} – ${j({x:p.maxX,y:p.maxY})}`,`${v(p.minX,e)},${v(p.minY,e)},${v(p.maxX,e)},${v(p.maxY,e)}`),l("objectId",String(a.objectId??""),String(a.objectId??"")),r}function kt(a,e,t){const i=new Map(a.fields.map(p=>[p.id,p])),n=new Map(e.fields.map(p=>[p.id,p])),o=[],s=new Set;for(const p of[...a.fields,...e.fields])s.has(p.id)||(s.add(p.id),o.push(p.id));const r=i.get("startPoint"),l=i.get("endPoint"),d=n.get("startPoint"),c=n.get("endPoint"),f=r!=null&&l!=null&&d!=null&&c!=null&&[r.key,l.key].sort().join("|")===[d.key,c.key].sort().join("|"),h=[];for(const p of o){if(f&&(p==="startPoint"||p==="endPoint"))continue;const u=gt[p];if(u!=null&&(t&u)===0)continue;const g=i.get(p),b=n.get(p);((g==null?void 0:g.key)??"")!==((b==null?void 0:b.key)??"")&&h.push({field:p,oldValue:(g==null?void 0:g.display)??"",newValue:(b==null?void 0:b.display)??""})}return h.length===0&&a.fingerprint!==e.fingerprint&&h.push({field:"geometry",oldValue:"",newValue:""}),h}function xt(a,e){const t=a,i=[String(t.dxfTypeName??t.type??"")];if(t.startPoint&&t.endPoint){const o=R(t.startPoint,e),s=R(t.endPoint,e);i.push(o<s?`${o}|${s}`:`${s}|${o}`)}if(t.center&&i.push(`c:${R(t.center,e)}`),typeof t.radius=="number"&&i.push(`r:${v(t.radius,e)}`),typeof t.startAngle=="number"&&typeof t.endAngle=="number"&&i.push(`a:${v(t.startAngle,e)}:${v(t.endAngle,e)}`),t.position&&i.push(`p:${R(t.position,e)}`),t.location&&i.push(`l:${R(t.location,e)}`),typeof t.rotation=="number"&&i.push(`rot:${v(t.rotation,e)}`),typeof t.height=="number"&&i.push(`h:${v(t.height,e)}`),typeof t.blockName=="string"&&i.push(`blk:${t.blockName}`),t.scaleFactors){const o=t.scaleFactors;i.push(`s:${v(o.x??1,e)},${v(o.y??1,e)},${v(o.z??1,e)}`)}typeof t.textString=="string"&&i.push(`t:${t.textString}`),typeof t.contents=="string"&&i.push(`m:${t.contents}`);const n=de(a);return n&&i.length<=1&&i.push(`ext:${v(n.minX,e)},${v(n.minY,e)},${v(n.maxX,e)},${v(n.maxY,e)}`),i.join(";")}function wt(a,e){var t,i,n,o;if(e===0)return"";const s=a,r=[];return e&J&&r.push(((i=(t=s.color)==null?void 0:t.toString)==null?void 0:i.call(t))??""),e&$&&r.push(String(s.layer??"")),e&Q&&r.push(s.lineType??""),e&ee&&r.push(String(s.linetypeScale??"")),e&te&&r.push(String(s.lineWeight??"")),e&ie&&r.push(((o=(n=s.transparency)==null?void 0:n.toString)==null?void 0:o.call(n))??""),e&se&&r.push(String(s.thickness??"")),r.join("|")}function Ct(a){return yt.has(a.toUpperCase())}function St(a){return bt.has(a.toUpperCase())}function Pt(a,e,t,i,n){const o=[],s=a.tables.blockTable.modelSpace;for(const r of s.newIterator()){const l=String(r.objectId??"");if(!l)continue;const d=String(r.dxfTypeName??r.type??"UNKNOWN");!i&&Ct(d)||!n&&St(d)||o.push({entity:r,objectId:l,dxfType:d,layer:String(r.layer??"0"),fingerprint:xt(r,e),propKey:wt(r,t),extents:de(r),fields:vt(r,e)})}return o}function Tt(a,e){let t=1/0,i=1/0,n=-1/0,o=-1/0;for(const s of[...a,...e]){const r=s.extents;r&&(t=Math.min(t,r.minX),i=Math.min(i,r.minY),n=Math.max(n,r.maxX),o=Math.max(o,r.maxY))}return Number.isFinite(t)?Math.max(n-t,o-i,1):1}function B(a,e,t,i,n){return{side:e,objectId:a.objectId,dxfType:a.dxfType,layer:a.layer,kind:t,pairedId:i,extents:a.extents,changes:n}}function ge(a,e,t,i){const n=kt(e,t,i);a.push(B(e,"left","modified",t.objectId,n)),a.push(B(t,"right","modified",e.objectId,n))}function Et(a,e,t={}){const i=t.compareProps??ne,n=(t.compareHatch??oe)!==0,o=(t.compareText??ae)!==0,s=t.compareTolerance??X,r=t.compareRcMargin??re,l=t.tolerance!=null&&t.tolerance>0?t.tolerance:ut(s),d=y=>Pt(y,l,i,n,o),c=d(a),f=d(e),h=new Map(f.map(y=>[y.objectId,y])),p=new Set,u=[],g=[],b=[],k=[],D=[];for(const y of c){const x=h.get(y.objectId);if(x&&y.dxfType===x.dxfType){p.add(x.objectId);const T=y.fingerprint===x.fingerprint,P=y.propKey===x.propKey;T&&P?t.includeUnchanged&&(k.push(B(y,"left","unchanged",x.objectId)),k.push(B(x,"right","unchanged",y.objectId))):ge(b,y,x,i)}else D.push(y)}const M=f.filter(y=>!p.has(y.objectId)),U=(i&$)!==0,N=y=>U?`${y.dxfType}\0${y.layer}`:y.dxfType,O=new Map;for(const y of M){const x=N(y),T=O.get(x);T?T.push(y):O.set(x,[y])}for(const y of D){const x=O.get(N(y));let T=-1;if(x&&(T=x.findIndex(P=>P.fingerprint===y.fingerprint)),T>=0&&x){const P=x.splice(T,1)[0];p.add(P.objectId),y.propKey===P.propKey?t.includeUnchanged&&(k.push(B(y,"left","unchanged",P.objectId)),k.push(B(P,"right","unchanged",y.objectId))):ge(b,y,P,i)}else g.push(B(y,"left","deleted"))}for(const y of M)p.has(y.objectId)||u.push(B(y,"right","added"));const K=[...g,...b.filter(y=>y.side==="left"),...u],H=ft([...g,...b,...u],Tt(c,f),r);return{added:u,deleted:g,modified:b,unchanged:k,navigation:K,changeSets:H}}const Te={openFile:"Open file",noDrawing:"No drawing",emptyTitle:"Drop a drawing here",emptyHint:"or click to open a DWG / DXF",invalidFile:"Please choose a .dwg or .dxf file",toolbarSideBySide:"Side by side",toolbarOverlay:"Overlay",toolbarSyncViews:"Sync views",toolbarTogglePanel:"Results panel",toolbarPrev:"Previous difference",toolbarNext:"Next difference",toolbarSettings:"Settings",toolbarLanguage:"Language",toolbarThemeLight:"Switch to dark theme",toolbarThemeDark:"Switch to light theme",toolbarMarkup:"Markup",markupGenerateClouds:"Generate cloud markups",markupCloud:"Cloud",markupCallout:"Callout",markupText:"Text",markupRect:"Rectangle",markupCircle:"Circle",markupArrow:"Arrow",markupStamp:"Stamp",markupLine:"Line",markupHighlight:"Highlight",markupShow:"Show markups",markupHide:"Hide markups",markupClear:"Clear markups",panelTitle:"Compare",panelClose:"Close panel",tabResults:"Results",tabMarkups:"Markups",groupByType:"By entity type",groupByKind:"By change",kindAdded:"Added",kindDeleted:"Deleted",kindModified:"Modified",diffDetails:"Show differences",diffColProperty:"Property",diffColOld:"Old",diffColNew:"New",diffGeometryChanged:"Geometry changed",diffVisible:"Visible",diffHidden:"Hidden",fieldObjectId:"Handle",fieldLayer:"Layer",fieldColor:"Color",fieldLineType:"Linetype",fieldLineWeight:"Lineweight",fieldLineTypeScale:"Linetype scale",fieldTransparency:"Transparency",fieldThickness:"Thickness",fieldVisibility:"Visibility",fieldStartPoint:"Start point",fieldEndPoint:"End point",fieldCenter:"Center",fieldRadius:"Radius",fieldStartAngle:"Start angle",fieldEndAngle:"End angle",fieldPosition:"Position",fieldLocation:"Location",fieldRotation:"Rotation",fieldHeight:"Height",fieldBlockName:"Block",fieldScale:"Scale",fieldText:"Text",fieldMtext:"MText",fieldExtents:"Extents",fieldGeometry:"Geometry",noResults:"Open two drawings to compare",noMarkups:"No markups yet",markupFromLeft:"Left",markupFromRight:"Right",comparing:"Comparing…",settingsTitle:"Settings",settingsTabColors:"Colors",settingsTabObjects:"Objects",settingsTabGeometry:"Geometry",settingsUnchanged:"Unchanged objects",settingsDeleted:"Deleted objects",settingsAdded:"Added objects",settingsModified:"Modified objects",settingsSectionColors:"Colors",settingsSectionObjects:"Objects",settingsIncludeHatch:"Include hatch objects",settingsIncludeText:"Include text objects",settingsSectionProps:"Object properties",settingsPropsHint:"Property changes are ignored unless selected (COMPAREPROPS). Layer-table color or linetype changes are never compared.",settingsPropColor:"Color",settingsPropLayer:"Layer",settingsPropLinetype:"Linetype",settingsPropLinetypeScale:"Linetype scale",settingsPropLineweight:"Lineweight",settingsPropTransparency:"Transparency",settingsPropThickness:"Thickness",settingsSectionClouds:"Revision clouds",settingsRcMargin:"Margin",settingsSectionTolerance:"Tolerance",settingsTolerance:"Decimal places",settingsOk:"OK",settingsCancel:"Cancel",settingsReset:"Reset",settingsClose:"Close"},Lt={openFile:"ファイルを開く",noDrawing:"図面なし",emptyTitle:"ここに図面をドロップ",emptyHint:"またはクリックして DWG / DXF を開く",invalidFile:".dwg または .dxf ファイルを選択してください",toolbarSideBySide:"左右に並べる",toolbarOverlay:"重ね合わせ",toolbarSyncViews:"ビューを同期",toolbarTogglePanel:"結果パネル",toolbarPrev:"前の相違点",toolbarNext:"次の相違点",toolbarSettings:"設定",toolbarLanguage:"言語",toolbarThemeLight:"ダークテーマに切り替え",toolbarThemeDark:"ライトテーマに切り替え",toolbarMarkup:"マークアップ",markupGenerateClouds:"雲マークを生成",markupCloud:"雲マーク",markupCallout:"吹き出し",markupText:"文字",markupRect:"長方形",markupCircle:"円",markupArrow:"矢印",markupStamp:"スタンプ",markupLine:"線",markupHighlight:"ハイライト",markupShow:"マークアップを表示",markupHide:"マークアップを非表示",markupClear:"マークアップをクリア",panelTitle:"比較",panelClose:"パネルを閉じる",tabResults:"結果",tabMarkups:"マークアップ",groupByType:"オブジェクトの種類別",groupByKind:"変更の種類別",kindAdded:"追加",kindDeleted:"削除",kindModified:"変更",diffDetails:"相違点を表示",diffColProperty:"プロパティ",diffColOld:"変更前",diffColNew:"変更後",diffGeometryChanged:"形状が変更されました",diffVisible:"表示",diffHidden:"非表示",fieldObjectId:"ハンドル",fieldLayer:"画層",fieldColor:"色",fieldLineType:"線種",fieldLineWeight:"線の太さ",fieldLineTypeScale:"線種尺度",fieldTransparency:"透過性",fieldThickness:"厚さ",fieldVisibility:"表示",fieldStartPoint:"始点",fieldEndPoint:"終点",fieldCenter:"中心",fieldRadius:"半径",fieldStartAngle:"開始角度",fieldEndAngle:"終了角度",fieldPosition:"位置",fieldLocation:"位置",fieldRotation:"回転",fieldHeight:"高さ",fieldBlockName:"ブロック",fieldScale:"尺度",fieldText:"文字",fieldMtext:"マルチテキスト",fieldExtents:"範囲",fieldGeometry:"形状",noResults:"比較する図面を 2 つ開いてください",noMarkups:"マークアップはまだありません",markupFromLeft:"左",markupFromRight:"右",comparing:"比較しています…",settingsTitle:"設定",settingsTabColors:"色",settingsTabObjects:"オブジェクト",settingsTabGeometry:"形状",settingsUnchanged:"変更なしのオブジェクト",settingsDeleted:"削除されたオブジェクト",settingsAdded:"追加されたオブジェクト",settingsModified:"変更されたオブジェクト",settingsSectionColors:"色",settingsSectionObjects:"オブジェクト",settingsIncludeHatch:"ハッチングを含める",settingsIncludeText:"文字を含める",settingsSectionProps:"オブジェクトのプロパティ",settingsPropsHint:"プロパティの変更は、選択したもの以外は無視されます (COMPAREPROPS)。画層テーブルの色や線種の変更は比較しません。",settingsPropColor:"色",settingsPropLayer:"画層",settingsPropLinetype:"線種",settingsPropLinetypeScale:"線種尺度",settingsPropLineweight:"線の太さ",settingsPropTransparency:"透過性",settingsPropThickness:"厚さ",settingsSectionClouds:"雲マーク",settingsRcMargin:"余白",settingsSectionTolerance:"許容差",settingsTolerance:"小数点以下の桁数",settingsOk:"OK",settingsCancel:"キャンセル",settingsReset:"リセット",settingsClose:"閉じる"},Mt={openFile:"打开文件",noDrawing:"未打开图纸",emptyTitle:"拖拽图纸到此处",emptyHint:"或点击打开 DWG / DXF",invalidFile:"请选择 .dwg 或 .dxf 文件",toolbarSideBySide:"左右分屏",toolbarOverlay:"叠图",toolbarSyncViews:"同步左右视图",toolbarTogglePanel:"结果面板",toolbarPrev:"上一个差异",toolbarNext:"下一个差异",toolbarSettings:"设置",toolbarLanguage:"语言",toolbarThemeLight:"切换为深色主题",toolbarThemeDark:"切换为浅色主题",toolbarMarkup:"批注",markupGenerateClouds:"生成云线批注",markupCloud:"云线",markupCallout:"引出标注",markupText:"文字",markupRect:"矩形",markupCircle:"圆",markupArrow:"箭头",markupStamp:"图章",markupLine:"直线",markupHighlight:"高亮",markupShow:"显示批注",markupHide:"隐藏批注",markupClear:"清除批注",panelTitle:"比对",panelClose:"关闭面板",tabResults:"比对结果",tabMarkups:"批注",groupByType:"按图元类型",groupByKind:"按增删改",kindAdded:"新增",kindDeleted:"删除",kindModified:"修改",diffDetails:"查看差异",diffColProperty:"属性",diffColOld:"旧版",diffColNew:"新版",diffGeometryChanged:"几何已变化",diffVisible:"可见",diffHidden:"隐藏",fieldObjectId:"句柄",fieldLayer:"图层",fieldColor:"颜色",fieldLineType:"线型",fieldLineWeight:"线宽",fieldLineTypeScale:"线型比例",fieldTransparency:"透明度",fieldThickness:"厚度",fieldVisibility:"可见性",fieldStartPoint:"起点",fieldEndPoint:"终点",fieldCenter:"圆心",fieldRadius:"半径",fieldStartAngle:"起始角度",fieldEndAngle:"终止角度",fieldPosition:"位置",fieldLocation:"插入点",fieldRotation:"旋转",fieldHeight:"高度",fieldBlockName:"块名",fieldScale:"缩放",fieldText:"文字",fieldMtext:"多行文字",fieldExtents:"范围",fieldGeometry:"几何",noResults:"请打开两张图纸进行比对",noMarkups:"暂无批注",markupFromLeft:"左侧",markupFromRight:"右侧",comparing:"正在比对…",settingsTitle:"设置",settingsTabColors:"颜色",settingsTabObjects:"对象",settingsTabGeometry:"几何",settingsUnchanged:"相同对象",settingsDeleted:"删除的对象",settingsAdded:"新增的对象",settingsModified:"修改的对象",settingsSectionColors:"颜色",settingsSectionObjects:"对象",settingsIncludeHatch:"包含填充对象",settingsIncludeText:"包含文字对象",settingsSectionProps:"对象属性",settingsPropsHint:"未勾选的属性变化不会计入差异（COMPAREPROPS）。图层表中的颜色或线型变化不会比较。",settingsPropColor:"颜色",settingsPropLayer:"图层",settingsPropLinetype:"线型",settingsPropLinetypeScale:"线型比例",settingsPropLineweight:"线宽",settingsPropTransparency:"透明度",settingsPropThickness:"厚度",settingsSectionClouds:"修订云线",settingsRcMargin:"边距",settingsSectionTolerance:"公差",settingsTolerance:"小数位数",settingsOk:"确定",settingsCancel:"取消",settingsReset:"恢复默认",settingsClose:"关闭"},Dt={openFile:"Dosya aç",noDrawing:"Çizim yok",emptyTitle:"Bir çizimi buraya bırakın",emptyHint:"veya DWG / DXF açmak için tıklayın",invalidFile:"Lütfen bir .dwg veya .dxf dosyası seçin",toolbarSideBySide:"Yan yana",toolbarOverlay:"Üst üste",toolbarSyncViews:"Görünümleri eşitle",toolbarTogglePanel:"Sonuç paneli",toolbarPrev:"Önceki fark",toolbarNext:"Sonraki fark",toolbarSettings:"Ayarlar",toolbarLanguage:"Dil",toolbarThemeLight:"Koyu temaya geç",toolbarThemeDark:"Açık temaya geç",toolbarMarkup:"İşaretleme",markupGenerateClouds:"Bulut işaretlemeleri oluştur",markupCloud:"Bulut",markupCallout:"Çağrı",markupText:"Metin",markupRect:"Dikdörtgen",markupCircle:"Daire",markupArrow:"Ok",markupStamp:"Damga",markupLine:"Çizgi",markupHighlight:"Vurgu",markupShow:"İşaretleri Göster",markupHide:"İşaretleri Gizle",markupClear:"İşaretleri Temizle",panelTitle:"Karşılaştır",panelClose:"Paneli kapat",tabResults:"Sonuçlar",tabMarkups:"İşaretlemeler",groupByType:"Varlık türüne göre",groupByKind:"Değişime göre",kindAdded:"Eklenen",kindDeleted:"Silinen",kindModified:"Değiştirilen",diffDetails:"Farkları göster",diffColProperty:"Özellik",diffColOld:"Eski",diffColNew:"Yeni",diffGeometryChanged:"Geometri değişti",diffVisible:"Görünür",diffHidden:"Gizli",fieldObjectId:"Tutamak",fieldLayer:"Katman",fieldColor:"Renk",fieldLineType:"Çizgi tipi",fieldLineWeight:"Çizgi kalınlığı",fieldLineTypeScale:"Çizgi tipi ölçeği",fieldTransparency:"Saydamlık",fieldThickness:"Kalınlık",fieldVisibility:"Görünürlük",fieldStartPoint:"Başlangıç noktası",fieldEndPoint:"Bitiş noktası",fieldCenter:"Merkez",fieldRadius:"Yarıçap",fieldStartAngle:"Başlangıç açısı",fieldEndAngle:"Bitiş açısı",fieldPosition:"Konum",fieldLocation:"Konum",fieldRotation:"Döndürme",fieldHeight:"Yükseklik",fieldBlockName:"Blok",fieldScale:"Ölçek",fieldText:"Metin",fieldMtext:"Çok satırlı metin",fieldExtents:"Sınırlar",fieldGeometry:"Geometri",noResults:"Karşılaştırmak için iki çizim açın",noMarkups:"Henüz işaretleme yok",markupFromLeft:"Sol",markupFromRight:"Sağ",comparing:"Karşılaştırılıyor…",settingsTitle:"Ayarlar",settingsTabColors:"Renkler",settingsTabObjects:"Nesneler",settingsTabGeometry:"Geometri",settingsUnchanged:"Aynı nesneler",settingsDeleted:"Silinen nesneler",settingsAdded:"Eklenen nesneler",settingsModified:"Değiştirilen nesneler",settingsSectionColors:"Renkler",settingsSectionObjects:"Nesneler",settingsIncludeHatch:"Tarama nesnelerini dahil et",settingsIncludeText:"Metin nesnelerini dahil et",settingsSectionProps:"Nesne özellikleri",settingsPropsHint:"Seçilmeyen özellik değişiklikleri karşılaştırılmaz (COMPAREPROPS). Katman tablosundaki renk veya çizgi tipi değişiklikleri karşılaştırılmaz.",settingsPropColor:"Renk",settingsPropLayer:"Katman",settingsPropLinetype:"Çizgi tipi",settingsPropLinetypeScale:"Çizgi tipi ölçeği",settingsPropLineweight:"Çizgi kalınlığı",settingsPropTransparency:"Saydamlık",settingsPropThickness:"Kalınlık",settingsSectionClouds:"Revizyon bulutları",settingsRcMargin:"Kenar boşluğu",settingsSectionTolerance:"Tolerans",settingsTolerance:"Ondalık basamak",settingsOk:"Tamam",settingsCancel:"İptal",settingsReset:"Sıfırla",settingsClose:"Kapat"},At={openFile:"Otevřít soubor",noDrawing:"Žádný výkres",emptyTitle:"Přetáhněte výkres sem",emptyHint:"nebo klikněte pro otevření DWG / DXF",invalidFile:"Vyberte soubor .dwg nebo .dxf",toolbarSideBySide:"Vedle sebe",toolbarOverlay:"Překrytí",toolbarSyncViews:"Synchronizovat pohledy",toolbarTogglePanel:"Panel výsledků",toolbarPrev:"Předchozí rozdíl",toolbarNext:"Další rozdíl",toolbarSettings:"Nastavení",toolbarLanguage:"Jazyk",toolbarThemeLight:"Přepnout na tmavý motiv",toolbarThemeDark:"Přepnout na světlý motiv",toolbarMarkup:"Poznámky",markupGenerateClouds:"Vytvořit obláčky",markupCloud:"Oblak",markupCallout:"Popisek",markupText:"Text",markupRect:"Obdélník",markupCircle:"Kružnice",markupArrow:"Šipka",markupStamp:"Razítko",markupLine:"Úsečka",markupHighlight:"Zvýraznění",markupShow:"Zobrazit poznámky",markupHide:"Skrýt poznámky",markupClear:"Vymazat poznámky",panelTitle:"Porovnání",panelClose:"Zavřít panel",tabResults:"Výsledky",tabMarkups:"Poznámky",groupByType:"Podle typu entity",groupByKind:"Podle změny",kindAdded:"Přidané",kindDeleted:"Smazané",kindModified:"Upravené",diffDetails:"Zobrazit rozdíly",diffColProperty:"Vlastnost",diffColOld:"Staré",diffColNew:"Nové",diffGeometryChanged:"Geometrie se změnila",diffVisible:"Viditelné",diffHidden:"Skryté",fieldObjectId:"Handle",fieldLayer:"Hladina",fieldColor:"Barva",fieldLineType:"Typ čáry",fieldLineWeight:"Tloušťka čáry",fieldLineTypeScale:"Měřítko typu čáry",fieldTransparency:"Průhlednost",fieldThickness:"Tloušťka",fieldVisibility:"Viditelnost",fieldStartPoint:"Počáteční bod",fieldEndPoint:"Koncový bod",fieldCenter:"Střed",fieldRadius:"Poloměr",fieldStartAngle:"Počáteční úhel",fieldEndAngle:"Koncový úhel",fieldPosition:"Pozice",fieldLocation:"Umístění",fieldRotation:"Rotace",fieldHeight:"Výška",fieldBlockName:"Blok",fieldScale:"Měřítko",fieldText:"Text",fieldMtext:"MText",fieldExtents:"Rozsah",fieldGeometry:"Geometrie",noResults:"Otevřete dva výkresy pro porovnání",noMarkups:"Zatím žádné poznámky",markupFromLeft:"Levý",markupFromRight:"Pravý",comparing:"Porovnávání…",settingsTitle:"Nastavení",settingsTabColors:"Barvy",settingsTabObjects:"Objekty",settingsTabGeometry:"Geometrie",settingsUnchanged:"Stejné objekty",settingsDeleted:"Smazané objekty",settingsAdded:"Přidané objekty",settingsModified:"Upravené objekty",settingsSectionColors:"Barvy",settingsSectionObjects:"Objekty",settingsIncludeHatch:"Zahrnout šrafy",settingsIncludeText:"Zahrnout textové objekty",settingsSectionProps:"Vlastnosti objektů",settingsPropsHint:"Nezaškrtnuté změny vlastností se neporovnávají (COMPAREPROPS). Změny barvy nebo typu čáry v tabulce hladin se neporovnávají.",settingsPropColor:"Barva",settingsPropLayer:"Hladina",settingsPropLinetype:"Typ čáry",settingsPropLinetypeScale:"Měřítko typu čáry",settingsPropLineweight:"Tloušťka čáry",settingsPropTransparency:"Průhlednost",settingsPropThickness:"Tloušťka",settingsSectionClouds:"Revizní obláčky",settingsRcMargin:"Okraj",settingsSectionTolerance:"Tolerance",settingsTolerance:"Desetinná místa",settingsOk:"OK",settingsCancel:"Zrušit",settingsReset:"Obnovit výchozí",settingsClose:"Zavřít"},Vt={openFile:"فتح ملف",noDrawing:"لا يوجد رسم",emptyTitle:"أسقط رسمًا هنا",emptyHint:"أو انقر لفتح ملف DWG / DXF",invalidFile:"يرجى اختيار ملف .dwg أو .dxf",toolbarSideBySide:"جنبًا إلى جنب",toolbarOverlay:"تراكب",toolbarTogglePanel:"لوحة النتائج",toolbarPrev:"الاختلاف السابق",toolbarNext:"الاختلاف التالي",toolbarLanguage:"اللغة",toolbarMarkup:"علامات المراجعة",markupGenerateClouds:"إنشاء سحب المراجعة",markupCloud:"سحابة",markupCallout:"تعليق توضيحي",markupText:"نص",markupRect:"مستطيل",markupCircle:"دائرة",markupArrow:"سهم",markupStamp:"ختم",markupLine:"خط",markupHighlight:"تمييز",markupShow:"إظهار علامات المراجعة",markupHide:"إخفاء علامات المراجعة",markupClear:"مسح علامات المراجعة",panelTitle:"مقارنة",panelClose:"إغلاق اللوحة",tabResults:"النتائج",tabMarkups:"علامات المراجعة",groupByType:"حسب نوع العنصر",groupByKind:"حسب التغيير",kindAdded:"مضاف",kindDeleted:"محذوف",kindModified:"معدّل",diffDetails:"إظهار الاختلافات",diffColProperty:"الخاصية",diffColOld:"القديم",diffColNew:"الجديد",diffGeometryChanged:"تغيرت الهندسة",diffVisible:"مرئي",diffHidden:"مخفي",fieldObjectId:"المقبض",fieldLayer:"الطبقة",fieldColor:"اللون",fieldLineType:"نوع الخط",fieldLineWeight:"سُمك الخط",fieldLineTypeScale:"مقياس نوع الخط",fieldTransparency:"الشفافية",fieldThickness:"السماكة",fieldVisibility:"الرؤية",fieldStartPoint:"نقطة البداية",fieldEndPoint:"نقطة النهاية",fieldCenter:"المركز",fieldRadius:"نصف القطر",fieldStartAngle:"زاوية البداية",fieldEndAngle:"زاوية النهاية",fieldPosition:"الموضع",fieldLocation:"الموقع",fieldRotation:"الدوران",fieldHeight:"الارتفاع",fieldBlockName:"الكتلة",fieldScale:"المقياس",fieldText:"نص",fieldMtext:"نص متعدد الأسطر",fieldExtents:"الحدود",fieldGeometry:"الهندسة",noResults:"افتح رسمين للمقارنة",noMarkups:"لا توجد علامات مراجعة بعد",markupFromLeft:"اليسار",markupFromRight:"اليمين",comparing:"جارٍ المقارنة…",settingsTitle:"الإعدادات",settingsTabColors:"الألوان",settingsTabObjects:"الكائنات",settingsTabGeometry:"الهندسة",settingsUnchanged:"كائنات دون تغيير",settingsDeleted:"كائنات محذوفة",settingsAdded:"كائنات مضافة",settingsModified:"كائنات معدّلة",settingsSectionColors:"الألوان",settingsSectionObjects:"الكائنات",settingsIncludeHatch:"تضمين كائنات التظليل",settingsIncludeText:"تضمين كائنات النص",settingsSectionProps:"خصائص الكائن",settingsPropsHint:"لا تُحتسب تغييرات الخصائص غير المحددة (COMPAREPROPS). لا تُقارن تغيرات لون أو نوع خط جدول الطبقات.",settingsPropColor:"اللون",settingsPropLayer:"الطبقة",settingsPropLinetype:"نوع الخط",settingsPropLinetypeScale:"مقياس نوع الخط",settingsPropLineweight:"سُمك الخط",settingsPropTransparency:"الشفافية",settingsPropThickness:"السماكة",settingsSectionClouds:"غيوم المراجعة",settingsRcMargin:"الهامش",settingsSectionTolerance:"التسامح",settingsTolerance:"المنازل العشرية",settingsOk:"موافق",settingsCancel:"إلغاء",settingsReset:"إعادة تعيين",settingsClose:"إغلاق"},z="diffViewer";let ye=!1;function Rt(){ye||(L.mergeLocaleMessage("en",{[z]:Te}),L.mergeLocaleMessage("ja",{[z]:Lt}),L.mergeLocaleMessage("zh",{[z]:Mt}),L.mergeLocaleMessage("tr",{[z]:Dt}),L.mergeLocaleMessage("cs",{[z]:At}),L.mergeLocaleMessage("ar",{[z]:Vt}),ye=!0)}function m(a){return L.t(`${z}.${a}`,{fallback:Te[a]})}const Ot=[{role:"unchanged",labelKey:"settingsUnchanged"},{role:"deleted",labelKey:"settingsDeleted"},{role:"added",labelKey:"settingsAdded"},{role:"modified",labelKey:"settingsModified"}],Nt=[{bit:J,labelKey:"settingsPropColor"},{bit:$,labelKey:"settingsPropLayer"},{bit:Q,labelKey:"settingsPropLinetype"},{bit:ee,labelKey:"settingsPropLinetypeScale"},{bit:te,labelKey:"settingsPropLineweight"},{bit:ie,labelKey:"settingsPropTransparency"},{bit:se,labelKey:"settingsPropThickness"}];function F(a){return`#${(a&16777215).toString(16).padStart(6,"0")}`}function It(a){const e=/^#?([0-9a-f]{6})$/i.exec(a.trim());if(e)return parseInt(e[1],16)}const G=class E extends je{constructor(e){super({host:e.host??document.body,title:m("settingsTitle"),closeLabel:m("settingsClose"),titleId:"ml-diff-settings-title",dialogClassName:"ml-diff-settings-dialog",theme:e.theme}),this.pickers=new Map,this.hexLabels=new Map,this.propChecks=new Map,this.tabButtons=[],this.tabPanels=[],this._confirmed=!1,this.initial={colors:{...e.colors},sysVars:{...e.sysVars}},this.draft={colors:{...e.colors},sysVars:{...e.sysVars}},this.onChange=e.onChange,E.ensureSettingsStyles(),this.buildContent()}static open(e){var t;(t=E.openInstance)==null||t.close();const i=new E(e);return E.openInstance=i,i.show().then(()=>({confirmed:i._confirmed,colors:i._confirmed?{...i.draft.colors}:{...i.initial.colors},sysVars:i._confirmed?{...i.draft.sysVars}:{...i.initial.sysVars}}))}static dismiss(){var e;(e=E.openInstance)==null||e.close()}close(){E.openInstance===this&&(E.openInstance=null),super.close()}buildContent(){const e=[{id:"colors",label:m("settingsTabColors"),panel:this.buildColorsPanel()},{id:"objects",label:m("settingsTabObjects"),panel:this.buildObjectsPanel()},{id:"geometry",label:m("settingsTabGeometry"),panel:this.buildGeometryPanel()}],t=document.createElement("div");t.className="ml-diff-settings-tabs",t.setAttribute("role","tablist"),t.setAttribute("aria-label",m("settingsTitle"));const i=document.createElement("div");i.className="ml-diff-settings-panels",e.forEach((r,l)=>{const d=`ml-diff-settings-tab-${r.id}`,c=`ml-diff-settings-panel-${r.id}`,f=document.createElement("button");f.type="button",f.id=d,f.className="ml-diff-settings-tab",f.setAttribute("role","tab"),f.setAttribute("aria-controls",c),f.textContent=r.label,f.addEventListener("click",()=>this.selectTab(l)),f.addEventListener("keydown",h=>this.onTabKeyDown(h,l)),this.tabButtons.push(f),t.appendChild(f),r.panel.id=c,r.panel.classList.add("ml-diff-settings-panel"),r.panel.setAttribute("role","tabpanel"),r.panel.setAttribute("aria-labelledby",d),this.tabPanels.push(r.panel),i.appendChild(r.panel)}),this.bodyEl.append(t,i),this.selectTab(0);const n=document.createElement("button");n.type="button",n.className="ml-ui-dialog-btn ml-diff-settings-btn-secondary ml-diff-settings-reset",n.textContent=m("settingsReset"),n.addEventListener("click",()=>this.resetToDefaults());const o=document.createElement("button");o.type="button",o.className="ml-ui-dialog-btn ml-diff-settings-btn-secondary",o.textContent=m("settingsCancel"),o.addEventListener("click",()=>this.close());const s=document.createElement("button");s.type="button",s.className="ml-ui-dialog-btn",s.textContent=m("settingsOk"),s.addEventListener("click",()=>{this._confirmed=!0,this.close()}),this.footerEl.classList.add("ml-diff-settings-footer"),this.footerEl.append(n,o,s),this.focusAfterOpen(s)}buildColorsPanel(){const e=document.createElement("div");e.className="ml-diff-settings-list";for(const t of Ot)e.appendChild(this.createColorRow(t.role,m(t.labelKey)));return e}buildObjectsPanel(){const e=document.createElement("div"),t=document.createElement("div");t.className="ml-diff-settings-check-grid",this.hatchCheck=this.createCheckRow(t,m("settingsIncludeHatch"),this.draft.sysVars.comparehatch!==0,s=>{this.draft.sysVars.comparehatch=s?1:0,this.emitChange()}),this.textCheck=this.createCheckRow(t,m("settingsIncludeText"),this.draft.sysVars.comparetext!==0,s=>{this.draft.sysVars.comparetext=s?1:0,this.emitChange()});const i=document.createElement("div"),n=document.createElement("p");n.className="ml-diff-settings-hint",n.textContent=m("settingsPropsHint");const o=document.createElement("div");o.className="ml-diff-settings-check-grid";for(const s of Nt){const r=this.createCheckRow(o,m(s.labelKey),(this.draft.sysVars.compareprops&s.bit)!==0,l=>{l?this.draft.sysVars.compareprops|=s.bit:this.draft.sysVars.compareprops&=~s.bit,this.emitChange()});this.propChecks.set(s.bit,r)}return i.append(n,o),e.append(t,this.createSection(m("settingsSectionProps"),()=>i)),e}buildGeometryPanel(){const e=document.createElement("div"),t=this.createSliderRow(m("settingsTolerance"),this.draft.sysVars.comparetolerance,Se,Pe,s=>{this.draft.sysVars.comparetolerance=s,this.emitChange()});this.toleranceInput=t.input,this.toleranceValue=t.valueEl;const i=this.createSliderRow(m("settingsRcMargin"),this.draft.sysVars.comparercmargin,mt,pt,s=>{this.draft.sysVars.comparercmargin=s,this.emitChange()});this.marginInput=i.input,this.marginValue=i.valueEl;const n=document.createElement("div");n.appendChild(t.row);const o=document.createElement("div");return o.appendChild(i.row),e.append(this.createSection(m("settingsSectionTolerance"),()=>n),this.createSection(m("settingsSectionClouds"),()=>o)),e}selectTab(e){this.tabButtons.forEach((t,i)=>{const n=i===e;t.classList.toggle("is-active",n),t.setAttribute("aria-selected",n?"true":"false"),t.tabIndex=n?0:-1;const o=this.tabPanels[i];o&&(o.hidden=!n)})}onTabKeyDown(e,t){var i;const n=this.tabButtons.length-1;let o=t;if(e.key==="ArrowRight"||e.key==="ArrowDown")o=t===n?0:t+1;else if(e.key==="ArrowLeft"||e.key==="ArrowUp")o=t===0?n:t-1;else if(e.key==="Home")o=0;else if(e.key==="End")o=n;else return;e.preventDefault(),this.selectTab(o),(i=this.tabButtons[o])==null||i.focus()}createSection(e,t){const i=document.createElement("section");i.className="ml-diff-settings-section";const n=document.createElement("h3");return n.className="ml-diff-settings-heading",n.textContent=e,i.append(n,t()),i}createColorRow(e,t){const i=document.createElement("label");i.className="ml-diff-settings-row";const n=document.createElement("span");n.className="ml-diff-settings-label",n.textContent=t;const o=document.createElement("span");o.className="ml-diff-settings-control";const s=document.createElement("span");s.className="ml-diff-settings-hex",s.textContent=F(this.draft.colors[e]),this.hexLabels.set(e,s);const r=document.createElement("input");return r.type="color",r.className="ml-diff-settings-color",r.value=F(this.draft.colors[e]),r.setAttribute("aria-label",t),r.addEventListener("input",()=>{const l=It(r.value);l!=null&&(this.draft.colors[e]=l,s.textContent=F(l),this.emitChange())}),this.pickers.set(e,r),o.append(s,r),i.append(n,o),i}createCheckRow(e,t,i,n){const o=document.createElement("label");o.className="ml-diff-settings-check-item";const s=document.createElement("input");s.type="checkbox",s.className="ml-diff-settings-check",s.checked=i,s.addEventListener("change",()=>n(s.checked));const r=document.createElement("span");return r.className="ml-diff-settings-label",r.textContent=t,o.append(s,r),e.appendChild(o),s}createSliderRow(e,t,i,n,o){const s=document.createElement("label");s.className="ml-diff-settings-slider-row";const r=document.createElement("span");r.className="ml-diff-settings-slider-head";const l=document.createElement("span");l.className="ml-diff-settings-label",l.textContent=e;const d=document.createElement("span");d.className="ml-diff-settings-slider-value",d.textContent=String(t),r.append(l,d);const c=document.createElement("input");return c.type="range",c.className="ml-diff-settings-slider",c.min=String(i),c.max=String(n),c.step="1",c.value=String(t),c.setAttribute("aria-label",e),c.addEventListener("input",()=>{const f=Number(c.value);d.textContent=String(f),o(f)}),s.append(r,c),{row:s,input:c,valueEl:d}}resetToDefaults(){Object.assign(this.draft.colors,Ce);const e=le();this.draft.sysVars.compareprops=e.compareprops??ne,this.draft.sysVars.comparehatch=e.comparehatch??oe,this.draft.sysVars.comparercmargin=e.comparercmargin??re,this.draft.sysVars.comparetext=e.comparetext??ae,this.draft.sysVars.comparetolerance=e.comparetolerance??X;for(const t of this.pickers.keys()){const i=F(this.draft.colors[t]),n=this.pickers.get(t),o=this.hexLabels.get(t);n&&(n.value=i),o&&(o.textContent=i)}this.hatchCheck&&(this.hatchCheck.checked=this.draft.sysVars.comparehatch!==0),this.textCheck&&(this.textCheck.checked=this.draft.sysVars.comparetext!==0);for(const[t,i]of this.propChecks)i.checked=(this.draft.sysVars.compareprops&t)!==0;this.marginInput&&this.marginValue&&(this.marginInput.value=String(this.draft.sysVars.comparercmargin),this.marginValue.textContent=String(this.draft.sysVars.comparercmargin)),this.toleranceInput&&this.toleranceValue&&(this.toleranceInput.value=String(this.draft.sysVars.comparetolerance),this.toleranceValue.textContent=String(this.draft.sysVars.comparetolerance)),this.emitChange()}emitChange(){var e;(e=this.onChange)==null||e.call(this,{colors:{...this.draft.colors},sysVars:{...this.draft.sysVars}})}static ensureSettingsStyles(){if(E.settingsStylesInjected)return;if(document.getElementById(E.settingsStyleId)){E.settingsStylesInjected=!0;return}const e=document.createElement("style");e.id=E.settingsStyleId,e.textContent=`
.ml-ui-dialog.ml-diff-settings-dialog {
  width: min(460px, calc(100vw - 32px));
  max-height: min(560px, calc(100vh - 32px));
}

.ml-ui-dialog.ml-diff-settings-dialog .ml-ui-dialog-body {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: min(400px, calc(100vh - 180px));
  padding-top: 0;
}

.ml-diff-settings-tabs {
  flex: 0 0 auto;
  display: flex;
  gap: 2px;
  margin: 0 -4px 8px;
  border-bottom: 1px solid var(--ml-ui-border, #4c4d4f);
}

.ml-diff-settings-tab {
  flex: 1 1 0;
  padding: 8px 6px 7px;
  border: none;
  border-radius: 0;
  background: transparent;
  color: var(--ml-ui-text-muted, #cfd3dc);
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}

.ml-diff-settings-tab.is-active {
  color: var(--ml-ui-text, #e5eaf3);
  font-weight: 600;
  box-shadow: inset 0 -2px 0 var(--ml-ui-accent, var(--ml-brand));
}

.ml-diff-settings-panels {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}

.ml-diff-settings-panel[hidden] {
  display: none;
}

.ml-diff-settings-section + .ml-diff-settings-section {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--ml-ui-border, #4c4d4f);
}

.ml-diff-settings-list + .ml-diff-settings-section {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--ml-ui-border, #4c4d4f);
}

.ml-diff-settings-heading {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--ml-ui-text-muted, #cfd3dc);
}

.ml-diff-settings-hint {
  margin: 0 0 8px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--ml-ui-text-muted, #cfd3dc);
}

.ml-diff-settings-list {
  display: flex;
  flex-direction: column;
}

.ml-diff-settings-check-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  column-gap: 12px;
  row-gap: 2px;
}

.ml-diff-settings-check-item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 5px 0;
  cursor: pointer;
}

.ml-diff-settings-check-item .ml-diff-settings-label {
  line-height: 1.3;
}

.ml-diff-settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
  cursor: pointer;
}

.ml-diff-settings-row + .ml-diff-settings-row {
  border-top: 1px solid var(--ml-ui-border, #4c4d4f);
}

.ml-diff-settings-label {
  font-size: 13px;
  color: var(--ml-ui-text, #e5eaf3);
}

.ml-diff-settings-control {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.ml-diff-settings-hex {
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  color: var(--ml-ui-text-muted, #cfd3dc);
  min-width: 4.6em;
  text-align: right;
}

.ml-diff-settings-color {
  width: 40px;
  height: 28px;
  padding: 0;
  border: 1px solid var(--ml-ui-border, #4c4d4f);
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
}

.ml-diff-settings-color::-webkit-color-swatch-wrapper {
  padding: 2px;
}

.ml-diff-settings-color::-webkit-color-swatch {
  border: none;
  border-radius: 3px;
}

.ml-diff-settings-color::-moz-color-swatch {
  border: none;
  border-radius: 3px;
}

.ml-diff-settings-check {
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  accent-color: var(--ml-ui-accent, var(--ml-brand));
  cursor: pointer;
}

.ml-diff-settings-slider-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 4px 0 8px;
}

.ml-diff-settings-slider-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.ml-diff-settings-slider-value {
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  color: var(--ml-ui-text-muted, #cfd3dc);
}

.ml-diff-settings-slider {
  width: 100%;
  accent-color: var(--ml-ui-accent, var(--ml-brand));
}

.ml-diff-settings-footer {
  align-items: center;
}

.ml-diff-settings-reset {
  margin-right: auto;
}

.ml-ui-dialog-btn.ml-diff-settings-btn-secondary {
  background: transparent;
  color: var(--ml-ui-text, #e5eaf3);
  border-color: var(--ml-ui-border, #4c4d4f);
}
`.trim(),document.head.appendChild(e),E.settingsStylesInjected=!0}};G.settingsStyleId="ml-diff-settings-dialog-styles-v3",G.settingsStylesInjected=!1,G.openInstance=null;let be=G;const Bt=`
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
</svg>
`.trim(),Ft=`
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z" />
</svg>
`.trim(),Ht=`
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6" />
</svg>
`.trim(),jt=`
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3 5.625C3 5.004 3.504 4.5 4.125 4.5h15.75c.621 0 1.125.504 1.125 1.125v12.75c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 18.375V5.625Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 4.5v15" />
</svg>
`.trim(),zt=`
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
</svg>
`.trim(),Ut=`
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
</svg>
`.trim(),Kt=`
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0Z" />
</svg>
`.trim(),_t='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" aria-hidden="true"><path fill="currentColor" d="M512 704a192 192 0 1 0 0-384 192 192 0 0 0 0 384m0 64a256 256 0 1 1 0-512 256 256 0 0 1 0 512m0-704a32 32 0 0 1 32 32v64a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32m0 768a32 32 0 0 1 32 32v64a32 32 0 1 1-64 0v-64a32 32 0 0 1 32-32m384-384a32 32 0 0 1-32 32h-64a32 32 0 0 1 0-64h64a32 32 0 0 1 32 32M96 512a32 32 0 0 1 32-32H192a32 32 0 1 1 0 64H128a32 32 0 0 1-32-32m741.056-266.944a32 32 0 0 1-45.248 45.248l-45.248-45.248a32 32 0 0 1 45.248-45.248zm-589.056 589.056a32 32 0 0 1-45.248 45.248l-45.248-45.248a32 32 0 0 1 45.248-45.248zm589.056 0-45.248 45.248a32 32 0 0 1-45.248-45.248l45.248-45.248a32 32 0 0 1 45.248 45.248M247.936 201.984a32 32 0 0 1-45.248 45.248l-45.248-45.248a32 32 0 0 1 45.248-45.248z"/></svg>',Gt='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" aria-hidden="true"><path fill="currentColor" d="M240.448 240.448a384 384 0 1 0 543.104 543.104 476.16 476.16 0 0 1-543.104-543.104"/></svg>',$t=`
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.06 2.25h9.44a3.75 3.75 0 1 0-.3-7.49 5.25 5.25 0 0 0-10.12 1.5A4.5 4.5 0 0 0 2.25 15Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 3.75 16.82 4.61 17.68 4.93 16.82 5.25 16.5 6.11 16.18 5.25 15.32 4.93 16.18 4.61 16.5 3.75Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5 20.5 8.16 21.16 8.41 20.5 8.66 20.25 9.32 20 8.66 19.34 8.41 20 8.16 20.25 7.5Z" />
</svg>
`.trim(),Xt=`
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
</svg>
`.trim();function Yt(){const a=document.createElement("span");return a.className="ml-diff-icon",a.innerHTML=Bt,a}function Wt(){const a=document.createElement("span");return a.className="ml-diff-empty-icon",a.innerHTML=Xt,a}const ve="ml-diff-viewer-styles-v2",qt=`
.ml-diff-root {
  --ml-diff-bg: var(--ml-ui-bg, #1d1e1f);
  --ml-diff-panel: var(--ml-ui-bg, #1d1e1f);
  --ml-diff-border: var(--ml-ui-border, #4c4d4f);
  --ml-diff-text: var(--ml-ui-text, #e5eaf3);
  --ml-diff-muted: var(--ml-ui-text-muted, #cfd3dc);
  --ml-diff-focus: var(--ml-ui-accent, var(--ml-brand));
  --ml-diff-hover: color-mix(in srgb, var(--ml-diff-text) 10%, transparent);
  --ml-diff-added: #22c55e;
  --ml-diff-deleted: #e11d48;
  --ml-diff-modified: #f59e0b;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  color: var(--ml-diff-text);
  background: var(--ml-diff-bg);
  font-family: "Noto Sans JP Variable", "Noto Sans JP", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.ml-diff-root *,
.ml-diff-root *::before,
.ml-diff-root *::after {
  box-sizing: border-box;
}

.ml-diff-toolbar {
  position: relative;
  z-index: 5;
  flex: 0 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.55rem;
  background: var(--ml-diff-panel);
  border-bottom: 1px solid var(--ml-diff-border);
}

.ml-diff-toolbar-group {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  padding-right: 0.45rem;
  margin-right: 0.25rem;
  border-right: 1px solid var(--ml-diff-border);
}

.ml-diff-toolbar-group:last-child {
  border-right: none;
  margin-right: 0;
  padding-right: 0;
}

.ml-diff-toolbar-locale {
  margin-left: auto;
  gap: 0.35rem;
}

.ml-diff-tool-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  min-height: 1.85rem;
  padding: 0.2rem 0.5rem;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--ml-diff-muted);
  font-size: 0.75rem;
  cursor: pointer;
}

.ml-diff-tool-btn.is-icon {
  width: 1.85rem;
  padding: 0.2rem;
}

.ml-diff-root.is-overlay .ml-diff-sync-btn {
  display: none;
}

.ml-diff-tool-btn:hover,
.ml-diff-tool-btn:focus-visible {
  color: var(--ml-diff-text);
  background: var(--ml-diff-hover);
  outline: none;
}

.ml-diff-tool-btn.is-active {
  color: var(--ml-diff-text);
  border-color: var(--ml-diff-focus);
  background: color-mix(in srgb, var(--ml-diff-focus) 18%, transparent);
}

.ml-diff-tool-btn:disabled {
  opacity: 0.4;
  cursor: default;
  pointer-events: none;
}

.ml-diff-tool-btn svg {
  width: 1rem;
  height: 1rem;
  display: block;
}

.ml-diff-lang-select {
  position: relative;
  width: 110px;
}

.ml-diff-lang-select__trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 100%;
  height: 24px;
  padding: 0 22px 0 8px;
  border: 1px solid var(--ml-diff-border);
  border-radius: 4px;
  background: var(--ml-diff-bg);
  color: var(--ml-diff-text);
  font-size: 12px;
  font-family: inherit;
  line-height: 22px;
  text-align: left;
  cursor: pointer;
}

.ml-diff-lang-select__trigger:hover,
.ml-diff-lang-select.is-open .ml-diff-lang-select__trigger {
  border-color: var(--ml-diff-focus);
}

.ml-diff-lang-select__trigger:focus-visible {
  outline: none;
  border-color: var(--ml-diff-focus);
  box-shadow: 0 0 0 1px var(--ml-diff-focus);
}

.ml-diff-lang-select__label {
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ml-diff-lang-select__caret {
  position: absolute;
  right: 6px;
  top: 50%;
  width: 10px;
  height: 10px;
  margin-top: -5px;
  color: var(--ml-diff-muted);
  pointer-events: none;
  transition: transform 0.15s ease;
}

.ml-diff-lang-select.is-open .ml-diff-lang-select__caret {
  transform: rotate(180deg);
}

.ml-diff-lang-select__menu {
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  z-index: 40;
  min-width: 100%;
  padding: 4px 0;
  border: 1px solid var(--ml-diff-border);
  border-radius: 4px;
  background: var(--ml-diff-panel);
  box-shadow: var(--ml-ui-shadow, 0 6px 16px rgba(0, 0, 0, 0.45));
}

.ml-diff-lang-select__option {
  display: block;
  width: 100%;
  margin: 0;
  padding: 5px 12px;
  border: none;
  background: transparent;
  color: var(--ml-diff-text);
  font-size: 12px;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
}

.ml-diff-lang-select__option:hover {
  background: var(--ml-diff-hover);
}

.ml-diff-lang-select__option.is-selected {
  color: var(--ml-diff-text);
  background: color-mix(in srgb, var(--ml-diff-focus) 22%, transparent);
  font-weight: 600;
}

.ml-diff-body {
  flex: 1 1 auto;
  display: flex;
  min-height: 0;
  min-width: 0;
}

.ml-diff-panes {
  flex: 1 1 auto;
  display: flex;
  min-width: 0;
  min-height: 0;
}

.ml-diff-pane {
  flex: 1 1 50%;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border: 2px solid transparent;
}

.ml-diff-pane.is-empty {
  cursor: pointer;
}

.ml-diff-root.is-overlay .ml-diff-pane[data-side='right'] {
  display: none;
}

.ml-diff-root.is-overlay .ml-diff-pane[data-side='left'] {
  flex: 1 1 100%;
}

.ml-diff-pane.is-focused {
  position: relative;
  z-index: 1;
  border-color: var(--ml-diff-focus);
}

.ml-diff-pane + .ml-diff-pane {
  border-left: 1px solid var(--ml-diff-border);
}

/* Adjacent-sibling divider must not replace the focused pane's left edge. */
.ml-diff-pane + .ml-diff-pane.is-focused {
  border-left: 2px solid var(--ml-diff-focus);
}

.ml-diff-header {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.45rem 0.35rem 0.7rem;
  background: var(--ml-diff-panel);
  border-bottom: 1px solid var(--ml-diff-border);
}

.ml-diff-title {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.85rem;
}

.ml-diff-title.is-empty {
  color: var(--ml-diff-muted);
}

.ml-diff-open {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.85rem;
  height: 1.85rem;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--ml-diff-muted);
  cursor: pointer;
}

.ml-diff-open:hover,
.ml-diff-open:focus-visible {
  color: var(--ml-diff-text);
  background: var(--ml-diff-hover);
  outline: none;
}

.ml-diff-open svg,
.ml-diff-icon svg {
  display: block;
  width: 1.15rem;
  height: 1.15rem;
}

.ml-diff-file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.ml-diff-canvas-slot {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  background: #000;
}

.ml-diff-canvas {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 1;
}

.ml-diff-empty {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  color: var(--ml-diff-muted);
  cursor: pointer;
}

.ml-diff-empty.is-hidden {
  display: none;
}

.ml-diff-empty-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.55rem;
  max-width: 18rem;
  padding: 1.75rem 1.5rem;
  border: 1px dashed var(--ml-diff-border);
  border-radius: 10px;
  text-align: center;
  background: color-mix(in srgb, var(--ml-diff-panel) 70%, transparent);
}

.ml-diff-empty-icon {
  color: var(--ml-diff-muted);
}

.ml-diff-empty-icon svg {
  display: block;
  width: 2.25rem;
  height: 2.25rem;
}

.ml-diff-empty-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--ml-diff-text);
}

.ml-diff-empty-hint {
  font-size: 0.8rem;
  line-height: 1.4;
  color: var(--ml-diff-muted);
}

.ml-diff-empty-error {
  font-size: 0.8rem;
  color: #fca5a5;
}

.ml-diff-empty-error.is-hidden,
.ml-diff-banner.is-hidden {
  display: none;
}

.ml-diff-banner {
  position: absolute;
  left: 50%;
  top: 0.7rem;
  z-index: 4;
  transform: translateX(-50%);
  max-width: calc(100% - 1.5rem);
  padding: 0.35rem 0.7rem;
  border-radius: 6px;
  background: #7f1d1d;
  color: #fecaca;
  font-size: 0.8rem;
  pointer-events: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ml-diff-pane.is-dragover .ml-diff-canvas-slot::after {
  content: '';
  position: absolute;
  inset: 0.55rem;
  z-index: 3;
  pointer-events: none;
  border: 2px dashed var(--ml-diff-focus);
  border-radius: 8px;
  background: color-mix(in srgb, var(--ml-diff-focus) 12%, transparent);
}

.ml-diff-pane.is-dragover .ml-diff-empty-card {
  border-color: var(--ml-diff-focus);
  background: color-mix(in srgb, var(--ml-diff-focus) 12%, transparent);
}

.ml-diff-pane:not(.is-focused) canvas {
  pointer-events: none;
}

.ml-diff-root.is-overlay .ml-diff-pane canvas {
  pointer-events: auto;
}

.ml-diff-sidepanel {
  flex: 0 0 280px;
  max-width: 40%;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--ml-diff-border);
  background: var(--ml-diff-panel);
}

.ml-diff-sidepanel.is-collapsed {
  display: none;
}

.ml-diff-sidepanel-header {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.6rem;
  border-bottom: 1px solid var(--ml-diff-border);
}

.ml-diff-sidepanel-title {
  flex: 1 1 auto;
  font-size: 0.85rem;
  font-weight: 600;
}

.ml-diff-sidepanel-tabs {
  flex: 0 0 auto;
  display: flex;
  border-bottom: 1px solid var(--ml-diff-border);
}

.ml-diff-sidepanel-tab {
  flex: 1 1 50%;
  padding: 0.45rem;
  border: none;
  background: transparent;
  color: var(--ml-diff-muted);
  font-size: 0.8rem;
  cursor: pointer;
}

.ml-diff-sidepanel-tab.is-active {
  color: var(--ml-diff-text);
  box-shadow: inset 0 -2px 0 var(--ml-diff-focus);
}

.ml-diff-sidepanel-toolbar {
  flex: 0 0 auto;
  display: flex;
  gap: 0.35rem;
  padding: 0.4rem 0.55rem;
  border-bottom: 1px solid var(--ml-diff-border);
}

.ml-diff-sidepanel-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  padding: 0.4rem 0;
}

.ml-diff-group {
  margin-bottom: 0.35rem;
}

.ml-diff-group-title {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  width: 100%;
  padding: 0.3rem 0.7rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--ml-diff-muted);
  cursor: pointer;
  list-style: none;
  user-select: none;
}

.ml-diff-group-title::-webkit-details-marker,
.ml-diff-group-title::marker {
  display: none;
  content: none;
}

.ml-diff-group-title::before {
  content: '';
  flex: 0 0 auto;
  width: 0.35rem;
  height: 0.35rem;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: rotate(-45deg);
  transition: transform 0.15s ease;
}

.ml-diff-group[open] .ml-diff-group-title::before {
  transform: rotate(45deg);
}

.ml-diff-group-title:hover,
.ml-diff-group-title:focus-visible {
  color: var(--ml-diff-text);
  background: var(--ml-diff-hover);
  outline: none;
}

.ml-diff-result-row {
  display: flex;
  align-items: stretch;
  width: 100%;
  border-left: 3px solid transparent;
}

.ml-diff-result-row[data-kind='added'] {
  border-left-color: var(--ml-diff-added);
}

.ml-diff-result-row[data-kind='deleted'] {
  border-left-color: var(--ml-diff-deleted);
}

.ml-diff-result-row[data-kind='modified'] {
  border-left-color: var(--ml-diff-modified);
}

.ml-diff-result-item,
.ml-diff-markup-item {
  display: block;
  width: 100%;
  padding: 0.4rem 0.7rem;
  border: none;
  border-left: 3px solid transparent;
  background: transparent;
  color: var(--ml-diff-text);
  text-align: left;
  font-size: 0.8rem;
  cursor: pointer;
}

.ml-diff-result-row .ml-diff-result-item {
  flex: 1 1 auto;
  min-width: 0;
  border-left: none;
  padding-right: 0.35rem;
}

.ml-diff-result-label {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ml-diff-result-info {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.7rem;
  margin: 0.2rem 0.35rem 0.2rem 0;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--ml-diff-muted);
  cursor: pointer;
}

.ml-diff-result-info svg {
  width: 0.95rem;
  height: 0.95rem;
  display: block;
}

.ml-diff-result-info:hover,
.ml-diff-result-info:focus-visible,
.ml-diff-result-info.is-open {
  color: var(--ml-diff-text);
  background: var(--ml-diff-hover);
  outline: none;
}

.ml-diff-result-item:hover,
.ml-diff-markup-item:hover,
.ml-diff-result-item.is-active,
.ml-diff-result-row:hover,
.ml-diff-result-row.is-active {
  background: var(--ml-diff-hover);
}

.ml-diff-result-row:hover .ml-diff-result-item,
.ml-diff-result-row.is-active .ml-diff-result-item {
  background: transparent;
}

.ml-diff-result-item[data-kind='added'] {
  border-left-color: var(--ml-diff-added);
}

.ml-diff-result-item[data-kind='deleted'] {
  border-left-color: var(--ml-diff-deleted);
}

.ml-diff-result-item[data-kind='modified'] {
  border-left-color: var(--ml-diff-modified);
}

.ml-diff-result-meta,
.ml-diff-markup-meta {
  display: block;
  margin-top: 0.15rem;
  font-size: 0.7rem;
  color: var(--ml-diff-muted);
}

.ml-diff-empty-list {
  padding: 1rem 0.8rem;
  color: var(--ml-diff-muted);
  font-size: 0.8rem;
  text-align: center;
}

.ml-diff-change-popover {
  position: fixed;
  z-index: 40;
  min-width: 220px;
  max-width: min(360px, calc(100vw - 16px));
  max-height: min(320px, 70vh);
  overflow: auto;
  padding: 0.45rem 0.5rem;
  border: 1px solid var(--ml-diff-border);
  border-radius: 6px;
  background: var(--ml-diff-panel);
  box-shadow: 0 8px 24px color-mix(in srgb, #000 35%, transparent);
  color: var(--ml-diff-text);
  font-size: 0.72rem;
}

.ml-diff-change-note {
  padding: 0.2rem 0.15rem;
  color: var(--ml-diff-muted);
}

.ml-diff-change-table {
  width: 100%;
  border-collapse: collapse;
}

.ml-diff-change-table th,
.ml-diff-change-table td {
  padding: 0.22rem 0.35rem;
  text-align: left;
  vertical-align: top;
  word-break: break-word;
}

.ml-diff-change-table thead th {
  color: var(--ml-diff-muted);
  font-weight: 600;
  font-size: 0.68rem;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--ml-diff-border);
}

.ml-diff-change-table tbody th {
  width: 28%;
  font-weight: 600;
  color: var(--ml-diff-text);
}

.ml-diff-change-old {
  color: var(--ml-diff-deleted);
}

.ml-diff-change-new {
  color: var(--ml-diff-added);
}
`.trim();function Zt(){if(document.getElementById(ve))return;const a=document.createElement("style");a.id=ve,a.textContent=qt,document.head.appendChild(a)}const ke={minimumChunkSize:1e3,mode:Le.Write,progressiveRendering:!1,sysVars:{lwdisplay:!1}},Jt=/\.(dwg|dxf)$/i,xe="cad-diff-viewer:changeset",Qt=200,ei=[{command:"markupcloud",labelKey:"markupCloud",icon:Me},{command:"markuprect",labelKey:"markupRect",icon:De},{command:"markupcircle",labelKey:"markupCircle",icon:Ae},{command:"markupcallout",labelKey:"markupCallout",icon:Ve},{command:"markuparrow",labelKey:"markupArrow",icon:Re},{command:"markupline",labelKey:"markupLine",icon:Oe},{command:"markuptext",labelKey:"markupText",icon:Ne},{command:"markupstamp",labelKey:"markupStamp",icon:Ie}],Ee=[{locale:"en",label:"English"},{locale:"ja",label:"日本語"},{locale:"zh",label:"简体中文"},{locale:"tr",label:"Türkçe"},{locale:"cs",label:"Čeština"},{locale:"ar",label:"العربية"}],ti='<svg class="ml-diff-lang-select__caret" viewBox="0 0 12 12" aria-hidden="true"><path fill="currentColor" d="M2.4 4.2 6 8.1l3.6-3.9"/></svg>';function ii(a){var e;return((e=Ee.find(t=>t.locale===a))==null?void 0:e.label)??"English"}const si={objectId:"fieldObjectId",layer:"fieldLayer",color:"fieldColor",lineType:"fieldLineType",lineWeight:"fieldLineWeight",lineTypeScale:"fieldLineTypeScale",transparency:"fieldTransparency",thickness:"fieldThickness",visibility:"fieldVisibility",startPoint:"fieldStartPoint",endPoint:"fieldEndPoint",center:"fieldCenter",radius:"fieldRadius",startAngle:"fieldStartAngle",endAngle:"fieldEndAngle",position:"fieldPosition",location:"fieldLocation",rotation:"fieldRotation",height:"fieldHeight",blockName:"fieldBlockName",scale:"fieldScale",text:"fieldText",mtext:"fieldMtext",extents:"fieldExtents",geometry:"fieldGeometry"};function ni(a){const e=si[a];return e?m(e):a}function we(a,e){return e===""?"—":a==="visibility"?m(e==="true"?"diffVisible":"diffHidden"):e}function w(){try{return _.instance}catch{throw new Error("AcApDiffViewer is not initialized")}}function oi(a){return Jt.test(a)}function ri(a){return{...Ce,...a}}class di{constructor(e){this.markupButtons=[],this.leftDragDepth=0,this.rightDragDepth=0,this.bannerTimers=new Map,this.resultGroupMode="kind",this.collapsedResultGroups=new Set,this.activeTab="results",this.navIndex=-1,this.disposed=!1,this.localeMenuOpen=!1,this.diffPopoverPinned=!1,this.diffPopoverHideTimer=0,this.activateSeq=0,this.activateTail=Promise.resolve(),this.compareSeq=0,this.overlayRegisterSeq=0,this.sysVarPreviewTimer=0,this.lastPointerSide="left",this.viewsSynced=!1,this.viewSyncLock=!1,this.viewSyncLeader="left",this.viewSyncFollowOpen=!1,this.viewSyncFromUser=!1,this.handleLocaleChanged=()=>{this.disposed||(this.setLocaleMenuOpen(!1),this.syncChrome(),this.syncViewModeUi(),this.syncPanelUi(),this.renderResultsList(),this.refreshMarkupsList())},this.handleDocumentPointerDown=s=>{var r;s.target instanceof Node&&(this.localeMenuOpen&&!this.localeSelectHost.contains(s.target)&&this.setLocaleMenuOpen(!1),this.diffPopoverPinned&&(this.diffPopover.contains(s.target)||(r=this.diffPopoverAnchor)!=null&&r.contains(s.target)||this.hideDiffPopover(!0)))},this.handleDiffPopoverDismiss=()=>{this.hideDiffPopover(!0)},this.cancelDiffPopoverHide=()=>{this.diffPopoverHideTimer&&(window.clearTimeout(this.diffPopoverHideTimer),this.diffPopoverHideTimer=0)},this.scheduleDiffPopoverHide=()=>{this.diffPopoverPinned||(this.cancelDiffPopoverHide(),this.diffPopoverHideTimer=window.setTimeout(()=>{this.diffPopoverHideTimer=0,this.hideDiffPopover(!1)},180))},this.markViewSyncUserInput=()=>{this.viewSyncFromUser=!0},this.handleLeftViewChanged=()=>{this.onPaneViewChanged("left")},this.handleRightViewChanged=()=>{this.onPaneViewChanged("right")},this.options=e,this.colors=ri(e.compareColors),this.sessionSysVars=le(),this.uiTheme=e.theme??"dark",this.viewMode=e.viewMode??"side-by-side",this.sidePanelOpen=e.sidePanelOpen!==!1,Rt(),Zt();let t=!1;try{_.instance,t=!0}catch{t=!1}if(t)throw new Error("AcApDiffViewer needs its own AcApDocManager. Create it on a page that does not already host a CAD viewer.");this.root=document.createElement("div"),this.root.className="ml-diff-root",ce(this.uiTheme,this.root),this.toolbar=document.createElement("div"),this.toolbar.className="ml-diff-toolbar",this.body=document.createElement("div"),this.body.className="ml-diff-body",this.panesHost=document.createElement("div"),this.panesHost.className="ml-diff-panes",this.leftUi=this.createPane("left"),this.rightUi=this.createPane("right"),this.panesHost.append(this.leftUi.pane,this.rightUi.pane);const i=this.createChrome();this.btnSideBySide=i.btnSideBySide,this.btnOverlay=i.btnOverlay,this.btnSyncViews=i.btnSyncViews,this.btnTogglePanel=i.btnTogglePanel,this.btnPrev=i.btnPrev,this.btnNext=i.btnNext,this.btnSettings=i.btnSettings,this.btnMarkupVis=i.btnMarkupVis,this.btnClearMarkups=i.btnClearMarkups,this.btnTheme=i.btnTheme,this.sidePanel=i.sidePanel,this.resultsBody=i.resultsBody,this.markupsBody=i.markupsBody,this.tabResults=i.tabResults,this.tabMarkups=i.tabMarkups,this.groupByKindBtn=i.groupByKindBtn,this.groupByTypeBtn=i.groupByTypeBtn,this.panelTitle=i.panelTitle,this.localeTrigger=i.localeTrigger,this.localeMenu=i.localeMenu,this.localeSelectHost=i.localeSelectHost,this.diffPopover=document.createElement("div"),this.diffPopover.className="ml-diff-change-popover",this.diffPopover.hidden=!0,this.diffPopover.setAttribute("role","tooltip"),this.diffPopover.addEventListener("mouseenter",this.cancelDiffPopoverHide),this.diffPopover.addEventListener("mouseleave",this.scheduleDiffPopoverHide),this.toolbar.append(...i.toolbarChildren),this.body.append(this.panesHost,this.sidePanel),this.root.append(this.toolbar,this.body,this.diffPopover),e.container.appendChild(this.root);const n=e.openDocumentDefaults??ke;_.createInstance({container:this.leftUi.canvas,busyIndicatorHost:this.leftUi.canvas,autoResize:!0,baseUrl:e.baseUrl,builtinOpenFileDialog:!1,openDocumentDefaults:n,webworkerFileUrls:e.webworkerFileUrls});const o=_.instance;this.disableEntitySelection(o.mainView),this.disableEntitySelection(o.ensureSplitView(this.rightUi.canvas)),this.bindViewSyncListeners(),L.events.localeChanged.addEventListener(this.handleLocaleChanged),document.addEventListener("pointerdown",this.handleDocumentPointerDown),this.resultsBody.addEventListener("scroll",this.handleDiffPopoverDismiss),window.addEventListener("resize",this.handleDiffPopoverDismiss),this.syncChrome(),this.syncViewModeUi(),this.syncPanelUi(),this.syncCompareColorVars()}get leftDocument(){return this.liveDoc(this.leftDoc)}get rightDocument(){return this.liveDoc(this.rightDoc)}get activeSide(){return w().curDocument===this.rightDocument?"right":"left"}get compareResultSnapshot(){return this.compareResult}async openDocument(e,t,i,n){var o,s,r,l;this.assertAlive();const d=w(),c=this.viewMode==="overlay";c&&await this.exitOverlayMode();const f=e==="left"?this.leftDoc:this.rightDoc,h=e==="left"?this.rightDoc:this.leftDoc;if(f&&d.sessionFor(f)&&!f.isReusableUntitled&&f!==h&&await d.closeDocument(f),this.uiFor(e).empty.classList.add("is-hidden"),this.clearPaneError(e),!await d.openDocument(t,i,n??this.options.openDocumentDefaults??ke,this.viewFor(e)))return(s=(o=this.options.events)==null?void 0:o.failed)==null||s.call(o,e,t),this.syncChrome(),c&&(await this.enterOverlayMode(),this.syncViewModeUi()),!1;const p=d.curDocument;return e==="left"?this.leftDoc=p:this.rightDoc=p,this.adoptCompareSysVarsAfterOpen(p,!!this.liveDoc(h)),this.syncChrome(),(l=(r=this.options.events)==null?void 0:r.opened)==null||l.call(r,e,p),this.syncFollowerAfterOpen(e),this.applyMarkupVisibility(Y()),await this.runCompareAndApply(),!0}async activateSide(e){this.assertAlive();const t=e==="left"?this.leftDocument:this.rightDocument;if(!t)return!1;if(w().curDocument===t)return this.applyFocusClass(e),!0;const i=++this.activateSeq,n=async()=>{var s,r;if(this.disposed||i!==this.activateSeq)return!1;const l=e==="left"?this.leftDocument:this.rightDocument;if(!l)return!1;const d=w();if(d.curDocument===l)return this.applyFocusClass(e),!0;const c=await d.activateDocument(l);return this.disposed||i!==this.activateSeq?(this.disposed||this.syncFocusRings(),!1):(this.applyFocusClass(e),this.refreshMarkupsList(),c&&((r=(s=this.options.events)==null?void 0:s.focus)==null||r.call(s,e)),c)},o=this.activateTail.then(n,n);return this.activateTail=o.then(()=>{},()=>{}),o}async setViewMode(e){this.assertAlive(),e!==this.viewMode&&(e==="overlay"?await this.enterOverlayMode():await this.exitOverlayMode(),this.viewMode=e,this.syncViewModeUi(),e==="side-by-side"&&this.applyViewSyncFromLeader(),await this.applyCompareDisplay(),window.dispatchEvent(new Event("resize")))}setSidePanelOpen(e){this.sidePanelOpen=e,this.syncPanelUi(),window.dispatchEvent(new Event("resize"))}async goToDifference(e){var t;const i=((t=this.compareResult)==null?void 0:t.navigation)??[];if(i.length===0)return;let n;if(this.navIndex<0)if(e>0)n=0;else if(e<0)n=i.length-1;else return;else if(n=this.navIndex+e,n<0||n>=i.length)return;this.navIndex=n;const o=i[this.navIndex];this.collapsedResultGroups.delete(this.resultGroupStorageKeyForHit(o)),await this.focusHit(o),this.renderResultsList()}async destroy(){if(!this.disposed){this.disposed=!0,this.compareSeq++,this.overlayRegisterSeq++,this.clearSysVarPreviewTimer(),be.dismiss(),L.events.localeChanged.removeEventListener(this.handleLocaleChanged),document.removeEventListener("pointerdown",this.handleDocumentPointerDown),this.resultsBody.removeEventListener("scroll",this.handleDiffPopoverDismiss),window.removeEventListener("resize",this.handleDiffPopoverDismiss),this.hideDiffPopover(!0),this.unbindViewSyncListeners();for(const e of this.bannerTimers.values())window.clearTimeout(e);this.bannerTimers.clear();try{this.overlayId&&w().removeOverlay(this.overlayId),await _.instance.destroy()}catch{}this.root.remove()}}createChrome(){const e=document.createElement("div");e.className="ml-diff-toolbar-group";const t=document.createElement("button");t.type="button",t.className="ml-diff-tool-btn is-icon",t.innerHTML=Ft;const i=document.createElement("button");i.type="button",i.className="ml-diff-tool-btn is-icon",i.innerHTML=Ht;const n=document.createElement("button");n.type="button",n.className="ml-diff-tool-btn is-icon ml-diff-sync-btn",n.innerHTML=zt,e.append(t,i,n);const o=document.createElement("div");o.className="ml-diff-toolbar-group";const s=document.createElement("button");s.type="button",s.className="ml-diff-tool-btn is-icon",s.innerHTML=jt;const r=document.createElement("button");r.type="button",r.className="ml-diff-tool-btn",r.textContent="◀",r.disabled=!0;const l=document.createElement("button");l.type="button",l.className="ml-diff-tool-btn",l.textContent="▶",l.disabled=!0,o.append(s,r,l);const d=document.createElement("div");d.className="ml-diff-toolbar-group";const c=document.createElement("button");c.type="button",c.className="ml-diff-tool-btn is-icon",c.dataset.labelKey="markupGenerateClouds",c.disabled=!0,c.innerHTML=$t,c.addEventListener("click",()=>{this.generateCompareCloudMarkups()}),this.markupButtons.push(c),d.appendChild(c);for(const P of ei){const I=document.createElement("button");I.type="button",I.className="ml-diff-tool-btn is-icon",I.dataset.command=P.command,I.dataset.labelKey=P.labelKey,I.innerHTML=P.icon,I.addEventListener("click",()=>{this.runMarkupCommand(P.command)}),this.markupButtons.push(I),d.appendChild(I)}const f=document.createElement("button");f.type="button",f.className="ml-diff-tool-btn is-icon",f.addEventListener("click",()=>{this.toggleMarkupVisibility()}),d.appendChild(f);const h=document.createElement("button");h.type="button",h.className="ml-diff-tool-btn is-icon",h.dataset.labelKey="markupClear",h.innerHTML=Be,h.addEventListener("click",()=>{this.clearAllMarkups()}),this.markupButtons.push(h),d.appendChild(h);const p=this.createLanguageSelect(),u=document.createElement("button");u.type="button",u.className="ml-diff-tool-btn is-icon",u.innerHTML=Kt;const g=document.createElement("button");g.type="button",g.className="ml-diff-tool-btn is-icon",p.group.prepend(u,g),t.addEventListener("click",()=>{this.setViewMode("side-by-side")}),i.addEventListener("click",()=>{this.setViewMode("overlay")}),n.addEventListener("click",()=>{this.setViewsSynced(!this.viewsSynced)}),s.addEventListener("click",()=>{this.setSidePanelOpen(!this.sidePanelOpen)}),r.addEventListener("click",()=>{this.goToDifference(-1)}),l.addEventListener("click",()=>{this.goToDifference(1)}),u.addEventListener("click",()=>{this.openSettings()}),g.addEventListener("click",()=>{this.setUiTheme(this.uiTheme==="dark"?"light":"dark")});const b=document.createElement("aside");b.className="ml-diff-sidepanel";const k=document.createElement("div");k.className="ml-diff-sidepanel-header";const D=document.createElement("div");D.className="ml-diff-sidepanel-title";const M=document.createElement("button");M.type="button",M.className="ml-diff-tool-btn",M.textContent="×",M.addEventListener("click",()=>this.setSidePanelOpen(!1)),k.append(D,M);const U=document.createElement("div");U.className="ml-diff-sidepanel-tabs";const N=document.createElement("button");N.type="button",N.className="ml-diff-sidepanel-tab is-active";const O=document.createElement("button");O.type="button",O.className="ml-diff-sidepanel-tab",U.append(N,O),N.addEventListener("click",()=>{this.activeTab="results",this.syncPanelUi()}),O.addEventListener("click",()=>{this.activeTab="markups",this.syncPanelUi(),this.refreshMarkupsList()});const K=document.createElement("div");K.className="ml-diff-sidepanel-toolbar";const H=document.createElement("button");H.type="button",H.className="ml-diff-tool-btn is-active";const y=document.createElement("button");y.type="button",y.className="ml-diff-tool-btn",K.append(H,y),H.addEventListener("click",()=>{this.resultGroupMode="kind",this.renderResultsList(),this.syncPanelUi()}),y.addEventListener("click",()=>{this.resultGroupMode="type",this.renderResultsList(),this.syncPanelUi()});const x=document.createElement("div");x.className="ml-diff-sidepanel-body";const T=document.createElement("div");return T.className="ml-diff-sidepanel-body",T.hidden=!0,b.append(k,U,K,x,T),{toolbarChildren:[e,o,d,p.group],btnSideBySide:t,btnOverlay:i,btnSyncViews:n,btnTogglePanel:s,btnPrev:r,btnNext:l,btnSettings:u,btnGenerateClouds:c,btnMarkupVis:f,btnClearMarkups:h,btnTheme:g,sidePanel:b,resultsBody:x,markupsBody:T,tabResults:N,tabMarkups:O,groupByKindBtn:H,groupByTypeBtn:y,panelTitle:D,closeBtn:M,localeTrigger:p.trigger,localeMenu:p.menu,localeSelectHost:p.host}}createLanguageSelect(){const e=document.createElement("div");e.className="ml-diff-toolbar-group ml-diff-toolbar-locale";const t=document.createElement("div");t.className="ml-diff-lang-select";const i=document.createElement("button");i.type="button",i.className="ml-diff-lang-select__trigger",i.setAttribute("aria-haspopup","listbox"),i.setAttribute("aria-expanded","false");const n=document.createElement("span");n.className="ml-diff-lang-select__label",i.append(n),i.insertAdjacentHTML("beforeend",ti),i.addEventListener("click",s=>{s.stopPropagation(),this.setLocaleMenuOpen(!this.localeMenuOpen)});const o=document.createElement("div");o.className="ml-diff-lang-select__menu",o.setAttribute("role","listbox"),o.hidden=!0;for(const s of Ee){const r=document.createElement("button");r.type="button",r.className="ml-diff-lang-select__option",r.setAttribute("role","option"),r.dataset.locale=s.locale,r.textContent=s.label,r.addEventListener("click",l=>{l.stopPropagation(),this.setLocaleMenuOpen(!1),s.locale!==L.currentLocale&&(L.setCurrentLocale(s.locale),document.documentElement.lang=s.locale)}),o.appendChild(r)}return t.append(i,o),e.appendChild(t),{group:e,host:t,trigger:i,menu:o}}setLocaleMenuOpen(e){this.localeMenuOpen=e,this.localeMenu.hidden=!e,this.localeTrigger.setAttribute("aria-expanded",String(e)),this.localeSelectHost.classList.toggle("is-open",e)}syncLocaleSelect(){const e=L.currentLocale,t=this.localeTrigger.querySelector(".ml-diff-lang-select__label");t&&(t.textContent=ii(e)),this.localeTrigger.title=m("toolbarLanguage"),this.localeTrigger.setAttribute("aria-label",m("toolbarLanguage")),this.localeMenu.querySelectorAll(".ml-diff-lang-select__option").forEach(i=>{const n=i.dataset.locale===e;i.classList.toggle("is-selected",n),i.setAttribute("aria-selected",String(n))})}createPane(e){const t=document.createElement("section");t.className="ml-diff-pane",t.dataset.side=e,e==="left"&&t.classList.add("is-focused");const i=document.createElement("header");i.className="ml-diff-header";const n=document.createElement("span");n.className="ml-diff-title is-empty";const o=document.createElement("button");o.type="button",o.className="ml-diff-open",o.appendChild(Yt());const s=document.createElement("input");s.type="file",s.className="ml-diff-file-input",s.accept=".dwg,.dxf,application/acad,application/dxf",s.tabIndex=-1,i.append(n,o,s);const r=document.createElement("div");r.className="ml-diff-canvas-slot";const l=document.createElement("div");l.className="ml-diff-canvas";const d=document.createElement("div");d.className="ml-diff-empty";const c=document.createElement("div");c.className="ml-diff-empty-card";const f=document.createElement("div");f.className="ml-diff-empty-title";const h=document.createElement("div");h.className="ml-diff-empty-hint";const p=document.createElement("div");p.className="ml-diff-empty-error is-hidden",c.append(Wt(),f,h,p),d.appendChild(c);const u=document.createElement("div");return u.className="ml-diff-banner is-hidden",r.append(l,d,u),t.append(i,r),t.addEventListener("pointerenter",()=>{this.activateSideOnHover(e)}),t.addEventListener("pointerdown",()=>{this.lastPointerSide=e,this.applyFocusClass(e),this.activateSideAndResumeMarkup(e)}),t.addEventListener("click",g=>{if(this.documentFor(e))return;const b=g.target;b!=null&&b.closest(".ml-diff-open")||this.pickFile(e)}),o.addEventListener("click",g=>{g.preventDefault(),g.stopPropagation(),this.pickFile(e)}),s.addEventListener("change",()=>{var g;const b=(g=s.files)==null?void 0:g[0];s.value="",b&&this.openLocalFile(e,b)}),t.addEventListener("dragenter",g=>{g.preventDefault(),this.changeDragDepth(e,1)}),t.addEventListener("dragover",g=>{g.preventDefault(),g.dataTransfer&&(g.dataTransfer.dropEffect="copy")}),t.addEventListener("dragleave",g=>{g.preventDefault(),this.changeDragDepth(e,-1)}),t.addEventListener("drop",g=>{var b,k;g.preventDefault(),this.resetDragDepth(e);const D=(k=(b=g.dataTransfer)==null?void 0:b.files)==null?void 0:k[0];D&&this.openLocalFile(e,D)}),{pane:t,canvas:l,title:n,empty:d,emptyTitle:f,emptyHint:h,emptyError:p,banner:u,openButton:o,fileInput:s}}activateSideOnHover(e){this.disposed||this.viewMode==="side-by-side"&&(this.lastPointerSide=e,this.applyFocusClass(e),this.activateSideAndResumeMarkup(e))}async activateSideAndResumeMarkup(e){if(this.disposed||!this.documentFor(e))return;let t;try{const i=w();i.commandManager.activeCommand&&this.lastMarkupCommand&&i.curDocument!==this.documentFor(e)&&(t=this.lastMarkupCommand)}catch{return}!await this.activateSide(e)||this.disposed||this.lastPointerSide===e&&(this.applyFocusClass(e),t&&w().sendStringToExecute(t))}pickFile(e){this.uiFor(e).fileInput.click()}async openLocalFile(e,t){if(!oi(t.name)){this.showPaneError(e,m("invalidFile"));return}await this.openDocument(e,t.name,await t.arrayBuffer())}async runMarkupCommand(e){const t=w(),i=this.viewMode==="side-by-side"?this.lastPointerSide:"left";!this.documentFor(i)||(this.lastMarkupCommand=e,!await this.activateSide(i))||(this.applyFocusClass(i),t.sendStringToExecute(e))}async generateCompareCloudMarkups(){var e;if(this.disposed)return;const t=(e=this.compareResult)==null?void 0:e.changeSets;t!=null&&t.length&&(this.viewMode==="overlay"?await this.commitChangeSetClouds("left",t):(await this.commitChangeSetClouds("left",t.filter(i=>i.hasLeft)),await this.commitChangeSetClouds("right",t.filter(i=>i.hasRight))),this.disposed||this.refreshMarkupsList())}toggleMarkupVisibility(){this.disposed||!this.leftDocument&&!this.rightDocument||(this.applyMarkupVisibility(!Y()),this.syncMarkupVisibilityButton())}applyMarkupVisibility(e){this.leftDocument&&fe(this.viewFor("left"),e),this.rightDocument&&fe(this.viewFor("right"),e)}async clearAllMarkups(){if(!this.disposed){for(const e of["left","right"]){if(!this.documentFor(e)||!await this.activateSide(e)||this.disposed)continue;const t=this.viewFor(e);me().clearLayout(t,t.activeLayoutBtrId,{clearStore:!0})}this.disposed||this.refreshMarkupsList()}}async commitChangeSetClouds(e,t){if(!await this.activateSide(e)||this.disposed)return;const i=w(),n=this.viewFor(e),o=i.context;Fe(n,"Create Markup",()=>{const s=Ue(),r=me();for(const l of s.list())l.type!=="cloud"||l.comment!==xe||(r.unpublish(n,l.id,{keepInStore:!0}),s.removeRecord(l.id));for(const l of t){const d=l.extents;if(d.maxX<=d.minX&&d.maxY<=d.minY)continue;const c=Ke("cloud",n,o,{comment:xe}),f=F(this.colors[rt(l)]),h={...c,type:"cloud",style:{...c.style,color:f},geometry:{type:"cloud",corner1:{x:d.minX,y:d.minY},corner2:{x:d.maxX,y:d.maxY}}};s.upsert(h),r.publish(n,h)}})}async openSettings(){if(this.disposed)return;const e={...this.colors},t={...this.sessionSysVars},i=await be.open({host:document.body,theme:this.uiTheme,colors:this.colors,sysVars:this.sessionSysVars,onChange:n=>{this.disposed||(this.applyCompareColors(n.colors),JSON.stringify(n.sysVars)!==JSON.stringify(this.sessionSysVars)&&this.scheduleCompareSysVars(n.sysVars))}});if(!this.disposed){if(!i.confirmed){this.applyCompareColors(e),this.flushCompareSysVars(t);return}this.flushCompareSysVars(i.sysVars)}}adoptCompareSysVarsAfterOpen(e,t){t||(this.sessionSysVars=ht(e.database)),ue(this.sessionSysVars,[e.database])}clearSysVarPreviewTimer(){this.sysVarPreviewTimer&&(window.clearTimeout(this.sysVarPreviewTimer),this.sysVarPreviewTimer=0)}scheduleCompareSysVars(e){this.clearSysVarPreviewTimer();const t={...e};this.sysVarPreviewTimer=window.setTimeout(()=>{this.sysVarPreviewTimer=0,!this.disposed&&this.applyCompareSysVars(t)},Qt)}flushCompareSysVars(e){this.clearSysVarPreviewTimer(),this.applyCompareSysVars(e)}applyCompareSysVars(e){var t,i;const n=JSON.stringify(e)===JSON.stringify(this.sessionSysVars);this.sessionSysVars={...e};const o=[(t=this.leftDocument)==null?void 0:t.database,(i=this.rightDocument)==null?void 0:i.database].filter(s=>s!=null);ue(this.sessionSysVars,o),n||this.runCompareAndApply()}applyCompareColors(e){this.colors={...e},this.syncCompareColorVars(),this.applyCompareDisplay()}syncCompareColorVars(){this.root.style.setProperty("--ml-diff-added",F(this.colors.added)),this.root.style.setProperty("--ml-diff-deleted",F(this.colors.deleted)),this.root.style.setProperty("--ml-diff-modified",F(this.colors.modified))}async runCompareAndApply(){var e,t;const i=++this.compareSeq,n=this.leftDocument,o=this.rightDocument;if(!n||!o){if(this.compareResult=void 0,this.navIndex=-1,await this.clearCompareDisplay(),this.disposed||i!==this.compareSeq)return;this.renderResultsList(),this.syncToolbarButtons();return}const s=Et(n.database,o.database,{compareProps:this.sessionSysVars.compareprops,compareHatch:this.sessionSysVars.comparehatch,compareText:this.sessionSysVars.comparetext,compareTolerance:this.sessionSysVars.comparetolerance,compareRcMargin:this.sessionSysVars.comparercmargin});this.disposed||i!==this.compareSeq||(this.compareResult=s,this.navIndex=-1,(t=(e=this.options.events)==null?void 0:e.compared)==null||t.call(e,this.compareResult),this.viewMode==="overlay"&&await this.enterOverlayMode(),!(this.disposed||i!==this.compareSeq)&&(await this.applyCompareDisplay(),!(this.disposed||i!==this.compareSeq)&&(this.renderResultsList(),this.refreshMarkupsList(),this.syncToolbarButtons())))}async enterOverlayMode(){this.lastPointerSide="left";const e=w(),t=this.rightDocument,i=++this.overlayRegisterSeq;if(!t){this.viewMode="overlay",this.syncViewModeUi(),await this.activateSide("left");return}this.overlayId&&(e.removeOverlay(this.overlayId),this.overlayId=void 0);const n=await e.registerOverlayDatabase(t.database,{targetView:e.mainView});if(this.disposed||i!==this.overlayRegisterSeq){try{e.removeOverlay(n)}catch{}return}this.overlayId=n,this.rightUi.pane.style.display="none",this.root.classList.add("is-overlay"),await this.activateSide("left")}async exitOverlayMode(){this.overlayRegisterSeq++;const e=w();this.overlayId&&(e.removeOverlay(this.overlayId),this.overlayId=void 0),this.rightUi.pane.style.display="",this.root.classList.remove("is-overlay")}async waitForCompareViewsIdle(){const e=w(),t=[e.mainView];e.splitView&&t.push(e.splitView),await Promise.all(t.map(i=>i.waitUntilIdle()))}async clearCompareDisplay(){const e=w();e.setCompareDisplay({enabled:!1},e.mainView),e.splitView&&e.setCompareDisplay({enabled:!1},e.splitView),this.overlayId&&e.setOverlayCompareDisplay(this.overlayId,{enabled:!1},e.mainView)}async applyCompareDisplay(){const e=this.compareResult,t=w();if(!e||!this.leftDocument||!this.rightDocument){await this.clearCompareDisplay();return}if(await this.waitForCompareViewsIdle(),this.disposed||this.compareResult!==e||!this.leftDocument||!this.rightDocument)return;const i={enabled:!0,baseColor:this.colors.unchanged,colors:{deleted:this.colors.deleted,added:this.colors.added,modified:this.colors.modified}},n=e.deleted.filter(l=>l.side==="left").map(l=>l.objectId),o=e.added.filter(l=>l.side==="right").map(l=>l.objectId);if(this.viewMode==="overlay"){const l=[...n.map(c=>({objectId:c,role:"deleted"})),...e.modified.filter(c=>c.side==="left").map(c=>({objectId:c.objectId,role:"deleted"}))],d=[...o.map(c=>({objectId:c,role:"added"})),...e.modified.filter(c=>c.side==="right").map(c=>({objectId:c.objectId,role:"added"}))];t.setCompareDisplay({enabled:!1},t.mainView),t.setCompareDisplay({...i,overrides:l},t.mainView),this.overlayId&&(t.setOverlayCompareDisplay(this.overlayId,{enabled:!1},t.mainView),t.setOverlayCompareDisplay(this.overlayId,{...i,overrides:d},t.mainView));return}const s=[...n.map(l=>({objectId:l,role:"deleted"})),...e.modified.filter(l=>l.side==="left").map(l=>({objectId:l.objectId,role:"modified"}))],r=[...o.map(l=>({objectId:l,role:"added"})),...e.modified.filter(l=>l.side==="right").map(l=>({objectId:l.objectId,role:"modified"}))];t.setCompareDisplay({enabled:!1},t.mainView),t.setCompareDisplay({...i,overrides:s},t.mainView),t.splitView&&(t.setCompareDisplay({enabled:!1},t.splitView),t.setCompareDisplay({...i,overrides:r},t.splitView))}async focusHit(e){const t=this.viewMode==="overlay"?"left":e.side;this.viewMode!=="overlay"&&await this.activateSide(e.side);const i=this.viewFor(t);if(e.extents){const n=new he;if(n.expandByPoint({x:e.extents.minX,y:e.extents.minY}),n.expandByPoint({x:e.extents.maxX,y:e.extents.maxY}),e.pairedId&&e.kind==="modified"&&this.compareResult){const o=this.compareResult.modified.find(s=>s.objectId===e.pairedId);o!=null&&o.extents&&(n.expandByPoint({x:o.extents.minX,y:o.extents.minY}),n.expandByPoint({x:o.extents.maxX,y:o.extents.maxY}))}i.zoomTo(n,1.5)}this.isViewSyncActive()&&(this.viewSyncLeader=t,this.viewSyncFollowOpen=!1,this.copyVisibleView(t,t==="left"?"right":"left"))}renderResultsList(){this.hideDiffPopover(!0);const e=this.resultsBody;e.replaceChildren();const t=this.compareResult;if(!t||t.navigation.length===0){const s=document.createElement("div");s.className="ml-diff-empty-list",s.textContent=m("noResults"),e.appendChild(s),this.syncToolbarButtons();return}const i=new Map,n=(s,r)=>{const l=i.get(s);l?l.push(r):i.set(s,[r])};if(this.resultGroupMode==="kind"){for(const s of t.deleted)n("deleted",s);for(const s of t.modified.filter(r=>r.side==="left"))n("modified",s);for(const s of t.added)n("added",s)}else for(const s of t.navigation)n(s.dxfType||"UNKNOWN",s);const o=s=>s==="added"?m("kindAdded"):s==="deleted"?m("kindDeleted"):s==="modified"?m("kindModified"):s;for(const[s,r]of i){const l=this.resultGroupStorageKey(s),d=document.createElement("details");d.className="ml-diff-group",d.open=!this.collapsedResultGroups.has(l);const c=document.createElement("summary");c.className="ml-diff-group-title",c.textContent=this.resultGroupMode==="kind"?`${o(s)} (${r.length})`:`${s} (${r.length})`,d.appendChild(c),d.addEventListener("toggle",()=>{d.open?this.collapsedResultGroups.delete(l):this.collapsedResultGroups.add(l),this.hideDiffPopover(!0)}),r.forEach(f=>{const h=document.createElement("div");h.className="ml-diff-result-row",h.dataset.kind=f.kind;const p=t.navigation.indexOf(f);p===this.navIndex&&h.classList.add("is-active");const u=document.createElement("button");u.type="button",u.className="ml-diff-result-item",u.dataset.kind=f.kind;const g=document.createElement("span");g.className="ml-diff-result-label",g.textContent=`${f.dxfType} · ${f.objectId}`;const b=document.createElement("span");if(b.className="ml-diff-result-meta",b.textContent=`${f.layer} · ${o(f.kind)}`,u.append(g,b),u.addEventListener("click",()=>{this.navIndex=p>=0?p:this.navIndex,this.focusHit(f),this.renderResultsList()}),h.appendChild(u),f.kind==="modified"){const k=document.createElement("button");k.type="button",k.className="ml-diff-result-info",k.innerHTML=Ut;const D=m("diffDetails");k.setAttribute("aria-label",D),k.setAttribute("aria-expanded","false"),k.addEventListener("click",M=>{M.preventDefault(),M.stopPropagation(),this.toggleDiffPopover(k,f)}),k.addEventListener("mouseenter",()=>{this.showDiffPopover(k,f,!1)}),k.addEventListener("mouseleave",this.scheduleDiffPopoverHide),h.appendChild(k)}d.appendChild(h)}),e.appendChild(d)}this.syncToolbarButtons()}toggleDiffPopover(e,t){if(this.diffPopoverAnchor===e&&this.diffPopoverPinned){this.hideDiffPopover(!0);return}this.showDiffPopover(e,t,!0)}showDiffPopover(e,t,i){var n;!i&&this.diffPopoverPinned&&this.diffPopoverAnchor!==e||(this.cancelDiffPopoverHide(),!(!i&&this.diffPopoverPinned&&this.diffPopoverAnchor===e&&!this.diffPopover.hidden)&&((n=this.diffPopoverAnchor)==null||n.classList.remove("is-open"),this.diffPopoverAnchor=e,this.diffPopoverPinned=i,e.classList.toggle("is-open",i),e.setAttribute("aria-expanded",String(i)),this.renderDiffPopoverContent(t),this.positionDiffPopover(e),this.diffPopover.hidden=!1))}hideDiffPopover(e=!1){var t,i;this.diffPopoverPinned&&!e||(this.cancelDiffPopoverHide(),this.diffPopover.hidden=!0,this.diffPopoverPinned=!1,(t=this.diffPopoverAnchor)==null||t.classList.remove("is-open"),(i=this.diffPopoverAnchor)==null||i.setAttribute("aria-expanded","false"),this.diffPopoverAnchor=void 0)}renderDiffPopoverContent(e){const t=this.diffPopover;t.replaceChildren();const i=e.changes??[],n=i.filter(d=>d.field!=="geometry"||d.oldValue||d.newValue);if(n.length===0&&i.some(d=>d.field==="geometry")||n.length===0){const d=document.createElement("div");d.className="ml-diff-change-note",d.textContent=m("diffGeometryChanged"),t.appendChild(d);return}const o=document.createElement("table");o.className="ml-diff-change-table";const s=document.createElement("thead"),r=document.createElement("tr");for(const d of["diffColProperty","diffColOld","diffColNew"]){const c=document.createElement("th");c.textContent=m(d),r.appendChild(c)}s.appendChild(r);const l=document.createElement("tbody");for(const d of n){const c=document.createElement("tr"),f=document.createElement("th");f.scope="row",f.textContent=ni(d.field);const h=document.createElement("td");h.className="ml-diff-change-old",h.textContent=we(d.field,d.oldValue);const p=document.createElement("td");p.className="ml-diff-change-new",p.textContent=we(d.field,d.newValue),c.append(f,h,p),l.appendChild(c)}o.append(s,l),t.appendChild(o)}positionDiffPopover(e){const t=this.diffPopover;t.style.left="0px",t.style.top="0px",t.hidden=!1;const i=e.getBoundingClientRect(),n=t.getBoundingClientRect(),o=8;let s=i.left-n.width-o,r=i.top;s<o&&(s=Math.max(o,i.right-n.width),r=i.bottom+o),s+n.width>window.innerWidth-o&&(s=Math.max(o,window.innerWidth-n.width-o)),r+n.height>window.innerHeight-o&&(r=Math.max(o,window.innerHeight-n.height-o)),t.style.left=`${s}px`,t.style.top=`${r}px`}resultGroupStorageKey(e){return`${this.resultGroupMode}:${e}`}resultGroupStorageKeyForHit(e){const t=this.resultGroupMode==="kind"?e.kind:e.dxfType||"UNKNOWN";return this.resultGroupStorageKey(t)}refreshMarkupsList(){const e=this.markupsBody;e.replaceChildren();const t=this.leftDocument,i=this.rightDocument,n=w(),o=[];if(t){const s=n.sessionFor(t);if(s)for(const r of pe(s.id))o.push({side:"left",record:r})}if(i){const s=n.sessionFor(i);if(s)for(const r of pe(s.id))o.push({side:"right",record:r})}if(o.length===0){const s=document.createElement("div");s.className="ml-diff-empty-list",s.textContent=m("noMarkups"),e.appendChild(s);return}for(const s of o){const r=document.createElement("button");r.type="button",r.className="ml-diff-markup-item",r.textContent=s.record.type;const l=document.createElement("span");l.className="ml-diff-markup-meta",l.textContent=s.side==="left"?m("markupFromLeft"):m("markupFromRight"),r.appendChild(l),r.addEventListener("click",()=>{this.activateSide(s.side)}),e.appendChild(r)}}showPaneError(e,t){const i=this.uiFor(e);if(this.documentFor(e)){i.banner.textContent=t,i.banner.classList.remove("is-hidden");const n=this.bannerTimers.get(e);n&&window.clearTimeout(n);const o=window.setTimeout(()=>{i.banner.classList.add("is-hidden"),this.bannerTimers.delete(e)},3e3);this.bannerTimers.set(e,o);return}i.emptyError.textContent=t,i.emptyError.classList.remove("is-hidden")}clearPaneError(e){const t=this.uiFor(e);t.emptyError.textContent="",t.emptyError.classList.add("is-hidden"),t.banner.textContent="",t.banner.classList.add("is-hidden");const i=this.bannerTimers.get(e);i&&(window.clearTimeout(i),this.bannerTimers.delete(e))}changeDragDepth(e,t){e==="left"?this.leftDragDepth=Math.max(0,this.leftDragDepth+t):this.rightDragDepth=Math.max(0,this.rightDragDepth+t),this.uiFor(e).pane.classList.toggle("is-dragover",(e==="left"?this.leftDragDepth:this.rightDragDepth)>0)}resetDragDepth(e){e==="left"?this.leftDragDepth=0:this.rightDragDepth=0,this.uiFor(e).pane.classList.remove("is-dragover")}uiFor(e){return e==="left"?this.leftUi:this.rightUi}documentFor(e){return e==="left"?this.leftDocument:this.rightDocument}viewFor(e){const t=w(),i=e==="left"?t.mainView:t.ensureSplitView(this.rightUi.canvas);return this.disableEntitySelection(i),i}disableEntitySelection(e){e.entitySelectionEnabled=!1}isViewSyncActive(){return this.viewsSynced&&this.viewMode==="side-by-side"&&!!this.leftDocument&&!!this.rightDocument}setViewsSynced(e){if(this.viewsSynced=e,this.viewSyncFollowOpen=!1,e){const t=this.documentFor(this.lastPointerSide)?this.lastPointerSide:"left";this.viewSyncLeader=t,this.applyViewSyncFromLeader()}this.syncViewModeUi()}applyViewSyncFromLeader(){if(!this.isViewSyncActive())return;const e=this.documentFor(this.viewSyncLeader)?this.viewSyncLeader:this.leftDocument?"left":"right";this.viewSyncLeader=e,this.copyVisibleView(e,e==="left"?"right":"left")}syncFollowerAfterOpen(e){const t=e==="left"?"right":"left";!this.isViewSyncActive()||!this.documentFor(t)||(this.viewSyncLeader=t,this.viewSyncFollowOpen=!0,this.copyVisibleView(t,e))}bindViewSyncListeners(){try{const e=this.viewFor("left"),t=this.viewFor("right");e.events.viewChanged.addEventListener(this.handleLeftViewChanged),t.events.viewChanged.addEventListener(this.handleRightViewChanged)}catch{return}for(const e of[this.leftUi.canvas,this.rightUi.canvas])e.addEventListener("pointerdown",this.markViewSyncUserInput,!0),e.addEventListener("wheel",this.markViewSyncUserInput,{capture:!0,passive:!0})}unbindViewSyncListeners(){for(const e of[this.leftUi.canvas,this.rightUi.canvas])e.removeEventListener("pointerdown",this.markViewSyncUserInput,!0),e.removeEventListener("wheel",this.markViewSyncUserInput,!0);try{const e=this.viewFor("left"),t=this.viewFor("right");e.events.viewChanged.removeEventListener(this.handleLeftViewChanged),t.events.viewChanged.removeEventListener(this.handleRightViewChanged)}catch{}}onPaneViewChanged(e){if(this.disposed||this.viewSyncLock||!this.isViewSyncActive())return;const t=e==="left"?"right":"left";if(this.viewSyncFollowOpen&&e!==this.viewSyncLeader&&!this.viewSyncFromUser){this.copyVisibleView(this.viewSyncLeader,e);return}this.viewSyncFollowOpen=!1,this.viewSyncFromUser=!1,this.viewSyncLeader=e,this.copyVisibleView(e,t)}copyVisibleView(e,t){if(e===t||this.viewSyncLock||!this.documentFor(e)||!this.documentFor(t))return;let i,n;try{i=this.viewFor(e),n=this.viewFor(t)}catch{return}const o=i.width,s=i.height;if(o<2||s<2)return;let r;try{const l=i.screenToWorld({x:0,y:0}),d=i.screenToWorld({x:o,y:s});r=new he,r.expandByPoint(l),r.expandByPoint(d)}catch{return}this.viewSyncLock=!0;try{n.zoomTo(r,1)}catch{}finally{requestAnimationFrame(()=>{this.viewSyncLock=!1})}}liveDoc(e){if(e)try{return w().sessionFor(e)?e:void 0}catch{return}}paneTitle(e){return e?e.docTitle||e.fileName||L.t("main.document.untitled"):m("noDrawing")}syncChrome(){const e=this.leftDocument,t=this.rightDocument;this.leftDoc=e,this.rightDoc=t,this.syncPaneChrome(this.leftUi,e),this.syncPaneChrome(this.rightUi,t),this.syncFocusRings(),this.syncToolbarButtons(),window.dispatchEvent(new Event("resize"))}applyFocusClass(e){this.leftUi.pane.classList.toggle("is-focused",e==="left"),this.rightUi.pane.classList.toggle("is-focused",e==="right")}syncFocusRings(){const e=this.rightDocument;let t;try{t=w().curDocument}catch{t=void 0}t===e&&e?this.applyFocusClass("right"):this.applyFocusClass("left")}syncPaneChrome(e,t){e.pane.classList.toggle("is-empty",!t),e.empty.classList.toggle("is-hidden",!!t),e.title.textContent=this.paneTitle(t),e.title.classList.toggle("is-empty",!t),e.openButton.setAttribute("aria-label",m("openFile")),e.openButton.title=m("openFile"),e.emptyTitle.textContent=m("emptyTitle"),e.emptyHint.textContent=m("emptyHint"),e.emptyError.classList.contains("is-hidden")||(e.emptyError.textContent=m("invalidFile")),e.banner.classList.contains("is-hidden")||(e.banner.textContent=m("invalidFile"))}syncViewModeUi(){this.root.classList.toggle("is-overlay",this.viewMode==="overlay"),this.btnSideBySide.classList.toggle("is-active",this.viewMode==="side-by-side"),this.btnOverlay.classList.toggle("is-active",this.viewMode==="overlay");const e=m("toolbarSideBySide"),t=m("toolbarOverlay"),i=m("toolbarTogglePanel");this.btnSideBySide.title=e,this.btnSideBySide.setAttribute("aria-label",e),this.btnOverlay.title=t,this.btnOverlay.setAttribute("aria-label",t);const n=m("toolbarSyncViews");this.btnSyncViews.title=n,this.btnSyncViews.setAttribute("aria-label",n),this.btnSyncViews.setAttribute("aria-pressed",String(this.viewsSynced)),this.btnSyncViews.classList.toggle("is-active",this.viewsSynced),this.btnSyncViews.hidden=this.viewMode!=="side-by-side",this.btnTogglePanel.title=i,this.btnTogglePanel.setAttribute("aria-label",i),this.btnPrev.title=m("toolbarPrev"),this.btnNext.title=m("toolbarNext");const o=m("toolbarSettings");this.btnSettings.title=o,this.btnSettings.setAttribute("aria-label",o),this.syncToolbarButtons(),this.syncMarkupVisibilityButton(),this.syncThemeButton(),this.syncLocaleSelect();for(const s of this.markupButtons){const r=s.dataset.labelKey,l=m(r);s.title=l,s.setAttribute("aria-label",l)}}syncPanelUi(){this.sidePanel.classList.toggle("is-collapsed",!this.sidePanelOpen),this.btnTogglePanel.classList.toggle("is-active",this.sidePanelOpen),this.panelTitle.textContent=m("panelTitle"),this.tabResults.textContent=m("tabResults"),this.tabMarkups.textContent=m("tabMarkups"),this.groupByKindBtn.textContent=m("groupByKind"),this.groupByTypeBtn.textContent=m("groupByType"),this.tabResults.classList.toggle("is-active",this.activeTab==="results"),this.tabMarkups.classList.toggle("is-active",this.activeTab==="markups"),this.resultsBody.hidden=this.activeTab!=="results",this.markupsBody.hidden=this.activeTab!=="markups",this.groupByKindBtn.classList.toggle("is-active",this.resultGroupMode==="kind"),this.groupByTypeBtn.classList.toggle("is-active",this.resultGroupMode==="type");const e=this.groupByKindBtn.parentElement;e&&(e.hidden=this.activeTab!=="results"),(!this.sidePanelOpen||this.activeTab!=="results")&&this.hideDiffPopover(!0)}syncToolbarButtons(){var e,t;const i=!!(this.leftDocument||this.rightDocument),n=!!this.compareResult,o=((e=this.compareResult)==null?void 0:e.navigation)??[],s=n&&o.length>0;this.btnMarkupVis.disabled=!i,this.btnClearMarkups.disabled=!i;for(const r of this.markupButtons)r.dataset.command||r.dataset.labelKey==="markupClear"?r.disabled=!i:r.dataset.labelKey==="markupGenerateClouds"&&(r.disabled=!n||(((t=this.compareResult)==null?void 0:t.changeSets.length)??0)===0);this.btnPrev.disabled=!s||this.navIndex<=0,this.btnNext.disabled=!s||this.navIndex>=o.length-1}setUiTheme(e){this.uiTheme=e,ce(e,this.root),this.syncThemeButton()}syncMarkupVisibilityButton(){const e=Y();this.btnMarkupVis.innerHTML=e?He:ze;const t=m(e?"markupHide":"markupShow");this.btnMarkupVis.title=t,this.btnMarkupVis.setAttribute("aria-label",t),this.btnMarkupVis.setAttribute("aria-pressed",String(e)),this.btnMarkupVis.classList.toggle("is-active",e)}syncThemeButton(){const e=this.uiTheme==="dark";this.btnTheme.innerHTML=e?_t:Gt;const t=m(e?"toolbarThemeDark":"toolbarThemeLight");this.btnTheme.title=t,this.btnTheme.setAttribute("aria-label",t)}assertAlive(){if(this.disposed)throw new Error("AcApDiffViewer has been destroyed")}}export{di as d};
