import{$ as si,a0 as li,a1 as Cr,a2 as ci,a3 as Fr,a4 as di,y as ui,M as qr,a5 as mi,c as Qr,a6 as pi,a7 as hi,a8 as fi}from"./three-renderer-CzP-TPRa.js";import{h as pt,L as gi,k as bi,M as wi,o as xi,v as yi,y as vi,r as Br,V as X,O as ki}from"./three-CjYIUj3K.js";import{AcDbSysVarManager as Ai,AcDbSystemVariables as le,AcDbViewport as Mi,AcCmColor as Si,AcCmColorMethod as Ci,AcDbTable as Fi,AcDbAttribute as Bi,AcDbDimension as Ei,AcDbCircle as Li,AcDbArc as Ii,AcDbEllipse as $e,AcDbSpline as Pi,AcDbPolyline as zi,AcDb2dPolyline as Di,AcDb3dPolyline as Ui,AcDbHatch as Ni,AcDbRay as Ti,AcDbXline as _i,AcDbSolid as Ri,AcDbTrace as Hi,AcDbFace as Oi,AcDbLeader as $i,AcDbMLine as ji,AcDbMLeader as Vi,AcDbText as Xi,AcDbMText as Yi,AcDbOle2Frame as Gi,AcDbRasterImage as Wi,AcDbPoint as Ki,AcDbLine as Ji,AcGeTol as ct,FLOAT_TOL as tn,TAU as Zi,AcGeCircArc2d as je,AcGePolyline2d as qi,AcGeLoop2d as Qi,AcGeLine2d as to,AcGeEllipseArc2d as eo,accmYieldForPaint as V}from"./data-model-F253oP3p.js";import{_ as ro,J as no,K as ao,aS as zt,p as k,k as tt,aT as E,aU as io,aM as oo,aV as so,aW as Er,aX as lo}from"./cad-simple-viewer-C75pTvjo.js";const en="HtmlPlugin",rn=["-chtml","chtml"];let ce={};function Ll(t,e){e&&(ce={...ce,...e});const r={...ce};t.registerLazyPlugin({name:en,triggers:[...rn],loader:async()=>{const{createHtmlPlugin:n}=await ro(async()=>{const{createHtmlPlugin:a}=await Promise.resolve().then(()=>Sl);return{createHtmlPlugin:a}},void 0,import.meta.url);return n(r)}})}var z=Uint8Array,N=Uint16Array,Ve=Int32Array,Xe=new z([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Ye=new z([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Lr=new z([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),nn=function(t,e){for(var r=new N(31),n=0;n<31;++n)r[n]=e+=1<<t[n-1];for(var a=new Ve(r[30]),n=1;n<30;++n)for(var i=r[n];i<r[n+1];++i)a[i]=i-r[n]<<5|n;return{b:r,r:a}},an=nn(Xe,2),co=an.b,he=an.r;co[28]=258,he[258]=28;var uo=nn(Ye,0),Ir=uo.r,fe=new N(32768);for(var M=0;M<32768;++M){var K=(M&43690)>>1|(M&21845)<<1;K=(K&52428)>>2|(K&13107)<<2,K=(K&61680)>>4|(K&3855)<<4,fe[M]=((K&65280)>>8|(K&255)<<8)>>1}var yt=(function(t,e,r){for(var n=t.length,a=0,i=new N(e);a<n;++a)t[a]&&++i[t[a]-1];var o=new N(e);for(a=1;a<e;++a)o[a]=o[a-1]+i[a-1]<<1;var s;if(r){s=new N(1<<e);var l=15-e;for(a=0;a<n;++a)if(t[a])for(var c=a<<4|t[a],d=e-t[a],u=o[t[a]-1]++<<d,m=u|(1<<d)-1;u<=m;++u)s[fe[u]>>l]=c}else for(s=new N(n),a=0;a<n;++a)t[a]&&(s[a]=fe[o[t[a]-1]++]>>15-t[a]);return s}),et=new z(288);for(var M=0;M<144;++M)et[M]=8;for(var M=144;M<256;++M)et[M]=9;for(var M=256;M<280;++M)et[M]=7;for(var M=280;M<288;++M)et[M]=8;var Nt=new z(32);for(var M=0;M<32;++M)Nt[M]=5;var mo=yt(et,9,0),po=yt(Nt,5,0),on=function(t){return(t+7)/8|0},sn=function(t,e,r){return(r==null||r>t.length)&&(r=t.length),new z(t.subarray(e,r))},ho=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],jt=function(t,e,r){var n=new Error(e||ho[t]);if(n.code=t,Error.captureStackTrace&&Error.captureStackTrace(n,jt),!r)throw n;return n},Y=function(t,e,r){r<<=e&7;var n=e/8|0;t[n]|=r,t[n+1]|=r>>8},gt=function(t,e,r){r<<=e&7;var n=e/8|0;t[n]|=r,t[n+1]|=r>>8,t[n+2]|=r>>16},de=function(t,e){for(var r=[],n=0;n<t.length;++n)t[n]&&r.push({s:n,f:t[n]});var a=r.length,i=r.slice();if(!a)return{t:cn,l:0};if(a==1){var o=new z(r[0].s+1);return o[r[0].s]=1,{t:o,l:1}}r.sort(function(F,C){return F.f-C.f}),r.push({s:-1,f:25001});var s=r[0],l=r[1],c=0,d=1,u=2;for(r[0]={s:-1,f:s.f+l.f,l:s,r:l};d!=a-1;)s=r[r[c].f<r[u].f?c++:u++],l=r[c!=d&&r[c].f<r[u].f?c++:u++],r[d++]={s:-1,f:s.f+l.f,l:s,r:l};for(var m=i[0].s,n=1;n<a;++n)i[n].s>m&&(m=i[n].s);var p=new N(m+1),h=ge(r[d-1],p,0);if(h>e){var n=0,f=0,g=h-e,w=1<<g;for(i.sort(function(C,S){return p[S.s]-p[C.s]||C.f-S.f});n<a;++n){var b=i[n].s;if(p[b]>e)f+=w-(1<<h-p[b]),p[b]=e;else break}for(f>>=g;f>0;){var A=i[n].s;p[A]<e?f-=1<<e-p[A]++-1:++n}for(;n>=0&&f;--n){var x=i[n].s;p[x]==e&&(--p[x],++f)}h=e}return{t:new z(p),l:h}},ge=function(t,e,r){return t.s==-1?Math.max(ge(t.l,e,r+1),ge(t.r,e,r+1)):e[t.s]=r},Pr=function(t){for(var e=t.length;e&&!t[--e];);for(var r=new N(++e),n=0,a=t[0],i=1,o=function(l){r[n++]=l},s=1;s<=e;++s)if(t[s]==a&&s!=e)++i;else{if(!a&&i>2){for(;i>138;i-=138)o(32754);i>2&&(o(i>10?i-11<<5|28690:i-3<<5|12305),i=0)}else if(i>3){for(o(a),--i;i>6;i-=6)o(8304);i>2&&(o(i-3<<5|8208),i=0)}for(;i--;)o(a);i=1,a=t[s]}return{c:r.subarray(0,n),n:e}},bt=function(t,e){for(var r=0,n=0;n<e.length;++n)r+=t[n]*e[n];return r},ln=function(t,e,r){var n=r.length,a=on(e+2);t[a]=n&255,t[a+1]=n>>8,t[a+2]=t[a]^255,t[a+3]=t[a+1]^255;for(var i=0;i<n;++i)t[a+i+4]=r[i];return(a+4+n)*8},zr=function(t,e,r,n,a,i,o,s,l,c,d){Y(e,d++,r),++a[256];for(var u=de(a,15),m=u.t,p=u.l,h=de(i,15),f=h.t,g=h.l,w=Pr(m),b=w.c,A=w.n,x=Pr(f),F=x.c,C=x.n,S=new N(19),y=0;y<b.length;++y)++S[b[y]&31];for(var y=0;y<F.length;++y)++S[F[y]&31];for(var v=de(S,7),D=v.t,at=v.l,U=19;U>4&&!D[Lr[U-1]];--U);var it=c+5<<3,T=bt(a,et)+bt(i,Nt)+o,_=bt(a,m)+bt(i,f)+o+14+3*U+bt(S,D)+2*S[16]+3*S[17]+7*S[18];if(l>=0&&it<=T&&it<=_)return ln(e,d,t.subarray(l,l+c));var O,I,R,W;if(Y(e,d,1+(_<T)),d+=2,_<T){O=yt(m,p,0),I=m,R=yt(f,g,0),W=f;var ae=yt(D,at,0);Y(e,d,A-257),Y(e,d+5,C-1),Y(e,d+10,U-4),d+=14;for(var y=0;y<U;++y)Y(e,d+3*y,D[Lr[y]]);d+=3*U;for(var $=[b,F],ft=0;ft<2;++ft)for(var ot=$[ft],y=0;y<ot.length;++y){var j=ot[y]&31;Y(e,d,ae[j]),d+=D[j],j>15&&(Y(e,d,ot[y]>>5&127),d+=ot[y]>>12)}}else O=mo,I=et,R=po,W=Nt;for(var y=0;y<s;++y){var P=n[y];if(P>255){var j=P>>18&31;gt(e,d,O[j+257]),d+=I[j+257],j>7&&(Y(e,d,P>>23&31),d+=Xe[j]);var st=P&31;gt(e,d,R[st]),d+=W[st],st>3&&(gt(e,d,P>>5&8191),d+=Ye[st])}else gt(e,d,O[P]),d+=I[P]}return gt(e,d,O[256]),d+I[256]},fo=new Ve([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),cn=new z(0),go=function(t,e,r,n,a,i){var o=i.z||t.length,s=new z(n+o+5*(1+Math.ceil(o/7e3))+a),l=s.subarray(n,s.length-a),c=i.l,d=(i.r||0)&7;if(e){d&&(l[0]=i.r>>3);for(var u=fo[e-1],m=u>>13,p=u&8191,h=(1<<r)-1,f=i.p||new N(32768),g=i.h||new N(h+1),w=Math.ceil(r/3),b=2*w,A=function(se){return(t[se]^t[se+1]<<w^t[se+2]<<b)&h},x=new Ve(25e3),F=new N(288),C=new N(32),S=0,y=0,v=i.i||0,D=0,at=i.w||0,U=0;v+2<o;++v){var it=A(v),T=v&32767,_=g[it];if(f[T]=_,g[it]=T,at<=v){var O=o-v;if((S>7e3||D>24576)&&(O>423||!c)){d=zr(t,l,0,x,F,C,y,D,U,v-U,d),D=S=y=0,U=v;for(var I=0;I<286;++I)F[I]=0;for(var I=0;I<30;++I)C[I]=0}var R=2,W=0,ae=p,$=T-_&32767;if(O>2&&it==A(v-$))for(var ft=Math.min(m,O)-1,ot=Math.min(32767,v),j=Math.min(258,O);$<=ot&&--ae&&T!=_;){if(t[v+R]==t[v+R-$]){for(var P=0;P<j&&t[v+P]==t[v+P-$];++P);if(P>R){if(R=P,W=$,P>ft)break;for(var st=Math.min($,P-2),kr=0,I=0;I<st;++I){var ie=v-$+I&32767,oi=f[ie],Ar=ie-oi&32767;Ar>kr&&(kr=Ar,_=ie)}}}T=_,_=f[T],$+=T-_&32767}if(W){x[D++]=268435456|he[R]<<18|Ir[W];var Mr=he[R]&31,Sr=Ir[W]&31;y+=Xe[Mr]+Ye[Sr],++F[257+Mr],++C[Sr],at=v+R,++S}else x[D++]=t[v],++F[t[v]]}}for(v=Math.max(v,at);v<o;++v)x[D++]=t[v],++F[t[v]];d=zr(t,l,c,x,F,C,y,D,U,v-U,d),c||(i.r=d&7|l[d/8|0]<<3,d-=7,i.h=g,i.p=f,i.i=v,i.w=at)}else{for(var v=i.w||0;v<o+c;v+=65535){var oe=v+65535;oe>=o&&(l[d/8|0]=c,oe=o),d=ln(l,d+1,t.subarray(v,oe))}i.i=o}return sn(s,0,n+on(d)+a)},bo=(function(){for(var t=new Int32Array(256),e=0;e<256;++e){for(var r=e,n=9;--n;)r=(r&1&&-306674912)^r>>>1;t[e]=r}return t})(),dn=function(){var t=-1;return{p:function(e){for(var r=t,n=0;n<e.length;++n)r=bo[r&255^e[n]]^r>>>8;t=r},d:function(){return~t}}},un=function(t,e,r,n,a){if(!a&&(a={l:1},e.dictionary)){var i=e.dictionary.subarray(-32768),o=new z(i.length+t.length);o.set(i),o.set(t,i.length),t=o,a.w=i.length}return go(t,e.level==null?6:e.level,e.mem==null?a.l?Math.ceil(Math.max(8,Math.min(13,Math.log(t.length)))*1.5):20:12+e.mem,r,n,a)},mn=function(t,e){var r={};for(var n in t)r[n]=t[n];for(var n in e)r[n]=e[n];return r},B=function(t,e,r){for(;r;++e)t[e]=r,r>>>=8},wo=function(t,e){var r=e.filename;if(t[0]=31,t[1]=139,t[2]=8,t[8]=e.level<2?4:e.level==9?2:0,t[9]=3,e.mtime!=0&&B(t,4,Math.floor(new Date(e.mtime||Date.now())/1e3)),r){t[3]=8;for(var n=0;n<=r.length;++n)t[n+10]=r.charCodeAt(n)}},xo=function(t){return 10+(t.filename?t.filename.length+1:0)};function yo(t,e){return un(t,e||{},0,0)}function vo(t,e){e||(e={});var r=dn(),n=t.length;r.p(t);var a=un(t,e,xo(e),8),i=a.length;return wo(a,e),B(a,i-8,r.d()),B(a,i-4,n),a}var pn=function(t,e,r,n){for(var a in t){var i=t[a],o=e+a,s=n;Array.isArray(i)&&(s=mn(n,i[1]),i=i[0]),i instanceof z?r[o]=[i,s]:(r[o+="/"]=[new z(0),s],pn(i,o,r,n))}},Dr=typeof TextEncoder<"u"&&new TextEncoder,ko=typeof TextDecoder<"u"&&new TextDecoder,Ao=0;try{ko.decode(cn,{stream:!0}),Ao=1}catch{}function dt(t,e){var r;if(Dr)return Dr.encode(t);for(var n=t.length,a=new z(t.length+(t.length>>1)),i=0,o=function(d){a[i++]=d},r=0;r<n;++r){if(i+5>a.length){var s=new z(i+8+(n-r<<1));s.set(a),a=s}var l=t.charCodeAt(r);l<128||e?o(l):l<2048?(o(192|l>>6),o(128|l&63)):l>55295&&l<57344?(l=65536+(l&1047552)|t.charCodeAt(++r)&1023,o(240|l>>18),o(128|l>>12&63),o(128|l>>6&63),o(128|l&63)):(o(224|l>>12),o(128|l>>6&63),o(128|l&63))}return sn(a,0,i)}var be=function(t){var e=0;if(t)for(var r in t){var n=t[r].length;n>65535&&jt(9),e+=n+4}return e},Ur=function(t,e,r,n,a,i,o,s){var l=n.length,c=r.extra,d=s&&s.length,u=be(c);B(t,e,o!=null?33639248:67324752),e+=4,o!=null&&(t[e++]=20,t[e++]=r.os),t[e]=20,e+=2,t[e++]=r.flag<<1|(i<0&&8),t[e++]=a&&8,t[e++]=r.compression&255,t[e++]=r.compression>>8;var m=new Date(r.mtime==null?Date.now():r.mtime),p=m.getFullYear()-1980;if((p<0||p>119)&&jt(10),B(t,e,p<<25|m.getMonth()+1<<21|m.getDate()<<16|m.getHours()<<11|m.getMinutes()<<5|m.getSeconds()>>1),e+=4,i!=-1&&(B(t,e,r.crc),B(t,e+4,i<0?-i-2:i),B(t,e+8,r.size)),B(t,e+12,l),B(t,e+14,u),e+=16,o!=null&&(B(t,e,d),B(t,e+6,r.attrs),B(t,e+10,o),e+=14),t.set(n,e),e+=l,u)for(var h in c){var f=c[h],g=f.length;B(t,e,+h),B(t,e+2,g),t.set(f,e+4),e+=4+g}return d&&(t.set(s,e),e+=d),e},Mo=function(t,e,r,n,a){B(t,e,101010256),B(t,e+8,r),B(t,e+10,r),B(t,e+12,n),B(t,e+16,a)};function So(t,e){e||(e={});var r={},n=[];pn(t,"",r,e);var a=0,i=0;for(var o in r){var s=r[o],l=s[0],c=s[1],d=c.level==0?0:8,u=dt(o),m=u.length,p=c.comment,h=p&&dt(p),f=h&&h.length,g=be(c.extra);m>65535&&jt(11);var w=d?yo(l,c):l,b=w.length,A=dn();A.p(l),n.push(mn(c,{size:l.length,crc:A.d(),c:w,f:u,m:h,u:m!=o.length||h&&p.length!=f,o:a,compression:d})),a+=30+m+g+b,i+=76+2*(m+g)+(f||0)+b}for(var x=new z(i+22),F=a,C=i-a,S=0;S<n.length;++S){var u=n[S];Ur(x,u.o,u,u.f,u.u,u.c.length);var y=30+u.f.length+be(u.extra);x.set(u.c,u.o+y),Ur(x,a,u,u.f,u.u,u.c.length,u.o,u.m),a+=16+y+(u.m?u.m.length:0)}return Mo(x,a,n.length,C,F),x}class Vt{constructor(){this.chunks=[],this.length=0}writeU8(e){const r=new Uint8Array(1);r[0]=e&255,this.chunks.push(r),this.length+=1}writeU32(e){const r=new Uint8Array(4);new DataView(r.buffer).setUint32(0,e>>>0,!0),this.chunks.push(r),this.length+=4}writeI32(e){const r=new Uint8Array(4);new DataView(r.buffer).setInt32(0,e|0,!0),this.chunks.push(r),this.length+=4}writeF32(e){const r=new Uint8Array(4);new DataView(r.buffer).setFloat32(0,e,!0),this.chunks.push(r),this.length+=4}writeF64(e){const r=new Uint8Array(8);new DataView(r.buffer).setFloat64(0,e,!0),this.chunks.push(r),this.length+=8}writeBytes(e){this.chunks.push(e),this.length+=e.length}writeString(e){const r=dt(e);this.writeU32(r.length),this.writeBytes(r)}writeJson(e){this.writeString(JSON.stringify(e))}writeFloat32Array(e){this.alignTo(4);const r=new Uint8Array(e.buffer,e.byteOffset,e.byteLength);this.writeU32(r.length),this.writeBytes(r)}writeUint32Array(e){this.alignTo(4);const r=new Uint8Array(e.buffer,e.byteOffset,e.byteLength);this.writeU32(r.length),this.writeBytes(r)}alignTo(e){const r=this.length%e;if(r===0)return;const n=e-r;for(let a=0;a<n;a++)this.writeU8(0)}toUint8Array(){const e=new Uint8Array(this.length);let r=0;for(const n of this.chunks)e.set(n,r),r+=n.length;return e}}const H=4,Ge="gzip";function ut(t){return{bytes:vo(t),compression:Ge}}async function We(t){if(typeof CompressionStream>"u")return ut(t);try{const e=new Uint8Array(t.byteLength);e.set(t);const r=new Blob([e]).stream().pipeThrough(new CompressionStream("gzip"));return{bytes:new Uint8Array(await new Response(r).arrayBuffer()),compression:Ge}}catch{return ut(t)}}const Tt="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%()*+,-.;=?@[]^_{|}~",we=new Int16Array(128).fill(-1);for(let t=0;t<Tt.length;t++)we[Tt.charCodeAt(t)]=t;function Bt(t,e){return e==="base85"?fn(t):Fo(t)}function hn(t,e){const r=t.length>0&&(t.charCodeAt(0)<=32||t.charCodeAt(t.length-1)<=32)?t.trim():t;return e==="base85"?gn(r):Bo(r)}function fn(t){const e=t.length;if(e===0)return"";const r=(4-e%4)%4,n=e+r,a=[];for(let o=0;o<n;o+=4){const s=t[o]??0,l=o+1<e?t[o+1]:0,c=o+2<e?t[o+2]:0,d=o+3<e?t[o+3]:0;let u=(s<<24>>>0)+(l<<16)+(c<<8)+d;const m=new Array(5);for(let p=4;p>=0;p--)m[p]=u%85,u=u/85|0;for(let p=0;p<5;p++)a.push(Tt[m[p]])}const i=Math.ceil(e*5/4);return a.slice(0,i).join("")}function gn(t){const e=t.replace(/\s+/g,""),r=e.length;if(r===0)return new Uint8Array(0);const n=Math.floor(r*4/5),a=(5-r%5)%5,i=r+a,o=new Uint8Array(i/5*4),s=Tt.length-1;let l=0;for(let c=0;c<i;c+=5){let d=0;for(let u=0;u<5;u++){const m=c+u<r?Co(e.charCodeAt(c+u)):s;d=d*85+m}o[l++]=d>>>24&255,o[l++]=d>>>16&255,o[l++]=d>>>8&255,o[l++]=d&255}return o.subarray(0,n)}function Co(t){if(t<0||t>=we.length)throw new Error("Invalid base85 character");const e=we[t];if(e<0)throw new Error("Invalid base85 character");return e}function Fo(t){let e="";for(let r=0;r<t.length;r++)e+=String.fromCharCode(t[r]);return btoa(e)}function Bo(t){const e=atob(t),r=new Uint8Array(e.length);for(let n=0;n<e.length;n++)r[n]=e.charCodeAt(n);return r}const xe=1,ye=2,ve=4,ke=8,Ae=16,bn=32,Me=1,Se=2,Ce=4,Fe=8,Be=16,wn=32,Ee=64,Le=128;function Xt(t){let e=256+t.positions.byteLength;return t.indices&&(e+=t.indices.byteLength),t.lineDistances&&(e+=t.lineDistances.byteLength),t.linePattern&&(e+=64+t.linePattern.pattern.length*8),e}function Yt(t){let e=256+t.positions.byteLength;return t.indices&&(e+=t.indices.byteLength),t.gradientPositions&&(e+=t.gradientPositions.byteLength),t.uvs&&(e+=t.uvs.byteLength),t.texture&&(e+=t.texture.bytes.byteLength+64),t.hatchPattern&&(e+=128),t.gradientFill&&(e+=64),e}function Ke(t,e){t.writeString(e.layer),t.writeU32(e.color>>>0),t.writeF64(e.offset[0]),t.writeF64(e.offset[1]),t.writeF64(e.offset[2]),t.writeFloat32Array(e.positions);let r=0;e.indices&&e.indices.length>0&&(r|=xe),e.linePattern&&(r|=ye),e.lineDistances&&e.lineDistances.length>0&&(r|=ve),e.lineWidth!=null&&e.lineWidth>0&&(r|=ke),e.renderOrder!=null&&e.renderOrder!==0&&(r|=Ae),e.excludeFromOsnap&&(r|=bn),t.writeU8(r),r&xe&&t.writeUint32Array(e.indices),r&ye&&t.writeJson(e.linePattern),r&ve&&t.writeFloat32Array(e.lineDistances),r&ke&&t.writeF32(e.lineWidth),r&Ae&&t.writeI32(e.renderOrder)}function Je(t,e){t.writeString(e.layer),t.writeU32(e.color>>>0),t.writeF64(e.offset[0]),t.writeF64(e.offset[1]),t.writeF64(e.offset[2]),t.writeFloat32Array(e.positions);let r=0;e.indices&&e.indices.length>0&&(r|=Me),e.hatchPattern&&(r|=Se),e.gradientFill&&(r|=Ce),e.gradientPositions&&e.gradientPositions.length>0&&(r|=Fe),e.side!=null&&(r|=Be),e.points&&(r|=wn),e.renderOrder!=null&&e.renderOrder!==0&&(r|=Ee),e.texture&&e.texture.bytes.length>0&&e.uvs&&e.uvs.length>=2&&(r|=Le),t.writeU8(r),r&Me&&t.writeUint32Array(e.indices),r&Se&&t.writeJson(e.hatchPattern),r&Ce&&t.writeJson(e.gradientFill),r&Fe&&t.writeFloat32Array(e.gradientPositions),r&Be&&t.writeU8(e.side),r&Ee&&t.writeI32(e.renderOrder),r&Le&&(t.writeFloat32Array(e.uvs),t.writeString(e.texture.mimeType||"image/png"),t.writeU32(e.texture.bytes.byteLength),t.writeBytes(e.texture.bytes))}const xn=1329939265,yn=1,Eo=1,Lo=2,Io=3,Po=4,zo=5,Do=6,Uo=7;function Ze(t){var e;switch(t.kind){case"line":return 37;case"circle":return 30;case"arc":return 46;case"ellipse":return 71;case"point":return 21;case"path":return 10+t.vertices.length*8;case"spline":return 10+(t.controlPoints.length+t.knots.length+t.weights.length+(((e=t.fitPoints)==null?void 0:e.length)??0))*8+16;default:return t}}function vn(t,e){if(t.length===0)return[];const r=[];let n=[],a=64;const i=()=>{n.length!==0&&(r.push(n),n=[],a=64)};for(const o of t){const s=Ze(o);n.length>0&&a+s>e&&i(),n.push(o),a+=s}return i(),r}function ht(t){const e=new Vt;e.writeU32(xn),e.writeU8(yn),e.writeU8(0),e.writeU8(0),e.writeU8(0);const r=[],n=new Map,a=i=>{const o=n.get(i);if(o!=null)return o;const s=r.length;return r.push(i),n.set(i,s),s};for(const i of t.primitives)a(i.layer);e.writeU32(r.length);for(const i of r)e.writeString(i);e.writeU32(t.primitives.length);for(const i of t.primitives)To(e,i,a(i.layer));return e.toUint8Array()}function kn(t){const e=ht(t),r=ut(e).bytes;return{uncompressed:e,compressed:r}}async function No(t){const e=ht(t),r=(await We(e)).bytes;return{uncompressed:e,compressed:r}}function ue(t,e){t.writeU8(e<0?0:1)}function wt(t,e){t.writeU32(e.length);for(const r of e)t.writeF64(r)}function To(t,e,r){switch(e.kind){case"line":t.writeU8(Eo),t.writeU32(r),t.writeF64(e.x0),t.writeF64(e.y0),t.writeF64(e.x1),t.writeF64(e.y1);return;case"circle":t.writeU8(Lo),t.writeU32(r),t.writeF64(e.cx),t.writeF64(e.cy),t.writeF64(e.r),ue(t,e.normalSign);return;case"arc":t.writeU8(Io),t.writeU32(r),t.writeF64(e.cx),t.writeF64(e.cy),t.writeF64(e.r),t.writeF64(e.startAngle),t.writeF64(e.endAngle),ue(t,e.normalSign);return;case"ellipse":t.writeU8(Po),t.writeU32(r),t.writeF64(e.cx),t.writeF64(e.cy),t.writeF64(e.majorX),t.writeF64(e.majorY),t.writeF64(e.majorR),t.writeF64(e.minorR),t.writeF64(e.startAngle),t.writeF64(e.endAngle),t.writeU8(e.closed?1:0),ue(t,e.normalSign??1);return;case"spline":t.writeU8(zo),t.writeU32(r),wt(t,e.controlPoints),t.writeU32(e.degree),wt(t,e.knots),wt(t,e.weights),t.writeU8(e.closed?1:0),wt(t,e.fitPoints??[]);return;case"point":t.writeU8(Do),t.writeU32(r),t.writeF64(e.x),t.writeF64(e.y);return;case"path":t.writeU8(Uo),t.writeU32(r),t.writeU8(e.closed?1:0),wt(t,e.vertices);return;default:{const n=e;throw new Error(`Unsupported osnap primitive: ${String(n)}`)}}}const _o=1480934209;function An(t){if(t.version!==H)throw new Error(`Unsupported snapshot version: ${t.version}`);const e=new Vt;e.writeU32(_o),e.writeU8(H),e.writeU8(0),e.writeU8(0),e.writeU8(0),e.writeJson(Ro(t)),e.writeJson(t.layers),e.writeString(t.activeLayoutBtrId),e.writeU32(t.layouts.length);for(const r of t.layouts)Ho(e,r);return e.toUint8Array()}function Ro(t){const e={...t.meta.savedViews??{}};for(const r of t.layouts)r.savedView&&(e[r.btrId]=r.savedView);if(Object.keys(e).length===0){if(t.meta.savedViews==null)return t.meta;const{savedViews:r,...n}=t.meta;return n}return{...t.meta,savedViews:e}}function Ho(t,e){t.writeString(e.btrId),t.writeString(e.name),t.writeU8(e.isModelSpace?1:0),Oo(t,e.osnap),t.writeJson(e.viewports??null),t.writeU32(e.lineBatches.length);for(const r of e.lineBatches)Ke(t,r);t.writeU32(e.meshBatches.length);for(const r of e.meshBatches)Je(t,r)}function Oo(t,e){if(!e||e.primitives.length===0){t.writeU32(0);return}const r=ht(e);t.writeU32(r.length),t.writeBytes(r)}const $o="application/vnd.mlightcad.acex-snapshot+binary";function qe(t){if(t.version!==H)throw new Error(`Unsupported snapshot version: ${t.version}`);const e=An(t),r=ut(e);return{payload:Bt(r.bytes,"base85"),compression:r.compression}}function Mn(){return $o}function q(t,e,r){if(r<=0)return new Float32Array(0);if(t instanceof Float32Array)return t.subarray(e,e+r).slice();const n=new Float32Array(r);for(let a=0;a<r;a++)n[a]=t[e+a];return n}function Sn(t,e,r){if(r<=0)return new Uint32Array(0);const n=new Uint32Array(r);for(let a=0;a<r;a++)n[a]=t[e+a];return n}function Qe(t,e){if(e.length===0)return{positions:t,indices:e};let r=0;for(let a=0;a<e.length;a++){const i=e[a];i>r&&(r=i)}const n=(r+1)*3;return n>=t.length?{positions:t,indices:e}:{positions:q(t,0,n),indices:e}}function Ie(t,e){return t+e}const lt={x:0,y:0,z:0};function Cn(t){t.updateMatrixWorld(!0);const e=t.matrixWorld.elements;return lt.x=e[12],lt.y=e[13],lt.z=e[14],[lt.x,lt.y,lt.z]}function Gt(t,e){const r=e.elements,n=t.positions;if(n.length===0)return{positions:new Float32Array(0),indices:t.indices};const a=new Float32Array(n.length);for(let i=0;i<n.length;i+=3){const o=n[i],s=n[i+1],l=n[i+2];a[i]=r[0]*o+r[4]*s+r[8]*l+r[12],a[i+1]=r[1]*o+r[5]*s+r[9]*l+r[13],a[i+2]=r[2]*o+r[6]*s+r[10]*l+r[14]}return{positions:a,indices:t.indices?new Uint32Array(t.indices):void 0}}function Nr(t,e){const r=e*3;return Number.isFinite(t[r])&&Number.isFinite(t[r+1])&&Number.isFinite(t[r+2])}function rt(t,e){const r=t.positions,n=r.length/3|0;if(n===0||e<=0)return t;let a=!1;for(let s=0;s<r.length;s++)if(!Number.isFinite(r[s])){a=!0;break}if(!a)return t;const i=t.indices;if(i&&i.length>0){const s=[];for(let u=0;u+e<=i.length;u+=e){let m=!0;for(let p=0;p<e;p++){const h=i[u+p];if(h<0||h>=n||!Nr(r,h)){m=!1;break}}if(m)for(let p=0;p<e;p++)s.push(i[u+p])}if(s.length===0)return{positions:new Float32Array(0)};const l=new Int32Array(n);l.fill(-1);const c=[],d=new Uint32Array(s.length);for(let u=0;u<s.length;u++){const m=s[u];let p=l[m];if(p<0){p=c.length/3,l[m]=p;const h=m*3;c.push(r[h],r[h+1],r[h+2])}d[u]=p}return{positions:Float32Array.from(c),indices:d}}const o=[];for(let s=0;s+e<=n;s+=e){let l=!0;for(let c=0;c<e;c++)if(!Nr(r,s+c)){l=!1;break}if(l)for(let c=0;c<e;c++){const d=(s+c)*3;o.push(r[d],r[d+1],r[d+2])}}return o.length===0?{positions:new Float32Array(0)}:{positions:Float32Array.from(o)}}function Wt(t){const e=t.positions;if(e.length<3)return{slice:t,offset:[0,0,0]};let r=1/0,n=1/0,a=1/0,i=-1/0,o=-1/0,s=-1/0,l=0;for(let u=0;u<e.length;u+=3){const m=e[u],p=e[u+1],h=e[u+2];!Number.isFinite(m)||!Number.isFinite(p)||!Number.isFinite(h)||(l++,r=Math.min(r,m),n=Math.min(n,p),a=Math.min(a,h),i=Math.max(i,m),o=Math.max(o,p),s=Math.max(s,h))}if(l===0)return{slice:{positions:new Float32Array(0)},offset:[0,0,0]};const c=[(r+i)/2,(n+o)/2,(a+s)/2],d=new Float32Array(e.length);for(let u=0;u<e.length;u+=3){const m=e[u],p=e[u+1],h=e[u+2];if(!Number.isFinite(m)||!Number.isFinite(p)||!Number.isFinite(h)){d[u]=0,d[u+1]=0,d[u+2]=0;continue}d[u]=m-c[0],d[u+1]=p-c[1],d[u+2]=h-c[2]}return{slice:{positions:d,indices:t.indices?new Uint32Array(t.indices):void 0},offset:c}}function Fn(t,e,r={}){t.updateMatrixWorld(!0);const n=Gt(e,t.matrixWorld);return Wt(n)}function Bn(t){const e=t.image;if(!e||typeof document>"u")return;const r=document.createElement("canvas"),n=r.getContext("2d");if(!n)return;try{if(e instanceof ImageData)r.width=e.width,r.height=e.height,n.putImageData(e,0,0);else if(Vo(e)){r.width=e.width,r.height=e.height;const l=Yo(e.data,e.width*e.height),c=new ImageData(new Uint8ClampedArray(l),e.width,e.height);n.putImageData(c,0,0)}else if(jo(e)){const l=Xo(e);if(!l)return;r.width=l.width,r.height=l.height,n.drawImage(e,0,0)}else return}catch{return}const a=r.toDataURL("image/png"),i=a.indexOf(",");if(i<0)return;const o=atob(a.slice(i+1)),s=new Uint8Array(o.length);for(let l=0;l<o.length;l++)s[l]=o.charCodeAt(l);return{mimeType:"image/png",bytes:s}}function jo(t){return t instanceof HTMLImageElement||t instanceof HTMLCanvasElement||typeof OffscreenCanvas<"u"&&t instanceof OffscreenCanvas||typeof ImageBitmap<"u"&&t instanceof ImageBitmap||typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement}function Vo(t){if(!t||typeof t!="object")return!1;const e=t;return e.data!=null&&typeof e.width=="number"&&typeof e.height=="number"&&e.width>=1&&e.height>=1}function Xo(t){let e=Number(t.width),r=Number(t.height);if(t instanceof HTMLImageElement?(e=t.naturalWidth||t.width,r=t.naturalHeight||t.height):typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement&&(e=t.videoWidth||t.width,r=t.videoHeight||t.height),!(!Number.isFinite(e)||!Number.isFinite(r)||e<1||r<1))return{width:e,height:r}}function Yo(t,e){const r=e*4;if(t instanceof Uint8ClampedArray&&t.length>=r)return t.length===r?t:t.subarray(0,r);const n=new Uint8ClampedArray(r),a=Math.min(r,t.length);for(let i=0;i<a;i++)n[i]=t[i];if(t.length>=e*3&&t.length<r)for(let i=e-1;i>=0;i--){const o=i*3,s=i*4;n[s]=t[o],n[s+1]=t[o+1],n[s+2]=t[o+2],n[s+3]=255}return n}function En(t,e){const r=t.getAttribute("uv");if(!r||r.count===0||r.itemSize<2)return;const n=Math.floor(e.length/3)*2;if(n<=0)return;const a=r.array;if(!(r.count*r.itemSize<n))return q(a,0,n)}function tr(t){const e=t;return e.map?!1:e.transparent===!0&&typeof e.opacity=="number"&&e.opacity<.01}function er(t){const e=t;if(e.isShaderMaterial===!0||t.type==="ShaderMaterial")return e}function Ln(t){var e;const r=er(t);if(!r)return;const n=r.uniforms.pattern,a=r.uniforms.patternLength;if(!n||!a)return;const i=n.value;if(!(!Array.isArray(i)||i.length===0))return{pattern:[...i],patternLength:Number(a.value),viewportScale:Number(((e=r.uniforms.u_viewportScale)==null?void 0:e.value)??1)}}function In(t){var e;const r=er(t);if(!r)return;const n=r.uniforms.u_patternLines;if(!n)return;const a=n.value;if(!(!Array.isArray(a)||a.length===0))return{patternAngle:Number(((e=r.uniforms.u_patternAngle)==null?void 0:e.value)??0),patternLines:a.map(Go)}}function Pn(t){var e,r,n,a,i;const o=er(t);if(!o||o.uniforms.u_patternLines)return;const s=(e=o.uniforms.u_startColor)==null?void 0:e.value,l=(r=o.uniforms.u_endColor)==null?void 0:r.value,c=o.uniforms.u_gradientType;if(!(!(s!=null&&s.getHex)||c==null))return{startColor:s.getHex(),endColor:((n=l==null?void 0:l.getHex)==null?void 0:n.call(l))??s.getHex(),angle:Number(((a=o.uniforms.u_angle)==null?void 0:a.value)??0),shift:Number(((i=o.uniforms.u_shift)==null?void 0:i.value)??0),gradientType:Number(c.value)}}function Go(t){return{angle:t.angle,base:[t.base.x,t.base.y],offset:[t.offset.x,t.offset.y],dashLengths:[...t.dashLengths],patternLength:t.patternLength}}function Kt(t){const e=t.length/3;if(e<2)return new Float32Array(0);const r=new Float32Array(e);for(let n=0;n<e;n+=2){n===0?r[n]=0:r[n]=r[n-1];const a=t[n*3],i=t[n*3+1],o=t[n*3+2]??0,s=t[(n+1)*3],l=t[(n+1)*3+1],c=t[(n+1)*3+2]??0,d=s-a,u=l-i,m=c-o;r[n+1]=r[n]+Math.sqrt(d*d+u*u+m*m)}return r}function zn(t,e){const r=t.getAttribute(e);if(!r||r.count===0)return;const n=r.itemSize;if(t.getIndex()){const d=r.array;return q(d,0,r.count*n)}const a=t.drawRange,i=r.count,o=Math.max(0,Math.min(Math.floor(a.start),i)),s=Math.max(0,i-o),l=!Number.isFinite(a.count)||a.count<=0?s:Math.min(Math.floor(a.count),s);if(l<=0)return;const c=r.array;return q(c,o*n,l*n)}function Pe(t,e){const r=e[0],n=e[1],a=e[4],i=e[5],o=e[12],s=e[13],l=Math.atan2(n,r),c=(m,p)=>[r*m+a*p+o,n*m+i*p+s],d=(m,p)=>[r*m+a*p,n*m+i*p],u=(m,p,h)=>{const f=Math.cos(h),g=Math.sin(h);return[f*m-g*p,g*m+f*p]};return{patternAngle:t.patternAngle,patternLines:t.patternLines.map(m=>{const p=m.angle+t.patternAngle,h=m.angle+l,f=h+t.patternAngle,[g,w]=d(Math.cos(p),Math.sin(p)),b=Math.hypot(g,w),[A,x]=u(m.offset[0],m.offset[1],p),[F,C]=d(A,x),S=u(F,C,-f);return{angle:h,base:c(m.base[0],m.base[1]),offset:S,dashLengths:m.dashLengths.map(y=>y*b),patternLength:m.patternLength*b}})}}function Dn(t,e){return{patternAngle:t.patternAngle,patternLines:t.patternLines.map(r=>{const n=new Br(r.base[0]-e[0],r.base[1]-e[1]),a=new Br(r.offset[0],r.offset[1]);return pi(n,a,r.angle,t.patternAngle,r.patternLength),{angle:r.angle,base:[n.x,n.y],offset:[r.offset[0],r.offset[1]],dashLengths:[...r.dashLengths],patternLength:r.patternLength}})}}function ze(t,e){return!Number.isFinite(t)||t<0?0:Math.min(Math.floor(t),e)}function De(t,e,r){const n=Math.max(0,e-r);return!Number.isFinite(t)||t<=0?n:Math.min(Math.floor(t),n)}function At(t){const e=t.getAttribute("position");if(!e)return{positions:new Float32Array(0)};const r=t.drawRange,n=e.array,a=e.itemSize,i=t.getIndex();if(i){const l=q(n,0,e.count*a),c=i.array,d=ze(r.start,i.count),u=De(r.count,i.count,d),m=Sn(c,d,u);return Qe(l,m)}const o=ze(r.start,e.count),s=De(r.count,e.count,o);return{positions:q(n,o*a,s*a)}}function _t(t){return hi(t.flags)&&fi(t.flags)}function Un(t){const{count:e}=t.mappingStats;for(let r=0;r<e;r++){let n;try{n=t.getGeometryRangeAt(r)}catch{continue}if(_t(n)&&n.bboxIntersectionCheck)return!0}return!1}function Ue(t){return qr(t).bboxIntersectionCheck===!0}function Jt(t,e){const r=e.getAttribute("position");if(!r)return{positions:new Float32Array(0)};const n=r.itemSize,a=r.array,i=e.getIndex(),{count:o}=t.mappingStats;if(i){const u=q(a,0,r.count*n),m=i.array;let p=0;const h=[];for(let w=0;w<o;w++){let b;try{b=t.getGeometryRangeAt(w)}catch{continue}const A=b.indexStart??0,x=b.indexCount??0;!_t(b)||x<=0||(h.push({start:A,count:x}),p+=x)}if(p===0)return{positions:new Float32Array(0)};const f=new Uint32Array(p);let g=0;for(const w of h)for(let b=0;b<w.count;b++)f[g++]=m[w.start+b];return Qe(u,f)}let s=0;const l=[];for(let u=0;u<o;u++){let m;try{m=t.getGeometryRangeAt(u)}catch{continue}if(!_t(m)||m.vertexCount<=0)continue;const p=m.vertexCount*n;l.push({start:m.vertexStart*n,floatCount:p}),s+=p}if(s===0)return{positions:new Float32Array(0)};const c=new Float32Array(s);let d=0;if(a instanceof Float32Array)for(const u of l)c.set(a.subarray(u.start,u.start+u.floatCount),d),d+=u.floatCount;else for(const u of l)for(let m=0;m<u.floatCount;m++)c[d++]=a[u.start+m];return{positions:c}}function Tr(t,e,r){t.push(e.getX(r),e.getY(r),e.getZ(r))}function Nn(t,e){const r=e.getAttribute("instanceStart"),n=e.getAttribute("instanceEnd");if(!r||!n)return{positions:new Float32Array(0)};const{count:a}=t.mappingStats,i=[];for(let o=0;o<a;o++){let s;try{s=t.getGeometryRangeAt(o)}catch{continue}if(!_t(s)||s.vertexCount<=0)continue;const l=s.vertexStart,c=l+s.vertexCount;for(let d=l;d<c;d++)Tr(i,r,d),Tr(i,n,d)}return{positions:new Float32Array(i)}}function Wo(t,e){const r=t.instanceCount;if(Number.isFinite(r)&&r>=0)return Math.min(Math.floor(r),e);const n=t.drawRange,a=ze(n.start,e);return De(n.count,e,a)}function Ko(t){const e=t.getAttribute("instanceStart"),r=t.getAttribute("instanceEnd");if(!e||!r||e.count===0)return{positions:new Float32Array(0)};const n=Wo(t,e.count);if(n<=0)return{positions:new Float32Array(0)};const a=[];for(let i=0;i<n;i++){const o=[e.getX(i),e.getY(i),e.getZ(i)],s=[r.getX(i),r.getY(i),r.getZ(i)];!o.every(Number.isFinite)||!s.every(Number.isFinite)||a.push(o[0],o[1],o[2],s[0],s[1],s[2])}return{positions:new Float32Array(a)}}function Dt(t){return mi(t)}function Tn(t){if(t instanceof yi)return t.linewidth}function vt(t){if("material"in t){const e=t.userData.originalMaterial??t.material;return Array.isArray(e)?e[0]:e}return t.material}function nt(t){var e;const r=Qr(t),n=r.layer??"0",a=t;let i=a.color!=null?a.color.getHex():r.color??16777215;const o=Ln(t),s=In(t),l=Pn(t);if(t instanceof xi||t.type==="ShaderMaterial"){const c=(e=t.uniforms.u_color)==null?void 0:e.value;c!=null&&c.getHex?i=c.getHex():l&&(i=l.startColor)}return{color:i,layer:n,linePattern:o,hatchPattern:s,gradientFill:l,side:s||l?t.side:void 0}}function Jo(t,e){const r=Qr(e).drawOrder??t.renderOrder;return r===0?void 0:r}function mt(t,e,r){const n=Jo(e,r);n!=null&&(t.renderOrder=n)}function Zo(t,e){if(!e)return;const r=t.userData.bakedWorldMatrix;return r&&r.length>=16?Pe(e,r):(t.updateMatrixWorld(!0),Pe(e,Array.from(t.matrixWorld.elements)))}function Zt(t){return Cn(t)}function me(t,e,r={}){const n=Fn(t,e,r);return{...n.slice,offset:n.offset}}function qo(t){if(t.indices&&t.indices.length>=3)return t;const e=t.positions.length/3|0;if(e<3||e%3!==0)return t;const r=new Uint32Array(e);for(let n=0;n<e;n++)r[n]=n;return{...t,indices:r}}function Mt(t,e,r,n,a,i=!1){i&&(n=qo(n));const o=nt(e),s=Zo(r,o.hatchPattern),l=s?Dn(s,a):void 0,c=o.gradientFill?zn(t,"gradientPosition"):void 0,d={layer:o.layer,color:o.color,offset:a,hatchPattern:l,gradientFill:o.gradientFill,gradientPositions:c,side:o.side,...n},u=e;if(u.map){const m=Bn(u.map),p=En(t,n.positions);if(!m||!p)return;d.texture=m,d.uvs=p,d.color=16777215,d.side=vi}return mt(d,r,e),d}function Qo(t){const e=Nn(t,t.geometry);if(e.positions.length===0)return;const{color:r,layer:n}=nt(t.material),a=Tn(t.material),i={layer:n,color:r,offset:Zt(t),lineWidth:a,...e};return Un(t)&&(i.excludeFromOsnap=!0),mt(i,t,t.material),i}function ts(t){const e=Jt(t,t.geometry);if(e.positions.length===0)return;const{color:r,layer:n,linePattern:a}=nt(t.material),i=a?Kt(e.positions):void 0,o={layer:n,color:r,offset:Zt(t),linePattern:a,lineDistances:i,...e};return Un(t)&&(o.excludeFromOsnap=!0),mt(o,t,t.material),o}function es(t){const e=Jt(t,t.geometry);if(e.positions.length!==0)return Mt(t.geometry,t.material,t,e,Zt(t),!0)}function rs(t){const e=Jt(t,t.geometry);if(e.positions.length===0)return;const r=Mt(t.geometry,t.material,t,e,Zt(t));if(r)return{points:!0,...r}}const Z=new pt,Rt=new pt,xt=new ki;xt.matrixAutoUpdate=!1;function ns(t){const e=t;return e.isInstancedMesh===!0&&e.instanceMatrix!=null&&typeof e.count=="number"&&e.geometry!=null}function as(t){return t.renderOrder<1e4||t.isInstancedMesh===!0?!1:qr(t).sharesTemplateGeometry===!0}function Ne(t){const e=t.elements;for(let i=0;i<16;i++)if(!Number.isFinite(e[i]))return!1;const r=Math.hypot(e[0],e[1],e[2]),n=Math.hypot(e[4],e[5],e[6]),a=Math.hypot(e[8],e[9],e[10]);return r+n+a>=1e-8}function _n(t,e){var r;const n=rt(At(t.geometry),e),a=n.positions.length;if(a===0)return;t.updateMatrixWorld(!0);const i=t.instanceMatrix.array,o=((r=n.indices)==null?void 0:r.length)??0;let s=0;for(let p=0;p<t.count;p++)Z.fromArray(i,p*16),Ne(Z)&&s++;if(s===0)return;const l=new Float32Array(s*a),c=n.indices!=null?new Uint32Array(s*o):void 0,d=a/3;let u=0;for(let p=0;p<t.count;p++){if(Z.fromArray(i,p*16),!Ne(Z))continue;Rt.multiplyMatrices(t.matrixWorld,Z);const h=Gt(n,Rt);if(l.set(h.positions,u*a),c&&h.indices){const f=u*d;for(let g=0;g<h.indices.length;g++)c[u*o+g]=h.indices[g]+f}u++}const m=Wt(rt({positions:l,indices:c},e));if(m.slice.positions.length!==0)return{slice:m.slice,offset:m.offset}}function is(t){const e=nt(t),r=t;return!!(e.hatchPattern||e.gradientFill||r.map)}function os(t,e){t.updateMatrixWorld(!0);const r=t.instanceMatrix.array;for(let n=0;n<t.count;n++)Z.fromArray(r,n*16),Ne(Z)&&(Rt.multiplyMatrices(t.matrixWorld,Z),e(Rt))}function ss(t,e){const r=_n(t,2);if(!r)return;const n=vt(t),{color:a,layer:i,linePattern:o}=nt(n),s=o?Kt(r.slice.positions):void 0,l={layer:i,color:a,offset:r.offset,linePattern:o,lineDistances:s,...r.slice};Ue(t)&&(l.excludeFromOsnap=!0),mt(l,t,n),e.push(l)}function _r(t,e,r){const n=vt(t);if(!r&&tr(n))return;if(!r&&is(n)){const o=rt(At(t.geometry),3);if(o.positions.length===0)return;os(t,s=>{const l=rt(Gt(o,s),3);if(l.positions.length===0)return;const c=Wt(l);xt.matrix.copy(s),xt.matrixWorld.copy(s),xt.matrixWorldNeedsUpdate=!1;const d=Mt(t.geometry,n,xt,c.slice,c.offset,!0);d&&e.push(d)});return}const a=_n(t,r?1:3);if(!a)return;const i=Mt(t.geometry,n,t,a.slice,a.offset,!r);i&&e.push(r?{...i,points:!0}:i)}function Ut(t){const e=t;return t instanceof bi||e.isLineSegments2===!0||t.type==="LineSegments2"}function Rr(t){const e=t;return t instanceof gi||e.isLineSegments===!0||t.type==="LineSegments"}function Hr(t){const e=t;return t instanceof wi||e.isMesh===!0||e.isInstancedMesh===!0||t.type==="Mesh"}function Rn(t){const e=[],r=[];return t.traverse(n=>{if(!(si(n)||li(n)||as(n))){if(ns(n)){if(!Dt(n))return;n.isPoints===!0?_r(n,r,!0):Rr(n)&&!Ut(n)?ss(n,e):Hr(n)&&!Ut(n)&&_r(n,r,!1);return}if(n instanceof Cr){const a=ts(n);a&&e.push(a);return}if(n instanceof ci){const a=Qo(n);a&&e.push(a);return}if(n instanceof Fr){const a=es(n);a&&r.push(a);return}if(n instanceof di){const a=rs(n);a&&r.push(a);return}if(Ut(n)){if(!Dt(n))return;const a=Ko(n.geometry);if(a.positions.length===0)return;const i=vt(n),{color:o,layer:s}=nt(i),{offset:l,...c}=me(n,a),d={layer:s,color:o,offset:l,lineWidth:Tn(i),...c};Ue(n)&&(d.excludeFromOsnap=!0),mt(d,n,i),e.push(d)}else if(Rr(n)&&!(n instanceof Cr)){if(!Dt(n))return;const a=rt(At(n.geometry),2);if(a.positions.length===0)return;const i=vt(n),{color:o,layer:s,linePattern:l}=nt(i),{offset:c,...d}=me(n,a),u=l?Kt(d.positions):void 0,m={layer:s,color:o,offset:c,linePattern:l,lineDistances:u,...d};Ue(n)&&(m.excludeFromOsnap=!0),mt(m,n,i),e.push(m)}else if(Hr(n)&&!Ut(n)&&!(n instanceof Fr)){if(!Dt(n))return;const a=vt(n);if(tr(a))return;const i=rt(At(n.geometry),3);if(i.positions.length===0)return;const{offset:o,...s}=me(n,i),l=Mt(n.geometry,a,n,s,o,!0);l&&r.push(l)}}}),{lineBatches:e,meshBatches:r}}const Or={size:8,colorCss:"#0080ff",hotColorCss:"#ff0000"};function $r(t){const e=new Si(Ci.ByACI,t);return e.cssColor??`rgb(${e.red}, ${e.green}, ${e.blue})`}function ls(t){try{const e=Ai.instance(),r=e.getVar(le.GRIPSIZE,t),n=e.getVar(le.GRIPCOLOR,t),a=e.getVar(le.GRIPHOT,t);return!(r>0)||!Number.isFinite(r)?Or:{size:r,colorCss:$r(n),hotColorCss:$r(a)}}catch{return Or}}function rr(t,e){const r=t.extmin,n=t.extmax,a=ls(t);return{title:e==null?void 0:e.title,extents:{minX:r.x,minY:r.y,maxX:n.x,maxY:n.y},units:{insunits:t.insunits,lunits:t.lunits,luprec:t.luprec,aunits:t.aunits,auprec:t.auprec,measurement:t.measurement,ltscale:t.ltscale,angbase:t.angbase,angdir:t.angdir},grip:a,background:(e==null?void 0:e.background)??0}}function Te(t,e,r,n,a){return Math.atan2(n-e,a*(r-t))}function nr(t){return t.z>=0?1:-1}function Hn(t,e,r){if(!(r.radius>0)||!Number.isFinite(r.radius))return;const n=r.clockwise?-1:1,a=r.center.x,i=r.center.y;t.push({kind:"arc",layer:e,cx:a,cy:i,r:r.radius,startAngle:Te(a,i,r.startPoint.x,r.startPoint.y,n),endAngle:Te(a,i,r.endPoint.x,r.endPoint.y,n),normalSign:n})}function L(t,e){const r=new X(e.x,e.y,e.z??0).applyMatrix4(t);return{x:r.x,y:r.y}}function cs(t){const e=t.elements;return new pt(e[0],e[4],e[8],e[12],e[1],e[5],e[9],e[13],e[2],e[6],e[10],e[14],e[3],e[7],e[11],e[15])}function Ht(t,e){return new pt().multiplyMatrices(t,cs(e))}function On(t,e){const r=new X(e.x,e.y,e.z??0).transformDirection(t).normalize();return{x:r.x,y:r.y}}function _e(t){const e=new X(t.elements[0],t.elements[1],t.elements[2]).length(),r=new X(t.elements[4],t.elements[5],t.elements[6]).length();return ct.equal(e,r,tn*Math.max(e,r,1))}function ds(t,e){const r=t.tables.blockTable.getIdAt(e);if(r)return r;for(const a of t.tables.blockTable.newIterator())if(a.objectId===e)return a;const n=t.tables.blockTable.modelSpace;if(n.objectId===e)return n}function us(t){if(t instanceof Ji)return!0;const e=t;return(e.type==="LINE"||e.type==="Line")&&e.startPoint!=null&&e.endPoint!=null}function ms(t,e,r,n){n.startPoint,n.endPoint}function $n(t,e){return t.blockTableRecord??(t.blockName?e.tables.blockTable.getAt(t.blockName):void 0)}function ps(t,e){const r=t.dimBlockId;return r?e.tables.blockTable.getAt(r):void 0}function hs(t,e){const r=$n(t,e);if(r)return r;const n=t.owningBlockRecordId;return n?e.tables.blockTable.getAt(n):void 0}function jn(t){return t.getFullInsertionTransform()}function fs(t){for(const e of t.newIterator())return!0;return!1}function gs(t){return typeof t.getFullInsertionTransform=="function"&&"blockTableRecord"in t}function Q(t,e,r,n,a){if(n.length<2)return;const i=_e(r),o=r.elements[0]*r.elements[5]-r.elements[4]*r.elements[1]<0?-1:1,s=[];for(const l of n){const c=L(r,l);let d=l.bulge??0;ct.isPositive(Math.abs(d))&&(d=i?d*o:0),s.push(c.x,c.y,d)}t.push({kind:"path",layer:e,closed:a,vertices:s})}function Vn(t,e){return ct.equal(t.x,e.x)&&ct.equal(t.y,e.y)}function bs(t){return(t.clockwise?-1:1)*Math.tan(t.deltaAngle/4)}function jr(t,e,r,n){if(t.length===0){t.push({x:e.x,y:e.y,z:e.z??0,bulge:n}),t.push({x:r.x,y:r.y,z:r.z??0,bulge:0});return}const a=t[t.length-1];Vn(a,e)?a.bulge=n:(a.bulge=0,t.push({x:e.x,y:e.y,z:e.z??0,bulge:n})),t.push({x:r.x,y:r.y,z:r.z??0,bulge:0})}function Vr(t){return t.length>=2&&Vn(t[0],t[t.length-1])&&t.pop(),t}function kt(t,e,r,n,a){if(n.length<2)return;const i=a?n.length:n.length-1;for(let o=0;o<i;o++)n[o],n[(o+1)%n.length]}function ws(t,e,r,n){const a=[n.startPosition];for(const i of n.segments)a.push(i.position);kt(t,e,r,a,n.closed)}function xs(t,e,r){if(r.vertices.length>=2)return r.vertices;if(r.vertices.length===0)return[];const n=r.vertices[0],a=e.lastLeaderLinePoint??e.landingPoint??t.landingPoint??t.contentBasePosition;if(!a)return r.vertices;const i=n.x-a.x,o=n.y-a.y,s=(n.z??0)-(a.z??0);return Math.hypot(i,o,s)<=tn?r.vertices:[n,a]}function ys(t,e,r,n){var a,i;for(const s of n.leaders)for(const l of s.leaderLines){const c=xs(n,s,l);kt(t,e,r,c,!1)}const o=s=>{if(!s)return;const l=L(r,s);t.push({kind:"point",layer:e,x:l.x,y:l.y})};o(n.contentBasePosition),o((a=n.mtextContent)==null?void 0:a.anchorPoint),o((i=n.blockContent)==null?void 0:i.position)}function vs(t,e,r,n){const a=n.numberOfVertices;if(a<2)return;const i=n.elevation,o=n.closed?a:a-1;for(let s=0;s<o;s++){const l=n.getPointAt(s),c=n.getPointAt((s+1)%a),d=n.getBulgeAt(s),u={x:l.x,y:l.y,z:i},m={x:c.x,y:c.y,z:i};if(ct.isPositive(Math.abs(d))){const p=L(r,u),h=L(r,m);Hn(t,e,new je(p,h,d))}}}function ks(t,e,r,n,a,i){const o=L(r,n),s=new X(r.elements[0],r.elements[1],r.elements[2]).length(),l={kind:"circle",layer:e,cx:o.x,cy:o.y,r:a*s,normalSign:nr(i)};t.push(l)}function As(t,e,r,n){const a=L(r,n.center),i=new X(r.elements[0],r.elements[1],r.elements[2]).length(),o={kind:"arc",layer:e,cx:a.x,cy:a.y,r:n.radius*i,startAngle:n.startAngle,endAngle:n.endAngle,normalSign:nr(n.normal)};t.push(o)}function pe(t,e,r,n){const a=L(r,n.center),i=n._geo,o=(i==null?void 0:i.majorAxis)??{x:1,y:0,z:0},s=On(r,o),l=Math.hypot(s.x,s.y)||1,c=new X(r.elements[0],r.elements[1],r.elements[2]).length(),d=new X(r.elements[4],r.elements[5],r.elements[6]).length(),u={kind:"ellipse",layer:e,cx:a.x,cy:a.y,majorX:s.x/l,majorY:s.y/l,majorR:n.majorAxisRadius*c,minorR:n.minorAxisRadius*d,startAngle:n.startAngle,endAngle:n.endAngle,closed:n.closed,normalSign:nr(n.normal)};t.push(u)}function Ms(t,e,r,n){var a,i;const o=n._geo;if(!((a=o==null?void 0:o.controlPoints)!=null&&a.length))return;const s=[];for(const c of o.controlPoints){const d=L(r,c);s.push(d.x,d.y)}const l={kind:"spline",layer:e,controlPoints:s,degree:o.degree??3,knots:[...o.knots??[]],weights:[...o.weights??[]],closed:o.closed??!1};if((i=o.fitPoints)!=null&&i.length){l.fitPoints=[];for(const c of o.fitPoints){const d=L(r,c);l.fitPoints.push(d.x,d.y)}}t.push(l)}const Xr=1e-6;function Ss(t){var e;const r=t.elevation,n=(e=t._geo)==null?void 0:e.vertices;return n&&n.length>1?n.map(a=>({x:a.x,y:a.y,z:r,bulge:a.bulge,startWidth:a.startWidth,endWidth:a.endWidth})):Array.from({length:t.numberOfVertices},(a,i)=>{const o=t.getPoint2dAt(i);return{x:o.x,y:o.y,z:r,bulge:0}})}function Cs(t){return t.some(e=>{const r=Math.max(0,e.startWidth??0),n=Math.max(0,e.endWidth??0);return r>Xr||n>Xr})}function Fs(t,e,r,n){const a=Ss(n),i=a.length;if(i<2)return;if(Cs(a)){Q(t,e,r,a,n.closed);return}const o=n.closed?i:i-1;for(let s=0;s<o;s++){const l=a[s],c=a[(s+1)%i],d=l.bulge??0;if(ct.isPositive(Math.abs(d))){const u=L(r,l),m=L(r,c);Hn(t,e,new je(u,m,d))}}}function Bs(t,e,r,n,a){const i=L(r,{x:n.center.x,y:n.center.y,z:a}),o=On(r,{x:Math.cos(n.rotation),y:Math.sin(n.rotation),z:0}),s=Math.hypot(o.x,o.y)||1,l=new X(r.elements[0],r.elements[1],r.elements[2]).length(),c=new X(r.elements[4],r.elements[5],r.elements[6]).length();t.push({kind:"ellipse",layer:e,cx:i.x,cy:i.y,majorX:o.x/s,majorY:o.y/s,majorR:n.majorAxisRadius*l,minorR:n.minorAxisRadius*c,startAngle:n.startAngle,endAngle:n.endAngle,closed:!1,normalSign:n.clockwise?-1:1})}function Es(t,e,r,n,a){var i;const o=n.numberOfVertices;if(o<2)return;const s=[];for(let l=0;l<o;l++){const c=n.getPointAt(l);s.push({x:c.x,y:c.y,z:a,bulge:((i=n.vertices[l])==null?void 0:i.bulge)??0})}Q(t,e,r,s,n.closed)}function Ls(t,e,r,n,a){if(n instanceof qi){Es(t,e,r,n,a);return}if(!(n instanceof Qi))return;const i=[];let o=!1;const s=()=>{const c=Vr(i);c.length>=2&&Q(t,e,r,c,!1),i.length=0};for(const c of n.curves)c instanceof to?jr(i,{x:c.startPoint.x,y:c.startPoint.y,z:a},{x:c.endPoint.x,y:c.endPoint.y,z:a},0):c instanceof je?jr(i,{x:c.startPoint.x,y:c.startPoint.y,z:a},{x:c.endPoint.x,y:c.endPoint.y,z:a},bs(c)):c instanceof eo&&(o=!0,s(),Bs(t,e,r,c,a));const l=Vr(i);l.length>=2&&Q(t,e,r,l,!o)}function Is(t,e,r,n){var a;const i=(a=n._geo)==null?void 0:a.loops;if(!(i!=null&&i.length))return;const o=n.elevation;for(const s of i)Ls(t,e,r,s,o)}function Ps(t,e,r,n){Ht(r,jn(n));const a=[0];for(let o=0;o<n.numColumns;o++)a.push(a[o]+n.columnWidth(o));const i=[0];for(let o=0;o<n.numRows;o++)i.push(i[o]-n.rowHeight(o));a[a.length-1],i[i.length-1];for(const o of i);for(const o of a);}function zs(t,e,r,n,a,i,o,s=!0){const l=Re(t.layer,r);if(o&&!o(l))return;const c=hs(t,i);if(c&&!a.has(c.objectId)&&fs(c)){a.add(c.objectId);const u=Ht(e,jn(t));Ot(c,u,l,n,a,i,o,s),a.delete(c.objectId);return}Ps(n,l,e,t);const d=L(e,t.position);n.push({kind:"point",layer:l,x:d.x,y:d.y})}function Ds(t,e,r,n){let a=n.boundaryPath();if(a.length>1){const o=a[0],s=a[a.length-1];o.x===s.x&&o.y===s.y&&(o.z??0)===(s.z??0)&&(a=a.slice(0,-1))}a.length>=2&&Q(t,e,r,a,!0);const i=L(r,n.position);t.push({kind:"point",layer:e,x:i.x,y:i.y})}function Us(t,e,r,n){const a=n.position();Q(t,e,r,[a.upperLeft,a.upperRight,a.lowerRight,a.lowerLeft],!0);const i=L(r,n.getLocation());t.push({kind:"point",layer:e,x:i.x,y:i.y})}function Ns(t){var e;const r=(e=t.attributeIterator)==null?void 0:e.call(t);return r?typeof r.toArray=="function"?r.toArray():[...r]:[]}function Re(t,e){return t==="0"?e:t}function Xn(t,e,r,n,a,i,o,s=!0){if(!t.visibility)return;const l=Re(t.layer,r);if(!(o&&!o(l))){if(t instanceof Fi){zs(t,e,r,n,a,i,o,s);return}if(gs(t)){const c=$n(t,i);if(!c||a.has(c.objectId))return;a.add(c.objectId);const d=t.getFullInsertionTransform(),u=Math.max(1,t.columnCount??1),m=Math.max(1,t.rowCount??1),p=t.columnSpacing??0,h=t.rowSpacing??0,f=Re(t.layer,r);for(let g=0;g<m;g++)for(let w=0;w<u;w++){const b=Ht(e,d);(w!==0||g!==0)&&b.multiply(new pt().makeTranslation(w*p,g*h,0));const A=L(b,{x:0,y:0,z:0});n.push({kind:"point",layer:f,x:A.x,y:A.y}),Ot(c,b,f,n,a,i,o,s)}for(const g of Ns(t))g instanceof Bi,g.isInvisible||Xn(g,e,f,n,a,i,o,s);a.delete(c.objectId);return}if(t instanceof Ei){const c=t,d=ps(c,i);if(!d||a.has(d.objectId))return;a.add(d.objectId);const u=Ht(e,c.getFullDimBlockTransform());Ot(d,u,l,n,a,i,o,!0),a.delete(d.objectId);return}if(us(t)){ms(n,l,e,t);return}if(t instanceof Li){_e(e)?ks(n,l,e,t.center,t.radius,t.normal):pe(n,l,e,Ts(t));return}if(t instanceof Ii){_e(e)?As(n,l,e,t):pe(n,l,e,_s(t));return}if(t instanceof $e){pe(n,l,e,t);return}if(t instanceof Pi){Ms(n,l,e,t);return}if(t instanceof zi){Fs(n,l,e,t);return}if(t instanceof Di){vs(n,l,e,t);return}if(t instanceof Ui){const c=[];for(let d=0;d<t.numberOfVertices;d++)c.push(t.getPointAt(d));kt(n,l,e,c,t.closed);return}if(t instanceof Ni){s&&Is(n,l,e,t);return}if(t instanceof Ti){t.basePoint,t.unitDir;return}if(t instanceof _i){t.basePoint,t.unitDir;return}if(t instanceof Ri){Q(n,l,e,[t.getPointAt(0),t.getPointAt(1),t.getPointAt(3),t.getPointAt(2)],!0);return}if(t instanceof Hi){s&&Q(n,l,e,[t.getPointAt(0),t.getPointAt(1),t.getPointAt(3),t.getPointAt(2)],!0);return}if(t instanceof Oi){const c=t.subGetGripPoints();c.length>=2&&kt(n,l,e,c,c.length>=3);return}if(t instanceof $i){const c=t.vertices;c.length>=2&&kt(n,l,e,c,!1);return}if(t instanceof ji){ws(n,l,e,t);return}if(t instanceof Vi){ys(n,l,e,t);return}if(t instanceof Xi){const c=L(e,t.position);n.push({kind:"point",layer:l,x:c.x,y:c.y});return}if(t instanceof Yi){const c=L(e,t.location);n.push({kind:"point",layer:l,x:c.x,y:c.y});return}if(t instanceof Gi){s&&Us(n,l,e,t);return}if(t instanceof Wi){s&&Ds(n,l,e,t);return}if(t instanceof Ki){const c=L(e,t.position);n.push({kind:"point",layer:l,x:c.x,y:c.y})}}}function Ot(t,e,r,n,a,i,o,s=!0){for(const l of t.newIterator())Xn(l,e,r,n,a,i,o,s)}function Ts(t){return new $e(t.center,t.normal,{x:1,y:0,z:0},t.radius,t.radius,0,Zi)}function _s(t){return new $e(t.center,t.normal,{x:1,y:0,z:0},t.radius,t.radius,t.startAngle,t.endAngle)}function Yn(t,e,r={}){const n=ds(t,e);if(!n)return{primitives:[]};const a=[],i=new pt;return Ot(n,i,"0",a,new Set,t,r.includeLayer),{primitives:a.filter(o=>o.kind!=="line"&&Rs(o))}}function Rs(t){switch(t.kind){case"line":return Number.isFinite(t.x0)&&Number.isFinite(t.y0)&&Number.isFinite(t.x1)&&Number.isFinite(t.y1);case"circle":return Number.isFinite(t.cx)&&Number.isFinite(t.cy)&&Number.isFinite(t.r);case"arc":return Number.isFinite(t.cx)&&Number.isFinite(t.cy)&&Number.isFinite(t.r)&&Number.isFinite(t.startAngle)&&Number.isFinite(t.endAngle);case"ellipse":return Number.isFinite(t.cx)&&Number.isFinite(t.cy)&&Number.isFinite(t.majorX)&&Number.isFinite(t.majorY)&&Number.isFinite(t.majorR)&&Number.isFinite(t.minorR)&&Number.isFinite(t.startAngle)&&Number.isFinite(t.endAngle);case"spline":return t.controlPoints.every(e=>Number.isFinite(e))&&t.knots.every(e=>Number.isFinite(e))&&t.weights.every(e=>Number.isFinite(e));case"point":return Number.isFinite(t.x)&&Number.isFinite(t.y);case"path":return t.vertices.length>=6&&t.vertices.length%3===0&&t.vertices.every(e=>Number.isFinite(e));default:return t}}const Gn=["en","ja","zh","cs","tr","ar"];function qt(t){if(t==null||t==="")return null;const e=t.toLowerCase().replace("_","-");for(const r of Gn)if(e===r||e.startsWith(`${r}-`))return r;return null}const Wn=1128612673;function Et(t){if(t.version!==H)throw new Error(`Unsupported chunk version: ${t.version}`);const e=new Vt;e.writeU32(Wn),e.writeU8(H),e.writeU8(0),e.writeU8(0),e.writeU8(0),e.writeString(t.layoutBtrId),e.writeU32(t.lineBatches.length);for(const r of t.lineBatches)Ke(e,r);e.writeU32(t.meshBatches.length);for(const r of t.meshBatches)Je(e,r);return e.toUint8Array()}function Kn(t){const e=Et(t),r=ut(e).bytes;return{uncompressed:e,compressed:r}}async function Hs(t){const e=Et(t),r=(await We(e)).bytes;return{uncompressed:e,compressed:r}}const Jn=1,ar=2*1024*1024,Lt=2*1024*1024,Zn=8*1024*1024,He=12*1024*1024,qn=2*1024*1024,It="drawing.acex.json",Qn=`./${It}`;function ir(...t){return`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024">${t.map(e=>`<path fill="currentColor" d="${e}"/>`).join("")}</svg>`}ir("M624 475.968V640h144a128 128 0 0 1 128 128H128a128 128 0 0 1 128-128h144V475.968a192 192 0 1 1 224 0M128 896v-64h768v64z");ir("M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352m0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288m0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448m0 64a160.19 160.19 0 0 0-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160");ir("M876.8 156.8c0-9.6-3.2-16-9.6-22.4s-12.8-9.6-22.4-9.6-16 3.2-22.4 9.6L736 220.8c-64-32-137.6-51.2-224-60.8-160 16-288 73.6-377.6 176S0 496 0 512s48 73.6 134.4 176c22.4 25.6 44.8 48 73.6 67.2l-86.4 89.6c-6.4 6.4-9.6 12.8-9.6 22.4s3.2 16 9.6 22.4 12.8 9.6 22.4 9.6 16-3.2 22.4-9.6l704-710.4c3.2-6.4 6.4-12.8 6.4-22.4m-646.4 528Q115.2 579.2 76.8 512q43.2-72 153.6-172.8C304 272 400 230.4 512 224c64 3.2 124.8 19.2 176 44.8l-54.4 54.4C598.4 300.8 560 288 512 288c-64 0-115.2 22.4-160 64s-64 96-64 160c0 48 12.8 89.6 35.2 124.8L256 707.2c-9.6-6.4-19.2-16-25.6-22.4m140.8-96Q352 555.2 352 512c0-44.8 16-83.2 48-112s67.2-48 112-48c28.8 0 54.4 6.4 73.6 19.2zM889.599 336c-12.8-16-28.8-28.8-41.6-41.6l-48 48c73.6 67.2 124.8 124.8 150.4 169.6q-43.2 72-153.6 172.8c-73.6 67.2-172.8 108.8-284.8 115.2-51.2-3.2-99.2-12.8-140.8-28.8l-48 48c57.6 22.4 118.4 38.4 188.8 44.8 160-16 288-73.6 377.6-176S1024 528 1024 512s-48.001-73.6-134.401-176","M511.998 672c-12.8 0-25.6-3.2-38.4-6.4l-51.2 51.2c28.8 12.8 57.6 19.2 89.6 19.2 64 0 115.2-22.4 160-64 41.6-41.6 64-96 64-160 0-32-6.4-64-19.2-89.6l-51.2 51.2c3.2 12.8 6.4 25.6 6.4 38.4 0 44.8-16 83.2-48 112s-67.2 48-112 48");const Os='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M10 13.5 14.5 9h-9L10 13.5Z"/></svg>',$s='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" d="M10.09 3.53 16.09 6.97 10.09 10.29 4.18 7 10.09 3.56M10.09 2.4 2.17 7 3.31 7.65 10.09 11.45 17 7.62 18.17 7 10.08 2.37 10.09 2.4Z"/><path fill="currentColor" d="M10.25 14.83 18.17 10.22 17 9.57 10.22 13.57 3.32 9.59 2.17 10.22 10.25 14.83Z"/><path fill="currentColor" d="M10.25 17.63 18.17 13 17 12.37 10.22 16.37 3.32 12.38 2.17 13 10.25 17.63Z"/></svg>',js='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" d="M10.09 5.15 16.09 8.59 10.09 11.91 4.18 8.59 10.09 5.15ZM10.09 4 2.17 8.61 3.31 9.25 10.09 13.06 17 9.24 18.16 8.61 10.08 4 10.09 4Z"/><path fill="currentColor" d="M10.25 16.46 18.17 11.85 17 11.2 10.22 15.2 3.32 11.21 2.17 11.85 10.25 16.46Z"/><path fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" d="M3.5 3.5 16.5 16.5"/></svg>',$t={layerOn:$s,layerOff:js,chevronDown:Os},ta=[90,45,30,23,18,10,5];function ea(){return`<div id="mlcad-polar-angles" role="group" data-i18n-attr="aria-label" data-i18n-key="settings.polarAngles" aria-label="Polar tracking angles" hidden>
          ${ta.map(t=>`<button type="button" class="mlcad-tool-btn mlcad-settings-option-btn mlcad-polar-angle-btn" data-polar-ang="${t}" title="${t}°" aria-label="${t}°"><span class="mlcad-settings-option-indicator" aria-hidden="true"></span><span class="mlcad-settings-option-text">${t}°</span></button>`).join("")}
        </div>`}const ra=600,na=960,Qt=`
  :root {
    --mlcad-ui-bg: rgba(24, 26, 30, 0.94);
    --mlcad-ui-bg-elevated: rgba(32, 35, 40, 0.98);
    --mlcad-ui-border: rgba(255, 255, 255, 0.1);
    --mlcad-ui-text: #e8eaed;
    --mlcad-ui-muted: #9aa0a6;
    --mlcad-accent: #08e8de;
    --mlcad-accent-active: #af61da;
    /* Shared measure-tool SVGs read --el-color-primary (Element Plus in cad-viewer). */
    --el-color-primary: var(--mlcad-accent);
    --ml-ui-accent: var(--mlcad-accent);
    --ml-ui-bg: var(--mlcad-ui-bg);
    --ml-ui-bg-elevated: var(--mlcad-ui-bg-elevated);
    --ml-ui-border: var(--mlcad-ui-border);
    --ml-ui-text: var(--mlcad-ui-text);
    --ml-ui-muted: var(--mlcad-ui-muted);
    --mlcad-tool-btn-active-border: color-mix(in srgb, var(--mlcad-accent-active) 55%, transparent);
    --mlcad-tool-btn-active-bg: color-mix(in srgb, var(--mlcad-accent-active) 22%, transparent);
    --mlcad-measure-accent: #08e8de;
    --mlcad-measure-accent-border: rgba(8, 232, 222, 0.45);
    --mlcad-measure-accent-fill: rgba(8, 232, 222, 0.2);
    --mlcad-markup-accent: #e53935;
    --mlcad-markup-accent-border: rgba(229, 57, 53, 0.45);
    --mlcad-shadow: 0 8px 28px rgba(0, 0, 0, 0.45);
    --mlcad-toolbar-width: 44px;
    --mlcad-drawer-width: 220px;
    --mlcad-drawer-gap: 8px;
    --mlcad-ui-inset: 12px;
    --mlcad-review-max-height: calc(100vh - 2 * var(--mlcad-ui-inset) - 48px);
    --mlcad-z-chrome: 7;
    /* Drawing overlays stay under chrome, session panel, and modal dialogs. */
    --mlcad-z-measure: 1;
    --mlcad-z-markup: 2;
    --ml-ui-grip-size: 8px;
    --ml-ui-grip-normal: #0080ff;
    --ml-ui-grip-hot: #ff0000;
  }
  html, body {
    margin: 0; height: 100%; overflow: hidden;
    background: #121418;
    font-family: "Noto Sans JP Variable", "Noto Sans JP", "Segoe UI", system-ui, -apple-system, sans-serif;
    color: var(--mlcad-ui-text);
  }
  #mlcad-root { position: relative; width: 100%; height: 100%; }
  #mlcad-canvas-host {
    position: absolute;
    inset: 0;
    min-width: 0;
    min-height: 0;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
  }
  #mlcad-canvas-host canvas,
  #mlcad-root > canvas {
    display: block;
    width: 100%;
    height: 100%;
    touch-action: none;
    -webkit-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
  }

  .mlcad-snap-loupe {
    position: absolute;
    left: 8px;
    top: 8px;
    width: 128px;
    height: 128px;
    box-sizing: border-box;
    border: 2px solid var(--mlcad-measure-accent, #08e8de);
    border-radius: 2px;
    pointer-events: none;
    z-index: 8;
    overflow: hidden;
    box-shadow: var(--mlcad-shadow);
  }

  html[data-mlcad-theme="light"] {
    --mlcad-ui-bg: rgba(255, 255, 255, 0.94);
    --mlcad-ui-bg-elevated: rgba(248, 249, 250, 0.98);
    --mlcad-ui-border: rgba(0, 0, 0, 0.12);
    --mlcad-ui-text: #202124;
    --mlcad-ui-muted: #5f6368;
    --mlcad-shadow: 0 8px 28px rgba(0, 0, 0, 0.18);
  }
  html[data-mlcad-theme="light"],
  html[data-mlcad-theme="light"] body {
    background: #e8eaed;
    color: var(--mlcad-ui-text);
  }

  #mlcad-sidebar {
    position: absolute;
    left: var(--mlcad-ui-inset);
    top: 50%;
    z-index: var(--mlcad-z-chrome);
    transform: translateY(-50%);
    display: flex;
    align-items: flex-start;
    gap: var(--mlcad-drawer-gap);
    max-width: calc(100% - 2 * var(--mlcad-ui-inset));
    box-sizing: border-box;
    pointer-events: none;
  }
  #mlcad-sidebar > * { pointer-events: auto; }

  #mlcad-toolbar {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: 0;
    box-shadow: none;
    backdrop-filter: none;
  }
  /* AcUiToolbar chrome replaces the old .mlcad-tool-btn shell styles. */
  #mlcad-toolbar .ml-ex-ui-toolbar {
    position: relative !important;
    inset: auto !important;
    left: auto !important;
    top: auto !important;
    right: auto !important;
    bottom: auto !important;
    transform: none !important;
    background: var(--mlcad-ui-bg);
    border: 1px solid var(--mlcad-ui-border);
    border-radius: 8px;
    box-shadow: var(--mlcad-shadow);
    backdrop-filter: blur(12px);
    --ml-ex-ui-toolbar-btn-size: var(--mlcad-toolbar-width);
  }
  #mlcad-toolbar .ml-ex-ui-toolbar.is-left,
  #mlcad-toolbar .ml-ex-ui-toolbar.is-right {
    flex-direction: column;
  }
  #mlcad-toolbar .ml-ex-ui-toolbar.is-bottom,
  #mlcad-toolbar .ml-ex-ui-toolbar.is-top {
    flex-direction: row;
    width: 100%;
    box-sizing: border-box;
  }
  #mlcad-sidebar > #mlcad-toolbar.ml-ex-ui-toolbar-host {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  /* Phone strips mount on #mlcad-root so they can sit above the bottom bar. */
  #mlcad-root > .ml-ex-ui-subtoolbar {
    z-index: calc(var(--mlcad-z-chrome) + 1);
  }
  .mlcad-tool-btn {
    position: relative;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 2px;
    width: var(--mlcad-toolbar-width); height: var(--mlcad-toolbar-width);
    margin: 0; padding: 0;
    border: 1px solid transparent;
    border-radius: 6px;
    background: transparent;
    color: var(--mlcad-ui-text);
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }
  .mlcad-tool-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--mlcad-ui-border);
  }
  .mlcad-tool-btn.active,
  .mlcad-tool-btn.is-menu-open {
    background: var(--mlcad-tool-btn-active-bg);
    border-color: var(--mlcad-tool-btn-active-border);
    color: #fff;
  }
  .mlcad-tool-btn-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
  .mlcad-tool-btn-icon svg,
  .mlcad-tool-btn svg {
    width: 20px; height: 20px; display: block; flex-shrink: 0;
  }
  .mlcad-tool-btn-label {
    display: none;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 10px;
    line-height: 1.2;
    text-align: center;
    pointer-events: none;
  }
  /* Settings is always on the bar (desktop/pad/phone); language lives under it. */
  /* Flyout mark: opaque corner triangle (cad-simple-ui-plugin is-left style). */
  .mlcad-tool-btn.has-children::after {
    content: '';
    position: absolute;
    right: 1px;
    bottom: 1px;
    width: 6px;
    height: 6px;
    background: currentColor;
    clip-path: polygon(100% 100%, 0 100%, 100% 0);
    pointer-events: none;
  }
  .mlcad-dropdown {
    position: fixed;
    z-index: 40;
    min-width: 180px;
    max-width: min(280px, calc(100vw - 24px));
    max-height: min(360px, calc(100vh - 24px));
    overflow-y: auto;
    padding: 4px;
    background: var(--mlcad-ui-bg-elevated);
    border: 1px solid var(--mlcad-ui-border);
    border-radius: 8px;
    box-shadow: var(--mlcad-shadow);
    backdrop-filter: blur(12px);
  }
  .mlcad-dropdown-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    box-sizing: border-box;
    margin: 0;
    padding: 6px 8px;
    border: none;
    border-radius: 5px;
    background: transparent;
    color: var(--mlcad-ui-text);
    font-size: 12px;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
  }
  .mlcad-dropdown-item:hover {
    background: rgba(255, 255, 255, 0.08);
  }
  .mlcad-dropdown-item.active,
  .mlcad-dropdown-item.is-toggled {
    background: color-mix(in srgb, var(--mlcad-accent-active) 22%, transparent);
    color: #fff;
  }
  .mlcad-dropdown-icon {
    display: inline-flex;
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
  }
  .mlcad-dropdown-icon svg {
    width: 18px;
    height: 18px;
    display: block;
  }
  .mlcad-dropdown-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .mlcad-dropdown-separator {
    height: 1px;
    margin: 4px 6px;
    background: var(--mlcad-ui-border);
  }
  #mlcad-toolbar-toggle {
    height: calc(var(--mlcad-toolbar-width) / 2);
    margin-top: -4px;
    margin-bottom: -4px;
    border-radius: 4px;
  }
  #mlcad-toolbar-toggle svg {
    width: calc(var(--mlcad-toolbar-width) / 2);
    height: calc(var(--mlcad-toolbar-width) / 2);
  }
  .mlcad-tool-separator {
    height: 1px;
    margin: 4px 8px;
    background: var(--mlcad-ui-border);
  }
  .mlcad-locale-option-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.04em;
    user-select: none;
  }
  #mlcad-zoom-window-rect,
  #mlcad-selection-rect {
    position: fixed;
    z-index: 25;
    box-sizing: border-box;
    pointer-events: none;
    border: 1px dashed var(--mlcad-accent, #08e8de);
    background: rgba(8, 232, 222, 0.12);
  }
  #mlcad-zoom-window-rect[hidden],
  #mlcad-selection-rect[hidden] { display: none; }
  #mlcad-selection-rect[data-mode='window'] {
    border-style: solid;
    border-color: #00ff5a;
    background: color-mix(in srgb, var(--mlcad-accent-active) 12%, transparent);
  }
  #mlcad-selection-rect[data-mode='crossing'] {
    border-style: dashed;
    border-color: #00d1ff;
    background: color-mix(in srgb, var(--mlcad-accent-active) 12%, transparent);
  }

  #mlcad-layer-drawer,
  #mlcad-review-drawer,
  #mlcad-measure-drawer {
    flex-shrink: 1;
    min-width: 0;
    width: var(--mlcad-drawer-width);
    max-height: min(420px, var(--mlcad-review-max-height));
    display: flex; flex-direction: column;
    background: var(--mlcad-ui-bg-elevated);
    border: 1px solid var(--mlcad-ui-border);
    border-radius: 8px;
    box-shadow: var(--mlcad-shadow);
    backdrop-filter: blur(12px);
    overflow: hidden;
    box-sizing: border-box;
  }
  #mlcad-markup-strip-wrap {
    position: relative;
  }
  #mlcad-review-drawer {
    position: absolute;
    left: 100%;
    top: 0;
    margin-left: var(--mlcad-drawer-gap);
    width: min(320px, calc(100vw - 2 * var(--mlcad-ui-inset) - var(--mlcad-toolbar-width) - var(--mlcad-drawer-gap)));
    height: 100%;
    max-height: var(--mlcad-review-max-height);
  }
  #mlcad-layer-drawer[hidden],
  #mlcad-review-drawer[hidden],
  #mlcad-measure-drawer[hidden] { display: none; }

  .mlcad-drawer-header {
    display: flex; align-items: center; justify-content: space-between;
    gap: 6px; padding: 8px 10px;
    border-bottom: 1px solid var(--mlcad-ui-border);
    font-size: 13px; font-weight: 600;
  }
  .mlcad-drawer-close {
    width: 28px; height: 28px; padding: 0;
    border: none; border-radius: 4px;
    background: transparent; color: var(--mlcad-ui-muted);
    cursor: pointer; font-size: 18px; line-height: 1;
  }
  .mlcad-drawer-close:hover {
    background: rgba(255, 255, 255, 0.08); color: var(--mlcad-ui-text);
  }

  .mlcad-drawer-sheet-chrome {
    display: none;
    position: relative;
  }
  .mlcad-drawer-grabber {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 20px;
    cursor: ns-resize;
    touch-action: none;
  }
  .mlcad-drawer-grabber::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 36px;
    height: 4px;
    border-radius: 2px;
    background: var(--mlcad-ui-muted);
    opacity: 0.75;
  }
  .mlcad-drawer-sheet-close {
    width: 36px; height: 28px; padding: 0;
    border: none; background: transparent;
    color: var(--mlcad-ui-muted); cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center;
    flex: 0 0 auto;
    position: relative;
    z-index: 1;
  }
  .mlcad-drawer-sheet-close:hover { color: var(--mlcad-ui-text); }
  .mlcad-drawer-sheet-close svg { width: 18px; height: 18px; }

  .mlcad-layer-actions {
    display: flex; gap: 4px; padding: 6px 8px;
    border-bottom: 1px solid var(--mlcad-ui-border);
  }
  .mlcad-layer-action-btn {
    flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    min-height: 30px; padding: 4px 8px;
    border: 1px solid var(--mlcad-ui-border);
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.04);
    color: var(--mlcad-ui-text);
    font-size: 12px; cursor: pointer;
  }
  .mlcad-layer-action-btn:hover { background: rgba(255, 255, 255, 0.1); }
  .mlcad-layer-action-btn svg { width: 14px; height: 14px; flex-shrink: 0; }

  #mlcad-layer-list {
    flex: 1; overflow: auto; padding: 4px 0;
  }
  .mlcad-layer-item {
    display: grid;
    grid-template-columns: auto auto 1fr auto;
    align-items: center; gap: 6px;
    padding: 5px 8px;
    font-size: 12px; cursor: pointer;
  }
  .mlcad-layer-item:hover { background: rgba(255, 255, 255, 0.05); }
  .mlcad-layer-item input { margin: 0; cursor: pointer; }
  .mlcad-layer-swatch {
    width: 12px; height: 12px; border-radius: 2px;
    border: 1px solid rgba(255, 255, 255, 0.28);
  }
  .mlcad-layer-name {
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .mlcad-layer-zoom {
    display: flex; align-items: center; justify-content: center;
    width: 22px; height: 22px; padding: 0;
    border: 1px solid transparent; border-radius: 4px;
    background: transparent; color: var(--mlcad-ui-muted);
    cursor: pointer;
  }
  .mlcad-layer-zoom svg {
    width: 14px; height: 14px; display: block;
  }
  .mlcad-layer-zoom:hover:not(:disabled) {
    color: var(--mlcad-accent);
    border-color: var(--mlcad-ui-border);
    background: rgba(255, 255, 255, 0.06);
  }
  .mlcad-layer-zoom:disabled { opacity: 0.35; cursor: not-allowed; }

  .mlcad-review-toolbar {
    display: flex; gap: 6px; align-items: center;
    padding: 6px 8px;
    border-bottom: 1px solid var(--mlcad-ui-border);
  }
  .mlcad-review-search {
    flex: 1; min-width: 0;
    box-sizing: border-box;
    padding: 4px 8px;
    border: 1px solid var(--mlcad-ui-border);
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.04);
    color: var(--mlcad-ui-text);
    font-size: 12px;
  }
  .mlcad-review-clear,
  .mlcad-review-zoom,
  .mlcad-review-delete {
    flex: 0 0 auto;
    padding: 4px 8px;
    border: 1px solid var(--mlcad-ui-border);
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.04);
    color: var(--mlcad-ui-text);
    font-size: 12px; cursor: pointer;
  }
  .mlcad-review-clear:disabled { opacity: 0.5; cursor: default; }
  .mlcad-review-delete { color: #f56c6c; border-color: rgba(245, 108, 108, 0.55); }
  .mlcad-review-table-wrap { flex: 1 1 auto; min-height: 0; overflow: auto; }
  .mlcad-review-table {
    width: 100%; border-collapse: collapse; font-size: 12px;
  }
  .mlcad-review-table th,
  .mlcad-review-table td {
    padding: 4px 8px; text-align: left;
    border-bottom: 1px solid var(--mlcad-ui-border);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    max-width: 90px;
  }
  .mlcad-review-table tr.is-selected td {
    background: color-mix(in srgb, var(--mlcad-accent-active) 22%, transparent);
  }
  .mlcad-review-table tr { cursor: pointer; }
  .mlcad-review-empty td { text-align: center; color: var(--mlcad-ui-muted); cursor: default; }
  .mlcad-review-detail {
    flex: 0 1 auto;
    max-height: 52%;
    overflow: auto;
    border-top: 1px solid var(--mlcad-ui-border);
    padding: 8px 10px 14px;
    display: flex; flex-direction: column; gap: 6px;
    box-sizing: border-box;
  }
  .mlcad-review-detail[hidden] { display: none; }
  .mlcad-review-detail-header {
    display: flex; align-items: center; justify-content: space-between; gap: 4px;
  }
  .mlcad-review-detail-title { font-weight: 600; font-size: 12px; }
  .mlcad-review-detail-close {
    flex-shrink: 0;
    width: 24px; height: 24px; padding: 0;
    border: none; border-radius: 4px;
    background: transparent; color: var(--mlcad-ui-muted);
    cursor: pointer; font-size: 16px; line-height: 1;
  }
  .mlcad-review-detail-close:hover {
    background: rgba(255, 255, 255, 0.08); color: var(--mlcad-ui-text);
  }
  .mlcad-review-field { display: flex; flex-direction: column; gap: 2px; }
  .mlcad-review-field-label { font-size: 11px; color: var(--mlcad-ui-muted); }
  .mlcad-review-status,
  .mlcad-review-author,
  .mlcad-review-text,
  .mlcad-review-comment {
    box-sizing: border-box; width: 100%;
    padding: 4px 6px;
    border: 1px solid var(--mlcad-ui-border);
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.04);
    color: var(--mlcad-ui-text);
    font-size: 12px;
  }
  .mlcad-review-author:disabled { opacity: 0.7; }
  .mlcad-review-comment { min-height: 44px; resize: vertical; }
  .mlcad-review-detail-actions { display: flex; gap: 6px; margin-top: 2px; }

  .mlcad-measure-toolbar {
    display: flex; gap: 8px; align-items: center;
    padding: 8px 10px; border-bottom: 1px solid var(--mlcad-ui-border);
  }
  .mlcad-measure-filter {
    flex: 1 1 auto; min-width: 0;
    display: flex; overflow: hidden;
    border: 1px solid var(--mlcad-ui-border); border-radius: 4px;
  }
  .mlcad-measure-filter-btn {
    flex: 1 1 0; min-width: 0; padding: 4px 2px;
    border: none; border-right: 1px solid var(--mlcad-ui-border);
    background: transparent; color: var(--mlcad-ui-text);
    font: inherit; font-size: 11px; cursor: pointer;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .mlcad-measure-filter-btn:last-child { border-right: none; }
  .mlcad-measure-filter-btn:hover:not(.is-active) {
    background: rgba(255, 255, 255, 0.06);
  }
  .mlcad-measure-filter-btn.is-active {
    background: rgba(8, 232, 222, 0.18);
  }
  .mlcad-measure-clear,
  .mlcad-measure-row-delete {
    border: 1px solid var(--mlcad-ui-border); border-radius: 4px;
    background: rgba(255, 255, 255, 0.04); color: var(--mlcad-ui-text);
    padding: 4px 8px; font-size: 12px; cursor: pointer;
  }
  .mlcad-measure-clear:disabled { opacity: 0.5; cursor: default; }
  .mlcad-measure-row-delete { color: #f56c6c; border-color: rgba(245, 108, 108, 0.55); padding: 2px 6px; font-size: 11px; }
  .mlcad-measure-table-wrap { flex: 1 1 auto; min-height: 0; overflow: auto; }
  .mlcad-measure-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  .mlcad-measure-table th,
  .mlcad-measure-table td {
    padding: 6px 8px; text-align: left; font-size: 12px;
    border-bottom: 1px solid var(--mlcad-ui-border);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .mlcad-measure-table tr.is-selected td {
    background: rgba(8, 232, 222, 0.12);
  }
  .mlcad-measure-table tr { cursor: pointer; }
  .mlcad-measure-empty td { text-align: center; color: var(--mlcad-ui-muted); cursor: default; }
  #mlcad-measure-strip-wrap { position: relative; }
  #mlcad-measure-drawer {
    position: absolute;
    left: 100%;
    top: 0;
    margin-left: var(--mlcad-drawer-gap);
    width: min(320px, calc(100vw - 2 * var(--mlcad-ui-inset) - var(--mlcad-toolbar-width) - var(--mlcad-drawer-gap)));
    height: 100%;
    max-height: var(--mlcad-review-max-height);
  }

  /*
   * Top canvas chrome: message bar + expiry share one row. Shortcut toolbar
   * and snap loupe stack below (see AcExHtmlTopChrome / ShortCutToolbar /
   * SnapLoupeMath).
   */
  #mlcad-top-chrome {
    position: absolute;
    left: 12px;
    right: 12px;
    top: 10px;
    z-index: var(--mlcad-z-chrome);
    display: flex;
    align-items: flex-start;
    gap: 8px;
    box-sizing: border-box;
    pointer-events: none;
  }
  #mlcad-status-bar {
    position: relative;
    flex: 1 1 auto;
    min-width: 0;
    /* Block layout so text-overflow: ellipsis works on direct textContent. */
    display: block;
    min-height: 28px;
    line-height: 28px;
    padding: 0 12px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 6px;
    background: var(--mlcad-accent);
    color: #0b1f1e;
    font-size: 12px;
    font-weight: 600;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(10px);
    pointer-events: none;
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.18s ease, transform 0.18s ease;
    /* Shrink before the expiry badge; clip with an ellipsis when too narrow. */
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  #mlcad-status-bar:empty,
  #mlcad-status-bar[hidden] {
    display: none;
    opacity: 0;
    transform: translateY(-6px);
  }

  /* Session panel DOM/CSS comes from shared AcUiMobileSessionPanel. */
  #mlcad-root {
    --ml-mobile-cmd-collapsed-height: var(--mlcad-toolbar-phone-height, 56px);
  }
  .ml-mobile-cmd-panel {
    z-index: calc(var(--mlcad-z-chrome) + 3);
  }

  #mlcad-sidebar.mlcad-sidebar--collapsed #mlcad-snap-strip-wrap,
  #mlcad-sidebar.mlcad-sidebar--collapsed #mlcad-measure-strip-wrap,
  #mlcad-sidebar.mlcad-sidebar--collapsed #mlcad-markup-strip-wrap,
  #mlcad-sidebar.mlcad-sidebar--collapsed #mlcad-zoom-strip-wrap,
  #mlcad-sidebar.mlcad-sidebar--collapsed #mlcad-settings-strip-wrap,
  #mlcad-sidebar.mlcad-sidebar--collapsed #mlcad-locale-strip-wrap,
  #mlcad-sidebar.mlcad-sidebar--collapsed #mlcad-layer-drawer,
  #mlcad-sidebar.mlcad-sidebar--collapsed #mlcad-review-drawer,
  #mlcad-sidebar.mlcad-sidebar--collapsed #mlcad-measure-drawer {
    display: none !important;
  }
  #mlcad-sidebar.mlcad-sidebar--collapsed #mlcad-toolbar .mlcad-tool-btn:not(#mlcad-toolbar-toggle) {
    display: none;
  }
  #mlcad-sidebar.mlcad-sidebar--collapsed #mlcad-toolbar .mlcad-tool-separator {
    display: none;
  }

  #mlcad-snap-strip-wrap,
  #mlcad-measure-strip-wrap,
  #mlcad-markup-strip-wrap,
  #mlcad-zoom-strip-wrap,
  #mlcad-settings-strip-wrap,
  #mlcad-locale-strip-wrap {
    flex-shrink: 0;
    min-width: 0;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: var(--mlcad-drawer-gap);
  }
  #mlcad-snap-strip-wrap[hidden],
  #mlcad-measure-strip-wrap[hidden],
  #mlcad-markup-strip-wrap[hidden],
  #mlcad-zoom-strip-wrap[hidden],
  #mlcad-settings-strip-wrap[hidden],
  #mlcad-locale-strip-wrap[hidden] { display: none; }

  #mlcad-snap-strip,
  #mlcad-measure-strip,
  #mlcad-markup-strip,
  #mlcad-zoom-strip,
  #mlcad-settings-strip,
  #mlcad-locale-strip {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
    padding: 6px;
    background: var(--mlcad-ui-bg);
    border: 1px solid var(--mlcad-ui-border);
    border-radius: 8px;
    box-shadow: var(--mlcad-shadow);
    backdrop-filter: blur(12px);
  }
  /* Pad/desktop: same button size as the parent bar so a vertical strip
     matches its width and a horizontal strip matches its height. */
  #mlcad-snap-strip .mlcad-tool-btn,
  #mlcad-measure-strip .mlcad-tool-btn,
  #mlcad-markup-strip .mlcad-tool-btn,
  #mlcad-zoom-strip .mlcad-tool-btn,
  #mlcad-settings-strip .mlcad-tool-btn,
  #mlcad-locale-strip .mlcad-tool-btn {
    width: var(--mlcad-toolbar-width);
    height: var(--mlcad-toolbar-width);
  }
  #mlcad-measure-strip .mlcad-tool-separator,
  #mlcad-markup-strip .mlcad-tool-separator {
    margin: 2px 4px;
  }

  #mlcad-polar-angles {
    flex-shrink: 0;
    display: inline-flex;
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
    padding: 6px;
    max-width: min(280px, calc(100vw - 2 * var(--mlcad-ui-inset) - 3 * var(--mlcad-toolbar-width) - 3 * var(--mlcad-drawer-gap)));
    background: var(--mlcad-ui-bg);
    border: 1px solid var(--mlcad-ui-border);
    border-radius: 8px;
    box-shadow: var(--mlcad-shadow);
    backdrop-filter: blur(12px);
  }
  #mlcad-polar-angles[hidden] { display: none; }

  .mlcad-color-input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
  }
  .mlcad-settings-option-btn {
    width: 100%;
    box-sizing: border-box;
    height: var(--mlcad-toolbar-width);
    justify-content: flex-start;
    gap: 8px;
    padding: 0 10px;
    font-size: 11px;
    font-weight: 500;
  }
  .mlcad-settings-option-indicator {
    flex-shrink: 0;
    width: 10px;
    height: 10px;
    border: 1px solid var(--mlcad-ui-muted);
    border-radius: 2px;
    box-sizing: border-box;
    transition: background 0.15s ease, border-color 0.15s ease;
  }
  .mlcad-settings-option-btn.active .mlcad-settings-option-indicator {
    background: var(--mlcad-accent);
    border-color: var(--mlcad-accent);
  }
  .mlcad-settings-option-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    pointer-events: none;
    line-height: 1.2;
  }

  #mlcad-measure-overlays {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: var(--mlcad-z-measure);
    overflow: hidden;
  }
  .mlcad-measure-canvas {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    pointer-events: none;
  }
  .mlcad-measure-dot {
    position: absolute;
    z-index: 3;
    /* em size tracks the paired badge font-size (set inline on the dot) */
    font-size: 12px;
    width: 0.55em;
    height: 0.55em;
    min-width: 5px;
    min-height: 5px;
    border-radius: 50%;
    background: var(--mlcad-measure-accent);
    border: 0.12em solid rgba(255, 255, 255, 0.9);
    box-sizing: border-box;
    transform: translate(-50%, -50%);
    visibility: hidden;
    pointer-events: none;
    cursor: grab;
  }
  .mlcad-measure-dot.mlcad-measure-selected {
    visibility: visible;
    pointer-events: auto;
    /* Hard ring at half original em thickness + soft glow */
    box-shadow:
      0 0 0 0.06em rgba(255, 213, 79, 0.75),
      0 0 0.35em rgba(255, 213, 79, 0.9),
      0 0 0.7em rgba(255, 213, 79, 0.5);
  }
  #mlcad-measure-overlays.mlcad-grip-dragging .mlcad-measure-dot {
    visibility: hidden !important;
    pointer-events: none !important;
  }
  .mlcad-measure-badge {
    position: absolute;
    z-index: 2;
    /* em padding/radius/border so the capsule scales with font-size */
    padding: 0.25em 0.833em;
    border-radius: 1.167em;
    background: var(--mlcad-ui-bg-elevated);
    border: 0.083em solid var(--mlcad-measure-accent-border);
    color: var(--mlcad-measure-accent);
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    transform: translate(-50%, -50%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
    pointer-events: none;
  }
  .mlcad-measure-badge--coordinate {
    transform: translate(-50%, calc(-50% - 16px));
  }
  .mlcad-measure-badge.mlcad-measure-selected {
    /* Hard ring at half original em thickness + soft glow */
    outline: 0.075em solid rgba(255, 213, 79, 0.85);
    outline-offset: 0.04em;
    box-shadow:
      0 0 0 0.075em rgba(255, 213, 79, 0.4),
      0 0 0.45em rgba(255, 213, 79, 0.85),
      0 0 0.9em rgba(255, 213, 79, 0.55),
      0 2px 8px rgba(0, 0, 0, 0.35);
  }
  .mlcad-measure-canvas.mlcad-measure-selected {
    /* font-size is seeded from the paired badge so em tracks text size */
    filter:
      drop-shadow(0 0 0.12em #ffd54f)
      drop-shadow(0 0 0.3em rgba(255, 213, 79, 0.95))
      drop-shadow(0 0 0.6em rgba(255, 213, 79, 0.55));
  }

  #mlcad-markup-overlays {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: var(--mlcad-z-markup);
    overflow: hidden;
  }
  .mlcad-markup-canvas {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    pointer-events: none;
  }
  .mlcad-markup-badge,
  .mlcad-markup-stamp {
    position: absolute;
    z-index: 2;
    padding: 3px 10px;
    border-radius: 14px;
    background: var(--mlcad-ui-bg-elevated);
    border: 1px solid var(--mlcad-markup-accent-border);
    color: var(--mlcad-markup-accent);
    font-size: 12px;
    font-weight: 600;
    white-space: pre-wrap;
    max-width: 240px;
    min-width: 80px;
    min-height: 1.75em;
    box-sizing: border-box;
    transform: translate(-50%, -50%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
    pointer-events: auto;
    cursor: grab;
    touch-action: none;
    user-select: none;
  }
  .mlcad-markup-stamp {
    border-radius: 4px;
    border-width: 2px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-size: 11px;
    white-space: nowrap;
    min-width: 0;
  }
  .mlcad-markup-preview-dot {
    position: absolute;
    font-size: 12px;
    width: 0.55em;
    height: 0.55em;
    min-width: 5px;
    min-height: 5px;
    border-radius: 50%;
    background: var(--mlcad-markup-accent);
    border: 0.12em solid rgba(255, 255, 255, 0.9);
    box-sizing: border-box;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
  .mlcad-markup-dot {
    position: absolute;
    z-index: 3;
    font-size: 12px;
    width: 0.55em;
    height: 0.55em;
    min-width: 5px;
    min-height: 5px;
    border-radius: 50%;
    background: var(--mlcad-markup-accent);
    border: 0.12em solid rgba(255, 255, 255, 0.9);
    box-sizing: border-box;
    transform: translate(-50%, -50%);
    visibility: hidden;
    pointer-events: none;
    cursor: grab;
  }
  .mlcad-markup-dot.mlcad-markup-selected {
    visibility: visible;
    pointer-events: auto;
    box-shadow:
      0 0 0 0.06em rgba(255, 213, 79, 0.75),
      0 0 0.35em rgba(255, 213, 79, 0.9),
      0 0 0.7em rgba(255, 213, 79, 0.5);
  }
  #mlcad-markup-overlays.mlcad-grip-dragging .mlcad-markup-dot {
    visibility: hidden !important;
    pointer-events: none !important;
  }
  .mlcad-markup-badge.mlcad-markup-selected,
  .mlcad-markup-stamp.mlcad-markup-selected {
    outline: 0.075em solid rgba(255, 213, 79, 0.85);
    outline-offset: 0.04em;
    box-shadow:
      0 0 0 0.075em rgba(255, 213, 79, 0.4),
      0 0 0.45em rgba(255, 213, 79, 0.85),
      0 0 0.9em rgba(255, 213, 79, 0.55),
      0 2px 8px rgba(0, 0, 0, 0.35);
  }
  .mlcad-markup-canvas.mlcad-markup-selected {
    filter:
      drop-shadow(0 0 0.12em #ffd54f)
      drop-shadow(0 0 0.3em rgba(255, 213, 79, 0.95))
      drop-shadow(0 0 0.6em rgba(255, 213, 79, 0.55));
  }

  #mlcad-loading {
    position: fixed; inset: 0; z-index: 100;
    display: flex; align-items: center; justify-content: center;
    background: #121418;
    transition: opacity 0.35s ease, visibility 0.35s ease;
  }
  #mlcad-loading.mlcad-loading--done {
    opacity: 0; visibility: hidden; pointer-events: none;
  }
  #mlcad-loading.mlcad-loading--gate .mlcad-loading-spinner {
    display: none;
  }
  .mlcad-loading-spinner {
    width: 48px; height: 48px; box-sizing: border-box;
    border: 3px solid rgba(255, 255, 255, 0.12);
    border-top-color: var(--mlcad-accent);
    border-radius: 50%;
    animation: mlcad-spin 0.85s linear infinite;
  }
  @keyframes mlcad-spin { to { transform: rotate(360deg); } }

  #mlcad-access-gate {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 360px;
    padding: 0 20px;
    box-sizing: border-box;
  }
  #mlcad-access-gate[hidden] {
    display: none !important;
  }
  .mlcad-access-card {
    width: 100%;
    padding: 24px 20px;
    border-radius: 10px;
    border: 1px solid var(--mlcad-ui-border);
    background: var(--mlcad-ui-bg-elevated);
    box-shadow: var(--mlcad-shadow);
    box-sizing: border-box;
  }
  .mlcad-access-title {
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: 600;
    color: var(--mlcad-ui-text);
    text-align: center;
  }
  .mlcad-access-hint {
    margin: 0 0 16px;
    font-size: 13px;
    line-height: 1.45;
    color: var(--mlcad-ui-muted);
    text-align: center;
  }
  .mlcad-access-expiry {
    margin: -8px 0 16px;
    font-size: 12px;
    line-height: 1.4;
    color: var(--mlcad-ui-muted);
    text-align: center;
  }
  .mlcad-access-expiry[hidden] {
    display: none;
  }
  .mlcad-access-expiry.mlcad-expiry-countdown {
    width: fit-content;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 16px;
    padding: 6px 10px;
    border-radius: 6px;
    box-sizing: border-box;
  }
  .mlcad-access-field {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }
  .mlcad-access-field input {
    flex: 1 1 auto;
    min-width: 0;
    height: 36px;
    padding: 0 12px;
    border-radius: 6px;
    border: 1px solid var(--mlcad-ui-border);
    background: rgba(0, 0, 0, 0.25);
    color: var(--mlcad-ui-text);
    font: inherit;
    box-sizing: border-box;
  }
  .mlcad-access-field input:focus {
    outline: none;
    border-color: color-mix(in srgb, var(--mlcad-accent-active) 65%, transparent);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--mlcad-accent-active) 20%, transparent);
  }
  .mlcad-access-submit {
    width: 100%;
    height: 36px;
    border: 1px solid color-mix(in srgb, var(--mlcad-accent-active) 55%, transparent);
    border-radius: 6px;
    background: color-mix(in srgb, var(--mlcad-accent-active) 22%, transparent);
    color: #fff;
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }
  .mlcad-access-submit:hover {
    background: color-mix(in srgb, var(--mlcad-accent-active) 32%, transparent);
  }
  .mlcad-access-error {
    margin: 0;
    font-size: 12px;
    line-height: 1.4;
    color: #ff8a80;
    text-align: center;
  }
  .mlcad-access-error[hidden] {
    display: none;
  }
  .mlcad-access-gate--locked .mlcad-access-submit:disabled,
  .mlcad-access-gate--locked .mlcad-access-field input:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
  .mlcad-access-field[hidden],
  .mlcad-access-submit[hidden],
  .mlcad-access-gate--expired .mlcad-access-field,
  .mlcad-access-gate--expired .mlcad-access-submit,
  .mlcad-access-gate--expired #mlcad-access-expiry,
  .mlcad-access-gate--expired #mlcad-access-error {
    display: none !important;
  }
  .mlcad-expiry-badge {
    position: relative;
    flex: 0 0 auto;
    margin-left: auto;
    max-width: none;
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid var(--mlcad-ui-border);
    background: var(--mlcad-ui-bg-elevated);
    box-shadow: var(--mlcad-shadow);
    color: var(--mlcad-ui-text);
    font-size: 12px;
    line-height: 1.4;
    white-space: nowrap;
    pointer-events: none;
    box-sizing: border-box;
  }
  .mlcad-expiry-badge[hidden] {
    display: none !important;
  }
  .mlcad-expiry-countdown {
    border-color: rgba(255, 152, 0, 0.55);
    background: rgba(255, 152, 0, 0.16);
    color: #ffcc80;
    font-variant-numeric: tabular-nums;
  }

  @media (max-width: ${ra}px) {
    :root {
      --mlcad-drawer-width: min(280px, calc(100vw - 16px));
      --mlcad-ui-inset: 0px;
      --mlcad-toolbar-phone-height: 56px;
      /* Portrait min width (narrower than simple-ui's height - 4). */
      --mlcad-toolbar-phone-btn-size: max(
        24px,
        calc(var(--mlcad-toolbar-phone-height) - 16px)
      );
    }
    #mlcad-root {
      display: flex;
      flex-direction: column;
    }
    #mlcad-canvas-host {
      position: relative;
      flex: 1 1 auto;
      inset: auto;
      width: 100%;
      min-height: 0;
    }
    #mlcad-sidebar {
      position: relative;
      left: auto;
      top: auto;
      right: auto;
      transform: none;
      width: 100%;
      max-width: none;
      flex: 0 0 auto;
      flex-direction: column-reverse;
      align-items: stretch;
      gap: 0;
      overflow: visible;
    }
    #mlcad-toolbar {
      flex-direction: row;
      width: 100%;
      box-sizing: border-box;
      gap: 0;
      padding: 4px 0;
      border-radius: 0;
      border-left: none;
      border-right: none;
      border-bottom: none;
    }
    #mlcad-toolbar .mlcad-tool-btn {
      flex: 1 1 0;
      width: auto;
      min-width: 0;
      height: auto;
      min-height: var(--mlcad-toolbar-phone-height);
      border-radius: 0;
      padding: 4px 2px;
    }
    #mlcad-toolbar .mlcad-tool-btn-label,
    #mlcad-zoom-strip .mlcad-tool-btn-label,
    #mlcad-measure-strip .mlcad-tool-btn-label,
    #mlcad-markup-strip .mlcad-tool-btn-label,
    #mlcad-settings-strip .mlcad-tool-btn-label,
    #mlcad-locale-strip .mlcad-tool-btn-label,
    #mlcad-snap-strip .mlcad-tool-btn-label {
      display: block;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    /* Drop sticky :focus / touch :hover chrome after closing a strip. */
    #mlcad-toolbar .mlcad-tool-btn:focus,
    #mlcad-toolbar .mlcad-tool-btn:focus-visible {
      outline: none;
    }
    #mlcad-toolbar .mlcad-tool-btn:focus:not(.active):not(.is-menu-open),
    #mlcad-toolbar .mlcad-tool-btn:focus-visible:not(.active):not(.is-menu-open) {
      background: transparent;
      border-color: transparent;
    }
    @media (hover: none) {
      #mlcad-toolbar .mlcad-tool-btn:hover:not(.active):not(.is-menu-open) {
        background: transparent;
        border-color: transparent;
      }
    }
    .mlcad-tool-btn.has-children::after {
      display: none;
    }
    #mlcad-toolbar-toggle,
    #mlcad-toolbar .mlcad-tool-separator {
      display: none !important;
    }
    /* Float above the bottom bar so the wrap does not occupy an in-flow
       rectangle of page background around the rounded strip. */
    #mlcad-sidebar > #mlcad-snap-strip-wrap,
    #mlcad-sidebar > #mlcad-measure-strip-wrap,
    #mlcad-sidebar > #mlcad-markup-strip-wrap,
    #mlcad-sidebar > #mlcad-zoom-strip-wrap,
    #mlcad-sidebar > #mlcad-settings-strip-wrap,
    #mlcad-sidebar > #mlcad-locale-strip-wrap {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 100%;
      width: auto;
      flex-direction: column;
      align-items: stretch;
      background: none;
      box-shadow: none;
      backdrop-filter: none;
      overflow: visible;
      pointer-events: none;
      z-index: calc(var(--mlcad-z-chrome) + 1);
    }
    #mlcad-settings-strip-wrap:not([hidden]) {
      display: flex !important;
    }
    #mlcad-snap-strip,
    #mlcad-measure-strip,
    #mlcad-markup-strip,
    #mlcad-zoom-strip,
    #mlcad-settings-strip,
    #mlcad-locale-strip {
      display: grid;
      /* Fallback before wrap-pack JS: auto-fit stretches a short strip evenly.
         JS then sets an explicit column count so wrapped last rows stay narrow. */
      grid-template-columns: repeat(
        auto-fit,
        minmax(var(--mlcad-toolbar-phone-btn-size), 1fr)
      );
      justify-content: start;
      align-content: flex-start;
      width: auto;
      box-sizing: border-box;
      gap: 0;
      margin: 4px 8px 8px;
      padding: 4px 0;
      border-radius: 8px;
      /* Match active toolbar button outline. */
      border: 1px solid var(--mlcad-tool-btn-active-border);
      box-shadow: none;
      backdrop-filter: none;
      overflow: hidden;
      isolation: isolate;
      clip-path: inset(0 round 8px);
      pointer-events: auto;
    }
    #mlcad-snap-strip .mlcad-tool-btn,
    #mlcad-measure-strip .mlcad-tool-btn,
    #mlcad-markup-strip .mlcad-tool-btn,
    #mlcad-zoom-strip .mlcad-tool-btn,
    #mlcad-settings-strip .mlcad-tool-btn,
    #mlcad-locale-strip .mlcad-tool-btn {
      width: 100%;
      min-width: 0;
      height: auto;
      min-height: var(--mlcad-toolbar-phone-height);
      border-radius: 0;
      padding: 4px 2px;
      box-sizing: border-box;
    }
    #mlcad-measure-strip .mlcad-tool-separator,
    #mlcad-markup-strip .mlcad-tool-separator {
      display: none;
    }
    #mlcad-polar-angles {
      flex-direction: row;
      flex-wrap: wrap;
      max-width: none;
      width: 100%;
      box-sizing: border-box;
      border-radius: 0;
      pointer-events: auto;
    }
    #mlcad-layer-drawer,
    #mlcad-review-drawer,
    #mlcad-measure-drawer {
      position: fixed;
      left: 0;
      right: 0;
      bottom: var(--mlcad-phone-drawer-bottom, var(--mlcad-toolbar-phone-height));
      top: auto;
      margin: 0;
      width: 100%;
      max-width: none;
      height: min(42vh, calc(100vh - var(--mlcad-phone-drawer-bottom, var(--mlcad-toolbar-phone-height)) - 12px));
      max-height: calc(100vh - var(--mlcad-phone-drawer-bottom, var(--mlcad-toolbar-phone-height)) - 12px);
      z-index: calc(var(--mlcad-z-chrome) + 1);
      border-radius: 12px 12px 0 0;
      pointer-events: auto;
    }
    #mlcad-layer-drawer .mlcad-drawer-sheet-chrome,
    #mlcad-review-drawer .mlcad-drawer-sheet-chrome,
    #mlcad-measure-drawer .mlcad-drawer-sheet-chrome {
      display: flex;
      align-items: center;
      flex: 0 0 auto;
      min-height: 28px;
    }
    #mlcad-layer-drawer .mlcad-drawer-header,
    #mlcad-review-drawer .mlcad-drawer-header,
    #mlcad-measure-drawer .mlcad-drawer-header {
      display: none;
    }
    .mlcad-layer-action-btn {
      min-height: 28px;
      padding: 3px 6px;
      font-size: 11px;
      gap: 4px;
    }
    .mlcad-layer-action-btn svg { width: 12px; height: 12px; }
    .mlcad-layer-zoom {
      width: 20px;
      height: 20px;
    }
    .mlcad-layer-zoom svg {
      width: 12px;
      height: 12px;
    }
    #mlcad-top-chrome {
      left: 8px;
      right: 8px;
      top: 8px;
    }

  }

  /* Pad / coarse pointer: same toolbar as desktop, minus select and pan. */
  @media (max-width: ${na}px), (pointer: coarse) {
    #mlcad-toolbar [data-action="select"],
    #mlcad-toolbar [data-action="pan"] {
      display: none !important;
    }
  }

  /*
   * Hide toolbar chrome during measure / markup without changing canvas size.
   * On phone the sidebar is in the flex column; display:none would expand
   * #mlcad-canvas-host and shift the drawing. Session panel floats on top.
   */
  #mlcad-root.mlcad-session-active #mlcad-sidebar {
    visibility: hidden !important;
    pointer-events: none !important;
  }
`;function te(t,e="measure",r=!0){const n=e==="measure"?`${ea()}${Xs()}${Vs()}`:"";return`
  <div id="mlcad-loading" aria-hidden="true" style="background:${t}">
    <div class="mlcad-loading-spinner"></div>
    <div id="mlcad-access-gate" hidden>
      <form id="mlcad-access-form" class="mlcad-access-card">
        <h2 class="mlcad-access-title" data-i18n-key="access.title" data-i18n-text>Protected drawing</h2>
        <p class="mlcad-access-hint" data-i18n-key="access.passwordPrompt" data-i18n-text>Enter the password to open this file.</p>
        <p id="mlcad-access-expiry" class="mlcad-access-expiry" hidden></p>
        <div class="mlcad-access-field">
          <input
            id="mlcad-access-password"
            type="password"
            autocomplete="off"
            data-i18n-key="access.passwordPlaceholder"
            data-i18n-attr="placeholder aria-label"
            placeholder="Password"
            aria-label="Password"
          />
        </div>
        <button type="submit" class="mlcad-access-submit" data-i18n-key="access.unlock" data-i18n-text>Unlock</button>
        <p id="mlcad-access-error" class="mlcad-access-error" hidden></p>
      </form>
    </div>
  </div>
  <div id="mlcad-root">
    <div id="mlcad-canvas-host">
      <div id="mlcad-top-chrome">
        <footer id="mlcad-status-bar" aria-live="polite" hidden></footer>
      </div>
    </div>
    <aside id="mlcad-sidebar">
      <nav id="mlcad-toolbar" data-i18n-attr="aria-label" data-i18n-key="toolbar.viewerTools" aria-label="Viewer tools"></nav>
      ${n}
      <div id="mlcad-layer-drawer" role="dialog" data-i18n-attr="aria-label" data-i18n-key="layers.title" aria-label="Layers" hidden>
        ${or("mlcad-layer-sheet-close","layers.close","Close layers")}
        <div class="mlcad-drawer-header">
          <span data-i18n-key="layers.title" data-i18n-text>Layers</span>
          <button type="button" class="mlcad-drawer-close" id="mlcad-layer-close" data-i18n-key="layers.close" data-i18n-attr="aria-label" aria-label="Close layers">×</button>
        </div>
        <div class="mlcad-layer-actions">
          <button type="button" class="mlcad-layer-action-btn" id="mlcad-layer-show-all">
            ${$t.layerOn}<span data-i18n-key="layers.showAll" data-i18n-text>Show all</span>
          </button>
          <button type="button" class="mlcad-layer-action-btn" id="mlcad-layer-hide-all">
            ${$t.layerOff}<span data-i18n-key="layers.hideAll" data-i18n-text>Hide all</span>
          </button>
        </div>
        <div id="mlcad-layer-list"></div>
      </div>
    </aside>
  </div>
`}function or(t,e,r){return`<div class="mlcad-drawer-sheet-chrome">
          <div class="mlcad-drawer-grabber" role="separator" aria-orientation="horizontal"></div>
          <button type="button" class="mlcad-drawer-sheet-close" id="${t}" data-i18n-key="${e}" data-i18n-attr="aria-label" aria-label="${r}">${$t.chevronDown}</button>
        </div>`}function Vs(){return`<div id="mlcad-review-drawer" role="dialog" data-i18n-attr="aria-label" data-i18n-key="review.title" aria-label="Review" hidden>
        ${or("mlcad-review-sheet-close","review.close","Close review")}
        <div class="mlcad-drawer-header">
          <span data-i18n-key="review.title" data-i18n-text>Review</span>
          <button type="button" class="mlcad-drawer-close" id="mlcad-review-close" data-i18n-key="review.close" data-i18n-attr="aria-label" aria-label="Close review">×</button>
        </div>
        <div class="mlcad-review-toolbar">
          <input type="search" class="mlcad-review-search" data-i18n-key="review.searchPlaceholder" data-i18n-attr="placeholder" placeholder="Search markups" />
          <button type="button" class="mlcad-review-clear" data-i18n-key="review.clear" data-i18n-text>Clear all</button>
        </div>
        <div class="mlcad-review-table-wrap">
          <table class="mlcad-review-table">
            <thead>
              <tr>
                <th data-review-col="type" data-i18n-key="review.type" data-i18n-text>Type</th>
                <th data-review-col="status" data-i18n-key="review.status" data-i18n-text>Status</th>
                <th data-review-col="author" data-i18n-key="review.author" data-i18n-text>Author</th>
                <th data-review-col="summary" data-i18n-key="review.summary" data-i18n-text>Summary</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
        <div class="mlcad-review-detail" hidden>
          <div class="mlcad-review-detail-header">
            <div class="mlcad-review-detail-title" data-i18n-key="review.details" data-i18n-text>Details</div>
            <button type="button" class="mlcad-review-detail-close" data-i18n-key="review.closeDetails" data-i18n-attr="title aria-label" title="Close details" aria-label="Close details">×</button>
          </div>
          <div class="mlcad-review-field">
            <label class="mlcad-review-field-label" data-review-field="status" data-i18n-key="review.status" data-i18n-text>Status</label>
            <select class="mlcad-review-status"></select>
          </div>
          <div class="mlcad-review-field">
            <label class="mlcad-review-field-label" data-review-field="author" data-i18n-key="review.author" data-i18n-text>Author</label>
            <input type="text" class="mlcad-review-author" disabled />
          </div>
          <div class="mlcad-review-field">
            <label class="mlcad-review-field-label" data-review-field="label" data-i18n-key="review.label" data-i18n-text>Label</label>
            <input type="text" class="mlcad-review-text" />
          </div>
          <div class="mlcad-review-field">
            <label class="mlcad-review-field-label" data-review-field="comment" data-i18n-key="review.comment" data-i18n-text>Comment</label>
            <textarea class="mlcad-review-comment" rows="2"></textarea>
          </div>
          <div class="mlcad-review-detail-actions">
            <button type="button" class="mlcad-review-zoom" data-i18n-key="review.zoomTo" data-i18n-text>Zoom to</button>
            <button type="button" class="mlcad-review-delete" data-i18n-key="review.delete" data-i18n-text>Delete</button>
          </div>
        </div>
      </div>`}function Xs(){return`<div id="mlcad-measure-drawer" role="dialog" data-i18n-attr="aria-label" data-i18n-key="measurePanel.title" aria-label="Measurements" hidden>
        ${or("mlcad-measure-sheet-close","measurePanel.close","Close measurements")}
        <div class="mlcad-drawer-header">
          <span data-i18n-key="measurePanel.title" data-i18n-text>Measurements</span>
          <button type="button" class="mlcad-drawer-close" id="mlcad-measure-close" data-i18n-key="measurePanel.close" data-i18n-attr="aria-label" aria-label="Close measurements">×</button>
        </div>
        <div class="mlcad-measure-toolbar">
          <div class="mlcad-measure-filter" role="group" data-i18n-key="measurePanel.filterGroup" data-i18n-attr="aria-label" aria-label="Filter by type">
            <button type="button" class="mlcad-measure-filter-btn" data-measure-filter="distance" aria-pressed="false" data-i18n-key="measurePanel.filterDistance" data-i18n-text data-i18n-attr="title aria-label" title="Distance">Distance</button>
            <button type="button" class="mlcad-measure-filter-btn" data-measure-filter="arc" aria-pressed="false" data-i18n-key="measurePanel.filterArc" data-i18n-text data-i18n-attr="title aria-label" title="Arc">Arc</button>
            <button type="button" class="mlcad-measure-filter-btn" data-measure-filter="radius" aria-pressed="false" data-i18n-key="measurePanel.filterRadius" data-i18n-text data-i18n-attr="title aria-label" title="Radius">Radius</button>
            <button type="button" class="mlcad-measure-filter-btn" data-measure-filter="angle" aria-pressed="false" data-i18n-key="measurePanel.filterAngle" data-i18n-text data-i18n-attr="title aria-label" title="Angle">Angle</button>
            <button type="button" class="mlcad-measure-filter-btn" data-measure-filter="area" aria-pressed="false" data-i18n-key="measurePanel.filterArea" data-i18n-text data-i18n-attr="title aria-label" title="Area">Area</button>
          </div>
          <button type="button" class="mlcad-measure-clear" data-i18n-key="measurePanel.clear" data-i18n-text>Clear all</button>
        </div>
        <div class="mlcad-measure-table-wrap">
          <table class="mlcad-measure-table">
            <thead>
              <tr>
                <th data-measure-col="type" data-i18n-key="measurePanel.type" data-i18n-text>Type</th>
                <th data-measure-col="value" data-i18n-key="measurePanel.value" data-i18n-text>Value</th>
                <th></th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>`}function aa(t,e){var r;const n=e.title??t.meta.title??"CAD Drawing",a=e.encoded??qe(t),i=e.viewerRuntime,o=Mn(),s=a.compression,l=((r=e.accessManifest)==null?void 0:r.encrypted)===!0,c=`#${t.meta.background.toString(16).padStart(6,"0")}`,d=qt(t.meta.locale)??"en",u=t.meta.viewerMode??"measure",m=t.meta.exportLayouts!==!1,p=e.accessManifest?`  <script id="mlcad-access" type="application/json">${sa(JSON.stringify(e.accessManifest))}<\/script>
`:"",h=l?`${o}+aes-gcm;base85`:`${o}+${s};base85`;return`<!DOCTYPE html>
<html lang="${d}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="generator" content="mlightcad-cad-html-plugin" />
  <title>${ia(n)}</title>
  <style>${Qt}</style>
</head>
<body>
${te(c,u,m)}
${p}  <script id="mlcad-snapshot" type="${h}">${a.payload}<\/script>
  <script>${oa(i)}<\/script>
</body>
</html>`}function sr(t,e){var r;const n=e.title??t.meta.title??"CAD Drawing",a=e.viewerRuntime,i=`#${t.meta.background.toString(16).padStart(6,"0")}`,o=qt(t.meta.locale)??"en",s=t.meta.viewerMode??"measure",l=t.meta.exportLayouts!==!1,c=(r=e.manifestUrl)==null?void 0:r.trim(),d=JSON.stringify(c&&c!==Qn?{manifestUrl:c}:{});return`<!DOCTYPE html>
<html lang="${o}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="generator" content="mlightcad-cad-html-plugin" />
  <title>${ia(n)}</title>
  <style>${Qt}</style>
</head>
<body>
${te(i,s,l)}
  <script id="mlcad-package" type="application/json">${sa(d)}<\/script>
  <script>${oa(a)}<\/script>
</body>
</html>`}function ia(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function oa(t){return t.replace(/<\/script/gi,"<\\/script")}function sa(t){return t.replace(/</g,"\\u003c")}const Ys=1,Gs=1e5,Ws=16,Ks=12;function la(t,e=Date.now(),r){return t==="never"?null:t==="custom"?r??null:e+t*24*60*60*1e3}function lr(t){var e;const r=!!((e=t.password)!=null&&e.trim());return t.expiresAt!=null||r}function St(t){var e;if(!lr(t))return;const r=!!((e=t.password)!=null&&e.trim());return{v:Ys,expiresAt:t.expiresAt,encrypted:r,...r&&t.salt?{salt:t.salt}:{}}}async function cr(t,e){const r=crypto.getRandomValues(new Uint8Array(Ws));return{key:await Js(t,r),salt:ma(r)}}async function ee(t,e){const r=crypto.getRandomValues(new Uint8Array(Ks)),n=new Uint8Array(e),a=new Uint8Array(await crypto.subtle.encrypt({name:"AES-GCM",iv:r},t,n)),i=new Uint8Array(r.length+a.length);return i.set(r,0),i.set(a,r.length),i}async function ca(t,e,r="base85"){const{key:n,salt:a}=await cr(t),i=hn(e,r),o=await ee(n,i);return{encryptedPayload:Bt(o,r),salt:a}}function da(t){return ma(t)}async function ua(t,e){var r;if(!lr(e))return{encoded:t};const n=(r=e.password)==null?void 0:r.trim();if(n){const{encryptedPayload:a,salt:i}=await ca(n,t.payload);return{encoded:{payload:a,compression:t.compression},manifest:St({expiresAt:e.expiresAt,password:n,salt:i})}}return{encoded:t,manifest:St({expiresAt:e.expiresAt})}}async function Js(t,e){const r=new TextEncoder,n=await crypto.subtle.importKey("raw",r.encode(t),"PBKDF2",!1,["deriveKey"]);return crypto.subtle.deriveKey({name:"PBKDF2",salt:new Uint8Array(e),iterations:Gs,hash:"SHA-256"},n,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}function ma(t){let e="";for(let r=0;r<t.length;r++)e+=String.fromCharCode(t[r]);return btoa(e)}const Zs=256;function pa(t,e=Lt){return!(e>0)||Xt(t)<=e?[t]:t.indices&&t.indices.length>=2?Qs(t,e):qs(t,e)}function ha(t,e=Lt){return t.texture?[t]:!(e>0)||Yt(t)<=e?[t]:t.points?el(t,e):!t.indices||t.indices.length<3?ga(t,e):nl(t,e)}function fa(t){return t.linePattern?64+t.linePattern.pattern.length*8:0}function dr(t){return(t.hatchPattern?128:0)+(t.gradientFill?64:0)}function Pt(t,e,r){const n=t-Zs-e;return n<r?1:Math.max(1,Math.floor(n/r))}function qs(t,e){var r;const n=(((r=t.lineDistances)==null?void 0:r.length)??0)>=2,a=24+(n?8:0),i=Pt(e,fa(t),a),o=t.positions.length/6|0;if(o<=1)return[t];const s=[];for(let l=0;l<o;l+=i){const c=Math.min(i,o-l),d=l*6,u={layer:t.layer,color:t.color,offset:t.offset,positions:t.positions.slice(d,d+c*6)};if(xa(t,u),n&&t.lineDistances){const m=l*2;u.lineDistances=t.lineDistances.slice(m,m+c*2)}s.push(u)}return s.length>0?s:[t]}function Qs(t,e){var r;const n=t.indices,a=32+((((r=t.lineDistances)==null?void 0:r.length)??0)>0?8:0),i=Pt(e,fa(t),a),o=[];for(let s=0;s+1<n.length;){const l=Math.min(i*2,n.length-s),c=l-l%2;if(c<2)break;o.push(tl(t,s,c)),s+=c}return o.length>0?o:[t]}function tl(t,e,r){const n=wa(t.positions,t.indices.subarray(e,e+r),t.lineDistances?[t.lineDistances]:[],[1]),a={layer:t.layer,color:t.color,offset:t.offset,positions:n.positions,indices:n.indices};return xa(t,a),n.attributes[0]&&n.attributes[0].length>0&&(a.lineDistances=n.attributes[0]),a}function el(t,e){return t.indices&&t.indices.length>0?rl(t,e):ga(t,e)}function rl(t,e){const r=t.indices,n=16+(t.uvs?8:0)+(t.gradientPositions?8:0),a=Pt(e,dr(t),n),i=[];for(let o=0;o<r.length;){const s=Math.min(a,r.length-o);if(s<1)break;i.push(ba(t,o,s)),o+=s}return i.length>0?i:[t]}function ga(t,e){const r=t.positions.length/3|0;if(r<=1)return[t];const n=12+(t.uvs?8:0)+(t.gradientPositions?8:0),a=Pt(e,dr(t),n),i=t.points?1:3,o=Math.max(i,a-a%i),s=[];for(let l=0;l<r;l+=o){const c=Math.min(o,r-l),d=c-c%i;if(d<i)break;s.push(al(t,l,d))}return s.length>0?s:[t]}function nl(t,e){const r=t.indices,n=48+(t.uvs?24:0)+(t.gradientPositions?24:0),a=Pt(e,dr(t),n),i=[];for(let o=0;o+2<r.length;){const s=Math.min(a*3,r.length-o),l=s-s%3;if(l<3)break;i.push(ba(t,o,l)),o+=l}return i.length>0?i:[t]}function al(t,e,r){const n=e*3,a={layer:t.layer,color:t.color,offset:t.offset,positions:t.positions.slice(n,n+r*3)};return ya(t,a),t.uvs&&(a.uvs=t.uvs.slice(e*2,(e+r)*2)),t.gradientPositions&&(a.gradientPositions=t.gradientPositions.slice(e*2,(e+r)*2)),a}function ba(t,e,r){const n=[],a=[];t.uvs&&(n.push(t.uvs),a.push(2)),t.gradientPositions&&(n.push(t.gradientPositions),a.push(2));const i=wa(t.positions,t.indices.subarray(e,e+r),n,a),o={layer:t.layer,color:t.color,offset:t.offset,positions:i.positions,indices:i.indices};ya(t,o);let s=0;return t.uvs&&(o.uvs=i.attributes[s++]),t.gradientPositions&&(o.gradientPositions=i.attributes[s]),o}function wa(t,e,r,n){const a=new Map,i=[],o=new Uint32Array(e.length),s=r.map(()=>[]);for(let l=0;l<e.length;l++){const c=e[l];let d=a.get(c);if(d==null){d=a.size,a.set(c,d);const u=c*3;i.push(t[u]??0,t[u+1]??0,t[u+2]??0);for(let m=0;m<r.length;m++){const p=n[m],h=r[m],f=c*p;for(let g=0;g<p;g++)s[m].push(h[f+g]??0)}}o[l]=d}return{positions:Float32Array.from(i),indices:o,attributes:s.map(l=>Float32Array.from(l))}}function xa(t,e){t.linePattern&&(e.linePattern=t.linePattern),t.lineWidth!=null&&(e.lineWidth=t.lineWidth),t.renderOrder!=null&&(e.renderOrder=t.renderOrder),t.excludeFromOsnap&&(e.excludeFromOsnap=!0)}function ya(t,e){t.hatchPattern&&(e.hatchPattern=t.hatchPattern),t.gradientFill&&(e.gradientFill=t.gradientFill),t.side!=null&&(e.side=t.side),t.renderOrder!=null&&(e.renderOrder=t.renderOrder),t.points&&(e.points=!0)}function va(t,e,r=Lt){const n=[];let a={lineBatches:[],meshBatches:[],estimatedBytes:64};const i=()=>{a.lineBatches.length===0&&a.meshBatches.length===0&&n.length>0||(n.push(a),a={lineBatches:[],meshBatches:[],estimatedBytes:64})},o=c=>{const d=Xt(c);a.estimatedBytes+d>e&&(a.lineBatches.length>0||a.meshBatches.length>0)&&i(),a.lineBatches.push(c),a.estimatedBytes+=d},s=c=>{const d=Yt(c);a.estimatedBytes+d>e&&(a.lineBatches.length>0||a.meshBatches.length>0)&&i(),a.meshBatches.push(c),a.estimatedBytes+=d},l=Math.min(e,r);for(const c of t.lineBatches)for(const d of pa(c,l))o(d);for(const c of t.meshBatches)for(const d of ha(c,l))s(d);return(n.length===0||a.lineBatches.length>0||a.meshBatches.length>0)&&i(),n.length===0&&n.push({lineBatches:[],meshBatches:[],estimatedBytes:64}),n}function ka(t,e){if(t.version!==H)throw new Error(`Unsupported snapshot version: ${t.version}`);const r=e.maxChunkBytes??ar,n=e.maxBatchBytes??Lt,a=e.maxOsnapChunkBytes??r,i=e.compressChunks!==!1,o=i?"acex.gz":"acex",s=i?"osnap.gz":"osnap",l=It,c=ll(t.layouts,t.activeLayoutBtrId),d=[],u=[],m=new Map;return c.forEach((p,h)=>{var f;m.set(p.btrId,h);const g=va(p,r,n),w=[];g.forEach((x,F)=>{const C=`L${h}-${String(F).padStart(3,"0")}`,S=`chunks/${C}.${o}`;w.push(C),d.push({kind:"geometry",id:C,href:S,layoutBtrId:p.btrId,lineBatchCount:x.lineBatches.length,meshBatchCount:x.meshBatches.length,chunk:{version:H,layoutBtrId:p.btrId,lineBatches:x.lineBatches,meshBatches:x.meshBatches}})});const b={btrId:p.btrId,name:p.name,isModelSpace:p.isModelSpace,viewports:p.viewports,...p.savedView?{savedView:p.savedView}:{},chunkIds:w},A=(f=p.osnap)==null?void 0:f.primitives;if(A&&A.length>0){const x=vn(A,a),F=[];x.forEach((C,S)=>{const y=`L${h}-osnap-${String(S).padStart(3,"0")}`,v=`chunks/${y}.${s}`;F.push(y),d.push({kind:"osnap",id:y,href:v,layoutBtrId:p.btrId,primitiveCount:C.length,primitives:C})}),b.osnapChunkIds=F}u.push(b)}),{jobs:d,layoutRefs:u,layoutIndexByBtrId:m,manifestFileName:l,compressChunks:i}}function Aa(t,e,r,n,a){var i,o;const s=[],l=[],c=[];for(const w of a){const{job:b,uncompressedByteLength:A,compressed:x}=w;c.push({path:b.href,bytes:x}),b.kind==="geometry"?s.push({id:b.id,href:b.href,layoutBtrId:b.layoutBtrId,byteLength:A,compressedByteLength:x.byteLength,lineBatchCount:b.lineBatchCount,meshBatchCount:b.meshBatchCount}):l.push({id:b.id,href:b.href,layoutBtrId:b.layoutBtrId,byteLength:A,compressedByteLength:x.byteLength,primitiveCount:b.primitiveCount})}const d=t.layouts.map(w=>{const b=r.get(w.btrId);return e[b]}),u=new Set(((i=d.find(w=>w.btrId===t.activeLayoutBtrId))==null?void 0:i.chunkIds)??[]),m=[...s.filter(w=>u.has(w.id)),...s.filter(w=>!u.has(w.id))],p=new Set(((o=d.find(w=>w.btrId===t.activeLayoutBtrId))==null?void 0:o.osnapChunkIds)??[]),h=[...l.filter(w=>p.has(w.id)),...l.filter(w=>!p.has(w.id))],f={format:"acex-package",packageVersion:Jn,snapshotVersion:H,meta:t.meta,layers:t.layers,activeLayoutBtrId:t.activeLayoutBtrId,layouts:d,chunks:m,...h.length>0?{osnapChunks:h}:{}},g=`${JSON.stringify(f)}
`;return c.unshift({path:n,bytes:dt(g)}),{manifest:f,manifestFileName:n,files:c}}function il(t,e){if(t.kind==="geometry"){if(!e){const o=Et(t.chunk);return{job:t,uncompressedByteLength:o.byteLength,compressed:o}}const{uncompressed:a,compressed:i}=Kn(t.chunk);return{job:t,uncompressedByteLength:a.byteLength,compressed:i}}if(!e){const a=ht({primitives:t.primitives});return{job:t,uncompressedByteLength:a.byteLength,compressed:a}}const{uncompressed:r,compressed:n}=kn({primitives:t.primitives});return{job:t,uncompressedByteLength:r.byteLength,compressed:n}}async function ol(t,e){if(t.kind==="geometry"){if(!e){const o=Et(t.chunk);return{job:t,uncompressedByteLength:o.byteLength,compressed:o}}const{uncompressed:a,compressed:i}=await Hs(t.chunk);return{job:t,uncompressedByteLength:a.byteLength,compressed:i}}if(!e){const a=ht({primitives:t.primitives});return{job:t,uncompressedByteLength:a.byteLength,compressed:a}}const{uncompressed:r,compressed:n}=await No({primitives:t.primitives});return{job:t,uncompressedByteLength:r.byteLength,compressed:n}}function Ma(t,e={}){const{jobs:r,layoutRefs:n,layoutIndexByBtrId:a,manifestFileName:i,compressChunks:o}=ka(t,e),s=r.map(l=>il(l,o));return Aa(t,n,a,i,s)}async function ur(t,e={}){const{jobs:r,layoutRefs:n,layoutIndexByBtrId:a,manifestFileName:i,compressChunks:o}=ka(t,e),s=await Promise.all(r.map(l=>ol(l,o)));return Aa(t,n,a,i,s)}function sl(t,e){const r=Ma(t,e),n=sr(t,{title:t.meta.title,viewerRuntime:e.viewerRuntime,...e.manifestUrl?{manifestUrl:e.manifestUrl}:{}});return{html:n,manifest:r.manifest,manifestFileName:r.manifestFileName,files:[{path:"viewer.html",bytes:dt(n)},...r.files]}}async function Sa(t,e){const r=await ur(t,e),n=sr(t,{title:t.meta.title,viewerRuntime:e.viewerRuntime,...e.manifestUrl?{manifestUrl:e.manifestUrl}:{}});return{html:n,manifest:r.manifest,manifestFileName:r.manifestFileName,files:[{path:"viewer.html",bytes:dt(n)},...r.files]}}function ll(t,e){const r=t.find(a=>a.btrId===e),n=t.filter(a=>a.btrId!==e);return r?[r,...n]:[...t]}const Ca="application/vnd.mlightcad.acex-chunk;base85",Fa="application/vnd.mlightcad.acex-chunk+aes-gcm;base85",mr="data-acex-href";function Ba(t){var e;let r=0;for(const n of t.layouts){for(const i of n.lineBatches)r+=Xt(i);for(const i of n.meshBatches)r+=Yt(i);const a=(e=n.osnap)==null?void 0:e.primitives;if(a)for(const i of a)r+=Ze(i)}return r}function Ea(t,e=Zn){return Ba(t)>=e}async function La(t,e){var r;const n=e.title??t.meta.title??"CAD Drawing",a=e.viewerRuntime,i=`#${t.meta.background.toString(16).padStart(6,"0")}`,o=qt(t.meta.locale)??"en",s=t.meta.viewerMode??"measure",l=t.meta.exportLayouts!==!1,c=e.expiresAt??null,d=((r=e.password)==null?void 0:r.trim())||void 0,u={maxChunkBytes:e.maxChunkBytes??He,maxBatchBytes:e.maxBatchBytes??e.maxChunkBytes??He,maxOsnapChunkBytes:e.maxOsnapChunkBytes??qn},m=await ur(t,u);let p,h,f;if(d){const{key:w,salt:b}=await cr(d);p=St({expiresAt:c,password:d,salt:b});const A=new TextEncoder().encode(`${JSON.stringify(m.manifest)}
`),x=await ee(w,A);h={mode:"embedded",encrypted:!0,encryptedManifest:da(x)},f=await dl(m.files,w)}else p=St({expiresAt:c}),h={mode:"embedded",manifest:m.manifest},f=cl(m.files);const g=p?`  <script id="mlcad-access" type="application/json">${Yr(JSON.stringify(p))}<\/script>
`:"";return`<!DOCTYPE html>
<html lang="${o}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="generator" content="mlightcad-cad-html-plugin" />
  <title>${Ia(n)}</title>
  <style>${Qt}</style>
</head>
<body>
${te(i,s,l)}
${g}  <script id="mlcad-package" type="application/json">${Yr(JSON.stringify(h))}<\/script>
${f}  <script>${ul(a)}<\/script>
</body>
</html>`}function cl(t){const e=[];for(const r of t)r.path!==It&&e.push(`  <script type="${Ca}" ${mr}="${Pa(r.path)}">${Bt(r.bytes,"base85")}<\/script>
`);return e.join("")}async function dl(t,e){const r=[];for(const n of t){if(n.path===It)continue;const a=await ee(e,n.bytes);r.push(`  <script type="${Fa}" ${mr}="${Pa(n.path)}">${Bt(a,"base85")}<\/script>
`)}return r.join("")}function Ia(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Pa(t){return Ia(t).replace(/'/g,"&#39;")}function ul(t){return t.replace(/<\/script/gi,"<\\/script")}function Yr(t){return t.replace(/</g,"\\u003c")}function ml(t){return!t||t.startsWith("/")||t.includes("\\")||t.includes("\0")?!1:t.split("/").every(e=>e.length>0&&e!=="."&&e!==".."&&/^[A-Za-z0-9._-]+$/.test(e))}function pl(t){return t.endsWith(".gz")}function za(t){const e={};for(const r of t.files){if(!ml(r.path))throw new Error(`Unsafe package path: ${r.path}`);pl(r.path)?e[r.path]=[r.bytes,{level:0}]:e[r.path]=[r.bytes,{level:6}]}return So(e)}const pr="https://mlightcad.com/cad-viewer/docs/";let Da=fr(pr);function hr(){return Da}function Ua(t){Da=fr(t)}function fr(t){const e=t.trim();return e?e.replace(/\/+$/,""):pr.replace(/\/+$/,"")}function Na(){return{minX:0,minY:0,maxX:0,maxY:0,valid:!1}}function Ta(t,e,r){if(e.length<3)return;const n=r[0],a=r[1];for(let i=0;i+2<e.length;i+=3){const o=Ie(e[i],n),s=Ie(e[i+1],a);t.valid?(o<t.minX&&(t.minX=o),o>t.maxX&&(t.maxX=o),s<t.minY&&(t.minY=s),s>t.maxY&&(t.maxY=s)):(t.minX=t.maxX=o,t.minY=t.maxY=s,t.valid=!0)}}function Oe(t,e){Ta(t,e.positions,e.offset)}function _a(t){return t.valid?{minX:t.minX,minY:t.minY,maxX:t.maxX,maxY:t.maxY}:null}function Ra(t,e){const r=Na();for(const n of t)Oe(r,n);for(const n of e)Oe(r,n);return _a(r)}function gr(t,e){return t?e?{minX:Math.min(t.minX,e.minX),minY:Math.min(t.minY,e.minY),maxX:Math.max(t.maxX,e.maxX),maxY:Math.max(t.maxY,e.maxY)}:t:e??null}function Ha(t){if(!t||t.length===0)return null;let e=null;for(const r of t)e=gr(e,r.paper);return e}function Oa(t){return gr(Ra(t.lineBatches,t.meshBatches),Ha(t.viewports))}function $a(t,e,r){if(r)return;const n=fl(t,e);if(!(n!=null&&n.newIterator))return;const a=[];for(const i of n.newIterator()){if(!(i instanceof Mi)||ui.isDefaultPaperSpaceViewport(i)||typeof i.toGiViewport!="function")continue;const o=i.toGiViewport(),s=o.box,l=o.viewBox,c=Gr(s),d=Gr(l);if(!c||!d)continue;const u=Number.isFinite(o.viewTwistAngle)?o.viewTwistAngle:i.viewTwistAngle,m=hl(o,i),p={paper:c,model:d};Number.isFinite(u)&&Math.abs(u)>1e-12&&(p.twist=u),m.length>0&&(p.frozenLayers=m),a.push(p)}return a.length>0?a:void 0}function hl(t,e){var r;const n=t.frozenLayers;if(n&&n.length>0)return[...n];const a=e.frozenLayerIds;if(!(a!=null&&a.length))return[];const i=(r=e.database)==null?void 0:r.tables.layerTable;if(!i)return[];const o=[];for(const s of a){const l=i.getIdAt(s);l&&o.push(l.name)}return o}function Gr(t){if(typeof t.isEmpty=="function"&&t.isEmpty())return;const e=t.min.x,r=t.min.y,n=t.max.x,a=t.max.y;if(!(!Number.isFinite(e)||!Number.isFinite(r)||!Number.isFinite(n)||!Number.isFinite(a)||n-e<=0||a-r<=0))return{minX:e,minY:r,maxX:n,maxY:a}}function fl(t,e){var r;const n=(r=t.tables)==null?void 0:r.blockTable;if(!n)return;const a=typeof n.getIdAt=="function"?n.getIdAt(e):void 0;if(a)return a;if(typeof n.newIterator=="function"){for(const o of n.newIterator())if(o.objectId===e)return o}const i=n.modelSpace;if((i==null?void 0:i.objectId)===e)return i}const Wr=16/9;function ja(t,e,r,n=Wr){var a,i,o,s;const l=Number.isFinite(n)&&n>0?n:Wr;if(r){const d=(o=(i=(a=t.tables)==null?void 0:a.viewportTable)==null?void 0:i.getActiveVportBox)==null?void 0:o.call(i,l);return Kr(d)}const c=(s=t.objects)==null?void 0:s.layout;if(c!=null&&c.newIterator){for(const d of c.newIterator())if(d.blockTableRecordId===e)return Kr(d.limits)}}function Kr(t){if(!t||typeof t.isEmpty=="function"&&t.isEmpty())return;const e=t.min.x,r=t.min.y,n=t.max.x,a=t.max.y;if(!(!Number.isFinite(e)||!Number.isFinite(r)||!Number.isFinite(n)||!Number.isFinite(a)||n-e<=0||a-r<=0))return{minX:e,minY:r,maxX:n,maxY:a}}function br(t){var e;const r=(e=t.objects)==null?void 0:e.layout;if(!(r!=null&&r.newIterator))return[];const n=[];for(const a of r.newIterator()){const i=a.blockTableRecordId;i&&n.push({name:a.layoutName||i,tabOrder:a.tabOrder??0,blockTableRecordId:i})}return n.sort((a,i)=>a.tabOrder-i.tabOrder),n}function Va(t,e,r={}){return gl(t,e,r)}async function Xa(t,e,r={}){const n=r.yieldBetweenLayouts;n&&await n();const a=r.exportInvisibleLayers!==!1,i=r.exportLayouts!==!1,o=a?void 0:h=>wr(e,h,a),s=rr(t,{title:r.title,background:r.background}),l=Ya(e,a),c=br(t),d=new Map(c.map(h=>[h.blockTableRecordId,h.name])),u=Ka(e,i),m=Wa(e,c,i),p=[];for(const h of m)p.push(Ja(t,e,h,d,r,o)),n&&await n();return{version:H,meta:Ga(s,r,p,u),layers:l,layouts:p,activeLayoutBtrId:u}}function gl(t,e,r){const n=r.exportInvisibleLayers!==!1,a=r.exportLayouts!==!1,i=n?void 0:p=>wr(e,p,n),o=rr(t,{title:r.title,background:r.background}),s=Ya(e,n),l=br(t),c=new Map(l.map(p=>[p.blockTableRecordId,p.name])),d=Ka(e,a),u=Wa(e,l,a),m=[];for(const p of u)m.push(Ja(t,e,p,c,r,i));return{version:H,meta:Ga(o,r,m,d),layers:s,layouts:m,activeLayoutBtrId:d}}function Ya(t,e){const r=[];for(const n of t.layers)wr(t,n.name,e)&&r.push({name:n.name,color:n.color,visible:n.visible});return r}function Ga(t,e,r,n){const a=r.find(s=>s.btrId===n)??r[0],i=a?Oa(a):null,o=e.initialView??"fit";return{title:t.title,createdAt:new Date().toISOString(),extents:t.extents,viewExtents:i??void 0,units:t.units,grip:t.grip,background:t.background,locale:e.locale??"en",initialView:o,viewState:o==="current"?e.viewState:void 0,viewerMode:e.viewerMode??"measure",exportLayouts:e.exportLayouts!==!1,docsBaseUrl:e.docsBaseUrl??hr()}}function bl(t){return(t.viewerMode??"measure")==="measure"}function wr(t,e,r){if(r)return!0;const n=t.layers.find(a=>a.name===e);return n?n.visible:!0}function Wa(t,e,r){if(!r){const o=t.layouts.find(s=>s.btrId===t.modelSpaceBtrId);return o?[o]:[]}const n=new Map(t.layouts.map(o=>[o.btrId,o])),a=new Set,i=[];for(const o of e){if(a.has(o.blockTableRecordId))continue;a.add(o.blockTableRecordId);const s=n.get(o.blockTableRecordId);i.push(s??{btrId:o.blockTableRecordId,name:o.name,isModelSpace:o.blockTableRecordId===t.modelSpaceBtrId,layers:[]})}for(const o of t.layouts)a.has(o.btrId)||(a.add(o.btrId),i.push(o));return i}function Ka(t,e){return e&&t.activeLayoutBtrId||t.modelSpaceBtrId}function Ja(t,e,r,n,a,i){const o=[],s=[];for(const u of r.layers){if(i&&!i(u.name))continue;const m=Rn(u.root);o.push(...m.lineBatches),s.push(...m.meshBatches)}const l=r.isModelSpace||r.btrId===e.modelSpaceBtrId,c=ja(t,r.btrId,l,a.canvasAspectRatio);let d;if(bl(a)){const u=performance.now();d=Yn(t,r.btrId,{includeLayer:i}),console.log(`[chtml] osnap catalog ${n.get(r.btrId)??r.name??r.btrId}: ${(performance.now()-u).toFixed(0)} ms (${(d==null?void 0:d.primitives.length)??0} primitives)`)}return{btrId:r.btrId,name:n.get(r.btrId)??r.name??wl(t,r.btrId),isModelSpace:l,lineBatches:o,meshBatches:s,osnap:d,viewports:$a(t,r.btrId,l),...c?{savedView:c}:{}}}function wl(t,e){var r;const n=(r=t.tables)==null?void 0:r.blockTable;if(n!=null&&n.newIterator){for(const a of n.newIterator())if(a.objectId===e)return a.name}return e}const xl=400,re=10,ne=1,xr=64;function Ct(t){return Math.floor(t)*1024*1024}function yr(t){return Math.max(ne,Math.round(t/(1024*1024)))}function vr(t){return Number.isFinite(t)?Math.min(xr,Math.max(ne,Math.floor(t))):re}function G(t={}){var e;const r=t.exportFormat==="multi"?"multi":"single",n=r==="multi"?Ct(vr(t.maxChunkBytes!=null?yr(t.maxChunkBytes):re)):ar;return{exportFormat:r,exportInvisibleLayers:t.exportInvisibleLayers!==!1,exportLayouts:t.exportLayouts!==!1,initialView:t.initialView??"fit",viewerMode:t.viewerMode??"measure",expiryDays:r==="multi"?"never":t.expiryDays??"never",expiresAt:r==="multi"?null:t.expiresAt??null,password:r==="multi"?"":((e=t.password)==null?void 0:e.trim())??"",maxChunkBytes:n,compressChunks:r==="multi"?t.compressChunks!==!1:!0}}function Za(t){const e=t.maxChunkBytes??Ct(re),r=t.compressChunks!==!1;return{maxChunkBytes:e,maxBatchBytes:e,maxOsnapChunkBytes:e,compressChunks:r}}function qa(t){const e=t.activeLayoutView,r=e.center,n=e.trCamera.zoom,a=Math.max(e.height,1),i=n*(2*xl)/a;return{centerX:r.x,centerY:r.y,zoom:i}}const Qa="./viewer-runtime.iife.js";let Ft={};function ti(t){Ft={...Ft,...t}}function ei(){return{...Ft}}function ri(t){return t!=null?String(t):Ft.viewerRuntimeUrl!=null?String(Ft.viewerRuntimeUrl):Qa}class ni{build(e,r,n={}){return Va(r,Zr(e),Jr(n))}async buildAsync(e,r,n={}){return Xa(r,Zr(e),{...Jr(n),yieldBetweenLayouts:()=>V()})}}function Jr(t){return{title:t.title,background:t.background,locale:t.locale??k.currentLocale,exportInvisibleLayers:t.exportInvisibleLayers,exportLayouts:t.exportLayouts,initialView:t.initialView,viewState:t.viewState,viewerMode:t.viewerMode,canvasAspectRatio:t.canvasAspectRatio,docsBaseUrl:yl()}}function yl(){try{Ua(lo())}catch{}return hr()}function Zr(t){const e=[...t.layers.values()].map(n=>({name:n.name,color:n.color.RGB??16777215,visible:!n.isOff&&!n.isFrozen})),r=[...t.layouts.entries()].map(([n,a])=>({btrId:n,isModelSpace:n===t.modelSpaceBtrId,layers:[...a.layers.values()].map(i=>({name:i.name,root:i.internalObject}))}));return{layers:e,layouts:r,activeLayoutBtrId:t.activeLayoutBtrId||t.modelSpaceBtrId,modelSpaceBtrId:t.modelSpaceBtrId}}function J(t,e){console.log(`[chtml] ${t}: ${e.toFixed(0)} ms`)}class ai{constructor(e={}){this.options=e,this._snapshotBuilder=new ni}async prepareAcTrView2dForHtmlExport(e,r={}){if(!e||!("cadScene"in e)||!e.cadScene)throw new Error("CAD scene is not available. Open a drawing before exporting to HTML.");if(!(e instanceof oo))throw new Error("HTML export requires a 2D CAD view. Open a drawing before exporting.");const n=G(r),a={includeInvisibleLayers:n.exportInvisibleLayers,includeLayouts:n.exportLayouts};return await e.ensureEntitiesConvertedForExport(a),await V(),e}async convert(e,r={},n){const a=tt.instance,i=G(r),o=performance.now();await a.withBusyIndicator(async()=>{await V();const s=a.curDocument;let l=performance.now();const c=await this.prepareAcTrView2dForHtmlExport(n??a.curView,i);J("prepare (missing entities)",performance.now()-l);const d=e||s.fileName||s.docTitle,u=so(d);l=performance.now();const m=await this._snapshotBuilder.buildAsync(c.cadScene,s.database,{title:u,background:c.backgroundColor,exportInvisibleLayers:i.exportInvisibleLayers,exportLayouts:i.exportLayouts,initialView:i.initialView,viewerMode:i.viewerMode,viewState:i.initialView==="current"&&(i.exportLayouts||c.activeLayoutBtrId===c.modelSpaceBtrId)?qa(c):void 0,canvasAspectRatio:c.width/Math.max(c.height,1)});J("snapshot build",performance.now()-l),await V(),l=performance.now();const p=await this.loadViewerRuntime();if(J("load viewer runtime",performance.now()-l),await V(),i.exportFormat==="multi"){l=performance.now();const g=Za(i),w=await Sa(m,{viewerRuntime:p,...g});J(g.compressChunks?"package + gzip chunks":"package chunks",performance.now()-l),l=performance.now();const b=za(w);J("zip package",performance.now()-l),await V(),this.downloadBytes(b,Er(d,"zip"),"application/zip"),J("chtml total",performance.now()-o);return}const h=la(i.expiryDays,Date.now(),i.expiresAt);l=performance.now();const f=await this.packSelfContainedHtml(m,p,{expiresAt:h,password:i.password||void 0});J("pack self-contained html",performance.now()-l),await V(),this.downloadHtml(f,Er(d,"html")),J("chtml total",performance.now()-o)})}async packSnapshot(e,r){await tt.instance.withBusyIndicator(async()=>{await V();const n=await this.loadViewerRuntime();await V();const a=await this.packSelfContainedHtml(e,n,{expiresAt:null});await V(),this.downloadHtml(a,r)})}async packSelfContainedHtml(e,r,n){if(Ea(e))return La(e,{title:e.meta.title,viewerRuntime:r,expiresAt:n.expiresAt,password:n.password});const a=await ua(qe(e),{expiresAt:n.expiresAt,password:n.password});return aa(e,{title:e.meta.title,viewerRuntime:r,encoded:a.encoded,accessManifest:a.manifest})}async loadViewerRuntime(){const e=ri(this.options.viewerRuntimeUrl),r=await fetch(e);if(!r.ok)throw new Error(`Failed to load HTML viewer runtime from "${e}" (${r.status}). Install @mlightcad/cad-html-plugin, copy viewer-runtime.iife.js to your app assets, and set viewerRuntimeUrl on registerLazyHtmlPlugin / createHtmlPlugin / AcApHtmlConvertor.`);return r.text()}downloadHtml(e,r){this.downloadBytes(new TextEncoder().encode(e),r,"text/html;charset=utf-8")}downloadBytes(e,r,n){const a=new Uint8Array(e.byteLength);a.set(e);const i=new Blob([a],{type:n}),o=URL.createObjectURL(i),s=document.createElement("a");s.href=o,s.download=r,document.body.appendChild(s),s.click(),document.body.removeChild(s),window.setTimeout(()=>URL.revokeObjectURL(o),6e4)}}class ii extends ao{constructor(e={}){super(),this.pluginOptions=e}async execute(e){const r=await this.promptOptions();r&&await new ai(this.pluginOptions).convert(e.doc.fileName||e.doc.docTitle,r,e.view)}async promptOptions(){const e=G(),r=await this.promptExportFormat();if(r===void 0)return;const n=await this.promptYesNo("jig.chtml.exportInvisibleLayers",e.exportInvisibleLayers);if(n===void 0)return;const a=await this.promptYesNo("jig.chtml.exportLayouts",e.exportLayouts);if(a===void 0)return;const i=await this.promptInitialView();if(i===void 0)return;const o=await this.promptViewerMode();if(o===void 0)return;let s,l;if(!(r==="multi"&&(s=await this.promptChunkSizeMiB(),s===void 0||(l=await this.promptYesNo("jig.chtml.compressChunks",e.compressChunks),l===void 0))))return G({exportFormat:r,exportInvisibleLayers:n,exportLayouts:a,initialView:i,viewerMode:o,...r==="multi"?{maxChunkBytes:s,compressChunks:l}:{}})}async promptExportFormat(){const e=G(),r=new zt(k.t("jig.chtml.exportFormat"));r.allowNone=!0;const n=r.keywords.add(k.t("jig.chtml.keywords.single.display"),k.t("jig.chtml.keywords.single.global"),k.t("jig.chtml.keywords.single.local")),a=r.keywords.add(k.t("jig.chtml.keywords.multi.display"),k.t("jig.chtml.keywords.multi.global"),k.t("jig.chtml.keywords.multi.local"));r.keywords.default=e.exportFormat==="multi"?a:n;const i=await tt.instance.editor.getKeywords(r);if(i.status!==E.Cancel){if(i.status===E.None)return e.exportFormat;if(i.status===E.OK||i.status===E.Keyword)return i.stringResult?i.stringResult==="Multi"?"multi":"single":e.exportFormat}}async promptYesNo(e,r){const n=new zt(k.t(e));n.allowNone=!0;const a=n.keywords.add(k.t("jig.chtml.keywords.yes.display"),k.t("jig.chtml.keywords.yes.global"),k.t("jig.chtml.keywords.yes.local")),i=n.keywords.add(k.t("jig.chtml.keywords.no.display"),k.t("jig.chtml.keywords.no.global"),k.t("jig.chtml.keywords.no.local"));n.keywords.default=r?a:i;const o=await tt.instance.editor.getKeywords(n);if(o.status!==E.Cancel){if(o.status===E.None)return r;if(o.status===E.OK||o.status===E.Keyword)return o.stringResult?o.stringResult==="Yes":r}}async promptChunkSizeMiB(){const e=G({exportFormat:"multi"}),r=yr(e.maxChunkBytes),n=new io(k.t("jig.chtml.chunkSizeMiB"),ne,xr);n.allowNone=!0,n.allowZero=!1,n.allowNegative=!1,n.useDefaultValue=!0,n.defaultValue=r;const a=await tt.instance.editor.getInteger(n);if(a.status!==E.Cancel){if(a.status===E.None)return Ct(r);if(a.status===E.OK){const i=vr(a.value??r);return Ct(i)}}}async promptInitialView(){const e=G(),r=new zt(k.t("jig.chtml.initialView"));r.allowNone=!0;const n=r.keywords.add(k.t("jig.chtml.keywords.extents.display"),k.t("jig.chtml.keywords.extents.global"),k.t("jig.chtml.keywords.extents.local")),a=r.keywords.add(k.t("jig.chtml.keywords.current.display"),k.t("jig.chtml.keywords.current.global"),k.t("jig.chtml.keywords.current.local"));r.keywords.default=e.initialView==="current"?a:n;const i=await tt.instance.editor.getKeywords(r);if(i.status!==E.Cancel){if(i.status===E.None)return e.initialView;if(i.status===E.OK||i.status===E.Keyword)return i.stringResult?i.stringResult==="Current"?"current":"fit":e.initialView}}async promptViewerMode(){const e=G(),r=new zt(k.t("jig.chtml.viewerMode"));r.allowNone=!0;const n=r.keywords.add(k.t("jig.chtml.keywords.view.display"),k.t("jig.chtml.keywords.view.global"),k.t("jig.chtml.keywords.view.local")),a=r.keywords.add(k.t("jig.chtml.keywords.measure.display"),k.t("jig.chtml.keywords.measure.global"),k.t("jig.chtml.keywords.measure.local"));r.keywords.default=e.viewerMode==="view"?n:a;const i=await tt.instance.editor.getKeywords(r);if(i.status!==E.Cancel){if(i.status===E.None)return e.viewerMode;if(i.status===E.OK||i.status===E.Keyword)return i.stringResult?i.stringResult==="View"?"view":"measure":e.viewerMode}}}const vl="1.7.7-preview.1",kl={version:vl};class Al{constructor(e={}){this.options=e,this.name="HtmlPlugin",this.version=kl.version,this.description="HTML export (-chtml) command",this.registeredCommands=[]}onLoad(e,r){const n=no.SYSTEMT_COMMAND_GROUP_NAME,a=new ii(this.options);r.addCommand(n,"-chtml","-chtml",a),this.registeredCommands.push({group:n,name:"-chtml"}),r.lookupGlobalCmd("chtml")||(r.addCommand(n,"chtml","chtml",a),this.registeredCommands.push({group:n,name:"chtml"}))}onUnload(e,r){for(const n of this.registeredCommands)r.removeCmd(n.group,n.name);this.registeredCommands=[]}}async function Ml(t={}){return t.viewerRuntimeUrl!=null&&ti(t),new Al(ei())}const Sl=Object.freeze(Object.defineProperty({__proto__:null,ACEC_CHUNK_MAGIC:Wn,ACEO_OSNAP_MAGIC:xn,ACEO_OSNAP_VERSION:yn,ACEX_DEFAULT_CHUNK_MAX_BYTES:ar,ACEX_DEFAULT_CHUNK_SIZE_MIB:re,ACEX_DEFAULT_DOCS_BASE_URL:pr,ACEX_DEFAULT_MANIFEST_FILE:It,ACEX_DEFAULT_MANIFEST_HREF:Qn,ACEX_EMBEDDED_CHUNK_ENCRYPTED_MIME:Fa,ACEX_EMBEDDED_CHUNK_HREF_ATTR:mr,ACEX_EMBEDDED_CHUNK_MAX_BYTES:He,ACEX_EMBEDDED_CHUNK_MIME:Ca,ACEX_EMBEDDED_CHUNK_THRESHOLD_BYTES:Zn,ACEX_EMBEDDED_OSNAP_CHUNK_MAX_BYTES:qn,ACEX_HTML_LOCALES:Gn,ACEX_HTML_SHELL_CSS:Qt,ACEX_MAX_CHUNK_SIZE_MIB:xr,ACEX_MAX_GEOMETRY_BATCH_BYTES:Lt,ACEX_MIN_CHUNK_SIZE_MIB:ne,ACEX_PACKAGE_VERSION:Jn,ACEX_POLAR_ANGLE_INCREMENTS:ta,ACEX_SNAPSHOT_COMPRESSION:Ge,ACEX_SNAPSHOT_VERSION:H,AcApExportHtmlCmd:ii,AcApHtmlConvertor:ai,AcApHtmlSnapshotBuilder:ni,AcExBinaryWriter:Vt,AcExHtmlIcons:$t,DEFAULT_HTML_VIEWER_RUNTIME_URL:Qa,F_LINE_DISTANCES:ve,F_LINE_EXCLUDE_OSNAP:bn,F_LINE_INDICES:xe,F_LINE_PATTERN:ye,F_LINE_RENDER_ORDER:Ae,F_LINE_WIDTH:ke,F_MESH_GRADIENT_FILL:Ce,F_MESH_GRADIENT_POS:Fe,F_MESH_HATCH:Se,F_MESH_INDICES:Me,F_MESH_POINTS:wn,F_MESH_RENDER_ORDER:Ee,F_MESH_SIDE:Be,F_MESH_TEXTURE:Le,HTML_PLUGIN_NAME:en,HTML_PLUGIN_TRIGGERS:rn,ML_UI_COMPACT_MAX_WIDTH:na,ML_UI_MOBILE_MAX_WIDTH:ra,acExHtmlBase85ToBytes:gn,acExHtmlBytesToBase64:da,acExHtmlBytesToBase85:fn,acExHtmlBytesToText:Bt,acExHtmlTextToBytes:hn,acexChunkSizeBytesToMiB:yr,acexChunkSizeMiBToBytes:Ct,acexGetDocsBaseUrl:hr,acexSetDocsBaseUrl:Ua,bakePlainDrawableSlice:Gt,buildAcExHtmlAccessManifest:St,buildAcExHtmlPolarAnglesPanel:ea,buildAcExHtmlShellBody:te,buildAcExPackage:sl,buildAcExPackageAsync:Sa,buildAcExPackageData:Ma,buildAcExPackageDataAsync:ur,buildOsnapCatalog:Yn,buildSnapshotFromExportScene:Va,buildSnapshotFromExportSceneAsync:Xa,buildViewerMetadata:rr,captureAcApHtmlViewState:qa,captureAcExSavedViewExtents:ja,clampAcApHtmlChunkSizeMiB:vr,collectBatchesFromObject3D:Rn,collectLayoutViewports:$a,compactIndexedSlice:Qe,compressSnapshotBinary:ut,compressSnapshotBinaryAsync:We,computeLayoutExtents:Ra,computeLayoutViewExtents:Oa,computeLineDistancesForSegments:Kt,computeViewportPaperExtents:Ha,configureHtmlPlugin:ti,copyFloat32Range:q,copyUint32Range:Sn,createAcExHtmlAccessKey:cr,createEmptyExtents:Na,createHtmlPlugin:Ml,encodeChunkBinary:Et,encodeChunkGzip:Kn,encodeOsnapCatalogBinary:ht,encodeOsnapCatalogGzip:kn,encodeSnapshot:qe,encodeSnapshotBinary:An,encodeTextureForExport:Bn,encryptAcExHtmlBytes:ee,encryptAcExHtmlSnapshotPayload:ca,estimateAcExSnapshotGeometryBytes:Ba,estimateLineBatchBytes:Xt,estimateMeshBatchBytes:Yt,estimateOsnapPrimitiveBytes:Ze,expandExtentsFromBatch:Oe,expandExtentsFromPositions:Ta,exportActiveBatchedLine2Slice:Nn,exportActiveBatchedSlice:Jt,exportBufferGeometrySlice:At,exportPlainDrawableSlice:Fn,exportUvsForPositionSlice:En,exportVertexAttributeSlice:zn,extractGradientFill:Pn,extractHatchPattern:In,extractLinePattern:Ln,getHtmlPluginOptions:ei,isTransparentImagePlaceholder:tr,listDatabaseLayouts:br,needsAcExHtmlAccessControl:lr,normalizeAcExDocsBaseUrl:fr,omitNonFinitePrimitives:rt,packHtml:aa,packHtmlEmbeddedPackage:La,packHtmlPackage:sr,protectAcExHtmlEncodedSnapshot:ua,readBatchWorldOffset:Cn,rebaseHatchPatternToLocalOffset:Dn,rebasePlainDrawableSliceAroundCentroid:Wt,resolveAcApHtmlExpiresAt:la,resolveAcApHtmlExportOptions:G,resolveAcApHtmlPackageBuildOptions:Za,resolveAcExHtmlLocale:qt,resolveViewerRuntimeUrl:ri,shouldEmbedAcExChunks:Ea,snapshotMimeType:Mn,splitLayoutIntoSlices:va,splitLineBatch:pa,splitMeshBatch:ha,splitOsnapPrimitives:vn,toExtents:_a,toWcsCoord:Ie,transformHatchPatternToWorldSpace:Pe,unionExtents:gr,wcsPointToOcsArcAngle:Te,writeLineBatch:Ke,writeMeshBatch:Je,zipAcExPackageFiles:za},Symbol.toStringTag,{value:"Module"}));export{vr as H,za as P,xr as S,qe as X,aa as a,ni as c,la as d,Ct as g,ne as k,qa as o,G as p,Za as r,Ll as s,sl as v,ua as w,re as x};
