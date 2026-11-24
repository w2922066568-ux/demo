/* Cinderline — first-person movement, encounter simulation, and combat effects. */
(function () {
  'use strict';

  const MAGAZINE = 30;
  const RELOAD_TIME = 1.56;
  const AUX_CHARGE_TIME = 2.8;
  const PLAYER_RADIUS = 0.34;
  const EYE_HEIGHT = 1.68;
  const MAX_RAY = 100;
  const WAVES = [
    { name: 'Breach the intake', units: ['scout', 'scout', 'scout'] },
    { name: 'Secure the turbine', units: ['scout', 'scout', 'heavy', 'scout'] },
    { name: 'Break the lockdown', units: ['heavy', 'scout', 'scout', 'heavy', 'scout'] }
  ];
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const damp = (a, b, rate, dt) => a + (b - a) * (1 - Math.exp(-rate * dt));

  function overlaps(x, z, radius, box) {
    const dx = x - clamp(x, box.minX, box.maxX);
    const dz = z - clamp(z, box.minZ, box.maxZ);
    return dx * dx + dz * dz < radius * radius;
  }

  // One flow field per player position gives every drone a route around intact cover.
  class Navigation {
    constructor(bounds, obstacles) {
      this.bounds = bounds;
      this.step = 1.05;
      this.cols = Math.ceil((bounds.maxX - bounds.minX) / this.step);
      this.rows = Math.ceil((bounds.maxZ - bounds.minZ) / this.step);
      const count = this.cols * this.rows;
      this.passable = new Uint8Array(count);
      this.cost = new Int16Array(count);
      this.queue = new Int32Array(count);
      this.goal = -1;
      for (let n = 0; n < count; n++) {
        const x = this.x(n), z = this.z(n);
        this.passable[n] = !obstacles.some(b => b.height > 0.85 && overlaps(x, z, 0.75, b));
      }
    }
    x(n) { return this.bounds.minX + (n % this.cols + 0.5) * this.step; }
    z(n) { return this.bounds.minZ + (Math.floor(n / this.cols) + 0.5) * this.step; }
    index(x, z) {
      const col = clamp(Math.floor((x - this.bounds.minX) / this.step), 0, this.cols - 1);
      const row = clamp(Math.floor((z - this.bounds.minZ) / this.step), 0, this.rows - 1);
      return row * this.cols + col;
    }
    neighbors(n, visit) {
      if (n % this.cols > 0) visit(n - 1);
      if ((n + 1) % this.cols > 0) visit(n + 1);
      if (n >= this.cols) visit(n - this.cols);
      if (n + this.cols < this.cost.length) visit(n + this.cols);
    }
    update(x, z) {
      let goal = this.index(x, z);
      if (!this.passable[goal]) {
        let best = Infinity;
        for (let n = 0; n < this.passable.length; n++) {
          if (!this.passable[n]) continue;
          const d = (x - this.x(n)) ** 2 + (z - this.z(n)) ** 2;
          if (d < best) { best = d; goal = n; }
        }
      }
      if (this.goal === goal) return;
      this.goal = goal;
      this.cost.fill(-1);
      this.cost[goal] = 0;
      let read = 0, write = 1;
      this.queue[0] = goal;
      while (read < write) {
        const n = this.queue[read++];
        this.neighbors(n, next => {
          if (!this.passable[next] || this.cost[next] !== -1) return;
          this.cost[next] = this.cost[n] + 1;
          this.queue[write++] = next;
        });
      }
    }
    next(x, z) {
      const n = this.index(x, z);
      let best = n, score = this.cost[n] < 0 ? Infinity : this.cost[n];
      this.neighbors(n, next => {
        const cost = this.cost[next];
        if (cost >= 0 && cost < score) { score = cost; best = next; }
      });
      return best;
    }
  }

  class Effects {
    constructor(scene) {
      this.scene = scene;
      this.traces = [];
      this.pending = [];
      this.cylinder = new THREE.CylinderGeometry(1, 1, 1, 6, 1, true);
      this.up = new THREE.Vector3(0, 1, 0);
      this.axis = new THREE.Vector3();
      this.cursor = 0;
      const limit = 260;
      this.limit = limit;
      this.life = new Float32Array(limit);
      this.vel = new Float32Array(limit * 3);
      this.pos = new Float32Array(limit * 3);
      this.rgb = new Float32Array(limit * 3);
      this.size = new Float32Array(limit);
      this.geometry = new THREE.BufferGeometry();
      this.geometry.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
      this.geometry.setAttribute('color', new THREE.BufferAttribute(this.rgb, 3).setUsage(THREE.DynamicDrawUsage));
      this.geometry.setAttribute('size', new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage));
      this.material = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        uniforms: { scale: { value: 550 } },
        vertexShader: 'attribute float size; attribute vec3 color; varying vec3 tint; uniform float scale; void main(){tint=color;vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_PointSize=clamp(size*scale/max(0.12,-p.z),0.,26.);}',
        fragmentShader: 'varying vec3 tint;void main(){vec2 p=gl_PointCoord*2.-1.;float r=dot(p,p);if(r>1.)discard;gl_FragColor=vec4(tint,(1.-r)*(1.-r));}'
      });
      this.points = new THREE.Points(this.geometry, this.material);
      this.points.frustumCulled = false;
      scene.add(this.points);
    }
    line(a, b, color, width, opacity, duration) {
      let mesh = this.traces.pop();
      if (!mesh) {
        mesh = new THREE.Mesh(this.cylinder, new THREE.MeshBasicMaterial({
          transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false
        }));
        this.scene.add(mesh);
      }
      this.axis.subVectors(b, a);
      const length = Math.max(0.001, this.axis.length());
      mesh.position.copy(a).addScaledVector(this.axis, 0.5);
      mesh.quaternion.setFromUnitVectors(this.up, this.axis.divideScalar(length));
      mesh.scale.set(width, length, width);
      mesh.material.color.setHex(color);
      mesh.material.opacity = opacity;
      mesh.visible = true;
      this.pending.push({mesh, life:duration, duration, opacity});
    }
    burst(p, count, color, power) {
      for (let j = 0; j < count; j++) {
        const i = this.cursor++ % this.limit, k = i * 3;
        this.pos[k] = p.x; this.pos[k + 1] = p.y; this.pos[k + 2] = p.z;
        this.vel[k] = (Math.random() - 0.5) * power;
        this.vel[k + 1] = (Math.random() * 0.9 + 0.05) * power;
        this.vel[k + 2] = (Math.random() - 0.5) * power;
        this.rgb[k] = color[0]; this.rgb[k + 1] = color[1]; this.rgb[k + 2] = color[2];
        this.life[i] = 0.16 + Math.random() * 0.6;
        this.size[i] = 0.035 + Math.random() * 0.09;
      }
      this.geometry.attributes.color.needsUpdate = true;
    }
    update(dt) {
      for (let j = this.pending.length - 1; j >= 0; j--) {
        const item = this.pending[j];
        item.life -= dt;
        item.mesh.material.opacity = item.opacity * Math.max(0, item.life / item.duration);
        if (item.life > 0) continue;
        item.mesh.visible = false;
        this.traces.push(item.mesh);
        this.pending.splice(j, 1);
      }
      for (let i = 0; i < this.limit; i++) {
        if (this.life[i] <= 0) continue;
        this.life[i] -= dt;
        const k = i * 3;
        this.pos[k] += this.vel[k] * dt;
        this.pos[k + 1] += this.vel[k + 1] * dt;
        this.pos[k + 2] += this.vel[k + 2] * dt;
        this.vel[k + 1] -= 7 * dt;
        if (this.life[i] <= 0 || this.pos[k + 1] < 0.02) { this.size[i] = 0; this.life[i] = 0; }
      }
      this.geometry.attributes.size.needsUpdate = true;
      this.geometry.attributes.position.needsUpdate = true;
    }
    clear() {
      this.pending.forEach(item => { item.mesh.visible = false; this.traces.push(item.mesh); });
      this.pending.length = 0;
      this.life.fill(0);
      this.size.fill(0);
      this.geometry.attributes.size.needsUpdate = true;
    }
  }

  function create(canvas, callbacks = {}) {
    const emitState = callbacks.onState || (() => {});
    const emitHUD = callbacks.onHUD || (() => {});
    const sound = callbacks.onSound || (() => {});
    let renderer, scene, camera, arena, arms, fx;
    try {
      renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: false, powerPreference:'high-performance'});
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(71, 1, 0.055, 330);
      camera.rotation.order = 'YXZ';
      scene.add(camera);
      arena = window.CinderArena(scene, renderer);
      arms = new window.CinderArms(camera, scene);
      fx = new Effects(scene);
    } catch (error) {
      if (renderer) renderer.dispose();
      const failure = () => emitState('error', { message: error.message || 'WebGL could not initialize.' });
      failure();
      const noop = () => {};
      return {start:failure, reset:failure, resume:failure, pause:noop, menu:noop, move:noop, look:noop, action:noop, setSensitivity:noop, setQuality:noop, dispose:noop};
    }

    const bounds = arena.bounds;
    const obstacles = arena.obstacles || [];
    const nav = new Navigation(bounds, obstacles);
    const boxes = obstacles.map(b => new THREE.Box3(new THREE.Vector3(b.minX, 0, b.minZ), new THREE.Vector3(b.maxX,b.height,b.maxZ)));
    const ray = new THREE.Ray(), hitPoint = new THREE.Vector3(), sphere = new THREE.Sphere();
    const v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), v3 = new THREE.Vector3();
    const eye = new THREE.Vector3(), direction = new THREE.Vector3(), endPoint = new THREE.Vector3();
    const muzzle = new THREE.Vector3(), aimPoint = new THREE.Vector3();
    const enemies = [], bolts = [], pressed = new Set();
    const signal = new AbortController();
    const on = (el, evt, fn, options) => el.addEventListener(evt, fn, Object.assign({signal:signal.signal}, options));
    const touch = {x:0, forward:0};
    const player = new THREE.Vector3();
    let state = 'menu', quality = 'high', sensitivity = 1, frame = 0, previousFrame = 0;
    let width = 0, height = 0, autoLock = false, disposed = false;
    let yaw = 0, pitch = 0, recoil = 0, swayX = 0, swayY = 0, velocityY = 0, grounded = true;
    let velocityX = 0, velocityZ = 0, moveAmount = 0, sprinting = false, aiming = false;
    let shooting = false, aimHeld = false, sprintHeld = false, footPhase = 0, stepTime = 0;
    let health = 100, ammo = MAGAZINE, reserve = 150, score = 0, kills = 0, shots = 0, hits = 0;
    let wave = 0, countInWave = 0, waveDelay = 0, elapsed = 0, damageFlash = 0, hitMarker = 0;
    let cooldown = 0, loadLeft = 0, cellRecovery = false, deathShake = 0, safeTime = 0, danger = 0, heading = 0;
    let announcement = '', announcementTimer = 0, hudTimer = 0, target = null;
    let viewportScale = 1, framePass = null, passUnavailable = false;

    function result() {
      return { kills, score, shots, hits, accuracy:shots ? Math.round(hits / shots * 100) : 0, time:elapsed, wave:wave + 1 };
    }
    function spatialSound(cue,position) {
      const dx = position.x-player.x, dz = position.z-player.z;
      const distance = Math.hypot(dx,dz);
      const pan = clamp((dx*Math.cos(yaw)-dz*Math.sin(yaw))/Math.max(0.001,distance),-1,1);
      sound(cue,{pan,distance});
    }
    function publishHUD() {
      const level = WAVES[wave];
      emitHUD({
        health:Math.ceil(health), maxHealth:100, ammo, capacity:MAGAZINE, reserve,
        wave:wave + 1, waves:WAVES.length, objective:level.name, kills, waveKills:countInWave,
        waveTotal:level.units.length, remaining:Math.max(0, level.units.length - countInWave),
        score, elapsed, heading, reloading:loadLeft > 0, charging:cellRecovery,
        reloadProgress:loadLeft ? 1 - loadLeft / (cellRecovery ? AUX_CHARGE_TIME : RELOAD_TIME) : 0,
        hitMarker, damageFlash, aiming, sprinting, spread:clamp((aiming ? 0.03 : 0.16) + moveAmount * 0.21 + recoil * 8,0,1),
        announcement, announcementTimer, danger,
        target:target ? {name:target.heavy ? 'Warden' : 'Interceptor', hp:target.hp, maxHP:target.maxHP} : null,
        drones:enemies.map(e => {
          const p = e.model.group.position, dx = p.x - player.x, dz = p.z - player.z;
          const angle = Math.atan2(dx, -dz) + yaw;
          return {angle:Math.atan2(Math.sin(angle),Math.cos(angle)), distance:Math.hypot(dx,dz)};
        })
      });
    }
    function resize(force) {
      const w = Math.max(1, canvas.clientWidth || window.innerWidth);
      const h = Math.max(1, canvas.clientHeight || window.innerHeight);
      if (!force && width === w && height === h) return;
      width = w; height = h;
      const density = window.devicePixelRatio || 1;
      viewportScale = quality === 'low' ? Math.min(0.82,density) : quality === 'medium' ? Math.min(1.1,density) : Math.min(1.6,density);
      // Cap fill cost on very large desktop and ultrawide screens.
      viewportScale = Math.min(viewportScale, Math.sqrt((quality === 'low' ? 1150000 : quality === 'medium' ? 1900000 : 3100000) / (w*h)));
      renderer.setPixelRatio(viewportScale);
      renderer.setSize(w,h,false);
      if (quality === 'high' && !passUnavailable && window.CinderFrame) {
        try {
          if (!framePass) framePass = new window.CinderFrame(renderer);
          if (framePass.ready) framePass.size(canvas.width,canvas.height);
          else passUnavailable = true;
        } catch (_) {
          if (framePass) framePass.dispose();
          framePass = null; passUnavailable = true;
        }
      } else if (quality !== 'high' && framePass) {
        framePass.dispose(); framePass = null;
      }
      camera.aspect = w/h;
      camera.updateProjectionMatrix();
      fx.material.uniforms.scale.value = h * viewportScale;
    }
    function setQuality(value) {
      const q = String(value).toLowerCase();
      quality = ['low','medium','high'].includes(q) ? q : 'high';
      renderer.shadowMap.enabled = quality !== 'low';
      renderer.shadowMap.needsUpdate = true;
      resize(true);
    }
    function wallDistance(origin, dir, cap = MAX_RAY) {
      ray.set(origin,dir);
      let best = cap;
      for (const box of boxes) {
        if (!ray.intersectBox(box,hitPoint)) continue;
        const d = origin.distanceTo(hitPoint);
        if (d < best) best = d;
      }
      if (dir.y < -0.0001 && origin.y > 0) best = Math.min(best, -origin.y / dir.y);
      return best;
    }
    function enemyHit(origin,dir,range) {
      let selected = null, distance = range;
      ray.set(origin,dir);
      for (const enemy of enemies) {
        const group = enemy.model.group, size = enemy.heavy ? 1.18 : 1;
        const ca = Math.cos(group.rotation.y), sa = Math.sin(group.rotation.y);
        for (let side = -1; side <= 1; side++) {
          sphere.center.copy(group.position);
          sphere.center.x += side * ca * 0.73 * size;
          sphere.center.z -= side * sa * 0.73 * size;
          sphere.radius = (side ? 0.38 : 0.60) * size;
          if (!ray.intersectSphere(sphere,hitPoint)) continue;
          const dist = origin.distanceTo(hitPoint);
          if (dist < distance) { distance = dist; selected = enemy; }
        }
      }
      return {enemy:selected, distance};
    }
    function clearInput() {
      pressed.clear(); touch.x = touch.forward = 0;
      shooting = aimHeld = sprintHeld = aiming = sprinting = false;
    }
    function clearWorld() {
      for (const enemy of enemies) enemy.model.destroy();
      enemies.length = 0;
      bolts.length = 0;
      target = null;
      fx.clear();
    }
    function requestLock() {
      if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
      if (!canvas.requestPointerLock || document.pointerLockElement === canvas) return;
      try {
        const result = canvas.requestPointerLock();
        if (result && result.catch) result.catch(() => {});
      } catch (_) { /* Drag-to-look remains available in restricted browser views. */ }
    }
    function releaseLock() {
      autoLock = false;
      if (document.pointerLockElement === canvas && document.exitPointerLock) document.exitPointerLock();
    }
    function schedule() {
      if (!frame && !disposed) frame = requestAnimationFrame(tick);
    }
    function pickSpawns(number) {
      const list = arena.enemySpawns.map(p => ({x:p.x, z:p.z, d:Math.hypot(p.x - player.x,p.z - player.z), luck:Math.random()}));
      list.sort((a,b) => (b.d >= 8) - (a.d >= 8) || b.luck - a.luck);
      if (!list.length) list.push({x:bounds.minX+2,z:bounds.minZ+2});
      return Array.from({length:number}, (_,i) => list[i % list.length]);
    }
    function deployWave(index) {
      wave = index; countInWave = 0; waveDelay = 0;
      const level = WAVES[wave];
      const spawns = pickSpawns(level.units.length);
      for (let i = 0; i < level.units.length; i++) {
        const type = level.units[i], heavy = type === 'heavy', p = spawns[i];
        const hover = (heavy ? 2.10 : 2.00) + (i % 3) * 0.20;
        const position = new THREE.Vector3(p.x,hover,p.z);
        const model = new window.CinderDrone(scene,position,type);
        model.group.position.copy(position);
        const hp = heavy ? 145 : 75;
        enemies.push({model, heavy, hp, maxHP:hp, hover, seed:Math.random() * 100, cd:1.4 + i * 0.66,
          charge:0, shotAim:new THREE.Vector3(), drift:i % 2 ? 1 : -1, speed:heavy ? 1.60 : 2.35,
          nextSense:i * 0.065, visible:false, stuck:0, goalDistance:heavy ? 16 : 12 + (i%3)*2 });
      }
      if (index) { reserve = Math.min(210,reserve + 60); health = Math.min(100,health + 20); }
      announcement = level.name;
      announcementTimer = 2.4;
      sound('wave');
      publishHUD();
    }
    function start() {
      if (disposed) return;
      clearInput(); clearWorld();
      const spawn = arena.spawn;
      player.set(spawn.x,0,spawn.z);
      yaw = pitch = recoil = swayX = swayY = velocityX = velocityY = velocityZ = moveAmount = 0;
      health = 100; ammo = MAGAZINE; reserve = 150; score = kills = shots = hits = 0;
      wave = countInWave = waveDelay = cooldown = loadLeft = deathShake = 0;
      damageFlash = hitMarker = elapsed = footPhase = stepTime = hudTimer = safeTime = danger = heading = 0;
      grounded = true; cellRecovery = false;
      camera.position.set(player.x,EYE_HEIGHT,player.z);
      camera.rotation.set(0,0,0,'YXZ');
      camera.fov = 71; camera.updateProjectionMatrix();
      resize(true);
      state = 'playing';
      previousFrame = 0;
      emitState(state,result());
      deployWave(0);
      requestLock();
      schedule();
    }
    function pause() {
      if (state !== 'playing') return;
      state = 'paused';
      clearInput(); releaseLock();
      emitState(state,result());
    }
    function resume() {
      if (state !== 'paused' || disposed) return;
      clearInput(); previousFrame = 0;
      state = 'playing'; emitState(state,result());
      requestLock(); schedule();
    }
    function menu() {
      state = 'menu'; clearInput(); releaseLock(); clearWorld();
      emitState(state,result());
    }
    function finish(won) {
      if (state !== 'playing') return;
      state = won ? 'won' : 'lost';
      clearInput(); releaseLock();
      publishHUD();
      sound(won ? 'win' : 'lose');
      emitState(state,result());
    }
    function reload() {
      if (state !== 'playing' || loadLeft > 0 || reserve <= 0 || ammo >= MAGAZINE) return;
      loadLeft = RELOAD_TIME;
      arms.reload(); sound('reload'); publishHUD();
    }
    function fire() {
      if (cooldown > 0 || loadLeft > 0 || state !== 'playing') return;
      if (!ammo) {
        if (reserve) reload();
        else { sound('dry'); cooldown = 0.35; }
        return;
      }
      ammo--; shots++;
      cooldown = 0.106;
      camera.updateMatrixWorld(true);
      eye.copy(camera.position);
      camera.getWorldDirection(direction);
      const dispersion = aiming ? 0.00045 : 0.0016 + moveAmount * 0.0019;
      direction.x += (Math.random() - 0.5) * dispersion;
      direction.y += (Math.random() - 0.5) * dispersion;
      direction.normalize();
      const limit = wallDistance(eye,direction);
      const shot = enemyHit(eye,direction,limit);
      endPoint.copy(eye).addScaledVector(direction,shot.distance);
      if (arms.flash) arms.flash.getWorldPosition(muzzle);
      else muzzle.set(aiming ? 0.009 : 0.18,aiming ? -0.115 : -0.19,-0.7).applyMatrix4(camera.matrixWorld);
      fx.line(muzzle,endPoint,0xffaf67,0.009,0.85,0.055);
      if (shot.enemy) {
        const e = shot.enemy;
        e.hp -= 28;
        e.model.hit();
        hitMarker = 1; hits++;
        fx.burst(endPoint,9,[0.64,0.89,1.0],3.4);
        if (e.hp <= 0) {
          const where = e.model.group.position;
          fx.burst(where,50,[1.0,0.31,0.065],7);
          fx.burst(where,14,[0.5,0.8,1.0],9);
          e.model.destroy();
          enemies.splice(enemies.indexOf(e),1);
          if (target === e) target = null;
          kills++; countInWave++; score += e.heavy ? 300 : 150;
          spatialSound('kill',where);
          if (!enemies.length) {
            waveDelay = wave === WAVES.length-1 ? 0.9 : 2.4;
            announcement = wave === WAVES.length-1 ? 'Lockdown lifted' : 'Sector clear';
            announcementTimer = waveDelay;
          }
        } else { sound('hit'); }
      } else if (limit < MAX_RAY) { fx.burst(endPoint,7,[1.0,0.56,0.18],3); }
      recoil = Math.min(0.047,recoil + (aiming ? 0.010 : 0.016));
      arms.fire(); sound('fire');
      if (!ammo && !reserve && enemies.length) {
        cellRecovery = true; loadLeft = AUX_CHARGE_TIME;
        announcement = 'Auxiliary cell charging'; announcementTimer = AUX_CHARGE_TIME;
        sound('reload');
      }
      publishHUD();
    }
    function canMove(x,z,r,foot,margin) {
      if (x < bounds.minX + margin || x > bounds.maxX - margin || z < bounds.minZ + margin || z > bounds.maxZ - margin) return false;
      return !obstacles.some(b => b.height > foot + 0.045 && overlaps(x,z,r,b));
    }
    function jump() {
      if (!grounded || state !== 'playing') return;
      velocityY = 5.55; grounded = false; sound('jump');
    }
    function movePlayer(dt) {
      let lateral = Number(pressed.has('KeyD')) - Number(pressed.has('KeyA')) + touch.x;
      let forward = Number(pressed.has('KeyW')) - Number(pressed.has('KeyS')) + touch.forward;
      const mag = Math.hypot(lateral,forward);
      if (mag > 1) { lateral /= mag; forward /= mag; }
      const sin = Math.sin(yaw), cos = Math.cos(yaw);
      aiming = aimHeld && loadLeft <= 0;
      sprinting = (sprintHeld || pressed.has('ShiftLeft') || pressed.has('ShiftRight')) && forward > 0.15 && !aiming && !shooting && loadLeft <= 0;
      const speed = sprinting ? 7.7 : aiming ? 2.8 : 4.9;
      velocityX = damp(velocityX,(lateral*cos - forward*sin)*speed,grounded ? 16 : 6,dt);
      velocityZ = damp(velocityZ,(-forward*cos - lateral*sin)*speed,grounded ? 16 : 6,dt);
      const nextX = player.x + velocityX * dt, nextZ = player.z + velocityZ * dt;
      if (canMove(nextX,player.z,PLAYER_RADIUS,player.y,PLAYER_RADIUS)) player.x = nextX;
      else velocityX = 0;
      if (canMove(player.x,nextZ,PLAYER_RADIUS,player.y,PLAYER_RADIUS)) player.z = nextZ;
      else velocityZ = 0;
      const oldY = player.y;
      velocityY -= 15.2 * dt;
      player.y += velocityY * dt;
      let floor = 0;
      for (const b of obstacles) {
        if (b.height <= oldY + 0.07 && b.height > floor && overlaps(player.x,player.z,PLAYER_RADIUS * 0.83,b)) floor = b.height;
      }
      if (player.y <= floor) {
        if (!grounded && velocityY < -4.2) { deathShake = Math.max(deathShake,0.14); sound('step'); }
        player.y = floor; velocityY = 0; grounded = true;
      } else grounded = false;
      moveAmount = clamp(Math.hypot(velocityX,velocityZ) / 5,0,1);
      stepTime -= dt;
      if (grounded && moveAmount > 0.25 && stepTime <= 0) {
        sound('step'); stepTime = sprinting ? 0.29 : aiming ? 0.51 : 0.40;
      }
      footPhase += dt * Math.hypot(velocityX,velocityZ) * 3.1;
      recoil = damp(recoil,0,11,dt);
      const bob = grounded ? Math.sin(footPhase) * moveAmount * (aiming ? 0.012 : 0.036) : 0;
      const roll = (aiming ? 0.002 : 0.009) * lateral * -1 + Math.sin(elapsed * 34) * deathShake * 0.016;
      camera.position.set(player.x,player.y + EYE_HEIGHT + bob,player.z);
      camera.rotation.set(pitch + recoil + Math.sin(elapsed * 40)*deathShake*0.009,yaw,roll,'YXZ');
      const nextFov = damp(camera.fov,aiming ? 51 : sprinting ? 76 : 71,11,dt);
      if (Math.abs(nextFov - camera.fov) > 0.003) {
        camera.fov = nextFov; camera.updateProjectionMatrix();
      }
      camera.updateMatrixWorld(true);
      heading = ((Math.round(-yaw * 180 / Math.PI) % 360) + 360) % 360;
    }
    function moveEnemy(e,dx,dz,dt) {
      const p = e.model.group.position, len = Math.hypot(dx,dz);
      if (len < 0.001) return;
      const step = dt * e.speed * (e.charge > 0 ? 0.38 : 1) / Math.max(1,len);
      const x = p.x + dx * step, z = p.z + dz * step;
      const canX = canMove(x,p.z,0.66,0.85,0.8);
      if (canX) p.x = x;
      const canZ = canMove(p.x,z,0.66,0.85,0.8);
      if (canZ) p.z = z;
      if ((!canX && Math.abs(dx) > 0.3) || (!canZ && Math.abs(dz)>0.3)) {
        e.stuck += dt;
        if (e.stuck > 0.36) { e.drift *= -1; e.stuck = 0; }
      } else e.stuck = 0;
    }
    function spawnBolt(e,dir) {
      const origin = e.model.group.position.clone().addScaledVector(dir,0.65);
      bolts.push({p:origin,dir:dir.clone(),speed:e.heavy ? 15 : 17, damage:e.heavy ? 16 : 10, life:3.5});
      fx.burst(origin,5,[1.0,0.24,0.05],2);
      spatialSound('enemyFire',origin);
    }
    function updateEnemies(dt) {
      nav.update(player.x,player.z);
      danger = 0;
      for (const e of enemies) {
        const group = e.model.group, p = group.position;
        const dx = player.x - p.x, dz = player.z - p.z;
        const distance = Math.max(0.01,Math.hypot(dx,dz));
        const unitX = dx / distance, unitZ = dz / distance;
        p.y = e.hover + Math.sin(elapsed*1.45 + e.seed)*0.115;
        group.rotation.y = Math.atan2(dx,dz);
        e.model.update(dt,elapsed);
        e.nextSense -= dt;
        if (e.nextSense <= 0) {
          v1.subVectors(camera.position,p);
          const sight = v1.length();
          v1.multiplyScalar(1 / Math.max(sight,0.001));
          e.visible = wallDistance(p,v1,sight) >= sight - 0.05;
          e.nextSense = 0.12 + (e.seed % 0.07);
        }
        let mx = 0, mz = 0;
        if (!e.visible) {
          const n = nav.next(p.x,p.z);
          mx = nav.x(n) - p.x; mz = nav.z(n) - p.z;
          const len = Math.hypot(mx,mz);
          if (len > 0.005) { mx /= len; mz /= len; }
        } else {
          const adv = clamp((distance - e.goalDistance) * 0.21,-0.85,1);
          const strafe = e.drift * (0.62 + 0.23*Math.sin(elapsed*0.83 + e.seed));
          mx = unitX*adv - unitZ*strafe; mz = unitZ*adv + unitX*strafe;
        }
        for (const other of enemies) {
          if (e === other) continue;
          const op = other.model.group.position, ax = p.x-op.x, az = p.z-op.z;
          const separation = Math.hypot(ax,az);
          if (separation > 0.01 && separation < 2.5) {
            const strength = (2.5 - separation) / separation * 0.65;
            mx += ax*strength; mz += az*strength;
          }
        }
        moveEnemy(e,mx,mz,dt);
        e.cd -= dt;
        if (e.charge > 0) {
          e.charge -= dt;
          const lockAt = e.heavy ? 0.42 : 0.34;
          if (e.charge > lockAt) e.shotAim.copy(camera.position);
          if (e.visible) {
            danger = Math.max(danger, 1 - Math.max(e.charge,0));
            aimPoint.copy(e.shotAim);
            v2.subVectors(aimPoint,p).normalize();
            const dist = wallDistance(p,v2,p.distanceTo(aimPoint));
            aimPoint.copy(p).addScaledVector(v2,dist);
            fx.line(p,aimPoint,0xff4524,0.009,0.15 + 0.45 * (1-clamp(e.charge,0,1)),0.065);
          }
          if (e.charge <= 0) {
            v2.subVectors(e.shotAim,p).normalize();
            spawnBolt(e,v2);
            e.cd = 2.05 + Math.random()*1.4 + (e.heavy ? 0.2 : 0.4) - wave * 0.12;
          }
        } else if (e.cd <= 0 && e.visible && distance < 32) {
          e.charge = e.heavy ? 1.03 : 0.90;
          e.shotAim.copy(camera.position);
        }
      }
    }
    function hurt(damage) {
      health = Math.max(0,health-damage);
      safeTime = 0; damageFlash = 1; deathShake = 0.65; sound('hurt');
      if (!health) finish(false);
    }
    function updateBolts(dt) {
      for (let i = bolts.length-1; i >= 0; i--) {
        const b = bolts[i];
        b.life -= dt;
        const step = b.speed * dt, wall = wallDistance(b.p,b.dir,step + 0.01);
        ray.set(b.p,b.dir);
        let bodyDist = Infinity;
        // Two overlapping volumes follow the body through a jump.
        for (const offset of [0.62,1.43]) {
          sphere.center.set(player.x,player.y+offset,player.z); sphere.radius = 0.52;
          if (ray.intersectSphere(sphere,hitPoint)) bodyDist = Math.min(bodyDist,b.p.distanceTo(hitPoint));
        }
        const travel = Math.min(step,wall,bodyDist);
        b.p.addScaledVector(b.dir,travel);
        v3.copy(b.p).addScaledVector(b.dir,-Math.max(travel,0.55));
        fx.line(v3,b.p,0xff421b,0.062,0.95,0.075);
        fx.line(v3,b.p,0xffe99b,0.021,1,0.10);
        if (bodyDist <= step && bodyDist < wall) {
          hurt(b.damage); bolts.splice(i,1);
          if (state !== 'playing') return;
        } else if (wall <= step || b.life <= 0) {
          if (wall <= step) fx.burst(b.p,8,[1,0.28,0.055],3);
          bolts.splice(i,1);
        }
      }
    }
    function update(dt) {
      elapsed += dt; safeTime += dt;
      cooldown = Math.max(0,cooldown-dt);
      damageFlash = Math.max(0,damageFlash-dt*2.35);
      deathShake = Math.max(0,deathShake-dt*2.2);
      hitMarker = Math.max(0,hitMarker-dt*4.3);
      announcementTimer = Math.max(0,announcementTimer-dt);
      if (loadLeft > 0) {
        loadLeft = Math.max(0,loadLeft-dt);
        if (!loadLeft) {
          if (cellRecovery) { ammo = 12; cellRecovery = false; }
          else { const amount = Math.min(MAGAZINE-ammo,reserve); ammo += amount; reserve -= amount; }
        }
      }
      if (safeTime > 6.5 && health < 100) health = Math.min(100,health+dt*4.0);
      if (pressed.has('ArrowLeft')) yaw += dt * 1.6;
      if (pressed.has('ArrowRight')) yaw -= dt * 1.6;
      if (pressed.has('ArrowUp')) pitch = Math.min(1.45,pitch+dt*1.15);
      if (pressed.has('ArrowDown')) pitch = Math.max(-1.45,pitch-dt*1.15);
      movePlayer(dt);
      if (shooting || pressed.has('KeyF')) fire();
      if (!enemies.length && waveDelay > 0) {
        waveDelay -= dt;
        if (waveDelay <= 0) {
          if (wave + 1 === WAVES.length) { finish(true); return; }
          deployWave(wave+1);
        }
      }
      updateEnemies(dt); updateBolts(dt);
      if (state !== 'playing') return;
      arena.update(dt,elapsed);
      arms.update(dt,{moving:moveAmount,sprinting,aiming,time:elapsed,ammo,lookX:swayX,lookY:swayY});
      swayX = damp(swayX,0,12,dt); swayY = damp(swayY,0,12,dt);
      fx.update(dt);
      hudTimer -= dt;
      if (hudTimer <= 0) {
        hudTimer = 0.05;
        camera.getWorldDirection(direction);
        target = enemyHit(camera.position,direction,wallDistance(camera.position,direction)).enemy;
        publishHUD();
      }
    }
    function tick(now) {
      frame = 0;
      if (state !== 'playing' || disposed) return;
      try {
        resize(false);
        const delta = previousFrame ? clamp((now-previousFrame)/1000,0,0.085) : 1/60;
        previousFrame = now;
        const substeps = Math.ceil(delta / 0.0334) || 1;
        for (let i=0; i<substeps && state==='playing'; i++) update(delta/substeps);
        if (quality === 'high' && framePass && framePass.ready) {
          try { framePass.render(scene,camera,elapsed); }
          catch (_) {
            renderer.setRenderTarget(null);
            framePass.dispose(); framePass = null; passUnavailable = true;
            renderer.render(scene,camera);
          }
        } else renderer.render(scene,camera);
        if (state === 'playing') schedule();
      } catch (error) {
        state = 'error'; clearInput(); releaseLock();
        emitState('error',Object.assign(result(),{message:error.message}));
        console.error(error);
      }
    }
    function look(dx,dy) {
      if (state !== 'playing' || !Number.isFinite(dx) || !Number.isFinite(dy)) return;
      const scale = sensitivity * (aiming ? 0.00132 : 0.00205);
      const x = clamp(dx,-450,450)*scale, y = clamp(dy,-450,450)*scale;
      yaw -= x; pitch = clamp(pitch-y,-1.45,1.45);
      swayX = clamp(swayX+x,-0.065,0.065);
      swayY = clamp(swayY+y,-0.065,0.065);
    }
    function move(x,forward) {
      if (state !== 'playing') return;
      touch.x = clamp(Number(x)||0,-1,1); touch.forward = clamp(Number(forward)||0,-1,1);
    }
    function action(name,held = true) {
      if (state !== 'playing') return;
      if (name === 'fire') { shooting=held; if (held) fire(); }
      if (name === 'aim') aimHeld=held;
      if (name === 'sprint') sprintHeld=held;
      if (name === 'jump' && held) jump();
      if (name === 'reload' && held) reload();
    }
    on(document,'keydown',e => {
      if (state !== 'playing') return;
      if (['Space','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Tab'].includes(e.code)) e.preventDefault();
      pressed.add(e.code);
      if (e.repeat) return;
      if (e.code === 'Space') jump();
      if (e.code === 'KeyR') reload();
      if (e.code === 'Escape' || e.code === 'KeyP') pause();
    });
    on(document,'keyup',e => { pressed.delete(e.code); });
    on(canvas,'mousedown',e => {
      if (state !== 'playing') return;
      if (e.button === 0) { requestLock(); action('fire',true); }
      if (e.button === 2) action('aim',true);
    });
    on(document,'mouseup',e => {
      if (e.button===0) shooting=false;
      if (e.button===2) aimHeld=false;
    });
    on(document,'mousemove',e => {
      if (state !== 'playing') return;
      if (document.pointerLockElement === canvas || (!document.pointerLockElement && (e.target === canvas || e.buttons))) look(e.movementX,e.movementY);
    });
    on(canvas,'contextmenu',e => e.preventDefault());
    on(document,'pointerlockchange',() => {
      const locked = document.pointerLockElement === canvas;
      if (!locked && autoLock && state==='playing') pause();
      autoLock = locked;
    });
    on(document,'visibilitychange',() => { if (document.hidden) pause(); });
    on(window,'blur',pause);
    on(canvas,'webglcontextlost',e => { e.preventDefault(); pause(); });
    function dispose() {
      if (disposed) return;
      disposed = true;
      signal.abort(); releaseLock();
      if (frame) cancelAnimationFrame(frame);
      clearWorld();
      if (arms.dispose) arms.dispose();
      if (arena.dispose) arena.dispose();
      if (framePass) framePass.dispose();
      const geometry = new Set(), materials = new Set(), textures = new Set();
      scene.traverse(o => {
        if (o.geometry) geometry.add(o.geometry);
        if (o.material) (Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));
      });
      for (const m of materials) {
        for (const value of Object.values(m)) if (value && value.isTexture) textures.add(value);
        m.dispose();
      }
      geometry.forEach(g=>g.dispose()); textures.forEach(t=>t.dispose()); renderer.dispose();
    }
    return {start,reset:start,pause,resume,menu,move,look,action,dispose,setQuality,
      setSensitivity(value) { sensitivity=clamp(Number(value)||1,0.2,3); },
      getState() { return Object.assign({state,health:Math.ceil(health),ammo,reserve,x:player.x,y:player.y,z:player.z,heading},result()); }
    };
  }
  window.CinderGame = {create};
})();
