import * as THREE from 'three';

// All horizontal coordinates and elevation values are in metres above chart datum.
const clamp = (a, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, a));
const mix = (a, b, t) => a + (b - a) * t;
function smooth(a, b, x) {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}
function hash(x, z) {
  let h = Math.imul(x | 0, 1597334677) ^ Math.imul(z | 0, 3812015801);
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  return ((h ^ (h >>> 13)) >>> 0) / 4294967295;
}
function noise(x, z) {
  const ix = Math.floor(x), iz = Math.floor(z);
  let fx = x - ix, fz = z - iz;
  fx *= fx * (3 - 2 * fx);
  fz *= fz * (3 - 2 * fz);
  return mix(mix(hash(ix, iz), hash(ix + 1, iz), fx),
    mix(hash(ix, iz + 1), hash(ix + 1, iz + 1), fx), fz);
}
function curve(knots, z) {
  if (z <= knots[0][0]) return knots[0][1];
  for (let i = 1; i < knots.length; i++) {
    const b = knots[i];
    if (z > b[0]) continue;
    const a = knots[i - 1], before = knots[Math.max(0, i - 2)], after = knots[Math.min(i + 1, knots.length - 1)];
    const span = b[0] - a[0], t = (z - a[0]) / span;
    const startTangent = span * (b[1] - before[1]) / (b[0] - before[0]);
    const endTangent = span * (after[1] - a[1]) / (after[0] - a[0]);
    return a[1] + t * (startTangent + t * (3 * (b[1] - a[1]) - 2 * startTangent - endTangent
      + t * (2 * (a[1] - b[1]) + startTangent + endTangent)));
  }
  return knots[knots.length - 1][1];
}

const westLine = [[-157,96],[-123,81],[-96,65],[-77,49],[-59,50],[-38,25],[-23,-17],[-5,-24],
  [13,-14],[31,2],[42,5],[51,0],[61,-16],[69,-23],[77,-14],[89,13],[100,15],[112,10],
  [137,-10],[153,-34],[179,-29],[207,-4],[228,33],[239,68]];
const eastLine = [[-157,97],[-132,126],[-105,139],[-74,126],[-41,158],[-12,162],[19,143],
  [43,137],[71,157],[98,155],[129,168],[157,143],[186,124],[211,113],[234,81],[239,68]];
const spine = [[-4,1],[3,0],[11,-.8],[22,4.2],[35,12],[48,17],[56,15],[66,12.8],
  [77,15.8],[87,24],[96,32],[110,35],[133,25],[147,21],[163,29],[178,45],[192,55]];
const westShore = z => curve(westLine, z) + 3.4 * (noise(1.2, z * .135) - .5) + 1.2 * Math.sin(z * .62);
const eastShore = z => curve(eastLine, z) + 3.8 * (noise(18.1, z * .068) - .5);
export const trailX = z => curve(spine, z);

const routeSegments = [];
function addSegment(a, b) {
  const dx = b.x - a.x, dz = b.y - a.y;
  routeSegments.push({ x: a.x, z: a.y, dx, dz, inv: 1 / (dx * dx + dz * dz) });
}
function addBranch(points) {
  const route = new THREE.SplineCurve(points.map(p => new THREE.Vector2(...p)));
  const sampled = route.getPoints(points.length * 4);
  for (let i = 1; i < sampled.length; i++) addSegment(sampled[i - 1], sampled[i]);
}
for (let z = -4; z < 192; z += 3) {
  const b = Math.min(192, z + 3);
  addSegment(new THREE.Vector2(trailX(z), z), new THREE.Vector2(trailX(b), b));
}
addBranch([[trailX(81),81],[12,76],[5,72],[-4,70],[-12,68],[-16.5,69.5]]);
addBranch([[trailX(55),55],[21,53],[30,54],[39,52],[45,47],[52,44],[59,41]]);
addBranch([[trailX(15),15],[4,10],[8,5],[9,0]]);
const segmentDistance2 = (x, z, segment) => {
  const dx = x - segment.x, dz = z - segment.z;
  const t = clamp((dx * segment.dx + dz * segment.dz) * segment.inv);
  return (dx - t * segment.dx) ** 2 + (dz - t * segment.dz) ** 2;
};
const routeCells = new Map();
export function trailDistance(x, z) {
  const cx = Math.floor(x / 16), cz = Math.floor(z / 16), key = cx + 16384 * cz;
  let nearest = routeCells.get(key);
  if (!nearest) {
    const mx = cx * 16 + 8, mz = cz * 16 + 8;
    let best = Infinity;
    for (const s of routeSegments) best = Math.min(best, segmentDistance2(mx, mz, s));
    const radius2 = (Math.sqrt(best) + 23) ** 2;
    nearest = routeSegments.filter(s => segmentDistance2(mx, mz, s) <= radius2);
    routeCells.set(key, nearest);
  }
  let distance2 = Infinity;
  for (const s of nearest) distance2 = Math.min(distance2, segmentDistance2(x, z, s));
  return Math.sqrt(distance2);
}

const bell = (x, z, cx, cz, rx, rz) => Math.exp(-(((x - cx) / rx) ** 2 + ((z - cz) / rz) ** 2));
export function heightAt(x, z) {
  const west = x - westShore(z), east = eastShore(z) - x;
  const ends = Math.min(z + 153, 236 - z);
  if (Math.min(west, east, ends) < -18) return -7.8;
  const coarse = noise(x * .036, z * .036);
  const detail = noise(x * .137 + 33.4, z * .137);
  let plateau = 25 + 3.8 * coarse + 1.9 * detail + 1.5 * Math.sin(z * .061 + x * .026);
  plateau += 9.3 * bell(x,z,37,103,37,31) + 17 * bell(x,z,69,140,44,41)
    + 11 * bell(x,z,88,-54,45,49) - 3.8 * bell(x,z,11,42,22,25);
  plateau = mix(plateau, 28, 1 - smooth(11, 22, Math.hypot(x - 3, z + 1)));
  plateau = mix(plateau, 27.6, 1 - smooth(4.6, 10.5, Math.hypot(x - 59, z - 40)));
  plateau = mix(plateau, 27.2, 1 - smooth(2, 8, Math.hypot(x + 15, z - 69)));
  const lip = west + .77 * (detail - .5);
  const westRise = .15 * smooth(-13,-4,lip) + .22 * smooth(-7.4,-4.9,lip)
    + .45 * smooth(-3.9,.4,lip) + .12 * smooth(.9,2.8,lip) + .06 * smooth(2.2,7,lip);
  // East-facing coves descend through a broad sand shelf; the Atlantic side breaks in strata.
  const cove = 30 + 18 * Math.sin(z * .052) + 9 * Math.cos(z * .024);
  const eastRise = .18 * smooth(-9, 8, east) + .82 * smooth(1, cove + 19, east);
  const shore = Math.min(westRise, eastRise, smooth(-11, 15, ends));
  return mix(-5.5 + 1.8 * detail, plateau, shore);
}

function terrainGeometry() {
  const step = 1.22, x0 = -54, z0 = -158;
  const cols = Math.ceil(233 / step) + 1, rows = Math.ceil(404 / step) + 1;
  const positions = new Float32Array(cols * rows * 3), biome = new Float32Array(cols * rows * 3);
  const indices = [];
  for (let r = 0; r < rows; r++) {
    const z = z0 + r * step;
    for (let c = 0; c < cols; c++) {
      const x = x0 + c * step, i = r * cols + c, h = heightAt(x,z);
      positions.set([x,h,z], i * 3);
      const apron = Math.min(Math.hypot(x,z) - 3.2, Math.hypot(x-8,z+2.7) - 3,
        Math.hypot(x-59,z-40) - 2.3);
      biome.set([Math.min(18, trailDistance(x,z), apron), noise(x * .042, z * .042),
        smooth(12, 5, h) * smooth(-5, 5, x - westShore(z))], i*3);
      if (c && r && h > -6.8) {
        const a = i - cols - 1, b = i - cols, d = i - 1;
        indices.push(a,d,b,b,d,i);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(positions,3));
  g.setAttribute('capeBiome', new THREE.BufferAttribute(biome,3));
  g.setIndex(indices); g.computeVertexNormals(); g.computeBoundingSphere();
  return g;
}

const assetRoot = './assets/land/';
const surfaces=new Map();
function texture(name, color = false) {
  if(surfaces.has(name)) return surfaces.get(name);
  const tex = new THREE.TextureLoader().load(assetRoot + name + '.jpg');
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  if (color) tex.colorSpace = THREE.SRGBColorSpace;
  surfaces.set(name,tex);
  return tex;
}
function makeTerrainMaterial() {
  const textures = {};
  for (const key of ['heath', 'trail', 'stone']) {
    textures[key + 'Albedo'] = { value: texture(key + '-color',true) };
    textures[key + 'Normal'] = { value: texture(key + '-normal') };
  }
  textures.moorAlbedo = {value:texture('moor-color',true)};
  textures.lichenAlbedo = {value:texture('lichen-color',true)};
  const mat = new THREE.MeshStandardMaterial({roughness:.91,metalness:0});
  mat.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, textures);
    shader.vertexShader = shader.vertexShader.replace('#include <common>', `#include <common>
      attribute vec3 capeBiome;
      varying vec3 coastWorld;
      varying vec3 coastN;
      varying vec3 biome;
    `).replace('#include <worldpos_vertex>', `#include <worldpos_vertex>
      vec4 coastP = vec4(transformed,1.);
      #ifdef USE_INSTANCING
        coastP = instanceMatrix * coastP;
      #endif
      coastWorld = (modelMatrix * coastP).xyz;
      coastN = inverseTransformDirection(transformedNormal, viewMatrix);
      biome = capeBiome;
    `);
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `#include <common>
      varying vec3 coastWorld;
      varying vec3 coastN;
      varying vec3 biome;
      uniform sampler2D heathAlbedo, heathNormal, trailAlbedo, trailNormal, stoneAlbedo, stoneNormal;
      uniform sampler2D moorAlbedo,lichenAlbedo;
      vec3 coastPerturb(vec3 vn,vec2 uv,vec3 sampleN) {
        vec3 q0 = dFdx(-vViewPosition), q1 = dFdy(-vViewPosition);
        vec2 st0=dFdx(uv),st1=dFdy(uv);
        vec3 q1p=cross(q1,vn),q0p=cross(vn,q0);
        vec3 T=q1p*st0.x+q0p*st1.x, B=q1p*st0.y+q0p*st1.y;
        float scale=inversesqrt(max(max(dot(T,T),dot(B,B)),1e-13));
        return normalize(vn*sampleN.z+(T*sampleN.x+B*sampleN.y)*scale);
      }`);
    shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `
      vec3 P=coastWorld, geomN=normalize(coastN);
      vec2 sodUV=mat2(.95,.312,-.312,.95)*P.xz*.43;
      vec2 roadUV=mat2(.86,-.51,.51,.86)*P.xz*.43;
      vec2 stoneUV=vec2((P.x*.38+P.z)*.13,(P.y+P.x*.11-P.z*.07)*.19);
      vec2 ledgeUV=mat2(.84,.55,-.55,.84)*P.xz*.19;
      float up=abs(geomN.y), ledge=smoothstep(.42,.88,up);
      float rock=max(1.-smoothstep(.66,.94,up),1.-smoothstep(3.,8.4,P.y));
      rock=max(rock,step(biome.z,-.5));
      float beach=max(0.,biome.z)*smoothstep(.56,.89,up);
      float grit=texture2D(trailAlbedo,roadUV*.4).g;
      float trail=1.-smoothstep(.95,2.12,biome.x+(grit-.21)*2.7+.27*sin(P.z*1.73+P.x*.53));
      trail=max(trail*(1.-rock),beach);
      rock *= 1.-beach;
      vec2 moorUV=mat2(.65,.76,-.76,.65)*P.xz*.073;
      vec3 heathC=texture2D(heathAlbedo,sodUV).rgb;
      vec3 moorC=texture2D(moorAlbedo,moorUV).rgb;
      vec3 rockGarden=texture2D(lichenAlbedo,ledgeUV*.62).rgb;
      float peat=smoothstep(.12,.88,biome.y+.16*(moorC.g-.1));
      vec3 turfTint=mix(vec3(.40,.65,.48),vec3(.96,.92,.65),peat);
      vec3 turf=mix(heathC,moorC*.72,.38)*turfTint*(.77+1.65*moorC.g);
      float scar=smoothstep(.63,.91,biome.y+.20*(1.-up)+.67*(moorC.r-.07));
      turf=mix(turf,rockGarden*vec3(.73,.78,.72),scar*.76);
      vec3 trailC=texture2D(trailAlbedo,roadUV).rgb*vec3(1.19,1.08,.88);
      vec3 color=mix(turf,trailC*(.80+.85*grit),trail);
      vec3 cliffC=mix(texture2D(stoneAlbedo,stoneUV).rgb,texture2D(stoneAlbedo,ledgeUV).rgb,ledge);
      cliffC*=mix(vec3(.66,.64,.58),vec3(1.03,.98,.87),biome.y);
      color=mix(color,cliffC,rock);
      float wet=smoothstep(-.3,3.5,P.y);
      diffuseColor.rgb*=color*mix(vec3(.39,.48,.48),vec3(1.),wet);
    `).replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
      vec3 landB=texture2D(heathNormal,sodUV).xyz*2.-1.;
      vec3 pathB=texture2D(trailNormal,roadUV).xyz*2.-1.;
      vec3 rockB=texture2D(stoneNormal,stoneUV).xyz*2.-1.;
      vec3 ledgeB=texture2D(stoneNormal,ledgeUV).xyz*2.-1.;
      landB.xy*=.68;pathB.xy*=.72;rockB.xy*=.91;ledgeB.xy*=.9;
      vec3 grassN=coastPerturb(normal,sodUV,landB);
      vec3 pathN=coastPerturb(normal,roadUV,pathB);
      vec3 stoneN=mix(coastPerturb(normal,stoneUV,rockB),coastPerturb(normal,ledgeUV,ledgeB),ledge);
      normal=normalize(mix(mix(grassN,pathN,trail),stoneN,rock));
    `);
  };
  return mat;
}

function bedrock(g, variation = .5) {
  const count = g.getAttribute('position').count, data = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) data.set([20,variation,-1],i*3);
  g.setAttribute('capeBiome',new THREE.BufferAttribute(data,3));
  return g;
}
function strataBoulder(seed) {
  const geo = new THREE.IcosahedronGeometry(1,2);
  const p = geo.getAttribute('position');
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    // Joint planes and sediment bedding give stones a fractured, asymmetrical silhouette.
    const a = noise(x * 3.4 + z + seed*7, z * 2.2 + y*2.3);
    const b = noise(x * 2 - y*.7, z * 3 + seed*3);
    const radius = .89 + .3 * (a - .5) + .21 * (b - .5);
    p.setXYZ(i, x*radius + y*.15 + (b-.5)*.12,
      clamp(y * radius + x*.09, -.71 + .05 * b, .71 + .15 * a + x*.13),
      z*radius + (y+.2)*.11);
  }
  geo.computeVertexNormals();
  return bedrock(geo,.25 + seed*.09);
}
function seaArch() {
  const positions = [], indices = [], around = 18, spans = 56;
  const profile=new THREE.SplineCurve([[-17,-4],[-15.6,3.4],[-13.9,8.8],[-11.7,14],[-8,16.6],
    [-3,17.5],[3,16.25],[7.1,15.2],[10,12.55],[10.85,9.4],[11.3,4],[13.5,-4]].map(p=>new THREE.Vector2(...p)));
  for (let i=0;i<=spans;i++) {
    const t = i/spans, angle = Math.PI*t, pos=profile.getPoint(t), tangent=profile.getTangent(t);
    const {x,y}=pos,dx=tangent.x,dy=tangent.y;
    const radius=2.65 + 2.4 * Math.cos(angle)**2 + .69 * Math.sin(angle*3+.5);
    for (let j=0;j<around;j++) {
      const a=2*Math.PI*j/around, nx=Math.cos(a), nz=Math.sin(a);
      const weathering=(noise(t*27+nz,nx*4+5) - .5)*1.8
        + (noise(t*11,nz*3+8)-.5)*1.9 + .39*Math.sin(y*2.7+nx*.7);
      const r=radius+weathering;
      positions.push(x-dy*nx*r,y+dx*nx*r,
        1.9*Math.sin(angle*2.2)+nz*(r*1.35+.55*Math.cos(angle*3)));
      if (i < spans) {
        const k=i*around+j, n=i*around+(j+1)%around;
        indices.push(k,n,k+around,n,n+around,k+around);
      }
    }
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geo.setIndex(indices);geo.computeVertexNormals();
  return bedrock(geo,.48);
}
const reefCells=new Map(), reefCellSize=16;
const reefKey=(x,z)=>Math.floor(x/reefCellSize)+16384*Math.floor(z/reefCellSize);
function registerReef(x,y,z,rx,ry,rz,yaw) {
  if(y-ry>1.2 || y+ry < -3) return;
  const reef={x,y,z,rx,ry,rz,c:Math.cos(yaw),s:Math.sin(yaw)};
  const extent=Math.max(rx,rz)*1.9;
  for(let iz=Math.floor((z-extent)/reefCellSize);iz<=Math.floor((z+extent)/reefCellSize);iz++) {
    for(let ix=Math.floor((x-extent)/reefCellSize);ix<=Math.floor((x+extent)/reefCellSize);ix++) {
      const key=ix+16384*iz;
      if(!reefCells.has(key)) reefCells.set(key,[]);
      reefCells.get(key).push(reef);
    }
  }
}
export function reefSeabedAt(x,z) {
  let h=heightAt(x,z);
  const local=reefCells.get(reefKey(x,z));
  if(h>4 || !local) return h;
  for(const b of local) {
    const dx=x-b.x,dz=z-b.z;
    const u=(dx*b.c-dz*b.s)/b.rx,v=(dx*b.s+dz*b.c)/b.rz, d2=u*u+v*v;
    if(d2>3.61) continue;
    const profile=d2<1 ? b.y+b.ry*Math.sqrt(1-d2)
      : b.y-(Math.sqrt(d2)-1)*(b.ry*1.8+4.1);
    h=Math.max(h,profile);
  }
  return h;
}
function seeded(seed) {
  return () => {
    seed = (Math.imul(seed,1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
function addExposedRocks(group,mat) {
  reefCells.clear();
  const random = seeded(183048), batches = Array.from({length:5},()=>[]);
  const stone = (x,y,z,sx,sy,sz) => {
    const obj = new THREE.Object3D();
    obj.position.set(x,y,z); obj.scale.set(sx,sy,sz);
    obj.rotation.set((random()-.5)*.54,random()*6.28,(random()-.5)*.34);
    registerReef(x,y,z,sx*.83,sy*.7,sz*.8,obj.rotation.y);
    const size = Math.max(sx,sy,sz);
    const level = size > 2.5 ? 3+Math.floor(random()*2) : Math.floor(random()*3);
    obj.updateMatrix(); batches[level].push(obj.matrix);
  };
  // Storm-detached slabs in clusters, with solitary pinnacles farther offshore.
  const reefs=[[-40,36,15],[-49,17,14],[-69,-17,12],[-45,-56,12],[-89,71,9],
    [2,-49,11],[7,101,10],[-43,144,11],[168,17,8],[144,-77,9],[167,80,6]];
  for(const [cx,cz,extent] of reefs) {
    for(let i=0;i<18;i++) {
      const a=random()*Math.PI*2, len=extent*Math.sqrt(random());
      const x=cx+Math.cos(a)*len, z=cz+Math.sin(a)*len*.64;
      const s=.65+(1-len/extent)*5.3+random()*1.7;
      stone(x,-.3+random()*.8,z,s*(1+random()),s*(.65+random()*.55),s*(.7+random()*.5));
    }
  }
  stone(-52,.7,3,5.6,12.3,4.8);
  stone(-56,.7,1,4.8,7.4,6.3);
  stone(-60,-.2,-28,5.4,12.5,4.6);
  stone(-106,.7,-35,5.2,10.8,5.5);
  const arch = new THREE.Mesh(seaArch(),mat);
  arch.name='Sea arch · western sound';
  arch.position.set(-74,0,-22);arch.rotation.y=.31;
  for(const foot of [-16.5,12.4]) {
    registerReef(-74+Math.cos(.31)*foot,-.15,-22-Math.sin(.31)*foot,4.9,5.7,6.2,.31);
  }
  arch.castShadow = arch.receiveShadow = true;group.add(arch);
  // Riprap at the foot of the sea cliffs and erratics on exposed turf.
  for(let i=0;i<480;i++) {
    const z=-119 + random()*337, x=westShore(z)-7.7-random()*11, s=.45+3.3*random()**2;
    stone(x,Math.max(-.9,heightAt(x,z))-.47*s,z,s*1.6,s*(.74+random()*.65),s*1.4);
  }
  let cluster=0;
  while (cluster<85) {
    const x=-32+random()*185, z=-102+random()*293, h=heightAt(x,z);
    if(h<2 || x-westShore(z)<7 || trailDistance(x,z)<4.1 || Math.hypot(x-2,z+1)<18 || Math.hypot(x-59,z-40)<9) continue;
    cluster++;
    const size=.3+random()**2*2.4;
    for(let i=0;i<3+random()*5;i++) {
      const bx=x+(random()-.5)*size*5,bz=z+(random()-.5)*size*5,s=size*(.24+random()*.9);
      if(trailDistance(bx,bz)>2.8) stone(bx,heightAt(bx,bz)-s*.36,bz,s*1.3,s*.71,s);
    }
  }
  // Loose, bedded gravel breaks up the boundary where the wind wears the trail into the turf.
  for(let i=0;i<390;i++) {
    const z=3+random()*166, sign=random()<.5?-1:1, x=trailX(z)+sign*(.6+random()**.6*2.7);
    const s=.035+random()**2*.145;
    stone(x,heightAt(x,z)-s*.12,z,s*1.32,s*.44,s);
  }
  const collected=batches.map((transforms,i)=>{
    const rocks = new THREE.InstancedMesh(strataBoulder(i),mat,transforms.length);
    rocks.name='Jointed shore rock '+(i+1);
    transforms.forEach((m,k)=>rocks.setMatrixAt(k,m));
    rocks.receiveShadow=true;rocks.castShadow=i>=3;
    rocks.computeBoundingSphere();group.add(rocks);
    return rocks;
  });
  loadDetail('shore-stones',()=>addBoulderScans(collected));
}

async function loadDetail(key,load) {
  THREE.DefaultLoadingManager.itemStart(key);
  try { await load(); }
  catch(err) { console.warn(key+' detail unavailable',err); }
  finally { THREE.DefaultLoadingManager.itemEnd(key); }
}
async function readScan(name) {
  const res = await fetch(assetRoot+name+'.mesh');
  if(!res.ok) throw new Error(name+' '+res.status);
  const buf = await res.arrayBuffer(), meta = new Uint32Array(buf,0,2);
  return {verts:meta[0],triangles:new Uint16Array(buf,8+meta[0]*32,meta[1]),floats:new Float32Array(buf,8,meta[0]*8)};
}
async function addBoulderScans(rocks) {
  const scans=await Promise.all([readScan('boulder-low'),readScan('boulder-full')]);
  const map=texture('boulder-color',true),normalMap=texture('boulder-normal');
  map.flipY=normalMap.flipY=false;
  const mat=new THREE.MeshStandardMaterial({map,normalMap,roughness:.91,color:0xe6e6da});
  mat.normalScale.set(.78,.78);
  const lods=scans.map(({verts,triangles,floats})=>{
    const g=new THREE.BufferGeometry(),p=new Float32Array(verts*3), uv=new Float32Array(verts*2);
    for(let i=0;i<verts;i++) {
      p.set(floats.subarray(i*8,i*8+3),i*3);
      uv.set(floats.subarray(i*8+6,i*8+8),i*2);
    }
    g.setAttribute('position',new THREE.BufferAttribute(p,3));
    g.setAttribute('uv',new THREE.BufferAttribute(uv,2)); g.setIndex(new THREE.BufferAttribute(triangles,1));
    g.computeBoundingBox();
    const mid=g.boundingBox.getCenter(new THREE.Vector3()),dims=g.boundingBox.getSize(new THREE.Vector3());
    g.translate(-mid.x,-mid.y,-mid.z);g.scale(1.9/dims.x,1.48/dims.y,1.89/dims.z);
    g.computeVertexNormals();g.computeBoundingSphere();
    return g;
  });
  rocks.forEach((mesh,i)=>{
    mesh.geometry.dispose();
    mesh.geometry=lods[i<3?0:1];mesh.material=mat;
    mesh.computeBoundingSphere();
  });
}
async function addCliffScan(group) {
  const {verts,triangles,floats}=await readScan('coastal-cliff');
  const map=texture('cliff-scan-color',true), normalMap=texture('cliff-scan-normal');
  map.flipY=normalMap.flipY=false;
  const mat=new THREE.MeshStandardMaterial({map,normalMap,roughness:.96,color:0xdad8cd,side:THREE.DoubleSide});
  mat.normalScale.set(.76,.76);
  const beds=texture('stone-color',true), relief=texture('stone-normal');
  mat.onBeforeCompile=s=>{
    s.uniforms.bedLayers={value:beds};s.uniforms.bedRelief={value:relief};
    s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 marineRock;')
      .replace('#include <begin_vertex>','#include <begin_vertex>\nmarineRock=position;');
    s.fragmentShader=s.fragmentShader.replace('#include <common>',
      '#include <common>\nvarying vec3 marineRock;uniform sampler2D bedLayers,bedRelief;')
      .replace('#include <map_fragment>',`#include <map_fragment>
        vec2 bedsUV=vec2(marineRock.z*.17+marineRock.x*.055,
          marineRock.y*.22+marineRock.z*.018+.11*sin(marineRock.z*.16));
        vec3 silts=texture2D(bedLayers,bedsUV).rgb;
        float strataLum=dot(silts,vec3(.24,.56,.20));
        diffuseColor.rgb=mix(diffuseColor.rgb,silts*vec3(.76,.74,.66),.38)*(.74+strataLum*2.65);
        diffuseColor.rgb*=mix(vec3(.57,.66,.67),vec3(1.),smoothstep(.3,3.4,marineRock.y));
      `).replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
        vec3 bedding=texture2D(bedRelief,bedsUV).xyz*2.-1.;
        vec3 q1=dFdx(-vViewPosition),q2=dFdy(-vViewPosition);
        vec2 t1=dFdx(bedsUV),t2=dFdy(bedsUV);
        vec3 du=cross(q2,normal)*t1.x+cross(normal,q1)*t2.x;
        vec3 dv=cross(q2,normal)*t1.y+cross(normal,q1)*t2.y;
        float amp=inversesqrt(max(1e-12,max(dot(du,du),dot(dv,dv))));
        normal=normalize(normal+(du*bedding.x+dv*bedding.y)*amp*.61);
      `);
  };
  // Fit each scan to the bend and height of its headland, burying the ends in the
  // underlying rock. This keeps the undercuts and overhangs of the photographed coast.
  const bins=40, top=new Float32Array(bins).fill(-Infinity),bottom=new Float32Array(bins).fill(Infinity);
  const uOf=x=>clamp((x+45.06)/91.99);
  const bin=u=>clamp(Math.floor(u*bins),0,bins-1);
  const uv=new Float32Array(verts*2);
  for(let i=0;i<verts;i++) {
    const k=bin(uOf(floats[i*8])), h=floats[i*8+1];
    top[k]=Math.max(top[k],h);bottom[k]=Math.min(bottom[k],h);
    uv.set(floats.subarray(i*8+6,i*8+8),i*2);
  }
  const cuts=[-117,-52,-4,48,103,164,219];
  for(let part=1;part<cuts.length;part++) {
    const p=new Float32Array(verts*3), normals=new Float32Array(verts*3);
    for(let i=0;i<verts;i++) {
      const j=i*8,u=uOf(floats[j]), f=u*(bins-1),cell=Math.floor(f);
      const upper=mix(top[cell],top[Math.min(cell+1,bins-1)],f-cell);
      const lower=mix(bottom[cell],bottom[Math.min(cell+1,bins-1)],f-cell);
      const v=clamp((floats[j+1]-lower)/Math.max(4,upper-lower));
      const z=mix(cuts[part-1]-1.7,cuts[part]+1.7,u);
      const lip=mix(curve(westLine,z),westShore(z),.14+.86*v*v);
      const topY=heightAt(lip+7,z)-.40;
      const seam=1-smooth(0,.065,Math.min(u,1-u));
      const embed=6*seam+2.8*smooth(.75,1.,v);
      const x=lip+mix(-7.2,.58,v)-floats[j+2]*.71+embed;
      p.set([x,mix(-1.9,topY,v),z],3*i);
      const coastSlope=(curve(westLine,z+.45)-curve(westLine,z-.45))/.9;
      const slope=mix(coastSlope,(westShore(z+.45)-westShore(z-.45))/.9,.14+.86*v*v);
      const scale=(cuts[part]-cuts[part-1])/92;
      const nx=-floats[j+5]/.71,ny=floats[j+4]*(upper-lower)/(topY+1.9);
      const nz=floats[j+3]/scale-slope*nx;
      const l=Math.hypot(nx,ny,nz)||1;
      normals.set([nx/l,ny/l,nz/l],3*i);
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));
    g.setAttribute('normal',new THREE.BufferAttribute(normals,3));g.setAttribute('uv',new THREE.BufferAttribute(uv,2));
    g.setIndex(new THREE.BufferAttribute(triangles,1));g.computeBoundingSphere();
    const cliff=new THREE.Mesh(g,mat);cliff.castShadow=cliff.receiveShadow=true;cliff.name='Surveyed Atlantic face '+part;
    group.add(cliff);
  }
}

export function createLand(scene) {
  const group = new THREE.Group();
  group.name='Meridian headland';
  const mat = makeTerrainMaterial();
  const terrain=new THREE.Mesh(terrainGeometry(),mat);
  terrain.name='Clifftop moor and East Cove';
  terrain.castShadow = terrain.receiveShadow = true;
  group.add(terrain);
  addExposedRocks(group,mat);
  scene.add(group);
  loadDetail('Atlantic-cliff',()=>addCliffScan(group));
}
