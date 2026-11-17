#!/usr/bin/env node
// build-matrix.mjs —— 把「平台档案」编译成一张自包含 HTML「发布矩阵作战台」。
//
// 用法:
//   node build-matrix.mjs platforms.json [--product product.json] [--out 产物.html]
//
// 做三件事（不替你提交、不碰任何账号）：
//   1. 按阶段把平台排好：上线前 → 发布周 → 长尾目录 → 社区 → 付费
//   2. 每个平台一张卡：适配度 / 费用 / 外链属性 / 门槛(红) / 证据链接 + [开提交页] [开注册页]
//   3. 勾选进度存 localStorage，刷新不丢
//
// 产物是零依赖单文件：<link> 0 个、<script> 1 个内联、同一输入两次 build 字节相同。
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';

const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const dataPath = argv.find(a => a.endsWith('.json') && !argv[argv.indexOf(a) - 1]?.startsWith('--')) || argv[0];
if (!dataPath) {
  console.error('usage: node build-matrix.mjs <platforms.json> [--product product.json] [--out out.html]');
  process.exit(1);
}
const data = JSON.parse(readFileSync(dataPath, 'utf8'));
if (!data.meta || !Array.isArray(data.platforms)) {
  console.error('platforms.json 缺 meta 或 platforms[]');
  process.exit(1);
}
const productPath = arg('--product', null);
const product = productPath ? JSON.parse(readFileSync(productPath, 'utf8')) : {};
const out = arg('--out', resolve(dirname(dataPath), 'dist', `发布矩阵-${data.meta.built || 'draft'}.html`));
mkdirSync(dirname(out), { recursive: true });

const META = JSON.stringify(data.meta);
const PLATFORMS = JSON.stringify(data.platforms);
const PRODUCT = JSON.stringify(product);

const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const title = `${data.meta.title || '发布矩阵'}${product.name ? ' · ' + product.name : ''}`;

const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<style>
:root{
  --bg:#f6f7f9; --card:#fff; --line:#e3e6ea; --fg:#1c2230; --mut:#66707f;
  --acc:#2563eb; --ok:#0f9d58; --warn:#c2410c; --bad:#b91c1c; --chip:#eef2ff;
}
*{box-sizing:border-box}
html,body{margin:0;background:var(--bg);color:var(--fg);
  font:14px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif}
a{color:var(--acc);text-decoration:none}
a:hover{text-decoration:underline}
header{position:sticky;top:0;z-index:9;background:#fff;border-bottom:1px solid var(--line);padding:14px 20px 10px}
h1{margin:0 0 2px;font-size:18px;font-weight:650;letter-spacing:.2px}
.sub{color:var(--mut);font-size:12.5px}
.bar{height:6px;background:#eceff3;border-radius:3px;margin:10px 0 8px;overflow:hidden}
.bar > i{display:block;height:100%;width:0;background:var(--acc);transition:width .25s}
.controls{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.tab{border:1px solid var(--line);background:#fff;color:var(--fg);padding:5px 11px;border-radius:999px;cursor:pointer;font-size:12.5px}
.tab[aria-pressed="true"]{background:var(--acc);border-color:var(--acc);color:#fff}
.spacer{flex:1}
input[type=search]{border:1px solid var(--line);background:#fff;border-radius:8px;padding:6px 10px;font-size:12.5px;min-width:170px}
label.chk{font-size:12.5px;color:var(--mut);display:inline-flex;gap:5px;align-items:center;cursor:pointer}
main{padding:18px 20px 60px;max-width:1240px;margin:0 auto}
section{margin:0 0 26px}
h2{font-size:14px;margin:0 0 2px;font-weight:650}
h2 span.count{color:var(--mut);font-weight:400;font-size:12.5px}
.hint{color:var(--mut);font-size:12px;margin:0 0 12px}
.brief{background:#fff;border:1px solid var(--line);border-left:4px solid var(--acc);border-radius:10px;padding:12px 14px;margin:0 0 22px}
.brief h3{margin:0 0 6px;font-size:13.5px;font-weight:640}
.brief ul{margin:0;padding-left:18px;font-size:12.8px;line-height:1.62}
.brief li{margin:2px 0}
.brief .st{color:var(--mut);font-size:12px;margin:0 0 6px}
.chip.lane{margin-right:3px}
.chip.win{background:#eef2ff;color:#3730a3}
.chip.win.cheap{background:#e8f5ee;color:#0b6b3a}
.chip.win.pricey{background:#fdeaea;color:#9b1c1c}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:12px}
.card{background:var(--card);border:1px solid var(--line);border-left:4px solid var(--line);border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;gap:8px}
.card.fit-strong{border-left-color:var(--ok)}
.card.fit-some{border-left-color:#d99400}
.card.fit-limited{border-left-color:#b6bcc6}
.card.done{opacity:.5}
.card.no{display:none}
.row{display:flex;gap:8px;align-items:baseline;justify-content:space-between}
.name{font-weight:640;font-size:14.5px}
.chip{font-size:11px;padding:1px 7px;border-radius:999px;background:var(--chip);color:#3730a3;white-space:nowrap}
.chip.free{background:#e8f5ee;color:#0b6b3a}
.chip.paid{background:#fdeaea;color:#9b1c1c}
.chip.freemium{background:#fff4e5;color:#8a4b00}
.chip.q{background:#fff1f0;color:#b91c1c}
.meta{display:grid;grid-template-columns:auto 1fr;gap:2px 10px;font-size:12.5px}
.meta dt{color:var(--mut);white-space:nowrap}
.meta dd{margin:0}
.gate{color:var(--bad)}
.acts{display:flex;flex-wrap:wrap;gap:6px;margin-top:2px}
.btn{border:1px solid var(--line);background:#fff;border-radius:8px;padding:5px 10px;font-size:12.5px;cursor:pointer;color:var(--fg)}
.btn.primary{background:var(--acc);border-color:var(--acc);color:#fff}
.btn[disabled]{opacity:.38;cursor:not-allowed}
.btn.on{background:#e8f5ee;border-color:#9ed3b3;color:#0b6b3a}
details{margin-top:2px}
summary{cursor:pointer;color:var(--acc);font-size:12.5px;list-style:none}
summary::-webkit-details-marker{display:none}
summary:before{content:"▸ ";}
details[open] summary:before{content:"▾ ";}
details ul{margin:6px 0 0;padding-left:18px;font-size:12.5px;color:#2b3240}
details li{margin:2px 0}
.src{font-size:11.5px;color:var(--mut)}
footer{color:var(--mut);font-size:12px;border-top:1px solid var(--line);margin-top:10px;padding:14px 20px 30px;max-width:1240px;margin-left:auto;margin-right:auto}
#toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%) translateY(20px);background:#1c2230;color:#fff;padding:8px 14px;border-radius:8px;font-size:12.5px;opacity:0;pointer-events:none;transition:.2s}
#toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
@media (max-width:640px){.grid{grid-template-columns:1fr}main{padding:14px 12px 50px}header{padding:12px 12px 8px}}
</style>
</head>
<body>
<header>
  <h1 id="ttl"></h1>
  <div class="sub" id="sub"></div>
  <div class="bar"><i id="prog"></i></div>
  <div class="controls">
    <button class="tab" data-lane="all" aria-pressed="true">全部</button>
    <button class="tab" data-lane="ios" aria-pressed="false">消费者 App</button>
    <button class="tab" data-lane="dev" aria-pressed="false">开发者工具</button>
    <button class="tab" data-lane="ai" aria-pressed="false">AI / MCP</button>
    <span class="spacer"></span>
    <label class="chk"><input type="checkbox" id="fFree"> 只看不花钱</label>
    <label class="chk"><input type="checkbox" id="fTodo"> 只看没做</label>
    <input type="search" id="q" placeholder="搜平台名 / 门槛关键词">
  </div>
  <div class="controls" style="margin-top:6px">
    <span class="chip win" id="win">—</span>
    <span class="hint" style="margin:0">DeepSeek 峰谷：周一至周五 09:00–12:00 / 14:00–18:00 是高峰（双倍价），其余时间是半价。改定时任务先看这条。</span>
  </div>
</header>
<main id="main"></main>
<footer id="foot"></footer>
<div id="toast"></div>
<script>
"use strict";
var META = ${META};
var PLATFORMS = ${PLATFORMS};
var PRODUCT = ${PRODUCT};
var SLUG = PRODUCT.slug || META.built || 'draft';
var KEY_DONE = 'mp-matrix-done:' + SLUG;
var KEY_LANE = 'mp-matrix-lane:' + SLUG;

var done = {};
try { (JSON.parse(localStorage.getItem(KEY_DONE) || '[]')).forEach(function (id) { done[id] = 1; }); } catch (e) {}
// 默认泳道：产品自己声明了就先站在它的那条泳道上（避免「一个 App 产品」第一眼看到 Dev 强适配）
var DEF_LANE = (PRODUCT.lanes && PRODUCT.lanes.length && PRODUCT.lanes[0]) || 'all';
var state = { lane: localStorage.getItem(KEY_LANE) || DEF_LANE, free: false, todo: false, q: '' };

function $(s) { return document.querySelector(s); }
function el(tag, cls, text) {
  var n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}
function toast(msg) {
  var t = $('#toast'); t.textContent = msg; t.className = 'show';
  setTimeout(function () { t.className = ''; }, 1400);
}
function save() {
  var ids = Object.keys(done).filter(function (k) { return done[k]; });
  localStorage.setItem(KEY_DONE, JSON.stringify(ids));
  paintProgress();
}
function paintProgress() {
  var total = PLATFORMS.length;
  var n = Object.keys(done).filter(function (k) { return done[k]; }).length;
  $('#prog').style.width = total ? Math.round(n * 100 / total) + '%' : '0';
  $('#sub').textContent = (PRODUCT.name ? PRODUCT.name + ' · ' : '') +
    n + ' / ' + total + ' 已办 · 档案核实 ' + META.verified +
    (PRODUCT.url ? ' · ' + PRODUCT.url : '');
}
function fitOf(p) {
  if (state.lane === 'all') return pickBest(p);
  return (p.fit && p.fit[state.lane]) || 'limited';
}
function pickBest(p) {
  var f = p.fit || {}, order = ['strong', 'some', 'limited'];
  for (var i = 0; i < order.length; i++) {
    if (f.ios === order[i] || f.dev === order[i] || f.ai === order[i]) return order[i];
  }
  return 'limited';
}
var FIT_LABEL = { strong: '强适配', some: '可适配', limited: '弱适配', none: '不适配' };
var LANE_SHORT = { ios: 'App', dev: 'Dev', ai: 'AI' };
var FIT_SHORT = { strong: '强', some: '可', limited: '弱' };
var MISSING = '—';

// 「全部」时按泳道逐条打分（App 强 / Dev 强），不要用跨泳道最好成绩糊成一张「强适配」
function laneChips(p) {
  var out = [];
  ['ios', 'dev', 'ai'].forEach(function (k) {
    var v = p.fit && p.fit[k];
    if (!v || v === 'none') return;
    out.push([LANE_SHORT[k] + FIT_SHORT[v], v]);
  });
  return out;
}

function card(p) {
  var c = el('div', 'card fit-' + fitOf(p));
  c.dataset.id = p.id;
  if (done[p.id]) c.classList.add('done');

  var row = el('div', 'row');
  row.appendChild(el('div', 'name', p.name));
  var chips = el('div', 'row');
  chips.style.gap = '4px';
  if (state.lane === 'all') {
    laneChips(p).forEach(function (c2) {
      chips.appendChild(el('span', 'chip lane', c2[0]));
    });
  } else {
    chips.appendChild(el('span', 'chip', FIT_LABEL[fitOf(p)]));
  }
  chips.appendChild(el('span', 'chip ' + (p.pay || 'free'), p.pay === 'free' ? '免费' : p.pay === 'paid' ? '付费' : '有条件免费'));
  if (p.unverified) chips.appendChild(el('span', 'chip q', '未核实'));
  row.appendChild(chips);
  c.appendChild(row);

  var dl = el('dl', 'meta');
  function add(k, v, cls) {
    if (!v) return;
    dl.appendChild(el('dt', null, k));
    var dd = el('dd', cls || null, v);
    dl.appendChild(dd);
  }
  add('费用', p.cost);
  add('外链', p.linkType === 'none' ? '无（只曝光）' : p.linkType);
  add('DR', p.dr);
  add('设备', p.phone === false ? '要到电脑上做' : '手机可做');
  add('审核', p.review);
  add('排名', p.rank);
  add('建议时间', p.bestTime);
  add('门槛', p.gate, 'gate');
  c.appendChild(dl);

  var acts = el('div', 'acts');
  var bOpen = el('button', 'btn primary', '打开提交页');
  if (p.submitUrl) bOpen.onclick = function () { window.open(fill(p.submitUrl, p), '_blank', 'noopener'); };
  else bOpen.disabled = true;
  acts.appendChild(bOpen);

  var bSign = el('button', 'btn', '注册/登录');
  if (p.signupUrl) bSign.onclick = function () { window.open(p.signupUrl, '_blank', 'noopener'); };
  else bSign.disabled = true;
  acts.appendChild(bSign);

  var bCopy = el('button', 'btn', '拷物料清单');
  bCopy.onclick = function () { copyMats(p); };
  acts.appendChild(bCopy);

  var bDone = el('button', 'btn' + (done[p.id] ? ' on' : ''), done[p.id] ? '✓ 已办' : '标记已办');
  bDone.onclick = function () {
    done[p.id] = done[p.id] ? 0 : 1;
    c.classList.toggle('done', !!done[p.id]);
    bDone.className = 'btn' + (done[p.id] ? ' on' : '');
    bDone.textContent = done[p.id] ? '✓ 已办' : '标记已办';
    save();
  };
  acts.appendChild(bDone);
  c.appendChild(acts);

  var det = el('details');
  var sm = el('summary', null, '物料 / 步骤 / 坑');
  det.appendChild(sm);
  var ul = el('ul');
  (p.assets || []).forEach(function (a) { ul.appendChild(el('li', null, '物料：' + a)); });
  (p.steps || []).forEach(function (s) { ul.appendChild(el('li', null, '步骤：' + s)); });
  if (p.gotcha) ul.appendChild(el('li', null, '坑：' + p.gotcha));
  det.appendChild(ul);
  c.appendChild(det);

  var src = el('div', 'src', '核对于 ' + (p.verified || '?') + (p.src3p ? '（第三方口径）' : '') + ' · ');
  if (p.source) {
    var a = el('a', null, '证据');
    a.href = p.source; a.target = '_blank'; a.rel = 'noopener';
    src.appendChild(a); src.appendChild(document.createTextNode(' ↗'));
  }
  c.appendChild(src);
  return c;
}
function fill(tpl, p) {
  var u = p.url || PRODUCT.url || '';
  var t = p.title || PRODUCT.name || '';
  return tpl
    .replace(/\\{url\\}/g, encodeURIComponent(u))
    .replace(/\\{rawurl\\}/g, u)
    .replace(/\\{title\\}/g, encodeURIComponent(t))
    .replace(/\\{text\\}/g, encodeURIComponent(PRODUCT.tagline || ''));
}
function copyMats(p) {
  var fitTxt = state.lane === 'all'
    ? laneChips(p).map(function (c) { return c[0]; }).join(' ')
    : FIT_LABEL[fitOf(p)];
  var lines = ['## ' + p.name, '适配：' + fitTxt, '费用：' + (p.cost || MISSING)];
  if (p.linkType) lines.push('外链：' + p.linkType);
  if (p.gate) lines.push('门槛：' + p.gate);
  if ((p.assets || []).length) lines.push('', '物料：', ...p.assets.map(function (a) { return '- ' + a; }));
  if ((p.steps || []).length) lines.push('', '步骤：', ...p.steps.map(function (s, i) { return (i + 1) + '. ' + s; }));
  if (p.gotcha) lines.push('', '坑：' + p.gotcha);
  if (p.submitUrl) lines.push('', '提交页：' + p.submitUrl);
  if (p.source) lines.push('证据：' + p.source + '（核对于 ' + p.verified + '）');
  var text = lines.join('\\n');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () { toast('已复制'); }, function () { fallback(text); });
  } else fallback(text);
  function fallback(t) {
    var ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta);
    ta.select(); try { document.execCommand('copy'); toast('已复制'); } catch (e) { toast('复制失败，手动选'); }
    ta.remove();
  }
}
function pass(p) {
  if (state.lane !== 'all') {
    // 按「这个产品类型在这家能拿到多少」筛，而不是按平台自己标注的受众筛：
    // 一个 fit.ios='limited' 的通用板，对 App 仍然是个弱选项，应该看得见、由你来决定跳不跳。
    var fit = p.fit && p.fit[state.lane];
    if (!fit || fit === 'none') return false;
  }
  if (state.free && p.pay === 'paid') return false;
  if (state.todo && done[p.id]) return false;
  if (state.q) {
    var hay = [p.name, p.cost, p.gate, p.linkType, p.rank, (p.lanes || []).join(' '), p.gotcha].join(' ').toLowerCase();
    if (hay.indexOf(state.q) < 0) return false;
  }
  return true;
}
function render() {
  var main = $('#main');
  main.textContent = '';
  if ((PRODUCT.todo || []).length) {
    var brief = el('div', 'brief');
    brief.appendChild(el('h3', null, '这个产品的判断（先看这里，再看下面的平台）'));
    if (PRODUCT.state) brief.appendChild(el('p', 'st', '当前状态：' + PRODUCT.state));
    var bl = el('ul');
    PRODUCT.todo.forEach(function (t) { bl.appendChild(el('li', null, t)); });
    brief.appendChild(bl);
    main.appendChild(brief);
  }
  var shown = 0;
  (META.phases || []).forEach(function (ph) {
    var list = PLATFORMS.filter(function (p) { return p.phase === ph.id && pass(p); });
    if (!list.length) return;
    var sec = el('section');
    var h = el('h2', null, ph.name + ' ');
    h.appendChild(el('span', 'count', '· ' + list.length + ' 个'));
    sec.appendChild(h);
    sec.appendChild(el('p', 'hint', ph.hint || ''));
    var g = el('div', 'grid');
    list.forEach(function (p) { g.appendChild(card(p)); });
    sec.appendChild(g);
    main.appendChild(sec);
    shown += list.length;
  });
  if (!shown) main.appendChild(el('p', 'hint', '这个筛选下没有平台。换个泳道或把「只看没做/只看免费」关掉。'));
  var foot = $('#foot');
  foot.textContent = '';
  (META.rules || []).forEach(function (r) { foot.appendChild(el('div', null, '· ' + r)); });
  foot.appendChild(el('div', null, '· 本页只开页、递物料、记进度；提交按钮永远你自己按。'));
}
function bind() {
  Array.prototype.forEach.call(document.querySelectorAll('.tab'), function (b) {
    b.setAttribute('aria-pressed', String(b.dataset.lane === state.lane));
    b.onclick = function () {
      state.lane = b.dataset.lane;
      localStorage.setItem(KEY_LANE, state.lane);
      Array.prototype.forEach.call(document.querySelectorAll('.tab'), function (x) {
        x.setAttribute('aria-pressed', String(x.dataset.lane === state.lane));
      });
      render();
    };
  });
  $('#fFree').onchange = function (e) { state.free = e.target.checked; render(); };
  $('#fTodo').onchange = function (e) { state.todo = e.target.checked; render(); };
  $('#q').oninput = function (e) { state.q = e.target.value.trim().toLowerCase(); render(); };
}
function dsWindow() {
  try {
    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Shanghai', hour12: false, weekday: 'short', hour: '2-digit', minute: '2-digit'
    }).formatToParts(new Date());
    var o = {};
    parts.forEach(function (x) { o[x.type] = x.value; });
    var wd = o.weekday, h = parseInt(o.hour, 10), m = parseInt(o.minute, 10);
    var weekend = (wd === 'Sat' || wd === 'Sun');
    var peak = !weekend && ((h >= 9 && h < 12) || (h >= 14 && h < 18));
    var label = String(h) + ':' + (m < 10 ? '0' + m : m);
    return { peak: peak, weekend: weekend, label: label };
  } catch (e) { return null; }
}
function paintWin() {
  var el = document.getElementById('win');
  if (!el) return;
  var w = dsWindow();
  if (!w) { el.textContent = '峰谷：未知'; return; }
  el.textContent = (w.peak ? '现在高峰（双倍价）' : '现在半价') + ' · 北京 ' + w.label + (w.weekend ? ' · 周末全时段半价' : '');
  el.className = 'chip win ' + (w.peak ? 'pricey' : 'cheap');
  el.title = '高峰：周一至周五 09:00–12:00、14:00–18:00（北京时间）。其余时间与整个周末都是半价。';
}
paintWin();
setInterval(paintWin, 60000);

$('#ttl').textContent = META.title;
document.title = META.title + (PRODUCT.name ? ' · ' + PRODUCT.name : '');
bind();
render();
paintProgress();
</script>
</body>
</html>
`;

writeFileSync(out, html, 'utf8');
const bytes = Buffer.byteLength(html);
console.log(`built ${out}  (${(bytes / 1024).toFixed(1)} KB, ${data.platforms.length} platforms)`);
