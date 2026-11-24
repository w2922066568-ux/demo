import { cardInfo, sortCards, classify, beats, hints } from './rules.js';

const sessions = new WeakMap();
const art = { left: 'lady', right: 'gent', north: 'painter', self: 'painter' };
const icons = {
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  cards: '<path d="m2 6 2-1 4 13-2 1zM6 4l2-1 4 13-2 1z"/><rect x="10" y="3" width="10" height="15" rx="1.5" transform="rotate(8 15 10.5)"/><path d="m15 7 2 3-2 3-2-3z"/>',
  close: '<path d="m6 6 12 12m0-12L6 18"/>',
  clock: '<circle cx="12" cy="13" r="8"/><path d="M12 9v5l3 1M10 2h4"/>',
  crown: '<path d="m2 7 5 4 5-7 5 7 5-4-3 11H5zM6 21h12"/>',
  music: '<path d="M9 17V5l12-2v12M9 8l12-2"/><ellipse cx="6.5" cy="17.5" rx="2.5" ry="2"/><ellipse cx="18.5" cy="15.5" rx="2.5" ry="2"/>',
  book: '<path d="M12 6c-2-2-6-3-10-2v15c4-1 8 0 10 2 2-2 6-3 10-2V4c-4-1-8 0-10 2Zm0 0v15"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="5" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8 11 7-4M8 13l7 4"/>',
  leave: '<path d="M11 4H4v16h7m-1-8h12m-5-5 5 5-5 5"/>',
  fold: '<path d="m4 7 8 9 8-9M6 21h12"/>'
};
const escape = text => String(text ?? '').replace(/[&<>"']/g, part => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[part]));
const ico = key => '<svg class="ht-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (icons[key] || '') + '</svg>';
const signed = number => number > 0 ? '+' + number : String(number);
const clocks = new Set();
let clockTimer;
function updateClock(root) {
  const state = sessions.get(root);
  const element = root.querySelector('[data-ht-clock]');
  if (!state || !element || !root.isConnected || root.hidden) {
    clocks.delete(root);
    return;
  }
  const now = typeof state.actions.now === 'function' ? state.actions.now() : Date.now();
  const remaining = Math.max(0, Math.ceil((state.view.deadline - now) / 1000));
  const formatted = remaining ? remaining + '秒' : '结算中';
  if (element.textContent !== formatted) element.textContent = formatted;
  element.parentElement.classList.toggle('ht-urgent', remaining <= 8 && state.view.activeId === state.view.you);
}
function watchClock(root) {
  clocks.add(root);
  updateClock(root);
  if (!clockTimer && clocks.size) {
    clockTimer = setInterval(() => {
      for (const table of clocks) updateClock(table);
      if (!clocks.size) { clearInterval(clockTimer); clockTimer = null; }
    }, 350);
  }
}

function dataForCard(id) {
  const info = cardInfo(id);
  const joker = info.rank >= 16;
  const suitName = {S:'黑桃', H:'红桃', C:'梅花', D:'方片'}[info.suit];
  const label = joker ? (info.rank === 17 ? '大王' : '小王') : info.label;
  return { ...info, label, joker, fullName: joker ? label : suitName + label };
}

function cardMarkup(id, size, selected = false, locked = false) {
  const info = dataForCard(id);
  const button = size === 'hand';
  const court = info.rank >= 11 && info.rank <= 13;
  const illustrated = button && (court || info.joker);
  const classes = ['ht-card','ht-card-' + size,info.red ? 'ht-red' : 'ht-black'];
  if (selected) classes.push('ht-selected');
  if (info.joker) classes.push('ht-joker');
  if (illustrated) classes.push(info.rank === 12 || info.rank === 17 ? 'ht-face-lady' : 'ht-face-gent');
  const corner = '<span class="ht-corner"><b>' + escape(info.label) + '</b>' +
    (info.joker ? '<i class="ht-joker-star">✦</i>' : '<i>' + escape(info.symbol) + '</i>') + '</span>';
  const pip = !info.joker && !illustrated ? '<span class="ht-center-pip" aria-hidden="true">' + escape(info.symbol) + '</span>' : '';
  const face = illustrated ? '<span class="ht-court-art" aria-hidden="true"></span>' : '';
  const attributes = ' class="' + classes.join(' ') + '" aria-label="' + info.fullName + '"';
  if (button) return '<button type="button"' + attributes + ' data-ht-card="' + id + '" aria-pressed="' + selected + '"' + (locked ? ' disabled' : '') + '>' + face + corner + pip + '</button>';
  return '<span' + attributes + ' role="img">' + corner + pip + '</span>';
}

function positionOf(view, id) {
  const seats = view.players;
  const selfIndex = seats.findIndex(player => player.id === view.you);
  const index = seats.findIndex(player => player.id === id);
  const distance = (index - selfIndex + seats.length) % seats.length;
  if (distance === 0) return 'self';
  if (seats.length === 2) return 'right';
  if (distance === 1) return 'left';
  return distance === seats.length - 1 ? 'right' : 'north';
}

function lastEvent(view, id) {
  const events = view.recent || [];
  for (let i = events.length - 1; i >= 0; i--) {
    const event = events[i];
    if (event.id !== id) continue;
    if (view.phase === 'bidding') return event.type === 'bid' ? event : null;
    return event.trick === view.trick && event.type !== 'bid' ? event : null;
  }
  return null;
}

function seatMarkup(view, player) {
  const pos = positionOf(view, player.id);
  const me = pos === 'self';
  const active = player.id === view.activeId;
  const landlord = player.id === view.landlordId;
  const event = lastEvent(view, player.id);
  const bid = view.phase === 'bidding' && Number.isInteger(player.bid);
  let tail = '';
  if (bid) tail = player.bid ? player.bid + '分' : '不叫';
  else if (event?.type === 'pass') tail = '不出';
  else if (player.auto && !player.bot) tail = '托管';
  const role = view.landlordId ? (landlord ? '地主' : '农民') : '';
  const avatar = '<img class="ht-seat-portrait" src="./art/' + art[pos] + '.webp" alt="" draggable="false">';
  const info = '<div class="ht-seat-name"><strong>' + escape(player.name) + '</strong>' +
    (role ? '<span class="ht-role ' + (landlord ? 'ht-lord' : '') + '">' + role + '</span>' : '') + '</div>';
  const count = '<span class="ht-card-count" aria-label="剩余 ' + player.count + ' 张">' + ico('cards') + '<b>' + player.count + '</b></span>';
  return '<section class="ht-seat ht-seat-' + pos + (active ? ' ht-active-seat' : '') + '" aria-label="' + escape(player.name) + (me ? '，自己' : '') +
    (role ? '，' + role : '') + '，剩余' + player.count + '张">' + avatar + '<div class="ht-seat-plaque">' + info +
    (me ? '<small>自己' + (player.auto ? ' · 托管' : '') + '</small>' : '') + (me ? '' : count) + '</div>' +
    (!me && tail ? '<span class="ht-seat-event">' + tail + '</span>' : '') + '</section>';
}

function headerMarkup(view) {
  const kitty = view.kitty.length ? view.kitty.map(id => cardMarkup(id,'kitty')).join('') :
    Array.from({length:view.kittyCount}, () => '<span class="ht-card-back" aria-label="尚未公开的底牌"><i>✥</i></span>').join('');
  return '<header class="ht-head"><div class="ht-title"><h1>花朝牌会</h1><span>经典斗地主</span></div>' +
    '<div class="ht-kitty"><span class="ht-kitty-label">底 牌</span><div class="ht-kitty-pile">' + kitty + '</div></div>' +
    '<div class="ht-stakes"><span>底分 <b>' + (view.base || view.highBid || '—') + '</b></span><i></i><span>倍数 <b>×' + (view.multiplier || 1) + '</b></span></div>' +
    '<button class="ht-menu-button" data-ht="menu" aria-label="牌桌菜单" aria-haspopup="dialog">' + ico('menu') + '</button></header>';
}

function trickMarkup(view) {
  const target = view.phase === 'playing' ? view.lastPlay : null;
  if (target) {
    const player = view.players.find(p => p.id === target.id);
    const pos = positionOf(view, target.id);
    const sorted = sortCards(target.cards);
    // Prefer showing the body of an attached play before the kickers.
    const tally = new Map();
    sorted.forEach(id => { const rank = cardInfo(id).rank; tally.set(rank,(tally.get(rank) || 0) + 1); });
    const shown = [...sorted].sort((a,b) => tally.get(cardInfo(b).rank) - tally.get(cardInfo(a).rank));
    return '<section class="ht-trick ht-trick-' + pos + (shown.length > 8 ? ' ht-trick-many' : '') + '" aria-label="桌面出牌">' +
      '<div class="ht-trick-owner">' + escape(player?.name) + '<i></i>' + escape(target.combo.name) + '</div>' +
      '<div class="ht-played-pile" style="--ht-cards:' + shown.length + ';--ht-spaces:' + Math.max(1,shown.length-1) + '">' +
      shown.map(id => cardMarkup(id,'played')).join('') + '</div></section>';
  }
  const active = view.players.find(p => p.id === view.activeId);
  const bidding = view.phase === 'bidding';
  const title = bidding ? (view.dealNo > 1 ? '重新发牌 · 叫地主' : '叫地主') : (view.activeId === view.you ? '请领牌' : '等待领牌');
  const sub = bidding ? (view.highBid ? '当前最高 ' + view.highBid + ' 分' : '最高叫分者获得底牌') :
    (view.activeId === view.you ? '' : escape(active?.name || ''));
  return '<section class="ht-trick ht-new-trick" aria-live="polite"><div class="ht-trick-caption"><strong>' + title +
    '</strong>' + (sub ? '<span>' + sub + '</span>' : '') + '</div></section>';
}

function handRows(view, state) {
  const cards = sortCards(view.hand);
  const rows = cards.length > 10 ? [cards.slice(0,Math.ceil(cards.length/2)),cards.slice(Math.ceil(cards.length/2))] : [cards];
  const makeRow = (row, mode) => '<div class="ht-hand-row ht-' + mode + '" style="--ht-n:' + row.length + ';--ht-spaces:' + Math.max(1,row.length-1) + '">' +
    row.map(id => cardMarkup(id,'hand',state.selected.has(id),view.phase !== 'playing')).join('') + '</div>';
  return '<div class="ht-hand" aria-label="我的手牌，点击或横向划选">' + makeRow(cards,'wide-hand') + rows.map(row => makeRow(row,'narrow-hand')).join('') + '</div>';
}

function controlButton(action, label, disabled, primary = false, additional = '') {
  return '<button type="button" class="ht-porcelain' + (primary ? ' ht-cinnabar' : '') + '" data-ht="' + action +
    '"' + (disabled ? ' disabled' : '') + additional + '><span>' + label + '</span></button>';
}

function checkSelection(state) {
  const {view, selected} = state;
  if (!selected.size) return {valid:false,message:''};
  const combination = classify([...selected]);
  if (!combination) return {valid:false,message:'所选 ' + selected.size + ' 张未组成牌型'};
  if (view.lastPlay && !beats(combination,view.lastPlay.combo)) return {valid:false,message:'须压过上家的' + view.lastPlay.combo.name};
  return {valid:true,message:combination.name};
}

function actionMarkup(state) {
  const {view, busy} = state;
  const mine = view.activeId === view.you;
  const bid = view.phase === 'bidding';
  const active = view.players.find(p => p.id === view.activeId);
  const check = checkSelection(state);
  let instruction = mine ? (bid ? '请叫分' : view.lastPlay ? '轮到你出牌' : '轮到你领牌') : (active?.name || '') + (bid ? ' 正在叫分' : ' 正在出牌');
  const feedback = '<span class="ht-feedback" role="status" aria-live="polite"' + (!state.feedback && !check.message ? ' hidden' : '') + '>' + escape(state.feedback || check.message) + '</span>';
  const status = '<div class="ht-action-status">' + (!bid && !view.lastPlay ? '' :
    '<span class="ht-turn-text' + (mine ? ' ht-my-turn' : '') + '">' + escape(instruction) + '</span>') +
    (view.deadline ? '<span class="ht-clock">' + ico('clock') + '<span data-ht-clock></span></span>' : '') + feedback + '</div>';
  let buttons;
  if (bid) {
    buttons = [0,1,2,3].map(value => controlButton('bid', value ? value + '分' : '不叫', !mine || busy || (value > 0 && value <= view.highBid), value === 3, ' data-bid="' + value + '"')).join('');
  } else {
    buttons = controlButton('pass','不出',busy || !mine || !view.lastPlay) + controlButton('hint','提示',busy || !mine) +
      controlButton('play','出牌',busy || !mine || !check.valid,true);
  }
  return '<section class="ht-actions">' + status + '<div class="ht-controls' + (bid ? ' ht-bid-controls' : '') + '">' + buttons + '</div></section>';
}

function menuMarkup(state) {
  const room = state.view.code;
  const practice = state.view.you === 'practice-self';
  const sound = state.actions.sound ? '<button data-ht="sound">' + ico('music') + (state.actions.isMuted?.() ? '开启音效' : '关闭音效') + '</button>' : '';
  const share = !practice && state.actions.share && /^\d{6}$/.test(room) ? '<button data-ht="share">' + ico('share') + '邀请链接</button>' : '';
  return '<div class="ht-menu-shade" data-ht="close-menu"><section class="ht-menu-panel" role="dialog" aria-modal="true" aria-labelledby="ht-menu-title">' +
    '<div class="ht-pane-heading"><h2 id="ht-menu-title">牌桌菜单</h2><button data-ht="close-menu" aria-label="关闭菜单">' + ico('close') + '</button></div>' +
    '<p>' + (practice ? '练习牌桌' : '房间 ' + escape(room)) + '</p>' +
    '<nav><button data-ht="rules">' + ico('book') + '玩法说明</button>' + sound + share +
    '<button data-ht="leave">' + ico('leave') + '离开牌桌</button></nav></section></div>';
}

function finishedMarkup(view) {
  const seat = view.players.find(p => p.id === view.you);
  const players = view.standings?.length ? view.standings : view.players;
  const side = view.winnerTeam === 'landlord' ? '地主' : '农民';
  const spring = view.spring ? (view.spring === 'reverse' ? '反春天' : '春天') : '';
  return '<div class="ht-result-wrap"><section class="ht-result" aria-labelledby="ht-result-title">' +
    '<div class="ht-result-seal">' + (seat?.delta > 0 ? '胜' : '终') + '</div>' +
    '<h2 id="ht-result-title">' + side + '胜出</h2>' +
    '<div class="ht-score-meta">底分 ' + view.base + '<i></i>倍数 ×' + view.multiplier + (spring ? '<i></i>' + spring : '') + '</div>' +
    '<div class="ht-score-head"><span>牌友</span><span>本局</span><span>总分</span></div>' +
    players.map(player => '<div class="ht-score-row"><span><b>' + escape(player.name) + '</b><small>' +
      (player.id === view.landlordId ? '地主' : '农民') + (player.id === view.you ? ' · 你' : '') + '</small></span>' +
      '<strong class="' + (player.delta >= 0 ? 'ht-gain' : '') + '">' + signed(player.delta) + '</strong><span>' + player.score + '</span></div>').join('') +
    '<div class="ht-result-actions">' + controlButton('leave','返回大厅',false) +
    (view.hostId === view.you ? controlButton('restart','再来一局',false,true) : '<span class="ht-wait-host">等待房主开局</span>') + '</div></section></div>';
}

function paint(root, state) {
  const {view} = state;
  const focused = document.activeElement;
  const cardFocus = root.contains(focused) ? focused?.getAttribute('data-ht-card') : null;
  const finish = view.phase === 'finished';
  root.innerHTML = '<div class="ht-board ht-phase-' + view.phase + ' ht-seats-' + view.players.length + '"><div class="ht-backdrop"></div>' +
    headerMarkup(view) + (finish ? finishedMarkup(view) : view.players.map(player => seatMarkup(view,player)).join('') +
      trickMarkup(view) + actionMarkup(state) + handRows(view,state)) + (state.menu ? menuMarkup(state) : '') + '</div>';
  watchClock(root);
  if (cardFocus !== null && !state.menu) {
    const copies = root.querySelectorAll('[data-ht-card="' + cardFocus + '"]');
    Array.from(copies).find(node => node.offsetParent)?.focus({preventScroll:true});
  }
}

function updateControls(root, state) {
  root.querySelectorAll('[data-ht-card]').forEach(button => {
    const on = state.selected.has(Number(button.dataset.htCard));
    button.classList.toggle('ht-selected',on);
    button.setAttribute('aria-pressed',String(on));
  });
  const region = root.querySelector('.ht-actions');
  if (region) { region.outerHTML = actionMarkup(state); watchClock(root); }
}

async function perform(root, state, type, extra = {}) {
  if (state.busy) return;
  const {view} = state;
  state.busy = true;
  state.feedback = '';
  updateControls(root,state);
  try {
    await state.actions.send({type,gameId:view.gameId,turn:view.turn,...extra});
  } catch (error) {
    state.feedback = error?.message || '操作未完成，请再试一次';
  } finally {
    state.busy = false;
    if (root.querySelector('.ht-board')) updateControls(root,state);
  }
}

function startDrag(root, state, event) {
  const button = event.target.closest('[data-ht-card]');
  if (!button || button.disabled || state.busy || event.button !== 0 || !event.isPrimary) return;
  event.preventDefault();
  const id = Number(button.dataset.htCard);
  state.drag = {pointer:event.pointerId,start:id,before:new Set(state.selected),adding:!state.selected.has(id),last:null};
  root.setPointerCapture?.(event.pointerId);
  applyDrag(root,state,id);
}
function applyDrag(root, state, id) {
  const drag = state.drag;
  if (!drag || id === drag.last) return;
  const order = sortCards(state.view.hand);
  const a = order.indexOf(drag.start), b = order.indexOf(id);
  if (a < 0 || b < 0) return;
  drag.last = id;
  state.selected = new Set(drag.before);
  for (const item of order.slice(Math.min(a,b),Math.max(a,b)+1)) {
    if (drag.adding) state.selected.add(item);
    else state.selected.delete(item);
  }
  state.feedback = '';
  state.hintIndex = -1;
  updateControls(root,state);
}
function setMenu(root,state,on) {
  state.menu = on;
  paint(root,state);
  root.querySelector(on ? '.ht-menu-panel [data-ht="close-menu"]' : '.ht-menu-button')?.focus({preventScroll:true});
}
function attach(root,state) {
  root.addEventListener('pointerdown',event => startDrag(root,state,event));
  root.addEventListener('pointermove',event => {
    if (state.drag?.pointer !== event.pointerId) return;
    const card = document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-ht-card]');
    if (card && root.contains(card)) applyDrag(root,state,Number(card.dataset.htCard));
  });
  const end = event => {
    if (state.drag?.pointer !== event.pointerId) return;
    state.drag = null;
    if (root.hasPointerCapture?.(event.pointerId)) root.releasePointerCapture(event.pointerId);
  };
  root.addEventListener('pointerup',end);
  root.addEventListener('pointercancel',end);
  root.addEventListener('keydown',event => {
    if (!state.menu) return;
    if (event.key === 'Escape') { event.preventDefault(); setMenu(root,state,false); return; }
    if (event.key === 'Tab') {
      const items = [...root.querySelectorAll('.ht-menu-panel button')];
      if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1)?.focus(); }
      else if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0]?.focus(); }
    }
  });
  root.addEventListener('click',event => {
    const card = event.target.closest('[data-ht-card]');
    if (card && event.detail === 0 && !card.disabled && !state.busy) {
      const id = Number(card.dataset.htCard);
      if (state.selected.has(id)) state.selected.delete(id); else state.selected.add(id);
      state.feedback = ''; state.hintIndex = -1; updateControls(root,state); return;
    }
    const action = event.target.closest('[data-ht]');
    if (!action || action.disabled) return;
    const key = action.dataset.ht;
    if (key === 'menu') return setMenu(root,state,true);
    if (key === 'close-menu') {
      if (action.classList.contains('ht-menu-shade') && event.target !== action) return;
      return setMenu(root,state,false);
    }
    if (['rules','leave','share','sound'].includes(key)) {
      if (state.menu) setMenu(root,state,false);
      Promise.resolve().then(() => state.actions[key]?.()).catch(error => { state.feedback=error.message; updateControls(root,state); });
      return;
    }
    if (key === 'bid') return void perform(root,state,'bid',{value:Number(action.dataset.bid)});
    if (key === 'pass' || key === 'restart') return void perform(root,state,key);
    if (key === 'play' && checkSelection(state).valid) return void perform(root,state,'play',{cards:sortCards([...state.selected])});
    if (key === 'hint') {
      if (!state.hintList) state.hintList = hints(state.view.hand,state.view.lastPlay?.combo || null);
      if (!state.hintList.length) {
        state.selected.clear();
        state.feedback = '没有能压住的牌，可以不出';
      } else {
        state.hintIndex = (state.hintIndex + 1) % state.hintList.length;
        state.selected = new Set(state.hintList[state.hintIndex]);
        state.feedback = '';
      }
      updateControls(root,state);
    }
  });
}

export function renderTable(root, view, actions) {
  let state = sessions.get(root);
  if (!state) {
    state = {selected:new Set(),feedback:'',busy:false,menu:false,drag:null,hintList:null,hintIndex:-1};
    sessions.set(root,state); attach(root,state);
  }
  const old = state.view;
  const newHand = !old || old.code !== view.code || old.you !== view.you || old.gameId !== view.gameId || old.dealNo !== view.dealNo;
  const entering = !root.querySelector('.ht-board');
  if (newHand || entering) {
    state.selected.clear(); state.menu = false; state.busy = false;
  } else {
    const hand = new Set(view.hand);
    state.selected = new Set([...state.selected].filter(id => hand.has(id)));
  }
  if (newHand || entering || old.turn !== view.turn) {
    state.hintIndex = -1; state.hintList = null; state.feedback = ''; state.drag = null;
  }
  state.actions = actions;
  state.view = view;
  const signature = JSON.stringify(view);
  if (state.signature !== signature || entering) {
    state.signature = signature;
    paint(root,state);
  }
}
