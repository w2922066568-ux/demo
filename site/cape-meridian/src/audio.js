import {heightAt, trailDistance} from './land.js';

const TAU = Math.PI * 2;
const clamp = (v, lo=0, hi=1) => Math.max(lo,Math.min(hi,v));

function randomStream(seed) {
  return () => {
    seed = (Math.imul(seed,1664525)+1013904223) >>> 0;
    return seed/4294967296;
  };
}

// Wind and breakers use independent loop lengths, filters and slowly moving envelopes.
function makeNoise(ctx, seconds, pink, random) {
  const sr=24000, length=Math.round(sr*seconds), overlap=4096;
  const samples=new Float32Array(length+overlap);
  let b0=0,b1=0,b2=0;
  for(let i=0;i<samples.length;i++) {
    const white=2*random()-1;
    b0=.99765*b0+white*.099046;
    b1=.963*b1+white*.2965164;
    b2=.57*b2+white*1.0526913;
    samples[i]=pink?(b0+b1+b2+white*.1848)*.17:white*.76;
  }
  const buf=ctx.createBuffer(1,length,sr), out=buf.getChannelData(0);
  out.set(samples.subarray(overlap));
  for(let i=0;i<overlap;i++) {
    const mix=i/(overlap-1);
    out[length-overlap+i]=samples[length+i]*(1-mix)+samples[i]*mix;
  }
  return buf;
}

function makeFootfall(ctx,kind,random) {
  const sr=24000,duration=.49,buffer=ctx.createBuffer(1,Math.floor(sr*duration),sr);
  const out=buffer.getChannelData(0);
  const grass=kind==='grass',sand=kind==='sand',stone=kind==='rock';
  const heel=stone?.26:grass?.20:.22, toe=.083+.035*random();
  const pitch=52+17*random(),bodyDecay=.045+.012*random();
  const rubLength=sand?.092:grass?.073:.062;
  let low=0,mid=0,phase=0;
  for(let i=0;i<out.length;i++){
    const t=i/sr,noise=random()*2-1;
    low+=.055*(noise-low);mid+=(grass?.20:.34)*(noise-mid);
    phase+=TAU*(pitch+37*Math.exp(-t/.025))/sr;
    const attack=1-Math.exp(-t/.003);
    const weight=attack*Math.exp(-t/bodyDecay);
    const roll=Math.max(0,t-toe);
    const rub=(1-Math.exp(-roll/.018))*Math.exp(-roll/rubLength);
    const materialNoise=grass?mid*.52+low*.48:sand?mid*.73+low*.42:mid*.64+(noise-mid)*.20;
    out[i]=heel*Math.sin(phase)*weight+low*.95*weight+materialNoise*(rub*(sand?.47:.46)+weight*.31);
  }
  // Small, separate impacts give a gravel tread a different attack on each foot.
  const pebbles=stone?7:grass?14:sand?20:30;
  for(let k=0;k<pebbles;k++){
    const start=Math.floor((.015+random()**1.3*(grass?.205:.17))*sr);
    const length=Math.floor(sr*(.004+random()*(grass?.016:.011)));
    const pitch2=(stone?1250:grass?2800:1600)+random()*1900;
    const level=(grass?.024:sand?.009:stone?.071:.091)*(.25+random()*.75);
    let grain=0;
    for(let j=0;j<length;j++) {
      const u=j/length;
      grain=.45*grain+.55*(random()*2-1);
      const impulse=grass||sand?grain:grain*.72+Math.sin(j*TAU*pitch2/sr)*.28;
      out[start+j]+=level*impulse*(1-Math.exp(-u*19))*Math.exp(-u*4.4);
    }
  }
  return buffer;
}

function makeGull(ctx,random) {
  const sr=24000,duration=.53+random()*.17;
  const buffer=ctx.createBuffer(1,Math.ceil(sr*(duration+.10)),sr);
  const out=buffer.getChannelData(0);
  const center=1080+random()*175;
  let phase=0,breath=0,flutter=0;
  for(let i=0;i<out.length;i++) {
    const t=i/sr,u=t/duration;
    if(u>1) break;
    const noise=random()*2-1;
    flutter=flutter*.996+noise*.004;
    breath=breath*.82+noise*.18;
    const pitch=center*(.79+.48*Math.sin(Math.PI*Math.min(1,u/.92))-.20*u+flutter*.31+.014*Math.sin(t*TAU*23));
    phase+=TAU*pitch/sr;
    const vowel=.60*Math.sin(phase)+.21*Math.sin(2*phase+.4)+.15*Math.sin(3*phase+1.4)+.061*Math.sin(4*phase);
    const env=(1-Math.exp(-t/.038))*Math.pow(Math.max(0,1-u),1.06)*(.81+.19*Math.sin(Math.PI*u));
    out[i]=(vowel*(.91+breath*.29)+breath*.15)*env;
  }
  return buffer;
}

function makeSplash(ctx,random) {
  const sr=24000,buffer=ctx.createBuffer(1,Math.round(sr*.63),sr),out=buffer.getChannelData(0);
  let low=0,mid=0;
  for(let i=0;i<out.length;i++) {
    const t=i/sr,noise=random()*2-1;
    low+=.043*(noise-low);mid+=.21*(noise-mid);
    const swish=(1-Math.exp(-t/.026))*Math.exp(-t/.123);
    out[i]=(low*1.28+mid*.44)*swish;
  }
  for(let j=0;j<18;j++) {
    const start=Math.floor((.012+random()*.24)*sr),length=Math.floor((.009+random()*.026)*sr);
    const pitch=480+random()*1050,amp=.021+random()*.052;
    let phase=0;
    for(let i=0;i<length;i++) {
      const u=i/length;
      phase+=TAU*pitch*(1+u*.23)/sr;
      out[start+i]+=Math.sin(phase)*amp*(1-Math.exp(-u*15))*Math.exp(-u*5);
    }
  }
  return buffer;
}

function coastExposure(x,z) {
  if(heightAt(x,z)<4) return 1;
  // Listen for a shoreline below the listener in all directions, including east-facing beaches.
  for (const [radius,amount] of [[12,1],[29,.82],[48,.60],[76,.37]]) {
    for(let i=0;i<8;i++) {
      const angle=i*TAU/8;
      if(heightAt(x+radius*Math.cos(angle),z+radius*Math.sin(angle))<2.6) return amount;
    }
  }
  return .19;
}

export function createAudio() {
  let ctx=null,master=null,enabled=true,unlocked=false,noise=null,wind=null,surf=null,foam=null;
  let feet=null,gulls=null,nextBird=0,nextStep=0,lastSpatial=0,exposure=.6;
  let lastX=NaN,lastZ=NaN,actualDistance=0,footSide=1;
  const random=randomStream(18971108);

  function gain(value) {
    const node=ctx.createGain();
    node.gain.value=value;
    return node;
  }
  function stereo(pan) {
    if(!ctx.createStereoPanner) return gain(1);
    const node=ctx.createStereoPanner();
    node.pan.value=pan;
    return node;
  }
  function bed(buffer,type,freq,q,pan,rate) {
    const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),level=gain(0),panner=stereo(pan);
    source.buffer=buffer;source.loop=true;source.playbackRate.value=rate;
    filter.type=type;filter.frequency.value=freq;filter.Q.value=q;
    source.connect(filter);filter.connect(level);level.connect(panner);panner.connect(master);
    source.start(0,random()*buffer.duration);
    return {filter:filter.frequency,level:level.gain};
  }
  function fade() {
    if(!ctx) return;
    const visible=!document.hidden;
    master.gain.setTargetAtTime(enabled&&visible?.81:0,ctx.currentTime,.09);
    if(enabled&&visible&&ctx.state==='suspended') ctx.resume().catch(()=>{});
  }
  function unlock() {
    if(navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
    unlocked=true;
    if(!enabled) return;
    if(ctx) {fade();return;}
    const Audio=window.AudioContext||window.webkitAudioContext;
    if(!Audio) return;
    try {ctx=new Audio({latencyHint:'interactive'});} catch {return;}
    master=gain(0);
    const highpass=ctx.createBiquadFilter();
    highpass.type='highpass';highpass.frequency.value=42;highpass.Q.value=.55;
    master.connect(highpass);highpass.connect(ctx.destination);
    noise=[makeNoise(ctx,4.67,true,random),makeNoise(ctx,5.81,true,random),makeNoise(ctx,3.89,false,random)];
    wind=[bed(noise[0],'lowpass',680,.43,-.36,.82),bed(noise[1],'bandpass',880,.47,.41,.91)];
    surf=[bed(noise[1],'lowpass',320,.49,-.64,.71),bed(noise[0],'lowpass',400,.52,.54,1.14)];
    foam=[bed(noise[2],'bandpass',1730,.43,-.56,.88),bed(noise[2],'bandpass',2250,.51,.43,1.14)];
    feet={};
    for(const kind of ['gravel','grass','rock','sand']) feet[kind]=Array.from({length:5},()=>makeFootfall(ctx,kind,random));
    feet.water=Array.from({length:4},()=>makeSplash(ctx,random));
    gulls=Array.from({length:3},()=>makeGull(ctx,random));
    nextBird=ctx.currentTime+11+random()*7;
    document.addEventListener('visibilitychange',fade);
    mixBeds(0,ctx.currentTime);
    // Keep the surf breathing while the player reads a chart or pauses on the title screen.
    window.setInterval(()=>{
      if(enabled&&!document.hidden&&ctx.state==='running') mixBeds(ctx.currentTime,ctx.currentTime);
    },150);
    fade();
  }
  function setEnabled(value) {
    enabled=Boolean(value);
    if(enabled&&unlocked&&!ctx) unlock();
    fade();
  }
  function oneShot(buffer,at,volume,pan,rate=1) {
    const source=ctx.createBufferSource(),level=gain(volume),panner=stereo(pan);
    source.buffer=buffer;source.playbackRate.value=rate;
    source.connect(level);level.connect(panner);panner.connect(master);
    source.onended=()=>{source.disconnect();level.disconnect();panner.disconnect();};
    source.start(at);
  }
  function mixBeds(t,at) {
    const gust=.50+.25*Math.sin(t*.47+.83*Math.sin(t*.23))+.17*Math.sin(t*.79+1.2)+.08*Math.sin(t*1.31);
    const change=(param,v,smooth=.24)=>param.setTargetAtTime(v,at,smooth);
    change(wind[0].level,.072+gust*.106);change(wind[0].filter,395+gust*795,.37);
    change(wind[1].level,.025+gust*.061);change(wind[1].filter,560+gust*540,.39);
    for(let i=0;i<2;i++){
      const phase=t*(i?.66:.54)+Math.sin(t*.133+i*.38)*.83+i*2.8;
      const incoming=(.5+.5*Math.sin(phase))**1.95;
      const spilling=(.5+.5*Math.sin(phase-.8))**3.1;
      const wash=(.15+.85*exposure);
      change(surf[i].level,(.063+incoming*.27)*wash);
      change(surf[i].filter,185+exposure*180+incoming*475);
      change(foam[i].level,(.004+spilling*.077)*wash);
      change(foam[i].filter,800+(exposure*.77+.23)*(770+spilling*1060));
    }
  }
  function update(time,position,moving,running,terrainKind) {
    if(!ctx||!position||!Number.isFinite(time)) return;
    const now=ctx.currentTime,{x,z}=position;
    if(!Number.isFinite(x)||!Number.isFinite(z)) return;
    const travelled=Number.isFinite(lastX)?Math.hypot(x-lastX,z-lastZ):0;
    lastX=x;lastZ=z;
    if(!enabled||document.hidden||ctx.state!=='running') {actualDistance=0;return;}
    if(now-lastSpatial>.48) {exposure=coastExposure(x,z);lastSpatial=now;}
    if(!moving){actualDistance=0;nextStep=Math.min(nextStep,now+.085);}
    else {
      actualDistance+=Math.min(travelled,2);
      if(actualDistance>(running?.62:.37)&&now>=nextStep){
        let kind=terrainKind;
        if(!feet[kind]) kind=kind==='trail'||kind==='path'||kind==='dirt'?'gravel':trailDistance(x,z)<1.7?'gravel':heightAt(x,z)<5?'sand':'grass';
        const variants=feet[kind];footSide*=-1;
        oneShot(variants[Math.floor(random()*variants.length)],now,(running?.63:.48)*(.91+.14*random()),footSide*.11,.91+random()*.19);
        actualDistance=0;nextStep=now+(kind==='water'?.65:running?.33:.46)+random()*.055;
      }
    }
    if(now>nextBird) {
      const pan=(random()>.5?1:-1)*(.33+random()*.48);
      const rate=.94+random()*.14, level=.008+.012*exposure;
      oneShot(gulls[Math.floor(random()*gulls.length)],now,level,pan,rate);
      if(random()<.65) oneShot(gulls[Math.floor(random()*gulls.length)],now+.6+random()*.31,level*.69,pan*.94,rate*.94);
      nextBird=now+18+random()*27;
    }
  }
  function chime() {
    if(!ctx||!enabled||document.hidden||ctx.state!=='running') return;
    const now=ctx.currentTime;
    // A small brass instrument struck twice, with its upper partial fading first.
    for(const [pitch,offset,amplitude,decay] of [[698.46,0,.047,.50],[1046.50,.115,.038,.64],[2087,.117,.009,.20]]) {
      const at=now+offset,osc=ctx.createOscillator(),level=gain(0);
      osc.type='sine';osc.frequency.setValueAtTime(pitch*1.003,at);osc.frequency.exponentialRampToValueAtTime(pitch,at+.1);
      level.gain.setValueAtTime(.00001,at);level.gain.exponentialRampToValueAtTime(amplitude,at+.012);
      level.gain.exponentialRampToValueAtTime(.00001,at+decay);
      osc.connect(level);level.connect(master);
      osc.onended=()=>{osc.disconnect();level.disconnect();};osc.start(at);osc.stop(at+decay+.01);
    }
  }
  return {unlock,setEnabled,update,chime};
}
