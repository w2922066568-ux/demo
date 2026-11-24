(() => {
  'use strict';
  const TAU = Math.PI * 2;
  const wrapAngle = (a) => Math.atan2(Math.sin(a), Math.cos(a));
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const floor =
    window.HadalGeometry?.floorAt ||
    ((x, z) =>
      -10 +
      1.85 * Math.sin(z * 0.043 + 0.7 * Math.sin(x * 0.074)) +
      1.05 * Math.cos(x * 0.12 + z * 0.054) +
      0.52 * Math.sin(z * 0.17 - x * 0.12) +
      0.22 * Math.cos(x * 0.43 + z * 0.18));
  const targets =
    window.HadalGeometry?.beacons ||
    [
      [4, -53],
      [-22, -127],
      [17, -212],
    ].map(([x, z]) => ({ x, y: floor(x, z) + 7, z }));
  const keys = {
    KeyW: 'forward',
    ArrowUp: 'forward',
    KeyS: 'back',
    ArrowDown: 'back',
    KeyA: 'left',
    ArrowLeft: 'left',
    KeyD: 'right',
    ArrowRight: 'right',
    KeyR: 'rise',
    KeyF: 'dive',
    ShiftLeft: 'boost',
    ShiftRight: 'boost',
    Space: 'sonar',
    KeyE: 'recover',
  };
  const controls = new Set(Object.values(keys));
  const depthBases = [3800, 4120, 4600];
  const entryPositions = [
    [0, 3, -2],
    [-2, -74, -2],
    [-10, -155, -1.8],
  ];

  function create(container, handlers = {}) {
    const onEvent = typeof handlers.onEvent === 'function' ? handlers.onEvent : () => {};
    const onUpdate = typeof handlers.onUpdate === 'function' ? handlers.onUpdate : () => {};
    const onComplete = typeof handlers.onComplete === 'function' ? handlers.onComplete : () => {};
    let view = null,
      running = false,
      initialized = false,
      completed = false,
      frameId = 0,
      lastTime = 0,
      lastReport = 0,
      nearLast = false;
    let quality = 'auto';
    const held = new Set(),
      keyHeld = new Set();
    const s = {};
    function target() {
      return targets[Math.min(2, s.recovered)];
    }
    function distance() {
      const p = target();
      return Math.hypot(p.x - s.x, p.y - s.y, p.z - s.z);
    }
    function report() {
      const p = target(),
        dist = distance(),
        relative = wrapAngle(Math.atan2(p.x - s.x, s.z - p.z) - s.yaw);
      const depth = s.depthBand + s.entryY - s.y;
      const canRecover = !completed && dist <= 10.5;
      onUpdate({
        depth: Math.round(depth),
        heading: ((Math.round((s.yaw * 180) / Math.PI) % 360) + 360) % 360,
        speed: Math.abs(s.velocity),
        distance: Math.max(0, dist),
        targetDy: p.y - s.y,
        bearing: (relative * 180) / Math.PI,
        canRecover,
        recovered: s.recovered,
        sector: Math.min(s.recovered, 2),
        sonarCooldown: s.cooldown,
        sonarPulse: clamp(1 - s.pingAge / 3.5, 0, 1),
        x: s.x,
        y: s.y,
        z: s.z,
        ...view.targetProjection(p),
      });
      if (canRecover && !nearLast) onEvent('near', { sector: s.recovered });
      nearLast = canRecover;
    }
    function clear() {
      held.clear();
      keyHeld.clear();
      s.boosting = false;
    }
    function act(name, pressed = true) {
      if (!running || !controls.has(name)) return;
      if (!pressed) {
        held.delete(name);
        return;
      }
      if (held.has(name)) return;
      held.add(name);
      if (name === 'sonar' && s.cooldown <= 0) {
        s.pingX = s.x;
        s.pingY = s.y;
        s.pingZ = s.z;
        s.pingAge = 0;
        s.cooldown = 4;
        onEvent('ping', { sector: s.recovered, distance: distance() });
        report();
      }
      if (name === 'recover') {
        if (distance() <= 10.5) {
          const sector = s.recovered;
          s.recovered++;
          nearLast = false;
          completed = s.recovered >= 3;
          onEvent('recover', { sector, recovered: s.recovered });
          s.pingX = s.x;
          s.pingY = s.y;
          s.pingZ = s.z;
          s.pingAge = 0;
          if (completed) {
            pause();
            view.draw(s, 0);
            report();
            onComplete({ recovered: 3, time: s.time, distance: s.travel });
            return;
          }
          report();
        } else onEvent('distant', { sector: s.recovered, distance: distance() });
      }
    }
    function key(e, down) {
      if (!running || e.altKey || e.ctrlKey || e.metaKey) return;
      const name = keys[e.code];
      if (
        !name ||
        e.target?.isContentEditable ||
        /^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName || '')
      )
        return;
      e.preventDefault();
      if (down) {
        if (keyHeld.has(e.code)) return;
        keyHeld.add(e.code);
      } else {
        keyHeld.delete(e.code);
        if ([...keyHeld].some((code) => keys[code] === name)) return;
      }
      act(name, down);
    }
    const keyDown = (e) => key(e, true),
      keyUp = (e) => key(e, false);
    const blur = () => clear();
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    window.addEventListener('blur', blur);
    const onVisibility = () => {
      if (document.hidden) clear();
    };
    document.addEventListener('visibilitychange', onVisibility);
    function step(dt) {
      const throttle = Number(held.has('forward')) - Number(held.has('back'));
      const steer = Number(held.has('right')) - Number(held.has('left'));
      const vertical = Number(held.has('rise')) - Number(held.has('dive'));
      const boosting = held.has('boost') && throttle > 0;
      if (boosting && !s.boosting) onEvent('boost', {});
      s.boosting = boosting;
      const desired = throttle > 0 ? (boosting ? 17.6 : 9.2) : throttle * 5.8;
      s.velocity += (desired - s.velocity) * (1 - Math.exp(-dt * (throttle ? 1.43 : 1.95)));
      s.turn += (steer * (boosting ? 0.77 : 1.14) - s.turn) * (1 - Math.exp(-dt * 4.2));
      s.yaw = wrapAngle(s.yaw + s.turn * dt);
      s.bank += (-s.turn * 0.149 - s.bank) * (1 - Math.exp(-dt * 4));
      s.vertical += (vertical * 5.8 - s.vertical) * (1 - Math.exp(-dt * 2.45));
      s.pitch += (s.vertical * 0.028 - s.velocity * 0.0024 - s.pitch) * (1 - Math.exp(-dt * 3.0));
      const ox = s.x,
        oz = s.z;
      s.x = clamp(s.x + Math.sin(s.yaw) * s.velocity * dt, -61, 61);
      s.z = clamp(s.z - Math.cos(s.yaw) * s.velocity * dt, -256, 38);
      s.y = clamp(s.y + s.vertical * dt, floor(s.x, s.z) + 1.54, 16.8);
      // The hydrostatic controller holds the craft clear of outcrops and the seabed.
      const obstacles = window.HadalGeometry?.obstacles;
      if (obstacles)
        for (const ob of obstacles) {
          if (Math.abs(s.z - ob.z) > ob.d + 1.5 || Math.abs(s.x - ob.x) > ob.w + 1.5) continue;
          const dy = (s.y - ob.y) / (ob.h + 0.5);
          if (Math.abs(dy) >= 1) continue;
          const factor = Math.sqrt(1 - dy * dy);
          const rx = ob.w * factor + 1,
            rz = ob.d * factor + 1;
          const dx = (s.x - ob.x) / rx,
            dz = (s.z - ob.z) / rz,
            n = Math.hypot(dx, dz);
          if (n >= 1 || n < 0.001) continue;
          s.x = ob.x + (dx / n) * rx;
          s.z = ob.z + (dz / n) * rz;
          s.velocity *= Math.exp(-dt * 0.9);
        }
      s.y = Math.max(s.y, floor(s.x, s.z) + 1.54);
      s.depthBand += (depthBases[Math.min(s.recovered, 2)] - s.depthBand) * (1 - Math.exp(-dt * 0.6));
      s.travel += Math.hypot(s.x - ox, s.z - oz);
      s.time += dt;
      s.pingAge += dt;
      s.cooldown = Math.max(0, s.cooldown - dt);
    }
    function frame(time) {
      if (!running) return;
      const dt = lastTime ? Math.min(0.15, (time - lastTime) / 1000) : 1 / 60;
      lastTime = time;
      const count = Math.max(1, Math.ceil(dt / 0.0334));
      for (let i = 0; i < count; i++) step(dt / count);
      view.draw(s, dt);
      if (time - lastReport >= 80) {
        report();
        lastReport = time;
      }
      if (running) frameId = requestAnimationFrame(frame);
    }
    function pause() {
      running = false;
      clear();
      cancelAnimationFrame(frameId);
    }
    function resume() {
      if (!initialized || running || completed) return;
      running = true;
      lastTime = 0;
      lastReport = 0;
      frameId = requestAnimationFrame(frame);
    }
    function start(index = 0) {
      pause();
      if (!view) {
        try {
          if (!window.HadalRenderer) throw new Error('WebGL resources unavailable');
          view = window.HadalRenderer(container);
        } catch (error) {
          console.warn('Hadal is using its Canvas navigation renderer.', error);
          view = makeCanvasView(container);
        }
      }
      view.setQuality(quality);
      const sector = clamp(Math.floor(Number(index) || 0), 0, 2),
        [x, z, y] = entryPositions[sector],
        p = targets[sector];
      Object.assign(s, {
        x,
        y,
        z,
        entryY: y,
        depthBand: depthBases[sector],
        yaw: Math.atan2(p.x - x, z - p.z),
        velocity: 0,
        vertical: 0,
        turn: 0,
        bank: 0,
        pitch: 0,
        recovered: sector,
        time: 0,
        travel: 0,
        pingAge: 10,
        cooldown: 0,
        pingX: x,
        pingY: y,
        pingZ: z,
        boosting: false,
      });
      initialized = true;
      completed = false;
      nearLast = false;
      view.draw(s, 1 / 60, true);
      report();
      resume();
    }
    function destroy() {
      pause();
      initialized = false;
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      window.removeEventListener('blur', blur);
      document.removeEventListener('visibilitychange', onVisibility);
      view?.destroy();
      view = null;
    }
    return {
      start,
      resume,
      pause,
      destroy,
      action: act,
      setQuality(value) {
        quality = ['low', 'high', 'auto'].includes(value) ? value : 'auto';
        view?.setQuality(quality);
      },
    };
  }

  // Perspective Canvas view for browsers without an accelerated WebGL context.
  // It shares the same positions, input, physics, objectives, pulse, and campaign.
  function makeCanvasView(container) {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;width:100%;height:100%';
    canvas.setAttribute('aria-label', '深海探测场景');
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let width = 2,
      height = 2,
      dpr = 1,
      state,
      eye,
      sy,
      cy,
      focal,
      horizon;
    const random = (() => {
      let n = 986511;
      return () => (n = (Math.imul(n, 1664525) + 1013904223) >>> 0) / 4294967296;
    })();
    const rocks = [],
      flecks = [];
    for (let i = 0; i < 680; i++) {
      const z = -274 + random() * 334,
        x = (i % 2 ? -1 : 1) * (14 + random() * 59),
        w = 1.2 + random() * 8,
        h = 3.2 + random() * 22;
      rocks.push({ x, y: floor(x, z), z, w, h, seed: random(), shade: random() });
    }
    for (let i = 0; i < 400; i++) flecks.push([random(), random(), random()]);
    function size() {
      const rect = container.getBoundingClientRect();
      width = Math.max(2, Math.round(rect.width));
      height = Math.max(2, Math.round(rect.height));
      dpr = Math.min(1.5, devicePixelRatio || 1);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }
    const ro = window.ResizeObserver ? new ResizeObserver(size) : null;
    if (ro) ro.observe(container);
    else window.addEventListener('resize', size);
    size();
    function point(x, y, z) {
      const dx = x - eye.x,
        dz = z - eye.z,
        d = dx * sy - dz * cy;
      return {
        x: width / 2 + ((dx * cy + dz * sy) / Math.max(0.001, d)) * focal,
        y: horizon - ((y - eye.y) / Math.max(0.001, d)) * focal,
        d,
      };
    }
    function fillPoly(points, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath();
      ctx.fill();
    }
    function ellipse(x, y, rx, ry, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, 0, TAU);
      ctx.fill();
    }
    function draw(s) {
      state = s;
      sy = Math.sin(s.yaw);
      cy = Math.cos(s.yaw);
      focal = height * 0.93;
      horizon = height * 0.43;
      eye = { x: s.x - 8.5 * sy, y: s.y + 3.1, z: s.z + 8.5 * cy };
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, '#398d93');
      bg.addColorStop(0.46, '#205f70');
      bg.addColorStop(0.77, '#214f54');
      bg.addColorStop(1, '#142f39');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < 9; i++) {
        const pos = width * ((i * 0.193 + 1.4 - 0.08 * s.yaw) % 1.5) - width * 0.18;
        const g = ctx.createLinearGradient(pos, 0, pos - width * 0.21, height * 0.65);
        g.addColorStop(0, 'rgba(147,241,215,.09)');
        g.addColorStop(1, 'rgba(147,241,215,0)');
        fillPoly(
          [
            [pos, 0],
            [pos + width * 0.04, 0],
            [pos - width * 0.18, height * 0.68],
            [pos - width * 0.29, height * 0.68],
          ],
          g,
        );
      }
      const visible = [];
      for (const r of rocks) {
        const p = point(r.x, r.y, r.z);
        if (p.d < 1 || p.d > 128) continue;
        const k = focal / p.d;
        if (p.x < -k * r.w || p.x > width + k * r.w) continue;
        visible.push({ r, p, k });
      }
      visible.sort((a, b) => b.p.d - a.p.d);
      for (const { r, p, k } of visible) {
        const x = p.x,
          y = p.y,
          w = k * r.w,
          h = k * r.h,
          f = clamp(p.d / 112, 0, 1);
        const col = (n) =>
          'rgb(' +
          Math.floor(12 + 20 * f + n) +
          ',' +
          Math.floor(35 + 53 * f + n) +
          ',' +
          Math.floor(41 + 63 * f + n) +
          ')';
        fillPoly(
          [
            [x - w, y],
            [x - w * 0.73, y - h * 0.73],
            [x - w * 0.25, y - h],
            [x + w * 0.35, y - h * 0.84],
            [x + w * 0.81, y - h * 0.3],
            [x + w, y],
          ],
          col(r.shade * 9),
        );
        fillPoly(
          [
            [x - w * 0.25, y - h],
            [x + w * 0.35, y - h * 0.84],
            [x + w * 0.81, y - h * 0.3],
            [x + w, y],
            [x - w * 0.05, y - h * 0.33],
          ],
          col(r.shade * 8 - 5),
        );
        if (r.seed > 0.72 && p.d < 55) {
          ctx.strokeStyle = 'rgba(121,215,199,' + (1 - f) * 0.66 + ')';
          ctx.lineWidth = Math.max(1, k * 0.04);
          ctx.beginPath();
          ctx.moveTo(x - w * 0.5, y - h * 0.26);
          ctx.lineTo(x - w * 0.52, y - h * 0.36);
          ctx.lineTo(x - w * 0.58, y - h * 0.39);
          ctx.stroke();
        }
      }
      const target = targets[Math.min(s.recovered, 2)],
        tp = point(target.x, target.y, target.z);
      if (s.recovered < 3 && tp.d > 1) {
        const k = focal / tp.d,
          aw = k * 9.4;
        ctx.strokeStyle = 'rgba(43,74,76,.92)';
        ctx.lineWidth = k * 1.1;
        ctx.beginPath();
        ctx.arc(tp.x, tp.y + k * 2, aw, Math.PI, TAU);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(151,219,193,.42)';
        ctx.lineWidth = Math.max(1, k * 0.09);
        ctx.beginPath();
        ctx.arc(tp.x, tp.y + k * 2, aw * 0.96, Math.PI * 1.19, Math.PI * 1.86);
        ctx.stroke();
        ctx.fillStyle = '#ed9138';
        ctx.fillRect(tp.x - k * 0.43, tp.y - k * 0.67, k * 0.86, k * 1.32);
        ellipse(tp.x, tp.y - k * 0.72, k * 0.34, k * 0.13, '#b2ffe0');
      }
      for (let i = 0; i < flecks.length; i++) {
        const [ox, oy, seed] = flecks[i],
          t = s.time * (0.006 + seed * 0.012);
        const nx = (ox - s.x * 0.0014 - t + 3) % 1,
          ny = (oy - s.y * 0.009 - t + 3) % 1;
        ctx.fillStyle = 'rgba(191,243,223,' + (0.07 + seed * 0.38) + ')';
        ctx.fillRect(nx * width, ny * height, 0.5 + seed * 1.2, 0.5 + seed * 1.2);
      }
      if (s.pingAge < 3.5) {
        const p = point(s.pingX, s.pingY, s.pingZ);
        if (p.d > 0) {
          ctx.strokeStyle = 'rgba(127,255,209,' + clamp(1 - s.pingAge / 3.5, 0, 1) * 0.63 + ')';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, s.pingAge * width * 0.44 + 1, s.pingAge * height * 0.21 + 1, 0, 0, TAU);
          ctx.stroke();
        }
      }
      const pp = point(s.x, s.y, s.z),
        scale = Math.min(height * 0.13, width * 0.2);
      ctx.save();
      ctx.translate(pp.x, pp.y);
      ctx.rotate(-s.bank);
      ctx.scale(scale, scale);
      for (const side of [-1, 1]) {
        const glow = ctx.createLinearGradient(0, -0.35, 0, -1.6);
        glow.addColorStop(0, 'rgba(196,255,219,.23)');
        glow.addColorStop(1, 'rgba(162,249,229,0)');
        fillPoly(
          [
            [side * 0.88, -0.35],
            [side * 0.64, -0.35],
            [side * 0.64 - 0.56, -1.6],
            [side * 0.65 + 0.56, -1.6],
          ],
          glow,
        );
      }
      const body = ctx.createLinearGradient(-1, -0.5, 0.36, 0.76);
      body.addColorStop(0, '#ffc069');
      body.addColorStop(0.49, '#df752e');
      body.addColorStop(0.85, '#a64f28');
      body.addColorStop(1, '#523b31');
      ellipse(0, 0, 0.8, 0.66, '#1e3236');
      ellipse(0, -0.055, 0.75, 0.56, body);
      ellipse(0, -0.42, 0.53, 0.28, '#182d31');
      ellipse(0, -0.45, 0.47, 0.19, '#559098');
      ctx.fillStyle = '#e68c3f';
      ctx.fillRect(-0.39, -0.08, 0.78, 0.4);
      ctx.fillStyle = '#152a2d';
      ctx.font = 'bold .13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('ORCA–07', 0, 0.085);
      for (const side of [-1, 1]) {
        ellipse(side * 0.84, 0.1, 0.29, 0.45, body);
        ellipse(side * 0.84, 0.26, 0.24, 0.24, '#adb1a2');
        ellipse(side * 0.84, 0.27, 0.205, 0.202, '#20383d');
        ctx.save();
        ctx.translate(side * 0.84, 0.27);
        ctx.rotate(s.time * (4 + Math.abs(s.velocity)) * side);
        for (let i = 0; i < 5; i++) {
          ctx.rotate(TAU / 5);
          ellipse(0, -0.094, 0.031, 0.097, '#637d78');
        }
        ctx.restore();
        ellipse(side * 0.84, 0.27, 0.041, 0.041, '#cb985e');
        ellipse(side * 0.89, -0.23, 0.088, 0.059, '#e5f4d3');
        ctx.strokeStyle = '#495b5a';
        ctx.lineWidth = 0.046;
        ctx.beginPath();
        ctx.moveTo(side * 0.59, 0.32);
        ctx.lineTo(side * 0.66, 0.62);
        ctx.lineTo(side * 0.88, 0.62);
        ctx.stroke();
      }
      ctx.restore();
    }
    function targetProjection(t) {
      if (!state) return { targetX: 0.5, targetY: 0.5, targetVisible: false };
      const p = point(t.x, t.y + 1.3, t.z);
      return {
        targetX: p.x / width,
        targetY: p.y / height,
        targetVisible: p.d > 0 && p.x > 0 && p.x < width && p.y > 0 && p.y < height,
      };
    }
    return {
      draw,
      targetProjection,
      setQuality() {},
      destroy() {
        if (ro) ro.disconnect();
        else window.removeEventListener('resize', size);
        canvas.remove();
      },
    };
  }
  window.HadalGame = { create };
})();
