import * as THREE from 'three';
import {trailX} from './land.js';

const TAU = Math.PI * 2;
const up = new THREE.Vector3(0, 1, 0);
const textureRoot = new URL('../assets/architecture/', import.meta.url);

function makeMaterials() {
  const loader = new THREE.TextureLoader();
  function texture(file, color = false, repeatX = 1, repeatY = 1) {
    const tex = loader.load(new URL(file, textureRoot).href);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
    tex.anisotropy = 8;
    if (color) tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }
  function paint(color, roughness = .83, metalness = 0, options = {}) {
    return new THREE.MeshStandardMaterial({color, roughness, metalness, ...options});
  }
  const plasterNormal = texture('limewash-normal.webp');
  const wall = paint(0xf8f5e9, .96, 0, {
    map: texture('limewash.webp', true), normalMap: plasterNormal, normalScale: new THREE.Vector2(.57,.57)
  });
  const stone = paint(0xe7e1d2, .99, 0, {
    map: texture('rubble.webp', true), normalMap: texture('rubble-normal.webp'), normalScale: new THREE.Vector2(.9,.9)
  });
  const roof = paint(0xf6eee3, .77, .14, {
    map: texture('iron-red.webp', true), normalMap: texture('iron-normal.webp'), normalScale: new THREE.Vector2(.68,.68)
  });
  wall.userData.meters = 2.4;
  stone.userData.meters = 2.6;
  roof.userData.meters = 2.75;
  const siding=paint(0xefefe4,.94,0,{
    map:texture('siding.webp',true),normalMap:texture('siding-normal.webp'),normalScale:new THREE.Vector2(.75,.75)
  });
  siding.userData.meters=2.65;
  const tower = paint(0xfffcf6, .93, 0, {
    map: texture('tower-coat.webp', true),
    normalMap: texture('limewash-normal.webp', false, 8, 11),
    normalScale: new THREE.Vector2(.58,.58)
  });
  const timber=paint(0xe2d8c5,.93,0,{
    map:texture('weathered-timber.webp',true),normalMap:texture('timber-normal.webp'),
    normalScale:new THREE.Vector2(.80,.80)
  });
  return {
    wall, stone, roof, tower, siding,timber, trim:paint(0xd2cdb8), sill:paint(0x9a978a),
    concrete:paint(0x8f8b7a,.98), deep:paint(0x252c2a,.92),
    iron:paint(0x393f3c,.57,.49), ironLight:paint(0x727c75,.58,.52),
    red:paint(0x944b39,.74,.22), roofSeam:paint(0x9c5745,.77,.19),
    rust:paint(0x694e3f,.91,.17), brass:paint(0x99805b,.38,.65),
    door:paint(0x45574d), doorLight:paint(0x576557),
    faded:paint(0xc5beab,.88), wood:paint(0x776c55,.96),
    tar:paint(0x434843,.91), black:paint(0x272d2b,.64,.31),
    glass:paint(0x476165,.18,.44), glassDark:paint(0x2d4346,.21,.32),
    mast:paint(0x969e91,.59,.52), orange:paint(0xb66b44,.9),
    lampGlass:paint(0xc3d6cb,.15,.18,{transparent:true,opacity:.15,depthWrite:false,side:THREE.DoubleSide}),
    lens:paint(0xaebfb2,.16,.60,{emissive:0xe1aa5e,emissiveIntensity:.26}),
    lamp:paint(0xffdc91,.17,.16,{emissive:0xffcb7c,emissiveIntensity:2.2})
  };
}

function assembly(name, x, y, z) {
  const g = new THREE.Group();
  g.name = name;
  g.position.set(x,y,z);
  return g;
}
function mesh(g, geometry, material, x=0, y=0, z=0) {
  const result = new THREE.Mesh(geometry, material);
  result.position.set(x,y,z);
  g.add(result);
  return result;
}
function box(g, x,y,z, w,h,d, material) {
  const geo = new THREE.BoxGeometry(w,h,d);
  const meters = material.userData.meters;
  if(meters) {
    const uv = geo.attributes.uv;
    for (let i=0; i<24; i++) {
      const face = Math.floor(i/4);
      const uSize = face<2 ? d : w;
      const vSize = face===2 || face===3 ? d : h;
      uv.setXY(i,uv.getX(i)*uSize/meters,uv.getY(i)*vSize/meters);
    }
  }
  return mesh(g,geo,material,x,y,z);
}
function cylinder(g,x,y,z,top,bottom,h,material,n=24,open=false) {
  return mesh(g,new THREE.CylinderGeometry(top,bottom,h,n,1,open),material,x,y,z);
}
function rod(g,a,b,r,material,n=7,endRadius=r) {
  const direction = new THREE.Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]);
  const object = cylinder(g,(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2,endRadius,r,direction.length(),material,n);
  object.quaternion.setFromUnitVectors(up,direction.normalize());
  return object;
}
function ring(g, x,y,z, radius, tube, material, segments=72) {
  const object=mesh(g,new THREE.TorusGeometry(radius,tube,6,segments),material,x,y,z);
  object.rotation.x = Math.PI/2;
  return object;
}
function lathe(g,x,y,z,profile,material,n=72) {
  return mesh(g,new THREE.LatheGeometry(profile.map(p=>new THREE.Vector2(...p)),n),material,x,y,z);
}
function globe(g,x,y,z,rx,ry,rz,material,n=16) {
  const object=mesh(g,new THREE.SphereGeometry(1,n,12),material,x,y,z);
  object.scale.set(rx,ry,rz);
  return object;
}

// Consolidate each site's immobile geometry after placing it. The lantern and wind indicator stay independently animated.
function bakeSite(scene, root) {
  root.updateMatrixWorld(true);
  const groups = new Map();
  root.traverse(obj=>{
    if (!obj.isMesh) return;
    const geo = obj.geometry.index ? obj.geometry.toNonIndexed() : obj.geometry.clone();
    geo.applyMatrix4(obj.matrixWorld);
    const key = obj.material;
    if (!groups.has(key)) groups.set(key,[]);
    groups.get(key).push(geo);
    obj.geometry.dispose();
  });
  const site = new THREE.Group();
  site.name = root.name;
  for (const [material, geometries] of groups) {
    const joined = new THREE.BufferGeometry();
    for (const name of ['position','normal','uv']) {
      const stride = name === 'uv' ? 2 : 3;
      const count = geometries.reduce((sum,g)=>sum+g.attributes.position.count*stride,0);
      const merged = new Float32Array(count);
      let offset=0;
      for (const g of geometries) {
        const a = g.attributes[name];
        if(a) merged.set(a.array,offset);
        offset += g.attributes.position.count*stride;
      }
      joined.setAttribute(name,new THREE.BufferAttribute(merged,stride));
    }
    for (const geo of geometries) geo.dispose();
    joined.computeBoundingSphere();
    const object = new THREE.Mesh(joined,material);
    object.castShadow = !material.transparent;
    object.receiveShadow = true;
    site.add(object);
  }
  scene.add(site);
}

function plaque(g,x,y,z,width,height,top,line,bottom,background='#374b47') {
  const canvas=document.createElement('canvas');
  canvas.width=768;
  canvas.height=Math.max(140,Math.round(768*height/width));
  const c=canvas.getContext('2d');
  const W=canvas.width,H=canvas.height;
  c.fillStyle=background;
  c.fillRect(0,0,W,H);
  c.lineWidth=4; c.strokeStyle='#b4b7a2'; c.strokeRect(10,10,W-20,H-20);
  c.fillStyle='#dfdfc9'; c.textAlign='center'; c.textBaseline='middle';
  c.font='500 '+Math.round(H*.116)+'px Georgia'; c.fillText(top,W*.5,H*.22);
  c.font='bold '+Math.round(Math.min(H*.255,W/(line.length*.62)))+'px Arial'; c.fillText(line,W*.5,H*.52);
  c.font=Math.round(H*.113)+'px monospace'; c.fillText(bottom,W*.5,H*.78);
  c.fillStyle='#b4ac8c';
  for(const sx of [24,W-24]) for(const sy of [24,H-24]) {
    c.beginPath();c.arc(sx,sy,5,0,TAU);c.fill();
  }
  const texture=new THREE.CanvasTexture(canvas);
  texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;
  const material=new THREE.MeshStandardMaterial({map:texture,roughness:.58,metalness:.14});
  return mesh(g,new THREE.PlaneGeometry(width,height),material,x,y,z);
}

function sash(g,m,x,y,z,w,h,style='double') {
  box(g,x,y,z,w+.28,h+.23,.18,m.trim);
  box(g,x,y,z+.103,w+.05,h+.05,.075,m.deep);
  box(g,x,y,z+.151,w,h,.035,m.glassDark);
  box(g,x,y+h*.22,z+.174,w*.9,h*.44,.018,m.glass);
  const frame=.057;
  for(const side of [-1,1]) box(g,x+side*(w-frame)/2,y,z+.199,frame,h,.05,m.doorLight);
  for(const side of [-1,1]) box(g,x,y+side*(h-frame)/2,z+.2,w,frame,.05,m.doorLight);
  if(style==='double') box(g,x,y,z+.202,frame,h,.061,m.trim);
  box(g,x,y+h*.07,z+.204,w,.055,.068,m.trim);
  box(g,x,y-h/2-.075,z+.12,w+.37,.135,.34,m.sill);
  box(g,x,y+h/2+.1,z+.05,w+.31,.10,.215,m.trim);
}
function entrance(g,m,x,baseY,z,w=1.22,h=2.13) {
  const y=baseY+h/2;
  box(g,x,y,z,w+.35,h+.15,.21,m.trim);
  box(g,x,y,z+.124,w+.1,h+.033,.08,m.deep);
  box(g,x,y,z+.18,w,h,.07,m.door);
  for(let i=1;i<6;i++) box(g,x-w*.5+w*i/6,y,z+.218,.013,h-.035,.012,m.doorLight);
  box(g,x,y+.52,z+.225,w*.68,.55,.029,m.deep);
  box(g,x,y+.52,z+.244,w*.62,.49,.019,m.glass);
  box(g,x,y+.52,z+.256,.038,.52,.025,m.doorLight);
  box(g,x,y+.52,z+.257,w*.68,.035,.025,m.doorLight);
  box(g,x+w*.34,baseY+1.02,z+.272,.16,.033,.064,m.brass);
  box(g,x,y+h*.5+.09,z+.1,w+.49,.135,.4,m.sill);
}

function lighthouse(scene,m,h0,colliders) {
  const g=assembly('Meridian lighthouse',0,h0,0);
  cylinder(g,0,-.42,0,4.04,4.2,1.72,m.stone,72);
  cylinder(g,0,.49,0,3.92,4.11,.40,m.sill,80);
  lathe(g,0,0,0,[[3.97,.61],[3.92,.73],[3.84,.78],[3.70,.83],[3.57,1.28],[3.51,1.30]],m.trim,96);
  const base=1.23, top=24.65, rb=3.55, rt=2.27;
  const radius=y=>rb+(rt-rb)*(y-base)/(top-base);
  cylinder(g,0,(base+top)/2,0,rt,rb,top-base,m.tower,96,true);
  lathe(g,0,0,0,[[2.27,24.60],[2.28,24.76],[2.44,24.78],[2.44,24.87],[2.52,24.90],[2.55,25.01],[2.7,25.13],[2.79,25.19],[2.82,25.3],[3.04,25.33],[3.06,25.47]],m.trim,96);
  cylinder(g,0,25.51,0,3.08,3.07,.10,m.iron,96);
  for(const [y,a] of [[6.25,.00],[11.1,1.53],[15.67,.12],[20.9,1.22],[9.0,3.0],[17.3,4.13]]) {
    const frame=assembly('Recessed stair window',Math.sin(a)*(radius(y)-.005),y,Math.cos(a)*(radius(y)-.005));
    frame.rotation.y=a;
    g.add(frame);
    sash(frame,m,0,0,0,.68,1.15,'single');
  }
  const porch=assembly('South entrance',0,0,3.48);g.add(porch);
  entrance(porch,m,0,.53,0,1.53,2.58);
  plaque(porch,0,3.59,.085,1.30,.44,'NORTHERN LIGHT SERVICE','MERIDIAN','EST. 1897');
  for(let i=0;i<3;i++) box(porch,0,.12+i*.16,.92-i*.28,2.09-i*.09,.24+i*.1,.78,m.sill);
  for(const side of [-1,1]) {
    rod(porch,[side*1.14,.0,1.22],[side*1.14,.95,1.22],.034,m.iron);
    rod(porch,[side*1.14,.5,.12],[side*1.14,1.29,.12],.034,m.iron);
    rod(porch,[side*1.14,.95,1.22],[side*1.14,1.29,.12],.043,m.iron);
  }
  for(let i=0;i<28;i++) {
    const a=i/28*TAU, s=Math.sin(a),c=Math.cos(a);
    const x=s*2.98,z=c*2.98;
    rod(g,[x,25.51,z],[x,26.63,z],.034,m.iron,8);
    if(i%2===0) rod(g,[s*2.33,24.38,c*2.33],[s*2.86,25.37,c*2.86],.065,m.iron,7);
  }
  for(const y of [25.85,26.23,26.64]) ring(g,0,y,0,2.98,y>26.5?.048:.025,m.iron);
  cylinder(g,0,25.88,0,2.02,2.12,.67,m.iron,18);
  cylinder(g,0,26.21,0,2.12,2.1,.12,m.ironLight,36);
  cylinder(g,0,27.27,0,1.9,1.92,2.09,m.lampGlass,16,true);
  const n=16;
  for(let i=0;i<n;i++) {
    const a=i*TAU/n, a2=(i+1)*TAU/n, R=1.92;
    const x=R*Math.sin(a),z=R*Math.cos(a);
    rod(g,[x,26.17,z],[x,28.37,z],i%2===0?.053:.034,m.iron,8);
    rod(g,[x,26.30,z],[R*Math.sin(a2),28.24,R*Math.cos(a2)],.023,m.iron,6);
  }
  ring(g,0,27.27,0,1.925,.026,m.ironLight,64);
  cylinder(g,0,28.38,0,2.08,1.99,.22,m.iron,48);
  lathe(g,0,0,0,[[2.15,28.44],[2.20,28.51],[2.16,28.6],[1.96,28.69],[1.76,28.80],[1.22,29.19],[.66,29.54],[.28,29.78],[.14,29.81]],m.red,64);
  for(let i=0;i<16;i++) {
    const a=i*TAU/16,s=Math.sin(a),c=Math.cos(a);
    rod(g,[s*2.09,28.62,c*2.09],[s*.26,29.78,c*.26],.022,m.roofSeam,5);
  }
  cylinder(g,0,29.86,0,.12,.2,.19,m.iron,20);
  globe(g,0,30.01,0,.145,.16,.145,m.brass);
  rod(g,[0,30.14,0],[0,31.12,0],.045,m.iron,8,.009);
  cylinder(g,0,26.48,0,.64,.78,.45,m.brass,40);
  globe(g,0,27.22,0,.58,.90,.58,m.lens,36);
  for(let i=-8;i<=8;i++) {
    const y=27.24+i*.091;
    const r=.59*Math.sqrt(1-(i/10)**2);
    ring(g,0,y,0,r,.043,m.lens,40);
  }
  for(let i=0;i<4;i++) {
    const a=i*TAU/4;
    rod(g,[Math.sin(a)*.68,26.45,Math.cos(a)*.68],[Math.sin(a)*.68,28.04,Math.cos(a)*.68],.028,m.brass);
  }
  globe(g,0,27.24,0,.30,.65,.30,m.lamp,20);
  bakeSite(scene,g);
  const optic=assembly('Revolving optic',0,h0+27.26,0);
  const face=globe(optic,0,0,.60,.37,.40,.072,m.lamp,22);
  face.castShadow=false;
  globe(optic,0,0,-.60,.37,.40,.072,m.lamp,22);
  const haloCanvas=document.createElement('canvas');
  haloCanvas.width=haloCanvas.height=128;
  const ctx=haloCanvas.getContext('2d'),glow=ctx.createRadialGradient(64,64,0,64,64,64);
  glow.addColorStop(0,'rgba(255,242,203,1)');
  glow.addColorStop(.14,'rgba(255,218,155,.84)');
  glow.addColorStop(.40,'rgba(255,191,104,.24)');
  glow.addColorStop(1,'rgba(255,182,89,0)');
  ctx.fillStyle=glow;ctx.fillRect(0,0,128,128);
  const haloMaterial=new THREE.SpriteMaterial({map:new THREE.CanvasTexture(haloCanvas),transparent:true,depthWrite:false,opacity:.72,blending:THREE.AdditiveBlending});
  for(const sign of [-1,1]) {
    const halo=new THREE.Sprite(haloMaterial);
    halo.position.z=sign*.705;halo.scale.set(2.12,2.12,1);optic.add(halo);
  }
  scene.add(optic);
  colliders.push({x:0,z:0,r:3.65});
  return optic;
}

function gableEnds(g,m,x,y,z,w,d,rise) {
  const pos=[], uv=[];
  for (const side of [-1,1]) {
    const X=x+side*w*.5;
    const section=[[-d/2,0],[d/2,0],[0,rise]];
    if(side===1) section.reverse();
    for (const [Z,Y] of section) {
      pos.push(X,y+Y,z+Z);
      uv.push((Z+d*.5)/2.4,Y/2.4);
    }
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
  geo.computeVertexNormals();
  mesh(g,geo,m.wall);
}

function pitchedRoof(g,m,x,y,z,w,d,rise) {
  gableEnds(g,m,x,y,z,w,d,rise);
  const angle=Math.atan2(rise,d/2), padding=.27;
  const half=(d/2+padding)/Math.cos(angle);
  for(const side of [-1,1]) {
    const centerZ=z+side*half*Math.cos(angle)/2;
    const centerY=y+rise-half*Math.sin(angle)/2;
    const roof=box(g,x,centerY,centerZ,w+.58,.13,half,m.roof);
    roof.rotation.x=side*angle;
    for(const edge of [-1,1]) {
      const verge=box(g,x+edge*(w/2+.24),centerY-.055,centerZ,.145,.23,half+.035,m.faded);
      verge.rotation.x=side*angle;
    }
    const eaveZ=z+side*(d/2+padding);
    const eaveY=y-padding*Math.tan(angle);
    box(g,x,eaveY-.074,eaveZ,w+.5,.24,.10,m.faded);
    rod(g,[x-w/2-.27,eaveY-.12,eaveZ+side*.07],[x+w/2+.27,eaveY-.12,eaveZ+side*.07],.077,m.ironLight,12);
    const pitchSpacing=.57;
    for(let i=-Math.floor(w/(2*pitchSpacing));i<=Math.floor(w/(2*pitchSpacing));i++) {
      const seam=box(g,x+i*pitchSpacing,centerY+.069,centerZ,.026,.031,half,m.roofSeam);
      seam.rotation.x=side*angle;
    }
  }
  rod(g,[x-w/2-.3,y+rise+.07,z],[x+w/2+.3,y+rise+.07,z],.102,m.red,12);
}

function wallLamp(g,m,x,y,z) {
  box(g,x,y,z,.16,.26,.12,m.iron);
  rod(g,[x,y+.075,z],[x,y+.13,z+.20],.045,m.iron);
  cylinder(g,x,y-.008,z+.20,.145,.108,.205,m.trim,12);
  cylinder(g,x,y+.109,z+.20,.065,.176,.068,m.iron,16);
  cylinder(g,x,y-.125,z+.20,.10,.075,.04,m.iron,12);
}

function houseSite(scene,m,heightAt,colliders) {
  const x=11.4,z=-4.45, h0=heightAt(x,z);
  const g=assembly('Lightkeeper’s residence',x,h0,z);
  const w=11.7,d=6.05, wallY=3.58;
  box(g,0,-.63,0,w+.24,2.03,d+.24,m.stone);
  box(g,0,.34,0,w+.18,.16,d+.18,m.sill);
  box(g,0,(wallY+.39)/2,0,w,wallY-.39,d,m.wall);
  for(const side of [-1,1]) {
    for(const front of [-1,1]) {
      for(let i=0;i<9;i++) {
        box(g,side*(w/2-.08),.58+i*.36,front*(d/2-.07),i%2?.36:.50,.321,i%2?.5:.35,m.trim);
      }
    }
  }
  pitchedRoof(g,m,0,wallY,0,w,d,1.84);
  for(const xx of [-4.32,-2.05,2.26,4.40]) sash(g,m,xx,1.98,d/2+.035,.97,1.39);
  entrance(g,m,.12,.40,d/2+.035,1.19,2.20);
  wallLamp(g,m,1.17,2.58,d/2+.17);
  for(let i=0;i<3;i++) box(g,.12,.07+i*.09,d/2+.72-i*.24,1.75,.13+i*.14,.58,m.sill);
  const back=assembly('Rear wall',0,0,-d/2);back.rotation.y=Math.PI;g.add(back);
  for(const xx of [-3.6,0,3.6]) sash(back,m,xx,1.91,.02,.9,1.19);
  for(const side of [-1,1]) {
    const end=assembly('Gable',side*w/2,0,0);end.rotation.y=side*Math.PI/2;g.add(end);
    sash(end,m,0,3.92,.02,.63,.72,'single');
    for(const offset of [-1.43,1.43]) sash(end,m,offset,1.91,.035,.89,1.22);
  }
  for(const xx of [-4.42,3.85]) {
    box(g,xx,5.36,-.42,.62,1.55,.71,m.stone);
    box(g,xx,6.11,-.42,.78,.18,.89,m.sill);
    for(const zz of [-.61,-.25]) {
      cylinder(g,xx,6.40,zz,.114,.156,.49,m.rust,14);
      cylinder(g,xx,6.64,zz,.149,.13,.057,m.red,14);
      cylinder(g,xx,6.67,zz,.098,.098,.006,m.deep,14);
    }
  }
  for(const sx of [-1,1]) {
    const xx=sx*(w/2-.26), zz=d/2+.19;
    rod(g,[xx,.3,zz],[xx,wallY-.40,zz],.059,m.ironLight,10);
    rod(g,[xx,wallY-.40,zz],[xx,wallY-.18,zz+.19],.059,m.ironLight,10);
    rod(g,[xx,.3,zz],[xx,.17,zz+.19],.059,m.ironLight,10);
    for(const h of [1.04,2.71]) box(g,xx,h,zz,.17,.063,.14,m.iron);
  }
  // The lean-to has its own low roof and a firewood bay.
  const shedX=7.30, shedZ=-.72, shedW=2.88,shedD=3.80;
  box(g,shedX,-.55,shedZ,shedW,1.70,shedD,m.stone);
  box(g,shedX,1.30,shedZ,shedW,2.15,shedD,m.wall);
  const lean=box(g,shedX,2.56,shedZ,shedW+.52,.15,shedD+.52,m.roof);
  lean.rotation.z=-.11;
  entrance(g,m,shedX,.25,shedZ+shedD/2,.96,1.91);
  for(let i=0;i<3;i++) for(let j=0;j<5-i;j++) {
    const lx=shedX-1.03+j*.16+i*.08,ly=.31+i*.13;
    rod(g,[lx,ly,shedZ+2.12],[lx,ly,shedZ+2.65],.093,m.wood,8);
  }
  bakeSite(scene,g);
  colliders.push({x,z,w,d},{x:x+shedX,z:z+shedZ,w:shedW,d:shedD});
}

function aerial(g,m,x,z) {
  const levels=[0,2.80,5.60,8.40,11.2], width=[.58,.51,.38,.24,.14];
  const points=levels.map((y,j)=>[0,1,2].map(i=>[
    x+Math.sin(i*TAU/3+.35)*width[j],y,z+Math.cos(i*TAU/3+.35)*width[j]
  ]));
  for(let j=0;j<levels.length-1;j++) {
    for(let i=0;i<3;i++) {
      const next=(i+1)%3;
      rod(g,points[j][i],points[j+1][i],.047-j*.004,m.mast,8);
      rod(g,points[j][i],points[j][next],.027,m.mast,6);
      rod(g,points[j][i],points[j+1][next],.022,m.mast,5);
      rod(g,points[j][next],points[j+1][i],.02,m.mast,5);
    }
  }
  rod(g,[x,10.9,z],[x,12.53,z],.046,m.ironLight,8,.015);
  for(let i=0;i<2;i++) {
    const ex=x+[-3.9,1.4][i],ez=z+[-2.3,3.35][i];
    rod(g,[x,8.3,z],[ex,.22,ez],.013,m.iron,4);
    box(g,ex,.1,ez,.39,.35,.43,m.concrete);
  }
}

function signalStation(scene,m,heightAt,colliders) {
  const x=59,z=40,h0=heightAt(x,z),g=assembly('Coast radio station',x,h0,z);
  const w=5.2,d=3.73;
  box(g,0,-.64,0,w+.35,2.02,d+.34,m.concrete);
  box(g,0,1.55,0,w,2.59,d,m.siding);
  for(const sx of [-1,1]) {
    for(const sz of [-1,1]) box(g,sx*(w/2-.012),1.55,sz*(d/2-.012),.135,2.60,.135,m.faded);
    const end=assembly('Signal hut gable',sx*w/2,0,0);
    end.rotation.y=sx*Math.PI/2;g.add(end);
    sash(end,m,0,1.75,.008,.74,.90);
    box(end,0,3.00,.03,.51,.34,.066,m.deep);
    for(let i=0;i<5;i++) box(end,0,2.87+i*.064,.075,.48,.03,.042,m.faded);
  }
  pitchedRoof(g,m,0,2.85,0,w,d,1.12);
  sash(g,m,-1.4,1.67,d/2+.057,1.03,1.03);
  entrance(g,m,.31,.37,d/2+.08,1.08,1.96);
  wallLamp(g,m,1.1,2.37,d/2+.12);
  plaque(g,1.79,1.91,d/2+.10,.88,.49,'COAST SERVICE','SIGNAL 04','VHF  ·  16');
  for(let i=0;i<2;i++) box(g,.32,.085+i*.11,d/2+.56-i*.28,1.57,.17+i*.15,.60,m.sill);
  // Rain gauge and anemometer on the radio mast.
  aerial(g,m,4.7,-.8);
  const cabinetX=-2.30,cz=d/2+.01;
  box(g,cabinetX,1.34,cz+.16,.55,.83,.34,m.mast);
  box(g,cabinetX,1.47,cz+.34,.37,.22,.034,m.deep);
  box(g,cabinetX,1.47,cz+.365,.29,.15,.01,m.glass);
  for(let i=0;i<5;i++) box(g,cabinetX,1.08+i*.037,cz+.345,.37,.012,.017,m.iron);
  rod(g,[cabinetX,.10,cz+.08],[cabinetX,1.04,cz+.08],.035,m.iron);
  const ax=3.08,az=1.34;
  cylinder(g,ax,.19,az,.37,.42,.60,m.concrete,8);
  cylinder(g,ax,2.34,az,.057,.083,4.18,m.mast,12);
  for(let i=0;i<4;i++) box(g,ax-.17+i*.117,.45,az,.031,.075,.033,m.iron);
  const wind=assembly('Weather vane',x+ax,h0+4.53,z+az);
  for(let i=0;i<3;i++) {
    const a=i*TAU/3,s=Math.sin(a),c=Math.cos(a);
    rod(wind,[0,0,0],[s*.42,0,c*.42],.021,m.ironLight);
    const cup=mesh(wind,new THREE.SphereGeometry(.12,12,8,0,Math.PI),m.black,s*.42,0,c*.42);
    cup.rotation.y=a;
  }
  scene.add(wind);
  const buoy=mesh(g,new THREE.TorusGeometry(.35,.089,12,40),m.orange,2.31,1.3,d/2+.115);
  for(let i=0;i<4;i++) {
    const patch=mesh(g,new THREE.TorusGeometry(.35,.092,10,6,.225),m.trim,buoy.position.x,buoy.position.y,buoy.position.z);
    patch.rotation.z=TAU*i/4+.6;
  }
  bakeSite(scene,g);
  colliders.push({x,z,w,d},{x:x+4.7,z:z-.8,r:.65},{x:x+ax,z:z+az,r:.26});
  return wind;
}

function oldMarker(scene,m,heightAt,colliders) {
  const x=-15,z=69,h0=heightAt(x,z),g=assembly('Old sector daymark',x,h0,z);
  cylinder(g,0,-.25,0,.99,1.15,1.12,m.stone,8);
  cylinder(g,0,.32,0,1.05,1.12,.18,m.sill,8);
  cylinder(g,0,.96,0,.60,.84,1.2,m.trim,8);
  cylinder(g,0,1.59,0,.65,.65,.14,m.sill,8);
  for(let i=0;i<3;i++) {
    const a=i*TAU/3+.5, b=(i+1)*TAU/3+.5;
    const s=Math.sin(a),c=Math.cos(a),ss=Math.sin(b),cc=Math.cos(b);
    rod(g,[s*.51,1.65,c*.51],[s*.16,4.63,c*.16],.053,m.rust,7);
    rod(g,[s*.51,1.69,c*.51],[ss*.31,3.14,cc*.31],.024,m.iron,5);
    rod(g,[s*.31,3.14,c*.31],[ss*.16,4.56,cc*.16],.024,m.iron,5);
    rod(g,[s*.31,3.14,c*.31],[ss*.31,3.14,cc*.31],.036,m.rust,6);
  }
  rod(g,[0,4.4,0],[0,6.14,0],.068,m.iron,8);
  // Two intersecting slatted diamonds remain visible from every bearing.
  for(const a of [.12,.12+Math.PI/2]) {
    const frame=assembly('Painted laths',0,5.31,0);
    frame.rotation.y=a;g.add(frame);
    for(let i=-5;i<=5;i++) {
      const y=i*.114,width=1.35*(1-Math.abs(i)/6);
      box(frame,0,y,0,width,.097,.045,i%4===0?m.red:m.rust);
    }
  }
  const sign=assembly('Memorial plate',0,0,.725);g.add(sign);
  sign.rotation.x=-.11;
  plaque(sign,0,.91,.09,.74,.45,'BOARD OF TRADE','WEST MARK','SURVEY  ·  1894','#4d5750');
  bakeSite(scene,g);
  colliders.push({x,z,r:1.06});
}

function patrolRail(scene,m,heightAt,colliders) {
  const g=assembly('Cliff trail rail and fingerpost',0,0,0);
  function post(x,z,h,r,lean,twist) {
    const y=heightAt(x,z);
    const shaft=cylinder(g,x+lean*.5,y+h*.5-.09,z,r*.87,r,h+.18,m.timber,7);
    shaft.rotation.z=-Math.atan2(lean,h+.18);
    shaft.rotation.y=twist;
    // Uneven sawcuts catch the light at the broken end of each old timber.
    const pos=shaft.geometry.attributes.position;
    for(let i=0;i<pos.count;i++) {
      if(pos.getY(i)>0)pos.setY(i,pos.getY(i)+.15*pos.getX(i)+.062*pos.getZ(i));
    }
    shaft.geometry.computeVertexNormals();
    return new THREE.Vector3(x+lean,y+h,z);
  }
  function span(a,b,slack) {
    const mid=a.clone().lerp(b,.5);mid.y-=slack;mid.x-=.075;
    const curve=new THREE.QuadraticBezierCurve3(a,mid,b);
    mesh(g,new THREE.TubeGeometry(curve,14,.033,7,false),m.wood);
    // Three helical lays leave a visible twist in the nearest length of rope.
    const count=Math.ceil(a.distanceTo(b)*28);
    const frames=curve.computeFrenetFrames(count,false);
    for(let s=0;s<3;s++) {
      const points=[];
      for(let i=0;i<=count;i++) {
        const t=i/count,angle=t*a.distanceTo(b)*TAU*5.7+s*TAU/3;
        const p=curve.getPointAt(t).addScaledVector(frames.normals[i],Math.cos(angle)*.022)
          .addScaledVector(frames.binormals[i],Math.sin(angle)*.022);
        points.push(p);
      }
      const strand=new THREE.CatmullRomCurve3(points);
      mesh(g,new THREE.TubeGeometry(strand,count,.0135,4,false),s===0?m.rust:m.wood);
    }
  }
  let last=null;
  // End the barrier before the west-mark branch. Leave the crossing open.
  const positions=[[94.4,3.35],[91.8,3.55],[89.0,3.54],[86.2,3.55],[83.3,3.58]];
  positions.forEach(([z,offset],i)=>{
    const x=trailX(z)-offset,h=[1.04,1.13,1.00,1.06,.91][i],r=[.118,.126,.112,.117,.139][i];
    const top=post(x,z,h,r,[-.083,.027,-.043,.062,-.09][i],i*.71);
    const eye=top.clone();
    eye.x+=r*.78;eye.y-=.16;
    for(const d of [0,.038]) {
      const lash=ring(g,top.x,eye.y+d,top.z,r*.95,.023,m.wood,18);
      lash.rotation.z=.13+.03*i;
    }
    if(last)span(last,eye,.35+i%2*.10);
    last=eye;colliders.push({x,z,r:r+.01});
  });
  const z=90.9,x=31.53,y=heightAt(x,z);
  const sign=assembly('North Cape and West Mark signpost',x,y,z);
  sign.rotation.y=.26;g.add(sign);
  post(x,z,2.88,.108,.034,.21);
  function fingerboard(text,direction,cy,tilt) {
    const L=1.17,H=.235, bevel=.13,plate=new THREE.Shape();
    const outline=[[-L/2,-H/2],[L/2-bevel,-H/2],[L/2,0],[L/2-bevel,H/2],[-L/2,H/2]];
    if(direction<0) outline.forEach(p=>p[0]*=-1);
    outline.forEach(([xx,yy],i)=>i?plate.lineTo(xx,yy):plate.moveTo(xx,yy));plate.closePath();
    const board=assembly('Fingerboard',direction*.30,cy,.092);
    board.rotation.z=tilt;sign.add(board);
    mesh(board,new THREE.ExtrudeGeometry(plate,{depth:.057,bevelEnabled:true,bevelThickness:.007,bevelSize:.007,bevelSegments:1}),m.door);
    const canvas=document.createElement('canvas');canvas.width=960;canvas.height=192;
    const c=canvas.getContext('2d'),w=canvas.width,h=canvas.height;
    c.fillStyle='#45574d';c.fillRect(0,0,w,h);
    let seed=78;
    for(let i=0;i<3900;i++){
      seed=(Math.imul(seed,1664525)+1013904223)>>>0;const xx=(seed%10000)*w/10000;
      seed=(Math.imul(seed,1664525)+1013904223)>>>0;const yy=(seed%10000)*h/10000;
      c.fillStyle=i%4?'rgba(215,203,165,.10)':'rgba(22,35,30,.22)';
      c.fillRect(xx,yy,2+(seed%17),1+(seed%3));
    }
    const left=direction>0;
    c.strokeStyle='#d6cfb5';c.lineWidth=3.5;c.beginPath();
    const inset=12,arrowX=left?w-14:14,cornerX=left?w-111:111,farX=left?inset:w-inset;
    c.moveTo(farX,inset);c.lineTo(cornerX,inset);c.lineTo(arrowX,h/2);c.lineTo(cornerX,h-inset);c.lineTo(farX,h-inset);c.closePath();c.stroke();
    c.fillStyle='#ede9d3';c.font='bold 83px Arial Narrow, Arial';c.textAlign='center';c.textBaseline='middle';
    c.fillText(text,w*.5-direction*34,h*.51,w*.74);
    const tex=new THREE.CanvasTexture(canvas);tex.anisotropy=8;tex.colorSpace=THREE.SRGBColorSpace;
    const label=new THREE.ShapeGeometry(plate);
    const uv=label.attributes.uv,position=label.attributes.position;
    for(let i=0;i<uv.count;i++)uv.setXY(i,position.getX(i)/L+.5,position.getY(i)/H+.5);
    mesh(board,label,new THREE.MeshStandardMaterial({map:tex,roughness:.88,emissive:0x332f25,emissiveMap:tex}),0,0,.066);
    const boltX=-direction*.475;
    for(const yy of [-.071,.071]) globe(board,boltX,yy,.072,.015,.015,.008,m.ironLight,10);
  }
  fingerboard('NORTH CAPE',1,2.65,.022);
  fingerboard('WEST MARK',-1,2.31,-.028);
  colliders.push({x,z,r:.124});
  bakeSite(scene,g);
}

export function createArchitecture(scene,heightAt) {
  const m=makeMaterials(),colliders=[];
  const optic=lighthouse(scene,m,heightAt(0,0),colliders);
  houseSite(scene,m,heightAt,colliders);
  const wind=signalStation(scene,m,heightAt,colliders);
  oldMarker(scene,m,heightAt,colliders);
  patrolRail(scene,m,heightAt,colliders);
  return {
    colliders,
    update(time) {
      optic.rotation.y=time*.64;
      wind.rotation.y=time*2.38+.13*Math.sin(time*.69);
    }
  };
}
