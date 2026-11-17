import{$ as vs,a0 as xs,a1 as ja,a2 as ks,a3 as Na,a4 as Ls,x as As,a5 as Cs,a6 as Ms,a7 as Es,a8 as Ss,e as xn,a9 as zs,I as _r,aa as Ps,ab as Fs}from"./three-renderer-CcShcOEQ.js";import{h as Fe,T as Bs,z as Is,v as kn,e as Hs,C as Ln,a5 as _a,d as $a,y as vr,a0 as Us,r as yt,L as Ts,k as Rs,M as Ds,o as Os,B as js,a as Ns,V as te,O as _s}from"./three-CjYIUj3K.js";import{aj as at,f as $r,a0 as Ve,S as $s,aO as An,aA as Cn,aP as Vs,M as Xs,N as dr,aQ as Ys,X as Zs,aR as Gs,ak as Ks,ai as Ws,$ as Vr,ac as Js,aa as qs,aB as Qs,aF as el,O as tl,g as rl,h as al,aS as nl,aT as ol,az as il,aU as sl,a4 as ll,aV as cl,V as dl,U as ul,av as ml,Z as pl,a9 as hl,A as fl,J as gl,ab as wl,a6 as Ce,ad as Mn,k as bl,ao as yl,_ as q}from"./data-model-CYKcUopU.js";import{_ as vl,X as xl,F as gt,p as C,x as fe,v as I,u as kl,E as Ll,P as Al,r as Va,c as Cl,M as Ml}from"./cad-simple-viewer-9MyZ6kl7.js";const En="HtmlPlugin",Sn=["-chtml","chtml"];let ur={};function ep(e,t){t&&(ur={...ur,...t});const r={...ur};e.registerLazyPlugin({name:En,triggers:[...Sn],loader:async()=>{const{createHtmlPlugin:a}=await vl(async()=>{const{createHtmlPlugin:n}=await Promise.resolve().then(()=>Km);return{createHtmlPlugin:n}},void 0,import.meta.url);return a(r)}})}var P=Uint8Array,Y=Uint16Array,Xr=Int32Array,Ot=new P([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),jt=new P([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),xr=new P([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),zn=function(e,t){for(var r=new Y(31),a=0;a<31;++a)r[a]=t+=1<<e[a-1];for(var n=new Xr(r[30]),a=1;a<30;++a)for(var o=r[a];o<r[a+1];++o)n[o]=o-r[a]<<5|a;return{b:r,r:n}},Pn=zn(Ot,2),Fn=Pn.b,kr=Pn.r;Fn[28]=258,kr[258]=28;var Bn=zn(jt,0),El=Bn.b,Xa=Bn.r,Lr=new Y(32768);for(var z=0;z<32768;++z){var de=(z&43690)>>1|(z&21845)<<1;de=(de&52428)>>2|(de&13107)<<2,de=(de&61680)>>4|(de&3855)<<4,Lr[z]=((de&65280)>>8|(de&255)<<8)>>1}var ee=(function(e,t,r){for(var a=e.length,n=0,o=new Y(t);n<a;++n)e[n]&&++o[e[n]-1];var i=new Y(t);for(n=1;n<t;++n)i[n]=i[n-1]+o[n-1]<<1;var s;if(r){s=new Y(1<<t);var l=15-t;for(n=0;n<a;++n)if(e[n])for(var c=n<<4|e[n],d=t-e[n],u=i[e[n]-1]++<<d,p=u|(1<<d)-1;u<=p;++u)s[Lr[u]>>l]=c}else for(s=new Y(a),n=0;n<a;++n)e[n]&&(s[n]=Lr[i[e[n]-1]++]>>15-e[n]);return s}),pe=new P(288);for(var z=0;z<144;++z)pe[z]=8;for(var z=144;z<256;++z)pe[z]=9;for(var z=256;z<280;++z)pe[z]=7;for(var z=280;z<288;++z)pe[z]=8;var Ze=new P(32);for(var z=0;z<32;++z)Ze[z]=5;var Sl=ee(pe,9,0),zl=ee(pe,9,1),Pl=ee(Ze,5,0),Fl=ee(Ze,5,1),mr=function(e){for(var t=e[0],r=1;r<e.length;++r)e[r]>t&&(t=e[r]);return t},K=function(e,t,r){var a=t/8|0;return(e[a]|e[a+1]<<8)>>(t&7)&r},pr=function(e,t){var r=t/8|0;return(e[r]|e[r+1]<<8|e[r+2]<<16)>>(t&7)},Yr=function(e){return(e+7)/8|0},nt=function(e,t,r){return(t==null||t<0)&&(t=0),(r==null||r>e.length)&&(r=e.length),new P(e.subarray(t,r))},Bl=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],R=function(e,t,r){var a=new Error(t||Bl[e]);if(a.code=e,Error.captureStackTrace&&Error.captureStackTrace(a,R),!r)throw a;return a},In=function(e,t,r,a){var n=e.length,o=a?a.length:0;if(!n||t.f&&!t.l)return r||new P(0);var i=!r,s=i||t.i!=2,l=t.i;i&&(r=new P(n*3));var c=function(Re){var De=r.length;if(Re>De){var Le=new P(Math.max(De*2,Re));Le.set(r),r=Le}},d=t.f||0,u=t.p||0,p=t.b||0,m=t.l,h=t.d,f=t.m,w=t.n,b=n*8;do{if(!m){d=K(e,u,1);var g=K(e,u+1,3);if(u+=3,g)if(g==1)m=zl,h=Fl,f=9,w=5;else if(g==2){var k=K(e,u,31)+257,v=K(e,u+10,15)+4,A=k+K(e,u+5,31)+1;u+=14;for(var M=new P(A),E=new P(19),y=0;y<v;++y)E[xr[y]]=K(e,u+y*3,7);u+=v*3;for(var x=mr(E),N=(1<<x)-1,ce=ee(E,x,1),y=0;y<A;){var O=ce[K(e,u,N)];u+=O&15;var T=O>>4;if(T<16)M[y++]=T;else{var U=0,j=0;for(T==16?(j=3+K(e,u,3),u+=2,U=M[y-1]):T==17?(j=3+K(e,u,7),u+=3):T==18&&(j=11+K(e,u,127),u+=7);j--;)M[y++]=U}}var $=M.subarray(0,k),S=M.subarray(k);f=mr($),w=mr(S),m=ee($,f,1),h=ee(S,w,1)}else R(1);else{var T=Yr(u)+4,_=e[T-4]|e[T-3]<<8,Z=T+_;if(Z>n){l&&R(0);break}s&&c(p+_),r.set(e.subarray(T,Z),p),t.b=p+=_,t.p=u=Z*8,t.f=d;continue}if(u>b){l&&R(0);break}}s&&c(p+131072);for(var Te=(1<<f)-1,G=(1<<w)-1,ne=u;;ne=u){var U=m[pr(e,u)&Te],V=U>>4;if(u+=U&15,u>b){l&&R(0);break}if(U||R(2),V<256)r[p++]=V;else if(V==256){ne=u,m=null;break}else{var X=V-254;if(V>264){var y=V-257,F=Ot[y];X=K(e,u,(1<<F)-1)+Fn[y],u+=F}var J=h[pr(e,u)&G],xe=J>>4;J||R(3),u+=J&15;var S=El[xe];if(xe>3){var F=jt[xe];S+=pr(e,u)&(1<<F)-1,u+=F}if(u>b){l&&R(0);break}s&&c(p+131072);var ke=p+X;if(p<S){var ht=o-S,ft=Math.min(S,ke);for(ht+p<0&&R(3);p<ft;++p)r[p]=a[ht+p]}for(;p<ke;++p)r[p]=r[p-S]}}t.l=m,t.p=ne,t.b=p,t.f=d,m&&(d=1,t.m=f,t.d=h,t.n=w)}while(!d);return p!=r.length&&i?nt(r,0,p):r.subarray(0,p)},oe=function(e,t,r){r<<=t&7;var a=t/8|0;e[a]|=r,e[a+1]|=r>>8},Oe=function(e,t,r){r<<=t&7;var a=t/8|0;e[a]|=r,e[a+1]|=r>>8,e[a+2]|=r>>16},hr=function(e,t){for(var r=[],a=0;a<e.length;++a)e[a]&&r.push({s:a,f:e[a]});var n=r.length,o=r.slice();if(!n)return{t:Un,l:0};if(n==1){var i=new P(r[0].s+1);return i[r[0].s]=1,{t:i,l:1}}r.sort(function(A,M){return A.f-M.f}),r.push({s:-1,f:25001});var s=r[0],l=r[1],c=0,d=1,u=2;for(r[0]={s:-1,f:s.f+l.f,l:s,r:l};d!=n-1;)s=r[r[c].f<r[u].f?c++:u++],l=r[c!=d&&r[c].f<r[u].f?c++:u++],r[d++]={s:-1,f:s.f+l.f,l:s,r:l};for(var p=o[0].s,a=1;a<n;++a)o[a].s>p&&(p=o[a].s);var m=new Y(p+1),h=Ar(r[d-1],m,0);if(h>t){var a=0,f=0,w=h-t,b=1<<w;for(o.sort(function(M,E){return m[E.s]-m[M.s]||M.f-E.f});a<n;++a){var g=o[a].s;if(m[g]>t)f+=b-(1<<h-m[g]),m[g]=t;else break}for(f>>=w;f>0;){var k=o[a].s;m[k]<t?f-=1<<t-m[k]++-1:++a}for(;a>=0&&f;--a){var v=o[a].s;m[v]==t&&(--m[v],++f)}h=t}return{t:new P(m),l:h}},Ar=function(e,t,r){return e.s==-1?Math.max(Ar(e.l,t,r+1),Ar(e.r,t,r+1)):t[e.s]=r},Ya=function(e){for(var t=e.length;t&&!e[--t];);for(var r=new Y(++t),a=0,n=e[0],o=1,i=function(l){r[a++]=l},s=1;s<=t;++s)if(e[s]==n&&s!=t)++o;else{if(!n&&o>2){for(;o>138;o-=138)i(32754);o>2&&(i(o>10?o-11<<5|28690:o-3<<5|12305),o=0)}else if(o>3){for(i(n),--o;o>6;o-=6)i(8304);o>2&&(i(o-3<<5|8208),o=0)}for(;o--;)i(n);o=1,n=e[s]}return{c:r.subarray(0,a),n:t}},je=function(e,t){for(var r=0,a=0;a<t.length;++a)r+=e[a]*t[a];return r},Hn=function(e,t,r){var a=r.length,n=Yr(t+2);e[n]=a&255,e[n+1]=a>>8,e[n+2]=e[n]^255,e[n+3]=e[n+1]^255;for(var o=0;o<a;++o)e[n+o+4]=r[o];return(n+4+a)*8},Za=function(e,t,r,a,n,o,i,s,l,c,d){oe(t,d++,r),++n[256];for(var u=hr(n,15),p=u.t,m=u.l,h=hr(o,15),f=h.t,w=h.l,b=Ya(p),g=b.c,k=b.n,v=Ya(f),A=v.c,M=v.n,E=new Y(19),y=0;y<g.length;++y)++E[g[y]&31];for(var y=0;y<A.length;++y)++E[A[y]&31];for(var x=hr(E,7),N=x.t,ce=x.l,O=19;O>4&&!N[xr[O-1]];--O);var T=c+5<<3,U=je(n,pe)+je(o,Ze)+i,j=je(n,p)+je(o,f)+i+14+3*O+je(E,N)+2*E[16]+3*E[17]+7*E[18];if(l>=0&&T<=U&&T<=j)return Hn(t,d,e.subarray(l,l+c));var $,S,_,Z;if(oe(t,d,1+(j<U)),d+=2,j<U){$=ee(p,m,0),S=p,_=ee(f,w,0),Z=f;var Te=ee(N,ce,0);oe(t,d,k-257),oe(t,d+5,M-1),oe(t,d+10,O-4),d+=14;for(var y=0;y<O;++y)oe(t,d+3*y,N[xr[y]]);d+=3*O;for(var G=[g,A],ne=0;ne<2;++ne)for(var V=G[ne],y=0;y<V.length;++y){var X=V[y]&31;oe(t,d,Te[X]),d+=N[X],X>15&&(oe(t,d,V[y]>>5&127),d+=V[y]>>12)}}else $=Sl,S=pe,_=Pl,Z=Ze;for(var y=0;y<s;++y){var F=a[y];if(F>255){var X=F>>18&31;Oe(t,d,$[X+257]),d+=S[X+257],X>7&&(oe(t,d,F>>23&31),d+=Ot[X]);var J=F&31;Oe(t,d,_[J]),d+=Z[J],J>3&&(Oe(t,d,F>>5&8191),d+=jt[J])}else Oe(t,d,$[F]),d+=S[F]}return Oe(t,d,$[256]),d+S[256]},Il=new Xr([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),Un=new P(0),Hl=function(e,t,r,a,n,o){var i=o.z||e.length,s=new P(a+i+5*(1+Math.ceil(i/7e3))+n),l=s.subarray(a,s.length-n),c=o.l,d=(o.r||0)&7;if(t){d&&(l[0]=o.r>>3);for(var u=Il[t-1],p=u>>13,m=u&8191,h=(1<<r)-1,f=o.p||new Y(32768),w=o.h||new Y(h+1),b=Math.ceil(r/3),g=2*b,k=function(cr){return(e[cr]^e[cr+1]<<b^e[cr+2]<<g)&h},v=new Xr(25e3),A=new Y(288),M=new Y(32),E=0,y=0,x=o.i||0,N=0,ce=o.w||0,O=0;x+2<i;++x){var T=k(x),U=x&32767,j=w[T];if(f[U]=j,w[T]=U,ce<=x){var $=i-x;if((E>7e3||N>24576)&&($>423||!c)){d=Za(e,l,0,v,A,M,y,N,O,x-O,d),N=E=y=0,O=x;for(var S=0;S<286;++S)A[S]=0;for(var S=0;S<30;++S)M[S]=0}var _=2,Z=0,Te=m,G=U-j&32767;if($>2&&T==k(x-G))for(var ne=Math.min(p,$)-1,V=Math.min(32767,x),X=Math.min(258,$);G<=V&&--Te&&U!=j;){if(e[x+_]==e[x+_-G]){for(var F=0;F<X&&e[x+F]==e[x+F-G];++F);if(F>_){if(_=F,Z=G,F>ne)break;for(var J=Math.min(G,F-2),xe=0,S=0;S<J;++S){var ke=x-G+S&32767,ht=f[ke],ft=ke-ht&32767;ft>xe&&(xe=ft,j=ke)}}}U=j,j=f[U],G+=U-j&32767}if(Z){v[N++]=268435456|kr[_]<<18|Xa[Z];var Re=kr[_]&31,De=Xa[Z]&31;y+=Ot[Re]+jt[De],++A[257+Re],++M[De],ce=x+_,++E}else v[N++]=e[x],++A[e[x]]}}for(x=Math.max(x,ce);x<i;++x)v[N++]=e[x],++A[e[x]];d=Za(e,l,c,v,A,M,y,N,O,x-O,d),c||(o.r=d&7|l[d/8|0]<<3,d-=7,o.h=w,o.p=f,o.i=x,o.w=ce)}else{for(var x=o.w||0;x<i+c;x+=65535){var Le=x+65535;Le>=i&&(l[d/8|0]=c,Le=i),d=Hn(l,d+1,e.subarray(x,Le))}o.i=i}return nt(s,0,a+Yr(d)+n)},Ul=(function(){for(var e=new Int32Array(256),t=0;t<256;++t){for(var r=t,a=9;--a;)r=(r&1&&-306674912)^r>>>1;e[t]=r}return e})(),Tn=function(){var e=-1;return{p:function(t){for(var r=e,a=0;a<t.length;++a)r=Ul[r&255^t[a]]^r>>>8;e=r},d:function(){return~e}}},Rn=function(e,t,r,a,n){if(!n&&(n={l:1},t.dictionary)){var o=t.dictionary.subarray(-32768),i=new P(o.length+e.length);i.set(o),i.set(e,o.length),e=i,n.w=o.length}return Hl(e,t.level==null?6:t.level,t.mem==null?n.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+t.mem,r,a,n)},Dn=function(e,t){var r={};for(var a in e)r[a]=e[a];for(var a in t)r[a]=t[a];return r},Q=function(e,t){return e[t]|e[t+1]<<8},W=function(e,t){return(e[t]|e[t+1]<<8|e[t+2]<<16|e[t+3]<<24)>>>0},fr=function(e,t){return W(e,t)+W(e,t+4)*4294967296},B=function(e,t,r){for(;r;++t)e[t]=r,r>>>=8},Tl=function(e,t){var r=t.filename;if(e[0]=31,e[1]=139,e[2]=8,e[8]=t.level<2?4:t.level==9?2:0,e[9]=3,t.mtime!=0&&B(e,4,Math.floor(new Date(t.mtime||Date.now())/1e3)),r){e[3]=8;for(var a=0;a<=r.length;++a)e[a+10]=r.charCodeAt(a)}},Rl=function(e){(e[0]!=31||e[1]!=139||e[2]!=8)&&R(6,"invalid gzip data");var t=e[3],r=10;t&4&&(r+=(e[10]|e[11]<<8)+2);for(var a=(t>>3&1)+(t>>4&1);a>0;a-=!e[r++]);return r+(t&2)},Dl=function(e){var t=e.length;return(e[t-4]|e[t-3]<<8|e[t-2]<<16|e[t-1]<<24)>>>0},Ol=function(e){return 10+(e.filename?e.filename.length+1:0)};function jl(e,t){return Rn(e,t||{},0,0)}function Nl(e,t){return In(e,{i:2},t&&t.out,t&&t.dictionary)}function _l(e,t){t||(t={});var r=Tn(),a=e.length;r.p(e);var n=Rn(e,t,Ol(t),8),o=n.length;return Tl(n,t),B(n,o-8,r.d()),B(n,o-4,a),n}function $l(e,t){var r=Rl(e);return r+8>e.length&&R(6,"invalid gzip data"),In(e.subarray(r,-8),{i:2},new P(Dl(e)),t)}var On=function(e,t,r,a){for(var n in e){var o=e[n],i=t+n,s=a;Array.isArray(o)&&(s=Dn(a,o[1]),o=o[0]),o instanceof P?r[i]=[o,s]:(r[i+="/"]=[new P(0),s],On(o,i,r,a))}},Ga=typeof TextEncoder<"u"&&new TextEncoder,Cr=typeof TextDecoder<"u"&&new TextDecoder,Vl=0;try{Cr.decode(Un,{stream:!0}),Vl=1}catch{}var Xl=function(e){for(var t="",r=0;;){var a=e[r++],n=(a>127)+(a>223)+(a>239);if(r+n>e.length)return{s:t,r:nt(e,r-1)};n?n==3?(a=((a&15)<<18|(e[r++]&63)<<12|(e[r++]&63)<<6|e[r++]&63)-65536,t+=String.fromCharCode(55296|a>>10,56320|a&1023)):n&1?t+=String.fromCharCode((a&31)<<6|e[r++]&63):t+=String.fromCharCode((a&15)<<12|(e[r++]&63)<<6|e[r++]&63):t+=String.fromCharCode(a)}};function Me(e,t){var r;if(Ga)return Ga.encode(e);for(var a=e.length,n=new P(e.length+(e.length>>1)),o=0,i=function(d){n[o++]=d},r=0;r<a;++r){if(o+5>n.length){var s=new P(o+8+(a-r<<1));s.set(n),n=s}var l=e.charCodeAt(r);l<128||t?i(l):l<2048?(i(192|l>>6),i(128|l&63)):l>55295&&l<57344?(l=65536+(l&1047552)|e.charCodeAt(++r)&1023,i(240|l>>18),i(128|l>>12&63),i(128|l>>6&63),i(128|l&63)):(i(224|l>>12),i(128|l>>6&63),i(128|l&63))}return nt(n,0,o)}function Zr(e,t){if(t){for(var r="",a=0;a<e.length;a+=16384)r+=String.fromCharCode.apply(null,e.subarray(a,a+16384));return r}else{if(Cr)return Cr.decode(e);var n=Xl(e),o=n.s,r=n.r;return r.length&&R(8),o}}var Yl=function(e,t){return t+30+Q(e,t+26)+Q(e,t+28)},Zl=function(e,t,r){var a=Q(e,t+28),n=Zr(e.subarray(t+46,t+46+a),!(Q(e,t+8)&2048)),o=t+46+a,i=W(e,t+20),s=r&&i==4294967295?Gl(e,o):[i,W(e,t+24),W(e,t+42)],l=s[0],c=s[1],d=s[2];return[Q(e,t+10),l,c,n,o+Q(e,t+30)+Q(e,t+32),d]},Gl=function(e,t){for(;Q(e,t)!=1;t+=4+Q(e,t+2));return[fr(e,t+12),fr(e,t+4),fr(e,t+20)]},Mr=function(e){var t=0;if(e)for(var r in e){var a=e[r].length;a>65535&&R(9),t+=a+4}return t},Ka=function(e,t,r,a,n,o,i,s){var l=a.length,c=r.extra,d=s&&s.length,u=Mr(c);B(e,t,i!=null?33639248:67324752),t+=4,i!=null&&(e[t++]=20,e[t++]=r.os),e[t]=20,t+=2,e[t++]=r.flag<<1|(o<0&&8),e[t++]=n&&8,e[t++]=r.compression&255,e[t++]=r.compression>>8;var p=new Date(r.mtime==null?Date.now():r.mtime),m=p.getFullYear()-1980;if((m<0||m>119)&&R(10),B(e,t,m<<25|p.getMonth()+1<<21|p.getDate()<<16|p.getHours()<<11|p.getMinutes()<<5|p.getSeconds()>>1),t+=4,o!=-1&&(B(e,t,r.crc),B(e,t+4,o<0?-o-2:o),B(e,t+8,r.size)),B(e,t+12,l),B(e,t+14,u),t+=16,i!=null&&(B(e,t,d),B(e,t+6,r.attrs),B(e,t+10,i),t+=14),e.set(a,t),t+=l,u)for(var h in c){var f=c[h],w=f.length;B(e,t,+h),B(e,t+2,w),e.set(f,t+4),t+=4+w}return d&&(e.set(s,t),t+=d),t},Kl=function(e,t,r,a,n){B(e,t,101010256),B(e,t+8,r),B(e,t+10,r),B(e,t+12,a),B(e,t+16,n)};function Wl(e,t){t||(t={});var r={},a=[];On(e,"",r,t);var n=0,o=0;for(var i in r){var s=r[i],l=s[0],c=s[1],d=c.level==0?0:8,u=Me(i),p=u.length,m=c.comment,h=m&&Me(m),f=h&&h.length,w=Mr(c.extra);p>65535&&R(11);var b=d?jl(l,c):l,g=b.length,k=Tn();k.p(l),a.push(Dn(c,{size:l.length,crc:k.d(),c:b,f:u,m:h,u:p!=i.length||h&&m.length!=f,o:n,compression:d})),n+=30+p+w+g,o+=76+2*(p+w)+(f||0)+g}for(var v=new P(o+22),A=n,M=o-n,E=0;E<a.length;++E){var u=a[E];Ka(v,u.o,u,u.f,u.u,u.c.length);var y=30+u.f.length+Mr(u.extra);v.set(u.c,u.o+y),Ka(v,n,u,u.f,u.u,u.c.length,u.o,u.m),n+=16+y+(u.m?u.m.length:0)}return Kl(v,n,a.length,M,A),v}function Jl(e,t){for(var r={},a=e.length-22;W(e,a)!=101010256;--a)(!a||e.length-a>65558)&&R(13);var n=Q(e,a+8);if(!n)return{};var o=W(e,a+16),i=o==4294967295||n==65535;if(i){var s=W(e,a-12);i=W(e,s)==101075792,i&&(n=W(e,s+32),o=W(e,s+48))}for(var l=0;l<n;++l){var c=Zl(e,o,i),d=c[0],u=c[1],p=c[2],m=c[3],h=c[4],f=c[5],w=Yl(e,f);o=h,d?d==8?r[m]=Nl(e.subarray(w,w+u),{out:new P(p)}):R(14,"unknown compression type "+d):r[m]=nt(e,w,w+u)}return r}const jn=512*1024*1024,Er=512*1024*1024;class Nt{constructor(){this.chunks=[],this.length=0}writeU8(t){const r=new Uint8Array(1);r[0]=t&255,this.chunks.push(r),this.length+=1}writeU32(t){const r=new Uint8Array(4);new DataView(r.buffer).setUint32(0,t>>>0,!0),this.chunks.push(r),this.length+=4}writeI32(t){const r=new Uint8Array(4);new DataView(r.buffer).setInt32(0,t|0,!0),this.chunks.push(r),this.length+=4}writeF32(t){const r=new Uint8Array(4);new DataView(r.buffer).setFloat32(0,t,!0),this.chunks.push(r),this.length+=4}writeF64(t){const r=new Uint8Array(8);new DataView(r.buffer).setFloat64(0,t,!0),this.chunks.push(r),this.length+=8}writeBytes(t){this.chunks.push(t),this.length+=t.length}writeString(t){const r=Me(t);this.writeU32(r.length),this.writeBytes(r)}writeJson(t){this.writeString(JSON.stringify(t))}writeFloat32Array(t){this.alignTo(4);const r=new Uint8Array(t.buffer,t.byteOffset,t.byteLength);this.writeU32(r.length),this.writeBytes(r)}writeUint32Array(t){this.alignTo(4);const r=new Uint8Array(t.buffer,t.byteOffset,t.byteLength);this.writeU32(r.length),this.writeBytes(r)}alignTo(t){const r=this.length%t;if(r===0)return;const a=t-r;for(let n=0;n<a;n++)this.writeU8(0)}toUint8Array(){const t=new Uint8Array(this.length);let r=0;for(const a of this.chunks)t.set(a,r),r+=a.length;return t}}class _t{constructor(t){this.bytes=t,this.offset=0}ensureAvailable(t){if(t<0||!Number.isFinite(t))throw new Error("Invalid binary length");if(this.offset+t>this.bytes.length)throw new Error("Unexpected end of binary buffer")}readU8(){return this.ensureAvailable(1),this.bytes[this.offset++]}readU32(){this.ensureAvailable(4);const t=new DataView(this.bytes.buffer,this.bytes.byteOffset+this.offset,4).getUint32(0,!0);return this.offset+=4,t}readI32(){this.ensureAvailable(4);const t=new DataView(this.bytes.buffer,this.bytes.byteOffset+this.offset,4).getInt32(0,!0);return this.offset+=4,t}readF32(){this.ensureAvailable(4);const t=new DataView(this.bytes.buffer,this.bytes.byteOffset+this.offset,4).getFloat32(0,!0);return this.offset+=4,t}readF64(){this.ensureAvailable(8);const t=new DataView(this.bytes.buffer,this.bytes.byteOffset+this.offset,8).getFloat64(0,!0);return this.offset+=8,t}readBytes(t){this.ensureAvailable(t);const r=this.bytes.subarray(this.offset,this.offset+t);return this.offset+=t,r}readString(){const t=this.readU32();if(t===0)return"";if(t>jn)throw new Error("Binary string exceeds size limit");return Zr(this.readBytes(t))}readJson(){const t=this.readString();if(t.length===0)throw new Error("Expected JSON payload");return JSON.parse(t)}alignTo(t){const r=this.offset%t;if(r===0)return;const a=t-r;this.ensureAvailable(a),this.offset+=a}readFloat32Array(){this.alignTo(4);const t=this.readU32();if(t===0)return new Float32Array(0);if(t%4!==0)throw new Error("Invalid float32 buffer length");if(t>Er)throw new Error("Float32 buffer exceeds size limit");const r=this.readBytes(t);if(r.byteOffset%4===0)return new Float32Array(r.buffer,r.byteOffset,t/4);const a=new ArrayBuffer(t);return new Uint8Array(a).set(r),new Float32Array(a)}readUint32Array(){this.alignTo(4);const t=this.readU32();if(t===0)return new Uint32Array(0);if(t%4!==0)throw new Error("Invalid uint32 buffer length");if(t>Er)throw new Error("Uint32 buffer exceeds size limit");const r=this.readBytes(t);if(r.byteOffset%4===0)return new Uint32Array(r.buffer,r.byteOffset,t/4);const a=new ArrayBuffer(t);return new Uint8Array(a).set(r),new Uint32Array(a)}}const D=4,vt="gzip",Nn=512*1024*1024,xt=256*1024*1024;let Ge=null;function ql(e){Ge=e}function Ee(e){return{bytes:Ge?Ge.gzipSync(e):_l(e),compression:vt}}async function Gr(e){if(Ge)return{bytes:await Ge.gzip(e),compression:vt};if(typeof CompressionStream>"u")return Ee(e);try{const t=new Uint8Array(e.byteLength);t.set(e);const r=new Blob([t]).stream().pipeThrough(new CompressionStream("gzip"));return{bytes:new Uint8Array(await new Response(r).arrayBuffer()),compression:vt}}catch{return Ee(e)}}function Kr(e){return e.byteLength>=2&&e[0]===31&&e[1]===139}function $t(e){if(e.byteLength>xt)throw new Error("Compressed payload exceeds size limit");const t=$l(e);if(t.byteLength>Nn)throw new Error("Decompressed payload exceeds size limit");return t}const kt="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%()*+,-.;=?@[]^_{|}~",Sr=new Int16Array(128).fill(-1);for(let e=0;e<kt.length;e++)Sr[kt.charCodeAt(e)]=e;function Wr(e){const t=(e==null?void 0:e.toLowerCase())??"";return t.includes(";base85")||t.endsWith("base85")?"base85":"base64"}function Be(e,t){return t==="base85"?_n(e):ec(e)}function ot(e,t){const r=e.length>0&&(e.charCodeAt(0)<=32||e.charCodeAt(e.length-1)<=32)?e.trim():e;return t==="base85"?$n(r):tc(r)}function _n(e){const t=e.length;if(t===0)return"";const r=(4-t%4)%4,a=t+r,n=[];for(let i=0;i<a;i+=4){const s=e[i]??0,l=i+1<t?e[i+1]:0,c=i+2<t?e[i+2]:0,d=i+3<t?e[i+3]:0;let u=(s<<24>>>0)+(l<<16)+(c<<8)+d;const p=new Array(5);for(let m=4;m>=0;m--)p[m]=u%85,u=u/85|0;for(let m=0;m<5;m++)n.push(kt[p[m]])}const o=Math.ceil(t*5/4);return n.slice(0,o).join("")}function $n(e){const t=e.replace(/\s+/g,""),r=t.length;if(r===0)return new Uint8Array(0);const a=Math.floor(r*4/5),n=(5-r%5)%5,o=r+n,i=new Uint8Array(o/5*4),s=kt.length-1;let l=0;for(let c=0;c<o;c+=5){let d=0;for(let u=0;u<5;u++){const p=c+u<r?Ql(t.charCodeAt(c+u)):s;d=d*85+p}i[l++]=d>>>24&255,i[l++]=d>>>16&255,i[l++]=d>>>8&255,i[l++]=d&255}return i.subarray(0,a)}function Ql(e){if(e<0||e>=Sr.length)throw new Error("Invalid base85 character");const t=Sr[e];if(t<0)throw new Error("Invalid base85 character");return t}function ec(e){let t="";for(let r=0;r<e.length;r++)t+=String.fromCharCode(e[r]);return btoa(t)}function tc(e){const t=atob(e),r=new Uint8Array(t.length);for(let a=0;a<t.length;a++)r[a]=t.charCodeAt(a);return r}const Lt=1,At=2,Ct=4,Mt=8,Et=16,Jr=32,St=1,zt=2,Pt=4,Ft=8,Bt=16,qr=32,It=64,Ht=128;function Vt(e){let t=256+e.positions.byteLength;return e.indices&&(t+=e.indices.byteLength),e.lineDistances&&(t+=e.lineDistances.byteLength),e.linePattern&&(t+=64+e.linePattern.pattern.length*8),t}function Xt(e){let t=256+e.positions.byteLength;return e.indices&&(t+=e.indices.byteLength),e.gradientPositions&&(t+=e.gradientPositions.byteLength),e.uvs&&(t+=e.uvs.byteLength),e.texture&&(t+=e.texture.bytes.byteLength+64),e.hatchPattern&&(t+=128),e.gradientFill&&(t+=64),t}function Qr(e,t){e.writeString(t.layer),e.writeU32(t.color>>>0),e.writeF64(t.offset[0]),e.writeF64(t.offset[1]),e.writeF64(t.offset[2]),e.writeFloat32Array(t.positions);let r=0;t.indices&&t.indices.length>0&&(r|=Lt),t.linePattern&&(r|=At),t.lineDistances&&t.lineDistances.length>0&&(r|=Ct),t.lineWidth!=null&&t.lineWidth>0&&(r|=Mt),t.renderOrder!=null&&t.renderOrder!==0&&(r|=Et),t.excludeFromOsnap&&(r|=Jr),e.writeU8(r),r&Lt&&e.writeUint32Array(t.indices),r&At&&e.writeJson(t.linePattern),r&Ct&&e.writeFloat32Array(t.lineDistances),r&Mt&&e.writeF32(t.lineWidth),r&Et&&e.writeI32(t.renderOrder)}function ea(e){const t=e.readString(),r=e.readU32(),a=[e.readF64(),e.readF64(),e.readF64()],n=e.readFloat32Array(),o=e.readU8(),i={layer:t,color:r,offset:a,positions:n};return o&Lt&&(i.indices=e.readUint32Array()),o&At&&(i.linePattern=e.readJson()),o&Ct&&(i.lineDistances=e.readFloat32Array()),o&Mt&&(i.lineWidth=e.readF32()),o&Et&&(i.renderOrder=e.readI32()),o&Jr&&(i.excludeFromOsnap=!0),i}function ta(e,t){e.writeString(t.layer),e.writeU32(t.color>>>0),e.writeF64(t.offset[0]),e.writeF64(t.offset[1]),e.writeF64(t.offset[2]),e.writeFloat32Array(t.positions);let r=0;t.indices&&t.indices.length>0&&(r|=St),t.hatchPattern&&(r|=zt),t.gradientFill&&(r|=Pt),t.gradientPositions&&t.gradientPositions.length>0&&(r|=Ft),t.side!=null&&(r|=Bt),t.points&&(r|=qr),t.renderOrder!=null&&t.renderOrder!==0&&(r|=It),t.texture&&t.texture.bytes.length>0&&t.uvs&&t.uvs.length>=2&&(r|=Ht),e.writeU8(r),r&St&&e.writeUint32Array(t.indices),r&zt&&e.writeJson(t.hatchPattern),r&Pt&&e.writeJson(t.gradientFill),r&Ft&&e.writeFloat32Array(t.gradientPositions),r&Bt&&e.writeU8(t.side),r&It&&e.writeI32(t.renderOrder),r&Ht&&(e.writeFloat32Array(t.uvs),e.writeString(t.texture.mimeType||"image/png"),e.writeU32(t.texture.bytes.byteLength),e.writeBytes(t.texture.bytes))}function ra(e){const t=e.readString(),r=e.readU32(),a=[e.readF64(),e.readF64(),e.readF64()],n=e.readFloat32Array(),o=e.readU8(),i={layer:t,color:r,offset:a,positions:n};if(o&St&&(i.indices=e.readUint32Array()),o&zt&&(i.hatchPattern=e.readJson()),o&Pt&&(i.gradientFill=e.readJson()),o&Ft&&(i.gradientPositions=e.readFloat32Array()),o&Bt&&(i.side=e.readU8()),o&qr&&(i.points=!0),o&It&&(i.renderOrder=e.readI32()),o&Ht){i.uvs=e.readFloat32Array();const s=e.readString()||"image/png",l=e.readU32();i.texture={mimeType:s,bytes:e.readBytes(l)}}return i}const Yt=1329939265,aa=1,Vn=5e5,rc=1e5,Xn=1,Yn=2,Zn=3,Gn=4,Kn=5,Wn=6,Jn=7;function na(e){var t;switch(e.kind){case"line":return 37;case"circle":return 30;case"arc":return 46;case"ellipse":return 71;case"point":return 21;case"path":return 10+e.vertices.length*8;case"spline":return 10+(e.controlPoints.length+e.knots.length+e.weights.length+(((t=e.fitPoints)==null?void 0:t.length)??0))*8+16;default:return e}}function qn(e,t){if(e.length===0)return[];const r=[];let a=[],n=64;const o=()=>{a.length!==0&&(r.push(a),a=[],n=64)};for(const i of e){const s=na(i);a.length>0&&n+s>t&&o(),a.push(i),n+=s}return o(),r}function Ie(e){const t=new Nt;t.writeU32(Yt),t.writeU8(aa),t.writeU8(0),t.writeU8(0),t.writeU8(0);const r=[],a=new Map,n=o=>{const i=a.get(o);if(i!=null)return i;const s=r.length;return r.push(o),a.set(o,s),s};for(const o of e.primitives)n(o.layer);t.writeU32(r.length);for(const o of r)t.writeString(o);t.writeU32(e.primitives.length);for(const o of e.primitives)nc(t,o,n(o.layer));return t.toUint8Array()}function Zt(e){const t=new _t(e);if(t.readU32()!==Yt)throw new Error("Invalid osnap catalog magic");const r=t.readU8();if(t.readU8(),t.readU8(),t.readU8(),r!==aa)throw new Error(`Unsupported osnap catalog version: ${r}`);const a=t.readU32();if(a>rc)throw new Error("Osnap layer count exceeds limit");const n=[];for(let s=0;s<a;s++)n.push(t.readString());const o=t.readU32();if(o>Vn)throw new Error("Osnap primitive count exceeds limit");const i=[];for(let s=0;s<o;s++)i.push(oc(t,n));return{primitives:i}}function Qn(e){const t=Ie(e),r=Ee(t).bytes;return{uncompressed:t,compressed:r}}async function ac(e){const t=Ie(e),r=(await Gr(t)).bytes;return{uncompressed:t,compressed:r}}function eo(e){return Zt($t(e))}function to(e){return Kr(e)?eo(e):Zt(e)}function gr(e,t){e.writeU8(t<0?0:1)}function wr(e){return e.readU8()===0?-1:1}function Ne(e,t){e.writeU32(t.length);for(const r of t)e.writeF64(r)}function _e(e){const t=e.readU32();if(t>Vn)throw new Error("Float64 array count exceeds limit");const r=[];for(let a=0;a<t;a++)r.push(e.readF64());return r}function nc(e,t,r){switch(t.kind){case"line":e.writeU8(Xn),e.writeU32(r),e.writeF64(t.x0),e.writeF64(t.y0),e.writeF64(t.x1),e.writeF64(t.y1);return;case"circle":e.writeU8(Yn),e.writeU32(r),e.writeF64(t.cx),e.writeF64(t.cy),e.writeF64(t.r),gr(e,t.normalSign);return;case"arc":e.writeU8(Zn),e.writeU32(r),e.writeF64(t.cx),e.writeF64(t.cy),e.writeF64(t.r),e.writeF64(t.startAngle),e.writeF64(t.endAngle),gr(e,t.normalSign);return;case"ellipse":e.writeU8(Gn),e.writeU32(r),e.writeF64(t.cx),e.writeF64(t.cy),e.writeF64(t.majorX),e.writeF64(t.majorY),e.writeF64(t.majorR),e.writeF64(t.minorR),e.writeF64(t.startAngle),e.writeF64(t.endAngle),e.writeU8(t.closed?1:0),gr(e,t.normalSign??1);return;case"spline":e.writeU8(Kn),e.writeU32(r),Ne(e,t.controlPoints),e.writeU32(t.degree),Ne(e,t.knots),Ne(e,t.weights),e.writeU8(t.closed?1:0),Ne(e,t.fitPoints??[]);return;case"point":e.writeU8(Wn),e.writeU32(r),e.writeF64(t.x),e.writeF64(t.y);return;case"path":e.writeU8(Jn),e.writeU32(r),e.writeU8(t.closed?1:0),Ne(e,t.vertices);return;default:{const a=t;throw new Error(`Unsupported osnap primitive: ${String(a)}`)}}}function oc(e,t){const r=e.readU8(),a=e.readU32(),n=t[a];if(n==null)throw new Error(`Invalid osnap layer index: ${a}`);switch(r){case Xn:return{kind:"line",layer:n,x0:e.readF64(),y0:e.readF64(),x1:e.readF64(),y1:e.readF64()};case Yn:return{kind:"circle",layer:n,cx:e.readF64(),cy:e.readF64(),r:e.readF64(),normalSign:wr(e)};case Zn:return{kind:"arc",layer:n,cx:e.readF64(),cy:e.readF64(),r:e.readF64(),startAngle:e.readF64(),endAngle:e.readF64(),normalSign:wr(e)};case Gn:return{kind:"ellipse",layer:n,cx:e.readF64(),cy:e.readF64(),majorX:e.readF64(),majorY:e.readF64(),majorR:e.readF64(),minorR:e.readF64(),startAngle:e.readF64(),endAngle:e.readF64(),closed:e.readU8()!==0,normalSign:wr(e)};case Kn:{const o=_e(e),i=e.readU32(),s=_e(e),l=_e(e),c=e.readU8()!==0,d=_e(e);return{kind:"spline",layer:n,controlPoints:o,degree:i,knots:s,weights:l,closed:c,...d.length>0?{fitPoints:d}:{}}}case Wn:return{kind:"point",layer:n,x:e.readF64(),y:e.readF64()};case Jn:{const o=e.readU8()!==0,i=_e(e);return{kind:"path",layer:n,closed:o,vertices:i}}default:throw new Error(`Unsupported osnap primitive kind: ${r}`)}}const ro=1480934209;function ao(e){if(e.version!==D)throw new Error(`Unsupported snapshot version: ${e.version}`);const t=new Nt;t.writeU32(ro),t.writeU8(D),t.writeU8(0),t.writeU8(0),t.writeU8(0),t.writeJson(ic(e)),t.writeJson(e.layers),t.writeString(e.activeLayoutBtrId),t.writeU32(e.layouts.length);for(const r of e.layouts)lc(t,r);return t.toUint8Array()}function no(e){const t=new _t(e);if(t.readU32()!==ro)throw new Error("Invalid snapshot magic");const r=t.readU8();if(t.readU8(),t.readU8(),t.readU8(),r!==D)throw new Error(`Unsupported snapshot version: ${r}`);const a=t.readJson(),n=t.readJson(),o=t.readString(),i=t.readU32(),s=[];for(let l=0;l<i;l++)s.push(dc(t));return sc(s,a.savedViews),{version:D,meta:a,layers:n,layouts:s,activeLayoutBtrId:o}}function ic(e){const t={...e.meta.savedViews??{}};for(const r of e.layouts)r.savedView&&(t[r.btrId]=r.savedView);if(Object.keys(t).length===0){if(e.meta.savedViews==null)return e.meta;const{savedViews:r,...a}=e.meta;return a}return{...e.meta,savedViews:t}}function sc(e,t){if(t)for(const r of e){if(r.savedView)continue;const a=t[r.btrId];a&&(r.savedView=a)}}function lc(e,t){e.writeString(t.btrId),e.writeString(t.name),e.writeU8(t.isModelSpace?1:0),cc(e,t.osnap),e.writeJson(t.viewports??null),e.writeU32(t.lineBatches.length);for(const r of t.lineBatches)Qr(e,r);e.writeU32(t.meshBatches.length);for(const r of t.meshBatches)ta(e,r)}function cc(e,t){if(!t||t.primitives.length===0){e.writeU32(0);return}const r=Ie(t);e.writeU32(r.length),e.writeBytes(r)}function dc(e){const t=e.readString(),r=e.readString(),a=e.readU8()!==0,n=mc(e),o=uc(e.readJson()),i=e.readU32(),s=[];for(let d=0;d<i;d++)s.push(ea(e));const l=e.readU32(),c=[];for(let d=0;d<l;d++)c.push(ra(e));return{btrId:t,name:r,isModelSpace:a,lineBatches:s,meshBatches:c,osnap:n,viewports:o}}function uc(e){if(e!=null){if(Array.isArray(e))return e;if(typeof e=="object")return e.viewports??void 0}}function mc(e){const t=e.readU32();if(t===0)return;const r=e.readBytes(t);if(pc(r))return Zt(r);const a=Zr(r);if(!(a.length===0||a==="null"))return JSON.parse(a)}function pc(e){return e.length<4?!1:(e[0]|e[1]<<8|e[2]<<16|e[3]<<24)>>>0===Yt}const hc="application/vnd.mlightcad.acex-snapshot+binary";function oa(e){if(e.version!==D)throw new Error(`Unsupported snapshot version: ${e.version}`);const t=ao(e),r=Ee(t);return{payload:Be(r.bytes,"base85"),compression:r.compression}}function fc(e,t="base85"){return oo(io(e,t))}function oo(e){const t=$t(e);return no(t)}function io(e,t="base85"){const r=t==="base64"||t==="base85"?t:Wr(t);return ot(e,r)}function so(){return hc}function re(e,t,r){if(r<=0)return new Float32Array(0);if(e instanceof Float32Array)return e.subarray(t,t+r).slice();const a=new Float32Array(r);for(let n=0;n<r;n++)a[n]=e[t+n];return a}function lo(e,t,r){if(r<=0)return new Uint32Array(0);const a=new Uint32Array(r);for(let n=0;n<r;n++)a[n]=e[t+n];return a}function ia(e,t){if(t.length===0)return{positions:e,indices:t};let r=0;for(let n=0;n<t.length;n++){const o=t[n];o>r&&(r=o)}const a=(r+1)*3;return a>=e.length?{positions:e,indices:t}:{positions:re(e,0,a),indices:t}}function Ke(e,t){return e+t}const Ae={x:0,y:0,z:0};function co(e){e.updateMatrixWorld(!0);const t=e.matrixWorld.elements;return Ae.x=t[12],Ae.y=t[13],Ae.z=t[14],[Ae.x,Ae.y,Ae.z]}function Gt(e,t){const r=t.elements,a=e.positions;if(a.length===0)return{positions:new Float32Array(0),indices:e.indices};const n=new Float32Array(a.length);for(let o=0;o<a.length;o+=3){const i=a[o],s=a[o+1],l=a[o+2];n[o]=r[0]*i+r[4]*s+r[8]*l+r[12],n[o+1]=r[1]*i+r[5]*s+r[9]*l+r[13],n[o+2]=r[2]*i+r[6]*s+r[10]*l+r[14]}return{positions:n,indices:e.indices?new Uint32Array(e.indices):void 0}}function Wa(e,t){const r=t*3;return Number.isFinite(e[r])&&Number.isFinite(e[r+1])&&Number.isFinite(e[r+2])}function we(e,t){const r=e.positions,a=r.length/3|0;if(a===0||t<=0)return e;let n=!1;for(let s=0;s<r.length;s++)if(!Number.isFinite(r[s])){n=!0;break}if(!n)return e;const o=e.indices;if(o&&o.length>0){const s=[];for(let u=0;u+t<=o.length;u+=t){let p=!0;for(let m=0;m<t;m++){const h=o[u+m];if(h<0||h>=a||!Wa(r,h)){p=!1;break}}if(p)for(let m=0;m<t;m++)s.push(o[u+m])}if(s.length===0)return{positions:new Float32Array(0)};const l=new Int32Array(a);l.fill(-1);const c=[],d=new Uint32Array(s.length);for(let u=0;u<s.length;u++){const p=s[u];let m=l[p];if(m<0){m=c.length/3,l[p]=m;const h=p*3;c.push(r[h],r[h+1],r[h+2])}d[u]=m}return{positions:Float32Array.from(c),indices:d}}const i=[];for(let s=0;s+t<=a;s+=t){let l=!0;for(let c=0;c<t;c++)if(!Wa(r,s+c)){l=!1;break}if(l)for(let c=0;c<t;c++){const d=(s+c)*3;i.push(r[d],r[d+1],r[d+2])}}return i.length===0?{positions:new Float32Array(0)}:{positions:Float32Array.from(i)}}function Kt(e){const t=e.positions;if(t.length<3)return{slice:e,offset:[0,0,0]};let r=1/0,a=1/0,n=1/0,o=-1/0,i=-1/0,s=-1/0,l=0;for(let u=0;u<t.length;u+=3){const p=t[u],m=t[u+1],h=t[u+2];!Number.isFinite(p)||!Number.isFinite(m)||!Number.isFinite(h)||(l++,r=Math.min(r,p),a=Math.min(a,m),n=Math.min(n,h),o=Math.max(o,p),i=Math.max(i,m),s=Math.max(s,h))}if(l===0)return{slice:{positions:new Float32Array(0)},offset:[0,0,0]};const c=[(r+o)/2,(a+i)/2,(n+s)/2],d=new Float32Array(t.length);for(let u=0;u<t.length;u+=3){const p=t[u],m=t[u+1],h=t[u+2];if(!Number.isFinite(p)||!Number.isFinite(m)||!Number.isFinite(h)){d[u]=0,d[u+1]=0,d[u+2]=0;continue}d[u]=p-c[0],d[u+1]=m-c[1],d[u+2]=h-c[2]}return{slice:{positions:d,indices:e.indices?new Uint32Array(e.indices):void 0},offset:c}}function uo(e,t,r={}){e.updateMatrixWorld(!0);const a=Gt(t,e.matrixWorld);return Kt(a)}function mo(e){const t=e.image;if(!t||typeof document>"u")return;const r=document.createElement("canvas"),a=r.getContext("2d");if(!a)return;try{if(t instanceof ImageData)r.width=t.width,r.height=t.height,a.putImageData(t,0,0);else if(wc(t)){r.width=t.width,r.height=t.height;const l=yc(t.data,t.width*t.height),c=new ImageData(new Uint8ClampedArray(l),t.width,t.height);a.putImageData(c,0,0)}else if(gc(t)){const l=bc(t);if(!l)return;r.width=l.width,r.height=l.height,a.drawImage(t,0,0)}else return}catch{return}const n=r.toDataURL("image/png"),o=n.indexOf(",");if(o<0)return;const i=atob(n.slice(o+1)),s=new Uint8Array(i.length);for(let l=0;l<i.length;l++)s[l]=i.charCodeAt(l);return{mimeType:"image/png",bytes:s}}function gc(e){return e instanceof HTMLImageElement||e instanceof HTMLCanvasElement||typeof OffscreenCanvas<"u"&&e instanceof OffscreenCanvas||typeof ImageBitmap<"u"&&e instanceof ImageBitmap||typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement}function wc(e){if(!e||typeof e!="object")return!1;const t=e;return t.data!=null&&typeof t.width=="number"&&typeof t.height=="number"&&t.width>=1&&t.height>=1}function bc(e){let t=Number(e.width),r=Number(e.height);if(e instanceof HTMLImageElement?(t=e.naturalWidth||e.width,r=e.naturalHeight||e.height):typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement&&(t=e.videoWidth||e.width,r=e.videoHeight||e.height),!(!Number.isFinite(t)||!Number.isFinite(r)||t<1||r<1))return{width:t,height:r}}function yc(e,t){const r=t*4;if(e instanceof Uint8ClampedArray&&e.length>=r)return e.length===r?e:e.subarray(0,r);const a=new Uint8ClampedArray(r),n=Math.min(r,e.length);for(let o=0;o<n;o++)a[o]=e[o];if(e.length>=t*3&&e.length<r)for(let o=t-1;o>=0;o--){const i=o*3,s=o*4;a[s]=e[i],a[s+1]=e[i+1],a[s+2]=e[i+2],a[s+3]=255}return a}function po(e,t){const r=e.getAttribute("uv");if(!r||r.count===0||r.itemSize<2)return;const a=Math.floor(t.length/3)*2;if(a<=0)return;const n=r.array;if(!(r.count*r.itemSize<a))return re(n,0,a)}function sa(e){const t=e;return t.map?!1:t.transparent===!0&&typeof t.opacity=="number"&&t.opacity<.01}function ho(e,t={}){const r=new Blob([e.bytes],{type:e.mimeType||"image/png"}),a=URL.createObjectURL(r),n=new Bs().load(a,o=>{var i;URL.revokeObjectURL(a),(i=t.onLoad)==null||i.call(t,o)},void 0,()=>{var o;URL.revokeObjectURL(a),(o=t.onError)==null||o.call(t)});return n.colorSpace=Is,n.needsUpdate=!0,n}function fo(e){e&&(e.bytes=new Uint8Array(0))}const la={value:1};function ca(e){const t=e;if(t.isShaderMaterial===!0||e.type==="ShaderMaterial")return t}function go(e){var t;const r=ca(e);if(!r)return;const a=r.uniforms.pattern,n=r.uniforms.patternLength;if(!a||!n)return;const o=a.value;if(!(!Array.isArray(o)||o.length===0))return{pattern:[...o],patternLength:Number(n.value),viewportScale:Number(((t=r.uniforms.u_viewportScale)==null?void 0:t.value)??1)}}function wo(e){var t;const r=ca(e);if(!r)return;const a=r.uniforms.u_patternLines;if(!a)return;const n=a.value;if(!(!Array.isArray(n)||n.length===0))return{patternAngle:Number(((t=r.uniforms.u_patternAngle)==null?void 0:t.value)??0),patternLines:n.map(vc)}}function bo(e){var t,r,a,n,o;const i=ca(e);if(!i||i.uniforms.u_patternLines)return;const s=(t=i.uniforms.u_startColor)==null?void 0:t.value,l=(r=i.uniforms.u_endColor)==null?void 0:r.value,c=i.uniforms.u_gradientType;if(!(!(s!=null&&s.getHex)||c==null))return{startColor:s.getHex(),endColor:((a=l==null?void 0:l.getHex)==null?void 0:a.call(l))??s.getHex(),angle:Number(((n=i.uniforms.u_angle)==null?void 0:n.value)??0),shift:Number(((o=i.uniforms.u_shift)==null?void 0:o.value)??0),gradientType:Number(c.value)}}function vc(e){return{angle:e.angle,base:[e.base.x,e.base.y],offset:[e.offset.x,e.offset.y],dashLengths:[...e.dashLengths],patternLength:e.patternLength}}function xc(e){return{angle:e.angle,base:new yt(e.base[0],e.base[1]),offset:new yt(e.offset[0],e.offset[1]),dashLengths:[...e.dashLengths],patternLength:e.patternLength}}function Wt(e){const t=e.length/3;if(t<2)return new Float32Array(0);const r=new Float32Array(t);for(let a=0;a<t;a+=2){a===0?r[a]=0:r[a]=r[a-1];const n=e[a*3],o=e[a*3+1],i=e[a*3+2]??0,s=e[(a+1)*3],l=e[(a+1)*3+1],c=e[(a+1)*3+2]??0,d=s-n,u=l-o,p=c-i;r[a+1]=r[a]+Math.sqrt(d*d+u*u+p*p)}return r}function kc(e){const t=e.getAttribute("lineDistance");if(!t||t.count===0)return;if(e.getIndex()){const l=t.array;return re(l,0,t.count)}const r=e.drawRange,a=t.count,n=Math.max(0,Math.min(Math.floor(r.start),a)),o=Math.max(0,a-n),i=!Number.isFinite(r.count)||r.count<=0?o:Math.min(Math.floor(r.count),o);if(i<=0)return;const s=t.array;return re(s,n,i)}function yo(e,t){const r=e.getAttribute(t);if(!r||r.count===0)return;const a=r.itemSize;if(e.getIndex()){const d=r.array;return re(d,0,r.count*a)}const n=e.drawRange,o=r.count,i=Math.max(0,Math.min(Math.floor(n.start),o)),s=Math.max(0,o-i),l=!Number.isFinite(n.count)||n.count<=0?s:Math.min(Math.floor(n.count),s);if(l<=0)return;const c=r.array;return re(c,i*a,l*a)}function Lc(e,t){if(e.lineWidth!=null&&e.lineWidth>0){const r=new kn({color:e.color,linewidth:e.lineWidth});return t&&r.resolution.copy(t),r}return e.linePattern?Cs.createLineShaderMaterialFromScaledPattern(e.linePattern.pattern,e.linePattern.patternLength,e.color,e.linePattern.viewportScale,la):new Hs({color:e.color})}function Ac(e){return new Us({color:e.color,size:1,sizeAttenuation:!1})}function zr(e,t){const r=t[0],a=t[1],n=t[4],o=t[5],i=t[12],s=t[13],l=Math.atan2(a,r),c=(p,m)=>[r*p+n*m+i,a*p+o*m+s],d=(p,m)=>[r*p+n*m,a*p+o*m],u=(p,m,h)=>{const f=Math.cos(h),w=Math.sin(h);return[f*p-w*m,w*p+f*m]};return{patternAngle:e.patternAngle,patternLines:e.patternLines.map(p=>{const m=p.angle+e.patternAngle,h=p.angle+l,f=h+e.patternAngle,[w,b]=d(Math.cos(m),Math.sin(m)),g=Math.hypot(w,b),[k,v]=u(p.offset[0],p.offset[1],m),[A,M]=d(k,v),E=u(A,M,-f);return{angle:h,base:c(p.base[0],p.base[1]),offset:E,dashLengths:p.dashLengths.map(y=>y*g),patternLength:p.patternLength*g}})}}function vo(e,t){return{patternAngle:e.patternAngle,patternLines:e.patternLines.map(r=>{const a=new yt(r.base[0]-t[0],r.base[1]-t[1]),n=new yt(r.offset[0],r.offset[1]);return Ss(a,n,r.angle,e.patternAngle,r.patternLength),{angle:r.angle,base:[a.x,a.y],offset:[r.offset[0],r.offset[1]],dashLengths:[...r.dashLengths],patternLength:r.patternLength}})}}function Cc(e,t={}){if(e.hatchPattern&&e.hatchPattern.patternLines.length>0)try{const r=e.hatchPattern.patternLines.map(xc);return Ms(r,e.hatchPattern.patternAngle,la,new Ln(e.color),0,e.side??_a)}catch{}if(e.gradientFill&&e.gradientPositions&&e.gradientPositions.length>=2)try{return Es(e.gradientFill,e.side??_a)}catch{}if(e.texture&&e.uvs&&e.uvs.length>=2){const r=new $a({color:16777215,side:vr,transparent:!0,opacity:0,depthWrite:!1});return r.map=ho(e.texture,{onLoad:()=>{var a;fo(e.texture),r.opacity=1,r.depthWrite=!0,r.needsUpdate=!0,(a=t.onTextureLoad)==null||a.call(t)}}),r}return new $a({color:e.color,side:vr})}function Pr(e,t){return!Number.isFinite(e)||e<0?0:Math.min(Math.floor(e),t)}function Fr(e,t,r){const a=Math.max(0,t-r);return!Number.isFinite(e)||e<=0?a:Math.min(Math.floor(e),a)}function We(e){const t=e.getAttribute("position");if(!t)return{positions:new Float32Array(0)};const r=e.drawRange,a=t.array,n=t.itemSize,o=e.getIndex();if(o){const l=re(a,0,t.count*n),c=o.array,d=Pr(r.start,o.count),u=Fr(r.count,o.count,d),p=lo(c,d,u);return ia(l,p)}const i=Pr(r.start,t.count),s=Fr(r.count,t.count,i);return{positions:re(a,i*n,s*n)}}function Je(e){return Ps(e.flags)&&Fs(e.flags)}function xo(e){const{count:t}=e.mappingStats;for(let r=0;r<t;r++){let a;try{a=e.getGeometryRangeAt(r)}catch{continue}if(Je(a)&&a.bboxIntersectionCheck)return!0}return!1}function Br(e){return xn(e).bboxIntersectionCheck===!0}const Mc=new Ln;function ko(e,t){return _r(e).vertexColors===!0&&t.hasAttribute("color")}function Lo(e,t){return Mc.setRGB(e.getX(t),e.getY(t),e.getZ(t)).getHex()}function Ec(e,t){var r;const a=e.getAttribute("position"),n=a.itemSize,o=a.array,i=(r=e.getIndex())==null?void 0:r.array;let s=0,l=0;for(const m of t)s+=m.vertexCount,l+=m.indexCount??0;const c=new Float32Array(s*n),d=i?new Uint32Array(l):void 0;let u=0,p=0;for(const m of t){const h=m.vertexStart*n,f=h+m.vertexCount*n;if(o instanceof Float32Array)c.set(o.subarray(h,f),u*n);else for(let w=h;w<f;w++)c[u*n+(w-h)]=o[w];if(d&&i){const w=u-m.vertexStart,b=m.indexStart??0,g=m.indexCount??0;for(let k=0;k<g;k++)d[p++]=i[b+k]+w}u+=m.vertexCount}return d?{positions:c,indices:d}:{positions:c}}function Sc(e){const t=e.getAttribute("color"),r=e.getAttribute("position"),a=e.getIndex(),n=a?a.count:r.count,o=new Map;for(let s=0;s+2<n;s+=3){const l=a?a.getX(s):s,c=a?a.getX(s+1):s+1,d=a?a.getX(s+2):s+2,u=Lo(t,l);let p=o.get(u);p||(p=[],o.set(u,p)),p.push(l,c,d)}if(o.size===1)return[{color:o.keys().next().value,geometry:e}];const i=[];return o.forEach((s,l)=>{const c=new js;for(const d in e.attributes)c.setAttribute(d,e.attributes[d]);c.setIndex(new Ns(Uint32Array.from(s),1)),i.push({color:l,geometry:c})}),i}function Ao(e,t,r){const a=e.geometry;if(!ko(t,a)){r(void 0);return}try{for(const n of Sc(a))e.geometry=n.geometry,r(n.color)}finally{e.geometry=a}}function Jt(e,t){const r=t.getAttribute("position");if(!r)return{positions:new Float32Array(0)};const a=r.itemSize,n=r.array,o=t.getIndex(),{count:i}=e.mappingStats;if(o){const u=re(n,0,r.count*a),p=o.array;let m=0;const h=[];for(let b=0;b<i;b++){let g;try{g=e.getGeometryRangeAt(b)}catch{continue}const k=g.indexStart??0,v=g.indexCount??0;!Je(g)||v<=0||(h.push({start:k,count:v}),m+=v)}if(m===0)return{positions:new Float32Array(0)};const f=new Uint32Array(m);let w=0;for(const b of h)for(let g=0;g<b.count;g++)f[w++]=p[b.start+g];return ia(u,f)}let s=0;const l=[];for(let u=0;u<i;u++){let p;try{p=e.getGeometryRangeAt(u)}catch{continue}if(!Je(p)||p.vertexCount<=0)continue;const m=p.vertexCount*a;l.push({start:p.vertexStart*a,floatCount:m}),s+=m}if(s===0)return{positions:new Float32Array(0)};const c=new Float32Array(s);let d=0;if(n instanceof Float32Array)for(const u of l)c.set(n.subarray(u.start,u.start+u.floatCount),d),d+=u.floatCount;else for(const u of l)for(let p=0;p<u.floatCount;p++)c[d++]=n[u.start+p];return{positions:c}}function Ja(e,t,r){e.push(t.getX(r),t.getY(r),t.getZ(r))}function Co(e,t){const r=t.getAttribute("instanceStart"),a=t.getAttribute("instanceEnd");if(!r||!a)return{positions:new Float32Array(0)};const{count:n}=e.mappingStats,o=[];for(let i=0;i<n;i++){let s;try{s=e.getGeometryRangeAt(i)}catch{continue}if(!Je(s)||s.vertexCount<=0)continue;const l=s.vertexStart,c=l+s.vertexCount;for(let d=l;d<c;d++)Ja(o,r,d),Ja(o,a,d)}return{positions:new Float32Array(o)}}function zc(e,t){const r=e.instanceCount;if(Number.isFinite(r)&&r>=0)return Math.min(Math.floor(r),t);const a=e.drawRange,n=Pr(a.start,t);return Fr(a.count,t,n)}function Pc(e){const t=e.getAttribute("instanceStart"),r=e.getAttribute("instanceEnd");if(!t||!r||t.count===0)return{positions:new Float32Array(0)};const a=zc(e,t.count);if(a<=0)return{positions:new Float32Array(0)};const n=[];for(let o=0;o<a;o++){const i=[t.getX(o),t.getY(o),t.getZ(o)],s=[r.getX(o),r.getY(o),r.getZ(o)];!i.every(Number.isFinite)||!s.every(Number.isFinite)||n.push(i[0],i[1],i[2],s[0],s[1],s[2])}return{positions:new Float32Array(n)}}function wt(e){return zs(e)}function Mo(e){if(e instanceof kn)return e.linewidth}function Xe(e){if("material"in e){const t=e.userData.originalMaterial??e.material;return Array.isArray(t)?t[0]:t}return e.material}function be(e){var t;const r=_r(e),a=r.layer??"0",n=e;let o=n.color!=null?n.color.getHex():r.color??16777215;const i=go(e),s=wo(e),l=bo(e);if(e instanceof Os||e.type==="ShaderMaterial"){const c=(t=e.uniforms.u_color)==null?void 0:t.value;c!=null&&c.getHex?o=c.getHex():l&&(o=l.startColor)}return{color:o,layer:a,linePattern:i,hatchPattern:s,gradientFill:l,side:s||l?e.side:void 0}}function Fc(e,t){const r=_r(t).drawOrder??e.renderOrder;return r===0?void 0:r}function Se(e,t,r){const a=Fc(t,r);a!=null&&(e.renderOrder=a)}function Bc(e,t){if(!t)return;const r=e.userData.bakedWorldMatrix;return r&&r.length>=16?zr(t,r):(e.updateMatrixWorld(!0),zr(t,Array.from(e.matrixWorld.elements)))}function it(e){return co(e)}function br(e,t,r={}){const a=uo(e,t,r);return{...a.slice,offset:a.offset}}function Ic(e){if(e.indices&&e.indices.length>=3)return e;const t=e.positions.length/3|0;if(t<3||t%3!==0)return e;const r=new Uint32Array(t);for(let a=0;a<t;a++)r[a]=a;return{...e,indices:r}}function ze(e,t,r,a,n,o=!1,i){o&&(a=Ic(a));const s=be(t);i!==void 0&&(s.color=i);const l=Bc(r,s.hatchPattern),c=l?vo(l,n):void 0,d=s.gradientFill?yo(e,"gradientPosition"):void 0,u={layer:s.layer,color:s.color,offset:n,hatchPattern:c,gradientFill:s.gradientFill,gradientPositions:d,side:s.side,...a},p=t;if(p.map){const m=mo(p.map),h=po(e,a.positions);if(!m||!h)return;u.texture=m,u.uvs=h,u.color=16777215,u.side=vr}return Se(u,r,t),u}function Hc(e){const t=Co(e,e.geometry);if(t.positions.length===0)return;const{color:r,layer:a}=be(e.material),n=Mo(e.material),o={layer:a,color:r,offset:it(e),lineWidth:n,...t};return xo(e)&&(o.excludeFromOsnap=!0),Se(o,e,e.material),o}function Uc(e){const t=Jt(e,e.geometry);if(t.positions.length===0)return;const{color:r,layer:a,linePattern:n}=be(e.material),o=n?Wt(t.positions):void 0,i={layer:a,color:r,offset:it(e),linePattern:n,lineDistances:o,...t};return xo(e)&&(i.excludeFromOsnap=!0),Se(i,e,e.material),i}function Tc(e){const t=e.material;if(ko(t,e.geometry))return Rc(e,t);const r=Jt(e,e.geometry);if(r.positions.length===0)return[];const a=ze(e.geometry,t,e,r,it(e),!0);return a?[a]:[]}function Rc(e,t){const r=e.geometry.getAttribute("color"),a=e.geometry.getIndex()!==null,n=new Map,{count:o}=e.mappingStats;for(let l=0;l<o;l++){let c;try{c=e.getGeometryRangeAt(l)}catch{continue}if(!Je(c)||c.vertexCount<=0||a&&(c.indexCount??0)<=0)continue;const d=Lo(r,c.vertexStart),u=n.get(d);u?u.push(c):n.set(d,[c])}const i=it(e),s=[];return n.forEach((l,c)=>{const d=ze(e.geometry,t,e,Ec(e.geometry,l),i,!0,c);d&&s.push(d)}),s}function Dc(e){const t=Jt(e,e.geometry);if(t.positions.length===0)return;const r=ze(e.geometry,e.material,e,t,it(e));if(r)return{points:!0,...r}}const me=new Fe,Ut=new Fe,$e=new _s;$e.matrixAutoUpdate=!1;function Oc(e){const t=e;return t.isInstancedMesh===!0&&t.instanceMatrix!=null&&typeof t.count=="number"&&t.geometry!=null}function jc(e){return e.renderOrder<1e4||e.isInstancedMesh===!0?!1:xn(e).sharesTemplateGeometry===!0}function Ir(e){const t=e.elements;for(let o=0;o<16;o++)if(!Number.isFinite(t[o]))return!1;const r=Math.hypot(t[0],t[1],t[2]),a=Math.hypot(t[4],t[5],t[6]),n=Math.hypot(t[8],t[9],t[10]);return r+a+n>=1e-8}function Eo(e,t){var r;const a=we(We(e.geometry),t),n=a.positions.length;if(n===0)return;e.updateMatrixWorld(!0);const o=e.instanceMatrix.array,i=((r=a.indices)==null?void 0:r.length)??0;let s=0;for(let m=0;m<e.count;m++)me.fromArray(o,m*16),Ir(me)&&s++;if(s===0)return;const l=new Float32Array(s*n),c=a.indices!=null?new Uint32Array(s*i):void 0,d=n/3;let u=0;for(let m=0;m<e.count;m++){if(me.fromArray(o,m*16),!Ir(me))continue;Ut.multiplyMatrices(e.matrixWorld,me);const h=Gt(a,Ut);if(l.set(h.positions,u*n),c&&h.indices){const f=u*d;for(let w=0;w<h.indices.length;w++)c[u*i+w]=h.indices[w]+f}u++}const p=Kt(we({positions:l,indices:c},t));if(p.slice.positions.length!==0)return{slice:p.slice,offset:p.offset}}function Nc(e){const t=be(e),r=e;return!!(t.hatchPattern||t.gradientFill||r.map)}function _c(e,t){e.updateMatrixWorld(!0);const r=e.instanceMatrix.array;for(let a=0;a<e.count;a++)me.fromArray(r,a*16),Ir(me)&&(Ut.multiplyMatrices(e.matrixWorld,me),t(Ut))}function $c(e,t){const r=Eo(e,2);if(!r)return;const a=Xe(e),{color:n,layer:o,linePattern:i}=be(a),s=i?Wt(r.slice.positions):void 0,l={layer:o,color:n,offset:r.offset,linePattern:i,lineDistances:s,...r.slice};Br(e)&&(l.excludeFromOsnap=!0),Se(l,e,a),t.push(l)}function qa(e,t,r){const a=Xe(e);if(r){Qa(e,a,t,!0,void 0);return}sa(a)||Ao(e,a,n=>Qa(e,a,t,!1,n))}function Qa(e,t,r,a,n){if(!a&&Nc(t)){const s=we(We(e.geometry),3);if(s.positions.length===0)return;_c(e,l=>{const c=we(Gt(s,l),3);if(c.positions.length===0)return;const d=Kt(c);$e.matrix.copy(l),$e.matrixWorld.copy(l),$e.matrixWorldNeedsUpdate=!1;const u=ze(e.geometry,t,$e,d.slice,d.offset,!0,n);u&&r.push(u)});return}const o=Eo(e,a?1:3);if(!o)return;const i=ze(e.geometry,t,e,o.slice,o.offset,!a,n);i&&r.push(a?{...i,points:!0}:i)}function bt(e){const t=e;return e instanceof Rs||t.isLineSegments2===!0||e.type==="LineSegments2"}function en(e){const t=e;return e instanceof Ts||t.isLineSegments===!0||e.type==="LineSegments"}function tn(e){const t=e;return e instanceof Ds||t.isMesh===!0||t.isInstancedMesh===!0||e.type==="Mesh"}function So(e){const t=[],r=[];return e.traverse(a=>{if(!(vs(a)||xs(a)||jc(a))){if(Oc(a)){if(!wt(a))return;a.isPoints===!0?qa(a,r,!0):en(a)&&!bt(a)?$c(a,t):tn(a)&&!bt(a)&&qa(a,r,!1);return}if(a instanceof ja){const n=Uc(a);n&&t.push(n);return}if(a instanceof ks){const n=Hc(a);n&&t.push(n);return}if(a instanceof Na){for(const n of Tc(a))r.push(n);return}if(a instanceof Ls){const n=Dc(a);n&&r.push(n);return}if(bt(a)){if(!wt(a))return;const n=Pc(a.geometry);if(n.positions.length===0)return;const o=Xe(a),{color:i,layer:s}=be(o),{offset:l,...c}=br(a,n),d={layer:s,color:i,offset:l,lineWidth:Mo(o),...c};Br(a)&&(d.excludeFromOsnap=!0),Se(d,a,o),t.push(d)}else if(en(a)&&!(a instanceof ja)){if(!wt(a))return;const n=we(We(a.geometry),2);if(n.positions.length===0)return;const o=Xe(a),{color:i,layer:s,linePattern:l}=be(o),{offset:c,...d}=br(a,n),u=l?Wt(d.positions):void 0,p={layer:s,color:i,offset:c,linePattern:l,lineDistances:u,...d};Br(a)&&(p.excludeFromOsnap=!0),Se(p,a,o),t.push(p)}else if(tn(a)&&!bt(a)&&!(a instanceof Na)){if(!wt(a))return;const n=Xe(a);if(sa(n))return;Ao(a,n,o=>{const i=we(We(a.geometry),3);if(i.positions.length===0)return;const{offset:s,...l}=br(a,i),c=ze(a.geometry,n,a,l,s,!0,o);c&&r.push(c)})}}}),{lineBatches:t,meshBatches:r}}const rn={size:8,colorCss:"#0080ff",hotColorCss:"#ff0000"};function an(e){const t=new fl(gl.ByACI,e);return t.cssColor??`rgb(${t.red}, ${t.green}, ${t.blue})`}function Vc(e){try{const t=Xs.instance(),r=t.getVar(dr.GRIPSIZE,e),a=t.getVar(dr.GRIPCOLOR,e),n=t.getVar(dr.GRIPHOT,e);return!(r>0)||!Number.isFinite(r)?rn:{size:r,colorCss:an(a),hotColorCss:an(n)}}catch{return rn}}function da(e,t){const r=e.extmin,a=e.extmax,n=Vc(e);return{title:t==null?void 0:t.title,extents:{minX:r.x,minY:r.y,maxX:a.x,maxY:a.y},units:{insunits:e.insunits,lunits:e.lunits,luprec:e.luprec,aunits:e.aunits,auprec:e.auprec,measurement:e.measurement,ltscale:e.ltscale,angbase:e.angbase,angdir:e.angdir},grip:n,background:(t==null?void 0:t.background)??0}}const Xc=["endpoint","midpoint","center","quadrant","intersection","nearest"];function ua(e,t){let r=t-e;for(;r<=0;)r+=Ve;for(;r>Ve;)r-=Ve;return r}function Hr(e,t,r,a,n){const o=n===-1?-1:1;return new $r(e+o*r*Math.cos(a),t+r*Math.sin(a))}function Ur(e,t,r,a,n){return Math.atan2(a-t,n*(r-e))}function zo(e){const t=Hr(e.cx,e.cy,e.r,e.startAngle,e.normalSign),r=Hr(e.cx,e.cy,e.r,e.endAngle,e.normalSign),a=ua(e.startAngle,e.endAngle),n=e.normalSign*Math.tan(a/4);return new at(t,r,n)}function Po(e){return ua(e.startAngle,e.endAngle)}function Yc(e,t){const r=Po(e),a=e.startAngle+t*r,n=e.normalSign??1,o=e.majorR*Math.cos(a),i=n*e.minorR*Math.sin(a),s=e.majorX,l=e.majorY;return new $r(e.cx+o*s-i*l,e.cy+o*l+i*s)}function Fo(e){return e.kind==="circle"?new at({x:e.cx,y:e.cy},e.r,0,Ve,e.normalSign===-1):zo(e)}function Bo(e){const t=Math.atan2(e.majorY,e.majorX);return new An({x:e.cx,y:e.cy,z:0},e.majorR,e.minorR,e.startAngle,e.endAngle,e.closed,t)}function Io(e){const t=[];for(let r=0;r+1<e.controlPoints.length;r+=2)t.push({x:e.controlPoints[r],y:e.controlPoints[r+1],z:0});return new Vs(e.degree,e.knots,t,e.weights.length>0?e.weights:void 0)}function Zc(e){switch(e.kind){case"line":return{kind:"line",curve:new Cn({x:e.x0,y:e.y0},{x:e.x1,y:e.y1})};case"circle":case"arc":return{kind:"circArc",curve:Fo(e)};case"ellipse":return{kind:"ellipse",curve:Bo(e)};case"spline":return{kind:"spline",curve:Io(e)};case"point":return{kind:"point",point:new $r(e.x,e.y)};case"path":throw new Error("path primitives must be expanded before curve conversion")}}function ma(e){return e.z>=0?1:-1}function Ho(e,t,r){if(!(r.radius>0)||!Number.isFinite(r.radius))return;const a=r.clockwise?-1:1,n=r.center.x,o=r.center.y;e.push({kind:"arc",layer:t,cx:n,cy:o,r:r.radius,startAngle:Ur(n,o,r.startPoint.x,r.startPoint.y,a),endAngle:Ur(n,o,r.endPoint.x,r.endPoint.y,a),normalSign:a})}function H(e,t){const r=new te(t.x,t.y,t.z??0).applyMatrix4(e);return{x:r.x,y:r.y}}function Gc(e){const t=e.elements;return new Fe(t[0],t[4],t[8],t[12],t[1],t[5],t[9],t[13],t[2],t[6],t[10],t[14],t[3],t[7],t[11],t[15])}function Tt(e,t){return new Fe().multiplyMatrices(e,Gc(t))}function Uo(e,t){const r=new te(t.x,t.y,t.z??0).transformDirection(e).normalize();return{x:r.x,y:r.y}}function Tr(e){const t=new te(e.elements[0],e.elements[1],e.elements[2]).length(),r=new te(e.elements[4],e.elements[5],e.elements[6]).length();return Ce.equal(t,r,Mn*Math.max(t,r,1))}function Kc(e,t){const r=e.tables.blockTable.getIdAt(t);if(r)return r;for(const n of e.tables.blockTable.newIterator())if(n.objectId===t)return n;const a=e.tables.blockTable.modelSpace;if(a.objectId===t)return a}function Wc(e){if(e instanceof wl)return!0;const t=e;return(t.type==="LINE"||t.type==="Line")&&t.startPoint!=null&&t.endPoint!=null}function Jc(e,t,r,a){a.startPoint,a.endPoint}function To(e,t){return e.blockTableRecord??(e.blockName?t.tables.blockTable.getAt(e.blockName):void 0)}function qc(e,t){const r=e.dimBlockId;return r?t.tables.blockTable.getAt(r):void 0}function Qc(e,t){const r=To(e,t);if(r)return r;const a=e.owningBlockRecordId;return a?t.tables.blockTable.getAt(a):void 0}function Ro(e){return e.getFullInsertionTransform()}function ed(e){for(const t of e.newIterator())return!0;return!1}function td(e){return typeof e.getFullInsertionTransform=="function"&&"blockTableRecord"in e}function he(e,t,r,a,n){if(a.length<2)return;const o=Tr(r),i=r.elements[0]*r.elements[5]-r.elements[4]*r.elements[1]<0?-1:1,s=[];for(const l of a){const c=H(r,l);let d=l.bulge??0;Ce.isPositive(Math.abs(d))&&(d=o?d*i:0),s.push(c.x,c.y,d)}e.push({kind:"path",layer:t,closed:n,vertices:s})}function Do(e,t){return Ce.equal(e.x,t.x)&&Ce.equal(e.y,t.y)}function rd(e){return(e.clockwise?-1:1)*Math.tan(e.deltaAngle/4)}function nn(e,t,r,a){if(e.length===0){e.push({x:t.x,y:t.y,z:t.z??0,bulge:a}),e.push({x:r.x,y:r.y,z:r.z??0,bulge:0});return}const n=e[e.length-1];Do(n,t)?n.bulge=a:(n.bulge=0,e.push({x:t.x,y:t.y,z:t.z??0,bulge:a})),e.push({x:r.x,y:r.y,z:r.z??0,bulge:0})}function on(e){return e.length>=2&&Do(e[0],e[e.length-1])&&e.pop(),e}function Ye(e,t,r,a,n){if(a.length<2)return;const o=n?a.length:a.length-1;for(let i=0;i<o;i++)a[i],a[(i+1)%a.length]}function ad(e,t,r,a){const n=[a.startPosition];for(const o of a.segments)n.push(o.position);Ye(e,t,r,n,a.closed)}function nd(e,t,r){if(r.vertices.length>=2)return r.vertices;if(r.vertices.length===0)return[];const a=r.vertices[0],n=t.lastLeaderLinePoint??t.landingPoint??e.landingPoint??e.contentBasePosition;if(!n)return r.vertices;const o=a.x-n.x,i=a.y-n.y,s=(a.z??0)-(n.z??0);return Math.hypot(o,i,s)<=Mn?r.vertices:[a,n]}function od(e,t,r,a){var n,o;for(const s of a.leaders)for(const l of s.leaderLines){const c=nd(a,s,l);Ye(e,t,r,c,!1)}const i=s=>{if(!s)return;const l=H(r,s);e.push({kind:"point",layer:t,x:l.x,y:l.y})};i(a.contentBasePosition),i((n=a.mtextContent)==null?void 0:n.anchorPoint),i((o=a.blockContent)==null?void 0:o.position)}function id(e,t,r,a){const n=a.numberOfVertices;if(n<2)return;const o=a.elevation,i=a.closed?n:n-1;for(let s=0;s<i;s++){const l=a.getPointAt(s),c=a.getPointAt((s+1)%n),d=a.getBulgeAt(s),u={x:l.x,y:l.y,z:o},p={x:c.x,y:c.y,z:o};if(Ce.isPositive(Math.abs(d))){const m=H(r,u),h=H(r,p);Ho(e,t,new at(m,h,d))}}}function sd(e,t,r,a,n,o){const i=H(r,a),s=new te(r.elements[0],r.elements[1],r.elements[2]).length(),l={kind:"circle",layer:t,cx:i.x,cy:i.y,r:n*s,normalSign:ma(o)};e.push(l)}function ld(e,t,r,a){const n=H(r,a.center),o=new te(r.elements[0],r.elements[1],r.elements[2]).length(),i={kind:"arc",layer:t,cx:n.x,cy:n.y,r:a.radius*o,startAngle:a.startAngle,endAngle:a.endAngle,normalSign:ma(a.normal)};e.push(i)}function yr(e,t,r,a){const n=H(r,a.center),o=a._geo,i=(o==null?void 0:o.majorAxis)??{x:1,y:0,z:0},s=Uo(r,i),l=Math.hypot(s.x,s.y)||1,c=new te(r.elements[0],r.elements[1],r.elements[2]).length(),d=new te(r.elements[4],r.elements[5],r.elements[6]).length(),u={kind:"ellipse",layer:t,cx:n.x,cy:n.y,majorX:s.x/l,majorY:s.y/l,majorR:a.majorAxisRadius*c,minorR:a.minorAxisRadius*d,startAngle:a.startAngle,endAngle:a.endAngle,closed:a.closed,normalSign:ma(a.normal)};e.push(u)}function cd(e,t,r,a){var n,o;const i=a._geo;if(!((n=i==null?void 0:i.controlPoints)!=null&&n.length))return;const s=[];for(const c of i.controlPoints){const d=H(r,c);s.push(d.x,d.y)}const l={kind:"spline",layer:t,controlPoints:s,degree:i.degree??3,knots:[...i.knots??[]],weights:[...i.weights??[]],closed:i.closed??!1};if((o=i.fitPoints)!=null&&o.length){l.fitPoints=[];for(const c of i.fitPoints){const d=H(r,c);l.fitPoints.push(d.x,d.y)}}e.push(l)}const sn=1e-6;function dd(e){var t;const r=e.elevation,a=(t=e._geo)==null?void 0:t.vertices;return a&&a.length>1?a.map(n=>({x:n.x,y:n.y,z:r,bulge:n.bulge,startWidth:n.startWidth,endWidth:n.endWidth})):Array.from({length:e.numberOfVertices},(n,o)=>{const i=e.getPoint2dAt(o);return{x:i.x,y:i.y,z:r,bulge:0}})}function ud(e){return e.some(t=>{const r=Math.max(0,t.startWidth??0),a=Math.max(0,t.endWidth??0);return r>sn||a>sn})}function md(e,t,r,a){const n=dd(a),o=n.length;if(o<2)return;if(ud(n)){he(e,t,r,n,a.closed);return}const i=a.closed?o:o-1;for(let s=0;s<i;s++){const l=n[s],c=n[(s+1)%o],d=l.bulge??0;if(Ce.isPositive(Math.abs(d))){const u=H(r,l),p=H(r,c);Ho(e,t,new at(u,p,d))}}}function pd(e,t,r,a,n){const o=H(r,{x:a.center.x,y:a.center.y,z:n}),i=Uo(r,{x:Math.cos(a.rotation),y:Math.sin(a.rotation),z:0}),s=Math.hypot(i.x,i.y)||1,l=new te(r.elements[0],r.elements[1],r.elements[2]).length(),c=new te(r.elements[4],r.elements[5],r.elements[6]).length();e.push({kind:"ellipse",layer:t,cx:o.x,cy:o.y,majorX:i.x/s,majorY:i.y/s,majorR:a.majorAxisRadius*l,minorR:a.minorAxisRadius*c,startAngle:a.startAngle,endAngle:a.endAngle,closed:!1,normalSign:a.clockwise?-1:1})}function hd(e,t,r,a,n){var o;const i=a.numberOfVertices;if(i<2)return;const s=[];for(let l=0;l<i;l++){const c=a.getPointAt(l);s.push({x:c.x,y:c.y,z:n,bulge:((o=a.vertices[l])==null?void 0:o.bulge)??0})}he(e,t,r,s,a.closed)}function fd(e,t,r,a,n){if(a instanceof bl){hd(e,t,r,a,n);return}if(!(a instanceof yl))return;const o=[];let i=!1;const s=()=>{const c=on(o);c.length>=2&&he(e,t,r,c,!1),o.length=0};for(const c of a.curves)c instanceof Cn?nn(o,{x:c.startPoint.x,y:c.startPoint.y,z:n},{x:c.endPoint.x,y:c.endPoint.y,z:n},0):c instanceof at?nn(o,{x:c.startPoint.x,y:c.startPoint.y,z:n},{x:c.endPoint.x,y:c.endPoint.y,z:n},rd(c)):c instanceof An&&(i=!0,s(),pd(e,t,r,c,n));const l=on(o);l.length>=2&&he(e,t,r,l,!i)}function gd(e,t,r,a){var n;const o=(n=a._geo)==null?void 0:n.loops;if(!(o!=null&&o.length))return;const i=a.elevation;for(const s of o)fd(e,t,r,s,i)}function wd(e,t,r,a){Tt(r,Ro(a));const n=[0];for(let i=0;i<a.numColumns;i++)n.push(n[i]+a.columnWidth(i));const o=[0];for(let i=0;i<a.numRows;i++)o.push(o[i]-a.rowHeight(i));n[n.length-1],o[o.length-1];for(const i of o);for(const i of n);}function bd(e,t,r,a,n,o,i,s=!0){const l=Rr(e.layer,r);if(i&&!i(l))return;const c=Qc(e,o);if(c&&!n.has(c.objectId)&&ed(c)){n.add(c.objectId);const u=Tt(t,Ro(e));Rt(c,u,l,a,n,o,i,s),n.delete(c.objectId);return}wd(a,l,t,e);const d=H(t,e.position);a.push({kind:"point",layer:l,x:d.x,y:d.y})}function yd(e,t,r,a){let n=a.boundaryPath();if(n.length>1){const i=n[0],s=n[n.length-1];i.x===s.x&&i.y===s.y&&(i.z??0)===(s.z??0)&&(n=n.slice(0,-1))}n.length>=2&&he(e,t,r,n,!0);const o=H(r,a.position);e.push({kind:"point",layer:t,x:o.x,y:o.y})}function vd(e,t,r,a){const n=a.position();he(e,t,r,[n.upperLeft,n.upperRight,n.lowerRight,n.lowerLeft],!0);const o=H(r,a.getLocation());e.push({kind:"point",layer:t,x:o.x,y:o.y})}function xd(e){var t;const r=(t=e.attributeIterator)==null?void 0:t.call(e);return r?typeof r.toArray=="function"?r.toArray():[...r]:[]}function Rr(e,t){return e==="0"?t:e}function Oo(e,t,r,a,n,o,i,s=!0){if(!e.visibility)return;const l=Rr(e.layer,r);if(!(i&&!i(l))){if(e instanceof Ys){bd(e,t,r,a,n,o,i,s);return}if(td(e)){const c=To(e,o);if(!c||n.has(c.objectId))return;n.add(c.objectId);const d=e.getFullInsertionTransform(),u=Math.max(1,e.columnCount??1),p=Math.max(1,e.rowCount??1),m=e.columnSpacing??0,h=e.rowSpacing??0,f=Rr(e.layer,r);for(let w=0;w<p;w++)for(let b=0;b<u;b++){const g=Tt(t,d);(b!==0||w!==0)&&g.multiply(new Fe().makeTranslation(b*m,w*h,0));const k=H(g,{x:0,y:0,z:0});a.push({kind:"point",layer:f,x:k.x,y:k.y}),Rt(c,g,f,a,n,o,i,s)}for(const w of xd(e))w instanceof Zs,w.isInvisible||Oo(w,t,f,a,n,o,i,s);n.delete(c.objectId);return}if(e instanceof Gs){const c=e,d=qc(c,o);if(!d||n.has(d.objectId))return;n.add(d.objectId);const u=Tt(t,c.getFullDimBlockTransform());Rt(d,u,l,a,n,o,i,!0),n.delete(d.objectId);return}if(Wc(e)){Jc(a,l,t,e);return}if(e instanceof Ks){Tr(t)?sd(a,l,t,e.center,e.radius,e.normal):yr(a,l,t,kd(e));return}if(e instanceof Ws){Tr(t)?ld(a,l,t,e):yr(a,l,t,Ld(e));return}if(e instanceof Vr){yr(a,l,t,e);return}if(e instanceof Js){cd(a,l,t,e);return}if(e instanceof qs){md(a,l,t,e);return}if(e instanceof Qs){id(a,l,t,e);return}if(e instanceof el){const c=[];for(let d=0;d<e.numberOfVertices;d++)c.push(e.getPointAt(d));Ye(a,l,t,c,e.closed);return}if(e instanceof tl){s&&gd(a,l,t,e);return}if(e instanceof rl){e.basePoint,e.unitDir;return}if(e instanceof al){e.basePoint,e.unitDir;return}if(e instanceof nl){he(a,l,t,[e.getPointAt(0),e.getPointAt(1),e.getPointAt(3),e.getPointAt(2)],!0);return}if(e instanceof ol){s&&he(a,l,t,[e.getPointAt(0),e.getPointAt(1),e.getPointAt(3),e.getPointAt(2)],!0);return}if(e instanceof il){const c=e.subGetGripPoints();c.length>=2&&Ye(a,l,t,c,c.length>=3);return}if(e instanceof sl){const c=e.vertices;c.length>=2&&Ye(a,l,t,c,!1);return}if(e instanceof ll){ad(a,l,t,e);return}if(e instanceof cl){od(a,l,t,e);return}if(e instanceof dl){const c=H(t,e.position);a.push({kind:"point",layer:l,x:c.x,y:c.y});return}if(e instanceof ul){const c=H(t,e.location);a.push({kind:"point",layer:l,x:c.x,y:c.y});return}if(e instanceof ml){s&&vd(a,l,t,e);return}if(e instanceof pl){s&&yd(a,l,t,e);return}if(e instanceof hl){const c=H(t,e.position);a.push({kind:"point",layer:l,x:c.x,y:c.y})}}}function Rt(e,t,r,a,n,o,i,s=!0){for(const l of e.newIterator())Oo(l,t,r,a,n,o,i,s)}function kd(e){return new Vr(e.center,e.normal,{x:1,y:0,z:0},e.radius,e.radius,0,Ve)}function Ld(e){return new Vr(e.center,e.normal,{x:1,y:0,z:0},e.radius,e.radius,e.startAngle,e.endAngle)}function jo(e,t,r={}){const a=Kc(e,t);if(!a)return{primitives:[]};const n=[],o=new Fe;return Rt(a,o,"0",n,new Set,e,r.includeLayer),{primitives:n.filter(i=>i.kind!=="line"&&Ad(i))}}function Ad(e){switch(e.kind){case"line":return Number.isFinite(e.x0)&&Number.isFinite(e.y0)&&Number.isFinite(e.x1)&&Number.isFinite(e.y1);case"circle":return Number.isFinite(e.cx)&&Number.isFinite(e.cy)&&Number.isFinite(e.r);case"arc":return Number.isFinite(e.cx)&&Number.isFinite(e.cy)&&Number.isFinite(e.r)&&Number.isFinite(e.startAngle)&&Number.isFinite(e.endAngle);case"ellipse":return Number.isFinite(e.cx)&&Number.isFinite(e.cy)&&Number.isFinite(e.majorX)&&Number.isFinite(e.majorY)&&Number.isFinite(e.majorR)&&Number.isFinite(e.minorR)&&Number.isFinite(e.startAngle)&&Number.isFinite(e.endAngle);case"spline":return e.controlPoints.every(t=>Number.isFinite(t))&&e.knots.every(t=>Number.isFinite(t))&&e.weights.every(t=>Number.isFinite(t));case"point":return Number.isFinite(e.x)&&Number.isFinite(e.y);case"path":return e.vertices.length>=6&&e.vertices.length%3===0&&e.vertices.every(t=>Number.isFinite(t));default:return e}}const ge=["en","ja","zh","cs","tr","ar"],pa={en:"EN",ja:"日",zh:"中",cs:"CS",tr:"TR",ar:"AR"},ha="mlcad-html-locale",Cd={en:{toolbar:{viewerTools:"Viewer tools",select:"Select",pan:"Pan",zoom:"Zoom",zoomExtents:"Extents",zoomSmartExtents:"Smart",zoomWindow:"Window",zoomSaved:"Saved",zoomOriginal:"Saved",measureDistance:"Distance",measureContinuous:"Continuous",measureAngle:"Angle",measureArc:"Arc",measureRadius:"Radius",measureArea:"Area",measureCoordinate:"XY",clearMeasurements:"Clear",measureHide:"Hide",measureShow:"Show",measureImport:"Import",measureExport:"Export",measurementPanel:"Results",measure:"Measure",annotation:"Comments",markupCloud:"Cloud",markupCallout:"Callout",markupText:"Text",markupRect:"Rect",markupCircle:"Circle",markupArrow:"Arrow",markupStamp:"Stamp",markupPanel:"Results",markupHide:"Hide",markupShow:"Show",clearMarkups:"Clear",markupImport:"Import",markupExport:"Export",snap:"Snap",layers:"Layers",layout:"Print page",settings:"Settings",simulatedMouseOn:"Mouse",simulatedMouseOff:"Loupe",themeLight:"Light",themeDark:"Dark",switchBg:"Background",language:"Language",localeEn:"English",localeJa:"日本語",localeZh:"中文",localeCs:"Čeština",localeTr:"Türkçe",localeAr:"العربية",collapse:"Collapse toolbar",expand:"Expand toolbar",moreOverflow:"More tools"},settings:{ortho:"Toggle orthogonal mode",polar:"Angle snapping",polarAngles:"Snap angles"},drawStyle:{color:"Color",fontSize:"Text height",pickerTitle:"Select Color",close:"Close",ok:"OK",cancel:"Cancel",index:"Color Index: ",rgb:"RGB: ",input:"Color",inputPlaceholder:"1-255 or #RRGGBB"},shortCutToolbar:{more:"More",undo:"Undo",redo:"Redo",erase:"Delete",collapse:"Collapse toolbar",expand:"Expand toolbar"},textHeight:{title:"Text Height",close:"Close",ok:"OK",cancel:"Cancel",adaptive:"Fit to screen",custom:"Custom text height",customPlaceholder:"World height",fromScreen:"From screen size",fromScreenHint:"Enter how large the text should look on screen at the current zoom. It is converted to a fixed world-space height that stays constant when you zoom later.",screenPxPlaceholder:"Font size",screenUnit:"px",convert:"Convert"},entityPick:{cancel:"Cancel selection"},layers:{title:"Layers",close:"Close layers",showAll:"Show all",hideAll:"Hide all",zoomTo:"Zoom to {name}"},review:{title:"Comments",close:"Close comments",searchPlaceholder:"Search markups",empty:"No markups yet",type:"Type",status:"Status",author:"Author",summary:"Summary",details:"Details",closeDetails:"Close details",label:"Label",comment:"Comment",zoomTo:"Zoom to",delete:"Delete",clear:"Clear all",statusValues:{open:"Open",question:"Question",answered:"Answered",closed:"Closed"}},measurePanel:{title:"Measurements",close:"Close measurements",filterGroup:"Filter by type",filterDistance:"Distance",filterArc:"Arc",filterRadius:"Radius",filterAngle:"Angle",filterArea:"Area",empty:"No measurements yet",type:"Type",value:"Value",delete:"Delete",clear:"Clear all"},session:{length:"Length",angle:"Angle",dx:"ΔX",dy:"ΔY",x:"X",y:"Y",confirm:"Confirm",cancel:"Cancel",help:"Help",back:"Back",collapse:"Collapse",expand:"Expand",undo:"Undo"},touchPointTutorial:{title:"How to pick points precisely?",description:"Long-press on the screen for about 0.5 seconds. A cross appears above your finger and follows as you move, snapping to geometry for more accurate picks.",snoozeToday:"Don't remind me today",hideForever:"Don't remind me again",ok:"Got it"},status:{ready:"Ready",zoomWindowHint:"Click two corners to zoom to a window.",measureDistanceHint:"Click two points to measure distance (object snap enabled).",measureContinuousHint:"Tap successive points to measure each segment; tap ✓ to finish. Long-press for precise snap.",measureAreaHint:"Tap polygon vertices; tap ✓ to finish when at least three points are set. Long-press for precise snap.",measureAngleHint:"Click vertex, then two points on each arm (object snap enabled).",measureArcHint:"Click a circle or arc to measure along it, or click start, a point on the arc, then end (object snap enabled). Ctrl (⌘ on Mac) switches major/minor arc.",measureRadiusHint:"Click a circle or arc to measure its radius (object snap enabled).",measureCoordinateHint:"Click a point to read its X/Y coordinates (object snap enabled).",measureExported:"Exported {count} measurement(s).",measureImported:"Imported {count} measurement(s).",measureImportFailed:"Failed to import measurements: {error}",markupCloudHint:"Click two corners to draw a revision cloud.",markupCalloutHint:"Click the leader tip, or the outline of a cloud / rectangle / circle that has no callout, then the text anchor.",markupTextHint:"Click a point to place text.",markupRectHint:"Click two corners to draw a rectangle.",markupCircleHint:"Click the center, then a point on the circumference.",markupArrowHint:"Click the start point, then the arrow tip.",markupStampHint:"Click to place a stamp (cycles approved / rejected / …).",markupArrowEndHint:"Click the arrow tip.",markupRectCornerHint:"Click the opposite corner.",markupCloudCornerHint:"Click the opposite corner.",markupCalloutAnchorHint:"Click the text bubble position.",markupCircleRadiusHint:"Click a point on the circumference.",markupTextPrompt:"Enter markup text",markupTextEditHint:"Type text on the canvas. Enter to finish, Esc to cancel.",markupShapeCalloutHint:"Click to place the text box (leader attaches to the shape). Esc cancels the callout.",markupDefaultLabel:"Note",markupStampApproved:"APPROVED",markupStampRejected:"REJECTED",markupStampRevised:"REVISED",markupStampForReview:"FOR REVIEW",markupSelected:"Selected markup: {type}",markupSelectedCount:"Selected markups: {count}",markupCount:"Markups: {count}",markupExported:"Exported {count} markup(s).",markupImported:"Imported {count} markup(s).",markupImportFailed:"Failed to import markups: {error}",distance:"Distance: {value}",coordinates:"X: {x} | Y: {y}",angle:"Angle: {value}",arcLength:"Arc length: {length} | Radius: {radius} | Angle: {angle} | Chord: {chord}",radius:"Radius: {value}",continuousTotal:"Total length: {value}",area:"Area: {value}",lengthTotal:"Length total: {value}",areaTotal:"Area total: {value}",zoomLayer:"Zoom: {name}",loadFailed:"Failed to load drawing: {error}",noLayout:"No print page data in snapshot.",loadingChunks:"Loading geometry… {loaded}/{total}",loadingOsnap:"Loading object snap… {loaded}/{total}",buildingOsnap:"Building object snap index…"},package:{title:"Open drawing package",hint:"No drawing.acex.json was found next to this page. Choose a local package folder or enter the manifest URL.",hintUrlOnly:"No drawing.acex.json was found next to this page. Enter the manifest URL to open the package.",chooseFolder:"Choose local folder",urlPlaceholder:"https://example.com/drawing.acex.json",openUrl:"Open URL",urlRequired:"Please enter a manifest URL.",manifestNotFound:"drawing.acex.json was not found next to this page.",invalidManifest:"The package manifest is invalid or uses an unsupported version: {error}",folderMissingManifest:"The selected folder must contain drawing.acex.json.",folderUnsupported:"This browser cannot open a local package folder. Paste a manifest URL instead.",loadFailed:"Failed to open package: {error}"},access:{title:"Protected drawing",passwordPrompt:"Enter the password to open this file.",passwordPlaceholder:"Password",unlock:"Unlock",passwordRequired:"Please enter a password.",wrongPassword:"Incorrect password. Try again.",expired:"This file has expired and can no longer be opened.",expiredTitle:"File expired",expiredDetail:"This file expired on {time} and can no longer be opened.",expiresAt:"Expires: {time}",badgeExpires:"Expires {time}",badgeCountdown:"Expires in {time}",tooManyAttempts:"Too many incorrect password attempts. Refresh the page to try again."}},zh:{toolbar:{viewerTools:"查看器工具",select:"选择",pan:"平移",zoom:"缩放",zoomExtents:"范围",zoomSmartExtents:"智能",zoomWindow:"窗口",zoomSaved:"保存的视图",zoomOriginal:"保存的视图",measureDistance:"测距离",measureContinuous:"连续测",measureAngle:"测角度",measureArc:"测弧长",measureRadius:"测半径",measureArea:"测面积",measureCoordinate:"测坐标",clearMeasurements:"清除",measureHide:"隐藏",measureShow:"显示",measureImport:"导入",measureExport:"导出",measurementPanel:"看结果",measure:"测量",annotation:"批注",markupCloud:"云线",markupCallout:"标注",markupText:"文字",markupRect:"矩形",markupCircle:"圆",markupArrow:"箭头",markupStamp:"图章",markupPanel:"看结果",markupHide:"隐藏",markupShow:"显示",clearMarkups:"清除",markupImport:"导入",markupExport:"导出",snap:"捕捉",layers:"图层",layout:"打印页",settings:"设置",simulatedMouseOn:"鼠标",simulatedMouseOff:"放大",themeLight:"浅色",themeDark:"深色",switchBg:"背景",language:"语言",localeEn:"English",localeJa:"日本語",localeZh:"中文",localeCs:"Čeština",localeTr:"Türkçe",collapse:"收起工具栏",expand:"展开工具栏",moreOverflow:"更多工具"},settings:{ortho:"切换正交模式",polar:"角度吸附",polarAngles:"吸附角度"},drawStyle:{color:"颜色",fontSize:"字高",pickerTitle:"选择颜色",close:"关闭",ok:"确定",cancel:"取消",index:"颜色索引：",rgb:"RGB：",input:"颜色",inputPlaceholder:"1-255 或 #RRGGBB"},shortCutToolbar:{more:"更多",undo:"撤销",redo:"重做",erase:"删除",collapse:"收起工具栏",expand:"展开工具栏"},textHeight:{title:"字高设置",close:"关闭",ok:"确定",cancel:"取消",adaptive:"自适应屏幕",custom:"自定义字高",customPlaceholder:"世界坐标字高",fromScreen:"按屏幕字号换算",fromScreenHint:"按当前视图缩放，输入希望看到的屏幕字号（像素），换算为固定的世界坐标字高；之后缩放时字的世界高度不变。",screenPxPlaceholder:"屏幕字号",screenUnit:"px",convert:"换算"},entityPick:{cancel:"取消选择"},layers:{title:"图层",close:"关闭图层",showAll:"全部显示",hideAll:"全部隐藏",zoomTo:"缩放到 {name}"},review:{title:"批注",close:"关闭批注面板",searchPlaceholder:"搜索批注",empty:"暂无批注",type:"类型",status:"状态",author:"作者",summary:"摘要",details:"详情",closeDetails:"关闭详情",label:"标签",comment:"评论",zoomTo:"缩放到",delete:"删除",clear:"全部清除",statusValues:{open:"打开",question:"疑问",answered:"已答复",closed:"已关闭"}},measurePanel:{title:"测量",close:"关闭测量面板",filterGroup:"按类型筛选",filterDistance:"距离",filterArc:"弧长",filterRadius:"半径",filterAngle:"角度",filterArea:"面积",empty:"暂无测量",type:"类型",value:"数值",delete:"删除",clear:"全部清除"},session:{length:"长度",angle:"角度",dx:"ΔX",dy:"ΔY",x:"X",y:"Y",confirm:"确定",cancel:"取消",help:"帮助",back:"返回",collapse:"收起",expand:"展开",undo:"撤销"},touchPointTutorial:{title:"怎样可以精确取点？",description:"手指在屏幕上长按0.5s左右，上方出现十字，手指移动时十字跟随移动并自动捕捉。取点更精准。",snoozeToday:"今日不再提醒",hideForever:"不再提醒",ok:"我知道了"},status:{ready:"就绪",zoomWindowHint:"点击两个角点以窗口缩放。",measureDistanceHint:"点击两点以测量距离（已启用对象捕捉）。",measureContinuousHint:"依次点击多个点测量各段距离，点 ✓ 完成。长按可精确捕捉。",measureAreaHint:"依次点击多边形顶点；至少三点后点 ✓ 完成。长按可精确捕捉。",measureAngleHint:"依次点击顶点与两条边上的点（已启用对象捕捉）。",measureArcHint:"点击圆或圆弧可沿其测量；否则依次点击弧起点、弧上一点与弧端点（已启用对象捕捉）。锁定后按 Ctrl（Mac 为 Control 或 ⌘）可在大弧与小弧之间切换。",measureRadiusHint:"点击圆或圆弧以测量半径（已启用对象捕捉）。",measureCoordinateHint:"点击一点以读取其 X/Y 坐标（已启用对象捕捉）。",measureExported:"已导出 {count} 条测量。",measureImported:"已导入 {count} 条测量。",measureImportFailed:"导入测量失败：{error}",markupCloudHint:"点击两个对角点绘制修订云线。",markupCalloutHint:"先点击引线端点，或点击尚无标注的云线/矩形/圆外框，再点击文字位置。",markupTextHint:"点击一点放置文字。",markupRectHint:"点击两个对角点绘制矩形。",markupCircleHint:"先点击圆心，再点击圆周上一点。",markupArrowHint:"先点击起点，再点击箭头端点。",markupStampHint:"点击放置图章（在批准/拒绝等之间循环）。",markupArrowEndHint:"点击箭头端点。",markupRectCornerHint:"点击对角点。",markupCloudCornerHint:"点击对角点。",markupCalloutAnchorHint:"点击文字气泡位置。",markupCircleRadiusHint:"点击圆周上一点。",markupTextPrompt:"输入批注文字",markupTextEditHint:"在画布上输入文字。Enter 完成，Esc 取消。",markupShapeCalloutHint:"点击放置文本框（引线自动贴到图形）。Esc 取消引线和文本框。",markupDefaultLabel:"批注",markupStampApproved:"已批准",markupStampRejected:"已驳回",markupStampRevised:"已修订",markupStampForReview:"待审核",markupSelected:"已选批注：{type}",markupSelectedCount:"已选批注：{count} 个",markupCount:"批注数：{count}",markupExported:"已导出 {count} 条批注。",markupImported:"已导入 {count} 条批注。",markupImportFailed:"导入批注失败：{error}",distance:"距离：{value}",coordinates:"X：{x} | Y：{y}",angle:"角度：{value}",arcLength:"弧长：{length} | 半径：{radius} | 总角度：{angle} | 弦长：{chord}",radius:"半径：{value}",continuousTotal:"总长度：{value}",area:"面积：{value}",lengthTotal:"长度合计：{value}",areaTotal:"面积合计：{value}",zoomLayer:"缩放：{name}",loadFailed:"无法加载图纸：{error}",noLayout:"快照中没有打印页数据。",loadingChunks:"正在加载几何… {loaded}/{total}",loadingOsnap:"正在加载对象捕捉… {loaded}/{total}",buildingOsnap:"正在构建对象捕捉索引…"},package:{title:"打开图纸包",hint:"当前页面同级目录未找到 drawing.acex.json。请选择本地包文件夹，或输入清单 URL。",hintUrlOnly:"当前页面同级目录未找到 drawing.acex.json。请输入清单 URL 以打开图纸包。",chooseFolder:"选择本地文件夹",urlPlaceholder:"https://example.com/drawing.acex.json",openUrl:"打开 URL",urlRequired:"请输入清单 URL。",manifestNotFound:"当前页面同级目录未找到 drawing.acex.json。",invalidManifest:"包清单无效或版本不受支持：{error}",folderMissingManifest:"所选文件夹必须包含 drawing.acex.json。",folderUnsupported:"当前浏览器无法选择本地包文件夹，请改为输入清单 URL。",loadFailed:"无法打开图纸包：{error}"},access:{title:"受保护的图纸",passwordPrompt:"请输入密码以打开此文件。",passwordPlaceholder:"密码",unlock:"解锁",passwordRequired:"请输入密码。",wrongPassword:"密码错误，请重试。",expired:"此文件已过期，无法打开。",expiredTitle:"文件已过期",expiredDetail:"此文件已于 {time} 过期，无法打开。",expiresAt:"有效期至：{time}",badgeExpires:"有效期至 {time}",badgeCountdown:"剩余 {time}",tooManyAttempts:"密码错误次数过多，请刷新页面后重新输入。"}},cs:{toolbar:{viewerTools:"Nástroje prohlížeče",select:"Výběr",pan:"Posun",zoom:"Přiblížení",zoomExtents:"Rozsah",zoomSmartExtents:"Chytrý",zoomWindow:"Okno",zoomSaved:"Uložený",zoomOriginal:"Uložený",measureDistance:"Vzdálenost",measureContinuous:"Spojité",measureAngle:"Úhel",measureArc:"Oblouk",measureRadius:"Poloměr",measureArea:"Plocha",measureCoordinate:"Souřadnice",clearMeasurements:"Vymazat",measureHide:"Skrýt",measureShow:"Zobrazit",measureImport:"Import",measureExport:"Export",measurementPanel:"Výsledky",measure:"Měření",annotation:"Komentáře",markupCloud:"Obláček",markupCallout:"Odkaz",markupText:"Text",markupRect:"Obdélník",markupCircle:"Kružnice",markupArrow:"Šipka",markupStamp:"Razítko",markupPanel:"Výsledky",markupHide:"Skrýt",markupShow:"Zobrazit",clearMarkups:"Vymazat",markupImport:"Import",markupExport:"Export",snap:"Uchopit",layers:"Hladiny",layout:"Tisková stránka",settings:"Nastavení",simulatedMouseOn:"Myš",simulatedMouseOff:"Lupa",themeLight:"Světlý",themeDark:"Tmavý",switchBg:"Pozadí",language:"Jazyk",localeEn:"English",localeJa:"日本語",localeZh:"中文",localeCs:"Čeština",localeTr:"Türkçe",collapse:"Sbalit panel nástrojů",expand:"Rozbalit panel nástrojů",moreOverflow:"Další nástroje"},settings:{ortho:"Přepnout ortogonální režim",polar:"Přichytávání úhlu",polarAngles:"Úhly přichycení"},drawStyle:{color:"Barva",fontSize:"Výška textu",pickerTitle:"Vybrat barvu",close:"Zavřít",ok:"OK",cancel:"Zrušit",index:"Index barvy: ",rgb:"RGB: ",input:"Barva",inputPlaceholder:"1-255 nebo #RRGGBB"},shortCutToolbar:{more:"Více",undo:"Zpět",redo:"Znovu",erase:"Smazat",collapse:"Sbalit panel nástrojů",expand:"Rozbalit panel nástrojů"},textHeight:{title:"Výška textu",close:"Zavřít",ok:"OK",cancel:"Zrušit",adaptive:"Přizpůsobit obrazovce",custom:"Vlastní výška textu",customPlaceholder:"Světová výška",fromScreen:"Ze velikosti na obrazovce",fromScreenHint:"Zadejte, jak velký má text vypadat na obrazovce při aktuálním zoomu. Přepočítá se na pevnou světovou výšku, která se při pozdějším zoomování nemění.",screenPxPlaceholder:"Velikost písma",screenUnit:"px",convert:"Přepočítat"},entityPick:{cancel:"Zrušit výběr"},layers:{title:"Hladiny",close:"Zavřít hladiny",showAll:"Zobrazit vše",hideAll:"Skrýt vše",zoomTo:"Přiblížit na {name}"},review:{title:"Komentáře",close:"Zavřít komentáře",searchPlaceholder:"Hledat poznámky",empty:"Zatím žádné poznámky",type:"Typ",status:"Stav",author:"Autor",summary:"Souhrn",details:"Podrobnosti",closeDetails:"Zavřít podrobnosti",label:"Popisek",comment:"Komentář",zoomTo:"Přiblížit na",delete:"Odstranit",clear:"Vymazat vše",statusValues:{open:"Otevřeno",question:"Otázka",answered:"Zodpovězeno",closed:"Uzavřeno"}},measurePanel:{title:"Měření",close:"Zavřít měření",filterGroup:"Filtrovat podle typu",filterDistance:"Vzdálenost",filterArc:"Oblouk",filterRadius:"Poloměr",filterAngle:"Úhel",filterArea:"Plocha",empty:"Zatím žádná měření",type:"Typ",value:"Hodnota",delete:"Odstranit",clear:"Vymazat vše"},session:{length:"Délka",angle:"Úhel",dx:"ΔX",dy:"ΔY",x:"X",y:"Y",confirm:"Potvrdit",cancel:"Zrušit",help:"Nápověda",back:"Zpět",collapse:"Sbalit",expand:"Rozbalit",undo:"Zpět"},touchPointTutorial:{title:"Jak přesně vybrat bod?",description:"Podržte prst na obrazovce asi 0,5 sekundy. Nad prstem se objeví kříž, který při pohybu sleduje prst a přichytává se k geometrii pro přesnější výběr.",snoozeToday:"Dnes už nepřipomínat",hideForever:"Už nepřipomínat",ok:"Rozumím"},status:{ready:"Připraveno",zoomWindowHint:"Klikněte na dva rohy pro přiblížení oknem.",measureDistanceHint:"Klikněte na dva body pro změření vzdálenosti (uchopení objektů zapnuto).",measureContinuousHint:"Klepejte na další body pro měření každého úseku; dokončete klepnutím na ✓. Dlouhé stisknutí pro přesné uchopení.",measureAngleHint:"Klikněte na vrchol, poté na dva body na každém rameni (uchopení objektů zapnuto).",measureArcHint:"Klikněte na kružnici nebo oblouk pro měření podél něj, nebo klikněte na začátek, bod na oblouku a konec (uchopení objektů zapnuto). Ctrl (⌘ na Macu) přepíná velký/malý oblouk.",measureRadiusHint:"Klikněte na kružnici nebo oblouk pro změření poloměru (uchopení objektů zapnuto).",measureAreaHint:"Klepejte na vrcholy mnohoúhelníku; dokončete klepnutím na ✓ po alespoň třech bodech.",measureCoordinateHint:"Klikněte na bod pro zobrazení jeho souřadnic X/Y (uchopení objektů zapnuto).",measureExported:"Exportováno {count} měření.",measureImported:"Importováno {count} měření.",measureImportFailed:"Import měření selhal: {error}",markupCloudHint:"Klikněte na dva rohy pro nakreslení obláčku.",markupCalloutHint:"Klikněte na hrot vodítka, nebo na obrys obláčku/obdélníku/kružnice bez odkazu, a poté na kotvu textu.",markupTextHint:"Klikněte pro umístění textu.",markupRectHint:"Klikněte na dva rohy pro nakreslení obdélníku.",markupCircleHint:"Klikněte na střed a poté na bod na kružnici.",markupArrowHint:"Klikněte na začátek a poté na hrot šipky.",markupStampHint:"Klikněte pro umístění razítka (schváleno / zamítnuto / …).",markupArrowEndHint:"Klikněte na hrot šipky.",markupRectCornerHint:"Klikněte na protilehlý roh.",markupCloudCornerHint:"Klikněte na protilehlý roh.",markupCalloutAnchorHint:"Klikněte na pozici textové bubliny.",markupCircleRadiusHint:"Klikněte na bod na kružnici.",markupTextPrompt:"Zadejte text poznámky",markupTextEditHint:"Pište text přímo na plátno. Enter dokončí, Esc zruší.",markupShapeCalloutHint:"Klikněte pro umístění textového pole (vodítko se připojí k tvaru). Esc zruší odkaz.",markupDefaultLabel:"Poznámka",markupStampApproved:"SCHVÁLENO",markupStampRejected:"ZAMÍTNUTO",markupStampRevised:"REVIDOVÁNO",markupStampForReview:"KE KONTROLE",markupSelected:"Vybraná poznámka: {type}",markupSelectedCount:"Vybrané poznámky: {count}",markupCount:"Poznámky: {count}",markupExported:"Exportováno {count} poznámek.",markupImported:"Importováno {count} poznámek.",markupImportFailed:"Import poznámek selhal: {error}",distance:"Vzdálenost: {value}",coordinates:"X: {x} | Y: {y}",angle:"Úhel: {value}",arcLength:"Délka oblouku: {length} | Poloměr: {radius} | Úhel: {angle} | Tětiva: {chord}",radius:"Poloměr: {value}",continuousTotal:"Celková délka: {value}",area:"Plocha: {value}",lengthTotal:"Celková délka: {value}",areaTotal:"Celková plocha: {value}",zoomLayer:"Zoom: {name}",loadFailed:"Nepodařilo se načíst výkres: {error}",noLayout:"Snímek neobsahuje data tiskových stránek.",loadingChunks:"Načítání geometrie… {loaded}/{total}",loadingOsnap:"Načítání uchopování… {loaded}/{total}",buildingOsnap:"Sestavování indexu uchopování…"},package:{title:"Otevřít balíček výkresu",hint:"Vedle této stránky nebyl nalezen drawing.acex.json. Vyberte místní složku balíčku nebo zadejte URL manifestu.",hintUrlOnly:"Vedle této stránky nebyl nalezen drawing.acex.json. Zadejte URL manifestu pro otevření balíčku.",chooseFolder:"Vybrat místní složku",urlPlaceholder:"https://example.com/drawing.acex.json",openUrl:"Otevřít URL",urlRequired:"Zadejte URL manifestu.",manifestNotFound:"drawing.acex.json nebyl vedle této stránky nalezen.",invalidManifest:"Manifest balíčku je neplatný nebo používá nepodporovanou verzi: {error}",folderMissingManifest:"Vybraná složka musí obsahovat drawing.acex.json.",folderUnsupported:"Tento prohlížeč neumí otevřít místní složku balíčku. Zadejte místo toho URL manifestu.",loadFailed:"Nepodařilo se otevřít balíček: {error}"},access:{title:"Chráněný výkres",passwordPrompt:"Zadejte heslo pro otevření tohoto souboru.",passwordPlaceholder:"Heslo",unlock:"Odemknout",passwordRequired:"Zadejte heslo.",wrongPassword:"Nesprávné heslo. Zkuste to znovu.",expired:"Platnost tohoto souboru vypršela a nelze jej otevřít.",expiredTitle:"Soubor vypršel",expiredDetail:"Platnost tohoto souboru vypršela dne {time} a již jej nelze otevřít.",expiresAt:"Platnost do: {time}",badgeExpires:"Platnost do {time}",badgeCountdown:"Vyprší za {time}",tooManyAttempts:"Příliš mnoho nesprávných pokusů o heslo. Obnovte stránku a zkuste to znovu."}},tr:{toolbar:{viewerTools:"Görüntüleyici araçları",select:"Seç",pan:"Kaydır",zoom:"Yakınlaştır",zoomExtents:"Sınırlar",zoomSmartExtents:"Akıllı",zoomWindow:"Pencere",zoomSaved:"Kayıtlı",zoomOriginal:"Kayıtlı",measureDistance:"Mesafe",measureContinuous:"Sürekli",measureAngle:"Açı",measureArc:"Yay",measureRadius:"Yarıçap",measureArea:"Alan",measureCoordinate:"XY",clearMeasurements:"Temizle",measureHide:"Gizle",measureShow:"Göster",measureImport:"İçe aktar",measureExport:"Dışa aktar",measurementPanel:"Sonuç",measure:"Ölçüm",annotation:"Yorumlar",markupCloud:"Bulut",markupCallout:"Çağrı",markupText:"Metin",markupRect:"Dörtgen",markupCircle:"Daire",markupArrow:"Ok",markupStamp:"Damga",markupPanel:"Sonuç",markupHide:"Gizle",markupShow:"Göster",clearMarkups:"Temizle",markupImport:"İçe aktar",markupExport:"Dışa aktar",snap:"Yakalama",layers:"Katman",layout:"Baskı sayfası",settings:"Ayarlar",simulatedMouseOn:"Fare",simulatedMouseOff:"Büyüteç",themeLight:"Açık",themeDark:"Koyu",switchBg:"Arka plan",language:"Dil",localeEn:"English",localeJa:"日本語",localeZh:"中文",localeCs:"Čeština",localeTr:"Türkçe",collapse:"Araç çubuğunu daralt",expand:"Araç çubuğunu genişlet",moreOverflow:"Diğer araçlar"},settings:{ortho:"Dik modu aç/kapat",polar:"Açı yakalama",polarAngles:"Yakalama açıları"},drawStyle:{color:"Renk",fontSize:"Yazı yüksekliği",pickerTitle:"Renk Seç",close:"Kapat",ok:"Tamam",cancel:"İptal",index:"Renk İndeksi: ",rgb:"RGB: ",input:"Renk",inputPlaceholder:"1-255 veya #RRGGBB"},shortCutToolbar:{more:"Daha fazla",undo:"Geri al",redo:"Yinele",erase:"Sil",collapse:"Araç çubuğunu daralt",expand:"Araç çubuğunu genişlet"},textHeight:{title:"Yazı Yüksekliği",close:"Kapat",ok:"Tamam",cancel:"İptal",adaptive:"Ekrana uyarla",custom:"Özel yazı yüksekliği",customPlaceholder:"Dünya yüksekliği",fromScreen:"Ekran boyutundan",fromScreenHint:"Geçerli yakınlaştırmada ekranda istediğiniz yazı boyutunu girin. Sabit bir dünya yüksekliğine dönüştürülür; sonra yakınlaştırınca bu yükseklik değişmez.",screenPxPlaceholder:"Yazı boyutu",screenUnit:"px",convert:"Dönüştür"},entityPick:{cancel:"Seçimi iptal et"},layers:{title:"Katmanlar",close:"Katmanları kapat",showAll:"Tümünü göster",hideAll:"Tümünü gizle",zoomTo:"{name} katmanına yakınlaştır"},review:{title:"Yorumlar",close:"Yorumları kapat",searchPlaceholder:"İşaretlerde ara",empty:"Henüz işaret yok",type:"Tür",status:"Durum",author:"Yazar",summary:"Özet",details:"Ayrıntılar",closeDetails:"Ayrıntıları kapat",label:"Etiket",comment:"Yorum",zoomTo:"Yakınlaştır",delete:"Sil",clear:"Tümünü temizle",statusValues:{open:"Açık",question:"Soru",answered:"Yanıtlandı",closed:"Kapalı"}},measurePanel:{title:"Ölçümler",close:"Ölçümleri kapat",filterGroup:"Türe göre filtrele",filterDistance:"Mesafe",filterArc:"Yay",filterRadius:"Yarıçap",filterAngle:"Açı",filterArea:"Alan",empty:"Henüz ölçüm yok",type:"Tür",value:"Değer",delete:"Sil",clear:"Tümünü temizle"},session:{length:"Uzunluk",angle:"Açı",dx:"ΔX",dy:"ΔY",x:"X",y:"Y",confirm:"Onayla",cancel:"İptal",help:"Yardım",back:"Geri",collapse:"Daralt",expand:"Genişlet",undo:"Geri al"},touchPointTutorial:{title:"Noktalar nasıl hassas seçilir?",description:"Ekranda yaklaşık 0,5 saniye basılı tutun. Parmağınızın üstünde bir artı belirir ve hareket ederken geometriye yapışarak daha doğru seçim yapmanızı sağlar.",snoozeToday:"Bugün tekrar hatırlatma",hideForever:"Bir daha hatırlatma",ok:"Anladım"},status:{ready:"Hazır",zoomWindowHint:"Pencere yakınlaştırmak için iki köşeyi tıklayın.",measureDistanceHint:"Mesafe ölçmek için iki nokta tıklayın (nesne yakalama etkin).",measureContinuousHint:"Her segmenti ölçmek için ardışık noktalar dokunun; bitirmek için ✓. Hassas yakalama için basılı tutun.",measureAngleHint:"Önce köşe noktasını, sonra her koldan birer nokta tıklayın (nesne yakalama etkin).",measureArcHint:"Ölçmek için bir çember veya yaya tıklayın; ya da yay başlangıcı, yay üzerindeki bir nokta ve yay sonunu tıklayın (nesne yakalama etkin). Ctrl (Mac’te ⌘) büyük/küçük yay arasında geçiş yapar.",measureRadiusHint:"Yarıçap ölçmek için bir çember veya yaya tıklayın (nesne yakalama etkin).",measureAreaHint:"Çokgen köşelerini dokunun; en az üç noktadan sonra bitirmek için ✓.",measureCoordinateHint:"X/Y koordinatlarını okumak için bir nokta tıklayın (nesne yakalama etkin).",measureExported:"{count} ölçüm dışa aktarıldı.",measureImported:"{count} ölçüm içe aktarıldı.",measureImportFailed:"Ölçüm içe aktarılamadı: {error}",markupCloudHint:"Revizyon bulutu çizmek için iki köşe tıklayın.",markupCalloutHint:"Lider ucunu veya çağrısı olmayan bulut/dikdörtgen/daire dış çerçevesini tıklayın, ardından metin konumunu tıklayın.",markupTextHint:"Metin yerleştirmek için bir nokta tıklayın.",markupRectHint:"Dikdörtgen çizmek için iki köşe tıklayın.",markupCircleHint:"Önce merkezi, sonra çevre üzerindeki bir noktayı tıklayın.",markupArrowHint:"Önce başlangıcı, sonra ok ucunu tıklayın.",markupStampHint:"Damga yerleştirmek için tıklayın (onaylandı / reddedildi / …).",markupArrowEndHint:"Ok ucunu tıklayın.",markupRectCornerHint:"Karşı köşeyi tıklayın.",markupCloudCornerHint:"Karşı köşeyi tıklayın.",markupCalloutAnchorHint:"Metin balonu konumunu tıklayın.",markupCircleRadiusHint:"Çevre üzerindeki bir noktayı tıklayın.",markupTextPrompt:"İşaretleme metnini girin",markupTextEditHint:"Metni tuval üzerinde yazın. Enter ile bitirin, Esc ile iptal edin.",markupShapeCalloutHint:"Metin kutusunu yerleştirmek için tıklayın (lider şekle bağlanır). Esc çağrıyı iptal eder.",markupDefaultLabel:"Not",markupStampApproved:"ONAYLANDI",markupStampRejected:"REDDEDİLDİ",markupStampRevised:"DÜZELTİLDİ",markupStampForReview:"İNCELENECEK",markupSelected:"Seçili işaretleme: {type}",markupSelectedCount:"Seçili işaretlemeler: {count}",markupCount:"İşaretlemeler: {count}",markupExported:"{count} işaretleme dışa aktarıldı.",markupImported:"{count} işaretleme içe aktarıldı.",markupImportFailed:"İşaretleme içe aktarılamadı: {error}",distance:"Mesafe: {value}",coordinates:"X: {x} | Y: {y}",angle:"Açı: {value}",arcLength:"Yay uzunluğu: {length} | Yarıçap: {radius} | Açı: {angle} | Kiriş: {chord}",radius:"Yarıçap: {value}",continuousTotal:"Toplam uzunluk: {value}",area:"Alan: {value}",lengthTotal:"Toplam uzunluk: {value}",areaTotal:"Toplam alan: {value}",zoomLayer:"Yakınlaştır: {name}",loadFailed:"Çizim yüklenemedi: {error}",noLayout:"Anlık görüntüde baskı sayfası verisi yok.",loadingChunks:"Geometri yükleniyor… {loaded}/{total}",loadingOsnap:"Nesne yakalama yükleniyor… {loaded}/{total}",buildingOsnap:"Nesne yakalama dizini oluşturuluyor…"},package:{title:"Çizim paketini aç",hint:"Bu sayfanın yanında drawing.acex.json bulunamadı. Yerel bir paket klasörü seçin veya manifesto URL’sini girin.",hintUrlOnly:"Bu sayfanın yanında drawing.acex.json bulunamadı. Paketi açmak için manifesto URL’sini girin.",chooseFolder:"Yerel klasör seç",urlPlaceholder:"https://example.com/drawing.acex.json",openUrl:"URL aç",urlRequired:"Lütfen bir manifesto URL’si girin.",manifestNotFound:"Bu sayfanın yanında drawing.acex.json bulunamadı.",invalidManifest:"Paket manifestosu geçersiz veya desteklenmeyen bir sürüm kullanıyor: {error}",folderMissingManifest:"Seçilen klasör drawing.acex.json içermelidir.",folderUnsupported:"Bu tarayıcı yerel paket klasörü açamıyor. Bunun yerine manifesto URL’si yapıştırın.",loadFailed:"Paket açılamadı: {error}"},access:{title:"Korumalı çizim",passwordPrompt:"Bu dosyayı açmak için parolayı girin.",passwordPlaceholder:"Parola",unlock:"Kilidi aç",passwordRequired:"Lütfen bir parola girin.",wrongPassword:"Parola yanlış. Tekrar deneyin.",expired:"Bu dosyanın süresi doldu ve artık açılamaz.",expiredTitle:"Dosyanın süresi doldu",expiredDetail:"Bu dosyanın süresi {time} tarihinde doldu ve artık açılamaz.",expiresAt:"Son geçerlilik: {time}",badgeExpires:"Son geçerlilik {time}",badgeCountdown:"Kalan süre {time}",tooManyAttempts:"Çok fazla yanlış parola denemesi yapıldı. Tekrar denemek için sayfayı yenileyin."}}},Md={toolbar:{viewerTools:"أدوات العارض",select:"تحديد",pan:"تحريك",zoom:"تكبير/تصغير",zoomExtents:"ملاءمة",zoomSmartExtents:"ذكية",zoomWindow:"نافذة",zoomSaved:"محفوظ",zoomOriginal:"محفوظ",measureDistance:"مسافة",measureContinuous:"مستمر",measureAngle:"زاوية",measureArc:"قوس",measureRadius:"نصف القطر",measureArea:"مساحة",measureCoordinate:"إحداثيات",clearMeasurements:"مسح",measureHide:"إخفاء",measureShow:"إظهار",measureImport:"استيراد",measureExport:"تصدير",measurementPanel:"نتائج",measure:"قياس",annotation:"مراجعة",markupCloud:"سحابة",markupCallout:"تعليق",markupText:"نص",markupRect:"مستطيل",markupCircle:"دائرة",markupArrow:"سهم",markupStamp:"ختم",markupPanel:"نتائج",markupHide:"إخفاء",markupShow:"إظهار",clearMarkups:"مسح",markupImport:"استيراد",markupExport:"تصدير",snap:"التقاط",layers:"طبقات",layout:"صفحة الطباعة",settings:"إعدادات",simulatedMouseOn:"ماوس",simulatedMouseOff:"عدسة",themeLight:"فاتح",themeDark:"داكن",switchBg:"خلفية",language:"اللغة",localeEn:"English",localeJa:"日本語",localeZh:"中文",localeCs:"Čeština",localeTr:"Türkçe",localeAr:"العربية",collapse:"طي شريط الأدوات",expand:"توسيع شريط الأدوات",moreOverflow:"المزيد من الأدوات"},settings:{ortho:"تبديل الوضع المتعامد",polar:"التقاط الزاوية",polarAngles:"زوايا الالتقاط"},drawStyle:{color:"اللون",fontSize:"ارتفاع النص",pickerTitle:"تحديد اللون",close:"إغلاق",ok:"موافق",cancel:"إلغاء",index:"فهرس اللون: ",rgb:"RGB: ",input:"اللون",inputPlaceholder:"1-255 أو #RRGGBB"},textHeight:{title:"ارتفاع النص",close:"إغلاق",ok:"موافق",cancel:"إلغاء",adaptive:"ملاءمة الشاشة",custom:"ارتفاع نص مخصص",customPlaceholder:"ارتفاع العالم",fromScreen:"من حجم الشاشة",fromScreenHint:"أدخل حجم النص المطلوب على الشاشة عند التكبير الحالي. يُحوَّل إلى ارتفاع ثابت في إحداثيات الرسم ويبقى كما هو عند تغيير التكبير لاحقًا.",screenPxPlaceholder:"حجم الخط",screenUnit:"px",convert:"تحويل"},layers:{title:"الطبقات",close:"إغلاق الطبقات",showAll:"إظهار الكل",hideAll:"إخفاء الكل",zoomTo:"تكبير إلى {name}"},review:{title:"مراجعة",close:"إغلاق المراجعة",searchPlaceholder:"البحث في الملاحظات",empty:"لا توجد ملاحظات بعد",type:"النوع",status:"الحالة",author:"المؤلف",summary:"الملخص",details:"التفاصيل",closeDetails:"إغلاق التفاصيل",label:"التسمية",comment:"التعليق",zoomTo:"تكبير إلى",delete:"حذف",clear:"مسح الكل",statusValues:{open:"مفتوح",question:"سؤال",answered:"تمت الإجابة",closed:"مغلق"}},measurePanel:{title:"القياسات",close:"إغلاق القياسات",filterGroup:"التصفية حسب النوع",filterDistance:"مسافة",filterArc:"قوس",filterRadius:"نصف القطر",filterAngle:"زاوية",filterArea:"مساحة",empty:"لا توجد قياسات حتى الآن",type:"النوع",value:"القيمة",delete:"حذف",clear:"مسح الكل"},session:{length:"الطول",angle:"الزاوية",dx:"ΔX",dy:"ΔY",x:"X",y:"Y",confirm:"تأكيد",cancel:"إلغاء",help:"مساعدة",back:"رجوع",collapse:"طي",expand:"توسيع",undo:"تراجع"},touchPointTutorial:{title:"كيف أختار النقاط بدقة؟",description:"اضغط مطولاً على الشاشة لمدة نصف ثانية تقريباً. يظهر صليب فوق إصبعك ويتبعه أثناء الحركة ويلتقط إلى الهندسة لاختيار أدق.",snoozeToday:"لا تذكرني اليوم",hideForever:"لا تذكرني مرة أخرى",ok:"فهمت"},status:{ready:"جاهز",zoomWindowHint:"انقر على ركنين لتحديد نافذة التكبير.",measureDistanceHint:"انقر على نقطتين لقياس المسافة (التقاط الكائنات مفعّل).",measureContinuousHint:"انقر على نقاط متتالية لقياس كل قطعة؛ انقر ✓ للإنهاء. اضغط مطولاً للالتقاط الدقيق.",measureAngleHint:"انقر على رأس الزاوية، ثم نقطة على كل ضلع (التقاط الكائنات مفعّل).",measureArcHint:"انقر على دائرة أو قوس للقياس عليه، أو انقر على نقطة البداية ثم نقطة على القوس ثم نقطة النهاية (التقاط الكائنات مفعّل). استخدم Ctrl (⌘ على Mac) للتبديل بين القوس الأكبر والأصغر.",measureRadiusHint:"انقر على دائرة أو قوس لقياس نصف القطر (التقاط الكائنات مفعّل).",measureAreaHint:"انقر على رؤوس المضلع؛ انقر ✓ للإنهاء بعد ثلاث نقاط على الأقل.",measureCoordinateHint:"انقر على نقطة لقراءة إحداثيات X/Y الخاصة بها (التقاط الكائنات مفعّل).",measureExported:"تم تصدير {count} من القياسات.",measureImported:"تم استيراد {count} من القياسات.",measureImportFailed:"فشل استيراد القياسات: {error}",markupCloudHint:"انقر على ركنين لرسم سحابة مراجعة.",markupCalloutHint:"انقر على طرف خط الإشارة، أو على إطار سحابة/مستطيل/دائرة بدون تعليق توضيحي، ثم موضع النص.",markupTextHint:"انقر على نقطة لوضع النص.",markupRectHint:"انقر على ركنين لرسم مستطيل.",markupCircleHint:"انقر على المركز، ثم على نقطة على المحيط.",markupArrowHint:"انقر على نقطة البداية، ثم على رأس السهم.",markupStampHint:"انقر لوضع ختم (يتنقل بين معتمد / مرفوض / …).",markupArrowEndHint:"انقر على رأس السهم.",markupRectCornerHint:"انقر على الركن المقابل.",markupCloudCornerHint:"انقر على الركن المقابل.",markupCalloutAnchorHint:"انقر على موضع فقاعة النص.",markupCircleRadiusHint:"انقر على نقطة على المحيط.",markupTextPrompt:"أدخل نص الملاحظة",markupTextEditHint:"اكتب النص على مساحة الرسم. اضغط Enter للإنهاء أو Esc للإلغاء.",markupShapeCalloutHint:"انقر لوضع مربع النص (يتصل خط الإشارة بالشكل). اضغط Esc لإلغاء التعليق التوضيحي.",markupDefaultLabel:"ملاحظة",markupStampApproved:"معتمد",markupStampRejected:"مرفوض",markupStampRevised:"معدّل",markupStampForReview:"للمراجعة",markupSelected:"الملاحظة المحددة: {type}",markupSelectedCount:"الملاحظات المحددة: {count}",markupCount:"عدد الملاحظات: {count}",markupExported:"تم تصدير {count} من الملاحظات.",markupImported:"تم استيراد {count} من الملاحظات.",markupImportFailed:"فشل استيراد الملاحظات: {error}",distance:"المسافة: {value}",coordinates:"X: {x} | Y: {y}",angle:"الزاوية: {value}",arcLength:"طول القوس: {length} | نصف القطر: {radius} | الزاوية: {angle} | الوتر: {chord}",radius:"نصف القطر: {value}",continuousTotal:"إجمالي الطول: {value}",area:"المساحة: {value}",lengthTotal:"إجمالي الطول: {value}",areaTotal:"إجمالي المساحة: {value}",zoomLayer:"تكبير: {name}",loadFailed:"فشل تحميل الرسم: {error}",noLayout:"لا توجد بيانات صفحات الطباعة في اللقطة.",loadingChunks:"جاري تحميل الهندسة… {loaded}/{total}",loadingOsnap:"جاري تحميل الالتقاط… {loaded}/{total}",buildingOsnap:"جاري بناء فهرس الالتقاط…"},package:{title:"فتح حزمة الرسم",hint:"لم يتم العثور على drawing.acex.json بجانب هذه الصفحة. اختر مجلد الحزمة المحلي أو أدخل عنوان URL للقائمة.",hintUrlOnly:"لم يتم العثور على drawing.acex.json بجانب هذه الصفحة. أدخل عنوان URL للقائمة لفتح الحزمة.",chooseFolder:"اختيار مجلد محلي",urlPlaceholder:"https://example.com/drawing.acex.json",openUrl:"فتح الرابط",urlRequired:"يرجى إدخال عنوان URL للقائمة.",manifestNotFound:"لم يتم العثور على drawing.acex.json بجانب هذه الصفحة.",invalidManifest:"قائمة الحزمة غير صالحة أو تستخدم إصداراً غير مدعوم: {error}",folderMissingManifest:"يجب أن يحتوي المجلد المحدد على drawing.acex.json.",folderUnsupported:"لا يمكن لهذا المتصفح فتح مجلد حزمة محلي. الصق عنوان URL للقائمة بدلاً من ذلك.",loadFailed:"تعذر فتح الحزمة: {error}"},access:{title:"رسم محمي",passwordPrompt:"أدخل كلمة المرور لفتح هذا الملف.",passwordPlaceholder:"كلمة المرور",unlock:"فتح",passwordRequired:"يرجى إدخال كلمة المرور.",wrongPassword:"كلمة المرور غير صحيحة. حاول مرة أخرى.",expired:"انتهت صلاحية هذا الملف ولا يمكن فتحه.",expiredTitle:"انتهت صلاحية الملف",expiredDetail:"انتهت صلاحية هذا الملف في {time} ولا يمكن فتحه.",expiresAt:"ينتهي في: {time}",badgeExpires:"ينتهي في {time}",badgeCountdown:"متبقي {time}",tooManyAttempts:"عدد محاولات إدخال كلمة المرور كبير جدًا. قم بتحديث الصفحة للمحاولة مرة أخرى."}},Ed={toolbar:{viewerTools:"ビューアツール",select:"選択",pan:"画面移動",zoom:"ズーム",zoomExtents:"範囲",zoomSmartExtents:"スマート",zoomWindow:"窓",zoomSaved:"保存ビュー",zoomOriginal:"保存ビュー",measureDistance:"距離",measureContinuous:"連続",measureAngle:"角度",measureArc:"円弧",measureRadius:"半径",measureArea:"面積",measureCoordinate:"XY",clearMeasurements:"クリア",measureHide:"非表示",measureShow:"表示",measureImport:"読み込み",measureExport:"書き出し",measurementPanel:"結果",measure:"計測",annotation:"コメント",markupCloud:"雲マーク",markupCallout:"吹き出し",markupText:"文字",markupRect:"長方形",markupCircle:"円",markupArrow:"矢印",markupStamp:"スタンプ",markupPanel:"結果",markupHide:"非表示",markupShow:"表示",clearMarkups:"クリア",markupImport:"読み込み",markupExport:"書き出し",snap:"スナップ",layers:"レイヤー",layout:"印刷ページ",settings:"設定",simulatedMouseOn:"マウス",simulatedMouseOff:"ルーペ",themeLight:"ライト",themeDark:"ダーク",switchBg:"背景",language:"言語",localeEn:"English",localeJa:"日本語",localeZh:"中文",localeCs:"Čeština",localeTr:"Türkçe",localeAr:"العربية",collapse:"ツールバーを折りたたむ",expand:"ツールバーを展開",moreOverflow:"その他のツール"},settings:{ortho:"直交モードの切り替え",polar:"角度スナップ",polarAngles:"スナップする角度"},drawStyle:{color:"色",fontSize:"文字の高さ",pickerTitle:"色を選択",close:"閉じる",ok:"OK",cancel:"キャンセル",index:"インデックスカラー: ",rgb:"RGB: ",input:"色",inputPlaceholder:"1～255 または #RRGGBB"},shortCutToolbar:{more:"その他",undo:"元に戻す",redo:"やり直し",erase:"削除",collapse:"ツールバーを折りたたむ",expand:"ツールバーを展開"},textHeight:{title:"文字の高さ",close:"閉じる",ok:"OK",cancel:"キャンセル",adaptive:"画面に合わせる",custom:"文字の高さを指定",customPlaceholder:"図面上の高さ",fromScreen:"画面上のサイズから",fromScreenHint:"現在のズームで画面上に表示したい文字の大きさを入力します。図面上の固定の高さに変換されるため、後でズームしても変わりません。",screenPxPlaceholder:"フォントサイズ",screenUnit:"px",convert:"変換"},entityPick:{cancel:"選択をキャンセル"},layers:{title:"レイヤー",close:"レイヤーを閉じる",showAll:"すべて表示",hideAll:"すべて非表示",zoomTo:"{name} にズーム"},review:{title:"コメント",close:"コメントを閉じる",searchPlaceholder:"マークアップを検索",empty:"マークアップはまだありません",type:"種類",status:"ステータス",author:"作成者",summary:"概要",details:"詳細",closeDetails:"詳細を閉じる",label:"ラベル",comment:"コメント",zoomTo:"ズーム",delete:"削除",clear:"すべてクリア",statusValues:{open:"未対応",question:"質問",answered:"回答済み",closed:"完了"}},measurePanel:{title:"計測",close:"計測を閉じる",filterGroup:"種類で絞り込み",filterDistance:"距離",filterArc:"円弧",filterRadius:"半径",filterAngle:"角度",filterArea:"面積",empty:"計測はまだありません",type:"種類",value:"値",delete:"削除",clear:"すべてクリア"},session:{length:"長さ",angle:"角度",dx:"ΔX",dy:"ΔY",x:"X",y:"Y",confirm:"確定",cancel:"キャンセル",help:"ヘルプ",back:"戻る",collapse:"折りたたむ",expand:"展開",undo:"元に戻す"},touchPointTutorial:{title:"点を正確に指定するには",description:"画面を約 0.5 秒長押しします。指の上に十字カーソルが表示されて指の動きに追従し、図形にスナップするので、より正確に指定できます。",snoozeToday:"今日は表示しない",hideForever:"今後表示しない",ok:"わかりました"},status:{ready:"準備完了",zoomWindowHint:"2 つのコーナーをクリックすると、その窓にズームします。",measureDistanceHint:"2 点をクリックして距離を計測します (オブジェクトスナップ有効)。",measureContinuousHint:"点を順にタップして各区間を計測し、✓ で終了します。長押しで正確にスナップします。",measureAreaHint:"多角形の頂点をタップし、3 点以上指定したら ✓ で終了します。長押しで正確にスナップします。",measureAngleHint:"頂点をクリックし、続けて各辺上の点をクリックします (オブジェクトスナップ有効)。",measureArcHint:"円または円弧をクリックしてその長さを計測するか、始点、円弧上の点、終点の順にクリックします (オブジェクトスナップ有効)。Ctrl (Mac は ⌘) で優弧/劣弧を切り替えます。",measureRadiusHint:"円または円弧をクリックして半径を計測します (オブジェクトスナップ有効)。",measureCoordinateHint:"点をクリックして X/Y 座標を読み取ります (オブジェクトスナップ有効)。",measureExported:"{count} 件の計測を書き出しました。",measureImported:"{count} 件の計測を読み込みました。",measureImportFailed:"計測を読み込めませんでした: {error}",markupCloudHint:"2 つのコーナーをクリックして雲マークを作成します。",markupCalloutHint:"引出線の先端、または吹き出しのない雲マーク/長方形/円の輪郭をクリックし、次に文字の位置をクリックします。",markupTextHint:"点をクリックして文字を配置します。",markupRectHint:"2 つのコーナーをクリックして長方形を作成します。",markupCircleHint:"中心をクリックし、次に円周上の点をクリックします。",markupArrowHint:"始点をクリックし、次に矢印の先端をクリックします。",markupStampHint:"クリックしてスタンプを配置します (承認 / 却下 / … を順に切り替え)。",markupArrowEndHint:"矢印の先端をクリックします。",markupRectCornerHint:"もう一方のコーナーをクリックします。",markupCloudCornerHint:"もう一方のコーナーをクリックします。",markupCalloutAnchorHint:"吹き出しの位置をクリックします。",markupCircleRadiusHint:"円周上の点をクリックします。",markupTextPrompt:"マークアップの文字を入力",markupTextEditHint:"キャンバス上で文字を入力します。Enter で確定、Esc でキャンセルします。",markupShapeCalloutHint:"クリックしてテキストボックスを配置します (引出線は図形に接続されます)。Esc で吹き出しをキャンセルします。",markupDefaultLabel:"メモ",markupStampApproved:"承認",markupStampRejected:"却下",markupStampRevised:"修正済",markupStampForReview:"要確認",markupSelected:"選択中のマークアップ: {type}",markupSelectedCount:"選択中のマークアップ: {count} 件",markupCount:"マークアップ: {count} 件",markupExported:"{count} 件のマークアップを書き出しました。",markupImported:"{count} 件のマークアップを読み込みました。",markupImportFailed:"マークアップを読み込めませんでした: {error}",distance:"距離: {value}",coordinates:"X: {x} | Y: {y}",angle:"角度: {value}",arcLength:"円弧の長さ: {length} | 半径: {radius} | 角度: {angle} | 弦: {chord}",radius:"半径: {value}",continuousTotal:"合計の長さ: {value}",area:"面積: {value}",lengthTotal:"長さの合計: {value}",areaTotal:"面積の合計: {value}",zoomLayer:"ズーム: {name}",loadFailed:"図面を読み込めませんでした: {error}",noLayout:"スナップショットに印刷ページのデータがありません。",loadingChunks:"図形を読み込んでいます… {loaded}/{total}",loadingOsnap:"オブジェクトスナップを読み込んでいます… {loaded}/{total}",buildingOsnap:"オブジェクトスナップのインデックスを作成しています…"},package:{title:"図面パッケージを開く",hint:"このページの隣に drawing.acex.json が見つかりませんでした。ローカルのパッケージフォルダを選択するか、マニフェストの URL を入力してください。",hintUrlOnly:"このページの隣に drawing.acex.json が見つかりませんでした。パッケージを開くにはマニフェストの URL を入力してください。",chooseFolder:"ローカルフォルダを選択",urlPlaceholder:"https://example.com/drawing.acex.json",openUrl:"URL を開く",urlRequired:"マニフェストの URL を入力してください。",manifestNotFound:"このページの隣に drawing.acex.json が見つかりませんでした。",invalidManifest:"パッケージのマニフェストが無効か、サポートされていないバージョンです: {error}",folderMissingManifest:"選択したフォルダには drawing.acex.json が含まれている必要があります。",folderUnsupported:"このブラウザではローカルのパッケージフォルダを開けません。代わりにマニフェストの URL を貼り付けてください。",loadFailed:"パッケージを開けませんでした: {error}"},access:{title:"保護された図面",passwordPrompt:"このファイルを開くにはパスワードを入力してください。",passwordPlaceholder:"パスワード",unlock:"ロック解除",passwordRequired:"パスワードを入力してください。",wrongPassword:"パスワードが正しくありません。もう一度入力してください。",expired:"このファイルは有効期限が切れているため開けません。",expiredTitle:"有効期限切れ",expiredDetail:"このファイルは {time} に有効期限が切れたため開けません。",expiresAt:"有効期限: {time}",badgeExpires:"{time} まで有効",badgeCountdown:"残り {time}",tooManyAttempts:"パスワードの入力に何度も失敗しました。ページを再読み込みしてもう一度お試しください。"}},ln={...Cd,ja:Ed,ar:Md};function Sd(e){return ge.includes(e)}function He(e){if(e==null||e==="")return null;const t=e.toLowerCase().replace("_","-");for(const r of ge)if(t===r||t.startsWith(`${r}-`))return r;return null}function No(){if(typeof navigator>"u")return"en";const e=[...navigator.languages??[],navigator.language].filter(Boolean);for(const t of e){const r=He(t);if(r)return r}return"en"}function _o(){if(typeof localStorage<"u")try{const e=localStorage.getItem(ha),t=He(e);if(t)return t}catch{}return No()}function cn(e,t){const r=t.split(".");let a=e;for(const n of r){if(a==null||typeof a=="string")return;a=a[n]}return typeof a=="string"?a:void 0}function $o(e,t){return t?e.replace(/\{(\w+)\}/g,(r,a)=>{const n=t[a];return n!=null?String(n):`{${a}}`}):e}class zd{constructor(t){this._onChange=null,this._locale=t??_o()}get locale(){return this._locale}get localeBadge(){return pa[this._locale]}setOnChange(t){this._onChange=t}t(t,r){const a=cn(ln[this._locale],t)??cn(ln.en,t)??t;return $o(a,r)}toggleLocale(){const t=ge.indexOf(this._locale),r=ge[(t+1)%ge.length];return this.setLocale(r),r}setLocale(t){var r;if(this._locale!==t){this._locale=t,typeof document<"u"&&(document.documentElement.lang=t);try{typeof localStorage<"u"&&localStorage.setItem(ha,t)}catch{}this.applyToDocument(),(r=this._onChange)==null||r.call(this)}}applyToDocument(t){if(typeof document>"u")return;const r=t??document;document.documentElement.lang=this._locale,r.querySelectorAll("[data-i18n-text]").forEach(n=>{const o=n.dataset.i18nKey;o&&(n.textContent=this.t(o))}),r.querySelectorAll("[data-i18n-attr]").forEach(n=>{var o;const i=n.dataset.i18nKey,s=((o=n.dataset.i18nAttr)==null?void 0:o.split(/\s+/))??[];if(!i||s.length===0)return;const l=this.t(i);for(const c of s)n.setAttribute(c,l)});const a=document.getElementById("mlcad-lang-badge");a&&(a.textContent=this.localeBadge)}}const fa=1128612673,dn=1e5;function st(e){if(e.version!==D)throw new Error(`Unsupported chunk version: ${e.version}`);const t=new Nt;t.writeU32(fa),t.writeU8(D),t.writeU8(0),t.writeU8(0),t.writeU8(0),t.writeString(e.layoutBtrId),t.writeU32(e.lineBatches.length);for(const r of e.lineBatches)Qr(t,r);t.writeU32(e.meshBatches.length);for(const r of e.meshBatches)ta(t,r);return t.toUint8Array()}function ga(e){const t=new _t(e);if(t.readU32()!==fa)throw new Error("Invalid chunk magic");const r=t.readU8();if(t.readU8(),t.readU8(),t.readU8(),r!==D)throw new Error(`Unsupported chunk version: ${r}`);const a=t.readString(),n=t.readU32();if(n>dn)throw new Error("Chunk line batch count exceeds limit");const o=[];for(let l=0;l<n;l++)o.push(ea(t));const i=t.readU32();if(i>dn)throw new Error("Chunk mesh batch count exceeds limit");const s=[];for(let l=0;l<i;l++)s.push(ra(t));return{version:D,layoutBtrId:a,lineBatches:o,meshBatches:s}}function Vo(e){const t=st(e),r=Ee(t).bytes;return{uncompressed:t,compressed:r}}async function Pd(e){const t=st(e),r=(await Gr(t)).bytes;return{uncompressed:t,compressed:r}}function Xo(e){return ga($t(e))}function wa(e){return Kr(e)?Xo(e):ga(e)}const ba=1,ya=2*1024*1024,lt=2*1024*1024,Fd=512*1024,Yo=8*1024*1024,Dr=12*1024*1024,Zo=2*1024*1024,qt=6;function Qt(e,t,r){const a=e.length,n=a>0?Math.max(1,Math.min(Number.isFinite(t)?Math.floor(t):1,a)):0,o=new Array(a);let i=0,s=0;const l=c=>{const d=Promise.resolve().then(()=>r(e[c],c));d.catch(()=>{}),o[c]=d,i+=1};for(;i<n;)l(i);return{async next(){if(s>=a)return null;const c=s;s+=1;const d=await o[c];return i<a&&l(i),{item:e[c],index:c,bytes:d}}}}const Bd=/^(?:\.[/\\])?[A-Za-z0-9._-]+(?:[/\\][A-Za-z0-9._-]+)*$/;function Go(e){const t=e.trim();return!t||t!==e||t.startsWith("/")||t.startsWith("\\")||t.startsWith("//")||/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(t)||t.includes("..")||t.includes("\\")?!1:Bd.test(t)}function Dt(e,t){if(!Go(e))throw new Error(`Invalid ${t}: must be a relative package path`)}function ct(e){if(!e||typeof e!="object")throw new Error("Invalid package manifest");const t=e;if(t.format!=="acex-package")throw new Error("Unsupported package format");if(t.packageVersion!==ba)throw new Error(`Unsupported package version: ${String(t.packageVersion)}`);if(t.snapshotVersion!==D)throw new Error(`Unsupported snapshot version: ${String(t.snapshotVersion)}`);if(!Array.isArray(t.layouts)||!Array.isArray(t.chunks))throw new Error("Invalid package manifest structure");for(const r of t.chunks){if(!r||typeof r!="object")throw new Error("Invalid package chunk entry");Dt(r.href,"chunk href")}for(const r of t.osnapChunks??[]){if(!r||typeof r!="object")throw new Error("Invalid package osnap chunk entry");Dt(r.href,"osnap chunk href")}return t}function Ko(e){return{version:D,meta:e.meta,layers:e.layers,activeLayoutBtrId:e.activeLayoutBtrId,layouts:e.layouts.map(t=>({btrId:t.btrId,name:t.name,isModelSpace:t.isModelSpace,lineBatches:[],meshBatches:[],viewports:t.viewports,...t.savedView?{savedView:t.savedView}:{}}))}}function er(e,t){Dt(t,"chunk href");let r,a;try{r=new URL(t,e),a=new URL(e)}catch{throw new Error("Invalid chunk or manifest URL")}if(r.protocol!==a.protocol||r.host!==a.host)throw new Error("Chunk URL must share the manifest origin");const n=a.pathname.replace(/[^/]*$/,""),o=r.pathname;if(!o.startsWith(n))throw new Error("Chunk URL escapes package directory");if(o.split("/").includes(".."))throw new Error("Chunk URL escapes package directory");return r.toString()}function Wo(e,t){Dt(e,"manifestUrl");let r,a;try{r=new URL(e,t),a=new URL(t)}catch{throw new Error("Invalid manifestUrl")}if(r.protocol!==a.protocol||r.host!==a.host)throw new Error("manifestUrl must be same-origin");return r.toString()}async function va(e,t,r){const a=await e(t);if(!a.ok)throw new Error(`Failed to load ${r} (${a.status})`);const n=a.headers.get("content-length");if(n!=null){const i=Number(n);if(Number.isFinite(i)&&i>xt)throw new Error(`${r} exceeds size limit`)}const o=await a.arrayBuffer();if(o.byteLength>xt)throw new Error(`${r} exceeds size limit`);return new Uint8Array(o)}async function Id(e){var t;const r=e.fetchImpl??dt,a=e.loadOsnap!==!1,n=e.fetchConcurrency??qt,o=await r(e.manifestUrl);if(!o.ok)throw new Error(`Failed to load package manifest (${o.status})`);const i=ct(await o.json()),s=Ko(i),l=new Map(s.layouts.map(m=>[m.btrId,m])),c=e.layoutFilter==null?null:e.layoutFilter instanceof Set?e.layoutFilter:new Set(e.layoutFilter),d=i.chunks.filter(m=>c==null||c.has(m.layoutBtrId)),u=Qt(d,n,m=>va(r,er(e.manifestUrl,m.href),"geometry chunk"));let p=0;for(;;){const m=await u.next();if(!m)break;const h=m.item,f=l.get(h.layoutBtrId);if(!f)throw new Error("Unknown layout for package chunk");const w=wa(m.bytes);if(w.layoutBtrId!==h.layoutBtrId)throw new Error("Chunk layout mismatch");qo(f,w.lineBatches,w.meshBatches),p+=1,await((t=e.onChunk)==null?void 0:t.call(e,f,h,{loadedChunks:p,totalChunks:d.length,layoutBtrId:h.layoutBtrId,chunkId:h.id}))}if(a)for(const m of i.layouts){if(c!=null&&!c.has(m.btrId))continue;const h=l.get(m.btrId);h&&await Jo(i,e.manifestUrl,m.btrId,h,{fetchImpl:r})}return s}async function Hd(e,t,r,a,n={}){var o;const i=n.fetchImpl??dt,s=n.fetchConcurrency??qt,l=e.layouts.find(m=>m.btrId===r);if(!l)throw new Error(`Layout not found: ${r}`);const c=new Map(e.chunks.map(m=>[m.id,m])),d=l.chunkIds.map(m=>c.get(m)).filter(m=>m!=null),u=Qt(d,s,m=>va(i,er(t,m.href),"geometry chunk"));let p=0;for(;;){const m=await u.next();if(!m)break;const h=m.item,f=wa(m.bytes);qo(a,f.lineBatches,f.meshBatches),p+=1,await((o=n.onChunk)==null?void 0:o.call(n,a,h,{loadedChunks:p,totalChunks:d.length,layoutBtrId:r,chunkId:h.id}))}}async function Jo(e,t,r,a,n={}){var o;if(a.osnap)return;const i=e.layouts.find(g=>g.btrId===r);if(!i)return;const s=i.osnapChunkIds;if(!s||s.length===0)return;const l=new Map((e.osnapChunks??[]).map(g=>[g.id,g])),c=s.map(g=>l.get(g)).filter(g=>g!=null);if(c.length===0)return;const d=n.fetchImpl??dt,u=n.fetchConcurrency??qt,p=n.yieldFn??(()=>new Promise(g=>{setTimeout(g,0)})),m=c.reduce((g,k)=>g+k.primitiveCount,0),h=m>0?new Array(m):[];let f=0;const w=Qt(c,u,g=>va(d,er(t,g.href),"osnap chunk"));let b=0;for(;;){const g=await w.next();if(!g)break;const k=g.item,v=to(g.bytes).primitives;if(m>0)for(let A=0;A<v.length;A++)h[f++]=v[A];else for(const A of v)h.push(A);b+=1,await((o=n.onChunk)==null?void 0:o.call(n,{loadedChunks:b,totalChunks:c.length,layoutBtrId:r,chunkId:k.id})),await p()}m>0&&f!==m&&(h.length=f),a.osnap={primitives:h}}function qo(e,t,r){e.lineBatches.push(...t),e.meshBatches.push(...r)}const ae="drawing.acex.json",xa=`./${ae}`,Qo=["manifest","acex"],qe="https://acex-package.invalid/",dt=(e,t)=>globalThis.fetch(e,t);function Ud(e){return e.directoryPicker||e.webkitDirectory}function Td(e){const t=(e==null?void 0:e.hasDirectoryPicker)??typeof globalThis.showDirectoryPicker=="function",r=(e==null?void 0:e.isSecureContext)??(typeof globalThis.isSecureContext=="boolean"?globalThis.isSecureContext:!0);let a=e==null?void 0:e.supportsWebkitDirectoryAttribute;if(a==null&&(a=!1,typeof document<"u")){const n=document.createElement("input");n.type="file",a="webkitdirectory"in n||"directory"in n}return{directoryPicker:t&&r,webkitDirectory:a}}function ei(e){var t;const r=e.startsWith("?")?e.slice(1):e;if(!r)return null;let a;try{a=new URLSearchParams(r)}catch{return null}for(const n of Qo){const o=(t=a.get(n))==null?void 0:t.trim();if(o)return o}return null}function Rd(e){var t;const r=ei(e.search??"");if(r)return{href:r,fromQuery:!0};const a=(t=e.configManifestUrl)==null?void 0:t.trim();return a?{href:a,fromQuery:!1}:{href:xa,fromQuery:!1}}function ti(e){return/^https?:\/\//i.test(e.trim())}function Dd(e,t){const r=e.trim();if(!r)throw new Error("Missing manifest URL");if(ti(r))try{return new URL(r).toString()}catch{throw new Error("Invalid manifest URL")}return Wo(r,t)}async function Od(e,t=dt){let r;try{r=await t(e)}catch(n){return{ok:!1,reason:"network",error:n instanceof Error?n:new Error(String(n))}}if(r.status===404||r.status===410)return{ok:!1,reason:"not-found",error:new Error(`Failed to load package manifest (${r.status})`)};if(!r.ok)return{ok:!1,reason:"network",error:new Error(`Failed to load package manifest (${r.status})`)};let a;try{a=await r.json()}catch(n){return{ok:!1,reason:"invalid",error:n instanceof Error?n:new Error("Invalid package manifest JSON")}}try{return{ok:!0,manifest:ct(a)}}catch(n){return{ok:!1,reason:"invalid",error:n instanceof Error?n:new Error(String(n))}}}function ri(e,t){let r=e.replace(/\\/g,"/").replace(/^\/+/,"");if(t){const a=t.replace(/\\/g,"/").replace(/\/+$/,"");r===a?r="":r.startsWith(`${a}/`)&&(r=r.slice(a.length+1))}return r.replace(/^\.\//,"")}function ai(e){const t=[...e].map(a=>a.replace(/\\/g,"/").replace(/^\/+/,"")).filter(Boolean);if(t.length===0)return null;const r=t[0].split("/")[0];return!r||r===ae||!t.every(a=>a.split("/")[0]===r)?null:t.some(a=>a.includes("/"))?r:null}function jd(e){const t=[...e],r=ai(t.map(n=>n.relativePath)),a=new Map;for(const n of t){const o=ri(n.relativePath,r);!o||o.endsWith("/")||a.set(o,n.bytes)}return a}function Nd(e,t){const r=(t==null?void 0:t.manifestFileName)??ae;if(!e.has(r))throw new Error(`Missing ${r} in selected folder`);const a=new URL(r,qe).toString(),n=new URL(qe).origin;return{manifestUrl:a,fetchImpl:async o=>{const i=new URL(String(o));if(i.origin!==n)return new Response(null,{status:404});const s=decodeURIComponent(i.pathname.replace(/^\/+/,"")),l=e.get(s);if(!l)return new Response(null,{status:404});if(s.endsWith(".json")){const d=new TextDecoder().decode(l);return new Response(d,{status:200,headers:{"Content-Type":"application/json"}})}const c=new Uint8Array(l.byteLength);return c.set(l),new Response(c,{status:200})}}}function _d(e){return e.has(ae)?ae:null}function ka(...e){return`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024">${e.map(t=>`<path fill="currentColor" d="${t}"/>`).join("")}</svg>`}const $d='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" d="M10.4379 15.2979h.002l4.86-4.86-9.722-4.86 4.86 9.72Zm7.562-5.298-3.434 3.434 3.2 3.2-1.132 1.132-3.2-3.2-3.434 3.434-7.6-15.6 15.6 7.6Z"/></svg>',Vd='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" d="M15.08 12.8537l.002-.002V5.5897c0-.422-.652-.414-.652 0v3.466c0 .938-1.482.95-1.482 0v-4.83c0-.414-.6381-.414-.6381 0h-.014v4.83c.014.95-1.482.95-1.482 0V3.4437c0-.42-.638-.414-.638 0v5.612c0 .95-1.494.95-1.494 0V4.2317c0-.408-.64-.42-.64 0v6.756c0 .802-1.094 1.088-1.494.388-.26-.446-.518-.892-.776-1.338-.338-.482-1.1-.15-.794.38.326.566.652 1.132.978 1.698.006.012.014.026.02.04.552.946 1.106 1.89 1.658 2.834.19.3.422.578.666.802h-.006c.672.61 1.528.964 2.418 1.052.888.06 1.7921-.124 2.5601-.612.3-.19.572-.416.816-.68.326-.368.57-.776.734-1.204.176-.482.258-.97.258-1.494Zm-.91-8.608-.004-.002c.958-.38 2.058.244 2.058 1.346v7.266c0 .652-.108 1.29-.332 1.894-.216.564-.53 1.114-.964 1.576-.318.34-.666.632-1.046.884-.978.612-2.1461.862-3.2601.774-1.128-.102-2.228-.564-3.098-1.352-.326-.292-.612-.646-.87-1.034-.558-.96-1.114-1.92-1.672-2.88l-.012-.028c-.326-.568-.652-1.138-.978-1.706-.59-1.018.068-2.186 1.156-2.336.536-.074 1.126.116 1.562.72.026.028.04.062.054.096.04.074.082.146.122.218V4.2337c0-1.176 1.244-1.788 2.202-1.278.42-1.278 2.378-1.264 2.792-.014.9721-.51 2.2221.102 2.2221 1.284v.06c.022-.014.046-.026.068-.04Z"/></svg>',ni='<path fill="currentColor" d="M9.3333 14.125 5.875 10.6667V14.125H9.3333Zm4.7917-3.4583-3.4583 3.4583H14.125V10.6667ZM10.6667 5.875 14.125 9.3333V5.875H10.6667ZM5.875 9.3333 9.3333 5.875H5.875V9.3333Zm9.2083 5.475c1.2333-1.3 1.9083-3.0333 1.9083-4.825-.0083-3.325-2.35-6.1833-5.6083-6.8417C8.125 2.4833 4.85 4.2 3.55 7.2583c-1.3 3.0583-.275 6.6083 2.4583 8.5 2.725 1.8917 6.4167 1.6 8.8167-.6917.0917-.0833.175-.175.2583-.2583Zm1.2583.5917 2.575 2.575c-.3167.3167-.625.625-.9417.9417-.8583-.8583-1.7167-1.7167-2.575-2.575-3.4083 2.9-8.4917 2.5917-11.525-.6917S.9417 7.275 4.1083 4.1083C7.2667.9417 12.3667.8417 15.65 3.875s3.5917 8.1167.6917 11.525Z"/>',Xd=`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">${ni}</svg>`,oi='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" d="M15.0833 14.8083c1.2333-1.3 1.9083-3.0333 1.9083-4.825-.0083-3.325-2.35-6.1833-5.6083-6.8417C8.125 2.4833 4.85 4.2 3.55 7.2583c-1.3 3.0583-.275 6.6083 2.4583 8.5 2.725 1.8917 6.4167 1.6 8.8167-.6917.0917-.0833.175-.175.2583-.2583Zm1.2583.5917 2.575 2.575c-.3167.3167-.625.625-.9417.9417-.8583-.8583-1.7167-1.7167-2.575-2.575-3.4083 2.9-8.4917 2.5917-11.525-.6917C.8417 12.3667.9417 7.275 4.1083 4.1083 7.2667.9417 12.3667.8417 15.65 3.875s3.5917 8.1167.6917 11.525Zm-3.55-2.6083V7.2083H7.2083v5.5833h5.5833ZM5.875 5.875h8.25v8.25H5.875V5.875Z"/></svg>',Yd='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="m434.8 137.65l-149.36-68.1c-16.19-7.4-42.69-7.4-58.88 0L77.3 137.65c-17.6 8-17.6 21.09 0 29.09l148 67.5c16.89 7.7 44.69 7.7 61.58 0l148-67.5c17.52-8 17.52-21.1-.08-29.09M160 308.52l-82.7 37.11c-17.6 8-17.6 21.1 0 29.1l148 67.5c16.89 7.69 44.69 7.69 61.58 0l148-67.5c17.6-8 17.6-21.1 0-29.1l-79.94-38.47"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="m160 204.48l-82.8 37.16c-17.6 8-17.6 21.1 0 29.1l148 67.49c16.89 7.7 44.69 7.7 61.58 0l148-67.49c17.7-8 17.7-21.1.1-29.1L352 204.48"/></svg>',Zd='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><rect x="2" y="2" width="8.2" height="5" rx="1.2" fill="currentColor"/><rect x="2" y="8.5" width="8.2" height="9.5" rx="1.2" fill="currentColor"/><rect x="11.7" y="2" width="6.3" height="10" rx="1.2" fill="currentColor"/><rect x="11.7" y="13.5" width="6.3" height="4.5" rx="1.2" fill="currentColor"/></svg>',Gd='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" fill-rule="evenodd" d="M1.5 7h17v6h-17ZM4.25 7h1v2.5h-1ZM7.5 7h.75v1.5H7.5ZM10.25 7h1v2.5h-1ZM13.5 7h.75v1.5H13.5ZM16.25 7h1v2.5h-1Z"/></svg>',Kd='<path fill="currentColor" fill-rule="evenodd" d="M2.25 15h15.5v3.4H2.25Zm1.5 0h.7v1.45h-.7Zm2.95 0h.7v1.45h-.7Zm2.95 0h.7v1.45h-.7Zm2.95 0h.7v1.45h-.7Zm2.95 0h.7v1.45h-.7Z"/>',L="var(--el-color-primary, var(--ml-ui-accent, #af61da))";function ve(e){return`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">${e}${Kd}</svg>`}const Wd=ve(`<rect fill="${L}" x="2.9" y="2.5" width="1.25" height="8.8" rx=".2"/><rect fill="${L}" x="15.85" y="2.5" width="1.25" height="8.8" rx=".2"/><path fill="${L}" d="M4.4 6.9 7.2 5.05v3.7Z"/><path fill="${L}" d="M15.6 6.9 12.8 5.05v3.7Z"/><rect fill="${L}" x="6.7" y="6.25" width="6.6" height="1.3"/>`),Jd=ve(`<rect fill="${L}" x="2.9" y="2.5" width="1.25" height="8.8" rx=".2"/><rect fill="${L}" x="15.85" y="2.5" width="1.25" height="8.8" rx=".2"/><path fill="${L}" d="M4.4 6.9 7.2 5.05v3.7Z"/><path fill="${L}" d="M15.6 6.9 12.8 5.05v3.7Z"/><rect fill="${L}" x="6.7" y="6.25" width="6.6" height="1.3"/><circle fill="currentColor" cx="10" cy="3.45" r="2.2"/><text x="10" y="4.42" text-anchor="middle" font-size="3.15" font-weight="700" font-family="Arial,Helvetica,sans-serif" fill="${L}">n</text>`),qd=ve(`<g fill="none" stroke="${L}" stroke-linejoin="miter"><path stroke-width="1.55" stroke-linecap="butt" d="M16.9 12.25H4.9L11.6 3.03"/><path stroke-width="1.7" stroke-linecap="butt" d="M11.05 12.25A6.15 6.15 0 0 0 8.51 7.27"/></g><path fill="${L}" d="M11.05 12.25 9.85 10.55h2.4Z"/><path fill="${L}" d="M8.51 7.27 10.46 7.39 9.23 9.09Z"/>`),Qd=ve(`<path fill="${L}" d="M5 12V4.2A7.8 7.8 0 0 1 12.8 12Z"/>`),eu=ve(`<g fill="none" stroke-linejoin="miter"><path stroke="currentColor" stroke-width="1.5" stroke-linecap="butt" d="M4.9 11.6A8.3 8.3 0 0 1 13.2 3.3"/><path stroke="currentColor" stroke-width="1.35" stroke-linecap="square" d="M10.4 11.6H13.2V8.8"/><path stroke="currentColor" stroke-width="1.35" stroke-linecap="butt" d="M13.2 11.6v1.7"/><rect stroke="${L}" stroke-width="1.15" x="3.65" y="10.35" width="2.5" height="2.5"/><rect stroke="${L}" stroke-width="1.15" x="11.95" y="2.05" width="2.5" height="2.5"/></g>`),tu=ve(`<circle fill="none" stroke="${L}" stroke-width="1.4" cx="9.1" cy="7.3" r="4.7"/><circle fill="${L}" cx="9.1" cy="7.3" r="1.05"/><path fill="none" stroke="${L}" stroke-width="1.35" stroke-linecap="round" d="M9.1 7.3 13.35 3.7"/><path fill="${L}" d="M13.35 3.7 11.15 4.2 12.55 5.7Z"/>`),ru=ve(`<g fill="none" stroke="${L}" stroke-linecap="round" stroke-linejoin="round"><path stroke-width="1.4" d="M4 4.8v7.4h7.6"/><path stroke-width="1.2" stroke-dasharray="1.7 1.2" d="M4 6.9h7M11 12.2V6.9"/></g><path fill="${L}" d="M4 2.5 2.45 4.8h3.1ZM13.8 12.2 11.5 10.7v3Z"/><circle fill="${L}" cx="11" cy="6.9" r="1.3"/>`),ii='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true"><path d="M 459.5 0 L 475.5 0 L 476.5 1 L 479.5 1 L 485.5 3 Q 487.8 6.2 492.5 7 L 501 14.5 L 505 19.5 L 511 32.5 Q 510.2 35.8 512 36.5 L 512 52.5 L 511 53.5 L 511 56.5 L 509 62.5 L 506 68.5 L 493 89.5 L 483 108.5 L 478 115.5 L 472 127.5 L 467 134.5 L 457 153.5 L 452 160.5 L 442 179.5 L 437 186.5 L 431 198.5 L 440 213.5 L 440 215.5 L 443 220.5 L 447 232.5 L 448 240.5 L 449 241.5 L 449 245.5 L 450 246.5 L 450 254.5 L 451 255.5 L 451 274.5 L 450 275.5 L 450 283.5 L 449 284.5 L 449 289.5 L 448 290.5 L 448 294.5 L 447 295.5 L 446 302.5 L 442 314.5 L 438 322.5 L 438 324.5 L 428 345.5 L 428 347.5 L 425 352.5 L 422 361.5 L 418 368.5 L 418 370.5 L 415 375.5 L 412 384.5 L 408 391.5 L 408 393.5 L 405 398.5 L 402 407.5 L 398 414.5 L 395 423.5 L 391 430.5 L 391 432.5 L 381 453.5 L 381 455.5 L 378 460.5 L 375 469.5 L 371 476.5 L 368 485.5 L 361.5 497 L 353.5 501 L 348.5 501 L 347.5 500 L 344.5 500 L 329.5 495 L 326.5 493 L 321.5 492 L 318.5 490 L 303.5 485 L 289.5 478 L 287.5 478 L 282 473.5 L 279 467.5 L 279 459.5 L 280 458.5 L 280 455.5 L 281 454.5 L 281 451.5 L 282 450.5 L 283 442.5 L 284 441.5 L 286 431.5 L 285.5 431 L 281.5 435 L 259.5 455 L 255.5 457 L 246.5 457 L 223.5 444 L 189.5 421 L 155.5 394 L 133 373.5 L 130 367.5 L 130 359.5 L 134 352.5 L 223 233.5 L 242 206.5 L 254.5 192 L 271.5 177 L 285.5 168 L 299.5 161 L 314.5 156 L 317.5 156 L 318.5 155 L 330.5 154 L 331.5 153 L 352.5 153 L 354 151.5 L 356 146.5 L 372 120.5 L 374 115.5 L 387 94.5 L 397 75.5 L 402 68.5 L 408 56.5 L 413 49.5 L 423 30.5 L 431 17.5 L 439.5 9 L 449.5 3 L 455.5 1 L 458.5 1 L 459.5 0 Z M 466 30 L 459 33 L 454 39 L 448 51 L 443 58 L 433 77 L 428 84 L 414 110 L 409 117 L 407 122 L 405 124 L 403 129 L 401 131 L 399 136 L 384 161 L 386 162 L 388 162 L 396 166 L 409 175 L 422 153 L 424 148 L 429 141 L 431 136 L 433 134 L 435 129 L 437 127 L 439 122 L 444 115 L 454 96 L 459 89 L 469 70 L 474 63 L 482 47 L 482 43 L 480 38 L 475 32 L 469 30 L 466 30 Z M 333 183 L 332 184 L 328 184 L 327 185 L 324 185 L 323 186 L 320 186 L 314 188 L 300 195 L 286 205 L 271 220 L 267 225 L 266 228 L 410 310 L 412 307 L 412 305 L 416 296 L 418 285 L 419 284 L 419 279 L 420 278 L 420 252 L 419 251 L 419 246 L 417 241 L 417 238 L 411 224 L 402 211 L 389 198 L 371 188 L 362 185 L 352 184 L 351 183 L 333 183 Z M 248 252 L 195 322 L 193 326 L 172 353 L 167 361 L 194 384 L 228 409 L 249 422 L 256 417 L 303 372 L 310 368 L 318 368 L 322 370 L 328 378 Q 327 381 329 382 L 329 386 L 326 395 L 326 399 L 323 408 L 323 411 L 322 412 L 322 416 L 319 425 L 319 428 L 318 429 L 318 432 L 317 433 L 317 437 L 314 446 L 314 449 L 313 450 L 313 453 L 312 454 L 316 456 L 318 456 L 331 462 L 343 466 L 351 448 L 351 446 L 354 441 L 354 439 L 357 434 L 357 432 L 364 418 L 364 416 L 367 411 L 367 409 L 370 404 L 370 402 L 377 388 L 377 386 L 380 381 L 380 379 L 383 374 L 383 372 L 387 365 L 390 356 L 393 351 L 393 349 L 396 344 L 397 339 L 375 326 L 373 324 L 368 322 L 366 320 L 361 318 L 354 313 L 349 311 L 347 309 L 342 307 L 340 305 L 335 303 L 321 294 L 316 292 L 314 290 L 309 288 L 307 286 L 302 284 L 295 279 L 276 269 L 248 252 Z "/><path d="M 170.5 100 L 179.5 100 Q 185 102 188 106.5 L 190 110.5 L 190 134.5 L 184.5 142 L 177.5 145 L 171.5 145 L 166.5 143 L 162 138.5 L 159 129.5 L 159 115.5 L 160 114.5 Q 159.2 109.7 161 107.5 L 166.5 102 L 170.5 100 Z "/><path d="M 131.5 140 L 151.5 140 L 156.5 142 L 162 147.5 L 164 151.5 L 164 159.5 L 163 162.5 L 158.5 168 L 152.5 171 L 130.5 171 L 124.5 168 L 122 165.5 L 119 159.5 L 119 151.5 Q 121.3 145.3 126.5 142 L 131.5 140 Z "/><path d="M 197.5 140 L 218.5 140 L 223.5 142 L 228 146.5 L 231 152.5 L 231 158.5 L 229 163.5 L 223.5 169 L 218.5 171 L 197.5 171 L 192.5 169 L 188 164.5 L 186 160.5 L 185 153.5 L 188 146.5 L 191.5 143 L 197.5 140 Z "/><path d="M 171.5 166 L 177.5 166 L 180.5 167 L 187 171.5 L 190 176.5 L 190 200.5 Q 188 206 183.5 209 L 179.5 211 L 173.5 212 L 167.5 210 L 161 203.5 Q 159.2 201.3 160 196.5 L 159 195.5 L 159 181.5 L 162 172.5 L 165.5 169 L 171.5 166 Z "/><path d="M 50.5 223 L 60.5 223 L 68 228.5 L 71 234.5 L 71 256.5 Q 69.1 262.6 64.5 266 L 59.5 268 L 51.5 268 Q 45.3 265.7 42 260.5 L 40 255.5 L 40 235.5 L 42 230.5 L 48.5 224 L 50.5 223 Z "/><path d="M 13.5 263 L 30.5 263 Q 31.5 265 35.5 264 L 43 270.5 L 45 274.5 L 45 282.5 Q 43.1 288.6 38.5 292 L 33.5 294 L 10.5 294 Q 5 292 2 287.5 L 0 283.5 L 0 274.5 Q 2.3 268.3 7.5 265 L 13.5 263 Z "/><path d="M 80.5 263 L 97.5 263 L 103.5 265 L 108 268.5 L 111 273.5 L 112 279.5 L 109 287.5 L 104.5 292 L 100.5 294 L 77.5 294 Q 71.3 291.7 68 286.5 L 66 281.5 L 66 276.5 L 69 269.5 L 72.5 266 L 80.5 263 Z "/><path d="M 54.5 289 L 61.5 290 L 69 296.5 L 71 301.5 L 71 322.5 L 69 327.5 L 63.5 333 L 58.5 335 L 53.5 335 L 46.5 332 L 43 328.5 L 40 321.5 L 40 302.5 Q 41.8 301.8 41 298.5 L 46.5 292 L 54.5 289 Z "/><path d="M 98.5 400 L 107.5 402 L 113 407.5 L 115 411.5 L 115 434.5 Q 112.7 440.7 107.5 444 L 101.5 446 L 96.5 446 L 90.5 443 L 87 439.5 L 84 430.5 L 84 415.5 L 85 414.5 Q 84.3 410.3 86 408.5 L 92.5 402 L 98.5 400 Z "/><path d="M 55.5 441 L 77.5 441 L 80.5 442 L 86 446.5 L 89 451.5 L 89 460.5 Q 86.7 466.7 81.5 470 L 76.5 472 L 56.5 472 L 51.5 470 L 46 464.5 L 44 460.5 L 44 452.5 L 45 449.5 L 49.5 444 L 55.5 441 Z "/><path d="M 121.5 441 L 144.5 441 Q 150.7 443.3 154 448.5 L 156 453.5 L 156 458.5 L 154 464.5 L 148.5 470 L 146.5 470 L 143.5 472 L 122.5 472 L 116.5 469 L 113 465.5 L 111 461.5 L 110 455.5 Q 112 454.5 111 450.5 L 117.5 443 L 121.5 441 Z "/><path d="M 96.5 467 L 103.5 467 L 106.5 468 L 113 473.5 L 115 478.5 L 115 501.5 Q 113 507 108.5 510 L 104.5 512 L 95.5 512 Q 89.3 509.7 86 504.5 Q 84.3 502.7 85 498.5 L 84 497.5 L 84 482.5 L 87 473.5 L 91.5 469 L 96.5 467 Z "/></svg>',au=ii,nu='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" fill="currentColor"/><rect x="14" y="14" width="7" height="7" fill="none" stroke="currentColor" stroke-width="1"/><path d="M12 4a8 8 0 0 1 7.25 7.25" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"/><path d="M20.75 10 L17.25 10 L19 12.5 Z" fill="currentColor"/><path d="M12 20a8 8 0 0 1-8-8" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"/><path d="M6 14 L2.5 14 L4 11 Z" fill="currentColor"/></svg>',ou='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20" fill="none" style="fill:none"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12.4 3.25H5.5A2.25 2.25 0 0 0 3.25 5.5v9A2.25 2.25 0 0 0 5.5 16.75h9A2.25 2.25 0 0 0 16.75 14.5V8.6"/><g transform="rotate(45 13.2 6.7)"><rect x="11.7" y="1.55" width="3" height="7.45" rx="1.45"/><path d="M11.7 3.2h3"/><path d="M11.7 9 13.2 12.15 14.7 9"/><rect x="12.8" y="7.05" width="0.8" height="1.2" rx="0.4"/></g></g></svg>',iu='<path fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="butt" stroke-linejoin="miter" d="M2.6 6.8v8.5h5.2l2.2 2.4 2.2-2.4h5.2"/>',si='<g fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" transform="rotate(46 14.8 9)"><rect x="13.65" y="4.7" width="2.3" height="5.6" rx="1.05"/><path d="M13.65 10.3 14.8 12.9 15.95 10.3"/></g>';function Ue(e){return`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">${iu}${e}</svg>`}const su=Ue('<path fill="currentColor" d="M6.4 12.2c-1.85 0-3.3-1.25-3.3-2.85 0-1.35.95-2.5 2.3-2.8.45-1.7 1.95-2.85 3.7-2.85 1.25 0 2.35.55 3.05 1.45.55-.7 1.45-1.15 2.5-1.15 1.85 0 3.25 1.3 3.25 2.95 0 .3-.05.55-.1.8 1.2.4 2.05 1.4 2.05 2.65 0 1.55-1.5 2.8-3.4 2.8H6.4Z"/>'),lu=Ue(`<rect fill="none" stroke="currentColor" stroke-width="1.35" x="5" y="2.8" width="8.2" height="7.2"/><rect fill="${L}" x="4.2" y="2" width="2" height="2"/><rect fill="${L}" x="12.2" y="9" width="2" height="2"/>${si}`),cu=Ue(`<ellipse fill="none" stroke="currentColor" stroke-width="1.35" cx="9" cy="6.6" rx="4" ry="3.6"/><rect fill="${L}" x="8" y="2.1" width="2" height="2"/><rect fill="${L}" x="4" y="5.6" width="2" height="2"/>${si}`),du=Ue('<path fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" d="M4.4 12.6 10.2 7"/><rect fill="currentColor" x="10.2" y="1.2" width="7.8" height="5.8" rx=".35"/>'),uu=Ue('<path fill="currentColor" fill-rule="evenodd" d="M10 2.2 15.3 13.1h-2.2l-1.05-2.95H7.95L6.9 13.1H4.7L10 2.2Zm0 3.4-1.15 3.2h2.3L10 5.6Z"/>'),mu=Ue('<g transform="rotate(-40 10 7.6)" fill="currentColor"><path d="M3.5 6.75h9V5.15L16.7 7.6 12.5 10.05V8.45h-9Z"/></g>'),pu=ka("M624 475.968V640h144a128 128 0 0 1 128 128H128a128 128 0 0 1 128-128h144V475.968a192 192 0 1 1 224 0M128 896v-64h768v64z"),li=`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><rect x="3.5" y="3" width="13" height="14" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M3.5 6.5h13"/><path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M6.5 9.5h7M6.5 12h7M6.5 14.5h3.2"/><g fill="none" stroke="${L}" stroke-width="1.7" stroke-linecap="round"><circle cx="14.5" cy="14.7" r="4.2"/><path d="M17.5 17.7 19.5 19.7"/></g></svg>`,hu=li,fu='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" d="M4.5 2h6.4L15.5 6.6V16.5A1.5 1.5 0 0 1 14 18H4.5A1.5 1.5 0 0 1 3 16.5V3.5A1.5 1.5 0 0 1 4.5 2z"/><path stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" d="M10.9 2v4.6h4.6"/><path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M10 5.8v6M7.2 9.6 10 12.5l2.8-2.9"/></svg>',gu='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" d="M15.5 2H9.1L4.5 6.6V16.5A1.5 1.5 0 0 0 6 18h9.5A1.5 1.5 0 0 0 17 16.5V3.5A1.5 1.5 0 0 0 15.5 2z"/><path stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" d="M9.1 2v4.6H4.5"/><path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M10 14.2V8M7.2 10.4 10 7.5l2.8 2.9"/></svg>',wu=ii,bu=ka("M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352m0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288m0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448m0 64a160.19 160.19 0 0 0-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160"),yu=ka("M876.8 156.8c0-9.6-3.2-16-9.6-22.4s-12.8-9.6-22.4-9.6-16 3.2-22.4 9.6L736 220.8c-64-32-137.6-51.2-224-60.8-160 16-288 73.6-377.6 176S0 496 0 512s48 73.6 134.4 176c22.4 25.6 44.8 48 73.6 67.2l-86.4 89.6c-6.4 6.4-9.6 12.8-9.6 22.4s3.2 16 9.6 22.4 12.8 9.6 22.4 9.6 16-3.2 22.4-9.6l704-710.4c3.2-6.4 6.4-12.8 6.4-22.4m-646.4 528Q115.2 579.2 76.8 512q43.2-72 153.6-172.8C304 272 400 230.4 512 224c64 3.2 124.8 19.2 176 44.8l-54.4 54.4C598.4 300.8 560 288 512 288c-64 0-115.2 22.4-160 64s-64 96-64 160c0 48 12.8 89.6 35.2 124.8L256 707.2c-9.6-6.4-19.2-16-25.6-22.4m140.8-96Q352 555.2 352 512c0-44.8 16-83.2 48-112s67.2-48 112-48c28.8 0 54.4 6.4 73.6 19.2zM889.599 336c-12.8-16-28.8-28.8-41.6-41.6l-48 48c73.6 67.2 124.8 124.8 150.4 169.6q-43.2 72-153.6 172.8c-73.6 67.2-172.8 108.8-284.8 115.2-51.2-3.2-99.2-12.8-140.8-28.8l-48 48c57.6 22.4 118.4 38.4 188.8 44.8 160-16 288-73.6 377.6-176S1024 528 1024 512s-48.001-73.6-134.401-176","M511.998 672c-12.8 0-25.6-3.2-38.4-6.4l-51.2 51.2c28.8 12.8 57.6 19.2 89.6 19.2 64 0 115.2-22.4 160-64 41.6-41.6 64-96 64-160 0-32-6.4-64-19.2-89.6l-51.2 51.2c3.2 12.8 6.4 25.6 6.4 38.4 0 44.8-16 83.2-48 112s-67.2 48-112 48"),vu='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m18.5 10 4.4 11h-2.155l-1.201-3h-4.09l-1.199 3h-2.154L16.5 10h2zM10 2v2h6v2h-1.968a18.222 18.222 0 0 1-3.62 6.301 14.864 14.864 0 0 0 2.336 1.707l-.751 1.878A17.015 17.015 0 0 1 9 13.725 16.676 16.676 0 0 1 3.524 17.273l-.536-1.929a14.7 14.7 0 0 0 5.327-3.042A18.078 18.078 0 0 1 4.767 8h2.24A16.032 16.032 0 0 0 9 10.877 16.165 16.165 0 0 0 11.91 6.001L2 6V4h6V2h2zm7.5 10.885L16.253 16h2.492L17.5 12.885z"/></svg>',xu='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><circle cx="10" cy="10" r="4" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-width="1.5" d="M10 2v2M10 16v2M2 10h2M16 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4"/></svg>',ku='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" d="M10 3a7 7 0 1 0 0 14 9 9 0 0 1 0-14Z"/></svg>',Lu='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M10 6.5 5.5 11h9L10 6.5Z"/></svg>',Au='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M10 13.5 14.5 9h-9L10 13.5Z"/></svg>',un='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" d="M10 2.6 18 9.8h-2.1V17h-4.4v-4.4H8.5V17H4.1V9.8H2L10 2.6Zm0 1.8L5.3 9.8V15.8h2V11.4h5.4v4.4h2V9.8L10 4.4Z"/></svg>',Cu=`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">${ni}<path fill="${L}" d="M14.85 0.85 15.95 4.05 19.15 5.15 15.95 6.25 14.85 9.45 13.75 6.25 10.55 5.15 13.75 4.05Z"/><path fill="${L}" d="M17.55 8.35 18.15 10.15 19.95 10.75 18.15 11.35 17.55 13.15 16.95 11.35 15.15 10.75 16.95 10.15Z"/></svg>`,Mu='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" d="M8.08 2.1h3.84l.32 1.52a6.4 6.4 0 0 1 1.36.78l1.48-.64 1.92 1.92-.64 1.48c.3.42.54.88.78 1.36l1.52.32v3.84l-1.52.32a6.4 6.4 0 0 1-.78 1.36l.64 1.48-1.92 1.92-1.48-.64a6.4 6.4 0 0 1-1.36.78l-.32 1.52H8.08l-.32-1.52a6.4 6.4 0 0 1-1.36-.78l-1.48.64-1.92-1.92.64-1.48a6.4 6.4 0 0 1-.78-1.36L1.34 11.92V8.08l1.52-.32c.24-.48.48-.94.78-1.36l-.64-1.48 1.92-1.92 1.48.64c.42-.3.88-.54 1.36-.78L8.08 2.1ZM10 7.2A2.8 2.8 0 1 0 10 12.8 2.8 2.8 0 0 0 10 7.2Z"/></svg>',Eu='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="none" stroke="currentColor" stroke-width="1.5" d="M10 2.5v6M7 5.5h6"/><circle cx="10" cy="14.5" r="3.2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="10" cy="14.5" r="1.1" fill="currentColor"/></svg>',Su='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" d="M10.09 3.53 16.09 6.97 10.09 10.29 4.18 7 10.09 3.56M10.09 2.4 2.17 7 3.31 7.65 10.09 11.45 17 7.62 18.17 7 10.08 2.37 10.09 2.4Z"/><path fill="currentColor" d="M10.25 14.83 18.17 10.22 17 9.57 10.22 13.57 3.32 9.59 2.17 10.22 10.25 14.83Z"/><path fill="currentColor" d="M10.25 17.63 18.17 13 17 12.37 10.22 16.37 3.32 12.38 2.17 13 10.25 17.63Z"/></svg>',zu='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" d="M10.09 5.15 16.09 8.59 10.09 11.91 4.18 8.59 10.09 5.15ZM10.09 4 2.17 8.61 3.31 9.25 10.09 13.06 17 9.24 18.16 8.61 10.08 4 10.09 4Z"/><path fill="currentColor" d="M10.25 16.46 18.17 11.85 17 11.2 10.22 15.2 3.32 11.21 2.17 11.85 10.25 16.46Z"/><path fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" d="M3.5 3.5 16.5 16.5"/></svg>',Pu='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M2.25 2.25h4.878v4.878H2.25V2.25Zm.978.978v2.924h2.924V3.228H3.228Z"/><path fill="currentColor" d="M5.175 20.773V7.128H4.204V21.75H21.75V4.204H7.128v.971H20.773v15.598H5.175Z"/></svg>',Fu='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" fill-rule="evenodd" d="M3 2H2v16h16v-1H8v-5H3V2zm0 11v4h4v-4H3z"/></svg>',Bu='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" fill-rule="evenodd" d="M16.98 11L18.5 11L18.5 10L16.98 10C16.86 8.13 16.05 6.44 14.8 5.2L16.88 2.83L16.12 2.17L14.05 4.54C12.79 3.57 11.21 3 9.5 3C5.36 3 2 6.36 2 10.5C2 14.64 5.36 18 9.5 18C13.47 18 16.73 14.91 16.98 11ZM15.98 10C15.86 8.43 15.18 7.01 14.14 5.95L10.6 10L15.98 10ZM13.39 5.29L8.4 11L15.98 11C15.73 14.36 12.92 17 9.5 17C5.91 17 3 14.09 3 10.5C3 6.91 5.91 4 9.5 4C10.96 4 12.31 4.48 13.39 5.29Z"/></svg>',Iu='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#e75958" d="M22 12H12l5 8.66A10 10 0 0 0 22 12Z"/><path fill="#814dff" d="M17 20.66 12 12 7 20.66A10 10 0 0 0 17 20.66Z"/><path fill="#13b0ce" d="M7 20.66 12 12H2A10 10 0 0 0 7 20.66Z"/><path fill="#4ecd83" d="M2 12H12L7 3.34A10 10 0 0 0 2 12Z"/><path fill="#ffc33f" d="M7 3.34 12 12l5-8.66A10 10 0 0 0 7 3.34Z"/><path fill="#ff9543" d="M17 3.34 12 12H22A10 10 0 0 0 17 3.34Z"/></svg>',Hu=oi,Uu=ru,Tu=su,Ru=lu,Du=cu,Ou=bu,mn=yu,Pe={select:$d,pan:Vd,zoomExtent:Xd,zoomSmart:Cu,zoomBox:Hu,measureDistance:Wd,measureContinuous:Jd,measureAngle:qd,measureArc:eu,measureRadius:tu,measureArea:Qd,measureCoordinate:Uu,clearMeasurements:au,layer:Yd,layout:Zd,zoomWindow:oi,zoomOriginal:un,zoomSaved:un,layerOn:Su,layerOff:zu,language:vu,osnap:Pu,orthoMode:Fu,polarTracking:Bu,color:Iu,chevronUp:Lu,chevronDown:Au,measure:Gd,annotation:ou,markupCloud:Tu,markupCallout:du,markupText:uu,markupRect:Ru,markupCircle:Du,markupArrow:mu,markupStamp:pu,markupPanel:li,measurementPanel:hu,markupImport:fu,markupExport:gu,markupShow:Ou,markupHide:mn,markupVisibility:mn,clearMarkups:wu,settings:Mu,simulatedMouse:Eu,switchBg:nu,themeLight:xu,themeDark:ku};function Or(e,t,r){const a=Object.entries(r).map(([i,s])=>`${i}="${se(s)}"`).join(" "),n=r["data-i18n-key"],o=n?`<span class="mlcad-tool-btn-label" data-i18n-key="${se(n)}" data-i18n-text>${se(t)}</span>`:"";return`<button type="button" class="mlcad-tool-btn" title="${se(t)}" aria-label="${se(t)}" ${a}><span class="mlcad-tool-btn-icon" aria-hidden="true">${e}</span>${o}</button>`}function ju(e,t,r){const a=Object.entries(r).map(([i,s])=>`${i}="${se(s)}"`).join(" "),n=r["data-i18n-key"],o=n?` data-i18n-key="${se(n)}" data-i18n-text`:"";return`<button type="button" class="mlcad-dropdown-item" role="menuitem" title="${se(t)}" ${a}><span class="mlcad-dropdown-icon" aria-hidden="true">${e}</span><span class="mlcad-dropdown-label"${o}>${se(t)}</span></button>`}function se(e){return e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;")}const ci=[90,45,30,23,18,10,5],di=90,Nu=di,_u={en:"toolbar.localeEn",ja:"toolbar.localeJa",zh:"toolbar.localeZh",cs:"toolbar.localeCs",tr:"toolbar.localeTr",ar:"toolbar.localeAr"},$u={en:"English",ja:"日本語",zh:"中文",cs:"Čeština",tr:"Türkçe",ar:"العربية"};function Vu(){return`<div id="mlcad-locale-strip-wrap" hidden>
        <div id="mlcad-locale-strip" role="toolbar" data-i18n-attr="aria-label" data-i18n-key="toolbar.language" aria-label="Language">
          ${ge.map(e=>{const t=$u[e],r=_u[e],a=pa[e];return`<button type="button" class="mlcad-tool-btn mlcad-locale-option" data-locale="${e}" data-i18n-key="${r}" data-i18n-attr="title aria-label" title="${t}" aria-label="${t}"><span class="mlcad-tool-btn-icon" aria-hidden="true"><span class="mlcad-locale-option-badge">${a}</span></span><span class="mlcad-tool-btn-label" data-i18n-key="${r}" data-i18n-text>${t}</span></button>`}).join("")}
        </div>
      </div>`}function La(){return`<div id="mlcad-polar-angles" role="group" data-i18n-attr="aria-label" data-i18n-key="settings.polarAngles" aria-label="Snap angles" hidden>
          ${ci.map(e=>`<button type="button" class="mlcad-tool-btn mlcad-settings-option-btn mlcad-polar-angle-btn" data-polar-ang="${e}" title="${e}°" aria-label="${e}°"><span class="mlcad-settings-option-indicator" aria-hidden="true"></span><span class="mlcad-settings-option-text">${e}°</span></button>`).join("")}
        </div>`}function Xu(){return`<div id="mlcad-snap-strip-wrap" hidden>
        <div id="mlcad-snap-strip" role="toolbar" data-i18n-attr="aria-label" data-i18n-key="toolbar.snap" aria-label="Object snap">
          ${Or(Pe.orthoMode,"Orthogonal mode",{id:"mlcad-ortho-btn","data-toggle":"ortho","data-i18n-key":"settings.ortho","data-i18n-attr":"title aria-label"})}
          ${Or(Pe.polarTracking,"Angle snapping",{id:"mlcad-polar-btn","data-toggle":"polar","data-i18n-key":"settings.polar","data-i18n-attr":"title aria-label"})}
        </div>
        ${La()}
      </div>`}const ui=600,mi=960,tr=`
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

  @media (max-width: ${ui}px) {
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
  @media (max-width: ${mi}px), (pointer: coarse) {
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
`;function rr(e,t="measure",r=!0){const a=t==="measure"?`${La()}${Zu()}${Yu()}`:"";return`
  <div id="mlcad-loading" aria-hidden="true" style="background:${e}">
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
      ${a}
      <div id="mlcad-layer-drawer" role="dialog" data-i18n-attr="aria-label" data-i18n-key="layers.title" aria-label="Layers" hidden>
        ${Aa("mlcad-layer-sheet-close","layers.close","Close layers")}
        <div class="mlcad-drawer-header">
          <span data-i18n-key="layers.title" data-i18n-text>Layers</span>
          <button type="button" class="mlcad-drawer-close" id="mlcad-layer-close" data-i18n-key="layers.close" data-i18n-attr="aria-label" aria-label="Close layers">×</button>
        </div>
        <div class="mlcad-layer-actions">
          <button type="button" class="mlcad-layer-action-btn" id="mlcad-layer-show-all">
            ${Pe.layerOn}<span data-i18n-key="layers.showAll" data-i18n-text>Show all</span>
          </button>
          <button type="button" class="mlcad-layer-action-btn" id="mlcad-layer-hide-all">
            ${Pe.layerOff}<span data-i18n-key="layers.hideAll" data-i18n-text>Hide all</span>
          </button>
        </div>
        <div id="mlcad-layer-list"></div>
      </div>
    </aside>
  </div>
`}function Aa(e,t,r){return`<div class="mlcad-drawer-sheet-chrome">
          <div class="mlcad-drawer-grabber" role="separator" aria-orientation="horizontal"></div>
          <button type="button" class="mlcad-drawer-sheet-close" id="${e}" data-i18n-key="${t}" data-i18n-attr="aria-label" aria-label="${r}">${Pe.chevronDown}</button>
        </div>`}function Yu(){return`<div id="mlcad-review-drawer" role="dialog" data-i18n-attr="aria-label" data-i18n-key="review.title" aria-label="Comments" hidden>
        ${Aa("mlcad-review-sheet-close","review.close","Close review")}
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
      </div>`}function Zu(){return`<div id="mlcad-measure-drawer" role="dialog" data-i18n-attr="aria-label" data-i18n-key="measurePanel.title" aria-label="Measurements" hidden>
        ${Aa("mlcad-measure-sheet-close","measurePanel.close","Close measurements")}
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
      </div>`}function pi(e,t){var r;const a=t.title??e.meta.title??"CAD Drawing",n=t.encoded??oa(e),o=t.viewerRuntime,i=so(),s=n.compression,l=((r=t.accessManifest)==null?void 0:r.encrypted)===!0,c=`#${e.meta.background.toString(16).padStart(6,"0")}`,d=He(e.meta.locale)??"en",u=e.meta.viewerMode??"measure",p=e.meta.exportLayouts!==!1,m=t.accessManifest?`  <script id="mlcad-access" type="application/json">${gi(JSON.stringify(t.accessManifest))}<\/script>
`:"",h=l?`${i}+aes-gcm;base85`:`${i}+${s};base85`;return`<!DOCTYPE html>
<html lang="${d}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="generator" content="mlightcad-cad-html-plugin" />
  <title>${hi(a)}</title>
  <style>${tr}</style>
</head>
<body>
${rr(c,u,p)}
${m}  <script id="mlcad-snapshot" type="${h}">${n.payload}<\/script>
  <script>${fi(o)}<\/script>
</body>
</html>`}function Ca(e,t){var r;const a=t.title??e.meta.title??"CAD Drawing",n=t.viewerRuntime,o=`#${e.meta.background.toString(16).padStart(6,"0")}`,i=He(e.meta.locale)??"en",s=e.meta.viewerMode??"measure",l=e.meta.exportLayouts!==!1,c=(r=t.manifestUrl)==null?void 0:r.trim(),d=JSON.stringify(c&&c!==xa?{manifestUrl:c}:{});return`<!DOCTYPE html>
<html lang="${i}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="generator" content="mlightcad-cad-html-plugin" />
  <title>${hi(a)}</title>
  <style>${tr}</style>
</head>
<body>
${rr(o,s,l)}
  <script id="mlcad-package" type="application/json">${gi(d)}<\/script>
  <script>${fi(n)}<\/script>
</body>
</html>`}function hi(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function fi(e){return e.replace(/<\/script/gi,"<\\/script")}function gi(e){return e.replace(/</g,"\\u003c")}const wi=1,bi=600*1e3,Gu=1e5,Ku=16,jr=12,Wu={en:"en",ja:"ja",zh:"zh-CN",cs:"cs",tr:"tr",ar:"ar"};function yi(e,t=Date.now(),r){return e==="never"?null:e==="custom"?r??null:t+e*24*60*60*1e3}function Ma(e){var t;const r=!!((t=e.password)!=null&&t.trim());return e.expiresAt!=null||r}function Ju(e,t=Date.now()){return e.expiresAt!=null&&t>e.expiresAt}function qu(e,t=Date.now()){const r=e-t;return r>0&&r<=bi}function Qu(e,t="en"){const r=Wu[t]??t;try{return new Date(e).toLocaleString(r,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!1})}catch{return new Date(e).toISOString()}}function em(e){const t=Math.max(0,Math.ceil(e/1e3)),r=Math.floor(t/3600),a=Math.floor(t%3600/60),n=t%60,o=String(a).padStart(2,"0"),i=String(n).padStart(2,"0");return r>0?`${r}:${o}:${i}`:`${a}:${i}`}function tm(e){const t=e==null?void 0:e.trim();if(!t)return null;try{const r=JSON.parse(t);return(r==null?void 0:r.v)!==wi?null:r}catch{return null}}function Qe(e){var t;if(!Ma(e))return;const r=!!((t=e.password)!=null&&t.trim());return{v:wi,expiresAt:e.expiresAt,encrypted:r,...r&&e.salt?{salt:e.salt}:{}}}async function ar(e,t){const r=t!=null&&t.trim()?new Uint8Array(Ci(t)):crypto.getRandomValues(new Uint8Array(Ku));return{key:await am(e,r),salt:Ai(r)}}async function nr(e,t){const r=crypto.getRandomValues(new Uint8Array(jr)),a=new Uint8Array(t),n=new Uint8Array(await crypto.subtle.encrypt({name:"AES-GCM",iv:r},e,a)),o=new Uint8Array(r.length+n.length);return o.set(r,0),o.set(n,r.length),o}async function or(e,t){const r=new Uint8Array(t.subarray(0,jr)),a=new Uint8Array(t.subarray(jr));return new Uint8Array(await crypto.subtle.decrypt({name:"AES-GCM",iv:r},e,a))}async function vi(e,t,r="base85"){const{key:a,salt:n}=await ar(e),o=ot(t,r),i=await nr(a,o);return{encryptedPayload:Be(i,r),salt:n}}async function rm(e,t,r,a="base85"){const{key:n}=await ar(e,r),o=await or(n,ot(t,a));return Be(o,a)}function xi(e){return Ai(e)}function ki(e){return Ci(e)}async function Li(e,t){var r;if(!Ma(t))return{encoded:e};const a=(r=t.password)==null?void 0:r.trim();if(a){const{encryptedPayload:n,salt:o}=await vi(a,e.payload);return{encoded:{payload:n,compression:e.compression},manifest:Qe({expiresAt:t.expiresAt,password:a,salt:o})}}return{encoded:e,manifest:Qe({expiresAt:t.expiresAt})}}async function am(e,t){const r=new TextEncoder,a=await crypto.subtle.importKey("raw",r.encode(e),"PBKDF2",!1,["deriveKey"]);return crypto.subtle.deriveKey({name:"PBKDF2",salt:new Uint8Array(t),iterations:Gu,hash:"SHA-256"},a,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}function Ai(e){let t="";for(let r=0;r<e.length;r++)t+=String.fromCharCode(e[r]);return btoa(t)}function Ci(e){const t=atob(e.trim()),r=new Uint8Array(t.length);for(let a=0;a<t.length;a++)r[a]=t.charCodeAt(a);return r}const nm=256;function Mi(e,t=lt){return!(t>0)||Vt(e)<=t?[e]:e.indices&&e.indices.length>=2?im(e,t):om(e,t)}function Ei(e,t=lt){return e.texture?[e]:!(t>0)||Xt(e)<=t?[e]:e.points?lm(e,t):!e.indices||e.indices.length<3?zi(e,t):dm(e,t)}function Si(e){return e.linePattern?64+e.linePattern.pattern.length*8:0}function Ea(e){return(e.hatchPattern?128:0)+(e.gradientFill?64:0)}function ut(e,t,r){const a=e-nm-t;return a<r?1:Math.max(1,Math.floor(a/r))}function om(e,t){var r;const a=(((r=e.lineDistances)==null?void 0:r.length)??0)>=2,n=24+(a?8:0),o=ut(t,Si(e),n),i=e.positions.length/6|0;if(i<=1)return[e];const s=[];for(let l=0;l<i;l+=o){const c=Math.min(o,i-l),d=l*6,u={layer:e.layer,color:e.color,offset:e.offset,positions:e.positions.slice(d,d+c*6)};if(Bi(e,u),a&&e.lineDistances){const p=l*2;u.lineDistances=e.lineDistances.slice(p,p+c*2)}s.push(u)}return s.length>0?s:[e]}function im(e,t){var r;const a=e.indices,n=32+((((r=e.lineDistances)==null?void 0:r.length)??0)>0?8:0),o=ut(t,Si(e),n),i=[];for(let s=0;s+1<a.length;){const l=Math.min(o*2,a.length-s),c=l-l%2;if(c<2)break;i.push(sm(e,s,c)),s+=c}return i.length>0?i:[e]}function sm(e,t,r){const a=Fi(e.positions,e.indices.subarray(t,t+r),e.lineDistances?[e.lineDistances]:[],[1]),n={layer:e.layer,color:e.color,offset:e.offset,positions:a.positions,indices:a.indices};return Bi(e,n),a.attributes[0]&&a.attributes[0].length>0&&(n.lineDistances=a.attributes[0]),n}function lm(e,t){return e.indices&&e.indices.length>0?cm(e,t):zi(e,t)}function cm(e,t){const r=e.indices,a=16+(e.uvs?8:0)+(e.gradientPositions?8:0),n=ut(t,Ea(e),a),o=[];for(let i=0;i<r.length;){const s=Math.min(n,r.length-i);if(s<1)break;o.push(Pi(e,i,s)),i+=s}return o.length>0?o:[e]}function zi(e,t){const r=e.positions.length/3|0;if(r<=1)return[e];const a=12+(e.uvs?8:0)+(e.gradientPositions?8:0),n=ut(t,Ea(e),a),o=e.points?1:3,i=Math.max(o,n-n%o),s=[];for(let l=0;l<r;l+=i){const c=Math.min(i,r-l),d=c-c%o;if(d<o)break;s.push(um(e,l,d))}return s.length>0?s:[e]}function dm(e,t){const r=e.indices,a=48+(e.uvs?24:0)+(e.gradientPositions?24:0),n=ut(t,Ea(e),a),o=[];for(let i=0;i+2<r.length;){const s=Math.min(n*3,r.length-i),l=s-s%3;if(l<3)break;o.push(Pi(e,i,l)),i+=l}return o.length>0?o:[e]}function um(e,t,r){const a=t*3,n={layer:e.layer,color:e.color,offset:e.offset,positions:e.positions.slice(a,a+r*3)};return Ii(e,n),e.uvs&&(n.uvs=e.uvs.slice(t*2,(t+r)*2)),e.gradientPositions&&(n.gradientPositions=e.gradientPositions.slice(t*2,(t+r)*2)),n}function Pi(e,t,r){const a=[],n=[];e.uvs&&(a.push(e.uvs),n.push(2)),e.gradientPositions&&(a.push(e.gradientPositions),n.push(2));const o=Fi(e.positions,e.indices.subarray(t,t+r),a,n),i={layer:e.layer,color:e.color,offset:e.offset,positions:o.positions,indices:o.indices};Ii(e,i);let s=0;return e.uvs&&(i.uvs=o.attributes[s++]),e.gradientPositions&&(i.gradientPositions=o.attributes[s]),i}function Fi(e,t,r,a){const n=new Map,o=[],i=new Uint32Array(t.length),s=r.map(()=>[]);for(let l=0;l<t.length;l++){const c=t[l];let d=n.get(c);if(d==null){d=n.size,n.set(c,d);const u=c*3;o.push(e[u]??0,e[u+1]??0,e[u+2]??0);for(let p=0;p<r.length;p++){const m=a[p],h=r[p],f=c*m;for(let w=0;w<m;w++)s[p].push(h[f+w]??0)}}i[l]=d}return{positions:Float32Array.from(o),indices:i,attributes:s.map(l=>Float32Array.from(l))}}function Bi(e,t){e.linePattern&&(t.linePattern=e.linePattern),e.lineWidth!=null&&(t.lineWidth=e.lineWidth),e.renderOrder!=null&&(t.renderOrder=e.renderOrder),e.excludeFromOsnap&&(t.excludeFromOsnap=!0)}function Ii(e,t){e.hatchPattern&&(t.hatchPattern=e.hatchPattern),e.gradientFill&&(t.gradientFill=e.gradientFill),e.side!=null&&(t.side=e.side),e.renderOrder!=null&&(t.renderOrder=e.renderOrder),e.points&&(t.points=!0)}function Hi(e,t,r=lt){const a=[];let n={lineBatches:[],meshBatches:[],estimatedBytes:64};const o=()=>{n.lineBatches.length===0&&n.meshBatches.length===0&&a.length>0||(a.push(n),n={lineBatches:[],meshBatches:[],estimatedBytes:64})},i=c=>{const d=Vt(c);n.estimatedBytes+d>t&&(n.lineBatches.length>0||n.meshBatches.length>0)&&o(),n.lineBatches.push(c),n.estimatedBytes+=d},s=c=>{const d=Xt(c);n.estimatedBytes+d>t&&(n.lineBatches.length>0||n.meshBatches.length>0)&&o(),n.meshBatches.push(c),n.estimatedBytes+=d},l=Math.min(t,r);for(const c of e.lineBatches)for(const d of Mi(c,l))i(d);for(const c of e.meshBatches)for(const d of Ei(c,l))s(d);return(a.length===0||n.lineBatches.length>0||n.meshBatches.length>0)&&o(),a.length===0&&a.push({lineBatches:[],meshBatches:[],estimatedBytes:64}),a}function Ui(e,t){if(e.version!==D)throw new Error(`Unsupported snapshot version: ${e.version}`);const r=t.maxChunkBytes??ya,a=t.maxBatchBytes??lt,n=t.maxOsnapChunkBytes??r,o=t.compressChunks!==!1,i=o?"acex.gz":"acex",s=o?"osnap.gz":"osnap",l=ae,c=fm(e.layouts,e.activeLayoutBtrId),d=[],u=[],p=new Map;return c.forEach((m,h)=>{var f;p.set(m.btrId,h);const w=Hi(m,r,a),b=[];w.forEach((v,A)=>{const M=`L${h}-${String(A).padStart(3,"0")}`,E=`chunks/${M}.${i}`;b.push(M),d.push({kind:"geometry",id:M,href:E,layoutBtrId:m.btrId,lineBatchCount:v.lineBatches.length,meshBatchCount:v.meshBatches.length,chunk:{version:D,layoutBtrId:m.btrId,lineBatches:v.lineBatches,meshBatches:v.meshBatches}})});const g={btrId:m.btrId,name:m.name,isModelSpace:m.isModelSpace,viewports:m.viewports,...m.savedView?{savedView:m.savedView}:{},chunkIds:b},k=(f=m.osnap)==null?void 0:f.primitives;if(k&&k.length>0){const v=qn(k,n),A=[];v.forEach((M,E)=>{const y=`L${h}-osnap-${String(E).padStart(3,"0")}`,x=`chunks/${y}.${s}`;A.push(y),d.push({kind:"osnap",id:y,href:x,layoutBtrId:m.btrId,primitiveCount:M.length,primitives:M})}),g.osnapChunkIds=A}u.push(g)}),{jobs:d,layoutRefs:u,layoutIndexByBtrId:p,manifestFileName:l,compressChunks:o}}function Ti(e,t,r,a,n){var o,i;const s=[],l=[],c=[];for(const b of n){const{job:g,uncompressedByteLength:k,compressed:v}=b;c.push({path:g.href,bytes:v}),g.kind==="geometry"?s.push({id:g.id,href:g.href,layoutBtrId:g.layoutBtrId,byteLength:k,compressedByteLength:v.byteLength,lineBatchCount:g.lineBatchCount,meshBatchCount:g.meshBatchCount}):l.push({id:g.id,href:g.href,layoutBtrId:g.layoutBtrId,byteLength:k,compressedByteLength:v.byteLength,primitiveCount:g.primitiveCount})}const d=e.layouts.map(b=>{const g=r.get(b.btrId);return t[g]}),u=new Set(((o=d.find(b=>b.btrId===e.activeLayoutBtrId))==null?void 0:o.chunkIds)??[]),p=[...s.filter(b=>u.has(b.id)),...s.filter(b=>!u.has(b.id))],m=new Set(((i=d.find(b=>b.btrId===e.activeLayoutBtrId))==null?void 0:i.osnapChunkIds)??[]),h=[...l.filter(b=>m.has(b.id)),...l.filter(b=>!m.has(b.id))],f={format:"acex-package",packageVersion:ba,snapshotVersion:D,meta:e.meta,layers:e.layers,activeLayoutBtrId:e.activeLayoutBtrId,layouts:d,chunks:p,...h.length>0?{osnapChunks:h}:{}},w=`${JSON.stringify(f)}
`;return c.unshift({path:a,bytes:Me(w)}),{manifest:f,manifestFileName:a,files:c}}function mm(e,t){if(e.kind==="geometry"){if(!t){const i=st(e.chunk);return{job:e,uncompressedByteLength:i.byteLength,compressed:i}}const{uncompressed:n,compressed:o}=Vo(e.chunk);return{job:e,uncompressedByteLength:n.byteLength,compressed:o}}if(!t){const n=Ie({primitives:e.primitives});return{job:e,uncompressedByteLength:n.byteLength,compressed:n}}const{uncompressed:r,compressed:a}=Qn({primitives:e.primitives});return{job:e,uncompressedByteLength:r.byteLength,compressed:a}}async function pm(e,t){if(e.kind==="geometry"){if(!t){const i=st(e.chunk);return{job:e,uncompressedByteLength:i.byteLength,compressed:i}}const{uncompressed:n,compressed:o}=await Pd(e.chunk);return{job:e,uncompressedByteLength:n.byteLength,compressed:o}}if(!t){const n=Ie({primitives:e.primitives});return{job:e,uncompressedByteLength:n.byteLength,compressed:n}}const{uncompressed:r,compressed:a}=await ac({primitives:e.primitives});return{job:e,uncompressedByteLength:r.byteLength,compressed:a}}function Ri(e,t={}){const{jobs:r,layoutRefs:a,layoutIndexByBtrId:n,manifestFileName:o,compressChunks:i}=Ui(e,t),s=r.map(l=>mm(l,i));return Ti(e,a,n,o,s)}async function Sa(e,t={}){const{jobs:r,layoutRefs:a,layoutIndexByBtrId:n,manifestFileName:o,compressChunks:i}=Ui(e,t),s=await Promise.all(r.map(l=>pm(l,i)));return Ti(e,a,n,o,s)}function hm(e,t){const r=Ri(e,t),a=Ca(e,{title:e.meta.title,viewerRuntime:t.viewerRuntime,...t.manifestUrl?{manifestUrl:t.manifestUrl}:{}});return{html:a,manifest:r.manifest,manifestFileName:r.manifestFileName,files:[{path:"viewer.html",bytes:Me(a)},...r.files]}}async function Di(e,t){const r=await Sa(e,t),a=Ca(e,{title:e.meta.title,viewerRuntime:t.viewerRuntime,...t.manifestUrl?{manifestUrl:t.manifestUrl}:{}});return{html:a,manifest:r.manifest,manifestFileName:r.manifestFileName,files:[{path:"viewer.html",bytes:Me(a)},...r.files]}}function fm(e,t){const r=e.find(n=>n.btrId===t),a=e.filter(n=>n.btrId!==t);return r?[r,...a]:[...e]}const Oi="application/vnd.mlightcad.acex-chunk;base85",gm="application/vnd.mlightcad.acex-chunk;base64",ji="application/vnd.mlightcad.acex-chunk+aes-gcm;base85",wm="application/vnd.mlightcad.acex-chunk+aes-gcm;base64",le="data-acex-href";function Ni(e){var t;let r=0;for(const a of e.layouts){for(const o of a.lineBatches)r+=Vt(o);for(const o of a.meshBatches)r+=Xt(o);const n=(t=a.osnap)==null?void 0:t.primitives;if(n)for(const o of n)r+=na(o)}return r}function _i(e,t=Yo){return Ni(e)>=t}async function $i(e,t){var r;const a=t.title??e.meta.title??"CAD Drawing",n=t.viewerRuntime,o=`#${e.meta.background.toString(16).padStart(6,"0")}`,i=He(e.meta.locale)??"en",s=e.meta.viewerMode??"measure",l=e.meta.exportLayouts!==!1,c=t.expiresAt??null,d=((r=t.password)==null?void 0:r.trim())||void 0,u={maxChunkBytes:t.maxChunkBytes??Dr,maxBatchBytes:t.maxBatchBytes??t.maxChunkBytes??Dr,maxOsnapChunkBytes:t.maxOsnapChunkBytes??Zo},p=await Sa(e,u);let m,h,f;if(d){const{key:b,salt:g}=await ar(d);m=Qe({expiresAt:c,password:d,salt:g});const k=new TextEncoder().encode(`${JSON.stringify(p.manifest)}
`),v=await nr(b,k);h={mode:"embedded",encrypted:!0,encryptedManifest:xi(v)},f=await ym(p.files,b)}else m=Qe({expiresAt:c}),h={mode:"embedded",manifest:p.manifest},f=bm(p.files);const w=m?`  <script id="mlcad-access" type="application/json">${pn(JSON.stringify(m))}<\/script>
`:"";return`<!DOCTYPE html>
<html lang="${i}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="generator" content="mlightcad-cad-html-plugin" />
  <title>${Yi(a)}</title>
  <style>${tr}</style>
</head>
<body>
${rr(o,s,l)}
${w}  <script id="mlcad-package" type="application/json">${pn(JSON.stringify(h))}<\/script>
${f}  <script>${Cm(n)}<\/script>
</body>
</html>`}function bm(e){const t=[];for(const r of e)r.path!==ae&&t.push(`  <script type="${Oi}" ${le}="${Zi(r.path)}">${Be(r.bytes,"base85")}<\/script>
`);return t.join("")}async function ym(e,t){const r=[];for(const a of e){if(a.path===ae)continue;const n=await nr(t,a.bytes);r.push(`  <script type="${ji}" ${le}="${Zi(a.path)}">${Be(n,"base85")}<\/script>
`)}return r.join("")}function za(e){const t=e.textContent??"";if(t.length===0)return;const r=t.charCodeAt(0)<=32||t.charCodeAt(t.length-1)<=32?t.trim():t;if(r.length===0)return;const a=Wr(e.getAttribute("type"));return ot(r,a)}function vm(e){const t=e==null?void 0:e.trim();if(!t)return null;try{const r=JSON.parse(t);return(r==null?void 0:r.mode)!=="embedded"?null:r.encrypted===!0?typeof r.encryptedManifest!="string"?null:r:r.manifest?{mode:"embedded",manifest:ct(r.manifest)}:null}catch{return null}}function xm(e=document){const t=new Map;return e.querySelectorAll(`script[${le}]`).forEach(r=>{var a;const n=(a=r.getAttribute(le))==null?void 0:a.trim();if(!n)return;const o=za(r);o&&t.set(n,o)}),t}function km(e,t=document){var r;const a=t.querySelectorAll(`script[${le}]`);for(let n=0;n<a.length;n++){const o=a[n];if(((r=o.getAttribute(le))==null?void 0:r.trim())===e)return za(o)}}function Vi(e,t=document){var r;const a=t.querySelectorAll(`script[${le}]`);for(let n=0;n<a.length;n++){const o=a[n];if(((r=o.getAttribute(le))==null?void 0:r.trim())!==e)continue;const i=za(o);return i?(o.remove(),i):void 0}}function Lm(e){const t=e.root??document,r=new Map;return Xi({manifest:e.manifest,decryptKey:e.decryptKey,getChunk:async a=>{const n=r.get(a);if(n)return n;const o=Vi(a,t);return o&&r.set(a,o),o}})}function Xi(e){const t=ae,r=new URL(t,qe).toString(),a=new URL(qe).origin,n=`${JSON.stringify(e.manifest)}
`,o=e.decryptKey??null,i=e.consumeOnFetch!==!1,s=e.chunkBytes,l=e.getChunk;return{manifestUrl:r,fetchImpl:async c=>{const d=new URL(String(c));if(d.origin!==a)return new Response(null,{status:404});const u=decodeURIComponent(d.pathname.replace(/^\/+/,""));if(u===t)return new Response(n,{status:200,headers:{"Content-Type":"application/json"}});let p;if(l?p=await l(u):s&&(p=s.get(u)),!p)return new Response(null,{status:404});const m=o?await or(o,p):p;return i&&s&&s.delete(u),new Response(m,{status:200})}}}async function Am(e,t){const r=await or(t,ki(e)),a=new TextDecoder().decode(r);return ct(JSON.parse(a))}function Yi(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Zi(e){return Yi(e).replace(/'/g,"&#39;")}function Cm(e){return e.replace(/<\/script/gi,"<\\/script")}function pn(e){return e.replace(/</g,"\\u003c")}function Gi(e){return!e||e.startsWith("/")||e.includes("\\")||e.includes("\0")?!1:e.split("/").every(t=>t.length>0&&t!=="."&&t!==".."&&/^[A-Za-z0-9._-]+$/.test(t))}function Mm(e){return e.endsWith(".gz")}function Ki(e){const t={};for(const r of e.files){if(!Gi(r.path))throw new Error(`Unsafe package path: ${r.path}`);Mm(r.path)?t[r.path]=[r.bytes,{level:0}]:t[r.path]=[r.bytes,{level:6}]}return Wl(t)}function Em(e){const t=Jl(e),r=[];for(const[a,n]of Object.entries(t)){if(!Gi(a))throw new Error("Unsafe path in package archive");r.push({path:a,bytes:n})}return r}const Sm="guide/magnifier.html",Pa="https://mlightcad.com/cad-viewer/docs/";let Fa=Ia(Pa);function Ba(){return Fa}function Wi(e){Fa=Ia(e)}function zm(e,t){const r=t.toLowerCase().split(/[-_]/)[0],a=!r||r==="en"?"":`/${r}`,n=e.replace(/^\/+/,"");return`${Fa}${a}/${n}`}function Ia(e){const t=e.trim();return t?t.replace(/\/+$/,""):Pa.replace(/\/+$/,"")}function Nr(e,t){if(e.length<8)return e;const r=e.map(h=>({value:t==="x"?(h.minX+h.maxX)/2:(h.minY+h.maxY)/2,box:h})).sort((h,f)=>h.value-f.value),a=r[r.length-1].value-r[0].value;if(!(a>0))return e;let n=0,o=0;for(let h=1;h<r.length;h++){const f=r[h].value-r[h-1].value;f>n&&(n=f,o=h)}if(n<a*.2)return e;const i=r.slice(0,o),s=r.slice(o),l=i.length>=s.length?i:s,c=e.map(h=>Math.max(h.maxX-h.minX,h.maxY-h.minY,1e-9));c.sort((h,f)=>h-f);const d=c[Math.floor(c.length/2)]||1,u=[];for(let h=1;h<l.length;h++)u.push(l[h].value-l[h-1].value);u.sort((h,f)=>h-f);const p=u.length>0&&u[Math.floor(u.length/2)]||d,m=Math.max(p*10,d*20);return n<m?e:l.map(h=>h.box)}function Ji(e){if(e.length===0)return null;const t=hn(e);if(e.length<8)return t;let r=e.slice(),a=-1;for(;r.length!==a;)a=r.length,r=Nr(r,"x"),r=Nr(r,"y");return hn(r)??t}function hn(e){if(e.length===0)return null;let t=1/0,r=1/0,a=-1/0,n=-1/0;for(const o of e)o.minX<t&&(t=o.minX),o.minY<r&&(r=o.minY),o.maxX>a&&(a=o.maxX),o.maxY>n&&(n=o.maxY);return!Number.isFinite(t)||!Number.isFinite(r)||!Number.isFinite(a)||!Number.isFinite(n)?null:{minX:t,minY:r,maxX:a,maxY:n}}function mt(){return{minX:0,minY:0,maxX:0,maxY:0,valid:!1}}function qi(e,t,r){if(t.length<3)return;const a=r[0],n=r[1];for(let o=0;o+2<t.length;o+=3){const i=Ke(t[o],a),s=Ke(t[o+1],n);e.valid?(i<e.minX&&(e.minX=i),i>e.maxX&&(e.maxX=i),s<e.minY&&(e.minY=s),s>e.maxY&&(e.maxY=s)):(e.minX=e.maxX=i,e.minY=e.maxY=s,e.valid=!0)}}function ye(e,t){qi(e,t.positions,t.offset)}function pt(e){return e.valid?{minX:e.minX,minY:e.minY,maxX:e.maxX,maxY:e.maxY}:null}function Qi(e,t){const r=mt();for(const a of e)ye(r,a);for(const a of t)ye(r,a);return pt(r)}function et(e,t){return e?t?{minX:Math.min(e.minX,t.minX),minY:Math.min(e.minY,t.minY),maxX:Math.max(e.maxX,t.maxX),maxY:Math.max(e.maxY,t.maxY)}:e:t??null}function Ha(e){if(!e||e.length===0)return null;let t=null;for(const r of e)t=et(t,r.paper);return t}function ir(e){return et(Qi(e.lineBatches,e.meshBatches),Ha(e.viewports))}function Pm(e,t,r){let a=null;for(const[n,o]of e)t(n)&&(a=et(a,o));return et(a,Ha(r))}function Fm(e,t){return ir(e)??t??{minX:0,minY:0,maxX:1,maxY:1}}function es(e){const t=[],r=a=>{if(a.positions.length<3)return;const n=mt();ye(n,a);const o=pt(n);o&&t.push({layer:a.layer,extents:o})};for(const a of e.lineBatches)r(a);for(const a of e.meshBatches)r(a);return t}function ts(e,t){var r;const a=t==null?void 0:t.isLayerVisible,n=e.filter(u=>!a||a(u.layer));if(n.length===0&&!((r=t==null?void 0:t.viewports)!=null&&r.length))return null;const o=n.map(u=>Math.max(u.extents.maxX-u.extents.minX,u.extents.maxY-u.extents.minY,1e-9));for(const u of(t==null?void 0:t.viewports)??[])o.push(Math.max(u.paper.maxX-u.paper.minX,u.paper.maxY-u.paper.minY,1e-9));o.sort((u,p)=>u-p);const i=o[Math.floor(o.length/2)]||1,s=Math.max(i*50,1e10),l=[],c=(t==null?void 0:t.sampleFromLayout)!=null;for(const u of n){if(Math.max(u.extents.maxX-u.extents.minX,u.extents.maxY-u.extents.minY)>=s){if(c){const p=t.sampleFromLayout,m=fn(p.lineBatches,u)??fn(p.meshBatches,u);if(m&&m.positions.length>=3){Um(m,l);continue}}continue}l.push(u.extents)}for(const u of(t==null?void 0:t.viewports)??[])l.push(u.paper);const d=Bm(l);return Ji(d.length>0?d:l)}function Bm(e){if(e.length<2)return e;const t=e.map(d=>({x:(d.minX+d.maxX)/2,y:(d.minY+d.maxY)/2,box:d})),r=t.map(d=>d.x).sort((d,u)=>d-u),a=t.map(d=>d.y).sort((d,u)=>d-u),n=r[Math.floor(r.length/2)],o=a[Math.floor(a.length/2)],i=e.map(d=>Math.max(d.maxX-d.minX,d.maxY-d.minY,1e-9));i.sort((d,u)=>d-u);const s=i[Math.floor(i.length/2)]||1,l=Math.max(s*50,1e10),c=t.filter(d=>Math.hypot(d.x-n,d.y-o)<=l);return c.length>0?c.map(d=>d.box):e}function fn(e,t){for(const r of e){if(r.layer!==t.layer||r.positions.length<3)continue;const a=mt();ye(a,r);const n=pt(a);if(n&&n.minX===t.extents.minX&&n.minY===t.extents.minY&&n.maxX===t.extents.maxX&&n.maxY===t.extents.maxY)return r}}function Im(e,t){const r=es(e);return ts(r,{isLayerVisible:t,viewports:e.viewports,sampleFromLayout:e})??ir(e)}const Hm=256;function Um(e,t){const r=e.positions,a=e.offset,n=Math.floor(r.length/3);if(n<=0)return;const o=Math.max(1,Math.ceil(n/Hm));for(let i=0;i<n;i+=o){const s=i*3,l=Ke(r[s],a[0]),c=Ke(r[s+1],a[1]);!Number.isFinite(l)||!Number.isFinite(c)||t.push({minX:l,minY:c,maxX:l,maxY:c})}}function Tm(e,t){const r=new Map,a=o=>{let i=r.get(o);return i||(i=mt(),r.set(o,i)),i};for(const o of e)ye(a(o.layer),o);for(const o of t)ye(a(o.layer),o);const n=new Map;for(const[o,i]of r)n.set(o,pt(i));return n}function rs(e,t,r){if(r)return;const a=Dm(e,t);if(!(a!=null&&a.newIterator))return;const n=[];for(const o of a.newIterator()){if(!(o instanceof $s)||As.isDefaultPaperSpaceViewport(o)||typeof o.toGiViewport!="function")continue;const i=o.toGiViewport(),s=i.box,l=i.viewBox,c=gn(s),d=gn(l);if(!c||!d)continue;const u=Number.isFinite(i.viewTwistAngle)?i.viewTwistAngle:o.viewTwistAngle,p=Rm(i,o),m={paper:c,model:d};Number.isFinite(u)&&Math.abs(u)>1e-12&&(m.twist=u),p.length>0&&(m.frozenLayers=p),n.push(m)}return n.length>0?n:void 0}function Rm(e,t){var r;const a=e.frozenLayers;if(a&&a.length>0)return[...a];const n=t.frozenLayerIds;if(!(n!=null&&n.length))return[];const o=(r=t.database)==null?void 0:r.tables.layerTable;if(!o)return[];const i=[];for(const s of n){const l=o.getIdAt(s);l&&i.push(l.name)}return i}function gn(e){if(typeof e.isEmpty=="function"&&e.isEmpty())return;const t=e.min.x,r=e.min.y,a=e.max.x,n=e.max.y;if(!(!Number.isFinite(t)||!Number.isFinite(r)||!Number.isFinite(a)||!Number.isFinite(n)||a-t<=0||n-r<=0))return{minX:t,minY:r,maxX:a,maxY:n}}function Dm(e,t){var r;const a=(r=e.tables)==null?void 0:r.blockTable;if(!a)return;const n=typeof a.getIdAt=="function"?a.getIdAt(t):void 0;if(n)return n;if(typeof a.newIterator=="function"){for(const i of a.newIterator())if(i.objectId===t)return i}const o=a.modelSpace;if((o==null?void 0:o.objectId)===t)return o}const wn=16/9;function as(e,t,r,a=wn){var n,o,i,s;const l=Number.isFinite(a)&&a>0?a:wn;if(r){const d=(i=(o=(n=e.tables)==null?void 0:n.viewportTable)==null?void 0:o.getActiveVportBox)==null?void 0:i.call(o,l);return bn(d)}const c=(s=e.objects)==null?void 0:s.layout;if(c!=null&&c.newIterator){for(const d of c.newIterator())if(d.blockTableRecordId===t)return bn(d.limits)}}function bn(e){if(!e||typeof e.isEmpty=="function"&&e.isEmpty())return;const t=e.min.x,r=e.min.y,a=e.max.x,n=e.max.y;if(!(!Number.isFinite(t)||!Number.isFinite(r)||!Number.isFinite(a)||!Number.isFinite(n)||a-t<=0||n-r<=0))return{minX:t,minY:r,maxX:a,maxY:n}}function Ua(e){var t;const r=(t=e.objects)==null?void 0:t.layout;if(!(r!=null&&r.newIterator))return[];const a=[];for(const n of r.newIterator()){const o=n.blockTableRecordId;o&&a.push({name:n.layoutName||o,tabOrder:n.tabOrder??0,blockTableRecordId:o})}return a.sort((n,o)=>n.tabOrder-o.tabOrder),a}function ns(e,t,r={}){return Om(e,t,r)}async function os(e,t,r={}){const a=r.yieldBetweenLayouts;a&&await a();const n=r.exportInvisibleLayers!==!1,o=r.exportLayouts!==!1,i=n?void 0:h=>Ta(t,h,n),s=da(e,{title:r.title,background:r.background}),l=is(t,n),c=Ua(e),d=new Map(c.map(h=>[h.blockTableRecordId,h.name])),u=cs(t,o),p=ls(t,c,o),m=[];for(const h of p)m.push(ds(e,t,h,d,r,i)),a&&await a();return{version:D,meta:ss(s,r,m,u),layers:l,layouts:m,activeLayoutBtrId:u}}function Om(e,t,r){const a=r.exportInvisibleLayers!==!1,n=r.exportLayouts!==!1,o=a?void 0:m=>Ta(t,m,a),i=da(e,{title:r.title,background:r.background}),s=is(t,a),l=Ua(e),c=new Map(l.map(m=>[m.blockTableRecordId,m.name])),d=cs(t,n),u=ls(t,l,n),p=[];for(const m of u)p.push(ds(e,t,m,c,r,o));return{version:D,meta:ss(i,r,p,d),layers:s,layouts:p,activeLayoutBtrId:d}}function is(e,t){const r=[];for(const a of e.layers)Ta(e,a.name,t)&&r.push({name:a.name,color:a.color,visible:a.visible});return r}function ss(e,t,r,a){const n=r.find(s=>s.btrId===a)??r[0],o=n?ir(n):null,i=t.initialView??"fit";return{title:e.title,createdAt:new Date().toISOString(),extents:e.extents,viewExtents:o??void 0,units:e.units,grip:e.grip,background:e.background,locale:t.locale??"en",initialView:i,viewState:i==="current"?t.viewState:void 0,viewerMode:t.viewerMode??"measure",exportLayouts:t.exportLayouts!==!1,docsBaseUrl:t.docsBaseUrl??Ba()}}function jm(e){return(e.viewerMode??"measure")==="measure"}function Ta(e,t,r){if(r)return!0;const a=e.layers.find(n=>n.name===t);return a?a.visible:!0}function ls(e,t,r){if(!r){const i=e.layouts.find(s=>s.btrId===e.modelSpaceBtrId);return i?[i]:[]}const a=new Map(e.layouts.map(i=>[i.btrId,i])),n=new Set,o=[];for(const i of t){if(n.has(i.blockTableRecordId))continue;n.add(i.blockTableRecordId);const s=a.get(i.blockTableRecordId);o.push(s??{btrId:i.blockTableRecordId,name:i.name,isModelSpace:i.blockTableRecordId===e.modelSpaceBtrId,layers:[]})}for(const i of e.layouts)n.has(i.btrId)||(n.add(i.btrId),o.push(i));return o}function cs(e,t){return t&&e.activeLayoutBtrId||e.modelSpaceBtrId}function ds(e,t,r,a,n,o){const i=[],s=[];for(const u of r.layers){if(o&&!o(u.name))continue;const p=So(u.root);i.push(...p.lineBatches),s.push(...p.meshBatches)}const l=r.isModelSpace||r.btrId===t.modelSpaceBtrId,c=as(e,r.btrId,l,n.canvasAspectRatio);let d;if(jm(n)){const u=performance.now();d=jo(e,r.btrId,{includeLayer:o}),console.log(`[chtml] osnap catalog ${a.get(r.btrId)??r.name??r.btrId}: ${(performance.now()-u).toFixed(0)} ms (${(d==null?void 0:d.primitives.length)??0} primitives)`)}return{btrId:r.btrId,name:a.get(r.btrId)??r.name??Nm(e,r.btrId),isModelSpace:l,lineBatches:i,meshBatches:s,osnap:d,viewports:rs(e,r.btrId,l),...c?{savedView:c}:{}}}function Nm(e,t){var r;const a=(r=e.tables)==null?void 0:r.blockTable;if(a!=null&&a.newIterator){for(const n of a.newIterator())if(n.objectId===t)return n.name}return t}const _m=400,sr=10,lr=1,Ra=64;function tt(e){return Math.floor(e)*1024*1024}function Da(e){return Math.max(lr,Math.round(e/(1024*1024)))}function Oa(e){return Number.isFinite(e)?Math.min(Ra,Math.max(lr,Math.floor(e))):sr}function ie(e={}){var t;const r=e.exportFormat==="multi"?"multi":"single",a=r==="multi"?tt(Oa(e.maxChunkBytes!=null?Da(e.maxChunkBytes):sr)):ya;return{exportFormat:r,exportInvisibleLayers:e.exportInvisibleLayers!==!1,exportLayouts:e.exportLayouts!==!1,initialView:e.initialView??"fit",viewerMode:e.viewerMode??"measure",expiryDays:r==="multi"?"never":e.expiryDays??"never",expiresAt:r==="multi"?null:e.expiresAt??null,password:r==="multi"?"":((t=e.password)==null?void 0:t.trim())??"",maxChunkBytes:a,compressChunks:r==="multi"?e.compressChunks!==!1:!0}}function us(e){const t=e.maxChunkBytes??tt(sr),r=e.compressChunks!==!1;return{maxChunkBytes:t,maxBatchBytes:t,maxOsnapChunkBytes:t,compressChunks:r}}function ms(e){const t=e.activeLayoutView,r=t.center,a=t.trCamera.zoom,n=Math.max(t.height,1),o=a*(2*_m)/n;return{centerX:r.x,centerY:r.y,zoom:o}}const ps="./viewer-runtime.iife.js";let rt={};function hs(e){rt={...rt,...e}}function fs(){return{...rt}}function gs(e){return e!=null?String(e):rt.viewerRuntimeUrl!=null?String(rt.viewerRuntimeUrl):ps}class ws{build(t,r,a={}){return ns(r,vn(t),yn(a))}async buildAsync(t,r,a={}){return os(r,vn(t),{...yn(a),yieldBetweenLayouts:()=>q()})}}function yn(e){return{title:e.title,background:e.background,locale:e.locale??C.currentLocale,exportInvisibleLayers:e.exportInvisibleLayers,exportLayouts:e.exportLayouts,initialView:e.initialView,viewState:e.viewState,viewerMode:e.viewerMode,canvasAspectRatio:e.canvasAspectRatio,docsBaseUrl:$m()}}function $m(){try{Wi(Ml())}catch{}return Ba()}function vn(e){const t=[...e.layers.values()].map(a=>({name:a.name,color:a.color.RGB??16777215,visible:!a.isOff&&!a.isFrozen})),r=[...e.layouts.entries()].map(([a,n])=>({btrId:a,isModelSpace:a===e.modelSpaceBtrId,layers:[...n.layers.values()].map(o=>({name:o.name,root:o.internalObject}))}));return{layers:t,layouts:r,activeLayoutBtrId:e.activeLayoutBtrId||e.modelSpaceBtrId,modelSpaceBtrId:e.modelSpaceBtrId}}function ue(e,t){console.log(`[chtml] ${e}: ${t.toFixed(0)} ms`)}class bs{constructor(t={}){this.options=t,this._snapshotBuilder=new ws}async prepareAcTrView2dForHtmlExport(t,r={}){if(!t||!("cadScene"in t)||!t.cadScene)throw new Error("CAD scene is not available. Open a drawing before exporting to HTML.");if(!(t instanceof Ll))throw new Error("HTML export requires a 2D CAD view. Open a drawing before exporting.");const a=ie(r),n={includeInvisibleLayers:a.exportInvisibleLayers,includeLayouts:a.exportLayouts};return await t.ensureEntitiesConvertedForExport(n),await q(),t}async convert(t,r={},a){const n=fe.instance,o=ie(r),i=performance.now();await n.withBusyIndicator(async()=>{await q();const s=n.curDocument;let l=performance.now();const c=await this.prepareAcTrView2dForHtmlExport(a??n.curView,o);ue("prepare (missing entities)",performance.now()-l);const d=t||s.fileName||s.docTitle,u=Al(d);l=performance.now();const p=await this._snapshotBuilder.buildAsync(c.cadScene,s.database,{title:u,background:c.backgroundColor,exportInvisibleLayers:o.exportInvisibleLayers,exportLayouts:o.exportLayouts,initialView:o.initialView,viewerMode:o.viewerMode,viewState:o.initialView==="current"&&(o.exportLayouts||c.activeLayoutBtrId===c.modelSpaceBtrId)?ms(c):void 0,canvasAspectRatio:c.width/Math.max(c.height,1)});ue("snapshot build",performance.now()-l),await q(),l=performance.now();const m=await this.loadViewerRuntime();if(ue("load viewer runtime",performance.now()-l),await q(),o.exportFormat==="multi"){l=performance.now();const w=us(o),b=await Di(p,{viewerRuntime:m,...w});ue(w.compressChunks?"package + gzip chunks":"package chunks",performance.now()-l),l=performance.now();const g=Ki(b);ue("zip package",performance.now()-l),await q(),this.downloadBytes(g,Va(d,"zip"),"application/zip"),ue("chtml total",performance.now()-i);return}const h=yi(o.expiryDays,Date.now(),o.expiresAt);l=performance.now();const f=await this.packSelfContainedHtml(p,m,{expiresAt:h,password:o.password||void 0});ue("pack self-contained html",performance.now()-l),await q(),this.downloadHtml(f,Va(d,"html")),ue("chtml total",performance.now()-i)})}async packSnapshot(t,r){await fe.instance.withBusyIndicator(async()=>{await q();const a=await this.loadViewerRuntime();await q();const n=await this.packSelfContainedHtml(t,a,{expiresAt:null});await q(),this.downloadHtml(n,r)})}async packSelfContainedHtml(t,r,a){if(_i(t))return $i(t,{title:t.meta.title,viewerRuntime:r,expiresAt:a.expiresAt,password:a.password});const n=await Li(oa(t),{expiresAt:a.expiresAt,password:a.password});return pi(t,{title:t.meta.title,viewerRuntime:r,encoded:n.encoded,accessManifest:n.manifest})}async loadViewerRuntime(){const t=gs(this.options.viewerRuntimeUrl),r=await fetch(t);if(!r.ok)throw new Error(`Failed to load HTML viewer runtime from "${t}" (${r.status}). Install @mlightcad/cad-html-plugin, copy viewer-runtime.iife.js to your app assets, and set viewerRuntimeUrl on registerLazyHtmlPlugin / createHtmlPlugin / AcApHtmlConvertor.`);return r.text()}downloadHtml(t,r){this.downloadBytes(new TextEncoder().encode(t),r,"text/html;charset=utf-8")}downloadBytes(t,r,a){const n=new Uint8Array(t.byteLength);n.set(t);const o=new Blob([n],{type:a}),i=URL.createObjectURL(o),s=document.createElement("a");s.href=i,s.download=r,document.body.appendChild(s),s.click(),document.body.removeChild(s),window.setTimeout(()=>URL.revokeObjectURL(i),6e4)}}class ys extends xl{constructor(t={}){super(),this.pluginOptions=t}async execute(t){const r=await this.promptOptions();r&&await new bs(this.pluginOptions).convert(t.doc.fileName||t.doc.docTitle,r,t.view)}async promptOptions(){const t=ie(),r=await this.promptExportFormat();if(r===void 0)return;const a=await this.promptYesNo("jig.chtml.exportInvisibleLayers",t.exportInvisibleLayers);if(a===void 0)return;const n=await this.promptYesNo("jig.chtml.exportLayouts",t.exportLayouts);if(n===void 0)return;const o=await this.promptInitialView();if(o===void 0)return;const i=await this.promptViewerMode();if(i===void 0)return;let s,l;if(!(r==="multi"&&(s=await this.promptChunkSizeMiB(),s===void 0||(l=await this.promptYesNo("jig.chtml.compressChunks",t.compressChunks),l===void 0))))return ie({exportFormat:r,exportInvisibleLayers:a,exportLayouts:n,initialView:o,viewerMode:i,...r==="multi"?{maxChunkBytes:s,compressChunks:l}:{}})}async promptExportFormat(){const t=ie(),r=new gt(C.t("jig.chtml.exportFormat"));r.allowNone=!0;const a=r.keywords.add(C.t("jig.chtml.keywords.single.display"),C.t("jig.chtml.keywords.single.global"),C.t("jig.chtml.keywords.single.local")),n=r.keywords.add(C.t("jig.chtml.keywords.multi.display"),C.t("jig.chtml.keywords.multi.global"),C.t("jig.chtml.keywords.multi.local"));r.keywords.default=t.exportFormat==="multi"?n:a;const o=await fe.instance.editor.getKeywords(r);if(o.status!==I.Cancel){if(o.status===I.None)return t.exportFormat;if(o.status===I.OK||o.status===I.Keyword)return o.stringResult?o.stringResult==="Multi"?"multi":"single":t.exportFormat}}async promptYesNo(t,r){const a=new gt(C.t(t));a.allowNone=!0;const n=a.keywords.add(C.t("jig.chtml.keywords.yes.display"),C.t("jig.chtml.keywords.yes.global"),C.t("jig.chtml.keywords.yes.local")),o=a.keywords.add(C.t("jig.chtml.keywords.no.display"),C.t("jig.chtml.keywords.no.global"),C.t("jig.chtml.keywords.no.local"));a.keywords.default=r?n:o;const i=await fe.instance.editor.getKeywords(a);if(i.status!==I.Cancel){if(i.status===I.None)return r;if(i.status===I.OK||i.status===I.Keyword)return i.stringResult?i.stringResult==="Yes":r}}async promptChunkSizeMiB(){const t=ie({exportFormat:"multi"}),r=Da(t.maxChunkBytes),a=new kl(C.t("jig.chtml.chunkSizeMiB"),lr,Ra);a.allowNone=!0,a.allowZero=!1,a.allowNegative=!1,a.useDefaultValue=!0,a.defaultValue=r;const n=await fe.instance.editor.getInteger(a);if(n.status!==I.Cancel){if(n.status===I.None)return tt(r);if(n.status===I.OK){const o=Oa(n.value??r);return tt(o)}}}async promptInitialView(){const t=ie(),r=new gt(C.t("jig.chtml.initialView"));r.allowNone=!0;const a=r.keywords.add(C.t("jig.chtml.keywords.extents.display"),C.t("jig.chtml.keywords.extents.global"),C.t("jig.chtml.keywords.extents.local")),n=r.keywords.add(C.t("jig.chtml.keywords.current.display"),C.t("jig.chtml.keywords.current.global"),C.t("jig.chtml.keywords.current.local"));r.keywords.default=t.initialView==="current"?n:a;const o=await fe.instance.editor.getKeywords(r);if(o.status!==I.Cancel){if(o.status===I.None)return t.initialView;if(o.status===I.OK||o.status===I.Keyword)return o.stringResult?o.stringResult==="Current"?"current":"fit":t.initialView}}async promptViewerMode(){const t=ie(),r=new gt(C.t("jig.chtml.viewerMode"));r.allowNone=!0;const a=r.keywords.add(C.t("jig.chtml.keywords.view.display"),C.t("jig.chtml.keywords.view.global"),C.t("jig.chtml.keywords.view.local")),n=r.keywords.add(C.t("jig.chtml.keywords.measure.display"),C.t("jig.chtml.keywords.measure.global"),C.t("jig.chtml.keywords.measure.local"));r.keywords.default=t.viewerMode==="view"?a:n;const o=await fe.instance.editor.getKeywords(r);if(o.status!==I.Cancel){if(o.status===I.None)return t.viewerMode;if(o.status===I.OK||o.status===I.Keyword)return o.stringResult?o.stringResult==="View"?"view":"measure":t.viewerMode}}}const Vm="1.7.7-preview.1",Xm={version:Vm};class Ym{constructor(t={}){this.options=t,this.name="HtmlPlugin",this.version=Xm.version,this.description="HTML export (-chtml) command",this.registeredCommands=[]}onLoad(t,r){const a=Cl.SYSTEMT_COMMAND_GROUP_NAME,n=new ys(this.options);r.addCommand(a,"-chtml","-chtml",n),this.registeredCommands.push({group:a,name:"-chtml"}),r.lookupGlobalCmd("chtml")||(r.addCommand(a,"chtml","chtml",n),this.registeredCommands.push({group:a,name:"chtml"}))}onUnload(t,r){for(const a of this.registeredCommands)r.removeCmd(a.group,a.name);this.registeredCommands=[]}}async function Zm(e={}){return e.viewerRuntimeUrl!=null&&hs(e),new Ym(fs())}const Gm="viewer-runtime.iife.js",Km=Object.freeze(Object.defineProperty({__proto__:null,ACEC_CHUNK_MAGIC:fa,ACEO_OSNAP_MAGIC:Yt,ACEO_OSNAP_VERSION:aa,ACEX_DEFAULT_CHUNK_MAX_BYTES:ya,ACEX_DEFAULT_CHUNK_SIZE_MIB:sr,ACEX_DEFAULT_DOCS_BASE_URL:Pa,ACEX_DEFAULT_MANIFEST_FILE:ae,ACEX_DEFAULT_MANIFEST_HREF:xa,ACEX_DEFAULT_OSNAP_CHUNK_MAX_BYTES:Fd,ACEX_DEFAULT_OSNAP_MODES:Xc,ACEX_DEFAULT_POLAR_ANGLE:Nu,ACEX_DOCS_PATH_MAGNIFIER:Sm,ACEX_EMBEDDED_CHUNK_ENCRYPTED_MIME:ji,ACEX_EMBEDDED_CHUNK_ENCRYPTED_MIME_BASE64:wm,ACEX_EMBEDDED_CHUNK_HREF_ATTR:le,ACEX_EMBEDDED_CHUNK_MAX_BYTES:Dr,ACEX_EMBEDDED_CHUNK_MIME:Oi,ACEX_EMBEDDED_CHUNK_MIME_BASE64:gm,ACEX_EMBEDDED_CHUNK_THRESHOLD_BYTES:Yo,ACEX_EMBEDDED_OSNAP_CHUNK_MAX_BYTES:Zo,ACEX_GEOMETRY_CHUNK_FETCH_CONCURRENCY:qt,ACEX_HTML_EXPIRY_COUNTDOWN_MS:bi,ACEX_HTML_LOCALES:ge,ACEX_HTML_LOCALE_BADGES:pa,ACEX_HTML_LOCALE_STORAGE_KEY:ha,ACEX_HTML_SHELL_CSS:tr,ACEX_MANIFEST_QUERY_KEYS:Qo,ACEX_MAX_BINARY_ARRAY_BYTES:Er,ACEX_MAX_BINARY_STRING_BYTES:jn,ACEX_MAX_CHUNK_SIZE_MIB:Ra,ACEX_MAX_COMPRESSED_BYTES:xt,ACEX_MAX_DECOMPRESSED_BYTES:Nn,ACEX_MAX_GEOMETRY_BATCH_BYTES:lt,ACEX_MIN_CHUNK_SIZE_MIB:lr,ACEX_ORTHO_POLAR_ANGLE:di,ACEX_PACKAGE_DIRECTORY_ORIGIN:qe,ACEX_PACKAGE_VERSION:ba,ACEX_POLAR_ANGLE_INCREMENTS:ci,ACEX_SNAPSHOT_COMPRESSION:vt,ACEX_SNAPSHOT_VERSION:D,AcApExportHtmlCmd:ys,AcApHtmlConvertor:bs,AcApHtmlSnapshotBuilder:ws,AcExBinaryReader:_t,AcExBinaryWriter:Nt,AcExCameraZoomUniform:la,AcExHtmlI18n:zd,AcExHtmlIcons:Pe,DEFAULT_HTML_VIEWER_RUNTIME_URL:ps,F_LINE_DISTANCES:Ct,F_LINE_EXCLUDE_OSNAP:Jr,F_LINE_INDICES:Lt,F_LINE_PATTERN:At,F_LINE_RENDER_ORDER:Et,F_LINE_WIDTH:Mt,F_MESH_GRADIENT_FILL:Pt,F_MESH_GRADIENT_POS:Ft,F_MESH_HATCH:zt,F_MESH_INDICES:St,F_MESH_POINTS:qr,F_MESH_RENDER_ORDER:It,F_MESH_SIDE:Bt,F_MESH_TEXTURE:Ht,HTML_PLUGIN_NAME:En,HTML_PLUGIN_TRIGGERS:Sn,HTML_VIEWER_RUNTIME_FILE:Gm,ML_UI_COMPACT_MAX_WIDTH:mi,ML_UI_MOBILE_MAX_WIDTH:ui,acExHtmlBase64ToBytes:ki,acExHtmlBase85ToBytes:$n,acExHtmlBytesToBase64:xi,acExHtmlBytesToBase85:_n,acExHtmlBytesToText:Be,acExHtmlTextToBytes:ot,acexChunkSizeBytesToMiB:Da,acexChunkSizeMiBToBytes:tt,acexDocsUrl:zm,acexDropdownItem:ju,acexGetDocsBaseUrl:Ba,acexGlobalFetch:dt,acexSetDocsBaseUrl:Wi,acexToolbarButton:Or,arcToAcGe:zo,arcWcsPoint:Hr,bakePlainDrawableSlice:Gt,buildAcExHtmlAccessManifest:Qe,buildAcExHtmlLocaleStrip:Vu,buildAcExHtmlPolarAnglesPanel:La,buildAcExHtmlShellBody:rr,buildAcExHtmlSnapStrip:Xu,buildAcExPackage:hm,buildAcExPackageAsync:Di,buildAcExPackageData:Ri,buildAcExPackageDataAsync:Sa,buildOsnapCatalog:jo,buildPackageDirectoryFileMap:jd,buildSnapshotFromExportScene:ns,buildSnapshotFromExportSceneAsync:os,buildViewerMetadata:da,canOpenLocalPackageFolder:Ud,captureAcApHtmlViewState:ms,captureAcExSavedViewExtents:as,chooseInitialManifestHref:Rd,circleOrArcToAcGe:Fo,clampAcApHtmlChunkSizeMiB:Oa,collectAcExEmbeddedChunkBytes:xm,collectBatchesFromObject3D:So,collectLayoutBatchExtentEntries:es,collectLayoutViewports:rs,compactIndexedSlice:ia,compressSnapshotBinary:Ee,compressSnapshotBinaryAsync:Gr,computeIntelligentExtentsFromBatchEntries:ts,computeIntelligentLayoutExtents:Im,computeLayerExtentsMap:Tm,computeLayoutExtents:Qi,computeLayoutViewExtents:ir,computeLineDistancesForSegments:Wt,computeViewportPaperExtents:Ha,computeVisibleLayoutExtents:Pm,configureHtmlPlugin:hs,consumeAcExEmbeddedChunkFromDom:Vi,copyFloat32Range:re,copyUint32Range:lo,createAcExDomEmbeddedPackageFetch:Lm,createAcExEmbeddedPackageFetch:Xi,createAcExHtmlAccessKey:ar,createAcExOrderedBytePrefetcher:Qt,createEmptyExtents:mt,createHtmlPlugin:Zm,createPackageDirectoryFetch:Nd,createTextureFromExportedBytes:ho,createViewerLineMaterial:Lc,createViewerMeshMaterial:Cc,createViewerPointsMaterial:Ac,decodeChunkBinary:ga,decodeChunkGzip:Xo,decodeChunkPayload:wa,decodeOsnapCatalogBinary:Zt,decodeOsnapCatalogGzip:eo,decodeOsnapCatalogPayload:to,decodeSnapshot:fc,decodeSnapshotBinary:no,decodeSnapshotFromCompressedBytes:oo,decompressSnapshotBinary:$t,decryptAcExEmbeddedManifest:Am,decryptAcExHtmlBytes:or,decryptAcExHtmlSnapshotPayload:rm,detectAcExHtmlLocale:_o,detectBrowserAcExHtmlLocale:No,detectLocalFolderOpenSupport:Td,detectSharedDirectoryRoot:ai,ellipseArcDelta:Po,ellipsePointAtNormalized:Yc,ellipseToAcGe:Bo,encodeChunkBinary:st,encodeChunkGzip:Vo,encodeOsnapCatalogBinary:Ie,encodeOsnapCatalogGzip:Qn,encodeSnapshot:oa,encodeSnapshotBinary:ao,encodeTextureForExport:mo,encryptAcExHtmlBytes:nr,encryptAcExHtmlSnapshotPayload:vi,estimateAcExSnapshotGeometryBytes:Ni,estimateLineBatchBytes:Vt,estimateMeshBatchBytes:Xt,estimateOsnapPrimitiveBytes:na,expandExtentsFromBatch:ye,expandExtentsFromPositions:qi,exportActiveBatchedLine2Slice:Co,exportActiveBatchedSlice:Jt,exportBufferGeometrySlice:We,exportLineDistanceSlice:kc,exportPlainDrawableSlice:uo,exportUvsForPositionSlice:po,exportVertexAttributeSlice:yo,extractGradientFill:bo,extractHatchPattern:wo,extractLinePattern:go,findDefaultManifestInDirectory:_d,formatAcExHtmlCountdown:em,formatAcExHtmlExpiresAt:Qu,formatAcExHtmlMessage:$o,getHtmlPluginOptions:fs,isAbsoluteHttpUrl:ti,isAcExHtmlAccessExpired:Ju,isAcExHtmlExpiryCountdownActive:qu,isAcExHtmlLocale:Sd,isGzipPayload:Kr,isSafePackageHref:Go,isTransparentImagePlaceholder:sa,listDatabaseLayouts:Ua,loadAcExPackage:Id,loadAcExPackageLayout:Hd,loadAcExPackageLayoutOsnap:Jo,needsAcExHtmlAccessControl:Ma,normalizeAcExDocsBaseUrl:Ia,normalizeArcDelta:ua,normalizePackageDirectoryPath:ri,omitNonFinitePrimitives:we,packHtml:pi,packHtmlEmbeddedPackage:$i,packHtmlPackage:Ca,parseAcExEmbeddedPackageConfig:vm,parseAcExHtmlAccessManifest:tm,parseAcExHtmlBinaryEncoding:Wr,parseAcExPackageManifest:ct,primitiveToAcGeCurve:Zc,probePackageManifest:Od,protectAcExHtmlEncodedSnapshot:Li,readAcExEmbeddedChunkFromDom:km,readBatchWorldOffset:co,readLineBatch:ea,readManifestUrlFromSearchParams:ei,readMeshBatch:ra,rebaseHatchPatternToLocalOffset:vo,rebasePlainDrawableSliceAroundCentroid:Kt,releaseExportedTextureBytes:fo,resolveAcApHtmlExpiresAt:yi,resolveAcApHtmlExportOptions:ie,resolveAcApHtmlPackageBuildOptions:us,resolveAcExHtmlLocale:He,resolveChunkUrl:er,resolveLayoutViewExtents:Fm,resolvePackageManifestUrl:Wo,resolveViewerManifestUrl:Dd,resolveViewerRuntimeUrl:gs,setAcExSnapshotCompressor:ql,shouldEmbedAcExChunks:_i,snapshotMimeType:so,snapshotPayloadToCompressedBytes:io,snapshotSkeletonFromManifest:Ko,splineToAcGe:Io,splitDominantCluster:Nr,splitLayoutIntoSlices:Hi,splitLineBatch:Mi,splitMeshBatch:Ei,splitOsnapPrimitives:qn,toExtents:pt,toWcsCoord:Ke,transformHatchPatternToWorldSpace:zr,unionDominantCluster:Ji,unionExtents:et,unzipAcExPackageFiles:Em,wcsPointToOcsArcAngle:Ur,writeLineBatch:Qr,writeMeshBatch:ta,zipAcExPackageFiles:Ki},Symbol.toStringTag,{value:"Module"}));export{Oa as H,Ra as S,Km as c,tt as g,lr as k,ep as s,sr as x};
