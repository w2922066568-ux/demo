import {createGame,sites} from './game.js';
import {createAudio} from './audio.js';
import {drawChart} from './chart.js';

const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];
const icon=name=>'<svg><use href="#i-'+name+'"/></svg>';
const key='offshore.windward.v1';
function read(){try{return JSON.parse(localStorage.getItem(key))||{};}catch{return {};}}
const store=read();
const settings={quality:store.settings?.quality==='high'?'high':'ultra',mood:store.settings?.mood==='gold'?'gold':'day',sound:store.settings?.sound!==false,sensitivity:Math.min(2,Math.max(.5,Number(store.settings?.sensitivity)||1))};
const visited=new Set((Array.isArray(store.visited)?store.visited:[]).filter(i=>Number.isInteger(i)&&sites[i]));
const audio=createAudio();audio.setEnabled(settings.sound);
let game=null,initializing=false,inWorld=false,panel='',previous='',selected=0,tracked=Number.isInteger(store.tracked)&&sites[store.tracked]?store.tracked:0,near=-1,lastSave=0,toaster,noteTimer;
let hasStarted=!!store.player;
function save(){
  const p=game?.player||store.player;
  const player=p?{x:p.x,z:p.z,yaw:p.yaw,pitch:p.pitch,balcony:!!p.balcony}:null;
  try{localStorage.setItem(key,JSON.stringify({settings,player,visited:[...visited],tracked}));}catch{}
}
function toast(message,delay=2900){
  const el=$('#toast');el.textContent=message;el.hidden=false;
  clearTimeout(toaster);toaster=setTimeout(()=>el.hidden=true,delay);
}
function controls(){
  for(const b of $$('.switch button')){const active=settings[b.parentNode.dataset.setting]===b.dataset.value;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));}
  $('#sensitivity').value=settings.sensitivity;
  $('.sound use').setAttribute('href',settings.sound?'#i-sound':'#i-mute');
  $('.sound').setAttribute('aria-pressed',String(settings.sound));
  $('#setting-audio').textContent=settings.sound?'已开启':'已关闭';
  $('#enter-label').textContent=hasStarted?'继续探索':'进入海岬';
}
function journal(){
  $('#record-count').textContent=visited.size+' / 3';
  $('#record-list').innerHTML=sites.map((s,i)=>'<button class="record '+(i===selected?'active':'')+'" data-record="'+i+'" aria-pressed="'+(i===selected)+'"><span class="serial">'+s.serial+'</span><span><b>'+s.name+'</b><small>'+s.en+'</small></span><i class="'+(visited.has(i)?'visited':'')+'"></i></button>').join('');
  const s=sites[selected];
  $('#record-details').innerHTML='<p>'+(visited.has(selected)?s.entry:s.hint)+'</p><button class="track" data-action="track">'+icon('pin')+(tracked===selected?'正在追踪':'设为探索目标')+'</button>';
  drawChart($('#chart'),sites,game?.player||store.player||{x:32,z:96,yaw:.59},selected,visited,i=>{selected=i;journal();});
}
function showPanel(name){
  if(panel===name)return;
  previous=panel==='pause'?'pause':'';panel=name;
  if(game && inWorld)game.pause();
  $('#veil').hidden=false;for(const el of $$('.panel'))el.hidden=el.id!=='panel-'+name;
  if(name==='map'){selected=tracked>=0?tracked:0;journal();}
  if(name==='settings')controls();
  $('#panel-'+name+' button')?.focus({preventScroll:true});
}
function closePanel(){
  if(!panel)return;
  if(previous==='pause'){previous='';panel='';showPanel('pause');return;}
  panel='';$('#veil').hidden=true;
  if(game&&inWorld){game.resume();game.lock();}else $('[data-action="enter"]').focus({preventScroll:true});
}
function compass(yaw){
  const heading=(((-yaw*180/Math.PI)%360)+360)%360,center=Math.round(heading/5)*5;
  const els=$$('#compass-tape span');
  for(let j=0;j<els.length;j++){
    const value=center+(j-11)*5,deg=(value%360+360)%360;
    const card={0:'N',45:'NE',90:'E',135:'SE',180:'S',225:'SW',270:'W',315:'NW'}[deg];
    els[j].textContent=card||((deg%15===0)?deg:'');els[j].className=card?'':'minor';
    els[j].style.left='calc(50% + '+((value-heading)*3.35)+'px)';
  }
}
function showNote(kicker,title,sub){
  const n=$('#travel-note');n.querySelector('small').textContent=kicker;n.querySelector('strong').textContent=title;n.querySelector('span').textContent=sub;n.hidden=false;
  clearTimeout(noteTimer);noteTimer=setTimeout(()=>n.hidden=true,3300);
}
function objective(){
  $('#obj-code').textContent='FIELD SURVEY　/　0'+visited.size+' OF 03';
  $('#obj-title').textContent=visited.size===3?'海岬巡查完成':'海岬巡查';
  $('#obj-copy').textContent=visited.size===3?'三条现场记录已存入手册':tracked>=0?'前往'+sites[tracked].name:'沿巡护道寻访三处地标';
}
function movement(p,projected){
  compass(p.yaw);near=-1;let d=Infinity;
  sites.forEach((s,i)=>{const dist=Math.hypot(p.x-s.x,p.z-s.z);if(dist<5.7&&dist<d){d=dist;near=i;}});
  if(p.balcony)near=0;
  const interaction=$('#interaction');
  interaction.hidden=near<0||game?.photo();
  if(near>=0)interaction.querySelector('span').textContent=p.balcony?'返回塔下':visited.has(near)?(near===0?'登上灯塔回廊':'翻阅现场记录'):'调查'+sites[near].name;
  const marker=$('#waypoint'),site=sites[tracked];marker.hidden=!projected||!site||near===tracked||p.balcony||game?.photo();
  if(!marker.hidden){marker.style.left=projected.x+'%';marker.style.top=projected.y+'%';marker.querySelector('span').textContent=Math.round(Math.hypot(p.x-site.x,p.z-site.z))+' m';}
  if(performance.now()-lastSave>1600){save();lastSave=performance.now();}
}
async function enter(){
  if(initializing)return;audio.unlock();
  if(!game){
    initializing=true;$('#loading').hidden=false;
    try{
      await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
      game=await createGame($('#world'),settings,store.player,{
        audio,target:()=>tracked,onMove:movement,onScope:on=>{$('#scope').hidden=!on;},onPhoto:val=>{$('#photo-hud').hidden=!val;$('#hud').hidden=val;},
        onCapture:()=>toast('已保存无界面原画截图')
      });
    }catch(err){console.error(err);toast('场景载入失败。请使用已开启硬件加速的 Edge 或 Chrome。',7000);return;}
    finally{initializing=false;$('#loading').hidden=true;}
  }
  const first=!hasStarted;hasStarted=true;inWorld=true;
  $('#cover').hidden=true;$('#hud').hidden=false;$('#veil').hidden=true;panel='';
  controls();objective();game.resume();game.lock();save();
  if(first){
    showNote('NORTH ATLANTIC　/　62° 18′ N','风岬岛','Windward Isle');
    toast(document.body.classList.contains('touching')?'左侧摇杆移动 · 滑动右侧环视':'WASD 移动　·　鼠标环视　·　Shift 奔跑　·　E 调查',5700);
  }
}
function interact(){
  if(!game||near<0||panel||game.photo())return;
  if(game.player.balcony || (near===0 && visited.has(0))){
    game.balcony();showNote('NORTH CAPE LIGHT',game.player.balcony?'灯室回廊':'北岬灯塔',game.player.balcony?'Lantern Gallery':'North Cape Light');
  }else if(!visited.has(near)){
    const i=near;visited.add(i);audio.chime();
    if(tracked===i || tracked<0)tracked=sites.findIndex((s,j)=>!visited.has(j));
    showNote('FIELD RECORD　/　'+sites[i].serial,sites[i].name,sites[i].en);
    toast(visited.size===3?'三处地标已全部记录，巡查手册已完成。':'现场记录已存入野外手册');
  }else{showPanel('map');selected=near;journal();}
  objective();save();
}
function home(){
  if(game?.photo())game.fly();
  game?.scope(false);
  inWorld=false;panel=previous='';game?.pause();save();
  $('#hud').hidden=true;$('#photo-hud').hidden=true;$('#veil').hidden=true;$('#cover').hidden=false;controls();
}
const actions={
  enter,close:closePanel,map:()=>showPanel('map'),settings:()=>showPanel('settings'),pause:()=>showPanel('pause'),home,interact,
  audio:()=>{audio.unlock();settings.sound=!settings.sound;audio.setEnabled(settings.sound);controls();save();},
  track:()=>{tracked=selected;objective();journal();save();toast('已标记'+sites[selected].name);},
  photo:()=>{if(game&&inWorld&&!panel){const on=game.fly();if(on)toast('WASD 移动　·　Q / E 升降　·　滚轮变焦');}},
  jump:()=>game?.jump(),shutter:()=>game?.shutter(),
  fullscreen:async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{toast('当前窗口不支持全屏切换');}}
};
document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.action){actions[b.dataset.action]?.();return;}
  if(b.hasAttribute('data-record')){selected=Number(b.dataset.record);journal();return;}
  const field=b.parentElement?.dataset.setting;
  if(field){settings[field]=b.dataset.value;if(field==='quality')game?.setQuality(settings.quality);if(field==='mood')game?.setMood(settings.mood);controls();save();}
});
$('#sensitivity').addEventListener('input',e=>{settings.sensitivity=Number(e.target.value);save();});
$('#veil').addEventListener('click',e=>{if(e.target===$('#veil'))closePanel();});
document.addEventListener('keydown',e=>{
  if(e.key==='Tab' && panel){const list=[...$('#panel-'+panel).querySelectorAll('button,input')];if(e.shiftKey&&document.activeElement===list[0]){e.preventDefault();list.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===list.at(-1)){e.preventDefault();list[0].focus();}return;}
  if(e.code==='Escape'){if(e.repeat)return;if(panel){closePanel();return;}if(inWorld){if(game.photo())actions.photo();else showPanel('pause');}return;}
  if(panel){if(panel==='map'&&['KeyM','KeyJ'].includes(e.code)&&!e.repeat)closePanel();return;}
  if(!inWorld||!game?.active())return;
  if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
  game.keys.add(e.code);if(e.repeat)return;
  if(e.code==='KeyP'){actions.photo();return;}
  if(game.photo()){if(e.code==='KeyF')game.shutter();return;}
  if(e.code==='KeyB')game.scope();
  if(e.code==='KeyM'||e.code==='KeyJ')showPanel('map');
  if(e.code==='KeyE')interact();if(e.code==='Space')game.jump();
});
document.addEventListener('keyup',e=>game?.keys.delete(e.code));
document.addEventListener('pointerlockchange',()=>{if(!document.pointerLockElement && inWorld && !panel && game?.active())showPanel('pause');});
document.addEventListener('visibilitychange',()=>{if(document.hidden && inWorld && !panel)showPanel('pause');});
window.addEventListener('blur',()=>{game?.keys.clear();});window.addEventListener('pagehide',save);
window.addEventListener('resize',()=>{if(panel==='map')journal();});
window.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')document.body.classList.add('touching');},{capture:true});
if(matchMedia('(pointer:coarse)').matches)document.body.classList.add('touching');
const pad=$('#touch-pad'),knob=pad.firstElementChild;
function padMove(e){
  const box=pad.getBoundingClientRect(),dx=(e.clientX-box.left-box.width/2)/37,dz=(e.clientY-box.top-box.height/2)/37,n=Math.max(1,Math.hypot(dx,dz));
  game.stick.x=dx/n;game.stick.y=dz/n;knob.style.transform='translate('+game.stick.x*26+'px,'+game.stick.y*26+'px)';
}
pad.onpointerdown=e=>{if(!game)return;pad.setPointerCapture(e.pointerId);padMove(e);};
pad.onpointermove=e=>{if(game&&pad.hasPointerCapture(e.pointerId))padMove(e);};
pad.onpointerup=pad.onpointercancel=()=>{if(game)game.stick.x=game.stick.y=0;knob.style.transform='';};
$('#compass-tape').innerHTML='<span></span>'.repeat(23);controls();objective();

