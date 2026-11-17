#!/usr/bin/env node
// send-clawme.mjs —— 发布矩阵的第三个渠道：把「今天要去注册/提交的 3 个站」发到手机。
//
//   node send-clawme.mjs platforms.json --product products/blockwipe.json
//   node send-clawme.mjs platforms.json --product products/blockwipe.json --dry-run
//   node send-clawme.mjs ... --lane dev --limit 2 --cards-only
//   node send-clawme.mjs ... --reset            # 清掉「已发」记录，重新轮一遍
//
// 为什么这么设计（ClawMe 的实际能力，别想当然）：
//   · iOS 端 alert 只有 message + 一个「知道了」按钮 → 它只能当**简报**，塞不进链接按钮；
//   · open_url 是唯一「点一下就能落到具体页面」的类型 → 一个站一张卡；
//   · 所以一次投递 = 1 张简报 alert + N 张 open_url 卡（N 默认 3，别刷屏）。
//   · 201 只代表「已入队」，不代表手机收到了；--wait 会回来查 delivery。
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve, dirname } from 'node:path';

const argv = process.argv.slice(2);
const has = k => argv.includes(k);
const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };

const dataPath = argv.find(a => a.endsWith('.json') && !argv[argv.indexOf(a) - 1]?.startsWith('--'));
if (!dataPath) {
  console.error('usage: node send-clawme.mjs <platforms.json> --product <product.json> [--lane ios] [--limit 3] [--dry-run]');
  process.exit(2);
}
const data = JSON.parse(readFileSync(dataPath, 'utf8'));
const product = JSON.parse(readFileSync(arg('--product', resolve(dirname(dataPath), 'products/blockwipe.json')), 'utf8'));
const slug = product.slug || 'product';
const LIMIT = Number(arg('--limit', 3));
const LANE = arg('--lane', (product.lanes && product.lanes[0]) || 'all');
const PHASE = arg('--phase', null);
const DRY = has('--dry-run');
const WAIT = has('--wait');
const DIGEST_ONLY = has('--digest-only');
const CARDS_ONLY = has('--cards-only');
const RESET = has('--reset');

const STATE_DIR = resolve(homedir(), '.clawme-bomber');
const STATE = resolve(STATE_DIR, `${slug}.json`);
mkdirSync(STATE_DIR, { recursive: true });
let state = { sent: {}, batches: 0 };
if (existsSync(STATE)) { try { state = JSON.parse(readFileSync(STATE, 'utf8')); } catch {} }
if (RESET) { state = { sent: {}, batches: 0 }; console.log('已清空发送记录'); }

// ── 环境：ClawMe 的地址与 token 只在 ~/.clawme.env，脚本不打印它们
function loadEnv() {
  const out = {};
  const p = resolve(homedir(), '.clawme.env');
  if (!existsSync(p)) return out;
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const s = line.trim();
    if (!s || s.startsWith('#')) continue;
    const m = s.replace(/^export\s+/, '').match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    out[m[1]] = v;
  }
  return out;
}
const env = { ...loadEnv(), ...process.env };
const BASE = (env.CLAWME_BASE_URL || 'http://127.0.0.1:31871').replace(/\/+$/, '');
const TOKEN = env.CLAWME_TOKEN || '';

// ── 选批次：按阶段顺序（上线前 → 发布周 → 长尾 → 社区 → 付费），同阶段内「强适配」优先
const PHASE_ORDER = (data.meta.phases || []).map(p => p.id);
const rank = p => {
  const pi = PHASE_ORDER.indexOf(p.phase);
  const fi = { strong: 0, some: 1, limited: 2, none: 3 }[(p.fit && p.fit[LANE]) || 'limited'];
  return pi * 10 + fi;
};
const pool = (data.platforms || [])
  .filter(p => !p.unverified)
  .filter(p => !p.fit || LANE === 'all' || (p.fit[LANE] && p.fit[LANE] !== 'none'))
  .filter(p => !PHASE || p.phase === PHASE)
  .filter(p => p.phone !== false)   // 手机上只投「能直接在手机做完」的
  .filter(p => !state.sent[p.id])
  .sort((a, b) => rank(a) - rank(b));
const batch = pool.slice(0, LIMIT);

if (!batch.length) {
  console.log('这一轮没有待办平台了（都发过了）。要重来加 --reset。');
  process.exit(0);
}

// ── 文案：每条一句「为什么是它」，别让手机上看的人猜
const WHY = {
  pre: '会过期，先做',
  launch: '有榜单，铺开',
  longtail: '长期外链',
  community: '守版规',
  paid: '要花钱'
};
const shortHint = p => {
  const first = String(p.gate || '').split(/[；;。]/)[0].trim();
  return first.length > 38 ? first.slice(0, 38) + '…' : first;
};
const one = p => {
  const fit = (p.fit && p.fit[LANE]) || 'limited';
  const tag = fit === 'strong' ? '强' : fit === 'some' ? '可' : '弱';
  const pay = p.pay === 'free' ? '免费' : p.pay === 'paid' ? '付费' : '有条件免费';
  return `· ${p.name}｜${tag}·${pay}\n  ${shortHint(p)}`;
};

const digest =
  `【发布矩阵 · 第 ${state.batches + 1} 批】${product.name}\n` +
  batch.map(one).join('\n') +
  `\n\n下面 ${DIGEST_ONLY ? 0 : batch.length} 张卡各点一次「打开链接」，进去注册或提交。`;

async function post(instruction, id) {
  const res = await fetch(`${BASE}/v1/instructions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-ClawMe-Token': TOKEN },
    body: JSON.stringify({ id, target: 'phone', instruction })
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}
async function deliveryOf(id) {
  const res = await fetch(`${BASE}/v1/instructions/${id}`, { headers: { 'X-ClawMe-Token': TOKEN } });
  if (!res.ok) return null;
  const b = await res.json().catch(() => ({}));
  const it = b.instruction || b;
  return it.delivery || it.status || null;
}

if (DRY) {
  console.log('--- DRY RUN ---');
  console.log(digest);
  for (const p of batch) console.log(`[card] ${p.name} → ${p.submitUrl || p.signupUrl}`);
  console.log(`\n待办剩余 ${pool.length} 家 / 已发 ${Object.keys(state.sent).length} 家`);
  process.exit(0);
}
if (!TOKEN) { console.error('~/.clawme.env 里没有 CLAWME_TOKEN'); process.exit(1); }

const batchNo = state.batches + 1;
const sentIds = [];
let r;

if (!CARDS_ONLY) {
  r = await post({ type: 'alert', payload: { message: digest } }, `bomber-${slug}-b${batchNo}-digest`);
  console.log(`简报 alert → ${r.status} ${r.body.id || r.body.error || ''}`);
  if (r.status === 201) sentIds.push(r.body.id);
}

if (!DIGEST_ONLY) {
  for (const p of batch) {
    // 先给提交页：多数站的提交页本身就是登录/注册入口，比首页少两步
    const url = p.submitUrl || p.signupUrl;
    if (!url) { console.log(`跳过 ${p.name}（没有可打开的链接）`); continue; }
    const card = await post({ type: 'open_url', payload: { url, in_new_tab: true } }, `bomber-${slug}-b${batchNo}-${p.id}`);
    console.log(`卡片 ${p.name} → ${card.status} ${card.body.id || card.body.error || ''}`);
    if (card.status === 201) {
      sentIds.push(card.body.id);
      state.sent[p.id] = new Date().toISOString();
    }
  }
}

state.batches = batchNo;
writeFileSync(STATE, JSON.stringify(state, null, 2));

if (WAIT) {
  await new Promise(res => setTimeout(res, 2500));
  for (const id of sentIds) console.log(`delivery ${id}: ${JSON.stringify(await deliveryOf(id))}`);
}

console.log(`\n已发 ${Object.keys(state.sent).length} / ${data.platforms.length} 家；还剩 ${pool.length - batch.length} 家待发。`);
console.log(`状态文件：${STATE}`);
