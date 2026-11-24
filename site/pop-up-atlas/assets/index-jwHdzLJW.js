(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();function Vl(r){let e=r>>>0;return()=>(e=Math.imul(e,1664525)+1013904223>>>0)/4294967296}const Ys=new WeakMap;function zu(r){if(Ys.has(r))return Ys.get(r);const e=r.createBuffer(1,r.sampleRate,r.sampleRate),t=e.getChannelData(0),n=Vl(843191);let i=0;for(let s=0;s<t.length;s++)i=.63*i+.37*(n()*2-1),t[s]=i*1.6+(n()*2-1)*.2;return Ys.set(r,e),e}function cc(r,e,t,n){const i=Vl(t.seed),s=t.type==="fold",a=t.strength,o=s?(.18+i()*.12)*(.89+a*.2):.05+i()*.022,l=r.createBufferSource(),c=r.createBiquadFilter(),u=r.createGain(),h=r.createStereoPanner();l.buffer=zu(r),l.loop=!0,l.playbackRate.value=(.75+i()*.59)*t.pitch;const f=(s?1050+i()*1100:520+i()*220)*t.pitch;c.type="bandpass",c.Q.value=s?.8:.55,c.frequency.setValueAtTime(f,n),c.frequency.exponentialRampToValueAtTime(f*(t.open?1.55:.54),n+o*.8),h.pan.value=Math.max(-.7,Math.min(.7,t.pan||0));const p=s?(.27+i()*.1)*(.31+.83*a):.063+.049*a;if(u.gain.setValueAtTime(5e-5,n),u.gain.exponentialRampToValueAtTime(p,n+o*.21),u.gain.exponentialRampToValueAtTime(p*.28,n+o*.42),u.gain.exponentialRampToValueAtTime(p*.64,n+o*.56),u.gain.exponentialRampToValueAtTime(5e-5,n+o),l.connect(c).connect(u).connect(h).connect(e),l.start(n,i()*.6),l.stop(n+o+.01),s){const g=r.createBufferSource(),_=r.createBiquadFilter(),m=r.createGain(),d=n+o*(t.open?.6+i()*.12:.38+i()*.12),b=.021+i()*.028;g.buffer=l.buffer,g.playbackRate.value=(.86+i()*.45)*t.pitch,_.type="bandpass",_.Q.value=.72,_.frequency.setValueAtTime((t.open?3450:2540)*t.pitch,d),_.frequency.exponentialRampToValueAtTime(1250*t.pitch,d+b),m.gain.setValueAtTime(5e-5,d),m.gain.exponentialRampToValueAtTime(p*(.15+i()*.09),d+.003),m.gain.exponentialRampToValueAtTime(5e-5,d+b),g.connect(_).connect(m).connect(h),g.start(d,i()*.65),g.stop(d+b+.003),g.onended=()=>{g.disconnect(),_.disconnect(),m.disconnect()}}l.onended=()=>{l.disconnect(),c.disconnect(),u.disconnect(),h.disconnect()}}function ku(){let r,e,t=!1,n=745872,i=null,s=[];function a(){r||(r=new AudioContext,e=r.createGain(),e.gain.value=t?0:.82,e.connect(r.destination)),r.state==="suspended"&&r.resume().catch(()=>{})}function o(l,c){const u=typeof c=="object"&&c?c:{},h={type:l,seed:++n*93661,open:u.open??u.opening??c!==!1,pan:u.pan??0,strength:Math.max(0,Math.min(1,u.strength??u.speed??.8)),pitch:Math.max(.64,Math.min(1.5,u.pitch??1))};!t&&i!==null&&s.push({...h,time:i}),r&&!t&&r.state==="running"&&cc(r,e,h,r.currentTime+.006)}return{unlock:a,fold:l=>o("fold",l),step:l=>o("step",l),mute(l){t=l,r&&e.gain.setTargetAtTime(l?0:.82,r.currentTime,.015)},beginCapture(){s=[],i=0},setTime(l){i=l},async renderRecording(l){i=null;const c=new OfflineAudioContext(2,Math.round(l*48e3),48e3),u=c.createGain();u.gain.value=.82,u.connect(c.destination);for(const _ of s)_.time<l&&cc(c,u,_,_.time);const h=await c.startRendering(),f=new Int16Array(h.length*2);for(let _=0;_<2;_++){const m=h.getChannelData(_);for(let d=0;d<m.length;d++)f[d*2+_]=Math.round(Math.max(-1,Math.min(1,m[d]))*32767)}const p=new Uint8Array(f.buffer),g=[];for(let _=0;_<p.length;_+=16384)g.push(String.fromCharCode(...p.subarray(_,_+16384)));return{pcm:btoa(g.join("")),foldCount:s.filter(_=>_.type==="fold").length,stepCount:s.filter(_=>_.type==="step").length}}}}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Fo="180",Hu=0,lc=1,Vu=2,Oo=1,Gu=2,Fn=3,Vn=0,qt=1,$t=2,ri=0,Yi=1,Na=2,uc=3,hc=4,Wu=5,Mi=100,Xu=101,qu=102,Yu=103,Ku=104,ju=200,Zu=201,$u=202,Ju=203,Fa=204,Oa=205,Qu=206,eh=207,th=208,nh=209,ih=210,rh=211,sh=212,ah=213,oh=214,Ba=0,za=1,ka=2,Zi=3,Ha=4,Va=5,Ga=6,Wa=7,Gl=0,ch=1,lh=2,si=0,uh=1,hh=2,fh=3,Wl=4,dh=5,ph=6,mh=7,fc="attached",gh="detached",Xl=300,$i=301,Ji=302,Xa=303,qa=304,Ns=306,Gn=1e3,ii=1001,Ps=1002,kt=1003,ql=1004,Sr=1005,Xt=1006,Es=1007,On=1008,mn=1009,Yl=1010,Kl=1011,Rr=1012,Bo=1013,oi=1014,fn=1015,sr=1016,zo=1017,ko=1018,Cr=1020,jl=35902,Zl=35899,$l=1021,Jl=1022,nn=1023,Pr=1026,Lr=1027,Ho=1028,Vo=1029,Ql=1030,Go=1031,Wo=1033,Ts=33776,bs=33777,As=33778,ws=33779,Ya=35840,Ka=35841,ja=35842,Za=35843,$a=36196,Ja=37492,Qa=37496,eo=37808,to=37809,no=37810,io=37811,ro=37812,so=37813,ao=37814,oo=37815,co=37816,lo=37817,uo=37818,ho=37819,fo=37820,po=37821,mo=36492,go=36494,_o=36495,xo=36283,vo=36284,Mo=36285,yo=36286,Ir=2300,Dr=2301,Ks=2302,dc=2400,pc=2401,mc=2402,_h=2500,xh=0,eu=1,So=2,vh=3200,Mh=3201,tu=0,yh=1,ni="",Et="srgb",Vt="srgb-linear",Ls="linear",ht="srgb",wi=7680,gc=519,Sh=512,Eh=513,Th=514,nu=515,bh=516,Ah=517,wh=518,Rh=519,Eo=35044,Ch=35048,_c="300 es",yn=2e3,Is=2001;class ar{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let s=0,a=i.length;s<a;s++)i[s].call(this,e);e.target=null}}}const Dt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let xc=1234567;const br=Math.PI/180,Qi=180/Math.PI;function pn(){const r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Dt[r&255]+Dt[r>>8&255]+Dt[r>>16&255]+Dt[r>>24&255]+"-"+Dt[e&255]+Dt[e>>8&255]+"-"+Dt[e>>16&15|64]+Dt[e>>24&255]+"-"+Dt[t&63|128]+Dt[t>>8&255]+"-"+Dt[t>>16&255]+Dt[t>>24&255]+Dt[n&255]+Dt[n>>8&255]+Dt[n>>16&255]+Dt[n>>24&255]).toLowerCase()}function $e(r,e,t){return Math.max(e,Math.min(t,r))}function Xo(r,e){return(r%e+e)%e}function Ph(r,e,t,n,i){return n+(r-e)*(i-n)/(t-e)}function Lh(r,e,t){return r!==e?(t-r)/(e-r):0}function Ar(r,e,t){return(1-t)*r+t*e}function Ih(r,e,t,n){return Ar(r,e,1-Math.exp(-t*n))}function Dh(r,e=1){return e-Math.abs(Xo(r,e*2)-e)}function Uh(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*(3-2*r))}function Nh(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*r*(r*(r*6-15)+10))}function Fh(r,e){return r+Math.floor(Math.random()*(e-r+1))}function Oh(r,e){return r+Math.random()*(e-r)}function Bh(r){return r*(.5-Math.random())}function zh(r){r!==void 0&&(xc=r);let e=xc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function kh(r){return r*br}function Hh(r){return r*Qi}function Vh(r){return(r&r-1)===0&&r!==0}function Gh(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function Wh(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function Xh(r,e,t,n,i){const s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+n)/2),u=a((e+n)/2),h=s((e-n)/2),f=a((e-n)/2),p=s((n-e)/2),g=a((n-e)/2);switch(i){case"XYX":r.set(o*u,l*h,l*f,o*c);break;case"YZY":r.set(l*f,o*u,l*h,o*c);break;case"ZXZ":r.set(l*h,l*f,o*u,o*c);break;case"XZX":r.set(o*u,l*g,l*p,o*c);break;case"YXY":r.set(l*p,o*u,l*g,o*c);break;case"ZYZ":r.set(l*g,l*p,o*u,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function un(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function ot(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}const It={DEG2RAD:br,RAD2DEG:Qi,generateUUID:pn,clamp:$e,euclideanModulo:Xo,mapLinear:Ph,inverseLerp:Lh,lerp:Ar,damp:Ih,pingpong:Dh,smoothstep:Uh,smootherstep:Nh,randInt:Fh,randFloat:Oh,randFloatSpread:Bh,seededRandom:zh,degToRad:kh,radToDeg:Hh,isPowerOfTwo:Vh,ceilPowerOfTwo:Gh,floorPowerOfTwo:Wh,setQuaternionFromProperEuler:Xh,normalize:ot,denormalize:un};class Be{constructor(e=0,t=0){Be.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar($e(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos($e(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*i+e.x,this.y=s*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class li{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,a,o){let l=n[i+0],c=n[i+1],u=n[i+2],h=n[i+3];const f=s[a+0],p=s[a+1],g=s[a+2],_=s[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h;return}if(o===1){e[t+0]=f,e[t+1]=p,e[t+2]=g,e[t+3]=_;return}if(h!==_||l!==f||c!==p||u!==g){let m=1-o;const d=l*f+c*p+u*g+h*_,b=d>=0?1:-1,M=1-d*d;if(M>Number.EPSILON){const R=Math.sqrt(M),P=Math.atan2(R,d*b);m=Math.sin(m*P)/R,o=Math.sin(o*P)/R}const v=o*b;if(l=l*m+f*v,c=c*m+p*v,u=u*m+g*v,h=h*m+_*v,m===1-o){const R=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=R,c*=R,u*=R,h*=R}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,i,s,a){const o=n[i],l=n[i+1],c=n[i+2],u=n[i+3],h=s[a],f=s[a+1],p=s[a+2],g=s[a+3];return e[t]=o*g+u*h+l*p-c*f,e[t+1]=l*g+u*f+c*h-o*p,e[t+2]=c*g+u*p+o*f-l*h,e[t+3]=u*g-o*h-l*f-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(i/2),h=o(s/2),f=l(n/2),p=l(i/2),g=l(s/2);switch(a){case"XYZ":this._x=f*u*h+c*p*g,this._y=c*p*h-f*u*g,this._z=c*u*g+f*p*h,this._w=c*u*h-f*p*g;break;case"YXZ":this._x=f*u*h+c*p*g,this._y=c*p*h-f*u*g,this._z=c*u*g-f*p*h,this._w=c*u*h+f*p*g;break;case"ZXY":this._x=f*u*h-c*p*g,this._y=c*p*h+f*u*g,this._z=c*u*g+f*p*h,this._w=c*u*h-f*p*g;break;case"ZYX":this._x=f*u*h-c*p*g,this._y=c*p*h+f*u*g,this._z=c*u*g-f*p*h,this._w=c*u*h+f*p*g;break;case"YZX":this._x=f*u*h+c*p*g,this._y=c*p*h+f*u*g,this._z=c*u*g-f*p*h,this._w=c*u*h-f*p*g;break;case"XZY":this._x=f*u*h-c*p*g,this._y=c*p*h-f*u*g,this._z=c*u*g+f*p*h,this._w=c*u*h+f*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],h=t[10],f=n+o+h;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(u-l)*p,this._y=(s-c)*p,this._z=(a-i)*p}else if(n>o&&n>h){const p=2*Math.sqrt(1+n-o-h);this._w=(u-l)/p,this._x=.25*p,this._y=(i+a)/p,this._z=(s+c)/p}else if(o>h){const p=2*Math.sqrt(1+o-n-h);this._w=(s-c)/p,this._x=(i+a)/p,this._y=.25*p,this._z=(l+u)/p}else{const p=2*Math.sqrt(1+h-n-o);this._w=(a-i)/p,this._x=(s+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs($e(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+a*o+i*c-s*l,this._y=i*u+a*l+s*o-n*c,this._z=s*u+a*c+n*l-i*o,this._w=a*u-n*o-i*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,s=this._z,a=this._w;let o=a*e._w+n*e._x+i*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=i,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const p=1-t;return this._w=p*a+t*this._w,this._x=p*n+t*this._x,this._y=p*i+t*this._y,this._z=p*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,o),h=Math.sin((1-t)*u)/c,f=Math.sin(t*u)/c;return this._w=a*h+this._w*f,this._x=n*h+this._x*f,this._y=i*h+this._y*f,this._z=s*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class U{constructor(e=0,t=0,n=0){U.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(vc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(vc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*i-o*n),u=2*(o*t-s*i),h=2*(s*n-a*t);return this.x=t+l*c+a*h-o*u,this.y=n+l*u+o*c-s*h,this.z=i+l*h+s*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar($e(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-s*o,this.y=s*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return js.copy(this).projectOnVector(e),this.sub(js)}reflect(e){return this.sub(js.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos($e(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const js=new U,vc=new li;class qe{constructor(e,t,n,i,s,a,o,l,c){qe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,o,l,c)}set(e,t,n,i,s,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=i,u[2]=o,u[3]=t,u[4]=s,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],h=n[7],f=n[2],p=n[5],g=n[8],_=i[0],m=i[3],d=i[6],b=i[1],M=i[4],v=i[7],R=i[2],P=i[5],L=i[8];return s[0]=a*_+o*b+l*R,s[3]=a*m+o*M+l*P,s[6]=a*d+o*v+l*L,s[1]=c*_+u*b+h*R,s[4]=c*m+u*M+h*P,s[7]=c*d+u*v+h*L,s[2]=f*_+p*b+g*R,s[5]=f*m+p*M+g*P,s[8]=f*d+p*v+g*L,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-n*s*u+n*o*l+i*s*c-i*a*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=u*a-o*c,f=o*l-u*s,p=c*s-a*l,g=t*h+n*f+i*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=h*_,e[1]=(i*c-u*n)*_,e[2]=(o*n-i*a)*_,e[3]=f*_,e[4]=(u*t-i*l)*_,e[5]=(i*s-o*t)*_,e[6]=p*_,e[7]=(n*l-c*t)*_,e[8]=(a*t-n*s)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Zs.makeScale(e,t)),this}rotate(e){return this.premultiply(Zs.makeRotation(-e)),this}translate(e,t){return this.premultiply(Zs.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Zs=new qe;function iu(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function Ur(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function qh(){const r=Ur("canvas");return r.style.display="block",r}const Mc={};function Nr(r){r in Mc||(Mc[r]=!0,console.warn(r))}function Yh(r,e,t){return new Promise(function(n,i){function s(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:i();break;case r.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}const yc=new qe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Sc=new qe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Kh(){const r={enabled:!0,workingColorSpace:Vt,spaces:{},convert:function(i,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===ht&&(i.r=zn(i.r),i.g=zn(i.g),i.b=zn(i.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[s].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ht&&(i.r=Ki(i.r),i.g=Ki(i.g),i.b=Ki(i.b))),i},workingToColorSpace:function(i,s){return this.convert(i,this.workingColorSpace,s)},colorSpaceToWorking:function(i,s){return this.convert(i,s,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===ni?Ls:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,s=this.workingColorSpace){return i.fromArray(this.spaces[s].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,s,a){return i.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,s){return Nr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(i,s)},toWorkingColorSpace:function(i,s){return Nr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(i,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return r.define({[Vt]:{primaries:e,whitePoint:n,transfer:Ls,toXYZ:yc,fromXYZ:Sc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Et},outputColorSpaceConfig:{drawingBufferColorSpace:Et}},[Et]:{primaries:e,whitePoint:n,transfer:ht,toXYZ:yc,fromXYZ:Sc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Et}}}),r}const tt=Kh();function zn(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Ki(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let Ri;class jh{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ri===void 0&&(Ri=Ur("canvas")),Ri.width=e.width,Ri.height=e.height;const i=Ri.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Ri}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ur("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let a=0;a<s.length;a++)s[a]=zn(s[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(zn(t[n]/255)*255):t[n]=zn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Zh=0;class qo{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Zh++}),this.uuid=pn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?s.push($s(i[a].image)):s.push($s(i[a]))}else s=$s(i);n.url=s}return t||(e.images[this.uuid]=n),n}}function $s(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?jh.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let $h=0;const Js=new U;class wt extends ar{constructor(e=wt.DEFAULT_IMAGE,t=wt.DEFAULT_MAPPING,n=ii,i=ii,s=Xt,a=On,o=nn,l=mn,c=wt.DEFAULT_ANISOTROPY,u=ni){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:$h++}),this.uuid=pn(),this.name="",this.source=new qo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Be(0,0),this.repeat=new Be(1,1),this.center=new Be(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new qe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Js).x}get height(){return this.source.getSize(Js).y}get depth(){return this.source.getSize(Js).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Xl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Gn:e.x=e.x-Math.floor(e.x);break;case ii:e.x=e.x<0?0:1;break;case Ps:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Gn:e.y=e.y-Math.floor(e.y);break;case ii:e.y=e.y<0?0:1;break;case Ps:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}wt.DEFAULT_IMAGE=null;wt.DEFAULT_MAPPING=Xl;wt.DEFAULT_ANISOTROPY=1;class st{constructor(e=0,t=0,n=0,i=1){st.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s;const l=e.elements,c=l[0],u=l[4],h=l[8],f=l[1],p=l[5],g=l[9],_=l[2],m=l[6],d=l[10];if(Math.abs(u-f)<.01&&Math.abs(h-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+f)<.1&&Math.abs(h+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const M=(c+1)/2,v=(p+1)/2,R=(d+1)/2,P=(u+f)/4,L=(h+_)/4,F=(g+m)/4;return M>v&&M>R?M<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(M),i=P/n,s=L/n):v>R?v<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(v),n=P/i,s=F/i):R<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(R),n=L/s,i=F/s),this.set(n,i,s,t),this}let b=Math.sqrt((m-g)*(m-g)+(h-_)*(h-_)+(f-u)*(f-u));return Math.abs(b)<.001&&(b=1),this.x=(m-g)/b,this.y=(h-_)/b,this.z=(f-u)/b,this.w=Math.acos((c+p+d-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this.w=$e(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this.w=$e(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar($e(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Jh extends ar{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Xt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new st(0,0,e,t),this.scissorTest=!1,this.viewport=new st(0,0,e,t);const i={width:e,height:t,depth:n.depth},s=new wt(i);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:Xt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isArrayTexture=this.textures[i].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new qo(i)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ci extends Jh{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class ru extends wt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=kt,this.minFilter=kt,this.wrapR=ii,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Qh extends wt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=kt,this.minFilter=kt,this.wrapR=ii,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Xn{constructor(e=new U(1/0,1/0,1/0),t=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(sn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(sn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=sn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,sn):sn.fromBufferAttribute(s,a),sn.applyMatrix4(e.matrixWorld),this.expandByPoint(sn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),qr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),qr.copy(n.boundingBox)),qr.applyMatrix4(e.matrixWorld),this.union(qr)}const i=e.children;for(let s=0,a=i.length;s<a;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,sn),sn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(fr),Yr.subVectors(this.max,fr),Ci.subVectors(e.a,fr),Pi.subVectors(e.b,fr),Li.subVectors(e.c,fr),Kn.subVectors(Pi,Ci),jn.subVectors(Li,Pi),hi.subVectors(Ci,Li);let t=[0,-Kn.z,Kn.y,0,-jn.z,jn.y,0,-hi.z,hi.y,Kn.z,0,-Kn.x,jn.z,0,-jn.x,hi.z,0,-hi.x,-Kn.y,Kn.x,0,-jn.y,jn.x,0,-hi.y,hi.x,0];return!Qs(t,Ci,Pi,Li,Yr)||(t=[1,0,0,0,1,0,0,0,1],!Qs(t,Ci,Pi,Li,Yr))?!1:(Kr.crossVectors(Kn,jn),t=[Kr.x,Kr.y,Kr.z],Qs(t,Ci,Pi,Li,Yr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,sn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(sn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Pn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Pn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Pn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Pn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Pn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Pn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Pn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Pn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Pn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Pn=[new U,new U,new U,new U,new U,new U,new U,new U],sn=new U,qr=new Xn,Ci=new U,Pi=new U,Li=new U,Kn=new U,jn=new U,hi=new U,fr=new U,Yr=new U,Kr=new U,fi=new U;function Qs(r,e,t,n,i){for(let s=0,a=r.length-3;s<=a;s+=3){fi.fromArray(r,s);const o=i.x*Math.abs(fi.x)+i.y*Math.abs(fi.y)+i.z*Math.abs(fi.z),l=e.dot(fi),c=t.dot(fi),u=n.dot(fi);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const ef=new Xn,dr=new U,ea=new U;class An{constructor(e=new U,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):ef.setFromPoints(e).getCenter(n);let i=0;for(let s=0,a=e.length;s<a;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;dr.subVectors(e,this.center);const t=dr.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(dr,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ea.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(dr.copy(e.center).add(ea)),this.expandByPoint(dr.copy(e.center).sub(ea))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Ln=new U,ta=new U,jr=new U,Zn=new U,na=new U,Zr=new U,ia=new U;class kr{constructor(e=new U,t=new U(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ln)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Ln.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ln.copy(this.origin).addScaledVector(this.direction,t),Ln.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){ta.copy(e).add(t).multiplyScalar(.5),jr.copy(t).sub(e).normalize(),Zn.copy(this.origin).sub(ta);const s=e.distanceTo(t)*.5,a=-this.direction.dot(jr),o=Zn.dot(this.direction),l=-Zn.dot(jr),c=Zn.lengthSq(),u=Math.abs(1-a*a);let h,f,p,g;if(u>0)if(h=a*l-o,f=a*o-l,g=s*u,h>=0)if(f>=-g)if(f<=g){const _=1/u;h*=_,f*=_,p=h*(h+a*f+2*o)+f*(a*h+f+2*l)+c}else f=s,h=Math.max(0,-(a*f+o)),p=-h*h+f*(f+2*l)+c;else f=-s,h=Math.max(0,-(a*f+o)),p=-h*h+f*(f+2*l)+c;else f<=-g?(h=Math.max(0,-(-a*s+o)),f=h>0?-s:Math.min(Math.max(-s,-l),s),p=-h*h+f*(f+2*l)+c):f<=g?(h=0,f=Math.min(Math.max(-s,-l),s),p=f*(f+2*l)+c):(h=Math.max(0,-(a*s+o)),f=h>0?s:Math.min(Math.max(-s,-l),s),p=-h*h+f*(f+2*l)+c);else f=a>0?-s:s,h=Math.max(0,-(a*f+o)),p=-h*h+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),i&&i.copy(ta).addScaledVector(jr,f),p}intersectSphere(e,t){Ln.subVectors(e.center,this.origin);const n=Ln.dot(this.direction),i=Ln.dot(Ln)-n*n,s=e.radius*e.radius;if(i>s)return null;const a=Math.sqrt(s-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,i=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,i=(e.min.x-f.x)*c),u>=0?(s=(e.min.y-f.y)*u,a=(e.max.y-f.y)*u):(s=(e.max.y-f.y)*u,a=(e.min.y-f.y)*u),n>a||s>i||((s>n||isNaN(n))&&(n=s),(a<i||isNaN(i))&&(i=a),h>=0?(o=(e.min.z-f.z)*h,l=(e.max.z-f.z)*h):(o=(e.max.z-f.z)*h,l=(e.min.z-f.z)*h),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Ln)!==null}intersectTriangle(e,t,n,i,s){na.subVectors(t,e),Zr.subVectors(n,e),ia.crossVectors(na,Zr);let a=this.direction.dot(ia),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Zn.subVectors(this.origin,e);const l=o*this.direction.dot(Zr.crossVectors(Zn,Zr));if(l<0)return null;const c=o*this.direction.dot(na.cross(Zn));if(c<0||l+c>a)return null;const u=-o*Zn.dot(ia);return u<0?null:this.at(u/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Xe{constructor(e,t,n,i,s,a,o,l,c,u,h,f,p,g,_,m){Xe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,o,l,c,u,h,f,p,g,_,m)}set(e,t,n,i,s,a,o,l,c,u,h,f,p,g,_,m){const d=this.elements;return d[0]=e,d[4]=t,d[8]=n,d[12]=i,d[1]=s,d[5]=a,d[9]=o,d[13]=l,d[2]=c,d[6]=u,d[10]=h,d[14]=f,d[3]=p,d[7]=g,d[11]=_,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Xe().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/Ii.setFromMatrixColumn(e,0).length(),s=1/Ii.setFromMatrixColumn(e,1).length(),a=1/Ii.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const f=a*u,p=a*h,g=o*u,_=o*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=p+g*c,t[5]=f-_*c,t[9]=-o*l,t[2]=_-f*c,t[6]=g+p*c,t[10]=a*l}else if(e.order==="YXZ"){const f=l*u,p=l*h,g=c*u,_=c*h;t[0]=f+_*o,t[4]=g*o-p,t[8]=a*c,t[1]=a*h,t[5]=a*u,t[9]=-o,t[2]=p*o-g,t[6]=_+f*o,t[10]=a*l}else if(e.order==="ZXY"){const f=l*u,p=l*h,g=c*u,_=c*h;t[0]=f-_*o,t[4]=-a*h,t[8]=g+p*o,t[1]=p+g*o,t[5]=a*u,t[9]=_-f*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const f=a*u,p=a*h,g=o*u,_=o*h;t[0]=l*u,t[4]=g*c-p,t[8]=f*c+_,t[1]=l*h,t[5]=_*c+f,t[9]=p*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const f=a*l,p=a*c,g=o*l,_=o*c;t[0]=l*u,t[4]=_-f*h,t[8]=g*h+p,t[1]=h,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=p*h+g,t[10]=f-_*h}else if(e.order==="XZY"){const f=a*l,p=a*c,g=o*l,_=o*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=f*h+_,t[5]=a*u,t[9]=p*h-g,t[2]=g*h-p,t[6]=o*u,t[10]=_*h+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(tf,e,nf)}lookAt(e,t,n){const i=this.elements;return jt.subVectors(e,t),jt.lengthSq()===0&&(jt.z=1),jt.normalize(),$n.crossVectors(n,jt),$n.lengthSq()===0&&(Math.abs(n.z)===1?jt.x+=1e-4:jt.z+=1e-4,jt.normalize(),$n.crossVectors(n,jt)),$n.normalize(),$r.crossVectors(jt,$n),i[0]=$n.x,i[4]=$r.x,i[8]=jt.x,i[1]=$n.y,i[5]=$r.y,i[9]=jt.y,i[2]=$n.z,i[6]=$r.z,i[10]=jt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],h=n[5],f=n[9],p=n[13],g=n[2],_=n[6],m=n[10],d=n[14],b=n[3],M=n[7],v=n[11],R=n[15],P=i[0],L=i[4],F=i[8],S=i[12],T=i[1],E=i[5],C=i[9],D=i[13],k=i[2],H=i[6],W=i[10],Y=i[14],V=i[3],Q=i[7],oe=i[11],ye=i[15];return s[0]=a*P+o*T+l*k+c*V,s[4]=a*L+o*E+l*H+c*Q,s[8]=a*F+o*C+l*W+c*oe,s[12]=a*S+o*D+l*Y+c*ye,s[1]=u*P+h*T+f*k+p*V,s[5]=u*L+h*E+f*H+p*Q,s[9]=u*F+h*C+f*W+p*oe,s[13]=u*S+h*D+f*Y+p*ye,s[2]=g*P+_*T+m*k+d*V,s[6]=g*L+_*E+m*H+d*Q,s[10]=g*F+_*C+m*W+d*oe,s[14]=g*S+_*D+m*Y+d*ye,s[3]=b*P+M*T+v*k+R*V,s[7]=b*L+M*E+v*H+R*Q,s[11]=b*F+M*C+v*W+R*oe,s[15]=b*S+M*D+v*Y+R*ye,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],h=e[6],f=e[10],p=e[14],g=e[3],_=e[7],m=e[11],d=e[15];return g*(+s*l*h-i*c*h-s*o*f+n*c*f+i*o*p-n*l*p)+_*(+t*l*p-t*c*f+s*a*f-i*a*p+i*c*u-s*l*u)+m*(+t*c*h-t*o*p-s*a*h+n*a*p+s*o*u-n*c*u)+d*(-i*o*u-t*l*h+t*o*f+i*a*h-n*a*f+n*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=e[9],f=e[10],p=e[11],g=e[12],_=e[13],m=e[14],d=e[15],b=h*m*c-_*f*c+_*l*p-o*m*p-h*l*d+o*f*d,M=g*f*c-u*m*c-g*l*p+a*m*p+u*l*d-a*f*d,v=u*_*c-g*h*c+g*o*p-a*_*p-u*o*d+a*h*d,R=g*h*l-u*_*l-g*o*f+a*_*f+u*o*m-a*h*m,P=t*b+n*M+i*v+s*R;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const L=1/P;return e[0]=b*L,e[1]=(_*f*s-h*m*s-_*i*p+n*m*p+h*i*d-n*f*d)*L,e[2]=(o*m*s-_*l*s+_*i*c-n*m*c-o*i*d+n*l*d)*L,e[3]=(h*l*s-o*f*s-h*i*c+n*f*c+o*i*p-n*l*p)*L,e[4]=M*L,e[5]=(u*m*s-g*f*s+g*i*p-t*m*p-u*i*d+t*f*d)*L,e[6]=(g*l*s-a*m*s-g*i*c+t*m*c+a*i*d-t*l*d)*L,e[7]=(a*f*s-u*l*s+u*i*c-t*f*c-a*i*p+t*l*p)*L,e[8]=v*L,e[9]=(g*h*s-u*_*s-g*n*p+t*_*p+u*n*d-t*h*d)*L,e[10]=(a*_*s-g*o*s+g*n*c-t*_*c-a*n*d+t*o*d)*L,e[11]=(u*o*s-a*h*s-u*n*c+t*h*c+a*n*p-t*o*p)*L,e[12]=R*L,e[13]=(u*_*i-g*h*i+g*n*f-t*_*f-u*n*m+t*h*m)*L,e[14]=(g*o*i-a*_*i-g*n*l+t*_*l+a*n*m-t*o*m)*L,e[15]=(a*h*i-u*o*i+u*n*l-t*h*l-a*n*f+t*o*f)*L,this}scale(e){const t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),s=1-n,a=e.x,o=e.y,l=e.z,c=s*a,u=s*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,u*o+n,u*l-i*a,0,c*l-i*o,u*l+i*a,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,a){return this.set(1,n,s,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,u=a+a,h=o+o,f=s*c,p=s*u,g=s*h,_=a*u,m=a*h,d=o*h,b=l*c,M=l*u,v=l*h,R=n.x,P=n.y,L=n.z;return i[0]=(1-(_+d))*R,i[1]=(p+v)*R,i[2]=(g-M)*R,i[3]=0,i[4]=(p-v)*P,i[5]=(1-(f+d))*P,i[6]=(m+b)*P,i[7]=0,i[8]=(g+M)*L,i[9]=(m-b)*L,i[10]=(1-(f+_))*L,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let s=Ii.set(i[0],i[1],i[2]).length();const a=Ii.set(i[4],i[5],i[6]).length(),o=Ii.set(i[8],i[9],i[10]).length();this.determinant()<0&&(s=-s),e.x=i[12],e.y=i[13],e.z=i[14],an.copy(this);const c=1/s,u=1/a,h=1/o;return an.elements[0]*=c,an.elements[1]*=c,an.elements[2]*=c,an.elements[4]*=u,an.elements[5]*=u,an.elements[6]*=u,an.elements[8]*=h,an.elements[9]*=h,an.elements[10]*=h,t.setFromRotationMatrix(an),n.x=s,n.y=a,n.z=o,this}makePerspective(e,t,n,i,s,a,o=yn,l=!1){const c=this.elements,u=2*s/(t-e),h=2*s/(n-i),f=(t+e)/(t-e),p=(n+i)/(n-i);let g,_;if(l)g=s/(a-s),_=a*s/(a-s);else if(o===yn)g=-(a+s)/(a-s),_=-2*a*s/(a-s);else if(o===Is)g=-a/(a-s),_=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=h,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,s,a,o=yn,l=!1){const c=this.elements,u=2/(t-e),h=2/(n-i),f=-(t+e)/(t-e),p=-(n+i)/(n-i);let g,_;if(l)g=1/(a-s),_=a/(a-s);else if(o===yn)g=-2/(a-s),_=-(a+s)/(a-s);else if(o===Is)g=-1/(a-s),_=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=h,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Ii=new U,an=new Xe,tf=new U(0,0,0),nf=new U(1,1,1),$n=new U,$r=new U,jt=new U,Ec=new Xe,Tc=new li;class bn{constructor(e=0,t=0,n=0,i=bn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,s=i[0],a=i[4],o=i[8],l=i[1],c=i[5],u=i[9],h=i[2],f=i[6],p=i[10];switch(t){case"XYZ":this._y=Math.asin($e(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-$e(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin($e(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-$e(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin($e(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-$e(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Ec.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ec,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Tc.setFromEuler(this),this.setFromQuaternion(Tc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}bn.DEFAULT_ORDER="XYZ";class Yo{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let rf=0;const bc=new U,Di=new li,In=new Xe,Jr=new U,pr=new U,sf=new U,af=new li,Ac=new U(1,0,0),wc=new U(0,1,0),Rc=new U(0,0,1),Cc={type:"added"},of={type:"removed"},Ui={type:"childadded",child:null},ra={type:"childremoved",child:null};class _t extends ar{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:rf++}),this.uuid=pn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=_t.DEFAULT_UP.clone();const e=new U,t=new bn,n=new li,i=new U(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Xe},normalMatrix:{value:new qe}}),this.matrix=new Xe,this.matrixWorld=new Xe,this.matrixAutoUpdate=_t.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=_t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Yo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Di.setFromAxisAngle(e,t),this.quaternion.multiply(Di),this}rotateOnWorldAxis(e,t){return Di.setFromAxisAngle(e,t),this.quaternion.premultiply(Di),this}rotateX(e){return this.rotateOnAxis(Ac,e)}rotateY(e){return this.rotateOnAxis(wc,e)}rotateZ(e){return this.rotateOnAxis(Rc,e)}translateOnAxis(e,t){return bc.copy(e).applyQuaternion(this.quaternion),this.position.add(bc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ac,e)}translateY(e){return this.translateOnAxis(wc,e)}translateZ(e){return this.translateOnAxis(Rc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(In.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Jr.copy(e):Jr.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),pr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?In.lookAt(pr,Jr,this.up):In.lookAt(Jr,pr,this.up),this.quaternion.setFromRotationMatrix(In),i&&(In.extractRotation(i.matrixWorld),Di.setFromRotationMatrix(In),this.quaternion.premultiply(Di.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Cc),Ui.child=e,this.dispatchEvent(Ui),Ui.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(of),ra.child=e,this.dispatchEvent(ra),ra.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),In.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),In.multiply(e.parent.matrixWorld)),e.applyMatrix4(In),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Cc),Ui.child=e,this.dispatchEvent(Ui),Ui.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(pr,e,sf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(pr,af,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));i.material=o}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(s(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),h=a(e.shapes),f=a(e.skeletons),p=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),f.length>0&&(n.skeletons=f),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}_t.DEFAULT_UP=new U(0,1,0);_t.DEFAULT_MATRIX_AUTO_UPDATE=!0;_t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const on=new U,Dn=new U,sa=new U,Un=new U,Ni=new U,Fi=new U,Pc=new U,aa=new U,oa=new U,ca=new U,la=new st,ua=new st,ha=new st;class hn{constructor(e=new U,t=new U,n=new U){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),on.subVectors(e,t),i.cross(on);const s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){on.subVectors(i,t),Dn.subVectors(n,t),sa.subVectors(e,t);const a=on.dot(on),o=on.dot(Dn),l=on.dot(sa),c=Dn.dot(Dn),u=Dn.dot(sa),h=a*c-o*o;if(h===0)return s.set(0,0,0),null;const f=1/h,p=(c*l-o*u)*f,g=(a*u-o*l)*f;return s.set(1-p-g,g,p)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Un)===null?!1:Un.x>=0&&Un.y>=0&&Un.x+Un.y<=1}static getInterpolation(e,t,n,i,s,a,o,l){return this.getBarycoord(e,t,n,i,Un)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Un.x),l.addScaledVector(a,Un.y),l.addScaledVector(o,Un.z),l)}static getInterpolatedAttribute(e,t,n,i,s,a){return la.setScalar(0),ua.setScalar(0),ha.setScalar(0),la.fromBufferAttribute(e,t),ua.fromBufferAttribute(e,n),ha.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(la,s.x),a.addScaledVector(ua,s.y),a.addScaledVector(ha,s.z),a}static isFrontFacing(e,t,n,i){return on.subVectors(n,t),Dn.subVectors(e,t),on.cross(Dn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return on.subVectors(this.c,this.b),Dn.subVectors(this.a,this.b),on.cross(Dn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return hn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return hn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return hn.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return hn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return hn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,s=this.c;let a,o;Ni.subVectors(i,n),Fi.subVectors(s,n),aa.subVectors(e,n);const l=Ni.dot(aa),c=Fi.dot(aa);if(l<=0&&c<=0)return t.copy(n);oa.subVectors(e,i);const u=Ni.dot(oa),h=Fi.dot(oa);if(u>=0&&h<=u)return t.copy(i);const f=l*h-u*c;if(f<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(n).addScaledVector(Ni,a);ca.subVectors(e,s);const p=Ni.dot(ca),g=Fi.dot(ca);if(g>=0&&p<=g)return t.copy(s);const _=p*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(Fi,o);const m=u*g-p*h;if(m<=0&&h-u>=0&&p-g>=0)return Pc.subVectors(s,i),o=(h-u)/(h-u+(p-g)),t.copy(i).addScaledVector(Pc,o);const d=1/(m+_+f);return a=_*d,o=f*d,t.copy(n).addScaledVector(Ni,a).addScaledVector(Fi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const su={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Jn={h:0,s:0,l:0},Qr={h:0,s:0,l:0};function fa(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}class ze{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Et){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,tt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=tt.workingColorSpace){return this.r=e,this.g=t,this.b=n,tt.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=tt.workingColorSpace){if(e=Xo(e,1),t=$e(t,0,1),n=$e(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=fa(a,s,e+1/3),this.g=fa(a,s,e),this.b=fa(a,s,e-1/3)}return tt.colorSpaceToWorking(this,i),this}setStyle(e,t=Et){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=i[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Et){const n=su[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=zn(e.r),this.g=zn(e.g),this.b=zn(e.b),this}copyLinearToSRGB(e){return this.r=Ki(e.r),this.g=Ki(e.g),this.b=Ki(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Et){return tt.workingToColorSpace(Ut.copy(this),e),Math.round($e(Ut.r*255,0,255))*65536+Math.round($e(Ut.g*255,0,255))*256+Math.round($e(Ut.b*255,0,255))}getHexString(e=Et){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=tt.workingColorSpace){tt.workingToColorSpace(Ut.copy(this),t);const n=Ut.r,i=Ut.g,s=Ut.b,a=Math.max(n,i,s),o=Math.min(n,i,s);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const h=a-o;switch(c=u<=.5?h/(a+o):h/(2-a-o),a){case n:l=(i-s)/h+(i<s?6:0);break;case i:l=(s-n)/h+2;break;case s:l=(n-i)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=tt.workingColorSpace){return tt.workingToColorSpace(Ut.copy(this),t),e.r=Ut.r,e.g=Ut.g,e.b=Ut.b,e}getStyle(e=Et){tt.workingToColorSpace(Ut.copy(this),e);const t=Ut.r,n=Ut.g,i=Ut.b;return e!==Et?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Jn),this.setHSL(Jn.h+e,Jn.s+t,Jn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Jn),e.getHSL(Qr);const n=Ar(Jn.h,Qr.h,t),i=Ar(Jn.s,Qr.s,t),s=Ar(Jn.l,Qr.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ut=new ze;ze.NAMES=su;let cf=0;class En extends ar{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:cf++}),this.uuid=pn(),this.name="",this.type="Material",this.blending=Yi,this.side=Vn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Fa,this.blendDst=Oa,this.blendEquation=Mi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ze(0,0,0),this.blendAlpha=0,this.depthFunc=Zi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=gc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=wi,this.stencilZFail=wi,this.stencilZPass=wi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Yi&&(n.blending=this.blending),this.side!==Vn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Fa&&(n.blendSrc=this.blendSrc),this.blendDst!==Oa&&(n.blendDst=this.blendDst),this.blendEquation!==Mi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Zi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==gc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==wi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==wi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==wi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(t){const s=i(e.textures),a=i(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class dn extends En{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ze(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bn,this.combine=Gl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Tt=new U,es=new Be;let lf=0;class Nt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:lf++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Eo,this.updateRanges=[],this.gpuType=fn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)es.fromBufferAttribute(this,t),es.applyMatrix3(e),this.setXY(t,es.x,es.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Tt.fromBufferAttribute(this,t),Tt.applyMatrix3(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Tt.fromBufferAttribute(this,t),Tt.applyMatrix4(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Tt.fromBufferAttribute(this,t),Tt.applyNormalMatrix(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Tt.fromBufferAttribute(this,t),Tt.transformDirection(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=un(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ot(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=un(t,this.array)),t}setX(e,t){return this.normalized&&(t=ot(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=un(t,this.array)),t}setY(e,t){return this.normalized&&(t=ot(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=un(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ot(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=un(t,this.array)),t}setW(e,t){return this.normalized&&(t=ot(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array),i=ot(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array),i=ot(i,this.array),s=ot(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Eo&&(e.usage=this.usage),e}}class au extends Nt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class ou extends Nt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Ht extends Nt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let uf=0;const en=new Xe,da=new _t,Oi=new U,Zt=new Xn,mr=new Xn,Pt=new U;class rn extends ar{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:uf++}),this.uuid=pn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(iu(e)?ou:au)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new qe().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return en.makeRotationFromQuaternion(e),this.applyMatrix4(en),this}rotateX(e){return en.makeRotationX(e),this.applyMatrix4(en),this}rotateY(e){return en.makeRotationY(e),this.applyMatrix4(en),this}rotateZ(e){return en.makeRotationZ(e),this.applyMatrix4(en),this}translate(e,t,n){return en.makeTranslation(e,t,n),this.applyMatrix4(en),this}scale(e,t,n){return en.makeScale(e,t,n),this.applyMatrix4(en),this}lookAt(e){return da.lookAt(e),da.updateMatrix(),this.applyMatrix4(da.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Oi).negate(),this.translate(Oi.x,Oi.y,Oi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,s=e.length;i<s;i++){const a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Ht(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Xn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const s=t[n];Zt.setFromBufferAttribute(s),this.morphTargetsRelative?(Pt.addVectors(this.boundingBox.min,Zt.min),this.boundingBox.expandByPoint(Pt),Pt.addVectors(this.boundingBox.max,Zt.max),this.boundingBox.expandByPoint(Pt)):(this.boundingBox.expandByPoint(Zt.min),this.boundingBox.expandByPoint(Zt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new An);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(e){const n=this.boundingSphere.center;if(Zt.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];mr.setFromBufferAttribute(o),this.morphTargetsRelative?(Pt.addVectors(Zt.min,mr.min),Zt.expandByPoint(Pt),Pt.addVectors(Zt.max,mr.max),Zt.expandByPoint(Pt)):(Zt.expandByPoint(mr.min),Zt.expandByPoint(mr.max))}Zt.getCenter(n);let i=0;for(let s=0,a=e.count;s<a;s++)Pt.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(Pt));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)Pt.fromBufferAttribute(o,c),l&&(Oi.fromBufferAttribute(e,c),Pt.add(Oi)),i=Math.max(i,n.distanceToSquared(Pt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Nt(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let F=0;F<n.count;F++)o[F]=new U,l[F]=new U;const c=new U,u=new U,h=new U,f=new Be,p=new Be,g=new Be,_=new U,m=new U;function d(F,S,T){c.fromBufferAttribute(n,F),u.fromBufferAttribute(n,S),h.fromBufferAttribute(n,T),f.fromBufferAttribute(s,F),p.fromBufferAttribute(s,S),g.fromBufferAttribute(s,T),u.sub(c),h.sub(c),p.sub(f),g.sub(f);const E=1/(p.x*g.y-g.x*p.y);isFinite(E)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(h,-p.y).multiplyScalar(E),m.copy(h).multiplyScalar(p.x).addScaledVector(u,-g.x).multiplyScalar(E),o[F].add(_),o[S].add(_),o[T].add(_),l[F].add(m),l[S].add(m),l[T].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let F=0,S=b.length;F<S;++F){const T=b[F],E=T.start,C=T.count;for(let D=E,k=E+C;D<k;D+=3)d(e.getX(D+0),e.getX(D+1),e.getX(D+2))}const M=new U,v=new U,R=new U,P=new U;function L(F){R.fromBufferAttribute(i,F),P.copy(R);const S=o[F];M.copy(S),M.sub(R.multiplyScalar(R.dot(S))).normalize(),v.crossVectors(P,S);const E=v.dot(l[F])<0?-1:1;a.setXYZW(F,M.x,M.y,M.z,E)}for(let F=0,S=b.length;F<S;++F){const T=b[F],E=T.start,C=T.count;for(let D=E,k=E+C;D<k;D+=3)L(e.getX(D+0)),L(e.getX(D+1)),L(e.getX(D+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Nt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,p=n.count;f<p;f++)n.setXYZ(f,0,0,0);const i=new U,s=new U,a=new U,o=new U,l=new U,c=new U,u=new U,h=new U;if(e)for(let f=0,p=e.count;f<p;f+=3){const g=e.getX(f+0),_=e.getX(f+1),m=e.getX(f+2);i.fromBufferAttribute(t,g),s.fromBufferAttribute(t,_),a.fromBufferAttribute(t,m),u.subVectors(a,s),h.subVectors(i,s),u.cross(h),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),o.add(u),l.add(u),c.add(u),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,p=t.count;f<p;f+=3)i.fromBufferAttribute(t,f+0),s.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),u.subVectors(a,s),h.subVectors(i,s),u.cross(h),n.setXYZ(f+0,u.x,u.y,u.z),n.setXYZ(f+1,u.x,u.y,u.z),n.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Pt.fromBufferAttribute(e,t),Pt.normalize(),e.setXYZ(t,Pt.x,Pt.y,Pt.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,h=o.normalized,f=new c.constructor(l.length*u);let p=0,g=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?p=l[_]*o.data.stride+o.offset:p=l[_]*u;for(let d=0;d<u;d++)f[g++]=c[p++]}return new Nt(f,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new rn,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=e(l,n);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let u=0,h=c.length;u<h;u++){const f=c[u],p=e(f,n);l.push(p)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,f=c.length;h<f;h++){const p=c[h];u.push(p.toJSON(e.data))}u.length>0&&(i[l]=u,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const c in i){const u=i[c];this.setAttribute(c,u.clone(t))}const s=e.morphAttributes;for(const c in s){const u=[],h=s[c];for(let f=0,p=h.length;f<p;f++)u.push(h[f].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const h=a[c];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Lc=new Xe,di=new kr,ts=new An,Ic=new U,ns=new U,is=new U,rs=new U,pa=new U,ss=new U,Dc=new U,as=new U;class At extends _t{constructor(e=new rn,t=new dn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(s&&o){ss.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=o[l],h=s[l];u!==0&&(pa.fromBufferAttribute(h,e),a?ss.addScaledVector(pa,u):ss.addScaledVector(pa.sub(t),u))}t.add(ss)}return t}raycast(e,t){const n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ts.copy(n.boundingSphere),ts.applyMatrix4(s),di.copy(e.ray).recast(e.near),!(ts.containsPoint(di.origin)===!1&&(di.intersectSphere(ts,Ic)===null||di.origin.distanceToSquared(Ic)>(e.far-e.near)**2))&&(Lc.copy(s).invert(),di.copy(e.ray).applyMatrix4(Lc),!(n.boundingBox!==null&&di.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,di)))}_computeIntersections(e,t,n){let i;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,f=s.groups,p=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){const m=f[g],d=a[m.materialIndex],b=Math.max(m.start,p.start),M=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let v=b,R=M;v<R;v+=3){const P=o.getX(v),L=o.getX(v+1),F=o.getX(v+2);i=os(this,d,e,n,c,u,h,P,L,F),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,p.start),_=Math.min(o.count,p.start+p.count);for(let m=g,d=_;m<d;m+=3){const b=o.getX(m),M=o.getX(m+1),v=o.getX(m+2);i=os(this,a,e,n,c,u,h,b,M,v),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){const m=f[g],d=a[m.materialIndex],b=Math.max(m.start,p.start),M=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let v=b,R=M;v<R;v+=3){const P=v,L=v+1,F=v+2;i=os(this,d,e,n,c,u,h,P,L,F),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let m=g,d=_;m<d;m+=3){const b=m,M=m+1,v=m+2;i=os(this,a,e,n,c,u,h,b,M,v),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}}}function hf(r,e,t,n,i,s,a,o){let l;if(e.side===qt?l=n.intersectTriangle(a,s,i,!0,o):l=n.intersectTriangle(i,s,a,e.side===Vn,o),l===null)return null;as.copy(o),as.applyMatrix4(r.matrixWorld);const c=t.ray.origin.distanceTo(as);return c<t.near||c>t.far?null:{distance:c,point:as.clone(),object:r}}function os(r,e,t,n,i,s,a,o,l,c){r.getVertexPosition(o,ns),r.getVertexPosition(l,is),r.getVertexPosition(c,rs);const u=hf(r,e,t,n,ns,is,rs,Dc);if(u){const h=new U;hn.getBarycoord(Dc,ns,is,rs,h),i&&(u.uv=hn.getInterpolatedAttribute(i,o,l,c,h,new Be)),s&&(u.uv1=hn.getInterpolatedAttribute(s,o,l,c,h,new Be)),a&&(u.normal=hn.getInterpolatedAttribute(a,o,l,c,h,new U),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new U,materialIndex:0};hn.getNormal(ns,is,rs,f.normal),u.face=f,u.barycoord=h}return u}class Hr extends rn{constructor(e=1,t=1,n=1,i=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:a};const o=this;i=Math.floor(i),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],u=[],h=[];let f=0,p=0;g("z","y","x",-1,-1,n,t,e,a,s,0),g("z","y","x",1,-1,n,t,-e,a,s,1),g("x","z","y",1,1,e,n,t,i,a,2),g("x","z","y",1,-1,e,n,-t,i,a,3),g("x","y","z",1,-1,e,t,n,i,s,4),g("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(l),this.setAttribute("position",new Ht(c,3)),this.setAttribute("normal",new Ht(u,3)),this.setAttribute("uv",new Ht(h,2));function g(_,m,d,b,M,v,R,P,L,F,S){const T=v/L,E=R/F,C=v/2,D=R/2,k=P/2,H=L+1,W=F+1;let Y=0,V=0;const Q=new U;for(let oe=0;oe<W;oe++){const ye=oe*E-D;for(let Ne=0;Ne<H;Ne++){const nt=Ne*T-C;Q[_]=nt*b,Q[m]=ye*M,Q[d]=k,c.push(Q.x,Q.y,Q.z),Q[_]=0,Q[m]=0,Q[d]=P>0?1:-1,u.push(Q.x,Q.y,Q.z),h.push(Ne/L),h.push(1-oe/F),Y+=1}}for(let oe=0;oe<F;oe++)for(let ye=0;ye<L;ye++){const Ne=f+ye+H*oe,nt=f+ye+H*(oe+1),Ke=f+(ye+1)+H*(oe+1),Ze=f+(ye+1)+H*oe;l.push(Ne,nt,Ze),l.push(nt,Ke,Ze),V+=6}o.addGroup(p,V,S),p+=V,f+=Y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Hr(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function er(r){const e={};for(const t in r){e[t]={};for(const n in r[t]){const i=r[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Bt(r){const e={};for(let t=0;t<r.length;t++){const n=er(r[t]);for(const i in n)e[i]=n[i]}return e}function ff(r){const e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}function cu(r){const e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:tt.workingColorSpace}const df={clone:er,merge:Bt};var pf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,mf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Wn extends En{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=pf,this.fragmentShader=mf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=er(e.uniforms),this.uniformsGroups=ff(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class lu extends _t{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Xe,this.projectionMatrix=new Xe,this.projectionMatrixInverse=new Xe,this.coordinateSystem=yn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Qn=new U,Uc=new Be,Nc=new Be;class zt extends lu{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Qi*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(br*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Qi*2*Math.atan(Math.tan(br*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Qn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Qn.x,Qn.y).multiplyScalar(-e/Qn.z),Qn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Qn.x,Qn.y).multiplyScalar(-e/Qn.z)}getViewSize(e,t){return this.getViewBounds(e,Uc,Nc),t.subVectors(Nc,Uc)}setViewOffset(e,t,n,i,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(br*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Bi=-90,zi=1;class gf extends _t{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new zt(Bi,zi,e,t);i.layers=this.layers,this.add(i);const s=new zt(Bi,zi,e,t);s.layers=this.layers,this.add(s);const a=new zt(Bi,zi,e,t);a.layers=this.layers,this.add(a);const o=new zt(Bi,zi,e,t);o.layers=this.layers,this.add(o);const l=new zt(Bi,zi,e,t);l.layers=this.layers,this.add(l);const c=new zt(Bi,zi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,s,a,o,l]=t;for(const c of t)this.remove(c);if(e===yn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Is)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,u]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,s),e.setRenderTarget(n,1,i),e.render(t,a),e.setRenderTarget(n,2,i),e.render(t,o),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,i),e.render(t,u),e.setRenderTarget(h,f,p),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class uu extends wt{constructor(e=[],t=$i,n,i,s,a,o,l,c,u){super(e,t,n,i,s,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class _f extends ci{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new uu(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Hr(5,5,5),s=new Wn({name:"CubemapFromEquirect",uniforms:er(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:qt,blending:ri});s.uniforms.tEquirect.value=t;const a=new At(i,s),o=t.minFilter;return t.minFilter===On&&(t.minFilter=Xt),new gf(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(s)}}class Si extends _t{constructor(){super(),this.isGroup=!0,this.type="Group"}}const xf={type:"move"};class ma{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Si,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Si,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Si,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,n),d=this._getHandJoint(c,_);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],f=u.position.distanceTo(h.position),p=.02,g=.005;c.inputState.pinching&&f>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(xf)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Si;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class Fc extends _t{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new bn,this.environmentIntensity=1,this.environmentRotation=new bn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class vf{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Eo,this.updateRanges=[],this.version=0,this.uuid=pn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,s=this.stride;i<s;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=pn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=pn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ot=new U;class Ko{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyMatrix4(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyNormalMatrix(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.transformDirection(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=un(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ot(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=ot(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ot(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ot(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ot(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=un(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=un(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=un(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=un(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array),i=ot(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array),i=ot(i,this.array),s=ot(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return new Nt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Ko(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const Oc=new U,Bc=new st,zc=new st,Mf=new U,kc=new Xe,cs=new U,ga=new An,Hc=new Xe,_a=new kr;class yf extends At{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=fc,this.bindMatrix=new Xe,this.bindMatrixInverse=new Xe,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Xn),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,cs),this.boundingBox.expandByPoint(cs)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new An),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,cs),this.boundingSphere.expandByPoint(cs)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ga.copy(this.boundingSphere),ga.applyMatrix4(i),e.ray.intersectsSphere(ga)!==!1&&(Hc.copy(i).invert(),_a.copy(e.ray).applyMatrix4(Hc),!(this.boundingBox!==null&&_a.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,_a)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new st,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===fc?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===gh?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;Bc.fromBufferAttribute(i.attributes.skinIndex,e),zc.fromBufferAttribute(i.attributes.skinWeight,e),Oc.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let s=0;s<4;s++){const a=zc.getComponent(s);if(a!==0){const o=Bc.getComponent(s);kc.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(Mf.copy(Oc).applyMatrix4(kc),a)}}return t.applyMatrix4(this.bindMatrixInverse)}}class hu extends _t{constructor(){super(),this.isBone=!0,this.type="Bone"}}class fu extends wt{constructor(e=null,t=1,n=1,i,s,a,o,l,c=kt,u=kt,h,f){super(null,a,o,l,c,u,i,s,h,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Vc=new Xe,Sf=new Xe;class jo{constructor(e=[],t=[]){this.uuid=pn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Xe)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new Xe;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,a=e.length;s<a;s++){const o=e[s]?e[s].matrixWorld:Sf;Vc.multiplyMatrices(o,t[s]),Vc.toArray(n,s*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new jo(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new fu(t,e,e,nn,fn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const s=e.bones[n];let a=t[s];a===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",s),a=new hu),this.bones.push(a),this.boneInverses.push(new Xe().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,s=t.length;i<s;i++){const a=t[i];e.bones.push(a.uuid);const o=n[i];e.boneInverses.push(o.toArray())}return e}}class To extends Nt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const ki=new Xe,Gc=new Xe,ls=[],Wc=new Xn,Ef=new Xe,gr=new At,_r=new An;class bo extends At{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new To(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Ef)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Xn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ki),Wc.copy(e.boundingBox).applyMatrix4(ki),this.boundingBox.union(Wc)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new An),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ki),_r.copy(e.boundingSphere).applyMatrix4(ki),this.boundingSphere.union(_r)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,a=e*s+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(gr.geometry=this.geometry,gr.material=this.material,gr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),_r.copy(this.boundingSphere),_r.applyMatrix4(n),e.ray.intersectsSphere(_r)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,ki),Gc.multiplyMatrices(n,ki),gr.matrixWorld=Gc,gr.raycast(e,ls);for(let a=0,o=ls.length;a<o;a++){const l=ls[a];l.instanceId=s,l.object=this,t.push(l)}ls.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new To(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new fu(new Float32Array(i*this.count),i,this.count,Ho,fn));const s=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=i*e;s[l]=o,s.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const xa=new U,Tf=new U,bf=new qe;class ti{constructor(e=new U(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=xa.subVectors(n,t).cross(Tf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(xa),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/i;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||bf.getNormalMatrix(e),i=this.coplanarPoint(xa).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const pi=new An,Af=new Be(.5,.5),us=new U;class Zo{constructor(e=new ti,t=new ti,n=new ti,i=new ti,s=new ti,a=new ti){this.planes=[e,t,n,i,s,a]}set(e,t,n,i,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=yn,n=!1){const i=this.planes,s=e.elements,a=s[0],o=s[1],l=s[2],c=s[3],u=s[4],h=s[5],f=s[6],p=s[7],g=s[8],_=s[9],m=s[10],d=s[11],b=s[12],M=s[13],v=s[14],R=s[15];if(i[0].setComponents(c-a,p-u,d-g,R-b).normalize(),i[1].setComponents(c+a,p+u,d+g,R+b).normalize(),i[2].setComponents(c+o,p+h,d+_,R+M).normalize(),i[3].setComponents(c-o,p-h,d-_,R-M).normalize(),n)i[4].setComponents(l,f,m,v).normalize(),i[5].setComponents(c-l,p-f,d-m,R-v).normalize();else if(i[4].setComponents(c-l,p-f,d-m,R-v).normalize(),t===yn)i[5].setComponents(c+l,p+f,d+m,R+v).normalize();else if(t===Is)i[5].setComponents(l,f,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),pi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),pi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(pi)}intersectsSprite(e){pi.center.set(0,0,0);const t=Af.distanceTo(e.center);return pi.radius=.7071067811865476+t,pi.applyMatrix4(e.matrixWorld),this.intersectsSphere(pi)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(us.x=i.normal.x>0?e.max.x:e.min.x,us.y=i.normal.y>0?e.max.y:e.min.y,us.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(us)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class du extends En{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ze(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Ds=new U,Us=new U,Xc=new Xe,xr=new kr,hs=new An,va=new U,qc=new U;class $o extends _t{constructor(e=new rn,t=new du){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,s=t.count;i<s;i++)Ds.fromBufferAttribute(t,i-1),Us.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Ds.distanceTo(Us);e.setAttribute("lineDistance",new Ht(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),hs.copy(n.boundingSphere),hs.applyMatrix4(i),hs.radius+=s,e.ray.intersectsSphere(hs)===!1)return;Xc.copy(i).invert(),xr.copy(e.ray).applyMatrix4(Xc);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=n.index,f=n.attributes.position;if(u!==null){const p=Math.max(0,a.start),g=Math.min(u.count,a.start+a.count);for(let _=p,m=g-1;_<m;_+=c){const d=u.getX(_),b=u.getX(_+1),M=fs(this,e,xr,l,d,b,_);M&&t.push(M)}if(this.isLineLoop){const _=u.getX(g-1),m=u.getX(p),d=fs(this,e,xr,l,_,m,g-1);d&&t.push(d)}}else{const p=Math.max(0,a.start),g=Math.min(f.count,a.start+a.count);for(let _=p,m=g-1;_<m;_+=c){const d=fs(this,e,xr,l,_,_+1,_);d&&t.push(d)}if(this.isLineLoop){const _=fs(this,e,xr,l,g-1,p,g-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function fs(r,e,t,n,i,s,a){const o=r.geometry.attributes.position;if(Ds.fromBufferAttribute(o,i),Us.fromBufferAttribute(o,s),t.distanceSqToSegment(Ds,Us,va,qc)>n)return;va.applyMatrix4(r.matrixWorld);const c=e.ray.origin.distanceTo(va);if(!(c<e.near||c>e.far))return{distance:c,point:qc.clone().applyMatrix4(r.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:r}}const Yc=new U,Kc=new U;class wf extends $o{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,s=t.count;i<s;i+=2)Yc.fromBufferAttribute(t,i),Kc.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Yc.distanceTo(Kc);e.setAttribute("lineDistance",new Ht(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Rf extends $o{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class pu extends En{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ze(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const jc=new Xe,Ao=new kr,ds=new An,ps=new U;class Cf extends _t{constructor(e=new rn,t=new pu){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ds.copy(n.boundingSphere),ds.applyMatrix4(i),ds.radius+=s,e.ray.intersectsSphere(ds)===!1)return;jc.copy(i).invert(),Ao.copy(e.ray).applyMatrix4(jc);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,h=n.attributes.position;if(c!==null){const f=Math.max(0,a.start),p=Math.min(c.count,a.start+a.count);for(let g=f,_=p;g<_;g++){const m=c.getX(g);ps.fromBufferAttribute(h,m),Zc(ps,m,l,i,e,t,this)}}else{const f=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let g=f,_=p;g<_;g++)ps.fromBufferAttribute(h,g),Zc(ps,g,l,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Zc(r,e,t,n,i,s,a){const o=Ao.distanceSqToPoint(r);if(o<t){const l=new U;Ao.closestPointToPoint(r,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class Fs extends wt{constructor(e,t,n,i,s,a,o,l,c){super(e,t,n,i,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Jo extends wt{constructor(e,t,n=oi,i,s,a,o=kt,l=kt,c,u=Pr,h=1){if(u!==Pr&&u!==Lr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:h};super(f,i,s,a,o,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new qo(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class mu extends wt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}function Pf(r,e,t=2){const n=e&&e.length,i=n?e[0]*t:r.length;let s=gu(r,0,i,t,!0);const a=[];if(!s||s.next===s.prev)return a;let o,l,c;if(n&&(s=Nf(r,e,s,t)),r.length>80*t){o=1/0,l=1/0;let u=-1/0,h=-1/0;for(let f=t;f<i;f+=t){const p=r[f],g=r[f+1];p<o&&(o=p),g<l&&(l=g),p>u&&(u=p),g>h&&(h=g)}c=Math.max(u-o,h-l),c=c!==0?32767/c:0}return Fr(s,a,t,o,l,c,0),a}function gu(r,e,t,n,i){let s;if(i===qf(r,e,t,n)>0)for(let a=e;a<t;a+=n)s=$c(a/n|0,r[a],r[a+1],s);else for(let a=t-n;a>=e;a-=n)s=$c(a/n|0,r[a],r[a+1],s);return s&&tr(s,s.next)&&(Br(s),s=s.next),s}function Ei(r,e){if(!r)return r;e||(e=r);let t=r,n;do if(n=!1,!t.steiner&&(tr(t,t.next)||yt(t.prev,t,t.next)===0)){if(Br(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Fr(r,e,t,n,i,s,a){if(!r)return;!a&&s&&kf(r,n,i,s);let o=r;for(;r.prev!==r.next;){const l=r.prev,c=r.next;if(s?If(r,n,i,s):Lf(r)){e.push(l.i,r.i,c.i),Br(r),r=c.next,o=c.next;continue}if(r=c,r===o){a?a===1?(r=Df(Ei(r),e),Fr(r,e,t,n,i,s,2)):a===2&&Uf(r,e,t,n,i,s):Fr(Ei(r),e,t,n,i,s,1);break}}}function Lf(r){const e=r.prev,t=r,n=r.next;if(yt(e,t,n)>=0)return!1;const i=e.x,s=t.x,a=n.x,o=e.y,l=t.y,c=n.y,u=Math.min(i,s,a),h=Math.min(o,l,c),f=Math.max(i,s,a),p=Math.max(o,l,c);let g=n.next;for(;g!==e;){if(g.x>=u&&g.x<=f&&g.y>=h&&g.y<=p&&Er(i,o,s,l,a,c,g.x,g.y)&&yt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function If(r,e,t,n){const i=r.prev,s=r,a=r.next;if(yt(i,s,a)>=0)return!1;const o=i.x,l=s.x,c=a.x,u=i.y,h=s.y,f=a.y,p=Math.min(o,l,c),g=Math.min(u,h,f),_=Math.max(o,l,c),m=Math.max(u,h,f),d=wo(p,g,e,t,n),b=wo(_,m,e,t,n);let M=r.prevZ,v=r.nextZ;for(;M&&M.z>=d&&v&&v.z<=b;){if(M.x>=p&&M.x<=_&&M.y>=g&&M.y<=m&&M!==i&&M!==a&&Er(o,u,l,h,c,f,M.x,M.y)&&yt(M.prev,M,M.next)>=0||(M=M.prevZ,v.x>=p&&v.x<=_&&v.y>=g&&v.y<=m&&v!==i&&v!==a&&Er(o,u,l,h,c,f,v.x,v.y)&&yt(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;M&&M.z>=d;){if(M.x>=p&&M.x<=_&&M.y>=g&&M.y<=m&&M!==i&&M!==a&&Er(o,u,l,h,c,f,M.x,M.y)&&yt(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;v&&v.z<=b;){if(v.x>=p&&v.x<=_&&v.y>=g&&v.y<=m&&v!==i&&v!==a&&Er(o,u,l,h,c,f,v.x,v.y)&&yt(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function Df(r,e){let t=r;do{const n=t.prev,i=t.next.next;!tr(n,i)&&xu(n,t,t.next,i)&&Or(n,i)&&Or(i,n)&&(e.push(n.i,t.i,i.i),Br(t),Br(t.next),t=r=i),t=t.next}while(t!==r);return Ei(t)}function Uf(r,e,t,n,i,s){let a=r;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Gf(a,o)){let l=vu(a,o);a=Ei(a,a.next),l=Ei(l,l.next),Fr(a,e,t,n,i,s,0),Fr(l,e,t,n,i,s,0);return}o=o.next}a=a.next}while(a!==r)}function Nf(r,e,t,n){const i=[];for(let s=0,a=e.length;s<a;s++){const o=e[s]*n,l=s<a-1?e[s+1]*n:r.length,c=gu(r,o,l,n,!1);c===c.next&&(c.steiner=!0),i.push(Vf(c))}i.sort(Ff);for(let s=0;s<i.length;s++)t=Of(i[s],t);return t}function Ff(r,e){let t=r.x-e.x;if(t===0&&(t=r.y-e.y,t===0)){const n=(r.next.y-r.y)/(r.next.x-r.x),i=(e.next.y-e.y)/(e.next.x-e.x);t=n-i}return t}function Of(r,e){const t=Bf(r,e);if(!t)return e;const n=vu(t,r);return Ei(n,n.next),Ei(t,t.next)}function Bf(r,e){let t=e;const n=r.x,i=r.y;let s=-1/0,a;if(tr(r,t))return t;do{if(tr(r,t.next))return t.next;if(i<=t.y&&i>=t.next.y&&t.next.y!==t.y){const h=t.x+(i-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(h<=n&&h>s&&(s=h,a=t.x<t.next.x?t:t.next,h===n))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,l=a.x,c=a.y;let u=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&_u(i<c?n:s,i,l,c,i<c?s:n,i,t.x,t.y)){const h=Math.abs(i-t.y)/(n-t.x);Or(t,r)&&(h<u||h===u&&(t.x>a.x||t.x===a.x&&zf(a,t)))&&(a=t,u=h)}t=t.next}while(t!==o);return a}function zf(r,e){return yt(r.prev,r,e.prev)<0&&yt(e.next,r,r.next)<0}function kf(r,e,t,n){let i=r;do i.z===0&&(i.z=wo(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==r);i.prevZ.nextZ=null,i.prevZ=null,Hf(i)}function Hf(r){let e,t=1;do{let n=r,i;r=null;let s=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(i=n,n=n.nextZ,o--):(i=a,a=a.nextZ,l--),s?s.nextZ=i:r=i,i.prevZ=s,s=i;n=a}s.nextZ=null,t*=2}while(e>1);return r}function wo(r,e,t,n,i){return r=(r-t)*i|0,e=(e-n)*i|0,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,r|e<<1}function Vf(r){let e=r,t=r;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==r);return t}function _u(r,e,t,n,i,s,a,o){return(i-a)*(e-o)>=(r-a)*(s-o)&&(r-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(s-o)>=(i-a)*(n-o)}function Er(r,e,t,n,i,s,a,o){return!(r===a&&e===o)&&_u(r,e,t,n,i,s,a,o)}function Gf(r,e){return r.next.i!==e.i&&r.prev.i!==e.i&&!Wf(r,e)&&(Or(r,e)&&Or(e,r)&&Xf(r,e)&&(yt(r.prev,r,e.prev)||yt(r,e.prev,e))||tr(r,e)&&yt(r.prev,r,r.next)>0&&yt(e.prev,e,e.next)>0)}function yt(r,e,t){return(e.y-r.y)*(t.x-e.x)-(e.x-r.x)*(t.y-e.y)}function tr(r,e){return r.x===e.x&&r.y===e.y}function xu(r,e,t,n){const i=gs(yt(r,e,t)),s=gs(yt(r,e,n)),a=gs(yt(t,n,r)),o=gs(yt(t,n,e));return!!(i!==s&&a!==o||i===0&&ms(r,t,e)||s===0&&ms(r,n,e)||a===0&&ms(t,r,n)||o===0&&ms(t,e,n))}function ms(r,e,t){return e.x<=Math.max(r.x,t.x)&&e.x>=Math.min(r.x,t.x)&&e.y<=Math.max(r.y,t.y)&&e.y>=Math.min(r.y,t.y)}function gs(r){return r>0?1:r<0?-1:0}function Wf(r,e){let t=r;do{if(t.i!==r.i&&t.next.i!==r.i&&t.i!==e.i&&t.next.i!==e.i&&xu(t,t.next,r,e))return!0;t=t.next}while(t!==r);return!1}function Or(r,e){return yt(r.prev,r,r.next)<0?yt(r,e,r.next)>=0&&yt(r,r.prev,e)>=0:yt(r,e,r.prev)<0||yt(r,r.next,e)<0}function Xf(r,e){let t=r,n=!1;const i=(r.x+e.x)/2,s=(r.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&i<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==r);return n}function vu(r,e){const t=Ro(r.i,r.x,r.y),n=Ro(e.i,e.x,e.y),i=r.next,s=e.prev;return r.next=e,e.prev=r,t.next=i,i.prev=t,n.next=t,t.prev=n,s.next=n,n.prev=s,n}function $c(r,e,t,n){const i=Ro(r,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Br(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function Ro(r,e,t){return{i:r,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function qf(r,e,t,n){let i=0;for(let s=e,a=t-n;s<t;s+=n)i+=(r[a]-r[s])*(r[s+1]+r[a+1]),a=s;return i}class Yf{static triangulate(e,t,n=2){return Pf(e,t,n)}}class Os{static area(e){const t=e.length;let n=0;for(let i=t-1,s=0;s<t;i=s++)n+=e[i].x*e[s].y-e[s].x*e[i].y;return n*.5}static isClockWise(e){return Os.area(e)<0}static triangulateShape(e,t){const n=[],i=[],s=[];Jc(e),Qc(n,e);let a=e.length;t.forEach(Jc);for(let l=0;l<t.length;l++)i.push(a),a+=t[l].length,Qc(n,t[l]);const o=Yf.triangulate(n,i);for(let l=0;l<o.length;l+=3)s.push(o.slice(l,l+3));return s}}function Jc(r){const e=r.length;e>2&&r[e-1].equals(r[0])&&r.pop()}function Qc(r,e){for(let t=0;t<e.length;t++)r.push(e[t].x),r.push(e[t].y)}class kn extends rn{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const s=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,u=l+1,h=e/o,f=t/l,p=[],g=[],_=[],m=[];for(let d=0;d<u;d++){const b=d*f-a;for(let M=0;M<c;M++){const v=M*h-s;g.push(v,-b,0),_.push(0,0,1),m.push(M/o),m.push(1-d/l)}}for(let d=0;d<l;d++)for(let b=0;b<o;b++){const M=b+c*d,v=b+c*(d+1),R=b+1+c*(d+1),P=b+1+c*d;p.push(M,v,P),p.push(v,R,P)}this.setIndex(p),this.setAttribute("position",new Ht(g,3)),this.setAttribute("normal",new Ht(_,3)),this.setAttribute("uv",new Ht(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new kn(e.width,e.height,e.widthSegments,e.heightSegments)}}class Qo extends rn{constructor(e=.5,t=1,n=32,i=1,s=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:s,thetaLength:a},n=Math.max(3,n),i=Math.max(1,i);const o=[],l=[],c=[],u=[];let h=e;const f=(t-e)/i,p=new U,g=new Be;for(let _=0;_<=i;_++){for(let m=0;m<=n;m++){const d=s+m/n*a;p.x=h*Math.cos(d),p.y=h*Math.sin(d),l.push(p.x,p.y,p.z),c.push(0,0,1),g.x=(p.x/t+1)/2,g.y=(p.y/t+1)/2,u.push(g.x,g.y)}h+=f}for(let _=0;_<i;_++){const m=_*(n+1);for(let d=0;d<n;d++){const b=d+m,M=b,v=b+n+1,R=b+n+2,P=b+1;o.push(M,v,P),o.push(v,R,P)}}this.setIndex(o),this.setAttribute("position",new Ht(l,3)),this.setAttribute("normal",new Ht(c,3)),this.setAttribute("uv",new Ht(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Qo(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Vr extends En{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ze(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ze(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=tu,this.normalScale=new Be(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class wn extends Vr{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Be(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return $e(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new ze(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new ze(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ze(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class Kf extends En{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=vh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class jf extends En{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function _s(r,e){return!r||r.constructor===e?r:typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r)}function Zf(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}function $f(r){function e(i,s){return r[i]-r[s]}const t=r.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function el(r,e,t){const n=r.length,i=new r.constructor(n);for(let s=0,a=0;a!==n;++s){const o=t[s]*e;for(let l=0;l!==e;++l)i[a++]=r[o+l]}return i}function Mu(r,e,t,n){let i=1,s=r[0];for(;s!==void 0&&s[n]===void 0;)s=r[i++];if(s===void 0)return;let a=s[n];if(a!==void 0)if(Array.isArray(a))do a=s[n],a!==void 0&&(e.push(s.time),t.push(...a)),s=r[i++];while(s!==void 0);else if(a.toArray!==void 0)do a=s[n],a!==void 0&&(e.push(s.time),a.toArray(t,t.length)),s=r[i++];while(s!==void 0);else do a=s[n],a!==void 0&&(e.push(s.time),t.push(a)),s=r[i++];while(s!==void 0)}class Gr{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],s=t[n-1];n:{e:{let a;t:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(s=i,i=t[++n],e<i)break e}a=t.length;break t}if(!(e>=s)){const o=t[1];e<o&&(n=2,s=o);for(let l=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=s,s=t[--n-1],e>=s)break e}a=n,n=0;break t}break n}for(;n<a;){const o=n+a>>>1;e<t[o]?a=o:n=o+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let a=0;a!==i;++a)t[a]=n[s+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class Jf extends Gr{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:dc,endingEnd:dc}}intervalChanged_(e,t,n){const i=this.parameterPositions;let s=e-2,a=e+1,o=i[s],l=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case pc:s=e,o=2*t-n;break;case mc:s=i.length-2,o=t+i[s]-i[s+1];break;default:s=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case pc:a=e,l=2*n-t;break;case mc:a=1,l=n+i[1]-i[0];break;default:a=e-1,l=t}const c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=s*u,this._offsetNext=a*u}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this._offsetPrev,h=this._offsetNext,f=this._weightPrev,p=this._weightNext,g=(n-t)/(i-t),_=g*g,m=_*g,d=-f*m+2*f*_-f*g,b=(1+f)*m+(-1.5-2*f)*_+(-.5+f)*g+1,M=(-1-p)*m+(1.5+p)*_+.5*g,v=p*m-p*_;for(let R=0;R!==o;++R)s[R]=d*a[u+R]+b*a[c+R]+M*a[l+R]+v*a[h+R];return s}}class Qf extends Gr{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=(n-t)/(i-t),h=1-u;for(let f=0;f!==o;++f)s[f]=a[c+f]*h+a[l+f]*u;return s}}class ed extends Gr{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class gn{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=_s(t,this.TimeBufferType),this.values=_s(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:_s(e.times,Array),values:_s(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new ed(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Qf(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Jf(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Ir:t=this.InterpolantFactoryMethodDiscrete;break;case Dr:t=this.InterpolantFactoryMethodLinear;break;case Ks:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ir;case this.InterpolantFactoryMethodLinear:return Dr;case this.InterpolantFactoryMethodSmooth:return Ks}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){const n=this.times,i=n.length;let s=0,a=i-1;for(;s!==i&&n[s]<e;)++s;for(;a!==-1&&n[a]>t;)--a;if(++a,s!==0||a!==i){s>=a&&(a=Math.max(a,1),s=a-1);const o=this.getValueSize();this.times=n.slice(s,a),this.values=this.values.slice(s*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,s=n.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==s;o++){const l=n[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(i!==void 0&&Zf(i))for(let o=0,l=i.length;o!==l;++o){const c=i[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Ks,s=e.length-1;let a=1;for(let o=1;o<s;++o){let l=!1;const c=e[o],u=e[o+1];if(c!==u&&(o!==1||c!==e[0]))if(i)l=!0;else{const h=o*n,f=h-n,p=h+n;for(let g=0;g!==n;++g){const _=t[h+g];if(_!==t[f+g]||_!==t[p+g]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];const h=o*n,f=a*n;for(let p=0;p!==n;++p)t[f+p]=t[h+p]}++a}}if(s>0){e[a]=e[s];for(let o=s*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}}gn.prototype.ValueTypeName="";gn.prototype.TimeBufferType=Float32Array;gn.prototype.ValueBufferType=Float32Array;gn.prototype.DefaultInterpolation=Dr;class or extends gn{constructor(e,t,n){super(e,t,n)}}or.prototype.ValueTypeName="bool";or.prototype.ValueBufferType=Array;or.prototype.DefaultInterpolation=Ir;or.prototype.InterpolantFactoryMethodLinear=void 0;or.prototype.InterpolantFactoryMethodSmooth=void 0;class yu extends gn{constructor(e,t,n,i){super(e,t,n,i)}}yu.prototype.ValueTypeName="color";class nr extends gn{constructor(e,t,n,i){super(e,t,n,i)}}nr.prototype.ValueTypeName="number";class td extends Gr{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(i-t);let c=e*o;for(let u=c+o;c!==u;c+=4)li.slerpFlat(s,0,a,c-o,a,c,l);return s}}class ir extends gn{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new td(this.times,this.values,this.getValueSize(),e)}}ir.prototype.ValueTypeName="quaternion";ir.prototype.InterpolantFactoryMethodSmooth=void 0;class cr extends gn{constructor(e,t,n){super(e,t,n)}}cr.prototype.ValueTypeName="string";cr.prototype.ValueBufferType=Array;cr.prototype.DefaultInterpolation=Ir;cr.prototype.InterpolantFactoryMethodLinear=void 0;cr.prototype.InterpolantFactoryMethodSmooth=void 0;class rr extends gn{constructor(e,t,n,i){super(e,t,n,i)}}rr.prototype.ValueTypeName="vector";class nd{constructor(e="",t=-1,n=[],i=_h){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=pn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(rd(n[a]).scale(i));const s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s.userData=JSON.parse(e.userData||"{}"),s}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let s=0,a=n.length;s!==a;++s)t.push(gn.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const s=t.length,a=[];for(let o=0;o<s;o++){let l=[],c=[];l.push((o+s-1)%s,o,(o+1)%s),c.push(0,1,0);const u=$f(l);l=el(l,1,u),c=el(c,1,u),!i&&l[0]===0&&(l.push(s),c.push(c[0])),a.push(new nr(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},s=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){const c=e[o],u=c.name.match(s);if(u&&u.length>1){const h=u[1];let f=i[h];f||(i[h]=f=[]),f.push(c)}}const a=[];for(const o in i)a.push(this.CreateFromMorphTargetSequence(o,i[o],t,n));return a}static parseAnimation(e,t){if(console.warn("THREE.AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(h,f,p,g,_){if(p.length!==0){const m=[],d=[];Mu(p,m,d,g),m.length!==0&&_.push(new h(f,m,d))}},i=[],s=e.name||"default",a=e.fps||30,o=e.blendMode;let l=e.length||-1;const c=e.hierarchy||[];for(let h=0;h<c.length;h++){const f=c[h].keys;if(!(!f||f.length===0))if(f[0].morphTargets){const p={};let g;for(g=0;g<f.length;g++)if(f[g].morphTargets)for(let _=0;_<f[g].morphTargets.length;_++)p[f[g].morphTargets[_]]=-1;for(const _ in p){const m=[],d=[];for(let b=0;b!==f[g].morphTargets.length;++b){const M=f[g];m.push(M.time),d.push(M.morphTarget===_?1:0)}i.push(new nr(".morphTargetInfluence["+_+"]",m,d))}l=p.length*a}else{const p=".bones["+t[h].name+"]";n(rr,p+".position",f,"pos",i),n(ir,p+".quaternion",f,"rot",i),n(rr,p+".scale",f,"scl",i)}}return i.length===0?null:new this(s,l,i,o)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function id(r){switch(r.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return nr;case"vector":case"vector2":case"vector3":case"vector4":return rr;case"color":return yu;case"quaternion":return ir;case"bool":case"boolean":return or;case"string":return cr}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+r)}function rd(r){if(r.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=id(r.type);if(r.times===void 0){const t=[],n=[];Mu(r.keys,t,n,"value"),r.times=t,r.values=n}return e.parse!==void 0?e.parse(r):new e(r.name,r.times,r.values,r.interpolation)}const Bn={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(this.files[r]=e)},get:function(r){if(this.enabled!==!1)return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};class sd{constructor(e,t,n){const i=this;let s=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(u){o++,s===!1&&i.onStart!==void 0&&i.onStart(u,a,o),s=!0},this.itemEnd=function(u){a++,i.onProgress!==void 0&&i.onProgress(u,a,o),a===o&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(u){i.onError!==void 0&&i.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){const h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,f=c.length;h<f;h+=2){const p=c[h],g=c[h+1];if(p.global&&(p.lastIndex=0),p.test(u))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}}const ad=new sd;class lr{constructor(e){this.manager=e!==void 0?e:ad,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}lr.DEFAULT_MATERIAL_NAME="__DEFAULT";const Nn={};class od extends Error{constructor(e,t){super(e),this.response=t}}class Su extends lr{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=Bn.get(`file:${e}`);if(s!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0),s;if(Nn[e]!==void 0){Nn[e].push({onLoad:t,onProgress:n,onError:i});return}Nn[e]=[],Nn[e].push({onLoad:t,onProgress:n,onError:i});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const u=Nn[e],h=c.body.getReader(),f=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),p=f?parseInt(f):0,g=p!==0;let _=0;const m=new ReadableStream({start(d){b();function b(){h.read().then(({done:M,value:v})=>{if(M)d.close();else{_+=v.byteLength;const R=new ProgressEvent("progress",{lengthComputable:g,loaded:_,total:p});for(let P=0,L=u.length;P<L;P++){const F=u[P];F.onProgress&&F.onProgress(R)}d.enqueue(v),b()}},M=>{d.error(M)})}}});return new Response(m)}else throw new od(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,o));case"json":return c.json();default:if(o==="")return c.text();{const h=/charset="?([^;"\s]*)"?/i.exec(o),f=h&&h[1]?h[1].toLowerCase():void 0,p=new TextDecoder(f);return c.arrayBuffer().then(g=>p.decode(g))}}}).then(c=>{Bn.add(`file:${e}`,c);const u=Nn[e];delete Nn[e];for(let h=0,f=u.length;h<f;h++){const p=u[h];p.onLoad&&p.onLoad(c)}}).catch(c=>{const u=Nn[e];if(u===void 0)throw this.manager.itemError(e),c;delete Nn[e];for(let h=0,f=u.length;h<f;h++){const p=u[h];p.onError&&p.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Hi=new WeakMap;class cd extends lr{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=Bn.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0);else{let h=Hi.get(a);h===void 0&&(h=[],Hi.set(a,h)),h.push({onLoad:t,onError:i})}return a}const o=Ur("img");function l(){u(),t&&t(this);const h=Hi.get(this)||[];for(let f=0;f<h.length;f++){const p=h[f];p.onLoad&&p.onLoad(this)}Hi.delete(this),s.manager.itemEnd(e)}function c(h){u(),i&&i(h),Bn.remove(`image:${e}`);const f=Hi.get(this)||[];for(let p=0;p<f.length;p++){const g=f[p];g.onError&&g.onError(h)}Hi.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function u(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Bn.add(`image:${e}`,o),s.manager.itemStart(e),o.src=e,o}}class Eu extends lr{constructor(e){super(e)}load(e,t,n,i){const s=new wt,a=new cd(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o,s.needsUpdate=!0,t!==void 0&&t(s)},n,i),s}}class Bs extends _t{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ze(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class ld extends Bs{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(_t.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ze(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Ma=new Xe,tl=new U,nl=new U;class ec{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Be(512,512),this.mapType=mn,this.map=null,this.mapPass=null,this.matrix=new Xe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Zo,this._frameExtents=new Be(1,1),this._viewportCount=1,this._viewports=[new st(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;tl.setFromMatrixPosition(e.matrixWorld),t.position.copy(tl),nl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(nl),t.updateMatrixWorld(),Ma.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ma,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ma)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class ud extends ec{constructor(){super(new zt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=Qi*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,s=e.distance||t.far;(n!==t.fov||i!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=i,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class hd extends Bs{constructor(e,t,n=0,i=Math.PI/3,s=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(_t.DEFAULT_UP),this.updateMatrix(),this.target=new _t,this.distance=n,this.angle=i,this.penumbra=s,this.decay=a,this.map=null,this.shadow=new ud}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const il=new Xe,vr=new U,ya=new U;class fd extends ec{constructor(){super(new zt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Be(4,2),this._viewportCount=6,this._viewports=[new st(2,1,1,1),new st(0,1,1,1),new st(3,1,1,1),new st(1,1,1,1),new st(3,0,1,1),new st(1,0,1,1)],this._cubeDirections=[new U(1,0,0),new U(-1,0,0),new U(0,0,1),new U(0,0,-1),new U(0,1,0),new U(0,-1,0)],this._cubeUps=[new U(0,1,0),new U(0,1,0),new U(0,1,0),new U(0,1,0),new U(0,0,1),new U(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,i=this.matrix,s=e.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),vr.setFromMatrixPosition(e.matrixWorld),n.position.copy(vr),ya.copy(n.position),ya.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(ya),n.updateMatrixWorld(),i.makeTranslation(-vr.x,-vr.y,-vr.z),il.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(il,n.coordinateSystem,n.reversedDepth)}}class Tu extends Bs{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new fd}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class zs extends lu{constructor(e=-1,t=1,n=1,i=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let s=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class dd extends ec{constructor(){super(new zs(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Co extends Bs{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(_t.DEFAULT_UP),this.updateMatrix(),this.target=new _t,this.shadow=new dd}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class wr{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}const Sa=new WeakMap;class pd extends lr{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=Bn.get(`image-bitmap:${e}`);if(a!==void 0){if(s.manager.itemStart(e),a.then){a.then(c=>{if(Sa.has(a)===!0)i&&i(Sa.get(a)),s.manager.itemError(e),s.manager.itemEnd(e);else return t&&t(c),s.manager.itemEnd(e),c});return}return setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0),a}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(c){return Bn.add(`image-bitmap:${e}`,c),t&&t(c),s.manager.itemEnd(e),c}).catch(function(c){i&&i(c),Sa.set(l,c),Bn.remove(`image-bitmap:${e}`),s.manager.itemError(e),s.manager.itemEnd(e)});Bn.add(`image-bitmap:${e}`,l),s.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}class md extends zt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const tc="\\[\\]\\.:\\/",gd=new RegExp("["+tc+"]","g"),nc="[^"+tc+"]",_d="[^"+tc.replace("\\.","")+"]",xd=/((?:WC+[\/:])*)/.source.replace("WC",nc),vd=/(WCOD+)?/.source.replace("WCOD",_d),Md=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",nc),yd=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",nc),Sd=new RegExp("^"+xd+vd+Md+yd+"$"),Ed=["material","materials","bones","map"];class Td{constructor(e,t,n){const i=n||ct.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class ct{constructor(e,t,n){this.path=t,this.parsedPath=n||ct.parseTrackName(t),this.node=ct.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new ct.Composite(e,t,n):new ct(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(gd,"")}static parseTrackName(e){const t=Sd.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const s=n.nodeName.substring(i+1);Ed.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(s){for(let a=0;a<s.length;a++){const o=s[a];if(o.name===t||o.uuid===t)return o;const l=n(o.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let s=t.propertyIndex;if(e||(e=ct.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const a=e[i];if(a===void 0){const c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}ct.Composite=Td;ct.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ct.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ct.prototype.GetterByBindingType=[ct.prototype._getValue_direct,ct.prototype._getValue_array,ct.prototype._getValue_arrayElement,ct.prototype._getValue_toArray];ct.prototype.SetterByBindingTypeAndVersioning=[[ct.prototype._setValue_direct,ct.prototype._setValue_direct_setNeedsUpdate,ct.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ct.prototype._setValue_array,ct.prototype._setValue_array_setNeedsUpdate,ct.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ct.prototype._setValue_arrayElement,ct.prototype._setValue_arrayElement_setNeedsUpdate,ct.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ct.prototype._setValue_fromArray,ct.prototype._setValue_fromArray_setNeedsUpdate,ct.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];const rl=new Xe;class bd{constructor(e,t,n=0,i=1/0){this.ray=new kr(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Yo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return rl.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(rl),this}intersectObject(e,t=!0,n=[]){return Po(e,this,n,t),n.sort(sl),n}intersectObjects(e,t=!0,n=[]){for(let i=0,s=e.length;i<s;i++)Po(e[i],this,n,t);return n.sort(sl),n}}function sl(r,e){return r.distance-e.distance}function Po(r,e,t,n){let i=!0;if(r.layers.test(e.layers)&&r.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){const s=r.children;for(let a=0,o=s.length;a<o;a++)Po(s[a],e,t,!0)}}function al(r,e,t,n){const i=Ad(n);switch(t){case $l:return r*e;case Ho:return r*e/i.components*i.byteLength;case Vo:return r*e/i.components*i.byteLength;case Ql:return r*e*2/i.components*i.byteLength;case Go:return r*e*2/i.components*i.byteLength;case Jl:return r*e*3/i.components*i.byteLength;case nn:return r*e*4/i.components*i.byteLength;case Wo:return r*e*4/i.components*i.byteLength;case Ts:case bs:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case As:case ws:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Ka:case Za:return Math.max(r,16)*Math.max(e,8)/4;case Ya:case ja:return Math.max(r,8)*Math.max(e,8)/2;case $a:case Ja:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case Qa:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case eo:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case to:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case no:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case io:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case ro:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case so:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case ao:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case oo:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case co:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case lo:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case uo:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case ho:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case fo:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case po:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case mo:case go:case _o:return Math.ceil(r/4)*Math.ceil(e/4)*16;case xo:case vo:return Math.ceil(r/4)*Math.ceil(e/4)*8;case Mo:case yo:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Ad(r){switch(r){case mn:case Yl:return{byteLength:1,components:1};case Rr:case Kl:case sr:return{byteLength:2,components:1};case zo:case ko:return{byteLength:2,components:4};case oi:case Bo:case fn:return{byteLength:4,components:1};case jl:case Zl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Fo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Fo);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function bu(){let r=null,e=!1,t=null,n=null;function i(s,a){t(s,a),n=r.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=r.requestAnimationFrame(i),e=!0)},stop:function(){r.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function wd(r){const e=new WeakMap;function t(o,l){const c=o.array,u=o.usage,h=c.byteLength,f=r.createBuffer();r.bindBuffer(l,f),r.bufferData(l,c,u),o.onUploadCallback();let p;if(c instanceof Float32Array)p=r.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=r.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=r.HALF_FLOAT:p=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=r.SHORT;else if(c instanceof Uint32Array)p=r.UNSIGNED_INT;else if(c instanceof Int32Array)p=r.INT;else if(c instanceof Int8Array)p=r.BYTE;else if(c instanceof Uint8Array)p=r.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:h}}function n(o,l,c){const u=l.array,h=l.updateRanges;if(r.bindBuffer(c,o),h.length===0)r.bufferSubData(c,0,u);else{h.sort((p,g)=>p.start-g.start);let f=0;for(let p=1;p<h.length;p++){const g=h[f],_=h[p];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++f,h[f]=_)}h.length=f+1;for(let p=0,g=h.length;p<g;p++){const _=h[p];r.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(r.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:s,update:a}}var Rd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Cd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Pd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ld=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Id=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Dd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ud=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Nd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Fd=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Od=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Bd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,zd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,kd=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Hd=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Vd=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Gd=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Wd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Xd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,qd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Yd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Kd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,jd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Zd=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,$d=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Jd=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Qd=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,ep=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,tp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,np=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ip=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,rp="gl_FragColor = linearToOutputTexel( gl_FragColor );",sp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,ap=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,op=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,cp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,lp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,up=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,hp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,dp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,pp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,mp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,gp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,_p=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,xp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,vp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Mp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,yp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Sp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ep=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Tp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,bp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Ap=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,wp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Rp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Cp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Pp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Lp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ip=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Dp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Up=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Np=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Fp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Op=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Bp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,zp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,kp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Hp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Vp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Gp=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Wp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Xp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,qp=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Yp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Kp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,jp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Zp=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,$p=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Jp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Qp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,em=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,tm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,nm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,im=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,rm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,sm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,am=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,om=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,cm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,lm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,um=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,hm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,fm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,dm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,pm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,mm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,gm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,_m=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,xm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,vm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Mm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,ym=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Sm=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Em=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Tm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,bm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Am=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const wm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Rm=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Pm=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Lm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Im=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Dm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Um=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Nm=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Fm=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Om=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Bm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zm=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,km=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Hm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Vm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Gm=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Wm=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Xm=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,qm=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ym=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Km=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,jm=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Zm=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$m=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Jm=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Qm=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,eg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,tg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,ng=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ig=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,rg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,sg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ag=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ye={alphahash_fragment:Rd,alphahash_pars_fragment:Cd,alphamap_fragment:Pd,alphamap_pars_fragment:Ld,alphatest_fragment:Id,alphatest_pars_fragment:Dd,aomap_fragment:Ud,aomap_pars_fragment:Nd,batching_pars_vertex:Fd,batching_vertex:Od,begin_vertex:Bd,beginnormal_vertex:zd,bsdfs:kd,iridescence_fragment:Hd,bumpmap_pars_fragment:Vd,clipping_planes_fragment:Gd,clipping_planes_pars_fragment:Wd,clipping_planes_pars_vertex:Xd,clipping_planes_vertex:qd,color_fragment:Yd,color_pars_fragment:Kd,color_pars_vertex:jd,color_vertex:Zd,common:$d,cube_uv_reflection_fragment:Jd,defaultnormal_vertex:Qd,displacementmap_pars_vertex:ep,displacementmap_vertex:tp,emissivemap_fragment:np,emissivemap_pars_fragment:ip,colorspace_fragment:rp,colorspace_pars_fragment:sp,envmap_fragment:ap,envmap_common_pars_fragment:op,envmap_pars_fragment:cp,envmap_pars_vertex:lp,envmap_physical_pars_fragment:Mp,envmap_vertex:up,fog_vertex:hp,fog_pars_vertex:fp,fog_fragment:dp,fog_pars_fragment:pp,gradientmap_pars_fragment:mp,lightmap_pars_fragment:gp,lights_lambert_fragment:_p,lights_lambert_pars_fragment:xp,lights_pars_begin:vp,lights_toon_fragment:yp,lights_toon_pars_fragment:Sp,lights_phong_fragment:Ep,lights_phong_pars_fragment:Tp,lights_physical_fragment:bp,lights_physical_pars_fragment:Ap,lights_fragment_begin:wp,lights_fragment_maps:Rp,lights_fragment_end:Cp,logdepthbuf_fragment:Pp,logdepthbuf_pars_fragment:Lp,logdepthbuf_pars_vertex:Ip,logdepthbuf_vertex:Dp,map_fragment:Up,map_pars_fragment:Np,map_particle_fragment:Fp,map_particle_pars_fragment:Op,metalnessmap_fragment:Bp,metalnessmap_pars_fragment:zp,morphinstance_vertex:kp,morphcolor_vertex:Hp,morphnormal_vertex:Vp,morphtarget_pars_vertex:Gp,morphtarget_vertex:Wp,normal_fragment_begin:Xp,normal_fragment_maps:qp,normal_pars_fragment:Yp,normal_pars_vertex:Kp,normal_vertex:jp,normalmap_pars_fragment:Zp,clearcoat_normal_fragment_begin:$p,clearcoat_normal_fragment_maps:Jp,clearcoat_pars_fragment:Qp,iridescence_pars_fragment:em,opaque_fragment:tm,packing:nm,premultiplied_alpha_fragment:im,project_vertex:rm,dithering_fragment:sm,dithering_pars_fragment:am,roughnessmap_fragment:om,roughnessmap_pars_fragment:cm,shadowmap_pars_fragment:lm,shadowmap_pars_vertex:um,shadowmap_vertex:hm,shadowmask_pars_fragment:fm,skinbase_vertex:dm,skinning_pars_vertex:pm,skinning_vertex:mm,skinnormal_vertex:gm,specularmap_fragment:_m,specularmap_pars_fragment:xm,tonemapping_fragment:vm,tonemapping_pars_fragment:Mm,transmission_fragment:ym,transmission_pars_fragment:Sm,uv_pars_fragment:Em,uv_pars_vertex:Tm,uv_vertex:bm,worldpos_vertex:Am,background_vert:wm,background_frag:Rm,backgroundCube_vert:Cm,backgroundCube_frag:Pm,cube_vert:Lm,cube_frag:Im,depth_vert:Dm,depth_frag:Um,distanceRGBA_vert:Nm,distanceRGBA_frag:Fm,equirect_vert:Om,equirect_frag:Bm,linedashed_vert:zm,linedashed_frag:km,meshbasic_vert:Hm,meshbasic_frag:Vm,meshlambert_vert:Gm,meshlambert_frag:Wm,meshmatcap_vert:Xm,meshmatcap_frag:qm,meshnormal_vert:Ym,meshnormal_frag:Km,meshphong_vert:jm,meshphong_frag:Zm,meshphysical_vert:$m,meshphysical_frag:Jm,meshtoon_vert:Qm,meshtoon_frag:eg,points_vert:tg,points_frag:ng,shadow_vert:ig,shadow_frag:rg,sprite_vert:sg,sprite_frag:ag},fe={common:{diffuse:{value:new ze(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new qe}},envmap:{envMap:{value:null},envMapRotation:{value:new qe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new qe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new qe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new qe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new qe},normalScale:{value:new Be(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new qe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new qe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new qe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new qe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ze(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ze(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0},uvTransform:{value:new qe}},sprite:{diffuse:{value:new ze(16777215)},opacity:{value:1},center:{value:new Be(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}}},vn={basic:{uniforms:Bt([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.fog]),vertexShader:Ye.meshbasic_vert,fragmentShader:Ye.meshbasic_frag},lambert:{uniforms:Bt([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new ze(0)}}]),vertexShader:Ye.meshlambert_vert,fragmentShader:Ye.meshlambert_frag},phong:{uniforms:Bt([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new ze(0)},specular:{value:new ze(1118481)},shininess:{value:30}}]),vertexShader:Ye.meshphong_vert,fragmentShader:Ye.meshphong_frag},standard:{uniforms:Bt([fe.common,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.roughnessmap,fe.metalnessmap,fe.fog,fe.lights,{emissive:{value:new ze(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag},toon:{uniforms:Bt([fe.common,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.gradientmap,fe.fog,fe.lights,{emissive:{value:new ze(0)}}]),vertexShader:Ye.meshtoon_vert,fragmentShader:Ye.meshtoon_frag},matcap:{uniforms:Bt([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,{matcap:{value:null}}]),vertexShader:Ye.meshmatcap_vert,fragmentShader:Ye.meshmatcap_frag},points:{uniforms:Bt([fe.points,fe.fog]),vertexShader:Ye.points_vert,fragmentShader:Ye.points_frag},dashed:{uniforms:Bt([fe.common,fe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ye.linedashed_vert,fragmentShader:Ye.linedashed_frag},depth:{uniforms:Bt([fe.common,fe.displacementmap]),vertexShader:Ye.depth_vert,fragmentShader:Ye.depth_frag},normal:{uniforms:Bt([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,{opacity:{value:1}}]),vertexShader:Ye.meshnormal_vert,fragmentShader:Ye.meshnormal_frag},sprite:{uniforms:Bt([fe.sprite,fe.fog]),vertexShader:Ye.sprite_vert,fragmentShader:Ye.sprite_frag},background:{uniforms:{uvTransform:{value:new qe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ye.background_vert,fragmentShader:Ye.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new qe}},vertexShader:Ye.backgroundCube_vert,fragmentShader:Ye.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ye.cube_vert,fragmentShader:Ye.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ye.equirect_vert,fragmentShader:Ye.equirect_frag},distanceRGBA:{uniforms:Bt([fe.common,fe.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ye.distanceRGBA_vert,fragmentShader:Ye.distanceRGBA_frag},shadow:{uniforms:Bt([fe.lights,fe.fog,{color:{value:new ze(0)},opacity:{value:1}}]),vertexShader:Ye.shadow_vert,fragmentShader:Ye.shadow_frag}};vn.physical={uniforms:Bt([vn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new qe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new qe},clearcoatNormalScale:{value:new Be(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new qe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new qe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new qe},sheen:{value:0},sheenColor:{value:new ze(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new qe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new qe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new qe},transmissionSamplerSize:{value:new Be},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new qe},attenuationDistance:{value:0},attenuationColor:{value:new ze(0)},specularColor:{value:new ze(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new qe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new qe},anisotropyVector:{value:new Be},anisotropyMap:{value:null},anisotropyMapTransform:{value:new qe}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag};const xs={r:0,b:0,g:0},mi=new bn,og=new Xe;function cg(r,e,t,n,i,s,a){const o=new ze(0);let l=s===!0?0:1,c,u,h=null,f=0,p=null;function g(M){let v=M.isScene===!0?M.background:null;return v&&v.isTexture&&(v=(M.backgroundBlurriness>0?t:e).get(v)),v}function _(M){let v=!1;const R=g(M);R===null?d(o,l):R&&R.isColor&&(d(R,1),v=!0);const P=r.xr.getEnvironmentBlendMode();P==="additive"?n.buffers.color.setClear(0,0,0,1,a):P==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(r.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function m(M,v){const R=g(v);R&&(R.isCubeTexture||R.mapping===Ns)?(u===void 0&&(u=new At(new Hr(1,1,1),new Wn({name:"BackgroundCubeMaterial",uniforms:er(vn.backgroundCube.uniforms),vertexShader:vn.backgroundCube.vertexShader,fragmentShader:vn.backgroundCube.fragmentShader,side:qt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(P,L,F){this.matrixWorld.copyPosition(F.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(u)),mi.copy(v.backgroundRotation),mi.x*=-1,mi.y*=-1,mi.z*=-1,R.isCubeTexture&&R.isRenderTargetTexture===!1&&(mi.y*=-1,mi.z*=-1),u.material.uniforms.envMap.value=R,u.material.uniforms.flipEnvMap.value=R.isCubeTexture&&R.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(og.makeRotationFromEuler(mi)),u.material.toneMapped=tt.getTransfer(R.colorSpace)!==ht,(h!==R||f!==R.version||p!==r.toneMapping)&&(u.material.needsUpdate=!0,h=R,f=R.version,p=r.toneMapping),u.layers.enableAll(),M.unshift(u,u.geometry,u.material,0,0,null)):R&&R.isTexture&&(c===void 0&&(c=new At(new kn(2,2),new Wn({name:"BackgroundMaterial",uniforms:er(vn.background.uniforms),vertexShader:vn.background.vertexShader,fragmentShader:vn.background.fragmentShader,side:Vn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=R,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=tt.getTransfer(R.colorSpace)!==ht,R.matrixAutoUpdate===!0&&R.updateMatrix(),c.material.uniforms.uvTransform.value.copy(R.matrix),(h!==R||f!==R.version||p!==r.toneMapping)&&(c.material.needsUpdate=!0,h=R,f=R.version,p=r.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function d(M,v){M.getRGB(xs,cu(r)),n.buffers.color.setClear(xs.r,xs.g,xs.b,v,a)}function b(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(M,v=1){o.set(M),l=v,d(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(M){l=M,d(o,l)},render:_,addToRenderList:m,dispose:b}}function lg(r,e){const t=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=f(null);let s=i,a=!1;function o(T,E,C,D,k){let H=!1;const W=h(D,C,E);s!==W&&(s=W,c(s.object)),H=p(T,D,C,k),H&&g(T,D,C,k),k!==null&&e.update(k,r.ELEMENT_ARRAY_BUFFER),(H||a)&&(a=!1,v(T,E,C,D),k!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(k).buffer))}function l(){return r.createVertexArray()}function c(T){return r.bindVertexArray(T)}function u(T){return r.deleteVertexArray(T)}function h(T,E,C){const D=C.wireframe===!0;let k=n[T.id];k===void 0&&(k={},n[T.id]=k);let H=k[E.id];H===void 0&&(H={},k[E.id]=H);let W=H[D];return W===void 0&&(W=f(l()),H[D]=W),W}function f(T){const E=[],C=[],D=[];for(let k=0;k<t;k++)E[k]=0,C[k]=0,D[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:E,enabledAttributes:C,attributeDivisors:D,object:T,attributes:{},index:null}}function p(T,E,C,D){const k=s.attributes,H=E.attributes;let W=0;const Y=C.getAttributes();for(const V in Y)if(Y[V].location>=0){const oe=k[V];let ye=H[V];if(ye===void 0&&(V==="instanceMatrix"&&T.instanceMatrix&&(ye=T.instanceMatrix),V==="instanceColor"&&T.instanceColor&&(ye=T.instanceColor)),oe===void 0||oe.attribute!==ye||ye&&oe.data!==ye.data)return!0;W++}return s.attributesNum!==W||s.index!==D}function g(T,E,C,D){const k={},H=E.attributes;let W=0;const Y=C.getAttributes();for(const V in Y)if(Y[V].location>=0){let oe=H[V];oe===void 0&&(V==="instanceMatrix"&&T.instanceMatrix&&(oe=T.instanceMatrix),V==="instanceColor"&&T.instanceColor&&(oe=T.instanceColor));const ye={};ye.attribute=oe,oe&&oe.data&&(ye.data=oe.data),k[V]=ye,W++}s.attributes=k,s.attributesNum=W,s.index=D}function _(){const T=s.newAttributes;for(let E=0,C=T.length;E<C;E++)T[E]=0}function m(T){d(T,0)}function d(T,E){const C=s.newAttributes,D=s.enabledAttributes,k=s.attributeDivisors;C[T]=1,D[T]===0&&(r.enableVertexAttribArray(T),D[T]=1),k[T]!==E&&(r.vertexAttribDivisor(T,E),k[T]=E)}function b(){const T=s.newAttributes,E=s.enabledAttributes;for(let C=0,D=E.length;C<D;C++)E[C]!==T[C]&&(r.disableVertexAttribArray(C),E[C]=0)}function M(T,E,C,D,k,H,W){W===!0?r.vertexAttribIPointer(T,E,C,k,H):r.vertexAttribPointer(T,E,C,D,k,H)}function v(T,E,C,D){_();const k=D.attributes,H=C.getAttributes(),W=E.defaultAttributeValues;for(const Y in H){const V=H[Y];if(V.location>=0){let Q=k[Y];if(Q===void 0&&(Y==="instanceMatrix"&&T.instanceMatrix&&(Q=T.instanceMatrix),Y==="instanceColor"&&T.instanceColor&&(Q=T.instanceColor)),Q!==void 0){const oe=Q.normalized,ye=Q.itemSize,Ne=e.get(Q);if(Ne===void 0)continue;const nt=Ne.buffer,Ke=Ne.type,Ze=Ne.bytesPerElement,$=Ke===r.INT||Ke===r.UNSIGNED_INT||Q.gpuType===Bo;if(Q.isInterleavedBufferAttribute){const ee=Q.data,de=ee.stride,Ee=Q.offset;if(ee.isInstancedInterleavedBuffer){for(let te=0;te<V.locationSize;te++)d(V.location+te,ee.meshPerAttribute);T.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let te=0;te<V.locationSize;te++)m(V.location+te);r.bindBuffer(r.ARRAY_BUFFER,nt);for(let te=0;te<V.locationSize;te++)M(V.location+te,ye/V.locationSize,Ke,oe,de*Ze,(Ee+ye/V.locationSize*te)*Ze,$)}else{if(Q.isInstancedBufferAttribute){for(let ee=0;ee<V.locationSize;ee++)d(V.location+ee,Q.meshPerAttribute);T.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let ee=0;ee<V.locationSize;ee++)m(V.location+ee);r.bindBuffer(r.ARRAY_BUFFER,nt);for(let ee=0;ee<V.locationSize;ee++)M(V.location+ee,ye/V.locationSize,Ke,oe,ye*Ze,ye/V.locationSize*ee*Ze,$)}}else if(W!==void 0){const oe=W[Y];if(oe!==void 0)switch(oe.length){case 2:r.vertexAttrib2fv(V.location,oe);break;case 3:r.vertexAttrib3fv(V.location,oe);break;case 4:r.vertexAttrib4fv(V.location,oe);break;default:r.vertexAttrib1fv(V.location,oe)}}}}b()}function R(){F();for(const T in n){const E=n[T];for(const C in E){const D=E[C];for(const k in D)u(D[k].object),delete D[k];delete E[C]}delete n[T]}}function P(T){if(n[T.id]===void 0)return;const E=n[T.id];for(const C in E){const D=E[C];for(const k in D)u(D[k].object),delete D[k];delete E[C]}delete n[T.id]}function L(T){for(const E in n){const C=n[E];if(C[T.id]===void 0)continue;const D=C[T.id];for(const k in D)u(D[k].object),delete D[k];delete C[T.id]}}function F(){S(),a=!0,s!==i&&(s=i,c(s.object))}function S(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:F,resetDefaultState:S,dispose:R,releaseStatesOfGeometry:P,releaseStatesOfProgram:L,initAttributes:_,enableAttribute:m,disableUnusedAttributes:b}}function ug(r,e,t){let n;function i(c){n=c}function s(c,u){r.drawArrays(n,c,u),t.update(u,n,1)}function a(c,u,h){h!==0&&(r.drawArraysInstanced(n,c,u,h),t.update(u,n,h))}function o(c,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,h);let p=0;for(let g=0;g<h;g++)p+=u[g];t.update(p,n,1)}function l(c,u,h,f){if(h===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)a(c[g],u[g],f[g]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,u,0,f,0,h);let g=0;for(let _=0;_<h;_++)g+=u[_]*f[_];t.update(g,n,1)}}this.setMode=i,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function hg(r,e,t,n){let i;function s(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const L=e.get("EXT_texture_filter_anisotropic");i=r.getParameter(L.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(L){return!(L!==nn&&n.convert(L)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(L){const F=L===sr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(L!==mn&&n.convert(L)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&L!==fn&&!F)}function l(L){if(L==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";L="mediump"}return L==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),g=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=r.getParameter(r.MAX_TEXTURE_SIZE),m=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),d=r.getParameter(r.MAX_VERTEX_ATTRIBS),b=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),M=r.getParameter(r.MAX_VARYING_VECTORS),v=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),R=g>0,P=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:b,maxVaryings:M,maxFragmentUniforms:v,vertexTextures:R,maxSamples:P}}function fg(r){const e=this;let t=null,n=0,i=!1,s=!1;const a=new ti,o=new qe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const p=h.length!==0||f||n!==0||i;return i=f,n=h.length,p},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,f){t=u(h,f,0)},this.setState=function(h,f,p){const g=h.clippingPlanes,_=h.clipIntersection,m=h.clipShadows,d=r.get(h);if(!i||g===null||g.length===0||s&&!m)s?u(null):c();else{const b=s?0:n,M=b*4;let v=d.clippingState||null;l.value=v,v=u(g,f,M,p);for(let R=0;R!==M;++R)v[R]=t[R];d.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(h,f,p,g){const _=h!==null?h.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const d=p+_*4,b=f.matrixWorldInverse;o.getNormalMatrix(b),(m===null||m.length<d)&&(m=new Float32Array(d));for(let M=0,v=p;M!==_;++M,v+=4)a.copy(h[M]).applyMatrix4(b,o),a.normal.toArray(m,v),m[v+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function dg(r){let e=new WeakMap;function t(a,o){return o===Xa?a.mapping=$i:o===qa&&(a.mapping=Ji),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Xa||o===qa)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new _f(l.height);return c.fromEquirectangularTexture(r,a),e.set(a,c),a.addEventListener("dispose",i),t(c.texture,a.mapping)}else return null}}return a}function i(a){const o=a.target;o.removeEventListener("dispose",i);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}const qi=4,ol=[.125,.215,.35,.446,.526,.582],yi=20,Ea=new zs,cl=new ze;let Ta=null,ba=0,Aa=0,wa=!1;const vi=(1+Math.sqrt(5))/2,Vi=1/vi,ll=[new U(-vi,Vi,0),new U(vi,Vi,0),new U(-Vi,0,vi),new U(Vi,0,vi),new U(0,vi,-Vi),new U(0,vi,Vi),new U(-1,1,-1),new U(1,1,-1),new U(-1,1,1),new U(1,1,1)],pg=new U;class ul{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100,s={}){const{size:a=256,position:o=pg}=s;Ta=this._renderer.getRenderTarget(),ba=this._renderer.getActiveCubeFace(),Aa=this._renderer.getActiveMipmapLevel(),wa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,i,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=dl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=fl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Ta,ba,Aa),this._renderer.xr.enabled=wa,e.scissorTest=!1,vs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===$i||e.mapping===Ji?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ta=this._renderer.getRenderTarget(),ba=this._renderer.getActiveCubeFace(),Aa=this._renderer.getActiveMipmapLevel(),wa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Xt,minFilter:Xt,generateMipmaps:!1,type:sr,format:nn,colorSpace:Vt,depthBuffer:!1},i=hl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=hl(e,t,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=mg(s)),this._blurMaterial=gg(s,e,t)}return i}_compileMaterial(e){const t=new At(this._lodPlanes[0],e);this._renderer.compile(t,Ea)}_sceneToCubeUV(e,t,n,i,s){const l=new zt(90,1,t,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,p=h.toneMapping;h.getClearColor(cl),h.toneMapping=si,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(i),h.clearDepth(),h.setRenderTarget(null));const _=new dn({name:"PMREM.Background",side:qt,depthWrite:!1,depthTest:!1}),m=new At(new Hr,_);let d=!1;const b=e.background;b?b.isColor&&(_.color.copy(b),e.background=null,d=!0):(_.color.copy(cl),d=!0);for(let M=0;M<6;M++){const v=M%3;v===0?(l.up.set(0,c[M],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[M],s.y,s.z)):v===1?(l.up.set(0,0,c[M]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[M],s.z)):(l.up.set(0,c[M],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[M]));const R=this._cubeSize;vs(i,v*R,M>2?R:0,R,R),h.setRenderTarget(i),d&&h.render(m,l),h.render(e,l)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=p,h.autoClear=f,e.background=b}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===$i||e.mapping===Ji;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=dl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=fl());const s=i?this._cubemapMaterial:this._equirectMaterial,a=new At(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;vs(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Ea)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let s=1;s<i;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=ll[(i-s-1)%ll.length];this._blur(e,s-1,s,a,o)}t.autoClear=n}_blur(e,t,n,i,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",s),this._halfBlur(a,e,n,n,i,"longitudinal",s)}_halfBlur(e,t,n,i,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new At(this._lodPlanes[i],c),f=c.uniforms,p=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*yi-1),_=s/g,m=isFinite(s)?1+Math.floor(u*_):yi;m>yi&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${yi}`);const d=[];let b=0;for(let L=0;L<yi;++L){const F=L/_,S=Math.exp(-F*F/2);d.push(S),L===0?b+=S:L<m&&(b+=2*S)}for(let L=0;L<d.length;L++)d[L]=d[L]/b;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=d,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:M}=this;f.dTheta.value=g,f.mipInt.value=M-n;const v=this._sizeLods[i],R=3*v*(i>M-qi?i-M+qi:0),P=4*(this._cubeSize-v);vs(t,R,P,3*v,2*v),l.setRenderTarget(t),l.render(h,Ea)}}function mg(r){const e=[],t=[],n=[];let i=r;const s=r-qi+1+ol.length;for(let a=0;a<s;a++){const o=Math.pow(2,i);t.push(o);let l=1/o;a>r-qi?l=ol[a-r+qi-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),u=-c,h=1+c,f=[u,u,h,u,h,h,u,u,h,h,u,h],p=6,g=6,_=3,m=2,d=1,b=new Float32Array(_*g*p),M=new Float32Array(m*g*p),v=new Float32Array(d*g*p);for(let P=0;P<p;P++){const L=P%3*2/3-1,F=P>2?0:-1,S=[L,F,0,L+2/3,F,0,L+2/3,F+1,0,L,F,0,L+2/3,F+1,0,L,F+1,0];b.set(S,_*g*P),M.set(f,m*g*P);const T=[P,P,P,P,P,P];v.set(T,d*g*P)}const R=new rn;R.setAttribute("position",new Nt(b,_)),R.setAttribute("uv",new Nt(M,m)),R.setAttribute("faceIndex",new Nt(v,d)),e.push(R),i>qi&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function hl(r,e,t){const n=new ci(r,e,t);return n.texture.mapping=Ns,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function vs(r,e,t,n,i){r.viewport.set(e,t,n,i),r.scissor.set(e,t,n,i)}function gg(r,e,t){const n=new Float32Array(yi),i=new U(0,1,0);return new Wn({name:"SphericalGaussianBlur",defines:{n:yi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:ic(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ri,depthTest:!1,depthWrite:!1})}function fl(){return new Wn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ic(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ri,depthTest:!1,depthWrite:!1})}function dl(){return new Wn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ic(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ri,depthTest:!1,depthWrite:!1})}function ic(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function _g(r){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===Xa||l===qa,u=l===$i||l===Ji;if(c||u){let h=e.get(o);const f=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new ul(r)),h=c?t.fromEquirectangular(o,h):t.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),h.texture;if(h!==void 0)return h.texture;{const p=o.image;return c&&p&&p.height>0||u&&p&&i(p)?(t===null&&(t=new ul(r)),h=c?t.fromEquirectangular(o):t.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),o.addEventListener("dispose",s),h.texture):null}}}return o}function i(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function xg(r){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=r.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&Nr("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function vg(r,e,t,n){const i={},s=new WeakMap;function a(h){const f=h.target;f.index!==null&&e.remove(f.index);for(const g in f.attributes)e.remove(f.attributes[g]);f.removeEventListener("dispose",a),delete i[f.id];const p=s.get(f);p&&(e.remove(p),s.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(h,f){return i[f.id]===!0||(f.addEventListener("dispose",a),i[f.id]=!0,t.memory.geometries++),f}function l(h){const f=h.attributes;for(const p in f)e.update(f[p],r.ARRAY_BUFFER)}function c(h){const f=[],p=h.index,g=h.attributes.position;let _=0;if(p!==null){const b=p.array;_=p.version;for(let M=0,v=b.length;M<v;M+=3){const R=b[M+0],P=b[M+1],L=b[M+2];f.push(R,P,P,L,L,R)}}else if(g!==void 0){const b=g.array;_=g.version;for(let M=0,v=b.length/3-1;M<v;M+=3){const R=M+0,P=M+1,L=M+2;f.push(R,P,P,L,L,R)}}else return;const m=new(iu(f)?ou:au)(f,1);m.version=_;const d=s.get(h);d&&e.remove(d),s.set(h,m)}function u(h){const f=s.get(h);if(f){const p=h.index;p!==null&&f.version<p.version&&c(h)}else c(h);return s.get(h)}return{get:o,update:l,getWireframeAttribute:u}}function Mg(r,e,t){let n;function i(f){n=f}let s,a;function o(f){s=f.type,a=f.bytesPerElement}function l(f,p){r.drawElements(n,p,s,f*a),t.update(p,n,1)}function c(f,p,g){g!==0&&(r.drawElementsInstanced(n,p,s,f*a,g),t.update(p,n,g))}function u(f,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,s,f,0,g);let m=0;for(let d=0;d<g;d++)m+=p[d];t.update(m,n,1)}function h(f,p,g,_){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<f.length;d++)c(f[d]/a,p[d],_[d]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,s,f,0,_,0,g);let d=0;for(let b=0;b<g;b++)d+=p[b]*_[b];t.update(d,n,1)}}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function yg(r){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(t.calls++,a){case r.TRIANGLES:t.triangles+=o*(s/3);break;case r.LINES:t.lines+=o*(s/2);break;case r.LINE_STRIP:t.lines+=o*(s-1);break;case r.LINE_LOOP:t.lines+=o*s;break;case r.POINTS:t.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function Sg(r,e,t){const n=new WeakMap,i=new st;function s(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0;let f=n.get(o);if(f===void 0||f.count!==h){let T=function(){F.dispose(),n.delete(o),o.removeEventListener("dispose",T)};var p=T;f!==void 0&&f.texture.dispose();const g=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,d=o.morphAttributes.position||[],b=o.morphAttributes.normal||[],M=o.morphAttributes.color||[];let v=0;g===!0&&(v=1),_===!0&&(v=2),m===!0&&(v=3);let R=o.attributes.position.count*v,P=1;R>e.maxTextureSize&&(P=Math.ceil(R/e.maxTextureSize),R=e.maxTextureSize);const L=new Float32Array(R*P*4*h),F=new ru(L,R,P,h);F.type=fn,F.needsUpdate=!0;const S=v*4;for(let E=0;E<h;E++){const C=d[E],D=b[E],k=M[E],H=R*P*4*E;for(let W=0;W<C.count;W++){const Y=W*S;g===!0&&(i.fromBufferAttribute(C,W),L[H+Y+0]=i.x,L[H+Y+1]=i.y,L[H+Y+2]=i.z,L[H+Y+3]=0),_===!0&&(i.fromBufferAttribute(D,W),L[H+Y+4]=i.x,L[H+Y+5]=i.y,L[H+Y+6]=i.z,L[H+Y+7]=0),m===!0&&(i.fromBufferAttribute(k,W),L[H+Y+8]=i.x,L[H+Y+9]=i.y,L[H+Y+10]=i.z,L[H+Y+11]=k.itemSize===4?i.w:1)}}f={count:h,texture:F,size:new Be(R,P)},n.set(o,f),o.addEventListener("dispose",T)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(r,"morphTexture",a.morphTexture,t);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const _=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(r,"morphTargetBaseInfluence",_),l.getUniforms().setValue(r,"morphTargetInfluences",c)}l.getUniforms().setValue(r,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(r,"morphTargetsTextureSize",f.size)}return{update:s}}function Eg(r,e,t,n){let i=new WeakMap;function s(l){const c=n.render.frame,u=l.geometry,h=e.get(l,u);if(i.get(h)!==c&&(e.update(h),i.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),i.get(l)!==c&&(t.update(l.instanceMatrix,r.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,r.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;i.get(f)!==c&&(f.update(),i.set(f,c))}return h}function a(){i=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:a}}const Au=new wt,pl=new Jo(1,1),wu=new ru,Ru=new Qh,Cu=new uu,ml=[],gl=[],_l=new Float32Array(16),xl=new Float32Array(9),vl=new Float32Array(4);function ur(r,e,t){const n=r[0];if(n<=0||n>0)return r;const i=e*t;let s=ml[i];if(s===void 0&&(s=new Float32Array(i),ml[i]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,r[a].toArray(s,o)}return s}function Rt(r,e){if(r.length!==e.length)return!1;for(let t=0,n=r.length;t<n;t++)if(r[t]!==e[t])return!1;return!0}function Ct(r,e){for(let t=0,n=e.length;t<n;t++)r[t]=e[t]}function ks(r,e){let t=gl[e];t===void 0&&(t=new Int32Array(e),gl[e]=t);for(let n=0;n!==e;++n)t[n]=r.allocateTextureUnit();return t}function Tg(r,e){const t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function bg(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Rt(t,e))return;r.uniform2fv(this.addr,e),Ct(t,e)}}function Ag(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Rt(t,e))return;r.uniform3fv(this.addr,e),Ct(t,e)}}function wg(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Rt(t,e))return;r.uniform4fv(this.addr,e),Ct(t,e)}}function Rg(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(Rt(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),Ct(t,e)}else{if(Rt(t,n))return;vl.set(n),r.uniformMatrix2fv(this.addr,!1,vl),Ct(t,n)}}function Cg(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(Rt(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),Ct(t,e)}else{if(Rt(t,n))return;xl.set(n),r.uniformMatrix3fv(this.addr,!1,xl),Ct(t,n)}}function Pg(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(Rt(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),Ct(t,e)}else{if(Rt(t,n))return;_l.set(n),r.uniformMatrix4fv(this.addr,!1,_l),Ct(t,n)}}function Lg(r,e){const t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function Ig(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Rt(t,e))return;r.uniform2iv(this.addr,e),Ct(t,e)}}function Dg(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Rt(t,e))return;r.uniform3iv(this.addr,e),Ct(t,e)}}function Ug(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Rt(t,e))return;r.uniform4iv(this.addr,e),Ct(t,e)}}function Ng(r,e){const t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function Fg(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Rt(t,e))return;r.uniform2uiv(this.addr,e),Ct(t,e)}}function Og(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Rt(t,e))return;r.uniform3uiv(this.addr,e),Ct(t,e)}}function Bg(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Rt(t,e))return;r.uniform4uiv(this.addr,e),Ct(t,e)}}function zg(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_2D_SHADOW?(pl.compareFunction=nu,s=pl):s=Au,t.setTexture2D(e||s,i)}function kg(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Ru,i)}function Hg(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Cu,i)}function Vg(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||wu,i)}function Gg(r){switch(r){case 5126:return Tg;case 35664:return bg;case 35665:return Ag;case 35666:return wg;case 35674:return Rg;case 35675:return Cg;case 35676:return Pg;case 5124:case 35670:return Lg;case 35667:case 35671:return Ig;case 35668:case 35672:return Dg;case 35669:case 35673:return Ug;case 5125:return Ng;case 36294:return Fg;case 36295:return Og;case 36296:return Bg;case 35678:case 36198:case 36298:case 36306:case 35682:return zg;case 35679:case 36299:case 36307:return kg;case 35680:case 36300:case 36308:case 36293:return Hg;case 36289:case 36303:case 36311:case 36292:return Vg}}function Wg(r,e){r.uniform1fv(this.addr,e)}function Xg(r,e){const t=ur(e,this.size,2);r.uniform2fv(this.addr,t)}function qg(r,e){const t=ur(e,this.size,3);r.uniform3fv(this.addr,t)}function Yg(r,e){const t=ur(e,this.size,4);r.uniform4fv(this.addr,t)}function Kg(r,e){const t=ur(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function jg(r,e){const t=ur(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function Zg(r,e){const t=ur(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function $g(r,e){r.uniform1iv(this.addr,e)}function Jg(r,e){r.uniform2iv(this.addr,e)}function Qg(r,e){r.uniform3iv(this.addr,e)}function e_(r,e){r.uniform4iv(this.addr,e)}function t_(r,e){r.uniform1uiv(this.addr,e)}function n_(r,e){r.uniform2uiv(this.addr,e)}function i_(r,e){r.uniform3uiv(this.addr,e)}function r_(r,e){r.uniform4uiv(this.addr,e)}function s_(r,e,t){const n=this.cache,i=e.length,s=ks(t,i);Rt(n,s)||(r.uniform1iv(this.addr,s),Ct(n,s));for(let a=0;a!==i;++a)t.setTexture2D(e[a]||Au,s[a])}function a_(r,e,t){const n=this.cache,i=e.length,s=ks(t,i);Rt(n,s)||(r.uniform1iv(this.addr,s),Ct(n,s));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||Ru,s[a])}function o_(r,e,t){const n=this.cache,i=e.length,s=ks(t,i);Rt(n,s)||(r.uniform1iv(this.addr,s),Ct(n,s));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||Cu,s[a])}function c_(r,e,t){const n=this.cache,i=e.length,s=ks(t,i);Rt(n,s)||(r.uniform1iv(this.addr,s),Ct(n,s));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||wu,s[a])}function l_(r){switch(r){case 5126:return Wg;case 35664:return Xg;case 35665:return qg;case 35666:return Yg;case 35674:return Kg;case 35675:return jg;case 35676:return Zg;case 5124:case 35670:return $g;case 35667:case 35671:return Jg;case 35668:case 35672:return Qg;case 35669:case 35673:return e_;case 5125:return t_;case 36294:return n_;case 36295:return i_;case 36296:return r_;case 35678:case 36198:case 36298:case 36306:case 35682:return s_;case 35679:case 36299:case 36307:return a_;case 35680:case 36300:case 36308:case 36293:return o_;case 36289:case 36303:case 36311:case 36292:return c_}}class u_{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Gg(t.type)}}class h_{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=l_(t.type)}}class f_{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let s=0,a=i.length;s!==a;++s){const o=i[s];o.setValue(e,t[o.id],n)}}}const Ra=/(\w+)(\])?(\[|\.)?/g;function Ml(r,e){r.seq.push(e),r.map[e.id]=e}function d_(r,e,t){const n=r.name,i=n.length;for(Ra.lastIndex=0;;){const s=Ra.exec(n),a=Ra.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){Ml(t,c===void 0?new u_(o,r,e):new h_(o,r,e));break}else{let h=t.map[o];h===void 0&&(h=new f_(o),Ml(t,h)),t=h}}}class Rs{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const s=e.getActiveUniform(t,i),a=e.getUniformLocation(t,s.name);d_(s,a,this)}}setValue(e,t,n,i){const s=this.map[t];s!==void 0&&s.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let s=0,a=t.length;s!==a;++s){const o=t[s],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,s=e.length;i!==s;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function yl(r,e,t){const n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),n}const p_=37297;let m_=0;function g_(r,e){const t=r.split(`
`),n=[],i=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=i;a<s;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const Sl=new qe;function __(r){tt._getMatrix(Sl,tt.workingColorSpace,r);const e=`mat3( ${Sl.elements.map(t=>t.toFixed(4))} )`;switch(tt.getTransfer(r)){case Ls:return[e,"LinearTransferOETF"];case ht:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",r),[e,"LinearTransferOETF"]}}function El(r,e,t){const n=r.getShaderParameter(e,r.COMPILE_STATUS),s=(r.getShaderInfoLog(e)||"").trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+s+`

`+g_(r.getShaderSource(e),o)}else return s}function x_(r,e){const t=__(e);return[`vec4 ${r}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function v_(r,e){let t;switch(e){case uh:t="Linear";break;case hh:t="Reinhard";break;case fh:t="Cineon";break;case Wl:t="ACESFilmic";break;case ph:t="AgX";break;case mh:t="Neutral";break;case dh:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Ms=new U;function M_(){tt.getLuminanceCoefficients(Ms);const r=Ms.x.toFixed(4),e=Ms.y.toFixed(4),t=Ms.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function y_(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Tr).join(`
`)}function S_(r){const e=[];for(const t in r){const n=r[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function E_(r,e){const t={},n=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const s=r.getActiveAttrib(e,i),a=s.name;let o=1;s.type===r.FLOAT_MAT2&&(o=2),s.type===r.FLOAT_MAT3&&(o=3),s.type===r.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:r.getAttribLocation(e,a),locationSize:o}}return t}function Tr(r){return r!==""}function Tl(r,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function bl(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const T_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Lo(r){return r.replace(T_,A_)}const b_=new Map;function A_(r,e){let t=Ye[e];if(t===void 0){const n=b_.get(e);if(n!==void 0)t=Ye[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Lo(t)}const w_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Al(r){return r.replace(w_,R_)}function R_(r,e,t,n){let i="";for(let s=parseInt(e);s<parseInt(t);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function wl(r){let e=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function C_(r){let e="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===Oo?e="SHADOWMAP_TYPE_PCF":r.shadowMapType===Gu?e="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===Fn&&(e="SHADOWMAP_TYPE_VSM"),e}function P_(r){let e="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case $i:case Ji:e="ENVMAP_TYPE_CUBE";break;case Ns:e="ENVMAP_TYPE_CUBE_UV";break}return e}function L_(r){let e="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case Ji:e="ENVMAP_MODE_REFRACTION";break}return e}function I_(r){let e="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case Gl:e="ENVMAP_BLENDING_MULTIPLY";break;case ch:e="ENVMAP_BLENDING_MIX";break;case lh:e="ENVMAP_BLENDING_ADD";break}return e}function D_(r){const e=r.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function U_(r,e,t,n){const i=r.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=C_(t),c=P_(t),u=L_(t),h=I_(t),f=D_(t),p=y_(t),g=S_(s),_=i.createProgram();let m,d,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Tr).join(`
`),m.length>0&&(m+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Tr).join(`
`),d.length>0&&(d+=`
`)):(m=[wl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Tr).join(`
`),d=[wl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==si?"#define TONE_MAPPING":"",t.toneMapping!==si?Ye.tonemapping_pars_fragment:"",t.toneMapping!==si?v_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ye.colorspace_pars_fragment,x_("linearToOutputTexel",t.outputColorSpace),M_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Tr).join(`
`)),a=Lo(a),a=Tl(a,t),a=bl(a,t),o=Lo(o),o=Tl(o,t),o=bl(o,t),a=Al(a),o=Al(o),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,d=["#define varying in",t.glslVersion===_c?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===_c?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const M=b+m+a,v=b+d+o,R=yl(i,i.VERTEX_SHADER,M),P=yl(i,i.FRAGMENT_SHADER,v);i.attachShader(_,R),i.attachShader(_,P),t.index0AttributeName!==void 0?i.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function L(E){if(r.debug.checkShaderErrors){const C=i.getProgramInfoLog(_)||"",D=i.getShaderInfoLog(R)||"",k=i.getShaderInfoLog(P)||"",H=C.trim(),W=D.trim(),Y=k.trim();let V=!0,Q=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(V=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,_,R,P);else{const oe=El(i,R,"vertex"),ye=El(i,P,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+E.name+`
Material Type: `+E.type+`

Program Info Log: `+H+`
`+oe+`
`+ye)}else H!==""?console.warn("THREE.WebGLProgram: Program Info Log:",H):(W===""||Y==="")&&(Q=!1);Q&&(E.diagnostics={runnable:V,programLog:H,vertexShader:{log:W,prefix:m},fragmentShader:{log:Y,prefix:d}})}i.deleteShader(R),i.deleteShader(P),F=new Rs(i,_),S=E_(i,_)}let F;this.getUniforms=function(){return F===void 0&&L(this),F};let S;this.getAttributes=function(){return S===void 0&&L(this),S};let T=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return T===!1&&(T=i.getProgramParameter(_,p_)),T},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=m_++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=R,this.fragmentShader=P,this}let N_=0;class F_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new O_(e),t.set(e,n)),n}}class O_{constructor(e){this.id=N_++,this.code=e,this.usedTimes=0}}function B_(r,e,t,n,i,s,a){const o=new Yo,l=new F_,c=new Set,u=[],h=i.logarithmicDepthBuffer,f=i.vertexTextures;let p=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(S){return c.add(S),S===0?"uv":`uv${S}`}function m(S,T,E,C,D){const k=C.fog,H=D.geometry,W=S.isMeshStandardMaterial?C.environment:null,Y=(S.isMeshStandardMaterial?t:e).get(S.envMap||W),V=Y&&Y.mapping===Ns?Y.image.height:null,Q=g[S.type];S.precision!==null&&(p=i.getMaxPrecision(S.precision),p!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",p,"instead."));const oe=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,ye=oe!==void 0?oe.length:0;let Ne=0;H.morphAttributes.position!==void 0&&(Ne=1),H.morphAttributes.normal!==void 0&&(Ne=2),H.morphAttributes.color!==void 0&&(Ne=3);let nt,Ke,Ze,$;if(Q){const De=vn[Q];nt=De.vertexShader,Ke=De.fragmentShader}else nt=S.vertexShader,Ke=S.fragmentShader,l.update(S),Ze=l.getVertexShaderID(S),$=l.getFragmentShaderID(S);const ee=r.getRenderTarget(),de=r.state.buffers.depth.getReversed(),Ee=D.isInstancedMesh===!0,te=D.isBatchedMesh===!0,ke=!!S.map,it=!!S.matcap,w=!!Y,Ae=!!S.aoMap,_e=!!S.lightMap,Se=!!S.bumpMap,me=!!S.normalMap,We=!!S.displacementMap,xe=!!S.emissiveMap,Le=!!S.metalnessMap,lt=!!S.roughnessMap,ft=S.anisotropy>0,A=S.clearcoat>0,x=S.dispersion>0,G=S.iridescence>0,Z=S.sheen>0,J=S.transmission>0,K=ft&&!!S.anisotropyMap,Re=A&&!!S.clearcoatMap,ae=A&&!!S.clearcoatNormalMap,Te=A&&!!S.clearcoatRoughnessMap,we=G&&!!S.iridescenceMap,re=G&&!!S.iridescenceThicknessMap,pe=Z&&!!S.sheenColorMap,Ie=Z&&!!S.sheenRoughnessMap,Ce=!!S.specularMap,le=!!S.specularColorMap,Ge=!!S.specularIntensityMap,I=J&&!!S.transmissionMap,se=J&&!!S.thicknessMap,ce=!!S.gradientMap,ve=!!S.alphaMap,B=S.alphaTest>0,N=!!S.alphaHash,j=!!S.extensions;let ne=si;S.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(ne=r.toneMapping);const Pe={shaderID:Q,shaderType:S.type,shaderName:S.name,vertexShader:nt,fragmentShader:Ke,defines:S.defines,customVertexShaderID:Ze,customFragmentShaderID:$,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:p,batching:te,batchingColor:te&&D._colorsTexture!==null,instancing:Ee,instancingColor:Ee&&D.instanceColor!==null,instancingMorph:Ee&&D.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:ee===null?r.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:Vt,alphaToCoverage:!!S.alphaToCoverage,map:ke,matcap:it,envMap:w,envMapMode:w&&Y.mapping,envMapCubeUVHeight:V,aoMap:Ae,lightMap:_e,bumpMap:Se,normalMap:me,displacementMap:f&&We,emissiveMap:xe,normalMapObjectSpace:me&&S.normalMapType===yh,normalMapTangentSpace:me&&S.normalMapType===tu,metalnessMap:Le,roughnessMap:lt,anisotropy:ft,anisotropyMap:K,clearcoat:A,clearcoatMap:Re,clearcoatNormalMap:ae,clearcoatRoughnessMap:Te,dispersion:x,iridescence:G,iridescenceMap:we,iridescenceThicknessMap:re,sheen:Z,sheenColorMap:pe,sheenRoughnessMap:Ie,specularMap:Ce,specularColorMap:le,specularIntensityMap:Ge,transmission:J,transmissionMap:I,thicknessMap:se,gradientMap:ce,opaque:S.transparent===!1&&S.blending===Yi&&S.alphaToCoverage===!1,alphaMap:ve,alphaTest:B,alphaHash:N,combine:S.combine,mapUv:ke&&_(S.map.channel),aoMapUv:Ae&&_(S.aoMap.channel),lightMapUv:_e&&_(S.lightMap.channel),bumpMapUv:Se&&_(S.bumpMap.channel),normalMapUv:me&&_(S.normalMap.channel),displacementMapUv:We&&_(S.displacementMap.channel),emissiveMapUv:xe&&_(S.emissiveMap.channel),metalnessMapUv:Le&&_(S.metalnessMap.channel),roughnessMapUv:lt&&_(S.roughnessMap.channel),anisotropyMapUv:K&&_(S.anisotropyMap.channel),clearcoatMapUv:Re&&_(S.clearcoatMap.channel),clearcoatNormalMapUv:ae&&_(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Te&&_(S.clearcoatRoughnessMap.channel),iridescenceMapUv:we&&_(S.iridescenceMap.channel),iridescenceThicknessMapUv:re&&_(S.iridescenceThicknessMap.channel),sheenColorMapUv:pe&&_(S.sheenColorMap.channel),sheenRoughnessMapUv:Ie&&_(S.sheenRoughnessMap.channel),specularMapUv:Ce&&_(S.specularMap.channel),specularColorMapUv:le&&_(S.specularColorMap.channel),specularIntensityMapUv:Ge&&_(S.specularIntensityMap.channel),transmissionMapUv:I&&_(S.transmissionMap.channel),thicknessMapUv:se&&_(S.thicknessMap.channel),alphaMapUv:ve&&_(S.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(me||ft),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!H.attributes.uv&&(ke||ve),fog:!!k,useFog:S.fog===!0,fogExp2:!!k&&k.isFogExp2,flatShading:S.flatShading===!0&&S.wireframe===!1,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:de,skinning:D.isSkinnedMesh===!0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:ye,morphTextureStride:Ne,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:r.shadowMap.enabled&&E.length>0,shadowMapType:r.shadowMap.type,toneMapping:ne,decodeVideoTexture:ke&&S.map.isVideoTexture===!0&&tt.getTransfer(S.map.colorSpace)===ht,decodeVideoTextureEmissive:xe&&S.emissiveMap.isVideoTexture===!0&&tt.getTransfer(S.emissiveMap.colorSpace)===ht,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===$t,flipSided:S.side===qt,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:j&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(j&&S.extensions.multiDraw===!0||te)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return Pe.vertexUv1s=c.has(1),Pe.vertexUv2s=c.has(2),Pe.vertexUv3s=c.has(3),c.clear(),Pe}function d(S){const T=[];if(S.shaderID?T.push(S.shaderID):(T.push(S.customVertexShaderID),T.push(S.customFragmentShaderID)),S.defines!==void 0)for(const E in S.defines)T.push(E),T.push(S.defines[E]);return S.isRawShaderMaterial===!1&&(b(T,S),M(T,S),T.push(r.outputColorSpace)),T.push(S.customProgramCacheKey),T.join()}function b(S,T){S.push(T.precision),S.push(T.outputColorSpace),S.push(T.envMapMode),S.push(T.envMapCubeUVHeight),S.push(T.mapUv),S.push(T.alphaMapUv),S.push(T.lightMapUv),S.push(T.aoMapUv),S.push(T.bumpMapUv),S.push(T.normalMapUv),S.push(T.displacementMapUv),S.push(T.emissiveMapUv),S.push(T.metalnessMapUv),S.push(T.roughnessMapUv),S.push(T.anisotropyMapUv),S.push(T.clearcoatMapUv),S.push(T.clearcoatNormalMapUv),S.push(T.clearcoatRoughnessMapUv),S.push(T.iridescenceMapUv),S.push(T.iridescenceThicknessMapUv),S.push(T.sheenColorMapUv),S.push(T.sheenRoughnessMapUv),S.push(T.specularMapUv),S.push(T.specularColorMapUv),S.push(T.specularIntensityMapUv),S.push(T.transmissionMapUv),S.push(T.thicknessMapUv),S.push(T.combine),S.push(T.fogExp2),S.push(T.sizeAttenuation),S.push(T.morphTargetsCount),S.push(T.morphAttributeCount),S.push(T.numDirLights),S.push(T.numPointLights),S.push(T.numSpotLights),S.push(T.numSpotLightMaps),S.push(T.numHemiLights),S.push(T.numRectAreaLights),S.push(T.numDirLightShadows),S.push(T.numPointLightShadows),S.push(T.numSpotLightShadows),S.push(T.numSpotLightShadowsWithMaps),S.push(T.numLightProbes),S.push(T.shadowMapType),S.push(T.toneMapping),S.push(T.numClippingPlanes),S.push(T.numClipIntersection),S.push(T.depthPacking)}function M(S,T){o.disableAll(),T.supportsVertexTextures&&o.enable(0),T.instancing&&o.enable(1),T.instancingColor&&o.enable(2),T.instancingMorph&&o.enable(3),T.matcap&&o.enable(4),T.envMap&&o.enable(5),T.normalMapObjectSpace&&o.enable(6),T.normalMapTangentSpace&&o.enable(7),T.clearcoat&&o.enable(8),T.iridescence&&o.enable(9),T.alphaTest&&o.enable(10),T.vertexColors&&o.enable(11),T.vertexAlphas&&o.enable(12),T.vertexUv1s&&o.enable(13),T.vertexUv2s&&o.enable(14),T.vertexUv3s&&o.enable(15),T.vertexTangents&&o.enable(16),T.anisotropy&&o.enable(17),T.alphaHash&&o.enable(18),T.batching&&o.enable(19),T.dispersion&&o.enable(20),T.batchingColor&&o.enable(21),T.gradientMap&&o.enable(22),S.push(o.mask),o.disableAll(),T.fog&&o.enable(0),T.useFog&&o.enable(1),T.flatShading&&o.enable(2),T.logarithmicDepthBuffer&&o.enable(3),T.reversedDepthBuffer&&o.enable(4),T.skinning&&o.enable(5),T.morphTargets&&o.enable(6),T.morphNormals&&o.enable(7),T.morphColors&&o.enable(8),T.premultipliedAlpha&&o.enable(9),T.shadowMapEnabled&&o.enable(10),T.doubleSided&&o.enable(11),T.flipSided&&o.enable(12),T.useDepthPacking&&o.enable(13),T.dithering&&o.enable(14),T.transmission&&o.enable(15),T.sheen&&o.enable(16),T.opaque&&o.enable(17),T.pointsUvs&&o.enable(18),T.decodeVideoTexture&&o.enable(19),T.decodeVideoTextureEmissive&&o.enable(20),T.alphaToCoverage&&o.enable(21),S.push(o.mask)}function v(S){const T=g[S.type];let E;if(T){const C=vn[T];E=df.clone(C.uniforms)}else E=S.uniforms;return E}function R(S,T){let E;for(let C=0,D=u.length;C<D;C++){const k=u[C];if(k.cacheKey===T){E=k,++E.usedTimes;break}}return E===void 0&&(E=new U_(r,T,S,s),u.push(E)),E}function P(S){if(--S.usedTimes===0){const T=u.indexOf(S);u[T]=u[u.length-1],u.pop(),S.destroy()}}function L(S){l.remove(S)}function F(){l.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:v,acquireProgram:R,releaseProgram:P,releaseShaderCache:L,programs:u,dispose:F}}function z_(){let r=new WeakMap;function e(a){return r.has(a)}function t(a){let o=r.get(a);return o===void 0&&(o={},r.set(a,o)),o}function n(a){r.delete(a)}function i(a,o,l){r.get(a)[o]=l}function s(){r=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:s}}function k_(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function Rl(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function Cl(){const r=[];let e=0;const t=[],n=[],i=[];function s(){e=0,t.length=0,n.length=0,i.length=0}function a(h,f,p,g,_,m){let d=r[e];return d===void 0?(d={id:h.id,object:h,geometry:f,material:p,groupOrder:g,renderOrder:h.renderOrder,z:_,group:m},r[e]=d):(d.id=h.id,d.object=h,d.geometry=f,d.material=p,d.groupOrder=g,d.renderOrder=h.renderOrder,d.z=_,d.group=m),e++,d}function o(h,f,p,g,_,m){const d=a(h,f,p,g,_,m);p.transmission>0?n.push(d):p.transparent===!0?i.push(d):t.push(d)}function l(h,f,p,g,_,m){const d=a(h,f,p,g,_,m);p.transmission>0?n.unshift(d):p.transparent===!0?i.unshift(d):t.unshift(d)}function c(h,f){t.length>1&&t.sort(h||k_),n.length>1&&n.sort(f||Rl),i.length>1&&i.sort(f||Rl)}function u(){for(let h=e,f=r.length;h<f;h++){const p=r[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:i,init:s,push:o,unshift:l,finish:u,sort:c}}function H_(){let r=new WeakMap;function e(n,i){const s=r.get(n);let a;return s===void 0?(a=new Cl,r.set(n,[a])):i>=s.length?(a=new Cl,s.push(a)):a=s[i],a}function t(){r=new WeakMap}return{get:e,dispose:t}}function V_(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new U,color:new ze};break;case"SpotLight":t={position:new U,direction:new U,color:new ze,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new U,color:new ze,distance:0,decay:0};break;case"HemisphereLight":t={direction:new U,skyColor:new ze,groundColor:new ze};break;case"RectAreaLight":t={color:new ze,position:new U,halfWidth:new U,halfHeight:new U};break}return r[e.id]=t,t}}}function G_(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Be};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Be};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Be,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}let W_=0;function X_(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function q_(r){const e=new V_,t=G_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new U);const i=new U,s=new Xe,a=new Xe;function o(c){let u=0,h=0,f=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let p=0,g=0,_=0,m=0,d=0,b=0,M=0,v=0,R=0,P=0,L=0;c.sort(X_);for(let S=0,T=c.length;S<T;S++){const E=c[S],C=E.color,D=E.intensity,k=E.distance,H=E.shadow&&E.shadow.map?E.shadow.map.texture:null;if(E.isAmbientLight)u+=C.r*D,h+=C.g*D,f+=C.b*D;else if(E.isLightProbe){for(let W=0;W<9;W++)n.probe[W].addScaledVector(E.sh.coefficients[W],D);L++}else if(E.isDirectionalLight){const W=e.get(E);if(W.color.copy(E.color).multiplyScalar(E.intensity),E.castShadow){const Y=E.shadow,V=t.get(E);V.shadowIntensity=Y.intensity,V.shadowBias=Y.bias,V.shadowNormalBias=Y.normalBias,V.shadowRadius=Y.radius,V.shadowMapSize=Y.mapSize,n.directionalShadow[p]=V,n.directionalShadowMap[p]=H,n.directionalShadowMatrix[p]=E.shadow.matrix,b++}n.directional[p]=W,p++}else if(E.isSpotLight){const W=e.get(E);W.position.setFromMatrixPosition(E.matrixWorld),W.color.copy(C).multiplyScalar(D),W.distance=k,W.coneCos=Math.cos(E.angle),W.penumbraCos=Math.cos(E.angle*(1-E.penumbra)),W.decay=E.decay,n.spot[_]=W;const Y=E.shadow;if(E.map&&(n.spotLightMap[R]=E.map,R++,Y.updateMatrices(E),E.castShadow&&P++),n.spotLightMatrix[_]=Y.matrix,E.castShadow){const V=t.get(E);V.shadowIntensity=Y.intensity,V.shadowBias=Y.bias,V.shadowNormalBias=Y.normalBias,V.shadowRadius=Y.radius,V.shadowMapSize=Y.mapSize,n.spotShadow[_]=V,n.spotShadowMap[_]=H,v++}_++}else if(E.isRectAreaLight){const W=e.get(E);W.color.copy(C).multiplyScalar(D),W.halfWidth.set(E.width*.5,0,0),W.halfHeight.set(0,E.height*.5,0),n.rectArea[m]=W,m++}else if(E.isPointLight){const W=e.get(E);if(W.color.copy(E.color).multiplyScalar(E.intensity),W.distance=E.distance,W.decay=E.decay,E.castShadow){const Y=E.shadow,V=t.get(E);V.shadowIntensity=Y.intensity,V.shadowBias=Y.bias,V.shadowNormalBias=Y.normalBias,V.shadowRadius=Y.radius,V.shadowMapSize=Y.mapSize,V.shadowCameraNear=Y.camera.near,V.shadowCameraFar=Y.camera.far,n.pointShadow[g]=V,n.pointShadowMap[g]=H,n.pointShadowMatrix[g]=E.shadow.matrix,M++}n.point[g]=W,g++}else if(E.isHemisphereLight){const W=e.get(E);W.skyColor.copy(E.color).multiplyScalar(D),W.groundColor.copy(E.groundColor).multiplyScalar(D),n.hemi[d]=W,d++}}m>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=fe.LTC_FLOAT_1,n.rectAreaLTC2=fe.LTC_FLOAT_2):(n.rectAreaLTC1=fe.LTC_HALF_1,n.rectAreaLTC2=fe.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=f;const F=n.hash;(F.directionalLength!==p||F.pointLength!==g||F.spotLength!==_||F.rectAreaLength!==m||F.hemiLength!==d||F.numDirectionalShadows!==b||F.numPointShadows!==M||F.numSpotShadows!==v||F.numSpotMaps!==R||F.numLightProbes!==L)&&(n.directional.length=p,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=d,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=b,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=v+R-P,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=P,n.numLightProbes=L,F.directionalLength=p,F.pointLength=g,F.spotLength=_,F.rectAreaLength=m,F.hemiLength=d,F.numDirectionalShadows=b,F.numPointShadows=M,F.numSpotShadows=v,F.numSpotMaps=R,F.numLightProbes=L,n.version=W_++)}function l(c,u){let h=0,f=0,p=0,g=0,_=0;const m=u.matrixWorldInverse;for(let d=0,b=c.length;d<b;d++){const M=c[d];if(M.isDirectionalLight){const v=n.directional[h];v.direction.setFromMatrixPosition(M.matrixWorld),i.setFromMatrixPosition(M.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(m),h++}else if(M.isSpotLight){const v=n.spot[p];v.position.setFromMatrixPosition(M.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(M.matrixWorld),i.setFromMatrixPosition(M.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(m),p++}else if(M.isRectAreaLight){const v=n.rectArea[g];v.position.setFromMatrixPosition(M.matrixWorld),v.position.applyMatrix4(m),a.identity(),s.copy(M.matrixWorld),s.premultiply(m),a.extractRotation(s),v.halfWidth.set(M.width*.5,0,0),v.halfHeight.set(0,M.height*.5,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),g++}else if(M.isPointLight){const v=n.point[f];v.position.setFromMatrixPosition(M.matrixWorld),v.position.applyMatrix4(m),f++}else if(M.isHemisphereLight){const v=n.hemi[_];v.direction.setFromMatrixPosition(M.matrixWorld),v.direction.transformDirection(m),_++}}}return{setup:o,setupView:l,state:n}}function Pl(r){const e=new q_(r),t=[],n=[];function i(u){c.camera=u,t.length=0,n.length=0}function s(u){t.push(u)}function a(u){n.push(u)}function o(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function Y_(r){let e=new WeakMap;function t(i,s=0){const a=e.get(i);let o;return a===void 0?(o=new Pl(r),e.set(i,[o])):s>=a.length?(o=new Pl(r),a.push(o)):o=a[s],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const K_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,j_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Z_(r,e,t){let n=new Zo;const i=new Be,s=new Be,a=new st,o=new Kf({depthPacking:Mh}),l=new jf,c={},u=t.maxTextureSize,h={[Vn]:qt,[qt]:Vn,[$t]:$t},f=new Wn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Be},radius:{value:4}},vertexShader:K_,fragmentShader:j_}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const g=new rn;g.setAttribute("position",new Nt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new At(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Oo;let d=this.type;this.render=function(P,L,F){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||P.length===0)return;const S=r.getRenderTarget(),T=r.getActiveCubeFace(),E=r.getActiveMipmapLevel(),C=r.state;C.setBlending(ri),C.buffers.depth.getReversed()===!0?C.buffers.color.setClear(0,0,0,0):C.buffers.color.setClear(1,1,1,1),C.buffers.depth.setTest(!0),C.setScissorTest(!1);const D=d!==Fn&&this.type===Fn,k=d===Fn&&this.type!==Fn;for(let H=0,W=P.length;H<W;H++){const Y=P[H],V=Y.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",Y,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;i.copy(V.mapSize);const Q=V.getFrameExtents();if(i.multiply(Q),s.copy(V.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(s.x=Math.floor(u/Q.x),i.x=s.x*Q.x,V.mapSize.x=s.x),i.y>u&&(s.y=Math.floor(u/Q.y),i.y=s.y*Q.y,V.mapSize.y=s.y)),V.map===null||D===!0||k===!0){const ye=this.type!==Fn?{minFilter:kt,magFilter:kt}:{};V.map!==null&&V.map.dispose(),V.map=new ci(i.x,i.y,ye),V.map.texture.name=Y.name+".shadowMap",V.camera.updateProjectionMatrix()}r.setRenderTarget(V.map),r.clear();const oe=V.getViewportCount();for(let ye=0;ye<oe;ye++){const Ne=V.getViewport(ye);a.set(s.x*Ne.x,s.y*Ne.y,s.x*Ne.z,s.y*Ne.w),C.viewport(a),V.updateMatrices(Y,ye),n=V.getFrustum(),v(L,F,V.camera,Y,this.type)}V.isPointLightShadow!==!0&&this.type===Fn&&b(V,F),V.needsUpdate=!1}d=this.type,m.needsUpdate=!1,r.setRenderTarget(S,T,E)};function b(P,L){const F=e.update(_);f.defines.VSM_SAMPLES!==P.blurSamples&&(f.defines.VSM_SAMPLES=P.blurSamples,p.defines.VSM_SAMPLES=P.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),P.mapPass===null&&(P.mapPass=new ci(i.x,i.y)),f.uniforms.shadow_pass.value=P.map.texture,f.uniforms.resolution.value=P.mapSize,f.uniforms.radius.value=P.radius,r.setRenderTarget(P.mapPass),r.clear(),r.renderBufferDirect(L,null,F,f,_,null),p.uniforms.shadow_pass.value=P.mapPass.texture,p.uniforms.resolution.value=P.mapSize,p.uniforms.radius.value=P.radius,r.setRenderTarget(P.map),r.clear(),r.renderBufferDirect(L,null,F,p,_,null)}function M(P,L,F,S){let T=null;const E=F.isPointLight===!0?P.customDistanceMaterial:P.customDepthMaterial;if(E!==void 0)T=E;else if(T=F.isPointLight===!0?l:o,r.localClippingEnabled&&L.clipShadows===!0&&Array.isArray(L.clippingPlanes)&&L.clippingPlanes.length!==0||L.displacementMap&&L.displacementScale!==0||L.alphaMap&&L.alphaTest>0||L.map&&L.alphaTest>0||L.alphaToCoverage===!0){const C=T.uuid,D=L.uuid;let k=c[C];k===void 0&&(k={},c[C]=k);let H=k[D];H===void 0&&(H=T.clone(),k[D]=H,L.addEventListener("dispose",R)),T=H}if(T.visible=L.visible,T.wireframe=L.wireframe,S===Fn?T.side=L.shadowSide!==null?L.shadowSide:L.side:T.side=L.shadowSide!==null?L.shadowSide:h[L.side],T.alphaMap=L.alphaMap,T.alphaTest=L.alphaToCoverage===!0?.5:L.alphaTest,T.map=L.map,T.clipShadows=L.clipShadows,T.clippingPlanes=L.clippingPlanes,T.clipIntersection=L.clipIntersection,T.displacementMap=L.displacementMap,T.displacementScale=L.displacementScale,T.displacementBias=L.displacementBias,T.wireframeLinewidth=L.wireframeLinewidth,T.linewidth=L.linewidth,F.isPointLight===!0&&T.isMeshDistanceMaterial===!0){const C=r.properties.get(T);C.light=F}return T}function v(P,L,F,S,T){if(P.visible===!1)return;if(P.layers.test(L.layers)&&(P.isMesh||P.isLine||P.isPoints)&&(P.castShadow||P.receiveShadow&&T===Fn)&&(!P.frustumCulled||n.intersectsObject(P))){P.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse,P.matrixWorld);const D=e.update(P),k=P.material;if(Array.isArray(k)){const H=D.groups;for(let W=0,Y=H.length;W<Y;W++){const V=H[W],Q=k[V.materialIndex];if(Q&&Q.visible){const oe=M(P,Q,S,T);P.onBeforeShadow(r,P,L,F,D,oe,V),r.renderBufferDirect(F,null,D,oe,P,V),P.onAfterShadow(r,P,L,F,D,oe,V)}}}else if(k.visible){const H=M(P,k,S,T);P.onBeforeShadow(r,P,L,F,D,H,null),r.renderBufferDirect(F,null,D,H,P,null),P.onAfterShadow(r,P,L,F,D,H,null)}}const C=P.children;for(let D=0,k=C.length;D<k;D++)v(C[D],L,F,S,T)}function R(P){P.target.removeEventListener("dispose",R);for(const F in c){const S=c[F],T=P.target.uuid;T in S&&(S[T].dispose(),delete S[T])}}}const $_={[Ba]:za,[ka]:Ga,[Ha]:Wa,[Zi]:Va,[za]:Ba,[Ga]:ka,[Wa]:Ha,[Va]:Zi};function J_(r,e){function t(){let I=!1;const se=new st;let ce=null;const ve=new st(0,0,0,0);return{setMask:function(B){ce!==B&&!I&&(r.colorMask(B,B,B,B),ce=B)},setLocked:function(B){I=B},setClear:function(B,N,j,ne,Pe){Pe===!0&&(B*=ne,N*=ne,j*=ne),se.set(B,N,j,ne),ve.equals(se)===!1&&(r.clearColor(B,N,j,ne),ve.copy(se))},reset:function(){I=!1,ce=null,ve.set(-1,0,0,0)}}}function n(){let I=!1,se=!1,ce=null,ve=null,B=null;return{setReversed:function(N){if(se!==N){const j=e.get("EXT_clip_control");N?j.clipControlEXT(j.LOWER_LEFT_EXT,j.ZERO_TO_ONE_EXT):j.clipControlEXT(j.LOWER_LEFT_EXT,j.NEGATIVE_ONE_TO_ONE_EXT),se=N;const ne=B;B=null,this.setClear(ne)}},getReversed:function(){return se},setTest:function(N){N?ee(r.DEPTH_TEST):de(r.DEPTH_TEST)},setMask:function(N){ce!==N&&!I&&(r.depthMask(N),ce=N)},setFunc:function(N){if(se&&(N=$_[N]),ve!==N){switch(N){case Ba:r.depthFunc(r.NEVER);break;case za:r.depthFunc(r.ALWAYS);break;case ka:r.depthFunc(r.LESS);break;case Zi:r.depthFunc(r.LEQUAL);break;case Ha:r.depthFunc(r.EQUAL);break;case Va:r.depthFunc(r.GEQUAL);break;case Ga:r.depthFunc(r.GREATER);break;case Wa:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}ve=N}},setLocked:function(N){I=N},setClear:function(N){B!==N&&(se&&(N=1-N),r.clearDepth(N),B=N)},reset:function(){I=!1,ce=null,ve=null,B=null,se=!1}}}function i(){let I=!1,se=null,ce=null,ve=null,B=null,N=null,j=null,ne=null,Pe=null;return{setTest:function(De){I||(De?ee(r.STENCIL_TEST):de(r.STENCIL_TEST))},setMask:function(De){se!==De&&!I&&(r.stencilMask(De),se=De)},setFunc:function(De,Ve,ue){(ce!==De||ve!==Ve||B!==ue)&&(r.stencilFunc(De,Ve,ue),ce=De,ve=Ve,B=ue)},setOp:function(De,Ve,ue){(N!==De||j!==Ve||ne!==ue)&&(r.stencilOp(De,Ve,ue),N=De,j=Ve,ne=ue)},setLocked:function(De){I=De},setClear:function(De){Pe!==De&&(r.clearStencil(De),Pe=De)},reset:function(){I=!1,se=null,ce=null,ve=null,B=null,N=null,j=null,ne=null,Pe=null}}}const s=new t,a=new n,o=new i,l=new WeakMap,c=new WeakMap;let u={},h={},f=new WeakMap,p=[],g=null,_=!1,m=null,d=null,b=null,M=null,v=null,R=null,P=null,L=new ze(0,0,0),F=0,S=!1,T=null,E=null,C=null,D=null,k=null;const H=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,Y=0;const V=r.getParameter(r.VERSION);V.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(V)[1]),W=Y>=1):V.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),W=Y>=2);let Q=null,oe={};const ye=r.getParameter(r.SCISSOR_BOX),Ne=r.getParameter(r.VIEWPORT),nt=new st().fromArray(ye),Ke=new st().fromArray(Ne);function Ze(I,se,ce,ve){const B=new Uint8Array(4),N=r.createTexture();r.bindTexture(I,N),r.texParameteri(I,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(I,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let j=0;j<ce;j++)I===r.TEXTURE_3D||I===r.TEXTURE_2D_ARRAY?r.texImage3D(se,0,r.RGBA,1,1,ve,0,r.RGBA,r.UNSIGNED_BYTE,B):r.texImage2D(se+j,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,B);return N}const $={};$[r.TEXTURE_2D]=Ze(r.TEXTURE_2D,r.TEXTURE_2D,1),$[r.TEXTURE_CUBE_MAP]=Ze(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[r.TEXTURE_2D_ARRAY]=Ze(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),$[r.TEXTURE_3D]=Ze(r.TEXTURE_3D,r.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ee(r.DEPTH_TEST),a.setFunc(Zi),Se(!1),me(lc),ee(r.CULL_FACE),Ae(ri);function ee(I){u[I]!==!0&&(r.enable(I),u[I]=!0)}function de(I){u[I]!==!1&&(r.disable(I),u[I]=!1)}function Ee(I,se){return h[I]!==se?(r.bindFramebuffer(I,se),h[I]=se,I===r.DRAW_FRAMEBUFFER&&(h[r.FRAMEBUFFER]=se),I===r.FRAMEBUFFER&&(h[r.DRAW_FRAMEBUFFER]=se),!0):!1}function te(I,se){let ce=p,ve=!1;if(I){ce=f.get(se),ce===void 0&&(ce=[],f.set(se,ce));const B=I.textures;if(ce.length!==B.length||ce[0]!==r.COLOR_ATTACHMENT0){for(let N=0,j=B.length;N<j;N++)ce[N]=r.COLOR_ATTACHMENT0+N;ce.length=B.length,ve=!0}}else ce[0]!==r.BACK&&(ce[0]=r.BACK,ve=!0);ve&&r.drawBuffers(ce)}function ke(I){return g!==I?(r.useProgram(I),g=I,!0):!1}const it={[Mi]:r.FUNC_ADD,[Xu]:r.FUNC_SUBTRACT,[qu]:r.FUNC_REVERSE_SUBTRACT};it[Yu]=r.MIN,it[Ku]=r.MAX;const w={[ju]:r.ZERO,[Zu]:r.ONE,[$u]:r.SRC_COLOR,[Fa]:r.SRC_ALPHA,[ih]:r.SRC_ALPHA_SATURATE,[th]:r.DST_COLOR,[Qu]:r.DST_ALPHA,[Ju]:r.ONE_MINUS_SRC_COLOR,[Oa]:r.ONE_MINUS_SRC_ALPHA,[nh]:r.ONE_MINUS_DST_COLOR,[eh]:r.ONE_MINUS_DST_ALPHA,[rh]:r.CONSTANT_COLOR,[sh]:r.ONE_MINUS_CONSTANT_COLOR,[ah]:r.CONSTANT_ALPHA,[oh]:r.ONE_MINUS_CONSTANT_ALPHA};function Ae(I,se,ce,ve,B,N,j,ne,Pe,De){if(I===ri){_===!0&&(de(r.BLEND),_=!1);return}if(_===!1&&(ee(r.BLEND),_=!0),I!==Wu){if(I!==m||De!==S){if((d!==Mi||v!==Mi)&&(r.blendEquation(r.FUNC_ADD),d=Mi,v=Mi),De)switch(I){case Yi:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Na:r.blendFunc(r.ONE,r.ONE);break;case uc:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case hc:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case Yi:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Na:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case uc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case hc:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}b=null,M=null,R=null,P=null,L.set(0,0,0),F=0,m=I,S=De}return}B=B||se,N=N||ce,j=j||ve,(se!==d||B!==v)&&(r.blendEquationSeparate(it[se],it[B]),d=se,v=B),(ce!==b||ve!==M||N!==R||j!==P)&&(r.blendFuncSeparate(w[ce],w[ve],w[N],w[j]),b=ce,M=ve,R=N,P=j),(ne.equals(L)===!1||Pe!==F)&&(r.blendColor(ne.r,ne.g,ne.b,Pe),L.copy(ne),F=Pe),m=I,S=!1}function _e(I,se){I.side===$t?de(r.CULL_FACE):ee(r.CULL_FACE);let ce=I.side===qt;se&&(ce=!ce),Se(ce),I.blending===Yi&&I.transparent===!1?Ae(ri):Ae(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),a.setFunc(I.depthFunc),a.setTest(I.depthTest),a.setMask(I.depthWrite),s.setMask(I.colorWrite);const ve=I.stencilWrite;o.setTest(ve),ve&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),xe(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?ee(r.SAMPLE_ALPHA_TO_COVERAGE):de(r.SAMPLE_ALPHA_TO_COVERAGE)}function Se(I){T!==I&&(I?r.frontFace(r.CW):r.frontFace(r.CCW),T=I)}function me(I){I!==Hu?(ee(r.CULL_FACE),I!==E&&(I===lc?r.cullFace(r.BACK):I===Vu?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):de(r.CULL_FACE),E=I}function We(I){I!==C&&(W&&r.lineWidth(I),C=I)}function xe(I,se,ce){I?(ee(r.POLYGON_OFFSET_FILL),(D!==se||k!==ce)&&(r.polygonOffset(se,ce),D=se,k=ce)):de(r.POLYGON_OFFSET_FILL)}function Le(I){I?ee(r.SCISSOR_TEST):de(r.SCISSOR_TEST)}function lt(I){I===void 0&&(I=r.TEXTURE0+H-1),Q!==I&&(r.activeTexture(I),Q=I)}function ft(I,se,ce){ce===void 0&&(Q===null?ce=r.TEXTURE0+H-1:ce=Q);let ve=oe[ce];ve===void 0&&(ve={type:void 0,texture:void 0},oe[ce]=ve),(ve.type!==I||ve.texture!==se)&&(Q!==ce&&(r.activeTexture(ce),Q=ce),r.bindTexture(I,se||$[I]),ve.type=I,ve.texture=se)}function A(){const I=oe[Q];I!==void 0&&I.type!==void 0&&(r.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function x(){try{r.compressedTexImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function G(){try{r.compressedTexImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Z(){try{r.texSubImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function J(){try{r.texSubImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function K(){try{r.compressedTexSubImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Re(){try{r.compressedTexSubImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ae(){try{r.texStorage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Te(){try{r.texStorage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function we(){try{r.texImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function re(){try{r.texImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function pe(I){nt.equals(I)===!1&&(r.scissor(I.x,I.y,I.z,I.w),nt.copy(I))}function Ie(I){Ke.equals(I)===!1&&(r.viewport(I.x,I.y,I.z,I.w),Ke.copy(I))}function Ce(I,se){let ce=c.get(se);ce===void 0&&(ce=new WeakMap,c.set(se,ce));let ve=ce.get(I);ve===void 0&&(ve=r.getUniformBlockIndex(se,I.name),ce.set(I,ve))}function le(I,se){const ve=c.get(se).get(I);l.get(se)!==ve&&(r.uniformBlockBinding(se,ve,I.__bindingPointIndex),l.set(se,ve))}function Ge(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),a.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),u={},Q=null,oe={},h={},f=new WeakMap,p=[],g=null,_=!1,m=null,d=null,b=null,M=null,v=null,R=null,P=null,L=new ze(0,0,0),F=0,S=!1,T=null,E=null,C=null,D=null,k=null,nt.set(0,0,r.canvas.width,r.canvas.height),Ke.set(0,0,r.canvas.width,r.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:ee,disable:de,bindFramebuffer:Ee,drawBuffers:te,useProgram:ke,setBlending:Ae,setMaterial:_e,setFlipSided:Se,setCullFace:me,setLineWidth:We,setPolygonOffset:xe,setScissorTest:Le,activeTexture:lt,bindTexture:ft,unbindTexture:A,compressedTexImage2D:x,compressedTexImage3D:G,texImage2D:we,texImage3D:re,updateUBOMapping:Ce,uniformBlockBinding:le,texStorage2D:ae,texStorage3D:Te,texSubImage2D:Z,texSubImage3D:J,compressedTexSubImage2D:K,compressedTexSubImage3D:Re,scissor:pe,viewport:Ie,reset:Ge}}function Q_(r,e,t,n,i,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Be,u=new WeakMap;let h;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,x){return p?new OffscreenCanvas(A,x):Ur("canvas")}function _(A,x,G){let Z=1;const J=ft(A);if((J.width>G||J.height>G)&&(Z=G/Math.max(J.width,J.height)),Z<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const K=Math.floor(Z*J.width),Re=Math.floor(Z*J.height);h===void 0&&(h=g(K,Re));const ae=x?g(K,Re):h;return ae.width=K,ae.height=Re,ae.getContext("2d").drawImage(A,0,0,K,Re),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+K+"x"+Re+")."),ae}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),A;return A}function m(A){return A.generateMipmaps}function d(A){r.generateMipmap(A)}function b(A){return A.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?r.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function M(A,x,G,Z,J=!1){if(A!==null){if(r[A]!==void 0)return r[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let K=x;if(x===r.RED&&(G===r.FLOAT&&(K=r.R32F),G===r.HALF_FLOAT&&(K=r.R16F),G===r.UNSIGNED_BYTE&&(K=r.R8)),x===r.RED_INTEGER&&(G===r.UNSIGNED_BYTE&&(K=r.R8UI),G===r.UNSIGNED_SHORT&&(K=r.R16UI),G===r.UNSIGNED_INT&&(K=r.R32UI),G===r.BYTE&&(K=r.R8I),G===r.SHORT&&(K=r.R16I),G===r.INT&&(K=r.R32I)),x===r.RG&&(G===r.FLOAT&&(K=r.RG32F),G===r.HALF_FLOAT&&(K=r.RG16F),G===r.UNSIGNED_BYTE&&(K=r.RG8)),x===r.RG_INTEGER&&(G===r.UNSIGNED_BYTE&&(K=r.RG8UI),G===r.UNSIGNED_SHORT&&(K=r.RG16UI),G===r.UNSIGNED_INT&&(K=r.RG32UI),G===r.BYTE&&(K=r.RG8I),G===r.SHORT&&(K=r.RG16I),G===r.INT&&(K=r.RG32I)),x===r.RGB_INTEGER&&(G===r.UNSIGNED_BYTE&&(K=r.RGB8UI),G===r.UNSIGNED_SHORT&&(K=r.RGB16UI),G===r.UNSIGNED_INT&&(K=r.RGB32UI),G===r.BYTE&&(K=r.RGB8I),G===r.SHORT&&(K=r.RGB16I),G===r.INT&&(K=r.RGB32I)),x===r.RGBA_INTEGER&&(G===r.UNSIGNED_BYTE&&(K=r.RGBA8UI),G===r.UNSIGNED_SHORT&&(K=r.RGBA16UI),G===r.UNSIGNED_INT&&(K=r.RGBA32UI),G===r.BYTE&&(K=r.RGBA8I),G===r.SHORT&&(K=r.RGBA16I),G===r.INT&&(K=r.RGBA32I)),x===r.RGB&&(G===r.UNSIGNED_INT_5_9_9_9_REV&&(K=r.RGB9_E5),G===r.UNSIGNED_INT_10F_11F_11F_REV&&(K=r.R11F_G11F_B10F)),x===r.RGBA){const Re=J?Ls:tt.getTransfer(Z);G===r.FLOAT&&(K=r.RGBA32F),G===r.HALF_FLOAT&&(K=r.RGBA16F),G===r.UNSIGNED_BYTE&&(K=Re===ht?r.SRGB8_ALPHA8:r.RGBA8),G===r.UNSIGNED_SHORT_4_4_4_4&&(K=r.RGBA4),G===r.UNSIGNED_SHORT_5_5_5_1&&(K=r.RGB5_A1)}return(K===r.R16F||K===r.R32F||K===r.RG16F||K===r.RG32F||K===r.RGBA16F||K===r.RGBA32F)&&e.get("EXT_color_buffer_float"),K}function v(A,x){let G;return A?x===null||x===oi||x===Cr?G=r.DEPTH24_STENCIL8:x===fn?G=r.DEPTH32F_STENCIL8:x===Rr&&(G=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===oi||x===Cr?G=r.DEPTH_COMPONENT24:x===fn?G=r.DEPTH_COMPONENT32F:x===Rr&&(G=r.DEPTH_COMPONENT16),G}function R(A,x){return m(A)===!0||A.isFramebufferTexture&&A.minFilter!==kt&&A.minFilter!==Xt?Math.log2(Math.max(x.width,x.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?x.mipmaps.length:1}function P(A){const x=A.target;x.removeEventListener("dispose",P),F(x),x.isVideoTexture&&u.delete(x)}function L(A){const x=A.target;x.removeEventListener("dispose",L),T(x)}function F(A){const x=n.get(A);if(x.__webglInit===void 0)return;const G=A.source,Z=f.get(G);if(Z){const J=Z[x.__cacheKey];J.usedTimes--,J.usedTimes===0&&S(A),Object.keys(Z).length===0&&f.delete(G)}n.remove(A)}function S(A){const x=n.get(A);r.deleteTexture(x.__webglTexture);const G=A.source,Z=f.get(G);delete Z[x.__cacheKey],a.memory.textures--}function T(A){const x=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(x.__webglFramebuffer[Z]))for(let J=0;J<x.__webglFramebuffer[Z].length;J++)r.deleteFramebuffer(x.__webglFramebuffer[Z][J]);else r.deleteFramebuffer(x.__webglFramebuffer[Z]);x.__webglDepthbuffer&&r.deleteRenderbuffer(x.__webglDepthbuffer[Z])}else{if(Array.isArray(x.__webglFramebuffer))for(let Z=0;Z<x.__webglFramebuffer.length;Z++)r.deleteFramebuffer(x.__webglFramebuffer[Z]);else r.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&r.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&r.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let Z=0;Z<x.__webglColorRenderbuffer.length;Z++)x.__webglColorRenderbuffer[Z]&&r.deleteRenderbuffer(x.__webglColorRenderbuffer[Z]);x.__webglDepthRenderbuffer&&r.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const G=A.textures;for(let Z=0,J=G.length;Z<J;Z++){const K=n.get(G[Z]);K.__webglTexture&&(r.deleteTexture(K.__webglTexture),a.memory.textures--),n.remove(G[Z])}n.remove(A)}let E=0;function C(){E=0}function D(){const A=E;return A>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+i.maxTextures),E+=1,A}function k(A){const x=[];return x.push(A.wrapS),x.push(A.wrapT),x.push(A.wrapR||0),x.push(A.magFilter),x.push(A.minFilter),x.push(A.anisotropy),x.push(A.internalFormat),x.push(A.format),x.push(A.type),x.push(A.generateMipmaps),x.push(A.premultiplyAlpha),x.push(A.flipY),x.push(A.unpackAlignment),x.push(A.colorSpace),x.join()}function H(A,x){const G=n.get(A);if(A.isVideoTexture&&Le(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&G.__version!==A.version){const Z=A.image;if(Z===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{$(G,A,x);return}}else A.isExternalTexture&&(G.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(r.TEXTURE_2D,G.__webglTexture,r.TEXTURE0+x)}function W(A,x){const G=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&G.__version!==A.version){$(G,A,x);return}t.bindTexture(r.TEXTURE_2D_ARRAY,G.__webglTexture,r.TEXTURE0+x)}function Y(A,x){const G=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&G.__version!==A.version){$(G,A,x);return}t.bindTexture(r.TEXTURE_3D,G.__webglTexture,r.TEXTURE0+x)}function V(A,x){const G=n.get(A);if(A.version>0&&G.__version!==A.version){ee(G,A,x);return}t.bindTexture(r.TEXTURE_CUBE_MAP,G.__webglTexture,r.TEXTURE0+x)}const Q={[Gn]:r.REPEAT,[ii]:r.CLAMP_TO_EDGE,[Ps]:r.MIRRORED_REPEAT},oe={[kt]:r.NEAREST,[ql]:r.NEAREST_MIPMAP_NEAREST,[Sr]:r.NEAREST_MIPMAP_LINEAR,[Xt]:r.LINEAR,[Es]:r.LINEAR_MIPMAP_NEAREST,[On]:r.LINEAR_MIPMAP_LINEAR},ye={[Sh]:r.NEVER,[Rh]:r.ALWAYS,[Eh]:r.LESS,[nu]:r.LEQUAL,[Th]:r.EQUAL,[wh]:r.GEQUAL,[bh]:r.GREATER,[Ah]:r.NOTEQUAL};function Ne(A,x){if(x.type===fn&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===Xt||x.magFilter===Es||x.magFilter===Sr||x.magFilter===On||x.minFilter===Xt||x.minFilter===Es||x.minFilter===Sr||x.minFilter===On)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(A,r.TEXTURE_WRAP_S,Q[x.wrapS]),r.texParameteri(A,r.TEXTURE_WRAP_T,Q[x.wrapT]),(A===r.TEXTURE_3D||A===r.TEXTURE_2D_ARRAY)&&r.texParameteri(A,r.TEXTURE_WRAP_R,Q[x.wrapR]),r.texParameteri(A,r.TEXTURE_MAG_FILTER,oe[x.magFilter]),r.texParameteri(A,r.TEXTURE_MIN_FILTER,oe[x.minFilter]),x.compareFunction&&(r.texParameteri(A,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(A,r.TEXTURE_COMPARE_FUNC,ye[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===kt||x.minFilter!==Sr&&x.minFilter!==On||x.type===fn&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){const G=e.get("EXT_texture_filter_anisotropic");r.texParameterf(A,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,i.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function nt(A,x){let G=!1;A.__webglInit===void 0&&(A.__webglInit=!0,x.addEventListener("dispose",P));const Z=x.source;let J=f.get(Z);J===void 0&&(J={},f.set(Z,J));const K=k(x);if(K!==A.__cacheKey){J[K]===void 0&&(J[K]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,G=!0),J[K].usedTimes++;const Re=J[A.__cacheKey];Re!==void 0&&(J[A.__cacheKey].usedTimes--,Re.usedTimes===0&&S(x)),A.__cacheKey=K,A.__webglTexture=J[K].texture}return G}function Ke(A,x,G){return Math.floor(Math.floor(A/G)/x)}function Ze(A,x,G,Z){const K=A.updateRanges;if(K.length===0)t.texSubImage2D(r.TEXTURE_2D,0,0,0,x.width,x.height,G,Z,x.data);else{K.sort((re,pe)=>re.start-pe.start);let Re=0;for(let re=1;re<K.length;re++){const pe=K[Re],Ie=K[re],Ce=pe.start+pe.count,le=Ke(Ie.start,x.width,4),Ge=Ke(pe.start,x.width,4);Ie.start<=Ce+1&&le===Ge&&Ke(Ie.start+Ie.count-1,x.width,4)===le?pe.count=Math.max(pe.count,Ie.start+Ie.count-pe.start):(++Re,K[Re]=Ie)}K.length=Re+1;const ae=r.getParameter(r.UNPACK_ROW_LENGTH),Te=r.getParameter(r.UNPACK_SKIP_PIXELS),we=r.getParameter(r.UNPACK_SKIP_ROWS);r.pixelStorei(r.UNPACK_ROW_LENGTH,x.width);for(let re=0,pe=K.length;re<pe;re++){const Ie=K[re],Ce=Math.floor(Ie.start/4),le=Math.ceil(Ie.count/4),Ge=Ce%x.width,I=Math.floor(Ce/x.width),se=le,ce=1;r.pixelStorei(r.UNPACK_SKIP_PIXELS,Ge),r.pixelStorei(r.UNPACK_SKIP_ROWS,I),t.texSubImage2D(r.TEXTURE_2D,0,Ge,I,se,ce,G,Z,x.data)}A.clearUpdateRanges(),r.pixelStorei(r.UNPACK_ROW_LENGTH,ae),r.pixelStorei(r.UNPACK_SKIP_PIXELS,Te),r.pixelStorei(r.UNPACK_SKIP_ROWS,we)}}function $(A,x,G){let Z=r.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(Z=r.TEXTURE_2D_ARRAY),x.isData3DTexture&&(Z=r.TEXTURE_3D);const J=nt(A,x),K=x.source;t.bindTexture(Z,A.__webglTexture,r.TEXTURE0+G);const Re=n.get(K);if(K.version!==Re.__version||J===!0){t.activeTexture(r.TEXTURE0+G);const ae=tt.getPrimaries(tt.workingColorSpace),Te=x.colorSpace===ni?null:tt.getPrimaries(x.colorSpace),we=x.colorSpace===ni||ae===Te?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,x.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,x.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,we);let re=_(x.image,!1,i.maxTextureSize);re=lt(x,re);const pe=s.convert(x.format,x.colorSpace),Ie=s.convert(x.type);let Ce=M(x.internalFormat,pe,Ie,x.colorSpace,x.isVideoTexture);Ne(Z,x);let le;const Ge=x.mipmaps,I=x.isVideoTexture!==!0,se=Re.__version===void 0||J===!0,ce=K.dataReady,ve=R(x,re);if(x.isDepthTexture)Ce=v(x.format===Lr,x.type),se&&(I?t.texStorage2D(r.TEXTURE_2D,1,Ce,re.width,re.height):t.texImage2D(r.TEXTURE_2D,0,Ce,re.width,re.height,0,pe,Ie,null));else if(x.isDataTexture)if(Ge.length>0){I&&se&&t.texStorage2D(r.TEXTURE_2D,ve,Ce,Ge[0].width,Ge[0].height);for(let B=0,N=Ge.length;B<N;B++)le=Ge[B],I?ce&&t.texSubImage2D(r.TEXTURE_2D,B,0,0,le.width,le.height,pe,Ie,le.data):t.texImage2D(r.TEXTURE_2D,B,Ce,le.width,le.height,0,pe,Ie,le.data);x.generateMipmaps=!1}else I?(se&&t.texStorage2D(r.TEXTURE_2D,ve,Ce,re.width,re.height),ce&&Ze(x,re,pe,Ie)):t.texImage2D(r.TEXTURE_2D,0,Ce,re.width,re.height,0,pe,Ie,re.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){I&&se&&t.texStorage3D(r.TEXTURE_2D_ARRAY,ve,Ce,Ge[0].width,Ge[0].height,re.depth);for(let B=0,N=Ge.length;B<N;B++)if(le=Ge[B],x.format!==nn)if(pe!==null)if(I){if(ce)if(x.layerUpdates.size>0){const j=al(le.width,le.height,x.format,x.type);for(const ne of x.layerUpdates){const Pe=le.data.subarray(ne*j/le.data.BYTES_PER_ELEMENT,(ne+1)*j/le.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,B,0,0,ne,le.width,le.height,1,pe,Pe)}x.clearLayerUpdates()}else t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,B,0,0,0,le.width,le.height,re.depth,pe,le.data)}else t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,B,Ce,le.width,le.height,re.depth,0,le.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else I?ce&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,B,0,0,0,le.width,le.height,re.depth,pe,Ie,le.data):t.texImage3D(r.TEXTURE_2D_ARRAY,B,Ce,le.width,le.height,re.depth,0,pe,Ie,le.data)}else{I&&se&&t.texStorage2D(r.TEXTURE_2D,ve,Ce,Ge[0].width,Ge[0].height);for(let B=0,N=Ge.length;B<N;B++)le=Ge[B],x.format!==nn?pe!==null?I?ce&&t.compressedTexSubImage2D(r.TEXTURE_2D,B,0,0,le.width,le.height,pe,le.data):t.compressedTexImage2D(r.TEXTURE_2D,B,Ce,le.width,le.height,0,le.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):I?ce&&t.texSubImage2D(r.TEXTURE_2D,B,0,0,le.width,le.height,pe,Ie,le.data):t.texImage2D(r.TEXTURE_2D,B,Ce,le.width,le.height,0,pe,Ie,le.data)}else if(x.isDataArrayTexture)if(I){if(se&&t.texStorage3D(r.TEXTURE_2D_ARRAY,ve,Ce,re.width,re.height,re.depth),ce)if(x.layerUpdates.size>0){const B=al(re.width,re.height,x.format,x.type);for(const N of x.layerUpdates){const j=re.data.subarray(N*B/re.data.BYTES_PER_ELEMENT,(N+1)*B/re.data.BYTES_PER_ELEMENT);t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,N,re.width,re.height,1,pe,Ie,j)}x.clearLayerUpdates()}else t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,re.width,re.height,re.depth,pe,Ie,re.data)}else t.texImage3D(r.TEXTURE_2D_ARRAY,0,Ce,re.width,re.height,re.depth,0,pe,Ie,re.data);else if(x.isData3DTexture)I?(se&&t.texStorage3D(r.TEXTURE_3D,ve,Ce,re.width,re.height,re.depth),ce&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,re.width,re.height,re.depth,pe,Ie,re.data)):t.texImage3D(r.TEXTURE_3D,0,Ce,re.width,re.height,re.depth,0,pe,Ie,re.data);else if(x.isFramebufferTexture){if(se)if(I)t.texStorage2D(r.TEXTURE_2D,ve,Ce,re.width,re.height);else{let B=re.width,N=re.height;for(let j=0;j<ve;j++)t.texImage2D(r.TEXTURE_2D,j,Ce,B,N,0,pe,Ie,null),B>>=1,N>>=1}}else if(Ge.length>0){if(I&&se){const B=ft(Ge[0]);t.texStorage2D(r.TEXTURE_2D,ve,Ce,B.width,B.height)}for(let B=0,N=Ge.length;B<N;B++)le=Ge[B],I?ce&&t.texSubImage2D(r.TEXTURE_2D,B,0,0,pe,Ie,le):t.texImage2D(r.TEXTURE_2D,B,Ce,pe,Ie,le);x.generateMipmaps=!1}else if(I){if(se){const B=ft(re);t.texStorage2D(r.TEXTURE_2D,ve,Ce,B.width,B.height)}ce&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,pe,Ie,re)}else t.texImage2D(r.TEXTURE_2D,0,Ce,pe,Ie,re);m(x)&&d(Z),Re.__version=K.version,x.onUpdate&&x.onUpdate(x)}A.__version=x.version}function ee(A,x,G){if(x.image.length!==6)return;const Z=nt(A,x),J=x.source;t.bindTexture(r.TEXTURE_CUBE_MAP,A.__webglTexture,r.TEXTURE0+G);const K=n.get(J);if(J.version!==K.__version||Z===!0){t.activeTexture(r.TEXTURE0+G);const Re=tt.getPrimaries(tt.workingColorSpace),ae=x.colorSpace===ni?null:tt.getPrimaries(x.colorSpace),Te=x.colorSpace===ni||Re===ae?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,x.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,x.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Te);const we=x.isCompressedTexture||x.image[0].isCompressedTexture,re=x.image[0]&&x.image[0].isDataTexture,pe=[];for(let N=0;N<6;N++)!we&&!re?pe[N]=_(x.image[N],!0,i.maxCubemapSize):pe[N]=re?x.image[N].image:x.image[N],pe[N]=lt(x,pe[N]);const Ie=pe[0],Ce=s.convert(x.format,x.colorSpace),le=s.convert(x.type),Ge=M(x.internalFormat,Ce,le,x.colorSpace),I=x.isVideoTexture!==!0,se=K.__version===void 0||Z===!0,ce=J.dataReady;let ve=R(x,Ie);Ne(r.TEXTURE_CUBE_MAP,x);let B;if(we){I&&se&&t.texStorage2D(r.TEXTURE_CUBE_MAP,ve,Ge,Ie.width,Ie.height);for(let N=0;N<6;N++){B=pe[N].mipmaps;for(let j=0;j<B.length;j++){const ne=B[j];x.format!==nn?Ce!==null?I?ce&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+N,j,0,0,ne.width,ne.height,Ce,ne.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+N,j,Ge,ne.width,ne.height,0,ne.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):I?ce&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+N,j,0,0,ne.width,ne.height,Ce,le,ne.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+N,j,Ge,ne.width,ne.height,0,Ce,le,ne.data)}}}else{if(B=x.mipmaps,I&&se){B.length>0&&ve++;const N=ft(pe[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,ve,Ge,N.width,N.height)}for(let N=0;N<6;N++)if(re){I?ce&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+N,0,0,0,pe[N].width,pe[N].height,Ce,le,pe[N].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+N,0,Ge,pe[N].width,pe[N].height,0,Ce,le,pe[N].data);for(let j=0;j<B.length;j++){const Pe=B[j].image[N].image;I?ce&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+N,j+1,0,0,Pe.width,Pe.height,Ce,le,Pe.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+N,j+1,Ge,Pe.width,Pe.height,0,Ce,le,Pe.data)}}else{I?ce&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+N,0,0,0,Ce,le,pe[N]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+N,0,Ge,Ce,le,pe[N]);for(let j=0;j<B.length;j++){const ne=B[j];I?ce&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+N,j+1,0,0,Ce,le,ne.image[N]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+N,j+1,Ge,Ce,le,ne.image[N])}}}m(x)&&d(r.TEXTURE_CUBE_MAP),K.__version=J.version,x.onUpdate&&x.onUpdate(x)}A.__version=x.version}function de(A,x,G,Z,J,K){const Re=s.convert(G.format,G.colorSpace),ae=s.convert(G.type),Te=M(G.internalFormat,Re,ae,G.colorSpace),we=n.get(x),re=n.get(G);if(re.__renderTarget=x,!we.__hasExternalTextures){const pe=Math.max(1,x.width>>K),Ie=Math.max(1,x.height>>K);J===r.TEXTURE_3D||J===r.TEXTURE_2D_ARRAY?t.texImage3D(J,K,Te,pe,Ie,x.depth,0,Re,ae,null):t.texImage2D(J,K,Te,pe,Ie,0,Re,ae,null)}t.bindFramebuffer(r.FRAMEBUFFER,A),xe(x)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,Z,J,re.__webglTexture,0,We(x)):(J===r.TEXTURE_2D||J>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,Z,J,re.__webglTexture,K),t.bindFramebuffer(r.FRAMEBUFFER,null)}function Ee(A,x,G){if(r.bindRenderbuffer(r.RENDERBUFFER,A),x.depthBuffer){const Z=x.depthTexture,J=Z&&Z.isDepthTexture?Z.type:null,K=v(x.stencilBuffer,J),Re=x.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ae=We(x);xe(x)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,ae,K,x.width,x.height):G?r.renderbufferStorageMultisample(r.RENDERBUFFER,ae,K,x.width,x.height):r.renderbufferStorage(r.RENDERBUFFER,K,x.width,x.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,Re,r.RENDERBUFFER,A)}else{const Z=x.textures;for(let J=0;J<Z.length;J++){const K=Z[J],Re=s.convert(K.format,K.colorSpace),ae=s.convert(K.type),Te=M(K.internalFormat,Re,ae,K.colorSpace),we=We(x);G&&xe(x)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,we,Te,x.width,x.height):xe(x)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,we,Te,x.width,x.height):r.renderbufferStorage(r.RENDERBUFFER,Te,x.width,x.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function te(A,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(r.FRAMEBUFFER,A),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Z=n.get(x.depthTexture);Z.__renderTarget=x,(!Z.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),H(x.depthTexture,0);const J=Z.__webglTexture,K=We(x);if(x.depthTexture.format===Pr)xe(x)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,J,0,K):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,J,0);else if(x.depthTexture.format===Lr)xe(x)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,J,0,K):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function ke(A){const x=n.get(A),G=A.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==A.depthTexture){const Z=A.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),Z){const J=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,Z.removeEventListener("dispose",J)};Z.addEventListener("dispose",J),x.__depthDisposeCallback=J}x.__boundDepthTexture=Z}if(A.depthTexture&&!x.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");const Z=A.texture.mipmaps;Z&&Z.length>0?te(x.__webglFramebuffer[0],A):te(x.__webglFramebuffer,A)}else if(G){x.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(t.bindFramebuffer(r.FRAMEBUFFER,x.__webglFramebuffer[Z]),x.__webglDepthbuffer[Z]===void 0)x.__webglDepthbuffer[Z]=r.createRenderbuffer(),Ee(x.__webglDepthbuffer[Z],A,!1);else{const J=A.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,K=x.__webglDepthbuffer[Z];r.bindRenderbuffer(r.RENDERBUFFER,K),r.framebufferRenderbuffer(r.FRAMEBUFFER,J,r.RENDERBUFFER,K)}}else{const Z=A.texture.mipmaps;if(Z&&Z.length>0?t.bindFramebuffer(r.FRAMEBUFFER,x.__webglFramebuffer[0]):t.bindFramebuffer(r.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=r.createRenderbuffer(),Ee(x.__webglDepthbuffer,A,!1);else{const J=A.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,K=x.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,K),r.framebufferRenderbuffer(r.FRAMEBUFFER,J,r.RENDERBUFFER,K)}}t.bindFramebuffer(r.FRAMEBUFFER,null)}function it(A,x,G){const Z=n.get(A);x!==void 0&&de(Z.__webglFramebuffer,A,A.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),G!==void 0&&ke(A)}function w(A){const x=A.texture,G=n.get(A),Z=n.get(x);A.addEventListener("dispose",L);const J=A.textures,K=A.isWebGLCubeRenderTarget===!0,Re=J.length>1;if(Re||(Z.__webglTexture===void 0&&(Z.__webglTexture=r.createTexture()),Z.__version=x.version,a.memory.textures++),K){G.__webglFramebuffer=[];for(let ae=0;ae<6;ae++)if(x.mipmaps&&x.mipmaps.length>0){G.__webglFramebuffer[ae]=[];for(let Te=0;Te<x.mipmaps.length;Te++)G.__webglFramebuffer[ae][Te]=r.createFramebuffer()}else G.__webglFramebuffer[ae]=r.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){G.__webglFramebuffer=[];for(let ae=0;ae<x.mipmaps.length;ae++)G.__webglFramebuffer[ae]=r.createFramebuffer()}else G.__webglFramebuffer=r.createFramebuffer();if(Re)for(let ae=0,Te=J.length;ae<Te;ae++){const we=n.get(J[ae]);we.__webglTexture===void 0&&(we.__webglTexture=r.createTexture(),a.memory.textures++)}if(A.samples>0&&xe(A)===!1){G.__webglMultisampledFramebuffer=r.createFramebuffer(),G.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let ae=0;ae<J.length;ae++){const Te=J[ae];G.__webglColorRenderbuffer[ae]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,G.__webglColorRenderbuffer[ae]);const we=s.convert(Te.format,Te.colorSpace),re=s.convert(Te.type),pe=M(Te.internalFormat,we,re,Te.colorSpace,A.isXRRenderTarget===!0),Ie=We(A);r.renderbufferStorageMultisample(r.RENDERBUFFER,Ie,pe,A.width,A.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+ae,r.RENDERBUFFER,G.__webglColorRenderbuffer[ae])}r.bindRenderbuffer(r.RENDERBUFFER,null),A.depthBuffer&&(G.__webglDepthRenderbuffer=r.createRenderbuffer(),Ee(G.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(K){t.bindTexture(r.TEXTURE_CUBE_MAP,Z.__webglTexture),Ne(r.TEXTURE_CUBE_MAP,x);for(let ae=0;ae<6;ae++)if(x.mipmaps&&x.mipmaps.length>0)for(let Te=0;Te<x.mipmaps.length;Te++)de(G.__webglFramebuffer[ae][Te],A,x,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+ae,Te);else de(G.__webglFramebuffer[ae],A,x,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0);m(x)&&d(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Re){for(let ae=0,Te=J.length;ae<Te;ae++){const we=J[ae],re=n.get(we);let pe=r.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(pe=A.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(pe,re.__webglTexture),Ne(pe,we),de(G.__webglFramebuffer,A,we,r.COLOR_ATTACHMENT0+ae,pe,0),m(we)&&d(pe)}t.unbindTexture()}else{let ae=r.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(ae=A.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(ae,Z.__webglTexture),Ne(ae,x),x.mipmaps&&x.mipmaps.length>0)for(let Te=0;Te<x.mipmaps.length;Te++)de(G.__webglFramebuffer[Te],A,x,r.COLOR_ATTACHMENT0,ae,Te);else de(G.__webglFramebuffer,A,x,r.COLOR_ATTACHMENT0,ae,0);m(x)&&d(ae),t.unbindTexture()}A.depthBuffer&&ke(A)}function Ae(A){const x=A.textures;for(let G=0,Z=x.length;G<Z;G++){const J=x[G];if(m(J)){const K=b(A),Re=n.get(J).__webglTexture;t.bindTexture(K,Re),d(K),t.unbindTexture()}}}const _e=[],Se=[];function me(A){if(A.samples>0){if(xe(A)===!1){const x=A.textures,G=A.width,Z=A.height;let J=r.COLOR_BUFFER_BIT;const K=A.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Re=n.get(A),ae=x.length>1;if(ae)for(let we=0;we<x.length;we++)t.bindFramebuffer(r.FRAMEBUFFER,Re.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+we,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,Re.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+we,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,Re.__webglMultisampledFramebuffer);const Te=A.texture.mipmaps;Te&&Te.length>0?t.bindFramebuffer(r.DRAW_FRAMEBUFFER,Re.__webglFramebuffer[0]):t.bindFramebuffer(r.DRAW_FRAMEBUFFER,Re.__webglFramebuffer);for(let we=0;we<x.length;we++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(J|=r.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(J|=r.STENCIL_BUFFER_BIT)),ae){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,Re.__webglColorRenderbuffer[we]);const re=n.get(x[we]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,re,0)}r.blitFramebuffer(0,0,G,Z,0,0,G,Z,J,r.NEAREST),l===!0&&(_e.length=0,Se.length=0,_e.push(r.COLOR_ATTACHMENT0+we),A.depthBuffer&&A.resolveDepthBuffer===!1&&(_e.push(K),Se.push(K),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,Se)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,_e))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),ae)for(let we=0;we<x.length;we++){t.bindFramebuffer(r.FRAMEBUFFER,Re.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+we,r.RENDERBUFFER,Re.__webglColorRenderbuffer[we]);const re=n.get(x[we]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,Re.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+we,r.TEXTURE_2D,re,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,Re.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){const x=A.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[x])}}}function We(A){return Math.min(i.maxSamples,A.samples)}function xe(A){const x=n.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function Le(A){const x=a.render.frame;u.get(A)!==x&&(u.set(A,x),A.update())}function lt(A,x){const G=A.colorSpace,Z=A.format,J=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||G!==Vt&&G!==ni&&(tt.getTransfer(G)===ht?(Z!==nn||J!==mn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),x}function ft(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=D,this.resetTextureUnits=C,this.setTexture2D=H,this.setTexture2DArray=W,this.setTexture3D=Y,this.setTextureCube=V,this.rebindTextures=it,this.setupRenderTarget=w,this.updateRenderTargetMipmap=Ae,this.updateMultisampleRenderTarget=me,this.setupDepthRenderbuffer=ke,this.setupFrameBufferTexture=de,this.useMultisampledRTT=xe}function e0(r,e){function t(n,i=ni){let s;const a=tt.getTransfer(i);if(n===mn)return r.UNSIGNED_BYTE;if(n===zo)return r.UNSIGNED_SHORT_4_4_4_4;if(n===ko)return r.UNSIGNED_SHORT_5_5_5_1;if(n===jl)return r.UNSIGNED_INT_5_9_9_9_REV;if(n===Zl)return r.UNSIGNED_INT_10F_11F_11F_REV;if(n===Yl)return r.BYTE;if(n===Kl)return r.SHORT;if(n===Rr)return r.UNSIGNED_SHORT;if(n===Bo)return r.INT;if(n===oi)return r.UNSIGNED_INT;if(n===fn)return r.FLOAT;if(n===sr)return r.HALF_FLOAT;if(n===$l)return r.ALPHA;if(n===Jl)return r.RGB;if(n===nn)return r.RGBA;if(n===Pr)return r.DEPTH_COMPONENT;if(n===Lr)return r.DEPTH_STENCIL;if(n===Ho)return r.RED;if(n===Vo)return r.RED_INTEGER;if(n===Ql)return r.RG;if(n===Go)return r.RG_INTEGER;if(n===Wo)return r.RGBA_INTEGER;if(n===Ts||n===bs||n===As||n===ws)if(a===ht)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===Ts)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===bs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===As)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ws)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===Ts)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===bs)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===As)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ws)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ya||n===Ka||n===ja||n===Za)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===Ya)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ka)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ja)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Za)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===$a||n===Ja||n===Qa)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===$a||n===Ja)return a===ht?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===Qa)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===eo||n===to||n===no||n===io||n===ro||n===so||n===ao||n===oo||n===co||n===lo||n===uo||n===ho||n===fo||n===po)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===eo)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===to)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===no)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===io)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ro)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===so)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ao)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===oo)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===co)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===lo)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===uo)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ho)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===fo)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===po)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===mo||n===go||n===_o)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===mo)return a===ht?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===go)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===_o)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===xo||n===vo||n===Mo||n===yo)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===xo)return s.COMPRESSED_RED_RGTC1_EXT;if(n===vo)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Mo)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===yo)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Cr?r.UNSIGNED_INT_24_8:r[n]!==void 0?r[n]:null}return{convert:t}}const t0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,n0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class i0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new mu(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Wn({vertexShader:t0,fragmentShader:n0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new At(new kn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class r0 extends ar{constructor(e,t){super();const n=this;let i=null,s=1,a=null,o="local-floor",l=1,c=null,u=null,h=null,f=null,p=null,g=null;const _=typeof XRWebGLBinding<"u",m=new i0,d={},b=t.getContextAttributes();let M=null,v=null;const R=[],P=[],L=new Be;let F=null;const S=new zt;S.viewport=new st;const T=new zt;T.viewport=new st;const E=[S,T],C=new md;let D=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let ee=R[$];return ee===void 0&&(ee=new ma,R[$]=ee),ee.getTargetRaySpace()},this.getControllerGrip=function($){let ee=R[$];return ee===void 0&&(ee=new ma,R[$]=ee),ee.getGripSpace()},this.getHand=function($){let ee=R[$];return ee===void 0&&(ee=new ma,R[$]=ee),ee.getHandSpace()};function H($){const ee=P.indexOf($.inputSource);if(ee===-1)return;const de=R[ee];de!==void 0&&(de.update($.inputSource,$.frame,c||a),de.dispatchEvent({type:$.type,data:$.inputSource}))}function W(){i.removeEventListener("select",H),i.removeEventListener("selectstart",H),i.removeEventListener("selectend",H),i.removeEventListener("squeeze",H),i.removeEventListener("squeezestart",H),i.removeEventListener("squeezeend",H),i.removeEventListener("end",W),i.removeEventListener("inputsourceschange",Y);for(let $=0;$<R.length;$++){const ee=P[$];ee!==null&&(P[$]=null,R[$].disconnect(ee))}D=null,k=null,m.reset();for(const $ in d)delete d[$];e.setRenderTarget(M),p=null,f=null,h=null,i=null,v=null,Ze.stop(),n.isPresenting=!1,e.setPixelRatio(F),e.setSize(L.width,L.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){s=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return h===null&&_&&(h=new XRWebGLBinding(i,t)),h},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function($){if(i=$,i!==null){if(M=e.getRenderTarget(),i.addEventListener("select",H),i.addEventListener("selectstart",H),i.addEventListener("selectend",H),i.addEventListener("squeeze",H),i.addEventListener("squeezestart",H),i.addEventListener("squeezeend",H),i.addEventListener("end",W),i.addEventListener("inputsourceschange",Y),b.xrCompatible!==!0&&await t.makeXRCompatible(),F=e.getPixelRatio(),e.getSize(L),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let de=null,Ee=null,te=null;b.depth&&(te=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,de=b.stencil?Lr:Pr,Ee=b.stencil?Cr:oi);const ke={colorFormat:t.RGBA8,depthFormat:te,scaleFactor:s};h=this.getBinding(),f=h.createProjectionLayer(ke),i.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),v=new ci(f.textureWidth,f.textureHeight,{format:nn,type:mn,depthTexture:new Jo(f.textureWidth,f.textureHeight,Ee,void 0,void 0,void 0,void 0,void 0,void 0,de),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const de={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(i,t,de),i.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),v=new ci(p.framebufferWidth,p.framebufferHeight,{format:nn,type:mn,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),Ze.setContext(i),Ze.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function Y($){for(let ee=0;ee<$.removed.length;ee++){const de=$.removed[ee],Ee=P.indexOf(de);Ee>=0&&(P[Ee]=null,R[Ee].disconnect(de))}for(let ee=0;ee<$.added.length;ee++){const de=$.added[ee];let Ee=P.indexOf(de);if(Ee===-1){for(let ke=0;ke<R.length;ke++)if(ke>=P.length){P.push(de),Ee=ke;break}else if(P[ke]===null){P[ke]=de,Ee=ke;break}if(Ee===-1)break}const te=R[Ee];te&&te.connect(de)}}const V=new U,Q=new U;function oe($,ee,de){V.setFromMatrixPosition(ee.matrixWorld),Q.setFromMatrixPosition(de.matrixWorld);const Ee=V.distanceTo(Q),te=ee.projectionMatrix.elements,ke=de.projectionMatrix.elements,it=te[14]/(te[10]-1),w=te[14]/(te[10]+1),Ae=(te[9]+1)/te[5],_e=(te[9]-1)/te[5],Se=(te[8]-1)/te[0],me=(ke[8]+1)/ke[0],We=it*Se,xe=it*me,Le=Ee/(-Se+me),lt=Le*-Se;if(ee.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(lt),$.translateZ(Le),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),te[10]===-1)$.projectionMatrix.copy(ee.projectionMatrix),$.projectionMatrixInverse.copy(ee.projectionMatrixInverse);else{const ft=it+Le,A=w+Le,x=We-lt,G=xe+(Ee-lt),Z=Ae*w/A*ft,J=_e*w/A*ft;$.projectionMatrix.makePerspective(x,G,Z,J,ft,A),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function ye($,ee){ee===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(ee.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(i===null)return;let ee=$.near,de=$.far;m.texture!==null&&(m.depthNear>0&&(ee=m.depthNear),m.depthFar>0&&(de=m.depthFar)),C.near=T.near=S.near=ee,C.far=T.far=S.far=de,(D!==C.near||k!==C.far)&&(i.updateRenderState({depthNear:C.near,depthFar:C.far}),D=C.near,k=C.far),C.layers.mask=$.layers.mask|6,S.layers.mask=C.layers.mask&3,T.layers.mask=C.layers.mask&5;const Ee=$.parent,te=C.cameras;ye(C,Ee);for(let ke=0;ke<te.length;ke++)ye(te[ke],Ee);te.length===2?oe(C,S,T):C.projectionMatrix.copy(S.projectionMatrix),Ne($,C,Ee)};function Ne($,ee,de){de===null?$.matrix.copy(ee.matrixWorld):($.matrix.copy(de.matrixWorld),$.matrix.invert(),$.matrix.multiply(ee.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(ee.projectionMatrix),$.projectionMatrixInverse.copy(ee.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=Qi*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return C},this.getFoveation=function(){if(!(f===null&&p===null))return l},this.setFoveation=function($){l=$,f!==null&&(f.fixedFoveation=$),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=$)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(C)},this.getCameraTexture=function($){return d[$]};let nt=null;function Ke($,ee){if(u=ee.getViewerPose(c||a),g=ee,u!==null){const de=u.views;p!==null&&(e.setRenderTargetFramebuffer(v,p.framebuffer),e.setRenderTarget(v));let Ee=!1;de.length!==C.cameras.length&&(C.cameras.length=0,Ee=!0);for(let w=0;w<de.length;w++){const Ae=de[w];let _e=null;if(p!==null)_e=p.getViewport(Ae);else{const me=h.getViewSubImage(f,Ae);_e=me.viewport,w===0&&(e.setRenderTargetTextures(v,me.colorTexture,me.depthStencilTexture),e.setRenderTarget(v))}let Se=E[w];Se===void 0&&(Se=new zt,Se.layers.enable(w),Se.viewport=new st,E[w]=Se),Se.matrix.fromArray(Ae.transform.matrix),Se.matrix.decompose(Se.position,Se.quaternion,Se.scale),Se.projectionMatrix.fromArray(Ae.projectionMatrix),Se.projectionMatrixInverse.copy(Se.projectionMatrix).invert(),Se.viewport.set(_e.x,_e.y,_e.width,_e.height),w===0&&(C.matrix.copy(Se.matrix),C.matrix.decompose(C.position,C.quaternion,C.scale)),Ee===!0&&C.cameras.push(Se)}const te=i.enabledFeatures;if(te&&te.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&_){h=n.getBinding();const w=h.getDepthInformation(de[0]);w&&w.isValid&&w.texture&&m.init(w,i.renderState)}if(te&&te.includes("camera-access")&&_){e.state.unbindTexture(),h=n.getBinding();for(let w=0;w<de.length;w++){const Ae=de[w].camera;if(Ae){let _e=d[Ae];_e||(_e=new mu,d[Ae]=_e);const Se=h.getCameraImage(Ae);_e.sourceTexture=Se}}}}for(let de=0;de<R.length;de++){const Ee=P[de],te=R[de];Ee!==null&&te!==void 0&&te.update(Ee,ee,c||a)}nt&&nt($,ee),ee.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ee}),g=null}const Ze=new bu;Ze.setAnimationLoop(Ke),this.setAnimationLoop=function($){nt=$},this.dispose=function(){}}}const gi=new bn,s0=new Xe;function a0(r,e){function t(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function n(m,d){d.color.getRGB(m.fogColor.value,cu(r)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function i(m,d,b,M,v){d.isMeshBasicMaterial||d.isMeshLambertMaterial?s(m,d):d.isMeshToonMaterial?(s(m,d),h(m,d)):d.isMeshPhongMaterial?(s(m,d),u(m,d)):d.isMeshStandardMaterial?(s(m,d),f(m,d),d.isMeshPhysicalMaterial&&p(m,d,v)):d.isMeshMatcapMaterial?(s(m,d),g(m,d)):d.isMeshDepthMaterial?s(m,d):d.isMeshDistanceMaterial?(s(m,d),_(m,d)):d.isMeshNormalMaterial?s(m,d):d.isLineBasicMaterial?(a(m,d),d.isLineDashedMaterial&&o(m,d)):d.isPointsMaterial?l(m,d,b,M):d.isSpriteMaterial?c(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function s(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,t(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===qt&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,t(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===qt&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,t(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,t(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);const b=e.get(d),M=b.envMap,v=b.envMapRotation;M&&(m.envMap.value=M,gi.copy(v),gi.x*=-1,gi.y*=-1,gi.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(gi.y*=-1,gi.z*=-1),m.envMapRotation.value.setFromMatrix4(s0.makeRotationFromEuler(gi)),m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap&&(m.lightMap.value=d.lightMap,m.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,m.lightMapTransform)),d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,m.aoMapTransform))}function a(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform))}function o(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function l(m,d,b,M){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*b,m.scale.value=M*.5,d.map&&(m.map.value=d.map,t(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function c(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function u(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function h(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function f(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,m.roughnessMapTransform)),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,b){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===qt&&m.clearcoatNormalScale.value.negate())),d.dispersion>0&&(m.dispersion.value=d.dispersion),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,d){d.matcap&&(m.matcap.value=d.matcap)}function _(m,d){const b=e.get(d).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function o0(r,e,t,n){let i={},s={},a=[];const o=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(b,M){const v=M.program;n.uniformBlockBinding(b,v)}function c(b,M){let v=i[b.id];v===void 0&&(g(b),v=u(b),i[b.id]=v,b.addEventListener("dispose",m));const R=M.program;n.updateUBOMapping(b,R);const P=e.render.frame;s[b.id]!==P&&(f(b),s[b.id]=P)}function u(b){const M=h();b.__bindingPointIndex=M;const v=r.createBuffer(),R=b.__size,P=b.usage;return r.bindBuffer(r.UNIFORM_BUFFER,v),r.bufferData(r.UNIFORM_BUFFER,R,P),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,M,v),v}function h(){for(let b=0;b<o;b++)if(a.indexOf(b)===-1)return a.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(b){const M=i[b.id],v=b.uniforms,R=b.__cache;r.bindBuffer(r.UNIFORM_BUFFER,M);for(let P=0,L=v.length;P<L;P++){const F=Array.isArray(v[P])?v[P]:[v[P]];for(let S=0,T=F.length;S<T;S++){const E=F[S];if(p(E,P,S,R)===!0){const C=E.__offset,D=Array.isArray(E.value)?E.value:[E.value];let k=0;for(let H=0;H<D.length;H++){const W=D[H],Y=_(W);typeof W=="number"||typeof W=="boolean"?(E.__data[0]=W,r.bufferSubData(r.UNIFORM_BUFFER,C+k,E.__data)):W.isMatrix3?(E.__data[0]=W.elements[0],E.__data[1]=W.elements[1],E.__data[2]=W.elements[2],E.__data[3]=0,E.__data[4]=W.elements[3],E.__data[5]=W.elements[4],E.__data[6]=W.elements[5],E.__data[7]=0,E.__data[8]=W.elements[6],E.__data[9]=W.elements[7],E.__data[10]=W.elements[8],E.__data[11]=0):(W.toArray(E.__data,k),k+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,C,E.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function p(b,M,v,R){const P=b.value,L=M+"_"+v;if(R[L]===void 0)return typeof P=="number"||typeof P=="boolean"?R[L]=P:R[L]=P.clone(),!0;{const F=R[L];if(typeof P=="number"||typeof P=="boolean"){if(F!==P)return R[L]=P,!0}else if(F.equals(P)===!1)return F.copy(P),!0}return!1}function g(b){const M=b.uniforms;let v=0;const R=16;for(let L=0,F=M.length;L<F;L++){const S=Array.isArray(M[L])?M[L]:[M[L]];for(let T=0,E=S.length;T<E;T++){const C=S[T],D=Array.isArray(C.value)?C.value:[C.value];for(let k=0,H=D.length;k<H;k++){const W=D[k],Y=_(W),V=v%R,Q=V%Y.boundary,oe=V+Q;v+=Q,oe!==0&&R-oe<Y.storage&&(v+=R-oe),C.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),C.__offset=v,v+=Y.storage}}}const P=v%R;return P>0&&(v+=R-P),b.__size=v,b.__cache={},this}function _(b){const M={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(M.boundary=4,M.storage=4):b.isVector2?(M.boundary=8,M.storage=8):b.isVector3||b.isColor?(M.boundary=16,M.storage=12):b.isVector4?(M.boundary=16,M.storage=16):b.isMatrix3?(M.boundary=48,M.storage=48):b.isMatrix4?(M.boundary=64,M.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),M}function m(b){const M=b.target;M.removeEventListener("dispose",m);const v=a.indexOf(M.__bindingPointIndex);a.splice(v,1),r.deleteBuffer(i[M.id]),delete i[M.id],delete s[M.id]}function d(){for(const b in i)r.deleteBuffer(i[b]);a=[],i={},s={}}return{bind:l,update:c,dispose:d}}class c0{constructor(e={}){const{canvas:t=qh(),context:n=null,depth:i=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,d=null;const b=[],M=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=si,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const v=this;let R=!1;this._outputColorSpace=Et;let P=0,L=0,F=null,S=-1,T=null;const E=new st,C=new st;let D=null;const k=new ze(0);let H=0,W=t.width,Y=t.height,V=1,Q=null,oe=null;const ye=new st(0,0,W,Y),Ne=new st(0,0,W,Y);let nt=!1;const Ke=new Zo;let Ze=!1,$=!1;const ee=new Xe,de=new U,Ee=new st,te={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ke=!1;function it(){return F===null?V:1}let w=n;function Ae(y,O){return t.getContext(y,O)}try{const y={alpha:!0,depth:i,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Fo}`),t.addEventListener("webglcontextlost",ce,!1),t.addEventListener("webglcontextrestored",ve,!1),t.addEventListener("webglcontextcreationerror",B,!1),w===null){const O="webgl2";if(w=Ae(O,y),w===null)throw Ae(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(y){throw console.error("THREE.WebGLRenderer: "+y.message),y}let _e,Se,me,We,xe,Le,lt,ft,A,x,G,Z,J,K,Re,ae,Te,we,re,pe,Ie,Ce,le,Ge;function I(){_e=new xg(w),_e.init(),Ce=new e0(w,_e),Se=new hg(w,_e,e,Ce),me=new J_(w,_e),Se.reversedDepthBuffer&&f&&me.buffers.depth.setReversed(!0),We=new yg(w),xe=new z_,Le=new Q_(w,_e,me,xe,Se,Ce,We),lt=new dg(v),ft=new _g(v),A=new wd(w),le=new lg(w,A),x=new vg(w,A,We,le),G=new Eg(w,x,A,We),re=new Sg(w,Se,Le),ae=new fg(xe),Z=new B_(v,lt,ft,_e,Se,le,ae),J=new a0(v,xe),K=new H_,Re=new Y_(_e),we=new cg(v,lt,ft,me,G,p,l),Te=new Z_(v,G,Se),Ge=new o0(w,We,Se,me),pe=new ug(w,_e,We),Ie=new Mg(w,_e,We),We.programs=Z.programs,v.capabilities=Se,v.extensions=_e,v.properties=xe,v.renderLists=K,v.shadowMap=Te,v.state=me,v.info=We}I();const se=new r0(v,w);this.xr=se,this.getContext=function(){return w},this.getContextAttributes=function(){return w.getContextAttributes()},this.forceContextLoss=function(){const y=_e.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=_e.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(y){y!==void 0&&(V=y,this.setSize(W,Y,!1))},this.getSize=function(y){return y.set(W,Y)},this.setSize=function(y,O,X=!0){if(se.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=y,Y=O,t.width=Math.floor(y*V),t.height=Math.floor(O*V),X===!0&&(t.style.width=y+"px",t.style.height=O+"px"),this.setViewport(0,0,y,O)},this.getDrawingBufferSize=function(y){return y.set(W*V,Y*V).floor()},this.setDrawingBufferSize=function(y,O,X){W=y,Y=O,V=X,t.width=Math.floor(y*X),t.height=Math.floor(O*X),this.setViewport(0,0,y,O)},this.getCurrentViewport=function(y){return y.copy(E)},this.getViewport=function(y){return y.copy(ye)},this.setViewport=function(y,O,X,q){y.isVector4?ye.set(y.x,y.y,y.z,y.w):ye.set(y,O,X,q),me.viewport(E.copy(ye).multiplyScalar(V).round())},this.getScissor=function(y){return y.copy(Ne)},this.setScissor=function(y,O,X,q){y.isVector4?Ne.set(y.x,y.y,y.z,y.w):Ne.set(y,O,X,q),me.scissor(C.copy(Ne).multiplyScalar(V).round())},this.getScissorTest=function(){return nt},this.setScissorTest=function(y){me.setScissorTest(nt=y)},this.setOpaqueSort=function(y){Q=y},this.setTransparentSort=function(y){oe=y},this.getClearColor=function(y){return y.copy(we.getClearColor())},this.setClearColor=function(){we.setClearColor(...arguments)},this.getClearAlpha=function(){return we.getClearAlpha()},this.setClearAlpha=function(){we.setClearAlpha(...arguments)},this.clear=function(y=!0,O=!0,X=!0){let q=0;if(y){let z=!1;if(F!==null){const ie=F.texture.format;z=ie===Wo||ie===Go||ie===Vo}if(z){const ie=F.texture.type,he=ie===mn||ie===oi||ie===Rr||ie===Cr||ie===zo||ie===ko,be=we.getClearColor(),Me=we.getClearAlpha(),Oe=be.r,He=be.g,Ue=be.b;he?(g[0]=Oe,g[1]=He,g[2]=Ue,g[3]=Me,w.clearBufferuiv(w.COLOR,0,g)):(_[0]=Oe,_[1]=He,_[2]=Ue,_[3]=Me,w.clearBufferiv(w.COLOR,0,_))}else q|=w.COLOR_BUFFER_BIT}O&&(q|=w.DEPTH_BUFFER_BIT),X&&(q|=w.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),w.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ce,!1),t.removeEventListener("webglcontextrestored",ve,!1),t.removeEventListener("webglcontextcreationerror",B,!1),we.dispose(),K.dispose(),Re.dispose(),xe.dispose(),lt.dispose(),ft.dispose(),G.dispose(),le.dispose(),Ge.dispose(),Z.dispose(),se.dispose(),se.removeEventListener("sessionstart",ue),se.removeEventListener("sessionend",je),Qe.stop()};function ce(y){y.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),R=!0}function ve(){console.log("THREE.WebGLRenderer: Context Restored."),R=!1;const y=We.autoReset,O=Te.enabled,X=Te.autoUpdate,q=Te.needsUpdate,z=Te.type;I(),We.autoReset=y,Te.enabled=O,Te.autoUpdate=X,Te.needsUpdate=q,Te.type=z}function B(y){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function N(y){const O=y.target;O.removeEventListener("dispose",N),j(O)}function j(y){ne(y),xe.remove(y)}function ne(y){const O=xe.get(y).programs;O!==void 0&&(O.forEach(function(X){Z.releaseProgram(X)}),y.isShaderMaterial&&Z.releaseShaderCache(y))}this.renderBufferDirect=function(y,O,X,q,z,ie){O===null&&(O=te);const he=z.isMesh&&z.matrixWorld.determinant()<0,be=Wr(y,O,X,q,z);me.setMaterial(q,he);let Me=X.index,Oe=1;if(q.wireframe===!0){if(Me=x.getWireframeAttribute(X),Me===void 0)return;Oe=2}const He=X.drawRange,Ue=X.attributes.position;let et=He.start*Oe,ut=(He.start+He.count)*Oe;ie!==null&&(et=Math.max(et,ie.start*Oe),ut=Math.min(ut,(ie.start+ie.count)*Oe)),Me!==null?(et=Math.max(et,0),ut=Math.min(ut,Me.count)):Ue!=null&&(et=Math.max(et,0),ut=Math.min(ut,Ue.count));const St=ut-et;if(St<0||St===1/0)return;le.setup(z,q,be,X,Me);let mt,dt=pe;if(Me!==null&&(mt=A.get(Me),dt=Ie,dt.setIndex(mt)),z.isMesh)q.wireframe===!0?(me.setLineWidth(q.wireframeLinewidth*it()),dt.setMode(w.LINES)):dt.setMode(w.TRIANGLES);else if(z.isLine){let Fe=q.linewidth;Fe===void 0&&(Fe=1),me.setLineWidth(Fe*it()),z.isLineSegments?dt.setMode(w.LINES):z.isLineLoop?dt.setMode(w.LINE_LOOP):dt.setMode(w.LINE_STRIP)}else z.isPoints?dt.setMode(w.POINTS):z.isSprite&&dt.setMode(w.TRIANGLES);if(z.isBatchedMesh)if(z._multiDrawInstances!==null)Nr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),dt.renderMultiDrawInstances(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount,z._multiDrawInstances);else if(_e.get("WEBGL_multi_draw"))dt.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{const Fe=z._multiDrawStarts,vt=z._multiDrawCounts,rt=z._multiDrawCount,Yt=Me?A.get(Me).bytesPerElement:1,Ai=xe.get(q).currentProgram.getUniforms();for(let Kt=0;Kt<rt;Kt++)Ai.setValue(w,"_gl_DrawID",Kt),dt.render(Fe[Kt]/Yt,vt[Kt])}else if(z.isInstancedMesh)dt.renderInstances(et,St,z.count);else if(X.isInstancedBufferGeometry){const Fe=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,vt=Math.min(X.instanceCount,Fe);dt.renderInstances(et,St,vt)}else dt.render(et,St)};function Pe(y,O,X){y.transparent===!0&&y.side===$t&&y.forceSinglePass===!1?(y.side=qt,y.needsUpdate=!0,_n(y,O,X),y.side=Vn,y.needsUpdate=!0,_n(y,O,X),y.side=$t):_n(y,O,X)}this.compile=function(y,O,X=null){X===null&&(X=y),d=Re.get(X),d.init(O),M.push(d),X.traverseVisible(function(z){z.isLight&&z.layers.test(O.layers)&&(d.pushLight(z),z.castShadow&&d.pushShadow(z))}),y!==X&&y.traverseVisible(function(z){z.isLight&&z.layers.test(O.layers)&&(d.pushLight(z),z.castShadow&&d.pushShadow(z))}),d.setupLights();const q=new Set;return y.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;const ie=z.material;if(ie)if(Array.isArray(ie))for(let he=0;he<ie.length;he++){const be=ie[he];Pe(be,X,z),q.add(be)}else Pe(ie,X,z),q.add(ie)}),d=M.pop(),q},this.compileAsync=function(y,O,X=null){const q=this.compile(y,O,X);return new Promise(z=>{function ie(){if(q.forEach(function(he){xe.get(he).currentProgram.isReady()&&q.delete(he)}),q.size===0){z(y);return}setTimeout(ie,10)}_e.get("KHR_parallel_shader_compile")!==null?ie():setTimeout(ie,10)})};let De=null;function Ve(y){De&&De(y)}function ue(){Qe.stop()}function je(){Qe.start()}const Qe=new bu;Qe.setAnimationLoop(Ve),typeof self<"u"&&Qe.setContext(self),this.setAnimationLoop=function(y){De=y,se.setAnimationLoop(y),y===null?Qe.stop():Qe.start()},se.addEventListener("sessionstart",ue),se.addEventListener("sessionend",je),this.render=function(y,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),se.enabled===!0&&se.isPresenting===!0&&(se.cameraAutoUpdate===!0&&se.updateCamera(O),O=se.getCamera()),y.isScene===!0&&y.onBeforeRender(v,y,O,F),d=Re.get(y,M.length),d.init(O),M.push(d),ee.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),Ke.setFromProjectionMatrix(ee,yn,O.reversedDepth),$=this.localClippingEnabled,Ze=ae.init(this.clippingPlanes,$),m=K.get(y,b.length),m.init(),b.push(m),se.enabled===!0&&se.isPresenting===!0){const ie=v.xr.getDepthSensingMesh();ie!==null&&ge(ie,O,-1/0,v.sortObjects)}ge(y,O,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(Q,oe),ke=se.enabled===!1||se.isPresenting===!1||se.hasDepthSensing()===!1,ke&&we.addToRenderList(m,y),this.info.render.frame++,Ze===!0&&ae.beginShadows();const X=d.state.shadowsArray;Te.render(X,y,O),Ze===!0&&ae.endShadows(),this.info.autoReset===!0&&this.info.reset();const q=m.opaque,z=m.transmissive;if(d.setupLights(),O.isArrayCamera){const ie=O.cameras;if(z.length>0)for(let he=0,be=ie.length;he<be;he++){const Me=ie[he];bt(q,z,y,Me)}ke&&we.render(y);for(let he=0,be=ie.length;he<be;he++){const Me=ie[he];at(m,y,Me,Me.viewport)}}else z.length>0&&bt(q,z,y,O),ke&&we.render(y),at(m,y,O);F!==null&&L===0&&(Le.updateMultisampleRenderTarget(F),Le.updateRenderTargetMipmap(F)),y.isScene===!0&&y.onAfterRender(v,y,O),le.resetDefaultState(),S=-1,T=null,M.pop(),M.length>0?(d=M[M.length-1],Ze===!0&&ae.setGlobalState(v.clippingPlanes,d.state.camera)):d=null,b.pop(),b.length>0?m=b[b.length-1]:m=null};function ge(y,O,X,q){if(y.visible===!1)return;if(y.layers.test(O.layers)){if(y.isGroup)X=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(O);else if(y.isLight)d.pushLight(y),y.castShadow&&d.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||Ke.intersectsSprite(y)){q&&Ee.setFromMatrixPosition(y.matrixWorld).applyMatrix4(ee);const he=G.update(y),be=y.material;be.visible&&m.push(y,he,be,X,Ee.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||Ke.intersectsObject(y))){const he=G.update(y),be=y.material;if(q&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Ee.copy(y.boundingSphere.center)):(he.boundingSphere===null&&he.computeBoundingSphere(),Ee.copy(he.boundingSphere.center)),Ee.applyMatrix4(y.matrixWorld).applyMatrix4(ee)),Array.isArray(be)){const Me=he.groups;for(let Oe=0,He=Me.length;Oe<He;Oe++){const Ue=Me[Oe],et=be[Ue.materialIndex];et&&et.visible&&m.push(y,he,et,X,Ee.z,Ue)}}else be.visible&&m.push(y,he,be,X,Ee.z,null)}}const ie=y.children;for(let he=0,be=ie.length;he<be;he++)ge(ie[he],O,X,q)}function at(y,O,X,q){const z=y.opaque,ie=y.transmissive,he=y.transparent;d.setupLightsView(X),Ze===!0&&ae.setGlobalState(v.clippingPlanes,X),q&&me.viewport(E.copy(q)),z.length>0&&qn(z,O,X),ie.length>0&&qn(ie,O,X),he.length>0&&qn(he,O,X),me.buffers.depth.setTest(!0),me.buffers.depth.setMask(!0),me.buffers.color.setMask(!0),me.setPolygonOffset(!1)}function bt(y,O,X,q){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[q.id]===void 0&&(d.state.transmissionRenderTarget[q.id]=new ci(1,1,{generateMipmaps:!0,type:_e.has("EXT_color_buffer_half_float")||_e.has("EXT_color_buffer_float")?sr:mn,minFilter:On,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:tt.workingColorSpace}));const ie=d.state.transmissionRenderTarget[q.id],he=q.viewport||E;ie.setSize(he.z*v.transmissionResolutionScale,he.w*v.transmissionResolutionScale);const be=v.getRenderTarget(),Me=v.getActiveCubeFace(),Oe=v.getActiveMipmapLevel();v.setRenderTarget(ie),v.getClearColor(k),H=v.getClearAlpha(),H<1&&v.setClearColor(16777215,.5),v.clear(),ke&&we.render(X);const He=v.toneMapping;v.toneMapping=si;const Ue=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),d.setupLightsView(q),Ze===!0&&ae.setGlobalState(v.clippingPlanes,q),qn(y,X,q),Le.updateMultisampleRenderTarget(ie),Le.updateRenderTargetMipmap(ie),_e.has("WEBGL_multisampled_render_to_texture")===!1){let et=!1;for(let ut=0,St=O.length;ut<St;ut++){const mt=O[ut],dt=mt.object,Fe=mt.geometry,vt=mt.material,rt=mt.group;if(vt.side===$t&&dt.layers.test(q.layers)){const Yt=vt.side;vt.side=qt,vt.needsUpdate=!0,Ti(dt,X,q,Fe,vt,rt),vt.side=Yt,vt.needsUpdate=!0,et=!0}}et===!0&&(Le.updateMultisampleRenderTarget(ie),Le.updateRenderTargetMipmap(ie))}v.setRenderTarget(be,Me,Oe),v.setClearColor(k,H),Ue!==void 0&&(q.viewport=Ue),v.toneMapping=He}function qn(y,O,X){const q=O.isScene===!0?O.overrideMaterial:null;for(let z=0,ie=y.length;z<ie;z++){const he=y[z],be=he.object,Me=he.geometry,Oe=he.group;let He=he.material;He.allowOverride===!0&&q!==null&&(He=q),be.layers.test(X.layers)&&Ti(be,O,X,Me,He,Oe)}}function Ti(y,O,X,q,z,ie){y.onBeforeRender(v,O,X,q,z,ie),y.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),z.onBeforeRender(v,O,X,q,y,ie),z.transparent===!0&&z.side===$t&&z.forceSinglePass===!1?(z.side=qt,z.needsUpdate=!0,v.renderBufferDirect(X,O,q,z,y,ie),z.side=Vn,z.needsUpdate=!0,v.renderBufferDirect(X,O,q,z,y,ie),z.side=$t):v.renderBufferDirect(X,O,q,z,y,ie),y.onAfterRender(v,O,X,q,z,ie)}function _n(y,O,X){O.isScene!==!0&&(O=te);const q=xe.get(y),z=d.state.lights,ie=d.state.shadowsArray,he=z.state.version,be=Z.getParameters(y,z.state,ie,O,X),Me=Z.getProgramCacheKey(be);let Oe=q.programs;q.environment=y.isMeshStandardMaterial?O.environment:null,q.fog=O.fog,q.envMap=(y.isMeshStandardMaterial?ft:lt).get(y.envMap||q.environment),q.envMapRotation=q.environment!==null&&y.envMap===null?O.environmentRotation:y.envMapRotation,Oe===void 0&&(y.addEventListener("dispose",N),Oe=new Map,q.programs=Oe);let He=Oe.get(Me);if(He!==void 0){if(q.currentProgram===He&&q.lightsStateVersion===he)return Rn(y,be),He}else be.uniforms=Z.getUniforms(y),y.onBeforeCompile(be,v),He=Z.acquireProgram(be,Me),Oe.set(Me,He),q.uniforms=be.uniforms;const Ue=q.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Ue.clippingPlanes=ae.uniform),Rn(y,be),q.needsLights=Xs(y),q.lightsStateVersion=he,q.needsLights&&(Ue.ambientLightColor.value=z.state.ambient,Ue.lightProbe.value=z.state.probe,Ue.directionalLights.value=z.state.directional,Ue.directionalLightShadows.value=z.state.directionalShadow,Ue.spotLights.value=z.state.spot,Ue.spotLightShadows.value=z.state.spotShadow,Ue.rectAreaLights.value=z.state.rectArea,Ue.ltc_1.value=z.state.rectAreaLTC1,Ue.ltc_2.value=z.state.rectAreaLTC2,Ue.pointLights.value=z.state.point,Ue.pointLightShadows.value=z.state.pointShadow,Ue.hemisphereLights.value=z.state.hemi,Ue.directionalShadowMap.value=z.state.directionalShadowMap,Ue.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Ue.spotShadowMap.value=z.state.spotShadowMap,Ue.spotLightMatrix.value=z.state.spotLightMatrix,Ue.spotLightMap.value=z.state.spotLightMap,Ue.pointShadowMap.value=z.state.pointShadowMap,Ue.pointShadowMatrix.value=z.state.pointShadowMatrix),q.currentProgram=He,q.uniformsList=null,He}function Yn(y){if(y.uniformsList===null){const O=y.currentProgram.getUniforms();y.uniformsList=Rs.seqWithValue(O.seq,y.uniforms)}return y.uniformsList}function Rn(y,O){const X=xe.get(y);X.outputColorSpace=O.outputColorSpace,X.batching=O.batching,X.batchingColor=O.batchingColor,X.instancing=O.instancing,X.instancingColor=O.instancingColor,X.instancingMorph=O.instancingMorph,X.skinning=O.skinning,X.morphTargets=O.morphTargets,X.morphNormals=O.morphNormals,X.morphColors=O.morphColors,X.morphTargetsCount=O.morphTargetsCount,X.numClippingPlanes=O.numClippingPlanes,X.numIntersection=O.numClipIntersection,X.vertexAlphas=O.vertexAlphas,X.vertexTangents=O.vertexTangents,X.toneMapping=O.toneMapping}function Wr(y,O,X,q,z){O.isScene!==!0&&(O=te),Le.resetTextureUnits();const ie=O.fog,he=q.isMeshStandardMaterial?O.environment:null,be=F===null?v.outputColorSpace:F.isXRRenderTarget===!0?F.texture.colorSpace:Vt,Me=(q.isMeshStandardMaterial?ft:lt).get(q.envMap||he),Oe=q.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,He=!!X.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),Ue=!!X.morphAttributes.position,et=!!X.morphAttributes.normal,ut=!!X.morphAttributes.color;let St=si;q.toneMapped&&(F===null||F.isXRRenderTarget===!0)&&(St=v.toneMapping);const mt=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,dt=mt!==void 0?mt.length:0,Fe=xe.get(q),vt=d.state.lights;if(Ze===!0&&($===!0||y!==T)){const Ft=y===T&&q.id===S;ae.setState(q,y,Ft)}let rt=!1;q.version===Fe.__version?(Fe.needsLights&&Fe.lightsStateVersion!==vt.state.version||Fe.outputColorSpace!==be||z.isBatchedMesh&&Fe.batching===!1||!z.isBatchedMesh&&Fe.batching===!0||z.isBatchedMesh&&Fe.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&Fe.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&Fe.instancing===!1||!z.isInstancedMesh&&Fe.instancing===!0||z.isSkinnedMesh&&Fe.skinning===!1||!z.isSkinnedMesh&&Fe.skinning===!0||z.isInstancedMesh&&Fe.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&Fe.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&Fe.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&Fe.instancingMorph===!1&&z.morphTexture!==null||Fe.envMap!==Me||q.fog===!0&&Fe.fog!==ie||Fe.numClippingPlanes!==void 0&&(Fe.numClippingPlanes!==ae.numPlanes||Fe.numIntersection!==ae.numIntersection)||Fe.vertexAlphas!==Oe||Fe.vertexTangents!==He||Fe.morphTargets!==Ue||Fe.morphNormals!==et||Fe.morphColors!==ut||Fe.toneMapping!==St||Fe.morphTargetsCount!==dt)&&(rt=!0):(rt=!0,Fe.__version=q.version);let Yt=Fe.currentProgram;rt===!0&&(Yt=_n(q,O,z));let Ai=!1,Kt=!1,hr=!1;const Mt=Yt.getUniforms(),Jt=Fe.uniforms;if(me.useProgram(Yt.program)&&(Ai=!0,Kt=!0,hr=!0),q.id!==S&&(S=q.id,Kt=!0),Ai||T!==y){me.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),Mt.setValue(w,"projectionMatrix",y.projectionMatrix),Mt.setValue(w,"viewMatrix",y.matrixWorldInverse);const Gt=Mt.map.cameraPosition;Gt!==void 0&&Gt.setValue(w,de.setFromMatrixPosition(y.matrixWorld)),Se.logarithmicDepthBuffer&&Mt.setValue(w,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&Mt.setValue(w,"isOrthographic",y.isOrthographicCamera===!0),T!==y&&(T=y,Kt=!0,hr=!0)}if(z.isSkinnedMesh){Mt.setOptional(w,z,"bindMatrix"),Mt.setOptional(w,z,"bindMatrixInverse");const Ft=z.skeleton;Ft&&(Ft.boneTexture===null&&Ft.computeBoneTexture(),Mt.setValue(w,"boneTexture",Ft.boneTexture,Le))}z.isBatchedMesh&&(Mt.setOptional(w,z,"batchingTexture"),Mt.setValue(w,"batchingTexture",z._matricesTexture,Le),Mt.setOptional(w,z,"batchingIdTexture"),Mt.setValue(w,"batchingIdTexture",z._indirectTexture,Le),Mt.setOptional(w,z,"batchingColorTexture"),z._colorsTexture!==null&&Mt.setValue(w,"batchingColorTexture",z._colorsTexture,Le));const Qt=X.morphAttributes;if((Qt.position!==void 0||Qt.normal!==void 0||Qt.color!==void 0)&&re.update(z,X,Yt),(Kt||Fe.receiveShadow!==z.receiveShadow)&&(Fe.receiveShadow=z.receiveShadow,Mt.setValue(w,"receiveShadow",z.receiveShadow)),q.isMeshGouraudMaterial&&q.envMap!==null&&(Jt.envMap.value=Me,Jt.flipEnvMap.value=Me.isCubeTexture&&Me.isRenderTargetTexture===!1?-1:1),q.isMeshStandardMaterial&&q.envMap===null&&O.environment!==null&&(Jt.envMapIntensity.value=O.environmentIntensity),Kt&&(Mt.setValue(w,"toneMappingExposure",v.toneMappingExposure),Fe.needsLights&&Cn(Jt,hr),ie&&q.fog===!0&&J.refreshFogUniforms(Jt,ie),J.refreshMaterialUniforms(Jt,q,V,Y,d.state.transmissionRenderTarget[y.id]),Rs.upload(w,Yn(Fe),Jt,Le)),q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(Rs.upload(w,Yn(Fe),Jt,Le),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&Mt.setValue(w,"center",z.center),Mt.setValue(w,"modelViewMatrix",z.modelViewMatrix),Mt.setValue(w,"normalMatrix",z.normalMatrix),Mt.setValue(w,"modelMatrix",z.matrixWorld),q.isShaderMaterial||q.isRawShaderMaterial){const Ft=q.uniformsGroups;for(let Gt=0,qs=Ft.length;Gt<qs;Gt++){const ui=Ft[Gt];Ge.update(ui,Yt),Ge.bind(ui,Yt)}}return Yt}function Cn(y,O){y.ambientLightColor.needsUpdate=O,y.lightProbe.needsUpdate=O,y.directionalLights.needsUpdate=O,y.directionalLightShadows.needsUpdate=O,y.pointLights.needsUpdate=O,y.pointLightShadows.needsUpdate=O,y.spotLights.needsUpdate=O,y.spotLightShadows.needsUpdate=O,y.rectAreaLights.needsUpdate=O,y.hemisphereLights.needsUpdate=O}function Xs(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return L},this.getRenderTarget=function(){return F},this.setRenderTargetTextures=function(y,O,X){const q=xe.get(y);q.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,q.__autoAllocateDepthBuffer===!1&&(q.__useRenderToTexture=!1),xe.get(y.texture).__webglTexture=O,xe.get(y.depthTexture).__webglTexture=q.__autoAllocateDepthBuffer?void 0:X,q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,O){const X=xe.get(y);X.__webglFramebuffer=O,X.__useDefaultFramebuffer=O===void 0};const bi=w.createFramebuffer();this.setRenderTarget=function(y,O=0,X=0){F=y,P=O,L=X;let q=!0,z=null,ie=!1,he=!1;if(y){const Me=xe.get(y);if(Me.__useDefaultFramebuffer!==void 0)me.bindFramebuffer(w.FRAMEBUFFER,null),q=!1;else if(Me.__webglFramebuffer===void 0)Le.setupRenderTarget(y);else if(Me.__hasExternalTextures)Le.rebindTextures(y,xe.get(y.texture).__webglTexture,xe.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const Ue=y.depthTexture;if(Me.__boundDepthTexture!==Ue){if(Ue!==null&&xe.has(Ue)&&(y.width!==Ue.image.width||y.height!==Ue.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Le.setupDepthRenderbuffer(y)}}const Oe=y.texture;(Oe.isData3DTexture||Oe.isDataArrayTexture||Oe.isCompressedArrayTexture)&&(he=!0);const He=xe.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(He[O])?z=He[O][X]:z=He[O],ie=!0):y.samples>0&&Le.useMultisampledRTT(y)===!1?z=xe.get(y).__webglMultisampledFramebuffer:Array.isArray(He)?z=He[X]:z=He,E.copy(y.viewport),C.copy(y.scissor),D=y.scissorTest}else E.copy(ye).multiplyScalar(V).floor(),C.copy(Ne).multiplyScalar(V).floor(),D=nt;if(X!==0&&(z=bi),me.bindFramebuffer(w.FRAMEBUFFER,z)&&q&&me.drawBuffers(y,z),me.viewport(E),me.scissor(C),me.setScissorTest(D),ie){const Me=xe.get(y.texture);w.framebufferTexture2D(w.FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_CUBE_MAP_POSITIVE_X+O,Me.__webglTexture,X)}else if(he){const Me=O;for(let Oe=0;Oe<y.textures.length;Oe++){const He=xe.get(y.textures[Oe]);w.framebufferTextureLayer(w.FRAMEBUFFER,w.COLOR_ATTACHMENT0+Oe,He.__webglTexture,X,Me)}}else if(y!==null&&X!==0){const Me=xe.get(y.texture);w.framebufferTexture2D(w.FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_2D,Me.__webglTexture,X)}S=-1},this.readRenderTargetPixels=function(y,O,X,q,z,ie,he,be=0){if(!(y&&y.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Me=xe.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&he!==void 0&&(Me=Me[he]),Me){me.bindFramebuffer(w.FRAMEBUFFER,Me);try{const Oe=y.textures[be],He=Oe.format,Ue=Oe.type;if(!Se.textureFormatReadable(He)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Se.textureTypeReadable(Ue)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=y.width-q&&X>=0&&X<=y.height-z&&(y.textures.length>1&&w.readBuffer(w.COLOR_ATTACHMENT0+be),w.readPixels(O,X,q,z,Ce.convert(He),Ce.convert(Ue),ie))}finally{const Oe=F!==null?xe.get(F).__webglFramebuffer:null;me.bindFramebuffer(w.FRAMEBUFFER,Oe)}}},this.readRenderTargetPixelsAsync=async function(y,O,X,q,z,ie,he,be=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Me=xe.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&he!==void 0&&(Me=Me[he]),Me)if(O>=0&&O<=y.width-q&&X>=0&&X<=y.height-z){me.bindFramebuffer(w.FRAMEBUFFER,Me);const Oe=y.textures[be],He=Oe.format,Ue=Oe.type;if(!Se.textureFormatReadable(He))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Se.textureTypeReadable(Ue))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const et=w.createBuffer();w.bindBuffer(w.PIXEL_PACK_BUFFER,et),w.bufferData(w.PIXEL_PACK_BUFFER,ie.byteLength,w.STREAM_READ),y.textures.length>1&&w.readBuffer(w.COLOR_ATTACHMENT0+be),w.readPixels(O,X,q,z,Ce.convert(He),Ce.convert(Ue),0);const ut=F!==null?xe.get(F).__webglFramebuffer:null;me.bindFramebuffer(w.FRAMEBUFFER,ut);const St=w.fenceSync(w.SYNC_GPU_COMMANDS_COMPLETE,0);return w.flush(),await Yh(w,St,4),w.bindBuffer(w.PIXEL_PACK_BUFFER,et),w.getBufferSubData(w.PIXEL_PACK_BUFFER,0,ie),w.deleteBuffer(et),w.deleteSync(St),ie}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,O=null,X=0){const q=Math.pow(2,-X),z=Math.floor(y.image.width*q),ie=Math.floor(y.image.height*q),he=O!==null?O.x:0,be=O!==null?O.y:0;Le.setTexture2D(y,0),w.copyTexSubImage2D(w.TEXTURE_2D,X,0,0,he,be,z,ie),me.unbindTexture()};const Xr=w.createFramebuffer(),oc=w.createFramebuffer();this.copyTextureToTexture=function(y,O,X=null,q=null,z=0,ie=null){ie===null&&(z!==0?(Nr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ie=z,z=0):ie=0);let he,be,Me,Oe,He,Ue,et,ut,St;const mt=y.isCompressedTexture?y.mipmaps[ie]:y.image;if(X!==null)he=X.max.x-X.min.x,be=X.max.y-X.min.y,Me=X.isBox3?X.max.z-X.min.z:1,Oe=X.min.x,He=X.min.y,Ue=X.isBox3?X.min.z:0;else{const Qt=Math.pow(2,-z);he=Math.floor(mt.width*Qt),be=Math.floor(mt.height*Qt),y.isDataArrayTexture?Me=mt.depth:y.isData3DTexture?Me=Math.floor(mt.depth*Qt):Me=1,Oe=0,He=0,Ue=0}q!==null?(et=q.x,ut=q.y,St=q.z):(et=0,ut=0,St=0);const dt=Ce.convert(O.format),Fe=Ce.convert(O.type);let vt;O.isData3DTexture?(Le.setTexture3D(O,0),vt=w.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(Le.setTexture2DArray(O,0),vt=w.TEXTURE_2D_ARRAY):(Le.setTexture2D(O,0),vt=w.TEXTURE_2D),w.pixelStorei(w.UNPACK_FLIP_Y_WEBGL,O.flipY),w.pixelStorei(w.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),w.pixelStorei(w.UNPACK_ALIGNMENT,O.unpackAlignment);const rt=w.getParameter(w.UNPACK_ROW_LENGTH),Yt=w.getParameter(w.UNPACK_IMAGE_HEIGHT),Ai=w.getParameter(w.UNPACK_SKIP_PIXELS),Kt=w.getParameter(w.UNPACK_SKIP_ROWS),hr=w.getParameter(w.UNPACK_SKIP_IMAGES);w.pixelStorei(w.UNPACK_ROW_LENGTH,mt.width),w.pixelStorei(w.UNPACK_IMAGE_HEIGHT,mt.height),w.pixelStorei(w.UNPACK_SKIP_PIXELS,Oe),w.pixelStorei(w.UNPACK_SKIP_ROWS,He),w.pixelStorei(w.UNPACK_SKIP_IMAGES,Ue);const Mt=y.isDataArrayTexture||y.isData3DTexture,Jt=O.isDataArrayTexture||O.isData3DTexture;if(y.isDepthTexture){const Qt=xe.get(y),Ft=xe.get(O),Gt=xe.get(Qt.__renderTarget),qs=xe.get(Ft.__renderTarget);me.bindFramebuffer(w.READ_FRAMEBUFFER,Gt.__webglFramebuffer),me.bindFramebuffer(w.DRAW_FRAMEBUFFER,qs.__webglFramebuffer);for(let ui=0;ui<Me;ui++)Mt&&(w.framebufferTextureLayer(w.READ_FRAMEBUFFER,w.COLOR_ATTACHMENT0,xe.get(y).__webglTexture,z,Ue+ui),w.framebufferTextureLayer(w.DRAW_FRAMEBUFFER,w.COLOR_ATTACHMENT0,xe.get(O).__webglTexture,ie,St+ui)),w.blitFramebuffer(Oe,He,he,be,et,ut,he,be,w.DEPTH_BUFFER_BIT,w.NEAREST);me.bindFramebuffer(w.READ_FRAMEBUFFER,null),me.bindFramebuffer(w.DRAW_FRAMEBUFFER,null)}else if(z!==0||y.isRenderTargetTexture||xe.has(y)){const Qt=xe.get(y),Ft=xe.get(O);me.bindFramebuffer(w.READ_FRAMEBUFFER,Xr),me.bindFramebuffer(w.DRAW_FRAMEBUFFER,oc);for(let Gt=0;Gt<Me;Gt++)Mt?w.framebufferTextureLayer(w.READ_FRAMEBUFFER,w.COLOR_ATTACHMENT0,Qt.__webglTexture,z,Ue+Gt):w.framebufferTexture2D(w.READ_FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_2D,Qt.__webglTexture,z),Jt?w.framebufferTextureLayer(w.DRAW_FRAMEBUFFER,w.COLOR_ATTACHMENT0,Ft.__webglTexture,ie,St+Gt):w.framebufferTexture2D(w.DRAW_FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_2D,Ft.__webglTexture,ie),z!==0?w.blitFramebuffer(Oe,He,he,be,et,ut,he,be,w.COLOR_BUFFER_BIT,w.NEAREST):Jt?w.copyTexSubImage3D(vt,ie,et,ut,St+Gt,Oe,He,he,be):w.copyTexSubImage2D(vt,ie,et,ut,Oe,He,he,be);me.bindFramebuffer(w.READ_FRAMEBUFFER,null),me.bindFramebuffer(w.DRAW_FRAMEBUFFER,null)}else Jt?y.isDataTexture||y.isData3DTexture?w.texSubImage3D(vt,ie,et,ut,St,he,be,Me,dt,Fe,mt.data):O.isCompressedArrayTexture?w.compressedTexSubImage3D(vt,ie,et,ut,St,he,be,Me,dt,mt.data):w.texSubImage3D(vt,ie,et,ut,St,he,be,Me,dt,Fe,mt):y.isDataTexture?w.texSubImage2D(w.TEXTURE_2D,ie,et,ut,he,be,dt,Fe,mt.data):y.isCompressedTexture?w.compressedTexSubImage2D(w.TEXTURE_2D,ie,et,ut,mt.width,mt.height,dt,mt.data):w.texSubImage2D(w.TEXTURE_2D,ie,et,ut,he,be,dt,Fe,mt);w.pixelStorei(w.UNPACK_ROW_LENGTH,rt),w.pixelStorei(w.UNPACK_IMAGE_HEIGHT,Yt),w.pixelStorei(w.UNPACK_SKIP_PIXELS,Ai),w.pixelStorei(w.UNPACK_SKIP_ROWS,Kt),w.pixelStorei(w.UNPACK_SKIP_IMAGES,hr),ie===0&&O.generateMipmaps&&w.generateMipmap(vt),me.unbindTexture()},this.initRenderTarget=function(y){xe.get(y).__webglFramebuffer===void 0&&Le.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?Le.setTextureCube(y,0):y.isData3DTexture?Le.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?Le.setTexture2DArray(y,0):Le.setTexture2D(y,0),me.unbindTexture()},this.resetState=function(){P=0,L=0,F=null,me.reset(),le.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return yn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=tt._getDrawingBufferColorSpace(e),t.unpackColorSpace=tt._getUnpackColorSpace()}}function Ll(r,e){if(e===xh)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),r;if(e===So||e===eu){let t=r.getIndex();if(t===null){const a=[],o=r.getAttribute("position");if(o!==void 0){for(let l=0;l<o.count;l++)a.push(l);r.setIndex(a),t=r.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),r}const n=t.count-2,i=[];if(e===So)for(let a=1;a<=n;a++)i.push(t.getX(0)),i.push(t.getX(a)),i.push(t.getX(a+1));else for(let a=0;a<n;a++)a%2===0?(i.push(t.getX(a)),i.push(t.getX(a+1)),i.push(t.getX(a+2))):(i.push(t.getX(a+2)),i.push(t.getX(a+1)),i.push(t.getX(a)));i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const s=r.clone();return s.setIndex(i),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),r}class l0 extends lr{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new p0(t)}),this.register(function(t){return new m0(t)}),this.register(function(t){return new T0(t)}),this.register(function(t){return new b0(t)}),this.register(function(t){return new A0(t)}),this.register(function(t){return new _0(t)}),this.register(function(t){return new x0(t)}),this.register(function(t){return new v0(t)}),this.register(function(t){return new M0(t)}),this.register(function(t){return new d0(t)}),this.register(function(t){return new y0(t)}),this.register(function(t){return new g0(t)}),this.register(function(t){return new E0(t)}),this.register(function(t){return new S0(t)}),this.register(function(t){return new h0(t)}),this.register(function(t){return new w0(t)}),this.register(function(t){return new R0(t)})}load(e,t,n,i){const s=this;let a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){const c=wr.extractUrlBase(e);a=wr.resolveURL(c,this.path)}else a=wr.extractUrlBase(e);this.manager.itemStart(e);const o=function(c){i?i(c):console.error(c),s.manager.itemError(e),s.manager.itemEnd(e)},l=new Su(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{s.parse(c,a,function(u){t(u),s.manager.itemEnd(e)},o)}catch(u){o(u)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let s;const a={},o={},l=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===Pu){try{a[Je.KHR_BINARY_GLTF]=new C0(e)}catch(h){i&&i(h);return}s=JSON.parse(a[Je.KHR_BINARY_GLTF].content)}else s=JSON.parse(l.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const c=new V0(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){const h=this.pluginCallbacks[u](c);h.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[h.name]=h,a[h.name]=!0}if(s.extensionsUsed)for(let u=0;u<s.extensionsUsed.length;++u){const h=s.extensionsUsed[u],f=s.extensionsRequired||[];switch(h){case Je.KHR_MATERIALS_UNLIT:a[h]=new f0;break;case Je.KHR_DRACO_MESH_COMPRESSION:a[h]=new P0(s,this.dracoLoader);break;case Je.KHR_TEXTURE_TRANSFORM:a[h]=new L0;break;case Je.KHR_MESH_QUANTIZATION:a[h]=new I0;break;default:f.indexOf(h)>=0&&o[h]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+h+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(n,i)}parseAsync(e,t){const n=this;return new Promise(function(i,s){n.parse(e,t,i,s)})}}function u0(){let r={};return{get:function(e){return r[e]},add:function(e,t){r[e]=t},remove:function(e){delete r[e]},removeAll:function(){r={}}}}const Je={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class h0{constructor(e){this.parser=e,this.name=Je.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){const s=t[n];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let i=t.cache.get(n);if(i)return i;const s=t.json,l=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e];let c;const u=new ze(16777215);l.color!==void 0&&u.setRGB(l.color[0],l.color[1],l.color[2],Vt);const h=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new Co(u),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new Tu(u),c.distance=h;break;case"spot":c=new hd(u),c.distance=h,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),xn(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),i=Promise.resolve(c),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,s=n.json.nodes[e],o=(s.extensions&&s.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return n._getNodeRef(t.cache,o,l)})}}class f0{constructor(){this.name=Je.KHR_MATERIALS_UNLIT}getMaterialType(){return dn}extendParams(e,t,n){const i=[];e.color=new ze(1,1,1),e.opacity=1;const s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){const a=s.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],Vt),e.opacity=a[3]}s.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",s.baseColorTexture,Et))}return Promise.all(i)}}class d0{constructor(e){this.parser=e,this.name=Je.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=i.extensions[this.name].emissiveStrength;return s!==void 0&&(t.emissiveIntensity=s),Promise.resolve()}}class p0{constructor(e){this.parser=e,this.name=Je.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:wn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],a=i.extensions[this.name];if(a.clearcoatFactor!==void 0&&(t.clearcoat=a.clearcoatFactor),a.clearcoatTexture!==void 0&&s.push(n.assignTexture(t,"clearcoatMap",a.clearcoatTexture)),a.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=a.clearcoatRoughnessFactor),a.clearcoatRoughnessTexture!==void 0&&s.push(n.assignTexture(t,"clearcoatRoughnessMap",a.clearcoatRoughnessTexture)),a.clearcoatNormalTexture!==void 0&&(s.push(n.assignTexture(t,"clearcoatNormalMap",a.clearcoatNormalTexture)),a.clearcoatNormalTexture.scale!==void 0)){const o=a.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Be(o,o)}return Promise.all(s)}}class m0{constructor(e){this.parser=e,this.name=Je.KHR_MATERIALS_DISPERSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:wn}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=i.extensions[this.name];return t.dispersion=s.dispersion!==void 0?s.dispersion:0,Promise.resolve()}}class g0{constructor(e){this.parser=e,this.name=Je.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:wn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],a=i.extensions[this.name];return a.iridescenceFactor!==void 0&&(t.iridescence=a.iridescenceFactor),a.iridescenceTexture!==void 0&&s.push(n.assignTexture(t,"iridescenceMap",a.iridescenceTexture)),a.iridescenceIor!==void 0&&(t.iridescenceIOR=a.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),a.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=a.iridescenceThicknessMinimum),a.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=a.iridescenceThicknessMaximum),a.iridescenceThicknessTexture!==void 0&&s.push(n.assignTexture(t,"iridescenceThicknessMap",a.iridescenceThicknessTexture)),Promise.all(s)}}class _0{constructor(e){this.parser=e,this.name=Je.KHR_MATERIALS_SHEEN}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:wn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[];t.sheenColor=new ze(0,0,0),t.sheenRoughness=0,t.sheen=1;const a=i.extensions[this.name];if(a.sheenColorFactor!==void 0){const o=a.sheenColorFactor;t.sheenColor.setRGB(o[0],o[1],o[2],Vt)}return a.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=a.sheenRoughnessFactor),a.sheenColorTexture!==void 0&&s.push(n.assignTexture(t,"sheenColorMap",a.sheenColorTexture,Et)),a.sheenRoughnessTexture!==void 0&&s.push(n.assignTexture(t,"sheenRoughnessMap",a.sheenRoughnessTexture)),Promise.all(s)}}class x0{constructor(e){this.parser=e,this.name=Je.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:wn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],a=i.extensions[this.name];return a.transmissionFactor!==void 0&&(t.transmission=a.transmissionFactor),a.transmissionTexture!==void 0&&s.push(n.assignTexture(t,"transmissionMap",a.transmissionTexture)),Promise.all(s)}}class v0{constructor(e){this.parser=e,this.name=Je.KHR_MATERIALS_VOLUME}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:wn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],a=i.extensions[this.name];t.thickness=a.thicknessFactor!==void 0?a.thicknessFactor:0,a.thicknessTexture!==void 0&&s.push(n.assignTexture(t,"thicknessMap",a.thicknessTexture)),t.attenuationDistance=a.attenuationDistance||1/0;const o=a.attenuationColor||[1,1,1];return t.attenuationColor=new ze().setRGB(o[0],o[1],o[2],Vt),Promise.all(s)}}class M0{constructor(e){this.parser=e,this.name=Je.KHR_MATERIALS_IOR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:wn}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=i.extensions[this.name];return t.ior=s.ior!==void 0?s.ior:1.5,Promise.resolve()}}class y0{constructor(e){this.parser=e,this.name=Je.KHR_MATERIALS_SPECULAR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:wn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],a=i.extensions[this.name];t.specularIntensity=a.specularFactor!==void 0?a.specularFactor:1,a.specularTexture!==void 0&&s.push(n.assignTexture(t,"specularIntensityMap",a.specularTexture));const o=a.specularColorFactor||[1,1,1];return t.specularColor=new ze().setRGB(o[0],o[1],o[2],Vt),a.specularColorTexture!==void 0&&s.push(n.assignTexture(t,"specularColorMap",a.specularColorTexture,Et)),Promise.all(s)}}class S0{constructor(e){this.parser=e,this.name=Je.EXT_MATERIALS_BUMP}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:wn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],a=i.extensions[this.name];return t.bumpScale=a.bumpFactor!==void 0?a.bumpFactor:1,a.bumpTexture!==void 0&&s.push(n.assignTexture(t,"bumpMap",a.bumpTexture)),Promise.all(s)}}class E0{constructor(e){this.parser=e,this.name=Je.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:wn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],a=i.extensions[this.name];return a.anisotropyStrength!==void 0&&(t.anisotropy=a.anisotropyStrength),a.anisotropyRotation!==void 0&&(t.anisotropyRotation=a.anisotropyRotation),a.anisotropyTexture!==void 0&&s.push(n.assignTexture(t,"anisotropyMap",a.anisotropyTexture)),Promise.all(s)}}class T0{constructor(e){this.parser=e,this.name=Je.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;const s=i.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,a)}}class b0{constructor(e){this.parser=e,this.name=Je.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;const a=s.extensions[t],o=i.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class A0{constructor(e){this.parser=e,this.name=Je.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;const a=s.extensions[t],o=i.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class w0{constructor(e){this.name=Je.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const i=n.extensions[this.name],s=this.parser.getDependency("buffer",i.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(o){const l=i.byteOffset||0,c=i.byteLength||0,u=i.count,h=i.byteStride,f=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(u,h,f,i.mode,i.filter).then(function(p){return p.buffer}):a.ready.then(function(){const p=new ArrayBuffer(u*h);return a.decodeGltfBuffer(new Uint8Array(p),u,h,f,i.mode,i.filter),p})})}else return null}}class R0{constructor(e){this.name=Je.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const i=t.meshes[n.mesh];for(const c of i.primitives)if(c.mode!==tn.TRIANGLES&&c.mode!==tn.TRIANGLE_STRIP&&c.mode!==tn.TRIANGLE_FAN&&c.mode!==void 0)return null;const a=n.extensions[this.name].attributes,o=[],l={};for(const c in a)o.push(this.parser.getDependency("accessor",a[c]).then(u=>(l[c]=u,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{const u=c.pop(),h=u.isGroup?u.children:[u],f=c[0].count,p=[];for(const g of h){const _=new Xe,m=new U,d=new li,b=new U(1,1,1),M=new bo(g.geometry,g.material,f);for(let v=0;v<f;v++)l.TRANSLATION&&m.fromBufferAttribute(l.TRANSLATION,v),l.ROTATION&&d.fromBufferAttribute(l.ROTATION,v),l.SCALE&&b.fromBufferAttribute(l.SCALE,v),M.setMatrixAt(v,_.compose(m,d,b));for(const v in l)if(v==="_COLOR_0"){const R=l[v];M.instanceColor=new To(R.array,R.itemSize,R.normalized)}else v!=="TRANSLATION"&&v!=="ROTATION"&&v!=="SCALE"&&g.geometry.setAttribute(v,l[v]);_t.prototype.copy.call(M,g),this.parser.assignFinalMaterial(M),p.push(M)}return u.isGroup?(u.clear(),u.add(...p),u):p[0]}))}}const Pu="glTF",Mr=12,Il={JSON:1313821514,BIN:5130562};class C0{constructor(e){this.name=Je.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,Mr),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Pu)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const i=this.header.length-Mr,s=new DataView(e,Mr);let a=0;for(;a<i;){const o=s.getUint32(a,!0);a+=4;const l=s.getUint32(a,!0);if(a+=4,l===Il.JSON){const c=new Uint8Array(e,Mr+a,o);this.content=n.decode(c)}else if(l===Il.BIN){const c=Mr+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class P0{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Je.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,i=this.dracoLoader,s=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(const u in a){const h=Io[u]||u.toLowerCase();o[h]=a[u]}for(const u in e.attributes){const h=Io[u]||u.toLowerCase();if(a[u]!==void 0){const f=n.accessors[e.attributes[u]],p=ji[f.componentType];c[h]=p.name,l[h]=f.normalized===!0}}return t.getDependency("bufferView",s).then(function(u){return new Promise(function(h,f){i.decodeDracoFile(u,function(p){for(const g in p.attributes){const _=p.attributes[g],m=l[g];m!==void 0&&(_.normalized=m)}h(p)},o,c,Vt,f)})})}}class L0{constructor(){this.name=Je.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class I0{constructor(){this.name=Je.KHR_MESH_QUANTIZATION}}class Lu extends Gr{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i*3+i;for(let a=0;a!==i;a++)t[a]=n[s+a];return t}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,u=i-t,h=(n-t)/u,f=h*h,p=f*h,g=e*c,_=g-c,m=-2*p+3*f,d=p-f,b=1-m,M=d-f+h;for(let v=0;v!==o;v++){const R=a[_+v+o],P=a[_+v+l]*u,L=a[g+v+o],F=a[g+v]*u;s[v]=b*R+M*P+m*L+d*F}return s}}const D0=new li;class U0 extends Lu{interpolate_(e,t,n,i){const s=super.interpolate_(e,t,n,i);return D0.fromArray(s).normalize().toArray(s),s}}const tn={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},ji={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Dl={9728:kt,9729:Xt,9984:ql,9985:Es,9986:Sr,9987:On},Ul={33071:ii,33648:Ps,10497:Gn},Ca={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Io={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},ei={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},N0={CUBICSPLINE:void 0,LINEAR:Dr,STEP:Ir},Pa={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function F0(r){return r.DefaultMaterial===void 0&&(r.DefaultMaterial=new Vr({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Vn})),r.DefaultMaterial}function _i(r,e,t){for(const n in t.extensions)r[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function xn(r,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(r.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function O0(r,e,t){let n=!1,i=!1,s=!1;for(let c=0,u=e.length;c<u;c++){const h=e[c];if(h.POSITION!==void 0&&(n=!0),h.NORMAL!==void 0&&(i=!0),h.COLOR_0!==void 0&&(s=!0),n&&i&&s)break}if(!n&&!i&&!s)return Promise.resolve(r);const a=[],o=[],l=[];for(let c=0,u=e.length;c<u;c++){const h=e[c];if(n){const f=h.POSITION!==void 0?t.getDependency("accessor",h.POSITION):r.attributes.position;a.push(f)}if(i){const f=h.NORMAL!==void 0?t.getDependency("accessor",h.NORMAL):r.attributes.normal;o.push(f)}if(s){const f=h.COLOR_0!==void 0?t.getDependency("accessor",h.COLOR_0):r.attributes.color;l.push(f)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){const u=c[0],h=c[1],f=c[2];return n&&(r.morphAttributes.position=u),i&&(r.morphAttributes.normal=h),s&&(r.morphAttributes.color=f),r.morphTargetsRelative=!0,r})}function B0(r,e){if(r.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)r.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(r.morphTargetInfluences.length===t.length){r.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)r.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function z0(r){let e;const t=r.extensions&&r.extensions[Je.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+La(t.attributes):e=r.indices+":"+La(r.attributes)+":"+r.mode,r.targets!==void 0)for(let n=0,i=r.targets.length;n<i;n++)e+=":"+La(r.targets[n]);return e}function La(r){let e="";const t=Object.keys(r).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+r[t[n]]+";";return e}function Do(r){switch(r){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function k0(r){return r.search(/\.jpe?g($|\?)/i)>0||r.search(/^data\:image\/jpeg/)===0?"image/jpeg":r.search(/\.webp($|\?)/i)>0||r.search(/^data\:image\/webp/)===0?"image/webp":r.search(/\.ktx2($|\?)/i)>0||r.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const H0=new Xe;class V0{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new u0,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,s=!1,a=-1;if(typeof navigator<"u"){const o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;const l=o.match(/Version\/(\d+)/);i=n&&l?parseInt(l[1],10):-1,s=o.indexOf("Firefox")>-1,a=s?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||s&&a<98?this.textureLoader=new Eu(this.options.manager):this.textureLoader=new pd(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Su(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,i=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){const o={scene:a[0][i.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:i.asset,parser:n,userData:{}};return _i(s,o,i),xn(o,i),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(const l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,s=t.length;i<s;i++){const a=t[i].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let i=0,s=e.length;i<s;i++){const a=e[i];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const i=n.clone(),s=(a,o)=>{const l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(const[c,u]of a.children.entries())s(u,o.children[c])};return s(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const i=e(t[n]);if(i)return i}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let i=0;i<t.length;i++){const s=e(t[i]);s&&n.push(s)}return n}getDependency(e,t){const n=e+":"+t;let i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":i=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(s,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Je.KHR_BINARY_GLTF].body);const i=this.options;return new Promise(function(s,a){n.load(wr.resolveURL(t.uri,i.path),s,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const i=t.byteLength||0,s=t.byteOffset||0;return n.slice(s,s+i)})}loadAccessor(e){const t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){const a=Ca[i.type],o=ji[i.componentType],l=i.normalized===!0,c=new o(i.count*a);return Promise.resolve(new Nt(c,a,l))}const s=[];return i.bufferView!==void 0?s.push(this.getDependency("bufferView",i.bufferView)):s.push(null),i.sparse!==void 0&&(s.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(s).then(function(a){const o=a[0],l=Ca[i.type],c=ji[i.componentType],u=c.BYTES_PER_ELEMENT,h=u*l,f=i.byteOffset||0,p=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,g=i.normalized===!0;let _,m;if(p&&p!==h){const d=Math.floor(f/p),b="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+d+":"+i.count;let M=t.cache.get(b);M||(_=new c(o,d*p,i.count*p/u),M=new vf(_,p/u),t.cache.add(b,M)),m=new Ko(M,l,f%p/u,g)}else o===null?_=new c(i.count*l):_=new c(o,f,i.count*l),m=new Nt(_,l,g);if(i.sparse!==void 0){const d=Ca.SCALAR,b=ji[i.sparse.indices.componentType],M=i.sparse.indices.byteOffset||0,v=i.sparse.values.byteOffset||0,R=new b(a[1],M,i.sparse.count*d),P=new c(a[2],v,i.sparse.count*l);o!==null&&(m=new Nt(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let L=0,F=R.length;L<F;L++){const S=R[L];if(m.setX(S,P[L*l]),l>=2&&m.setY(S,P[L*l+1]),l>=3&&m.setZ(S,P[L*l+2]),l>=4&&m.setW(S,P[L*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=g}return m})}loadTexture(e){const t=this.json,n=this.options,s=t.textures[e].source,a=t.images[s];let o=this.textureLoader;if(a.uri){const l=n.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,s,o)}loadTextureImage(e,t,n){const i=this,s=this.json,a=s.textures[e],o=s.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];const c=this.loadImageSource(t,n).then(function(u){u.flipY=!1,u.name=a.name||o.name||"",u.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(u.name=o.uri);const f=(s.samplers||{})[a.sampler]||{};return u.magFilter=Dl[f.magFilter]||Xt,u.minFilter=Dl[f.minFilter]||On,u.wrapS=Ul[f.wrapS]||Gn,u.wrapT=Ul[f.wrapT]||Gn,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==kt&&u.minFilter!==Xt,i.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){const n=this,i=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(h=>h.clone());const a=i.images[e],o=self.URL||self.webkitURL;let l=a.uri||"",c=!1;if(a.bufferView!==void 0)l=n.getDependency("bufferView",a.bufferView).then(function(h){c=!0;const f=new Blob([h],{type:a.mimeType});return l=o.createObjectURL(f),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const u=Promise.resolve(l).then(function(h){return new Promise(function(f,p){let g=f;t.isImageBitmapLoader===!0&&(g=function(_){const m=new wt(_);m.needsUpdate=!0,f(m)}),t.load(wr.resolveURL(h,s.path),g,void 0,p)})}).then(function(h){return c===!0&&o.revokeObjectURL(l),xn(h,a),h.userData.mimeType=a.mimeType||k0(a.uri),h}).catch(function(h){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),h});return this.sourceCache[e]=u,u}assignTexture(e,t,n,i){const s=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),s.extensions[Je.KHR_TEXTURE_TRANSFORM]){const o=n.extensions!==void 0?n.extensions[Je.KHR_TEXTURE_TRANSFORM]:void 0;if(o){const l=s.associations.get(a);a=s.extensions[Je.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),s.associations.set(a,l)}}return i!==void 0&&(a.colorSpace=i),e[t]=a,a})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const i=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){const o="PointsMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new pu,En.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(o,l)),n=l}else if(e.isLine){const o="LineBasicMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new du,En.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(o,l)),n=l}if(i||s||a){let o="ClonedMaterial:"+n.uuid+":";i&&(o+="derivative-tangents:"),s&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=n.clone(),s&&(l.vertexColors=!0),a&&(l.flatShading=!0),i&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return Vr}loadMaterial(e){const t=this,n=this.json,i=this.extensions,s=n.materials[e];let a;const o={},l=s.extensions||{},c=[];if(l[Je.KHR_MATERIALS_UNLIT]){const h=i[Je.KHR_MATERIALS_UNLIT];a=h.getMaterialType(),c.push(h.extendParams(o,s,t))}else{const h=s.pbrMetallicRoughness||{};if(o.color=new ze(1,1,1),o.opacity=1,Array.isArray(h.baseColorFactor)){const f=h.baseColorFactor;o.color.setRGB(f[0],f[1],f[2],Vt),o.opacity=f[3]}h.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",h.baseColorTexture,Et)),o.metalness=h.metallicFactor!==void 0?h.metallicFactor:1,o.roughness=h.roughnessFactor!==void 0?h.roughnessFactor:1,h.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",h.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",h.metallicRoughnessTexture))),a=this._invokeOne(function(f){return f.getMaterialType&&f.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(f){return f.extendMaterialParams&&f.extendMaterialParams(e,o)})))}s.doubleSided===!0&&(o.side=$t);const u=s.alphaMode||Pa.OPAQUE;if(u===Pa.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,u===Pa.MASK&&(o.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&a!==dn&&(c.push(t.assignTexture(o,"normalMap",s.normalTexture)),o.normalScale=new Be(1,1),s.normalTexture.scale!==void 0)){const h=s.normalTexture.scale;o.normalScale.set(h,h)}if(s.occlusionTexture!==void 0&&a!==dn&&(c.push(t.assignTexture(o,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&a!==dn){const h=s.emissiveFactor;o.emissive=new ze().setRGB(h[0],h[1],h[2],Vt)}return s.emissiveTexture!==void 0&&a!==dn&&c.push(t.assignTexture(o,"emissiveMap",s.emissiveTexture,Et)),Promise.all(c).then(function(){const h=new a(o);return s.name&&(h.name=s.name),xn(h,s),t.associations.set(h,{materials:e}),s.extensions&&_i(i,h,s),h})}createUniqueName(e){const t=ct.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,i=this.primitiveCache;function s(o){return n[Je.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return Nl(l,o,t)})}const a=[];for(let o=0,l=e.length;o<l;o++){const c=e[o],u=z0(c),h=i[u];if(h)a.push(h.promise);else{let f;c.extensions&&c.extensions[Je.KHR_DRACO_MESH_COMPRESSION]?f=s(c):f=Nl(new rn,c,t),i[u]={primitive:c,promise:f},a.push(f)}}return Promise.all(a)}loadMesh(e){const t=this,n=this.json,i=this.extensions,s=n.meshes[e],a=s.primitives,o=[];for(let l=0,c=a.length;l<c;l++){const u=a[l].material===void 0?F0(this.cache):this.getDependency("material",a[l].material);o.push(u)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(l){const c=l.slice(0,l.length-1),u=l[l.length-1],h=[];for(let p=0,g=u.length;p<g;p++){const _=u[p],m=a[p];let d;const b=c[p];if(m.mode===tn.TRIANGLES||m.mode===tn.TRIANGLE_STRIP||m.mode===tn.TRIANGLE_FAN||m.mode===void 0)d=s.isSkinnedMesh===!0?new yf(_,b):new At(_,b),d.isSkinnedMesh===!0&&d.normalizeSkinWeights(),m.mode===tn.TRIANGLE_STRIP?d.geometry=Ll(d.geometry,eu):m.mode===tn.TRIANGLE_FAN&&(d.geometry=Ll(d.geometry,So));else if(m.mode===tn.LINES)d=new wf(_,b);else if(m.mode===tn.LINE_STRIP)d=new $o(_,b);else if(m.mode===tn.LINE_LOOP)d=new Rf(_,b);else if(m.mode===tn.POINTS)d=new Cf(_,b);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(d.geometry.morphAttributes).length>0&&B0(d,s),d.name=t.createUniqueName(s.name||"mesh_"+e),xn(d,s),m.extensions&&_i(i,d,m),t.assignFinalMaterial(d),h.push(d)}for(let p=0,g=h.length;p<g;p++)t.associations.set(h[p],{meshes:e,primitives:p});if(h.length===1)return s.extensions&&_i(i,h[0],s),h[0];const f=new Si;s.extensions&&_i(i,f,s),t.associations.set(f,{meshes:e});for(let p=0,g=h.length;p<g;p++)f.add(h[p]);return f})}loadCamera(e){let t;const n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new zt(It.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new zs(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),xn(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let i=0,s=t.joints.length;i<s;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){const s=i.pop(),a=i,o=[],l=[];for(let c=0,u=a.length;c<u;c++){const h=a[c];if(h){o.push(h);const f=new Xe;s!==null&&f.fromArray(s.array,c*16),l.push(f)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new jo(o,l)})}loadAnimation(e){const t=this.json,n=this,i=t.animations[e],s=i.name?i.name:"animation_"+e,a=[],o=[],l=[],c=[],u=[];for(let h=0,f=i.channels.length;h<f;h++){const p=i.channels[h],g=i.samplers[p.sampler],_=p.target,m=_.node,d=i.parameters!==void 0?i.parameters[g.input]:g.input,b=i.parameters!==void 0?i.parameters[g.output]:g.output;_.node!==void 0&&(a.push(this.getDependency("node",m)),o.push(this.getDependency("accessor",d)),l.push(this.getDependency("accessor",b)),c.push(g),u.push(_))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(u)]).then(function(h){const f=h[0],p=h[1],g=h[2],_=h[3],m=h[4],d=[];for(let M=0,v=f.length;M<v;M++){const R=f[M],P=p[M],L=g[M],F=_[M],S=m[M];if(R===void 0)continue;R.updateMatrix&&R.updateMatrix();const T=n._createAnimationTracks(R,P,L,F,S);if(T)for(let E=0;E<T.length;E++)d.push(T[E])}const b=new nd(s,void 0,d);return xn(b,i),b})}createNodeMesh(e){const t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(s){const a=n._getNodeRef(n.meshCache,i.mesh,s);return i.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=i.weights.length;l<c;l++)o.morphTargetInfluences[l]=i.weights[l]}),a})}loadNode(e){const t=this.json,n=this,i=t.nodes[e],s=n._loadNodeShallow(e),a=[],o=i.children||[];for(let c=0,u=o.length;c<u;c++)a.push(n.getDependency("node",o[c]));const l=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([s,Promise.all(a),l]).then(function(c){const u=c[0],h=c[1],f=c[2];f!==null&&u.traverse(function(p){p.isSkinnedMesh&&p.bind(f,H0)});for(let p=0,g=h.length;p<g;p++)u.add(h[p]);return u})}_loadNodeShallow(e){const t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const s=t.nodes[e],a=s.name?i.createUniqueName(s.name):"",o=[],l=i._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),s.camera!==void 0&&o.push(i.getDependency("camera",s.camera).then(function(c){return i._getNodeRef(i.cameraCache,s.camera,c)})),i._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let u;if(s.isBone===!0?u=new hu:c.length>1?u=new Si:c.length===1?u=c[0]:u=new _t,u!==c[0])for(let h=0,f=c.length;h<f;h++)u.add(c[h]);if(s.name&&(u.userData.name=s.name,u.name=a),xn(u,s),s.extensions&&_i(n,u,s),s.matrix!==void 0){const h=new Xe;h.fromArray(s.matrix),u.applyMatrix4(h)}else s.translation!==void 0&&u.position.fromArray(s.translation),s.rotation!==void 0&&u.quaternion.fromArray(s.rotation),s.scale!==void 0&&u.scale.fromArray(s.scale);if(!i.associations.has(u))i.associations.set(u,{});else if(s.mesh!==void 0&&i.meshCache.refs[s.mesh]>1){const h=i.associations.get(u);i.associations.set(u,{...h})}return i.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],i=this,s=new Si;n.name&&(s.name=i.createUniqueName(n.name)),xn(s,n),n.extensions&&_i(t,s,n);const a=n.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(i.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let u=0,h=l.length;u<h;u++)s.add(l[u]);const c=u=>{const h=new Map;for(const[f,p]of i.associations)(f instanceof En||f instanceof wt)&&h.set(f,p);return u.traverse(f=>{const p=i.associations.get(f);p!=null&&h.set(f,p)}),h};return i.associations=c(s),s})}_createAnimationTracks(e,t,n,i,s){const a=[],o=e.name?e.name:e.uuid,l=[];ei[s.path]===ei.weights?e.traverse(function(f){f.morphTargetInfluences&&l.push(f.name?f.name:f.uuid)}):l.push(o);let c;switch(ei[s.path]){case ei.weights:c=nr;break;case ei.rotation:c=ir;break;case ei.translation:case ei.scale:c=rr;break;default:switch(n.itemSize){case 1:c=nr;break;case 2:case 3:default:c=rr;break}break}const u=i.interpolation!==void 0?N0[i.interpolation]:Dr,h=this._getArrayFromAccessor(n);for(let f=0,p=l.length;f<p;f++){const g=new c(l[f]+"."+ei[s.path],t.array,h,u);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(g),a.push(g)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=Do(t.constructor),i=new Float32Array(t.length);for(let s=0,a=t.length;s<a;s++)i[s]=t[s]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const i=this instanceof ir?U0:Lu;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function G0(r,e,t){const n=e.attributes,i=new Xn;if(n.POSITION!==void 0){const o=t.json.accessors[n.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(i.set(new U(l[0],l[1],l[2]),new U(c[0],c[1],c[2])),o.normalized){const u=Do(ji[o.componentType]);i.min.multiplyScalar(u),i.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const s=e.targets;if(s!==void 0){const o=new U,l=new U;for(let c=0,u=s.length;c<u;c++){const h=s[c];if(h.POSITION!==void 0){const f=t.json.accessors[h.POSITION],p=f.min,g=f.max;if(p!==void 0&&g!==void 0){if(l.setX(Math.max(Math.abs(p[0]),Math.abs(g[0]))),l.setY(Math.max(Math.abs(p[1]),Math.abs(g[1]))),l.setZ(Math.max(Math.abs(p[2]),Math.abs(g[2]))),f.normalized){const _=Do(ji[f.componentType]);l.multiplyScalar(_)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(o)}r.boundingBox=i;const a=new An;i.getCenter(a.center),a.radius=i.min.distanceTo(i.max)/2,r.boundingSphere=a}function Nl(r,e,t){const n=e.attributes,i=[];function s(a,o){return t.getDependency("accessor",a).then(function(l){r.setAttribute(o,l)})}for(const a in n){const o=Io[a]||a.toLowerCase();o in r.attributes||i.push(s(n[a],o))}if(e.indices!==void 0&&!r.index){const a=t.getDependency("accessor",e.indices).then(function(o){r.setIndex(o)});i.push(a)}return tt.workingColorSpace!==Vt&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${tt.workingColorSpace}" not supported.`),xn(r,e),G0(r,e,t),Promise.all(i).then(function(){return e.targets!==void 0?O0(r,e.targets,t):r})}const Lt=3,W0=[2,3,0,1],Uo=[[0,-1],[1,0],[0,1],[-1,0]],X0=Array.from({length:81},(r,e)=>[Math.floor(e/27),Math.floor(e/9)%3,Math.floor(e/3)%3,e%3]),xt=15.4,pt=9.2;function rc(r,e,t=0){let n=Math.imul(r|0,48610963)^Math.imul(e|0,2135587861)^Math.imul(t|0,668265261);return n=Math.imul(n^n>>>16,73244475),(n^n>>>16)>>>0}function Hs(r){let e=r>>>0;return()=>{e=e+1831565813>>>0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function q0(r,e,t,n){const[i,s]=Uo[t];return r===0&&e===0||r+i===0&&e+s===0?1:rc(r+Math.max(i,0),e+Math.max(s,0),n+(i?542:221))%3}function Y0(r,e,t){const n=Hs(rc(r,e,t)),i=Array.from({length:Lt*Lt},(a,o)=>{const l=o%Lt,c=Math.floor(o/Lt),u=r*Lt+l,h=e*Lt+c,f=[c===0,l===Lt-1,c===Lt-1,l===0];return X0.filter(p=>p.every((g,_)=>u===0&&h===0?g===1:!f[_]||g===q0(u,h,_,t)))});function s(a){for(;a.length;){const o=a.pop(),l=o%Lt,c=Math.floor(o/Lt);for(let u=0;u<4;u++){const h=l+Uo[u][0],f=c+Uo[u][1];if(h<0||h>=Lt||f<0||f>=Lt)continue;let p=0;for(const d of i[o])p|=1<<d[u];const g=f*Lt+h,_=i[g],m=_.filter(d=>p&1<<d[W0[u]]);m.length!==_.length&&(i[g]=m,a.push(g))}}}for(s(i.map((a,o)=>o));;){let a=-1,o=1/0;if(i.forEach((c,u)=>{if(c.length>1){const h=c.length+n()*.15;h<o&&(a=u,o=h)}}),a<0)break;const l=i[a];i[a]=[l[Math.floor(n()*l.length)]],s([a])}return i.map(a=>a[0])}function Fl(r){const e=new Map;return(t,n)=>{const i=Math.floor(t/Lt),s=Math.floor(n/Lt),a=i+","+s;e.has(a)||(e.size>=72&&e.delete(e.keys().next().value),e.set(a,Y0(i,s,r)));const o=e.get(a)[(n-s*Lt)*Lt+t-i*Lt],l=rc(t,n,r);return{x:t,z:n,id:l,sockets:o,river(c){const u=Math.max(0,Math.min(1,c/pt+.5)),h=u*u*(3-2*u);return((o[0]-1)*(1-h)+(o[2]-1)*h)*2.5+2.34+Math.sin(Math.PI*u)**2*(1.85*Math.sin(2*Math.PI*u+.73)+.25*Math.sin(4*Math.PI*u))},path(c){const u=Math.max(0,Math.min(1,c/xt+.5)),h=u*u*(3-2*u);return((o[3]-1)*(1-h)+(o[1]-1)*h)*1.6+.85+Math.sin(Math.PI*u)**2*(1.51*Math.sin(2*Math.PI*u-.26))}}}}const Wt=7.73,ln=4.65,Xi=(r,e=0)=>.22+.3*Math.sin(Math.min(1,Math.abs(r)/Wt)*Math.PI)-.21*Math.exp(-Math.abs(r)*5)+.026*Math.cos(e*.6),Ia=new Map;function K0(r){return Ia.has(r)||Ia.set(r,new ze(r)),Ia.get(r)}class Vs{constructor(){this.p=[],this.c=[],this.uv=[]}triangle(e,t,n,i){var a;const s=K0(i);for(const o of[e,t,n])this.p.push(o[0],o[1]+(((a=this.relief)==null?void 0:a.call(this,o[0],o[2]))||0),o[2]),this.c.push(s.r,s.g,s.b),this.uv.push(o[0]*.47+o[1]*.15,o[2]*.47+o[1]*.72)}quad(e,t,n,i,s){this.triangle(e,t,n,s),this.triangle(e,n,i,s)}poly(e,t){const n=e.map(i=>new Be(i[0],i[2]));for(const[i,s,a]of Os.triangulateShape(n,[]))this.triangle(e[a],e[s],e[i],t)}mesh(e){const t=new rn;t.setAttribute("position",new Ht(this.p,3)),t.setAttribute("color",new Ht(this.c,3)),t.setAttribute("uv",new Ht(this.uv,2)),t.computeVertexNormals(),t.computeBoundingSphere();const n=new At(t,e);return n.receiveShadow=!0,n}}function j0(r=19){const e=document.createElement("canvas");e.width=e.height=256;const t=e.getContext("2d"),n=t.createImageData(256,256);let i=r;function s(){return i=Math.imul(i,1664525)+1013904223>>>0,i/4294967296}for(let o=0;o<n.data.length;o+=4){const l=240+s()*15;n.data[o]=l,n.data[o+1]=l,n.data[o+2]=l,n.data[o+3]=255}t.putImageData(n,0,0);for(let o=0;o<3200;o++){const l=s()*256,c=s()*256;t.strokeStyle=s()>.5?"rgba(255,255,248,.42)":"rgba(104,94,74,.12)",t.lineWidth=.3+s()*.45,t.beginPath(),t.moveTo(l,c),t.lineTo(l+(s()-.25)*6,c+(s()-.5)*3),t.stroke()}const a=new Fs(e);return a.wrapS=a.wrapT=Gn,a.colorSpace=Et,a}function Ol(r,e=!1,t=null){const n=new Vr({vertexColors:!0,map:r,roughness:1,metalness:0,side:$t});return n.onBeforeCompile=i=>{i.vertexShader=`varying vec2 sheetPos; varying float paperFace;
`+i.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
      sheetPos=(modelMatrix*vec4(position,1.)).xz; paperFace=max(normal.y,0.);
      ${e?"transformed.y+=.22+.30*sin(min(1.,abs(sheetPos.x)/7.73)*3.14159265)-.21*exp(-abs(sheetPos.x)*5.)+.026*cos(sheetPos.y*.6);":""}`),i.fragmentShader=`varying vec2 sheetPos; varying float paperFace; uniform sampler2D atlasInk;
`+i.fragmentShader,e&&(i.fragmentShader=i.fragmentShader.replace("#include <clipping_planes_fragment>",`#include <clipping_planes_fragment>
      if(abs(sheetPos.x)>7.52 || abs(sheetPos.y)>4.47)discard;`)),t&&(i.uniforms.atlasInk={value:t},i.fragmentShader=i.fragmentShader.replace("#include <map_fragment>",`#include <map_fragment>
        vec3 ink=texture2D(atlasInk,sheetPos*vec2(.070,.105)+vec2(.44,.48)).rgb;
        float engraving=clamp((.951-dot(ink,vec3(.299,.587,.114)))*3.2,0.,.77);
        diffuseColor.rgb*=1.-${e?".36":".52"}*engraving*smoothstep(.64,.93,paperFace);`))},n.customProgramCacheKey=()=>"card-stock-"+Number(e)+"-"+ +!!t,n}function Z0(r){const e=new Vs;for(const a of[-1,1]){let g=function(_,m,d,b,M,v){const R=Math.hypot(d-_,b-m)||1,P=(b-m)*M/R,L=(_-d)*M/R;e.quad(...[[_+P,m+L],[d+P,b+L],[d-P,b-L],[_-P,m-L]].map(([F,S])=>[F,l(F,S)+.008,S]),v)};var s=g;const o=(_,m,d,b=Wt,M=ln)=>{const v=a*_*b,R=.16*Math.max(0,(_-.978)/.022)**1.75;return[v,d(v,m*M),m*(M-R)]},l=(_,m)=>Xi(_,m),c=(_,m,d=38)=>{const b=[];for(let M=0;M<=d;M++)b.push([M/d,-1]);for(let M=1;M<=8;M++)b.push([1,-1+M/4]);for(let M=d-1;M>=0;M--)b.push([M/d,1]);return b},u=(_,m,d)=>o(_,m,(b,M)=>l(b,M)*.3+d,Wt+.18,ln+.16),h=c();for(let _=0;_<h.length-1;_++){const[m,d]=h[_],[b,M]=h[_+1];e.quad(u(m,d,-.47),u(b,M,-.47),u(b,M,-.32),u(m,d,-.32),"#263e35"),e.quad(u(m,d,-.335),u(b,M,-.335),u(b,M,-.312),u(m,d,-.312),"#987847")}for(let _=0;_<38;_++)e.quad(u(_/38,-1,-.31),u(_/38,1,-.31),u((_+1)/38,1,-.31),u((_+1)/38,-1,-.31),"#344b3c"),e.quad(u(_/38,-1,-.47),u((_+1)/38,-1,-.47),u((_+1)/38,1,-.47),u(_/38,1,-.47),"#23372e");const f=["#cfb78a","#e0c79f","#dcc6a1","#ecd9b3","#bd9d72","#e7d3ad","#ebd7b2"],p=(_,m,d)=>o(_,m,(b,M)=>It.lerp(l(b,M)*.3-.302,l(b,M)-.004,d),Wt-.026*Math.sin(d*41),ln-.024*Math.sin(d*57));for(let _=0;_<27;_++)for(let m=0;m<h.length-1;m++){const[d,b]=h[m],[M,v]=h[m+1],R=_/27,P=(_+1)/27;e.quad(p(d,b,R),p(M,v,R),p(M,v,P),p(d,b,P),f[(_*3+Math.floor(_/7))%f.length])}for(let _=0;_<8;_++)for(let m=0;m<48;m++){const d=m/48,b=_/4-1,M=(m+1)/48,v=b+.25,R=[o(d,b,l),o(d,v,l),o(M,v,l),o(M,b,l)];a<0&&R.reverse(),e.quad(...R,a===1?"#eee0b9":"#ecdcb5")}for(const _ of[-4.42,4.42])for(let m=0;m<28;m++){const d=a*(.18+m*.261),b=a*(.18+(m+1)*.261);g(d,_,b,_,.009,"#a68e66"),m%2===0&&g(d,_,d,_-Math.sign(_)*.06,.007,"#b29e79")}for(const _ of[a*7.49,a*7.55])g(_,-4.4,_,4.4,.008,"#ab9872")}const t=(a,o,l,c)=>e.quad([a[0]-l,a[1],a[2]],[a[0]+l,a[1],a[2]],[o[0]+l,o[1],o[2]],[o[0]-l,o[1],o[2]],c),n=[[3.76,-.04,4.54],[3.8,-.055,4.72],[3.88,-.45,4.91],[3.98,-.47,5.27]];for(let a=0;a<n.length-1;a++){t(n[a],n[a+1],.155,"#953f34");for(const o of[-.12,.12])t([n[a][0]+o,n[a][1]+.008,n[a][2]+.009],[n[a+1][0]+o,n[a+1][1]+.008,n[a+1][2]+.009],.008,"#c59c5e")}const i=e.mesh(r);return i.castShadow=!0,i}const Gi=[.046,.272,.49],$0=[["#acb28a","#a3af81","#a2a979"],["#a1af8c","#91a47f","#8e9e7a"],["#a6b0a0","#9daaa0","#98a59b"]],J0=["#beb88e","#b5b386","#b1ac82"],ys=(r,e)=>(r-.046)*.66+.024*(e+1),Da=r=>(r=Math.max(0,Math.min(1,r)),r*r*(3-2*r));function xi(r,e,t,n,i,s,a){return a*Math.max(0,1-((r-t)/i)**2-((e-n)/s)**2)}function Q0(r,e,t,n){function i(c,u){const h=c*n;let f=Math.max(xi(h,u,-3.45,-1.5,4.06,2.91,.72),xi(h,u,-.46,-2.2,2.44,2.04,.56),xi(h,u,4.79,-1.16,2.82,2.95,.65),xi(h,u,4.88,2.41,2.43,1.78,.4),xi(h,u,-4.42,2.25,3.01,1.73,.41),xi(h,u,-1.14,2.79,2.23,1.22,.25),xi(h,u,.12,-.07,2.4,2.84,.27));f+=.027*Math.sin(c*3.1+u*1.8)+.019*Math.sin(u*4.7-c*.5);const p=Math.abs(c-e.river(u));return f*=Da((p-.77)/.6),f*=1-.69*Math.exp(-((u-e.path(c))**2)/.18),Math.max(0,f)*Da((xt/2-Math.abs(c)-.22)/.42)*Da((pt/2-Math.abs(u)-.24)/.39)}const s=48,a=35,o=[];for(let c=0;c<=a;c++)for(let u=0;u<=s;u++){const h=(u/s-.5)*xt,f=(c/a-.5)*pt;o.push([h,f,i(h,f)])}function l(c,u,h,f,p){const g=[c,u,h],_=[],m=[];for(let d=0;d<3;d++){const b=g[d],M=g[(d+1)%3],v=b[2]>=f;if(v&&_.push([b[0],ys(b[2],p),b[1]]),v!==M[2]>=f){const R=(f-b[2])/(M[2]-b[2]),P=[b[0]+(M[0]-b[0])*R,ys(f,p),b[1]+(M[1]-b[1])*R];_.push(P),m.push(P)}}if(_.length){for(let d=1;d<_.length-1;d++)r.triangle(_[0],_[d],_[d+1],$0[t][p]);if(m.length===2){const[d,b]=m,M=p?ys(f,p)-.025:0;r.quad(d,b,[b[0],M,b[2]],[d[0],M,d[2]],J0[p])}}}for(let c=0;c<a;c++)for(let u=0;u<s;u++){const h=c*(s+1)+u,f=o[h],p=o[h+1],g=o[h+s+1],_=o[h+s+2],m=Math.max(f[2],p[2],g[2],_[2]);for(let d=0;d<Gi.length&&Gi[d]<=m;d++)l(f,g,_,Gi[d],d),l(f,_,p,Gi[d],d)}return(c,u)=>{const h=i(c,u);for(let f=Gi.length-1;f>=0;f--)if(h>=Gi[f])return ys(h,f);return 0}}const ex=[{grass:["#a9ac72","#bbc183","#acb58a","#c5b882"],field:"#c4ad75",ink:"#929265",water:"#72a5a0",deep:"#648f8e",crest:"#d9e4ce",bank:"#ccbe89"},{grass:["#899d78","#a7b489","#829b74","#b3b887"],field:"#b7ad76",ink:"#7a8d6c",water:"#759f91",deep:"#58867f",crest:"#d2e2cf",bank:"#b5b486"},{grass:["#8d9c8d","#a3ac91","#80988f","#a9a58f"],field:"#aaa18c",ink:"#829687",water:"#76a9b2",deep:"#628c9d",crest:"#d6e4d7",bank:"#b6b5a2"}];function Wi(r,e,t,n,i,s,a,o=!1){const l=Math.max(3,Math.ceil((n-t)/.17)),c=(u,h)=>{const f=e(u)+h*i(u);return o?[f,s,u]:[u,s,f]};for(let u=0;u<l;u++){const h=t+(n-t)*u/l,f=t+(n-t)*(u+1)/l;r.quad(c(h,-1),c(h,1),c(f,1),c(f,-1),a)}}function Ss(r,e,t,n){for(let i=0;i<e.length-1;i++){const s=e[i],a=e[i+1],o=Math.hypot(a[0]-s[0],a[2]-s[2])||1,l=(a[2]-s[2])*t/o,c=(s[0]-a[0])*t/o;r.quad([s[0]+l,s[1],s[2]+c],[a[0]+l,a[1],a[2]+c],[a[0]-l,a[1],a[2]-c],[s[0]-l,s[1],s[2]-c],n)}}function Bl(r,e,t,n,i,s,a,o){const c=o()*6.2,u=[];for(let h=0;h<32;h++){const f=h/32*Math.PI*2,p=1+.052*Math.sin(f*3+c)+.06*Math.sin(f*5+c);u.push([e+n*p*Math.cos(f),s,t+i*p*Math.sin(f)])}for(let h=1;h<=8;h++){const f=h/8,p=(h-1)/8,g=(_,m)=>[e+(_[0]-e)*m,s,t+(_[2]-t)*m];for(let _=0;_<32;_++){const m=u[_],d=u[(_+1)%32];r.quad(g(m,p),g(m,f),g(d,f),g(d,p),a)}}for(let h=0;h<32;h++){const f=u[h],p=u[(h+1)%32];r.quad(f,p,[p[0],s-.023,p[2]],[f[0],s-.023,f[2]],"#ae9d76")}}function tx(r,e,t){const{river:n,path:i}=r,s=ex[e],a=Hs(r.id),o=new Vs,l=r.x===0&&r.z===0,c=l||a()>.5?1:-1,u=Q0(o,r,e,c);o.relief=u;for(let E=0;E<78;E++){const C=(a()-.5)*xt*.96,D=(a()-.5)*pt*.94,k=.086;if(Math.abs(C-n(D))<1.25||Math.abs(D-i(C))<.55)continue;const H=2+Math.floor(a()*4),W=.12+a()*.3;for(let Y=0;Y<H;Y++){const V=[];for(let Q=0;Q<6;Q++)V.push([C+Q/5*W,k,D+Y*.031+.028*Math.sin(Q*.61+E)]);Ss(o,V,.0055,s.ink)}}const h=E=>.61+.085*Math.cos(E*1.03)+.05*Math.sin(E*2.4);Wi(o,n,-pt/2,pt/2,E=>h(E)+.21,.095,s.bank,!0),Wi(o,n,-pt/2,pt/2,E=>h(E)+.125,.105,"#e3d6ab",!0),Wi(o,n,-pt/2,pt/2,E=>h(E)+.065,.119,s.deep,!0),Wi(o,n,-pt/2,pt/2,h,.126,s.water,!0);for(let E=0;E<65;E++){const C=(a()-.5)*(pt-.3),D=(a()-.5)*h(C)*1.75,k=.08+a()*.23,H=[];for(let Y=0;Y<6;Y++){const V=C+k*Y/5;H.push([n(V)+D+.026*Math.sin(Y*Math.PI*.2),.135,V])}const W=["#537b79","#4c746f","#517a8e"][e];Ss(o,H,.009+a()*.0065,E%3?s.crest:W)}let f=-xt/2,p=xt/2;for(let E=0;E<22;E++){const C=(f+p)/2;C<n(i(C))?f=C:p=C}const g=(f+p)/2,_=i(g),m=.11;Wi(o,i,-xt/2,xt/2,E=>.32+.035*Math.cos(E*1.4),m,"#9e825d"),Wi(o,i,-xt/2,xt/2,E=>.283+.035*Math.cos(E*1.4),m+.007,"#c7ab7c");const d=-Math.atan((i(g+.08)-i(g-.08))/.16);for(const E of[-1,1]){const C=(D,k)=>{const H=1.6+.61*D,W=Math.cos(d),Y=Math.sin(d),V=.39-.105*D,Q=g+E*H*W+k*V*Y,oe=It.lerp(_-E*H*Y,i(Q),D)+k*V*W,ye=D*D*(3-2*D),Ne=It.lerp(.487-u(Q,oe),.132,ye);return[Q,Ne,oe]};for(let D=0;D<8;D++){const k=D/8,H=(D+1)/8;o.quad(C(k,-1),C(k,1),C(H,1),C(H,-1),D<2?"#ba9869":"#c7ab7c")}}for(let E=0;E<78;E++){const C=(a()-.5)*xt,D=i(C)+(a()-.5)*.46;Math.abs(C-n(D))<.86||Ss(o,[[C,m+.013,D],[C+.032+a()*.035,m+.013,D-.018]],.008,"#ab9168")}const b=[];function M(E,C,D,k=1,H=0,W={}){b.push({name:E,x:C,z:D,scale:k,yaw:H,base:.09,angle:1,velocity:0,target:1,...W})}M("Bridge",g,_,1.17,-Math.atan((i(g+.08)-i(g-.08))/.16),{base:.085});const v=[[-4.68,-3.02,.94,.16],[-.7,-3.56,1.29,-.1],[4.22,-3.5,.83,-.23]];for(const[E,C,D,k]of v)M("Ridge",E*c,C,D*(l?1:.83+a()*.3),k,{radius:1.95*D});for(const[E,C,D,k,H]of[[-4.62,-2.28,1.03,"GreenHill",.09],[-1.77,-2.71,.98,"GreenHill",-.16],[.35,-2.23,.86,"GoldenHill",.1],[4.8,-2.29,.91,"GreenHill",.12],[-5.26,-.95,.62,"GoldenHill",-.1],[5.32,1.18,.54,"GoldenHill",.16],[-3.33,3.08,.48,"GreenHill",-.27],[5.34,3.39,.48,"GreenHill",.21]])M(k,E*c,C,D,H,{base:.06});const R=[[-3.88,-.82,1.08,-.18],[-1.8,-1.39,.76,-.11],[-.4,-1.13,.58,.1],[3.38,-1.87,.67,.16],[4.77,-.54,.9,-.18],[5.93,-1.52,.56,.23]];for(let E=0;E<R.length;E++){let[C,D,k,H]=R[E];if(C*=c,e===1&&E%2===0)continue;Math.abs(C-n(D))<1.15&&(C+=C<n(D)?-1.16:1.16);const W=(E===0?.16:.095)+.015*(E%3);Bl(o,C,D+.01,k*1.24,k*.74,W-.075,s.grass[(E+1)%4],a),Bl(o,C,D,k*1.08,k*.63,W,s.grass[(E+2)%4],a),M(["HeroChalet","HouseRose","HouseOchre","HouseCream","HouseRose","HouseOchre"][E],C,D,k,H+(E===0?.025:.12),{radius:k*.82,base:W+.018});const Y=i(C+.27);if(Math.sign(C-n(D))===Math.sign(C-n(Y))){const V=[];for(let Q=0;Q<=12;Q++){const oe=Q/12;V.push([C+.27*oe+.18*Math.sin(oe*Math.PI),.128+(W-.119)*Math.max(0,1-oe*2.5),D+.25*k+(Y-D-.25*k)*oe])}Ss(o,V,.12*k,"#c6aa7d")}}M("Spruce",-5.68*c,2.1,1.24,.22,{tint:"#e8efda"}),M("Spruce",-6.04*c,1.6,.97,-.32,{tint:"#c5d8c7"}),M("HouseCream",5.6*c,-2.26,.66,.17,{base:.1});const P=[[-6.15,-1.55,5,.74],[-4.02,-2.22,4,.59],[-2.3,-2.32,4,.71],[.8,-2.86,4,.65],[5.83,-2.36,5,.6],[-5.79,1.7,3,.83],[-3.88,2.82,3,.6],[4.86,2.48,4,.64],[5.98,.77,2,.63],[-.48,3.16,2,.49]];for(const[E,C,D,k]of P)for(let H=0;H<D+(e===1?2:0);H++){const W=(H+1)*2.4+a()*.55,Y=H===0?0:.36+.38*a(),V=E*c+Math.cos(W)*Y,Q=C+Math.sin(W)*Y*.85;if(Math.abs(V-n(Q))<.8||Math.abs(Q-i(V))<.46)continue;const oe=e===1?a()>.09:C<0?a()>.17:a()>.46;M(oe?"Spruce":"Broadleaf",V,Q,k*(.7+.56*a()),.1+(a()-.5)*.8,{tint:["#fffaeb","#fff5d8","#dce7dc","#fff9f1"][Math.floor(a()*4)]})}for(const[E,C]of[[-4.33,.48],[-.65,-.46],[3.2,.48],[6.15,-.45]])M("Lantern",E,i(E)+C,.73,.05,{base:.105,radius:.27});let L=0;function F(E,C,D,k){for(let H=0;H<k;H++){const W=H===0?0:.22+.43*a(),Y=H*2.45+a()*.63,V=E+Math.cos(Y)*W,Q=C+Math.sin(Y)*W*.59;Math.abs(V)>7.2||Math.abs(Q)>4.13||Math.abs(V-n(Q))<.75||Math.abs(Q-i(V))<.36||M(["Bilberry","Wheat","Fern","Bilberry","Wheat"][L++%5],V,Q,D*(.66+a()*.48),.1+(a()-.5)*.82,{base:.085})}}for(const[E,C,D,k]of[[-6.16,3.39,.96,6],[-4.87,3.18,.91,7],[-2.4,3.55,.82,7],[-.75,3.62,.98,5],[4.45,3.48,.95,6],[5.91,3.38,1.03,7],[-6.06,.28,.87,4],[-4.48,-1.31,.7,4],[-2.3,-.68,.71,4],[5.68,.55,.83,5],[-.57,-2,.69,4],[3.7,-2.16,.6,4]])F(E*c,C,D,k);for(let E=0;E<11;E++){const C=-3.55+E*.66,D=E%2?1:-1;F(n(C)+D*(1.02+.16*a()),C,.6+a()*.2,2)}for(let E=0;E<145;E++){const C=(a()-.5)*(xt-.6),D=(a()-.5)*(pt-.55);if(Math.abs(C-n(D))<.88||Math.abs(D-i(C))<.44)continue;const k=.07+.12*a(),H=E%5?"#78845d":"#b69b53",W=.09;for(let Y=-1;Y<=1;Y++){const V=Y*.055;o.triangle([C+V*.25,W,D],[C+V*.27+.026,W,D],[C+V,W+k*(Y===0?1:.65),D-.01],H)}if(E%3===0){const Y=E%4?"#efc884":"#d88259";o.quad([C-.033,W+k,D],[C,W+k+.034,D],[C+.047,W+k+.006,D],[C+.009,W+k-.026,D],Y)}}const S=[[-4.9,-.01,1.25],[-2.75,-.43,1.02],[4.45,-.18,.94],[4.78,2.03,.98]];for(const[E,C,D]of S)if(!(Math.abs(E*c-n(C))<1.2)){for(let k=0;k<=4;k++){const H=E*c+k*D/4,W=C-.1*k/4;o.quad([H-.025,.08,W],[H+.025,.08,W],[H+.021,.354+k%2*.015,W],[H-.026,.353,W],"#9e815b")}for(const k of[.17,.27])o.quad([E*c,k,C+.01],[E*c+D,k,C-.09],[E*c+D,k+.034,C-.09],[E*c,k+.034,C+.01],"#c6ac7b")}const T=b.filter(E=>E.name.startsWith("House")||E.name==="HeroChalet"||E.name==="Tower"||E.name==="Ridge"||E.name==="Spruce"||E.name==="Broadleaf");for(const E of T){const C=E.name.startsWith("House")||E.name==="Tower"||E.name==="HeroChalet";E.rx=(E.name==="HeroChalet"?1.26:C?.72:E.name==="Ridge"?1.62:.105)*E.scale+.12,E.rz=(E.name==="HeroChalet"?.63:C?.29:E.name==="Ridge"?.26:.1)*E.scale+.095}for(const E of b)E.base+=u(E.x,E.z);return{mesh:o.mesh(t),props:b,solids:T,relief:u,bridge:{x:g,z:_},tile:r}}function nx(r){const e=new c0({canvas:r,antialias:!0,alpha:!1,powerPreference:"high-performance"});e.outputColorSpace=Et,e.toneMapping=Wl,e.toneMappingExposure=1.02,e.shadowMap.enabled=!0,e.shadowMap.type=Oo,e.shadowMap.autoUpdate=!1,e.shadowMap.needsUpdate=!0;const t=new Fc;t.background=new ze("#252b28");const n=new zt(35,1,.3,115),i=new Co(16768941,2.06);i.position.set(-9.8,10.5,3.6),i.castShadow=!0,Object.assign(i.shadow.camera,{left:-10,right:10,top:9,bottom:-9,near:.5,far:38}),i.shadow.mapSize.set(1536,1536),i.shadow.normalBias=.021,i.shadow.bias=-16e-5,i.shadow.radius=3.6,t.add(i,i.target);const s=new ld(15266543,12429184,1.7),a=new Co(12771554,.82);a.position.set(3,5,-7),t.add(s,a);const o=new Vr({color:"#596153",roughness:1});o.onBeforeCompile=te=>{te.vertexShader=`varying vec2 tableUV;
`+te.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
 tableUV = position.xy;`),te.fragmentShader=`varying vec2 tableUV;
`+te.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>
      float fall=exp(-dot(tableUV*vec2(.071,.106),tableUV*vec2(.071,.106)));
      float fibres=fract(sin(dot(floor(tableUV*210.),vec2(12.9898,78.233)))*43758.5453);
      diffuseColor.rgb*=.225+.54*fall+.018*fibres;
      diffuseColor.rgb*=mix(vec3(.83,.96,.98),vec3(1.19,.99,.80),fall);
      vec2 lightSpot=(tableUV-vec2(-4.,3.8))*vec2(.077,.113);
      float warm=exp(-dot(lightSpot,lightSpot));
      diffuseColor.rgb*=mix(vec3(1.),vec3(1.38,1.06,.72),warm);`)};const l=new At(new kn(160,160),o);l.rotation.x=-Math.PI/2,l.position.y=-.52,l.receiveShadow=!0,t.add(l);const c=document.createElement("canvas");c.width=c.height=128;const u=c.getContext("2d"),h=u.createRadialGradient(64,64,12,64,64,64);h.addColorStop(0,"rgba(15,19,17,.83)"),h.addColorStop(.67,"rgba(15,19,17,.60)"),h.addColorStop(1,"rgba(15,19,17,0)"),u.fillStyle=h,u.fillRect(0,0,128,128);const f=new Fs(c),p=new At(new kn(23,13.5),new dn({map:f,transparent:!0,depthWrite:!1}));p.rotation.x=-Math.PI/2,p.position.set(.3,-.515,.35),t.add(p);const g=new ci(8,8,{type:e.extensions.has("EXT_color_buffer_float")?sr:mn,samples:Math.min(4,e.capabilities.maxSamples),depthBuffer:!0});g.texture.minFilter=g.texture.magFilter=Xt,g.depthTexture=new Jo(8,8,oi);const _=new Wn({uniforms:{tColor:{value:g.texture},tDepth:{value:g.depthTexture},texel:{value:new Be},focus:{value:21},projectionInv:{value:new Xe},pixelsPerUnit:{value:1},blurGain:{value:1}},vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",fragmentShader:`uniform sampler2D tColor,tDepth;uniform vec2 texel;uniform float focus,blurGain,pixelsPerUnit;uniform mat4 projectionInv;varying vec2 vUv;
      vec3 viewPoint(vec2 uv){
        vec4 h=projectionInv*vec4(uv*2.-1.,texture2D(tDepth,uv).x*2.-1.,1.);
        return h.xyz/h.w;
      }
      float contact(vec3 p,vec3 n,vec2 offset){
        vec3 v=viewPoint(vUv+offset)-p; float len=length(v);
        return max(dot(n,v)/(len+.001)-.095,0.)*(1.-smoothstep(.04,.68,len));
      }
      void main(){vec3 p=viewPoint(vUv);float depth=-p.z;
        vec3 normal=normalize(cross(dFdx(p),dFdy(p)));vec2 rad=texel*clamp(.37*pixelsPerUnit/max(depth,.1),2.,21.);
        float ao=contact(p,normal,rad*vec2(.93,.36))+contact(p,normal,rad*vec2(-.83,.52))
          +contact(p,normal,rad*vec2(.09,-.91))+contact(p,normal,rad*vec2(-.36,-.24))
          +contact(p,normal,rad*vec2(.42,-.20))+contact(p,normal,rad*vec2(.04,.51));
        float coc=smoothstep(.70,6.25,abs(depth-focus))*4.1*blurGain;
        coc*=mix(.77,1.0,smoothstep(-.8,.1,depth-focus));
        vec2 d=texel*coc; vec3 col=texture2D(tColor,vUv).rgb*.24;
        col+=(texture2D(tColor,vUv+vec2(.87,.35)*d).rgb+texture2D(tColor,vUv+vec2(-.87,-.35)*d).rgb
          +texture2D(tColor,vUv+vec2(-.22,.98)*d).rgb+texture2D(tColor,vUv+vec2(.22,-.98)*d).rgb)*.13;
        col+=(texture2D(tColor,vUv+vec2(.67,-.63)*d).rgb+texture2D(tColor,vUv+vec2(-.67,.63)*d).rgb)*.12;
        col*=vec3(1.)-clamp(ao*.155,0.,.38)*vec3(1.,.93,.76);
        col*=1.-.078*smoothstep(.19,.73,distance(vUv,vec2(.52,.48)));
        gl_FragColor=vec4(col,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`}),m=new Fc;m.add(new At(new kn(2,2),_));const d=new zs(-1,1,1,-1,0,1);let b=1,M=1,v="atlas",R=1,P=0,L=0,F=1,S=1,T=0,E=0,C=1/60;const D=new U(.345,.492,.799).normalize(),k=new U(D.z,0,-D.x).normalize(),H=new U().crossVectors(D,k),W=new U,Y=new U(0,.72,.26),V=[[-7.93,-.46,-4.84],[-7.93,-.46,4.84],[7.93,-.46,-4.84],[7.93,-.46,4.84],[-.8,4.56,-3.56],[-4.65,3.7,-2.99],[4.22,3.4,-3.5],[3.97,-.47,5.28]].map(te=>{const ke=new U(...te).sub(Y);return[ke.dot(k),ke.dot(H),ke.dot(D)]});let Q=20,oe=0,ye=0,Ne=0;function nt(te){const ke=Math.tan(It.degToRad(n.fov)*.5);function it(Se){let me=10,We=-10,xe=10,Le=-10;for(const[lt,ft,A]of V){const x=1/(ke*(Se-A));me=Math.min(me,lt*x/te),We=Math.max(We,lt*x/te),xe=Math.min(xe,ft*x),Le=Math.max(Le,ft*x)}return{l:me,r:We,b:xe,t:Le}}let w=9,Ae=180;for(let Se=0;Se<18;Se++){const me=(w+Ae)/2,We=it(me);We.r-We.l>1.84||We.t-We.b>1.81?w=me:Ae=me}Q=Ae;const _e=it(Ae);oe=(_e.l+_e.r)/2,ye=(_e.t+_e.b)/2-.018}function Ke(){const te=r.getBoundingClientRect();b=Math.max(1,Math.round(te.width)),M=Math.max(1,Math.round(te.height)),F=Math.min(window.devicePixelRatio||1,1.35,Math.sqrt(18e5/(b*M)))*S,nt(b/M),e.setPixelRatio(F),e.setSize(b,M,!1),g.setSize(Math.round(b*F),Math.round(M*F)),_.uniforms.texel.value.set(1/g.width,1/g.height)}function Ze(te){te<.002||te>.09||document.hidden||(C+=(te-C)*(1-Math.exp(-te*2.1)),T=C>.0194?T+te:Math.max(0,T-2*te),E=C<.01725?E+te:0,T>2.4&&S>.721?(S=Math.max(.72,S-.1),T=E=0,Ke()):E>8&&S<.999&&(S=Math.min(1,S+.07),T=E=0,Ke()))}function $(te,ke,it){const w=b/M,Ae=v==="trail"?1:0,_e=1-Math.exp(-it*5.2);Ne+=(Ae-Ne)*(1-Math.exp(-it*5.7));const Se=Ne*Ne*(3-2*Ne),me=It.lerp(.095,.94,Se);P+=(te*me-P)*_e,L+=(ke*me-L)*_e,W.set(P,It.lerp(Y.y,.93,Se),L+Y.z*(1-Se));const We=Math.tan(It.degToRad(n.fov)*.5),xe=Math.max(4.45,(w<.9?6.32:8.6)/w)/(2*We),Le=It.lerp(Q,xe,Se)/R;n.aspect=w,n.position.copy(W).addScaledVector(D,Le),n.lookAt(W),n.updateProjectionMatrix(),n.projectionMatrix.elements[8]+=oe*(1-Se),n.projectionMatrix.elements[9]+=ye*(1-Se),n.projectionMatrixInverse.copy(n.projectionMatrix).invert(),n.updateMatrixWorld(),_.uniforms.projectionInv.value.copy(n.projectionMatrixInverse),_.uniforms.pixelsPerUnit.value=g.height/(2*We),_.uniforms.focus.value=Le-It.lerp(.48,0,Se),_.uniforms.blurGain.value=(1+Se*.31)*Math.min(1.4,F)}function ee(){e.setRenderTarget(g),e.render(t,n);const te={drawCalls:e.info.render.calls,triangles:e.info.render.triangles};return e.setRenderTarget(null),e.render(m,d),te}function de(te){i.color.setHex([16766359,16768935,16759418][te]),i.intensity=[2.62,2.3,1.58][te],s.color.setHex([13229295,13755625,10468335][te]),s.intensity=[1.37,1.31,.95][te],a.color.setHex([12771554,13821390,10148607][te]),a.intensity=[1.01,.88,1.24][te],o.color.set(["#475449","#435548","#374951"][te]),e.shadowMap.needsUpdate=!0}const Ee=new ResizeObserver(Ke);return Ee.observe(r),Ke(),{scene:t,renderer:e,camera:n,pose:$,render:ee,theme:de,observeFrame:Ze,getResolution:()=>S,setView(te){v=te==="trail"?"trail":"atlas"},setZoom(te){R=It.clamp(Number(te)||1,.7,1.5)},dispose(){Ee.disconnect(),g.depthTexture.dispose(),g.dispose(),_.dispose(),f.dispose(),e.dispose()}}}function Gs(r,e,t,n,i,s){const a=e.map(([o,l])=>new Be(o,l));for(const[o,l,c]of Os.triangulateShape(a,[])){const u=[e[o],e[l],e[c]];r.triangle(...u.map(([h,f])=>[h,f,t]),i),n>.015&&r.triangle(...u.reverse().map(([h,f])=>[h,f,t-n]),i)}if(n>0)for(let o=0;o<e.length;o++){const l=e[o],c=e[(o+1)%e.length];r.quad([...l,t],[...c,t],[...c,t-n],[...l,t-n],s)}}function Mn(r,e,t,n,i,s,a,o){const l=Math.hypot(n-e,i-t)||1,c=(i-t)*s/l,u=(e-n)*s/l;r.quad([e+c,t+u,a],[n+c,i+u,a],[n-c,i-u,a],[e-c,t-u,a],o)}function yr(r,e,t,n,i,s,a,o,l=!0){const c=Math.hypot(n,i)||1,u=i*s/c,h=-n*s/c,f=[[e,t],[e+n*.21+u*.7,t+i*.21+h*.7],[e+n*.49+u,t+i*.49+h],[e+n*.74+u*.68,t+i*.74+h*.68],[e+n,t+i],[e+n*.62-u*.79,t+i*.62-h*.79],[e+n*.28-u*.87,t+i*.28-h*.87]];if(Gs(r,f,a,.012,o[0],o[2]),r.triangle([e,t,a+.002],[e+n*.49+u,t+i*.49+h,a+.002],[e+n,t+i,a+.002],o[1]),l){Mn(r,e+.07*n,t+.07*i,e+n*.88,t+i*.88,.005,a+.004,o[2]);for(let p=1;p<=2;p++){const g=.18*p;Mn(r,e+n*g,t+i*g,e+n*(g+.18)+u*.64,t+i*(g+.18)+h*.64,.003,a+.004,o[2])}}}function ix(r,e,t,n,i,s,a){const o=Array.from({length:8},(l,c)=>[e+Math.cos(c/8*6.283)*n,t+Math.sin(c/8*6.283)*i]);Gs(r,o,s,.009,a,"#d7a56e")}function Ua(r,e){const t=new Vs,n=Hs(81+r),i=[["#536a50","#697c53","#aaad73"],["#345f54","#427364","#a2ac78"],["#879566","#9fa46e","#c6b67d"],["#747d53","#91945c","#c3b67e"]];if(r===0){for(let s=0;s<7;s++){const a=(s%4-1.5)*.23+(n()-.5)*.08,o=a*.42,l=.3+n()*.27,c=.13+n()*.06,u=-.17+s*.021,h=[];for(let p=0;p<32;p++){const g=p/32*6.283,_=1+.047*Math.sin(g*7+s)+.026*Math.sin(g*12);h.push([a+c*Math.cos(g)*_+o*(Math.sin(g)+1)*.5,.015+l*.5+l*.5*Math.sin(g)*_])}const f=i[(s+1)%4];Gs(t,h,u,.028,f[0],f[2]),Mn(t,a,.04,a+o,l*.9,.007,u+.004,f[2]);for(let p=1;p<=4;p++){const g=p*.155;for(const _ of[-1,1])Mn(t,a+o*g,.02+l*g,a+o*(g+.18)+_*c*(.81-g*.45),l*(g+.21),.0045,u+.006,f[2])}}for(let s=0;s<10;s++){const a=(s%5-2)*.172+(n()-.5)*.11,o=.014+(s<5?.04:0),l=.22+n()*.27,c=a*1.15+(n()-.5)*.21;yr(t,a,o,c,l,.074+n()*.045,-.11+s*.016,i[s%4])}for(let s=0;s<5;s++){const a=(s-2)*.12,o=a*1.66,l=.29+s%3*.075;Mn(t,a,.04,o,l,.01,.14,"#7d6d47");for(let c=1;c<4;c++){const u=It.lerp(a,o,c/4),h=.04+(l-.04)*c/4,f=(c%2-.5)*.12;Mn(t,u,h,u+f,h+.055,.006,.145,"#a78c50"),ix(t,u+f,h+.064,.025,.033,.153,c%2?"#ad5038":"#cf7951")}}}else if(r===1)for(let s=0;s<9;s++){const a=(s-4)*.048,o=(s-4)*.12+(n()-.5)*.04,l=.36+(1-Math.abs(s-4)/5)*.38,c=s*.019-.1,u=i[s%4];Mn(t,a,0,a+o,l,.011,c,u[2]);for(let h=1;h<=5;h++){const f=h/6,p=a+o*f,g=l*f;for(const _ of[-1,1])yr(t,p,g,o*.2+_*(1-f*.7)*.155,l*.14+(1-f)*.035,.032*(1-f*.45),c+.005,u,!1)}yr(t,a+o*.8,l*.8,o*.3,l*.28,.03,c+.007,u,!1)}else{const s=[["#ac8550","#bd9857","#debd7b"],["#ac984e","#bca960","#e0c98b"],["#879168","#959f71","#c5bf8a"]];for(let a=0;a<17;a++){const o=(n()-.5)*.75,l=.018,c=.16+n()*.27,u=o*.65+(n()-.5)*.2;yr(t,o,l,u,c,.022+n()*.023,a*.01-.11,s[a%3],!1)}for(let a=0;a<6;a++){const o=(a-2.5)*.077,l=(a-2.5)*.12,c=.35+.16*n(),u=.1+a*.006;Mn(t,o,.02,o+l,c,.008,u,"#9b814c");for(let h=0;h<5;h++){const f=.62+h*.07;for(const p of[-1,1])yr(t,o+l*f,c*f,l*.12+p*.038,.07,.014,u+.005,s[(a+1)%3],!1)}}}return t.mesh(e)}function zl(r,e){const t=new Vs,n=Hs(503+r),i=r?["#aa9a5f","#b8a46b","#c2ac6d","#ad985e"]:["#5e8072","#789179","#8b9b77","#75896a"];for(let s=0;s<3;s++){const a=[2.42,1.84,1.47][s],o=[-.1,.62,-.55][s],l=[1.22,.79,.45][s],c=(s-1)*.13,u=[[-a+o,.008],[a+o,.008]],h=f=>.025+l*Math.max(0,1-f*f)**.83*(.84+.16*Math.sin(f*4+s*2)+.055*Math.sin(f*10+2.2*s)+.028*Math.sin(f*19-s));for(let f=0;f<=46;f++){const p=1-f/23;u.push([o+p*a,h(p)])}if(Gs(t,u,c,.035,i[s],r?"#d8c590":"#b4bd8f"),s===2)for(let f=0;f<85;f++){const p=n()*1.92-.96,g=n()*Math.max(0,h(p)-.09),_=o+p*a;for(let m=0;m<3;m++)Mn(t,_+m*.036,g,_+m*.036+.025,g+.045+m*.007,.005,c+.004,r?"#927f50":"#6f8569")}for(let f=0;f<31;f++){if((f+s*2)%7<2)continue;const p=-.91+f*.06,g=p+.029;Mn(t,o+p*a,h(p)-.065,o+g*a,h(g)-.068,.007,c+.006,r?"#d2bd82":"#a0b397")}}return t.mesh(e)}function rx(r){return[["Bilberry",Ua(0,r)],["Fern",Ua(1,r)],["Wheat",Ua(2,r)],["GreenHill",zl(0,r)],["GoldenHill",zl(1,r)]].map(([e,t])=>(t.name=e,t))}function sx(r,e,t){const s=(S,T)=>{const E=Math.max(1,Math.ceil(S.distanceTo(T)/.13));for(let C=1;C<=E;C++)if(t(S.x+(T.x-S.x)*C/E,S.y+(T.y-S.y)*C/E))return!1;return!0};if(s(r,e))return[e];const a=Math.min(r.x,e.x)-1.75,o=Math.min(r.y,e.y)-1.75,l=Math.ceil((Math.abs(e.x-r.x)+2*1.75)/.31)+1,c=Math.ceil((Math.abs(e.y-r.y)+2*1.75)/.31)+1,u=l*c,h=new Uint8Array(u),f=Array(u);let p=-1,g=-1,_=1/0,m=1/0;for(let S=0;S<u;S++){const T=new Be(a+S%l*.31,o+Math.floor(S/l)*.31);if(f[S]=T,t(T.x,T.y))continue;h[S]=1;const E=T.distanceToSquared(r),C=T.distanceToSquared(e);E<_&&(_=E,p=S),C<m&&(m=C,g=S)}if(p<0||g<0)return[];const d=[p],b=new Uint8Array(u),M=new Int32Array(u).fill(-1),v=new Float32Array(u).fill(1/0);v[p]=0,b[p]=1;const R=S=>v[S]+f[S].distanceTo(f[g]);for(;d.length;){let S=0;for(let E=1;E<d.length;E++)R(d[E])<R(d[S])&&(S=E);const T=d.splice(S,1)[0];if(T===g)break;b[T]=0;for(let E=-1;E<=1;E++)for(let C=-1;C<=1;C++){if(!C&&!E)continue;const D=T%l+C,k=Math.floor(T/l)+E,H=k*l+D;if(D<0||k<0||D>=l||k>=c||!h[H]||C&&E&&(!h[T+C]||!h[T+E*l]))continue;const W=v[T]+.31*(C&&E?1.414214:1);W>=v[H]-1e-5||(M[H]=T,v[H]=W,b[H]||(d.push(H),b[H]=1))}}if(g!==p&&M[g]<0)return[];const P=[];for(let S=g;S!==p;S=M[S])P.push(f[S]);P.reverse(),!t(e.x,e.y)&&s(f[g],e)&&P.push(e);const L=[];let F=r;for(let S=0;S<P.length;){let T=S;for(;T<P.length-1&&s(F,P[T+1]);)T++;L.push(P[T]),F=P[T],S=T+1}return L}function Cs(r){var e;return((e=globalThis.atlasEmbeddedAssets)==null?void 0:e[r])??"./"+r}const cn=It.clamp,kl=[713,5683,9219];function ax(){const r=document.createElement("canvas");r.width=r.height=96;const e=r.getContext("2d"),t=e.createRadialGradient(48,48,0,48,48,48);t.addColorStop(0,"rgba(255,237,186,.97)"),t.addColorStop(.12,"rgba(255,200,106,.86)"),t.addColorStop(.26,"rgba(255,164,67,.38)"),t.addColorStop(.57,"rgba(255,151,58,.14)"),t.addColorStop(1,"rgba(255,151,58,0)"),e.fillStyle=t,e.fillRect(0,0,96,96);const n=new Fs(r);return n.colorSpace=Et,n}async function ox(r,{onFold:e=()=>{},onStep:t=()=>{},onChange:n=()=>{}}={}){const i=nx(r),{scene:s,renderer:a,camera:o}=i,l=new Eu,[c,u,h]=await Promise.all([new l0().loadAsync(Cs("models/atlas.glb")),l.loadAsync(Cs("art/paper-fiber.webp")).catch(()=>j0()),l.loadAsync(Cs("art/atlas-print.webp")).catch(()=>null)]);u.colorSpace=Et,u.wrapS=u.wrapT=Gn,u.repeat.set(.38,.38),h&&(h.wrapS=h.wrapT=Gn);const f=Ol(u,!1,h),p=Ol(u,!0,h),g=Z0(f);s.add(g);const _=new Map,m=new _t,d=new ze,b=c.scene.getObjectByName("Traveler").clone();b.castShadow=!0,b.receiveShadow=!0,s.add(b);for(const B of[...c.scene.children,...rx(f)]){if(!B.isMesh||B.name==="Traveler")continue;let N=B.material;if(B.name==="HeroChalet"){const ne=B.geometry.getAttribute("position"),Pe=B.geometry.getAttribute("color"),De=new Float32Array(ne.count),Ve=["#e7a342","#ffe6a0","#ffd477","#f7bd60"].map(ue=>new ze(ue));for(let ue=0;ue<ne.count;ue++){const je=Math.abs(ne.getZ(ue)-.565)<.009,Qe=Math.abs(Math.abs(ne.getX(ue))-1.11)<.014;(je||Qe)&&Ve.some(ge=>Math.hypot(ge.r-Pe.getX(ue),ge.g-Pe.getY(ue),ge.b-Pe.getZ(ue))<.035)&&(De[ue]=1)}B.geometry.setAttribute("windowInk",new Nt(De,1)),N=B.material.clone(),N.onBeforeCompile=ue=>{ue.vertexShader=`attribute float windowInk; varying float litPane;
`+ue.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
 litPane=windowInk;`),ue.fragmentShader=`varying float litPane;
`+ue.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
 totalEmissiveRadiance+=litPane*vec3(.68,.30,.065);`)}}const j=new bo(B.geometry,N,220);j.frustumCulled=!1,j.count=0,j.castShadow=!0,j.receiveShadow=!0,j.instanceMatrix.setUsage(Ch),s.add(j),_.set(B.name,j)}const M=new dn({map:ax(),transparent:!0,depthWrite:!1,blending:Na,side:$t}),v=new bo(new kn(1,1),M,32);v.frustumCulled=!1,v.count=0,s.add(v);const R=new Tu(16756563,1.85,3.2,2);s.add(R);const P=document.createElement("canvas");P.width=P.height=64;const L=P.getContext("2d"),F=L.createRadialGradient(32,32,3,32,32,32);F.addColorStop(0,"rgba(31,37,32,.55)"),F.addColorStop(.6,"rgba(45,49,38,.22)"),F.addColorStop(1,"rgba(45,49,38,0)"),L.fillStyle=F,L.fillRect(0,0,64,64);const S=new At(new kn(.66,.32),new dn({map:new Fs(P),transparent:!0,depthWrite:!1}));S.rotation.x=-Math.PI/2,s.add(S),b.geometry.computeBoundingBox();const T=b.geometry.boundingBox.min.y*1.68,E=new At(new Qo(.095,.113,36),new dn({color:"#9a5a39",transparent:!0,opacity:.8,side:$t,depthWrite:!1}));E.rotation.x=-Math.PI/2,E.visible=!1,s.add(E);let C=0,D=Fl(kl[0]),k=1,H=0,W=0,Y=!1,V=!1,Q=!1,oe=!1,ye=0,Ne=0,nt=0,Ke=!1,Ze=0,$=new Set(["0,0"]),ee=performance.now();const de=new Map,Ee=new Set,te=new Be,ke=new Be,it=new Be(1,0),w=new Be(-2.26,1.99),Ae=new Be,_e=[],Se=new Be,me=new bd,We=new U,xe=new ti(new U(0,1,0),-.38),Le=new U,lt=[],ft={drawCalls:0,triangles:0};let A=0,x=0,G=0,Z=.2,J=!0;const K=(B,N,j)=>B+(N-B)*j;function Re(){const B=(Ve,ue,je)=>[Math.floor((Ve-ue)/je+.5),Math.floor((Ve+ue)/je+.5)],[N,j]=B(Ae.x,Wt-.23,xt),[ne,Pe]=B(Ae.y,ln-.22,pt),De=new Set;for(let Ve=ne;Ve<=Pe;Ve++)for(let ue=N;ue<=j;ue++){const je=ue+","+Ve;if(De.add(je),!de.has(je)){const Qe=tx(D(ue,Ve),C,p);if(_.has("RiverFold"))for(let ge=0;ge<8;ge++){const at=(ge-3.5)*1.08;Qe.props.push({name:"RiverFold",x:Qe.tile.river(at)+Math.sin(ge*2.4)*.32,z:at,scale:.71+.18*(ge%3),yaw:Math.sin(ge*.8)*.25,base:.135,angle:1,target:1,velocity:0})}if(H>.2)for(const ge of Qe.props){const at=ue*xt+ge.x-Ae.x,bt=Ve*pt+ge.z-Ae.y;(Math.abs(at)>Wt-.24||Math.abs(bt)>ln-.24)&&(ge.angle=ge.target=0)}de.set(je,Qe),s.add(Qe.mesh),G++}}for(const[Ve,ue]of de)De.has(Ve)||(ue.mesh.geometry.dispose(),s.remove(ue.mesh),de.delete(Ve))}function ae(B,N){return de.get(Math.floor(B/xt+.5)+","+Math.floor(N/pt+.5))}function Te(B,N,j){const ne=ae(B,N);if(!ne)return!1;const Pe=B-ne.tile.x*xt,De=N-ne.tile.z*pt;for(const Ve of ne.solids){if(Ve.angle<.45)continue;const ue=(Pe-Ve.x)/Ve.rx,je=(De-Ve.z)/Ve.rz,Qe=ue*ue+je*je;if(!(Qe>=1)){if(j){const ge=1/Math.sqrt(Math.max(1e-5,Qe))-1;j.x+=ue*Ve.rx*ge,j.y+=je*Ve.rz*ge}return!0}}return!1}function we(B,N){const j=ae(B,N);let ne=.006;if(j){const Pe=B-j.tile.x*xt,De=N-j.tile.z*pt,Ve=1-It.smoothstep(Math.abs(De-j.tile.path(Pe)),.272,.36),ue=1-It.smoothstep(Math.abs(Pe-j.tile.river(De)),.61,.78);ne+=j.relief(Pe,De)+Math.max(.112*Ve,.12*ue);const je=B-j.tile.x*xt-j.bridge.x,Qe=N-j.tile.z*pt-j.bridge.z,ge=-Math.atan((j.tile.path(j.bridge.x+.08)-j.tile.path(j.bridge.x-.08))/.16),at=je*Math.cos(ge)-Qe*Math.sin(ge),bt=je*Math.sin(ge)+Qe*Math.cos(ge);if(Math.abs(at)<2.22&&Math.abs(bt)<.57){const qn=1-It.smoothstep(Math.abs(bt),.4,.57),Ti=1-It.smoothstep(Math.abs(at),1.62,2.2),Yn=Xi(j.tile.x*xt+j.bridge.x-Ae.x,j.tile.z*pt+j.bridge.z-Ae.y)+.085+1.17*(.34+.23*Math.max(0,1-(at/1.626)**2));ne=K(ne,Yn-Xi(B-Ae.x,N-Ae.y),qn*Ti*cn(j.props[0].angle,0,1))}}return Xi(B-Ae.x,N-Ae.y)+ne}function re(){n({distance:H,page:k,heading:ye,moving:Ke,region:C,x:w.x,z:w.y,folds:A})}function pe(B,N,j,ne){const Pe=v.count;Pe>=32||(m.position.set(B,N,j),m.quaternion.copy(o.quaternion),m.scale.setScalar(ne),m.updateMatrix(),v.setMatrixAt(Pe,m.matrix),v.count++)}function Ie(B){const N=w.x-Ae.x,j=w.y-Ae.y;i.pose(N,j,B);for(const ue of _.values())ue.count=0;v.count=0;let ne=!1;for(const ue of de.values()){const je=ue.tile.x*xt-Ae.x,Qe=ue.tile.z*pt-Ae.y;ue.mesh.position.set(je,0,Qe),ue.mesh.visible=Math.abs(je)<xt/2+Wt&&Math.abs(Qe)<pt/2+ln;for(const ge of ue.props){const at=ge.x+je,bt=ge.z+Qe;if(Math.abs(at)>Wt-.06||Math.abs(bt)>ln-.04){ge.angle=ge.target=ge.velocity=0;continue}const qn=Wt-Math.abs(at),Ti=ln-Math.abs(bt),_n=(at-N)*it.x+(bt-j)*it.y,Yn=Math.min(qn,Ti*1.2);let Rn=ge.target;H<.3?Rn=1:Yn<.3||_n<-5||_n>6.6?Rn=0:Yn>.49&&_n>-4.55&&_n<5.95&&(Rn=1),Rn!==ge.target&&(ge.target=Rn,A++,V||e({opening:!!Rn,strength:cn((ge.scale||1)*.63,.24,1),pitch:.84+Math.abs(ge.x*1.33+ge.z*2.7)%1*.32,pan:cn(at/Wt,-1,1)}));const Wr=ge.angle;if(Math.abs(ge.angle-ge.target)>7e-4||Math.abs(ge.velocity)>.007){const y=ge.angle-ge.target,O=Math.sqrt(14.2*14.2-8.05*8.05),X=Math.exp(-8.05*B),q=y,z=(ge.velocity+8.05*y)/O,ie=Math.cos(O*B),he=Math.sin(O*B);ge.angle=ge.target+X*(q*ie+z*he),ge.velocity=X*((-8.05*q+O*z)*ie+(-8.05*z-O*q)*he),ne=!0,(Wr<=1&&ge.angle>1||Wr>=0&&ge.angle<0)&&x++}else ge.angle=ge.target,ge.velocity=0;const Cn=_.get(ge.name)||(ge.name==="HeroChalet"?_.get("HouseCream"):null);if(!Cn||Cn.count>=220)continue;const Xs=cn(Yn/.42,0,1),bi=ge.scale*Xs;if(m.position.set(at,Xi(at,bt)+ge.base,bt),m.rotation.order="YXZ",m.rotation.set(-(1-ge.angle)*(Math.PI/2-.014),ge.yaw,0,"YXZ"),m.scale.set(bi,bi,bi*(.055+.945*cn(ge.angle,0,1))),m.updateMatrix(),Cn.setMatrixAt(Cn.count,m.matrix),d.set(ge.tint||"#ffffff"),Cn.setColorAt(Cn.count,d),Cn.count++,ge.name==="Lantern"&&ge.angle>.18){Le.set(.282,1.065,.135).applyMatrix4(m.matrix);const Xr=(.7+.04*Math.sin(W*2.2+ge.x))*bi;pe(Le.x,Le.y,Le.z+.03,Xr)}}}for(const ue of _.values())ue.instanceMatrix.needsUpdate=!0,ue.instanceColor&&(ue.instanceColor.needsUpdate=!0);const Pe=te.length()/2.45,De=Ke?.14+Math.atan2(it.x,Math.max(.56,Math.abs(it.y)))*.64+.24*Math.max(0,-it.y):Z;Z=K(Z,De,1-Math.exp(-B*9));const Ve=we(w.x,w.y);if(S.position.set(N,Ve+.008,j),b.position.set(N,Ve-T+Math.abs(Math.sin(Ne*5.1))*.028*Pe,j),b.rotation.set(0,Z,Ke?Math.sin(Ne*5.1)*.055*Pe:Math.sin(W*1.1)*.008,"YXZ"),b.scale.setScalar(1.68),b.updateMatrix(),Le.set(.225,.272,.13).applyMatrix4(b.matrix),pe(Le.x,Le.y,Le.z+.02,.57+.025*Math.sin(W*2)),R.position.copy(Le),R.position.y+=.16,v.instanceMatrix.needsUpdate=!0,_e.length&&Ze<1.25){const ue=_e[_e.length-1];E.position.set(ue.x-Ae.x,we(ue.x,ue.y)+.025,ue.y-Ae.y),E.visible=Math.abs(E.position.x)<Wt&&Math.abs(E.position.z)<ln,E.scale.setScalar(1+.14*Math.sin(Ze*8)),E.material.opacity=Math.max(0,.9-Ze*.68)}else E.visible=!1;(ne||Ke||J)&&(a.shadowMap.needsUpdate=!0),J=!1,Object.assign(ft,i.render())}function Ce(B){const N=ke.clone();if(oe){const at=W%32;at<7.5?N.set(1,-.05):at<14.6?N.set(.32,-.85):at<23?N.set(-1,.23):N.set(.23,.86)}else if(Ee.size){const at=Number(Ee.has("KeyD")||Ee.has("ArrowRight"))-Number(Ee.has("KeyA")||Ee.has("ArrowLeft")),bt=Number(Ee.has("KeyS")||Ee.has("ArrowDown"))-Number(Ee.has("KeyW")||Ee.has("ArrowUp"));N.set(at*.918+bt*.396,bt*.918-at*.396)}let j=oe?1.27:2.45;if(N.lengthSq()>.001)_e.length=0,N.normalize();else if(_e.length){N.copy(_e[0]).sub(w);const at=N.length();at<.1?(_e.shift(),N.set(0,0)):(j=Math.min(j,Math.max(.35,at*6)),N.normalize())}te.lerp(N.multiplyScalar(j),1-Math.exp(-B*(N.lengthSq()>0?9:13.5))),te.lengthSq()<.001&&te.set(0,0);const ne=w.x,Pe=w.y;w.addScaledVector(te,B),Te(w.x,w.y,w);const De=Math.hypot(w.x-ne,w.y-Pe);H+=De,Ke=De>4e-4,Ke&&(it.copy(te).normalize(),ye=(Math.atan2(it.x,-it.y)*180/Math.PI+360)%360);const Ve=Math.floor(Ne/.49);Ne+=De,Ve!==Math.floor(Ne/.49)&&t({speed:cn(te.length()/2.45,0,1),pan:cn((w.x-Ae.x)/Wt,-1,1)});const ue=w.x-Ae.x,je=w.y-Ae.y,Qe=1-Math.exp(-B*3.3);Ae.x+=(ue-cn(ue,-2.6,2.6))*Qe,Ae.y+=(je-cn(je,-1.63,1.63))*Qe,Re();const ge=Math.floor(w.x/xt+.5)+","+Math.floor(w.y/pt+.5);$.has(ge)||($.add(ge),k=$.size),W+=B,Ze+=B,nt+=B,nt>.1&&(re(),nt=0)}function le(B=1/60){if(Q)return;const N=cn(Number(B)||1/60,1/1e3,.12);V||Ce(N),Ie(V?0:N)}function Ge(B){if(V||B.button>0)return;const N=r.getBoundingClientRect();if(Se.set((B.clientX-N.left)/N.width*2-1,1-(B.clientY-N.top)/N.height*2),me.setFromCamera(Se,o),!me.ray.intersectPlane(xe,We)||Math.abs(We.x)>Wt+.32||Math.abs(We.z)>ln+.32)return;oe=!1,ke.set(0,0),_e.length=0,Ze=0;const j=new Be(We.x+Ae.x,We.z+Ae.y),ne=ae(w.x,w.y),Pe=ae(j.x,j.y);if(ne&&ne===Pe){const ue=ne.tile.x*xt,je=ne.tile.z*pt,Qe=Math.sign(w.x-ue-ne.tile.river(w.y-je)),ge=Math.sign(j.x-ue-ne.tile.river(j.y-je));if(Qe!==ge&&Math.abs(j.x-ue-ne.tile.river(j.y-je))>.46)for(const at of[Qe,-Qe]){const bt=ne.bridge.x+1.38*at;_e.push(new Be(ue+bt,je+ne.tile.path(bt)))}}_e.push(j);let De=w;const Ve=[];for(const ue of _e){const je=sx(De,ue,Te);Ve.push(...je),je.length&&(De=je[je.length-1])}_e.splice(0,_e.length,...Ve)}function I(B){var N;B.altKey||B.ctrlKey||B.metaKey||(N=B.target)!=null&&N.matches("input,textarea,select,[contenteditable=true]")||/^(Key[WASD]|Arrow(Up|Down|Left|Right))$/.test(B.code)&&(V||(B.preventDefault(),oe=!1,Ee.add(B.code),_e.length=0))}function se(B){Ee.delete(B.code)}function ce(){Ee.clear(),te.set(0,0),ke.set(0,0)}r.addEventListener("pointerdown",Ge),window.addEventListener("keydown",I),window.addEventListener("keyup",se),window.addEventListener("blur",ce);function ve(B){C=cn(Math.floor(B)||0,0,2),D=Fl(kl[C]);for(const N of de.values())N.mesh.geometry.dispose(),s.remove(N.mesh);de.clear(),Ae.set(0,0),w.set(-2.26,1.99),ce(),_e.length=0,H=0,k=1,W=0,Ne=0,$=new Set(["0,0"]),it.set(1,0),Ke=!1,ye=0,A=x=G=0,i.theme(C),J=!0,Re(),Ie(1),re()}return ve(0),a.setAnimationLoop(B=>{const N=(B-ee)*.001;ee=B,!(Y||Q)&&(N>0&&N<1&&(lt.push(N),lt.length>280&&lt.shift()),document.hidden||(i.observeFrame(N),le(N)))}),{step:le,setManual(B){Y=!!B,ee=performance.now()},setDemo(B){oe=!!B,ce(),_e.length=0},setInput(B,N){oe=!1,ke.set(Number(B)||0,Number(N)||0),_e.length=0},setRegion:ve,setPaused(B){V=!!B,ce(),_e.length=0,Ke=!1,re()},setView(B){i.setView(B),J=!0,Ie(.016)},setZoom(B){i.setZoom(B),J=!0,Ie(.016)},getHinges(){const B=[],N=new U;for(const[j,ne]of de)ne.props.forEach((Pe,De)=>{const Ve=ne.tile.x*xt+Pe.x-Ae.x,ue=ne.tile.z*pt+Pe.z-Ae.y;if(Math.abs(Ve)>Wt-.06||Math.abs(ue)>ln-.04)return;N.set(Ve,Xi(Ve,ue)+Pe.base,ue).project(o);const je=N.x*.5+.5,Qe=.5-N.y*.5;je<0||je>1||Qe<0||Qe>1||B.push({id:C+"/"+j+"/"+De,name:Pe.name,angle:Pe.angle,target:Pe.target,screenX:je,screenY:Qe})});return B},getStats(){const B=lt.slice().sort((N,j)=>N-j);return{...ft,region:C,distance:H,page:k,heading:ye,moving:Ke,folds:A,overshoots:x,pagesGenerated:G,activePages:de.size,fps:B.length?1/(lt.reduce((N,j)=>N+j,0)/lt.length):0,p95FrameMs:(B[Math.floor(B.length*.95)]||0)*1e3,samples:B.length,resolutionScale:i.getResolution(),player:{x:w.x,z:w.y},origin:{x:Ae.x,z:Ae.y},renderer:a.getContext().getParameter(a.getContext().RENDERER)}},dispose(){Q=!0,a.setAnimationLoop(null),r.removeEventListener("pointerdown",Ge),window.removeEventListener("keydown",I),window.removeEventListener("keyup",se),window.removeEventListener("blur",ce);const B=new Set,N=new Set,j=new Set;s.traverse(ne=>{if(ne.geometry&&B.add(ne.geometry),ne.material)for(const Pe of Array.isArray(ne.material)?ne.material:[ne.material])N.add(Pe),Pe.map&&j.add(Pe.map)}),B.forEach(ne=>ne.dispose()),N.forEach(ne=>ne.dispose()),j.forEach(ne=>ne.dispose()),h==null||h.dispose(),i.dispose()}}}const gt=r=>document.querySelector(r),cx={help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.6 2.6 0 0 1 5 .9c0 1.9-2.5 2.3-2.5 4"/><path d="M12 17h.01"/>',expand:'<path d="M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5"/>',collapse:'<path d="M4 9h5V4m6 0v5h5M9 20v-5H4m11 5v-5h5"/>',atlas:'<path d="m3 5 6-2 6 3 6-2v14l-6 2-6-3-6 2zM9 3v14m6-11v14"/>',trail:'<circle cx="12" cy="8" r="3"/><path d="M5 20v-2a7 7 0 0 1 14 0v2"/>',pointer:'<path d="m5 3 13 10-7 1-3 7z"/>',route:'<circle cx="5" cy="17" r="2"/><circle cx="19" cy="6" r="2"/><path d="M7 17h5a3 3 0 0 0 0-6H9a2.5 2.5 0 0 1 0-5h8"/>',close:'<path d="m6 6 12 12m0-12L6 18"/>'};function Iu(r,e){r.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+cx[e]+"</svg>"}document.querySelectorAll("[data-icon]").forEach(r=>Iu(r,r.dataset.icon));const Hl=[{en:"Ember Valley",cn:"余烬山谷"},{en:"Pinewood",cn:"松影林地"},{en:"Moonwater",cn:"月照河湾"}];document.querySelectorAll("[data-thumb]").forEach(r=>{r.src=Cs("thumbnails/"+r.dataset.thumb+".webp")});const ai=ku();let Tn,sc=matchMedia("(max-width: 560px) and (orientation: portrait)").matches?"trail":"atlas",No=0,Sn=!1;try{Sn=localStorage.getItem("atlas:muted")==="true"}catch{}function Du(){ai.mute(Sn),gt("#sound").setAttribute("aria-pressed",String(!Sn)),gt("#sound span").textContent=Sn?"声音关闭":"声音开启",gt("#sound").setAttribute("aria-label",Sn?"开启声音":"关闭声音")}Du();function Uu(){Sn=!Sn,Du();try{localStorage.setItem("atlas:muted",String(Sn))}catch{}Sn||(ai.unlock(),ai.fold({opening:!0,strength:.4}))}function Nu(){Sn||ai.unlock()}document.addEventListener("pointerdown",Nu,{capture:!0,passive:!0});document.addEventListener("keydown",Nu,{capture:!0});gt("#sound").addEventListener("click",Uu);function zr(r){sc=r,Tn==null||Tn.setView(r);for(const e of["atlas","trail"])gt("#view-"+e).setAttribute("aria-pressed",String(r===e))}gt("#view-atlas").onclick=()=>zr("atlas");gt("#view-trail").onclick=()=>zr("trail");function Fu(r){!Tn||r===No||(No=r,Tn.setRegion(r),gt("#chapter-number").textContent="CHAPTER "+String(r+1).padStart(2,"0"),gt("#chapter-en").textContent=Hl[r].en,gt("#chapter-cn").textContent=Hl[r].cn,document.querySelectorAll(".chapter-card").forEach((e,t)=>e.setAttribute("aria-pressed",String(t===r))),ai.fold({opening:!0,pan:0,strength:.7}))}document.querySelectorAll(".chapter-card").forEach(r=>r.onclick=()=>Fu(Number(r.dataset.region)));const Hn=gt("#guide");function Ws(){Tn==null||Tn.setPaused(Hn.open||document.hidden)}function Ou(){Hn.open||Hn.showModal(),Ws()}function ac(){Hn.close()}gt("#help").onclick=Ou;gt("#close-help").onclick=ac;gt("#resume").onclick=ac;Hn.addEventListener("close",()=>{Ws(),gt("#world").focus({preventScroll:!0})});Hn.addEventListener("click",r=>{if(r.target!==Hn)return;const e=Hn.getBoundingClientRect();(r.clientX<e.left||r.clientX>e.right||r.clientY<e.top||r.clientY>e.bottom)&&ac()});async function Bu(){try{document.fullscreenElement?await document.exitFullscreen():await document.documentElement.requestFullscreen()}catch{}}document.fullscreenEnabled||(gt("#fullscreen").hidden=!0);gt("#fullscreen").onclick=Bu;document.addEventListener("fullscreenchange",()=>{const r=!!document.fullscreenElement;Iu(gt("#fullscreen i"),r?"collapse":"expand"),gt("#fullscreen").setAttribute("aria-label",r?"退出全屏":"进入全屏"),gt("#fullscreen").title=(r?"退出全屏":"进入全屏")+"（F）"});document.addEventListener("keydown",r=>{if(!(r.repeat||r.ctrlKey||r.metaKey||r.altKey||Hn.open))switch(r.key.toLowerCase()){case"v":zr(sc==="atlas"?"trail":"atlas");break;case"m":Uu();break;case"f":Bu();break;case"?":Ou();break}});document.addEventListener("visibilitychange",Ws);async function lx(){try{Tn=await ox(gt("#world"),{onFold:ai.fold,onStep:ai.step,onChange(r){Number.isFinite(r.distance)&&(gt("#distance").textContent=r.distance.toFixed(1))}}),zr(sc),Ws(),gt("#loading").classList.add("ready"),new URLSearchParams(location.search).has("capture")&&(window.atlasCapture={world:Tn,audio:ai,selectRegion:Fu,setView:zr,getRegion:()=>No})}catch(r){console.error(r),gt("#load-text").textContent="场景未能载入。请启用浏览器的图形加速并刷新。",gt("#loading").setAttribute("role","alert")}}lx();
