(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const all = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const asset = path => window.formaAsset ? window.formaAsset(path) : path;
  const ease = 'cubic-bezier(.2,.75,.2,1)';
  const works = [
    { key:'bloom', name:'褶光', en:'Folded Bloom', category:'生成雕塑 / 褶皱研究', desc:'以花瓣向内卷曲的姿态为起点，让细密的脊线沿曲面延伸。珊瑚色高光在折面之间游走，同一片表面便有了丝绸的柔软与雕塑的重量。', material:'褶面 · 珊瑚色缎光', motion:'螺旋舒展 · 花瓣卷曲', alt:'褶光，珊瑚粉色的褶皱雕塑' },
    { key:'orbit', name:'环蚀', en:'Orbital Drift', category:'光学形态 / 轨道研究', desc:'把视线引向环体中央的空隙。随着环体翻转，交织的轮廓时而分离，时而叠合，冷紫色的高光让内外两层轨道逐渐显形。', material:'管状曲面 · 冷紫光泽', motion:'环体翻转 · 高光巡游', alt:'环蚀，淡紫色相互绕行的环形雕塑' },
    { key:'strata', name:'层峦', en:'Soft Strata', category:'数字地貌 / 切片研究', desc:'从等高线图借来一条轮廓，将它抬升、错位、逐层堆叠。琥珀色边缘接住光，层间留下窄而深的阴影，让一小块数字地貌拥有可读的深度。', material:'层叠切片 · 琥珀暖光', motion:'分层起伏 · 波峰传递', alt:'层峦，琥珀色起伏的层叠地貌' }
  ];
  const indexText = i => String(i + 1).padStart(2, '0');
  function animate(node, frames, duration = 400) {
    if (reduce.matches || !node.animate) return;
    node.getAnimations().forEach(a => a.cancel());
    return node.animate(frames, { duration, easing:ease });
  }
  function reveal(node) {
    animate(node,[{opacity:.1,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],420);
  }
  function setPressed(buttons, index) {
    buttons.forEach((button,i) => button.setAttribute('aria-pressed',String(i === index)));
  }

  const hero = $('#exhibition');
  const heroCanvas = $('#heroCanvas');
  const heroPause = $('#heroPause');
  const sceneButtons = all('[data-scene]');
  const project = $('#projectDialog');
  const cinema = $('#cinema');
  const duration = 24;
  const chapterLength = duration / works.length;
  const clockText = t => '00:' + String(Math.floor(t)).padStart(2,'0') + ' / 00:24';

  // Both views use wall-clock time. A dropped frame skips to the correct
  // pose. Pausing, seeking and tab switching never accumulate elapsed time.
  function createTransport(loop, paint, onEnd) {
    let time=0, rate=1, active=false, previous=null, frame=0;
    function tick(stamp) {
      if (!active) return;
      if (previous !== null) time += Math.max(0,stamp-previous) * rate/1000;
      previous=stamp;
      const ended=!loop && time>=duration;
      time=loop ? time%duration : Math.min(time,duration);
      paint(time,'play');
      if (ended) {
        active=false;previous=null;frame=0;onEnd();
      } else {
        frame=requestAnimationFrame(tick);
      }
    }
    return {
      get time(){return time;},
      setRate(value){rate=value;},
      seek(value,mode='scrub'){
        time=Math.max(0,Math.min(duration,value));
        previous=null;
        paint(time,mode);
      },
      run(next){
        if(active===next)return;
        active=next;previous=null;
        cancelAnimationFrame(frame);frame=0;
        if(active)frame=requestAnimationFrame(tick);
      }
    };
  }

  function mountScene(canvas, index) {
    return window.FormaSculpture.mount(canvas,{variant:works[index].key,externalClock:true});
  }
  function switchScene(canvas, renderer, index, animateCut) {
    renderer.setVariant(works[index].key);
    if (animateCut) {
      animate(canvas,[
        {opacity:.04,transform:'translateX(3%) scale(.86) rotate(-5deg)'},
        {opacity:1,offset:.62},
        {opacity:1,transform:'none'}
      ],650);
    }
  }
  const slider=$('#heroSeek'), clockLabel=$('#heroClock');
  const heroRenderer=mountScene(heroCanvas,0);
  const heroField=window.FormaLight.mount($('#heroField'));
  let heroIndex=-1, heroPlaying=!reduce.matches, heroVisible=!hero.hidden, scrubbing=false, leavingHero=false;
  let heroSecond=-1, rateIndex=0;
  const rates=[1,1.5,2,.5];

  function paintHero(time,mode) {
    const index=Math.min(works.length-1,Math.floor(time/chapterLength));
    const phase=(time-index*chapterLength)/chapterLength;
    if (index!==heroIndex) {
      const cut=heroIndex>=0 && mode!=='scrub';
      heroIndex=index;
      const work=works[index];
      hero.dataset.art=work.key;
      $('#figNumber').textContent=indexText(index);
      $('#figName').textContent=work.name;
      $('#figEnglish').textContent=work.en;
      heroCanvas.setAttribute('aria-label',work.alt);
      setPressed(sceneButtons,index);
      if(cut)reveal($('.stage-caption'));
      switchScene(heroCanvas,heroRenderer,index,cut);
    }
    heroRenderer.seek(phase);
    heroField.draw(index,phase);
    if(!scrubbing)slider.value=String(time);
    slider.style.setProperty('--position',(100*time/duration)+'%');
    const second=Math.floor(time);
    if(second!==heroSecond){
      heroSecond=second;
      clockLabel.value=clockText(time);
      slider.setAttribute('aria-valuetext',works[index].name+'，第 '+second+' 秒');
    }
  }
  const heroTransport=createTransport(true,paintHero);
  function setHero(index,instant=false){heroTransport.seek(index*chapterLength,instant?'scrub':'cut');}
  function syncHero() {
    const run=heroPlaying && heroVisible && !hero.hidden && !leavingHero && !scrubbing &&
      !document.querySelector('dialog[open]') && !document.hidden;
    heroRenderer.setPaused(!run);
    heroTransport.run(run);
    const label=heroPlaying?'暂停动态':'播放动态';
    heroPause.classList.toggle('is-paused',!heroPlaying);
    heroPause.setAttribute('aria-pressed',String(!heroPlaying));
    heroPause.setAttribute('aria-label',label);
    $('#playLabel').textContent=label;
  }
  sceneButtons.forEach((b,i) => b.addEventListener('click',() => setHero(i)));
  heroPause.addEventListener('click',()=>{
    heroPlaying=!heroPlaying;
    if(heroPlaying)heroRenderer.setMotionAllowed(true);
    syncHero();
  });
  $('#heroRate').addEventListener('click',event=>{
    rateIndex=(rateIndex+1)%rates.length;
    const rate=rates[rateIndex];
    heroTransport.setRate(rate);
    event.currentTarget.textContent=rate+'×';
    event.currentTarget.setAttribute('aria-label','切换播放速度，当前 '+rate+' 倍速');
  });
  slider.addEventListener('pointerdown',event=>{
    scrubbing=true;
    slider.setPointerCapture(event.pointerId);
    syncHero();
  });
  slider.addEventListener('input',()=>heroTransport.seek(Number(slider.value)));
  slider.addEventListener('lostpointercapture',()=>{scrubbing=false;syncHero();});
  reduce.addEventListener('change',()=>{
    heroRenderer.setMotionAllowed(!reduce.matches);
    heroPlaying=!reduce.matches;
    syncHero();
  });
  new IntersectionObserver(([item])=>{
    heroVisible=item.isIntersecting;
    syncHero();
  }).observe(hero);
  document.addEventListener('visibilitychange',syncHero);
  heroTransport.seek(0);
  syncHero();
  if (!reduce.matches) {
    [$('.hero-kicker'),$('.hero-title>span'),$('.hero-title>em'),$('.intro-title'),$('.intro-sub'),$('.hero-actions')].forEach((node,i) => {
      node.animate([{transform:'translateY('+(9+i*2)+'px)',opacity:.25},{transform:'translateY(0)',opacity:1}],{duration:620+i*60,easing:ease});
    });
  }

  const menuToggle = $('#menuToggle'), mobileNav = $('#mobileNav');
  function setMenu(open) {
    mobileNav.hidden = !open;
    menuToggle.setAttribute('aria-expanded',String(open));
    menuToggle.setAttribute('aria-label',open ? '关闭导航' : '打开导航');
  }
  menuToggle.addEventListener('click',() => setMenu(mobileNav.hidden));
  all('a',mobileNav).forEach(a => a.addEventListener('click',() => setMenu(false)));
  document.addEventListener('pointerdown',e => {if (!mobileNav.hidden && !e.target.closest('.site-header')) setMenu(false);});
  document.addEventListener('keydown',e => {if (e.key === 'Escape' && !mobileNav.hidden) {setMenu(false);menuToggle.focus();}});
  matchMedia('(min-width:721px)').addEventListener('change',e => {if(e.matches) setMenu(false);});
  window.addEventListener('forma:before-route',()=>{
    leavingHero=true;
    setMenu(false);
    [project,cinema].forEach(dialog=>{if(dialog.open)dialog.close();});
    document.body.classList.remove('dialog-open');
    syncHero();
  });
  window.addEventListener('forma:route',()=>{leavingHero=false;syncHero();});
  window.addEventListener('forma:map',syncHero);

  const soundButton = $('#sound');
  let soundContext, soundGain, soundOn = false;
  function syncSound() {
    soundButton.setAttribute('aria-pressed',String(soundOn));
    soundButton.setAttribute('aria-label',soundOn ? '关闭环境音' : '开启环境音');
    $('.sound-state').textContent = soundOn ? '开' : '关';
    if (soundGain) {
      const now = soundContext.currentTime;
      soundGain.gain.cancelScheduledValues(now);
      soundGain.gain.setTargetAtTime(soundOn && !document.hidden ? .045 : 0,now,.16);
    }
  }
  soundButton.addEventListener('click',async () => {
    try {
      if (!soundContext) {
        soundContext = new (window.AudioContext || window.webkitAudioContext)();
        soundGain = soundContext.createGain();
        soundGain.gain.value = 0;
        soundGain.connect(soundContext.destination);
        [110,164.81,220.4,277.18,329.63].forEach((hz,i) => {
          const tone = soundContext.createOscillator(), level = soundContext.createGain();
          tone.type='sine';tone.frequency.value=hz;level.gain.value=[.44,.23,.10,.10,.06][i];
          tone.connect(level);level.connect(soundGain);tone.start();
        });
      }
      await soundContext.resume();soundOn=!soundOn;syncSound();
    } catch {
      soundButton.disabled=true;soundButton.setAttribute('aria-label','当前浏览器无法播放环境音');$('.sound-state').textContent='不可用';
    }
  });
  document.addEventListener('visibilitychange',syncSound);

  const grid = $('#workGrid'), gridButton=$('#gridView'), listButton=$('#listView');
  function setList(list) {
    if (grid.classList.contains('list-mode') === list) return;
    const cards=all('.work-card',grid), old=cards.map(b=>b.getBoundingClientRect());
    grid.classList.toggle('list-mode',list);
    setPressed([gridButton,listButton],Number(list));
    cards.forEach((b,i) => {
      const r=b.getBoundingClientRect();
      animate(b,[{transform:'translate('+(old[i].left-r.left)*.32+'px,'+(old[i].top-r.top)*.32+'px)',opacity:.48},{transform:'none',opacity:1}],470);
    });
  }
  gridButton.addEventListener('click',()=>setList(false));
  listButton.addEventListener('click',()=>setList(true));

  let detailIndex=0, opener=null;
  function openDialog(dialog, trigger, sharedImage=false) {
    opener=trigger;
    setMenu(false);
    dialog.showModal();
    document.body.classList.add('dialog-open');
    syncHero();
    $('.close-btn',dialog).focus({preventScroll:true});
    if (!sharedImage) animate(dialog,[{opacity:.12,transform:'translateY(12px) scale(.985)'},{opacity:1,transform:'none'}],420);
  }
  const closing = new WeakSet();
  async function closeDialog(dialog, after) {
    if (!dialog.open || closing.has(dialog)) return;
    closing.add(dialog);
    const animation=animate(dialog,[{opacity:1,transform:'none'},{opacity:0,transform:'translateY(7px) scale(.99)'}],170);
    try {await animation?.finished;} catch {}
    dialog.close();
    closing.delete(dialog);
    document.body.classList.remove('dialog-open');
    syncHero();
    opener?.focus({preventScroll:true});
    if (after) after();
  }
  [project,cinema].forEach(dialog => {
    dialog.addEventListener('cancel',event=>{event.preventDefault();closeDialog(dialog);});
    dialog.addEventListener('click',event=>{if(event.target===dialog && dialog===project)closeDialog(dialog);});
  });
  all('[data-close]').forEach(b=>b.addEventListener('click',()=>closeDialog(document.getElementById(b.dataset.close))));
  function showDetail(index) {
    detailIndex=index;
    const w=works[index];
    const img=$('#detailImg');img.src=asset('assets/'+w.key+'.webp');img.alt=w.alt;
    $('#detailFig').textContent='FIG. '+indexText(index)+' / 03';
    $('#detailCat').textContent=w.category;$('#detailTitle').textContent=w.name;
    $('#detailEn').textContent=w.en;$('#detailDesc').textContent=w.desc;
    const dl=$('#detailMeta');dl.replaceChildren();
    [['材质语言',w.material],['动态设计',w.motion]].forEach(([term,value])=>{
      const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');
      dt.textContent=term;dd.textContent=value;row.append(dt,dd);dl.append(row);
    });
    if (project.open){reveal($('.detail-copy'));animate(img,[{opacity:.35,transform:'scale(1.04)'},{opacity:1,transform:'none'}],500);}
  }
  let plateTransition;
  function openWork(index,button) {
    if (project.open || plateTransition) return;
    showDetail(index);
    if (reduce.matches || !document.startViewTransition) {openDialog(project,button);return;}
    const cover=$('.card-image',button), plate=$('.detail-plate');
    cover.style.viewTransitionName='exhibit-image';
    document.documentElement.classList.add('plate-transition');
    plateTransition=document.startViewTransition(()=>{
      cover.style.removeProperty('view-transition-name');
      openDialog(project,button,true);
      plate.style.viewTransitionName='exhibit-image';
    });
    plateTransition.finished.finally(()=>{
      plate.style.removeProperty('view-transition-name');
      cover.style.removeProperty('view-transition-name');
      document.documentElement.classList.remove('plate-transition');
      plateTransition=null;
    });
  }
  all('[data-work]').forEach((button,i)=>button.addEventListener('click',()=>openWork(i,button)));
  $('#detailNext').addEventListener('click',()=>showDetail((detailIndex+1)%works.length));
  $('#detailView').addEventListener('click',()=>closeDialog(project,async()=>{
    setHero(detailIndex,true);
    await window.FormaRoutes.navigate('exhibition');
    if(window.FormaRoutes.current==='exhibition')sceneButtons[detailIndex].focus({preventScroll:true});
  }));

  const filmCanvas=$('#filmCanvas'), filmButton=$('#filmPlay'), chapters=all('[data-film]');
  const filmField=window.FormaLight.mount($('#filmField'));
  let filmRenderer, filmIndex=-1, filmSecond=-1, playing=false;
  const filmTransport=createTransport(false,paintFilm,()=>{playing=false;syncFilmButtons();});
  function syncFilmButtons() {
    filmButton.classList.toggle('is-paused',!playing);
    filmButton.setAttribute('aria-label',playing?'暂停展映':filmTransport.time>=duration?'重播展映':'继续展映');
    filmRenderer?.setPaused(!playing || document.hidden);
  }
  function paintFilm(time,mode) {
    const chapter=Math.min(works.length-1,Math.floor(time/chapterLength));
    const phase=(time-chapter*chapterLength)/chapterLength;
    if (chapter!==filmIndex) {
      const cut=filmIndex>=0 && mode!=='scrub';
      filmIndex=chapter;
      const w=works[chapter];
      $('#filmNumber').textContent='展映 / '+indexText(chapter);
      $('#filmTitle').textContent=w.en;$('#filmSub').textContent=w.name+' · '+w.category.split(' / ')[1];
      filmCanvas.setAttribute('aria-label',w.alt);
      cinema.dataset.art=w.key;
      switchScene(filmCanvas,filmRenderer,chapter,cut);
      reveal($('.film-info'));
      setPressed(chapters,chapter);
    }
    filmRenderer.seek(phase);
    filmField.draw(chapter,phase);
    chapters.forEach((b,i)=>{
      b.style.setProperty('--progress',String(Math.max(0,Math.min(1,(time-i*chapterLength)/chapterLength))));
    });
    if(filmSecond!==Math.floor(time)){
      filmSecond=Math.floor(time);
      $('#filmTime').textContent=clockText(time);
    }
  }
  function updateClock() {
    filmTransport.run(cinema.open && playing && !document.hidden);
    syncFilmButtons();
  }
  $('#startScreen').addEventListener('click',event=>{
    openDialog(cinema,event.currentTarget);
    if (!filmRenderer) filmRenderer=mountScene(filmCanvas,0);
    filmRenderer.setMotionAllowed(true);
    playing=true;filmTransport.seek(0);updateClock();
  });
  function toggleFilm() {
    if(filmTransport.time>=duration)filmTransport.seek(0);
    if(!playing)filmRenderer.setMotionAllowed(true);
    playing=!playing;updateClock();
  }
  function seek(i) {filmTransport.seek(Math.max(0,Math.min(works.length-1,i))*chapterLength,'cut');}
  filmButton.addEventListener('click',toggleFilm);
  chapters.forEach((b,i)=>b.addEventListener('click',()=>seek(i)));
  cinema.addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();seek(filmIndex+(e.key==='ArrowRight'?1:-1));}
  });
  cinema.addEventListener('close',()=>{playing=false;updateClock();});
  document.addEventListener('visibilitychange',updateClock);
  reduce.addEventListener('change',()=>{
    if(reduce.matches&&cinema.open){
      playing=false;filmRenderer.setMotionAllowed(false);updateClock();
    }
  });

  window.FormaRooms?.mount();
  window.FormaStudy.mount();
})();
