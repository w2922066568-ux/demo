(() => {
  'use strict';
  const rooms = [
    { id:'exhibition', name:'展厅', cover:'assets/sculpture-bloom.webp' },
    { id:'works', name:'作品典藏', cover:'assets/bloom.webp' },
    { id:'notes', name:'设计手记', cover:'assets/sculpture-orbit.webp' },
    { id:'about', name:'关于展览', cover:'assets/strata.webp' }
  ];
  const ids = rooms.map(room=>room.id);
  const viewport = document.getElementById('sceneViewport');
  const sections = rooms.map(room=>document.getElementById(room.id));
  const links = [...document.querySelectorAll('.desktop-nav a,.mobile-nav a,.map-grid a')];
  const map = document.getElementById('sceneMap');
  const openMap = document.getElementById('openMap');
  const nextLink = document.getElementById('nextRoom');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const remembered = new Map();
  const asset = name => window.formaAsset ? window.formaAsset(name) : name;
  const readLocation = () => ids.includes(location.hash.slice(1)) ? location.hash.slice(1) : ids[0];
  const emit = (name,detail) => window.dispatchEvent(new CustomEvent('forma:'+name,{detail}));
  let current = readLocation();
  let desired = current;
  let request = null;
  let work = Promise.resolve();
  let sequence = Number(history.state?.formaPosition) || 0;
  let mapLoaded = false;

  const nav = document.querySelector('.desktop-nav');
  const sled = document.createElement('i');
  sled.className='nav-sled';
  sled.setAttribute('aria-hidden','true');
  nav.append(sled);
  function positionIndicator() {
    const active=nav.querySelector('[aria-current]');
    if(!active || !nav.clientWidth)return;
    const center=active.offsetLeft+(active.offsetWidth-sled.offsetWidth)/2;
    sled.style.transform='translateX('+center+'px)';
  }
  new ResizeObserver(positionIndicator).observe(nav);

  function paintShell(id) {
    const index=ids.indexOf(id);
    const next=rooms[(index+1)%rooms.length];
    links.forEach(link=>{
      if(link.hash==='#'+id)link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    });
    nextLink.href='#'+next.id;
    nextLink.setAttribute('aria-label','下一幕，'+next.name);
    document.getElementById('nextTitle').textContent=next.name;
    document.getElementById('nextImage').src=asset(next.cover);
    document.getElementById('dockNumber').textContent=String(index+1).padStart(2,'0');
    document.getElementById('dockTitle').textContent=rooms[index].name;
    document.documentElement.dataset.scene=id;
    document.body.dataset.route=id;
    document.title=rooms[index].name+' · Forma Index 形态研究所';
    positionIndicator();
  }
  function display(id,restore=false) {
    current=id;
    for(const section of sections) {
      const active=section.id===id;
      section.hidden=!active;
      section.inert=!active;
    }
    paintShell(id);
    viewport.scrollTop=restore?(remembered.get(id)||0):0;
    emit('route',{id});
  }
  async function run() {
    while(request) {
      const job=request;
      request=null;
      if(job.id===current)continue;
      const from=current;
      remembered.set(from,viewport.scrollTop);
      emit('before-route',{from,to:job.id});
      let committed=false;
      const commit=()=>{
        if(committed)return;
        committed=true;
        display(job.id,job.restore);
      };
      document.documentElement.dataset.switching='true';
      try {
        if(window.FormaCut&&!reduce.matches) {
          await window.FormaCut.play({from,to:job.id,direction:job.direction,commit});
        }
      } catch(error) {
        console.warn('场景已切换，当前浏览器跳过此段转场。',error);
      } finally {
        commit();
        delete document.documentElement.dataset.switching;
      }
      if(!request && !document.querySelector('dialog[open]')) {
        document.getElementById(job.id).querySelector('[data-room-heading]')?.focus({preventScroll:true});
      }
    }
  }
  function navigate(id,{historyMove=false,direction,restore=false}={}) {
    if(!ids.includes(id))return Promise.resolve();
    if(map.open)map.close();
    if(id===desired)return work;
    const old=desired;
    desired=id;
    if(!historyMove){
      sequence++;
      try {history.pushState({...history.state,formaPosition:sequence},'','#'+id);}
      catch {location.hash=id;}
    }
    request={id,direction:direction??(ids.indexOf(id)>=ids.indexOf(old)?1:-1),restore};
    work=work.then(run,run);
    return work;
  }
  function fromHistory() {
    const next=Number(history.state?.formaPosition);
    const direction=Number.isFinite(next)?Math.sign(next-sequence):undefined;
    if(Number.isFinite(next))sequence=next;
    navigate(readLocation(),{historyMove:true,direction:direction||undefined,restore:true});
  }
  try {
    history.scrollRestoration='manual';
    history.replaceState({...history.state,formaPosition:sequence},'');
  } catch {}
  addEventListener('popstate',fromHistory);
  addEventListener('hashchange',fromHistory);

  function openOverview(){
    if(map.open)return;
    if(!mapLoaded){
      map.querySelectorAll('[data-map-image]').forEach(img=>{img.src=asset(img.dataset.mapImage);});
      mapLoaded=true;
    }
    map.showModal();
    emit('map',{open:true});
    map.querySelector('[aria-current]')?.focus({preventScroll:true});
    if(!reduce.matches){
      [...map.querySelectorAll('.map-card')].forEach((card,i)=>{
        card.animate([{opacity:0,transform:'perspective(700px) rotateY(-14deg) translateY(22px)'},{opacity:1,transform:'none'}],
          {duration:430,delay:i*42,fill:'backwards',easing:'cubic-bezier(.20,.8,.16,1)'});
      });
    }
  }
  openMap.addEventListener('click',openOverview);
  document.getElementById('closeMap').addEventListener('click',()=>map.close());
  map.addEventListener('click',event=>{if(event.target===map)map.close();});
  map.addEventListener('close',()=>emit('map',{open:false}));

  document.addEventListener('click',event=>{
    if(event.defaultPrevented || event.button!==0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)return;
    const link=event.target.closest?.('a[href^="#"]');
    if(!link || link.target || !ids.includes(link.hash.slice(1)))return;
    event.preventDefault();
    navigate(link.hash.slice(1),{direction:link===nextLink?1:undefined});
  });
  function adjacent(direction) {
    const next=(ids.indexOf(desired)+direction+rooms.length)%rooms.length;
    navigate(ids[next],{direction});
  }
  function inputOwnsGesture(target) {
    return !!target.closest?.('input,select,textarea,[contenteditable="true"],[role="slider"],[role="tablist"]');
  }
  document.addEventListener('keydown',event=>{
    if(event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey ||
       inputOwnsGesture(event.target) || document.querySelector('dialog[open]'))return;
    if(event.key==='ArrowRight' || event.key==='ArrowLeft') {
      event.preventDefault();
      if(!event.repeat)adjacent(event.key==='ArrowRight'?1:-1);
    }
  });
  let touch=null;
  viewport.addEventListener('touchstart',event=>{
    touch=null;
    if(event.touches.length!==1 || inputOwnsGesture(event.target) || document.querySelector('dialog[open]'))return;
    const finger=event.touches[0];
    if(finger.clientX<22 || innerWidth-finger.clientX<22)return;
    touch={x:finger.clientX,y:finger.clientY,time:performance.now(),route:current};
  },{passive:true});
  viewport.addEventListener('touchend',event=>{
    if(!touch)return;
    const start=touch;
    touch=null;
    if(event.touches.length || current!==start.route || performance.now()-start.time>850)return;
    const finger=event.changedTouches[0];
    const dx=finger.clientX-start.x,dy=finger.clientY-start.y;
    if(Math.abs(dx)>64 && Math.abs(dx)>Math.abs(dy)*1.65)adjacent(dx<0?1:-1);
  },{passive:true});
  viewport.addEventListener('touchcancel',()=>{touch=null;},{passive:true});
  sections.forEach(section=>{
    const heading=section.querySelector('h1,h2');
    heading.tabIndex=-1;
    heading.dataset.roomHeading='';
  });
  document.documentElement.classList.add('scenes-on');
  display(current);
  window.FormaRoutes={navigate,get current(){return current;}};
})();
