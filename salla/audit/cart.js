const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, locale: 'ar-SA', timezoneId: 'Asia/Riyadh' });
  const p = await ctx.newPage();
  const api = [];
  p.on('response', r => { const u = r.url(); if (u.includes('api.salla.dev') || u.includes('/cart')) api.push(r.status() + ' ' + r.request().method() + ' ' + u.replace(/\?.*/, '').slice(0, 110)); });
  await p.goto('https://flashstore-ksa.com/لايكات-تيك-توك/p767542597', { waitUntil: 'networkidle', timeout: 90000 });
  await p.waitForTimeout(1500);
  const tp = () => p.$$eval('.total-price, .price-wrapper, section.total', e => e.map(x => x.textContent.trim().replace(/\s+/g, ' ')).join(' | '));
  console.log('before:', await tp());
  await (await p.$$('.s-product-options-grid-mode label'))[2].click();
  await p.waitForTimeout(3000);
  console.log('after option:', await tp());
  const inp = await p.$('.s-product-options-text input, .s-product-options-text textarea');
  if (inp) await inp.fill('https://www.tiktok.com/@test/video/1234567890');
  const btn = await p.$('.sticky-product-bar salla-add-product-button button, salla-add-product-button button');
  if (btn) { await btn.click(); await p.waitForTimeout(4000); }
  const toast = await p.evaluate(() => [...document.querySelectorAll('.s-toast, [class*=toast], .swal2-popup, .s-alert')].map(e => e.textContent.trim().slice(0, 120)).join(' | '));
  console.log('toast:', toast);
  await p.goto('https://flashstore-ksa.com/cart', { waitUntil: 'networkidle', timeout: 90000 });
  await p.waitForTimeout(2000);
  const cart = await p.evaluate(() => document.querySelector('main, #app')?.innerText.replace(/\s+/g, ' ').slice(0, 700));
  console.log('cart:', cart);
  await p.screenshot({ path: __dirname + '/m-cart.png', fullPage: true });
  console.log(api.slice(-25).join('\n'));
  await b.close();
})().catch(e => { console.log('ERR', e.message); process.exit(1); });
