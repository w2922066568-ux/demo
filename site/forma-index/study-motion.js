(() => {
  'use strict';

  const studies = [
    {
      id: 'FOLD', title: '一条曲线，如何长成一朵花？',
      text: '沿同一条闭合曲线逐层旋转截面，微小的角度差会累积成花瓣。拖动滑杆，观察平整的线圈如何展开褶皱。',
      parameter: '折叠幅度', value: 64, name: '珊瑚色的缎带沿曲线旋展',
      palette: [[146, 57, 93], [255, 188, 156], [252, 129, 149], [172, 78, 127]]
    },
    {
      id: 'ORBIT', title: '两条轨迹，怎样共享一个中心？',
      text: '将一组圆环绕同一根轴旋转，环间的空隙会随角度收窄、打开。改变倾角，追踪两条轨迹相遇的位置。',
      parameter: '轨道倾角', value: 54, name: '两束淡紫色轨迹绕行于共同的重心',
      palette: [[111, 91, 184], [203, 211, 255], [220, 165, 249], [128, 103, 200]]
    },
    {
      id: 'STRATA', title: '一叠薄片，能有多深的峡谷？',
      text: '把起伏的曲面切成连续的剖面，线与线之间就留下了高度。拉开层间距，让压缩的等高线慢慢升起。',
      parameter: '层间距离', value: 58, name: '琥珀色的剖面随地势错动和堆叠',
      palette: [[138, 68, 63], [249, 173, 103], [255, 216, 153], [198, 114, 75]]
    }
  ];

  const layers = 52;
  const steps = 120;
  const tau = 2 * Math.PI;
  const curve = Array.from({length: steps + 1}, (_, index) => {
    const t = index / steps * tau;
    return { t, cos: Math.cos(t), sin: Math.sin(t) };
  });

  // Each surface uses the same number of control points so switching studies
  // can carry every filament continuously from one shape into the next.
  function fold(points, parameter, time) {
    let offset = 0;
    const breath = Math.sin(time * .78);
    const yaw = time * .22;
    const curl = .12 + parameter * .39;
    for (let line = 0; line < layers; line++) {
      const v = line / (layers - 1);
      const twist = v * (1.15 + parameter * 1.05) + yaw;
      const ct = Math.cos(twist), st = Math.sin(twist);
      for (const {t, cos, sin} of curve) {
        const wave = 4 * t + v * 1.55 + .56 * breath;
        const edge = .28 + .61 * v + curl * (.32 + .68 * v) * Math.cos(wave);
        const x = (cos * ct - sin * st) * edge;
        const y = (sin * ct + cos * st) * edge;
        const lift = Math.sin(wave + v * .95) * curl + .18 * (v - .5);
        points[offset++] = x * 1.22 + .12 * lift;
        points[offset++] = y * .6 - lift * .86 - x * .18;
      }
    }
  }

  function orbit(points, parameter, time) {
    let offset = 0;
    const spin = time * .54;
    const camera = .34 * Math.sin(time * .47);
    const ca = Math.cos(camera), sa = Math.sin(camera);
    for (let line = 0; line < layers; line++) {
      const group = line < layers / 2 ? -1 : 1;
      const v = (line % (layers / 2)) / (layers / 2 - 1) - .5;
      const tilt = group * (.08 + 1.18 * parameter) + v * .53 + .12 * Math.sin(spin);
      const ct = Math.cos(tilt), st = Math.sin(tilt);
      const sweep = spin + group * 1.05 + v * .27;
      for (const {t, cos, sin} of curve) {
        const ripple = Math.sin(2 * t + sweep);
        const radius = 1.04 + v * .2 + .08 * ripple;
        const x = cos * radius, z = sin * radius;
        const y = .16 * Math.sin(2 * t - sweep) + v * .2;
        const ex = x * ct - y * st, ey = x * st + y * ct;
        points[offset++] = (ex * ca + z * sa) * 1.39;
        points[offset++] = ey * .79 + (z * ca - ex * sa) * .41;
      }
    }
  }

  function strata(points, parameter, time) {
    let offset = 0;
    const wind = time * .78;
    const yaw = .19 + Math.sin(wind * .43) * .22;
    const ca = Math.cos(yaw), sa = Math.sin(yaw);
    for (let line = 0; line < layers; line++) {
      const v = line / (layers - 1);
      const peak = Math.sin(v * Math.PI);
      for (const {t, cos, sin} of curve) {
        const contour = .94 + .14 * Math.cos(3 * t + v * 3.4 + wind * .69)
                           + .09 * Math.sin(2 * t - v * 3.8 - wind * .43);
        const terrace = (1 - v * .34) * contour;
        const x = 1.3 * cos * terrace + (v - .5) * .26;
        const z = .76 * sin * terrace;
        const ridge = .15 * Math.sin(2 * t + wind + v * 2.1) + .09 * Math.cos(3 * t - wind * .47);
        const lift = (v - .5) * (.19 + parameter * 1.13) + peak * ridge;
        points[offset++] = 1.08 * (x * ca + z * sa);
        points[offset++] = -lift + .49 * (z * ca - x * sa) - x * .12;
      }
    }
  }

  const surfaces = [fold, orbit, strata];
  const gradientStops = [0, .34, .65, 1];
  const mounted = new WeakSet();

  function mount() {
    const panel = document.getElementById('studyPanel');
    if (!panel || mounted.has(panel)) return;
    const canvas = document.getElementById('studyCanvas');
    const context = canvas.getContext('2d');
    if (!context) return;
    mounted.add(panel);

    const slider = document.getElementById('studyValue');
    const output = document.getElementById('studyResult');
    const title = document.getElementById('noteTitle');
    const body = document.getElementById('noteText');
    const identifier = document.getElementById('studyId');
    const parameterLabel = document.getElementById('studyParam');
    const tabs = [...document.querySelectorAll('[data-note]')];
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const values = studies.map(study => study.value);
    const controls = document.createElement('div');
    controls.style.cssText = 'display:flex;align-items:center;gap:.7rem';
    const playback = document.createElement('button');
    playback.type = 'button';
    playback.id = 'studyPlayback';
    playback.className = 'icon-btn motion-toggle';
    playback.setAttribute('aria-controls', 'studyCanvas');
    const glyph = document.createElement('span');
    glyph.className = 'pause-glyph';
    glyph.setAttribute('aria-hidden', 'true');
    playback.append(glyph);
    identifier.after(controls);
    controls.append(identifier, playback);

    let active = 0, value = values[0] / 100;
    let running = !reduce.matches, visible = false;
    let frame = 0, lastTime = 0, phase = .7, morph = 1;
    let width = 0, height = 0, pixelRatio = 1;
    const points = new Float32Array(layers * (steps + 1) * 2);
    const startPoints = new Float32Array(points.length);
    let palette = studies[0].palette;
    let startPalette = palette;

    function draw() {
      if (!width || !height) return;
      const progress = 1 - Math.pow(1 - morph, 3);
      const colors = studies[active].palette;
      palette = morph === 1 ? colors : colors.map((rgb, i) =>
        rgb.map((channel, k) => Math.round(startPalette[i][k] + (channel - startPalette[i][k]) * progress)));
      surfaces[active](points, value, phase);
      if (morph < 1) {
        for (let i = 0; i < points.length; i++) points[i] = startPoints[i] + (points[i] - startPoints[i]) * progress;
      }
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);
      const scale = Math.min(width * .26, height * .34);
      const cx = width * .5, cy = height * .5;
      const gradient = context.createLinearGradient(cx - scale * 1.28, cy + scale * .6, cx + scale * 1.24, cy - scale * .6);
      palette.forEach((rgb, i) => gradient.addColorStop(gradientStops[i], 'rgb(' + rgb.join(',') + ')'));
      context.strokeStyle = gradient;
      context.lineJoin = 'round';
      let offset = 0;
      for (let line = 0; line < layers; line++) {
        const depth = line / (layers - 1);
        context.globalAlpha = .32 + .56 * depth;
        context.lineWidth = .7 + .52 * depth;
        context.beginPath();
        context.moveTo(cx + points[offset++] * scale, cy + points[offset++] * scale);
        for (let k = 1; k <= steps; k++) {
          context.lineTo(cx + points[offset++] * scale, cy + points[offset++] * scale);
        }
        context.stroke();
      }
      context.globalAlpha = 1;
    }

    function updateBounds() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      pixelRatio = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.round(width * pixelRatio)), h = Math.max(1, Math.round(height * pixelRatio));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      if (visible && !document.hidden) draw();
    }

    let covered = Boolean(document.querySelector('dialog[open]'));
    function synchronize() {
      const needsFrame = running || morph < 1;
      if (visible && !document.hidden && !covered && needsFrame) {
        if (!frame) frame = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
        lastTime = 0;
      }
    }

    function tick(timestamp) {
      frame = 0;
      const dt = lastTime ? Math.min(.064, (timestamp - lastTime) / 1000) : 0;
      lastTime = timestamp;
      if (running) phase += dt;
      morph = Math.min(1, morph + dt / .85);
      draw();
      synchronize();
    }

    function syncPlayback() {
      const label = running ? '暂停形态草图动态' : '播放形态草图动态';
      playback.classList.toggle('is-paused', !running);
      playback.setAttribute('aria-label', label);
      playback.title = label;
      synchronize();
    }
    playback.addEventListener('click', () => { running = !running; syncPlayback(); });
    reduce.addEventListener('change', () => {
      running = !reduce.matches;
      if (reduce.matches) morph = 1;
      if (visible) draw();
      syncPlayback();
    });
    document.addEventListener('visibilitychange', synchronize);
    const dialogs = new MutationObserver(() => {
      covered = Boolean(document.querySelector('dialog[open]'));
      synchronize();
    });
    document.querySelectorAll('dialog').forEach(dialog => dialogs.observe(dialog, {attributes: true, attributeFilter: ['open']}));

    function updateParameter() {
      values[active] = Number(slider.value);
      value = values[active] / 100;
      const displayed = slider.value + '%';
      output.value = displayed;
      slider.style.setProperty('--pct', displayed);
      slider.setAttribute('aria-valuetext', displayed);
      if (visible) draw();
    }

    function select(index) {
      if (active === index) return;
      startPoints.set(points);
      startPalette = palette;
      morph = !reduce.matches && visible ? 0 : 1;
      active = index;
      const study = studies[index];
      tabs.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
      title.textContent = study.title;
      body.textContent = study.text;
      identifier.textContent = 'STUDY / ' + study.id;
      parameterLabel.textContent = study.parameter;
      canvas.setAttribute('aria-label', study.name);
      slider.value = values[index];
      updateParameter();
      synchronize();
    }

    tabs.forEach((button, index) => button.addEventListener('click', () => select(index)));
    slider.addEventListener('input', updateParameter);
    new ResizeObserver(updateBounds).observe(canvas);
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) updateBounds();
      synchronize();
    }).observe(canvas);
    canvas.setAttribute('aria-label', studies[0].name);
    updateBounds();
    updateParameter();
    syncPlayback();
  }

  window.FormaStudy = {mount};
})();
