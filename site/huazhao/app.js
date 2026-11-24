import { renderTable } from "./table.js";

const $ = s => document.querySelector(s);
const dialog = $("#dialog");
const table = $("#table");
const icon = name => '<svg aria-hidden="true"><use href="#f-' + name + '"/></svg>';
const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[c]);
const names = ["花间客","青瓷","砚舟","清和","云岫","竹影","听莺","阿棠"];
const avatars = ["painter", "lady", "gent", "painter"];
const formats = { 2:"双人单挑", 3:"经典三人", 4:"四人同桌" };
const key = "huazhao.v1.";
function load(name, fallback = null, storage = "localStorage") {
  try { return JSON.parse(window[storage].getItem(key + name)) ?? fallback; } catch { return fallback; }
}
function save(name, value, storage = "localStorage") {
  try {
    if (value == null) window[storage].removeItem(key + name);
    else window[storage].setItem(key + name,JSON.stringify(value));
  } catch { /* A live tab can still participate with browser storage disabled. */ }
}
let nickname = load("nickname", names[Math.floor(Math.random() * names.length)]);
let soundOn = load("sound", false), audio;
let session = null, state = null, revision = -1, sessionVersion = 0, pollTimer = 0;
let practiceRoom = null, engine = null, roomOrigin = location.origin, timeOffset = 0;
let toastTimer = 0, formBusy = false, adminBusy = false, practiceBusy = false;
const inFlightEntries = new Map();

function notice(message) {
  $("#toast").textContent = message; clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { $("#toast").textContent = ""; }, 3000);
}
function updateSound() {
  const b = $("#sound-toggle");
  b.innerHTML = icon(soundOn ? "sound" : "mute");
  b.setAttribute("aria-pressed",String(soundOn)); b.setAttribute("aria-label",soundOn ? "关闭音效" : "开启音效");
  b.title = b.getAttribute("aria-label");
}
function note(notes, length = .17) {
  if (!soundOn) return;
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    audio ||= new Audio(); void audio.resume().catch(() => {});
    notes.forEach((f,i) => {
      const o = audio.createOscillator(), g = audio.createGain(), t = audio.currentTime + i * .075;
      o.type = "sine"; o.frequency.setValueAtTime(f,t); o.frequency.exponentialRampToValueAtTime(f * .992,t+length);
      g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.085,t+.009); g.gain.exponentialRampToValueAtTime(.0001,t+length);
      o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+length+.02);
    });
  } catch { /* Sound is optional. */ }
}
function toggleSound() {
  soundOn = !soundOn; save("sound",soundOn); updateSound();
  if (soundOn) note([392,587],.35);
  return soundOn;
}
function closeSheet() { if (dialog.open) dialog.close(); }
function sheet(html, focus = "#dialog-title") {
  $("#dialog-content").innerHTML = '<div class="sheet"><button type="button" class="cross" data-ui="close" aria-label="关闭">' + icon("close") + '</button>' + html + '</div>';
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0; dialog.querySelector(focus)?.focus({preventScroll:true});
}
function heading(text) { return '<h2 id="dialog-title" tabindex="-1">' + text + '</h2>'; }
function showRules() {
  sheet(heading("牌桌玩法") +
    '<h3>叫地主</h3><p>轮到你时可以不叫，或者叫比当前更高的 1、2、3 分。叫到 3 分立即成为地主，拿走底牌并先出。全桌不叫就重新发牌。</p>' +
    '<h3>跟牌与过牌</h3><p>点牌选中，再点「出牌」。跟牌需要同牌型、相同张数且点数更大；点「提示」可以轮看可出的组合。其余人都不出时，由上一位出牌者自由领出下一手。</p>' +
    '<div class="rules-grid"><span>单张、对子、三张</span><span>三带一、三带一对</span><span>顺子至少五张</span><span>连对至少三对</span><span>飞机，可带单翅或对翅</span><span>四带二单或两对</span></div>' +
    '<p>点数从 3 到 A、2、小王、大王依次增大。2 和双王不能参加连续牌型的主体。四张同点是炸弹，大炸弹压小炸弹，双王组成的火箭最大。</p>' +
    '<h3>胜负与积分</h3><p>地主先出完则地主胜，任一农民先出完则农民方胜。底分取叫分，每个炸弹或火箭使倍数翻倍。地主赢且农民从未出牌为春天；农民赢且地主只出过一手为反春，均再翻倍。地主与每位农民分别结算同样的分值。</p>' +
    '<h3>桌型</h3><p>经典三人各发 17 张，留 3 张底牌。双人单挑各发 17 张，留 3 张底牌，其余暗置。四人单副牌各发 13 张，留 2 张底牌，地主对三名农民。</p>' +
    '<p class="small">主动离席后由系统代打至结算。网络短暂中断时，在原浏览器刷新可接回自己的位置。</p><button class="lacquer primary wbutton" data-ui="close">知道了</button>');
}
function entryForm(mode, code = "") {
  const create = mode === "create";
  sheet(heading(create ? "好友开桌" : "凭码入席") +
    '<form id="entry-form" data-mode="' + mode + '"><label class="field">你的昵称<input autocomplete="nickname" name="name" required maxlength="16" value="' + esc(nickname) + '"></label>' +
    (create ? '<fieldset class="modes"><legend>选一张桌</legend>' + [2,3,4].map(n =>
      '<label><input type="radio" name="capacity" value="' + n + '" ' + (n === 3 ? "checked" : "") + '><span><b>' + formats[n] + '</b><small>' + (n === 2 ? "一对一" : n === 3 ? "一对二" : "一对三") + '</small></span></label>').join("") + '</fieldset>' :
      '<label class="field">六位房间码<input name="code" type="text" inputmode="numeric" autocomplete="off" pattern="[0-9]{6}" maxlength="6" placeholder="输入朋友的房间码" value="' + esc(code) + '" required></label>') +
    '<div class="form-error" role="alert"></div><div class="form-end"><button type="submit" class="lacquer primary wbutton">' + (create ? "创建牌桌" : "加入牌桌") + '</button></div></form>', !create && !code ? '[name="code"]' : '#dialog-title');
}
function makeToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)), x => x.toString(16).padStart(2,"0")).join("");
}
async function request(path, token, body, etag, match) {
  const headers = {Authorization:"Bearer " + token};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (etag >= 0) headers["If-None-Match"] = '"' + etag + '"';
  if (match >= 0) headers["If-Match"] = '"' + match + '"';
  const abort = new AbortController(), timeout = setTimeout(() => abort.abort(),9500);
  try {
    const res = await fetch(path,{method:body === undefined ? "GET" : "POST",headers,body:body === undefined ? undefined : JSON.stringify(body),cache:"no-store",signal:abort.signal});
    if (res.status === 304) return null;
    const result = await res.json();
    if (!res.ok) throw Object.assign(new Error(result.error || "暂时无法访问牌桌。"),{status:res.status});
    return result;
  } catch(e) {
    if (e.status) throw e;
    throw new Error("未能连上牌桌，请检查网络后重试。");
  } finally { clearTimeout(timeout); }
}
function remember(value) {
  session = value;
  save("active",value,"sessionStorage"); save("active",value);
  if (value?.kind === "online") save("seat." + value.code,value);
}
function home(clear = true) {
  sessionVersion++; clearTimeout(pollTimer);
  if (clear && session?.kind === "online") save("seat." + session.code,null);
  if (session?.kind === "practice") save("practice",null,"sessionStorage");
  if (clear) remember(null); else session = null;
  practiceRoom=null;state=null;revision=-1;timeOffset=0;adminBusy=false;
  table.replaceChildren();table.hidden=true;$("#entry").hidden=false;$("#welcome").hidden=false;$("#lobby").hidden=true;
  $("#net").hidden=true;document.body.classList.remove("playing");history.replaceState(null,"",location.pathname);
}
function roomPath(){ return "/api/rooms/" + session.code; }
function renderLobby(v) {
  const host = v.you === v.hostId, full = v.players.length === v.capacity;
  const seats = Array.from({length:v.capacity},(_,i) => {
    const p = v.players[i];
    if (!p) return '<li><span class="seat-empty">' + icon("friends") + '</span><span class="seat-name"><strong>等候牌友</strong><small>空席</small></span>' + (host ? '<button aria-label="添加电脑牌友" title="添加电脑牌友" class="seat-extra" data-ui="bot-add">' + icon("add") + '</button>' : "") + '</li>';
    const role = p.id===v.hostId ? "桌主" : p.bot ? "电脑牌友" : "已入席";
    return '<li><img src="./art/' + avatars[i] + '.webp" alt=""><span class="seat-name"><strong>' + esc(p.name) + '</strong><small>' + role + (p.id===v.you ? " · 你" : "") + '</small></span>' + (host && p.bot ? '<button class="seat-extra" data-ui="bot-remove" data-id="' + esc(p.id) + '" aria-label="移除电脑牌友" title="移除电脑牌友">' + icon("close") + '</button>' : "") + '</li>';
  }).join("");
  $("#lobby").innerHTML = '<div class="wait-top"><div><div class="wait-format">' + formats[v.capacity] + '</div><h2>好友牌桌</h2></div><button class="small-tool" data-ui="leave">' + icon("leave") + '离席</button></div>' +
    '<div class="code-row"><span>房间码</span><strong>' + esc(v.code) + '</strong><button class="small-tool" data-ui="code">' + icon("copy") + '复制</button></div><ul class="seats">' + seats + '</ul>' +
    '<div class="wait-actions"><button class="lacquer light" data-ui="share">' + icon("share") + '邀好友</button>' +
    (host ? '<button class="lacquer primary" data-ui="start" ' + (!full ? "disabled" : "") + '>开始发牌</button>' : '<span class="wait-state">等桌主发牌</span>') + '</div>' +
    '<div class="wait-footer"><span>' + v.players.length + ' / ' + v.capacity + ' 人入席</span>' + (host && !full ? '<button class="small-tool" data-ui="bot-add">添加电脑牌友</button>' : '') + '</div>';
}
function display(view) {
  if (!view) return;
  if (state?.phase === "bidding" && view.phase === "playing") note([392,494,587],.32);
  else if (state?.phase === "playing" && view.phase === "finished") note([392,494,587,784],.4);
  else if (state?.phase === "playing" && state.turn!==view.turn && view.activeId===view.you) note([523],.14);
  state=view;
  const inLobby = view.phase==="lobby";
  $("#entry").hidden = !inLobby; $("#welcome").hidden = true; $("#lobby").hidden = !inLobby; table.hidden = inLobby;
  document.body.classList.toggle("playing",!inLobby);
  if (inLobby) { table.replaceChildren(); renderLobby(view); } else renderTable(table,view,tableActions);
}
function applyOnline(data) {
  if (!data || data.view.code!==session?.code || data.revision < revision) return;
  revision = data.revision; timeOffset = data.serverTime - Date.now();
  display(data.view);
}
function schedule(delay) { clearTimeout(pollTimer); pollTimer=setTimeout(poll,delay); }
function practiceView() {
  save("practice",practiceRoom,"sessionStorage");
  display(engine.snapshot(practiceRoom,"practice-self"));
}
async function poll() {
  if (!session) return;
  const generation=sessionVersion;
  if (session.kind==="practice") {
    if (practiceRoom && engine.tick(practiceRoom,Date.now())) practiceView();
    if (session) schedule(document.hidden ? 1000 : 300);
    return;
  }
  try {
    const data=await request(roomPath(),session.token,undefined,revision);
    if (generation!==sessionVersion) return;
    $("#net").hidden=true; applyOnline(data);
    schedule(document.hidden ? 2700 : state?.phase==="lobby" ? 1000 : 600);
  } catch(e) {
    if (generation!==sessionVersion) return;
    if ([401,403,404].includes(e.status)) { home();notice(e.message);return; }
    $("#net").hidden=false;schedule(1800);
  }
}
async function startPractice(saved) {
  if (practiceBusy) return;
  practiceBusy=true;const b=$('[data-ui="practice"]');b.disabled=true;
  try {
    engine ||= await import("./engine.js");
    const now=Date.now();
    if (saved) practiceRoom=saved;
    else {
      practiceRoom=engine.createRoom("000000",{id:"practice-self",name:nickname},now,{capacity:3});
      for(let i=0;i<2;i++) engine.act(practiceRoom,"practice-self",{type:"addBot",gameId:practiceRoom.gameId},now);
      engine.act(practiceRoom,"practice-self",{type:"start",gameId:practiceRoom.gameId},now);
    }
    sessionVersion++;clearTimeout(pollTimer);timeOffset=0;state=null;
    remember({kind:"practice"});practiceView();schedule(240);note([392,494],.22);window.scrollTo(0,0);
  } catch(e){home();notice(e.message || "练习暂时无法启动。");} finally{practiceBusy=false;b.disabled=false;}
}
async function submitEntry(event) {
  const form=event.target.closest("#entry-form");if(!form)return;
  event.preventDefault();if(formBusy)return;
  const values=new FormData(form),name=String(values.get("name")||"").trim(),creating=form.dataset.mode==="create",code=String(values.get("code")||"").trim(),capacity=Number(values.get("capacity"));
  const error=form.querySelector(".form-error");
  if(!name){error.textContent="请先填一个昵称。";return;}
  nickname=name;save("nickname",name);
  const dedup=[creating,code,name,capacity].join("|");
  if(!inFlightEntries.has(dedup))inFlightEntries.set(dedup,makeToken());
  const token=inFlightEntries.get(dedup),button=form.querySelector('button[type="submit"]'),text=button.textContent;
  formBusy=true;button.disabled=true;button.textContent="正在入席…";error.textContent="";
  try {
    const data=await request(creating?"/api/rooms":"/api/rooms/"+code+"/join",token,creating?{name,capacity}:{name});
    inFlightEntries.delete(dedup);sessionVersion++;clearTimeout(pollTimer);revision=-1;state=null;
    remember({kind:"online",code:data.view.code,token});
    history.replaceState(null,"",location.pathname+"?room="+data.view.code);closeSheet();applyOnline(data);schedule(500);note([392,523],.26);
  } catch(e){error.textContent=e.message;} finally{formBusy=false;button.disabled=false;button.textContent=text;}
}
async function send(action) {
  if(!session || !state)return;
  const generation=sessionVersion;
  if(session.kind==="practice"){
    try{engine.act(practiceRoom,"practice-self",action,Date.now());practiceView();schedule(180);}
    catch(e){notice(e.message);throw e;}return;
  }
  try {
    const match=["addBot","removeBot","start","restart"].includes(action.type)?revision:undefined;
    const data=await request(roomPath()+"/actions",session.token,action,undefined,match);
    if(generation===sessionVersion){applyOnline(data);schedule(400);}
  }catch(e){if(generation===sessionVersion){notice(e.message);schedule(0);}throw e;}
}
async function lobbyAction(type,id) {
  if(adminBusy||!state)return;
  adminBusy=true;
  try{await send({type,gameId:state.gameId,...(id?{id}:{})});}catch{}finally{adminBusy=false;}
}
function confirmLeave() {
  if (!session) return;
  const playing=["bidding","playing"].includes(state?.phase);
  const detail=session.kind==="practice"?"本次练习将结束。":playing?"离席后，系统会代打你的手牌直到本局结算，其他人可以继续。":"离席后，你的位置将空出。";
  sheet(heading("离开牌桌？")+'<p>'+detail+'</p><div class="form-error" role="alert"></div><div class="dialog-buttons"><button class="lacquer light" data-ui="close">留下</button><button class="lacquer primary" data-ui="leave-now">离开</button></div>');
}
async function leave(btn) {
  if(!session || btn.disabled)return;
  btn.disabled=true;
  try {
    if(session.kind==="online")await request(roomPath()+"/actions",session.token,{type:"leave"});
    closeSheet();home();
  } catch(e){if([401,403,404].includes(e.status)){closeSheet();home();}else{dialog.querySelector(".form-error").textContent=e.message;}}
  finally{btn.disabled=false;}
}
async function copy(text) {
  try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);return true;}}catch{}
  const parent=dialog.open?dialog:document.body, field=document.createElement("textarea");
  field.value=text;field.style.cssText="position:fixed;opacity:0;left:0;top:0;";parent.append(field);field.select();
  let copied=false;try{copied=document.execCommand("copy");}catch{}field.remove();return copied;
}
function roomURL() { const url=new URL("/",roomOrigin);url.searchParams.set("room",session.code);return url.href; }
function share() {
  if(session?.kind!=="online"){notice("练习桌由电脑陪练。好友联机请从大厅开桌。");return;}
  const url=roomURL();
  sheet(heading("邀好友入席")+'<div class="code-row"><span>房间码</span><strong>'+esc(session.code)+'</strong></div><label class="field">邀请链接<input class="link-input" value="'+esc(url)+'" readonly></label><div class="dialog-buttons"><button class="lacquer light" data-ui="copy-invite">复制链接</button>'+(navigator.share?'<button class="lacquer primary" data-ui="native-share">分享</button>':'')+'</div><p id="share-result" role="status"></p>');
}
const tableActions={send,rules:showRules,leave:confirmLeave,share,sound:toggleSound,isMuted:()=>!soundOn,now:()=>Date.now()+timeOffset};
document.addEventListener("submit",submitEntry);
document.addEventListener("click",async e=>{
  const b=e.target.closest("[data-ui]");if(!b || b.disabled)return;
  switch(b.dataset.ui){
    case "create":case "join":entryForm(b.dataset.ui);break;
    case "rules":showRules();break;
    case "sound":toggleSound();break;
    case "practice":await startPractice();break;
    case "share":share();break;
    case "leave":confirmLeave();break;
    case "leave-now":await leave(b);break;
    case "bot-add":await lobbyAction("addBot");break;
    case "bot-remove":await lobbyAction("removeBot",b.dataset.id);break;
    case "start":await lobbyAction("start");break;
    case "code":if(state)notice(await copy(state.code)?"房间码已复制":"长按房间码可复制");break;
    case "copy-invite":{const field=dialog.querySelector(".link-input");if(field){const ok=await copy(field.value);if(!ok){field.focus();field.select();}$("#share-result").textContent=ok?"邀请链接已复制":"长按上方链接即可复制。";}break;}
    case "native-share":try{await navigator.share({title:"花朝牌会",text:"来春日水榭打牌，房间码 "+session.code,url:roomURL()});}catch(e){if(e.name!=="AbortError")$("#share-result").textContent="请使用复制链接。";}break;
    case "close":if(!formBusy)closeSheet();break;
  }
});
dialog.addEventListener("cancel",e=>{if(formBusy)e.preventDefault();});
dialog.addEventListener("click",e=>{if(formBusy||e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeSheet();});
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&session)schedule(0);});
window.addEventListener("online",()=>{if(session)schedule(0);});
updateSound();

const previous=load("active",load("active"),"sessionStorage");
if(previous?.kind==="practice" && load("practice",null,"sessionStorage"))void startPractice(load("practice",null,"sessionStorage"));


document.addEventListener("click", event => {
  const button = event.target.closest('[data-ui="create"],[data-ui="join"]');
  if (!button) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  location.assign("https://huazhao-card-parlor.sunnyvale19.chatgpt.site/" + location.search);
}, true);
