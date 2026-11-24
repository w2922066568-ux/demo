// Card IDs identify physical cards. Ranks go from 3 to 17 (the big joker).
const FACES = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2', '小王', '大王'];
const SUITS = ['S', 'H', 'C', 'D'];
const PIPS = ['♠', '♥', '♣', '♦'];
const NAMES = {
  single: '单张', pair: '对子', triple: '三张', tripleSingle: '三带一', triplePair: '三带一对',
  straight: '顺子', pairRun: '连对', plane: '飞机', planeSingle: '飞机带单', planePair: '飞机带对',
  fourSingle: '四带二', fourPair: '四带两对', bomb: '炸弹', rocket: '王炸'
};

function rankOf(id) { return id < 52 ? 3 + Math.floor(id / 4) : id - 36; }
function isCard(id) { return Number.isInteger(id) && id >= 0 && id < 54; }

export function cardInfo(id) {
  if (!isCard(id)) return null;
  const rank = rankOf(id);
  return { id, rank, label: FACES[rank - 3], suit: id >= 52 ? 'J' : SUITS[id % 4],
    symbol: id >= 52 ? '★' : PIPS[id % 4], red: id >= 52 ? id === 53 : id % 2 === 1 };
}

export function sortCards(ids) {
  return [...ids].sort((a, b) => rankOf(b) - rankOf(a) || a - b);
}

function buckets(cards) {
  const groups = Array.from({ length: 18 }, () => []);
  for (const id of cards) groups[rankOf(id)].push(id);
  return groups;
}

function combo(type, rank, size, chain = 1) {
  return { type, name: NAMES[type], rank, size, chain };
}

function isSequence(ranks) {
  return ranks.at(-1) <= 14 && ranks.at(-1) - ranks[0] === ranks.length - 1;
}

export function classify(cards) {
  if (!Array.isArray(cards) || !cards.length || cards.length > 20 || !cards.every(isCard) ||
      new Set(cards).size !== cards.length) return null;
  const groups = buckets(cards);
  const ranks = groups.flatMap((group, rank) => group.length ? [rank] : []);
  const size = cards.length;
  const high = ranks.at(-1);
  if (ranks.length === 1) return combo([null, 'single', 'pair', 'triple', 'bomb'][size], high, size);
  const bothJokers = Boolean(groups[16].length && groups[17].length);
  if (bothJokers) return size === 2 ? combo('rocket', 17, 2) : null;

  if (isSequence(ranks)) {
    if (size >= 5 && ranks.length === size) return combo('straight', high, size, size);
    if (ranks.length >= 3 && ranks.every(r => groups[r].length === 2)) return combo('pairRun', high, size, ranks.length);
    if (ranks.length >= 2 && ranks.every(r => groups[r].length === 3)) return combo('plane', high, size, ranks.length);
  }
  const four = ranks.find(r => groups[r].length === 4);
  if (four !== undefined) {
    if (size === 6) return combo('fourSingle', four, size);
    if (size === 8 && ranks.filter(r => groups[r].length === 2).length === 2) return combo('fourPair', four, size);
    return null;
  }
  const triples = ranks.filter(r => groups[r].length === 3);
  if (triples.length === 1) {
    if (size === 4) return combo('tripleSingle', triples[0], size);
    if (size === 5 && ranks.length === 2) return combo('triplePair', triples[0], size);
  }
  if (triples.length < 2 || !isSequence(triples)) return null;
  const length = triples.length;
  if (size === 4 * length) return combo('planeSingle', triples.at(-1), size, length);
  const pairs = ranks.filter(r => groups[r].length === 2);
  if (size === 5 * length && pairs.length === length) return combo('planePair', triples.at(-1), size, length);
  return null;
}

export function beats(candidate, target) {
  if (!candidate) return false;
  if (!target) return true;
  if (target.type === 'rocket') return false;
  if (candidate.type === 'rocket') return true;
  if (candidate.type === 'bomb' && target.type !== 'bomb') return true;
  return candidate.type === target.type && candidate.size === target.size && candidate.rank > target.rank;
}

// Choose representative physical cards for a given shape. Prefer natural wings
// over breaking intact combinations, and avoid ever using both jokers as wings.
function sideCards(groups, body, count, width) {
  const out = [];
  const choices = groups.map((group, rank) => ({ group, rank })).filter(({group, rank}) =>
    group.length >= width && !body.has(rank)).sort((a, b) => {
    const cost = ({ group, rank }) => (group.length - width) * 8 + (rank >= 15 ? 22 : 0) + rank / 3;
    return cost(a) - cost(b);
  });
  let usedJoker = false;
  for (const {group, rank} of choices) {
    if (rank >= 16 && usedJoker) continue;
    if (rank >= 16) usedJoker = true;
    const take = width === 2 ? 2 : Math.min(2, group.length, count - out.length);
    out.push(...group.slice(0, take));
    if (out.length === count * width) return out;
  }
  return null;
}

export function hints(hand, target = null) {
  if (!Array.isArray(hand) || !hand.length || !hand.every(isCard)) return [];
  if (target?.type === 'rocket') return [];
  const groups = buckets(hand);
  const plays = [];
  const add = (cards, type) => {
    if (target && type !== target.type && type !== 'bomb' && type !== 'rocket') return;
    const shape = classify(cards);
    if (!beats(shape, target)) return;
    const counts = new Map();
    for (const id of cards) counts.set(rankOf(id), (counts.get(rankOf(id)) || 0) + 1);
    let split = 0;
    for (const [rank, used] of counts) {
      if (groups[rank].length > used) split += groups[rank].length === 4 ? 18 : groups[rank].length - used;
      if (rank >= 16 && groups[16].length && groups[17].length && shape.type !== 'rocket') split += 17;
    }
    // Retain bombs and a rocket for defence unless this play finishes our hand.
    const explosive = shape.type === 'rocket' ? 2 : Number(shape.type === 'bomb');
    plays.push({ cards: sortCards(cards), shape, split, explosive, finish: cards.length === hand.length });
  };
  const addWings = (cards, body, count, width, type) => {
    if (target && type !== target.type) return;
    const wings = sideCards(groups, new Set(body), count, width);
    if (wings) add([...cards, ...wings], type);
  };
  for (let rank = 3; rank <= 17; rank++) {
    const g = groups[rank];
    if (!g.length) continue;
    add(g.slice(0, 1), 'single');
    if (g.length >= 2) add(g.slice(0, 2), 'pair');
    if (g.length >= 3) {
      const three = g.slice(0, 3);
      add(three, 'triple');
      addWings(three, [rank], 1, 1, 'tripleSingle');
      addWings(three, [rank], 1, 2, 'triplePair');
    }
    if (g.length === 4) {
      add(g, 'bomb');
      addWings(g, [rank], 2, 1, 'fourSingle');
      addWings(g, [rank], 2, 2, 'fourPair');
    }
  }
  if (groups[16].length && groups[17].length) add([52, 53], 'rocket');
  for (const [width, minimum, type] of [[1, 5, 'straight'], [2, 3, 'pairRun'], [3, 2, 'plane']]) {
    if (target && ![type, ...(type === 'plane' ? ['planeSingle', 'planePair'] : [])].includes(target.type)) continue;
    for (let first = 3; first + minimum - 1 <= 14; first++) {
      const body = [], cards = [];
      for (let r = first; r <= 14 && groups[r].length >= width; r++) {
        cards.push(...groups[r].slice(0, width));
        body.push(r);
        if (body.length < minimum) continue;
        add(cards, type);
        if (width === 3) {
          addWings(cards, body, body.length, 1, 'planeSingle');
          addWings(cards, body, body.length, 2, 'planePair');
        }
      }
    }
  }
  plays.sort((a, b) => Number(b.finish) - Number(a.finish) || a.explosive - b.explosive ||
    (target ? a.split - b.split || a.shape.rank - b.shape.rank :
      (b.cards.length - b.split) - (a.cards.length - a.split) || a.shape.rank - b.shape.rank));
  return plays.map(p => p.cards);
}

export function botBid(hand, highBid = 0) {
  const groups = buckets(hand);
  const bombs = groups.filter(g => g.length === 4).length;
  const strength = bombs * 4 + groups[15].length * 1.6 + groups[14].length * .55 +
    groups[16].length * 2 + groups[17].length * 2.8 + (groups[16].length && groups[17].length ? 2 : 0);
  const value = strength >= 8 ? 3 : strength >= 5.6 ? 2 : strength >= 3.1 ? 1 : 0;
  return value > highBid ? value : 0;
}

export function botPlay(view) {
  const options = hints(view.hand, view.lastPlay?.combo);
  if (!options.length) return null;
  const first = options[0];
  if (first.length === view.hand.length || !view.lastPlay) return first;
  const previous = view.players.find(p => p.id === view.lastPlay.id);
  const teammate = previous && previous.id !== view.landlordId && view.you !== view.landlordId;
  if (teammate && (previous.count <= 2 || view.lastPlay.combo.rank >= 13 ||
      ['bomb', 'rocket'].includes(classify(first).type))) return null;
  return first;
}
