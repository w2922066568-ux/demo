import * as THREE from 'three';
import {createLand,heightAt,trailDistance,reefSeabedAt} from './land.js';
import {createArchitecture} from './architecture.js';
import {createNature} from './nature.js';
import {createOcean} from './ocean.js';
import {createAtmosphere} from './atmosphere.js';

export const sites=[
  {x:0,z:4.6,name:'北岬灯塔',en:'North Cape Light',serial:'01',hint:'沿主路向北，在灯塔南门的铭牌前调查。',entry:'门额上刻着 1897。灯室的透镜依然缓缓旋转，每一圈都把光送回海面。'},
  {x:59,z:42.5,name:'海崖信号站',en:'Signal Station',serial:'02',hint:'从巡护道中段向东转，寻找天线下的气象仪。',entry:'风速杯转得很快。仪表柜内的铅笔记录停在西北风十二节，和今天的风向一致。'},
  {x:-15,z:69.8,name:'西岸旧航标',en:'West Sea Mark',serial:'03',hint:'沿西侧岔路走到岩岸，检查旧航标底部的铜牌。',entry:'盐蚀的铜牌上仍能读出 1894。灯塔落成之前，水手靠这座日标辨认西岸的暗礁。'}
];
const clamp=THREE.MathUtils.clamp;
export async function createGame(container,settings,saved,api){
  const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance',alpha:false});
  renderer.setClearColor(0xb6c8c7);
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate=false;
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=.98;
  container.replaceChildren(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(58,1,.09,12000);
  camera.rotation.order='YXZ';
  const player={x:32,z:96,y:0,yaw:.59,pitch:-.095,balcony:false};
  if(saved && Number.isFinite(saved.x) && Number.isFinite(saved.z) && Math.abs(saved.x)<450 && Math.abs(saved.z)<440){
    Object.assign(player,{x:saved.x,z:saved.z,yaw:Number.isFinite(saved.yaw)?saved.yaw:.59,pitch:clamp(saved.pitch||0,-1.25,1.25),balcony:saved.balcony===true});
  }
  let flying=false,scoped=false,active=false,grounded=true,velocityY=0,stepTime=0,moveX=0,moveZ=0,lastHud=0,t=0;
  let last=performance.now(),animation=0,drag=null,pendingCapture=false;
  const keys=new Set(),stick={x:0,y:0},photoPosition=new THREE.Vector3(),projection=new THREE.Vector3();
  const floor=(x,z)=>player.balcony?heightAt(0,0)+25.56:Math.max(-.75,heightAt(x,z));
  player.y=floor(player.x,player.z)+1.7;
  const loading=new Promise(resolve=>{THREE.DefaultLoadingManager.onLoad=resolve;});
  createLand(scene);
  const buildings=createArchitecture(scene,heightAt);
  const water=createOcean(scene,reefSeabedAt),atmosphere=createAtmosphere(scene,renderer,water);
  const nature=createNature(scene,heightAt,{position:player,quality:settings.quality==='ultra'?'high':'medium'});
  function resize(){
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,settings.quality==='ultra'?2:1.25));
    renderer.setSize(innerWidth,innerHeight); camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
  }
  function setQuality(q){settings.quality=q;nature.setQuality(q==='ultra'?'high':'medium');resize();renderer.shadowMap.needsUpdate=true;}
  setQuality(settings.quality);atmosphere.setMood(settings.mood);
  window.addEventListener('resize',resize);
  function valid(x,z){
    if(player.balcony){const r=Math.hypot(x,z);return r>=2.34 && r<=2.82;}
    if(x < -180 || x>302 || z < -270 || z>330) return false;
    const h=heightAt(x,z),dist=Math.hypot(x-player.x,z-player.z);
    if(h>Math.max(player.y-1.7,heightAt(player.x,player.z))+Math.max(.14,1.4*dist))return false;
    for(const c of buildings.colliders){
      if(c.r!==undefined){if(Math.hypot(x-c.x,z-c.z)<c.r+.23)return false;}
      else if(Math.abs(x-c.x)<c.w*.5+.24 && Math.abs(z-c.z)<c.d*.5+.24)return false;
    }
    return true;
  }
  function jump(){
    if(grounded && !flying && !player.balcony){grounded=false;velocityY=5.4;}
  }
  function look(dx,dy){
    const gain=.0021*settings.sensitivity*(scoped?.34:1);
    player.yaw-=dx*gain;
    player.pitch=clamp(player.pitch-dy*gain,-1.47,1.47);
  }
  const canvas=renderer.domElement;
  canvas.addEventListener('pointerdown',e=>{
    if(!active || e.button!==0)return;
    if(e.pointerType==='touch'){document.body.classList.add('touching');}
    drag={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);
    if(e.pointerType==='mouse' && !document.pointerLockElement)lock();
  });
  canvas.addEventListener('pointermove',e=>{
    if(active && !document.pointerLockElement && drag && e.pointerId===drag.id){
      look(e.clientX-drag.x,e.clientY-drag.y);drag.x=e.clientX;drag.y=e.clientY;
    }
  });
  const endDrag=()=>{drag=null;};canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',endDrag);
  document.addEventListener('mousemove',e=>{if(active && document.pointerLockElement===canvas)look(e.movementX,e.movementY);});
  canvas.addEventListener('wheel',e=>{
    if(!active||!flying)return;e.preventDefault();
    camera.fov=clamp(camera.fov+Math.sign(e.deltaY)*3,23,84);camera.updateProjectionMatrix();
  },{passive:false});
  function lock(){
    if(!active || document.body.classList.contains('touching') || document.pointerLockElement || !canvas.requestPointerLock)return;
    try{const p=canvas.requestPointerLock();if(p?.catch)p.catch(()=>{});}catch{}
  }
  function pause(){active=false;keys.clear();stick.x=stick.y=moveX=moveZ=0;drag=null;if(document.pointerLockElement)document.exitPointerLock();}
  function resume(){active=true;last=performance.now();}
  function scope(value=!scoped){
    scoped=value;camera.fov=scoped?20:58;camera.updateProjectionMatrix();api.onScope(scoped);
  }
  function fly(){
    if(scoped)scope(false);
    flying=!flying;
    if(flying)photoPosition.copy(camera.position);else {camera.fov=58;camera.updateProjectionMatrix();}
    api.onPhoto(flying);return flying;
  }
  function balcony(){
    player.balcony=!player.balcony;
    if(player.balcony){player.x=-2.49;player.z=.58;player.yaw=1.61;player.pitch=-.16;}
    else{player.x=0;player.z=6.2;player.yaw=.2;player.pitch=.17;}
    grounded=true;velocityY=moveX=moveZ=0;player.y=floor(player.x,player.z)+1.7;
  }
  function move(dt){
    const horizontal=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0)+stick.x;
    const forward=(keys.has('KeyW')||keys.has('ArrowUp')?1:0)-(keys.has('KeyS')||keys.has('ArrowDown')?1:0)-stick.y;
    const inputLength=Math.hypot(horizontal,forward), norm=Math.max(1,inputLength);
    const run=keys.has('ShiftLeft')||keys.has('ShiftRight')||Math.hypot(stick.x,stick.y)>.96;
    const swimming=!player.balcony && heightAt(player.x,player.z)<-.75;
    const speed=flying?(run?24:9.5):player.balcony?2.1:swimming?2.8:(run?8.8:4.7);
    const sy=Math.sin(player.yaw),cy=Math.cos(player.yaw);
    moveX=THREE.MathUtils.damp(moveX,(horizontal*cy-forward*sy)*speed/norm,12,dt);
    moveZ=THREE.MathUtils.damp(moveZ,(-horizontal*sy-forward*cy)*speed/norm,12,dt);
    if(flying){
      photoPosition.x=clamp(photoPosition.x+moveX*dt,-380,420);photoPosition.z=clamp(photoPosition.z+moveZ*dt,-380,430);
      photoPosition.y+=((keys.has('KeyE')||keys.has('Space')?1:0)-(keys.has('KeyQ')||keys.has('ControlLeft')?1:0))*speed*dt;
      photoPosition.y=clamp(photoPosition.y,Math.max(1.1,heightAt(photoPosition.x,photoPosition.z)+.6),190);
    }else{
      const n=Math.max(1,Math.ceil(dt/.023)),delta=dt/n;
      for(let k=0;k<n;k++){
        const x=player.x+moveX*delta,z=player.z+moveZ*delta;
        if(valid(x,player.z))player.x=x;
        if(valid(player.x,z))player.z=z;
        const base=floor(player.x,player.z)+1.7;
        if(grounded && player.y-base<.35)player.y=THREE.MathUtils.damp(player.y,base,22,delta);
        else{grounded=false;velocityY-=17*delta;player.y+=velocityY*delta;if(player.y<=base){player.y=base;velocityY=0;grounded=true;}}
      }
      stepTime+=Math.hypot(moveX,moveZ)*dt*1.6;
    }
    if(flying)camera.position.copy(photoPosition);
    else camera.position.set(player.x,player.y+(grounded?Math.sin(stepTime)*Math.min(.036,inputLength*.035):0)+(swimming?.05*Math.sin(t*1.7):0),player.z);
    camera.rotation.set(player.pitch,player.yaw,0,'YXZ');
    api.audio.update(t,player,!flying&&grounded&&inputLength>.15,run,swimming?'water':player.balcony?'rock':trailDistance(player.x,player.z)<1.9?'gravel':'grass');
  }
  function render(){
    atmosphere.update(camera);water.update(t);buildings.update(t);nature.update(t,camera.position);
    water.reflect(renderer,scene,camera,t,settings.quality==='ultra');
    renderer.render(scene,camera);
  }
  function tick(now){
    animation=requestAnimationFrame(tick);
    const dt=clamp((now-last)/1000,0,.16);last=now;
    if(!active || document.hidden)return;
    t+=dt;move(dt);render();
    if(now-lastHud>95){
      const target=sites[api.target()];
      let projected=null;
      if(target){
        projection.set(target.x,heightAt(target.x,target.z)+4.4,target.z).project(camera);
        if(projection.z>0 && projection.z<1 && Math.abs(projection.x)<.96 && Math.abs(projection.y)<.78)
          projected={x:(projection.x*.5+.5)*100,y:(.5-projection.y*.5)*100};
      }
      api.onMove(player,projected);lastHud=now;
    }
    if(pendingCapture){
      pendingCapture=false;canvas.toBlob(blob=>{if(!blob)return;const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download='风岬岛-'+new Date().toISOString().replace(/[:.]/g,'-')+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),18000);api.onCapture();},'image/png');
    }
  }
  await loading;
  camera.position.set(player.x,player.y,player.z);camera.rotation.set(player.pitch,player.yaw,0,'YXZ');
  for(let i=0;i<35;i++)nature.update(0,camera.position);
  atmosphere.update(camera);
  if(renderer.compileAsync){try{await renderer.compileAsync(scene,camera);}catch{}}
  render();animation=requestAnimationFrame(tick);
  return {player,keys,stick,lock,pause,resume,jump,fly,scope,balcony,setQuality,setMood:atmosphere.setMood,
    photo:()=>flying,active:()=>active,shutter:()=>{pendingCapture=true;}, getFrame:()=>renderer.info.render,
    dispose(){cancelAnimationFrame(animation);pause();renderer.dispose();window.removeEventListener('resize',resize);}
  };
}

