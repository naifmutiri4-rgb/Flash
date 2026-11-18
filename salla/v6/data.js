// بيانات حقيقية من المتجر فقط (الأسعار من prices-backup.md و PACK_PRICES، المحتويات من descriptions.json)
const I = {
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3.2"/>',
  heart: '<path d="M12 20s-7.5-4.6-9.3-9.2C1.5 7.6 3.6 4.5 6.9 4.5c2 0 3.6 1.1 5.1 3 1.5-1.9 3.1-3 5.1-3 3.3 0 5.4 3.1 4.2 6.3C19.5 15.4 12 20 12 20Z"/>',
  share: '<path d="M14 5l7 7-7 7v-4c-5 0-8.5 1.5-11 5 1-5 4-10 11-11V5Z"/>',
  save: '<path d="M6 3h12v18l-6-4.5L6 21V3Z"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
  shield: '<path d="M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5l-8-3Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  chat: '<path d="M4 5h16v11H9l-5 4V5Z"/>',
  cart: '<path d="M3 4h2.5l2.2 11h10.6L21 7H7"/><circle cx="9.5" cy="19.5" r="1.5"/><circle cx="17" cy="19.5" r="1.5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4-4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  link: '<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  arrow: '<path d="M15 5l-7 7 7 7"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
};
const icon = (n, s = 20, extra = '') => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${extra}>${I[n]}</svg>`;
const iconFill = (n, s = 20, extra = '') => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="currentColor" stroke="none" ${extra}>${I[n]}</svg>`;

const singles = [
  { key: 'views', name: 'مشاهدات تيك توك', short: 'مشاهدات', unit: 'مشاهدة', ic: 'eye', from: 4.99,
    q: [[2000, 4.99], [5000, 7.99], [10000, 12.99], [40000, 39.99], [80000, 79.99], [100000, 119.99], [200000, 199.99], [500000, 419.99], [1000000, 789.99]] },
  { key: 'likes', name: 'لايكات تيك توك', short: 'لايكات', unit: 'لايك', ic: 'heart', from: 5.99,
    q: [[250, 5.99], [500, 8.99], [1000, 14.99], [2000, 27.99], [5000, 59.99], [10000, 99.99], [20000, 199.99], [50000, 479.99], [100000, 599.99]] },
  { key: 'shares', name: 'شير تيك توك', short: 'شير', unit: 'شير', ic: 'share', from: 1.99,
    q: [[50, 1.99], [100, 2.99], [200, 3.99], [250, 4.99], [500, 7.99], [1000, 11.99], [2000, 19.99], [3000, 26.99], [4000, 34.99], [5000, 39.99], [8000, 59.99], [10000, 74.99]] },
  { key: 'saves', name: 'حفظ تيك توك', short: 'حفظ', unit: 'حفظ', ic: 'save', from: 1.99,
    q: [[50, 1.99], [100, 2.99], [200, 3.99], [250, 4.99], [500, 7.99], [1000, 11.99], [2000, 19.99], [3000, 26.99], [4000, 34.99], [5000, 39.99], [8000, 59.99], [10000, 74.99]] },
];
const packs = [
  { key: 'saver', name: 'بكج التوفير', price: 9.99, v: 2000, l: 250, s: 50, f: 50 },
  { key: 'saver-plus', name: 'بكج التوفير المطور', price: 17.99, v: 5000, l: 500, s: 100, f: 100 },
  { key: 'interact', name: 'بكج التفاعل', price: 29.99, v: 10000, l: 750, s: 250, f: 250 },
  { key: 'gold', name: 'بكج الذهبي', price: 39.99, v: 15000, l: 1000, s: 500, f: 500 },
  { key: 'explore', name: 'بكج اكسبلور', price: 54.99, v: 20000, l: 1500, s: 750, f: 750 },
];
const n = x => x.toLocaleString('en-US');
const k = x => x >= 1e6 ? (x / 1e6) + 'M' : x >= 1000 ? (x / 1000) + 'K' : String(x);
const sar = x => x.toFixed(2);
const facts = { speed: 'فوري', accounts: 'أجانب', guarantee: 'حسب السياسة', policy: 'سياسية التعويض' };
module.exports = { I, icon, iconFill, singles, packs, n, k, sar, facts };
