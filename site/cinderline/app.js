(() => {
  'use strict';
  const $=id=>document.getElementById(id), audio=window.CinderAudio;
  const defaults={volume:65,sensitivity:1,quality:matchMedia('(pointer:coarse)').matches?'medium':'high',muted:false,best:0};
  let pref={...defaults};
  try{const saved=JSON.parse(localStorage.getItem('cinderline.prefs'));if(saved&&typeof saved==='object')Object.assign(pref,saved)}catch{}
  const save=()=>{try{localStorage.setItem('cinderline.prefs',JSON.stringify(pref))}catch{}};
  const two=n=>String(n).padStart(2,'0');
  const formatTime=t=>Math.floor(t/60)+'m '+two(Math.floor(t)%60)+'s';
  let game=null,state='menu',panel=null,lastFocus=null;
  const drawer=$('dialogVeil'),body=$('dialogBody');
  function settings(){
    audio.mute(pref.muted);audio.setVolume(pref.volume/100);
    game?.setSensitivity(pref.sensitivity);game?.setQuality(pref.quality);
    updateSoundIcon();
    $('record').textContent='PERSONAL BEST  /  '+(pref.best?pref.best.toLocaleString()+' PTS':'—');
  }
  const entries={
    theater:{tag:'01 / THEATER',title:'Ashfall Foundry',description:'Ashfall’s geothermal intake is under automated lockdown. Clear the loading yard, push toward the turbine, and survive the final security response.',spec:[['Sector','07 · Exterior'],['Operation','Three engagements']]},
    weapon:{tag:'02 / LOADOUT',title:'VX-7 Arc Carbine',description:'An automatic pulse carbine with a reflex sight. Reload between engagements. If both the magazine and reserve run dry, the auxiliary cell recharges 12 rounds.',spec:[['Magazine','30 rounds'],['Starting reserve','150 rounds']]},
    threat:{tag:'03 / HOSTILES',title:'Security Drones',description:'Interceptors strafe through the yard. Armored Wardens absorb more fire. Watch for the targeting beam and move before the plasma bolt arrives.',spec:[['Interceptor','Recon chassis'],['Warden','Armored chassis']]}
  };
  const binding=(a,b)=>'<div class="binding"><span>'+a+'</span><kbd>'+b+'</kbd></div>';
  const actionBtn=(label,action,primary=false)=>'<button class="'+(primary?'primary':'secondary')+'" data-action="'+action+'">'+label+'</button>';
  function drawPanel(name,tag,title,html,dismiss=true){
    if(drawer.hidden)lastFocus=document.activeElement;
    window.CinderIntel.release(body);panel=name;$('dialogTag').textContent=tag;$('dialogTitle').textContent=title;body.innerHTML=html;
    $('closeDialog').hidden=!dismiss;drawer.hidden=false;
    if(!$('base').hidden)$('base').inert=true;
    window.CinderIntel.bind(body);
    const target=dismiss?$('closeDialog'):body.querySelector('button');target?.focus({preventScroll:true});
  }
  function hidePanel(restore=true){
    drawer.hidden=true;panel=null;$('base').inert=false;window.CinderIntel.release(body);
    if(restore&&lastFocus?.isConnected)lastFocus.focus({preventScroll:true});
  }
  function show(name){
    if(entries[name]){
      const e=entries[name],art=name==='theater'?'<div class="dialog-art photo" aria-hidden="true"></div>':'<div class="dialog-art"><canvas data-diagram="'+name+'"></canvas></div>';
      drawPanel(name,'DEPLOYMENT INTEL  /  '+e.tag,e.title,art+'<p>'+e.description+'</p>'+e.spec.map(([k,v])=>'<div class="spec"><span>'+k+'</span><span>'+v+'</span></div>').join(''));
    }else if(name==='manual'){
      drawPanel(name,'OPERATIONS / FIELD REFERENCE','Field manual',[
        ['Move','W A S D'],['Look','Mouse / arrows'],['Fire','Left mouse / F'],['Aim down sights','Right mouse'],['Reload','R'],['Sprint','Shift'],['Jump','Space'],['Pause','Esc / P']
      ].map(v=>binding(...v)).join('')+'<span class="control-caption">Touch controls use the left stick to move and the right side to look.</span>');
    }else if(name==='settings'){
      drawPanel(name,'SYSTEM / PREFERENCES','Settings','<div class="pref-row"><label for="quality">Render quality</label><select id="quality"><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></div><div class="pref-row"><label for="sens">Look sensitivity</label><input type="range" min=".25" max="2.5" step=".05" id="sens"><output id="sensOut"></output></div><div class="pref-row"><label for="volume">Audio volume</label><input type="range" min="0" max="100" id="volume"><output id="volOut"></output></div><div class="dialog-actions">'+actionBtn('Done','close',true)+'</div>');
      $('quality').value=pref.quality;$('sens').value=pref.sensitivity;$('volume').value=pref.volume;
      $('sensOut').textContent=Number(pref.sensitivity).toFixed(2)+'×';$('volOut').textContent=pref.volume+'%';
      $('quality').onchange=e=>{pref.quality=e.target.value;game?.setQuality(pref.quality);save()};
      $('sens').oninput=e=>{pref.sensitivity=+e.target.value;$('sensOut').textContent=pref.sensitivity.toFixed(2)+'×';game?.setSensitivity(pref.sensitivity);save()};
      $('volume').oninput=e=>{pref.volume=+e.target.value;pref.muted=false;audio.setVolume(pref.volume/100);audio.mute(false);$('volOut').textContent=pref.volume+'%';save();updateSoundIcon()};
      $('volume').onchange=()=>audio.cue('ui');
    }else if(name==='pause'){
      drawPanel(name,'ASHFALL FOUNDRY / OPERATION 01','Mission paused','<div class="dialog-actions">'+actionBtn('Resume','resume',true)+actionBtn('Settings','settings')+actionBtn('Field manual','manual')+actionBtn('Leave mission','leave')+'</div>',false);
    }
  }
  function close(){
    if(state==='paused'&&panel!=='pause')show('pause');
    else if(panel==='pause')game?.resume();
    else if(['won','lost','error'].includes(state))returnMenu();
    else hidePanel();
  }
  function returnMenu(){
    hidePanel(false);
    if(game?.getState){game.menu()}else{game?.dispose();game=null;onState('menu',{})}
  }
  function updateSoundIcon(){
    document.querySelectorAll('.sound-btn').forEach(b=>{const label=pref.muted?'Enable audio':'Mute audio';b.title=label;b.setAttribute('aria-label',label);b.querySelector('use').setAttribute('href',pref.muted?'#i-muted':'#i-sound')});
  }
  function onState(next,result){
    state=next;$('loading').hidden=true;
    $('touchAim').setAttribute('aria-pressed','false');
    audio.field(next==='playing');
    if(next==='playing'){
      hidePanel(false);$('base').hidden=true;$('gameScreen').hidden=false;
    }else if(next==='paused')show('pause');
    else if(next==='won'||next==='lost'){
      if(result.score>pref.best){pref.best=result.score;save();$('record').textContent='PERSONAL BEST  /  '+pref.best.toLocaleString()+' PTS'}
      const stats=[[result.score,'SCORE'],[result.kills,'ELIMINATIONS'],[result.accuracy+'%','ACCURACY']];
      drawPanel('result','AFTER ACTION / ASHFALL FOUNDRY',next==='won'?'Foundry secured':'Signal lost',
        '<p>'+(next==='won'?'All three security waves cleared. The intake is back under your control.':'Your suit went offline during engagement '+two(result.wave)+'.')+' Mission time '+formatTime(result.time)+'.</p><div class="summary">'+stats.map(([v,k])=>'<div><strong>'+v+'</strong><small>'+k+'</small></div>').join('')+'</div><div class="dialog-actions">'+actionBtn('Redeploy','deploy',true)+actionBtn('Operations','leave')+'</div>',false);
    }else if(next==='menu'){
      hidePanel(false);$('base').hidden=false;$('gameScreen').hidden=true;$('deploy').focus({preventScroll:true});
    }else if(next==='error'){
      drawPanel('error','SYSTEM / RENDERER','Unable to deploy','<p id="gameError"></p><div class="dialog-actions">'+actionBtn('Operations','leave',true)+'</div>',false);
      $('gameError').textContent='The 3D renderer could not start. Open the game in a browser with hardware acceleration enabled. '+(result.message||'');
    }
  }
  function deploy(){
    if(!$('loading').hidden)return;
    audio.init();hidePanel(false);$('loading').hidden=false;$('gameScreen').hidden=false;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      try{
        if(!game){
          game=window.CinderGame.create($('world'),{onHUD:updateHUD,onState,onSound:audio.cue});
          game.setSensitivity(pref.sensitivity);game.setQuality(pref.quality);
        }
        game.start();
      }catch(err){onState('error',{message:err.message})}
    }));
  }
  const compass=[],dirs=['N','NE','E','SE','S','SW','W','NW'];
  for(let i=0;i<7;i++){const s=document.createElement('span');$('compass').append(s);compass.push(s)}
  const labels={};function label(id,value){if(labels[id]===value)return;labels[id]=value;$(id).textContent=value}
  const radar=$('radar').getContext('2d');
  function updateHUD(d){
    label('waveLabel','ENGAGEMENT '+two(d.wave)+' / '+two(d.waves));label('waveTitle',d.objective);label('enemyCount',d.remaining+' '+(d.remaining===1?'hostile':'hostiles')+' remaining');
    $('targetPanel').hidden=!d.target;
    if(d.target){
      label('targetName',d.target.name);
      $('targetHealth').style.width=(100*d.target.hp/d.target.maxHP)+'%';
    }
    label('hp',d.health);$('hpFill').style.width=d.health+'%';$('hpFill').style.background=d.health<30?'#ff6f45':'';
    label('ammo',two(d.ammo));label('reserve',d.reserve);label('weaponState',d.charging?'CHARGING':d.reloading?'RELOADING':d.sprinting?'SPRINT':'AUTO');
    $('damage').style.opacity=d.damageFlash;$('hitMark').style.opacity=d.hitMarker;
    $('reticle').style.opacity=d.sprinting||d.aiming?'0':'1';$('reticle').style.setProperty('--gap',(4+12*d.spread)+'px');
    $('notice').style.opacity=Math.min(1,Math.max(0,d.announcementTimer*2));label('noticeText',d.announcement);
    $('reloadTrack').hidden=!d.reloading;
    if(d.reloading){
      $('reloadTrack').querySelector('small').textContent=d.charging?'CHARGING':'RELOADING';
      $('reloadTrack').querySelector('i').style.width=(d.reloadProgress*100)+'%';
    }
    const n=Math.round(d.heading/15);
    compass.forEach((el,i)=>{const deg=(n+i-3)*15,normal=(deg%360+360)%360;
      el.style.left=(50+(deg-d.heading)*1.25)+'%';const s=normal%45===0?dirs[normal/45]:String(normal);if(el.textContent!==s)el.textContent=s;
    });
    radar.clearRect(0,0,180,180);radar.save();radar.translate(90,90);
    radar.fillStyle='#10201cad';radar.beginPath();radar.arc(0,0,81,0,2*Math.PI);radar.fill();
    for(const r of [39,80]){radar.strokeStyle='#ccdbc55f';radar.lineWidth=1;radar.beginPath();radar.arc(0,0,r,0,2*Math.PI);radar.stroke()}
    radar.strokeStyle='#cbd8c84a';radar.beginPath();radar.moveTo(-62,-52);radar.lineTo(0,0);radar.lineTo(62,-52);radar.stroke();
    radar.fillStyle='#dfebd4';radar.beginPath();radar.moveTo(0,-7);radar.lineTo(-4,5);radar.lineTo(4,5);radar.closePath();radar.fill();
    for(const p of d.drones){const dist=Math.min(75,p.distance*2.1),x=Math.sin(p.angle)*dist,y=-Math.cos(p.angle)*dist;radar.fillStyle='#ff834c';radar.fillRect(x-3,y-3,6,6)}
    radar.restore();
  }
  document.addEventListener('click',e=>{
    const button=e.target.closest('button');if(!button)return;audio.init();
    if(!button.closest('#touchUI'))audio.cue('ui');
    if(button.dataset.open){show(button.dataset.open);return}
    const a=button.dataset.action;
    if(button.id==='deploy'||a==='deploy')deploy();
    else if(button.id==='closeDialog'||a==='close')close();
    else if(button.id==='opsTab')document.getElementById('operations').scrollIntoView({block:'nearest'});
    else if(button.classList.contains('sound-btn')){pref.muted=!pref.muted;audio.mute(pref.muted);updateSoundIcon();save()}
    else if(button.id==='pauseButton')game?.pause();
    else if(a==='resume')game?.resume();
    else if(a==='leave')returnMenu();
    else if(a)show(a);
  });
  drawer.addEventListener('click',e=>{if(e.target===drawer&&panel!=='pause'&&panel!=='result'&&panel!=='error')close()});
  document.addEventListener('keydown',e=>{
    if(drawer.hidden)return;
    if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close();return}
    if(e.key==='Tab'){
      const nodes=[...$('dialog').querySelectorAll('button:not([hidden]),input,select')],first=nodes[0],last=nodes[nodes.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
    }
  },true);
  function pad(id,start,move,end){
    const el=$(id);let pointer=null;
    el.addEventListener('pointerdown',e=>{if(pointer!==null||state!=='playing')return;pointer=e.pointerId;el.setPointerCapture(pointer);e.preventDefault();start(e,el)});
    el.addEventListener('pointermove',e=>{if(e.pointerId===pointer)move?.(e,el)});
    const stop=e=>{if(pointer===e.pointerId){pointer=null;end?.(el)}};
    el.addEventListener('pointerup',stop);el.addEventListener('lostpointercapture',stop);el.addEventListener('pointercancel',stop);
  }
  function stick(e,el){const r=el.getBoundingClientRect();let x=(e.clientX-r.left-r.width/2)/(r.width*.4),y=(e.clientY-r.top-r.height/2)/(r.height*.4),mag=Math.max(1,Math.hypot(x,y));x/=mag;y/=mag;game?.move(x,-y);game?.action('sprint',y<-.86);el.firstElementChild.style.transform='translate('+x*25+'px,'+y*25+'px)'}
  pad('movePad',stick,stick,el=>{game?.move(0,0);game?.action('sprint',false);el.firstElementChild.style.transform=''});
  function lookSurface(id,fire){
    let px=0,py=0;
    pad(id,e=>{px=e.clientX;py=e.clientY;if(fire)game?.action('fire',true)},e=>{
      game?.look((e.clientX-px)*2.2,(e.clientY-py)*2.2);px=e.clientX;py=e.clientY;
    },()=>{if(fire)game?.action('fire',false)});
  }
  lookSurface('lookPad',false);lookSurface('touchFire',true);
  pad('touchAim',(e,el)=>{const held=el.getAttribute('aria-pressed')!=='true';el.setAttribute('aria-pressed',String(held));game?.action('aim',held)});
  for(const [id,a] of [['touchReload','reload'],['touchJump','jump']])pad(id,()=>game?.action(a,true),null,()=>game?.action(a,false));
  settings();
  const c=$('embers'),g=c.getContext('2d'),particles=Array.from({length:29},()=>({x:Math.random(),y:Math.random(),t:Math.random()*7,size:.6+Math.random()*1.4}));
  let prev=0,scheduled=false;
  function embers(t){
    scheduled=false;if($('base').hidden||document.hidden||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
    if(t-prev>45){
      const w=c.clientWidth,h=c.clientHeight,dt=Math.min((t-prev)*.001,.18);prev=t;if(c.width!==w||c.height!==h){c.width=w;c.height=h}
      g.clearRect(0,0,w,h);for(const p of particles){p.t+=dt;p.y-=dt*(.009+p.size*.003);p.x+=dt*.003;if(p.y<0){p.y=1;p.x=Math.random()}
        g.fillStyle='rgba(254,155,80,'+(.12+.24*Math.max(0,Math.sin(p.t*.9)))+')';g.beginPath();g.arc((p.x%1)*w+Math.sin(p.t)*7,p.y*h,p.size,0,Math.PI*2);g.fill()}
    }
    scheduleEmbers();
  }
  function scheduleEmbers(){if(!scheduled&&!$('base').hidden&&!document.hidden){scheduled=true;requestAnimationFrame(embers)}}
  new MutationObserver(scheduleEmbers).observe($('base'),{attributes:true,attributeFilter:['hidden']});document.addEventListener('visibilitychange',scheduleEmbers);scheduleEmbers();
})();
