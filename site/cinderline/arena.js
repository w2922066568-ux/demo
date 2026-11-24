/* K-17 geothermal works. Dimensions are in metres, with +Y up. */
window.CinderArena = function CinderArena(scene, renderer) {
  'use strict';
  const T = THREE;
  const PI = Math.PI;
  const TAU = PI * 2;
  let seed = 17074;
  const random = () => ((seed = (Math.imul(1664525, seed) + 1013904223) >>> 0) / 4294967296);
  const between = (a, b) => a + random() * (b - a);
  const vec = (x, y, z) => new T.Vector3(x, y, z);
  const root = new T.Group();
  root.name = 'K-17 geothermal works';
  scene.add(root);
  const obstacles = [];
  const bounds = { minX: -19.4, maxX: 19.4, minZ: -23.4, maxZ: 23.4 };
  const spawn = { x: 0, z: 18 };
  const enemySpawns = [
    { x: -6, z: 6 }, { x: 8, z: 4 }, { x: 0, z: -7 },
    { x: -15, z: -13 }, { x: 14, z: -14 }, { x: 0, z: -20 },
    { x: -17, z: 2 }, { x: 16, z: -2 }
  ];
  const maps = window.CinderSurfaceMaps || {};
  const loader = new T.TextureLoader();
  const textureCache = new Map();
  function texture(key, color = false) {
    if (!maps[key]) return null;
    if (textureCache.has(key)) return textureCache.get(key);
    const tex = loader.load(maps[key]);
    if (color) tex.colorSpace = T.SRGBColorSpace;
    tex.wrapS = tex.wrapT = T.RepeatWrapping;
    tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    textureCache.set(key, tex);
    return tex;
  }
  scene.fog = new T.FogExp2(0x889ba5, 0.0098);
  scene.background = new T.Color(0x87999f);
  if (maps.sky) {
    loader.load(maps.sky, sky => {
      sky.mapping = T.EquirectangularReflectionMapping;
      sky.colorSpace = T.SRGBColorSpace;
      if (!window.CinderBackdrop) scene.background = sky;
      scene.environment = sky;
      scene.backgroundIntensity = 0.85;
    });
  }
  if (window.CinderBackdrop) {
    loader.load(window.CinderBackdrop, sky => {
      sky.mapping=T.EquirectangularReflectionMapping;
      sky.colorSpace=T.SRGBColorSpace;
      scene.background=sky;
    });
  }
  const hemisphere = new T.HemisphereLight(0x9dbcd3, 0x393c40, 0.83);
  root.add(hemisphere);
  const sun = new T.DirectionalLight(0xffe0b5, 3.65);
  sun.position.set(31, 23, 1);
  sun.target.position.set(0, 0, -1);
  root.add(sun, sun.target);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -37, right: 37, bottom: -37, top: 37, near: 0.3, far: 112 });
  sun.shadow.bias = -0.00035;
  sun.shadow.normalBias = 0.055;
  const returnLight = new T.DirectionalLight(0x87a1b6, 0.26);
  returnLight.position.set(0, 10, 16);
  root.add(returnLight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  const mat = (color, roughness = 0.76, metalness = 0.15) =>
    new T.MeshStandardMaterial({ color, roughness, metalness });
  function surface(name, tint, roughness, metalness, meters, normalStrength) {
    const material = mat(tint, roughness, metalness);
    material.map = texture(name + 'color', true);
    material.normalMap = texture(name + 'normal');
    material.roughnessMap = texture(name + 'rough');
    material.normalScale.setScalar(normalStrength);
    material.userData.uvMeters = meters;
    return material;
  }
  const concrete = surface('wall', 0xa4aaa7, 0.92, 0.02, 4.4, 0.63);
  const pale = surface('wall', 0xdbdcd3, 0.92, 0.02, 3.8, 0.6);
  const foot = surface('wall', 0x727a76, 0.94, 0.01, 2.8, 0.45);
  const pavement = surface('floor', 0x929998, 0.78, 0.19, 5.8, 0.72);
  const rust = surface('metal', 0x9f8772, 0.71, 0.49, 2.4, 0.6);
  const sheet = surface('iron', 0x929a9e, 0.88, 0.43, 3.4, 0.78);
  const rock = surface('stone', 0x7c8587, 1, 0.02, 6, 1.0);
  const steel = mat(0x404b4f, 0.62, 0.65), ribs = mat(0x30383a, 0.81, 0.54);
  const black = mat(0x202427, 0.83, 0.36), silver = mat(0x8a9493, 0.49, 0.68);
  const casing = surface('metal', 0x83877a, 0.68, 0.42, 1.9, .30), fadedOrange = mat(0xc9692d, 0.75, 0.34);
  const brass = mat(0xa99155, 0.7, 0.5), tar = mat(0x333c3d, 0.96, 0.06);
  const shopPlate = surface('metal',0x6a7980,.81,.42,2.1,.32);
  const grate = mat(0x1f2627, 0.83, 0.46), insulator = mat(0x8faba7, 0.43, 0.35);
  const luminous = c => new T.MeshBasicMaterial({ color: c, toneMapped: false });
  const molten = luminous(0xff7b20), whiteHot = luminous(0xffc775), coolLamp = luminous(0xc9f6ff);
  // Bake static transforms and world-scale UVs once. Repeated hardware then shares a draw call.
  const batches = new Map();
  const boxGeom = new T.BoxGeometry(1, 1, 1);
  const planeGeom = new T.PlaneGeometry(1, 1);
  const cylinderGeoms = new Map();
  const transform = new T.Object3D();
  const p = vec(0,0,0), n = vec(0,0,0), normalMatrix = new T.Matrix3();
  function emit(geo, material, x,y,z, sx,sy,sz, rx=0,ry=0,rz=0, rotation=null) {
    transform.position.set(x,y,z);
    transform.scale.set(sx,sy,sz);
    if (rotation) transform.quaternion.copy(rotation);
    else transform.rotation.set(rx,ry,rz);
    transform.updateMatrix();
    normalMatrix.getNormalMatrix(transform.matrix);
    let batch = batches.get(material);
    if (!batch) {
      batch = {pos:[], nor:[], uv:[], idx:[]};
      batches.set(material, batch);
    }
    const base = batch.pos.length / 3;
    const attr = geo.attributes;
    const meters = material.userData.uvMeters;
    for (let i=0; i<attr.position.count; i++) {
      p.fromBufferAttribute(attr.position,i).applyMatrix4(transform.matrix);
      n.fromBufferAttribute(attr.normal,i).applyMatrix3(normalMatrix).normalize();
      batch.pos.push(p.x,p.y,p.z);
      batch.nor.push(n.x,n.y,n.z);
      if (meters) {
        const ax=Math.abs(n.x), ay=Math.abs(n.y), az=Math.abs(n.z);
        if (ay >= ax && ay >= az) batch.uv.push(p.x/meters,-p.z/meters);
        else if (ax >= az) batch.uv.push(-p.z/meters,p.y/meters);
        else batch.uv.push(p.x/meters,p.y/meters);
      } else batch.uv.push(attr.uv.getX(i), attr.uv.getY(i));
    }
    if (geo.index) for(let i=0; i<geo.index.count; i++) batch.idx.push(base+geo.index.getX(i));
    else for(let i=0; i<attr.position.count; i++) batch.idx.push(base+i);
  }
  function box(x,y,z,w,h,d,m,rx=0,ry=0,rz=0) {
    emit(boxGeom,m,x,y,z,w,h,d,rx,ry,rz);
  }
  function slab(x,z,w,h,d,m) {
    box(x,h/2,z,w,h,d,m);
    obstacles.push({minX:x-w/2,maxX:x+w/2,minZ:z-d/2,maxZ:z+d/2,height:h});
  }
  function cylinder(x,y,z,r,h,m,rx=0,ry=0,rz=0,segments=16) {
    if (!cylinderGeoms.has(segments)) cylinderGeoms.set(segments,new T.CylinderGeometry(1,1,1,segments));
    emit(cylinderGeoms.get(segments),m,x,y,z,r,h,r,rx,ry,rz);
  }
  const yAxis = vec(0,1,0);
  function beam(a,b,width,m,depth=width) {
    const d = vec(b[0]-a[0],b[1]-a[1],b[2]-a[2]);
    const len = d.length();
    if (len < 0.0001) return;
    emit(boxGeom,m,(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2,width,len,depth,0,0,0,new T.Quaternion().setFromUnitVectors(yAxis,d.normalize()));
  }
  function tube(a,b,r,m,segments=12) {
    const d=vec(b[0]-a[0],b[1]-a[1],b[2]-a[2]), len=d.length();
    if (!cylinderGeoms.has(segments)) cylinderGeoms.set(segments,new T.CylinderGeometry(1,1,1,segments));
    emit(cylinderGeoms.get(segments),m,(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2,r,len,r,0,0,0,new T.Quaternion().setFromUnitVectors(yAxis,d.normalize()));
  }
  function cable(a,b,sag,r,m=black) {
    let prev=a;
    for(let j=1;j<=12;j++) {
      const t=j/12;
      const pt=[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t-4*sag*t*(1-t),a[2]+(b[2]-a[2])*t];
      tube(prev,pt,r,m,6); prev=pt;
    }
  }
  function decal(x,y,z,w,h,material,rx=0,ry=0,rz=0) {
    emit(planeGeom,material,x,y,z,w,h,1,rx,ry,rz);
  }
  function canvasMaterial(w,h,paint,transparent=true) {
    const c=document.createElement('canvas');
    c.width=w; c.height=h;
    paint(c.getContext('2d'),w,h);
    const map=new T.CanvasTexture(c);
    map.colorSpace=T.SRGBColorSpace;
    map.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
    const m=new T.MeshBasicMaterial({map, transparent, depthWrite:!transparent, polygonOffset:transparent, polygonOffsetFactor:-1, toneMapped:false});
    return m;
  }
  function scuff(ctx,w,h,count) {
    ctx.save(); ctx.globalCompositeOperation='destination-out';
    for(let i=0;i<count;i++){
      ctx.fillStyle='rgba(0,0,0,'+between(0.16,0.7)+')';
      ctx.fillRect(random()*w,random()*h,between(0.6,4),between(0.6,2.3));
    }
    ctx.restore();
  }
  function lettering(text,ink,fontSize=130) {
    return canvasMaterial(1024,256,(g,w,h)=>{
      g.fillStyle=ink; g.font='900 '+fontSize+'px Arial, sans-serif';
      g.textAlign='center'; g.textBaseline='middle';
      g.fillText(text,w*0.5,h*0.5,w*0.98);
      scuff(g,w,h,3500);
    });
  }
  const hazard = canvasMaterial(512,72,(g,w,h)=>{
    g.fillStyle='#32342e'; g.fillRect(0,0,w,h);
    g.fillStyle='#c5a35f';
    for(let x=-96;x<w+96;x+=72) {
      g.beginPath(); g.moveTo(x,0); g.lineTo(x+36,0); g.lineTo(x-16,h); g.lineTo(x-52,h); g.fill();
    }
    scuff(g,w,h,3200);
  });
  hazard.map.wrapS=T.RepeatWrapping;
  const routePaint = canvasMaterial(64,512,(g,w,h)=>{
    g.fillStyle='#b7a271';g.fillRect(0,0,w,h);scuff(g,w,h,2600);
  });
  const ventTag = lettering('INTAKE  /  07','#b0b8ae');
  const deckTag = lettering('TURBINE HALL','#e6dfc9',130);
  const k17 = lettering('K-17','#ccc9b5',234);
  const yardMark = lettering('K 1 7','#c4c5ab',210);
  const crateTag = lettering('HX  /  7405','#c3c3ae',168);
  const oil = canvasMaterial(256,256,(g,w,h)=>{
    const grad=g.createRadialGradient(128,130,12,128,128,123);
    grad.addColorStop(0,'rgba(8,13,14,.56)');grad.addColorStop(.55,'rgba(13,20,22,.34)');grad.addColorStop(1,'rgba(15,20,19,0)');
    g.fillStyle=grad;g.fillRect(0,0,w,h);
  });
  const stain = canvasMaterial(384,512,(g,w,h)=>{
    for(let i=0;i<260;i++){
      const x=random()*w, len=Math.pow(random(),2)*h, width=between(0.8,5.2);
      const grad=g.createLinearGradient(0,0,0,len+1);
      grad.addColorStop(0,'rgba(35,29,23,'+between(.10,.31)+')');grad.addColorStop(1,'rgba(34,30,24,0)');
      g.fillStyle=grad;g.fillRect(x,0,width,len);
    }
  });
  function groundShadow(x,z,w,d) {decal(x,.019,z,w,d,oil,-PI/2);}
  function finishBatches() {
    for(const [material,b] of batches) {
      const geo=new T.BufferGeometry();
      geo.setAttribute('position',new T.Float32BufferAttribute(b.pos,3));
      geo.setAttribute('normal',new T.Float32BufferAttribute(b.nor,3));
      geo.setAttribute('uv',new T.Float32BufferAttribute(b.uv,2));
      geo.setIndex(b.idx);geo.computeBoundingSphere();
      const mesh=new T.Mesh(geo,material);
      mesh.castShadow=!material.transparent && !material.isMeshBasicMaterial && material!==pavement && material!==rock;
      mesh.receiveShadow=!material.isMeshBasicMaterial;
      root.add(mesh);
    }
    batches.clear();
  }
  // Pavement, expansion joints, trench drains, curb and service lane paint.
  box(0,-.16,0,59,.32,64,pavement);
  for(let z=-25;z<=26;z+=5.2) box(0,.0005,z,46,.004,.025,tar);
  for(let x=-20;x<=20;x+=6.65) box(x,.001,0,.023,.004,51,tar);
  for(const x of [-9.8,9.8]) {
    box(x,.007,0,.42,.02,52,grate);
    for(let z=-25.9;z<26;z+=.18) box(x,.017,z,.37,.018,.043,steel);
    for(const side of [-1,1]) box(x+side*.224,.02,0,.033,.03,52,silver);
  }
  for(const x of [-5.7,5.7]) {
    for(let z=-22;z<23;z+=4.6) decal(x,.014,z,.096,4.44,routePaint,-PI/2);
  }
  for(const z of [-15.2,-14.7,14.8]) {
    for(let x=-5.45;x<=5.4;x+=1.14) decal(x,.017,z,.83,.14,routePaint,-PI/2);
  }
  decal(.08,.025,13.0,3.15,1.8,yardMark,-PI/2);
  
  // The turbine rotunda and its two maintenance shoulders.
  box(0,9,-29.0,23,18,6.4,concrete);
  box(-16,6.05,-28.6,10,12.1,6.0,pale);
  box(16,6.5,-28.6,9.9,13,6.0,concrete);
  for(const x of [-10.9,-8.15,8.15,10.9]) {
    box(x,8.65,-25.47,.58,17.3,1.05,foot);
    box(x,5,-24.94,.26,9.9,.15,steel);
  }
  for(const x of [-12.15,12.15]) {
    box(x,7.5,-26.0,1.12,15.0,2.7,concrete);
    box(x,7.2,-24.64,.62,14.4,.24,steel);
    for(let y=1;y<14;y+=1.18) box(x,y,-24.45,.8,.12,.29,rust);
  }
  box(0,17.85,-26.1,22.6,.62,1.3,steel);
  for(let x=-10.7;x<=11;x+=2.7) {
    box(x,18.68,-26.1,.09,1.58,.08,ribs);
    box(x,15.86,-25.68,2.61,.92,.07,sheet);
  }
  for(const y of [18.5,19.05]) box(0,y,-26.1,22.3,.07,.06,ribs);
  decal(-16.2,8.8,-25.55,7.45,2.4,k17);
  decal(0,15.65,-25.60,10.6,2.12,deckTag);
  for(const x of [-17,-10,-5,2,9,15]) decal(x,6.1,-25.55,3.8,10.5,stain);
  // Deep circular housing with distinct hot annuli, locking dogs and turning vanes.
  const axisY=8.3, axisZ=-24.87;
  const torusCache = new Map();
  function ring(x,y,z,r,t,m,segments=80) {
    const key=[r,t,segments].join('/');
    if(!torusCache.has(key)) torusCache.set(key,new T.TorusGeometry(r,t,8,segments));
    emit(torusCache.get(key),m,x,y,z,1,1,1);
  }
  cylinder(0,axisY,axisZ,6.73,1.56,ribs,PI/2,0,0,80);
  ring(0,axisY,-23.98,6.49,.29,rust);
  ring(0,axisY,-23.79,6.24,.095,silver);
  cylinder(0,axisY,-23.99,5.94,.32,black,PI/2,0,0,80);
  ring(0,axisY,-23.68,5.78,.105,molten);
  ring(0,axisY,-23.74,5.32,.055,whiteHot);
  cylinder(0,axisY,-23.83,5.42,.16,rust,PI/2,0,0,80);
  ring(0,axisY,-23.65,4.66,.33,molten);
  const furnaceGlow = canvasMaterial(512,512,(g,w,h)=>{
    const grad=g.createRadialGradient(256,256,5,256,256,255);
    grad.addColorStop(0,'#ffeb9e'); grad.addColorStop(.18,'#ffbc56');grad.addColorStop(.51,'#ff710f');grad.addColorStop(.77,'#ffab34');grad.addColorStop(1,'#e64508');
    g.fillStyle=grad;g.beginPath();g.arc(256,256,254,0,TAU);g.fill();
    for(let i=0;i<4500;i++){
      const ang=random()*TAU,r0=Math.sqrt(random())*250;
      g.fillStyle='rgba(226,66,0,'+between(.1,.34)+')';
      g.fillRect(256+Math.cos(ang)*r0,256+Math.sin(ang)*r0,between(1,5),between(1,3));
    }
  });
  decal(0,axisY,-23.60,9.1,9.1,furnaceGlow);
  const rotor=new T.Group();rotor.position.set(0,axisY,-23.48);root.add(rotor);
  const rotorPos=[],rotorIdx=[];
  for(let i=0;i<27;i++) {
    const a=i/27*TAU;
    for(const [r,ang,depth] of [[1.18,a,0],[1.42,a+.19,.09],[4.95,a+.55,-.012],[4.89,a+.40,0],[3.1,a+.24,.16]]) {
      rotorPos.push(r*Math.cos(ang),r*Math.sin(ang),depth);
    }
    const b=i*5;rotorIdx.push(b,b+1,b+4,b+1,b+2,b+4,b+2,b+3,b+4,b+3,b,b+4);
  }
  const rotorGeom=new T.BufferGeometry();
  rotorGeom.setAttribute('position',new T.Float32BufferAttribute(rotorPos,3));rotorGeom.setIndex(rotorIdx);rotorGeom.computeVertexNormals();
  const bladeMat=surface('metal',0x665346,.58,.58,1.3,.45);bladeMat.side=T.DoubleSide; if(bladeMat.map){ const uv=[];for(let i=0;i<rotorPos.length;i+=3)uv.push(rotorPos[i]*.41,rotorPos[i+1]*.41);rotorGeom.setAttribute('uv',new T.Float32BufferAttribute(uv,2)); }
  rotor.add(new T.Mesh(rotorGeom,bladeMat));
  cylinder(0,axisY,-23.19,1.62,.53,ribs,PI/2,0,0,48);
  ring(0,axisY,-22.90,1.32,.10,brass,52);
  cylinder(0,axisY,-22.89,1.04,.18,rust,PI/2,0,0,40);
  ring(0,axisY,-22.75,.6,.056,molten,40);
  for(let i=0;i<44;i++){
    const a=i/44*TAU,c=Math.cos(a),s=Math.sin(a);
    box(c*5.98,axisY+s*5.98,-23.46,.42,.53,.36,steel,0,0,a+PI/2);
    cylinder(c*6.5,axisY+s*6.5,-23.64,.093,.18,silver,PI/2,0,a,6);
    if(i%4===0) {
      box(c*6.63,axisY+s*6.63,-23.72,.91,.76,.67,ribs,0,0,a+PI/2);
      box(c*6.65,axisY+s*6.65,-23.36,.43,.13,.04,fadedOrange,0,0,a+PI/2);
    }
  }
  for(let i=0;i<10;i++){
    const a=i/10*TAU;
    cylinder(Math.cos(a)*1.19,axisY+Math.sin(a)*1.19,-22.91,.087,.14,silver,PI/2,0,0,6);
  }
  function point(x,y,z,color,power,distance,decay=2) {
    const l=new T.PointLight(color,power,distance,decay);l.position.set(x,y,z);root.add(l);return l;
  }
  const heatLight=point(-2.2,4.7,-20.3,0xff8436,124,26);
  function makeGlow(color) {
    const g=canvasMaterial(128,128,(ctx)=>{
      const grad=ctx.createRadialGradient(64,64,0,64,64,63);
      grad.addColorStop(0,'rgba('+color+',.43)');grad.addColorStop(.24,'rgba('+color+',.26)');
      grad.addColorStop(.52,'rgba('+color+',.09)');grad.addColorStop(1,'rgba('+color+',0)');
      ctx.fillStyle=grad;ctx.fillRect(0,0,128,128);
    });
    g.blending=T.AdditiveBlending;
    return g;
  }
  const glow=makeGlow('255,108,35'), coldGlow=makeGlow('154,224,255');
  decal(0,axisY,-22.68,20,20,glow);
  // Individual segmented armour plates have bevelled lips around the hot aperture.
  const housing = surface('metal',0xa4a69c,.63,.58,2.1,.42);
  const collarPosition=[],collarUV=[],collarIndex=[];
  const profile=[[5.38,-23.76],[5.46,-23.32],[5.62,-23.23],[6.25,-23.53],[6.40,-23.83],[6.59,-23.94]];
  for(let i=0;i<32;i++) {
    const angle=i/32*TAU, misalign=between(-.026,.026),base=collarPosition.length/3;
    for(let j=0;j<4;j++){
      const a=angle+.006+(TAU/32-.012)*j/3;
      for(const [r,z] of profile){
        collarPosition.push(Math.cos(a)*r,axisY+Math.sin(a)*r,z+misalign);
        collarUV.push(Math.cos(a)*r*.54,Math.sin(a)*r*.54);
      }
    }
    for(let j=0;j<3;j++) for(let k=0;k<profile.length-1;k++){
      const v=base+j*profile.length+k;
      collarIndex.push(v,v+1,v+profile.length,v+profile.length,v+1,v+profile.length+1);
    }
    const a=angle+.094;
    for(const r of [5.62,6.21]) {
      const z=r<6?-23.19:-23.43;
      cylinder(Math.cos(a)*r,axisY+Math.sin(a)*r,z,.082,.089,black,PI/2,0,0,6);
    }
  }
  const collarGeom=new T.BufferGeometry();
  collarGeom.setAttribute('position',new T.Float32BufferAttribute(collarPosition,3));collarGeom.setAttribute('uv',new T.Float32BufferAttribute(collarUV,2));collarGeom.setIndex(collarIndex);collarGeom.computeVertexNormals();
  housing.side=T.DoubleSide;
  const collarMesh=new T.Mesh(collarGeom,housing);collarMesh.receiveShadow=true;root.add(collarMesh);
  const nose=new T.CylinderGeometry(.73,1.16,.64,48);
  emit(nose,shopPlate,0,axisY,-22.71,1,1,1,PI/2);
  cylinder(0,axisY,-22.37,.69,.11,ribs,PI/2,0,0,40);
  cylinder(0,axisY,-22.296,.415,.055,rust,PI/2,0,0,32);
  for(let i=0;i<6;i++) {
    const a=i*TAU/6;
    cylinder(Math.cos(a)*.53,axisY+Math.sin(a)*.53,-22.28,.068,.094,silver,PI/2,0,0,6);
  }
  // Broken, foreshortened furnace reflection on damp service concrete.
  const reflection=canvasMaterial(512,512,(g)=>{
    for(let i=0;i<3200;i++){
      const y=random(), a=random()*TAU;
      const x=.5+Math.cos(a)*(.22+.14*y)+between(-.033,.033);
      const yy=.52+Math.sin(a)*.40+between(-.08,.08);
      g.fillStyle='rgba(255,'+Math.floor(between(91,155))+',33,'+between(.018,.14)+')';
      g.fillRect(x*512,yy*512,between(2,24),between(.4,1.8));
    }
  });
  reflection.blending=T.AdditiveBlending;decal(0,.026,-13.4,12,19.5,reflection,-PI/2);
  function pipeRun(a,b,r,m=rust) {
    tube(a,b,r,m,24);
    const dir=vec(b[0]-a[0],b[1]-a[1],b[2]-a[2]),len=dir.length();
    dir.normalize();
    const count=Math.max(1,Math.floor(len/(3.4+r)));
    for(let i=0;i<=count;i++) {
      const s=Math.min(len-.07,Math.max(.07,i*len/count));
      const x=a[0]+s*dir.x,y=a[1]+s*dir.y,z=a[2]+s*dir.z;
      tube([x-dir.x*.07,y-dir.y*.07,z-dir.z*.07],[x+dir.x*.07,y+dir.y*.07,z+dir.z*.07],r*1.17,steel,24);
    }
  }
  function frame(x,y1,y2,z,w,d) {
    for(const s of [-1,1]) {
      box(x+s*w/2,(y1+y2)/2,z,.25,y2-y1,d,steel);
      box(x+s*w/2,y1+.12,z,.6,.24,d+.24,rust);
    }
    box(x,y2,z,w+.34,.34,d,steel);
    beam([x-w/2,y2-1.3,z],[x-w/2+1.25,y2,z],.16,steel,d*.65);
    beam([x+w/2,y2-1.3,z],[x+w/2-1.25,y2,z],.16,steel,d*.65);
  }
  function rail(a,b,h=1.03) {
    const d=vec(b[0]-a[0],b[1]-a[1],b[2]-a[2]),count=Math.ceil(d.length()/1.85);
    for(let i=0;i<=count;i++) {
      const t=i/count;box(a[0]+d.x*t,a[1]+d.y*t+h*.49,a[2]+d.z*t,.052,h,.052,brass);
    }
    for(const dy of [h*.49,h]) beam([a[0],a[1]+dy,a[2]],[b[0],b[1]+dy,b[2]],.046,brass);
  }
  function ladder(x,y,z,h,side=0) {
    const dx=Math.cos(side)*.28, dz=-Math.sin(side)*.28;
    for(const s of [-1,1]) box(x+s*dx,y+h/2,z+s*dz,.058,h,.058,steel);
    for(let step=.23;step<h;step+=.33) tube([x-dx,y+step,z-dz],[x+dx,y+step,z+dz],.031,silver,8);
  }
  function facade(side) {
    const bx=side*24.8,face=side*20.65,sideRot=side<0?PI/2:-PI/2;
    const bays=side<0 ? [[-16.8,10.4,7.7],[-5.0,10.7,9.6],[10,17.3,6.5],[21,4.6,5.3]] :
      [[-16.8,13.0,8.25],[-4.9,8.4,5.5],[6.6,11.8,7.3],[19.2,10.4,8.8]];
    for(let j=0;j<bays.length;j++) {
      const [z,d,h]=bays[j];
      box(bx,h/2,z,8.1,h,d,concrete);
      box(face+side*.18,.55,z,.37,1.1,d+.02,foot);
      box(face+side*.04,h-.11,z,.65,.28,d+.33,steel);
      box(bx,h+.13,z,8.6,.28,d+.3,sheet);
      for(let zz=z-d/2+.20;zz<z+d/2+.1;zz+=3.3) {
        box(face,h/2,zz,.27,h+.04,.23,foot);
        box(face-side*.17,1.6,zz,.10,2.85,.19,ribs);
      }
      if(h>6) {
        box(face-side*.035,h-1.52,z,.16,1.22,d*.84,black);
        for(let zz=z-d*.4;zz<z+d*.42;zz+=1.22) {
          box(face-side*.15,h-1.53,zz,.04,.92,.98,steel);
          box(face-side*.18,h-1.13,zz,.04,.05,.98,silver);
        }
      }
      // Shutter bays are set between projecting reinforced pilasters.
      box(face-side*.08,1.92,z,.19,3.84,Math.min(d*.59,5.6),ribs);
      for(let yy=.29;yy<3.82;yy+=.19) box(face-side*.198,yy,z,.045,.048,Math.min(d*.56,5.4),steel);
      for(const s of [-1,1]) {
        box(face-side*.19,2.04,z+s*Math.min(d*.305,2.94),.32,4.08,.21,black);
        box(face-side*.31,1.09,z+s*Math.min(d*.305,2.94),.16,1.64,.13,fadedOrange);
      }
      box(face-side*.28,4.08,z,.39,.27,Math.min(d*.66,6.2),steel);
      box(face-side*.38,4.32,z,.33,.28,1.47,ribs);
      box(face-side*.58,4.26,z,.035,.14,1.22,side>0?whiteHot:coolLamp);
      decal(face-side*.61,4.24,z,3.6,2,side>0?glow:coldGlow,0,sideRot);
      decal(face-side*.11,h*.46,z-d*.35,d*.23,h*.82,stain,0,sideRot);
      box(face-side*.13,2.07,z+d*.39,.3,.86,.56,casing);
      for(let slit=0;slit<4;slit++) box(face-side*.3,2.40-slit*.095,z+d*.39,.045,.029,.34,black);
      pipeRun([face-side*.13,.3,z-d*.39],[face-side*.13,h-.35,z-d*.39],.084,rust);
      if(j%2===0) ladder(face-side*.36,0,z+d*.34,h+.8,sideRot);
    }
    // External steam headers and the perimeter service walk.
    const y=side<0?6.05:8.95;
    for(const [dx,r,dy] of [[0,.54,0],[.93,.34,-.02],[-.68,.18,-.04]]) {
      pipeRun([side*19.55+dx,y+dy,-24.2],[side*19.55+dx,y+dy,24.55],r,dx===0?rust:steel);
    }
    for(const z of [-22,-15,-8,0,8,16,23]) {
      box(side*20.12,y-.64,z,2.68,.34,.3,steel);
      beam([side*20.55,y-2.05,z],[side*18.95,y-.68,z],.17,steel);
    }
    box(side*20.25,y+1.18,0,1.85,.23,47,steel);
    rail([side*19.31,y+1.31,-23.4],[side*19.31,y+1.31,23.4]);
  }
  facade(-1);facade(1);
  // North-side manifold feeding the turbine.
  for(const side of [-1,1]) {
    for(let i=0;i<3;i++) {
      const x=side*(9.3+i*2.42), y=2.5+i*.48;
      pipeRun([x,y,-24.86],[x,14.3+i*.5,-24.86],.19+(2-i)*.095,i===2?steel:rust);
      pipeRun([x,14.3+i*.5,-24.86],[x,14.3+i*.5,-29.6],.19+(2-i)*.095,rust);
    }
    box(side*15.8,3.04,-24.55,6.9,.26,1.88,steel);
    rail([side*12.5,3.19,-23.60],[side*19.1,3.19,-23.60]);
    ladder(side*18.5,.12,-23.48,4.03);
    decal(side*15.1,6.0,-25.52,4.1,1.19,ventTag);
    for(let x=13;x<=18;x+=1.58) {
      box(side*x,4.78,-25.53,1.25,1.13,.27,black);
      for(let y=4.34;y<5.28;y+=.14) box(side*x,y,-25.36,1.14,.046,.092,silver,-.22);
    }
  }
  // South gate and overhead entrance gantry.
  box(0,3.75,27.15,43,7.5,4.5,concrete);
  box(0,3.26,24.8,9.0,6.52,.43,steel);
  for(let i=0;i<29;i++) box(0,.2+i*.216,24.53,8.73,.07,.11,ribs);
  for(const x of [-5.03,5.03]) {
    box(x,4.5,24.63,1.03,9.0,1.73,foot);
    box(x,2.4,23.73,.26,4.5,.17,fadedOrange);
  }
  box(0,7.92,24.47,11.05,.84,1.8,steel);
  for(const x of [-13,13]) {
    box(x,5.48,24.75,8.2,2.7,.26,sheet);
    box(x,3.47,24.63,8.0,.4,.5,steel);
    rail([x-4.05,3.7,24.28],[x+4.05,3.7,24.28]);
  }
  // Isolated mast and short pipe bridge keep the central firing lane open.
  const bridgeZ=-8.9;
  frame(-15.65,0,6.2,bridgeZ,4.2,.34);
  for(const st of [-1,1]) {
    box(-17.5,6.35,bridgeZ+st*.83,7.15,.29,.15,steel);
    box(-17.5,7.81,bridgeZ+st*.83,7.15,.16,.14,steel);
    for(let i=0;i<4;i++) {
      const x=-21.0+i*1.75;
      beam([x,6.52,bridgeZ+st*.83],[x+1.75,7.76,bridgeZ+st*.83],.106,rust);
    }
  }
  pipeRun([-21,6.93,bridgeZ],[-13.88,6.93,bridgeZ],.46,rust);
  pipeRun([-13.88,.61,bridgeZ],[-13.88,6.93,bridgeZ],.46,rust);
  cylinder(-13.88,.33,bridgeZ,.82,.66,foot);
  for(const [x,r] of [[-13.88,.83],[-17.75,.3]]) obstacles.push({minX:x-r,maxX:x+r,minZ:bridgeZ-r,maxZ:bridgeZ+r,height:6.9});
  // Interlocking equipment skids and barrier blocks protect separate circulation routes.
  function skid(x,z,w,h,d) {
    slab(x,z,w,h,d,casing);
    const front=z+d/2;
    groundShadow(x,z,w*1.62,d*1.7);
    box(x,h+.05,z,w+.06,.1,d+.05,steel);
    box(x,.19,z,w+.19,.24,d+.12,ribs);
    for(const s of [-1,1]) {
      box(x+s*(w*.47),h*.53,z,.093,h*.96,d+.14,steel);
      box(x,h*.53,z+s*d*.48,w+.12,h*.95,.088,shopPlate);
      for(const c of [-1,1]) {
        box(x+c*(w*.48),h*.48,z+s*d*.5,.13,h*.92,.11,brass);
        box(x+c*(w*.38),h*.5,z+s*(d*.5+.04),.095,h*.89,.10,black);
      }
      box(x,h*.83,z+s*(d*.5+.075),w*.85,.064,.05,silver);
    }
    const vents=Math.floor(w/.21);
    for(let i=0;i<vents;i++) box(x-w*.43+i*(w*.86/(vents-1)),h*.55,front+.055,.065,h*.36,.078,black);
    box(x+.1,h*.37,front+.11,w*.57,.042,.05,silver);
    decal(x,h*.19,front+.125,w*.68,.34,crateTag);
    for(const s of [-1,1]) {
      box(x+s*.42*w,h+.11,z,.13,.09,d*.84,ribs);
      box(x,h+.11,z+s*d*.39,w*.7,.07,.08,ribs);
    }
    for(const s of [-1,1]) beam([x+s*(w*.47+.058),.32,z-d*.39],[x+s*(w*.47+.058),h-.16,z+d*.39],.11,steel);
    box(x-w*.32,h*.82,front+.10,.21,.12,.05,fadedOrange);
  }
  function barrier(x,z,w,d=1.02) {
    const h=1.26;
    obstacles.push({minX:x-w/2,maxX:x+w/2,minZ:z-d/2,maxZ:z+d/2,height:h});
    box(x,.225,z,w,.45,d,foot);
    box(x,.75,z,w-.075,1,d*.66,pale);
    box(x,h,z,w-.1,.09,d*.76,foot);
    for(const s of [-1,1]) decal(x,.89,z+s*(d*.335+.004),w*.92,.265,hazard,0,s===1?0:PI);
    for(const s of [-1,1]) box(x+s*w*.30,.063,z,.38,.13,d+.11,black);
    groundShadow(x,z,w*1.36,d*2.1);
  }
  skid(-11.8,10.8,3.45,2.3,2.22);
  skid(-14.75,12.2,2.13,1.26,1.64);
  skid(11.9,8.8,3.34,1.95,2.35);
  skid(14.2,10.8,2.22,1.43,1.86);
  barrier(-4.9,1.0,4.42);barrier(8.05,-4.0,3.45);
  skid(-11.75,-3.1,3.68,1.76,2.16);
  skid(12.2,-10.1,3.66,2.34,2.34);
  skid(15,-10.5,1.69,1.42,1.61);
  barrier(-7.9,-14.0,3.42);barrier(2.25,-15.4,3.63);
  barrier(13.65,18.3,4.2);barrier(-13.65,18.5,4.2);
  function drum(x,z,r=.45,h=1.24) {
    cylinder(x,h*.51,z,r,h*.98,rust,0,0,0,20);
    for(const y of [.045,h*.31,h*.69,h-.035]) cylinder(x,y,z,r+.025,.062,steel,0,0,0,20);
    cylinder(x,h+.006,z,r*.88,.025,casing);
    cylinder(x+r*.5,h+.04,z+r*.2,.085,.033,steel,0,0,0,8);
    obstacles.push({minX:x-r,maxX:x+r,minZ:z-r,maxZ:z+r,height:h});
  }
  for(const [x,z] of [[-16.8,-17],[-15.9,-17.65],[-16.9,-18.1],[15.4,7.4],[16.36,7.62],[-14.2,9.7]]) drum(x,z);
  // Cast joints, bolts and arrestor hoops on the deep-field stacks.
  function stack(x,z,base,h,r) {
    cylinder(x,base+h/2,z,r,h,sheet,0,0,0,26);
    for(let y=base+.11;y<base+h;y+=2.64) cylinder(x,y,z,r*1.09,.14,steel,0,0,0,28);
    cylinder(x,base+h-.2,z,r*1.16,.4,black,0,0,0,30);
    cylinder(x,base+h-.51,z,r*1.12,.16,rust,0,0,0,30);
    for(let i=0;i<3;i++){
      const a=i*TAU/3;
      tube([x+Math.cos(a)*(r+.11),base,z+Math.sin(a)*(r+.11)],[x+Math.cos(a)*(r+.11),base+h-.9,z+Math.sin(a)*(r+.11)],.065,rust);
    }
  }
  stack(-13.7,-35,12,16,1.35);stack(-18.2,-39.4,6,16.3,1.02);
  stack(21,-43,8,16,1.55);stack(27.1,-36,7,12.7,1.16);stack(-33,12,6,15,1.32);
  for(let i=0;i<14;i++) {
    const x=(i%2===0?-1:1)*between(26,41),z=between(-43,28),h=between(7,16),w=between(3.3,8);
    box(x,h/2,z,w,h,between(4.4,8.6),i%3===0?sheet:foot);
    if(i%3===0) cylinder(x,h+1.3,z,w*.33,2.5,rust);
  }
  function latticeTower(x,z,height,w) {
    for(const i of [-1,1]) for(const j of [-1,1])
      beam([x+i*w/2,0,z+j*w/2],[x+i*w*.32,height,z+j*w*.32],.22,steel);
    const levels=Math.ceil(height/3.7);
    for(let i=0;i<levels;i++) {
      const t=i/levels,u=(i+1)/levels,a=w*(.5-.18*t),b=w*(.5-.18*u);
      for(const s of [-1,1]) {
        beam([x-a,height*t,z+s*a],[x+b,height*u,z+s*b],.12,rust);
        beam([x+a,height*t,z+s*a],[x-b,height*u,z+s*b],.12,rust);
        beam([x+s*a,height*t,z-a],[x+s*b,height*u,z+b],.12,steel);
        beam([x-a,height*t,z+s*a],[x+a,height*t,z+s*a],.13,steel);
      }
    }
  }
  latticeTower(15.4,-38,21.6,3.04);
  const craneZ=-38,craneY=22.1;
  for(const dz of [-.68,.68]) {
    beam([8.3,craneY,craneZ+dz],[39.4,craneY,craneZ+dz],.22,rust);
    beam([8.3,craneY+1.62,craneZ+dz],[39.4,craneY+1.62,craneZ+dz],.18,steel);
    for(let x=8.3;x<39.0;x+=2.6) beam([x,craneY,craneZ+dz],[x+2.6,craneY+1.62,craneZ+dz],.115,steel);
  }
  box(10.16,craneY+.84,craneZ,3.34,2.13,2.15,concrete);
  beam([15.4,craneY,-38],[15.4,27.0,-38],.24,steel);
  cable([15.4,26.8,-38],[36.8,craneY+1.5,-38],.12,.056,steel);
  cable([15.4,26.8,-38],[8.8,craneY+1.5,-38],.06,.064,steel);
  for(const x of [34.3,34.5]) tube([x,craneY,craneZ],[x,12.8,craneZ],.034,black,6);
  box(34.4,12.52,craneZ,.58,.58,.52,fadedOrange);
  latticeTower(-27.4,7.2,18.0,2.75);latticeTower(30.6,25.5,16.3,2.6);
  for(let i=0;i<3;i++) {
    cable([-27.4,17.3+i*.19,6+i*.73],[30.6,15.8+i*.19,24.4+i*.73],3.8+i*.26,.025,black);
    cable([-27.4,17.4+i*.16,6+i*.69],[-16.2,20.1+i*.04,-39.6+i*.82],2.85,.031,black);
  }
  // Talus and steep eroded ridges interrupt the distant industrial roofline.
  const ridge=new T.BufferGeometry(), ridgePositions=[],ridgeUV=[],ridgeIndex=[];
  const rings=12, slices=194;
  const crest=a=>17+4*Math.sin(3*a+.7)+5.3*Math.sin(7*a)+2.7*Math.sin(17*a+.5)+1.7*Math.sin(31*a+.9);
  for(let i=0;i<=slices;i++){
    const a=(i%slices)/slices*TAU, ca=Math.cos(a),sa=Math.sin(a);
    for(let j=0;j<=rings;j++) {
      const t=j/rings,angle=a+Math.sin(a*5+t*6)*.01;
      const radius=45+40*t+3.9*Math.sin(5*a+2*t)+2*Math.sin(17*a+t);
      const height= -5 + crest(a)*Math.pow(t,1.18)+2.5*Math.sin(6*a+t*7)*t+3*Math.sin(11*a+t*4)*t+Math.sin(33*angle+t*12)*2.4*t;
      ridgePositions.push(ca*radius,height,sa*radius);
      ridgeUV.push(a*radius/5.7,height/5.7);
      if(i<slices && j<rings) {
        const k=i*(rings+1)+j;
        ridgeIndex.push(k,k+1,k+rings+1,k+1,k+rings+2,k+rings+1);
      }
    }
  }
  ridge.setAttribute('position',new T.Float32BufferAttribute(ridgePositions,3));ridge.setAttribute('uv',new T.Float32BufferAttribute(ridgeUV,2));ridge.setIndex(ridgeIndex);ridge.computeVertexNormals();
  rock.side=T.DoubleSide;
  const cliffs=new T.Mesh(ridge,rock);root.add(cliffs);
  finishBatches();
  // Small safety fittings at human height give the yard a readable scale in motion.
  function beacon(x,z,height) {
    cylinder(x,height*.5,z,.09,height,steel);
    cylinder(x,.09,z,.24,.18,black);
    cylinder(x,height+.09,z,.18,.24,black);
    cylinder(x,height+.29,z,.119,.22,molten);
    cylinder(x,height+.415,z,.15,.05,casing);
    for(let i=0;i<4;i++) {
      const a=i*PI/2;
      cylinder(x+Math.cos(a)*.145,height+.28,z+Math.sin(a)*.145,.009,.23,steel,0,0,0,6);
    }
  }
  for(const [x,z] of [[-8.0,1.05],[10.48,-3.98],[4.65,-15.38],[-19.2,19.8],[19.25,19.8]]) beacon(x,z,1.24);
  const signage = canvasMaterial(512,360,(g,w,h)=>{
    g.fillStyle='#263033';g.fillRect(0,0,w,h);
    g.fillStyle='#ceaf72';g.fillRect(11,11,w-22,67);
    g.fillStyle='#252b28';g.font='bold 40px Arial';g.fillText('CAUTION',26,61);
    g.fillStyle='#d1d6c9';g.font='bold 39px Arial';g.fillText('GEOTHERMAL',24,140);g.fillText('DISCHARGE',24,188);
    g.fillStyle='#828f8b';for(let i=0;i<7;i++)g.fillRect(25,223+i*13,between(190,432),3);
    g.strokeStyle='#818985';g.lineWidth=4;g.strokeRect(4,4,w-8,h-8);
    scuff(g,w,h,1900);
  },false);
  for(const [x,z] of [[-17.5,6.5],[17,-17]]) {
    box(x,.94,z,.09,1.86,.12,steel);
    box(x,1.93,z,.95,.68,.08,black);
    decal(x,1.93,z+.044,.94,.67,signage);
    obstacles.push({minX:x-.46,maxX:x+.46,minZ:z-.13,maxZ:z+.13,height:2.25});
  }
  finishBatches();
  // Fractured aggregate and rubble collect along the curbs, away from the central lane.
  const gravelA=surface('stone',0x737774,.95,.02,.6,.54),gravelB=surface('stone',0x93958c,.96,.02,.66,.61),gravelGeom=new T.DodecahedronGeometry(1,0);
  for(let i=0;i<670;i++) {
    const side=i%2===0?-1:1,z=between(-24.25,24);
    const x=side*(19.9-Math.pow(random(),2)*2.4-(1+Math.sin(z*.74))*.5);
    const size=.038+Math.pow(random(),3)*.23;
    emit(gravelGeom,i%4===0?gravelB:gravelA,x,.018+size*.09,z,size*between(.59,1.24),size*between(.22,.7),size*between(.54,1.25),random(),random()*PI,random()*.52);
  }
  for(let i=0;i<125;i++){
    const x=between(-17.5,17.5),z=between(-22.5,23),size=between(.02,.094);
    emit(gravelGeom,i%4===0?gravelB:gravelA,x,.003,z,size,size*.3,size*.52,random(),random()*PI,0);
  }
  const cracks=canvasMaterial(512,512,(g)=>{
    g.strokeStyle='#252825';g.lineCap='round';
    function fracture(x,y,a,length,w,n) {
      g.lineWidth=w;g.beginPath();g.moveTo(x,y);
      const count=Math.max(2,Math.floor(length/10));
      for(let i=0;i<count;i++){
        a+=between(-.57,.57);x+=Math.cos(a)*10;y+=Math.sin(a)*10;g.lineTo(x,y);
        if(n>0 && i===Math.floor(count*.57)){
          g.stroke();fracture(x,y,a+between(.64,1.15),length*.55,w*.62,n-1);
          g.lineWidth=w;g.beginPath();g.moveTo(x,y);
        }
      }
      g.stroke();
    }
    fracture(30,312,-.4,425,2.1,3);fracture(235,252,2.8,125,1.1,1);
  });
  for(let i=0;i<52;i++) decal(between(-19.7,19.7),.0235,between(-24,24),between(1.9,5.4),between(2,5.3),cracks,-PI/2,0,random()*TAU);
  // Staggered service tower, gantry and high-pressure pipe elbows.
  box(12.3,10.35,-30.65,4.9,20.7,8.31,pale);
  box(13.2,11.7,-33,2.43,23.4,4.8,concrete);
  for(let i=0;i<10;i++) {
    const x=10.12+i*.495;
    box(x,12.0,-26.22,.20,17.2,.63,concrete);
    box(x,20.83,-26.36,.07,1.4,.075,rust);
  }
  for(const y of [7.0,11.9,16.8]) {
    box(13.7,y,-25.85,8.9,.21,1.34,steel);
    rail([9.27,y+.11,-25.14],[18.13,y+.11,-25.14]);
    beam([11.5,y-1.0,-26.1],[12.5,y-.12,-25.64],.11,steel);
    box(12.3,y+.99,-26.12,.72,.17,.15,whiteHot);
    decal(12.3,y+.99,-25.99,2.45,2.0,glow);
  }
  for(let j=0;j<2;j++){
    const z=-24.15+j*1.06;
    pipeRun([4.8,2.25+j*.17,z],[18.78,2.25+j*.17,z],.37-j*.075,rust);
    pipeRun([18.78,2.25+j*.17,z],[18.78,6.05,z],.37-j*.075,rust);
  }
  function mezzanine(x,z,w,deckY) {
    box(x,deckY,z,w,.24,2.1,steel);
    rail([x-w/2,deckY+.12,z+1.04],[x+w/2,deckY+.12,z+1.04]);
    for(let j=0;j<=4;j++){
      const xx=x-w/2+j*w/4;
      box(xx,deckY-.44,z+1.01,.15,.84,.12,steel);
      if(j<4)beam([xx,deckY-.80,z+1.01],[xx+w/4,deckY-.12,z+1.01],.12,rust);
    }
  }
  // Pressure mains feed into the concrete vault through bolted return elbows.
  for(let j=0;j<2;j++) {
    const z=-24.15+j*1.06,y=2.25+j*.17,r=.37-j*.075;
    pipeRun([4.8,y,z],[4.8,y,-26.34],r,rust);
    for(const x of [8.2,13.0,17.65]) {
      box(x,y*.51,z,.20,y,.21,steel);
      box(x,.13,z,.59,.26,.6,foot);
      box(x,y-r-.065,z,.63,.13,.66,ribs);
    }
  }
  mezzanine(-18.1,-16.1,9.1,8.22);
  mezzanine(-4.6,-24.18,11.4,1.38);
  for(const x of [-9.8,-6.4,-2.5,.57]) {
    box(x,.71,-23.77,.16,1.42,.18,steel);
    box(x,.72,-24.91,.16,1.42,.18,steel);
  }
  for(let i=0;i<14;i++) {
    const x=-20.8+i*.24,y=4.72+i*.245,z=-15.84;
    box(x,y,z,.29,.11,1.23,ribs);
  }
  for(const z of [-16.51,-15.17]) {
    beam([-21,4.43,z],[-17.4,7.98,z],.17,steel);
    beam([-21,5.5,z],[-17.4,9.05,z],.055,brass);
  }
  point(15.7,4.1,-15.35,0xffa55d,39,12);
  point(-17.85,4.08,6.10,0xffa464,33,13);
  finishBatches();

  // Low-resolution reflection of the actual yard. The projected puddles share one
  // render target and reuse it between updates. Reprojection keeps the surface stable.
  const wetTarget = new T.WebGLRenderTarget(512,320,{minFilter:T.LinearFilter,magFilter:T.LinearFilter,depthBuffer:true});
  const reflectionCamera=new T.PerspectiveCamera();
  const textureMatrix = new T.Matrix4(), floorNormal=vec(0,1,0);
  const clipPlane=new T.Plane(),clip4=new T.Vector4(),q4=new T.Vector4();
  const cameraPos=vec(0,0,0),dir=vec(0,0,0),reflectedUp=vec(0,0,0),rotationMat=new T.Matrix4();
  const wetMat = new T.ShaderMaterial({
    transparent:true, depthWrite:false,
    uniforms:{mirror:{value:wetTarget.texture},mirrorMatrix:{value:textureMatrix},strength:{value:1}},
    vertexShader:'uniform mat4 mirrorMatrix;varying vec4 proj;varying vec3 wp;void main(){vec4 w=modelMatrix*vec4(position,1.);wp=w.xyz;proj=mirrorMatrix*w;gl_Position=projectionMatrix*viewMatrix*w;}',
    fragmentShader:`
      uniform sampler2D mirror;uniform float strength;varying vec4 proj;varying vec3 wp;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.13,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
      void main(){
        vec2 p=wp.xz;
        float field=.42*noise(p*vec2(.38,.23)+8.4)+.28*noise(p*.89)+.17*noise(p*1.98)+.09*noise(p*5.22)+.04*noise(p*15.);
        float wetness=smoothstep(.47,.595,field);
        if(wetness<.01 || strength<.01)discard;
        float ripple=noise(p*vec2(3.8,20.))+noise(p*vec2(6.2,26.))*.45;
        vec2 uv=proj.xy/proj.w;
        uv+=vec2((noise(p*13.)-.5)*.0026,(ripple-.74)*.0040);
        vec3 col=texture2D(mirror,uv).rgb;
        float edge=1.-max(0.,normalize(cameraPosition-wp).y);
        gl_FragColor=vec4(col*vec3(.82,.90,.94),strength*wetness*(.075+.56*pow(edge,2.5)));
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
  });
  const puddles=new T.Mesh(new T.PlaneGeometry(44,50),wetMat);
  puddles.rotation.x=-PI/2;puddles.position.y=.0155;puddles.renderOrder=1;root.add(puddles);
  let lastCapture=-10000;
  puddles.onBeforeRender=(r,world,camera)=>{
    if(!camera.isPerspectiveCamera||camera===reflectionCamera) return;
    wetMat.uniforms.strength.value=r.shadowMap.enabled?1:0;
    if(!r.shadowMap.enabled) return;
    const now=performance.now();
    if(now-lastCapture<110) return;
    cameraPos.setFromMatrixPosition(camera.matrixWorld);
    if(cameraPos.y<=.03) return;
    lastCapture=now;
    camera.getWorldDirection(dir);dir.reflect(floorNormal);
    reflectionCamera.position.copy(cameraPos);reflectionCamera.position.y=.04-cameraPos.y;
    rotationMat.extractRotation(camera.matrixWorld);
    reflectedUp.copy(camera.up).applyMatrix4(rotationMat).reflect(floorNormal);
    reflectionCamera.up.copy(reflectedUp);
    reflectionCamera.lookAt(dir.add(reflectionCamera.position));
    reflectionCamera.near=camera.near;reflectionCamera.far=camera.far;
    reflectionCamera.updateMatrixWorld();
    reflectionCamera.projectionMatrix.copy(camera.projectionMatrix);
    textureMatrix.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1);
    textureMatrix.multiply(reflectionCamera.projectionMatrix).multiply(reflectionCamera.matrixWorldInverse);
    clipPlane.setFromNormalAndCoplanarPoint(floorNormal,vec(0,.045,0)).applyMatrix4(reflectionCamera.matrixWorldInverse);
    clip4.set(clipPlane.normal.x,clipPlane.normal.y,clipPlane.normal.z,clipPlane.constant);
    const m=reflectionCamera.projectionMatrix.elements;
    q4.set((Math.sign(clip4.x)+m[8])/m[0],(Math.sign(clip4.y)+m[9])/m[5],-1,(1+m[10])/m[14]);
    clip4.multiplyScalar(2/clip4.dot(q4));m[2]=clip4.x;m[6]=clip4.y;m[10]=clip4.z+1;m[14]=clip4.w;
    const target=r.getRenderTarget(),shadowUpdate=r.shadowMap.autoUpdate,camVisible=camera.visible;
    puddles.visible=false;camera.visible=false;r.shadowMap.autoUpdate=false;
    try {
      r.setRenderTarget(wetTarget);r.state.buffers.depth.setMask(true);r.clear();r.render(world,reflectionCamera);
    } finally {
      r.setRenderTarget(target);r.shadowMap.autoUpdate=shadowUpdate;camera.visible=camVisible;puddles.visible=true;
    }
  };
  function hash2(x,y) {
    const h=Math.sin(x*297.23+y*514.19)*43758.5453;
    return h-Math.floor(h);
  }
  function noise2(x,y) {
    const ix=Math.floor(x),iy=Math.floor(y);
    let fx=x-ix,fy=y-iy;
    fx=fx*fx*(3-2*fx);fy=fy*fy*(3-2*fy);
    return (hash2(ix,iy)*(1-fx)+hash2(ix+1,iy)*fx)*(1-fy)+(hash2(ix,iy+1)*(1-fx)+hash2(ix+1,iy+1)*fx)*fy;
  }
  const steamCanvas=document.createElement('canvas');
  steamCanvas.width=steamCanvas.height=128;
  const sg=steamCanvas.getContext('2d'),pixels=sg.createImageData(128,128);
  for(let y=0;y<128;y++) for(let x=0;x<128;x++) {
    const u=(x-64)/64,v=(y-64)/64;
    const n0=noise2(5+u*2.8,6+v*2.8),n1=noise2(18+u*6.7,9+v*6.7),n2=noise2(u*14.8,v*14.8);
    const envelope=Math.max(0,1-u*u-v*v);
    const density=Math.max(0,(.67*n0+.26*n1+.07*n2)*1.6-.30);
    const i=(x+y*128)*4;
    pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=255;
    pixels.data[i+3]=Math.min(255,Math.pow(envelope,1.65)*density*255);
  }
  sg.putImageData(pixels,0,0);
  const smokeTexture=new T.CanvasTexture(steamCanvas);
  const plumes=[
    [-13.7,28,-35,3.9,15,2.4,.42],[-18.2,22.0,-39.4,2.55,13,2,.37],
    [21,24.0,-43,3.0,15,2.6,.40],[-13.88,7.0,-8.9,.46,3.5,1.7,.30],
    [5.55,.42,-22.65,.83,4.1,1.4,.42],[-6.55,.62,-22.65,.8,4.5,1,.41]
  ];
  const perPlume=9,cloudCount=plumes.length*perPlume;
  const cloudGeometry=new T.InstancedBufferGeometry();
  cloudGeometry.index=planeGeom.index;
  cloudGeometry.setAttribute('position',planeGeom.getAttribute('position'));
  cloudGeometry.setAttribute('uv',planeGeom.getAttribute('uv'));
  const cloudData={};
  for(const [name,count] of [['offset',3],['scale',1],['opacity',1],['angle',1]]) {
    cloudData[name]=new T.InstancedBufferAttribute(new Float32Array(cloudCount*count),count).setUsage(T.DynamicDrawUsage);
    cloudGeometry.setAttribute(name,cloudData[name]);
  }
  cloudGeometry.instanceCount=cloudCount;
  const cloudMat=new T.ShaderMaterial({
    uniforms:{cloud:{value:smokeTexture}},transparent:true,depthWrite:false,side:T.DoubleSide,
    vertexShader:'attribute vec3 offset;attribute float scale,opacity,angle;varying vec2 st;varying float al;void main(){st=uv;al=opacity;vec2 q=mat2(cos(angle),-sin(angle),sin(angle),cos(angle))*position.xy;vec4 mv=modelViewMatrix*vec4(offset,1.);mv.xy+=q*scale;gl_Position=projectionMatrix*mv;}',
    fragmentShader:'uniform sampler2D cloud;varying vec2 st;varying float al;void main(){gl_FragColor=vec4(vec3(.62,.67,.67),texture2D(cloud,st).a*al);}'
  });
  const clouds=new T.Mesh(cloudGeometry,cloudMat);clouds.frustumCulled=false;clouds.renderOrder=3;root.add(clouds);
  const phases=Array.from({length:cloudCount},()=>random());
  const emberCount=68,emberGeometry=new T.BufferGeometry(),emberPos=new Float32Array(emberCount*3);
  const embers=Array.from({length:emberCount},()=>({x:between(-5.1,5.1),z:between(-23,-18.4),s:between(.24,.72),phase:random(),drift:between(-.31,.31)}));
  emberGeometry.setAttribute('position',new T.BufferAttribute(emberPos,3).setUsage(T.DynamicDrawUsage));
  const emberPoints=new T.Points(emberGeometry,new T.PointsMaterial({color:0xffac53,size:.055,transparent:true,opacity:.85,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false}));
  emberPoints.frustumCulled=false;root.add(emberPoints);
  const ashGeometry=new T.BufferGeometry(),ashCount=84,ashPositions=new Float32Array(ashCount*3);
  const ashSeeds=Array.from({length:ashCount},()=>[between(-21,21),between(0,9),between(-25,25),between(.34,.79)]);
  ashGeometry.setAttribute('position',new T.BufferAttribute(ashPositions,3).setUsage(T.DynamicDrawUsage));
  const ashMat=new T.PointsMaterial({color:0xc4ced0,size:.025,transparent:true,opacity:.36,depthWrite:false});
  const ash=new T.Points(ashGeometry,ashMat);ash.frustumCulled=false;root.add(ash);
  let elapsed=0;
  function update(dt,t) {
    elapsed = Number.isFinite(t)?t:elapsed+(Number.isFinite(dt)?dt:.016);
    rotor.rotation.z=elapsed*.29;
    heatLight.intensity=124+8*Math.sin(elapsed*6.51)+3*Math.cos(elapsed*15.8);
    for(let i=0;i<cloudCount;i++) {
      const [x,y,z,initial,height,travel,alpha]=plumes[Math.floor(i/perPlume)];
      const p=((i%perPlume+phases[i]*.25)/perPlume+elapsed*(initial>1?.077:.151))%1;
      const swell=initial*(1.41+3.22*p);
      cloudData.offset.setXYZ(i,x+travel*p*p+Math.sin(i*3.7+p*7)*.20*swell,y+height*p,z+Math.cos(i*2.2+p*4)*.16*swell);
      cloudData.scale.setX(i,swell);
      cloudData.angle.setX(i,phases[i]*TAU+p*(i%2?.56:-.48));
      cloudData.opacity.setX(i,alpha*1.42*Math.min(1,p*10)*(1-p*p));
    }
    Object.values(cloudData).forEach(a=>a.needsUpdate=true);
    for(let i=0;i<emberCount;i++) {
      const e=embers[i], life=(elapsed*e.s*.3+e.phase)%1;
      emberPos[i*3]=e.x+Math.sin(4*life+i)*.38+e.drift*life;
      emberPos[i*3+1]=.45+9.35*life;emberPos[i*3+2]=e.z+life*.79;
    }
    for(let i=0;i<ashCount;i++){
      const a=ashSeeds[i];
      ashPositions[i*3]=((a[0]+21+elapsed*a[3]*.37)%42)-21+.22*Math.sin(elapsed*.42+i);
      ashPositions[i*3+1]=9-((a[1]+elapsed*a[3]*.52)%9);
      ashPositions[i*3+2]=a[2]+.27*Math.sin(elapsed*.6+i*.8);
    }
    ashGeometry.attributes.position.needsUpdate=true;
    emberGeometry.attributes.position.needsUpdate=true;
  }
  update(0,0);
  return {obstacles,bounds,spawn,enemySpawns,update,dispose:()=>wetTarget.dispose()};
};
