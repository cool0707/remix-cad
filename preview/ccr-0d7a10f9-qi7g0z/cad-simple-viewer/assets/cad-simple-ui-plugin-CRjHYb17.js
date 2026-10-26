import{_ as We,I as ye,p as v,G as Ye,c as te,Z as D,x as m,R as ke,a as je,n as L,J as y,z as xe,P as qe,o as ae,Y as z,b as T,U as Ze,d as Xe,e as ge,f as Pe,g as we,h as Ce,i as oe,s as A,S as Je,j as w,k as Qe,A as et,m as tt,q as at,W as ot,T as le,O as lt,D as it,N as rt,r as st,t as nt,u as dt,v as ut,w as ie,y as Ee,B as ct,C as ht,E as mt,F as pt,H as bt,L as ft,M as vt,V as yt,X as kt,a0 as Me,a1 as xt,a2 as gt,a3 as Te,a4 as Pt,a5 as re,a6 as wt,a7 as Ct,a8 as Et,a9 as Mt,aa as Tt,ab as St,ac as Lt,ad as It,ae as Ot,af as Se,ag as Le,ah as Dt,ai as zt,aj as Ie,ak as Oe,al as At,am as Nt,an as Rt,ao as Bt,ap as Vt,aq as Ut,ar as _t,as as Ht,at as Ft,au as Gt,av as Kt,aw as $t,ax as Wt,ay as Yt,az as jt,aA as se,aB as qt,aC as Zt,aD as ne,aE as Xt,aF as Jt,aG as de,aH as ue,aI as ce,aJ as Qt,aK as ea,aL as ta,l as aa,$ as oa,Q as la,K as ia}from"./cad-simple-viewer-qzdhGSZb.js";import{AcDbSystemVariables as B,AcDbSysVarManager as I,AcCmColor as O,AcCmColorMethod as ra,acdbHostApplicationServices as sa}from"./data-model-F253oP3p.js";async function na(l,e={}){const{acuiCreateSimpleUiPlugin:t}=await We(async()=>{const{acuiCreateSimpleUiPlugin:a}=await Promise.resolve().then(()=>no);return{acuiCreateSimpleUiPlugin:a}},void 0,import.meta.url);await l.loadPlugin(t(e))}const da="1.7.7-preview.1",ua={version:da};class ca extends z{constructor(e){super(),this.actions=e}async execute(e){this.actions.prepare(),this.actions.toggle()}}class he{constructor(e,t="layers"){this.dockPanel=e,this.layersTabId=t,this.handleCloseLayerManager=()=>{this.hide()},oe.on("close-layer-manager",this.handleCloseLayerManager)}toggleFromCommand(){this.dockPanel.hasTab(this.layersTabId)&&this.dockPanel.open(this.layersTabId)}hide(){this.dockPanel.close()}refreshLocale(){this.dockPanel.refreshLocale()}destroy(){oe.off("close-layer-manager",this.handleCloseLayerManager)}}class ha{toggleFromCommand(){var e;(e=this.current)==null||e.toggleFromCommand()}hide(){var e;(e=this.current)==null||e.hide()}refreshLocale(){var e;(e=this.current)==null||e.refreshLocale()}}class ma extends z{constructor(e){super(),this.actions=e}async execute(e){this.actions.prepare(),this.actions.toggle()}}class pa extends z{constructor(e){super(),this.actions=e}async execute(e){this.actions.prepare(),this.actions.toggle()}}class ba extends z{constructor(e){super(),this.actions=e}async execute(e){this.actions.prepare(),this.actions.toggle()}}const fa='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" d="M221.09 64a157.09 157.09 0 1 0 157.09 157.09A157.1 157.1 0 0 0 221.09 64Z"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M338.29 338.29L448 448"/></svg>';function va(l){const e=l.id??"toolbar-layout-switcher",t=`layout-${l.currentId}`;return{id:e,label:l.label??"Toolbar Layout",icon:l.icon??ye,requiresDocument:!1,childIcon:"selected",selectedChildId:t,children:l.presets.map(a=>({id:`layout-${a.id}`,label:a.label,action:()=>l.onSelect(a.id)}))}}function V(l,e){return[e,{type:"separator",id:"toolbar-layout-switcher-separator"},...l]}const ya=["select","pan"];function ka(l){if(l==="phone")return{enabled:!0,placement:"bottom",items:"default",collapsible:!1,defaultCollapsed:!1,edgeOffset:0,sideOffset:0,showLabels:!0,size:"stretch",overflow:"menu",showBorder:!0,showButtonBorder:!1,showSeparators:!0,showChildrenIndicator:!1,subToolbar:{showLabels:!0,showSeparators:!1,size:"stretch",overflow:"wrap",replaceOnNested:!0}};const e={enabled:!0,placement:"right",items:"default",collapsible:!1,defaultCollapsed:!1,edgeOffset:8,sideOffset:0,showLabels:!1,size:"auto",overflow:"menu",showBorder:!0,showButtonBorder:!1,showSeparators:!0,showChildrenIndicator:!0,subToolbar:{replaceOnNested:!1}};return l==="pad"?{...e,excludeItems:[...ya]}:e}const xa=["mountTarget","enabled","inCanvasParent","showButtonBorder"];function De(l,e,t){const a=ka(l),o={};if(e)if(l==="phone")for(const i of xa)e[i]!==void 0&&(o[i]=e[i]);else Object.assign(o,e);return{...a,...o,...t}}function ga(l={}){var e,t,a,o,i,r,s,n,u,d,c,p,h,b,f,S,W,Y,j,q,Z,X,J,Q;const ee=((e=l.dockPanel)==null?void 0:e.enabled)===!0;return{host:l.host,layout:l.layout??"auto",layouts:l.layouts??{},dockPanel:{enabled:ee,defaultOpen:((t=l.dockPanel)==null?void 0:t.defaultOpen)??!1,defaultSide:((a=l.dockPanel)==null?void 0:a.defaultSide)??"left",defaultHeight:((o=l.dockPanel)==null?void 0:o.defaultHeight)??240,defaultWidth:((i=l.dockPanel)==null?void 0:i.defaultWidth)??280},toolbar:{enabled:((r=l.toolbar)==null?void 0:r.enabled)===!1?!1:((s=l.toolbar)==null?void 0:s.enabled)??!0,placement:((n=l.toolbar)==null?void 0:n.placement)??"right",items:((u=l.toolbar)==null?void 0:u.items)??"default",...l.toolbar&&"excludeItems"in l.toolbar?{excludeItems:l.toolbar.excludeItems}:{},appendItems:(d=l.toolbar)==null?void 0:d.appendItems,appendItemsAfter:(c=l.toolbar)==null?void 0:c.appendItemsAfter,appendItemsBefore:(p=l.toolbar)==null?void 0:p.appendItemsBefore,collapsible:((h=l.toolbar)==null?void 0:h.collapsible)??!1,defaultCollapsed:((b=l.toolbar)==null?void 0:b.defaultCollapsed)??!1,edgeOffset:((f=l.toolbar)==null?void 0:f.edgeOffset)??8,sideOffset:((S=l.toolbar)==null?void 0:S.sideOffset)??0,showLabels:(W=l.toolbar)==null?void 0:W.showLabels,size:(Y=l.toolbar)==null?void 0:Y.size,overflow:(j=l.toolbar)==null?void 0:j.overflow,showBorder:((q=l.toolbar)==null?void 0:q.showBorder)??!0,showButtonBorder:((Z=l.toolbar)==null?void 0:Z.showButtonBorder)??!1,showSeparators:((X=l.toolbar)==null?void 0:X.showSeparators)??!0,inCanvasParent:((J=l.toolbar)==null?void 0:J.inCanvasParent)===!0,subToolbar:(Q=l.toolbar)==null?void 0:Q.subToolbar},shouldCreateDockPanel:ee}}const Pa=["ml-ex-ui-dock-main","ml-ex-ui-toolbar-main"];function ze(l,e,t=Pa){let a=l;for(;a!==e&&a.parentElement&&t.some(o=>{var i;return((i=a.classList)==null?void 0:i.contains(o))===!0});)a=a.parentElement;return a}function N(l,e){var t;if(e)return e;const a=(t=m.instance.curView)==null?void 0:t.container,o=a==null?void 0:a.parentElement;return o&&(o===l||l.contains(o))?ze(o,l):l}function wa(){var l,e;const t=(l=m.instance.curDocument)==null?void 0:l.database,a=(e=t==null?void 0:t.objects)==null?void 0:e.layout;if(!t||!(a!=null&&a.newIterator))return[];const o=[],i=new Set;for(const r of t.objects.layout.newIterator()){const s=r.blockTableRecordId;!s||i.has(s)||(i.add(s),o.push({name:r.layoutName,tabOrder:r.tabOrder,blockTableRecordId:s,isActive:s===t.currentSpaceId}))}return o.sort((r,s)=>r.tabOrder-s.tabOrder),o}function Ca(l){sa().layoutManager.setCurrentLayoutBtrId(l)}function Ea(){return wa().map(l=>({id:`layout-${l.blockTableRecordId}`,label:l.name,action:()=>Ca(l.blockTableRecordId),toggle:{getValue:()=>{var e;const t=(e=m.instance.curDocument)==null?void 0:e.database;return(t==null?void 0:t.currentSpaceId)===l.blockTableRecordId},on:{},off:{}}}))}function Ae(){return Te({id:"layout",label:"toolbar.layout",icon:Jt,requiresDocument:!0,childrenUi:"menu",children:[]},Ea)}const Ma=["top","bottom","left","right"],Ta={top:ge,bottom:Pe,left:we,right:Ce},Sa={top:"toolbar.placementTop",bottom:"toolbar.placementBottom",left:"toolbar.placementLeft",right:"toolbar.placementRight"};function La(l){return{id:"toolbar-placement",label:"toolbar.placement",icon:ye,requiresDocument:!1,childrenUi:"toolbar",childIcon:"selected",selectedChildId:`placement-${(l==null?void 0:l.getPlacement())??"right"}`,children:Ma.map(e=>({id:`placement-${e}`,label:Sa[e],icon:Ta[e],requiresDocument:!1,action:()=>l==null?void 0:l.setPlacement(e)}))}}const Ia=["en","ja","zh","cs","tr","ar"],Oa={en:"EN",ja:"日",zh:"中",cs:"CS",tr:"TR",ar:"AR"},Da={en:"toolbar.localeEn",ja:"toolbar.localeJa",zh:"toolbar.localeZh",cs:"toolbar.localeCs",tr:"toolbar.localeTr",ar:"toolbar.localeAr"};function za(l){return`<span class="ml-ex-ui-locale-badge">${l}</span>`}function Aa(l){const e=(l==null?void 0:l.getLocale())??"en";return{id:"locale",label:"toolbar.locale",icon:Xt,requiresDocument:!1,childrenUi:"toolbar",childIcon:"selected",selectedChildId:`locale-${e}`,children:Ia.map(t=>({id:`locale-${t}`,label:Da[t],icon:za(Oa[t]),requiresDocument:!1,action:()=>l==null?void 0:l.setLocale(t)}))}}function Na(l){const e=()=>(l==null?void 0:l.getTheme())??"light",t=()=>{const a=e()==="dark"?"light":"dark";l==null||l.setTheme(a)};return{id:"theme",requiresDocument:!1,toggle:{getValue:()=>e()==="light",on:{label:"toolbar.themeLight",icon:Zt,action:t},off:{label:"toolbar.themeDark",icon:qt,action:t}}}}function Ra(){const l=()=>D.instance.toggle("useSimulatedMouseOnTouch");return{id:"simulated-mouse",requiresDocument:!1,toggle:{getValue:()=>!!D.instance.get("useSimulatedMouseOnTouch"),on:{label:"toolbar.simulatedMouseOn",icon:se,action:l},off:{label:"toolbar.simulatedMouseOff",icon:se,action:l}}}}function Ne(){try{return m.instance.isReadingModeEnabled()}catch{return!1}}function Ba(){return{id:"reading-mode",requiresDocument:!0,toggle:{getValue:Ne,on:{label:"toolbar.readingMode",icon:ne,command:"readingmode"},off:{label:"toolbar.readingMode",icon:ne,command:"readingmode"}}}}function Re(){return{id:"find",label:"toolbar.find",icon:fa,command:"find"}}function Be(){return{id:"measure",label:"toolbar.measure",icon:At,childrenUi:"toolbar",children:[{id:"measure-distance",label:"toolbar.measureDistance",icon:Et,command:"measuredistance"},{id:"measure-continuous",label:"toolbar.measureContinuous",icon:Mt,command:"measurecontinuous"},{id:"measure-angle",label:"toolbar.measureAngle",icon:Tt,command:"measureangle"},{id:"measure-area",label:"toolbar.measureArea",icon:St,command:"measurearea"},{id:"measure-arc",label:"toolbar.measureArc",icon:Lt,command:"measurearc"},{id:"measure-point",label:"toolbar.measurePoint",icon:It,command:"measurepoint"},{id:"measurement-panel",label:"toolbar.measurementPanel",icon:Ot,command:"measurementpanel"},{id:"measurement-vis",toggle:{getValue:Dt,on:{label:"toolbar.showMeasurements",icon:Le,command:"measurementvis"},off:{label:"toolbar.hideMeasurements",icon:Se,command:"measurementvis"}}},{id:"clear-measurements",label:"toolbar.clearMeasurements",icon:zt,command:"clearmeasurements"},{type:"separator",id:"sep-measure-import-export"},{id:"measurement-import",label:"toolbar.measurementImport",icon:Ie,command:"measurementimport"},{id:"measurement-export",label:"toolbar.measurementExport",icon:Oe,command:"measurementexport"}]}}function Ve(){return{id:"annotation",label:"toolbar.annotation",icon:Wt,minOpenMode:$t.Review,childrenUi:"toolbar",children:[{id:"markup-cloud",label:"toolbar.markupCloud",icon:Nt,command:"markupcloud"},{id:"markup-callout",label:"toolbar.markupCallout",icon:Rt,command:"markupcallout"},{id:"markup-text",label:"toolbar.markupText",icon:Bt,command:"markuptext"},{id:"markup-rect",label:"toolbar.markupRect",icon:Vt,command:"markuprect"},{id:"markup-circle",label:"toolbar.markupCircle",icon:Ut,command:"markupcircle"},{id:"markup-arrow",label:"toolbar.markupArrow",icon:_t,command:"markuparrow"},{id:"markup-stamp",label:"toolbar.markupStamp",icon:Ht,command:"markupstamp"},{id:"markup-panel",label:"toolbar.markupPanel",icon:Ft,command:"markuppanel"},{id:"markup-vis",toggle:{getValue:Gt,on:{label:"toolbar.showMarkup",icon:Le,command:"markupvis"},off:{label:"toolbar.hideMarkup",icon:Se,command:"markupvis"}}},{id:"clear-markups",label:"toolbar.clearMarkups",icon:Kt,command:"clearmarkups"},{type:"separator",id:"sep-markup-import-export"},{id:"markup-import",label:"toolbar.markupImport",icon:Ie,command:"markupimport"},{id:"markup-export",label:"toolbar.markupExport",icon:Oe,command:"markupexport"}]}}function F(){return{id:"zoom",label:"toolbar.zoom",icon:re,childrenUi:"toolbar",childIcon:"selected",selectedChildId:"zoom-extent",children:[{id:"zoom-saved",label:"toolbar.zoomSaved",icon:Pt,command:`zoom
saved`},{id:"zoom-extent",label:"toolbar.zoomExtent",icon:re,command:`zoom
all`},{id:"zoom-smart-extents",label:"toolbar.zoomSmartExtents",icon:wt,command:`zoom
smart`},{id:"zoom-window",label:"toolbar.zoomWindow",icon:Ct,command:`zoom
window`}]}}function G(l){return{id:"settings",label:"toolbar.settings",icon:jt,requiresDocument:!1,childrenUi:"toolbar",children:[Ra(),La(l),Na(l),{id:"switch-bg",label:"toolbar.switchBg",icon:Yt,command:"switchbg",disabled:Ne},Ba(),Aa(l)]}}function Ue(){return Te({id:"open",label:"toolbar.open",icon:Qt,requiresDocument:!1,childrenUi:"menu",action:()=>{try{const l=m.instance.dataSourceManager.list();if(de(l)){const e=ue(l)[0];e&&ce(e)}}catch{}}},()=>{try{const l=m.instance.dataSourceManager.list();return de(l)?[]:ue(l).map(e=>({id:`ds-${e.id}`,label:e.label,requiresDocument:!1,action:()=>{ce(e)}}))}catch{return[]}})}function K(l){return[{id:"select",label:"toolbar.select",icon:ct,command:"select"},{id:"pan",label:"toolbar.pan",icon:ht,command:"pan"},F(),Re(),{id:"layer",label:"toolbar.layer",icon:Ee,command:"layer"},Ae(),Be(),Ve(),{id:"export",label:"toolbar.export",icon:ft,childrenUi:"toolbar",children:[{id:"export-html",label:"toolbar.exportHtml",icon:mt,command:"chtml"},{id:"export-pdf",label:"toolbar.exportPdf",icon:pt,command:"cpdf"},{id:"export-svg",label:"toolbar.exportSvg",icon:bt,command:"csvg"}]},{type:"separator",id:"sep-settings"},G(l)]}function $(l){return[F(),Re(),Be(),{...Ve(),label:"toolbar.annotationShort"},{id:"layer",label:"toolbar.layerShort",icon:Ee,command:"layer"},Ae(),G(l)]}function U(l,e){var t;for(const a of l)xt(a)||(e.has(a.id)||e.set(a.id,a),!gt(a)&&(t=a.children)!=null&&t.length&&U(a.children,e))}function _e(l,e="desktop"){const t=new Map;ie(K(l),t),U([Ue()],t);const a=$(l);return e==="phone"?ie(a,t):U(a,t),t}function Va(l,e,t){if(!e.length)return l;const a=(t==null?void 0:t.before)??(t==null?void 0:t.after);if(!a)return[...l,...e];const o=l.findIndex(r=>r.id===a);if(o===-1)return[...l,...e];const i=t!=null&&t.before?o:o+1;return[...l.slice(0,i),...e,...l.slice(i)]}function _(l,e,t="desktop"){var a,o;const i=l??{},r=_e(e,t);let s;if(i.items==="default"||i.items==null?s=t==="phone"?$(e):K(e):s=ae(i.items,r),(a=i.appendItems)!=null&&a.length&&(s=Va(s,ae(i.appendItems,r),{after:i.appendItemsAfter,before:i.appendItemsBefore})),(o=i.excludeItems)!=null&&o.length){const n=new Set(i.excludeItems);s=s.filter(u=>!u.id||!n.has(u.id))}return s}function Ua(l,e){var t;if(e)return e;const a=(t=m.instance.curView)==null?void 0:t.container,o=a==null?void 0:a.parentElement;return o&&(o===l||l.contains(o))?ze(o,l,["ml-ex-ui-toolbar-main"]):a&&(a===l||l.contains(a))?a:l}const He="SimpleUiPlugin",_a={"toolbar.select":"تحديد","toolbar.open":"فتح","toolbar.pan":"تحريك العرض","toolbar.zoom":"تكبير","toolbar.zoomExtent":"ملاءمة","toolbar.zoomSmartExtents":"ذكية","toolbar.zoomWindow":"نافذة","toolbar.zoomSaved":"محفوظ","toolbar.zoomOriginal":"محفوظ","toolbar.layer":"مدير الطبقات","toolbar.find":"بحث","toolbar.layerShort":"الطبقات","toolbar.layout":"صفحة الطباعة","toolbar.settings":"الإعدادات","toolbar.simulatedMouseOn":"ماوس","toolbar.simulatedMouseOff":"عدسة","toolbar.measure":"القياس","toolbar.measureDistance":"مسافة","toolbar.measureContinuous":"مستمر","toolbar.measureAngle":"زاوية","toolbar.measureArea":"مساحة","toolbar.measureArc":"قوس","toolbar.measurePoint":"XY","toolbar.showMeasurements":"إظهار","toolbar.hideMeasurements":"إخفاء","toolbar.measurementImport":"استيراد","toolbar.measurementExport":"تصدير","toolbar.clearMeasurements":"مسح","toolbar.measurementPanel":"نتائج","toolbar.switchBg":"خلفية","toolbar.readingMode":"قراءة","toolbar.annotation":"أدوات المراجعة","toolbar.annotationShort":"مراجعة","toolbar.markupCloud":"سحابة","toolbar.markupCallout":"وسيلة شرح","toolbar.markupText":"نص","toolbar.markupRect":"مستطيل","toolbar.markupCircle":"دائرة","toolbar.markupArrow":"سهم","toolbar.markupStamp":"ختم","toolbar.markupPanel":"نتائج","toolbar.markupImport":"استيراد","toolbar.markupExport":"تصدير","toolbar.clearMarkups":"مسح","toolbar.showMarkup":"إظهار","toolbar.hideMarkup":"إخفاء","toolbar.export":"تصدير","toolbar.exportHtml":"تصدير HTML","toolbar.exportPdf":"تصدير PDF","toolbar.exportSvg":"تصدير SVG","toolbar.placement":"موضع شريط الأدوات","toolbar.placementTop":"أعلى","toolbar.placementBottom":"أسفل","toolbar.placementLeft":"يسار","toolbar.placementRight":"يمين","toolbar.themeLight":"فاتح","toolbar.themeDark":"داكن","toolbar.locale":"اللغة","toolbar.localeEn":"English","toolbar.localeJa":"日本語","toolbar.localeZh":"中文","toolbar.localeCs":"Čeština","toolbar.localeTr":"Türkçe","toolbar.localeAr":"العربية","toolbar.collapse":"طي شريط الأدوات","toolbar.moreOverflow":"المزيد من الأدوات","toolbar.expand":"توسيع شريط الأدوات","layerManager.title":"مدير الطبقات","layerManager.name":"الاسم","layerManager.on":"تشغيل","layerManager.color":"اللون","layerManager.currentLayer":"الطبقة الحالية","layerManager.zoomToLayer":"تم التكبير إلى الطبقة: {layer}","layerManager.sortByNameAsc":"ترتيب حسب الاسم تصاعديًا","layerManager.sortByNameDesc":"ترتيب حسب الاسم تنازليًا","layerManager.sortByNameNone":"إلغاء ترتيب الاسم","colorPicker.title":"تحديد اللون","colorPicker.index":"فهرس اللون: ","colorPicker.rgb":"RGB: ","colorPicker.input":"اللون","colorPicker.inputPlaceholder":"1-255 أو #RRGGBB","colorPicker.ok":"موافق","colorPicker.cancel":"إلغاء","dockPanel.close":"إغلاق اللوحة","dockPanel.dockSide":"جهة الإرساء","dockPanel.dockTop":"إرساء بالأعلى","dockPanel.dockBottom":"إرساء بالأسفل","dockPanel.dockLeft":"إرساء باليسار","dockPanel.dockRight":"إرساء باليمين","dockPanel.moreTabs":"المزيد من علامات التبويب","dockPanel.tab.layers":"الطبقات","dockPanel.tab.review":"المراجعة","dockPanel.tab.find":"بحث","dockPanel.tab.measurements":"القياسات","dockPanel.resize":"تغيير ارتفاع اللوحة","reviewPalette.searchPlaceholder":"البحث في علامات المراجعة","reviewPalette.empty":"لا توجد علامات مراجعة حتى الآن","reviewPalette.type":"النوع","reviewPalette.status":"الحالة","reviewPalette.author":"المؤلف","reviewPalette.summary":"الملخص","reviewPalette.details":"التفاصيل","reviewPalette.closeDetails":"إغلاق التفاصيل","reviewPalette.label":"التسمية","reviewPalette.comment":"التعليق","reviewPalette.zoomTo":"تكبير إلى","reviewPalette.delete":"حذف","reviewPalette.clear":"مسح الكل","reviewPalette.statusValues.open":"مفتوح","reviewPalette.statusValues.question":"سؤال","reviewPalette.statusValues.answered":"تمت الإجابة","reviewPalette.statusValues.closed":"مغلق","reviewPalette.typeValues.cloud":"سحابة","reviewPalette.typeValues.callout":"وسيلة شرح","reviewPalette.typeValues.text":"نص","reviewPalette.typeValues.rect":"مستطيل","reviewPalette.typeValues.circle":"دائرة","reviewPalette.typeValues.arrow":"سهم","reviewPalette.typeValues.stamp":"ختم","reviewPalette.typeValues.line":"خط","reviewPalette.typeValues.highlight":"تمييز","reviewPalette.typeValues.symbol":"رمز","measurePalette.filterGroup":"التصفية حسب النوع","measurePalette.empty":"لا توجد قياسات حتى الآن","measurePalette.type":"النوع","measurePalette.value":"القيمة","measurePalette.delete":"حذف","measurePalette.clear":"مسح الكل","measurePalette.typeValues.distance":"مسافة","measurePalette.typeValues.angle":"زاوية","measurePalette.typeValues.area":"مساحة","measurePalette.typeValues.arc":"قوس","measurePalette.typeValues.point":"XY","findPalette.placeholder":"ابحث عن نص","findPalette.input":"نص البحث","findPalette.find":"بحث","findPalette.matchCase":"مطابقة حالة الأحرف","findPalette.currentLayoutOnly":"صفحة الطباعة الحالية فقط","findPalette.hint":"اضغط Enter للبحث عن النصوص والنصوص متعددة الأسطر وخصائص الرموز والنص داخل الرموز والأبعاد وخطوط الإشارة والجداول في الرسم بالكامل (كل صفحات الطباعة).","findPalette.hintLayout":"اضغط Enter للبحث عن النصوص والنصوص متعددة الأسطر وخصائص الرموز والنص داخل الرموز والأبعاد وخطوط الإشارة والجداول في صفحة الطباعة الحالية.","findPalette.noResults":"لم يتم العثور على نص","findPalette.count":"عدد النتائج: {count}","findPalette.countLayouts":"عدد النتائج: {count} (عدد صفحات الطباعة: {layouts})","findPalette.countTruncated":"تم عرض النتائج الأولى فقط (الحد الأقصى: {count}) — قم بتضييق البحث","findPalette.noDocument":"افتح رسمًا للبحث","findPalette.layoutUnavailable":'تعذر فتح صفحة الطباعة "{layout}"',"findPalette.kind.text":"نص","findPalette.kind.mtext":"نص متعدد الأسطر","findPalette.kind.attribute":"خاصية الرمز","findPalette.kind.block":"نص رمز","findPalette.kind.dimension":"بُعد","findPalette.kind.leader":"خط إشارة","findPalette.kind.table":"جدول","findPalette.unnamedLayout":"(صفحة طباعة بلا اسم)"},Ha={ACAD:{layer:{description:"فتح أو إغلاق لوحة مدير الطبقات"},markuppanel:{description:"فتح لوحة المراجعة"},measurementpanel:{description:"فتح لوحة قائمة القياسات"},find:{description:"فتح لوحة البحث عن النص"}}},Fa={ACAD:{layer:{description:"Otevře nebo zavře dokovací panel správce hladin"},markuppanel:{description:"Otevře dokovací panel kontroly"},measurementpanel:{description:"Otevře dokovací panel seznamu měření"},find:{description:"Otevře dokovací panel hledání textu"}}},Ga={ACAD:{layer:{description:"Opens or closes the layer manager dock panel"},markuppanel:{description:"Opens the review palette dock panel"},measurementpanel:{description:"Opens the measurement list dock panel"},find:{description:"Opens the text search dock panel"}}},Ka={ACAD:{layer:{description:"レイヤー管理のドックパネルを開閉します"},markuppanel:{description:"レビューパレットのドックパネルを開きます"},measurementpanel:{description:"計測一覧のドックパネルを開きます"},find:{description:"文字検索のドックパネルを開きます"}}},$a={ACAD:{layer:{description:"Katman yöneticisi yerleştirme panelini açar veya kapatır"},markuppanel:{description:"İnceleme paleti yerleştirme panelini açar"},measurementpanel:{description:"Ölçüm listesi yerleştirme panelini açar"},find:{description:"Metin arama yerleştirme panelini açar"}}},Wa={ACAD:{layer:{description:"打开或关闭图层管理器停靠面板"},markuppanel:{description:"打开批注面板停靠页"},measurementpanel:{description:"打开测量列表面板"},find:{description:"打开文字查找面板"}}},Ya={"toolbar.select":"Výběr","toolbar.open":"Otevřít","toolbar.pan":"Posun","toolbar.zoom":"Zoom","toolbar.zoomExtent":"Rozsah","toolbar.zoomSmartExtents":"Chytrý","toolbar.zoomWindow":"Okno","toolbar.zoomSaved":"Uložený","toolbar.zoomOriginal":"Uložený","toolbar.layer":"Správce hladin","toolbar.find":"Hledat","toolbar.layerShort":"Hladiny","toolbar.layout":"Tisková stránka","toolbar.settings":"Nastavení","toolbar.simulatedMouseOn":"Myš","toolbar.simulatedMouseOff":"Lupa","toolbar.measure":"Měření","toolbar.measureDistance":"Vzdálenost","toolbar.measureContinuous":"Spojité","toolbar.measureAngle":"Úhel","toolbar.measureArea":"Plocha","toolbar.measureArc":"Oblouk","toolbar.measurePoint":"XY","toolbar.showMeasurements":"Zobrazit","toolbar.hideMeasurements":"Skrýt","toolbar.measurementImport":"Importovat","toolbar.measurementExport":"Exportovat","toolbar.clearMeasurements":"Vymazat","toolbar.measurementPanel":"Výsledky","toolbar.switchBg":"Pozadí","toolbar.readingMode":"Čtení","toolbar.annotation":"Nástroje kontroly","toolbar.annotationShort":"Kontrola","toolbar.markupCloud":"Obláček","toolbar.markupCallout":"Odkaz","toolbar.markupText":"Text","toolbar.markupRect":"Obdélník","toolbar.markupCircle":"Kružnice","toolbar.markupArrow":"Šipka","toolbar.markupStamp":"Razítko","toolbar.markupPanel":"Výsledky","toolbar.markupImport":"Importovat","toolbar.markupExport":"Exportovat","toolbar.clearMarkups":"Vymazat","toolbar.showMarkup":"Zobrazit","toolbar.hideMarkup":"Skrýt","toolbar.export":"Export","toolbar.exportHtml":"Exportovat HTML","toolbar.exportPdf":"Exportovat PDF","toolbar.exportSvg":"Exportovat SVG","toolbar.placement":"Pozice panelu nástrojů","toolbar.placementTop":"Nahoře","toolbar.placementBottom":"Dole","toolbar.placementLeft":"Vlevo","toolbar.placementRight":"Vpravo","toolbar.themeLight":"Světlý","toolbar.themeDark":"Tmavý","toolbar.locale":"Jazyk","toolbar.localeEn":"English","toolbar.localeJa":"日本語","toolbar.localeZh":"中文","toolbar.localeCs":"Čeština","toolbar.localeTr":"Türkçe","toolbar.localeAr":"العربية","toolbar.collapse":"Sbalit panel nástrojů","toolbar.moreOverflow":"Další nástroje","toolbar.expand":"Rozbalit panel nástrojů","layerManager.title":"Správce hladin","layerManager.name":"Název","layerManager.on":"Zapnuto","layerManager.color":"Barva","layerManager.currentLayer":"Aktuální hladina","layerManager.zoomToLayer":"Přiblíženo na hladinu: {layer}","layerManager.sortByNameAsc":"Řadit podle názvu vzestupně","layerManager.sortByNameDesc":"Řadit podle názvu sestupně","layerManager.sortByNameNone":"Zrušit řazení podle názvu","colorPicker.title":"Vybrat barvu","colorPicker.index":"Index barvy: ","colorPicker.rgb":"RGB: ","colorPicker.input":"Barva","colorPicker.inputPlaceholder":"1-255 nebo #RRGGBB","colorPicker.ok":"OK","colorPicker.cancel":"Zrušit","dockPanel.close":"Zavřít panel","dockPanel.dockSide":"Strana ukotvení","dockPanel.dockTop":"Ukotvit nahoře","dockPanel.dockBottom":"Ukotvit dole","dockPanel.dockLeft":"Ukotvit vlevo","dockPanel.dockRight":"Ukotvit vpravo","dockPanel.moreTabs":"Další karty","dockPanel.tab.layers":"Hladiny","dockPanel.tab.review":"Kontrola","dockPanel.tab.find":"Hledat","dockPanel.tab.measurements":"Měření","dockPanel.resize":"Změnit velikost panelu","reviewPalette.searchPlaceholder":"Hledat poznámky","reviewPalette.empty":"Zatím žádné poznámky","reviewPalette.type":"Typ","reviewPalette.status":"Stav","reviewPalette.author":"Autor","reviewPalette.summary":"Souhrn","reviewPalette.details":"Podrobnosti","reviewPalette.closeDetails":"Zavřít podrobnosti","reviewPalette.label":"Popisek","reviewPalette.comment":"Komentář","reviewPalette.zoomTo":"Přiblížit na","reviewPalette.delete":"Odstranit","reviewPalette.clear":"Vymazat vše","reviewPalette.statusValues.open":"Otevřeno","reviewPalette.statusValues.question":"Otázka","reviewPalette.statusValues.answered":"Zodpovězeno","reviewPalette.statusValues.closed":"Uzavřeno","reviewPalette.typeValues.cloud":"Oblak","reviewPalette.typeValues.callout":"Odnož","reviewPalette.typeValues.text":"Text","reviewPalette.typeValues.rect":"Obdélník","reviewPalette.typeValues.circle":"Kružnice","reviewPalette.typeValues.arrow":"Šipka","reviewPalette.typeValues.stamp":"Razítko","reviewPalette.typeValues.line":"Čára","reviewPalette.typeValues.highlight":"Zvýraznění","reviewPalette.typeValues.symbol":"Symbol","measurePalette.filterGroup":"Filtrovat podle typu","measurePalette.empty":"Zatím žádná měření","measurePalette.type":"Typ","measurePalette.value":"Hodnota","measurePalette.delete":"Odstranit","measurePalette.clear":"Vymazat vše","measurePalette.typeValues.distance":"Vzdálenost","measurePalette.typeValues.angle":"Úhel","measurePalette.typeValues.area":"Plocha","measurePalette.typeValues.arc":"Oblouk","measurePalette.typeValues.point":"XY","findPalette.placeholder":"Hledat text","findPalette.input":"Hledaný text","findPalette.find":"Hledat","findPalette.matchCase":"Rozlišovat velikost písmen","findPalette.currentLayoutOnly":"Pouze aktuální tisková stránka","findPalette.hint":"Stiskněte Enter pro hledání textu, víceřádkového textu, vlastností symbolů a textu v symbolech, kótách, odkazech a tabulkách v celém výkresu (všechny tiskové stránky).","findPalette.hintLayout":"Stiskněte Enter pro hledání textu, víceřádkového textu, vlastností symbolů a textu v symbolech, kótách, odkazech a tabulkách na aktuální tiskové stránce.","findPalette.noResults":"Nebyl nalezen žádný text","findPalette.count":"Nalezeno: {count}","findPalette.countLayouts":"Nalezeno: {count} (tiskové stránky: {layouts})","findPalette.countTruncated":"Zobrazeno prvních {count} výsledků – upřesněte hledání","findPalette.noDocument":"Pro hledání otevřete výkres","findPalette.layoutUnavailable":"Tiskovou stránku „{layout}“ se nepodařilo otevřít","findPalette.kind.text":"Text","findPalette.kind.mtext":"Mtext","findPalette.kind.attribute":"Vlastnost symbolu","findPalette.kind.block":"Text symbolu","findPalette.kind.dimension":"Kóta","findPalette.kind.leader":"Odkaz","findPalette.kind.table":"Tabulka","findPalette.unnamedLayout":"(nepojmenovaná tisková stránka)"},Fe={"toolbar.select":"Select","toolbar.open":"Open","toolbar.pan":"Pan","toolbar.zoom":"Zoom","toolbar.zoomExtent":"Extents","toolbar.zoomSmartExtents":"Smart","toolbar.zoomWindow":"Window","toolbar.zoomSaved":"Saved","toolbar.zoomOriginal":"Saved","toolbar.layer":"Layer Manager","toolbar.find":"Find","toolbar.layerShort":"Layers","toolbar.layout":"Print page","toolbar.settings":"Settings","toolbar.simulatedMouseOn":"Mouse","toolbar.simulatedMouseOff":"Loupe","toolbar.measure":"Measure","toolbar.measureDistance":"Distance","toolbar.measureContinuous":"Continuous","toolbar.measureAngle":"Angle","toolbar.measureArea":"Area","toolbar.measureArc":"Arc","toolbar.measurePoint":"XY","toolbar.showMeasurements":"Show","toolbar.hideMeasurements":"Hide","toolbar.measurementImport":"Import","toolbar.measurementExport":"Export","toolbar.clearMeasurements":"Clear","toolbar.measurementPanel":"Results","toolbar.switchBg":"Background","toolbar.readingMode":"Reading","toolbar.annotation":"Review tools","toolbar.annotationShort":"Review","toolbar.markupCloud":"Cloud","toolbar.markupCallout":"Callout","toolbar.markupText":"Text","toolbar.markupRect":"Rect","toolbar.markupCircle":"Circle","toolbar.markupArrow":"Arrow","toolbar.markupStamp":"Stamp","toolbar.markupPanel":"Results","toolbar.markupImport":"Import","toolbar.markupExport":"Export","toolbar.clearMarkups":"Clear","toolbar.showMarkup":"Show","toolbar.hideMarkup":"Hide","toolbar.export":"Export","toolbar.exportHtml":"Export HTML","toolbar.exportPdf":"Export PDF","toolbar.exportSvg":"Export SVG","toolbar.placement":"Toolbar Position","toolbar.placementTop":"Top","toolbar.placementBottom":"Bottom","toolbar.placementLeft":"Left","toolbar.placementRight":"Right","toolbar.themeLight":"Light","toolbar.themeDark":"Dark","toolbar.locale":"Language","toolbar.localeEn":"English","toolbar.localeJa":"日本語","toolbar.localeZh":"中文","toolbar.localeCs":"Čeština","toolbar.localeTr":"Türkçe","toolbar.localeAr":"العربية","toolbar.collapse":"Collapse toolbar","toolbar.moreOverflow":"More tools","toolbar.expand":"Expand toolbar","layerManager.title":"Layer Manager","layerManager.name":"Name","layerManager.on":"On","layerManager.color":"Color","layerManager.currentLayer":"Current layer","layerManager.zoomToLayer":"Zoomed to layer: {layer}","layerManager.sortByNameAsc":"Sort by name ascending","layerManager.sortByNameDesc":"Sort by name descending","layerManager.sortByNameNone":"Clear name sort","colorPicker.title":"Select Color","colorPicker.index":"Color Index: ","colorPicker.rgb":"RGB: ","colorPicker.input":"Color","colorPicker.inputPlaceholder":"1-255 or #RRGGBB","colorPicker.ok":"OK","colorPicker.cancel":"Cancel","dockPanel.close":"Close panel","dockPanel.dockSide":"Dock side","dockPanel.dockTop":"Dock to top","dockPanel.dockBottom":"Dock to bottom","dockPanel.dockLeft":"Dock to left","dockPanel.dockRight":"Dock to right","dockPanel.moreTabs":"More tabs","dockPanel.tab.layers":"Layers","dockPanel.tab.review":"Review","dockPanel.tab.find":"Find","dockPanel.tab.measurements":"Measurements","dockPanel.resize":"Resize panel","reviewPalette.searchPlaceholder":"Search markups","reviewPalette.empty":"No markups yet","reviewPalette.type":"Type","reviewPalette.status":"Status","reviewPalette.author":"Author","reviewPalette.summary":"Summary","reviewPalette.details":"Details","reviewPalette.closeDetails":"Close details","reviewPalette.label":"Label","reviewPalette.comment":"Comment","reviewPalette.zoomTo":"Zoom to","reviewPalette.delete":"Delete","reviewPalette.clear":"Clear all","reviewPalette.statusValues.open":"Open","reviewPalette.statusValues.question":"Question","reviewPalette.statusValues.answered":"Answered","reviewPalette.statusValues.closed":"Closed","reviewPalette.typeValues.cloud":"Cloud","reviewPalette.typeValues.callout":"Callout","reviewPalette.typeValues.text":"Text","reviewPalette.typeValues.rect":"Rectangle","reviewPalette.typeValues.circle":"Circle","reviewPalette.typeValues.arrow":"Arrow","reviewPalette.typeValues.stamp":"Stamp","reviewPalette.typeValues.line":"Line","reviewPalette.typeValues.highlight":"Highlight","reviewPalette.typeValues.symbol":"Symbol","measurePalette.filterGroup":"Filter by type","measurePalette.empty":"No measurements yet","measurePalette.type":"Type","measurePalette.value":"Value","measurePalette.delete":"Delete","measurePalette.clear":"Clear all","measurePalette.typeValues.distance":"Distance","measurePalette.typeValues.angle":"Angle","measurePalette.typeValues.area":"Area","measurePalette.typeValues.arc":"Arc","measurePalette.typeValues.point":"XY","findPalette.placeholder":"Find text","findPalette.input":"Search text","findPalette.find":"Find","findPalette.matchCase":"Match case","findPalette.currentLayoutOnly":"Current print page only","findPalette.hint":"Press Enter to search text, multiline text, symbol properties and the text in symbols, dimensions, leaders and tables in the whole drawing (all print pages).","findPalette.hintLayout":"Press Enter to search text, multiline text, symbol properties and the text in symbols, dimensions, leaders and tables in the current print page.","findPalette.noResults":"No text found","findPalette.count":"{count} found","findPalette.countLayouts":"{count} found in {layouts} print pages","findPalette.countTruncated":"First {count} results shown — refine the search","findPalette.noDocument":"Open a drawing to search","findPalette.layoutUnavailable":'Could not open print page "{layout}"',"findPalette.kind.text":"Text","findPalette.kind.mtext":"MText","findPalette.kind.attribute":"Symbol property","findPalette.kind.block":"Symbol text","findPalette.kind.dimension":"Dimension","findPalette.kind.leader":"Leader","findPalette.kind.table":"Table","findPalette.unnamedLayout":"(unnamed print page)"},ja={"toolbar.select":"選択","toolbar.open":"開く","toolbar.pan":"画面移動","toolbar.zoom":"ズーム","toolbar.zoomExtent":"範囲","toolbar.zoomSmartExtents":"スマート","toolbar.zoomWindow":"窓","toolbar.zoomSaved":"保存ビュー","toolbar.zoomOriginal":"保存ビュー","toolbar.layer":"レイヤー管理","toolbar.find":"検索","toolbar.layerShort":"レイヤー","toolbar.layout":"印刷ページ","toolbar.settings":"設定","toolbar.simulatedMouseOn":"マウス","toolbar.simulatedMouseOff":"ルーペ","toolbar.measure":"計測","toolbar.measureDistance":"距離","toolbar.measureContinuous":"連続","toolbar.measureAngle":"角度","toolbar.measureArea":"面積","toolbar.measureArc":"円弧","toolbar.measurePoint":"XY","toolbar.showMeasurements":"表示","toolbar.hideMeasurements":"非表示","toolbar.measurementImport":"読み込み","toolbar.measurementExport":"書き出し","toolbar.clearMeasurements":"クリア","toolbar.measurementPanel":"結果","toolbar.switchBg":"背景","toolbar.readingMode":"閲覧","toolbar.annotation":"レビューツール","toolbar.annotationShort":"レビュー","toolbar.markupCloud":"雲マーク","toolbar.markupCallout":"吹き出し","toolbar.markupText":"文字","toolbar.markupRect":"長方形","toolbar.markupCircle":"円","toolbar.markupArrow":"矢印","toolbar.markupStamp":"スタンプ","toolbar.markupPanel":"結果","toolbar.markupImport":"読み込み","toolbar.markupExport":"書き出し","toolbar.clearMarkups":"クリア","toolbar.showMarkup":"表示","toolbar.hideMarkup":"非表示","toolbar.export":"書き出し","toolbar.exportHtml":"HTML に書き出し","toolbar.exportPdf":"PDF に書き出し","toolbar.exportSvg":"SVG に書き出し","toolbar.placement":"ツールバーの位置","toolbar.placementTop":"上","toolbar.placementBottom":"下","toolbar.placementLeft":"左","toolbar.placementRight":"右","toolbar.themeLight":"ライト","toolbar.themeDark":"ダーク","toolbar.locale":"言語","toolbar.localeEn":"English","toolbar.localeJa":"日本語","toolbar.localeZh":"中文","toolbar.localeCs":"Čeština","toolbar.localeTr":"Türkçe","toolbar.localeAr":"العربية","toolbar.collapse":"ツールバーを折りたたむ","toolbar.moreOverflow":"その他のツール","toolbar.expand":"ツールバーを展開","layerManager.title":"レイヤー管理","layerManager.name":"名前","layerManager.on":"表示","layerManager.color":"色","layerManager.currentLayer":"現在のレイヤー","layerManager.zoomToLayer":"レイヤーにズームしました: {layer}","layerManager.sortByNameAsc":"名前の昇順で並べ替え","layerManager.sortByNameDesc":"名前の降順で並べ替え","layerManager.sortByNameNone":"名前の並べ替えを解除","colorPicker.title":"色を選択","colorPicker.index":"インデックスカラー: ","colorPicker.rgb":"RGB: ","colorPicker.input":"色","colorPicker.inputPlaceholder":"1～255 または #RRGGBB","colorPicker.ok":"OK","colorPicker.cancel":"キャンセル","dockPanel.close":"パネルを閉じる","dockPanel.dockSide":"ドッキング位置","dockPanel.dockTop":"上にドッキング","dockPanel.dockBottom":"下にドッキング","dockPanel.dockLeft":"左にドッキング","dockPanel.dockRight":"右にドッキング","dockPanel.moreTabs":"その他のタブ","dockPanel.tab.layers":"レイヤー","dockPanel.tab.review":"レビュー","dockPanel.tab.find":"検索","dockPanel.tab.measurements":"計測","dockPanel.resize":"パネルのサイズを変更","reviewPalette.searchPlaceholder":"マークアップを検索","reviewPalette.empty":"マークアップはまだありません","reviewPalette.type":"種類","reviewPalette.status":"ステータス","reviewPalette.author":"作成者","reviewPalette.summary":"概要","reviewPalette.details":"詳細","reviewPalette.closeDetails":"詳細を閉じる","reviewPalette.label":"ラベル","reviewPalette.comment":"コメント","reviewPalette.zoomTo":"ズーム","reviewPalette.delete":"削除","reviewPalette.clear":"すべてクリア","reviewPalette.statusValues.open":"未対応","reviewPalette.statusValues.question":"質問","reviewPalette.statusValues.answered":"回答済み","reviewPalette.statusValues.closed":"完了","reviewPalette.typeValues.cloud":"雲マーク","reviewPalette.typeValues.callout":"吹き出し","reviewPalette.typeValues.text":"文字","reviewPalette.typeValues.rect":"長方形","reviewPalette.typeValues.circle":"円","reviewPalette.typeValues.arrow":"矢印","reviewPalette.typeValues.stamp":"スタンプ","reviewPalette.typeValues.line":"線","reviewPalette.typeValues.highlight":"ハイライト","reviewPalette.typeValues.symbol":"記号","measurePalette.filterGroup":"種類で絞り込み","measurePalette.empty":"計測はまだありません","measurePalette.type":"種類","measurePalette.value":"値","measurePalette.delete":"削除","measurePalette.clear":"すべてクリア","measurePalette.typeValues.distance":"距離","measurePalette.typeValues.angle":"角度","measurePalette.typeValues.area":"面積","measurePalette.typeValues.arc":"円弧","measurePalette.typeValues.point":"XY","findPalette.placeholder":"文字を検索","findPalette.input":"検索する文字","findPalette.find":"検索","findPalette.matchCase":"大文字と小文字を区別","findPalette.currentLayoutOnly":"現在の印刷ページのみ","findPalette.hint":"Enter を押すと、図面全体 (すべての印刷ページ) の文字、マルチテキスト、シンボルのプロパティ、およびシンボル・寸法・引出線・表の中の文字を検索します。","findPalette.hintLayout":"Enter を押すと、現在の印刷ページの文字、マルチテキスト、シンボルのプロパティ、およびシンボル・寸法・引出線・表の中の文字を検索します。","findPalette.noResults":"文字が見つかりません","findPalette.count":"{count} 件見つかりました","findPalette.countLayouts":"{layouts} 個の印刷ページで {count} 件見つかりました","findPalette.countTruncated":"最初の {count} 件を表示しています — 検索条件を絞り込んでください","findPalette.noDocument":"検索するには図面を開いてください","findPalette.layoutUnavailable":"印刷ページ「{layout}」を開けませんでした","findPalette.kind.text":"文字","findPalette.kind.mtext":"マルチテキスト","findPalette.kind.attribute":"シンボルのプロパティ","findPalette.kind.block":"シンボルの文字","findPalette.kind.dimension":"寸法","findPalette.kind.leader":"引出線","findPalette.kind.table":"表","findPalette.unnamedLayout":"(名前のない印刷ページ)"},qa={"toolbar.select":"Seç","toolbar.open":"Aç","toolbar.pan":"Kaydır","toolbar.zoom":"Yakınlaştır","toolbar.zoomExtent":"Sınırlar","toolbar.zoomSmartExtents":"Akıllı","toolbar.zoomWindow":"Pencere","toolbar.zoomSaved":"Kayıtlı","toolbar.zoomOriginal":"Kayıtlı","toolbar.layer":"Katman Yöneticisi","toolbar.find":"Bul","toolbar.layerShort":"Katman","toolbar.layout":"Baskı sayfası","toolbar.settings":"Ayarlar","toolbar.simulatedMouseOn":"Fare","toolbar.simulatedMouseOff":"Büyüteç","toolbar.measure":"Ölçüm","toolbar.measureDistance":"Mesafe","toolbar.measureContinuous":"Sürekli","toolbar.measureAngle":"Açı","toolbar.measureArea":"Alan","toolbar.measureArc":"Yay","toolbar.measurePoint":"XY","toolbar.showMeasurements":"Göster","toolbar.hideMeasurements":"Gizle","toolbar.measurementImport":"İçe Aktar","toolbar.measurementExport":"Dışa Aktar","toolbar.clearMeasurements":"Temizle","toolbar.measurementPanel":"Sonuç","toolbar.switchBg":"Arka Plan","toolbar.readingMode":"Okuma","toolbar.annotation":"İnceleme araçları","toolbar.annotationShort":"İnceleme","toolbar.markupCloud":"Bulut","toolbar.markupCallout":"Çağrı","toolbar.markupText":"Metin","toolbar.markupRect":"Dikdörtgen","toolbar.markupCircle":"Daire","toolbar.markupArrow":"Ok","toolbar.markupStamp":"Damga","toolbar.markupPanel":"Sonuç","toolbar.markupImport":"İçe Aktar","toolbar.markupExport":"Dışa Aktar","toolbar.clearMarkups":"Temizle","toolbar.showMarkup":"Göster","toolbar.hideMarkup":"Gizle","toolbar.export":"Dışa Aktar","toolbar.exportHtml":"HTML Dışa Aktar","toolbar.exportPdf":"PDF Dışa Aktar","toolbar.exportSvg":"SVG Dışa Aktar","toolbar.placement":"Araç Çubuğu Konumu","toolbar.placementTop":"Üst","toolbar.placementBottom":"Alt","toolbar.placementLeft":"Sol","toolbar.placementRight":"Sağ","toolbar.themeLight":"Açık","toolbar.themeDark":"Koyu","toolbar.locale":"Dil","toolbar.localeEn":"English","toolbar.localeJa":"日本語","toolbar.localeZh":"中文","toolbar.localeCs":"Čeština","toolbar.localeTr":"Türkçe","toolbar.localeAr":"العربية","toolbar.collapse":"Araç çubuğunu daralt","toolbar.moreOverflow":"Diğer araçlar","toolbar.expand":"Araç çubuğunu genişlet","layerManager.title":"Katman Yöneticisi","layerManager.name":"Ad","layerManager.on":"Açık","layerManager.color":"Renk","layerManager.currentLayer":"Geçerli katman","layerManager.zoomToLayer":"Katmana yakınlaştırıldı: {layer}","layerManager.sortByNameAsc":"Ada göre artan sırala","layerManager.sortByNameDesc":"Ada göre azalan sırala","layerManager.sortByNameNone":"Ad sıralamasını temizle","colorPicker.title":"Renk Seç","colorPicker.index":"Renk İndeksi: ","colorPicker.rgb":"RGB: ","colorPicker.input":"Renk","colorPicker.inputPlaceholder":"1-255 veya #RRGGBB","colorPicker.ok":"Tamam","colorPicker.cancel":"İptal","dockPanel.close":"Paneli kapat","dockPanel.dockSide":"Yerleşim kenarı","dockPanel.dockTop":"Üste yerleştir","dockPanel.dockBottom":"Alta yerleştir","dockPanel.dockLeft":"Sola yerleştir","dockPanel.dockRight":"Sağa yerleştir","dockPanel.moreTabs":"Diğer sekmeler","dockPanel.tab.layers":"Katmanlar","dockPanel.tab.review":"İnceleme","dockPanel.tab.find":"Bul","dockPanel.tab.measurements":"Ölçümler","dockPanel.resize":"Panel boyutunu ayarla","reviewPalette.searchPlaceholder":"İşaretlerde ara","reviewPalette.empty":"Henüz işaret yok","reviewPalette.type":"Tür","reviewPalette.status":"Durum","reviewPalette.author":"Yazar","reviewPalette.summary":"Özet","reviewPalette.details":"Ayrıntılar","reviewPalette.closeDetails":"Ayrıntıları kapat","reviewPalette.label":"Etiket","reviewPalette.comment":"Yorum","reviewPalette.zoomTo":"Yakınlaştır","reviewPalette.delete":"Sil","reviewPalette.clear":"Tümünü temizle","reviewPalette.statusValues.open":"Açık","reviewPalette.statusValues.question":"Soru","reviewPalette.statusValues.answered":"Yanıtlandı","reviewPalette.statusValues.closed":"Kapalı","reviewPalette.typeValues.cloud":"Bulut","reviewPalette.typeValues.callout":"Çağrı","reviewPalette.typeValues.text":"Metin","reviewPalette.typeValues.rect":"Dikdörtgen","reviewPalette.typeValues.circle":"Daire","reviewPalette.typeValues.arrow":"Ok","reviewPalette.typeValues.stamp":"Damga","reviewPalette.typeValues.line":"Çizgi","reviewPalette.typeValues.highlight":"Vurgu","reviewPalette.typeValues.symbol":"Sembol","measurePalette.filterGroup":"Türe göre filtrele","measurePalette.empty":"Henüz ölçüm yok","measurePalette.type":"Tür","measurePalette.value":"Değer","measurePalette.delete":"Sil","measurePalette.clear":"Tümünü temizle","measurePalette.typeValues.distance":"Mesafe","measurePalette.typeValues.angle":"Açı","measurePalette.typeValues.area":"Alan","measurePalette.typeValues.arc":"Yay","measurePalette.typeValues.point":"XY","findPalette.placeholder":"Metin ara","findPalette.input":"Aranacak metin","findPalette.find":"Bul","findPalette.matchCase":"Büyük/küçük harf duyarlı","findPalette.currentLayoutOnly":"Yalnızca geçerli baskı sayfası","findPalette.hint":"Tüm çizimde (tüm baskı sayfaları) metin, çok satırlı metin, sembol özellikleri ile sembol, ölçü, kılavuz ve tablolardaki metni aramak için Enter tuşuna basın.","findPalette.hintLayout":"Geçerli baskı sayfasında metin, çok satırlı metin, sembol özellikleri ile sembol, ölçü, kılavuz ve tablolardaki metni aramak için Enter tuşuna basın.","findPalette.noResults":"Metin bulunamadı","findPalette.count":"{count} sonuç","findPalette.countLayouts":"{layouts} baskı sayfasında {count} sonuç","findPalette.countTruncated":"İlk {count} sonuç gösteriliyor — aramayı daraltın","findPalette.noDocument":"Aramak için bir çizim açın","findPalette.layoutUnavailable":'"{layout}" baskı sayfası açılamadı',"findPalette.kind.text":"Metin","findPalette.kind.mtext":"Çok satırlı metin","findPalette.kind.attribute":"Sembol özelliği","findPalette.kind.block":"Sembol metni","findPalette.kind.dimension":"Ölçü","findPalette.kind.leader":"Kılavuz","findPalette.kind.table":"Tablo","findPalette.unnamedLayout":"(adsız baskı sayfası)"},Za={"toolbar.select":"选择","toolbar.open":"打开","toolbar.pan":"平移","toolbar.zoom":"缩放","toolbar.zoomExtent":"范围","toolbar.zoomSmartExtents":"智能","toolbar.zoomWindow":"窗口","toolbar.zoomSaved":"保存的视图","toolbar.zoomOriginal":"保存的视图","toolbar.layer":"图层管理器","toolbar.find":"查找","toolbar.layerShort":"图层","toolbar.layout":"打印页","toolbar.settings":"设置","toolbar.simulatedMouseOn":"鼠标","toolbar.simulatedMouseOff":"放大","toolbar.measure":"测量","toolbar.measureDistance":"测距离","toolbar.measureContinuous":"连续测","toolbar.measureAngle":"测角度","toolbar.measureArea":"测面积","toolbar.measureArc":"测弧长","toolbar.measurePoint":"测坐标","toolbar.showMeasurements":"显示","toolbar.hideMeasurements":"隐藏","toolbar.measurementImport":"导入","toolbar.measurementExport":"导出","toolbar.clearMeasurements":"清除","toolbar.measurementPanel":"看结果","toolbar.switchBg":"背景","toolbar.readingMode":"阅读","toolbar.annotation":"审阅工具","toolbar.annotationShort":"批注","toolbar.markupCloud":"云线","toolbar.markupCallout":"标注","toolbar.markupText":"文字","toolbar.markupRect":"矩形","toolbar.markupCircle":"圆","toolbar.markupArrow":"箭头","toolbar.markupStamp":"图章","toolbar.markupPanel":"看结果","toolbar.markupImport":"导入","toolbar.markupExport":"导出","toolbar.clearMarkups":"清除","toolbar.showMarkup":"显示","toolbar.hideMarkup":"隐藏","toolbar.export":"导出","toolbar.exportHtml":"导出 HTML","toolbar.exportPdf":"导出 PDF","toolbar.exportSvg":"导出 SVG","toolbar.placement":"工具栏位置","toolbar.placementTop":"上方","toolbar.placementBottom":"下方","toolbar.placementLeft":"左侧","toolbar.placementRight":"右侧","toolbar.themeLight":"浅色","toolbar.themeDark":"深色","toolbar.locale":"语言","toolbar.localeEn":"English","toolbar.localeJa":"日本語","toolbar.localeZh":"中文","toolbar.localeCs":"Čeština","toolbar.localeTr":"Türkçe","toolbar.localeAr":"العربية","toolbar.collapse":"收起工具栏","toolbar.moreOverflow":"更多工具","toolbar.expand":"展开工具栏","layerManager.title":"图层管理器","layerManager.name":"名称","layerManager.on":"开","layerManager.color":"颜色","layerManager.currentLayer":"当前图层","layerManager.zoomToLayer":"已缩放至图层：{layer}","layerManager.sortByNameAsc":"按名称升序排序","layerManager.sortByNameDesc":"按名称降序排序","layerManager.sortByNameNone":"取消名称排序","colorPicker.title":"选择颜色","colorPicker.index":"颜色索引：","colorPicker.rgb":"RGB：","colorPicker.input":"颜色","colorPicker.inputPlaceholder":"1-255 或 #RRGGBB","colorPicker.ok":"确定","colorPicker.cancel":"取消","dockPanel.close":"关闭面板","dockPanel.dockSide":"停靠位置","dockPanel.dockTop":"停靠在顶部","dockPanel.dockBottom":"停靠在底部","dockPanel.dockLeft":"停靠在左侧","dockPanel.dockRight":"停靠在右侧","dockPanel.moreTabs":"更多标签页","dockPanel.tab.layers":"图层","dockPanel.tab.review":"批注","dockPanel.tab.find":"查找","dockPanel.tab.measurements":"测量","dockPanel.resize":"调整面板高度","reviewPalette.searchPlaceholder":"搜索批注","reviewPalette.empty":"暂无批注","reviewPalette.type":"类型","reviewPalette.status":"状态","reviewPalette.author":"作者","reviewPalette.summary":"摘要","reviewPalette.details":"详情","reviewPalette.closeDetails":"关闭详情","reviewPalette.label":"标签","reviewPalette.comment":"评论","reviewPalette.zoomTo":"缩放到","reviewPalette.delete":"删除","reviewPalette.clear":"全部清除","reviewPalette.statusValues.open":"打开","reviewPalette.statusValues.question":"疑问","reviewPalette.statusValues.answered":"已答复","reviewPalette.statusValues.closed":"已关闭","reviewPalette.typeValues.cloud":"云线","reviewPalette.typeValues.callout":"标注","reviewPalette.typeValues.text":"文字","reviewPalette.typeValues.rect":"矩形","reviewPalette.typeValues.circle":"圆","reviewPalette.typeValues.arrow":"箭头","reviewPalette.typeValues.stamp":"图章","reviewPalette.typeValues.line":"直线","reviewPalette.typeValues.highlight":"高亮","reviewPalette.typeValues.symbol":"符号","measurePalette.filterGroup":"按类型筛选","measurePalette.empty":"暂无测量","measurePalette.type":"类型","measurePalette.value":"数值","measurePalette.delete":"删除","measurePalette.clear":"全部清除","measurePalette.typeValues.distance":"距离","measurePalette.typeValues.angle":"角度","measurePalette.typeValues.area":"面积","measurePalette.typeValues.arc":"弧长","measurePalette.typeValues.point":"坐标","findPalette.placeholder":"查找文字","findPalette.input":"搜索文字","findPalette.find":"查找","findPalette.matchCase":"区分大小写","findPalette.currentLayoutOnly":"仅当前打印页","findPalette.hint":"按回车键在整个图纸（所有打印页）中搜索文字、多行文字、符号属性，以及符号、标注、引线和表格中的文字。","findPalette.hintLayout":"按回车键在当前打印页中搜索文字、多行文字、符号属性，以及符号、标注、引线和表格中的文字。","findPalette.noResults":"未找到文字","findPalette.count":"找到 {count} 项","findPalette.countLayouts":"在 {layouts} 个打印页中找到 {count} 项","findPalette.countTruncated":"仅显示前 {count} 项结果，请缩小搜索范围","findPalette.noDocument":"请先打开图纸再搜索","findPalette.layoutUnavailable":"无法打开打印页“{layout}”","findPalette.kind.text":"文字","findPalette.kind.mtext":"多行文字","findPalette.kind.attribute":"符号属性","findPalette.kind.block":"符号文字","findPalette.kind.dimension":"标注","findPalette.kind.leader":"引线","findPalette.kind.table":"表格","findPalette.unnamedLayout":"（未命名打印页）"},x="simpleUi";let me=!1;function g(l){const e={};for(const[t,a]of Object.entries(l)){const o=t.split(".");let i=e;for(let r=0;r<o.length-1;r++){const s=o[r],n=i[s];(!n||typeof n=="string")&&(i[s]={}),i=i[s]}i[o[o.length-1]]=a}return e}function Ge(){me||(v.mergeLocaleMessage("en",{command:Ga,[x]:g(Fe)}),v.mergeLocaleMessage("ja",{command:Ka,[x]:g(ja)}),v.mergeLocaleMessage("zh",{command:Wa,[x]:g(Za)}),v.mergeLocaleMessage("cs",{command:Fa,[x]:g(Ya)}),v.mergeLocaleMessage("tr",{command:$a,[x]:g(qa)}),v.mergeLocaleMessage("ar",{command:Ha,[x]:g(_a)}),me=!0)}class Ke{t(e,t){const a=`${x}.${e}`;let o=v.t(a,{fallback:e});return o===e&&(o=Fe[e]??e),t?Object.keys(t).reduce((i,r)=>i.replace(`{${r}}`,t[r]),o):o}}function pe(l){const e=l.getAttribute("data-ml-ui-theme");if(e==="light"||e==="dark")return e}function be(l){const e=I.instance().getVar(B.COLORTHEME,l);return xe(e)?"light":"dark"}class Xa{constructor(e,t){this.host=e,this.onThemeChanged=t,this.handleSysVarChanged=a=>{var o;const i=(o=m.instance.curDocument)==null?void 0:o.database;!i||a.database!==i||a.name.toLowerCase()===B.COLORTHEME.toLowerCase()&&this.applyTheme(xe(a.newVal)?"light":"dark")},this.handleDocumentActivated=a=>{this.applyTheme(be(a.doc.database))}}start(){this.syncFromCurrentSource(),I.instance().events.sysVarChanged.addEventListener(this.handleSysVarChanged),m.instance.events.documentActivated.addEventListener(this.handleDocumentActivated)}stop(){I.instance().events.sysVarChanged.removeEventListener(this.handleSysVarChanged),m.instance.events.documentActivated.removeEventListener(this.handleDocumentActivated)}getTheme(){return pe(this.host)??"dark"}setTheme(e){var t;const a=(t=m.instance.curDocument)==null?void 0:t.database;if(a){I.instance().setVar(B.COLORTHEME,e==="light"?1:0,a);return}this.applyTheme(e)}syncFromCurrentSource(){var e;const t=(e=m.instance.curDocument)==null?void 0:e.database;if(t){this.applyTheme(be(t));return}pe(this.host)}applyTheme(e){var t;qe(e,this.host),(t=this.onThemeChanged)==null||t.call(this)}}const H="ml-ex-ui-styles";function P(){if(vt(),document.getElementById(H))return;const l=document.createElement("style");l.id=H,l.textContent=`
    .ml-ex-ui-layer-manager {
      position: absolute;
      z-index: 100;
      width: min(280px, calc(100% - 16px));
      max-width: calc(100% - 16px);
      min-height: 120px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      background: var(--ml-ui-bg, #ffffff);
      border: 1px solid var(--ml-ui-border, #dcdfe6);
      box-shadow: var(--ml-ui-shadow, 0 6px 18px rgba(0, 0, 0, 0.35));
      border-radius: 8px;
      overflow: hidden;
      color: var(--ml-ui-text, #303133);
      font-size: 12px;
    }

    .ml-ex-ui-layer-manager.is-compact {
      width: calc(100% - 16px);
      max-width: none;
      border-radius: 12px 12px 8px 8px;
    }

    .ml-ex-ui-layer-manager.is-compact .ml-ex-ui-layer-table th:first-child,
    .ml-ex-ui-layer-manager.is-compact .ml-ex-ui-layer-table td:first-child {
      width: 100%;
      max-width: 0;
    }

    .ml-ex-ui-layer-manager.is-compact .ml-ex-ui-layer-name {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ml-ex-ui-layer-manager.is-hidden {
      display: none;
    }

    .ml-ex-ui-layer-manager .ml-ex-ui-layer-list {
      flex: 1;
      min-height: 0;
    }

    .ml-ex-ui-layer-manager-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 10px;
      border-bottom: 1px solid var(--ml-ui-border, #dcdfe6);
      user-select: none;
      font-weight: 600;
      flex: 0 0 auto;
    }

    .ml-ex-ui-layer-table-wrap {
      overflow: auto;
      flex: 1;
    }

    .ml-ex-ui-layer-table {
      width: 100%;
      border-collapse: collapse;
    }

    .ml-ex-ui-layer-table th,
    .ml-ex-ui-layer-table td {
      padding: 4px 8px;
      border-bottom: 1px solid var(--ml-ui-border, #dcdfe6);
      text-align: left;
    }

    .ml-ex-ui-layer-table th {
      position: sticky;
      top: 0;
      background: var(--ml-ui-bg, #ffffff);
      z-index: 1;
    }

    .ml-ex-ui-layer-table td.center,
    .ml-ex-ui-layer-table th.center {
      text-align: center;
      vertical-align: middle;
    }

    .ml-ex-ui-layer-name-header.is-sortable {
      padding: 0;
    }

    .ml-ex-ui-layer-name-sort {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      width: 100%;
      margin: 0;
      padding: 4px 8px;
      border: 0;
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }

    .ml-ex-ui-layer-name-sort:hover {
      color: var(--ml-ui-accent, var(--ml-brand));
    }

    .ml-ex-ui-layer-name-header.is-sorted-asc .ml-ex-ui-layer-name-sort,
    .ml-ex-ui-layer-name-header.is-sorted-desc .ml-ex-ui-layer-name-sort {
      color: var(--ml-ui-accent, var(--ml-brand));
    }

    .ml-ex-ui-layer-sort-indicator {
      display: inline-block;
      min-width: 0.75em;
      font-size: 10px;
      line-height: 1;
      opacity: 0.85;
    }

    .ml-ex-ui-layer-header-on {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .ml-ex-ui-layer-header-on span {
      line-height: 1;
    }

    .ml-ex-ui-layer-header-on input[type='checkbox'] {
      margin: 0;
    }

    .ml-ex-ui-layer-name {
      display: inline-flex;
      align-items: center;
      gap: 2px;
    }

    .ml-ex-ui-layer-current-marker {
      color: var(--ml-ui-accent, var(--ml-brand));
      font-weight: 600;
    }

    .ml-ex-ui-layer-color {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 1px solid var(--ml-ui-border, #dcdfe6);
      border-radius: 3px;
      cursor: pointer;
    }

    .ml-ex-ui-color-dialog-backdrop {
      position: fixed;
      inset: 0;
      z-index: 120;
      background: var(--ml-ui-overlay, rgba(0, 0, 0, 0.18));
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ml-ex-ui-color-dialog {
      width: fit-content;
      max-width: calc(100vw - 24px);
      background: var(--ml-ui-bg, #ffffff);
      border: 1px solid var(--ml-ui-border, #dcdfe6);
      border-radius: 8px;
      box-shadow: var(--ml-ui-shadow, 0 6px 18px rgba(0, 0, 0, 0.35));
      padding: 12px;
      color: var(--ml-ui-text, #303133);
      font-family: "Noto Sans JP Variable", "Noto Sans JP", Arial, sans-serif;
      font-size: 12px;
    }

    .ml-ex-ui-color-dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .ml-ex-ui-color-dialog-title {
      font-weight: 600;
    }

    .ml-ex-ui-color-dialog-close {
      border: none;
      background: transparent;
      color: var(--ml-ui-text-muted, #606266);
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
      padding: 2px 6px;
    }

    .ml-ex-ui-dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 8px;
    }

    .ml-ex-ui-btn {
      padding: 4px 12px;
      border-radius: 4px;
      border: 1px solid var(--ml-ui-border, #dcdfe6);
      background: var(--ml-ui-bg, #ffffff);
      color: var(--ml-ui-text, #303133);
      cursor: pointer;
      font-size: 12px;
    }

    .ml-ex-ui-btn-primary {
      border-color: var(--ml-ui-accent, var(--ml-brand));
      background: var(--ml-ui-accent, var(--ml-brand));
      color: #fff;
    }

    .ml-ex-ui-toast {
      position: fixed;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 200;
      padding: 8px 14px;
      border-radius: 6px;
      background: var(--ml-ui-bg, #ffffff);
      color: var(--ml-ui-text, #303133);
      border: 1px solid var(--ml-ui-border, #dcdfe6);
      box-shadow: var(--ml-ui-shadow, 0 2px 6px rgba(0, 0, 0, 0.12));
    }

    .ml-ex-ui-layer-list {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      overflow: hidden;
    }

    .ml-ex-ui-review-palette {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      gap: 8px;
      padding: 8px;
      box-sizing: border-box;
      color: var(--ml-ui-text, #303133);
      font-size: 12px;
    }

    .ml-ex-ui-review-toolbar {
      display: flex;
      gap: 8px;
      align-items: center;
      flex: 0 0 auto;
    }

    .ml-ex-ui-review-search,
    .ml-ex-ui-review-input,
    .ml-ex-ui-review-select,
    .ml-ex-ui-review-textarea {
      box-sizing: border-box;
      width: 100%;
      border: 1px solid var(--ml-ui-border, #dcdfe6);
      border-radius: 4px;
      background: var(--ml-ui-bg, #ffffff);
      color: var(--ml-ui-text, #303133);
      font: inherit;
      padding: 4px 8px;
    }

    .ml-ex-ui-review-search {
      flex: 1;
      min-width: 0;
    }

    .ml-ex-ui-review-textarea {
      resize: vertical;
      min-height: 44px;
    }

    .ml-ex-ui-review-btn {
      flex: 0 0 auto;
      border: 1px solid var(--ml-ui-border, #dcdfe6);
      border-radius: 4px;
      background: var(--ml-ui-bg, #ffffff);
      color: var(--ml-ui-text, #303133);
      font: inherit;
      padding: 4px 8px;
      cursor: pointer;
    }

    .ml-ex-ui-review-btn:hover:not(:disabled) {
      background: var(--ml-ui-border, rgba(0, 0, 0, 0.06));
    }

    .ml-ex-ui-review-btn:disabled {
      opacity: 0.5;
      cursor: default;
    }

    .ml-ex-ui-review-btn-danger {
      color: var(--ml-ui-danger, #f56c6c);
      border-color: var(--ml-ui-danger, #f56c6c);
    }

    .ml-ex-ui-review-table-wrap {
      flex: 1;
      min-height: 120px;
      overflow: auto;
    }

    .ml-ex-ui-review-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }

    .ml-ex-ui-review-table th,
    .ml-ex-ui-review-table td {
      padding: 4px 6px;
      text-align: left;
      border-bottom: 1px solid var(--ml-ui-border, #dcdfe6);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ml-ex-ui-review-table th {
      font-weight: 600;
      position: sticky;
      top: 0;
      background: var(--ml-ui-bg, #ffffff);
    }

    .ml-ex-ui-review-table th:nth-child(1),
    .ml-ex-ui-review-table td:nth-child(1) {
      width: 88px;
    }

    .ml-ex-ui-review-table th:nth-child(2),
    .ml-ex-ui-review-table td:nth-child(2) {
      width: 96px;
    }

    .ml-ex-ui-review-row {
      cursor: pointer;
    }

    .ml-ex-ui-review-row:hover {
      background: var(--ml-ui-border, rgba(0, 0, 0, 0.06));
    }

    .ml-ex-ui-review-row.is-selected {
      background: var(--ml-ui-accent-soft, var(--ml-brand-soft));
    }

    .ml-ex-ui-review-empty-row td {
      text-align: center;
      color: var(--ml-ui-muted, #909399);
      white-space: normal;
      padding: 16px 8px;
    }

    .ml-ex-ui-review-detail {
      border-top: 1px solid var(--ml-ui-border, #dcdfe6);
      padding-top: 6px;
      max-height: 46%;
      overflow: auto;
      flex: 0 0 auto;
    }

    .ml-ex-ui-review-detail-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px;
      margin-bottom: 4px;
    }

    .ml-ex-ui-review-detail-title {
      font-weight: 600;
    }

    .ml-ex-ui-review-detail-close {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      margin-left: auto;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: var(--ml-ui-text, #303133);
      cursor: pointer;
      padding: 0;
    }

    .ml-ex-ui-review-detail-close:hover {
      background: var(--ml-ui-border, rgba(0, 0, 0, 0.06));
    }

    .ml-ex-ui-review-field {
      margin-bottom: 4px;
    }

    .ml-ex-ui-review-field-label {
      display: block;
      margin-bottom: 2px;
      line-height: 1.2;
    }

    .ml-ex-ui-review-detail-actions {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      gap: 4px;
      margin-top: 4px;
    }

    .ml-ex-ui-review-detail-actions .ml-ex-ui-review-btn {
      flex: 0 0 auto;
      width: auto;
    }

    .ml-ex-ui-measure-palette {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      gap: 8px;
      padding: 8px;
      box-sizing: border-box;
      color: var(--ml-ui-text, #303133);
      font-size: 12px;
    }

    .ml-ex-ui-measure-toolbar {
      display: flex;
      gap: 8px;
      align-items: center;
      flex: 0 0 auto;
    }

    .ml-ex-ui-measure-filter {
      display: flex;
      flex: 1 1 auto;
      min-width: 0;
      overflow: hidden;
      border: 1px solid var(--ml-ui-border, #dcdfe6);
      border-radius: 4px;
    }

    .ml-ex-ui-measure-filter-btn {
      flex: 1 1 0;
      min-width: 0;
      border: none;
      border-right: 1px solid var(--ml-ui-border, #dcdfe6);
      background: var(--ml-ui-bg, #ffffff);
      color: var(--ml-ui-text, #303133);
      font: inherit;
      font-size: 11px;
      padding: 4px 2px;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ml-ex-ui-measure-filter-btn:last-child {
      border-right: none;
    }

    .ml-ex-ui-measure-filter-btn:hover:not(.is-active) {
      background: var(--ml-ui-border, rgba(0, 0, 0, 0.06));
    }

    .ml-ex-ui-measure-filter-btn.is-active {
      background: var(--ml-ui-accent-soft, color-mix(in srgb, var(--ml-brand) 16%, transparent));
      color: var(--ml-ui-accent, var(--ml-brand));
    }

    .ml-ex-ui-measure-btn {
      flex: 0 0 auto;
      border: 1px solid var(--ml-ui-border, #dcdfe6);
      border-radius: 4px;
      background: var(--ml-ui-bg, #ffffff);
      color: var(--ml-ui-text, #303133);
      font: inherit;
      padding: 4px 8px;
      cursor: pointer;
    }

    .ml-ex-ui-measure-btn:hover:not(:disabled) {
      background: var(--ml-ui-border, rgba(0, 0, 0, 0.06));
    }

    .ml-ex-ui-measure-btn:disabled {
      opacity: 0.5;
      cursor: default;
    }

    .ml-ex-ui-measure-btn-danger {
      color: #f56c6c;
      border-color: rgba(245, 108, 108, 0.55);
    }

    .ml-ex-ui-measure-table-wrap {
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
    }

    .ml-ex-ui-measure-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }

    .ml-ex-ui-measure-table th,
    .ml-ex-ui-measure-table td {
      padding: 6px 8px;
      text-align: left;
      border-bottom: 1px solid var(--ml-ui-border, #dcdfe6);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ml-ex-ui-measure-table th {
      font-weight: 600;
      color: var(--ml-ui-text-muted, #606266);
    }

    .ml-ex-ui-measure-table th:nth-child(1),
    .ml-ex-ui-measure-table td:nth-child(1) {
      width: 28%;
    }

    .ml-ex-ui-measure-actions-col {
      width: 72px;
      text-align: right;
    }

    .ml-ex-ui-measure-row {
      cursor: pointer;
    }

    .ml-ex-ui-measure-row:hover {
      background: var(--ml-ui-border, rgba(0, 0, 0, 0.04));
    }

    .ml-ex-ui-measure-row.is-selected {
      background: var(--ml-ui-accent-soft, var(--ml-brand-soft));
    }

    .ml-ex-ui-measure-empty-row td {
      text-align: center;
      color: var(--ml-ui-text-muted, #606266);
      cursor: default;
    }

    .ml-ex-ui-measure-row-delete {
      padding: 2px 6px;
      font-size: 11px;
    }

    .ml-ex-ui-find-palette {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      gap: 8px;
      padding: 8px;
      box-sizing: border-box;
      color: var(--ml-ui-text, #303133);
      font-size: 12px;
    }

    .ml-ex-ui-find-form {
      display: flex;
      gap: 8px;
      align-items: center;
      flex: 0 0 auto;
    }

    .ml-ex-ui-find-input {
      flex: 1 1 auto;
      min-width: 0;
      box-sizing: border-box;
      border: 1px solid var(--ml-ui-border, #dcdfe6);
      border-radius: 4px;
      background: var(--ml-ui-bg, #ffffff);
      color: var(--ml-ui-text, #303133);
      font: inherit;
      /* 16px avoids iOS focus zoom on touch screens. */
      font-size: 16px;
      padding: 4px 8px;
    }

    .ml-ex-ui-find-option {
      display: flex;
      gap: 6px;
      align-items: center;
      flex: 0 0 auto;
      cursor: pointer;
    }

    .ml-ex-ui-find-status {
      flex: 0 0 auto;
      color: var(--ml-ui-text-muted, #606266);
    }

    .ml-ex-ui-find-list {
      flex: 1 1 auto;
      min-height: 0;
      margin: 0;
      padding: 0;
      list-style: none;
      overflow: auto;
      touch-action: pan-y;
    }

    .ml-ex-ui-find-row {
      padding: 6px 8px;
      border-bottom: 1px solid var(--ml-ui-border, #dcdfe6);
      cursor: pointer;
    }

    .ml-ex-ui-find-row:hover {
      background: var(--ml-ui-border, rgba(0, 0, 0, 0.04));
    }

    .ml-ex-ui-find-row.is-selected {
      background: var(--ml-ui-accent-soft, var(--ml-brand-soft));
    }

    .ml-ex-ui-find-layout {
      color: var(--ml-ui-text-muted, #606266);
      font-size: 11px;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ml-ex-ui-find-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ml-ex-ui-find-meta {
      color: var(--ml-ui-text-muted, #606266);
      font-size: 11px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ml-ex-ui-layer-list .ml-ex-ui-layer-table-wrap {
      flex: 1;
      min-height: 0;
    }

    .ml-ex-ui-host-dock {
      min-height: 0;
      min-width: 0;
    }

    .ml-ex-ui-host-dock:not([class*='ml-ex-ui-host-dock-']) {
      display: flex;
      flex-direction: column;
    }

    .ml-ex-ui-host-dock-top,
    .ml-ex-ui-host-dock-bottom,
    .ml-ex-ui-host-dock-sheet {
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .ml-ex-ui-host-dock-left,
    .ml-ex-ui-host-dock-right {
      display: flex;
      flex-direction: row;
      min-width: 0;
      min-height: 0;
    }

    .ml-ex-ui-dock-main {
      flex: 1 1 auto;
      min-height: 0;
      min-width: 0;
      position: relative;
      overflow: hidden;
    }

    .ml-ex-ui-dock-panel {
      --ml-ex-ui-dock-size: 240px;
      display: flex;
      flex-direction: column;
      flex: 0 0 auto;
      background: var(--ml-ui-bg, #ffffff);
      color: var(--ml-ui-text, #303133);
      border: 1px solid var(--ml-ui-border, #dcdfe6);
      font-size: 12px;
      z-index: 25;
      min-height: 0;
      min-width: 0;
      overflow: hidden;
    }

    .ml-ex-ui-dock-panel[data-open='false'] {
      display: none;
    }

    .ml-ex-ui-dock-panel[data-side='bottom'],
    .ml-ex-ui-dock-panel[data-side='top'] {
      width: 100%;
      height: var(--ml-ex-ui-dock-size);
      border-left: none;
      border-right: none;
    }

    .ml-ex-ui-dock-panel[data-side='bottom'] {
      border-bottom: none;
      border-top: none;
    }

    .ml-ex-ui-dock-panel[data-side='top'] {
      border-top: none;
      border-bottom: none;
    }

    .ml-ex-ui-dock-panel[data-side='left'],
    .ml-ex-ui-dock-panel[data-side='right'] {
      flex-direction: row;
      height: 100%;
      width: var(--ml-ex-ui-dock-size);
      border-top: none;
      border-bottom: none;
    }

    .ml-ex-ui-dock-content {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
      min-width: 0;
      overflow: hidden;
    }

    .ml-ex-ui-dock-panel[data-side='left'] {
      border-left: none;
      border-right: none;
    }

    .ml-ex-ui-dock-panel[data-side='right'] {
      border-right: none;
      border-left: none;
    }

    .ml-ex-ui-dock-resize-handle {
      flex: 0 0 auto;
      background: transparent;
      touch-action: none;
      z-index: 1;
    }

    .ml-ex-ui-dock-resize-handle:hover,
    .ml-ex-ui-dock-resize-handle:active {
      background: var(--ml-ui-border, rgba(0, 0, 0, 0.08));
    }

    .ml-ex-ui-dock-panel[data-side='bottom'] .ml-ex-ui-dock-resize-handle {
      order: -1;
      width: 100%;
      height: 6px;
      cursor: ns-resize;
      border-top: 1px solid var(--ml-ui-border, #dcdfe6);
    }

    .ml-ex-ui-dock-panel[data-side='top'] .ml-ex-ui-dock-resize-handle {
      order: 2;
      width: 100%;
      height: 6px;
      cursor: ns-resize;
      border-bottom: 1px solid var(--ml-ui-border, #dcdfe6);
    }

    .ml-ex-ui-dock-panel[data-side='left'] .ml-ex-ui-dock-resize-handle {
      order: 2;
      align-self: stretch;
      width: 6px;
      cursor: ew-resize;
      border-right: 1px solid var(--ml-ui-border, #dcdfe6);
    }

    .ml-ex-ui-dock-panel[data-side='right'] .ml-ex-ui-dock-resize-handle {
      order: -1;
      align-self: stretch;
      width: 6px;
      cursor: ew-resize;
      border-left: 1px solid var(--ml-ui-border, #dcdfe6);
    }

    .ml-ex-ui-dock-sheet-chrome {
      display: none;
      position: relative;
    }

    .ml-ex-ui-dock-sheet-grabber {
      flex: 1 1 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 20px;
      cursor: ns-resize;
      touch-action: none;
    }

    .ml-ex-ui-dock-sheet-grabber::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 36px;
      height: 4px;
      border-radius: 2px;
      background: var(--ml-ui-text-muted, #909399);
      opacity: 0.7;
    }

    .ml-ex-ui-dock-sheet-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 28px;
      border: none;
      background: transparent;
      color: var(--ml-ui-text-muted, #606266);
      cursor: pointer;
      flex: 0 0 auto;
      position: relative;
      z-index: 1;
    }

    .ml-ex-ui-dock-sheet-close:hover {
      color: var(--ml-ui-text, #303133);
    }

    .ml-ex-ui-dock-header {
      display: flex;
      align-items: stretch;
      flex: 0 0 auto;
      border-bottom: 1px solid var(--ml-ui-border, #dcdfe6);
      background: var(--ml-ui-bg, #ffffff);
      min-height: 28px;
    }

    .ml-ex-ui-dock-tabs-wrap {
      display: flex;
      align-items: stretch;
      flex: 1 1 auto;
      min-width: 0;
    }

    .ml-ex-ui-dock-tabs {
      display: flex;
      align-items: stretch;
      flex: 1 1 auto;
      min-width: 0;
      overflow: hidden;
    }

    .ml-ex-ui-dock-tab-overflow-btn {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      border: none;
      border-bottom: 2px solid transparent;
      background: transparent;
      color: var(--ml-ui-text-muted, #606266);
      font-size: 14px;
      line-height: 1;
      cursor: pointer;
    }

    .ml-ex-ui-dock-tab-overflow-btn[hidden] {
      display: none !important;
    }

    .ml-ex-ui-dock-tab-overflow-btn:hover,
    .ml-ex-ui-dock-tab-overflow-btn.is-active {
      color: var(--ml-ui-text, #303133);
      background: var(--ml-ui-border, rgba(0, 0, 0, 0.04));
    }

    .ml-ex-ui-dock-tab-overflow-btn.is-active {
      border-bottom-color: var(--ml-ui-accent, var(--ml-brand));
    }

    .ml-ex-ui-dock-tab[hidden] {
      display: none;
    }

    .ml-ex-ui-dock-tab {
      flex: 0 0 auto;
      border: none;
      border-bottom: 2px solid transparent;
      background: transparent;
      color: var(--ml-ui-text-muted, #606266);
      padding: 6px 12px;
      font-size: 12px;
      cursor: pointer;
      white-space: nowrap;
    }

    .ml-ex-ui-dock-tab:hover {
      color: var(--ml-ui-text, #303133);
      background: var(--ml-ui-border, rgba(0, 0, 0, 0.04));
    }

    .ml-ex-ui-dock-tab.is-active {
      color: var(--ml-ui-text, #303133);
      border-bottom-color: var(--ml-ui-accent, var(--ml-brand));
    }

    .ml-ex-ui-dock-actions {
      display: flex;
      align-items: center;
      flex: 0 0 auto;
      gap: 2px;
      padding: 0 4px;
    }

    .ml-ex-ui-dock-action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: none;
      border-radius: 4px;
      background: transparent;
      color: var(--ml-ui-text-muted, #606266);
      cursor: pointer;
    }

    .ml-ex-ui-dock-action-btn:hover {
      background: var(--ml-ui-border, rgba(0, 0, 0, 0.06));
      color: var(--ml-ui-text, #303133);
    }

    .ml-ex-ui-dock-body {
      flex: 1 1 auto;
      min-height: 0;
      min-width: 0;
      overflow: hidden;
      position: relative;
    }

    .ml-ex-ui-dock-tab-panel {
      position: absolute;
      inset: 0;
      overflow: auto;
    }

    .ml-ex-ui-dock-tab-panel:has(> .ml-ex-ui-review-palette),
    .ml-ex-ui-dock-tab-panel:has(> .ml-ex-ui-measure-palette),
    .ml-ex-ui-dock-tab-panel:has(> .ml-ex-ui-find-palette),
    .ml-ex-ui-dock-tab-panel:has(> .ml-ex-ui-layer-list) {
      overflow: hidden;
    }

    .ml-ex-ui-dock-tab-panel[hidden] {
      display: none;
    }

    .ml-ex-ui-dock-side-menu {
      position: fixed;
      z-index: 110;
      min-width: 160px;
      padding: 4px 0;
      background: var(--ml-ui-bg, #ffffff);
      border: 1px solid var(--ml-ui-border, #dcdfe6);
      border-radius: 6px;
      box-shadow: var(--ml-ui-shadow, 0 6px 18px rgba(0, 0, 0, 0.35));
    }

    .ml-ex-ui-dock-side-menu-item {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      border: none;
      background: transparent;
      color: var(--ml-ui-text, #303133);
      padding: 6px 12px;
      font-size: 12px;
      cursor: pointer;
      text-align: left;
    }

    .ml-ex-ui-dock-side-menu-item:hover {
      background: var(--ml-ui-border, rgba(0, 0, 0, 0.06));
    }

    .ml-ex-ui-dock-side-menu-item.is-selected {
      color: var(--ml-ui-accent, var(--ml-brand));
    }

    .ml-ex-ui-dock-tab-overflow-menu {
      position: fixed;
      z-index: 110;
      min-width: 160px;
      padding: 4px 0;
      background: var(--ml-ui-bg, #ffffff);
      border: 1px solid var(--ml-ui-border, #dcdfe6);
      border-radius: 6px;
      box-shadow: var(--ml-ui-shadow, 0 6px 18px rgba(0, 0, 0, 0.35));
    }

    .ml-ex-ui-dock-tab-overflow-menu-item {
      display: block;
      width: 100%;
      border: none;
      background: transparent;
      color: var(--ml-ui-text, #303133);
      padding: 6px 12px;
      font-size: 12px;
      cursor: pointer;
      text-align: left;
      white-space: nowrap;
    }

    .ml-ex-ui-dock-tab-overflow-menu-item:hover {
      background: var(--ml-ui-border, rgba(0, 0, 0, 0.06));
    }

    .ml-ex-ui-dock-tab-overflow-menu-item.is-selected {
      color: var(--ml-ui-accent, var(--ml-brand));
    }

    @media (max-width: ${yt}px) {
      .ml-ex-ui-dock-panel[data-open='true'][data-phone-sheet='true'] {
        position: absolute;
        left: 0;
        right: 0;
        top: auto;
        bottom: var(--ml-ex-ui-phone-sheet-inset, 0px);
        width: 100%;
        height: var(--ml-ex-ui-dock-size);
        max-height: calc(100% - var(--ml-ex-ui-phone-sheet-inset, 0px));
        flex: none;
        flex-direction: column;
        z-index: 35;
        border: none;
        border-top: 1px solid var(--ml-ui-border, #dcdfe6);
        border-radius: 12px 12px 0 0;
        box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.18);
      }

      .ml-ex-ui-dock-panel[data-phone-sheet='true'] .ml-ex-ui-dock-resize-handle {
        display: none;
      }

      .ml-ex-ui-dock-panel[data-phone-sheet='true'] .ml-ex-ui-dock-sheet-chrome {
        display: flex;
        align-items: center;
        flex: 0 0 auto;
        min-height: 28px;
      }

      .ml-ex-ui-dock-panel[data-phone-sheet='true'] .ml-ex-ui-dock-header {
        display: none;
      }

      .ml-ex-ui-host-dock-sheet .ml-ex-ui-dock-main {
        flex: 1 1 auto;
      }
    }
  `,document.head.appendChild(l)}function Ja(){var l;ut(),!document.querySelector(".ml-ex-ui-layer-manager, .ml-ex-ui-dock-panel, .ml-ex-ui-review-palette, .ml-ex-ui-measure-palette, .ml-ex-ui-find-palette")&&((l=document.getElementById(H))==null||l.remove())}const R=120,fe=.75,Qa=28;class eo{constructor(e){this.tabs=new Map,this.overflowTabIds=[],this.resizeStartPos=0,this.resizeStartSize=0,this.handleResizePointerDown=o=>{if(o.button!==0||!this.isPanelOpen)return;o.preventDefault(),this.resizePointerId=o.pointerId,this.resizeStartPos=this.usesVerticalResize()?o.clientY:o.clientX,this.resizeStartSize=this.size;const i=o.currentTarget instanceof HTMLElement?o.currentTarget:this.resizeHandle;this.resizeCaptureTarget=i,i.setPointerCapture(o.pointerId),document.addEventListener("pointermove",this.handleResizePointerMove),document.addEventListener("pointerup",this.handleResizePointerUp),document.addEventListener("pointercancel",this.handleResizePointerUp)},this.handleResizePointerMove=o=>{if(this.resizePointerId!==o.pointerId)return;o.preventDefault();const i=this.usesPhoneSheet()?this.resizeStartPos-o.clientY:this.side==="bottom"?this.resizeStartPos-o.clientY:this.side==="top"?o.clientY-this.resizeStartPos:this.side==="right"?this.resizeStartPos-o.clientX:o.clientX-this.resizeStartPos;this.setSize(this.resizeStartSize+i)},this.handleResizePointerUp=o=>{if(this.resizePointerId!==o.pointerId)return;this.resizePointerId=void 0;const i=this.resizeCaptureTarget??this.resizeHandle;i.hasPointerCapture(o.pointerId)&&i.releasePointerCapture(o.pointerId),this.resizeCaptureTarget=void 0,document.removeEventListener("pointermove",this.handleResizePointerMove),document.removeEventListener("pointerup",this.handleResizePointerUp),document.removeEventListener("pointercancel",this.handleResizePointerUp)},this.handleDocumentPointerDown=o=>{o.target instanceof Node&&(this.sideMenuRoot&&!this.sideMenuRoot.contains(o.target)&&!this.sideMenuButton.contains(o.target)&&this.closeSideMenu(),this.overflowMenuRoot&&!this.overflowMenuRoot.contains(o.target)&&!this.overflowButton.contains(o.target)&&this.closeOverflowMenu())},this.handleMobileMediaChange=()=>{this.usesPhoneSheet()&&this.side!=="bottom"&&this.side!=="top"&&(this.size=this.defaultHeight),this.applyLayoutState()},this.host=e.host,this.i18n=e.i18n,this.side=e.defaultSide??"left",this.isPanelOpen=e.defaultOpen??!1,this.defaultHeight=e.defaultHeight??240,this.defaultWidth=e.defaultWidth??280,this.onOpen=e.onOpen,this.size=this.side==="bottom"||this.side==="top"?this.defaultHeight:this.defaultWidth,P(),this.ensureHostLayout(),this.root=document.createElement("div"),this.root.className="ml-ex-ui-dock-panel",this.root.dataset.side=this.side,this.root.dataset.open=String(this.isPanelOpen),this.resizeHandle=document.createElement("div"),this.resizeHandle.className="ml-ex-ui-dock-resize-handle",this.resizeHandle.addEventListener("pointerdown",this.handleResizePointerDown),this.contentEl=document.createElement("div"),this.contentEl.className="ml-ex-ui-dock-content";const t=document.createElement("div");t.className="ml-ex-ui-dock-header",this.tabsWrap=document.createElement("div"),this.tabsWrap.className="ml-ex-ui-dock-tabs-wrap",this.tabsEl=document.createElement("div"),this.tabsEl.className="ml-ex-ui-dock-tabs",this.tabsEl.setAttribute("role","tablist"),this.overflowButton=document.createElement("button"),this.overflowButton.type="button",this.overflowButton.className="ml-ex-ui-dock-tab-overflow-btn",this.overflowButton.hidden=!0,this.overflowButton.textContent="»",this.overflowButton.title=this.i18n.t("dockPanel.moreTabs"),this.overflowButton.setAttribute("aria-label",this.i18n.t("dockPanel.moreTabs")),this.overflowButton.addEventListener("click",o=>{o.stopPropagation(),this.toggleOverflowMenu()}),this.tabsWrap.appendChild(this.tabsEl),this.tabsWrap.appendChild(this.overflowButton),this.tabOverflowObserver=new ResizeObserver(()=>{this.scheduleUpdateTabOverflow()}),this.tabOverflowObserver.observe(this.tabsWrap);const a=document.createElement("div");a.className="ml-ex-ui-dock-actions",this.sideMenuButton=document.createElement("button"),this.sideMenuButton.type="button",this.sideMenuButton.className="ml-ex-ui-dock-action-btn",this.sideMenuButton.title=this.i18n.t("dockPanel.dockSide"),this.sideMenuButton.setAttribute("aria-label",this.i18n.t("dockPanel.dockSide")),this.sideMenuButton.appendChild(T(ea)),this.sideMenuButton.addEventListener("click",o=>{o.stopPropagation(),this.toggleSideMenu()}),this.closeButton=document.createElement("button"),this.closeButton.type="button",this.closeButton.className="ml-ex-ui-dock-action-btn",this.closeButton.title=this.i18n.t("dockPanel.close"),this.closeButton.setAttribute("aria-label",this.i18n.t("dockPanel.close")),this.closeButton.appendChild(T(Me)),this.closeButton.addEventListener("click",()=>this.close()),a.appendChild(this.sideMenuButton),a.appendChild(this.closeButton),t.appendChild(this.tabsWrap),t.appendChild(a),this.bodyEl=document.createElement("div"),this.bodyEl.className="ml-ex-ui-dock-body",this.contentEl.appendChild(t),this.contentEl.appendChild(this.bodyEl),this.sheetChrome=document.createElement("div"),this.sheetChrome.className="ml-ex-ui-dock-sheet-chrome",this.sheetGrabber=document.createElement("div"),this.sheetGrabber.className="ml-ex-ui-dock-sheet-grabber",this.sheetGrabber.setAttribute("role","separator"),this.sheetGrabber.setAttribute("aria-orientation","horizontal"),this.sheetGrabber.title=this.i18n.t("dockPanel.resize"),this.sheetGrabber.setAttribute("aria-label",this.i18n.t("dockPanel.resize")),this.sheetGrabber.addEventListener("pointerdown",this.handleResizePointerDown),this.sheetCloseButton=document.createElement("button"),this.sheetCloseButton.type="button",this.sheetCloseButton.className="ml-ex-ui-dock-sheet-close",this.sheetCloseButton.title=this.i18n.t("dockPanel.close"),this.sheetCloseButton.setAttribute("aria-label",this.i18n.t("dockPanel.close")),this.sheetCloseButton.appendChild(T(ta)),this.sheetCloseButton.addEventListener("click",()=>this.close()),this.sheetChrome.append(this.sheetGrabber,this.sheetCloseButton),this.root.appendChild(this.sheetChrome),this.root.appendChild(this.contentEl),this.root.appendChild(this.resizeHandle),this.ensureDockMainWrapper(),this.mountToHost(),this.bindMobileMediaQuery(),this.applyLayoutState()}hasTab(e){return this.tabs.has(e)}addTab(e){if(this.tabs.has(e.id)||!e.labelKey&&!e.label)return!1;const t=`ml-ex-ui-dock-tab-${e.id}`,a=`ml-ex-ui-dock-tabpanel-${e.id}`,o=document.createElement("button");o.type="button",o.className="ml-ex-ui-dock-tab",o.id=t,o.setAttribute("role","tab"),o.setAttribute("aria-controls",a),o.dataset.tabId=e.id,o.textContent=this.getTabLabel(e),o.addEventListener("click",()=>{this.openPanel(e.id)});const i=document.createElement("div");return i.className="ml-ex-ui-dock-tab-panel",i.id=a,i.setAttribute("role","tabpanel"),i.setAttribute("aria-labelledby",t),i.dataset.tabId=e.id,i.hidden=!0,i.tabIndex=-1,i.appendChild(e.content),this.tabs.set(e.id,{id:e.id,labelKey:e.labelKey,label:e.label,tabButton:o,panel:i}),this.tabsEl.appendChild(o),this.bodyEl.appendChild(i),this.activeTabId||this.setActiveTab(e.id),this.scheduleUpdateTabOverflow(),!0}reparentTo(e){if(this.host===e){this.ensureMounted(),this.applyLayoutState();return}const t=this.isPanelOpen,a=this.activeTabId;this.closeSideMenu(),this.closeOverflowMenu(),this.releaseDockMainWrapper(),this.root.remove(),this.clearHostLayoutClasses(),this.host=e,this.ensureHostLayout(),this.ensureDockMainWrapper(),this.mountToHost(),this.isPanelOpen=t,a&&this.tabs.has(a)&&this.setActiveTab(a),this.ensureMounted(),this.applyLayoutState()}ensureMounted(){this.root.isConnected||this.mountToHost()}removeTab(e){const t=this.tabs.get(e);if(t){if(t.tabButton.remove(),t.panel.remove(),this.tabs.delete(e),this.activeTabId===e){const a=this.tabs.keys().next().value;this.activeTabId=void 0,a&&this.setActiveTab(a)}this.scheduleUpdateTabOverflow()}}get hasTabs(){return this.tabs.size>0}open(e){var t;(t=this.onOpen)==null||t.call(this),e?this.setActiveTab(e):this.activeTabId?this.setActiveTab(this.activeTabId):this.tabs.size>0&&this.setActiveTab(this.tabs.keys().next().value),this.isPanelOpen=!0,this.ensureMounted(),this.applyLayoutState()}close(){this.isPanelOpen=!1,this.closeSideMenu(),this.closeOverflowMenu(),this.applyLayoutState()}toggle(e){if(this.isPanelOpen&&(!e||this.activeTabId===e)){this.close();return}this.open(e)}setSide(e){if(this.side===e)return;const t=this.side;this.side=e,(t==="left"||t==="right")&&(e==="left"||e==="right")||(t==="top"||t==="bottom")&&(e==="top"||e==="bottom")||(this.size=e==="bottom"||e==="top"?this.defaultHeight:this.defaultWidth),this.closeSideMenu(),this.closeOverflowMenu(),this.mountToHost(),this.applyLayoutState(),this.scheduleUpdateTabOverflow()}getMountHost(){return this.host}get isOpen(){return this.isPanelOpen}getSide(){return this.side}getSize(){return this.size}setPanelSize(e){this.setSize(e)}get activeTab(){return this.activeTabId}refreshLocale(){for(const e of this.tabs.values())e.tabButton.textContent=this.getTabLabel(e);this.sideMenuButton.title=this.i18n.t("dockPanel.dockSide"),this.sideMenuButton.setAttribute("aria-label",this.i18n.t("dockPanel.dockSide")),this.closeButton.title=this.i18n.t("dockPanel.close"),this.closeButton.setAttribute("aria-label",this.i18n.t("dockPanel.close")),this.overflowButton.title=this.i18n.t("dockPanel.moreTabs"),this.overflowButton.setAttribute("aria-label",this.i18n.t("dockPanel.moreTabs")),this.sheetGrabber.title=this.i18n.t("dockPanel.resize"),this.sheetGrabber.setAttribute("aria-label",this.i18n.t("dockPanel.resize")),this.sheetCloseButton.title=this.i18n.t("dockPanel.close"),this.sheetCloseButton.setAttribute("aria-label",this.i18n.t("dockPanel.close")),this.sideMenuRoot&&this.renderSideMenuItems(),this.overflowMenuRoot&&this.renderOverflowMenuItems(),this.scheduleUpdateTabOverflow()}destroy(){var e;document.removeEventListener("pointerdown",this.handleDocumentPointerDown,!0),document.removeEventListener("pointermove",this.handleResizePointerMove),document.removeEventListener("pointerup",this.handleResizePointerUp),document.removeEventListener("pointercancel",this.handleResizePointerUp),this.tabOverflowFrame!==void 0&&(cancelAnimationFrame(this.tabOverflowFrame),this.tabOverflowFrame=void 0),(e=this.tabOverflowObserver)==null||e.disconnect(),this.tabOverflowObserver=void 0,this.unbindMobileMediaQuery(),this.closeSideMenu(),this.closeOverflowMenu(),this.releaseDockMainWrapper(),this.clearHostLayoutClasses(),this.root.remove()}openPanel(e){this.setActiveTab(e),this.isPanelOpen=!0,this.applyLayoutState()}setActiveTab(e){if(this.tabs.has(e)){this.activeTabId=e;for(const t of this.tabs.values()){const a=t.id===e;t.tabButton.classList.toggle("is-active",a),t.tabButton.setAttribute("aria-selected",String(a)),t.tabButton.tabIndex=a?0:-1,t.panel.hidden=!a,a?t.panel.removeAttribute("aria-hidden"):t.panel.setAttribute("aria-hidden","true")}this.scheduleUpdateTabOverflow()}}ensureHostLayout(){getComputedStyle(this.host).position==="static"&&(this.host.style.position="relative"),this.host.classList.contains("ml-ex-ui-host-dock")||this.host.classList.add("ml-ex-ui-host-dock")}ensureDockMainWrapper(){var e;if((e=this.dockMainWrapper)!=null&&e.isConnected)return;const t=[];if(Array.from(this.host.childNodes).forEach(o=>{o instanceof HTMLElement&&o.classList.contains("ml-ex-ui-dock-panel")||t.push(o)}),t.length===0)return;const a=document.createElement("div");a.className="ml-ex-ui-dock-main",t.forEach(o=>a.appendChild(o)),this.host.appendChild(a),this.dockMainWrapper=a}releaseDockMainWrapper(){var e;if(!((e=this.dockMainWrapper)!=null&&e.isConnected)){this.dockMainWrapper=void 0;return}for(;this.dockMainWrapper.firstChild;)this.host.insertBefore(this.dockMainWrapper.firstChild,this.dockMainWrapper);this.dockMainWrapper.remove(),this.dockMainWrapper=void 0}clearHostLayoutClasses(){this.host.classList.remove("ml-ex-ui-host-dock","ml-ex-ui-host-dock-top","ml-ex-ui-host-dock-bottom","ml-ex-ui-host-dock-left","ml-ex-ui-host-dock-right","ml-ex-ui-host-dock-sheet")}mountToHost(){if(this.ensureDockMainWrapper(),this.root.isConnected&&this.root.remove(),this.side==="left"||this.side==="top"){this.host.insertBefore(this.root,this.host.firstChild);return}this.host.appendChild(this.root)}applyLayoutState(){const e=this.usesPhoneSheet();this.root.dataset.side=this.side,this.root.dataset.open=String(this.isPanelOpen),this.root.dataset.phoneSheet=String(e),this.host.classList.remove("ml-ex-ui-host-dock-top","ml-ex-ui-host-dock-bottom","ml-ex-ui-host-dock-left","ml-ex-ui-host-dock-right","ml-ex-ui-host-dock-sheet"),this.isPanelOpen&&this.host.classList.add(e?"ml-ex-ui-host-dock-sheet":`ml-ex-ui-host-dock-${this.side}`),e?this.syncPhoneSheetInset():this.root.style.removeProperty("--ml-ex-ui-phone-sheet-inset"),this.root.style.setProperty("--ml-ex-ui-dock-size",`${this.size}px`),this.scheduleUpdateTabOverflow()}setSize(e){const t=this.getMaxSize();this.size=Math.max(R,Math.min(t,e)),this.root.style.setProperty("--ml-ex-ui-dock-size",`${this.size}px`),this.scheduleUpdateTabOverflow()}getMaxSize(){if(this.usesPhoneSheet()||this.side==="bottom"||this.side==="top"){const e=this.usesPhoneSheet()?this.host.clientHeight-this.getPhoneChromeInset():this.host.clientHeight;return Math.max(R,e*fe)}return Math.max(R,this.host.clientWidth*fe)}usesPhoneSheet(){return Ze()}usesVerticalResize(){return this.usesPhoneSheet()||this.side==="bottom"||this.side==="top"}bindMobileMediaQuery(){typeof window.matchMedia=="function"&&(this.mobileMediaQuery=window.matchMedia(Xe),this.mobileMediaQuery.addEventListener("change",this.handleMobileMediaChange))}unbindMobileMediaQuery(){var e;(e=this.mobileMediaQuery)==null||e.removeEventListener("change",this.handleMobileMediaChange),this.mobileMediaQuery=void 0}syncPhoneSheetInset(){this.root.style.setProperty("--ml-ex-ui-phone-sheet-inset",`${this.getPhoneChromeInset()}px`)}getPhoneChromeInset(){let e=0;const t=this.host.querySelector(".ml-ex-ui-toolbar");return t instanceof HTMLElement&&this.isElementVisible(t)&&(e+=t.offsetHeight),this.host.querySelectorAll(".ml-ex-ui-subtoolbar").forEach(a=>{a instanceof HTMLElement&&this.isElementVisible(a)&&(e+=a.offsetHeight)}),e}isElementVisible(e){return e.hidden?!1:e.offsetParent!==null||e.getClientRects().length>0}toggleSideMenu(){if(this.sideMenuRoot){this.closeSideMenu();return}this.closeOverflowMenu(),this.openSideMenu()}openSideMenu(){this.sideMenuRoot=document.createElement("div"),this.sideMenuRoot.className="ml-ex-ui-dock-side-menu",this.sideMenuRoot.setAttribute("role","menu"),this.renderSideMenuItems();const e=this.sideMenuButton.getBoundingClientRect();this.host.appendChild(this.sideMenuRoot),this.sideMenuRoot.style.top=`${e.bottom+4}px`,this.sideMenuRoot.style.left=`${Math.max(8,e.right-160)}px`,this.syncOutsidePointerListener()}renderSideMenuItems(){this.sideMenuRoot&&(this.sideMenuRoot.replaceChildren(),[{side:"top",labelKey:"dockPanel.dockTop",icon:ge},{side:"bottom",labelKey:"dockPanel.dockBottom",icon:Pe},{side:"left",labelKey:"dockPanel.dockLeft",icon:we},{side:"right",labelKey:"dockPanel.dockRight",icon:Ce}].forEach(e=>{const t=document.createElement("button");t.type="button",t.className="ml-ex-ui-dock-side-menu-item",t.setAttribute("role","menuitem"),e.side===this.side&&t.classList.add("is-selected"),t.appendChild(T(e.icon));const a=document.createElement("span");a.textContent=this.i18n.t(e.labelKey),t.appendChild(a),t.addEventListener("click",o=>{o.stopPropagation(),this.setSide(e.side),this.closeSideMenu()}),this.sideMenuRoot.appendChild(t)}))}closeSideMenu(){var e;(e=this.sideMenuRoot)==null||e.remove(),this.sideMenuRoot=void 0,this.syncOutsidePointerListener()}syncOutsidePointerListener(){document.removeEventListener("pointerdown",this.handleDocumentPointerDown,!0),(this.sideMenuRoot||this.overflowMenuRoot)&&document.addEventListener("pointerdown",this.handleDocumentPointerDown,!0)}scheduleUpdateTabOverflow(){this.tabOverflowFrame===void 0&&(this.tabOverflowFrame=requestAnimationFrame(()=>{this.tabOverflowFrame=void 0,this.updateTabOverflow()}))}updateTabOverflow(){const e=Array.from(this.tabs.values());if(e.length===0){this.overflowButton.hidden=!0,this.overflowTabIds=[];return}this.overflowButton.hidden=!0,e.forEach(n=>{n.tabButton.hidden=!1});const t=this.tabsWrap.clientWidth;if(t<=0)return;if(e.reduce((n,u)=>n+u.tabButton.offsetWidth,0)<=t){this.overflowTabIds=[],this.overflowButton.hidden=!0,this.overflowButton.classList.remove("is-active"),this.overflowMenuRoot&&this.closeOverflowMenu();return}const a=this.activeTabId??e[0].id,o=t-Qa,i=new Set(e.map(n=>n.id)),r=new Set,s=()=>e.filter(n=>i.has(n.id)).reduce((n,u)=>n+u.tabButton.offsetWidth,0);for(;i.size>1&&s()>o;){let n;for(let u=e.length-1;u>=0;u-=1){const d=e[u].id;if(!(d===a||!i.has(d))){n=d;break}}if(!n)break;i.delete(n),r.add(n)}if(!i.has(a))for(r.delete(a),i.add(a);i.size>1&&s()>o;){let n;for(let u=e.length-1;u>=0;u-=1){const d=e[u].id;if(!(d===a||!i.has(d))){n=d;break}}if(!n)break;i.delete(n),r.add(n)}e.forEach(n=>{n.tabButton.hidden=r.has(n.id)}),this.overflowTabIds=e.filter(n=>r.has(n.id)).map(n=>n.id),this.overflowButton.hidden=this.overflowTabIds.length===0,this.overflowButton.classList.toggle("is-active",this.overflowTabIds.includes(a)),this.overflowMenuRoot&&this.overflowTabIds.length===0?this.closeOverflowMenu():this.overflowMenuRoot&&this.renderOverflowMenuItems()}getTabLabel(e){return e.label?e.label:e.labelKey?this.i18n.t(e.labelKey):""}toggleOverflowMenu(){if(this.overflowMenuRoot){this.closeOverflowMenu();return}this.closeSideMenu(),this.openOverflowMenu()}openOverflowMenu(){if(this.overflowTabIds.length===0)return;this.overflowMenuRoot=document.createElement("div"),this.overflowMenuRoot.className="ml-ex-ui-dock-tab-overflow-menu",this.overflowMenuRoot.setAttribute("role","menu"),this.renderOverflowMenuItems();const e=this.overflowButton.getBoundingClientRect();this.host.appendChild(this.overflowMenuRoot),this.overflowMenuRoot.style.top=`${e.bottom+4}px`,this.overflowMenuRoot.style.left=`${Math.max(8,e.right-180)}px`,this.syncOutsidePointerListener()}renderOverflowMenuItems(){this.overflowMenuRoot&&(this.overflowMenuRoot.replaceChildren(),this.overflowTabIds.forEach(e=>{const t=this.tabs.get(e);if(!t)return;const a=document.createElement("button");a.type="button",a.className="ml-ex-ui-dock-tab-overflow-menu-item",a.setAttribute("role","menuitem"),e===this.activeTabId&&a.classList.add("is-selected"),a.textContent=this.getTabLabel(t),a.addEventListener("click",o=>{o.stopPropagation(),this.openPanel(e),this.closeOverflowMenu()}),this.overflowMenuRoot.appendChild(a)}))}closeOverflowMenu(){var e;(e=this.overflowMenuRoot)==null||e.remove(),this.overflowMenuRoot=void 0,this.syncOutsidePointerListener()}}class to{constructor(e){this.result={hits:[],truncated:!1},this.activeIndex=-1,this.searchState="idle",this.navigationNote="",this.editor=e.editor,this.i18n=e.i18n,P(),this.element=document.createElement("div"),this.element.className="ml-ex-ui-find-palette",this.buildDom(),this.refreshLocale()}refreshLocale(){this.inputEl.placeholder=this.i18n.t("findPalette.placeholder"),this.inputEl.setAttribute("aria-label",this.i18n.t("findPalette.input")),this.findButton.textContent=this.i18n.t("findPalette.find"),this.matchCaseLabelEl.lastChild.textContent=this.i18n.t("findPalette.matchCase"),this.layoutOnlyLabelEl.lastChild.textContent=this.i18n.t("findPalette.currentLayoutOnly"),this.renderResults()}focus(){this.inputEl.focus(),this.inputEl.select()}search(e,t=this.matchCaseEl.checked,a=this.scope){this.inputEl.value=e,this.matchCaseEl.checked=t,this.layoutOnlyEl.checked=a==="layout",this.runSearch()}get hits(){return this.result.hits}get scope(){return this.layoutOnlyEl.checked?"layout":"drawing"}destroy(){this.result={hits:[],truncated:!1}}buildDom(){const e=document.createElement("div");e.className="ml-ex-ui-find-form",this.inputEl=document.createElement("input"),this.inputEl.type="search",this.inputEl.className="ml-ex-ui-find-input",this.inputEl.autocomplete="off",this.inputEl.spellcheck=!1,this.inputEl.addEventListener("keydown",t=>{t.key==="Enter"&&(t.preventDefault(),this.handleEnter(t.shiftKey))}),this.inputEl.addEventListener("keyup",t=>t.stopPropagation()),this.findButton=document.createElement("button"),this.findButton.type="button",this.findButton.className="ml-ex-ui-measure-btn ml-ex-ui-find-btn",this.findButton.addEventListener("click",()=>{this.runSearch(),this.result.hits.length>0&&this.navigateTo(0)}),e.append(this.inputEl,this.findButton),this.matchCaseLabelEl=document.createElement("label"),this.matchCaseLabelEl.className="ml-ex-ui-find-option",this.matchCaseEl=document.createElement("input"),this.matchCaseEl.type="checkbox",this.matchCaseEl.addEventListener("change",()=>{this.searched&&this.runSearch()}),this.matchCaseLabelEl.append(this.matchCaseEl,document.createTextNode("")),this.layoutOnlyLabelEl=document.createElement("label"),this.layoutOnlyLabelEl.className="ml-ex-ui-find-option",this.layoutOnlyEl=document.createElement("input"),this.layoutOnlyEl.type="checkbox",this.layoutOnlyEl.dataset.findScope="layout",this.layoutOnlyEl.addEventListener("change",()=>{this.searched?this.runSearch():this.renderResults()}),this.layoutOnlyLabelEl.append(this.layoutOnlyEl,document.createTextNode("")),this.statusEl=document.createElement("div"),this.statusEl.className="ml-ex-ui-find-status",this.statusEl.setAttribute("role","status"),this.statusEl.setAttribute("aria-live","polite"),this.listEl=document.createElement("ul"),this.listEl.className="ml-ex-ui-find-list",this.listEl.addEventListener("click",t=>{const a=t.target;if(!(a instanceof Element))return;const o=a.closest("li[data-find-index]");!(o instanceof HTMLElement)||!this.listEl.contains(o)||this.navigateTo(Number(o.dataset.findIndex))}),this.element.append(e,this.matchCaseLabelEl,this.layoutOnlyLabelEl,this.statusEl,this.listEl)}handleEnter(e){const t=this.inputEl.value;if(!(this.searched&&this.searched.query===t&&this.searched.matchCase===this.matchCaseEl.checked&&this.searched.scope===this.scope)||this.result.hits.length===0){this.runSearch(),this.result.hits.length>0&&this.navigateTo(0);return}const a=this.result.hits.length,o=this.activeIndex<0?0:(this.activeIndex+(e?a-1:1))%a;this.navigateTo(o)}runSearch(){var e;const t=this.editor.curView,a=(e=this.editor.curDocument)==null?void 0:e.database,o=this.inputEl.value;if(this.activeIndex=-1,this.navigationNote="",!t||!a||!o.trim()){this.result={hits:[],truncated:!1},this.searched=void 0,this.searchState=t&&a?"idle":"no-document",this.renderResults();return}const i=t.activeLayoutBtrId,r=this.matchCaseEl.checked,s=this.scope;this.result=st(a,o,{matchCase:r,scope:s,currentLayoutId:i}),this.searched={query:o,matchCase:r,scope:s,layoutId:i},this.searchState="done",this.renderResults()}renderResults(){var e,t;this.listEl.replaceChildren();const a=this.result.hits;if(this.searchState==="no-document"){this.statusEl.textContent=this.i18n.t("findPalette.noDocument");return}if(this.searchState==="idle"){this.statusEl.textContent=this.i18n.t(this.scope==="layout"?"findPalette.hintLayout":"findPalette.hint");return}if(a.length===0){this.statusEl.textContent=this.i18n.t("findPalette.noResults");return}const o=new Set(a.map(n=>n.layoutId)).size,i=this.result.truncated?"findPalette.countTruncated":o>1?"findPalette.countLayouts":"findPalette.count";this.statusEl.textContent=this.i18n.t(i,{count:String(a.length),layouts:String(o)})+(this.navigationNote?` — ${this.navigationNote}`:"");const r=((e=this.searched)==null?void 0:e.query)??"",s=((t=this.searched)==null?void 0:t.matchCase)??!1;a.forEach((n,u)=>{const d=document.createElement("li");d.className="ml-ex-ui-find-row",d.dataset.findIndex=String(u),d.tabIndex=0,d.addEventListener("keydown",f=>{(f.key==="Enter"||f.key===" ")&&(f.preventDefault(),this.navigateTo(u))}),u===this.activeIndex&&d.classList.add("is-selected");const c=document.createElement("div");c.className="ml-ex-ui-find-layout",c.dataset.layoutId=n.layoutId;const p=this.layoutLabel(n.layoutName);c.textContent=p,c.title=p;const h=document.createElement("div");h.className="ml-ex-ui-find-text",h.textContent=nt(n.text,r,s),h.title=n.text;const b=document.createElement("div");b.className="ml-ex-ui-find-meta",b.textContent=this.describeHit(n),d.append(c,h,b),this.listEl.appendChild(d)})}layoutLabel(e){return e.trim()?e:this.i18n.t("findPalette.unnamedLayout")}describeHit(e){let t=this.i18n.t(`findPalette.kind.${e.kind}`);if(e.kind==="attribute"||e.kind==="block"&&e.tag){const o=[e.blockName,e.tag].filter(Boolean).join(" / ");o&&(t=`${t} ${o}`)}const a=`(${ve(e.position.x)}, ${ve(e.position.y)})`;return`${t} · ${e.layer} · ${a}`}dockInsets(){var e;const t=(e=this.editor.curView)==null?void 0:e.canvas,a=this.element.closest(".ml-ex-ui-dock-panel");if(!t||!a||a.dataset.open==="false")return;const o=t.getBoundingClientRect(),i=a.getBoundingClientRect(),r=i.right>o.left&&i.left<o.right,s=i.bottom>o.top&&i.top<o.bottom;if(!r||!s||i.width===0||i.height===0)return;switch(a.dataset.side){case"left":return{left:Math.min(o.width,Math.max(0,i.right-o.left))};case"right":return{right:Math.min(o.width,Math.max(0,o.right-i.left))};case"top":return{top:Math.min(o.height,Math.max(0,i.bottom-o.top))};case"bottom":return{bottom:Math.min(o.height,Math.max(0,o.bottom-i.top))}}const n=Math.max(0,Math.min(o.width,i.right-o.left)),u=Math.max(0,Math.min(o.width,o.right-i.left)),d=Math.max(0,Math.min(o.height,i.bottom-o.top)),c=Math.max(0,Math.min(o.height,o.bottom-i.top)),p=Math.max(n,u,d,c);if(!(p<=0))return p===n?{left:n}:p===u?{right:u}:p===d?{top:d}:{bottom:c}}navigateTo(e){var t;const a=this.editor.curView,o=(t=this.editor.curDocument)==null?void 0:t.database,i=this.result.hits[e];if(!(!a||!o||!i||!this.searched)){if(this.searched.scope==="layout"&&a.activeLayoutBtrId!==this.searched.layoutId){this.runSearch();return}this.activeIndex=e,this.navigationNote="",this.listEl.querySelectorAll("li[data-find-index]").forEach(r=>{var s;const n=Number(r.dataset.findIndex)===e;r.classList.toggle("is-selected",n),n&&((s=r.scrollIntoView)==null||s.call(r,{block:"nearest"}))}),dt(this.editor,i,{insets:this.dockInsets()}).then(r=>{r!=="layout-missing"&&r!=="layout-switch-failed"&&r!=="layout-mismatch"||(this.navigationNote=this.i18n.t("findPalette.layoutUnavailable",{layout:this.layoutLabel(i.layoutName)}),this.renderResults())})}}}function ve(l){return String(Math.round(l*100)/100)}class ao{constructor(e,t,a){this.i18n=e,P(),this.backdrop=document.createElement("div"),this.backdrop.className="ml-ex-ui-color-dialog-backdrop",this.backdrop.addEventListener("mousedown",c=>{c.target===this.backdrop&&this.finish(null)});const o=document.createElement("div");o.className="ml-ex-ui-color-dialog",o.addEventListener("mousedown",c=>c.stopPropagation());const i=document.createElement("div");i.className="ml-ex-ui-color-dialog-header";const r=document.createElement("div");r.className="ml-ex-ui-color-dialog-title",r.textContent=this.i18n.t("colorPicker.title");const s=document.createElement("button");s.type="button",s.className="ml-ex-ui-color-dialog-close",s.setAttribute("aria-label","Close"),s.textContent="×",s.addEventListener("click",()=>this.finish(null)),i.appendChild(r),i.appendChild(s),o.appendChild(i),this.picker=kt({labels:{index:this.i18n.t("colorPicker.index"),rgb:this.i18n.t("colorPicker.rgb"),input:this.i18n.t("colorPicker.input"),inputPlaceholder:this.i18n.t("colorPicker.inputPlaceholder")},initialIndex:this.toColorIndex(a)}),o.appendChild(this.picker.root);const n=document.createElement("div");n.className="ml-ex-ui-dialog-actions";const u=document.createElement("button");u.type="button",u.className="ml-ex-ui-btn",u.textContent=this.i18n.t("colorPicker.cancel"),u.addEventListener("click",()=>this.finish(null));const d=document.createElement("button");d.type="button",d.className="ml-ex-ui-btn ml-ex-ui-btn-primary",d.textContent=this.i18n.t("colorPicker.ok"),d.addEventListener("click",()=>this.finish(this.toSelectedColor())),n.appendChild(u),n.appendChild(d),o.appendChild(n),this.backdrop.appendChild(o),t.appendChild(this.backdrop)}open(){return new Promise(e=>{this.resolve=e})}finish(e){var t;this.picker.dispose(),this.backdrop.remove(),(t=this.resolve)==null||t.call(this,e),this.resolve=void 0}toColorIndex(e){return e?e.isByLayer?256:e.isByBlock?0:e.isByACI&&e.colorIndex!=null?e.colorIndex:null:null}toSelectedColor(){const e=this.picker.getIndex();if(e==null)return null;if(e===256){const t=new O;return t.setByLayer(),t}if(e===0){const t=new O;return t.setByBlock(),t}return new O(ra.ByACI,e)}}class oo{constructor(e){if(this.nameSortOrder="none",this.handleDocumentActivated=()=>{this.bindToActiveDocument(),this.renderRows()},this.handleLayersChanged=()=>{this.renderRows()},this.editor=e.editor,this.i18n=e.i18n,this.host=e.host,this.showHeader=e.showHeader??!1,P(),this.element=document.createElement("div"),this.element.className="ml-ex-ui-layer-list",this.showHeader){const b=document.createElement("div");b.className="ml-ex-ui-layer-manager-header";const f=document.createElement("span");this.titleEl=f,f.textContent=e.i18n.t("layerManager.title"),b.appendChild(f),this.element.appendChild(b)}const t=document.createElement("div");t.className="ml-ex-ui-layer-table-wrap";const a=document.createElement("table");a.className="ml-ex-ui-layer-table";const o=document.createElement("thead"),i=document.createElement("tr"),r=document.createElement("th");this.nameHeaderEl=r,r.className="ml-ex-ui-layer-name-header is-sortable",r.setAttribute("role","columnheader"),r.setAttribute("aria-sort","none");const s=document.createElement("button");s.type="button",s.className="ml-ex-ui-layer-name-sort";const n=document.createElement("span");this.nameHeaderLabelEl=n,n.textContent=e.i18n.t("layerManager.name");const u=document.createElement("span");this.nameSortIndicatorEl=u,u.className="ml-ex-ui-layer-sort-indicator",u.setAttribute("aria-hidden","true"),s.appendChild(n),s.appendChild(u),s.addEventListener("click",()=>{this.cycleNameSortOrder()}),r.appendChild(s),this.updateNameSortHeader();const d=document.createElement("th");d.className="center";const c=document.createElement("div");c.className="ml-ex-ui-layer-header-on";const p=document.createElement("span");this.onLabelEl=p,p.textContent=e.i18n.t("layerManager.on"),this.masterCheckbox=document.createElement("input"),this.masterCheckbox.type="checkbox",this.masterCheckbox.addEventListener("change",()=>{const b=this.activeLayerStore;b&&(this.masterCheckbox.checked?b.setAllLayersOn():b.setAllLayersOffExceptCurrent())}),c.appendChild(p),c.appendChild(this.masterCheckbox),d.appendChild(c);const h=document.createElement("th");h.className="center",this.colorHeaderEl=h,h.textContent=e.i18n.t("layerManager.color"),i.appendChild(r),i.appendChild(d),i.appendChild(h),o.appendChild(i),this.tbody=document.createElement("tbody"),a.appendChild(o),a.appendChild(this.tbody),t.appendChild(a),this.element.appendChild(t),this.editor.events.documentActivated.addEventListener(this.handleDocumentActivated),this.bindToActiveDocument(),this.renderRows()}get activeLayerStore(){var e;return(e=this.editor.curDocument)==null?void 0:e.layerStore}bindToActiveDocument(){this.subscribedLayerStore&&this.subscribedLayerStore.events.changed.removeEventListener(this.handleLayersChanged),this.subscribedLayerStore=this.activeLayerStore,this.subscribedLayerStore&&this.subscribedLayerStore.events.changed.addEventListener(this.handleLayersChanged)}refreshLocale(){this.titleEl&&(this.titleEl.textContent=this.i18n.t("layerManager.title")),this.nameHeaderLabelEl.textContent=this.i18n.t("layerManager.name"),this.onLabelEl.textContent=this.i18n.t("layerManager.on"),this.colorHeaderEl.textContent=this.i18n.t("layerManager.color"),this.updateNameSortHeader()}cycleNameSortOrder(){this.nameSortOrder==="none"?this.nameSortOrder="asc":this.nameSortOrder==="asc"?this.nameSortOrder="desc":this.nameSortOrder="none",this.updateNameSortHeader(),this.renderRows()}updateNameSortHeader(){var e;const t=this.nameSortOrder==="asc"?"layerManager.sortByNameDesc":this.nameSortOrder==="desc"?"layerManager.sortByNameNone":"layerManager.sortByNameAsc",a=this.i18n.t(t);this.nameHeaderEl.title=a,(e=this.nameHeaderEl.querySelector("button"))==null||e.setAttribute("aria-label",a),this.nameHeaderEl.setAttribute("aria-sort",this.nameSortOrder==="asc"?"ascending":this.nameSortOrder==="desc"?"descending":"none"),this.nameHeaderEl.classList.toggle("is-sorted-asc",this.nameSortOrder==="asc"),this.nameHeaderEl.classList.toggle("is-sorted-desc",this.nameSortOrder==="desc"),this.nameSortIndicatorEl.textContent=this.nameSortOrder==="asc"?"▲":this.nameSortOrder==="desc"?"▼":""}getSortedLayers(e){if(this.nameSortOrder==="none")return e;const t=this.nameSortOrder==="asc"?1:-1;return[...e].sort((a,o)=>t*a.name.localeCompare(o.name,void 0,{numeric:!0,sensitivity:"base"}))}destroy(){this.editor.events.documentActivated.removeEventListener(this.handleDocumentActivated),this.subscribedLayerStore&&this.subscribedLayerStore.events.changed.removeEventListener(this.handleLayersChanged)}renderRows(){const e=this.activeLayerStore;if(this.tbody.replaceChildren(),!e){this.masterCheckbox.checked=!1,this.masterCheckbox.indeterminate=!1;return}const t=this.getSortedLayers(e.getLayers()),a=e.getCurrentLayerName();t.forEach(r=>{this.tbody.appendChild(this.createRow(r,a))});const o=t.length>0&&t.every(r=>r.isOn),i=t.some(r=>r.isOn);this.masterCheckbox.checked=o,this.masterCheckbox.indeterminate=i&&!o}createRow(e,t){const a=document.createElement("tr");a.addEventListener("dblclick",()=>{var d;(d=m.instance.curView)!=null&&d.zoomToFitLayer(e.name)&&this.showToast(this.i18n.t("layerManager.zoomToLayer",{layer:e.name}))});const o=document.createElement("td"),i=document.createElement("span");if(i.className="ml-ex-ui-layer-name",i.textContent=e.name,e.name===t){const d=document.createElement("span");d.className="ml-ex-ui-layer-current-marker",d.textContent="*",d.title=this.i18n.t("layerManager.currentLayer"),d.setAttribute("aria-hidden","true"),i.appendChild(d)}o.appendChild(i);const r=document.createElement("td");r.className="center";const s=document.createElement("input");s.type="checkbox",s.checked=e.isOn,s.addEventListener("change",()=>{var d;(d=this.activeLayerStore)==null||d.setLayerOn(e.name,s.checked)}),r.appendChild(s);const n=document.createElement("td");n.className="center";const u=document.createElement("span");return u.className="ml-ex-ui-layer-color",u.style.background=e.cssColor,u.addEventListener("click",async()=>{var d;const c=O.fromString(e.color),p=await new ao(this.i18n,this.host,c??void 0).open();p&&((d=this.activeLayerStore)==null||d.setLayerColor(e.name,p))}),n.appendChild(u),a.appendChild(o),a.appendChild(r),a.appendChild(n),a}showToast(e){const t=document.createElement("div");t.className="ml-ex-ui-toast",t.textContent=e,document.body.appendChild(t),window.setTimeout(()=>t.remove(),1500)}}const lo=["distance","arc","angle","area"];class io{constructor(e){this.filterButtons=new Map,this.measurements=[],this.tableContentKey="",this.editor=e.editor,this.i18n=e.i18n,P(),this.element=document.createElement("div"),this.element.className="ml-ex-ui-measure-palette",this.buildDom(),this.refreshLocale(),this.unsubscribeList=et(()=>this.syncFromStore()),this.unsubscribeSelection=tt(()=>this.syncFromStore()),this.syncFromStore()}refreshLocale(){this.filterGroup.setAttribute("aria-label",this.i18n.t("measurePalette.filterGroup"));for(const[e,t]of this.filterButtons){const a=this.i18n.t(`measurePalette.typeValues.${e}`);t.textContent=a,t.title=a,t.setAttribute("aria-label",a)}this.clearButton.textContent=this.i18n.t("measurePalette.clear"),this.typeHeaderEl.textContent=this.i18n.t("measurePalette.type"),this.valueHeaderEl.textContent=this.i18n.t("measurePalette.value"),this.renderTable()}destroy(){var e,t;(e=this.unsubscribeList)==null||e.call(this),this.unsubscribeList=void 0,(t=this.unsubscribeSelection)==null||t.call(this),this.unsubscribeSelection=void 0}buildDom(){const e=document.createElement("div");e.className="ml-ex-ui-measure-toolbar",this.filterGroup=document.createElement("div"),this.filterGroup.className="ml-ex-ui-measure-filter",this.filterGroup.setAttribute("role","group");for(const r of lo){const s=document.createElement("button");s.type="button",s.className="ml-ex-ui-measure-filter-btn",s.dataset.measureFilter=r,s.setAttribute("aria-pressed","false"),s.addEventListener("click",()=>this.toggleFilter(r)),this.filterButtons.set(r,s),this.filterGroup.appendChild(s)}e.appendChild(this.filterGroup),this.clearButton=document.createElement("button"),this.clearButton.type="button",this.clearButton.className="ml-ex-ui-measure-btn",this.clearButton.addEventListener("click",()=>this.clearAll()),e.appendChild(this.clearButton),this.element.appendChild(e);const t=document.createElement("div");t.className="ml-ex-ui-measure-table-wrap";const a=document.createElement("table");a.className="ml-ex-ui-measure-table";const o=document.createElement("thead"),i=document.createElement("tr");this.typeHeaderEl=document.createElement("th"),this.valueHeaderEl=document.createElement("th"),this.actionsHeaderEl=document.createElement("th"),this.actionsHeaderEl.className="ml-ex-ui-measure-actions-col",i.append(this.typeHeaderEl,this.valueHeaderEl,this.actionsHeaderEl),o.appendChild(i),a.appendChild(o),this.tbody=document.createElement("tbody"),this.tbody.addEventListener("click",r=>{const s=r.target;if(!(s instanceof Element))return;const n=s.closest("button[data-measure-delete]");if(n instanceof HTMLElement&&this.tbody.contains(n)){r.stopPropagation();const d=n.dataset.measureDelete;d&&this.removeOne(d);return}const u=this.rowMeasurementId(r);u&&this.handleRowClick(u)}),a.appendChild(this.tbody),t.appendChild(a),this.element.appendChild(t)}syncFromStore(){const e=this.editor.curView;this.measurements=e?at(e):[],this.selectedId=ot(),this.clearButton.disabled=this.measurements.length===0,this.refreshTable()}rowMeasurementId(e){const t=e.target;if(!(t instanceof Element))return;const a=t.closest("tr[data-measure-id]");if(!(!a||!this.tbody.contains(a)))return a instanceof HTMLElement?a.dataset.measureId:void 0}refreshTable(){var e;const t=(e=this.editor.curDocument)==null?void 0:e.database,a=this.measurements.map(o=>`${o.id}	${o.type}	${le(o.id,t)}`).join(`
`);if(a===this.tableContentKey&&this.tbody.querySelector("tr[data-measure-id], .ml-ex-ui-measure-empty-row")){this.syncRowSelection();return}this.tableContentKey=a,this.renderTable()}syncRowSelection(){this.tbody.querySelectorAll("tr[data-measure-id]").forEach(e=>{e.classList.toggle("is-selected",e.dataset.measureId===this.selectedId)})}renderTable(){var e;const t=this.filteredMeasurements(),a=(e=this.editor.curDocument)==null?void 0:e.database;if(this.tbody.replaceChildren(),t.length===0){const i=document.createElement("tr");i.className="ml-ex-ui-measure-empty-row";const r=document.createElement("td");r.colSpan=3,r.textContent=this.i18n.t("measurePalette.empty"),i.appendChild(r),this.tbody.appendChild(i);return}const o=this.i18n.t("measurePalette.delete");for(const i of t){const r=document.createElement("tr");r.className="ml-ex-ui-measure-row",r.dataset.measureId=i.id,i.id===this.selectedId&&r.classList.add("is-selected");const s=document.createElement("td");s.textContent=this.typeLabel(i.type);const n=document.createElement("td"),u=le(i.id,a)||"—";n.textContent=u,n.title=u;const d=document.createElement("td");d.className="ml-ex-ui-measure-actions-col";const c=document.createElement("button");c.type="button",c.className="ml-ex-ui-measure-btn ml-ex-ui-measure-btn-danger ml-ex-ui-measure-row-delete",c.dataset.measureDelete=i.id,c.textContent=o,c.title=o,c.setAttribute("aria-label",o),d.appendChild(c),r.append(s,n,d),this.tbody.appendChild(r)}}filteredMeasurements(){return this.activeFilter?this.measurements.filter(e=>e.type===this.activeFilter):this.measurements}toggleFilter(e){this.activeFilter=this.activeFilter===e?void 0:e;for(const[t,a]of this.filterButtons){const o=this.activeFilter===t;a.classList.toggle("is-active",o),a.setAttribute("aria-pressed",String(o))}this.renderTable()}handleRowClick(e){const t=this.measurements.find(o=>o.id===e),a=this.editor.curView;!t||!a||lt(a,t)}removeOne(e){const t=this.editor.curView;t&&it(t,e)}clearAll(){const e=this.editor.curView;e&&rt(e)}typeLabel(e){const t=`measurePalette.typeValues.${e}`,a=this.i18n.t(t);return a===t?e:a}}class ro{constructor(e){this.markups=[],this.tableContentKey="",this.detailsOpen=!0,this.editor=e.editor,this.i18n=e.i18n,P(),this.element=document.createElement("div"),this.element.className="ml-ex-ui-review-palette",this.buildDom(),this.refreshLocale(),this.unsubscribeStore=A().subscribe(()=>{this.syncFromStore()}),this.syncFromStore()}refreshLocale(){this.searchInput.placeholder=this.i18n.t("reviewPalette.searchPlaceholder"),this.clearButton.textContent=this.i18n.t("reviewPalette.clear"),this.typeHeaderEl.textContent=this.i18n.t("reviewPalette.type"),this.statusHeaderEl.textContent=this.i18n.t("reviewPalette.status"),this.authorHeaderEl.textContent=this.i18n.t("reviewPalette.author"),this.summaryHeaderEl.textContent=this.i18n.t("reviewPalette.summary"),this.detailTitleEl.textContent=this.i18n.t("reviewPalette.details");const e=this.i18n.t("reviewPalette.closeDetails");this.closeDetailsButton.title=e,this.closeDetailsButton.setAttribute("aria-label",e),this.statusFieldLabelEl.textContent=this.i18n.t("reviewPalette.status"),this.authorFieldLabelEl.textContent=this.i18n.t("reviewPalette.author"),this.textFieldLabelEl.textContent=this.i18n.t("reviewPalette.label"),this.commentFieldLabelEl.textContent=this.i18n.t("reviewPalette.comment"),this.zoomButton.textContent=this.i18n.t("reviewPalette.zoomTo"),this.deleteButton.textContent=this.i18n.t("reviewPalette.delete"),this.rebuildStatusOptions(),this.renderTable(),this.updateDetailFields({preserveDrafts:!0})}destroy(){var e;(e=this.unsubscribeStore)==null||e.call(this),this.unsubscribeStore=void 0}buildDom(){const e=document.createElement("div");e.className="ml-ex-ui-review-toolbar",this.searchInput=document.createElement("input"),this.searchInput.type="search",this.searchInput.className="ml-ex-ui-review-search",this.searchInput.addEventListener("input",()=>this.renderTable()),e.appendChild(this.searchInput),this.clearButton=document.createElement("button"),this.clearButton.type="button",this.clearButton.className="ml-ex-ui-review-btn",this.clearButton.addEventListener("click",()=>this.clearAll()),e.appendChild(this.clearButton),this.element.appendChild(e);const t=document.createElement("div");t.className="ml-ex-ui-review-table-wrap";const a=document.createElement("table");a.className="ml-ex-ui-review-table";const o=document.createElement("thead"),i=document.createElement("tr");this.typeHeaderEl=document.createElement("th"),this.statusHeaderEl=document.createElement("th"),this.authorHeaderEl=document.createElement("th"),this.summaryHeaderEl=document.createElement("th"),i.append(this.typeHeaderEl,this.statusHeaderEl,this.authorHeaderEl,this.summaryHeaderEl),o.appendChild(i),a.appendChild(o),this.tbody=document.createElement("tbody"),this.tbody.addEventListener("click",h=>{const b=this.rowMarkupId(h);b&&this.handleRowClick(b)}),this.tbody.addEventListener("dblclick",h=>{const b=this.rowMarkupId(h);if(!b)return;const f=this.markups.find(S=>S.id===b);f&&this.handleRowDblClick(f)}),a.appendChild(this.tbody),t.appendChild(a),this.element.appendChild(t),this.detailEl=document.createElement("div"),this.detailEl.className="ml-ex-ui-review-detail",this.detailEl.hidden=!0;const r=document.createElement("div");r.className="ml-ex-ui-review-detail-header",this.detailTitleEl=document.createElement("div"),this.detailTitleEl.className="ml-ex-ui-review-detail-title",this.closeDetailsButton=document.createElement("button"),this.closeDetailsButton.type="button",this.closeDetailsButton.className="ml-ex-ui-review-detail-close",this.closeDetailsButton.appendChild(T(Me)),this.closeDetailsButton.addEventListener("click",()=>this.closeDetails()),r.append(this.detailTitleEl,this.closeDetailsButton),this.detailEl.appendChild(r);const s=document.createElement("div");s.className="ml-ex-ui-review-detail-form";const n=this.createField();this.statusFieldLabelEl=n.label,this.statusSelect=document.createElement("select"),this.statusSelect.className="ml-ex-ui-review-select",this.statusSelect.addEventListener("change",()=>{const h=this.selectedMarkup();h&&this.updateMeta(h.id,{status:this.statusSelect.value})}),n.body.appendChild(this.statusSelect),s.appendChild(n.root);const u=this.createField();this.authorFieldLabelEl=u.label,this.authorInput=document.createElement("input"),this.authorInput.type="text",this.authorInput.className="ml-ex-ui-review-input",this.authorInput.disabled=!0,u.body.appendChild(this.authorInput),s.appendChild(u.root);const d=this.createField();this.textFieldLabelEl=d.label,this.textInput=document.createElement("input"),this.textInput.type="text",this.textInput.className="ml-ex-ui-review-input",this.textInput.addEventListener("blur",()=>this.commitText()),this.textInput.addEventListener("keydown",h=>{h.key!=="Enter"||h.isComposing||h.keyCode===229||(h.preventDefault(),this.commitText(),this.textInput.blur())}),d.body.appendChild(this.textInput),s.appendChild(d.root);const c=this.createField();this.commentFieldLabelEl=c.label,this.commentInput=document.createElement("textarea"),this.commentInput.className="ml-ex-ui-review-textarea",this.commentInput.rows=2,this.commentInput.addEventListener("blur",()=>this.commitComment()),c.body.appendChild(this.commentInput),s.appendChild(c.root);const p=document.createElement("div");p.className="ml-ex-ui-review-detail-actions",this.zoomButton=document.createElement("button"),this.zoomButton.type="button",this.zoomButton.className="ml-ex-ui-review-btn",this.zoomButton.addEventListener("click",()=>{const h=this.selectedMarkup();h&&this.focusMarkup(h)}),this.deleteButton=document.createElement("button"),this.deleteButton.type="button",this.deleteButton.className="ml-ex-ui-review-btn ml-ex-ui-review-btn-danger",this.deleteButton.addEventListener("click",()=>{const h=this.selectedMarkup();h&&this.removeMarkup(h.id)}),p.append(this.zoomButton,this.deleteButton),s.appendChild(p),this.detailEl.appendChild(s),this.element.appendChild(this.detailEl)}createField(){const e=document.createElement("div");e.className="ml-ex-ui-review-field";const t=document.createElement("label");t.className="ml-ex-ui-review-field-label";const a=document.createElement("div");return a.className="ml-ex-ui-review-field-body",e.append(t,a),{root:e,label:t,body:a}}rebuildStatusOptions(){const e=this.statusSelect.value;this.statusSelect.replaceChildren();for(const t of Je){const a=document.createElement("option");a.value=t,a.textContent=this.statusLabel(t),this.statusSelect.appendChild(a)}e&&(this.statusSelect.value=e)}syncFromStore(){const e=A(),t=this.lastSelectedId;this.markups=e.list(),this.selectedId=e.selectedId,t&&t!==this.selectedId&&this.commitDraftsFor(t),this.selectedId&&this.selectedId!==t&&(this.loadDrafts(),this.detailsOpen=!0),this.selectedId||(this.detailsOpen=!1),this.lastSelectedId=this.selectedId,this.clearButton.disabled=this.markups.length===0,this.refreshTable(),this.updateDetailFields({preserveDrafts:this.selectedId===t})}rowMarkupId(e){const t=e.target;if(!(t instanceof Element))return;const a=t.closest("tr[data-markup-id]");if(!(!a||!this.tbody.contains(a)))return a instanceof HTMLElement?a.dataset.markupId:void 0}refreshTable(){const e=this.markups.map(t=>`${t.id}	${t.type}	${t.status}	${t.author}	${t.text??""}	${t.comment}`).join(`
`);if(e===this.tableContentKey&&this.tbody.querySelector("tr[data-markup-id], .ml-ex-ui-review-empty-row")){this.syncRowSelection();return}this.tableContentKey=e,this.renderTable()}syncRowSelection(){this.tbody.querySelectorAll("tr[data-markup-id]").forEach(e=>{e.classList.toggle("is-selected",e.dataset.markupId===this.selectedId)})}renderTable(){const e=this.filteredMarkups();if(this.tbody.replaceChildren(),e.length===0){const t=document.createElement("tr");t.className="ml-ex-ui-review-empty-row";const a=document.createElement("td");a.colSpan=4,a.textContent=this.i18n.t("reviewPalette.empty"),t.appendChild(a),this.tbody.appendChild(t);return}for(const t of e){const a=document.createElement("tr");a.className="ml-ex-ui-review-row",a.dataset.markupId=t.id,t.id===this.selectedId&&a.classList.add("is-selected");const o=document.createElement("td");o.textContent=this.typeLabel(t.type);const i=document.createElement("td");i.textContent=this.statusLabel(t.status);const r=document.createElement("td");r.textContent=t.author,r.title=t.author;const s=document.createElement("td"),n=t.text||t.comment||"—";s.textContent=n,s.title=n,a.append(o,i,r,s),this.tbody.appendChild(a)}}updateDetailFields(e){const t=this.selectedMarkup(),a=!!(t&&this.detailsOpen);if(this.detailEl.hidden=!a,!(!t||!a)){if(this.statusSelect.value=t.status,this.authorInput.value=t.author,e.preserveDrafts){const o=document.activeElement;o!==this.textInput&&(this.textInput.value=t.text??""),o!==this.commentInput&&(this.commentInput.value=t.comment??"");return}this.loadDrafts()}}loadDrafts(){const e=this.selectedMarkup();this.textInput.value=(e==null?void 0:e.text)??"",this.commentInput.value=(e==null?void 0:e.comment)??"",this.authorInput.value=(e==null?void 0:e.author)??"",e&&(this.statusSelect.value=e.status)}filteredMarkups(){const e=this.searchInput.value.trim().toLowerCase();return e?this.markups.filter(t=>`${t.type} ${t.status} ${t.author} ${t.text??""} ${t.comment}`.toLowerCase().includes(e)):this.markups}selectedMarkup(){return this.markups.find(e=>e.id===this.selectedId)}handleRowClick(e){this.detailsOpen=!0;const t=this.editor.curView;t&&w().select(t,e),this.updateDetailFields({preserveDrafts:!0})}handleRowDblClick(e){this.handleRowClick(e.id),this.focusMarkup(e)}closeDetails(){this.commitText(),this.commitComment(),this.detailsOpen=!1,this.detailEl.hidden=!0}commitText(){const e=this.selectedId;if(!e)return;const t=this.markups.find(i=>i.id===e),a=this.textInput.value,o=(t==null?void 0:t.text)??"";a!==o&&this.updateMeta(e,{text:a})}commitComment(){const e=this.selectedId;if(!e)return;const t=this.markups.find(i=>i.id===e),a=this.commentInput.value,o=(t==null?void 0:t.comment)??"";a!==o&&this.updateMeta(e,{comment:a})}commitDraftsFor(e){const t=this.markups.find(r=>r.id===e);if(!t)return;const a=this.textInput.value,o=this.commentInput.value,i={};a!==(t.text??"")&&(i.text=a),o!==(t.comment??"")&&(i.comment=o),Object.keys(i).length!==0&&this.updateMeta(e,i)}updateMeta(e,t){const a=this.editor.curView;a&&Qe(a,"Edit Markup",()=>{const o=A().updateMeta(e,t);o&&(t.text!==void 0||t.comment!==void 0)&&w().publish(a,o)})}focusMarkup(e){const t=this.editor.curView;t&&w().focus(t,e)}removeMarkup(e){const t=this.editor.curView;t&&w().unpublish(t,e)}clearAll(){const e=this.editor.curView;e&&w().clearVisuals(e,{clearStore:!0})}statusLabel(e){return this.i18n.t(`reviewPalette.statusValues.${e}`)}typeLabel(e){const t=`reviewPalette.typeValues.${e}`,a=this.i18n.t(t);return a===t?e:a}}const k="layers",C="review",E="measurements",M="find";class $e{constructor(e={}){this.options=e,this.name=He,this.version=ua.version,this.description="Framework-agnostic toolbar, layer manager, and review palette UI",this.layerUiControllerHolder=new ha,this.baseToolbarItems=[],this.toolbarItemsInput="default",this.toolbarItemsOverridden=!1,this.hasLayerToolbarItem=!1,this.hasMarkupPanelToolbarItem=!1,this.hasMeasurementPanelToolbarItem=!1,this.hasFindToolbarItem=!1,this.dockPanelExplicitlyEnabled=!1,this.toolbarPlacement="right",this.toolbarCollapsible=!1,this.toolbarEdgeOffset=8,this.toolbarSideOffset=0,this.toolbarInCanvasParent=!1,this.toolbarShowLabels=!1,this.toolbarShowChildrenIndicator=!0,this.toolbarShowBorder=!0,this.toolbarShowButtonBorder=!1,this.toolbarShowSeparators=!0,this.toolbarSize="auto",this.toolbarOverflow="menu",this.layoutMode="auto",this.activeLayoutKind="desktop",this.registeredCommands=[],this.handleLocaleChanged=()=>{var t,a,o,i,r,s;this.rebuildToolbarItems(this.activeLayoutKind),(t=this.toolbar)==null||t.setSelectedChild("locale",`locale-${v.currentLocale}`),(a=this.layerListView)==null||a.refreshLocale(),(o=this.reviewPaletteView)==null||o.refreshLocale(),(i=this.measurementPaletteView)==null||i.refreshLocale(),(r=this.findPaletteView)==null||r.refreshLocale(),(s=this.dockPanel)==null||s.refreshLocale(),this.toolbar&&(this.toolbar.updateItems(this.baseToolbarItems),this.toolbar.refreshLocale())},this.handleDocumentActivatedForDock=()=>{var t,a;this.hasLayerToolbarItem&&this.mountLayerDockUi(),this.hasMarkupPanelToolbarItem&&this.mountReviewDockUi(),this.hasMeasurementPanelToolbarItem&&this.mountMeasurementDockUi(),this.hasFindToolbarItem&&this.mountFindDockUi(),this.tryUpgradeDockMountTarget(),(t=this.dockPanel)==null||t.ensureMounted(),this.ensureViewerToolbar(),this.tryUpgradeToolbarMountTarget(),(a=this.toolbar)==null||a.syncInParentLayout()}}addDockPanelTab(e){return!e.labelKey&&!e.label||(this.ensureDockReady(),!this.dockPanel)||!this.dockPanel.addTab(e)?!1:(this.dockPanel.open(e.id),!0)}isDockPanelOpen(){var e;return((e=this.dockPanel)==null?void 0:e.isOpen)??!1}hasDockPanelTab(e){var t;return((t=this.dockPanel)==null?void 0:t.hasTab(e))??!1}toggleDockPanelTab(e){var t;return!((t=this.dockPanel)!=null&&t.hasTab(e))||(this.ensureDockReady(),!this.dockPanel)?!1:(this.dockPanel.toggle(e),!0)}setDockPanelOpen(e){return e?(this.ensureDockReady(),this.dockPanel?(this.dockPanel.open(),!0):(console.warn("[SimpleUiPlugin] setDockPanelOpen skipped: dock panel is unavailable."),!1)):(this.dockPanel&&this.dockPanel.close(),!0)}getDockPanelSide(){var e;return(e=this.dockPanel)==null?void 0:e.getSide()}getDockPanelSize(){var e;return(e=this.dockPanel)==null?void 0:e.getSize()}setDockPanelSize(e){return this.ensureDockReady(),this.dockPanel?(this.dockPanel.setPanelSize(e),!0):(console.warn("[SimpleUiPlugin] setDockPanelSize skipped: dock panel is unavailable."),!1)}getToolbarItems(){return this.toolbarItemsInput}setToolbarItems(e,t){if(!this.toolbar)return;this.toolbarItemsOverridden=!0,this.toolbarLayoutSwitcher=t,this.toolbarItemsInput=e;const a=this.resolveBaseToolbarItems(e);this.baseToolbarItems=t?V(a,t):a,this.syncLayerToolbarItem(),this.syncReviewToolbarItem(),this.syncMeasurementToolbarItem(),this.syncFindToolbarItem(),this.renderToolbarItems()}getToolbarPlacement(){return this.toolbarPlacement}setToolbarPlacement(e){return this.toolbar?(this.applyToolbarPlacement(e),!0):(console.warn("[SimpleUiPlugin] setToolbarPlacement skipped: toolbar is unavailable."),!1)}isToolbarVisible(){var e;return((e=this.toolbar)==null?void 0:e.isVisible)??!1}setToolbarVisible(e){var t;return this.toolbar?(this.toolbar.setVisible(e),e||(t=this.dockPanel)==null||t.close(),!0):(console.warn("[SimpleUiPlugin] setToolbarVisible skipped: toolbar is unavailable."),!1)}isToolbarCollapsed(){var e;return((e=this.toolbar)==null?void 0:e.isCollapsed)??!1}setToolbarCollapsed(e){return this.toolbar?this.toolbarCollapsible?(this.toolbar.setCollapsed(e),!0):(console.warn("[SimpleUiPlugin] setToolbarCollapsed skipped: toolbar is not collapsible."),!1):(console.warn("[SimpleUiPlugin] setToolbarCollapsed skipped: toolbar is unavailable."),!1)}getToolbarEdgeOffset(){var e;return((e=this.toolbar)==null?void 0:e.getEdgeOffset())??this.toolbarEdgeOffset}getLayout(){return this.activeLayoutKind}setLayout(e){var t;return!this.toolbar&&e!==this.layoutMode?(this.layoutMode=e,!0):this.toolbar?(this.layoutMode=e,(t=this.unsubscribeLayout)==null||t.call(this),this.unsubscribeLayout=void 0,e==="auto"?(this.unsubscribeLayout=Ye(a=>{a!==this.activeLayoutKind&&this.applyLayoutKind(a)}),this.applyLayoutKind(te())):this.applyLayoutKind(e),!0):!1}setToolbarEdgeOffset(e){return this.toolbar?(this.toolbarEdgeOffset=Math.max(0,e),this.toolbar.setEdgeOffset(this.toolbarEdgeOffset),!0):(console.warn("[SimpleUiPlugin] setToolbarEdgeOffset skipped: toolbar is unavailable."),!1)}onLoad(e,t){var a,o,i;Ge(),this.commandManager=t,D.instance.set("isShowRibbon",!1,{persist:!1});const r=ga(this.options),s=r.host??((a=m.instance.curView)==null?void 0:a.container)??document.body;this.hostEl=s,this.dockPanelMountTargetOption=(o=this.options.dockPanel)==null?void 0:o.mountTarget,this.toolbarMountTargetOption=(i=this.options.toolbar)==null?void 0:i.mountTarget,this.layoutMode=r.layout,this.dockPanelExplicitlyEnabled=r.dockPanel.enabled===!0,this.dockPanelDefaults={defaultOpen:r.dockPanel.defaultOpen??!1,defaultSide:r.dockPanel.defaultSide??"left",defaultHeight:r.dockPanel.defaultHeight??240,defaultWidth:r.dockPanel.defaultWidth??280},this.themeSync=new Xa(s,()=>{var d;return(d=this.toolbar)==null?void 0:d.refresh()}),this.themeSync.start(),this.i18n=new Ke,v.events.localeChanged.addEventListener(this.handleLocaleChanged),m.instance.events.documentActivated.addEventListener(this.handleDocumentActivatedForDock);const n=this.layoutMode==="auto"?te():this.layoutMode,u=this.isViewerToolbarEnabled();this.applyLayoutKind(n,{skipToolbarApply:!u}),r.shouldCreateDockPanel&&this.ensureDockPanel(),this.hasLayerToolbarItem&&(this.mountLayerDockUi(),this.ensureLayerCommandRegistered()),this.hasMarkupPanelToolbarItem&&(this.mountReviewDockUi(),this.ensureMarkupPanelCommandRegistered()),this.hasMeasurementPanelToolbarItem&&(this.mountMeasurementDockUi(),this.ensureMeasurementPanelCommandRegistered()),this.hasFindToolbarItem&&(this.mountFindDockUi(),this.ensureFindCommandRegistered()),this.ensureViewerToolbar(s)}isViewerToolbarEnabled(){var e;return((e=this.options.toolbar)==null?void 0:e.enabled)!==!1}ensureViewerToolbar(e){var t;if(!this.isViewerToolbarEnabled())return;if(this.toolbar){if(this.toolbar.isRootConnected())return;(t=this.toolbarDocUnbind)==null||t.call(this),this.toolbarDocUnbind=void 0,this.toolbar.destroy(),this.toolbar=void 0,this.toolbarMountEl=void 0}const a=e??this.hostEl;if(!a||!this.i18n)return;const o=this.getToolbarMountEl()??a;this.toolbarMountEl=o;const i=this.getMergedToolbarOptions(this.activeLayoutKind);try{this.toolbar=new ke({host:o,themeHost:a,placement:this.toolbarPlacement,edgeOffset:this.toolbarEdgeOffset,sideOffset:this.toolbarSideOffset,items:this.baseToolbarItems,i18n:this.i18n,collapsible:this.toolbarCollapsible,defaultCollapsed:i.defaultCollapsed,showLabels:this.toolbarShowLabels,showChildrenIndicator:this.toolbarShowChildrenIndicator,size:this.toolbarSize,overflow:this.toolbarOverflow,showBorder:this.toolbarShowBorder,showButtonBorder:this.toolbarShowButtonBorder,showSeparators:this.toolbarShowSeparators,inCanvasParent:this.toolbarInCanvasParent,subToolbar:this.toolbarSubToolbar,onCollapse:()=>{var r;(r=this.dockPanel)==null||r.close()},onExclusiveOpen:()=>this.dismissDockForExclusiveChrome(),onCommand:r=>{m.instance.sendStringToExecute(r)}}),this.toolbarDocUnbind=je(this.toolbar)}catch(r){console.error("[SimpleUiPlugin] Failed to create viewer toolbar:",r);return}try{this.setLayout(this.layoutMode)}catch(r){console.warn("[SimpleUiPlugin] setLayout failed during toolbar setup:",r)}}getToolbarMountEl(){if(this.hostEl)return this.toolbarInCanvasParent?N(this.hostEl,this.toolbarMountTargetOption):Ua(this.hostEl,this.toolbarMountTargetOption)}tryUpgradeToolbarMountTarget(){var e;if(this.toolbarMountTargetOption||!this.hostEl||!this.toolbar)return;const t=this.getToolbarMountEl();if(!t||t===this.toolbarMountEl)return;const a=(e=m.instance.curView)==null?void 0:e.container,o=a==null?void 0:a.parentElement;this.toolbarMountEl!==this.hostEl&&this.toolbarMountEl!==a&&this.toolbarMountEl!==o||(this.toolbar.reparentTo(t),this.toolbarMountEl=t,this.toolbar.syncInParentLayout())}getMergedToolbarOptions(e){var t,a;return De(e,this.options.toolbar,(a=(t=this.options.layouts)==null?void 0:t[e])==null?void 0:a.toolbar)}applyLayoutKind(e,t){this.activeLayoutKind=e;const a=this.getMergedToolbarOptions(e);this.toolbarPlacement=a.placement??"right",this.toolbarCollapsible=a.collapsible??!1,this.toolbarEdgeOffset=a.edgeOffset??8,this.toolbarSideOffset=a.sideOffset??0,this.toolbarShowLabels=a.showLabels??!1,this.toolbarShowChildrenIndicator=a.showChildrenIndicator??!0,this.toolbarShowBorder=a.showBorder??!0,this.toolbarShowButtonBorder=a.showButtonBorder??!1,this.toolbarShowSeparators=a.showSeparators??!0,this.toolbarSize=a.size??"auto",this.toolbarOverflow=a.overflow??"menu",this.toolbarSubToolbar=a.subToolbar;const o=a.inCanvasParent===!0,i=o!==this.toolbarInCanvasParent;if(this.toolbarInCanvasParent=o,this.rebuildToolbarItems(e,a),this.syncLayerToolbarItem(),this.syncReviewToolbarItem(),this.syncMeasurementToolbarItem(),this.syncFindToolbarItem(),!(t!=null&&t.skipToolbarApply||!this.toolbar)){if(this.toolbar.applyViewOptions({placement:this.toolbarPlacement,edgeOffset:this.toolbarEdgeOffset,sideOffset:this.toolbarSideOffset,collapsible:this.toolbarCollapsible,defaultCollapsed:a.defaultCollapsed,showLabels:this.toolbarShowLabels,showChildrenIndicator:this.toolbarShowChildrenIndicator,size:this.toolbarSize,overflow:this.toolbarOverflow,showBorder:this.toolbarShowBorder,showButtonBorder:this.toolbarShowButtonBorder,showSeparators:this.toolbarShowSeparators,subToolbar:this.toolbarSubToolbar,inCanvasParent:this.toolbarInCanvasParent,items:this.baseToolbarItems}),i||!this.toolbar.isRootConnected()){const r=this.getToolbarMountEl();r&&(this.toolbar.reparentTo(r),this.toolbarMountEl=r)}this.toolbar.syncInParentLayout()}}getToolbarContext(){return{getTheme:()=>{var e;return((e=this.themeSync)==null?void 0:e.getTheme())??"dark"},setTheme:e=>{var t;return(t=this.themeSync)==null?void 0:t.setTheme(e)},getLocale:()=>v.currentLocale,setLocale:e=>this.setLocale(e),getPlacement:()=>this.toolbarPlacement,setPlacement:e=>{this.applyToolbarPlacement(e)}}}rebuildToolbarItems(e,t){if(this.toolbarItemsOverridden){const o=this.resolveBaseToolbarItems(this.toolbarItemsInput);this.baseToolbarItems=this.toolbarLayoutSwitcher?V(o,this.toolbarLayoutSwitcher):o;return}const a=t??this.getMergedToolbarOptions(e);this.toolbarItemsInput=a.items??"default",this.baseToolbarItems=_(a,this.getToolbarContext(),e)}resolveBaseToolbarItems(e){return _({items:e,appendItems:void 0},this.getToolbarContext(),this.activeLayoutKind)}renderToolbarItems(){var e;(e=this.toolbar)==null||e.updateItems(this.baseToolbarItems)}syncLayerToolbarItem(){const e=this.hasLayerToolbarItem,t=L(this.baseToolbarItems,"layer");this.hasLayerToolbarItem=t,t&&!e?(this.ensureLayerCommandRegistered(),this.mountLayerDockUi()):!t&&e&&(this.teardownLayerUi(),this.unregisterLayerCommand())}syncReviewToolbarItem(){const e=this.hasMarkupPanelToolbarItem,t=L(this.baseToolbarItems,"markup-panel");this.hasMarkupPanelToolbarItem=t,t&&!e?(this.ensureMarkupPanelCommandRegistered(),this.mountReviewDockUi()):!t&&e&&(this.teardownReviewUi(),this.unregisterMarkupPanelCommand())}syncMeasurementToolbarItem(){const e=this.hasMeasurementPanelToolbarItem,t=L(this.baseToolbarItems,"measurement-panel");this.hasMeasurementPanelToolbarItem=t,t&&!e?(this.ensureMeasurementPanelCommandRegistered(),this.mountMeasurementDockUi()):!t&&e&&(this.teardownMeasurementUi(),this.unregisterMeasurementPanelCommand())}syncFindToolbarItem(){const e=this.hasFindToolbarItem,t=L(this.baseToolbarItems,"find");this.hasFindToolbarItem=t,t&&!e?(this.ensureFindCommandRegistered(),this.mountFindDockUi()):!t&&e&&(this.teardownFindUi(),this.unregisterFindCommand())}unregisterLayerCommand(){if(!this.commandManager)return;const e=y.SYSTEMT_COMMAND_GROUP_NAME,t=this.registeredCommands.findIndex(a=>a.name==="layer");t!==-1&&(this.commandManager.removeCmd(e,"layer"),this.registeredCommands.splice(t,1))}ensureLayerCommandRegistered(){this.commandManager&&(this.registeredCommands.some(e=>e.name==="layer")||this.registerLayerCommand(this.commandManager))}unregisterMarkupPanelCommand(){if(!this.commandManager)return;const e=y.SYSTEMT_COMMAND_GROUP_NAME,t=this.registeredCommands.findIndex(a=>a.name==="markuppanel");t!==-1&&(this.commandManager.removeCmd(e,"markuppanel"),this.registeredCommands.splice(t,1))}ensureMarkupPanelCommandRegistered(){this.commandManager&&(this.registeredCommands.some(e=>e.name==="markuppanel")||this.registerMarkupPanelCommand(this.commandManager))}unregisterMeasurementPanelCommand(){if(!this.commandManager)return;const e=y.SYSTEMT_COMMAND_GROUP_NAME,t=this.registeredCommands.findIndex(a=>a.name==="measurementpanel");t!==-1&&(this.commandManager.removeCmd(e,"measurementpanel"),this.registeredCommands.splice(t,1))}ensureMeasurementPanelCommandRegistered(){this.commandManager&&(this.registeredCommands.some(e=>e.name==="measurementpanel")||this.registerMeasurementPanelCommand(this.commandManager))}unregisterFindCommand(){if(!this.commandManager)return;const e=y.SYSTEMT_COMMAND_GROUP_NAME,t=this.registeredCommands.findIndex(a=>a.name==="find");t!==-1&&(this.commandManager.removeCmd(e,"find"),this.registeredCommands.splice(t,1))}ensureFindCommandRegistered(){if(!this.commandManager||this.registeredCommands.some(t=>t.name==="find"))return;const e=y.SYSTEMT_COMMAND_GROUP_NAME;this.commandManager.addCommand(e,"find","find",new ca({prepare:()=>{this.mountFindDockUi(),this.tryUpgradeDockMountTarget()},toggle:()=>{var t,a;(t=this.dockPanel)==null||t.open(M),(a=this.findPaletteView)==null||a.focus()}})),this.registeredCommands.push({group:e,name:"find"})}registerLayerCommand(e){if(this.registeredCommands.some(a=>a.name==="layer"))return;const t=y.SYSTEMT_COMMAND_GROUP_NAME;e.addCommand(t,"layer","layer",this.createLayerCommand()),this.registeredCommands.push({group:t,name:"layer"})}createLayerCommand(){return new ma({prepare:()=>this.prepareLayerDockForCommand(),toggle:()=>this.layerUiControllerHolder.toggleFromCommand()})}prepareLayerDockForCommand(){this.mountLayerDockUi(),this.tryUpgradeDockMountTarget()}registerMarkupPanelCommand(e){if(this.registeredCommands.some(a=>a.name==="markuppanel"))return;const t=y.SYSTEMT_COMMAND_GROUP_NAME;e.addCommand(t,"markuppanel","markuppanel",this.createMarkupPanelCommand()),this.registeredCommands.push({group:t,name:"markuppanel"})}createMarkupPanelCommand(){return new pa({prepare:()=>this.prepareReviewDockForCommand(),toggle:()=>{var e;return(e=this.dockPanel)==null?void 0:e.open(C)}})}prepareReviewDockForCommand(){this.mountReviewDockUi(),this.tryUpgradeDockMountTarget()}registerMeasurementPanelCommand(e){if(this.registeredCommands.some(a=>a.name==="measurementpanel"))return;const t=y.SYSTEMT_COMMAND_GROUP_NAME;e.addCommand(t,"measurementpanel","measurementpanel",this.createMeasurementPanelCommand()),this.registeredCommands.push({group:t,name:"measurementpanel"})}createMeasurementPanelCommand(){return new ba({prepare:()=>this.prepareMeasurementDockForCommand(),toggle:()=>{var e;return(e=this.dockPanel)==null?void 0:e.open(E)}})}prepareMeasurementDockForCommand(){this.mountMeasurementDockUi(),this.tryUpgradeDockMountTarget()}ensureDockReady(){var e;if(!this.dockPanel){this.prepareDockPanel();return}this.hasLayerToolbarItem&&!this.dockPanel.hasTab(k)&&this.mountLayerDockUi(),this.hasMarkupPanelToolbarItem&&!this.dockPanel.hasTab(C)&&this.mountReviewDockUi(),this.hasMeasurementPanelToolbarItem&&!this.dockPanel.hasTab(E)&&this.mountMeasurementDockUi(),this.hasFindToolbarItem&&!this.dockPanel.hasTab(M)&&this.mountFindDockUi(),this.tryUpgradeDockMountTarget(),this.dockPanel.ensureMounted(),(e=this.toolbar)==null||e.syncInParentLayout()}prepareDockPanel(){this.hasLayerToolbarItem&&this.mountLayerDockUi(),this.hasMarkupPanelToolbarItem&&this.mountReviewDockUi(),this.hasMeasurementPanelToolbarItem&&this.mountMeasurementDockUi(),this.hasFindToolbarItem&&this.mountFindDockUi(),this.dockPanel||this.ensureDockPanel(),this.tryUpgradeDockMountTarget()}dismissStripsForDockPanel(){var e;(e=this.toolbar)!=null&&e.replaceOnNested&&this.toolbar.dismissOpenChildren()}dismissDockForExclusiveChrome(){var e,t;(e=this.toolbar)!=null&&e.replaceOnNested&&((t=this.dockPanel)==null||t.close())}ensureDockPanel(){const e=this.getDockMountEl();!e||!this.i18n||!this.dockPanelDefaults||this.dockPanel||(this.dockPanel=new eo({host:e,i18n:this.i18n,defaultSide:this.dockPanelDefaults.defaultSide,defaultOpen:this.dockPanelDefaults.defaultOpen,defaultHeight:this.dockPanelDefaults.defaultHeight,defaultWidth:this.dockPanelDefaults.defaultWidth,onOpen:()=>this.dismissStripsForDockPanel()}),this.syncToolbarMountAfterDockChange())}getDockMountEl(){if(this.hostEl)return N(this.hostEl,this.dockPanelMountTargetOption)}tryUpgradeDockMountTarget(){if(this.dockPanelMountTargetOption||!this.hostEl||!this.dockPanel)return;const e=N(this.hostEl),t=this.dockPanel.getMountHost();t!==e&&(t!==this.hostEl||e===this.hostEl||(this.dockPanel.reparentTo(e),this.refreshLayerDockController(),this.syncToolbarMountAfterDockChange()))}refreshLayerDockController(){var e,t;(e=this.dockPanel)!=null&&e.hasTab(k)&&((t=this.layerDockController)==null||t.destroy(),this.layerDockController=new he(this.dockPanel,k),this.layerUiControllerHolder.current=this.layerDockController)}mountLayerDockUi(){if(!(!this.hostEl||!this.i18n||(this.ensureDockPanel(),!this.dockPanel))){if(this.dockPanel.hasTab(k)){this.refreshLayerDockController();return}if(this.layerListView=new oo({editor:m.instance,i18n:this.i18n,host:this.hostEl,showHeader:!1}),!this.dockPanel.addTab({id:k,labelKey:"dockPanel.tab.layers",content:this.layerListView.element})){this.layerListView.destroy(),this.layerListView=void 0;return}this.layerDockController=new he(this.dockPanel,k),this.layerUiControllerHolder.current=this.layerDockController}}teardownLayerUi(){var e,t,a;(e=this.dockPanel)==null||e.removeTab(k),(t=this.layerListView)==null||t.destroy(),this.layerListView=void 0,(a=this.layerDockController)==null||a.destroy(),this.layerDockController=void 0,this.layerUiControllerHolder.current=void 0,this.destroyDockIfUnused()}mountReviewDockUi(){!this.hostEl||!this.i18n||(this.ensureDockPanel(),!this.dockPanel)||this.dockPanel.hasTab(C)||(this.reviewPaletteView=new ro({editor:m.instance,i18n:this.i18n}),this.dockPanel.addTab({id:C,labelKey:"dockPanel.tab.review",content:this.reviewPaletteView.element})||(this.reviewPaletteView.destroy(),this.reviewPaletteView=void 0))}teardownReviewUi(){var e,t;(e=this.dockPanel)==null||e.removeTab(C),(t=this.reviewPaletteView)==null||t.destroy(),this.reviewPaletteView=void 0,this.destroyDockIfUnused()}mountMeasurementDockUi(){!this.hostEl||!this.i18n||(this.ensureDockPanel(),!this.dockPanel)||this.dockPanel.hasTab(E)||(this.measurementPaletteView=new io({editor:m.instance,i18n:this.i18n}),this.dockPanel.addTab({id:E,labelKey:"dockPanel.tab.measurements",content:this.measurementPaletteView.element})||(this.measurementPaletteView.destroy(),this.measurementPaletteView=void 0))}teardownMeasurementUi(){var e,t;(e=this.dockPanel)==null||e.removeTab(E),(t=this.measurementPaletteView)==null||t.destroy(),this.measurementPaletteView=void 0,this.destroyDockIfUnused()}mountFindDockUi(){!this.hostEl||!this.i18n||(this.ensureDockPanel(),!this.dockPanel)||this.dockPanel.hasTab(M)||(this.findPaletteView=new to({editor:m.instance,i18n:this.i18n}),this.dockPanel.addTab({id:M,labelKey:"dockPanel.tab.find",content:this.findPaletteView.element})||(this.findPaletteView.destroy(),this.findPaletteView=void 0))}teardownFindUi(){var e,t;(e=this.dockPanel)==null||e.removeTab(M),(t=this.findPaletteView)==null||t.destroy(),this.findPaletteView=void 0,this.destroyDockIfUnused()}destroyDockIfUnused(){this.dockPanel&&(this.dockPanel.hasTabs||(this.dockPanel.close(),!this.dockPanelExplicitlyEnabled&&(this.dockPanel.destroy(),this.dockPanel=void 0,this.syncToolbarMountAfterDockChange())))}syncToolbarMountAfterDockChange(){if(!this.toolbar||!this.hostEl)return;const e=this.getToolbarMountEl();e&&((e!==this.toolbarMountEl||!this.toolbar.isRootConnected())&&(this.toolbar.reparentTo(e),this.toolbarMountEl=e),this.toolbar.syncInParentLayout())}applyToolbarPlacement(e){var t;this.toolbarPlacement=e,(t=this.toolbar)==null||t.setPlacement(e)}onUnload(e,t){var a,o,i,r,s;(a=this.unsubscribeLayout)==null||a.call(this),this.unsubscribeLayout=void 0,v.events.localeChanged.removeEventListener(this.handleLocaleChanged),m.instance.events.documentActivated.removeEventListener(this.handleDocumentActivatedForDock);for(const n of this.registeredCommands)t.removeCmd(n.group,n.name);this.registeredCommands=[],this.teardownLayerUi(),this.teardownReviewUi(),this.teardownMeasurementUi(),this.teardownFindUi(),(o=this.toolbarDocUnbind)==null||o.call(this),this.toolbarDocUnbind=void 0,(i=this.toolbar)==null||i.destroy(),(r=this.dockPanel)==null||r.destroy(),this.toolbar=void 0,this.toolbarMountEl=void 0,this.toolbarMountTargetOption=void 0,this.dockPanel=void 0,this.hostEl=void 0,this.dockPanelMountTargetOption=void 0,this.baseToolbarItems=[],this.toolbarItemsInput="default",this.toolbarItemsOverridden=!1,this.toolbarLayoutSwitcher=void 0,this.hasLayerToolbarItem=!1,this.hasMarkupPanelToolbarItem=!1,this.hasMeasurementPanelToolbarItem=!1,this.hasFindToolbarItem=!1,this.commandManager=void 0,this.i18n=void 0,(s=this.themeSync)==null||s.stop(),this.themeSync=void 0,D.instance.clearSessionOverride("isShowRibbon"),Ja()}setLocale(e){v.setCurrentLocale(e)}}function so(l={}){return new $e(l)}const no=Object.freeze(Object.defineProperty({__proto__:null,AcApLayerStore:aa,AcApSimpleUiPlugin:$e,AcUiI18n:Ke,AcUiToolbar:ke,SIMPLE_UI_PLUGIN_NAME:He,acuiCreateDefaultToolbarItems:K,acuiCreateDefaultToolbarPresetMap:_e,acuiCreateOpenToolbarItem:Ue,acuiCreatePhoneToolbarItems:$,acuiCreateSettingsToolbarItem:G,acuiCreateSimpleUiPlugin:so,acuiCreateToolbarLayoutSwitcher:va,acuiCreateToolbarSeparator:oa,acuiCreateZoomToolbarItem:F,acuiMergeToolbarOptionsForLayout:De,acuiPrependToolbarLayoutSwitcher:V,acuiRegisterSimpleUiI18n:Ge,acuiRegisterSimpleUiPlugin:na,acuiResolveToolbarChrome:la,acuiResolveToolbarItems:_,acuiToolbarPreset:ia},Symbol.toStringTag,{value:"Module"}));export{He as S,na as a,va as i};
