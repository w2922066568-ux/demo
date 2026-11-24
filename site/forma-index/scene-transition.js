(() => {
  'use strict';

  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const outputs = ['bloom', 'orbit', 'strata'];
  const satin = {exhibition: 0, works: 0, notes: 1, about: 2};
  const release = 'cubic-bezier(.19,.77,.18,1)';
  const accelerate = 'cubic-bezier(.48,.01,.74,.48)';
  const mix = (a, b, t) => a + (b - a) * t;

  function create(tag, styles) {
    const node = document.createElement(tag);
    if (styles) Object.assign(node.style, styles);
    return node;
  }

  function visibleBox(rect) {
    return rect && rect.width > 3 && rect.height > 3 && rect.bottom > 4 &&
      rect.right > 4 && rect.top < innerHeight - 4 && rect.left < innerWidth - 4;
  }

  function heroBox(canvas) {
    const rect = canvas.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height);
    return new DOMRect(rect.x + (rect.width - size) / 2, rect.y + (rect.height - size) / 2, size, size);
  }

  function captureHero(canvas) {
    if (!canvas.width || !canvas.height || canvas.dataset.renderer === 'poster') return null;
    const side = Math.min(canvas.width, canvas.height);
    const copy = create('canvas', {position:'absolute', inset:'0', width:'100%', height:'100%'});
    copy.width = copy.height = Math.min(1100, side);
    const context = copy.getContext('2d');
    if (!context) return null;
    context.drawImage(canvas, (canvas.width-side)/2, (canvas.height-side)/2, side, side,
      0, 0, copy.width, copy.height);
    return copy;
  }

  function plateFor(index) {
    return document.querySelector('[data-work="' + index + '"] .card-image');
  }

  // All temporary changes to live nodes belong to this one transition.
  // In particular keep existing inline opacity/transform work from a dialog
  // or another component intact after the route has settled.
  function session(commit) {
    const animations = [], restores = [];
    const shield = create('div', {
      position:'fixed', inset:'0', zIndex:'80', pointerEvents:'none',
      overflow:'hidden', isolation:'isolate', contain:'strict'
    });
    shield.className = 'scene-cut';
    shield.setAttribute('aria-hidden','true');
    shield.inert = true;
    document.body.append(shield);
    let changed = false, finished = false, interrupt;
    const stop = new Promise(resolve => { interrupt = resolve; });
    const cancelled = () => interrupt();
    const visibility = () => { if (document.hidden) cancelled(); };
    const reduceChanged = () => { if (preference.matches) cancelled(); };
    document.addEventListener('visibilitychange',visibility);
    window.addEventListener('pagehide',cancelled);
    window.addEventListener('resize',cancelled);
    preference.addEventListener('change',reduceChanged);
    return {
      shield,
      change() {
        if (changed) return;
        changed = true;
        commit();
      },
      style(node, property, value) {
        const previous = node.style.getPropertyValue(property);
        const priority = node.style.getPropertyPriority(property);
        node.style.setProperty(property,value,'important');
        restores.push(() => {
          if (previous) node.style.setProperty(property,previous,priority);
          else node.style.removeProperty(property);
        });
      },
      animate(node, frames, timing) {
        const animation = node.animate(frames,timing);
        animations.push(animation);
        return animation.finished.catch(() => {});
      },
      until(promise) { return Promise.race([promise,stop]); },
      dispose() {
        if (finished) return;
        finished = true;
        document.removeEventListener('visibilitychange',visibility);
        window.removeEventListener('pagehide',cancelled);
        window.removeEventListener('resize',cancelled);
        preference.removeEventListener('change',reduceChanged);
        for (const animation of animations) animation.cancel();
        for (let i=restores.length-1; i>=0; i--) restores[i]();
        shield.remove();
      }
    };
  }

  function enterElements(scene, run, direction, exclude) {
    const nodes = scene.querySelectorAll('.hero-copy,.section-head,.work-card,.note-copy,.study-panel,.about-grid');
    for (const [i,node] of [...nodes].entries()) {
      if (exclude && (node === exclude || node.contains(exclude))) continue;
      run.animate(node, [
        {opacity:0, transform:'translate3d('+ (32*direction) +'px,16px,0)'},
        {opacity:1, transform:'translate3d(0,0,0)'}
      ], {duration:530, delay:Math.min(i,3)*45, easing:release, fill:'backwards'});
    }
  }

  // These overlapping pleats all sample one continuous macro photograph.
  // The hinge light moves independently of the printed surface, so the
  // material flashes along a crease as each leaf turns toward the viewer.
  async function foldedCut(from, to, direction, run) {
    const width = innerWidth, height = innerHeight;
    const count = width > 800 ? 13 : 9;
    const skew = direction * (width > 800 ? -10 : -6);
    const extra = height * Math.abs(Math.tan(skew * Math.PI/180)) + 8;
    const sheetWidth = width + extra;
    const panelWidth = sheetWidth / count;
    const cover = plateFor(satin[to.id])?.querySelector('img');
    const sheet = create('div',{
      position:'absolute', left:-extra/2+'px', top:'-2px',
      width:sheetWidth+'px', height:height+4+'px', transform:'skewX('+skew+'deg)',
      perspective:Math.max(1050,width*1.5)+'px', transformStyle:'preserve-3d'
    });
    run.shield.append(sheet);
    const image = cover?.currentSrc || cover?.src;
    if (image) sheet.style.setProperty('--fold-image','url("'+image+'")');
    const photoRatio = cover?.naturalWidth && cover?.naturalHeight ? cover.naturalWidth/cover.naturalHeight : 1.5;
    const photoWidth = Math.max(sheetWidth,(height+4)*photoRatio)*1.075;
    const photoHeight = photoWidth/photoRatio;
    const f = direction > 0 ? 1 : -1;
    const total = 1010;
    const strips = [];
    for (let i=0; i<count; i++) {
      const order = (f>0 ? count-1-i : i)/(count-1);
      const delay = Math.round(148*order);
      const x = panelWidth*i;
      const leaf = create('div',{
        position:'absolute',top:'0',bottom:'0',left:x+'px',width:(panelWidth+1.7)+'px',
        backfaceVisibility:'hidden',overflow:'hidden',transformOrigin: f>0?'right center':'left center',
        backgroundColor:'#28202b', willChange:'transform',
        backgroundImage: image ? 'linear-gradient(90deg,rgba(20,10,27,.12),transparent 21%,rgba(255,219,217,.08) 65%,rgba(30,12,27,.23)),var(--fold-image)' : '',
        backgroundSize:'100% 100%, '+photoWidth+'px '+photoHeight+'px',
        backgroundPosition:'0 0, '+((sheetWidth-photoWidth)/2-x)+'px center'
      });
      const sheen = create('div',{
        position:'absolute',inset:'-2px',mixBlendMode:'screen',pointerEvents:'none',
        background:'linear-gradient(90deg, transparent 4%,rgba(217,183,249,.18) 37%,rgba(255,230,216,.66) 69%,rgba(248,202,167,.16) 88%,transparent)'
      });
      leaf.append(sheen);
      sheet.append(leaf);
      const duration = total-delay-Math.round((1-order)*120);
      const closed = 'perspective(1050px) translate3d('+ (f*panelWidth*.86)+'px,2.5%,8px) rotateY('+(-f*88.8)+'deg) scaleY(1.13)';
      const face = 'perspective(1050px) translate3d(0,0,0) rotateY(0deg) scaleY(1.002)';
      const opened = 'perspective(1050px) translate3d('+(-f*panelWidth*.87)+'px,-3%,54px) rotateY('+(f*88.8)+'deg) scaleY(1.15)';
      strips.push(run.animate(leaf, [
        {transform:closed,opacity:0,offset:0,easing:'cubic-bezier(.25,.72,.21,1)'},
        {opacity:1,offset:.09},
        {transform:face,opacity:1,offset:.405},
        {transform:face,opacity:1,offset:.55,easing:'cubic-bezier(.51,0,.7,.42)'},
        {opacity:1,offset:.91},
        {transform:opened,opacity:0,offset:1}
      ],{duration,delay,fill:'both',easing:'linear'}));
      run.animate(sheen, [
        {opacity:1,transform:'translateX(-18%)'},
        {opacity:.04,offset:.43,transform:'translateX(25%)'},
        {opacity:.1,offset:.58},
        {opacity:.8,transform:'translateX(60%)'}
      ],{duration,delay,fill:'both'});
    }
    const coverMoment = run.animate(from,[
      {transform:'translate3d(0,0,0) scale(1)',opacity:1},
      {transform:'translate3d('+(-2.8*f)+'vw,0,0) scale(.96)',opacity:.55}
    ],{duration:485,fill:'forwards',easing:accelerate});
    await run.until(coverMoment);
    run.change();
    enterElements(to,run,f);
    await run.until(Promise.all(strips));
  }

  function carryFlight(from, to, direction, run) {
    const hero = document.querySelector('#heroCanvas');
    const stage = document.getElementById('exhibition');
    const index = Math.max(0,outputs.indexOf(stage.dataset.art));
    const plate = plateFor(index);
    const cover = plate?.querySelector('img');
    if (!hero || !plate || !cover?.complete || !cover.naturalWidth) return null;
    const forward = from.id === 'exhibition';
    const source = forward ? hero : plate;
    const target = forward ? plate : hero;
    const start = forward ? heroBox(hero) : plate.getBoundingClientRect();
    if (!visibleBox(start)) return null;

    const lifted = create('div',{
      position:'absolute',left:'0',top:'0',overflow:'hidden',willChange:'transform',
      transformOrigin:'0 0',isolation:'isolate'
    });
    // Hidden-route canvases retain their last presented bitmap. At a direct
    // gallery entry the poster supplies the first pose until a frame exists.
    const layer = captureHero(hero) || create('img', {
      position:'absolute',inset:'0',width:'100%',height:'100%',objectFit:'contain'
    });
    if (layer instanceof HTMLImageElement) {
      const path = 'assets/sculpture-'+outputs[index]+'.webp';
      layer.src = window.formaAsset ? window.formaAsset(path) : path;
    }
    const image = create('img',{
      position:'absolute',inset:'0',width:'100%',height:'100%',objectFit:'cover'
    });
    image.src = cover.currentSrc || cover.src;
    lifted.append(image,layer);
    run.shield.append(lifted);

    // Hold the old page in viewport coordinates. The router can now establish
    // the destination's real, final layout without duplicating IDs or canvases.
    const box = from.getBoundingClientRect();
    const display = getComputedStyle(from).display;
    for (const [key,value] of Object.entries({
      position:'fixed',left:box.left+'px',top:box.top+'px',width:box.width+'px',
      height:box.height+'px','min-height':'0','max-height':'none',margin:'0',display,
      'z-index':'40','pointer-events':'none'
    })) run.style(from,key,value);
    const bg = getComputedStyle(from).backgroundColor;
    if (bg==='transparent' || bg==='rgba(0, 0, 0, 0)') run.style(from,'background-color',getComputedStyle(document.body).backgroundColor);
    run.style(source,'visibility','hidden');
    run.change();
    let end = forward ? plate.getBoundingClientRect() : heroBox(hero);
    const landingVisible = visibleBox(end);
    // Keep the trajectory bounded when history restores a scrolled room.
    // The specimen leaves through the edge nearest its card, preserving
    // the visitor's scroll position even on a single-column gallery.
    if (!landingVisible) {
      const w=Math.max(84,Math.min(innerWidth*.52,end.width || start.width));
      const h=w*.7;
      const x=Math.max(0,Math.min(innerWidth-w,end.left+end.width/2-w/2));
      const y=end.bottom<=0 ? -h*.95 : innerHeight-h*.05;
      end=new DOMRect(x,y,w,h);
    }
    const duration = 930;
    if (forward) {
      run.animate(plate,[
        {opacity:.1,transform:'scale(.95)'},
        {opacity:.14,offset:.42},
        {opacity:.85,offset:.78},
        {opacity:1,transform:'none'}
      ],{duration,easing:'linear',fill:'both'});
    } else {
      run.style(target,'visibility','hidden');
    }
    run.animate(from,[
      {opacity:1,transform:'none'},
      {opacity:.76,offset:.22},
      {opacity:0,transform:'translate3d('+(-3.4*direction)+'vw,0,0) scale(.97)'}
    ],{duration:540,easing:release,fill:'forwards'});
    enterElements(to,run,direction,target);
    lifted.style.width = end.width+'px';
    lifted.style.height = end.height+'px';
    const bend = Math.min(52,innerHeight*.062);
    const path = [];
    for (let i=0; i<=36; i++) {
      const t = i/36;
      // Quintic ease-in-out with a shallow lift, like setting a specimen
      // down onto its photographic plate rather than resizing a rectangle.
      const p = t*t*t*(t*(6*t-15)+10);
      const arc = Math.sin(Math.PI*p);
      const w = mix(start.width,end.width,p)*(1+.046*arc);
      const h = mix(start.height,end.height,p)*(1+.046*arc);
      const x = mix(start.left+start.width/2,end.left+end.width/2,p)-w/2;
      const y = mix(start.top+start.height/2,end.top+end.height/2,p)-h/2-bend*arc;
      path.push({offset:t,transform:'translate3d('+x+'px,'+y+'px,0) scale('+w/end.width+','+h/end.height+')',
        borderRadius:mix(forward?0:9,forward?9:0,p)+'px'});
    }
    run.animate(image,[
      {opacity:forward?0:1,offset:0},
      {opacity:forward?0:1,offset:forward?.40:.10},
      {opacity:forward?1:0,offset:forward?.86:.69},
      {opacity:forward?1:0,offset:1}
    ],{duration,fill:'both',easing:'linear'});
    run.animate(layer,[
      {opacity:forward?1:0,transform:'scale(1)',offset:0},
      {opacity:forward?1:.2,offset:forward?.36:.21},
      {opacity:forward?0:1,transform:'scale('+(forward?1.17:1)+')',offset:.84},
      {opacity:forward?0:1,offset:1}
    ],{duration,fill:'both',easing:'linear'});
    return run.animate(lifted,path,{duration,easing:'linear',fill:'both'});
  }

  async function play({from, to, direction, commit}) {
    const source = document.getElementById(from);
    const destination = document.getElementById(to);
    if (preference.matches || document.hidden || !source || !destination ||
        source===destination || !Element.prototype.animate) {
      commit();
      return;
    }
    const run = session(commit);
    const sign = direction===-1 || direction==='back' || direction==='backward' ? -1 : 1;
    try {
      const shared = (from==='exhibition' && to==='works') || (from==='works' && to==='exhibition');
      const flight = shared && carryFlight(source,destination,sign,run);
      if (flight) await run.until(flight);
      else await foldedCut(source,destination,sign,run);
    } finally {
      try { run.change(); } finally { run.dispose(); }
    }
  }

  window.FormaCut = {play};
})();
