import { heightAt, trailDistance } from './land.js';

// One metre in the game has the same extent in either axis on the paper chart.
const STEP = 2, LEFT = -66, TOP = -171, COLS = 135, ROWS = 215;
const PAPER = [233, 226, 200], SHOAL = [192, 209, 194], SEA = [184, 203, 194];
const lerp = (a, b, t) => a + (b - a) * t;
const limit = (v, a, b) => Math.max(a, Math.min(b, v));
const plots = new WeakMap();
let survey;

function traceLines(values, level) {
  const path = new Path2D();
  for (let row = 0; row < ROWS - 1; row++) {
    for (let col = 0; col < COLS - 1; col++) {
      const i = row * COLS + col;
      const a = values[i], b = values[i+1], c = values[i+COLS+1], d = values[i+COLS];
      const x = LEFT + col * STEP, z = TOP + row * STEP;
      const cuts = [];
      if ((a>level) !== (b>level)) cuts.push([x+STEP*(level-a)/(b-a),z]);
      if ((b>level) !== (c>level)) cuts.push([x+STEP,z+STEP*(level-b)/(c-b)]);
      if ((c>level) !== (d>level)) cuts.push([x+STEP*(level-d)/(c-d),z+STEP]);
      if ((d>level) !== (a>level)) cuts.push([x,z+STEP*(level-a)/(d-a)]);
      if (cuts.length === 4 && (a+b+c+d)*.25 < level) cuts.push(cuts.shift());
      for (let k = 0; k+1 < cuts.length; k+=2) {
        path.moveTo(...cuts[k]); path.lineTo(...cuts[k+1]);
      }
    }
  }
  return path;
}

function makeSurvey() {
  const count = COLS * ROWS, heights = new Float32Array(count);
  const depth = new Float32Array(count), trails = new Float32Array(count);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = LEFT + c*STEP, z = TOP + r*STEP, i = r*COLS+c;
      heights[i] = heightAt(x,z);
      depth[i] = heights[i] >= 0 ? 0 : 2048;
      trails[i] = heights[i] > 5 ? Math.min(18,trailDistance(x,z)) : 18;
    }
  }
  // Fast shoreline distance for the fine engraved water lines on the seaward side.
  const diagonal = Math.SQRT2 * STEP;
  for (let r=1; r<ROWS; r++) {
    for (let c=1; c<COLS-1; c++) {
      const i=r*COLS+c;
      depth[i]=Math.min(depth[i],depth[i-1]+STEP,depth[i-COLS]+STEP,depth[i-COLS-1]+diagonal,depth[i-COLS+1]+diagonal);
    }
  }
  for (let r=ROWS-2; r>=0; r--) {
    for (let c=COLS-2; c>=1; c--) {
      const i=r*COLS+c;
      depth[i]=Math.min(depth[i],depth[i+1]+STEP,depth[i+COLS]+STEP,depth[i+COLS+1]+diagonal,depth[i+COLS-1]+diagonal);
    }
  }
  const contours=[];
  for(let level=5;level<=50;level+=5) contours.push({level,path:traceLines(heights,level)});
  return {
    heights,depth,trails,contours, coast:traceLines(heights,0),
    water:[5,11,18].map(h=>traceLines(depth,h))
  };
}

function rasterize(ctx, w, h, transform, data, dpr) {
  const image = ctx.createImageData(w, h);
  const bytes = image.data;
  let seed=17331;
  const {scale, ox, oz} = transform;
  for (let y=0; y<h; y++) {
    const wz=(y/dpr-oz)/scale, fz=(wz-TOP)/STEP;
    const rz=Math.floor(fz), v=fz-rz;
    for (let x=0; x<w; x++) {
      const wx=(x/dpr-ox)/scale, fx=(wx-LEFT)/STEP;
      const cx=Math.floor(fx), u=fx-cx;
      const i=rz*COLS+cx, inGrid=rz>=0 && rz<ROWS-1 && cx>=0 && cx<COLS-1;
      const read = nums => lerp(lerp(nums[i],nums[i+1],u),lerp(nums[i+COLS],nums[i+COLS+1],u),v);
      const elevation=inGrid?read(data.heights):-9, offshore=inGrid?read(data.depth):300;
      seed=(Math.imul(1664525,seed)+1013904223)>>>0;
      const grain=((seed>>>24)/255-.5)*5.2 + .52*Math.sin(y*.71+x*.041);
      let r,g,b;
      if (elevation>=0) {
        const high=limit((elevation-5)/44,0,1);
        const gradeX=lerp(data.heights[i+1]-data.heights[i],data.heights[i+COLS+1]-data.heights[i+COLS],v)/STEP;
        const gradeZ=lerp(data.heights[i+COLS]-data.heights[i],data.heights[i+COLS+1]-data.heights[i+1],u)/STEP;
        const shade=limit(-gradeX*.63-gradeZ*.40,-.95,.83)*11;
        const ink=limit(Math.abs(gradeX)*.27,0,.2);
        r=PAPER[0]-high*22+shade-ink*17;
        g=PAPER[1]-high*16+shade-ink*17;
        b=PAPER[2]-high*20+shade-ink*18;
      } else {
        const fall=limit(offshore/46,0,1);
        r=lerp(SHOAL[0],SEA[0],fall); g=lerp(SHOAL[1],SEA[1],fall); b=lerp(SHOAL[2],SEA[2],fall);
      }
      const p=(y*w+x)*4;
      bytes[p]=r+grain; bytes[p+1]=g+grain; bytes[p+2]=b+grain*.9; bytes[p+3]=255;
    }
  }
  ctx.putImageData(image,0,0);
}

function baseMap(w,h,dpr) {
  survey ||= makeSurvey();
  const backing=document.createElement('canvas');
  backing.width=Math.round(w*dpr); backing.height=Math.round(h*dpr);
  const ctx=backing.getContext('2d');
  const scale=Math.min((w-60)/244,(h-32)/400);
  const ox=w*.5-53*scale, oz=h*.5-40*scale;
  const transform={scale,ox,oz};
  rasterize(ctx,backing.width,backing.height,transform,survey,dpr);
  ctx.scale(dpr,dpr);
  ctx.save();
  ctx.translate(ox,oz); ctx.scale(scale,scale);
  const stroke=(path,color,pixels) => {ctx.strokeStyle=color;ctx.lineWidth=pixels/scale;ctx.stroke(path);};
  survey.water.forEach((path,i)=>stroke(path,['#7d9e9580','#87a39968','#91aa9e57'][i],.62));
  for (const contour of survey.contours) {
    stroke(contour.path,contour.level%10===0?'#797e537d':'#90916268',contour.level%10===0?.76:.53);
  }
  stroke(survey.coast,'#506b5bea',1.10);
  // The route is extracted from the same trail-distance function as the ground texture.
  if (!survey.trailEdge) survey.trailEdge=traceLines(survey.trails,1.97);
  stroke(survey.trailEdge,'#9f8054b8',.69);
  const footprints=[[-1.1,-1.1,2.2,2.2],[4.6,-5.9,9.8,5.6],[13.5,-4.9,4.2,3.6],[54.3,35.5,8.3,6.1]];
  ctx.fillStyle='#7a7962';
  footprints.forEach(([x,z,width,height])=>ctx.fillRect(x,z,width,height));
  ctx.restore();

  ctx.save();ctx.translate(ox,oz);
  ctx.lineWidth=.55;ctx.strokeStyle='rgba(96,110,86,.21)';
  ctx.beginPath();
  for(let x=-Math.ceil(ox/scale/50)*50;x<(w-ox)/scale;x+=50){
    ctx.moveTo(x*scale,-oz);ctx.lineTo(x*scale,h-oz);
  }
  for(let z=-Math.ceil(oz/scale/50)*50;z<(h-oz)/scale;z+=50){
    ctx.moveTo(-ox,z*scale);ctx.lineTo(w-ox,z*scale);
  }
  ctx.stroke();ctx.restore();

  if(w>=375 && h>=240) {
    ctx.save();ctx.translate(w*.115,h*.66);ctx.rotate(-.21);
    ctx.fillStyle='#526e668a';ctx.font='italic 12px Georgia, serif';ctx.textAlign='center';
    ctx.fillText('North Atlantic',0,0);ctx.restore();
  }
  const distance=scale*50>34?50:100, length=scale*distance, sx=19, sy=h-17;
  ctx.fillStyle='#4c5d51';ctx.strokeStyle='#4c5d51';ctx.lineWidth=.8;
  ctx.fillRect(sx,sy-3,length/2,3);ctx.strokeRect(sx,sy-3,length,3);
  ctx.font='9px Consolas, monospace';ctx.textBaseline='bottom';ctx.fillText('0',sx,sy-5);
  ctx.textAlign='right';ctx.fillText(distance+' m',sx+length+2,sy-5);
  if(w>270) {
    ctx.fillStyle='#5f7163';ctx.font='9px "Microsoft YaHei",sans-serif';
    ctx.fillText('等高距 5 m',w-14,h-12);
  }
  return {backing,scale,ox,oz,w,h,dpr};
}

function labelPoint(ctx, site, index, selected, visited, w,h,x,y,compact) {
  // Open water west of the lighthouse and tide mark leaves space for two labels.
  const east = site.x>25, south=site.z>53;
  const align = east ? 1 : -1;
  ctx.font='600 '+(compact?10:11)+'px "Microsoft YaHei","PingFang SC",sans-serif';
  const tw=ctx.measureText(site.name).width;
  const textX=limit(x+align*(compact?19:24), align<0?tw+8:8,align>0?w-tw-8:w-8);
  const textY=limit(y+(south?18:east?3:-18),24,h-28);
  const elbowX=x+align*10, edge=textX+align*(-3);
  ctx.strokeStyle=selected?'#8b593d':'#596656';
  ctx.lineWidth=selected?1:.7;
  ctx.beginPath();ctx.moveTo(x+align*5,y);ctx.lineTo(elbowX,textY);ctx.lineTo(edge,textY);ctx.stroke();
  ctx.textAlign=align<0?'right':'left';ctx.textBaseline='middle';
  ctx.lineWidth=3.5;ctx.lineJoin='round';ctx.strokeStyle='#dbe0cde0';
  ctx.strokeText(site.name,textX,textY);
  ctx.fillStyle=selected?'#784b33':'#374a40';ctx.fillText(site.name,textX,textY);
  if(!compact && site.en) {
    ctx.font='italic 10px Georgia,serif';ctx.lineWidth=2.5;
    ctx.strokeText(site.en,textX,textY+13);ctx.fillStyle='#596557';ctx.fillText(site.en,textX,textY+13);
  }
  if(selected) {
    ctx.beginPath();ctx.arc(x,y,10.5,0,Math.PI*2);ctx.lineWidth=1.1;ctx.strokeStyle='#98603d';ctx.stroke();
  }
  ctx.fillStyle=selected?'#8b573b':visited?'#526957':'#f1ebda';
  ctx.strokeStyle=selected?'#f4e7ca':'#526957';ctx.lineWidth=1.25;
  ctx.beginPath();ctx.arc(x,y,7.2,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillStyle=selected||visited?'#fff2d5':'#4c6152';ctx.font='bold 8px Consolas,monospace';
  ctx.fillText(String(index+1).padStart(2,'0'),x,y+.6);
  return {
    x,y, index, left:align<0?textX-tw-2:textX-2, right:align<0?textX+2:textX+tw+2,
    top:textY-7, bottom:textY+(compact?7:17)
  };
}

export function drawChart(canvas,sites,player,selected,visited,onPick) {
  if (!canvas) return;
  const w=Math.round(canvas.clientWidth), h=Math.round(canvas.clientHeight);
  if(w<2 || h<2) return;
  const dpr=limit(window.devicePixelRatio||1,1,2);
  let chart=plots.get(canvas);
  if(!chart || chart.w!==w || chart.h!==h || chart.dpr!==dpr) {
    chart=baseMap(w,h,dpr);plots.set(canvas,chart);
    canvas.width=chart.backing.width;canvas.height=chart.backing.height;
    const scale=canvas.parentElement?.querySelector('.map-scale');
    if (scale) scale.hidden=true;
  }
  const ctx=canvas.getContext('2d');
  ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(chart.backing,0,0);
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const px=x=>chart.ox+x*chart.scale, pz=z=>chart.oz+z*chart.scale;
  const compact=w<420 || h<295;
  const markers=sites.map((site,i)=>labelPoint(ctx,site,i,i===selected,visited?.has(i),w,h,px(site.x),pz(site.z),compact));
  if(player && Number.isFinite(player.x) && Number.isFinite(player.z)) {
    const x=px(player.x),y=pz(player.z);
    ctx.save();ctx.translate(x,y);ctx.rotate(-(player.yaw||0));
    ctx.fillStyle='rgba(27,100,103,.14)';ctx.beginPath();ctx.moveTo(0,0);
    ctx.arc(0,0,14,-Math.PI*.7,-Math.PI*.3);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(0,-6.8);ctx.lineTo(4.5,4.6);ctx.lineTo(0,2.9);ctx.lineTo(-4.5,4.6);
    ctx.closePath();ctx.fillStyle='#286e70';ctx.fill();ctx.lineWidth=1.2;ctx.strokeStyle='#f0f3e2';ctx.stroke();ctx.restore();
  }
  const hit=e=>{
    const rect=canvas.getBoundingClientRect(),x=(e.clientX-rect.left)*w/rect.width,y=(e.clientY-rect.top)*h/rect.height;
    return markers.find(m=>Math.hypot(x-m.x,y-m.y)<13) ||
      markers.find(m=>x>=m.left && x<=m.right && y>=m.top && y<=m.bottom);
  };
  canvas.onclick=e=>{const picked=hit(e);if(picked) onPick?.(picked.index);};
  canvas.onpointermove=e=>{canvas.style.cursor=hit(e)?'pointer':'default';};
}
