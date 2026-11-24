(() => {
  'use strict';

  const D = 146.8324;
  const note = (semitones) => D * 2 ** (semitones / 12);
  const epsilon = 0.0001;
  const phrases = [
    [12, 7],
    [14, 7],
    [10, 5],
    [7, 0],
  ];
  const cooldowns = { ping: 0.6, near: 3.5, boost: 1.2, click: 0.06, whale: 5 };
  let context = null;
  let graph = null;
  let enabled = true;
  let scene = 'menu';
  let motion = 0;
  let phraseIndex = 0;
  let phraseTimer;
  let lastPlayed = Object.create(null);

  function gainNode(value, destination) {
    const gain = context.createGain();
    gain.gain.value = value;
    gain.connect(destination);
    return gain;
  }

  function approach(parameter, value, time = 0.35) {
    parameter.setTargetAtTime(value, context.currentTime, time);
  }

  function continuousTone(type, frequency, destination) {
    const oscillator = context.createOscillator();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillator.connect(destination);
    oscillator.start();
    return oscillator;
  }

  function lowpass(frequency, destination) {
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = frequency;
    filter.Q.value = 0.45;
    filter.connect(destination);
    return filter;
  }

  function makeWash(destination) {
    const length = Math.floor(context.sampleRate * 5);
    const buffer = context.createBuffer(2, length, context.sampleRate);
    for (let channel = 0; channel < 2; channel += 1) {
      const samples = buffer.getChannelData(channel);
      let pink = 0;
      for (let i = 0; i < length; i += 1) {
        pink = 0.96 * pink + (Math.random() * 2 - 1) * 0.15;
        const edge = Math.min(1, i / 1500, (length - 1 - i) / 1500);
        samples[i] = pink * edge;
      }
    }
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = lowpass(430, destination);
    source.connect(filter);
    source.start();
    continuousTone('sine', 0.043, gainNode(125, filter.frequency));
  }

  function buildGraph() {
    const limiter = context.createDynamicsCompressor();
    limiter.threshold.value = -14;
    limiter.knee.value = 12;
    limiter.ratio.value = 4;
    limiter.attack.value = 0.012;
    limiter.release.value = 0.24;
    limiter.connect(context.destination);

    const master = gainNode(0, limiter);
    const bed = gainNode(0, master);
    const effects = gainNode(0.85, master);
    const music = gainNode(0.8, master);
    const propulsion = gainNode(0, master);
    const delay = context.createDelay(2);
    delay.delayTime.value = 0.49;
    const reflection = lowpass(930, effects);
    delay.connect(gainNode(0.26, reflection));
    reflection.connect(gainNode(0.19, delay));
    for (const [offset, level, rate] of [
      [-12, 0.095, 0.032],
      [-5, 0.028, 0.039],
      [0, 0.021, 0.049],
    ]) {
      const voice = gainNode(level, bed);
      continuousTone('sine', note(offset), voice);
      continuousTone('sine', rate, gainNode(level * 0.17, voice.gain));
    }
    makeWash(gainNode(0.16, bed));
    const engineFilter = lowpass(96, propulsion);
    const motor = continuousTone('triangle', 39, engineFilter);
    const propeller = continuousTone('sine', 4.5, gainNode(1.1, motor.frequency));
    return { master, bed, effects, music, propulsion, delay, motor, propeller, engineFilter };
  }

  function syncMotion() {
    if (!graph) return;
    const throttle = scene === 'dive' ? 1 - Math.exp(-motion / 7) : 0;
    approach(graph.propulsion.gain, scene === 'dive' ? 0.015 + 0.059 * throttle : 0);
    approach(graph.motor.frequency, 39 + 26 * throttle);
    approach(graph.propeller.frequency, 4.5 + 11 * throttle);
    approach(graph.engineFilter.frequency, 96 + 150 * throttle);
  }

  function syncScene() {
    if (!graph) return;
    const audible = enabled && !document.hidden;
    approach(graph.master.gain, audible ? 0.69 : 0, 0.06);
    approach(graph.bed.gain, scene === 'paused' ? 0.19 : scene === 'dive' ? 0.89 : 0.62);
    approach(graph.music.gain, scene === 'paused' ? 0.24 : 0.8);
    syncMotion();
  }

  function tone(frequency, start, duration, volume, options = {}) {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const attack = Math.min(options.attack ?? 0.021, duration * 0.4);
    oscillator.type = options.type || 'sine';
    oscillator.frequency.setValueAtTime(frequency, start);
    if (options.endFrequency) {
      oscillator.frequency.exponentialRampToValueAtTime(options.endFrequency, start + duration * 0.72);
    }
    envelope.gain.setValueAtTime(epsilon, start);
    envelope.gain.exponentialRampToValueAtTime(volume, start + attack);
    envelope.gain.exponentialRampToValueAtTime(epsilon, start + duration);
    oscillator.connect(envelope);
    envelope.connect(options.destination || graph.effects);
    if (options.echo) envelope.connect(graph.delay);
    oscillator.onended = () => {
      oscillator.disconnect();
      envelope.disconnect();
    };
    oscillator.start(start);
    oscillator.stop(start + duration + 0.04);
  }

  function schedulePhrase() {
    clearTimeout(phraseTimer);
    if (!context || context.state !== 'running' || !enabled || document.hidden || scene === 'paused')
      return;
    phraseTimer = setTimeout(
      () => {
        if (!graph || context.state !== 'running') return;
        const now = context.currentTime + 0.025;
        const phrase = phrases[phraseIndex++ % phrases.length];
        phrase.forEach((offset, index) => {
          tone(note(offset), now + index * 1.4, 3.7, 0.019, {
            attack: 0.67,
            destination: graph.music,
            echo: true,
          });
        });
        schedulePhrase();
      },
      scene === 'menu' ? 8400 : 11400,
    );
  }

  function sync() {
    syncScene();
    schedulePhrase();
  }

  // Invoke from the first trusted pointer or keyboard interaction.
  async function unlock() {
    if (!enabled) return false;
    try {
      if (!context || context.state === 'closed') {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) return false;
        context = new Audio({ latencyHint: 'interactive' });
        graph = buildGraph();
        document.addEventListener('visibilitychange', sync);
        context.onstatechange = sync;
      }
      if (context.state !== 'running') await context.resume();
      syncScene();
      if (!phraseTimer) schedulePhrase();
      return context.state === 'running';
    } catch {
      return false;
    }
  }

  function setEnabled(value) {
    enabled = Boolean(value);
    sync();
  }

  function setMode(value) {
    if (scene === value || !['menu', 'dive', 'paused'].includes(value)) return;
    scene = value;
    sync();
  }

  function setMotion(speed) {
    const value = Number.isFinite(speed) ? Math.min(1000, Math.abs(speed)) : 0;
    if (Math.abs(value - motion) < 0.035) return;
    motion = value;
    syncMotion();
  }

  function chime(offsets, now, spacing, duration, level) {
    offsets.forEach((offset, index) => {
      const at = now + index * spacing;
      tone(note(offset), at, duration, level, { attack: 0.035, echo: true });
      tone(note(offset + 12), at, duration * 0.57, level * 0.16);
    });
  }

  // A bowed glissando with a second formant forms the humpback's two-part call.
  function whaleSong(now, level = 0.065) {
    tone(117, now, 2.45, level, { endFrequency: 205, attack: 0.65, echo: true });
    tone(235, now + 0.09, 2.16, level * 0.32, { endFrequency: 412, attack: 0.67, echo: true });
    tone(172, now + 1.56, 1.74, level * 0.78, { endFrequency: 89, attack: 0.38, echo: true });
    tone(344, now + 1.61, 1.3, level * 0.23, { endFrequency: 178, attack: 0.33 });
  }

  function archiveSample(event, now) {
    if (event === 'sample0') {
      // Moving current and distant, rounded transducer knocks from the rift.
      tone(72, now, 2.8, 0.071, { endFrequency: 115, attack: 0.62 });
      [0, 0.28, 0.91, 1.2, 1.93].forEach((delay, i) => {
        tone(285 - i * 8, now + delay, 0.34, 0.074, { endFrequency: 103, attack: 0.012, echo: true });
      });
    } else if (event === 'sample1') {
      // Seven stone reflections preserve the same pitch while their timbre darkens.
      for (let i = 0; i < 7; i++) {
        const at = now + i * 0.34;
        tone(note(7), at, 0.67, 0.083 * 0.86 ** i, { attack: 0.025 + i * 0.011 });
        tone(note(19), at, 0.45, 0.045 * 0.75 ** i);
      }
    } else {
      whaleSong(now, 0.052);
      [0, 7, 14].forEach((offset, i) =>
        tone(note(12 + offset), now + 1.2 + i * 0.43, 0.79, 0.022, { attack: 0.085, echo: true }),
      );
    }
  }

  function play(event) {
    if (!enabled || !graph || context.state !== 'running' || document.hidden) return;
    const now = context.currentTime + 0.018;
    if (now - (lastPlayed[event] ?? -Infinity) < (cooldowns[event] ?? 0)) return;
    lastPlayed[event] = now;
    switch (event) {
      case 'whale':
        whaleSong(now);
        break;
      case 'sample0':
      case 'sample1':
      case 'sample2':
        archiveSample(event, now);
        break;
      case 'ping':
        tone(875, now, 0.57, 0.115, { endFrequency: 735, echo: true });
        tone(437.5, now + 0.008, 0.75, 0.052, { endFrequency: 367.5 });
        tone(735, now + 1.12, 0.64, 0.022, { attack: 0.1, echo: true });
        break;
      case 'recover':
        chime([0, 7, 14, 16], now, 0.18, 1.9, 0.084);
        break;
      case 'complete':
        chime([0, 7, 12, 14, 16, 19], now, 0.31, 2.9, 0.085);
        tone(note(-12), now + 0.92, 4.6, 0.08, { attack: 0.75 });
        break;
      case 'near':
        chime([7, 12], now, 0.21, 0.87, 0.055);
        break;
      case 'boost':
        tone(52, now, 0.73, 0.074, { type: 'triangle', endFrequency: 84, attack: 0.17 });
        break;
      case 'start':
        chime([7, 2, -5], now, 0.19, 1.6, 0.069);
        break;
      case 'click':
        tone(470, now, 0.09, 0.041, { endFrequency: 370, attack: 0.009 });
        break;
    }
  }

  function dispose() {
    clearTimeout(phraseTimer);
    phraseTimer = undefined;
    document.removeEventListener('visibilitychange', sync);
    if (context) {
      context.onstatechange = null;
      if (context.state !== 'closed') context.close().catch(() => {});
    }
    context = null;
    graph = null;
    motion = 0;
    phraseIndex = 0;
    lastPlayed = Object.create(null);
  }

  window.HadalAudio = Object.freeze({ unlock, setEnabled, setMode, setMotion, play, dispose });
})();
