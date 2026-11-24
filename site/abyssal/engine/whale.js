(() => {
  'use strict';
  const T = window.THREE;
  if (!T) return;
  const tau = Math.PI * 2;
  const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
  const mix = (a, b, k) => a + (b - a) * k;
  const smooth = (a, b, x) => {
    const k = clamp((x - a) / (b - a));
    return k * k * (3 - 2 * k);
  };
  // Lengthwise sections: station, backbone height, vertical and lateral radii.
  const sections = [
    [-8.75, 0.27, 0.035, 0.07],
    [-8.26, 0.29, 0.19, 0.31],
    [-7.5, 0.26, 0.37, 0.29],
    [-6.5, 0.18, 0.6, 0.4],
    [-5.3, 0.14, 0.92, 0.62],
    [-4.2, 0.07, 1.24, 0.84],
    [-3.1, 0.0, 1.52, 1.12],
    [-1.7, -0.04, 1.78, 1.39],
    [0, -0.08, 1.91, 1.61],
    [1.9, -0.14, 1.88, 1.65],
    [3.4, -0.17, 1.61, 1.56],
    [4.8, -0.18, 1.21, 1.36],
    [6.15, -0.14, 0.83, 1.1],
    [7.23, -0.08, 0.57, 0.82],
    [8.02, -0.035, 0.37, 0.56],
    [8.42, 0.015, 0.23, 0.35],
    [8.6, 0.026, 0.115, 0.19],
    [8.66, 0.035, 0.018, 0.022],
  ];
  const black = new T.Color(0x293842),
    blue = new T.Color(0x40515c);
  const white = new T.Color(0xc5c6bb),
    fleck = new T.Color(0x9caeb0);
  const flipperDark = new T.Color(0x3c515e);
  const ink = new T.Color(0x1c2a32),
    crease = new T.Color(0x677b7f);
  const knobs = new T.Color(0x61717a),
    shell = new T.Color(0xa8a28b);

  function bodyAt(x) {
    let i = 0;
    while (i < sections.length - 2 && x > sections[i + 1][0]) i++;
    const a = sections[i],
      b = sections[i + 1],
      p = sections[Math.max(0, i - 1)];
    const q = sections[Math.min(sections.length - 1, i + 2)];
    const span = b[0] - a[0],
      t = clamp((x - a[0]) / span),
      t2 = t * t,
      t3 = t2 * t;
    return [1, 2, 3].map(
      (j) =>
        (2 * t3 - 3 * t2 + 1) * a[j] +
        ((t3 - 2 * t2 + t) * span * (b[j] - p[j])) / (b[0] - p[0]) +
        (-2 * t3 + 3 * t2) * b[j] +
        ((t3 - t2) * span * (q[j] - a[j])) / (q[0] - a[0]),
    );
  }
  function surface(x, angle, inflate = 1) {
    const [cy, ry, rz] = bodyAt(x);
    return new T.Vector3(x, cy + ry * Math.sin(angle) * inflate, rz * Math.cos(angle) * inflate);
  }

  function sculpture() {
    const vertices = [],
      colors = [],
      triangles = [];
    function put(x, y, z, color) {
      colors.push(color.r, color.g, color.b);
      vertices.push(x, y, z);
      return vertices.length / 3 - 1;
    }
    function append(geom, color, transform) {
      if (transform) geom.applyMatrix4(transform);
      const base = vertices.length / 3;
      const coords = geom.attributes.position;
      for (let i = 0; i < coords.count; i++) put(coords.getX(i), coords.getY(i), coords.getZ(i), color);
      if (geom.index) for (const index of geom.index.array) triangles.push(base + index);
      else for (let i = 0; i < coords.count; i++) triangles.push(base + i);
      geom.dispose();
    }
    function oval(point, radii, color) {
      const matrix = new T.Matrix4().makeScale(...radii).setPosition(point);
      append(new T.SphereGeometry(1, 12, 8), color, matrix);
    }
    function stroke(points, radius, color) {
      append(
        new T.TubeGeometry(new T.CatmullRomCurve3(points), points.length * 2, radius, 5, false),
        color,
      );
    }
    function rings(rows, count, sample, reversed = false) {
      const first = vertices.length / 3;
      for (let i = 0; i <= rows; i++) {
        for (let j = 0; j < count; j++) {
          const { point, color } = sample(i / rows, (tau * j) / count);
          put(point.x, point.y, point.z, color);
        }
      }
      for (let i = 0; i < rows; i++)
        for (let j = 0; j < count; j++) {
          const a = first + i * count + j,
            b = first + i * count + ((j + 1) % count);
          const c = a + count,
            d = b + count;
          if (reversed) triangles.push(a, d, c, a, b, d);
          else triangles.push(a, c, d, a, d, b);
        }
    }
    rings(104, 56, (u, angle) => {
      const x = mix(-8.75, 8.66, u),
        point = surface(x, angle);
      const y = Math.sin(angle),
        soft = Math.sin(x * 2.1 + 5.4 * Math.cos(angle));
      const color = black
        .clone()
        .lerp(blue, clamp(0.54 + 0.15 * Math.sin(x * 1.5 + angle) + 0.12 * soft));
      const bellyEdge = -0.64 + 0.39 * smooth(3.3, 7.25, x) + 0.047 * Math.sin(x * 4.2 + angle * 3);
      const belly = smooth(0.22, -0.11, y - bellyEdge);
      color.lerp(white, belly * (0.83 + 0.1 * soft));
      if (u < 0.21) color.lerp(black, 0.44 * (1 - u / 0.21));
      return { point, color };
    });
    for (const side of [-1, 1]) {
      // Each pectoral is a swept, cambered hydrofoil with a notched leading edge.
      rings(
        44,
        20,
        (u, angle) => {
          const taper = Math.max(0.026, Math.pow(1 - u, 0.49));
          const cx = 2.36 - 3.58 * u - 0.37 * Math.sin(Math.PI * u);
          const scallop = 0.17 * Math.cos(u * 7.2 * tau) * Math.sin(Math.PI * u);
          const chord = (1.13 + 0.19 * Math.sin(u * Math.PI)) * taper;
          const c = Math.cos(angle),
            h = Math.sin(angle);
          const point = new T.Vector3(
            cx + chord * c + Math.max(0, c) ** 4 * scallop,
            -0.67 - 1.9 * u + 0.43 * Math.sin(tau * u) + 0.25 * taper * h,
            side * (1.02 + 5.13 * u),
          );
          const tip = smooth(0.28, 0.88, u);
          const light = clamp(
            0.12 + tip * 0.72 + 0.1 * Math.sin(u * 19 + c) + 0.54 * smooth(0.2, -0.35, h),
          );
          return { point, color: flipperDark.clone().lerp(white, light) };
        },
        side > 0,
      );
      // Deeply swept flukes taper from a central V-shaped notch to pointed tips.
      rings(
        40,
        16,
        (u, angle) => {
          const fore = -7.93 - 1.6 * u + 0.31 * Math.sin(Math.PI * u);
          const aft = -8.78 - 0.96 * Math.sin(Math.PI * u) ** 0.73 - 0.76 * u;
          const center = (aft + fore) * 0.5,
            width = Math.max(0.018, (fore - aft) * 0.5);
          const c = Math.cos(angle),
            h = Math.sin(angle);
          const point = new T.Vector3(
            center + width * c,
            0.27 + 0.19 * Math.sin(Math.PI * u) - 0.12 * u + (0.16 * (1 - u) + 0.012) * h,
            side * (0.012 + 3.39 * u),
          );
          const pattern = smooth(0.68, -0.44, h) * (0.36 + 0.37 * Math.sin(u * 5.2) ** 2);
          return { point, color: black.clone().lerp(white, pattern) };
        },
        side > 0,
      );
      const eye = surface(4.16, side === 1 ? 0.05 : Math.PI - 0.05, 1.006);
      oval(eye, [0.22, 0.151, 0.105], ink);
      oval(eye.clone().add(new T.Vector3(0.051, 0.038, side * 0.083)), [0.071, 0.049, 0.029], fleck);
      const lip = [];
      for (let i = 0; i <= 18; i++) {
        const u = i / 18,
          a = -0.08 - 0.19 * Math.sin(Math.PI * u);
        lip.push(surface(3.89 + u * 4.68, side > 0 ? a : Math.PI - a, 1.009));
      }
      stroke(lip, 0.028, ink);
      // Rows of sensory tubercles on the upper jaw, each with an irregular rim.
      for (let i = 0; i < 7; i++) {
        const x = 5.24 + i * 0.5,
          a = 0.42 + i * 0.068;
        const p = surface(x, side > 0 ? a : Math.PI - a, 1.018);
        const size = 0.085 + 0.042 * Math.sin(i * 1.73 + 0.5);
        oval(p, [1.2 * size, 0.85 * size, size], knobs);
        if (i === 2 || i === 4)
          oval(p.clone().add(new T.Vector3(0.04, 0.032, side * 0.055)), [0.051, 0.037, 0.042], shell);
      }
    }
    for (let i = 0; i < 5; i++) {
      const p = surface(5.68 + i * 0.62, Math.PI / 2);
      oval(p, [0.11, 0.075, 0.1], knobs);
    }
    // Ventral throat pleats fan outward under the jaw and converge on the abdomen.
    for (let i = -8; i <= 8; i++) {
      const points = [];
      for (let j = 0; j <= 17; j++) {
        const u = j / 17;
        const angle = 1.5 * Math.PI + (i / 8) * (1.13 + 0.11 * Math.sin(Math.PI * u));
        const x = mix(-0.25 + Math.abs(i) * 0.145, 8.0 - Math.abs(i) * 0.045, u);
        points.push(surface(x, angle, 1.006));
      }
      stroke(points, 0.0155, crease);
    }
    // Low curved dorsal fin, swept backward on a pronounced hump.
    rings(14, 16, (u, angle) => {
      const width = 0.97 * (1 - u) ** 1.68 + 0.012;
      const point = new T.Vector3(
        -2.94 - 0.8 * u + width * Math.cos(angle),
        1.2 + 1.43 * u,
        (0.25 * (1 - u) + 0.01) * Math.sin(angle),
      );
      return { point, color: blue };
    });
    const geometry = new T.BufferGeometry();
    geometry.setAttribute('position', new T.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new T.Float32BufferAttribute(colors, 3));
    geometry.setIndex(triangles);
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    geometry.boundingSphere.radius += 1.8;
    return geometry;
  }

  function skin(clock) {
    const material = new T.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.72,
      metalness: 0.04,
      side: T.DoubleSide,
    });
    material.onBeforeCompile = (shader) => {
      shader.uniforms.whaleTime = clock;
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
        #include <common>
        varying vec3 whaleLocal;
        uniform float whaleTime;
        vec3 spineOffset(vec3 p) {
          float tail = smoothstep(0.3, 8.65, -p.x);
          float wave = whaleTime * 0.94 + p.x * 0.165;
          float wing = smoothstep(1.65, 5.9, abs(p.z)) * smoothstep(-5.0,-2.0,p.x);
          return vec3(0., tail * tail * (1.14 * sin(wave) + .19 * sin(2.0 * wave))
                             + wing * .27 * sin(whaleTime * .62 + sign(p.z) * .55),
                         tail * tail * .22 * sin(wave * .57));
        }`,
      );
      shader.vertexShader = shader.vertexShader.replace(
        '#include <beginnormal_vertex>',
        `
        #include <beginnormal_vertex>
        vec3 xSlope = (spineOffset(position + vec3(.025,0.,0.)) - spineOffset(position)) / .025;
        objectNormal.x -= dot(objectNormal.yz,xSlope.yz);`,
      );
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        whaleLocal = position;
        transformed += spineOffset(position);`,
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `
        #include <common>
        varying vec3 whaleLocal;
        float whaleHash(vec3 p) {
          p = fract(p * vec3(.1031,.1030,.0973));
          p += dot(p, p.yzx + 33.33);
          return fract((p.x + p.y) * p.z);
        }
        float skinNoise(vec3 p) {
          vec3 cell=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
          return mix(mix(mix(whaleHash(cell),whaleHash(cell+vec3(1,0,0)),f.x),
                         mix(whaleHash(cell+vec3(0,1,0)),whaleHash(cell+vec3(1,1,0)),f.x),f.y),
                     mix(mix(whaleHash(cell+vec3(0,0,1)),whaleHash(cell+vec3(1,0,1)),f.x),
                         mix(whaleHash(cell+vec3(0,1,1)),whaleHash(cell+vec3(1,1,1)),f.x),f.y),f.z);
        }`,
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        `
        #include <color_fragment>
        float blotch=skinNoise(whaleLocal*vec3(2.2,3.4,3.4));
        float stipple=skinNoise(whaleLocal*13.0);
        diffuseColor.rgb *= .86 + .20*blotch + .08*stipple;
        diffuseColor.rgb += vec3(.085,.095,.098) * smoothstep(.72,.93,blotch) * smoothstep(.38,.76,stipple);`,
      );
    };
    return material;
  }
  window.HadalWhale = (scene) => {
    const geometry = sculpture(),
      clock = { value: 0 },
      material = skin(clock);
    const pair = [new T.Mesh(geometry, material), new T.Mesh(geometry, material)];
    pair[0].name = 'Humpback / the rift';
    pair[1].name = 'Humpback / silent garden';
    pair[0].scale.setScalar(0.86);
    pair[1].scale.setScalar(1.14);
    pair.forEach((whale) => scene.add(whale));
    let lastTime = Infinity,
      heardFirst = false;
    function swim(whale, phase, cx, cy, cz, rx, rz) {
      whale.position.set(
        cx + rx * Math.sin(phase),
        cy + 0.68 * Math.sin(phase * 1.7),
        cz + rz * Math.cos(phase),
      );
      // In local space the rostrum points along +X. Pitch and roll follow the turn.
      whale.rotation.order = 'YXZ';
      whale.rotation.y = Math.atan2(rz * Math.sin(phase), rx * Math.cos(phase));
      whale.rotation.z = 0.047 * Math.cos(phase * 1.7);
      whale.rotation.x = -0.16 + 0.08 * Math.cos(phase);
    }
    return {
      update(s) {
        if (s.time < lastTime) {
          heardFirst = false;
          // A checkpoint can open directly in the garden. Normal campaign arrivals
          // play the same call from the recovery event in the flight deck.
          if (s.recovered === 2) window.HadalAudio?.play('whale');
        }
        lastTime = s.time;
        clock.value = s.time;
        swim(pair[0], s.time * 0.073 - 1.06, -1, 6.4, -36, 21, 7);
        swim(pair[1], s.time * 0.063 + 0.95, 14, 6.8, -201, 20, 9);
        pair[0].visible = Math.abs(pair[0].position.z - s.z) < 93;
        pair[1].visible = Math.abs(pair[1].position.z - s.z) < 100;
        if (!heardFirst && s.recovered === 0 && s.time > 3.5) {
          const dx = pair[0].position.x - s.x,
            dz = pair[0].position.z - s.z;
          const range = Math.hypot(dx, dz);
          const facing = (dx * Math.sin(s.yaw) - dz * Math.cos(s.yaw)) / Math.max(1, range);
          if (range < 48 && facing > 0.22) {
            window.HadalAudio?.play('whale');
            heardFirst = true;
          }
        }
      },
      destroy() {
        pair.forEach((whale) => scene.remove(whale));
        geometry.dispose();
        material.dispose();
      },
    };
  };
})();
