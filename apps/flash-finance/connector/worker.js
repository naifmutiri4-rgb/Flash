/**
 * Flash Suppliers — MCP connector for drd3m and smmcpan (read-only), version 2.0.
 *
 * Secrets (Settings → Variables and Secrets):
 *   DRD3M_KEY, SMMCPAN_KEY, CONNECTOR_TOKEN
 * New in 2.0 (optional, unlocks the automatic log):
 *   KV binding   FLASH_KV  → a KV namespace (for example "flash-data")
 *   Cron trigger: every 15 minutes
 *
 * Every 15 minutes the worker reads both balances and keeps:
 *   - each balance increase as a top-up (or a refund from the supplier)
 *   - a daily row per supplier: opening, closing, topped up, used
 *   - once a day, the price of the watched services, and any change
 * The connector URL is unchanged:  https://<worker>.workers.dev/mcp/<CONNECTOR_TOKEN>
 * Read-only by design: it cannot place, cancel or refill orders.
 */

const SUPPLIERS = {
  drd3m: { url: "https://drd3m.me/api/v2", keyVar: "DRD3M_KEY", label: "دكتور دعم" },
  smmcpan: { url: "https://smmcpan.com/api/v2", keyVar: "SMMCPAN_KEY", label: "smmcpan" },
};
const USD_TO_SAR = 3.75;
const PROTOCOLS = ["2025-06-18", "2025-03-26", "2024-11-05"];
const SERVICES_TTL_MS = 10 * 60 * 1000;
// services whose price is checked once a day (the store's four services + the old shares service)
const WATCH = { drd3m: ["12033", "10816", "9350", "5633"], smmcpan: ["22304"] };
const cache = new Map();

const TOOLS = [
  {
    name: "supplier_balance",
    title: "رصيد المزود",
    description: "Current account balance at the supplier panel (drd3m, smmcpan, or all), with the value converted to SAR when the panel currency is USD.",
    inputSchema: { type: "object", properties: { supplier: { type: "string", enum: ["drd3m", "smmcpan", "all"], default: "all" } }, additionalProperties: false },
    annotations: { readOnlyHint: true, openWorldHint: true },
  },
  {
    name: "supplier_services",
    title: "خدمات المزود وأسعارها",
    description: "Look up supplier services by service ID (ids) or search by words in the name/category (query). Returns price per 1000 in the panel currency and in SAR, min, max and category.",
    inputSchema: {
      type: "object",
      properties: {
        supplier: { type: "string", enum: ["drd3m", "smmcpan"] },
        ids: { type: "array", items: { type: "string" }, maxItems: 50 },
        query: { type: "string", maxLength: 80 },
        exclude: { type: "array", items: { type: "string", maxLength: 40 }, maxItems: 20, description: "Skip services whose name or category contains any of these words" },
        offset: { type: "integer", minimum: 0, maximum: 5000, default: 0 },
        limit: { type: "integer", minimum: 1, maximum: 50, default: 25 },
      },
      required: ["supplier"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, openWorldHint: true },
  },
  {
    name: "supplier_order_status",
    title: "حالة طلبات المزود",
    description: "Status, charge (what the supplier took), start count and remains for up to 100 supplier order IDs.",
    inputSchema: {
      type: "object",
      properties: { supplier: { type: "string", enum: ["drd3m", "smmcpan"] }, orders: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 100 } },
      required: ["supplier", "orders"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, openWorldHint: true },
  },
  {
    name: "supplier_topups",
    title: "سجل شحن المزود",
    description: "Balance increases recorded every 15 minutes (top-ups, or refunds from the supplier), newest first. Dates are Riyadh time (YYYY-MM-DD).",
    inputSchema: {
      type: "object",
      properties: { supplier: { type: "string", enum: ["drd3m", "smmcpan", "all"], default: "all" }, from: { type: "string", maxLength: 10 }, to: { type: "string", maxLength: 10 } },
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  {
    name: "supplier_daily",
    title: "حركة رصيد المزود يوميًا",
    description: "One row per supplier per day (Riyadh time): opening and closing balance, topped up, and used (sum of decreases), in SAR.",
    inputSchema: {
      type: "object",
      properties: { supplier: { type: "string", enum: ["drd3m", "smmcpan", "all"], default: "all" }, from: { type: "string", maxLength: 10 }, to: { type: "string", maxLength: 10 } },
      required: ["from", "to"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  {
    name: "supplier_price_changes",
    title: "تغيّر أسعار خدمات المزود",
    description: "Price changes of the watched services (checked once a day), newest first, with the price before and after per 1000.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  {
    name: "supplier_log_status",
    title: "حالة السجل التلقائي",
    description: "Whether the automatic 15-minute log is set up (KV binding and cron), and when it last ran.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
];

async function panel(env, supplier, params) {
  const s = SUPPLIERS[supplier];
  if (!s) throw new Error(`unknown supplier: ${supplier}`);
  const key = env[s.keyVar];
  if (!key) throw new Error(`${s.keyVar} is not set in the Worker secrets`);
  const body = new URLSearchParams({ key, ...params });
  const res = await fetch(s.url, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "flash-suppliers/2.0" }, body });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { throw new Error(`${supplier} returned non-JSON (HTTP ${res.status})`); }
  if (data && !Array.isArray(data) && typeof data === "object" && data.error) throw new Error(`${supplier}: ${String(data.error).slice(0, 160)}`);
  return data;
}

const toSAR = (amount, currency) => {
  const v = Number(amount);
  if (!isFinite(v)) return null;
  const c = String(currency || "").toUpperCase();
  if (c === "SAR") return Math.round(v * 10000) / 10000;
  if (c === "USD") return Math.round(v * USD_TO_SAR * 10000) / 10000;
  return null;
};
const r2 = (v) => Math.round(v * 100) / 100;
// Riyadh is UTC+3 all year
const riyadh = (d = new Date()) => { const t = new Date(d.getTime() + 3 * 3600 * 1000); return { day: t.toISOString().slice(0, 10), time: t.toISOString().slice(11, 16), hour: t.getUTCHours() }; };

async function currencyOf(env, supplier) {
  const k = `cur:${supplier}`;
  const hit = cache.get(k);
  if (hit && Date.now() - hit.t < 6 * 3600 * 1000) return hit.v;
  const b = await panel(env, supplier, { action: "balance" });
  cache.set(k, { t: Date.now(), v: b.currency || "" });
  return b.currency || "";
}

async function services(env, supplier) {
  const k = `svc:${supplier}`;
  const hit = cache.get(k);
  if (hit && Date.now() - hit.t < SERVICES_TTL_MS) return hit.v;
  const list = await panel(env, supplier, { action: "services" });
  if (!Array.isArray(list)) throw new Error(`${supplier}: unexpected services response`);
  cache.set(k, { t: Date.now(), v: list });
  return list;
}

/* ---------------- KV helpers ---------------- */
const kvGet = async (env, key, fallback) => { const v = await env.FLASH_KV.get(key); if (v == null) return fallback; try { return JSON.parse(v); } catch { return fallback; } };
const kvPut = (env, key, value) => env.FLASH_KV.put(key, JSON.stringify(value));
function needKV(env) { if (!env.FLASH_KV) throw new Error("السجل التلقائي مو مفعّل: أضف KV binding باسم FLASH_KV و Cron كل 15 دقيقة للـ Worker"); }

/* ---------------- the 15-minute job ---------------- */
async function tick(env) {
  if (!env.FLASH_KV) return { skipped: "no KV" };
  const now = new Date();
  const { day, time, hour } = riyadh(now);
  const last = await kvGet(env, "bal:last", {});
  const topups = await kvGet(env, "topups", []);
  let lastChanged = false, topupsChanged = false;
  for (const sup of Object.keys(SUPPLIERS)) {
    let b;
    try { b = await panel(env, sup, { action: "balance" }); } catch (e) { continue; }
    const sar = toSAR(b.balance, b.currency);
    if (sar == null) continue;
    const prev = last[sup];
    const dayKey = `day:${sup}:${day}`;
    const row = await kvGet(env, dayKey, null) || { date: day, supplier: sup, open: prev ? prev.sar : sar, close: sar, topup: 0, used: 0, checks: 0 };
    if (prev && prev.sar != null) {
      const diff = r2(sar - prev.sar);
      if (diff >= 0.19) { // a rise of about 0.05 USD or more
        topups.unshift({ supplier: sup, date: day, time, amount_sar: diff, before_sar: r2(prev.sar), after_sar: r2(sar), currency: b.currency || "", at: now.toISOString() });
        row.topup = r2(row.topup + diff);
        topupsChanged = true;
      } else if (diff < 0) {
        row.used = r2(row.used - diff);
      }
    }
    row.close = r2(sar);
    row.checks += 1;
    await kvPut(env, dayKey, row);
    if (!prev || Math.abs((prev.sar || 0) - sar) >= 0.005) { last[sup] = { sar: r2(sar), raw: Number(b.balance), currency: b.currency || "", at: now.toISOString() }; lastChanged = true; }
  }
  if (lastChanged) await kvPut(env, "bal:last", last);
  if (topupsChanged) await kvPut(env, "topups", topups.slice(0, 500));
  // once a day, around 03:00 Riyadh: check the watched service prices
  const pxDay = await env.FLASH_KV.get("px:checked");
  if (pxDay !== day && hour >= 3) {
    const pxLast = await kvGet(env, "px:last", {});
    const pxLog = await kvGet(env, "px:log", []);
    let changed = false;
    for (const [sup, ids] of Object.entries(WATCH)) {
      let list, currency;
      try { [list, currency] = await Promise.all([services(env, sup), currencyOf(env, sup)]); } catch (e) { continue; }
      for (const id of ids) {
        const s = list.find((x) => String(x.service) === id);
        if (!s) continue;
        const k = `${sup}:${id}`;
        const sar = toSAR(s.rate, currency);
        const was = pxLast[k];
        if (was && was.sar != null && sar != null && Math.abs(was.sar - sar) > 0.00005) {
          pxLog.unshift({ supplier: sup, id, name: String(s.name || "").slice(0, 120), date: day, before_sar: was.sar, after_sar: sar, change_pct: was.sar ? Math.round((sar / was.sar - 1) * 1000) / 10 : null });
          changed = true;
        }
        pxLast[k] = { sar, rate: Number(s.rate), currency, at: now.toISOString() };
      }
    }
    await kvPut(env, "px:last", pxLast);
    if (changed) await kvPut(env, "px:log", pxLog.slice(0, 300));
    await env.FLASH_KV.put("px:checked", day);
  }
  await env.FLASH_KV.put("cron:last", now.toISOString());
  return { ok: true };
}

async function runTool(name, args, env) {
  args = args || {};
  if (name === "supplier_balance") {
    const which = args.supplier && args.supplier !== "all" ? [args.supplier] : Object.keys(SUPPLIERS);
    const out = [];
    for (const sup of which) {
      try {
        const b = await panel(env, sup, { action: "balance" });
        cache.set(`cur:${sup}`, { t: Date.now(), v: b.currency || "" });
        out.push({ supplier: sup, label: SUPPLIERS[sup].label, balance: Number(b.balance), currency: b.currency || "", balance_sar: toSAR(b.balance, b.currency) });
      } catch (e) {
        out.push({ supplier: sup, label: SUPPLIERS[sup]?.label || sup, error: String(e.message || e) });
      }
    }
    return { balances: out, checked_at: new Date().toISOString() };
  }
  if (name === "supplier_services") {
    const sup = args.supplier;
    const [list, currency] = await Promise.all([services(env, sup), currencyOf(env, sup)]);
    const limit = Math.min(Math.max(Number(args.limit) || 25, 1), 50);
    let rows;
    if (Array.isArray(args.ids) && args.ids.length) {
      const want = new Set(args.ids.map(String));
      rows = list.filter((x) => want.has(String(x.service)));
    } else if (args.query && String(args.query).trim()) {
      const q = String(args.query).trim();
      if (/^\d+$/.test(q)) rows = list.filter((x) => String(x.service).startsWith(q));
      else { const words = q.split(/\s+/).filter(Boolean); rows = list.filter((x) => words.every((w) => `${x.name} ${x.category}`.includes(w))); }
      rows.sort((a, b) => Number(a.rate) - Number(b.rate));
    } else {
      throw new Error("send ids or query");
    }
    const ex = Array.isArray(args.exclude) ? args.exclude.map(String).filter(Boolean).slice(0, 20) : [];
    if (ex.length) rows = rows.filter((x) => !ex.some((w) => `${x.name} ${x.category}`.includes(w)));
    const offset = Math.min(Math.max(Number(args.offset) || 0, 0), 5000);
    const items = rows.slice(offset, offset + limit).map((x) => ({
      id: String(x.service), name: String(x.name || "").slice(0, 160), category: String(x.category || "").slice(0, 80),
      type: x.type || "", rate: Number(x.rate), currency, rate_sar: toSAR(x.rate, currency),
      min: Number(x.min), max: Number(x.max), refill: !!x.refill, cancel: !!x.cancel,
    }));
    const next_offset = offset + limit < rows.length ? offset + limit : null;
    return { supplier: sup, currency, total_matches: rows.length, next_offset, items };
  }
  if (name === "supplier_order_status") {
    const sup = args.supplier;
    const ids = (args.orders || []).map(String).filter((x) => /^\d+$/.test(x)).slice(0, 100);
    if (!ids.length) throw new Error("orders must be numeric supplier order IDs");
    const data = await panel(env, sup, { action: "status", orders: ids.join(",") });
    const out = {};
    for (const id of ids) {
      const r = data[id] || (ids.length === 1 && data.status ? data : null);
      if (!r || r.error) { out[id] = { error: r ? String(r.error) : "not found" }; continue; }
      out[id] = { status: r.status, charge: Number(r.charge), currency: r.currency || "", charge_sar: toSAR(r.charge, r.currency), start_count: Number(r.start_count), remains: Number(r.remains) };
    }
    return { supplier: sup, orders: out, checked_at: new Date().toISOString() };
  }
  if (name === "supplier_topups") {
    needKV(env);
    const all = await kvGet(env, "topups", []);
    const sup = args.supplier && args.supplier !== "all" ? args.supplier : null;
    const rows = all.filter((x) => (!sup || x.supplier === sup) && (!args.from || x.date >= args.from) && (!args.to || x.date <= args.to));
    return { topups: rows.slice(0, 300), since: await env.FLASH_KV.get("log:since") };
  }
  if (name === "supplier_daily") {
    needKV(env);
    const from = String(args.from || ""), to = String(args.to || "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) throw new Error("from and to must be YYYY-MM-DD");
    const sups = args.supplier && args.supplier !== "all" ? [args.supplier] : Object.keys(SUPPLIERS);
    const rows = [];
    let d = new Date(from + "T00:00:00Z"); const end = new Date(to + "T00:00:00Z"); let n = 0;
    while (d <= end && n < 92) {
      const day = d.toISOString().slice(0, 10);
      for (const s of sups) { const r = await kvGet(env, `day:${s}:${day}`, null); if (r) rows.push(r); }
      d = new Date(d.getTime() + 864e5); n++;
    }
    return { days: rows };
  }
  if (name === "supplier_price_changes") {
    needKV(env);
    return { changes: await kvGet(env, "px:log", []), current: await kvGet(env, "px:last", {}) };
  }
  if (name === "supplier_log_status") {
    if (!env.FLASH_KV) return { kv: false, cron_last: null, note: "أضف KV binding باسم FLASH_KV و Cron Trigger كل 15 دقيقة" };
    return { kv: true, cron_last: await env.FLASH_KV.get("cron:last"), since: await env.FLASH_KV.get("log:since") };
  }
  throw new Error(`unknown tool: ${name}`);
}

async function handleMessage(msg, env) {
  const isRequest = msg && msg.id !== undefined && msg.id !== null;
  const reply = (result) => ({ jsonrpc: "2.0", id: msg.id, result });
  const fail = (code, message) => ({ jsonrpc: "2.0", id: msg.id ?? null, error: { code, message } });
  if (!msg || msg.jsonrpc !== "2.0" || typeof msg.method !== "string") return isRequest ? fail(-32600, "Invalid Request") : null;
  if (!isRequest) return null;
  switch (msg.method) {
    case "initialize": {
      const asked = msg.params && msg.params.protocolVersion;
      return reply({
        protocolVersion: PROTOCOLS.includes(asked) ? asked : PROTOCOLS[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "flash-suppliers", title: "Flash Suppliers", version: "2.0.0" },
        instructions: "Read-only access to Flash Store supplier panels (drd3m, smmcpan): balance, service prices, order status, and an automatic 15-minute log of top-ups, daily usage and price changes. It cannot place or cancel orders.",
      });
    }
    case "ping": return reply({});
    case "tools/list": return reply({ tools: TOOLS });
    case "tools/call": {
      const { name, arguments: args } = msg.params || {};
      if (!TOOLS.some((t) => t.name === name)) return fail(-32602, `Unknown tool: ${name}`);
      try {
        const data = await runTool(name, args, env);
        return reply({ content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: data });
      } catch (e) {
        return reply({ isError: true, content: [{ type: "text", text: String(e.message || e) }] });
      }
    }
    default: return fail(-32601, `Method not found: ${msg.method}`);
  }
}

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...extra } });
}

// accept the KV binding as FLASH_KV or FLASH-KV
const withKV = (env) => (env.FLASH_KV || !env["FLASH-KV"] ? env : { ...env, FLASH_KV: env["FLASH-KV"] });

export default {
  async fetch(request, env) {
    env = withKV(env);
    const url = new URL(request.url);
    const token = env.CONNECTOR_TOKEN;
    if (url.pathname === "/" || url.pathname === "") return new Response("Flash Suppliers connector is running.", { status: 200 });
    if (!token || token.length < 16) return new Response("Set CONNECTOR_TOKEN (16+ characters) in the Worker secrets.", { status: 500 });
    if (url.pathname !== `/mcp/${token}`) return new Response("Not found", { status: 404 });
    if (request.method === "GET") return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });
    if (request.method === "DELETE") return new Response(null, { status: 204 });
    if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });
    let payload;
    try { payload = await request.json(); } catch { return json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }, 400); }
    const batch = Array.isArray(payload);
    const msgs = batch ? payload : [payload];
    const out = [];
    for (const m of msgs) { const r = await handleMessage(m, env); if (r) out.push(r); }
    if (!out.length) return new Response(null, { status: 202 });
    return json(batch ? out : out[0], 200, { "Mcp-Session-Id": "flash-suppliers" });
  },
  async scheduled(event, env, ctx) {
    env = withKV(env);
    if (env.FLASH_KV && !(await env.FLASH_KV.get("log:since"))) await env.FLASH_KV.put("log:since", new Date().toISOString());
    ctx.waitUntil(tick(env));
  },
};
