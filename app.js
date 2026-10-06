/* ==========================================================
   FLOOWS BOX — Mohamed & Marmora's money diary
   Plain JavaScript, no server. Data lives in this browser
   (localStorage). Use More → Backup to move it between phones.
   ========================================================== */
'use strict';

/* ---------------- CONFIG (safe to edit) ---------------- */
const PEOPLE = {
  mohamed: { id: 'mohamed', name: 'Mohamed', emoji: '🧔🏻‍♂️', title: 'El Basha', color: '#1F8A8A' },
  marwa:   { id: 'marwa',   name: 'Marmora', emoji: '👸🏻',   title: 'El Hanem', color: '#C8102E' }
};
const APP_VERSION = '1.3';           // also bump ?v= in index.html when you upload changes
const START_YM = '2026-10';           // first month you can record
const CURRENCY = 'EGP';
const BIG_SPEND = 2000;               // amount that triggers the "sit down" toast

const PALETTE = ['#C8102E', '#E8A317', '#1F8A8A', '#7A1F1F', '#E5631B', '#2B6CB0',
                 '#6B8E23', '#D6577A', '#6B4C9A', '#8B5A2B', '#F07167', '#23395B'];

/* Egyptian / Alexandrian lifestyle categories */
const DEFAULT_CATS = [
  { id: 'groceries',  name: 'Supermarket',            ar: 'سوبر ماركت',   emoji: '🛒' },
  { id: 'market',     name: 'Veg, Fruit & Meat',      ar: 'خضار ولحمة',    emoji: '🥬' },
  { id: 'delivery',   name: 'Talabat & Delivery',     ar: 'دليفري',        emoji: '🛵' },
  { id: 'streetfood', name: 'Koshary, Foul & Ta3meya', ar: 'أكل شارع',     emoji: '🧆' },
  { id: 'fish',       name: 'Fish & Seafood',         ar: 'سمك',           emoji: '🐟' },
  { id: 'restaurants',name: 'Restaurants',            ar: 'مطاعم',         emoji: '🍽️' },
  { id: 'cafe',       name: 'Ahwa & Cafés',           ar: 'قهوة',          emoji: '☕' },
  { id: 'transport',  name: 'Uber, Careem & Tram',    ar: 'مواصلات',       emoji: '🚕' },
  { id: 'fuel',       name: 'Benzine & Car',          ar: 'بنزين وعربية',  emoji: '⛽' },
  { id: 'bills',      name: 'Electricity, Water & Gas', ar: 'فواتير',      emoji: '💡' },
  { id: 'mobile',     name: 'Mobile & Internet',      ar: 'موبايل ونت',    emoji: '📶' },
  { id: 'rent',       name: 'Rent, Bawab & Building', ar: 'إيجار وعمارة',  emoji: '🏠' },
  { id: 'home',       name: 'Home & Fixes',           ar: 'البيت',         emoji: '🛠️' },
  { id: 'clothes',    name: 'Clothes & Shoes',        ar: 'لبس',           emoji: '👗' },
  { id: 'beauty',     name: 'Beauty & Coiffeur',      ar: 'كوافير',        emoji: '💅' },
  { id: 'health',     name: 'Pharmacy & Doctors',     ar: 'صيدلية ودكاترة', emoji: '💊' },
  { id: 'baby',       name: 'Baby Adel',              ar: 'بيبي عادل',     emoji: '👶' },
  { id: 'family',     name: 'Family Visits & Gifts',  ar: 'زيارات وهدايا', emoji: '🎁' },
  { id: 'occasions',  name: 'Eid, Ramadan & Weddings', ar: 'مناسبات',      emoji: '🌙' },
  { id: 'outings',    name: 'Outings & Corniche',     ar: 'خروجات',        emoji: '🌅' },
  { id: 'subs',       name: 'Netflix, Shahid & Subs', ar: 'اشتراكات',      emoji: '📺' },
  { id: 'gam3eya',    name: 'Gam3eya & Savings',      ar: 'جمعية وتحويش',  emoji: '🐷' },
  { id: 'charity',    name: 'Sadaqa & Charity',       ar: 'صدقة',          emoji: '🤲' },
  { id: 'other',      name: 'Other / Mystery',        ar: 'أخرى',          emoji: '❓' }
].map((c, i) => ({ ...c, color: PALETTE[i % PALETTE.length] }));

const PAY_METHODS = [
  { id: 'cash',    label: '💵 Cash' },
  { id: 'card',    label: '💳 Card' },
  { id: 'instapay',label: '⚡ InstaPay' },
  { id: 'wallet',  label: '📱 Vodafone Cash' }
];

const REACTIONS = ['😍', '😂', '😱', '🤨', '💸', '👏'];

/* ---------------- JOKES & ADVICE ---------------- */
/* Team Marmora 👑 — every joke is on her side */
const JOKES = [
  "A “sale” is when Marmora saves 300 EGP. Mohamed calls it “spending 2,700”. Clearly only one of them understands economics. 🛍️",
  "Marmora doesn't overspend — she invests in happiness. Mohamed's PlayStation is the real expense. 🎮",
  "Behind every successful man is a woman who picked his shirts. You're welcome, Mohamed. 👔",
  "Marmora's closet is full because she plans ahead. Mohamed has worn the same three T-shirts since 2019. 👕",
  "Mohamed: “Did you buy something new?” Marmora: “Yes. It looks amazing. Next question.” 💅",
  "Rule #1 of marriage: Marmora is always right. Rule #2: if she's wrong, see rule #1. 👑",
  "Mohamed complains about one dress, then spends 600 EGP at the ahwa watching a match. ☕⚽",
  "Mohamed swears he never overspends. His four phone chargers and “just in case” cables disagree. 🔌",
  "Marmora bought two pairs of shoes on sale, so technically she made money. Mohamed's maths teacher has been informed. 🧮",
  "Mohamed: “We need to save money.” Marmora: “Agreed. Let's start with your PlayStation.” 🎮",
  "Talabat knows Mohamed's order by heart: “the usual, extra tahina, don't tell Marmora.” 🛵",
  "Marmora: “It was only 50 pounds!” Mohamed: “50 pounds?!” Also Mohamed: buys a 500 EGP car air freshener. 🚗",
  "City Centre Alex should give Marmora a VIP card. She's personally keeping the Egyptian economy alive. 🇪🇬",
  "When Marmora says “I have nothing to wear”, it's a fashion statement. When Mohamed says it, it's just true. 😂",
  "Mohamed hid money in his jacket. Marmora found it. Finders keepers — it's in the marriage contract. 💍",
  "Mohamed's “quick” coffee costs 85 EGP a day. Marmora's lipstick lasts a whole month. Do the maths, ya Basha. 💄",
  "Baby Adel isn't here yet and already has better taste than his dad — thanks to Mom. 👶",
  "Marriage is sharing everything: the bed, the dreams, and Marmora's right to Mohamed's fries. 🍟",
  "Every month they agree on a budget. Every month Mohamed's “one last cable” breaks it. 🔌",
  "“Let's just window-shop.” — Marmora's polite way of saying “bring your wallet, habibi”. 🪟",
  "Mohamed thinks shopping is expensive. Wait until he finds out the price of an unhappy wife. 👑",
  "Mohamed earns the money, Marmora manages it like a CEO. Respect the CEO. 💼",
  "Egyptian rule: a “quick visit” to Mohamed's family costs two kilos of fruit and all of Marmora's patience. 🍊",
  "Fish on the Corniche: Mohamed orders for four, eats for six, then asks Marmora why the bill is so high. 🐟",
  "Marmora's shopping is “too much”. Mohamed's gadgets are “investments”. Funny how that works. 📱",
  "Shopping list: bread, milk, eggs. Marmora added a candle because the home deserves to smell nice. Mohamed added… another cable. 🕯️",
  "Mohamed says Marmora spends a lot. Mohamed has never checked the ahwa bill. 🧾",
  "A happy Marmora = a happy home = a happy Mohamed. That's not spending, that's the smartest investment in Alexandria. 📈",
  "Marmora doesn't need a budget app. Mohamed does. That's why this app exists. 😌",
  "Girls don't overspend. They just discover great deals before husbands do. 🛍️✨"
];

const ADVICE = [
  { ar: 'على قد لحافك مد رجليك', en: "Stretch your legs only as far as your blanket. (Mohamed, this includes gadgets and cables.) 🔌" },
  { ar: 'القرش الأبيض ينفع في اليوم الأسود', en: "The white piastre saves the black day. Hide some cash in the freezer like Teta did. 🧊" },
  { ar: 'قاعدة الـ ٢٤ ساعة', en: "Leave it in the cart for 24 hours. Still love it tomorrow? It's love. If not — it was just Instagram." },
  { ar: 'الجمعية', en: "Join a gam3eya — Egypt's original savings app. No Wi-Fi, no fees, just Tant Samira collecting every 1st. 🐷" },
  { ar: 'ادفع لنفسك الأول', en: "Pay yourselves first: move 10% to savings on payday — before Talabat finds out you got paid." },
  { ar: 'الأكل في البيت', en: "Cook at home three extra nights a week = a free fish dinner on the Corniche at month end. (Mohamed is on dishes.) 🐟" },
  { ar: 'الظرف', en: "Envelope trick: put the week's outings money in an envelope. When it's empty, the Corniche walk is still free. 🌅" },
  { ar: 'اجتماع الجمعة', en: "Friday money date: 10 minutes, one tea, zero blaming. Review the week together. 🫖" },
  { ar: 'ألغي الاشتراك', en: "Unsubscribe from gadget newsletters, Mohamed. What you don't see, you don't buy. 📧" },
  { ar: 'احسبها بساعات الشغل', en: "Before a big buy, convert it into hours of work. Still worth it? Then enjoy it, guilt-free." },
  { ar: 'مشوار واحد', en: "One planned trip beats five “quick” trips. Benzine and Uber both agree. ⛽" },
  { ar: 'فاصل يا باشا', en: "Bargain politely — in Egypt the first price is just the opening line. Let Marmora do the talking, she's better at it. 🤝" }
];

const CAT_TOASTS = {
  clothes:   { marwa: "New outfit? Queen behaviour. The closet will make space. 👗", mohamed: "Mohamed bought clothes?! Finally — Marmora has been asking since 2024. 📸" },
  beauty:    { marwa: "Beauty isn't an expense, it's maintaining a national treasure. 💅", mohamed: "A barber visit! Marmora approves (finally). 💈" },
  cafe:      { marwa: "A coffee for the queen. Totally deserved. ☕", mohamed: "Ahwa again? The waiter is planning to invite you to his wedding. ☕" },
  delivery:  { marwa: "Even queens deserve a night off from the kitchen. Approved. 🛵", mohamed: "Delivery again, ya Basha? The kitchen is right there… 🍳" },
  baby:      { marwa: "Spending on Baby Adel = investment. Mom always knows best. 👶", mohamed: "Baby Adel thanks you. Future pocket money, noted. 👶" },
  fish:      { marwa: "Alex rule: you can't say no to fresh fish. Approved. 🐟", mohamed: "Fish in Alex is a human right. Did you leave some for Marmora? 🐟" },
  groceries: { marwa: "Groceries handled by the real Minister of the Household. 🛒", mohamed: "Groceries! Did you follow Marmora's list, or freestyle again? 🛒" },
  transport: { marwa: "Queens don't squeeze into microbuses. Uber approved. 🚕", mohamed: "Another ride? The microbus misses you. 🚐" },
  bills:     { marwa: "Bills paid by the family's Finance Minister. 💡", mohamed: "Bills paid. The lights stay on — and so does the marriage. 💡" },
  gam3eya:   { marwa: "Gam3eya paid! Marmora is officially the smartest saver in Alex. 🐷", mohamed: "Gam3eya paid! Marmora's good influence is working. 🐷" },
  charity:   { marwa: "Sadaqa never decreases wealth. Beautiful. 🤍", mohamed: "Sadaqa never decreases wealth. Beautiful. 🤍" },
  outings:   { marwa: "Corniche time! Every queen needs a sea breeze. 🌅", mohamed: "Good husband points +10 for taking her out. 🌅" },
  family:    { marwa: "Visiting family with gifts — classy as always. 🎁", mohamed: "Visiting family with fruit — Marmora taught you well. 🍊" },
  fuel:      { marwa: "Benzine for the queen's carriage. ⛽", mohamed: "Benzine again? Maybe stop driving to the ahwa. ⛽" },
  subs:      { marwa: "Netflix & Shahid: essential for the home's morale. 📺", mohamed: "Another subscription? Marmora's shows were already enough. 📺" }
};

/* ---------------- STORAGE ---------------- */
const KEY = 'fulusbox.v1';
const WHO_KEY = 'fulusbox.who';

function store(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } }
function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

/* "3abelo w Adeloo" one-tap expenses. Amounts are starting guesses — edit them in the app. */
const DEFAULT_TEMPLATES = [
  { id: 't_nescafe', name: 'Adel monthly Nescafe',       amount: 350,  cat: 'groceries', emoji: '☕' },
  { id: 't_la7ma',   name: 'Monthly la7ma from Tal5awy', amount: 2500, cat: 'market',    emoji: '🥩' },
  { id: 't_chicken', name: 'Monthly chicken extra',      amount: 900,  cat: 'market',    emoji: '🍗' }
];

function freshState() {
  return { v: 1, entries: [], cats: DEFAULT_CATS.map(c => ({ ...c })), months: {}, templates: DEFAULT_TEMPLATES.map(t => ({ ...t, updated: 0 })) };
}

let state = (() => {
  try {
    const s = JSON.parse(load(KEY));
    if (s && Array.isArray(s.entries)) {
      // add any new default categories shipped in later versions
      DEFAULT_CATS.forEach(d => { if (!s.cats.find(c => c.id === d.id)) s.cats.push({ ...d }); });
      s.months = s.months || {};
      if (!Array.isArray(s.templates)) s.templates = DEFAULT_TEMPLATES.map(t => ({ ...t, updated: 0 }));
      return s;
    }
  } catch (e) { /* ignore */ }
  return freshState();
})();

let saveWarned = false;
function save() {
  if (!store(KEY, JSON.stringify(state)) && !saveWarned) {
    saveWarned = true;
    toast('Heads up', 'This browser is not letting the site save (private mode?). Entries may be lost.');
  }
}

let who = PEOPLE[load(WHO_KEY)] ? load(WHO_KEY) : null;
const partnerOf = id => (id === 'mohamed' ? 'marwa' : 'mohamed');

/* ---------------- HELPERS ---------------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const pad = n => String(n).padStart(2, '0');
const esc = s => String(s ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

function money(n, withCur = true) {
  const v = Math.round((Number(n) || 0) * 100) / 100;
  const s = v.toLocaleString('en-US', { maximumFractionDigits: v % 1 ? 2 : 0 });
  return withCur ? `${s} ${CURRENCY}` : s;
}
function shortMoney(n) {
  if (n >= 100000) return Math.round(n / 1000) + 'k';
  if (n >= 10000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return money(n, false);
}

function localInput(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`; }
function ymOf(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`; }
function todayStr() { return localInput(new Date()).slice(0, 10); }
function daysInMonth(ym) { const [y, m] = ym.split('-').map(Number); return new Date(y, m, 0).getDate(); }
function monthName(ym, short = false) {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-GB', { month: short ? 'short' : 'long', year: 'numeric' });
}
function monthShort(ym) { const [y, m] = ym.split('-').map(Number); return new Date(y, m - 1, 1).toLocaleDateString('en-GB', { month: 'short' }); }
function addMonths(ym, n) { const [y, m] = ym.split('-').map(Number); return ymOf(new Date(y, m - 1 + n, 1)); }
function prettyDay(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const t = todayStr();
  const yd = new Date(); yd.setDate(yd.getDate() - 1);
  if (dateStr === t) return 'TODAY';
  if (dateStr === localInput(yd).slice(0, 10)) return 'YESTERDAY';
  return dt.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase();
}
function timeOf(when) {
  const [h, mi] = when.slice(11, 16).split(':').map(Number);
  const ampm = h >= 12 ? 'pm' : 'am';
  return `${((h + 11) % 12) + 1}:${pad(mi)} ${ampm}`;
}
function weekOf(day) { return day <= 7 ? 1 : day <= 14 ? 2 : day <= 21 ? 3 : 4; }
function weekRange(ym, w) { const dim = daysInMonth(ym); return [(w - 1) * 7 + 1, w === 4 ? dim : w * 7]; }

/* Arabic-Indic digits → Latin, comma → dot */
function parseAmount(raw) {
  const s = String(raw || '').trim()
    .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
    .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/٫/g, '.').replace(/,/g, '.').replace(/[^\d.]/g, '');
  const n = parseFloat(s);
  return isFinite(n) ? Math.round(n * 100) / 100 : NaN;
}

/* ---------------- DATA ACCESS ---------------- */
const alive = () => state.entries.filter(e => !e.deleted);
const catById = id => state.cats.find(c => c.id === id) || { id, name: 'Unknown', emoji: '❓', color: '#999', ar: '' };
const scopeMatch = (e, scope) => scope === 'ours' || e.who === scope;

/* Each month keeps its own category list + budgets.
   A new month copies the latest earlier month, so changes roll forward
   but never rewrite history. */
function monthCfg(ym) {
  if (state.months[ym]) return state.months[ym];
  const prev = Object.keys(state.months).filter(k => k < ym).sort().pop();
  const base = prev ? state.months[prev] : { cats: DEFAULT_CATS.map(c => c.id), budgets: { mohamed: {}, marwa: {} } };
  state.months[ym] = { cats: [...base.cats], budgets: JSON.parse(JSON.stringify(base.budgets || { mohamed: {}, marwa: {} })) };
  save();
  return state.months[ym];
}
function budgetsFor(ym, scope) {
  const b = monthCfg(ym).budgets;
  const out = {};
  ['mohamed', 'marwa'].forEach(p => {
    if (scope !== 'ours' && scope !== p) return;
    Object.entries(b[p] || {}).forEach(([cat, v]) => { if (v > 0) out[cat] = (out[cat] || 0) + v; });
  });
  return out;
}

function monthList() {
  const cur = ymOf(new Date());
  let last = cur > START_YM ? cur : START_YM;
  alive().forEach(e => { const ym = e.when.slice(0, 7); if (ym > last) last = ym; });
  const out = [];
  for (let ym = START_YM; ym <= last; ym = addMonths(ym, 1)) out.push(ym);
  return out.reverse();
}
const defaultYM = () => { const cur = ymOf(new Date()); return cur < START_YM ? START_YM : cur; };

function filterEntries({ scope, ym, from = 1, to = 31 }) {
  return alive().filter(e => {
    if (!scopeMatch(e, scope) || e.when.slice(0, 7) !== ym) return false;
    const d = +e.when.slice(8, 10);
    return d >= from && d <= to;
  });
}
const sum = list => list.reduce((a, e) => a + e.amount, 0);

/* ---------------- UI STATE ---------------- */
const ui = {
  view: 'home',
  editingId: null,
  form: { cat: null, pay: 'cash' },
  hist: { scope: 'me', ym: defaultYM(), cat: 'all' },
  stats: { scope: 'me', ym: defaultYM(), period: 'm' },
  more: { ym: defaultYM() }
};
const resolveScope = s => (s === 'me' ? who : s === 'partner' ? partnerOf(who) : 'ours');

function scopeSeg(current, key) {
  const p = PEOPLE[partnerOf(who)];
  const opts = [['me', 'Mine'], ['partner', who === 'mohamed' ? "Marmora's" : "Mohamed's"], ['ours', 'Ours 💞']];
  return `<div class="seg" role="tablist" data-seg="${key}">${opts.map(([v, l]) =>
    `<button type="button" role="tab" aria-selected="${v === current}" class="${v === current ? 'on' : ''}" data-v="${v}">${esc(l)}</button>`).join('')}</div>`;
}
function monthSelect(current, id) {
  return `<select class="select" id="${id}" aria-label="Month">${monthList().map(ym =>
    `<option value="${ym}" ${ym === current ? 'selected' : ''}>${monthName(ym)}</option>`).join('')}</select>`;
}

/* ---------------- ENTRY ROW ---------------- */
function entryRow(e, showWho) {
  const c = catById(e.cat);
  const reacts = Object.values(e.reactions || {}).join('');
  const sub = [timeOf(e.when), e.note ? esc(e.note) : esc(c.ar || '')].filter(Boolean).join(' · ');
  const mystery = e.mystery && !e.explain ? '<span class="tag-mystery">🤨 explain!</span>' : '';
  return `<li class="entry" data-id="${e.id}" role="button" tabindex="0">
    <span class="entry-emo" style="background:${c.color}22">${c.emoji}</span>
    <span class="entry-main">
      <span class="entry-cat">${showWho ? `<span class="who-dot">${PEOPLE[e.who].emoji}</span> ` : ''}${esc(c.name)}${mystery}</span>
      <span class="entry-sub">${sub}</span>
    </span>
    <span class="entry-amt">${money(e.amount, false)}${reacts ? `<small>${reacts}</small>` : ''}</span>
  </li>`;
}

/* ================= HOME ================= */
function renderHome() {
  const me = PEOPLE[who], partner = PEOPLE[partnerOf(who)];
  const ym = defaultYM();
  const today = todayStr();
  const mine = filterEntries({ scope: who, ym });
  const monthTotal = sum(mine);
  const todayTotal = sum(mine.filter(e => e.when.startsWith(today)));
  const nowDay = new Date().getDate();
  const wk = ymOf(new Date()) === ym ? weekOf(nowDay) : 1;
  const [wf, wt] = weekRange(ym, wk);
  const weekTotal = sum(mine.filter(e => { const d = +e.when.slice(8, 10); return d >= wf && d <= wt; }));

  const budget = Object.values(budgetsFor(ym, who)).reduce((a, b) => a + b, 0);
  const pct = budget ? Math.min(100, monthTotal / budget * 100) : 0;

  // no-spend streak (days before today with zero spending, since first entry)
  const myAll = alive().filter(e => e.who === who);
  let streak = 0;
  if (myAll.length) {
    const spendDays = new Set(myAll.map(e => e.when.slice(0, 10)));
    const first = myAll.map(e => e.when.slice(0, 10)).sort()[0];
    const d = new Date();
    if (!spendDays.has(today)) streak = 1;
    if (streak) {
      for (;;) {
        d.setDate(d.getDate() - 1);
        const ds = localInput(d).slice(0, 10);
        if (ds < first || spendDays.has(ds)) break;
        streak++;
      }
    }
  }

  // partner's questions about my purchases
  const asked = alive().filter(e => e.who === who && e.mystery && !e.explain);

  const partnerTotal = sum(filterEntries({ scope: partner.id, ym }));
  const duelTotal = monthTotal + partnerTotal;
  const mePct = duelTotal ? Math.round(monthTotal / duelTotal * 100) : 50;

  const recent = alive().filter(e => e.who === who).sort((a, b) => b.when.localeCompare(a.when)).slice(0, 5);
  const advice = pick(ADVICE);
  const greet = who === 'marwa' ? 'Ahlan ya Marmora 👑' : 'Ahlan ya Basha 🎩';
  const hour = new Date().getHours();
  const sub = hour < 12 ? 'Sabah el fol! Let\'s keep the wallet happy today.' : hour < 18 ? 'Afternoon check-in — how\'s the damage?' : 'Masa el kheir! Time to log today\'s spending.';

  $('#v-home').innerHTML = `
    <div class="hello"><h2>${greet}</h2><p>${sub}</p></div>

    <div class="ticket-total">
      <div class="tt-label">${me.name.toUpperCase()} · ${monthName(ym).toUpperCase()}</div>
      <div class="tt-amount">${money(monthTotal, false)} <small>${CURRENCY}</small></div>
      ${budget ? `
        <div class="meter ${monthTotal > budget ? 'over' : ''}"><i style="width:${pct}%"></i></div>
        <div class="meter-cap"><span>${Math.round(monthTotal / budget * 100)}% of budget</span><span>${monthTotal > budget ? '🚨 over by ' + money(monthTotal - budget) : money(budget - monthTotal) + ' left'}</span></div>`
      : `<div class="meter-cap"><span>No budget yet — set limits in <b>More</b> 🐷</span></div>`}
      <div class="tt-row">
        <div class="mini"><b>${shortMoney(todayTotal)}</b><span>Today</span></div>
        <div class="mini"><b>${shortMoney(weekTotal)}</b><span>Week ${wk}</span></div>
        <div class="mini"><b>${streak}🔥</b><span>No-spend days</span></div>
      </div>
    </div>

    ${asked.length ? `
      <div class="card alert-card" data-go-hist="me">
        <span class="big-emo">🤨</span>
        <div><b>${partner.name} wants an explanation</b><br><span class="small">about ${asked.length} purchase${asked.length > 1 ? 's' : ''}. Tap to defend yourself, ya ${who === 'marwa' ? 'Hanem' : 'Basha'}.</span></div>
      </div>` : ''}

    <div class="card joke-card">
      <span class="joke-tag">NOKTA</span>
      <h3 class="card-title">Joke of the day</h3>
      <p id="jokeText">${esc(pick(JOKES))}</p>
      <button class="btn btn-sm btn-ghost" type="button" id="moreJoke">😂 Another one</button>
    </div>

    <div class="card">
      <h3 class="card-title">Mohamed vs Marmora 🥊</h3>
      <div class="duel">
        <span>🧔🏻‍♂️</span>
        <div class="duel-bar" aria-label="Spending split this month">
          <i style="width:${who === 'mohamed' ? mePct : 100 - mePct}%"></i><i style="width:${who === 'mohamed' ? 100 - mePct : mePct}%"></i>
        </div>
        <span>👸🏻</span>
      </div>
      <p class="duel-cap">${duelLine(who === 'mohamed' ? monthTotal : partnerTotal, who === 'mohamed' ? partnerTotal : monthTotal)}</p>
    </div>

    <div class="card advice-card">
      <h3 class="card-title">Nasiha (advice) 💡</h3>
      <p><span class="ar" lang="ar" dir="rtl">${esc(advice.ar)}</span>${esc(advice.en)}</p>
    </div>

    <div class="card">
      <h3 class="card-title">Latest from ${me.name}</h3>
      ${recent.length ? `<ul class="entries">${recent.map(e => entryRow(e)).join('')}</ul>`
      : `<div class="empty"><div class="big-emo">🪙</div><p>No expenses yet. The wallet is suspiciously calm…</p><button class="btn btn-red" type="button" data-go="add">Add the first one</button></div>`}
    </div>`;

  $('#moreJoke').onclick = () => { $('#jokeText').textContent = pick(JOKES); };
}

function duelLine(mo, ma) {
  if (!mo && !ma) return 'Nobody has spent anything this month (on this phone). A miracle! 🙏';
  if (ma > mo * 1.5) return `Marmora is ahead by ${money(ma - mo)} — investing in the family's happiness. Mohamed, say thank you. 💐`;
  if (mo > ma * 1.5) return `Mohamed is ahead by ${money(mo - ma)}! And HE says Marmora spends a lot? 🤔`;
  return `Neck and neck — ${money(mo)} vs ${money(ma)}. Marmora still wins on style. 👑`;
}

/* ================= ADD ================= */
function renderAddForm() {
  const whenEl = $('#fWhen');
  const ym = (whenEl.value || localInput(new Date())).slice(0, 7);
  const cfg = monthCfg(ym < START_YM ? START_YM : ym);
  let catIds = [...cfg.cats];
  if (ui.form.cat && !catIds.includes(ui.form.cat)) catIds.push(ui.form.cat); // keep editing value visible
  if (ui.form.cat === null || !catIds.includes(ui.form.cat)) ui.form.cat = null;

  $('#catMonthHint').textContent = `· ${monthName(ym < START_YM ? START_YM : ym)} list`;
  $('#catGrid').innerHTML = catIds.map(id => {
    const c = catById(id);
    const on = ui.form.cat === id;
    return `<button type="button" class="cat-btn ${on ? 'on' : ''}" role="radio" aria-checked="${on}" data-cat="${id}"><span class="emo">${c.emoji}</span>${esc(c.name)}</button>`;
  }).join('');

  $('#payChips').innerHTML = PAY_METHODS.map(p =>
    `<button type="button" class="chip ${ui.form.pay === p.id ? 'on' : ''}" role="radio" aria-checked="${ui.form.pay === p.id}" data-pay="${p.id}">${p.label}</button>`).join('');
}

function resetForm() {
  ui.editingId = null;
  ui.form = { cat: null, pay: 'cash' };
  $('#fAmount').value = '';
  $('#fNote').value = '';
  $('#fWhen').value = localInput(new Date());
  $('#formError').textContent = '';
  $('#addTitle').textContent = who === 'marwa' ? 'What did Marmora buy? 🛍️' : 'What did the Basha pay? 💸';
  $('#saveBtn').textContent = '💸 Save it';
  $('#cancelEdit').hidden = true;
  renderAddForm();
}

function startEdit(id) {
  const e = state.entries.find(x => x.id === id);
  if (!e) return;
  go('add', { keepForm: true });
  ui.editingId = id;
  ui.form = { cat: e.cat, pay: e.pay || 'cash' };
  $('#fAmount').value = e.amount;
  $('#fNote').value = e.note || '';
  $('#fWhen').value = e.when;
  $('#formError').textContent = '';
  $('#addTitle').textContent = 'Edit expense ✏️';
  $('#saveBtn').textContent = '💾 Update';
  $('#cancelEdit').hidden = false;
  renderAddForm();
}

function submitForm(ev) {
  ev.preventDefault();
  const amount = parseAmount($('#fAmount').value);
  const when = $('#fWhen').value;
  const err = msg => { $('#formError').textContent = msg; };

  if (!(amount > 0)) return err('Type an amount first, ya habibi. 😉');
  if (amount > 10000000) return err('That number is bigger than the Alexandria port budget. Check it again.');
  if (!when || when.length < 16) return err('Pick a date and time.');
  if (when.slice(0, 7) < START_YM) return err('Floows Box starts on 1 October 2026 — pick a later date.');
  if (when > localInput(new Date(Date.now() + 5 * 60000))) return err('That\'s in the future! Time travel costs extra. ⏳');
  if (!ui.form.cat) return err('Choose a category.');

  const note = $('#fNote').value.trim().slice(0, 80);
  const now = Date.now();
  let entry;
  if (ui.editingId) {
    entry = state.entries.find(x => x.id === ui.editingId);
    Object.assign(entry, { amount, when, cat: ui.form.cat, pay: ui.form.pay, note, updated: now });
  } else {
    entry = { id: uid(), who, amount, when, cat: ui.form.cat, pay: ui.form.pay, note, created: now, updated: now, reactions: {} };
    state.entries.push(entry);
  }
  // make sure the category exists in that month's list
  const cfg = monthCfg(when.slice(0, 7));
  if (!cfg.cats.includes(entry.cat)) cfg.cats.push(entry.cat);
  save();

  const wasEdit = !!ui.editingId;
  kaChing();
  coinRain();
  toast(wasEdit ? 'Updated ✔' : `Saved ${money(amount)}`, wasEdit ? 'All fixed, ya ' + (who === 'marwa' ? 'Hanem.' : 'Basha.') : saveMessage(entry));
  resetForm();
  go(wasEdit ? 'history' : 'home');
}

function saveMessage(e) {
  const ym = e.when.slice(0, 7);
  const budgets = budgetsFor(ym, who);
  if (budgets[e.cat]) {
    const spent = sum(filterEntries({ scope: who, ym }).filter(x => x.cat === e.cat));
    if (spent > budgets[e.cat]) return `🚨 ${catById(e.cat).name} is over budget by ${money(spent - budgets[e.cat])}. ${who === 'marwa' ? 'Relax, Marmora — budgets are just suggestions for queens. 😉' : 'Marmora will hear about this. 👀'}`;
  }
  if (e.amount >= BIG_SPEND) return who === 'marwa' ? 'A big one! 💸 Mohamed, deep breath — she\'s worth every pound. 👑' : 'Big spender alert! And he says Marmora spends a lot? 📝';
  const t = CAT_TOASTS[e.cat];
  return t ? t[who] : pick(JOKES);
}

/* ================= HISTORY ================= */
function renderHistory() {
  const h = ui.hist;
  const scope = resolveScope(h.scope);
  const cfg = monthCfg(h.ym);
  let list = filterEntries({ scope, ym: h.ym });
  const usedCats = [...new Set([...cfg.cats, ...list.map(e => e.cat)])];
  if (h.cat !== 'all') list = list.filter(e => e.cat === h.cat);
  list.sort((a, b) => b.when.localeCompare(a.when));

  const groups = {};
  list.forEach(e => { (groups[e.when.slice(0, 10)] ||= []).push(e); });
  const showWho = scope === 'ours';

  $('#v-history').innerHTML = `
    <h2 class="sec-title">History<small>${scope === 'ours' ? 'MOHAMED + MARMORA' : PEOPLE[scope].name.toUpperCase() + "'S RECEIPTS"}</small></h2>
    ${scopeSeg(h.scope, 'hist')}
    <div class="filters">
      ${monthSelect(h.ym, 'histMonth')}
      <select class="select" id="histCat" aria-label="Category filter">
        <option value="all">All categories</option>
        ${usedCats.map(id => { const c = catById(id); return `<option value="${id}" ${h.cat === id ? 'selected' : ''}>${c.emoji} ${esc(c.name)}</option>`; }).join('')}
      </select>
    </div>
    <div class="card">
      <div class="day-head" style="border:0;padding-top:0"><span>${list.length} EXPENSE${list.length === 1 ? '' : 'S'}</span><b>${money(sum(list))}</b></div>
      ${list.length ? Object.entries(groups).map(([day, items]) => `
        <div class="day-block">
          <div class="day-head"><span>${prettyDay(day)}</span><b>${money(sum(items))}</b></div>
          <ul class="entries">${items.map(e => entryRow(e, showWho)).join('')}</ul>
        </div>`).join('')
      : `<div class="empty"><div class="big-emo">🧾</div><p>Nothing here. Either very disciplined… or very forgetful. 🤔</p></div>`}
    </div>`;

  $('#histMonth').onchange = ev => { h.ym = ev.target.value; h.cat = 'all'; renderHistory(); };
  $('#histCat').onchange = ev => { h.cat = ev.target.value; renderHistory(); };
}

/* ================= ANALYSIS ================= */
function renderStats() {
  const s = ui.stats;
  const scope = resolveScope(s.scope);
  const ym = s.ym;
  const dim = daysInMonth(ym);
  const [from, to] = s.period === 'm' ? [1, dim] : weekRange(ym, +s.period.slice(1));
  const list = filterEntries({ scope, ym, from, to });
  const total = sum(list);
  const cfg = monthCfg(ym);

  // per category
  const byCat = {};
  list.forEach(e => { byCat[e.cat] = (byCat[e.cat] || 0) + e.amount; });
  const cats = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  const biggest = cats[0], lowest = cats[cats.length - 1];
  const zero = cfg.cats.filter(id => !byCat[id]);

  // days elapsed in period
  const cur = ymOf(new Date());
  let days = to - from + 1;
  if (ym === cur) days = Math.max(0, Math.min(to, new Date().getDate()) - from + 1);
  if (ym > cur) days = 0;
  const avg = days ? total / days : 0;

  const top = list.slice().sort((a, b) => b.amount - a.amount)[0];
  const byDay = {};
  list.forEach(e => { const d = e.when.slice(0, 10); byDay[d] = (byDay[d] || 0) + e.amount; });
  const busiest = Object.entries(byDay).sort((a, b) => b[1] - a[1])[0];

  // weeks
  const weeks = [1, 2, 3, 4].map(w => { const [a, b] = weekRange(ym, w); return sum(filterEntries({ scope, ym, from: a, to: b })); });
  const wMax = Math.max(...weeks, 1);

  // vs previous month
  let vsPrev = '';
  if (s.period === 'm' && ym > START_YM) {
    const prev = sum(filterEntries({ scope, ym: addMonths(ym, -1) }));
    if (prev) {
      const diff = (total - prev) / prev * 100;
      vsPrev = `${diff >= 0 ? '▲' : '▼'} ${Math.abs(Math.round(diff))}% vs ${monthShort(addMonths(ym, -1))}`;
    }
  }

  // donut (top 5 + others)
  const slices = cats.slice(0, 5).map(([id, v]) => ({ label: catById(id).emoji + ' ' + catById(id).name, v, color: catById(id).color }));
  const rest = cats.slice(5).reduce((a, [, v]) => a + v, 0);
  if (rest) slices.push({ label: '➕ Others', v: rest, color: '#BBA79C' });
  let acc = 0;
  const grad = slices.map(sl => { const a = acc / total * 360; acc += sl.v; return `${sl.color} ${a}deg ${acc / total * 360}deg`; }).join(',');

  const budgets = s.period === 'm' ? budgetsFor(ym, scope) : {};
  const barMax = Math.max(...cats.map(([, v]) => v), 1);
  const periodLabel = s.period === 'm' ? monthName(ym) : `Week ${s.period.slice(1)} · ${monthShort(ym)} ${from}–${to}`;

  // duel inside period (Ours only)
  const mo = sum(list.filter(e => e.who === 'mohamed')), ma = sum(list.filter(e => e.who === 'marwa'));

  $('#v-stats').innerHTML = `
    <h2 class="sec-title">Analysis<small>${esc(periodLabel.toUpperCase())}</small></h2>
    ${scopeSeg(s.scope, 'stats')}
    <div class="filters">${monthSelect(ym, 'statsMonth')}</div>
    <div class="period-chips" role="tablist" aria-label="Period">
      ${[1, 2, 3, 4].map(w => { const [a, b] = weekRange(ym, w); return `<button type="button" class="chip ${s.period === 'w' + w ? 'on' : ''}" data-period="w${w}">W${w}<small>${a}–${b}</small></button>`; }).join('')}
      <button type="button" class="chip ${s.period === 'm' ? 'on' : ''}" data-period="m">Month<small>${monthShort(ym)}</small></button>
    </div>

    ${!list.length ? `<div class="card empty"><div class="big-emo">🦗</div><p>No spending in this period${scope === 'ours' ? '' : ' for ' + PEOPLE[scope].name}. The wallet is sleeping peacefully.</p><button class="btn btn-red" type="button" data-go="add">Add an expense</button></div>` : `

    <div class="kpis">
      <div class="kpi kpi--wide"><div class="k">TOTAL SPENT</div><div class="v" style="font-size:28px">${money(total)}</div><div class="s">${list.length} expenses${vsPrev ? ' · ' + vsPrev : ''}</div></div>
      <div class="kpi kpi--hi"><span class="emo-big">${catById(biggest[0]).emoji}</span><div class="k">BIGGEST CATEGORY</div><div class="v">${money(biggest[1], false)}</div><div class="s">${esc(catById(biggest[0]).name)} · ${Math.round(biggest[1] / total * 100)}%</div></div>
      <div class="kpi kpi--lo"><span class="emo-big">${catById(lowest[0]).emoji}</span><div class="k">LOWEST CATEGORY</div><div class="v">${money(lowest[1], false)}</div><div class="s">${esc(catById(lowest[0]).name)} · ${Math.round(lowest[1] / total * 100)}%</div></div>
      <div class="kpi"><div class="k">DAILY AVERAGE</div><div class="v">${days ? money(Math.round(avg), false) : '—'}</div><div class="s">over ${days} day${days === 1 ? '' : 's'}</div></div>
      <div class="kpi"><div class="k">BIGGEST SINGLE</div><div class="v">${money(top.amount, false)}</div><div class="s">${catById(top.cat).emoji} ${prettyDay(top.when.slice(0, 10)).toLowerCase()}</div></div>
      ${busiest ? `<div class="kpi kpi--wide"><div class="k">MOST EXPENSIVE DAY</div><div class="v">${money(busiest[1])}</div><div class="s">${prettyDay(busiest[0])}</div></div>` : ''}
    </div>

    <div class="card verdict">
      <h3 class="card-title">The verdict ⚖️</h3>
      <p>${esc(verdict(biggest[0], scope, total, budgets))}</p>
    </div>

    <div class="card">
      <h3 class="card-title">Where did it go?</h3>
      <div class="donut-wrap">
        <div class="donut" style="background:conic-gradient(${grad})"><div class="donut-center"><small>TOTAL</small>${shortMoney(total)}</div></div>
        <ul class="legend">${slices.map(sl => `<li><i style="background:${sl.color}"></i><span>${esc(sl.label)}</span><b>${Math.round(sl.v / total * 100)}%</b></li>`).join('')}</ul>
      </div>
    </div>

    <div class="card">
      <h3 class="card-title">By category</h3>
      <div class="bars">
        ${cats.map(([id, v]) => {
          const c = catById(id), b = budgets[id];
          const over = b && v > b;
          return `<div class="bar-row">
            <span class="bl">${c.emoji} ${esc(c.name)}</span><span class="bv">${money(v, false)}</span>
            <div class="bar-track"><i style="width:${(v / barMax * 100).toFixed(1)}%;background:${c.color}"></i></div>
            ${b ? `<span class="bar-budget ${over ? 'over' : ''}">${over ? '🚨 over budget by ' + money(v - b) : Math.round(v / b * 100) + '% of ' + money(b) + ' budget'}</span>` : ''}
          </div>`;
        }).join('')}
      </div>
    </div>`}

    <div class="card">
      <h3 class="card-title">Week by week · ${monthShort(ym)}</h3>
      <div class="weekbars">
        ${weeks.map((v, i) => `<div class="wb ${s.period === 'w' + (i + 1) || s.period === 'm' ? 'on' : ''}" data-period="w${i + 1}" role="button" tabindex="0">
          <span class="wb-val">${shortMoney(v)}</span>
          <span class="wb-bar" style="height:${Math.max(3, v / wMax * 100)}%"></span>
          <span class="wb-lbl">W${i + 1}</span></div>`).join('')}
      </div>
      <p class="small muted center" style="margin:10px 0 0">Month total: <b class="num">${money(weeks.reduce((a, b) => a + b, 0))}</b></p>
    </div>

    ${scope === 'ours' && list.length ? `
    <div class="card">
      <h3 class="card-title">Who spent more? 🥊</h3>
      <div class="duel">
        <span>🧔🏻‍♂️</span>
        <div class="duel-bar"><i style="width:${total ? mo / total * 100 : 50}%"></i><i style="width:${total ? ma / total * 100 : 50}%"></i></div>
        <span>👸🏻</span>
      </div>
      <p class="duel-cap">Mohamed <b>${money(mo)}</b> · Marmora <b>${money(ma)}</b><br>${esc(duelLine(mo, ma))}</p>
    </div>` : ''}

    ${list.length && zero.length ? `
    <div class="card">
      <h3 class="card-title">Untouched categories 🏅</h3>
      <p class="small muted" style="margin:0 0 10px">Zero spent here this period. Frame it on the fridge.</p>
      <div class="zero-cats">${zero.map(id => `<span>${catById(id).emoji} ${esc(catById(id).name)}</span>`).join('')}</div>
    </div>` : ''}`;

  $('#statsMonth').onchange = ev => { s.ym = ev.target.value; renderStats(); };
}

function verdict(catId, scope, total, budgets) {
  const c = catById(catId);
  const name = scope === 'ours' ? 'The couple' : PEOPLE[scope].name;
  const lines = {
    clothes: `Clothes on top — someone in this house has style. (Hint: it's not Mohamed.) 👗`,
    beauty: `Beauty & coiffeur wins! Glowing — and worth every single pound. 💅`,
    delivery: `Talabat is winning. Mohamed, maybe it's time you learned to cook? 🛵`,
    cafe: `Ahwa & cafés on top. Mohamed, we all know this is you. ☕`,
    groceries: `The supermarket wins — a responsible household. Teta would be proud. 🛒`,
    market: `Veg & meat lead the list. Healthy wallet? No. Healthy family? Yes. 🥬`,
    fish: `Fish on top! The most Alexandrian result possible. 🐟🌊`,
    rent: `Rent leads — normal. The bawab says thank you. 🏠`,
    baby: `Baby Adel is already the biggest spender in the family. Classic. 👶`,
    transport: `Transport wins. Maybe it's time to befriend the tram again. 🚋`,
    outings: `Outings on top — living the Corniche dream. Just not every day. 🌅`,
    occasions: `Occasions season! Weddings and Eid don't pay for themselves. 🌙`,
    family: `Family & gifts on top — generous hearts, light wallets. 🎁`,
    restaurants: `Restaurants lead. Even queens deserve a night off cooking. 🍽️`,
    fuel: `Benzine wins. Mohamed, the ahwa is walkable. ⛽`,
    gam3eya: `Savings are the biggest category — whoever did this deserves a medal. 🏅`
  };
  const overCats = Object.keys(budgets).filter(id => sum(filterEntries({ scope, ym: ui.stats.ym }).filter(e => e.cat === id)) > budgets[id]);
  if (overCats.length) return `${lines[catId] || ''} Also: ${overCats.map(id => catById(id).name).join(', ')} went over budget. 🚨 Emergency family meeting with tea.`.trim();
  return lines[catId] || `${c.emoji} ${c.name} took the biggest bite this time. Keep an eye on it next week!`;
}

/* ================= 3ABELO W ADELOO (one-tap expenses) ================= */
const quickUi = { editing: false };

function renderQuick() {
  const curYM = ymOf(new Date());
  const tpls = state.templates.filter(t => !t.deleted);
  const tile = t => {
    const c = catById(t.cat);
    const done = alive().filter(e => e.tpl === t.id && e.when.slice(0, 7) === curYM).sort((a, b) => a.when.localeCompare(b.when));
    const last = done[done.length - 1];
    const badge = last
      ? `<span class="qt-badge">✓ ${done.length > 1 ? done.length + '× · ' : ''}${prettyDay(last.when.slice(0, 10)).toLowerCase()} · ${PEOPLE[last.who].name}</span>`
      : `<span class="qt-badge qt-badge--todo">Not added this month</span>`;
    return `<button type="button" class="quick-tile ${last ? 'is-done' : ''}" data-tpl="${t.id}">
      ${quickUi.editing ? '<span class="qt-edit">✏️ edit</span>' : ''}
      <span class="qt-emo">${esc(t.emoji || c.emoji)}</span>
      <span class="qt-name">${esc(t.name)}</span>
      <span class="qt-amt">${money(t.amount)}</span>
      <span class="qt-cat">${c.emoji} ${esc(c.name)}</span>
      ${badge}
    </button>`;
  };

  $('#v-quick').innerHTML = `
    <h2 class="sec-title">3abelo w Adeloo<small>ONE TAP = ONE EXPENSE</small></h2>
    <p class="quick-hint">${quickUi.editing
      ? '✏️ Edit mode — tap a card to change its name, amount or category.'
      : `Tap a card and it's saved instantly as <b>${PEOPLE[who].name}</b>, dated <b>right now</b>. Wrong tap? Hit <b>Undo</b>.`}</p>
    <div class="quick-grid">
      ${tpls.map(tile).join('')}
      <button type="button" class="quick-tile quick-tile--new" id="tplNew"><span class="qt-emo">➕</span><span class="qt-name">New quick expense</span></button>
    </div>
    <button type="button" class="btn ${quickUi.editing ? 'btn-red' : 'btn-ghost'} btn-block" id="quickEditBtn">${quickUi.editing ? '✔ Done editing' : '✏️ Edit the list'}</button>`;

  $$('#v-quick [data-tpl]').forEach(b => b.onclick = () => (quickUi.editing ? openTemplate(b.dataset.tpl) : quickAdd(b.dataset.tpl)));
  $('#tplNew').onclick = () => openTemplate(null);
  $('#quickEditBtn').onclick = () => { quickUi.editing = !quickUi.editing; renderQuick(); };
}

function quickAdd(id) {
  const t = state.templates.find(x => x.id === id && !x.deleted);
  if (!t) return;
  const when = localInput(new Date());
  if (when.slice(0, 7) < START_YM) return toast('Too early', 'Floows Box starts on 1 October 2026.');
  const before = alive().filter(e => e.tpl === id && e.when.slice(0, 7) === when.slice(0, 7));
  if (before.length && !confirm(`${t.name} was already added this month. Add it again?`)) return;

  const now = Date.now();
  const entry = { id: uid(), who, amount: t.amount, when, cat: t.cat, pay: t.pay || 'cash', note: t.name, tpl: id, created: now, updated: now, reactions: {} };
  state.entries.push(entry);
  const cfg = monthCfg(when.slice(0, 7));
  if (!cfg.cats.includes(t.cat)) cfg.cats.push(t.cat);
  save();
  kaChing();
  coinRain();
  renderQuick();
  toast(`Saved ${money(t.amount)}`, `${t.emoji || ''} ${t.name} — ${saveMessage(entry)}`, {
    label: '↩ Undo',
    fn: () => {
      entry.deleted = true; entry.updated = Date.now(); save(); render();
      toast('Undone', 'Like it never happened. 🤫');
    }
  });
}

function openTemplate(id) {
  const t = id ? state.templates.find(x => x.id === id) : null;
  const catIds = [...monthCfg(defaultYM()).cats];
  if (t && !catIds.includes(t.cat)) catIds.push(t.cat);
  const sel = t ? t.cat : 'groceries';
  openSheet(`
    <h3 class="card-title">${t ? 'Edit quick expense' : 'New quick expense'}</h3>
    <form id="tplForm" class="form" autocomplete="off" novalidate>
      <label class="lbl" for="tName">NAME</label>
      <input class="input" id="tName" maxlength="40" placeholder="e.g. Monthly rice & oil" value="${t ? esc(t.name) : ''}">
      <label class="lbl" for="tAmount">AMOUNT (${CURRENCY})</label>
      <input class="input" id="tAmount" type="text" inputmode="decimal" placeholder="0" value="${t ? t.amount : ''}">
      <label class="lbl" for="tCat">CATEGORY</label>
      <select class="select" id="tCat" style="width:100%">
        ${catIds.map(cid => { const c = catById(cid); return `<option value="${cid}" ${cid === sel ? 'selected' : ''}>${c.emoji} ${esc(c.name)}</option>`; }).join('')}
      </select>
      <label class="lbl" for="tEmoji">EMOJI <span class="lbl-hint">(optional)</span></label>
      <input class="input" id="tEmoji" maxlength="4" placeholder="🍚" value="${t ? esc(t.emoji || '') : ''}">
      <label class="lbl">PAID WITH</label>
      <div class="chip-row" id="tPay">${PAY_METHODS.map(p => `<button type="button" class="chip ${((t && t.pay) || 'cash') === p.id ? 'on' : ''}" data-tpay="${p.id}">${p.label}</button>`).join('')}</div>
      <p class="form-error" id="tErr" role="alert"></p>
      <div class="form-actions">
        ${t ? '<button type="button" class="btn btn-ghost" id="tDel">🗑 Delete</button>' : ''}
        <button type="submit" class="btn btn-big">💾 Save</button>
      </div>
    </form>`);

  let pay = (t && t.pay) || 'cash';
  $('#tPay').onclick = ev => {
    const b = ev.target.closest('[data-tpay]'); if (!b) return;
    pay = b.dataset.tpay;
    $$('#tPay .chip').forEach(x => x.classList.toggle('on', x === b));
  };
  $('#tplForm').onsubmit = ev => {
    ev.preventDefault();
    const name = $('#tName').value.trim();
    const amount = parseAmount($('#tAmount').value);
    if (!name) return ($('#tErr').textContent = 'Give it a name.');
    if (!(amount > 0)) return ($('#tErr').textContent = 'Type the amount.');
    const data = { name, amount, cat: $('#tCat').value, emoji: $('#tEmoji').value.trim(), pay, updated: Date.now() };
    if (t) Object.assign(t, data);
    else state.templates.push({ id: 't_' + uid(), ...data });
    save(); closeSheet(); renderQuick();
    toast('Saved ✔', `${data.emoji || catById(data.cat).emoji} ${name} is ready for one-tap.`);
  };
  const del = $('#tDel');
  if (del) del.onclick = () => {
    if (!confirm(`Remove “${t.name}” from 3abelo w Adeloo? (Past expenses stay.)`)) return;
    t.deleted = true; t.updated = Date.now();
    save(); closeSheet(); renderQuick();
  };
}

/* ================= MORE ================= */
function renderMore() {
  const m = ui.more;
  const cfg = monthCfg(m.ym);
  const myB = (cfg.budgets[who] ||= {});
  const hidden = state.cats.filter(c => !cfg.cats.includes(c.id));
  const totalBudget = Object.values(myB).reduce((a, b) => a + (+b || 0), 0);
  const me = PEOPLE[who];

  $('#v-more').innerHTML = `
    <h2 class="sec-title">More<small>SETTINGS · CATEGORIES · BACKUP</small></h2>

    <div class="card">
      <h3 class="card-title">Signed in as ${me.emoji} ${me.name}</h3>
      <p class="small muted" style="margin:0 0 12px">Each person has their own history on this phone. Switch any time.</p>
      <button class="btn btn-red btn-block" type="button" id="switchWho">🔄 Switch to ${PEOPLE[partnerOf(who)].name}</button>
      <button class="btn btn-ghost btn-block" type="button" id="soundBtn" style="margin-top:10px">${soundOn ? '🔊 Ka-ching sound: ON' : '🔇 Ka-ching sound: OFF'}</button>
    </div>

    <div class="card">
      <h3 class="card-title">Categories &amp; budgets</h3>
      <p class="small muted" style="margin:0 0 10px">Every month has its own category list. A new month starts as a copy of the one before, so changes here never rewrite older months. Budgets below are <b>${me.name}'s</b> monthly limits.</p>
      <div class="filters">${monthSelect(m.ym, 'moreMonth')}</div>
      <ul class="list-plain">
        ${cfg.cats.map(id => { const c = catById(id); return `
          <li class="cat-row">
            <span class="emo">${c.emoji}</span>
            <span class="nm">${esc(c.name)}<small lang="ar">${esc(c.ar || '')}</small></span>
            <input type="text" inputmode="decimal" placeholder="limit" value="${myB[id] || ''}" data-budget="${id}" aria-label="Monthly budget for ${esc(c.name)}">
            <button class="icon-btn" type="button" data-hide="${id}" aria-label="Remove ${esc(c.name)} from this month"><svg><use href="#i-close"/></svg></button>
          </li>`; }).join('')}
      </ul>
      <p class="small" style="margin:10px 0 0"><b>Total budget:</b> <span class="num">${money(totalBudget)}</span></p>

      ${hidden.length ? `<p class="pixel" style="color:var(--red);margin:16px 0 8px">ADD BACK</p>
        <div class="chip-row">${hidden.map(c => `<button type="button" class="chip" data-show="${c.id}">${c.emoji} ${esc(c.name)}</button>`).join('')}</div>` : ''}

      <p class="pixel" style="color:var(--red);margin:16px 0 0">NEW CATEGORY FOR ${esc(monthShort(m.ym).toUpperCase())}</p>
      <form class="new-cat" id="newCatForm" autocomplete="off">
        <input class="input emoji-in" id="ncEmoji" maxlength="4" placeholder="🎈" aria-label="Emoji">
        <input class="input" id="ncName" maxlength="28" placeholder="e.g. Gym, Driving lessons" aria-label="Category name">
        <button class="btn btn-sm" type="submit">Add</button>
      </form>
    </div>

    <div class="card">
      <h3 class="card-title">Backup &amp; share 💾</h3>
      <p class="small muted" style="margin:0 0 12px">Your data is saved only in this phone's browser. To see <b>Ours 💞</b> with both people's spending, send your backup to your partner (WhatsApp works) and they tap <b>Import</b> — entries are merged, nothing is duplicated.</p>
      <div class="row-actions">
        <button class="btn" type="button" id="exportBtn">⬆️ Send backup</button>
        <button class="btn btn-ghost" type="button" id="importBtn">⬇️ Import</button>
      </div>
      <input type="file" id="importFile" accept="application/json,.json" hidden>
      <p class="small muted" style="margin:12px 0 0">${alive().length} expenses stored on this phone.</p>
    </div>

    <div class="card">
      <h3 class="card-title">Borrowed from the big apps ✨</h3>
      <ul class="feature-list">
        <li><b>Partner mode</b> (Origin) — Mine / Hers / Ours switch everywhere.</li>
        <li><b>Monthly category limits</b> (Honeydue) — budget meters &amp; over-budget alerts.</li>
        <li><b>🤨 “Explain this!”</b> (Honeydue) — ask about mysterious purchases.</li>
        <li><b>Emoji reactions</b> (Honeydue) — react to each other's spending.</li>
        <li><b>Weekly overview</b> (Spendee) — W1–W4 breakdown &amp; comparison.</li>
        <li><b>Who spent more</b> (Splitwise-style) — the Mohamed vs Marmora duel.</li>
        <li><b>No-spend streak</b> 🔥 — count days without spending.</li>
      </ul>
    </div>

    <div class="card joke-card">
      <span class="joke-tag">FINE PRINT</span>
      <p style="margin:0">No financial advice here — only Egyptian wisdom and marital comedy. Marmora reserves the right to call any purchase “an investment”. 🙂</p>
      <p class="pixel" style="margin:10px 0 0">FLOOWS BOX V${APP_VERSION}</p>
    </div>`;

  $('#moreMonth').onchange = ev => { m.ym = ev.target.value; renderMore(); };
  $('#switchWho').onclick = () => setWho(partnerOf(who));
  $('#soundBtn').onclick = () => {
    soundOn = !soundOn;
    store(SOUND_KEY, soundOn ? 'on' : 'off');
    renderMore();
    kaChing();
  };
  $$('[data-budget]').forEach(inp => inp.addEventListener('change', () => {
    const v = parseAmount(inp.value);
    if (v > 0) myB[inp.dataset.budget] = v; else delete myB[inp.dataset.budget];
    save(); renderMore();
  }));
  $$('[data-hide]').forEach(b => b.onclick = () => {
    cfg.cats = cfg.cats.filter(id => id !== b.dataset.hide);
    save(); renderMore();
  });
  $$('[data-show]').forEach(b => b.onclick = () => { cfg.cats.push(b.dataset.show); save(); renderMore(); });
  $('#newCatForm').onsubmit = ev => {
    ev.preventDefault();
    const name = $('#ncName').value.trim();
    if (!name) return;
    const emoji = $('#ncEmoji').value.trim() || '🏷️';
    const existing = state.cats.find(c => c.name.toLowerCase() === name.toLowerCase());
    const id = existing ? existing.id : 'c_' + uid();
    if (!existing) state.cats.push({ id, name, ar: '', emoji, color: PALETTE[state.cats.length % PALETTE.length], custom: true });
    if (!cfg.cats.includes(id)) cfg.cats.push(id);
    save(); renderMore();
    toast('New category', `${emoji} ${name} added to ${monthName(m.ym)}.`);
  };
  $('#exportBtn').onclick = exportData;
  $('#importBtn').onclick = () => $('#importFile').click();
  $('#importFile').onchange = importData;
}

/* ---------------- BACKUP ---------------- */
async function exportData() {
  const payload = JSON.stringify({ app: 'fulusbox', v: 1, by: who, exported: new Date().toISOString(), data: state });
  const name = `floows-box-${PEOPLE[who].name.toLowerCase()}-${todayStr()}.json`;
  const blob = new Blob([payload], { type: 'application/json' });
  try {
    const file = new File([blob], name, { type: 'application/json' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: 'Floows Box backup' });
      return;
    }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

function importData(ev) {
  const file = ev.target.files && ev.target.files[0];
  ev.target.value = '';
  if (!file) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      const pkg = JSON.parse(r.result);
      const inc = pkg && pkg.app === 'fulusbox' ? pkg.data : null;
      if (!inc || !Array.isArray(inc.entries)) throw new Error('bad');
      let added = 0, updated = 0;
      inc.entries.forEach(e => {
        if (!e || !e.id || !PEOPLE[e.who] || !(e.amount > 0) || typeof e.when !== 'string') return;
        const mine = state.entries.find(x => x.id === e.id);
        if (!mine) { state.entries.push(e); added++; }
        else if ((e.updated || 0) > (mine.updated || 0)) { Object.assign(mine, e); updated++; }
      });
      (inc.templates || []).forEach(t => {
        if (!t || !t.id) return;
        const local = state.templates.find(x => x.id === t.id);
        if (!local) state.templates.push(t);
        else if ((t.updated || 0) > (local.updated || 0)) Object.assign(local, t);
      });
      (inc.cats || []).forEach(c => { if (c && c.id && !state.cats.find(x => x.id === c.id)) state.cats.push(c); });
      Object.entries(inc.months || {}).forEach(([ym, m]) => {
        const local = state.months[ym];
        if (!local) { state.months[ym] = m; return; }
        (m.cats || []).forEach(id => { if (!local.cats.includes(id)) local.cats.push(id); });
        if (PEOPLE[pkg.by] && m.budgets && m.budgets[pkg.by]) local.budgets[pkg.by] = m.budgets[pkg.by];
      });
      save();
      toast('Import done 🎉', `${added} new, ${updated} updated. Check “Ours 💞” in Analysis.`);
      render();
    } catch (e) {
      toast('Oops', 'That file is not a Floows Box backup.');
    }
  };
  r.readAsText(file);
}

/* ---------------- ENTRY SHEET ---------------- */
function openEntry(id) {
  const e = state.entries.find(x => x.id === id);
  if (!e) return;
  const c = catById(e.cat);
  const isMine = e.who === who;
  const owner = PEOPLE[e.who];
  const myReact = (e.reactions || {})[who];
  const pay = PAY_METHODS.find(p => p.id === e.pay);
  const reacts = Object.entries(e.reactions || {}).map(([p, emo]) => `${PEOPLE[p].name} ${emo}`).join(' · ');

  let explainHtml = '';
  if (e.mystery && !isMine && !e.explain) explainHtml = `<div class="explain-box"><p>🤨 You asked ${owner.name} to explain this one. Waiting for the defence…</p></div>`;
  if (e.mystery && isMine && !e.explain) explainHtml = `<div class="explain-box"><p><b>${PEOPLE[partnerOf(who)].name} wants an explanation!</b> Make it convincing.</p><textarea id="explainIn" maxlength="200" placeholder="It was on sale, I swear… 🙏"></textarea><button class="btn btn-sm btn-red" type="button" id="explainSave" style="margin-top:8px">Send explanation</button></div>`;
  if (e.explain) explainHtml = `<div class="explain-box"><p><b>${owner.name}'s defence:</b></p><p style="margin:0">“${esc(e.explain)}”</p></div>`;

  openSheet(`
    <div class="sheet-hero">
      <div class="emo">${c.emoji}</div>
      <div class="amt">${money(e.amount)}</div>
      <div class="cat">${esc(c.name)}</div>
    </div>
    <dl class="sheet-meta">
      <dt>WHO</dt><dd>${owner.emoji} ${owner.name}</dd>
      <dt>WHEN</dt><dd>${prettyDay(e.when.slice(0, 10)).toLowerCase()} · ${timeOf(e.when)}</dd>
      <dt>PAID</dt><dd>${pay ? pay.label : '—'}</dd>
      ${e.note ? `<dt>NOTE</dt><dd>${esc(e.note)}</dd>` : ''}
      ${reacts ? `<dt>REACTS</dt><dd>${esc(reacts)}</dd>` : ''}
    </dl>
    <p class="pixel" style="color:var(--red);margin:0 0 8px">REACT</p>
    <div class="reacts">${REACTIONS.map(r => `<button class="react ${myReact === r ? 'on' : ''}" type="button" data-react="${r}" aria-label="React ${r}">${r}</button>`).join('')}</div>
    ${explainHtml}
    ${isMine
      ? `<div class="row-actions"><button class="btn" type="button" id="editE"><svg class="ic-sm"><use href="#i-pen"/></svg> Edit</button><button class="btn btn-ghost" type="button" id="delE"><svg class="ic-sm"><use href="#i-trash"/></svg> Delete</button></div>`
      : (!e.mystery ? `<button class="btn btn-red btn-block" type="button" id="askE">🤨 Explain this, ${owner.name}!</button>` : '')}
  `);

  $$('[data-react]').forEach(b => b.onclick = () => {
    e.reactions = e.reactions || {};
    if (e.reactions[who] === b.dataset.react) delete e.reactions[who]; else e.reactions[who] = b.dataset.react;
    e.updated = Date.now(); save(); render(); openEntry(id);
  });
  const edit = $('#editE'); if (edit) edit.onclick = () => { closeSheet(); startEdit(id); };
  const del = $('#delE'); if (del) del.onclick = () => {
    if (!confirm(`Delete ${money(e.amount)} — ${c.name}?`)) return;
    e.deleted = true; e.updated = Date.now(); save(); closeSheet(); render();
    toast('Deleted 🗑️', 'Gone like a salary on the 2nd of the month.');
  };
  const ask = $('#askE'); if (ask) ask.onclick = () => {
    e.mystery = true; e.askedBy = who; e.updated = Date.now(); save(); render(); openEntry(id);
    toast('Question sent 🤨', `${owner.name} will see it here — or after you send them your backup.`);
  };
  const exp = $('#explainSave'); if (exp) exp.onclick = () => {
    const t = $('#explainIn').value.trim();
    if (!t) return;
    e.explain = t.slice(0, 200); e.updated = Date.now(); save(); render(); openEntry(id);
  };
}

function openSheet(html) {
  $('#sheetBody').innerHTML = html;
  $('#sheet').hidden = false; $('#sheetBackdrop').hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeSheet() {
  $('#sheet').hidden = true; $('#sheetBackdrop').hidden = true;
  document.body.style.overflow = '';
}

/* ---------------- TOAST & COINS ---------------- */
let toastTimer;
function toast(title, msg, action) {
  const t = $('#toast');
  t.innerHTML = `<b>${esc(title)}</b>${esc(msg)}${action ? `<button type="button" class="toast-action">${esc(action.label)}</button>` : ''}`;
  if (action) t.querySelector('.toast-action').onclick = () => { t.hidden = true; action.fn(); };
  t.hidden = false;
  t.style.animation = 'none'; void t.offsetWidth; t.style.animation = '';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, action ? 6000 : 4200);
}
/* "Ka-ching!" cash-register sound, generated live (no audio file needed) */
const SOUND_KEY = 'fulusbox.sound';
let soundOn = load(SOUND_KEY) !== 'off';
let audioCtx = null;
function kaChing() {
  if (!soundOn) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const ac = audioCtx, t0 = ac.currentTime + 0.02;
    const out = ac.createGain();
    out.gain.value = 0.55;
    out.connect(ac.destination);

    // 1) drawer "chunk": short filtered noise burst
    const len = Math.floor(ac.sampleRate * 0.09);
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    const noise = ac.createBufferSource();
    noise.buffer = buf;
    const bp = ac.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 0.8;
    noise.connect(bp); bp.connect(out);
    noise.start(t0);

    // 2) two bright bell "chings"
    const bell = (start, base) => {
      [1, 2.76, 5.4].forEach((mult, i) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = 'sine';
        o.frequency.value = base * mult;
        const peak = [0.35, 0.16, 0.07][i];
        g.gain.setValueAtTime(0.0001, start);
        g.gain.exponentialRampToValueAtTime(peak, start + 0.006);
        g.gain.exponentialRampToValueAtTime(0.0001, start + 0.9 - i * 0.2);
        o.connect(g); g.connect(out);
        o.start(start); o.stop(start + 1);
      });
    };
    bell(t0 + 0.07, 1568);   // G6
    bell(t0 + 0.17, 2093);   // C7
  } catch (e) { /* sound is optional */ }
}

function coinRain() {
  const box = $('#coinRain');
  const items = ['🪙', '💵', '💸', '🪙', '💰'];
  for (let i = 0; i < 16; i++) {
    const s = document.createElement('span');
    s.textContent = pick(items);
    s.style.left = Math.random() * 100 + 'vw';
    s.style.animationDelay = Math.random() * .5 + 's';
    s.style.fontSize = 18 + Math.random() * 16 + 'px';
    box.appendChild(s);
    setTimeout(() => s.remove(), 2400);
  }
}

/* ---------------- NAV ---------------- */
function go(view, opts = {}) {
  ui.view = view;
  $$('.view').forEach(v => { v.hidden = v.dataset.view !== view; });
  $$('.tab').forEach(t => t.classList.toggle('on', t.dataset.go === view));
  if (view !== 'add') ui.editingId = null;
  if (view === 'add' && !opts.keepForm) resetForm();
  render();
  window.scrollTo(0, 0);
}
function render() {
  if (!who) return;
  const p = PEOPLE[who];
  $('#whoChipEmoji').textContent = p.emoji;
  $('#whoChipName').textContent = p.name;
  if (ui.view === 'home') renderHome();
  if (ui.view === 'history') renderHistory();
  if (ui.view === 'stats') renderStats();
  if (ui.view === 'more') renderMore();
  if (ui.view === 'quick') renderQuick();
}

function setWho(id) {
  who = id;
  store(WHO_KEY, id);
  $('#welcome').hidden = true;
  $('#app').hidden = false;
  ui.editingId = null;
  go('home');
  toast(id === 'marwa' ? 'Ahlan Marmora 👑' : 'Ahlan ya Basha 🎩', pick(JOKES));
}
function showWelcome() {
  $('#app').hidden = true;
  $('#welcome').hidden = false;
  $('#welcomeJoke').textContent = pick(JOKES);
  window.scrollTo(0, 0);
}

/* ---------------- EVENTS ---------------- */
function bind() {
  $$('.ticket').forEach(b => b.onclick = () => setWho(b.dataset.who));
  $('#whoChip').onclick = showWelcome;

  // delegated clicks
  document.addEventListener('click', ev => {
    const goBtn = ev.target.closest('[data-go]');
    if (goBtn) { go(goBtn.dataset.go); return; }
    const hist = ev.target.closest('[data-go-hist]');
    if (hist) { ui.hist.scope = 'me'; ui.hist.ym = defaultYM(); ui.hist.cat = 'all'; go('history'); return; }
    const entry = ev.target.closest('.entry');
    if (entry) { openEntry(entry.dataset.id); return; }
    const seg = ev.target.closest('[data-seg] button');
    if (seg) {
      const key = seg.parentElement.dataset.seg;
      ui[key].scope = seg.dataset.v;
      render(); return;
    }
    const per = ev.target.closest('[data-period]');
    if (per && ui.view === 'stats') { ui.stats.period = per.dataset.period; renderStats(); return; }
  });
  document.addEventListener('keydown', ev => {
    if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.matches('.entry, .wb')) { ev.preventDefault(); ev.target.click(); }
    if (ev.key === 'Escape') closeSheet();
  });

  // add form
  $('#addForm').addEventListener('submit', submitForm);
  $('#catGrid').addEventListener('click', ev => {
    const b = ev.target.closest('[data-cat]'); if (!b) return;
    ui.form.cat = b.dataset.cat; renderAddForm();
  });
  $('#payChips').addEventListener('click', ev => {
    const b = ev.target.closest('[data-pay]'); if (!b) return;
    ui.form.pay = b.dataset.pay; renderAddForm();
  });
  $('#fWhen').addEventListener('change', renderAddForm);
  $('#whenChips').addEventListener('click', ev => {
    const b = ev.target.closest('[data-when]'); if (!b) return;
    const d = new Date();
    if (b.dataset.when === 'yday') d.setDate(d.getDate() - 1);
    if (b.dataset.when === 'yday2') d.setDate(d.getDate() - 2);
    let v = localInput(d);
    if (v.slice(0, 7) < START_YM) v = START_YM + '-01T' + v.slice(11);
    $('#fWhen').value = v;
    renderAddForm();
  });
  $('#quickAmts').innerHTML = [20, 50, 100, 200, 500, 1000].map(n => `<button type="button" class="chip" data-add="${n}">+${n}</button>`).join('');
  $('#quickAmts').addEventListener('click', ev => {
    const b = ev.target.closest('[data-add]'); if (!b) return;
    const cur = parseAmount($('#fAmount').value) || 0;
    $('#fAmount').value = cur + Number(b.dataset.add);
  });
  $('#cancelEdit').onclick = () => { resetForm(); go('history'); };

  $('#sheetClose').onclick = closeSheet;
  $('#sheetBackdrop').onclick = closeSheet;
}

/* ---------------- START ---------------- */
$('#marquee').textContent = '★ FLOOWS BOX ★ MADE IN ALEXANDRIA ★ BAHARY VIBES ONLY ★ EVERY POUND HAS A STORY ★ MARMORA IS ALWAYS RIGHT ★ TEAM MARMORA 👑 ★ ';
bind();
if (who) setWhoQuiet(); else showWelcome();

function setWhoQuiet() {
  $('#welcome').hidden = true;
  $('#app').hidden = false;
  go('home');
}
