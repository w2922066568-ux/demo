(() => {
  'use strict';
  const turn = Math.PI * 2;
  const palettes = [
    ['252,146,132', '246,91,151', '255,214,173'],
    ['186,159,255', '118,144,255', '228,219,255'],
    ['239,157,79', '226,103,56', '255,220,154']
  ];

  // Each exposure is calculated from time alone, so scrubbing in either
  // direction reproduces the same curve, glints and afterimage.
  function mount(canvas) {
    const ctx = canvas.getContext('2d', {alpha:true});
    if (!ctx) return { draw() {} };
    let width = 0, height = 0, pixelRatio = 1;
    let lastScene = -1, lastPhase = -1;
    function resize() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      if (!width || !height) return;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5, 1500 / Math.max(width,height));
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      if (lastScene >= 0) draw(lastScene,lastPhase,true);
    }
    function draw(scene,phase,force=false) {
      if (!width || !height) return;
      if (!force && lastScene === scene && Math.abs(phase-lastPhase) < 1/280) return;
      lastScene = scene;
      lastPhase = phase;
      const [glow,edge,tip] = palettes[scene];
      const t = phase * turn;
      const radius = Math.min(width*.455,height*.76);
      const cx = width*.5, cy = height*.49;
      const tilt = [-.26,-.42,.16][scene] + .12*Math.sin(t);
      const ct = Math.cos(tilt), st = Math.sin(tilt);
      ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);
      ctx.clearRect(0,0,width,height);
      const light = ctx.createRadialGradient(cx+radius*.20*Math.cos(t),cy+radius*.10*Math.sin(t),0,cx,cy,radius*1.1);
      light.addColorStop(0,'rgba('+glow+',.145)');
      light.addColorStop(.56,'rgba('+edge+',.055)');
      light.addColorStop(1,'rgba('+edge+',0)');
      ctx.fillStyle=light;
      ctx.fillRect(0,0,width,height);
      ctx.translate(cx,cy);

      function point(a,lane,side) {
        const ripple = Math.sin(3*a - t + side);
        const spread = (.022 + .021*Math.sin(a*2+t)) * lane;
        const x = Math.cos(a) * (1 + spread*.5);
        const y = Math.sin(a) * (.29+spread+.055*Math.cos(t+side)) + .069*ripple + .025*lane*Math.sin(a*2-t);
        return [(x*ct-y*st)*radius,(x*st+y*ct)*radius];
      }
      // Two counterposed fans skim the object on different sides. The opaque
      // sculpture masks the inner arcs and leaves their tips on the silhouette.
      for (let side=0; side<2; side++) {
        const head = t + side*Math.PI + .45;
        const span = 2.26 + .42*Math.sin(t+side);
        for (let strand=0; strand<10; strand++) {
          const lane = (strand-4.5)/3;
          ctx.beginPath();
          for (let sample=0; sample<=48; sample++) {
            const u = sample/48;
            const a = head - (1-u)*span + lane*.095*Math.sin(Math.PI*u);
            const p = point(a,lane,side);
            if (!sample) ctx.moveTo(...p); else ctx.lineTo(...p);
          }
          ctx.lineWidth = strand===4 ? 1.22 : .69;
          const start = point(head-span,lane,side), end = point(head,lane,side);
          const ink = ctx.createLinearGradient(start[0],start[1],end[0],end[1]);
          ink.addColorStop(0,'rgba('+edge+',0)');
          ink.addColorStop(.56,'rgba('+edge+','+(strand===4?.34:.17)+')');
          ink.addColorStop(1,'rgba('+glow+','+(strand===4?.72:.28)+')');
          ctx.strokeStyle = ink;
          ctx.stroke();
        }
        for (let n=0; n<13; n++) {
          const a = head-n*.11;
          const p = point(a,Math.sin(n*1.23)*1.15,side);
          const power = 1-n/14;
          ctx.fillStyle='rgba('+tip+','+(.20+power*.63)+')';
          ctx.beginPath();
          ctx.arc(p[0],p[1],n===0?2.35:.5+power*.62,0,turn);
          ctx.fill();
          if(n===0){
            const halo=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],11);
            halo.addColorStop(0,'rgba('+glow+',.7)');halo.addColorStop(1,'rgba('+glow+',0)');
            ctx.fillStyle=halo;ctx.fillRect(p[0]-11,p[1]-11,22,22);
          }
        }
      }
    }
    new ResizeObserver(resize).observe(canvas);
    resize();
    return {draw};
  }
  window.FormaLight = { mount };
})();
