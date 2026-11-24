import * as THREE from 'three';
import { trailDistance } from './land.js';

const TAU = Math.PI * 2;
const TILE = 24;
const GRID = 12;
const ATLAS_RATIOS = [2.80, 2.98, 2.29, 2.79, 2.29, 2.62, 2.49, 2.61, .79, 1.21, .90, .82, 1.95, 1.82, 1, 1.22];
const smooth = (v) => { v = Math.max(0, Math.min(1, v)); return v * v * (3 - 2 * v); };

function random(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ a >>> 15, a | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function clumpField(x, z) {
  return .5 + .19 * Math.sin(x * .067 + Math.sin(z * .16)) +
    .17 * Math.cos(z * .087 - x * .049) + .13 * Math.sin(x * .23 + z * .16);
}

function planted(x, z) {
  return !(x > -6.2 && x < 21.2 && z > -11.3 && z < 7.2) &&
    !(x > 51.8 && x < 67.2 && z > 33.8 && z < 44.2) &&
    (x + 15) ** 2 + (z - 69) ** 2 > 8;
}

// Each clump retains a different photographic silhouette, with a bowed
// cross-section that keeps the outer blades seated when seen at an angle.
function clumpShape() {
  const shape = new THREE.BufferGeometry();
  const points = [], uvs = [], indices = [];
  for (let y = 0; y <= 2; y++) {
    for (let x = 0; x <= 2; x++) {
      const u = x / 2, v = y / 2;
      points.push(u - .5, v, x === 1 ? .07 * (1 - v) : -.09 * (1 - v));
      uvs.push(u, v);
    }
  }
  for (let y = 0; y < 2; y++) {
    for (let x = 0; x < 2; x++) {
      const i = y * 3 + x;
      indices.push(i, i + 1, i + 3, i + 1, i + 4, i + 3);
    }
  }
  shape.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  shape.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  shape.setIndex(indices);
  return shape;
}

// These separate folded blades break up the silhouette close to the camera.
function bladeShape() {
  const r = random(58820484);
  const points = [], colors = [], indices = [];
  for (let blade = 0; blade < 24; blade++) {
    const angle = r() * TAU, sin = Math.sin(angle), cos = Math.cos(angle);
    const rise = .42 + r() * .58, reach = .15 + r() * .50;
    const foot = .02 + r() * .15, width = .009 + r() * .014;
    const rx = (r() - .5) * 1.85, rz = (r() - .5) * 1.7;
    const shade = .73 + r() * .32;
    const start = points.length / 3;
    for (let k = 0; k <= 2; k++) {
      const t = k / 2, h = rise * (1.35 * t - .35 * t * t);
      const side = width * (1 - t) ** .68;
      const d = foot + reach * t * t;
      for (let j = k === 2 ? 0 : -1; j <= (k === 2 ? 0 : 1); j++) {
        points.push(rx + cos * d - sin * side * j, h + (j === 0 ? .005 * (1 - t) : 0), rz + sin * d + cos * side * j);
        const fold = (j < 0 ? .70 : j > 0 ? .87 : 1.05) * shade;
        colors.push(fold * (.19 + .36 * t), fold * (.22 + .29 * t), fold * (.063 + .15 * t));
      }
    }
    for (let j = 0; j < 2; j++) {
      const n = start + j;
      indices.push(n, n + 1, n + 3, n + 1, n + 4, n + 3, n + 3, n + 4, start + 6);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.setIndex(indices);
  return geo;
}

const commonVertex = `
  #include <common>
  #include <fog_pars_vertex>
  uniform float clockTime;
  uniform vec3 sunDirection;
  uniform vec3 sunTint;
  attribute vec3 root;
  attribute vec4 form;
  attribute vec4 climate;
  varying float vLight;
  varying float vHeight;
  varying vec3 vIrradiance;
  vec3 irradiance(vec2 slope) {
    vec3 normal = normalize(vec3(-slope.x, 1., -slope.y));
    float direct = max(0., dot(normal, sunDirection));
    float daylight = smoothstep(.1,.62,sunDirection.y);
    vec3 sky = mix(vec3(.20,.24,.25),vec3(.40,.48,.51),daylight);
    return sky + sunTint * direct * 1.08;
  }
  vec2 breeze(vec2 world, float h, float phase) {
    float gust = sin(dot(world, vec2(.153, .091)) - clockTime * 1.72);
    float ripple = sin(dot(world, vec2(.415, -.213)) - clockTime * 2.83 + phase * 1.3);
    return vec2(.091 * (.36 + gust * .58 + ripple * .30), .024 * (gust - ripple)) * h * h;
  }
`;

function makeMaterials(atlas) {
  const commonUniforms = () => THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {
    clockTime: {value: 0},sunDirection:{value:new THREE.Vector3(-.7,.6,-.4)},sunTint:{value:new THREE.Color(0xffe4b8)}
  }]);
  const clumps = new THREE.ShaderMaterial({
    uniforms: {...commonUniforms(), atlas: {value: atlas}, reach: {value: 94}},
    fog: true, side: THREE.DoubleSide,
    vertexShader: commonVertex + `
      varying vec2 vAtlas;
      varying float vSpecies;
      varying vec2 vDepthPatch;
      uniform float reach;
      void main() {
        vec3 anchor = (modelMatrix * vec4(root, 1.)).xyz;
        vec2 view = cameraPosition.xz - anchor.xz;
        view /= max(length(view), .001);
        vec2 right = vec2(view.y, -view.x) * (form.w > 3.14159 ? -1. : 1.);
        float h = position.y;
        vec3 world = anchor;
        float eyeDistance = distance(cameraPosition.xz, anchor.xz);
        float taper = 1. - smoothstep(reach * .52, reach, eyeDistance);
        world.xz += (right * position.x + view * position.z) * form.x;
        world.xz += breeze(anchor.xz, h, form.w) * form.y * taper;
        world.y += h * form.y * taper + dot(world.xz-anchor.xz, climate.zw) * (1.-h) * (1.-h);
        float id = form.z;
        vec2 cell = vec2(mod(id, 4.), 3. - floor(id * .25));
        vAtlas = (cell + mix(vec2(.001), vec2(.999), uv)) * .25;
        vLight = climate.x;
        vHeight = h;
        vSpecies = id;
        vDepthPatch = vec2(eyeDistance,climate.y);
        vIrradiance = irradiance(climate.zw);
        vec4 mvPosition = viewMatrix * vec4(world, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }
    `,
    fragmentShader: `
      #include <common>
      #include <fog_pars_fragment>
      uniform sampler2D atlas;
      varying vec2 vAtlas;
      varying float vHeight;
      varying float vLight;
      varying float vSpecies;
      varying vec2 vDepthPatch;
      varying vec3 vIrradiance;
      void main() {
        vec4 plant = texture2D(atlas, vAtlas);
        if (plant.a < .16) discard;
        vec3 rgb = plant.rgb;
        rgb = pow(rgb, vec3(.88));
        if (vSpecies > 13.9 && vSpecies < 14.1) rgb *= vec3(.56, .49, .36);
        if (vSpecies > 11.8 && vSpecies < 13.2) {
          float petal = smoothstep(.040, .15, rgb.r - rgb.b) * smoothstep(.05, .18, rgb.r);
          rgb = mix(rgb, vec3(.82, .77, .60), petal * .66);
        }
        rgb *= vec3(1.08, 1.08, .97) * vLight * mix(.81, 1.17, smoothstep(.0, .72, vHeight));
        float distant = smoothstep(9.,66.,vDepthPatch.x);
        vec3 meadowTone = mix(vec3(.115,.132,.068),vec3(.19,.18,.099),vDepthPatch.y);
        rgb = mix(rgb, meadowTone, distant * .78) * vIrradiance;
        gl_FragColor = vec4(rgb, 1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }
    `
  });
  const blades = new THREE.ShaderMaterial({
    uniforms: commonUniforms(), fog: true, side: THREE.DoubleSide, vertexColors: true,
    vertexShader: commonVertex + `
      varying vec3 vColor;
      void main() {
        vec3 anchor = (modelMatrix * vec4(root, 1.)).xyz;
        float a = form.w;
        vec2 lateral = mat2(cos(a), -sin(a), sin(a), cos(a)) * position.xz;
        vec3 world = anchor + vec3(lateral.x * form.x, position.y * form.y, lateral.y * form.x);
        world.xz += breeze(anchor.xz, position.y, form.w) * form.y;
        world.y += dot(lateral * form.x, climate.zw);
        vColor = color * climate.x * irradiance(climate.zw) * mix(vec3(.64, .76, .59), vec3(.91, .77, .57), climate.y);
        vec4 mvPosition = viewMatrix * vec4(world, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }
    `,
    fragmentShader: `
      #include <common>
      #include <fog_pars_fragment>
      varying vec3 vColor;
      void main() {
        gl_FragColor = vec4(vColor, 1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }
    `
  });
  return {clumps, blades};
}

function instanceBatch(shape, data, mat, ox, oz, low, high) {
  if (!data.root.length) return null;
  const geometry = new THREE.InstancedBufferGeometry();
  geometry.setIndex(shape.index);
  for (const [name, attr] of Object.entries(shape.attributes)) geometry.setAttribute(name, attr);
  for (const [name, size] of [['root', 3], ['form', 4], ['climate', 4]]) {
    geometry.setAttribute(name, new THREE.InstancedBufferAttribute(new Float32Array(data[name]), size));
  }
  geometry.instanceCount = data.root.length / 3;
  geometry.boundingBox = new THREE.Box3(new THREE.Vector3(-2, low - .2, -2), new THREE.Vector3(TILE + 2, high + 2, TILE + 2));
  geometry.boundingSphere = geometry.boundingBox.getBoundingSphere(new THREE.Sphere());
  const mesh = new THREE.Mesh(geometry, mat);
  mesh.position.set(ox, 0, oz);
  mesh.matrixAutoUpdate = false;
  mesh.updateMatrix();
  return mesh;
}

function makeTile(tx, tz, heightAt, shapes, materials, meadow) {
  const ox = tx * TILE, oz = tz * TILE;
  const ground = new Float32Array((GRID + 1) ** 2);
  let high = -Infinity, low = Infinity;
  for (let j = 0; j <= GRID; j++) {
    for (let i = 0; i <= GRID; i++) {
      const h = heightAt(ox + i * TILE / GRID, oz + j * TILE / GRID);
      ground[j * (GRID + 1) + i] = h;
      high = Math.max(high, h); low = Math.min(low, h);
    }
  }
  const meshes = [];
  if (high < 2.45) return meshes;
  const rand = random(Math.imul(tx + 1734, 73856093) ^ Math.imul(tz + 991, 19349663));
  const blank = () => ({root: [], form: [], climate: []});
  const cards = blank(), blades = blank();
  for (let j = 0; j < GRID; j++) {
    for (let i = 0; i < GRID; i++) {
      const n = j * (GRID + 1) + i;
      const a = ground[n], b = ground[n + 1], c = ground[n + GRID + 1], d = ground[n + GRID + 2];
      const dx = ((b - a) + (d - c)) * GRID / (2 * TILE), dz = ((c - a) + (d - b)) * GRID / (2 * TILE);
      const slope = Math.hypot(dx, dz);
      if (slope > 1.04 || Math.max(a, b, c, d) < 2.45) continue;
      const cx = ox + (i + .5) * TILE / GRID, cz = oz + (j + .5) * TILE / GRID;
      const strip = trailDistance(cx, cz);
      if (strip < .58) continue;
      const patch = clumpField(cx, cz), density = (.34 + .66 * patch) * (1 - smooth((slope - .5) / .54));
      const flowers = clumpField(cx * .66 + 66, cz * .77 - 54);
      const scrub = clumpField(cx * .73 - 181, cz * .69 + 28);
      const sunshine = THREE.MathUtils.clamp(1.38 + .33 * dx + .18 * dz, 1.06, 1.70);
      for (let k = 0; k < 20; k++) {
        if (rand() > density) continue;
        const u = rand(), v = rand();
        const lx = (i + u) * TILE / GRID, lz = (j + v) * TILE / GRID, x = lx + ox, z = lz + oz;
        if (!planted(x, z)) continue;
        const trail = strip > 4.4 ? strip : trailDistance(x, z);
        if (trail < 1.97 + .25 * rand()) continue;
        const h = a * (1-u)*(1-v) + b*u*(1-v) + c*(1-u)*v + d*u*v;
        if (h < 2.45 + .75 * rand()) continue;
        let species, height;
        const pick = rand();
        if (pick < .058 && flowers > .72) {
          species = 15; height = .18 + .15 * rand();
        } else if (pick < .12 && flowers < .39) {
          species = 12 + (rand() > .48 ? 1 : 0); height = .22 + .14 * rand();
        } else if (pick > .967 && scrub > .67 && trail > 3.2) {
          species = 8 + Math.floor(rand() * 4); height = .34 + .44 * rand();
        } else if (pick < .115 && patch > .49) {
          species = 14; height = .38 + .28 * rand();
        } else {
          const choice = rand();
          species = choice < .22 ? 0 : choice < .40 ? 2 : Math.floor(rand() * 8);
          height = (.27 + .36 * rand()) * (.58 + .94 * patch);
        }
        height *= .72 + .28 * smooth((trail - 1.98) / 1.15);
        const width = height * ATLAS_RATIOS[species] * (.88 + .48 * rand());
        const phase = TAU * rand(), light = sunshine * (.84 + .24 * rand());
        cards.root.push(lx, h - .045, lz);
        cards.form.push(width, height, species, phase);
        cards.climate.push(light, patch, dx, dz);
        if (species < 8 && rand() < .19) {
          blades.root.push(lx + .08, h - .035, lz + .07);
          blades.form.push(height * 1.65, height * (.70 + .42 * rand()), 0, phase);
          blades.climate.push(.67 + light * .22, patch, dx, dz);
        }
      }
    }
  }
  for (const [shape, records, material] of [[shapes.clumps, cards, materials.clumps], [shapes.blades, blades, materials.blades]]) {
    const mesh = instanceBatch(shape, records, material, ox, oz, low, high);
    if (mesh) { meadow.add(mesh); meshes.push(mesh); }
  }
  return meshes;
}

function makeGulls(scene) {
  const flock = new THREE.Group();
  flock.name = '海崖银鸥';
  scene.add(flock);
  const feathers = new THREE.MeshLambertMaterial({vertexColors: true, side: THREE.DoubleSide});
  const body = new THREE.SphereGeometry(1, 10, 7);
  const birds = [];
  const positions = [], colors = [], indices = [];
  for (const side of [-1, 1]) {
    const start = positions.length / 3;
    const shape = [[.036, .055, .115, .285], [.27, .123, .135, .23], [.52, .135, .042, .156], [.68, .067, -.095, .068], [.81, .008, -.221, .006]];
    for (let i = 0; i < shape.length; i++) {
      const [x,y,front,chord] = shape[i];
      for (let row = 0; row < 3; row++) {
        positions.push(side * x, y + (row === 1 ? .021 : 0), front - chord * row / 2);
        const gray = i < 3 ? [0x92999b,0xabb0b0,0xced1ca][row] : i === 3 && row === 0 ? 0x898e90 : 0x33393d;
        const color = new THREE.Color(gray);
        colors.push(color.r, color.g, color.b);
      }
      if (i > 0) {
        for (let row = 0; row < 2; row++) {
          const n = start + (i - 1) * 3 + row;
          if (side > 0) indices.push(n, n+3, n+1, n+1, n+3, n+4);
          else indices.push(n, n+1, n+3, n+1, n+4, n+3);
        }
      }
    }
  }
  const wingEnd = positions.length;
  function addBody(col, x,y,z, sx,sy,sz) {
    const offset = positions.length / 3;
    const points = body.attributes.position, color = new THREE.Color(col);
    for (let i = 0; i < points.count; i++) {
      positions.push(x+points.getX(i)*sx, y+points.getY(i)*sy, z+points.getZ(i)*sz);
      colors.push(color.r,color.g,color.b);
    }
    for (const index of body.index.array) indices.push(index+offset);
  }
  addBody(0xe6e3d7, 0,.018,.02, .074,.076,.245);
  addBody(0xe6e3d7, 0,.063,.212, .049,.055,.080);
  addBody(0xc5a76d, 0,.052,.294, .027,.022,.071);
  addBody(0x242728,.044,.075,.239,.008,.008,.008);
  addBody(0x242728,-.044,.075,.239,.008,.008,.008);
  addBody(0xe6e3d7, 0,.007,-.208, .068,.017,.117);
  body.dispose();
  const original = Float32Array.from(positions);
  const hubs = [[-30, 35, 39], [-21, 100, 38], [-8, -29, 46]];
  const rng = random(9332);
  for (let i = 0; i < 8; i++) {
    const bird = new THREE.Group();
    const wingGeometry = new THREE.BufferGeometry();
    wingGeometry.setAttribute('position', new THREE.BufferAttribute(original.slice(), 3).setUsage(THREE.DynamicDrawUsage));
    wingGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    wingGeometry.setIndex(indices); wingGeometry.computeVertexNormals();
    const wings = new THREE.Mesh(wingGeometry, feathers);
    bird.add(wings);
    bird.scale.setScalar(.84 + rng() * .28);
    flock.add(bird);
    const hub = hubs[i % hubs.length];
    birds.push({bird, wingGeometry, x:hub[0]+rng()*12, z:hub[1]+rng()*14, y:hub[2]+rng()*7, rx:18+rng()*31, rz:22+rng()*22, phase:rng()*TAU, rate:.085+rng()*.051});
  }
  return (time) => {
    for (const b of birds) {
      const a = time * b.rate + b.phase;
      const speedX = -Math.sin(a) * b.rx, speedZ = Math.cos(a) * b.rz;
      b.bird.position.set(b.x + Math.cos(a) * b.rx, b.y + 2.3 * Math.sin(a * 1.7 + b.phase), b.z + Math.sin(a) * b.rz);
      b.bird.rotation.set(-.028 * Math.cos(a * 1.7), Math.atan2(speedX, speedZ), -.12 - .14 * Math.sin(a + b.phase), 'YXZ');
      const active = smooth((Math.sin(time * .63 + b.phase * 1.91) - .31) * 3.15);
      const swing = .04 * Math.sin(time * 1.3 + a) + active * .43 * Math.sin(time * 8.6 + b.phase);
      const p = b.wingGeometry.attributes.position;
      for (let i = 0; i < wingEnd; i += 3) {
        const x = original[i], reach = Math.abs(x);
        const angle = swing + .11 * active * reach * Math.sin(time * 8.6 + b.phase - 1.4);
        p.array[i] = x * Math.cos(angle);
        p.array[i+1] = original[i+1] + reach * Math.sin(angle);
      }
      p.needsUpdate = true;
    }
  };
}

export function createNature(scene, heightAt, options = {}) {
  const meadow = new THREE.Group();
  meadow.name = '迎风草甸';
  scene.add(meadow);
  const atlas = new THREE.TextureLoader().load(new URL('../assets/nature/meadow.webp', import.meta.url).href);
  atlas.colorSpace = THREE.SRGBColorSpace;
  atlas.anisotropy = 4;
  const materials = makeMaterials(atlas);
  const sunlight = scene.children.find(o => o.isDirectionalLight);
  const sunDirection = new THREE.Vector3();
  const shapes = {clumps: clumpShape(), blades: bladeShape()};
  const animateGulls = makeGulls(scene);
  const tiles = new Map();
  let queued = [], lastX = Infinity, lastZ = Infinity, reach = 94, detailReach = 28;
  function setQuality(q) {
    const low = q === 'low' || q === 'performance' || q === 0;
    const medium = q === 'medium' || q === 'balanced' || q === 1;
    reach = low ? 51 : medium ? 72 : 94;
    materials.clumps.uniforms.reach.value = reach;
    detailReach = low ? 0 : medium ? 21 : 28;
    lastX = Infinity;
  }
  if (options.quality != null) setQuality(options.quality);
  function update(time, position) {
    animateGulls(time);
    materials.clumps.uniforms.clockTime.value = time;
    materials.blades.uniforms.clockTime.value = time;
    if (sunlight) {
      sunDirection.subVectors(sunlight.position,sunlight.target.position).normalize();
      for (const mat of [materials.clumps,materials.blades]) {
        mat.uniforms.sunDirection.value.copy(sunDirection);
        mat.uniforms.sunTint.value.copy(sunlight.color).multiplyScalar(sunlight.intensity/3.15);
      }
    }
    const x = position?.x ?? 32, z = position?.z ?? 96;
    if (Math.hypot(x - lastX, z - lastZ) > 5) {
      lastX = x; lastZ = z;
      const range = reach + TILE * .71;
      queued = [];
      for (let tz = Math.floor((z-range)/TILE); tz <= Math.floor((z+range)/TILE); tz++) {
        for (let tx = Math.floor((x-range)/TILE); tx <= Math.floor((x+range)/TILE); tx++) {
          const distance = Math.hypot((tx + .5) * TILE - x, (tz + .5) * TILE - z);
          const key = tx + ',' + tz;
          if (distance < range && !tiles.has(key)) queued.push({tx, tz, key, distance});
        }
      }
      queued.sort((a,b) => b.distance - a.distance);
      for (const tile of tiles.values()) {
        const distance = Math.hypot((tile.tx + .5) * TILE - x, (tile.tz + .5) * TILE - z);
        if (tile.meshes[0]) tile.meshes[0].visible = distance < range;
        if (tile.meshes[1]) tile.meshes[1].visible = detailReach > 0 && distance < detailReach + TILE * .7;
      }
    }
    const start = performance.now();
    for (let i = 0; i < 3 && queued.length; i++) {
      const tile = queued.pop();
      tile.meshes = makeTile(tile.tx, tile.tz, heightAt, shapes, materials, meadow);
      if (tile.meshes[1]) tile.meshes[1].visible = detailReach > 0 && tile.distance < detailReach + TILE * .7;
      tiles.set(tile.key, tile);
      if (performance.now() - start > 3.5) break;
    }
  }
  update(0, options.position);
  return {update, setQuality};
}
