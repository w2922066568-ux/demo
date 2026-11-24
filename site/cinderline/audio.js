(() => {
  'use strict';
  let ctx, master, bus, noise, ambient, voice, volume=.65, muted=false;
  function init(){
    if(!ctx){
      const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;
      try{ctx=new Audio()}catch{return}
      master=ctx.createGain();bus=ctx.createDynamicsCompressor();bus.threshold.value=-17;bus.ratio.value=4;
      master.connect(bus);bus.connect(ctx.destination);voice=master;
      noise=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);
      const samples=noise.getChannelData(0);for(let i=0;i<samples.length;i++)samples[i]=Math.random()*2-1;
      ambient=ctx.createGain();ambient.gain.value=0;ambient.connect(master);
      wind();applyVolume();
    }
    if(ctx.state==='suspended')ctx.resume().catch(()=>{});
  }
  function wind(){
    const source=ctx.createBufferSource(), lp=ctx.createBiquadFilter(), fan=ctx.createOscillator(), motor=ctx.createGain(), lfo=ctx.createOscillator(), sweep=ctx.createGain();
    source.buffer=noise;source.loop=true;lp.type='lowpass';lp.frequency.value=325;lp.Q.value=.45;
    source.connect(lp);lp.connect(ambient);source.start();
    fan.type='sine';fan.frequency.value=48;motor.gain.value=.12;fan.connect(motor);motor.connect(ambient);fan.start();
    lfo.frequency.value=.13;sweep.gain.value=83;lfo.connect(sweep);sweep.connect(lp.frequency);lfo.start();
  }
  function applyVolume(){if(ctx)master.gain.setTargetAtTime(muted?0:volume*.82,ctx.currentTime,.02)}
  function tone(from,to,dur,amp,shape='sine',delay=0){
    const t=ctx.currentTime+delay,o=ctx.createOscillator(),g=ctx.createGain();
    o.type=shape;o.frequency.setValueAtTime(from,t);o.frequency.exponentialRampToValueAtTime(to,t+dur);
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(amp,t+.005);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g);g.connect(voice);o.start(t);o.stop(t+dur+.01);o.onended=()=>{g.disconnect();o.disconnect()};
  }
  function burst(cut,to,dur,amp,mode='lowpass',delay=0){
    const t=ctx.currentTime+delay,n=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();
    n.buffer=noise;f.type=mode;f.Q.value=.8;f.frequency.setValueAtTime(cut,t);f.frequency.exponentialRampToValueAtTime(to,t+dur);
    g.gain.setValueAtTime(amp,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);n.connect(f);f.connect(g);g.connect(voice);
    n.start(t,Math.random());n.stop(t+dur+.01);n.onended=()=>{n.disconnect();g.disconnect();f.disconnect()};
  }
  function cue(name,position){
    if(!ctx||muted||ctx.state!=='running')return;
    if(position&&ctx.createStereoPanner){
      const pan=ctx.createStereoPanner(),gain=ctx.createGain();
      pan.pan.value=Math.max(-1,Math.min(1,position.pan))*.85;
      gain.gain.value=Math.max(.42,1/(1+position.distance*.035));
      gain.connect(pan);pan.connect(master);voice=gain;
      setTimeout(()=>{gain.disconnect();pan.disconnect()},1000);
    }
    switch(name){
      case 'fire':burst(8500,440,.14,.63);tone(146+Math.random()*12,39,.18,.64);tone(1360,260,.045,.105,'sawtooth');burst(2900,560,.24,.1,'bandpass',.052);break;
      case 'enemyFire':tone(980,125,.27,.13,'triangle');burst(1900,470,.19,.16,'bandpass');break;
      case 'reload':burst(4200,500,.16,.28,'highpass');burst(2400,700,.13,.28,'bandpass',.66);tone(221,72,.11,.24,'triangle',1.18);burst(6400,720,.14,.25,'highpass',1.27);break;
      case 'hurt':tone(140,38,.32,.4,'triangle');burst(1300,80,.31,.53);break;
      case 'kill':burst(4800,180,.39,.46);tone(340,47,.4,.29,'triangle');tone(820,370,.09,.10,'sine',.05);break;
      case 'hit':tone(1070,600,.085,.16,'triangle');break;
      case 'step':burst(470,110,.15,.30);burst(3200,1700,.08,.10,'bandpass');break;
      case 'jump':burst(700,105,.23,.29);break;
      case 'dry':tone(335,170,.04,.13,'square');break;
      case 'wave':tone(246,246,.15,.16,'triangle');tone(369,369,.29,.15,'triangle',.19);break;
      case 'win':[294,369,440,587].forEach((f,i)=>tone(f,f,.5,.18,'triangle',i*.14));break;
      case 'lose':tone(196,174,.54,.14,'triangle');tone(147,98,.8,.16,'triangle',.41);break;
      case 'ui':tone(660,470,.06,.07,'triangle');break;
    }
    voice=master;
  }
  window.CinderAudio={init,cue,setVolume(v){volume=Math.max(0,Math.min(1,v));applyVolume()},mute(v){muted=v;applyVolume()},
    field(v){if(ctx)ambient.gain.setTargetAtTime(v ? .36 : 0,ctx.currentTime,.28)}};
})();
