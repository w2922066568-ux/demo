(() => {
  'use strict';
  const line = (g, pts, color, width = 1) => {
    g.beginPath(); g.moveTo(...pts[0]); for (const p of pts.slice(1)) g.lineTo(...p);
    g.strokeStyle=color; g.lineWidth=width; g.stroke();
  };
  const poly = (g, pts, fill, stroke='#93998a') => {
    g.beginPath(); pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();
    g.fillStyle=fill;g.fill();g.strokeStyle=stroke;g.lineWidth=.85;g.stroke();
  };
  const ellipse=(g,x,y,rx,ry,stroke,fill)=>{
    g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);
    if(fill){g.fillStyle=fill;g.fill()}g.lineWidth=1;g.strokeStyle=stroke;g.stroke();
  };
  function grid(g,w,h){
    g.fillStyle='#242a25';g.fillRect(0,0,w,h);
    for(let x=0;x<w;x+=12)line(g,[[x,0],[x,h]],x%60?'#30362e':'#3a4036',.6);
    for(let y=0;y<h;y+=12)line(g,[[0,y],[w,y]],y%60?'#30362e':'#3a4036',.6);
  }
  function topography(g){
    const f=(x,y)=>Math.sin(x*.044+y*.023)+.71*Math.sin(y*.053-x*.016)+.72*Math.sin(x*.022-y*.038)+.23*Math.cos(x*.099+y*.045)+.19*Math.sin(x*.054-y*.091);
    const grid=4;
    for(let level=-2.6,n=0;level<=2.7;level+=.145,n++){
      g.beginPath();
      for(let y=-2;y<126;y+=grid)for(let x=-2;x<272;x+=grid){
        const pts=[[x,y],[x+grid,y],[x+grid,y+grid],[x,y+grid]],v=pts.map(p=>f(...p));let cuts=[];
        for(let k=0;k<4;k++){const j=(k+1)%4;if((v[k]>=level)===(v[j]>=level))continue;
          const d=(level-v[k])/(v[j]-v[k]);cuts.push([pts[k][0]+d*(pts[j][0]-pts[k][0]),pts[k][1]+d*(pts[j][1]-pts[k][1])]);}
        if(cuts.length>=2){g.moveTo(...cuts[0]);g.lineTo(...cuts[1])}if(cuts.length===4){g.moveTo(...cuts[2]);g.lineTo(...cuts[3])}
      }
      g.strokeStyle=n%4?'#697064':'#929784';g.lineWidth=n%4?.6:1;g.stroke();
    }
    g.setLineDash([3,3]);line(g,[[68,122],[108,92],[126,91],[156,64],[175,59],[185,47]],'#e7935d',1.2);g.setLineDash([]);
    ellipse(g,185,47,6,6,'#e8955d','#30362d');ellipse(g,185,47,2,2,'#ff9c61','#ff9c61');
    g.fillStyle='#b3b59e';g.font='5px monospace';g.fillText('07-A',196,48);
  }
  function carbine(g){
    g.save();g.translate(8,4);g.rotate(-.075);let dark='#343a32',body='#51574a',edge='#a5ab95';
    poly(g,[[12,63],[34,53],[67,52],[72,66],[46,70],[23,83],[14,81]],dark);
    poly(g,[[22,65],[40,58],[58,57],[53,63],[28,73]],'#272e28');line(g,[[15,64],[18,77]],edge,2);
    poly(g,[[64,47],[139,47],[153,52],[151,64],[123,68],[85,68],[81,74],[66,69]],body);
    poly(g,[[70,65],[89,65],[87,72],[82,75],[77,90],[65,86],[70,74],[64,71]],dark);
    poly(g,[[99,66],[116,66],[120,82],[117,91],[105,92],[101,82]],body);
    for(let i=0;i<4;i++)line(g,[[103+i*3,70],[108+i*3,87]],'#333a30',1);
    line(g,[[84,75],[92,77],[101,74],[99,68]],edge);line(g,[[91,67],[92,72],[95,74]],edge);
    poly(g,[[137,48],[172,44],[180,47],[204,46],[214,50],[211,61],[150,65],[142,61]],body);
    poly(g,[[154,51],[205,49],[202,58],[153,61]],'#292f28');
    for(let i=0;i<7;i++)poly(g,[[156+i*6,51],[160+i*6,51],[158+i*6,57],[154+i*6,57]],'#67705e','#737e69');
    poly(g,[[211,50],[236,49],[237,55],[211,58]],'#383e35');
    poly(g,[[230,47],[250,46],[252,48],[252,56],[231,57]],dark);
    for(let i=0;i<4;i++)line(g,[[234+i*4,49],[234+i*4,53]],'#a3a78e');
    poly(g,[[67,46],[76,42],[146,42],[151,47]],dark);
    for(let x=80;x<146;x+=4)line(g,[[x,42],[x,45]],'#848a77');
    poly(g,[[103,42],[103,33],[108,30],[121,30],[125,33],[124,41]],'#41483b');
    poly(g,[[109,39],[109,34],[118,33],[121,38]],'#29342f','#adb6a0');
    poly(g,[[74,50],[110,50],[103,54],[73,55]],'#32392f');
    line(g,[[83,59],[116,58]],'#c58050',2);line(g,[[118,53],[133,53]],'#bdc2a8');
    for(let x of [70,98,123,142])ellipse(g,x,62,1.2,1.2,edge);
    g.restore();
  }
  function drone(g){
    g.save();g.translate(146,62);const frame='#5e6557',edge='#a6ad97';
    for(let sign of [-1,1]){
      g.save();g.scale(sign,1);poly(g,[[12,-12],[39,-21],[60,-15],[44,-5],[23,5]],frame);
      ellipse(g,62,-9,39,16,edge,'#373e33');ellipse(g,62,-10,33,12,'#939d86','#262e27');
      for(let i=0;i<9;i++){let a=i*2*Math.PI/9;poly(g,[[62,-10],[62+30*Math.cos(a),-10+10*Math.sin(a)],[62+25*Math.cos(a+.4),-10+8*Math.sin(a+.4)]],'#515a4a','#839077')}
      ellipse(g,62,-10,6,3,edge,'#75816b');poly(g,[[35,1],[49,6],[79,7],[87,3],[80,10],[53,12],[44,11]],'#353b32');
      poly(g,[[24,6],[36,5],[39,18],[44,25],[41,28],[32,21]],'#525a4a');line(g,[[35,19],[40,28],[48,30]],edge,1.4);
      line(g,[[16,-17],[25,-34],[29,-35]],edge,1.3);ellipse(g,29,-35,1.2,1.2,'#c98957');g.restore();
    }
    poly(g,[[-26,-16],[-14,-24],[12,-24],[26,-16],[29,-2],[17,10],[10,16],[-11,16],[-25,7],[-29,-4]],frame);
    poly(g,[[-23,-13],[-12,-19],[10,-19],[21,-13],[15,-6],[-14,-6]],'#333a32');
    poly(g,[[-23,-4],[-15,-9],[15,-9],[23,-4],[17,4],[9,8],[-12,8]],'#242b25');
    ellipse(g,0,0,7.5,7.5,'#c98155','#44362d');ellipse(g,0,0,4,4,'#e78e54','#e0844a');
    for(let x=-12;x<13;x+=4)line(g,[[x,11],[x+1,14]],'#a2aa93');
    g.restore();
  }
  const painters={theater:topography,weapon:carbine,threat:drone};
  function draw(c){
    const rect=c.getBoundingClientRect();if(!rect.width||!rect.height)return;
    const ratio=Math.min(devicePixelRatio||1,2),w=Math.round(rect.width*ratio),h=Math.round(rect.height*ratio);
    c.width=w;c.height=h;const g=c.getContext('2d');grid(g,w,h);
    const kind=c.dataset.diagram, scale=kind==='theater'?Math.max(w/270,h/120):Math.min(w/264,h/105);
    g.translate((w-264*scale)/2,(h-120*scale)/2);g.scale(scale,scale);painters[kind]?.(g);
  }
  const observer=new ResizeObserver(entries=>entries.forEach(e=>draw(e.target)));
  window.CinderIntel={bind(root=document){root.querySelectorAll('canvas[data-diagram]').forEach(c=>{observer.observe(c);draw(c)})},release(root){root.querySelectorAll('canvas[data-diagram]').forEach(c=>observer.unobserve(c))}};
  window.CinderIntel.bind();
})();
