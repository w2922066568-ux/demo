(() => {
  'use strict';
  const T = window.THREE;
  if (!T) return;
  const vec = (x, y, z) => new T.Vector3(x, y, z);
  function makeVessel(scene) {
    const root = new T.Group();
    scene.add(root);
    const parts = new T.Group();
    root.add(parts);
    const B = window.HadalGeometry.batch(parts);
    const ellipsoid = new T.SphereGeometry(1, 32, 20),
      fastener = new T.SphereGeometry(1, 10, 6);
    const box = new T.BoxGeometry(1, 1, 1);
    const cylinder = new T.CylinderGeometry(1, 1, 1, 18);
    const fineCylinder = new T.CylinderGeometry(1, 1, 1, 8);
    const collar = new T.TorusGeometry(1, 0.075, 8, 32);
    const railRing = new T.TorusGeometry(1, 0.03, 6, 32);
    const dark = new T.MeshStandardMaterial({ color: 0x182326, metalness: 0.43, roughness: 0.48 });
    const steel = new T.MeshStandardMaterial({ color: 0x83919a, metalness: 0.62, roughness: 0.36 });
    const metallic = new T.MeshStandardMaterial({ color: 0x4b5d60, metalness: 0.49, roughness: 0.5 });
    const brass = new T.MeshStandardMaterial({ color: 0xdd9c52, metalness: 0.49, roughness: 0.4 });
    const orange = new T.MeshStandardMaterial({ color: 0xed691b, metalness: 0.16, roughness: 0.46 });
    const ochre = new T.MeshStandardMaterial({ color: 0xde8536, metalness: 0.22, roughness: 0.4 });
    const ivory = new T.MeshStandardMaterial({ color: 0xe7deba, metalness: 0.18, roughness: 0.5 });
    const glazing = new T.MeshPhysicalMaterial({
      color: 0x173e48,
      metalness: 0.38,
      roughness: 0.15,
      clearcoat: 0.9,
      clearcoatRoughness: 0.18,
      emissive: 0x07343f,
      emissiveIntensity: 0.65,
    });
    const blue = new T.MeshBasicMaterial({ color: 0x9cffe5, toneMapped: false });
    const lamp = new T.MeshBasicMaterial({ color: 0xffffd9, toneMapped: false });
    const red = new T.MeshBasicMaterial({ color: 0xff462a, toneMapped: false });
    if (window.HadalSurfaceMaps?.hull) {
      const coating = new T.TextureLoader().load(window.HadalSurfaceMaps.hull);
      coating.wrapS = coating.wrapT = T.RepeatWrapping;
      coating.colorSpace = T.SRGBColorSpace;
      for (const paint of [orange, ochre]) {
        paint.map = coating;
        paint.color.set(paint === orange ? '#bd8c70' : '#dfa882');
        paint.bumpMap = coating;
        paint.bumpScale = 0.026;
      }
    }
    const wire = (a, b, r = 0.033, m = steel) => B.rod(fineCylinder, m, a, b, r);
    const can = (x, y, z, r, h, m, ax = 0, az = 0) => B.add(cylinder, m, x, y, z, r, h, r, ax, 0, az);
    const shell = (x, y, z, rx, ry, rz, m) =>
      B.add(Math.max(rx, ry, rz) < 0.16 ? fastener : ellipsoid, m, x, y, z, rx, ry, rz);
    const disk = (x, y, z, r, depth, m) => can(x, y, z, r, depth, m, Math.PI / 2);
    // Pressure vessel and the segmented glass observation blister.
    shell(0, 0.0, -0.16, 1.08, 0.88, 1.86, dark);
    shell(0, 0.19, -0.22, 1.006, 0.77, 1.7, orange);
    B.add(box, ochre, 0, 0.46, 0.67, 1.32, 0.28, 0.95, -0.09);
    shell(0, 0.42, -1.0, 0.83, 0.67, 0.83, glazing);
    for (const angle of [-1.0, 0, 1.0]) {
      let prev = null;
      for (let i = 0; i <= 10; i++) {
        const a = (Math.PI * i) / 10;
        const point = vec(
          Math.sin(angle) * Math.sin(a) * 0.86,
          0.4 + Math.sin(a) * Math.cos(angle) * 0.71,
          -1.0 - Math.cos(a) * 0.85,
        );
        if (prev) wire(prev, point, 0.032, brass);
        prev = point;
      }
    }
    // Service hatch, brass fasteners, umbilical fairings and the periscope.
    can(0, 0.92, -0.15, 0.39, 0.115, dark);
    can(0, 0.994, -0.15, 0.347, 0.044, ochre);
    B.add(collar, steel, 0, 1.015, -0.15, 0.24, 0.24, 0.24, Math.PI / 2);
    can(-0.44, 0.91, 0.32, 0.09, 0.37, metallic);
    can(-0.44, 1.12, 0.32, 0.048, 0.22, steel);
    B.add(box, dark, -0.44, 1.24, 0.27, 0.17, 0.12, 0.25);
    B.add(box, blue, -0.44, 1.24, 0.128, 0.114, 0.054, 0.018);
    wire(vec(0.46, 0.66, 0.52), vec(0.52, 1.39, 0.68), 0.022, dark);
    shell(0.52, 1.4, 0.68, 0.044, 0.048, 0.044, red);
    for (let i = 0; i < 8; i++) {
      const t = (i * Math.PI) / 4;
      can(Math.cos(t) * 0.292, 1.024, Math.sin(t) * 0.292 - 0.15, 0.022, 0.031, steel);
    }
    // Tail carries a removable instrument pack with the call sign facing the pilot camera.
    B.add(box, dark, 0, 0.03, 1.47, 1.18, 0.91, 0.42);
    B.add(box, orange, 0, 0.1, 1.703, 1.11, 0.75, 0.08);
    for (let i = 0; i < 6; i++)
      B.add(box, metallic, -0.29 + i * 0.115, -0.15, 1.753, 0.077, 0.091, 0.016);
    for (const side of [-1, 1]) {
      const x = side * 1.28;
      // Twin ducted propulsion nacelles and side flotation tanks.
      shell(x, -0.14, 0.13, 0.43, 0.54, 1.63, orange);
      shell(x, -0.19, -1.02, 0.415, 0.446, 0.65, ochre);
      for (const z of [-0.65, 0.65]) {
        B.add(collar, dark, x, -0.14, z, 0.414, 0.514, 0.34);
        B.add(railRing, brass, x, -0.14, z + 0.06, 0.421, 0.52, 0.55);
      }
      disk(x, -0.17, 1.41, 0.444, 0.42, dark);
      B.add(collar, steel, x, -0.17, 1.64, 0.445, 0.445, 0.66);
      B.add(collar, ochre, x, -0.17, 1.57, 0.457, 0.457, 0.71);
      disk(x, -0.17, 1.635, 0.357, 0.02, metallic);
      for (let j = 0; j < 9; j++) {
        const a = (j * Math.PI * 2) / 9;
        wire(
          vec(x + Math.sin(a) * 0.12, -0.17 + Math.cos(a) * 0.12, 1.717),
          vec(x + Math.sin(a) * 0.405, -0.17 + Math.cos(a) * 0.405, 1.668),
          0.0135,
          steel,
        );
      }
      shell(x, -0.17, 1.73, 0.12, 0.12, 0.052, brass);
      B.add(box, dark, x, -0.03, 1.78, 0.15, 0.057, 0.022);
      for (let j = 0; j < 6; j++) {
        const z = -0.3 + 0.2 * j;
        B.add(box, dark, x + side * 0.425, -0.06, z, 0.015, 0.25, 0.07, -0.24, 0, 0);
      }
      // Oval side windows, running light and broad ceramic pressure band.
      for (const z of [-0.22, 0.25]) {
        B.add(collar, brass, side * 0.96, 0.28, z, 0.22, 0.22, 0.32, 0, Math.PI / 2);
        B.add(ellipsoid, glazing, side * 0.982, 0.28, z, 0.045, 0.186, 0.186);
      }
      B.add(box, ivory, x, 0.3, -0.06, 0.42, 0.066, 0.51, -0.025, 0, 0);
      B.add(box, dark, x, 0.333, -0.02, 0.28, 0.035, 0.12);
      B.add(box, side === 1 ? red : blue, x, 0.345, 0.02, 0.11, 0.035, 0.06);
      for (const z of [-0.89, 0.73]) {
        wire(vec(side * 0.69, 0.05, z), vec(x, 0.09, z), 0.095, metallic);
        wire(vec(side * 0.79, -0.52, z), vec(side * 1.48, -0.33, z), 0.057, steel);
        wire(vec(side * 0.66, -0.53, z), vec(side * 0.91, -1.11, z), 0.071, dark);
        wire(vec(side * 1.03, -0.47, z), vec(side * 0.96, -1.13, z), 0.045, steel);
      }
      wire(vec(side * 0.95, -1.12, 1.27), vec(side * 0.95, -1.12, -1.28), 0.071, metallic);
      wire(vec(side * 0.95, -1.12, -1.28), vec(side * 0.95, -0.96, -1.6), 0.073, metallic);
      wire(vec(side * 1.6, -0.1, -0.92), vec(side * 1.57, 0.27, -0.78), 0.037, steel);
      wire(vec(side * 1.57, 0.27, -0.78), vec(side * 1.57, 0.29, 0.79), 0.037, steel);
      wire(vec(side * 1.57, 0.29, 0.79), vec(side * 1.61, -0.08, 0.95), 0.037, steel);
      // Twin lamps are bracketed slightly outboard of the bow.
      wire(vec(x, -0.1, -0.91), vec(side * 1.49, 0.055, -1.48), 0.068, metallic);
      disk(side * 1.39, -0.035, -1.44, 0.191, 0.32, dark);
      disk(side * 1.39, -0.035, -1.625, 0.153, 0.034, lamp);
      B.add(collar, brass, side * 1.39, -0.035, -1.651, 0.167, 0.167, 0.24);
      // Aft maintenance handles and banded ceramic stabilizers.
      wire(vec(side * 0.48, 0.36, 1.63), vec(side * 0.48, 0.35, 1.72), 0.026, metallic);
      wire(vec(side * 0.48, 0.35, 1.72), vec(side * 0.48, -0.12, 1.72), 0.026, metallic);
      B.add(box, orange, side * 1.65, -0.21, 0.82, 0.65, 0.085, 0.61, 0, side * 0.16, side * 0.1);
      B.add(box, ivory, side * 1.85, -0.19, 0.78, 0.115, 0.087, 0.47, 0, side * 0.16, side * 0.1);
      for (let j = 0; j < 5; j++) {
        const z = -0.52 + j * 0.24;
        shell(side * 0.69, 0.7, z, 0.028, 0.024, 0.028, steel);
      }
    }
    // A folded sampling manipulator.
    wire(vec(0.68, -0.48, -0.89), vec(1.02, -0.75, -1.49), 0.105, ochre);
    shell(1.02, -0.75, -1.49, 0.14, 0.14, 0.14, dark);
    wire(vec(1.02, -0.75, -1.49), vec(0.96, -0.69, -1.98), 0.074, steel);
    for (const sign of [-1, 1])
      wire(vec(0.96, -0.69, -1.98), vec(0.96 + sign * 0.085, -0.69, -2.11), 0.028, dark);
    // Exposed cooling pipes and bolted access strips break up the engine deck.
    for (const side of [-1, 1]) {
      for (let i = 0; i < 3; i++) {
        const x = side * (0.38 + i * 0.105),
          y = 0.49 + i * 0.019;
        wire(vec(x, y, 0.51), vec(x, y + 0.08, 0.73), 0.032, metallic);
        wire(vec(x, y + 0.08, 0.73), vec(x, y + 0.08, 1.17), 0.032, brass);
        wire(vec(x, y + 0.08, 1.17), vec(x, y - 0.06, 1.45), 0.032, metallic);
      }
      for (let i = 0; i < 6; i++) {
        shell(side * 0.52, -0.27 + i * 0.104, 1.752, 0.029, 0.032, 0.02, steel);
        shell(
          side * (1.28 + ((i % 2) * 2 - 1) * 0.24),
          0.207,
          -0.53 + i * 0.19,
          0.026,
          0.025,
          0.027,
          steel,
        );
      }
      disk(side * 0.75, -0.29, 1.26, 0.135, 0.23, metallic);
      disk(side * 0.75, -0.29, 1.389, 0.082, 0.035, side === 1 ? red : blue);
      B.add(railRing, metallic, side * 0.75, -0.29, 1.408, 0.128, 0.128, 0.25);
      wire(vec(side * 0.6, -0.48, 0.9), vec(side * 0.6, -0.48, 1.56), 0.043, steel);
      wire(vec(side * 0.6, -0.48, 1.56), vec(side * 0.4, -0.49, 1.75), 0.043, steel);
    }
    B.flush();
    // The aft lettering is a real decal so it stays crisp while the camera moves.
    const label = document.createElement('canvas');
    label.width = 512;
    label.height = 152;
    const ctx = label.getContext('2d');
    ctx.fillStyle = '#b76d34';
    ctx.fillRect(0, 0, 512, 152);
    ctx.fillStyle = '#152d32';
    ctx.font = '900 81px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ORCA–07', 256, 82);
    ctx.fillRect(53, 101, 96, 6);
    ctx.fillRect(363, 101, 96, 6);
    ctx.font = 'bold 16px monospace';
    ctx.fillText('HADAL SURVEY', 256, 114);
    const labelMap = new T.CanvasTexture(label);
    labelMap.colorSpace = T.SRGBColorSpace;
    const labelMesh = new T.Mesh(
      new T.PlaneGeometry(0.87, 0.264),
      new T.MeshStandardMaterial({ map: labelMap, roughness: 0.8 }),
    );
    labelMesh.position.set(0, 0.185, 1.748);
    root.add(labelMesh);

    const rotors = [];
    for (const side of [-1, 1]) {
      const propeller = new T.Group();
      propeller.position.set(side * 1.28, -0.17, 1.692);
      root.add(propeller);
      rotors.push(propeller);
      const bladeBatch = window.HadalGeometry.batch(propeller);
      for (let j = 0; j < 5; j++) {
        const a = (j * Math.PI * 2) / 5;
        bladeBatch.add(
          ellipsoid,
          dark,
          Math.sin(a) * 0.22,
          Math.cos(a) * 0.22,
          0,
          0.062,
          0.172,
          0.026,
          0,
          0.37,
          -a + 0.26,
        );
      }
      bladeBatch.flush();
    }
    const beamMesh = new T.ConeGeometry(2.35, 14, 34, 1, true);
    beamMesh.translate(0, -7, 0);
    beamMesh.rotateX(Math.PI / 2);
    const beamMat = new T.ShaderMaterial({
      transparent: true,
      blending: T.AdditiveBlending,
      depthWrite: false,
      side: T.DoubleSide,
      uniforms: {},
      vertexShader:
        'varying vec3 vBeam; void main(){vBeam=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
      fragmentShader: `varying vec3 vBeam;void main(){float t=clamp(-vBeam.z/14.,0.,1.);float fade=pow(1.-t,2.2);gl_FragColor=vec4(1.0,.84,.54,.082*fade);}`,
    });
    const softGlow = (() => {
      const c = document.createElement('canvas');
      c.width = c.height = 128;
      const ctx = c.getContext('2d');
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(235,255,215,1)');
      grad.addColorStop(0.12, 'rgba(189,255,231,.74)');
      grad.addColorStop(0.36, 'rgba(140,245,218,.20)');
      grad.addColorStop(1, 'rgba(91,225,191,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
      return new T.CanvasTexture(c);
    })();
    const spriteMat = new T.SpriteMaterial({
      map: softGlow,
      transparent: true,
      blending: T.AdditiveBlending,
      depthWrite: false,
      opacity: 0.72,
    });
    for (const side of [-1, 1]) {
      const beam = new T.Mesh(beamMesh, beamMat);
      beam.position.set(side * 1.39, -0.035, -1.64);
      beam.rotation.x = -0.25;
      beam.rotation.y = -side * 0.022;
      root.add(beam);
      const shine = new T.Sprite(spriteMat);
      shine.scale.setScalar(0.69);
      shine.position.copy(beam.position);
      root.add(shine);
    }
    return { root, rotors };
  }
  window.HadalVessel = makeVessel;
})();
