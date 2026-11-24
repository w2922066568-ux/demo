(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const icon = window.HadalIcons.icon;
  const audio = window.HadalAudio;
  const sectors = [
    {
      name: '裂隙入口',
      en: 'THE RIFT',
      depth: 3800,
      record: '首个声纹样本',
      desc: '一道青蓝色的裂隙通向海床。沿着两侧玄武岩柱之间的水道前进，寻找第一台仍在发报的声学信标。',
      sample: '狭窄的岩壁放大了低频回声。信标记录下了穿过裂隙的第一阵洋流。',
    },
    {
      name: '沉没回廊',
      en: 'THE GALLERY',
      depth: 4120,
      record: '回廊声谱',
      desc: '海床深处，一列石门隐没在靛蓝色水雾里。让声呐扫过石柱，循着迟来的第二道回声继续航行。',
      sample: '回声在石门间折返了七次。那些看似孤立的柱体，原来共享着同一个共鸣频率。',
    },
    {
      name: '静默之庭',
      en: 'SILENT GARDEN',
      depth: 4600,
      record: '静默之庭录音',
      desc: '最深处的海百合随暗流摇曳。最后一台信标沉睡在发光的枝条之间，回收它，将整条航线的声音带回海面。',
      sample: '微弱的脉冲之下，水听器捕捉到成片生物的节律。最深的海底从未真正沉默。',
    },
  ];
  const storeKey = 'pelagic.hadal-echoes.v1';
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem(storeKey) || '{}') || {};
  } catch {
    saved = {};
  }
  const records = Array.isArray(saved.records)
    ? saved.records
        .filter(
          (r) =>
            r && Number.isInteger(r.sector) && r.sector >= 0 && r.sector < 3 && Number.isFinite(r.at),
        )
        .slice(-60)
    : [];
  const data = {
    records,
    checkpoint: [0, 1, 2].includes(saved.checkpoint) ? saved.checkpoint : 0,
    sound: typeof saved.sound === 'boolean' ? saved.sound : true,
    quality: ['auto', 'high', 'low'].includes(saved.quality) ? saved.quality : 'auto',
    finished: Math.max(0, Number(saved.finished) || 0),
  };
  const save = () => {
    try {
      localStorage.setItem(storeKey, JSON.stringify(data));
    } catch {}
  };
  const fmtDepth = (n) => Math.round(n).toLocaleString('en-US');
  const pad = (n) => String(n).padStart(2, '0');
  let mode = 'menu',
    game = null,
    panelType = '',
    panelReturn = '',
    launched = false,
    telemetry = null,
    toastTimer,
    isUnlocked = false,
    lastCue = '',
    menuFrame = 0;
  let pingTime = -Infinity,
    sampleTimer = 0;
  const panel = $('panel'),
    inner = $('panel-inner');
  function soundSync() {
    const shape = icon(data.sound ? 'sound' : 'sound-off'),
      label = data.sound ? '关闭声音' : '开启声音';
    $('sound').innerHTML =
      '<i>' + shape + '</i><span>' + (data.sound ? '声音开启' : '声音关闭') + '</span>';
    for (const b of [$('sound'), $('hud-sound')]) {
      b.setAttribute('aria-label', label);
      b.setAttribute('aria-pressed', String(data.sound));
      b.title = label;
    }
    $('hud-sound').innerHTML = '<i>' + shape + '</i>';
    audio?.setEnabled(data.sound);
  }
  function unlock() {
    if (!isUnlocked && data.sound)
      audio
        ?.unlock()
        .then((ok) => {
          isUnlocked = ok;
        })
        .catch(() => {});
  }
  function toggleSound() {
    data.sound = !data.sound;
    soundSync();
    if (data.sound) unlock();
    save();
  }
  $('sound').onclick = toggleSound;
  $('hud-sound').onclick = toggleSound;
  function cards() {
    const focus = data.checkpoint;
    $('route-grid').innerHTML = sectors
      .map(
        (s, n) =>
          '<button class="route-card ' +
          (n === focus ? 'active' : '') +
          '" data-zone="' +
          n +
          '" aria-label="查看第 ' +
          (n + 1) +
          ' 航区，' +
          s.name +
          '"><span class="route-image" style="background-image:url(assets/sector-' +
          (n + 1) +
          '.webp)"></span><span class="route-info"><span class="route-number">SECTOR ' +
          pad(n + 1) +
          '</span><span class="route-name">' +
          s.name +
          '</span></span><span class="route-end"><i>' +
          icon('chevron') +
          '</i><span class="route-depth">' +
          fmtDepth(s.depth) +
          ' M</span></span></button>',
      )
      .join('');
    $('launch-text').textContent = launched ? '返回驾驶舱' : focus ? '继续下潜' : '开始下潜';
    $('log-dot').classList.toggle('has-log', data.records.length > 0);
  }
  $('route-grid').onclick = (e) => {
    const b = e.target.closest('[data-zone]');
    if (b) showSector(Number(b.dataset.zone));
  };
  const closeButton =
    '<button data-cmd="close" class="panel-close" aria-label="关闭">' + icon('close') + '</button>';
  function head(code) {
    return '<div class="panel-head"><div class="kicker">' + code + '</div>' + closeButton + '</div>';
  }
  function setPanel(type, html) {
    panelType = type;
    inner.innerHTML = html;
    if (!panel.open) panel.showModal();
    panel.scrollTop = 0;
    const destination = inner.querySelector('[data-focus]') || inner.querySelector('button');
    destination?.focus({ preventScroll: true });
  }
  function closeOnly() {
    clearTimeout(sampleTimer);
    if (panel.open) panel.close();
    panelType = '';
    panelReturn = '';
  }
  function dismiss() {
    if (panelType === 'complete') {
      showDeck();
      return;
    }
    if (panelType === 'pause') {
      resume();
      return;
    }
    if (panelReturn === 'pause') {
      showPause();
      return;
    }
    closeOnly();
  }
  function showHelp() {
    if (mode === 'playing') {
      game.pause();
      mode = 'paused';
      audio?.setMode('paused');
    }
    panelReturn = mode === 'paused' ? 'pause' : 'menu';
    const mappings = [
      ['推进 / 倒车', ['W', 'S', '↑', '↓']],
      ['左转 / 右转', ['A', 'D', '←', '→']],
      ['上浮 / 下潜', ['R', 'F']],
      ['加力推进', ['SHIFT', 'W']],
      ['发射声呐', ['SPACE']],
      ['回收附近信标', ['E']],
      ['暂停 / 继续', ['ESC']],
    ];
    const coarse = matchMedia('(pointer:coarse)').matches;
    setPanel(
      'help',
      '<div class="panel-body">' +
        head('PILOT MANUAL &nbsp;/&nbsp; ORCA–07') +
        '<h2 id="panel-title">操作指南</h2><p>' +
        (coarse
          ? '按住屏幕方向键驾驶，使用「浮」「潜」调整高度。点击声呐追踪信标，靠近后点击回收。'
          : '驾驶潜航器靠近信标。声呐脉冲会照亮海床，菱形航标显示目标的位置和距离。') +
        '</p><div class="control-rows">' +
        mappings
          .map(
            ([label, keys]) =>
              '<div class="control-row"><span>' +
              label +
              '</span><span>' +
              keys.map((k) => '<kbd>' + k + '</kbd>').join('') +
              '</span></div>',
          )
          .join('') +
        '</div><div class="panel-foot"><button data-cmd="close" class="primary">明白了 ' +
        icon('check') +
        '</button></div></div>',
    );
  }
  function showSector(i) {
    const s = sectors[i],
      entry = [...data.records].reverse().find((r) => r.sector === i);
    panelReturn = 'menu';
    setPanel(
      'sector',
      '<div class="sector-image" style="background-image:url(assets/sector-' +
        (i + 1) +
        '.webp)">' +
        closeButton +
        '</div><div class="panel-body"><div class="kicker">SECTOR ' +
        pad(i + 1) +
        ' &nbsp;/&nbsp; ' +
        s.en +
        '</div><h2 id="panel-title" style="margin-top:12px">' +
        s.name +
        '</h2><p>' +
        s.desc +
        '</p><div class="sector-facts"><div><span class="tiny">航区深度</span><b>' +
        fmtDepth(s.depth) +
        ' M</b></div><div><span class="tiny">声学信标</span><b>' +
        (entry ? '已归档' : '待回收') +
        '</b></div></div>' +
        (entry ? '<p>' + s.sample + '</p>' : '') +
        '<div class="panel-foot"><button class="secondary" data-cmd="close">返回甲板</button>' +
        (i === data.checkpoint && !launched
          ? '<button class="primary" data-cmd="launch">开始下潜 ' + icon('arrow-right') + '</button>'
          : '') +
        '</div></div>',
    );
  }
  function showLog() {
    panelReturn = 'menu';
    const items = [...data.records]
      .reverse()
      .map(
        (r) =>
          '<button class="log-row" data-sample="' +
          r.sector +
          '" aria-label="播放' +
          sectors[r.sector].record +
          '"><span><i>' +
          icon('play') +
          '</i>' +
          sectors[r.sector].name +
          ' · ' +
          sectors[r.sector].record +
          '</span><small>' +
          new Date(r.at).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }) +
          ' ' +
          new Date(r.at).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }) +
          '</small></button>',
      )
      .join('');
    setPanel(
      'journal',
      '<div class="panel-body">' +
        head('ONBOARD ARCHIVE &nbsp;/&nbsp; DIVE LOG') +
        '<h2 id="panel-title">潜航日志</h2><p>虎鲸七号的声学采样记录。</p><div class="sector-facts"><div><span class="tiny">信标样本</span><b>' +
        pad(data.records.length) +
        '</b></div><div><span class="tiny">完成远征</span><b>' +
        pad(data.finished) +
        '</b></div></div><div class="log-list">' +
        (items ||
          '<div class="log-empty"><i>' +
            icon('archive') +
            '</i><span>回收第一台信标后，声纹样本将归档于此。</span></div>') +
        '</div><div class="panel-foot"><button class="secondary" data-cmd="close">返回甲板</button></div></div>',
    );
  }
  function showPause() {
    if (!game) return;
    game.pause();
    mode = 'paused';
    audio?.setMode('paused');
    panelReturn = '';
    setPanel(
      'pause',
      '<div class="panel-body">' +
        head('ORCA–07 &nbsp;/&nbsp; HOLD POSITION') +
        '<h2 id="panel-title">潜航已暂停</h2><p>' +
        sectors[Math.min(2, telemetry?.sector || 0)].name +
        ' · 当前深度 ' +
        fmtDepth(telemetry?.depth || 3800) +
        ' 米</p><button class="panel-button" data-cmd="help">操作指南 ' +
        icon('keyboard') +
        '</button><button class="panel-button" data-cmd="quality">画面质量 <span>' +
        { low: '流畅', auto: '自适应', high: '高精度' }[data.quality] +
        ' ›</span></button><div class="panel-foot"><button class="secondary" data-cmd="deck">返回甲板</button><button data-focus class="primary" data-cmd="resume">' +
        icon('play') +
        '继续驾驶</button></div></div>',
    );
  }
  function resume() {
    closeOnly();
    if (!game || !launched) return;
    mode = 'playing';
    $('hangar').hidden = true;
    $('dive').hidden = false;
    stopMenu();
    game.resume();
    audio?.setMode('dive');
  }
  function showDeck() {
    game?.pause();
    closeOnly();
    mode = 'menu';
    $('dive').hidden = true;
    $('hangar').hidden = false;
    audio?.setMotion(0);
    audio?.setMode('menu');
    cards();
    startMenu();
    $('launch').focus({ preventScroll: true });
  }
  async function launch() {
    if (mode === 'loading') return;
    closeOnly();
    unlock();
    if (launched) {
      resume();
      return;
    }
    mode = 'loading';
    document.body.classList.add('transitioning');
    audio?.play('start');
    await new Promise((r) => setTimeout(r, 300));
    $('hangar').hidden = true;
    $('dive').hidden = false;
    stopMenu();
    try {
      if (!game)
        game = window.HadalGame.create($('world'), {
          onUpdate: updateHUD,
          onEvent: gameEvent,
          onComplete: complete,
        });
      pingTime = -Infinity;
      game.setQuality(data.quality);
      game.start(data.checkpoint);
      launched = true;
      mode = 'playing';
      audio?.setMode('dive');
      toast(
        matchMedia('(pointer:coarse)').matches
          ? '点击声呐探测前方，按住 ↑ 开始推进'
          : '按空格发射声呐，按住 W 开始推进',
        4800,
      );
    } catch (err) {
      console.error('Dive initialization failed', err);
      game?.destroy();
      game = null;
      launched = false;
      showDeck();
      setPanel(
        'error',
        '<div class="panel-body">' +
          head('DIVE SYSTEMS') +
          '<h2 id="panel-title">驾驶舱未能启动</h2><p>请重新载入页面，再次连接潜航器。</p><div class="panel-foot"><button class="primary" data-cmd="reload">重新载入</button></div></div>',
      );
    } finally {
      document.body.classList.remove('transitioning');
    }
  }
  function toast(msg, duration = 3200) {
    clearTimeout(toastTimer);
    $('hud-message').textContent = msg;
    $('hud-message').classList.add('show');
    toastTimer = setTimeout(() => $('hud-message').classList.remove('show'), duration);
  }
  function gameEvent(type, payload) {
    if (['ping', 'recover', 'near', 'boost'].includes(type)) audio?.play(type);
    if (type === 'recover') {
      data.records.push({ sector: payload.sector, at: Date.now() });
      if (data.records.length > 60) data.records.shift();
      data.checkpoint = Math.min(2, payload.recovered);
      save();
      pingTime = -Infinity;
      if (payload.recovered === 2) audio?.play('whale');
      if (payload.recovered < 3)
        toast(
          sectors[payload.sector].record + '已归档 · 下一站：' + sectors[payload.recovered].name,
          3800,
        );
    }
    if (type === 'ping') {
      pingTime = performance.now();
      toast('接收到信标回波 · ' + Math.round(payload.distance) + ' 米', 1700);
    }
    if (type === 'near') toast('已进入信标回收范围', 1800);
    if (type === 'distant') toast('信号距离过远，请继续靠近', 1700);
  }
  function complete(result = {}) {
    mode = 'complete';
    launched = false;
    data.finished++;
    data.checkpoint = 0;
    save();
    audio?.setMotion(0);
    audio?.setMode('paused');
    audio?.play('complete');
    const sec = Math.floor(result.time || 0);
    setPanel(
      'complete',
      '<div class="after-action"><i>' +
        icon('check') +
        '</i></div><div class="panel-body"><div class="kicker">EXPEDITION 001 &nbsp;/&nbsp; COMPLETE</div><h2 id="panel-title" style="margin-top:12px">回声已归档</h2><p>三个航区的信标重新连成了线。最后一道回波穿过四千六百米海水，抵达海面。</p><div class="sector-facts"><div><span class="tiny">本段潜航时间</span><b>' +
        pad(Math.floor(sec / 60)) +
        ':' +
        pad(sec % 60) +
        '</b></div><div><span class="tiny">本段航程</span><b>' +
        Math.round(result.distance || 0) +
        ' M</b></div></div><div class="panel-foot"><button class="secondary" data-cmd="end-log">查看日志</button><button class="primary" data-cmd="deck">返回甲板 ' +
        icon('arrow-right') +
        '</button></div></div>',
    );
  }
  const scope = $('scope').getContext('2d');
  function drawScope(s, age) {
    if (!scope) return;
    const c = scope,
      radius = 96,
      now = performance.now() / 1000;
    c.clearRect(0, 0, 224, 224);
    c.save();
    c.translate(112, 112);
    c.lineWidth = 1.4;
    const glass = c.createRadialGradient(0, 0, 0, 0, 0, 105);
    glass.addColorStop(0, '#0d3e43c7');
    glass.addColorStop(1, '#031b24dd');
    c.fillStyle = glass;
    c.beginPath();
    c.arc(0, 0, 104, 0, Math.PI * 2);
    c.fill();
    for (const r of [32, 64, 96]) {
      c.strokeStyle = r === 96 ? '#7aada8a1' : '#638d8c64';
      c.beginPath();
      c.arc(0, 0, r, 0, Math.PI * 2);
      c.stroke();
    }
    for (let i = 0; i < 32; i++) {
      const a = (i * Math.PI) / 16,
        inner = i % 8 === 0 ? 0 : i % 4 === 0 ? 87 : 92;
      c.strokeStyle = i % 8 === 0 ? '#85a9a66d' : '#92b6b787';
      c.beginPath();
      c.moveTo(Math.sin(a) * inner, -Math.cos(a) * inner);
      c.lineTo(Math.sin(a) * radius, -Math.cos(a) * radius);
      c.stroke();
    }
    const sweep = (now * 0.9) % (Math.PI * 2);
    for (let i = 0; i < 12; i++) {
      const a = sweep - i * 0.034;
      c.fillStyle = 'rgba(97,224,188,' + (0.01 + (12 - i) * 0.004) + ')';
      c.beginPath();
      c.moveTo(0, 0);
      c.arc(0, 0, 95, a - 0.035, a);
      c.closePath();
      c.fill();
    }
    if (age < 9 || s.canRecover) {
      if (age < 2.8) {
        const wave = Math.min(radius, age * 43);
        c.strokeStyle = 'rgba(143,247,217,' + (1 - age / 2.8) + ')';
        c.beginPath();
        c.arc(0, 0, Math.max(0, wave), 0, Math.PI * 2);
        c.stroke();
      }
      const angle = (s.bearing * Math.PI) / 180,
        r = Math.max(7, Math.min(89, (s.distance / 110) * radius)),
        x = Math.sin(angle) * r,
        y = -Math.cos(angle) * r;
      c.shadowBlur = 10;
      c.shadowColor = '#ff9960';
      c.fillStyle = '#ffab74';
      c.beginPath();
      c.arc(x, y, 4.5, 0, Math.PI * 2);
      c.fill();
      c.shadowBlur = 0;
    }
    c.fillStyle = '#c2f5e0';
    c.beginPath();
    c.moveTo(0, -7);
    c.lineTo(5, 6);
    c.lineTo(0, 3);
    c.lineTo(-5, 6);
    c.fill();
    c.restore();
  }
  function updateHUD(s) {
    telemetry = s;
    audio?.setMotion(s.speed);
    const sector = sectors[s.sector] || sectors[2],
      degrees = Math.round(s.heading) % 360,
      dir = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(degrees / 45) % 8];
    $('hud-sector').textContent = sector.name;
    $('hud-zone').textContent = 'SECTOR ' + pad(s.sector + 1) + ' / ' + sector.en;
    $('hud-depth').textContent = fmtDepth(s.depth);
    $('hud-speed').textContent = s.speed.toFixed(1);
    $('heading').textContent = String(degrees).padStart(3, '0') + '° ' + dir;
    $('compass-track').style.backgroundPositionX = -degrees * 1.6 + 'px';
    $('beacon-count').textContent = pad(s.recovered) + ' / 03';
    const range = Math.round(s.distance),
      relative = Math.abs(s.bearing),
      age = (performance.now() - pingTime) / 1000,
      tracked = age < 9 || s.canRecover;
    drawScope(s, age);
    $('mission-title').textContent = s.canRecover
      ? '回收声学信标'
      : s.recovered === 3
        ? '所有信标已归档'
        : '寻找 ' + pad(s.sector + 1) + ' 号信标';
    const verticalHint =
      Math.abs(s.targetDy) > 7 && range < 42 ? (s.targetDy > 0 ? '上浮靠近信标' : '下潜靠近信标') : '';
    const courseHint =
      verticalHint || (relative > 18 ? (s.bearing < 0 ? '向左转向' : '向右转向') : '沿当前航向前进');
    $('mission-tip').textContent = s.canRecover
      ? '信标已进入机械臂范围'
      : tracked
        ? courseHint + ' · ' + range + ' 米'
        : '发射声呐以获取回波方位';
    document
      .querySelectorAll('.mission-progress i')
      .forEach((el, i) => el.classList.toggle('done', i < s.recovered));
    const marker = $('marker');
    marker.hidden = !s.targetVisible || s.recovered === 3 || !tracked;
    marker.style.left = s.targetX * 100 + '%';
    marker.style.top = s.targetY * 100 + '%';
    $('marker-range').textContent = range + ' M';
    const cool = Math.ceil(s.sonarCooldown),
      cue = s.canRecover ? 'recover' : cool > 0 ? 'cool' + cool : 'ping';
    if (cue !== lastCue) {
      lastCue = cue;
      $('action-hint').innerHTML = s.canRecover
        ? '<button class="near" data-verb="recover"><kbd>E</kbd> 回收信标</button>'
        : '<button data-verb="sonar" ' +
          (cool ? 'disabled' : '') +
          '><i>' +
          icon('ping') +
          '</i><kbd>SPACE</kbd> ' +
          (cool ? '充能 ' + cool + 's' : '声呐探测') +
          '</button>';
    }
  }
  $('action-hint').onclick = (e) => {
    const b = e.target.closest('[data-verb]');
    if (b && !b.disabled && mode === 'playing') {
      game.action(b.dataset.verb, true);
      game.action(b.dataset.verb, false);
    }
  };
  document.querySelectorAll('[data-action]').forEach((b) => {
    const release = () => {
      game?.action(b.dataset.action, false);
    };
    b.addEventListener('pointerdown', (e) => {
      if (mode !== 'playing') return;
      e.preventDefault();
      b.setPointerCapture(e.pointerId);
      game.action(b.dataset.action, true);
    });
    b.addEventListener('pointerup', release);
    b.addEventListener('pointercancel', release);
    b.addEventListener('lostpointercapture', release);
  });
  panel.addEventListener('click', (e) => {
    if (e.target === panel) {
      const r = panel.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
        dismiss();
      return;
    }
    const sample = e.target.closest('[data-sample]');
    if (sample) {
      if (inner.querySelector('.is-playing')) return;
      if (!data.sound) {
        data.sound = true;
        soundSync();
        save();
      }
      audio?.unlock().then((ok) => {
        if (ok) audio.play('sample' + sample.dataset.sample);
      });
      sample.classList.add('is-playing');
      sample.querySelector('i').innerHTML = icon('wave');
      sampleTimer = setTimeout(() => {
        sample.classList.remove('is-playing');
        sample.querySelector('i').innerHTML = icon('play');
      }, 3300);
      return;
    }
    const b = e.target.closest('[data-cmd]');
    if (!b) return;
    switch (b.dataset.cmd) {
      case 'close':
        dismiss();
        break;
      case 'launch':
        launch();
        break;
      case 'help':
        showHelp();
        break;
      case 'deck':
        showDeck();
        break;
      case 'resume':
        resume();
        break;
      case 'end-log':
        showDeck();
        showLog();
        break;
      case 'reload':
        location.reload();
        break;
      case 'quality': {
        const opts = ['auto', 'high', 'low'];
        data.quality = opts[(opts.indexOf(data.quality) + 1) % 3];
        save();
        game?.setQuality(data.quality);
        showPause();
        break;
      }
    }
  });
  panel.addEventListener('cancel', (e) => {
    e.preventDefault();
    dismiss();
  });
  $('launch').onclick = launch;
  $('help').onclick = showHelp;
  $('flight-help').onclick = showHelp;
  $('pause').onclick = showPause;
  $('nav-log').onclick = showLog;
  $('nav-deck').onclick = () => {
    if (panel.open) closeOnly();
    $('launch').focus({ preventScroll: true });
  };
  document.addEventListener('keydown', (e) => {
    if (e.repeat || e.isComposing) return;
    if (e.code === 'Escape' && !panel.open && mode === 'playing') {
      e.preventDefault();
      showPause();
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && mode === 'playing') showPause();
  });
  document.addEventListener(
    'pointerdown',
    (e) => {
      unlock();
      if (e.target.closest('button') && mode !== 'playing') audio?.play('click');
    },
    { passive: true },
  );
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Enter' || e.code === 'Space') unlock();
    },
    { passive: true },
  );
  const fullBtn = $('fullscreen');
  if (!document.fullscreenEnabled) fullBtn.hidden = true;
  fullBtn.onclick = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      fullBtn.title = '当前窗口无法全屏';
    }
  };
  document.addEventListener('fullscreenchange', () => {
    const isFull = Boolean(document.fullscreenElement);
    fullBtn.innerHTML = icon(isFull ? 'shrink' : 'expand');
    fullBtn.setAttribute('aria-label', isFull ? '退出全屏' : '进入全屏');
  });
  const bars = [2, 5, 4, 8, 11, 6, 4, 10, 13, 8, 5, 7, 12, 6, 3, 7, 9, 5, 3, 6, 4, 2, 3];
  $('wave-bars').innerHTML = bars
    .map((v, i) => '<i style="height:' + v + 'px;animation-delay:-' + i * 0.21 + 's"></i>')
    .join('');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)'),
    plank = $('plankton'),
    ctx = plank.getContext('2d');
  let dust = [],
    lastPaint = 0,
    viewW = 1,
    viewH = 1;
  function resizeDust() {
    viewW = plank.clientWidth;
    viewH = plank.clientHeight;
    const px = Math.min(1.5, devicePixelRatio || 1);
    plank.width = Math.max(1, viewW * px);
    plank.height = Math.max(1, viewH * px);
    ctx?.setTransform(px, 0, 0, px, 0, 0);
    dust = Array.from({ length: Math.min(75, Math.ceil(viewW * 0.05)) }, () => [
      Math.random(),
      Math.random(),
      Math.random(),
    ]);
  }
  function paint(time) {
    if (mode !== 'menu') {
      menuFrame = 0;
      return;
    }
    if (ctx && time - lastPaint > 40 && !document.hidden) {
      lastPaint = time;
      ctx.clearRect(0, 0, viewW, viewH);
      dust.forEach(([x, y, k]) => {
        const px = (x * viewW + time * 0.0018 * (1 + k)) % (viewW + 5),
          py = (((y * viewH - time * 0.003 * (0.5 + k)) % viewH) + viewH) % viewH;
        ctx.fillStyle = 'rgba(201,244,226,' + (0.1 + k * 0.31) + ')';
        ctx.beginPath();
        ctx.arc(px, py, 0.35 + k * 1.3, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    menuFrame = requestAnimationFrame(paint);
  }
  function startMenu() {
    resizeDust();
    if (!menuFrame && !reduced.matches) menuFrame = requestAnimationFrame(paint);
  }
  function stopMenu() {
    cancelAnimationFrame(menuFrame);
    menuFrame = 0;
  }
  window.addEventListener('resize', () => {
    if (mode === 'menu') resizeDust();
  });
  $('hangar').addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || reduced.matches) return;
    const bg = $('hangar').style;
    bg.setProperty('--px', (e.clientX / innerWidth - 0.5) * -6 + 'px');
    bg.setProperty('--py', (e.clientY / innerHeight - 0.5) * -3 + 'px');
  });
  soundSync();
  audio?.setMode('menu');
  cards();
  startMenu();
})();
