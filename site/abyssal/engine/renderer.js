(() => {
  'use strict';
  const T = window.THREE;
  if (!T) return;
  const TAU = Math.PI * 2;
  const v = (x = 0, y = 0, z = 0) => new T.Vector3(x, y, z);
  function skyDome(scene) {
    const material = new T.ShaderMaterial({
      side: T.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: { time: { value: 0 } },
      vertexShader:
        'varying vec3 vDir; void main(){vDir=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
      fragmentShader: `
        varying vec3 vDir;
        uniform float time;
        void main(){
          vec3 d=normalize(vDir);
          float h=smoothstep(-.31,.56,d.y);
          float back=smoothstep(-.36,.98,d.y);
          vec3 color=mix(vec3(.001,.019,.034), vec3(.004,.113,.170), h);
          color=mix(color, vec3(.049,.410,.39),back*.74);
          float sun=max(0.,dot(d,normalize(vec3(-.45,.68,-.64))));
          color+=vec3(.097,.33,.237)*pow(sun,10.);
          vec2 p=d.xz / max(.12,d.y+.4);
          float drift=time*.028;
          float bundles=sin(p.x*7.+p.y*3.+sin(p.x*3.-p.y*2.+drift)*.51);
          bundles=.5+.5*bundles;
          color+=vec3(.007,.032,.029)*pow(bundles,5.)*smoothstep(-.14,.5,d.y);
          gl_FragColor=vec4(color,1.);
          #include <colorspace_fragment>
        }
      `,
    });
    const mesh = new T.Mesh(new T.SphereGeometry(255, 28, 16), material);
    mesh.renderOrder = -10;
    scene.add(mesh);
    return mesh;
  }
  function scatter(scene) {
    const random = window.HadalGeometry.seeded(7789);
    const count = 1610,
      position = [],
      sizes = [],
      tints = [];
    for (let i = 0; i < count; i++) {
      position.push((random() - 0.5) * 111, (random() - 0.5) * 50, (random() - 0.5) * 110);
      sizes.push(0.36 + random() * 1.19);
      tints.push(random());
    }
    const geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.Float32BufferAttribute(position, 3));
    geo.setAttribute('mSize', new T.Float32BufferAttribute(sizes, 1));
    geo.setAttribute('mTint', new T.Float32BufferAttribute(tints, 1));
    const mat = new T.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: T.AdditiveBlending,
      uniforms: {
        time: { value: 0 },
        eye: { value: v() },
        pixel: { value: 1 },
        pulse: { value: v() },
        radius: { value: 0 },
        strength: { value: 0 },
      },
      vertexShader: `attribute float mSize;attribute float mTint;uniform vec3 eye;uniform float time;uniform float pixel;uniform vec3 pulse;uniform float radius;uniform float strength;varying float intensity;
        void main(){
          vec3 p=position+vec3(time*.075+sin(time*.22+position.z)*.45,time*.10+sin(position.x+time*.23)*.25,0.);
          p=mod(p-eye+vec3(55.5,25.,55.),vec3(111.,50.,110.))-vec3(55.5,25.,55.)+eye;
          vec4 mv=viewMatrix*vec4(p,1.);
          intensity=(.20+.74*mTint)*smoothstep(0.,3.2,-mv.z)*(1.-smoothstep(15.,57.,-mv.z));
          float wave=exp(-abs(distance(p,pulse)-radius)*.37)*strength;
          intensity+=wave*.8;gl_PointSize=(clamp(36.*mSize/max(3.,-mv.z),.75,3.0)+wave*2.)*pixel;
          gl_Position=projectionMatrix*mv;
        }`,
      fragmentShader: `varying float intensity;void main(){float r=length(gl_PointCoord-.5)*2.;
        gl_FragColor=vec4(.52,.91,.85,intensity*(1.-smoothstep(.06,1.,r))*.73);}`,
    });
    const mesh = new T.Points(geo, mat);
    mesh.frustumCulled = false;
    scene.add(mesh);
    return mat;
  }
  function lightShafts(scene) {
    const random = window.HadalGeometry.seeded(8491);
    const materials = [];
    const shafts = new T.PlaneGeometry(1, 1);
    for (let i = 0; i < 30; i++) {
      const px = (random() - 0.52) * 92,
        pz = 45 - i * 10 + random() * 12;
      const m = new T.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: T.DoubleSide,
        blending: T.AdditiveBlending,
        uniforms: { time: { value: 0 }, seed: { value: random() * 25 } },
        vertexShader:
          'varying vec2 st;varying float depth;void main(){st=uv;vec4 p=modelViewMatrix*vec4(position,1.);depth=-p.z;gl_Position=projectionMatrix*p;}',
        fragmentShader: `varying vec2 st;varying float depth;uniform float time;uniform float seed;
          void main(){
            float col=sin(st.x*18.+seed+st.y*.65+sin(time*.09+seed)*.46);
            float width=sin(3.141592*st.x);float height=smoothstep(0.,.44,st.y)*smoothstep(1.,.79,st.y);
            float f=width*width*width*height*(.50+.50*col*col)*smoothstep(.6,16.,depth)*(1.-smoothstep(45.,95.,depth));
            gl_FragColor=vec4(.28,.85,.75,.118*f);
          }`,
      });
      const mesh = new T.Mesh(shafts, m);
      mesh.position.set(px, 19 + random() * 5, pz);
      mesh.scale.set(5 + random() * 12, 59 + random() * 16, 1);
      mesh.rotation.set(0.04, random() * 0.68 - 0.32, -0.36 - random() * 0.2);
      scene.add(mesh);
      materials.push(m);
    }
    return materials;
  }
  // Two slowly banking mantas cross the brighter water above the trench.
  function rays(scene) {
    const list = [];
    for (let i = 0; i < 3; i++) {
      const rows = 8,
        cols = 30,
        vertices = [],
        indices = [],
        uv = [];
      for (let j = 0; j <= rows; j++)
        for (let k = 0; k <= cols; k++) {
          const u = (k / cols) * 2 - 1,
            w = j / rows,
            a = Math.abs(u);
          const front = -1.5 + 1.58 * Math.pow(a, 1.6);
          const trailing = 1.35 - 1.17 * a + 0.27 * Math.sin(a * Math.PI);
          vertices.push(
            u * 3.64,
            0.23 * (1 - a * a) * Math.sin(w * Math.PI),
            front + (trailing - front) * w,
          );
          uv.push(k / cols, w);
        }
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
          const a = y * (cols + 1) + x,
            b = a + 1,
            c = a + cols + 1,
            d = c + 1;
          indices.push(a, c, b, b, c, d);
        }
      const geom = new T.BufferGeometry();
      geom.setIndex(indices);
      geom.setAttribute('position', new T.Float32BufferAttribute(vertices, 3));
      geom.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
      geom.computeVertexNormals();
      const m = new T.MeshStandardMaterial({
        color: 0x568687,
        roughness: 0.64,
        metalness: 0.22,
        side: T.DoubleSide,
      });
      const uni = { value: 0 };
      m.onBeforeCompile = (s) => {
        s.uniforms.rayTime = uni;
        s.vertexShader =
          'uniform float rayTime;\n' +
          s.vertexShader.replace(
            '#include <begin_vertex>',
            `
          #include <begin_vertex>
          float tip=abs(position.x)*.275;
          transformed.y+=pow(tip,1.55)*sin(rayTime*1.08-tip*1.5+position.z*.27)*.97;
        `,
          );
      };
      const object = new T.Group();
      object.add(new T.Mesh(geom, m));
      const tail = new T.Mesh(new T.ConeGeometry(0.095, 2.55, 7), m);
      tail.position.z = 2.35;
      tail.rotation.x = Math.PI / 2;
      object.add(tail);
      const headGeo = new T.SphereGeometry(1, 10, 7);
      for (const s of [-1, 1]) {
        const horn = new T.Mesh(headGeo, m);
        horn.position.set(s * 0.41, 0.01, -1.49);
        horn.scale.set(0.11, 0.12, 0.4);
        horn.rotation.y = s * 0.17;
        object.add(horn);
      }
      object.scale.setScalar(i === 0 ? 0.97 : 1.31);
      scene.add(object);
      list.push({ object, uni });
    }
    return list;
  }
  function wake(scene) {
    const count = 78,
      position = new Float32Array(count * 3),
      sizes = new Float32Array(count);
    const lives = new Float32Array(count);
    lives.fill(-1);
    const driftX = new Float32Array(count),
      driftZ = new Float32Array(count);
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(position, 3));
    g.setAttribute('size', new T.BufferAttribute(sizes, 1));
    const mat = new T.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: T.AdditiveBlending,
      uniforms: { pixel: { value: 1 } },
      vertexShader:
        'attribute float size; uniform float pixel;varying float alpha;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);alpha=min(1.,size*.85);gl_PointSize=max(1.,pixel*min(10.,100.*size/max(2.,-mv.z)));gl_Position=projectionMatrix*mv;}',
      fragmentShader:
        'varying float alpha;void main(){float d=length(gl_PointCoord-.5)*2.;float ring=smoothstep(.34,.77,d)*(1.-smoothstep(.78,1.,d));gl_FragColor=vec4(.46,.80,.76,alpha*(ring*.40+.085*(1.-d)));}',
    });
    const mesh = new T.Points(g, mat);
    mesh.frustumCulled = false;
    scene.add(mesh);
    let idx = 0,
      acc = 0;
    return {
      mat,
      reset() {
        lives.fill(-1);
        sizes.fill(0);
        g.attributes.size.needsUpdate = true;
      },
      update(s, dt) {
        const speed = Math.abs(s.velocity),
          sy = Math.sin(s.yaw),
          cy = Math.cos(s.yaw);
        acc += dt * (2 + Math.min(50, speed * 3.4));
        while (acc > 1) {
          acc--;
          const i = idx++ % count,
            side = (idx % 2 ? 1 : -1) * 1.25;
          position[i * 3] = s.x + cy * side - sy * 1.78 + (Math.random() - 0.5) * 0.25;
          position[i * 3 + 1] = s.y - 0.18 + (Math.random() - 0.5) * 0.33;
          position[i * 3 + 2] = s.z + sy * side + cy * 1.78 + (Math.random() - 0.5) * 0.25;
          driftX[i] = -sy * (0.6 + speed * 0.13) + (Math.random() - 0.5) * 0.32;
          driftZ[i] = cy * (0.6 + speed * 0.13) + (Math.random() - 0.5) * 0.32;
          lives[i] = 1.7 + Math.random() * 0.87;
        }
        for (let i = 0; i < count; i++) {
          if (lives[i] <= 0) {
            sizes[i] = 0;
            continue;
          }
          lives[i] -= dt;
          position[i * 3] += driftX[i] * dt;
          position[i * 3 + 1] += (0.24 + Math.sin(i) * 0.1) * dt;
          position[i * 3 + 2] += driftZ[i] * dt;
          sizes[i] = Math.min(0.67, lives[i]) * (0.45 + (i % 7) * 0.09);
        }
        g.attributes.position.needsUpdate = g.attributes.size.needsUpdate = true;
      },
    };
  }
  function makeRenderer(container) {
    const renderer = new T.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
      stencil: false,
    });
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.13;
    const context = renderer.getContext(),
      deviceInfo = context.getExtension('WEBGL_debug_renderer_info');
    const software =
      deviceInfo &&
      /swiftshader|llvmpipe|software rasterizer/i.test(
        context.getParameter(deviceInfo.UNMASKED_RENDERER_WEBGL),
      );
    const scene = new T.Scene();
    scene.fog = new T.FogExp2(0x124b5d, 0.0165);
    const camera = new T.PerspectiveCamera(59, 1, 0.15, 312);
    const fallbackTex = new T.DataTexture(new Uint8Array([135, 135, 135, 255]), 1, 1, T.RGBAFormat);
    fallbackTex.needsUpdate = true;
    const detailTextures = [];
    function detailTexture(name) {
      if (!window.HadalSurfaceMaps?.[name] && location.protocol === 'file:') return fallbackTex;
      const tex = new T.TextureLoader().load(
        window.HadalSurfaceMaps?.[name] || 'assets/engine/' + name + '.webp',
      );
      tex.wrapS = tex.wrapT = T.RepeatWrapping;
      tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      detailTextures.push(tex);
      return tex;
    }
    const uniforms = {
      cliffTexture: { value: detailTexture('basalt') },
      sandTexture: { value: detailTexture('silt') },
      rockRelief: { value: detailTexture('rock_face_03') },
      sandRelief: { value: detailTexture('coast_sand_rocks_02') },
      uTime: { value: 0 },
      uCraftPosition: { value: v() },
      uCraftDirection: { value: v(0, 0, -1) },
      uPulseOrigin: { value: v() },
      uPulseRadius: { value: -90 },
      uPulseStrength: { value: 0 },
    };
    const hemi = new T.HemisphereLight(0x92bdce, 0x213744, 1.03);
    const sun = new T.DirectionalLight(0xe9fff8, 3.1);
    sun.position.set(-35, 60, -20);
    const rim = new T.DirectionalLight(0x81bbd3, 1.64);
    rim.position.set(10, 9, 25);
    scene.add(hemi, sun, rim);
    // A low-resolution underwater lighting panorama supplies the hull and glass reflections.
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 128;
    envCanvas.height = 64;
    const envCtx = envCanvas.getContext('2d'),
      light = envCtx.createLinearGradient(0, 0, 0, 64);
    light.addColorStop(0, '#c9fff7');
    light.addColorStop(0.23, '#7db8b8');
    light.addColorStop(0.47, '#507580');
    light.addColorStop(0.62, '#263c41');
    light.addColorStop(1, '#17252b');
    envCtx.fillStyle = light;
    envCtx.fillRect(0, 0, 128, 64);
    envCtx.fillStyle = '#e4f4df';
    envCtx.fillRect(22, 8, 17, 10);
    envCtx.fillStyle = '#789ca5';
    envCtx.fillRect(80, 15, 27, 8);
    const envTexture = new T.CanvasTexture(envCanvas);
    envTexture.colorSpace = T.SRGBColorSpace;
    envTexture.mapping = T.EquirectangularReflectionMapping;
    const generator = new T.PMREMGenerator(renderer);
    const envMap = generator.fromEquirectangular(envTexture);
    scene.environment = envMap.texture;
    envTexture.dispose();
    generator.dispose();
    const sky = skyDome(scene);
    const world = window.HadalGeometry.makeWorld(scene, uniforms);
    const whale = window.HadalWhale?.(scene);
    const craft = window.HadalVessel(scene);
    const motes = scatter(scene),
      shafts = lightShafts(scene),
      animals = rays(scene),
      trail = wake(scene);
    const sonarMap = new T.Mesh(
      new T.RingGeometry(0.985, 1, 144),
      new T.MeshBasicMaterial({
        color: 0x8ef4d0,
        blending: T.AdditiveBlending,
        side: T.DoubleSide,
        transparent: true,
        depthWrite: false,
        opacity: 0,
      }),
    );
    sonarMap.rotation.x = -Math.PI / 2;
    scene.add(sonarMap);
    const craftKey = new T.PointLight(0xffcf9c, 16, 13, 2.0);
    scene.add(craftKey);
    const canvas = renderer.domElement;
    canvas.setAttribute('aria-label', '可驾驶的深海探测场景');
    canvas.style.cssText = 'display:block;width:100%;height:100%;';
    container.appendChild(canvas);
    let yaw = 0,
      look = v(),
      smoothY = 0,
      width = 0,
      height = 0,
      quality = 'auto',
      adaptiveRatio = software ? 0.85 : 1.5,
      slowTime = 0,
      fastTime = 0,
      previousFrame = 0;
    const desired = v(),
      aim = v(),
      projected = v(),
      dir = v();
    function resize() {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      const cap = quality === 'low' ? 0.88 : quality === 'high' ? 1.8 : adaptiveRatio;
      const ratio = Math.min(window.devicePixelRatio || 1, cap, Math.sqrt(2100000 / (width * height)));
      renderer.setPixelRatio(Math.max(0.63, ratio));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      motes.uniforms.pixel.value = trail.mat.uniforms.pixel.value = renderer.getPixelRatio();
    }
    const ro = window.ResizeObserver ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(container);
    else window.addEventListener('resize', resize);
    resize();
    function draw(s, dt, hard = false) {
      const now = performance.now();
      if (!hard && quality === 'auto' && previousFrame) {
        const cost = now - previousFrame;
        slowTime = cost > 39 ? slowTime + Math.min(cost, 200) : Math.max(0, slowTime - cost * 0.28);
        fastTime = cost < 22 ? fastTime + cost : Math.max(0, fastTime - cost * 0.2);
        if (slowTime > 1600 && adaptiveRatio > 0.7) {
          adaptiveRatio = Math.max(0.7, adaptiveRatio - 0.2);
          slowTime = 0;
          resize();
        }
        if (fastTime > 8500 && adaptiveRatio < 1.45) {
          adaptiveRatio += 0.12;
          fastTime = 0;
          resize();
        }
      }
      previousFrame = now;
      const t = s.time;
      const vessel = craft.root;
      vessel.position.set(s.x, s.y + Math.sin(t * 1.37) * 0.043, s.z);
      vessel.rotation.order = 'YXZ';
      vessel.rotation.y = -s.yaw;
      vessel.rotation.x = s.pitch + Math.sin(t * 0.84) * 0.008;
      vessel.rotation.z = s.bank + Math.sin(t * 0.76) * 0.015;
      craft.rotors[0].rotation.z += dt * (4.5 + Math.abs(s.velocity) * 2.85);
      craft.rotors[1].rotation.z -= dt * (4.5 + Math.abs(s.velocity) * 2.85);
      dir.set(Math.sin(s.yaw), 0, -Math.cos(s.yaw));
      uniforms.uCraftPosition.value.copy(vessel.position);
      uniforms.uCraftDirection.value.copy(dir);
      uniforms.uCraftDirection.value.y = -0.32;
      uniforms.uCraftDirection.value.normalize();
      uniforms.uTime.value = t;
      uniforms.uPulseOrigin.value.set(s.pingX, s.pingY, s.pingZ);
      uniforms.uPulseRadius.value = s.pingAge * 32;
      uniforms.uPulseStrength.value = s.pingAge < 3.5 ? Math.min(1, (3.5 - s.pingAge) * 1.9) : 0;
      craftKey.position.copy(vessel.position).add(v(0, 3.25, 2.1));
      if (hard) {
        yaw = s.yaw;
        smoothY = s.y;
        trail.reset();
        previousFrame = 0;
      }
      yaw += Math.atan2(Math.sin(s.yaw - yaw), Math.cos(s.yaw - yaw)) * (1 - Math.exp(-dt * 4.6));
      smoothY += (s.y - smoothY) * (1 - Math.exp(-dt * 4.8));
      const aspect = camera.aspect,
        boom = aspect < 0.83 ? 9.8 : 8.65;
      const lateral = aspect > 1.25 ? 1.82 : 0.37;
      const cx = Math.cos(yaw),
        sx = Math.sin(yaw),
        baseY = smoothY;
      desired.set(s.x - sx * boom + cx * lateral, baseY + 3.03, s.z + cx * boom + sx * lateral);
      desired.y = Math.max(desired.y, window.HadalGeometry.floorAt(desired.x, desired.z) + 1.8);
      aim.set(s.x + sx * 5.0, baseY + 1.37, s.z - cx * 5.0);
      const lerp = hard ? 1 : 1 - Math.exp(-dt * 6.6);
      camera.position.lerp(desired, lerp);
      look.lerp(aim, hard ? 1 : 1 - Math.exp(-dt * 7.5));
      camera.up.set(s.bank * 0.073, 1, 0).normalize();
      camera.lookAt(look);
      camera.updateMatrixWorld();
      const fov = 59 + (s.boosting ? 5 : 0);
      if (Math.abs(camera.fov - fov) > 0.025) {
        camera.fov += (fov - camera.fov) * (1 - Math.exp(-dt * 3.2));
        camera.updateProjectionMatrix();
      }
      sky.position.copy(camera.position);
      sky.material.uniforms.time.value = t;
      sonarMap.visible = s.pingAge < 3.5;
      if (sonarMap.visible) {
        sonarMap.position.set(s.pingX, s.pingY - 0.89 - Math.min(s.pingAge, 1) * 0.75, s.pingZ);
        sonarMap.scale.setScalar(Math.max(0.01, s.pingAge * 32));
        sonarMap.material.opacity = 0.34 * Math.max(0, 1 - s.pingAge / 3.5);
      }
      motes.uniforms.pulse.value.copy(uniforms.uPulseOrigin.value);
      motes.uniforms.radius.value = uniforms.uPulseRadius.value;
      motes.uniforms.strength.value = uniforms.uPulseStrength.value;
      motes.uniforms.eye.value.copy(camera.position);
      motes.uniforms.time.value = t;
      shafts.forEach((m) => (m.uniforms.time.value = t));
      world.update(
        t,
        s.recovered,
        s.z,
        quality === 'low' || (software && quality !== 'high') ? 0.82 : 1,
      );
      whale?.update(s);
      animals.forEach(({ object, uni }, i) => {
        const phase = t * 0.087 + i * 2.4;
        object.position.set(
          10 + Math.sin(phase) * 13,
          6 + i * 2.5 + Math.sin(phase * 0.6) * 1.4,
          -34 - i * 75 + Math.cos(phase) * 5,
        );
        object.rotation.set(
          0.02,
          Math.atan2(-Math.cos(phase) * 13, -Math.sin(phase) * 5),
          Math.sin(phase) * 0.1,
        );
        uni.value = t + i * 2.3;
      });
      trail.update(s, dt);
      renderer.render(scene, camera);
    }
    function targetProjection(target) {
      projected.set(target.x, target.y + 1.35, target.z).project(camera);
      return {
        targetX: (projected.x + 1) / 2,
        targetY: (1 - projected.y) / 2,
        targetVisible:
          projected.z >= -1 &&
          projected.z <= 1 &&
          Math.abs(projected.x) < 0.98 &&
          Math.abs(projected.y) < 0.98,
      };
    }
    function destroy() {
      whale?.destroy();
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', resize);
      const geometries = new Set(),
        materials = new Set(),
        textures = new Set();
      scene.traverse((o) => {
        if (o.isInstancedMesh) o.dispose();
        if (o.geometry) geometries.add(o.geometry);
        if (o.material)
          for (const m of Array.isArray(o.material) ? o.material : [o.material]) materials.add(m);
      });
      for (const m of materials) {
        if (m.map) textures.add(m.map);
        m.dispose();
      }
      geometries.forEach((g) => g.dispose());
      textures.forEach((t) => t.dispose());
      envMap.dispose();
      detailTextures.forEach((t) => t.dispose());
      fallbackTex.dispose();
      renderer.dispose();
      canvas.remove();
    }
    return {
      draw,
      targetProjection,
      destroy,
      setQuality(value) {
        quality = value;
        resize();
      },
    };
  }
  window.HadalRenderer = makeRenderer;
})();
