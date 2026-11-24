import { beats, botBid, botPlay, classify, sortCards } from "./rules.js";

const HUMAN_TURN_MS = 45_000;
const BOT_TURN_MS = 900;
const BOT_NAMES = ['韶音', '琴清远', '浅菀', '云岫'];

export class GameError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'GameError';
    this.status = status;
  }
}

function seat(identity, bot = false) {
  if (!identity || typeof identity.id !== 'string' || !/^[a-zA-Z0-9_-]{1,96}$/.test(identity.id)) {
    throw new GameError(400, '席位无效，请重新入座。');
  }
  const name = typeof identity.name === 'string' ? identity.name.trim().normalize('NFC') : '';
  if (!name || Array.from(name).length > 16 || /[\x00-\x1f\x7f-\x9f]/u.test(name)) throw new GameError(400, '昵称请填写 1–16 个字符。');
  return { id: identity.id, name, bot, auto: false, hand: [], score: 0, delta: 0,
    bid: null, plays: 0, lastCommand: null };
}

export function createRoom(code, owner, now = Date.now(), {capacity = 3} = {}) {
  if (typeof code !== 'string' || !/^[a-zA-Z0-9_-]{1,24}$/.test(code)) throw new GameError(400, '房间码无效。');
  if (![2, 3, 4].includes(capacity)) throw new GameError(400, '请选择双人、三人或四人桌。');
  const host = seat(owner);
  return {
    code, capacity, createdAt: now, hostId: host.id, players: [host], phase: 'lobby',
    gameId: 0, turn: 0, dealNo: 0, trick: 0, activeId: null, deadline: null,
    firstBidder: null, highBid: 0, highestId: null, landlordId: null, kitty: [],
    base: 0, multiplier: 1, bombs: 0, spring: null, lastPlay: null,
    passCount: 0, recent: [], winnerId: null, winnerTeam: null, standings: [], botSerial: 0
  };
}

export function joinRoom(room, identity) {
  const next = seat(identity);
  if (room.players.some(p => p.id === next.id)) return false;
  if (room.phase !== 'lobby') throw new GameError(409, '牌局已经开始，请等下一局再入座。');
  if (room.players.length >= room.capacity) throw new GameError(409, '本桌已满。');
  room.players.push(next);
  room.hostId ??= next.id;
  room.turn++;
  return true;
}

function nextSeat(room, id) {
  const index = room.players.findIndex(p => p.id === id);
  return room.players[(index + 1) % room.players.length];
}

function moveTo(room, player, now) {
  room.activeId = player.id;
  room.deadline = now + (player.bot || player.auto ? BOT_TURN_MS : HUMAN_TURN_MS);
  room.turn++;
}

function deal(room, now, rng, first) {
  const deck = Array.from({length: 54}, (_, i) => i);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  const handSize = room.capacity === 4 ? 13 : 17;
  // In a two-player match the unused 17 cards stay blind and are never revealed.
  const kittyCount = room.capacity === 4 ? 2 : 3;
  room.kitty = deck.slice(-kittyCount);
  room.players.forEach((p, i) => {
    const hand = Array.from({length: handSize}, (_, n) => deck[n * room.capacity + i]);
    Object.assign(p, {hand: sortCards(hand), bid: null, plays: 0, delta: 0});
  });
  Object.assign(room, {
    phase: 'bidding', dealNo: room.dealNo + 1, firstBidder: first.id, highBid: 0, highestId: null,
    base: 0, multiplier: 1, bombs: 0, spring: null, landlordId: null, trick: 0, lastPlay: null,
    passCount: 0, recent: [], winnerId: null, winnerTeam: null, standings: []
  });
  moveTo(room, first, now);
}

function begin(room, now, rng) {
  if (room.players.length !== room.capacity) throw new GameError(409, '等牌友入座，或邀请机友补齐空位。');
  const first = room.firstBidder ? nextSeat(room, room.firstBidder) : room.players[Math.floor(rng() * room.capacity)];
  room.gameId++;
  room.dealNo = 0;
  deal(room, now, rng, first);
}

function remember(room, event) {
  room.recent.push({...event, turn: room.turn, trick: room.trick});
  if (room.recent.length > 32) room.recent.shift();
}

function bid(room, player, value, now, rng) {
  if (room.phase !== 'bidding') throw new GameError(409, '当前不是叫分阶段。');
  if (!Number.isInteger(value) || value < 0 || value > 3 || (value && value <= room.highBid)) {
    throw new GameError(400, '请不叫，或叫一个高于当前的分数。');
  }
  player.bid = value;
  if (value > room.highBid) {
    room.highBid = value;
    room.highestId = player.id;
  }
  remember(room, {id: player.id, type: 'bid', value});
  if (value !== 3 && room.players.some(p => p.bid === null)) {
    moveTo(room, nextSeat(room, player.id), now);
    return;
  }
  if (room.highBid === 0) {
    deal(room, now, rng, nextSeat(room, room.firstBidder));
    return;
  }
  const landlord = room.players.find(p => p.id === room.highestId);
  room.landlordId = landlord.id;
  room.base = room.highBid;
  landlord.hand = sortCards([...landlord.hand, ...room.kitty]);
  room.phase = 'playing';
  room.trick = 1;
  moveTo(room, landlord, now);
}

function settle(room, winner) {
  const landlord = room.players.find(p => p.id === room.landlordId);
  const landlordWon = winner.id === landlord.id;
  if (landlordWon && room.players.every(p => p.id === landlord.id || p.plays === 0)) room.spring = 'spring';
  if (!landlordWon && landlord.plays === 1) room.spring = 'reverse';
  if (room.spring) room.multiplier *= 2;
  Object.assign(room, {phase: 'finished', activeId: null, deadline: null,
    winnerId: winner.id, winnerTeam: landlordWon ? 'landlord' : 'farmers', turn: room.turn + 1});
  const unit = room.base * room.multiplier;
  room.standings = room.players.map(p => {
    const isLandlord = p.id === landlord.id;
    const won = isLandlord === landlordWon;
    p.delta = unit * (won ? 1 : -1) * (isLandlord ? room.players.length - 1 : 1);
    p.score += p.delta;
    return {id: p.id, name: p.name, bot: p.bot, auto: p.auto, count: p.hand.length,
      landlord: isLandlord, won, score: p.score, delta: p.delta};
  });
}

function play(room, player, cards, now) {
  if (room.phase !== 'playing') throw new GameError(409, '请等叫分完成。');
  const shape = classify(cards);
  if (!shape) throw new GameError(400, '这些牌没有组成可出的牌型。');
  if (!cards.every(id => player.hand.includes(id))) throw new GameError(409, '手牌已变化，请重新选牌。');
  if (!beats(shape, room.lastPlay?.combo)) throw new GameError(409, '请出同牌型、更大的牌，或使用炸弹。');
  const played = sortCards(cards);
  const chosen = new Set(played);
  player.hand = player.hand.filter(id => !chosen.has(id));
  player.plays++;
  room.passCount = 0;
  room.lastPlay = {id: player.id, cards: played, combo: shape};
  if (shape.type === 'rocket' || shape.type === 'bomb') {
    room.bombs++;
    room.multiplier *= 2;
  }
  remember(room, {type: 'play', ...room.lastPlay});
  if (player.hand.length === 0) settle(room, player);
  else moveTo(room, nextSeat(room, player.id), now);
}

function pass(room, player, now) {
  if (room.phase !== 'playing' || !room.lastPlay) throw new GameError(409, '本轮由你领出，至少出一张牌。');
  remember(room, {id: player.id, type: 'pass'});
  room.passCount++;
  const next = nextSeat(room, player.id);
  if (room.passCount === room.players.length - 1) {
    room.trick++;
    room.passCount = 0;
    room.lastPlay = null;
  }
  moveTo(room, next, now);
}

function leave(room, player, now) {
  if (room.phase === 'lobby' || room.phase === 'finished') {
    room.players = room.players.filter(p => p.id !== player.id);
    if (room.phase === 'lobby') room.turn++;
  } else {
    if (player.auto) return false;
    player.auto = true;
    if (room.activeId === player.id) room.deadline = Math.min(room.deadline, now + BOT_TURN_MS);
  }
  if (room.hostId === player.id) room.hostId = room.players.find(p => !p.bot && !p.auto)?.id ?? null;
  return true;
}

function lobbyAction(room, player, a, now, rng) {
  if (player.id !== room.hostId) throw new GameError(403, '只有房主可以安排牌桌。');
  if (!['lobby', 'finished'].includes(room.phase)) throw new GameError(409, '牌局进行中。');
  if (a.type === 'start' || a.type === 'restart') {
    if (room.phase !== (a.type === 'start' ? 'lobby' : 'finished')) throw new GameError(409, '牌桌已变化。');
    if (room.phase === 'finished' && (room.players.some(p => p.auto) || room.players.length !== room.capacity)) {
      room.players = room.players.filter(p => !p.auto);
      for (const p of room.players) Object.assign(p, {hand: [], bid: null, plays: 0, delta: 0});
      Object.assign(room, {phase: 'lobby', standings: [], recent: [], firstBidder: null,
        landlordId: null, lastPlay: null, winnerId: null, winnerTeam: null, kitty: [], base: 0,
        multiplier: 1, bombs: 0, spring: null, highBid: 0, highestId: null, turn: room.turn + 1});
      return;
    }
    begin(room, now, rng);
    return;
  }
  if (room.phase !== 'lobby') throw new GameError(409, '请先回到候场。');
  if (a.type === 'addBot') {
    if (room.players.length >= room.capacity) throw new GameError(409, '本桌已满。');
    room.botSerial++;
    const name = BOT_NAMES.find(n => !room.players.some(p => p.bot && p.name === n)) || '花客';
    room.players.push(seat({id: 'bot-' + room.botSerial, name}, true));
  } else if (a.type === 'removeBot') {
    const index = room.players.findIndex(p => p.id === a.id && p.bot);
    if (index < 0) throw new GameError(409, '这个席位没有机友。');
    room.players.splice(index, 1);
  } else throw new GameError(400, '未知的牌桌指令。');
  room.turn++;
}

function commandKey(a) {
  if (!Number.isInteger(a.turn) && !['start', 'restart'].includes(a.type)) return null;
  const selection = a.type === 'play' && Array.isArray(a.cards) ? [...a.cards].sort((x,y) => x-y) : null;
  return JSON.stringify([a.type, a.gameId, a.turn, a.value, a.id, selection]);
}

export function act(room, id, a, now = Date.now(), rng = Math.random) {
  if (!a || typeof a !== 'object') throw new GameError(400, '牌桌指令无效。');
  const player = room.players.find(p => p.id === id);
  if (!player && a.type === 'leave') return false;
  if (!player) throw new GameError(403, '请先加入牌桌。');
  if (a.type === 'leave') return leave(room, player, now);
  if (player.bot || player.auto) throw new GameError(403, '这个席位已由机友接管。');
  const key = commandKey(a);
  if (key && player.lastCommand === key) return false;
  if (a.gameId !== room.gameId || (a.turn !== undefined && a.turn !== room.turn)) {
    throw new GameError(409, '牌局已更新，请查看最新牌桌。');
  }
  if (['start', 'restart', 'addBot', 'removeBot'].includes(a.type)) {
    lobbyAction(room, player, a, now, rng);
  } else {
    if (!['bid', 'play', 'pass'].includes(a.type)) throw new GameError(400, '未知的牌桌指令。');
    if (a.turn !== room.turn || room.activeId !== id || room.deadline === null || now >= room.deadline) {
      throw new GameError(409, '当前未轮到你，请查看最新牌桌。');
    }
    if (a.type === 'bid') bid(room, player, a.value, now, rng);
    if (a.type === 'play') play(room, player, a.cards, now);
    if (a.type === 'pass') pass(room, player, now);
  }
  player.lastCommand = key;
  return true;
}

export function tick(room, now = Date.now(), rng = Math.random) {
  if (room.deadline === null || now < room.deadline || !room.activeId) return false;
  const player = room.players.find(p => p.id === room.activeId);
  if (room.phase === 'bidding') {
    let value = player.bot || player.auto ? botBid(player.hand, room.highBid) : 0;
    if (!room.highBid && room.dealNo > 1 && room.players.filter(p => p.bid === null).length === 1) value = Math.max(1, value);
    bid(room, player, value, now, rng);
  } else if (room.phase === 'playing') {
    // The bot sees the same snapshot as the seat it plays. A human who misses
    // just one deadline passes on defence and retains control on the next turn.
    const selected = !player.bot && !player.auto && room.lastPlay ? null : botPlay(snapshot(room, player.id));
    if (selected) play(room, player, selected, now);
    else pass(room, player, now);
  } else return false;
  return true;
}

export function snapshot(room, id) {
  const you = room.players.find(p => p.id === id);
  if (!you) throw new GameError(403, '请先加入牌桌。');
  return {
    code: room.code, capacity: room.capacity, phase: room.phase, gameId: room.gameId, turn: room.turn,
    hostId: room.hostId, you: id, hand: [...you.hand], players: room.players.map(p => ({
      id: p.id, name: p.name, bot: p.bot, auto: p.auto, count: p.hand.length, bid: p.bid,
      score: p.score, delta: p.delta, plays: p.plays
    })), kitty: room.landlordId ? [...room.kitty] : [], kittyCount: room.capacity === 4 ? 2 : 3,
    activeId: room.activeId, landlordId: room.landlordId, highBid: room.highBid, base: room.base,
    multiplier: room.multiplier, bombs: room.bombs, spring: room.spring, deadline: room.deadline,
    recent: room.recent.map(e => e.type === 'play' ? {...e, cards: [...e.cards], combo: {...e.combo}} : {...e}),
    lastPlay: room.lastPlay && {...room.lastPlay, cards: [...room.lastPlay.cards], combo: {...room.lastPlay.combo}},
    trick: room.trick, dealNo: room.dealNo, winnerId: room.winnerId, winnerTeam: room.winnerTeam,
    standings: room.standings.map(p => ({...p}))
  };
}
