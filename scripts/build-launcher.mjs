#!/usr/bin/env node
// build-launcher.mjs — 把一份「宣发 campaign」编译成一张自包含 HTML「发布台」。
// 用法: node build-launcher.mjs <campaign.json> [out.html]
// campaign.json 结构见 ../campaigns/*.json 与 SKILL.md。
// 产物是零依赖单文件 HTML：每个平台一张卡片，[一键打开发布页] + [复制标题/正文]，
// 支持 {url}/{title} 占位注入 submit 链接（如 X intent、HN submitlink、Reddit submit）。
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';

const cfgPath = process.argv[2];
if (!cfgPath) {
  console.error('usage: node build-launcher.mjs <campaign.json> [out.html]');
  process.exit(1);
}
const campaign = JSON.parse(readFileSync(cfgPath, 'utf8'));
const out = process.argv[3] || resolve(dirname(cfgPath), `发布台-${campaign.slug || 'campaign'}.html`);

// 占位符注入：submitUrl 里的 {url}/{title}/{text} 用卡片自己的字段填。
// 注入在客户端做（见下方模板），这里只把数据 JSON 塞进页面。
const DATA = JSON.stringify(campaign);

const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>宣发发布台 · ${escapeHtml(campaign.title || campaign.slug || '')}</title>
<style>
  :root{--bg:#0f1115;--card:#1a1d24;--line:#2a2f3a;--fg:#e6e9ef;--mut:#9aa4b2;--acc:#5b8cff;--ok:#3fb98a;--cn:#ff7a59;--intl:#5b8cff}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif}
  header{padding:22px 24px;border-bottom:1px solid var(--line);position:sticky;top:0;background:rgba(15,17,21,.94);backdrop-filter:blur(6px);z-index:5}
  h1{margin:0 0 6px;font-size:20px}
  .sub{color:var(--mut);font-size:13px}
  .repos{margin-top:10px;display:flex;gap:10px;flex-wrap:wrap}
  .repos a{color:var(--acc);text-decoration:none;border:1px solid var(--line);padding:4px 10px;border-radius:8px;font-size:13px}
  .repos a:hover{border-color:var(--acc)}
  .bar{margin-top:12px;font-size:13px;color:var(--mut)}
  .bar b{color:var(--ok)}
  main{padding:20px 24px;display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:16px;align-items:start}
  .card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:10px}
  .card.done{opacity:.5}
  .top{display:flex;align-items:center;gap:8px}
  .name{font-weight:600;font-size:16px}
  .tag{font-size:11px;padding:2px 7px;border-radius:99px;border:1px solid var(--line);color:var(--mut)}
  .tag.cn{color:var(--cn);border-color:var(--cn)}
  .tag.intl{color:var(--intl);border-color:var(--intl)}
  .star{color:#ffd24a;font-size:12px}
  .how{color:var(--mut);font-size:13px}
  .row{display:flex;gap:8px;flex-wrap:wrap}
  button{cursor:pointer;border:1px solid var(--line);background:#222634;color:var(--fg);padding:7px 12px;border-radius:9px;font-size:13px}
  button:hover{border-color:var(--acc)}
  button.open{background:var(--acc);border-color:var(--acc);color:#fff;font-weight:600}
  button.copy{background:#20303a}
  .field label{display:block;font-size:12px;color:var(--mut);margin:6px 0 3px}
  textarea{width:100%;background:#0e1116;color:var(--fg);border:1px solid var(--line);border-radius:9px;padding:9px;font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;resize:vertical}
  .tips{font-size:12px;color:var(--mut);border-left:2px solid var(--line);padding-left:9px;margin-top:2px}
  .cnt{font-weight:600}
  button.imgbtn{background:#2a2140;border-color:#4a3a6b}
  button.openimg{background:#20303a}
  .imgwrap{margin-top:4px}
  .imgwrap img{max-width:100%;border-radius:9px;border:1px solid var(--line);display:block}
  .imgwrap .ph{color:var(--mut);font-size:12px;border:1px dashed var(--line);border-radius:9px;padding:14px;text-align:center}
  #master{padding:2px 24px 0}
  #master .mwrap{display:flex;gap:16px;align-items:flex-start;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px}
  #master img{width:170px;border-radius:10px;border:1px solid var(--line);display:block}
  #master .mph{width:170px;height:170px;border:1px dashed var(--line);border-radius:10px;display:flex;align-items:center;justify-content:center;color:var(--mut);font-size:12px;text-align:center;padding:10px}
  #master .mbody{flex:1;min-width:0}
  #master h3{margin:0 0 6px;font-size:14px}
  .imgchip{font-size:11px;padding:2px 7px;border-radius:99px;border:1px solid #4a3a6b;color:#b79bff}
  .chk{margin-left:auto;font-size:12px;color:var(--mut);display:flex;align-items:center;gap:5px;cursor:pointer;user-select:none}
  #toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);background:var(--ok);color:#04120c;padding:9px 16px;border-radius:10px;font-size:14px;font-weight:600;opacity:0;transition:opacity .2s;pointer-events:none}
  #toast.show{opacity:1}
  footer{padding:16px 24px;color:var(--mut);font-size:12px;border-top:1px solid var(--line)}
  #lang{position:absolute;top:20px;right:24px;background:#20303a;font-weight:600}
</style>
</head>
<body>
<header>
  <button id="lang"></button>
  <h1>🦞 <span id="brand"></span> · <span id="t"></span></h1>
  <div class="sub" id="sub"></div>
  <div class="repos" id="repos"></div>
  <div class="bar" id="bar"></div>
</header>
<section id="master"></section>
<main id="grid"></main>
<footer id="foot"></footer>
<div id="toast"></div>
<script>
const C = ${DATA};
const $ = (s,r=document)=>r.querySelector(s);
const LANG={
 zh:{brand:'宣发发布台',langBtn:'EN',prog:'进度',bar:'点「一键打开」在当前浏览器开发布页（用你有各平台登录态的浏览器打开本文件）· 勾选「已发」记录到本地',open:'↗ 一键打开发布页',copy:'复制',useImg:'🖼 用主图',done:'已发',foot:'由 media-publish 生成 · 关闭源软件也能发 · 不替你点「提交」，最后一步永远你自己按',masterTitle:'🖼 通配主图（一张图配所有平台 · 需配图的卡都用它）',openBig:'打开大图（右键另存/拖去发布）',copyPrompt:'复制生图提示词',promptLabel:'🎨 生图提示词（gpt-image-2 · ',promptEnd:'）',needImg:'🖼 需配图 · 用顶部「通配主图」',masterPh:'主图未生成<br>跑 gen-images.mjs 自动出图',fTitle:'标题',fText:'正文',cn:'国内',intl:'海外'},
 en:{brand:'Launch Board',langBtn:'中',prog:'Progress',bar:'Click “Open” to launch each submit page in THIS browser (open this file in the browser where you are logged in) · check “Posted” to track locally',open:'↗ Open submit page',copy:'Copy ',useImg:'🖼 Use master image',done:'Posted',foot:'Generated by media-publish · post without installing the source app · never clicks “submit” for you',masterTitle:'🖼 Master image (one image for every platform)',openBig:'Open full image (right-click save / drag to post)',copyPrompt:'Copy image prompt',promptLabel:'🎨 Image prompt (gpt-image-2 · ',promptEnd:')',needImg:'🖼 Needs an image · use the master image above',masterPh:'Not generated yet<br>run gen-images.mjs',fTitle:'Title',fText:'Body',cn:'CN',intl:'Global'}
};
const lang=localStorage.getItem('mp-lang')||'zh';
const L=LANG[lang]||LANG.zh;
document.documentElement.lang = lang==='en'?'en':'zh-CN';
document.title = L.brand+' · ' + (C.title||'');
$('#brand').textContent=L.brand;
$('#foot').textContent=L.foot;
const _lb=$('#lang'); _lb.textContent=L.langBtn; _lb.onclick=()=>{localStorage.setItem('mp-lang', lang==='zh'?'en':'zh'); location.reload();};
$('#bar').innerHTML=L.prog+' <b id="cnt">0</b> / <span id="tot">'+((C.platforms||[]).length)+'</span> · '+L.bar;
$('#t').textContent = C.title||'';
$('#sub').textContent = C.subtitle||'';
(C.repos||[]).forEach(r=>{const a=document.createElement('a');a.href=r.url;a.target='_blank';a.textContent='↗ '+r.label;$('#repos').appendChild(a);});
if(C.masterImage){
  const m=C.masterImage;
  $('#master').innerHTML='<div class="mwrap">'+
    (m.image?'<img src="'+esc(m.image)+'" alt="master">':'<div class="mph">'+L.masterPh+'</div>')+
    '<div class="mbody"><h3>'+L.masterTitle+'</h3>'+
    '<div class="row" style="margin-bottom:8px">'+
      (m.image?'<button class="openimg" id="mopen">'+L.openBig+'</button>':'')+
      '<button class="copy imgbtn" id="mprompt">'+L.copyPrompt+'</button></div>'+
    '<div class="field"><label>'+L.promptLabel+esc(m.size||'1024x1024')+L.promptEnd+'</label><textarea rows="3" id="mpt"></textarea></div></div></div>';
  $('#mpt').value=m.prompt||'';
  if(m.image) $('#mopen').onclick=()=>window.open(m.image,'_blank');
  $('#mprompt').onclick=()=>copy(m.prompt||'');
}
const KEY='mp-done-'+(C.slug||'x');
const done=new Set(JSON.parse(localStorage.getItem(KEY)||'[]'));
function save(){localStorage.setItem(KEY,JSON.stringify([...done]));$('#cnt').textContent=done.size;}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1300);}
function fill(tpl,p){return (tpl||'').replace(/{url}/g,encodeURIComponent(p.url||C.primaryUrl||'')).replace(/{rawurl}/g,p.url||C.primaryUrl||'').replace(/{title}/g,encodeURIComponent(p.title||'')).replace(/{text}/g,encodeURIComponent(p.text||''));}
function copy(txt){navigator.clipboard.writeText(txt).then(()=>toast('已复制 ✓'),()=>{const ta=document.createElement('textarea');ta.value=txt;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();toast('已复制 ✓');});}
function cjkLen(s){let n=0;for(const ch of (s||'')){n+=/[^\\x00-\\xff]/.test(ch)?2:1;}return n;}
const grid=$('#grid');
(C.platforms||[]).forEach(p=>{
  const card=document.createElement('div');card.className='card'+(done.has(p.id)?' done':'');
  const region=p.region==='cn'?'<span class="tag cn">'+L.cn+'</span>':'<span class="tag intl">'+L.intl+'</span>';
  const star=p.priority?'<span class="star">'+'★'.repeat(p.priority)+'</span>':'';
  // 统一成 fields：title/text 是隐式字段，p.fields[] 是额外带标签字段（如 Product Hunt 表单）
  const fields=[];
  if(p.title) fields.push({label:p.titleLabel||L.fTitle,val:p.title,rows:2,limit:p.limit||0});
  if(p.text) fields.push({label:p.textLabel||L.fText,val:p.text,rows:8,limit:0});
  (p.fields||[]).forEach(f=>fields.push({label:f.label,val:f.value,rows:f.rows||4,limit:f.limit||0}));
  let h='<div class="top"><span class="name">'+esc(p.name)+'</span>'+region+star+
    '<label class="chk"><input type="checkbox" '+(done.has(p.id)?'checked':'')+'> '+L.done+'</label></div>';
  if(p.how) h+='<div class="how">'+esc(p.how)+'</div>';
  h+='<div class="row"><button class="open">'+L.open+'</button>';
  fields.forEach((f,i)=>{h+='<button class="copy" data-ci="'+i+'">'+L.copy+esc(f.label)+'</button>';});
  if(p.needsImage&&C.masterImage&&C.masterImage.image) h+='<button class="openimg" data-oi="1">'+L.useImg+'</button>';
  h+='</div>';
  fields.forEach((f,i)=>{h+='<div class="field"><label>'+esc(f.label)+(f.limit?' <span class="cnt" data-cnt="'+i+'"></span>/'+f.limit:'')+'</label><textarea rows="'+f.rows+'" data-fi="'+i+'"></textarea></div>';});
  if(p.needsImage) h+='<div class="tips">'+L.needImg+'</div>';
  if(p.tips) h+='<div class="tips">'+esc(p.tips)+'</div>';
  card.innerHTML=h;
  fields.forEach((f,i)=>{const ta=card.querySelector('[data-fi="'+i+'"]');ta.value=f.val;if(f.limit){const c=card.querySelector('[data-cnt="'+i+'"]');const upd=()=>{const n=cjkLen(ta.value);c.textContent=n;c.style.color=n>f.limit?'#ff6b6b':'#3fb98a';};upd();ta.oninput=upd;}});
  card.querySelector('.open').onclick=()=>window.open(fill(p.submitUrl||C.primaryUrl,p),'_blank');
  const oi=card.querySelector('[data-oi="1"]'); if(oi) oi.onclick=()=>window.open((C.masterImage&&C.masterImage.image)||'#','_blank');
  card.querySelectorAll('.copy').forEach(b=>b.onclick=()=>copy(fields[+b.dataset.ci].val));
  const cb=card.querySelector('.chk input');
  cb.onchange=()=>{cb.checked?done.add(p.id):done.delete(p.id);card.classList.toggle('done',cb.checked);save();};
  grid.appendChild(card);
});
function esc(s){return (s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}
save();
</script>
</body>
</html>`;

writeFileSync(out, html, 'utf8');
console.log(JSON.stringify({ ok: true, out, platforms: (campaign.platforms || []).length }));

function escapeHtml(s) { return String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
