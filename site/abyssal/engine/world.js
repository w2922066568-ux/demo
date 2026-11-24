(() => {
  'use strict';

  const T = window.THREE;
  if (!T) return;
  const tau = Math.PI * 2;
  const v = (x, y, z) => new T.Vector3(x, y, z);
  function seeded(seed) {
    return () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
  }
  function floorAt(x, z) {
    return (
      -10 +
      1.85 * Math.sin(z * 0.043 + 0.7 * Math.sin(x * 0.074)) +
      1.05 * Math.cos(x * 0.12 + z * 0.054) +
      0.52 * Math.sin(z * 0.17 - x * 0.12) +
      0.22 * Math.cos(x * 0.43 + z * 0.18)
    );
  }
  function pathX(z) {
    return 7.5 * Math.sin(-z * 0.034) + (z < -75 ? -7 * Math.sin((-z - 75) * 0.032) : 0);
  }
  const obstacles = [];
  const coordinates = [
    [4, -53],
    [-22, -127],
    [17, -212],
  ];
  const beacons = coordinates.map(([x, z]) => ({ x, y: floorAt(x, z) + 7, z }));

  function batch(parent, spatial = false) {
    const entries = new Map();
    const dummy = new T.Object3D();
    const up = v(0, 1, 0);
    const direction = v(0, 0, 0);
    function add(
      geometry,
      material,
      x,
      y,
      z,
      sx = 1,
      sy = 1,
      sz = 1,
      rx = 0,
      ry = 0,
      rz = 0,
      tint = null,
      quaternion = null,
    ) {
      const cellZ = spatial ? Math.floor(z / 35) : 0;
      const id = geometry.uuid + material.uuid + cellZ;
      if (!entries.has(id)) entries.set(id, { geometry, material, cellZ, matrices: [], colors: [] });
      const group = entries.get(id);
      dummy.position.set(x, y, z);
      dummy.rotation.set(rx, ry, rz);
      if (quaternion) dummy.quaternion.copy(quaternion);
      dummy.scale.set(sx, sy, sz);
      dummy.updateMatrix();
      group.matrices.push(dummy.matrix.clone());
      group.colors.push(new T.Color(tint ?? 0xffffff));
    }
    function rod(geometry, mat, a, b, radius, color) {
      direction.subVectors(b, a);
      const len = direction.length();
      if (len < 0.001) return;
      const q = new T.Quaternion().setFromUnitVectors(up, direction.normalize());
      add(
        geometry,
        mat,
        (a.x + b.x) / 2,
        (a.y + b.y) / 2,
        (a.z + b.z) / 2,
        radius,
        len,
        radius,
        0,
        0,
        0,
        color,
        q,
      );
    }
    function flush() {
      for (const { geometry, material, cellZ, matrices, colors } of entries.values()) {
        const mesh = new T.InstancedMesh(geometry, material, matrices.length);
        for (let i = 0; i < matrices.length; i++) {
          mesh.setMatrixAt(i, matrices[i]);
          mesh.setColorAt(i, colors[i]);
        }
        mesh.computeBoundingSphere();
        if (spatial) {
          mesh.userData.centerDepth = (cellZ + 0.5) * 35;
          mesh.userData.drawRange = geometry.userData.distant || false ? 142 : 81;
        }
        parent.add(mesh);
      }
      entries.clear();
    }
    return { add, rod, flush };
  }

  const physicalLighting = `
    float hadalDist = distance(hadalWorldPosition, uPulseOrigin);
    float waveDelta = abs(hadalDist-uPulseRadius);
    float sonarWave = exp(-waveDelta * waveDelta * .18) * uPulseStrength;
    float contours = 0.45 + 0.55 * pow(max(0.0, cos(hadalWorldPosition.y * 5.5)), 10.0);
    float broadWave = exp(-waveDelta * .14) * uPulseStrength;
    outgoingLight += vec3(.07,.83,.68) * sonarWave * contours + vec3(.003,.075,.071)*broadWave;
    vec3 hadalDelta = hadalWorldPosition - uCraftPosition;
    float headDist = length(hadalDelta);
    float cone = smoothstep(.855, .965, dot(normalize(hadalDelta + .0001),uCraftDirection));
    float headLamp = cone * exp(-headDist * .064);
    float seamLight = sin(hadalWorldPosition.x*.094+hadalWorldPosition.y*.12+hadalWorldPosition.z*.067);
    float openWater = smoothstep(-.5,.91,seamLight);
    outgoingLight *= mix(vec3(.28,.43,.61),vec3(.98,1.06,1.08),openWater);
    outgoingLight += diffuseColor.rgb * vec3(6.9,5.20,2.80) * headLamp;
  `;

  function scanned(mat, uniforms, surface = '') {
    const seabed = surface === 'sand';
    const rock = surface === 'rock';
    const textured = rock || seabed;
    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      if (textured)
        shader.uniforms.uDetail = {
          value: seabed ? uniforms.sandTexture.value : uniforms.cliffTexture.value,
        };
      shader.vertexShader = 'varying vec3 hadalWorldPosition;\n' + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        '#include <project_vertex>',
        `
        #include <project_vertex>
        vec4 hadalPosition = vec4(transformed, 1.0);
        #ifdef USE_INSTANCING
          hadalPosition = instanceMatrix * hadalPosition;
        #endif
        hadalWorldPosition = (modelMatrix * hadalPosition).xyz;
      `,
      );
      shader.fragmentShader =
        `
        varying vec3 hadalWorldPosition;
        uniform vec3 uPulseOrigin;
        uniform vec3 uCraftPosition;
        uniform vec3 uCraftDirection;
        uniform float uPulseRadius;
        uniform float uPulseStrength;
        uniform float uTime;
        uniform sampler2D uDetail;
      ` + shader.fragmentShader;
      if (textured) {
        const uvCode = seabed
          ? 'hadalWorldPosition.xz*.23'
          : 'vec2(hadalWorldPosition.z+hadalWorldPosition.x*.22,hadalWorldPosition.y)*.13';
        shader.uniforms.uGeology = {
          value: seabed ? uniforms.sandRelief.value : uniforms.rockRelief.value,
        };
        shader.fragmentShader = 'uniform sampler2D uGeology;\n' + shader.fragmentShader;
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <color_fragment>',
          `
          #include <color_fragment>
          vec2 bedUV=${uvCode};
          vec3 detailOne=texture2D(uDetail,bedUV).rgb;
          vec3 detailTwo=texture2D(uGeology,bedUV*.55+vec2(.35,.28)).rgb;
          ${
            rock
              ? `
          vec3 w=abs(normalize(cross(dFdx(hadalWorldPosition),dFdy(hadalWorldPosition))));
          w=w*w;w/=max(.001,w.x+w.y+w.z);
          vec3 xyz=hadalWorldPosition*.157;
          detailOne=texture2D(uDetail,xyz.zy).rgb*w.x+texture2D(uDetail,xyz.xz).rgb*w.y+texture2D(uDetail,xyz.xy).rgb*w.z;
          `
              : ''
          }
          float mineral=dot(detailOne,vec3(.27,.56,.17));
          float mass=dot(detailTwo,vec3(.27,.56,.17));
          float rawRock=clamp(.04+mineral*1.3+mass*.28,0.,1.);
          diffuseColor.rgb *= mix(.31,2.13,smoothstep(.15,.88,rawRock));
        `,
        );
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <normal_fragment_maps>',
          `
          #include <normal_fragment_maps>
          vec3 reliefZ=normalize(normal);
          vec3 relDX=dFdx(vViewPosition);
          vec3 relDY=dFdy(vViewPosition);
          vec3 relR1=cross(relDY,reliefZ);
          vec3 relR2=cross(reliefZ,relDX);
          float reliefDet=dot(relDX,relR1);
          vec3 reliefGrad=sign(reliefDet)*(dFdx(mineral)*relR1+dFdy(mineral)*relR2);
          normal=normalize(abs(reliefDet)*normal+reliefGrad*${seabed ? '.075' : '.24'});
        `,
        );
      }
      const sandLight = seabed
        ? `
        vec2 st = hadalWorldPosition.xz;
        float ripple = sin(st.x * 1.9 + sin(st.y*.47)*2.0 + cos(st.y*.27 + st.x*.19)*3.0);
        float broad = sin(st.x*.22+sin(st.y*.23)) * cos(st.y*.17-st.x*.07);
        float current = sin(st.x*.5+st.y*.21+sin(st.y*.45+uTime*.17)*1.8+uTime*.12);
        float shimmer = pow(max(0.0,current),18.0) * (.45+.55*abs(broad));
        outgoingLight *= .88 + .10*ripple + .1*broad;
        outgoingLight += vec3(.008,.060,.064) * shimmer;
      `
        : '';
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <opaque_fragment>',
        sandLight + physicalLighting + '\n#include <opaque_fragment>',
      );
    };
    mat.customProgramCacheKey = () => 'hadal-surface-' + surface;
    return mat;
  }

  function makeWorld(scene, uniforms) {
    const random = seeded(731549);
    obstacles.length = 0;
    const range = (a, b) => a + (b - a) * random();
    const pick = (list) => list[Math.floor(random() * list.length)];
    const terrainWidth = 260,
      terrainLength = 444;
    const geo = new T.PlaneGeometry(terrainWidth, terrainLength, 88, 147);
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, 0, -113);
    const colors = [];
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i),
        z = p.getZ(i);
      p.setY(i, floorAt(x, z));
      const variation =
        0.5 + 0.25 * Math.sin(x * 0.067 + z * 0.053) + 0.25 * Math.cos(z * 0.085 - x * 0.037);
      const color = new T.Color('#162f36').lerp(
        new T.Color('#637f76'),
        variation * 0.74 + random() * 0.19,
      );
      colors.push(color.r, color.g, color.b);
    }
    geo.setAttribute('color', new T.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    const sand = scanned(
      new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.93 }),
      uniforms,
      'sand',
    );
    scene.add(new T.Mesh(geo, sand));
    const group = new T.Group();
    scene.add(group);
    const B = batch(group, true);
    const box = new T.BoxGeometry(1, 1, 1);
    const cylinder = new T.CylinderGeometry(1, 1, 1, 8);
    const seedRock = (detail, seed) => {
      const rr = seeded(seed);
      const g = new T.IcosahedronGeometry(1, detail);
      const pos = g.attributes.position;
      const shifts = new Map();
      for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i),
          y = pos.getY(i),
          z = pos.getZ(i);
        const key = [x, y, z].map((n) => Math.round(n * 200)).join(',');
        if (!shifts.has(key)) shifts.set(key, (rr() - 0.5) * 0.25);
        const n = shifts.get(key) + 1 + 0.065 * Math.sin(y * 9 + x * 4) + 0.085 * Math.sin(z * 7);
        pos.setXYZ(i, x * n + 0.16 * y * y, Math.sign(y) * Math.pow(Math.abs(y), 0.76) * n, z * n);
      }
      g.computeVertexNormals();
      return g;
    };
    const rocks = [seedRock(2, 191), seedRock(1, 87), seedRock(1, 37)];
    function stratifiedRock(seed) {
      const rr = seeded(seed),
        n = 16,
        layers = 12,
        pts = [],
        indices = [];
      const angular = Array.from({ length: n }, () => rr());
      const tilt = (rr() - 0.5) * 0.26;
      for (let j = 0; j <= layers; j++) {
        const h = j / layers,
          layer = 1 + 0.09 * Math.cos(j * 2.47) + 0.04 * Math.cos(j * 1.23);
        for (let i = 0; i < n; i++) {
          const a = (i / n) * tau;
          const crown = 1 - 0.73 * Math.pow(h, 4);
          const crack = 0.11 * Math.cos(a * 5 + seed * 0.1) + 0.14 * (angular[i] - 0.5);
          const r = (crown + crack + rr() * 0.068) * layer * (0.84 + 0.16 * Math.sin(h * Math.PI));
          const x = Math.cos(a) * r + (h - 0.5) * tilt;
          const z = Math.sin(a) * r;
          const y = -1 + 2 * h + 0.055 * Math.cos(a * 3 + 0.4) + 0.15 * Math.sin(a + 0.36) * h;
          pts.push(x, y, z);
        }
      }
      for (let j = 0; j < layers; j++)
        for (let i = 0; i < n; i++) {
          const a = j * n + i,
            b = j * n + ((i + 1) % n),
            c = a + n,
            d = b + n;
          indices.push(a, c, b, b, c, d);
        }
      const top = pts.length / 3;
      pts.push(0.02, 1.02, 0.03);
      for (let i = 0; i < n; i++) indices.push(layers * n + i, top, layers * n + ((i + 1) % n));
      const g = new T.BufferGeometry();
      g.setAttribute('position', new T.Float32BufferAttribute(pts, 3));
      g.setIndex(indices);
      g.computeVertexNormals();
      return g;
    }
    const cliffs = [stratifiedRock(11), stratifiedRock(48), stratifiedRock(97)];
    cliffs.forEach((c) => (c.userData.distant = true));
    const bulb = new T.IcosahedronGeometry(1, 1),
      tinyBulb = new T.IcosahedronGeometry(1, 0);
    const stone = scanned(
      new T.MeshStandardMaterial({ roughness: 0.86, flatShading: false }),
      uniforms,
      'rock',
    );
    const frondMaterial = new T.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00291e,
      emissiveIntensity: 0.17,
      side: T.DoubleSide,
      vertexColors: true,
      roughness: 0.38,
      metalness: 0.16,
    });
    frondMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uniforms.uTime;
      shader.vertexShader =
        'uniform float uTime;\n' +
        shader.vertexShader.replace(
          '#include <begin_vertex>',
          `
        #include <begin_vertex>
        float tip=max(0.0,position.y);
        float seed=instanceMatrix[3].x*.63+instanceMatrix[3].z*.51;
        transformed.x+=tip*tip*.097*sin(uTime*.80+seed+tip*2.);
        transformed.z+=tip*tip*.07*cos(uTime*.70+seed);
      `,
        );
    };
    function bladeGeometry() {
      const geo = new T.BufferGeometry(),
        pos = [],
        colors = [],
        index = [];
      for (let j = 0; j <= 9; j++) {
        const h = j / 9,
          w = (0.025 + 0.18 * Math.pow(Math.sin(h * Math.PI), 0.59)) * (1 - h * 0.43);
        const curve = Math.pow(h, 1.7) * 0.29 - 0.074 * Math.sin(h * 4.9);
        for (let k = -1; k <= 1; k++) {
          pos.push(curve + k * w, h, Math.sin(h * 5) * 0.043 + (k === 0 ? 0.025 : 0));
          const br = 0.58 + h * 0.31 + (k === 0 ? 0.11 : 0);
          colors.push(br * 0.89, br, br);
        }
        if (j < 9)
          for (let k = 0; k < 2; k++) {
            const a = j * 3 + k;
            index.push(a, a + 1, a + 3, a + 1, a + 4, a + 3);
          }
      }
      geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
      geo.setAttribute('color', new T.Float32BufferAttribute(colors, 3));
      geo.setIndex(index);
      geo.computeVertexNormals();
      return geo;
    }
    const blade = bladeGeometry();
    const metal = scanned(new T.MeshStandardMaterial({ roughness: 0.6, metalness: 0.35 }), uniforms);
    const organism = scanned(
      new T.MeshStandardMaterial({ roughness: 0.68, flatShading: true }),
      uniforms,
    );
    const glow = new T.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
    const glyph = new T.MeshBasicMaterial({ color: 0x85f9d1, toneMapped: false });
    const rockPalette = ['#23333e', '#273b42', '#304449', '#3c535b', '#4b5657', '#304549'];
    const coralColors = ['#c16b63', '#98677d', '#b08078', '#95aaa5', '#6f8ba2'];
    const spines = ['#384c4e', '#425958', '#526361'];
    // Leave the survey route clear, including the approach from each sector's entry point.
    const routePoints = [
      [0, 3],
      [4, -53],
      [-22, -127],
      [17, -212],
    ];
    const routes = routePoints.slice(1).map((point, i) => [routePoints[i], point]);
    routes.push([[-2, -74], routePoints[2]], [[-10, -155], routePoints[3]]);
    function routeDistance(x, z) {
      let best = Infinity;
      for (const [[ax, az], [bx, bz]] of routes) {
        const dx = bx - ax,
          dz = bz - az;
        const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)));
        best = Math.min(best, Math.hypot(x - ax - dx * t, z - az - dz * t));
      }
      return best;
    }
    function rock(x, y, z, w, h, d, tint) {
      if (w > 3.0 && routeDistance(x, z) < Math.max(w, d) + 9.1) return;
      if (w > 3.0)
        obstacles.push({ x, y, z, w: Math.min(w, d) * 0.73, h: h * 0.81, d: Math.min(w, d) * 0.73 });
      B.add(
        pick(w > 3.0 ? cliffs : rocks),
        stone,
        x,
        y,
        z,
        w,
        h,
        d,
        range(-0.15, 0.15),
        range(0, tau),
        range(-0.15, 0.15),
        tint || pick(rockPalette),
      );
    }
    // Several receding shelves keep silhouettes legible even in heavy abyssal haze.
    for (let side of [-1, 1]) {
      for (let i = 0; i < 92; i++) {
        const z = range(-282, 69);
        const corridor = pathX(z);
        const x = corridor + side * (range(23, 43) + 5 * Math.sin(z * 0.06 + side));
        const w = range(3.5, 11),
          h = range(5, 17);
        rock(x, floorAt(x, z) + h * 0.32, z, w, h, range(4, 12));
        if (i % 4 === 0) {
          rock(
            x + side * range(7, 18),
            floorAt(x, z) + h * 0.84,
            z + range(-4, 4),
            w * 0.84,
            h * 1.9,
            w * 1.35,
          );
        }
      }
      for (let i = 0; i < 42; i++) {
        const z = range(-290, 75),
          x = pathX(z) + side * range(50, 89),
          h = range(18, 47);
        rock(x, floorAt(x, z) + h * 0.32, z, range(9, 18), h, range(8, 24));
      }
    }
    for (let i = 0; i < 980; i++) {
      const x = range(-64, 64),
        z = range(-265, 49);
      const size = i < 150 ? range(0.8, 2.4) : range(0.09, 0.6);
      rock(x, floorAt(x, z) - size * 0.13, z, size * range(0.85, 1.55), size * range(0.5, 0.85), size);
    }
    // Branching cold-water fan corals and their pinpoints of bioluminescence.
    const coralTubes = new T.CylinderGeometry(0.64, 1, 1, 5);
    const coralTips = ['#c1ffe9', '#8ae8dc', '#e5a5a0', '#a8d0df'];
    function fan(x, z, size) {
      const origin = v(x, floorAt(x, z) - 0.14, z);
      const tint = pick(coralColors),
        tip = pick(coralTips);
      const facing = range(-0.65, 0.65);
      const vx = v(Math.cos(facing), 0, Math.sin(facing));
      const fromLocal = (px, py, depth) =>
        origin
          .clone()
          .addScaledVector(vx, px * size)
          .add(v(-Math.sin(facing) * depth * size, py * size, Math.cos(facing) * depth * size));
      const branches = [];
      function branch(px, py, angle, length, level, depth) {
        const endX = px + Math.sin(angle) * length,
          endY = py + Math.cos(angle) * length;
        const start = fromLocal(px, py, depth),
          end = fromLocal(endX, endY, depth + Math.sin(angle) * 0.08);
        B.rod(coralTubes, organism, start, end, size * (0.035 + level * 0.023), tint);
        if (level > 0) {
          branches.push([
            endX,
            endY,
            angle + range(0.24, 0.6),
            length * range(0.6, 0.79),
            level - 1,
            depth + 0.035,
          ]);
          branches.push([
            endX,
            endY,
            angle - range(0.24, 0.6),
            length * range(0.58, 0.81),
            level - 1,
            depth - 0.04,
          ]);
        } else {
          B.add(
            tinyBulb,
            glow,
            end.x,
            end.y,
            end.z,
            size * 0.028,
            size * 0.044,
            size * 0.032,
            0,
            0,
            0,
            tip,
          );
        }
      }
      branches.push([0, 0, range(-0.2, 0.2), 0.52, 3, 0]);
      for (let i = 0; i < branches.length; i++) branch(...branches[i]);
    }
    for (let i = 0; i < 154; i++) {
      const z = range(-252, 42),
        x = pathX(z) + range(-31, 31);
      fan(x, z, range(0.85, 2.8));
    }
    for (let i = 0; i < 84; i++) {
      const z = range(-245, 45),
        x = pathX(z) + (i % 2 ? 1 : -1) * range(4, 34),
        tint = pick(['#489b9b', '#589e9b', '#839c86']);
      for (let j = 0; j < 7; j++) {
        const dx = x + range(-1.2, 1.2),
          dz = z + range(-1.2, 1.2),
          h = range(0.45, 2.6),
          r = range(0.05, 0.13);
        const a = v(dx, floorAt(dx, dz), dz),
          end = a.clone().add(v(range(-0.4, 0.4), h, range(-0.23, 0.23)));
        B.rod(cylinder, organism, a, end, r, tint);
        B.add(tinyBulb, glow, end.x, end.y, end.z, r * 1.01, r * 0.65, r * 1.01, 0, 0, 0, '#86d9c5');
      }
    }
    // Overlapping ribbon kelp stands make the foreground respond to the current.
    const frondPalette = ['#218378', '#3a9780', '#649c71', '#24645f', '#568282', '#6a9473'];
    const patch = (x, z, size, count, seaFan = false) => {
      for (let j = 0; j < count; j++) {
        const t = range(0, tau),
          r = Math.pow(random(), 0.7) * size * 0.64;
        const px = x + r * Math.cos(t),
          pz = z + r * Math.sin(t),
          fy = floorAt(px, pz) - 0.14;
        const h = size * range(0.49, 1.16);
        B.add(
          blade,
          frondMaterial,
          px,
          fy,
          pz,
          seaFan ? h * 0.6 : h * 0.2,
          h,
          seaFan ? h * 0.43 : h * 0.22,
          range(-0.3, 0.31),
          t,
          range(-0.41, 0.41),
          pick(frondPalette),
        );
      }
    };
    for (let i = 0; i < 180; i++) {
      const z = range(-256, 41),
        x = pathX(z) + range(-28, 28),
        size = range(1.25, 4.1);
      patch(x, z, size, Math.round(range(10, 20)), i % 3 === 0);
    }
    for (const [x, z, size] of [
      [-4, 1, 3.3],
      [5.9, -1, 3.6],
      [-7, -7, 5],
      [6.5, -14, 4.2],
      [8.3, -26, 4.6],
      [-5, -33, 3.9],
      [3, -15, 2.5],
      [-11, -51, 5.2],
      [9, -43, 6.2],
    ]) {
      patch(x, z, size, 26, true);
      for (let i = 0; i < 4; i++) fan(x + range(-1.3, 1.3), z + range(-1.3, 1.3), range(1.8, 3.1));
    }
    // Fleshy white plume anemones collect on the rock ledges around hot springs.
    const polyp = (() => {
      const geo = new T.BufferGeometry(),
        vertices = [],
        normals = [];
      for (let j = 0; j < 10; j++) {
        const angle = (j * tau) / 10,
          dx = Math.cos(angle),
          dz = Math.sin(angle);
        const tilt = 0.77 + 0.24 * Math.cos(j * 1.8);
        const A = [dx * 0.035, 0, dz * 0.035],
          B = [dx * 0.15 - dz * 0.029, 0.16, dz * 0.15 + dx * 0.029],
          C = [dx * 0.15 + dz * 0.029, 0.16, dz * 0.15 - dx * 0.029],
          D = [dx * 0.27 * tilt, 0.28 + 0.09 * Math.sin(j * 2), dz * 0.27 * tilt];
        vertices.push(...A, ...B, ...C, ...B, ...D, ...C);
        for (let n = 0; n < 6; n++) normals.push(dx * 0.74, 0.65, dz * 0.74);
      }
      geo.setAttribute('position', new T.Float32BufferAttribute(vertices, 3));
      geo.setAttribute('normal', new T.Float32BufferAttribute(normals, 3));
      return geo;
    })();
    const warmSoft = scanned(
      new T.MeshStandardMaterial({
        color: 0xfeead8,
        emissive: 0x814a52,
        emissiveIntensity: 0.23,
        roughness: 0.53,
        side: T.DoubleSide,
      }),
      uniforms,
    );
    for (let i = 0; i < 66; i++) {
      const z = range(-250, 30),
        x = pathX(z) + (i % 2 ? 1 : -1) * range(4.2, 21);
      for (let j = 0; j < 7; j++) {
        const px = x + range(-1.9, 1.9),
          pz = z + range(-1.9, 1.9),
          f = floorAt(px, pz),
          h = range(0.37, 1.4);
        B.add(
          coralTubes,
          organism,
          px,
          f + h * 0.44,
          pz,
          h * 0.11,
          h * 0.88,
          h * 0.11,
          0,
          0,
          0.1,
          '#b98383',
        );
        B.add(polyp, warmSoft, px, f + h * 0.78, pz, h, h, h, 0, range(0, tau), 0);
      }
    }
    function beam(a, b, width, material = stone, color = '#50666a', depth = width) {
      const delta = b.clone().sub(a);
      const mid = a.clone().lerp(b, 0.5);
      const q = new T.Quaternion().setFromUnitVectors(v(0, 1, 0), delta.clone().normalize());
      B.add(box, material, mid.x, mid.y, mid.z, width, delta.length(), depth, 0, 0, 0, color, q);
    }
    function arch(cx, base, cz, r, broken, swivel) {
      const pos = (t, offset = 0) =>
        v(
          cx + Math.cos(t) * (r + offset) * Math.cos(swivel),
          base + Math.sin(t) * (r + offset),
          cz + Math.cos(t) * (r + offset) * Math.sin(swivel),
        );
      for (let i = 0; i < 15; i++) {
        if (broken.includes(i)) continue;
        const a = pos((i * Math.PI) / 15 + 0.009),
          b = pos(((i + 1) * Math.PI) / 15 - 0.009);
        beam(a, b, 1.6, stone, pick(spines), 2.3);
        const q = pos(((i + 0.5) * Math.PI) / 15, -0.78);
        const rr = pos(((i + 0.82) * Math.PI) / 15, -0.78);
        q.z += 1.19;
        rr.z += 1.19;
        beam(q, rr, 0.094, glyph, 0xffffff, 0.14);
        const ribA = pos(((i + 0.35) * Math.PI) / 15, -0.65),
          ribB = pos(((i + 0.35) * Math.PI) / 15, 0.78);
        ribA.z += 1.18;
        ribB.z += 1.18;
        beam(ribA, ribB, 0.13, metal, '#7b928d', 0.14);
      }
      for (const sign of [-1, 1]) {
        const a = pos(sign === 1 ? 0 : Math.PI);
        beam(a.clone().add(v(0, -6, 0)), a, 2.15, stone, '#354d50', 3);
      }
    }
    arch(4, -4.0, -57, 11.8, [], 0.095);
    arch(4.4, -4.15, -66.5, 11.2, [2, 3, 4, 11, 12], 0.11);
    for (let k = 0; k < 10; k++) {
      const x = (k % 2 ? 1 : -1) * (8 + random() * 2) + 4,
        z = -42 - Math.floor(k / 2) * 5.3,
        f = floorAt(x, z);
      B.add(box, stone, x, f + 1.5, z, 1.25, 3.15, 1.5, 0, 0.1, range(-0.1, 0.1), '#425b59');
      B.add(box, glyph, x, f + 2.8, z + 0.76, 0.48, 0.065, 0.035);
    }
    // Wrecked ribbed hull, tilted into the second trench wall.
    const wreckX = -31,
      wreckZ = -134;
    for (let i = 0; i < 13; i++) {
      const z = wreckZ + i * 2.25;
      const taper = 0.55 + 0.45 * Math.sin((Math.PI * i) / 15 + 0.25);
      const w = 7 * taper,
        h = 8.5 * taper,
        base = floorAt(wreckX, z);
      const left = v(wreckX - w, base + 0.55, z),
        a = v(wreckX - w * 0.78, base + h * 0.78, z);
      const b = v(wreckX - w * 0.16, base + h + 1.5, z),
        right = v(wreckX + w, base + 0.35, z);
      beam(left, a, 0.32, metal, '#866c53', 0.68);
      beam(a, b, 0.3, metal, '#9b7355', 0.65);
      if (i % 3 !== 1) beam(b, v(wreckX + w * 0.71, base + h * 0.71, z), 0.31, metal, '#606762', 0.65);
      beam(right, v(wreckX + w * 0.72, base + h * 0.58, z), 0.32, metal, '#766d5a', 0.65);
      if (i % 3 !== 0)
        B.add(box, metal, wreckX - w * 0.88, base + 1.85, z, 0.33, 4.1, 2.05, 0, 0, -0.19, '#52605a');
    }
    const wreckFloor = floorAt(-28, -135);
    beam(v(-36, wreckFloor + 1, -148), v(-22, wreckFloor + 20, -135), 0.45, metal, '#655f53');
    beam(v(-28, wreckFloor + 13, -136), v(-16, wreckFloor + 12, -138), 0.35, metal, '#7f6e57');
    B.add(box, metal, -27, wreckFloor + 5, -139, 6.6, 5.6, 8.1, -0.08, 0.05, 0.19, '#586963');
    // The final array consists of a broken dial and tall obelisks.
    arch(17, -3.3, -218, 13, [3, 4, 10], -0.17);
    for (let i = 0; i < 11; i++) {
      const t = (i * tau) / 11,
        x = 17 + Math.cos(t) * 16,
        z = -214 + Math.sin(t) * 11;
      const h = range(6, 19),
        f = floorAt(x, z);
      B.add(
        box,
        stone,
        x,
        f + h * 0.42,
        z,
        2.1,
        h,
        2.8,
        range(-0.065, 0.065),
        t,
        range(-0.2, 0.2),
        '#233f46',
      );
      for (let j = 0; j < 3; j++)
        B.add(
          box,
          glyph,
          x + 0.25 * Math.sin(t),
          f + h * 0.81 - j * 0.36,
          z + 1.43,
          range(0.4, 1.02),
          0.045,
          0.07,
          0,
          t,
          0,
        );
    }
    B.flush();

    const targetObjects = [];
    const brass = new T.MeshStandardMaterial({ color: 0xe5a44a, metalness: 0.6, roughness: 0.38 });
    const enamel = new T.MeshStandardMaterial({ color: 0xfd7827, metalness: 0.27, roughness: 0.41 });
    const leather = new T.MeshStandardMaterial({ color: 0x182e33, metalness: 0.43, roughness: 0.53 });
    const beaconLamp = new T.MeshBasicMaterial({ color: 0xd5ffe0, toneMapped: false });
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = glowCanvas.height = 96;
    const gctx = glowCanvas.getContext('2d'),
      gradient = gctx.createRadialGradient(48, 48, 0, 48, 48, 48);
    gradient.addColorStop(0, 'rgba(220,255,195,1)');
    gradient.addColorStop(0.11, 'rgba(166,255,205,.82)');
    gradient.addColorStop(0.33, 'rgba(104,255,202,.27)');
    gradient.addColorStop(1, 'rgba(72,235,190,0)');
    gctx.fillStyle = gradient;
    gctx.fillRect(0, 0, 96, 96);
    const flareMaterial = new T.SpriteMaterial({
      map: new T.CanvasTexture(glowCanvas),
      transparent: true,
      depthWrite: false,
      blending: T.AdditiveBlending,
      fog: false,
    });

    const ringGeometry = new T.TorusGeometry(1, 0.045, 5, 48);
    for (const point of beacons) {
      const base = new T.Group();
      base.position.set(point.x, point.y, point.z);
      scene.add(base);
      const BH = batch(base);
      BH.add(cylinder, enamel, 0, 0, 0, 0.56, 1.48, 0.56);
      BH.add(bulb, enamel, 0, -0.7, 0, 0.55, 0.38, 0.55);
      BH.add(cylinder, leather, 0, 0.56, 0, 0.59, 0.2, 0.59);
      BH.add(cylinder, brass, 0, -0.38, 0, 0.58, 0.09, 0.58);
      BH.add(cylinder, beaconLamp, 0, 0.91, 0, 0.25, 0.42, 0.25);
      BH.add(bulb, leather, 0, 1.15, 0, 0.28, 0.12, 0.28);
      for (let i = 0; i < 4; i++) {
        const t = (i * tau) / 4,
          dx = Math.cos(t),
          dz = Math.sin(t);
        BH.rod(cylinder, leather, v(0.39 * dx, -0.45, 0.39 * dz), v(0.83 * dx, -1.18, 0.83 * dz), 0.064);
      }
      BH.flush();
      const halo = new T.Mesh(
        ringGeometry,
        new T.MeshBasicMaterial({
          color: 0x82eecc,
          transparent: true,
          opacity: 0.68,
          depthWrite: false,
          toneMapped: false,
        }),
      );
      halo.scale.setScalar(1.38);
      halo.rotation.x = Math.PI / 2;
      base.add(halo);
      const halo2 = halo.clone();
      halo2.scale.setScalar(1.7);
      base.add(halo2);
      const rope = new T.Mesh(new T.CylinderGeometry(0.026, 0.026, 7, 5), leather);
      rope.position.set(point.x, point.y - 3.5, point.z);
      scene.add(rope);
      const flare = new T.Sprite(flareMaterial);
      flare.position.y = 1.1;
      flare.scale.setScalar(3.0);
      base.add(flare);
      targetObjects.push({ base, halo, halo2, rope });
    }

    const fishGeo = new T.BufferGeometry();
    const verts = [
      0, 0.1, -0.66, -0.13, 0.02, 0.12, 0, 0.24, 0.08, 0, 0.1, -0.66, 0, 0.24, 0.08, 0.13, 0.02, 0.12, 0,
      0.1, -0.66, 0.13, 0.02, 0.12, 0, -0.1, 0.15, 0, 0.1, -0.66, 0, -0.1, 0.15, -0.13, 0.02, 0.12,
      -0.13, 0.02, 0.12, 0, -0.1, 0.15, 0, 0.04, 0.52, 0, -0.1, 0.15, 0.13, 0.02, 0.12, 0, 0.04, 0.52,
      0.13, 0.02, 0.12, 0, 0.24, 0.08, 0, 0.04, 0.52, 0, 0.24, 0.08, -0.13, 0.02, 0.12, 0, 0.04, 0.52, 0,
      0.04, 0.42, 0, 0.27, 0.73, 0, -0.17, 0.76,
    ];
    fishGeo.setAttribute('position', new T.Float32BufferAttribute(verts, 3));
    fishGeo.computeVertexNormals();
    const schools = [];
    for (let j = 0; j < 6; j++) {
      const fishMat = new T.MeshStandardMaterial({
        color: j % 2 ? 0x94adb0 : 0x719f9f,
        roughness: 0.42,
        metalness: 0.3,
        side: T.DoubleSide,
      });
      const fish = new T.InstancedMesh(fishGeo, fishMat, 30 + j * 4);
      const fishData = [];
      for (let i = 0; i < fish.count; i++)
        fishData.push([range(-7, 7), range(-2.4, 2.4), range(-3, 3), range(0.4, 1.12), range(0, tau)]);
      fish.frustumCulled = false;
      scene.add(fish);
      schools.push({
        fish,
        fishData,
        x: (j % 2 ? 1 : -1) * range(11, 20),
        y: range(1, 9),
        z: 5 - j * 42,
        phase: range(0, tau),
      });
    }
    const tmp = new T.Object3D();
    function update(t, sector, craftZ, rangeScale = 1) {
      for (const mesh of group.children)
        mesh.visible =
          Math.abs(mesh.userData.centerDepth - craftZ) < mesh.userData.drawRange * rangeScale + 19;
      targetObjects.forEach(({ base, halo, halo2, rope }, i) => {
        base.visible = i >= sector;
        rope.visible = i >= sector;
        base.position.y = beacons[i].y + Math.sin(t * 1.6 + i) * 0.12;
        halo.rotation.z = t * 0.5;
        halo2.rotation.z = -t * 0.42;
        halo.position.y = 0.84 + Math.sin(t * 2.3) * 0.14;
        halo2.position.y = halo.position.y - 0.23;
        const a = (t * 0.52) % 1;
        halo2.scale.setScalar(1.25 + 0.66 * a);
      });
      for (const { fish, fishData, x, y, z, phase } of schools) {
        const orbit = t * 0.15 + phase;
        const dx = Math.cos(orbit) * 6,
          dz = Math.sin(orbit) * 4;
        const angle = Math.atan2(Math.sin(orbit) * 6, Math.cos(orbit) * 4) + Math.PI;
        for (let i = 0; i < fishData.length; i++) {
          const [ox, oy, oz, size, seed] = fishData[i];
          tmp.position.set(
            x + dx + ox + Math.sin(t * 0.6 + seed) * 0.32,
            y + oy + Math.sin(t * 0.65 + seed) * 0.42,
            z + dz + oz,
          );
          tmp.rotation.set(
            Math.sin(t + seed) * 0.07,
            angle + Math.sin(t * 4 + seed) * 0.14,
            Math.sin(t * 0.6 + seed) * 0.09,
          );
          tmp.scale.setScalar(size);
          tmp.updateMatrix();
          fish.setMatrixAt(i, tmp.matrix);
        }
        fish.instanceMatrix.needsUpdate = true;
      }
    }
    return { update, terrain: geo };
  }
  window.HadalGeometry = { batch, scanned, seeded, floorAt, beacons, pathX, makeWorld, obstacles };
})();
