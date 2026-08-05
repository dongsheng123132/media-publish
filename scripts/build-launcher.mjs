#!/usr/bin/env node
// build-launcher.mjs — 把一份「宣发 campaign」编译成一张自包含 HTML「发布台」。
// 用法: node build-launcher.mjs <campaign.json> [out.html]
// campaign.json 结构见 ../campaigns/*.json 与 SKILL.md。
// 产物是零依赖单文件 HTML：每个平台一张卡片，[一键打开发布页] + [复制标题/正文]，
// 支持 {url}/{title} 占位注入 submit 链接（如 X intent、HN submitlink、Reddit submit）。
//
// 多语言：任意文案字段（title/subtitle/name/how/title/text/tips/fields[].label/value、
// masterImage.prompt、repos[].label）都可以是「纯字符串」（对所有语言通用，向后兼容），
// 也可以是「按语言 key 的对象」{en:'...',zh:'...',ja:'...',es:'...'}。顶部语言下拉列出
// campaign.langs（缺省 ['zh','en']），切换时 UI 与所有平台文案一起换；缺某语言时回退到
// campaign.defaultLang → langs[0] → 任一存在的语言。
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
// 标题栏用 defaultLang / langs[0] / title 先渲染一版（多语言时前端会按当前语言覆盖）
const langsMeta = (campaign.langs && campaign.langs.length) ? campaign.langs : ['zh', 'en'];
const defLang = campaign.defaultLang || langsMeta[0];
const pickInit = v => (v && typeof v === 'object' && !Array.isArray(v)) ? (v[defLang] ?? v[langsMeta[0]] ?? Object.values(v)[0] ?? '') : (v || '');
const initTitle = pickInit(campaign.title) || campaign.slug || '';
const htmlLang = ({ zh: 'zh-CN', en: 'en', ja: 'ja', es: 'es' }[defLang]) || defLang;

const html = `<!doctype html>
<html lang="${htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>全媒体发布轰炸机 · ${escapeHtml(initTitle)}</title>
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
  button.pvbtn{background:#241f2e;border-color:#4a3a6b}
  .pvbox{margin-top:4px}
  .pv{border-radius:12px;overflow:hidden;font-size:13px;line-height:1.5;box-shadow:0 1px 6px rgba(0,0,0,.35)}
  .pv .pvhd{display:flex;gap:8px;align-items:center;padding:10px 12px}
  .pv .av{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#5b8cff,#3fb98a);flex:none;display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff}
  .pv .nm{font-weight:700}.pv .hnd{color:#8a94a6;font-size:12px}
  .pv .pvbody{padding:2px 12px 12px;white-space:pre-wrap;word-break:break-word}
  .pv .pvtitle{font-weight:700;padding:8px 12px 2px}
  .pv img.pvimg{width:100%;display:block}
  .pv .pvlink{margin:0 12px 12px;border:1px solid rgba(128,128,128,.3);border-radius:10px;padding:8px 10px;color:#3a6df0;font-size:12px;background:#f7f9fc}
  .pv.x,.pv.linkedin,.pv.generic,.pv.cn,.pv.xhs{background:#fff;color:#0f1419}
  .pv.reddit{background:#fff;color:#1a1a1b}
  .pv.reddit .pvsub{color:#878a8c;font-size:12px;padding:9px 12px 0}
  .pv.reddit .pvtitle{font-size:15px}
  .pv.hn{background:#f6f6ef;color:#000;padding:10px 12px}
  .pv.hn .hnmeta{color:#828282;font-size:11px}
  .pv.linkedin .hnd{font-size:11px}
  .pvcnt{font-size:11px;color:#8a94a6;padding:0 12px 8px}
  .chk{margin-left:auto;font-size:12px;color:var(--mut);display:flex;align-items:center;gap:5px;cursor:pointer;user-select:none}
  #toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);background:var(--ok);color:#04120c;padding:9px 16px;border-radius:10px;font-size:14px;font-weight:600;opacity:0;transition:opacity .2s;pointer-events:none}
  #toast.show{opacity:1}
  footer{padding:16px 24px;color:var(--mut);font-size:12px;border-top:1px solid var(--line)}
  #lang{position:absolute;top:20px;right:24px;background:#20303a;color:var(--fg);border:1px solid var(--line);border-radius:9px;padding:7px 10px;font-weight:600;font-size:13px;cursor:pointer}
  #lang:hover{border-color:var(--acc)}
</style>
</head>
<body>
<header>
  <select id="lang" title="language"></select>
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
const LNAME={zh:'中文',en:'English',ja:'日本語',es:'Español',ko:'한국어',de:'Deutsch',fr:'Français',pt:'Português'};
const LANG={
 zh:{brand:'宣发发布台',prog:'进度',bar:'点「一键打开」在当前浏览器开发布页（用你有各平台登录态的浏览器打开本文件）· 勾选「已发」记录到本地',open:'↗ 一键打开发布页',copy:'复制',copied:'已复制 ✓',useImg:'🖼 用主图',done:'已发',foot:'由 media-publish 生成 · 关闭源软件也能发 · 不替你点「提交」，最后一步永远你自己按',masterTitle:'🖼 通配主图（一张图配所有平台 · 需配图的卡都用它）',openBig:'打开大图（右键另存/拖去发布）',copyPrompt:'复制生图提示词',promptLabel:'🎨 生图提示词（gpt-image-2 · ',promptEnd:'）',needImg:'🖼 需配图 · 用顶部「通配主图」',masterPh:'主图未生成<br>跑 gen-images.mjs 自动出图',fTitle:'标题',fText:'正文',cn:'国内',intl:'海外',preview:'👁 预览',pvNow:'刚刚',pvPro:'工厂直供 · 批发',pvChars:'字符'},
 en:{brand:'Launch Board',prog:'Progress',bar:'Click “Open” to launch each submit page in THIS browser (open this file in the browser where you are logged in) · check “Posted” to track locally',open:'↗ Open submit page',copy:'Copy ',copied:'Copied ✓',useImg:'🖼 Use master image',done:'Posted',foot:'Generated by media-publish · post without installing the source app · never clicks “submit” for you',masterTitle:'🖼 Master image (one image for every platform)',openBig:'Open full image (right-click save / drag to post)',copyPrompt:'Copy image prompt',promptLabel:'🎨 Image prompt (gpt-image-2 · ',promptEnd:')',needImg:'🖼 Needs an image · use the master image above',masterPh:'Not generated yet<br>run gen-images.mjs',fTitle:'Title',fText:'Body',cn:'CN',intl:'Global',preview:'👁 Preview',pvNow:'now',pvPro:'Factory-direct · Wholesale',pvChars:'chars'},
 ja:{brand:'配信ボード',prog:'進捗',bar:'「開く」で各投稿ページをこのブラウザで開きます（ログイン済みのブラウザでこのファイルを開いてください）· 「投稿済み」にチェックでローカル記録',open:'↗ 投稿ページを開く',copy:'コピー',copied:'コピーしました ✓',useImg:'🖼 メイン画像を使う',done:'投稿済み',foot:'media-publish で生成 · アプリ未インストールでも投稿可 · 「送信」は自分で押します',masterTitle:'🖼 メイン画像（全プラットフォーム共通）',openBig:'原寸で開く（右クリック保存 / ドラッグして投稿）',copyPrompt:'画像プロンプトをコピー',promptLabel:'🎨 画像プロンプト（gpt-image-2 · ',promptEnd:'）',needImg:'🖼 画像が必要 · 上のメイン画像を使用',masterPh:'未生成<br>gen-images.mjs を実行',fTitle:'タイトル',fText:'本文',cn:'国内',intl:'海外',preview:'👁 プレビュー',pvNow:'たった今',pvPro:'工場直販 · 卸売',pvChars:'文字'},
 es:{brand:'Panel de lanzamiento',prog:'Progreso',bar:'Haz clic en «Abrir» para abrir cada página de publicación en ESTE navegador (abre este archivo en el navegador donde tienes la sesión iniciada) · marca «Publicado» para guardar localmente',open:'↗ Abrir página',copy:'Copiar ',copied:'Copiado ✓',useImg:'🖼 Usar imagen principal',done:'Publicado',foot:'Generado por media-publish · publica sin instalar la app · nunca pulsa «enviar» por ti',masterTitle:'🖼 Imagen principal (una imagen para todas las plataformas)',openBig:'Abrir imagen completa (clic derecho para guardar / arrastrar)',copyPrompt:'Copiar prompt de imagen',promptLabel:'🎨 Prompt de imagen (gpt-image-2 · ',promptEnd:')',needImg:'🖼 Necesita imagen · usa la imagen principal de arriba',masterPh:'Aún no generada<br>ejecuta gen-images.mjs',fTitle:'Título',fText:'Texto',cn:'CN',intl:'Global',preview:'👁 Vista previa',pvNow:'ahora',pvPro:'Fábrica · Mayorista',pvChars:'caracteres'}
};
const langs=(C.langs&&C.langs.length)?C.langs:['zh','en'];
let lang=localStorage.getItem('mp-lang');
if(!langs.includes(lang)) lang=langs[0];
const L=LANG[lang]||LANG[langs[0]]||LANG.en;
const DEFLANG=C.defaultLang||langs[0];
// T(v)：把「字符串 | 语言对象」解析成当前语言的字符串（多级回退）
function T(v){
  if(v==null) return '';
  if(typeof v!=='object'||Array.isArray(v)) return String(v);
  if(v[lang]!=null) return v[lang];
  if(v[DEFLANG]!=null) return v[DEFLANG];
  for(const g of langs){ if(v[g]!=null) return v[g]; }
  for(const k in v){ if(v[k]!=null) return v[k]; }
  return '';
}
document.documentElement.lang=({zh:'zh-CN',en:'en',ja:'ja',es:'es'}[lang])||lang;
document.title=L.brand+' · '+(T(C.title)||'');
$('#brand').textContent=L.brand;
$('#foot').textContent=L.foot;
const sel=$('#lang');
sel.innerHTML=langs.map(g=>'<option value="'+g+'"'+(g===lang?' selected':'')+'>'+esc(LNAME[g]||g)+'</option>').join('');
sel.onchange=()=>{localStorage.setItem('mp-lang',sel.value);location.reload();};
$('#bar').innerHTML=L.prog+' <b id="cnt">0</b> / <span id="tot">'+((C.platforms||[]).length)+'</span> · '+L.bar;
$('#t').textContent=T(C.title)||'';
$('#sub').textContent=T(C.subtitle)||'';
(C.repos||[]).forEach(r=>{const a=document.createElement('a');a.href=T(r.url);a.target='_blank';a.textContent='↗ '+T(r.label);$('#repos').appendChild(a);});
if(C.masterImage){
  const m=C.masterImage;
  $('#master').innerHTML='<div class="mwrap">'+
    (m.image?'<img src="'+esc(m.image)+'" alt="master">':'<div class="mph">'+L.masterPh+'</div>')+
    '<div class="mbody"><h3>'+L.masterTitle+'</h3>'+
    '<div class="row" style="margin-bottom:8px">'+
      (m.image?'<button class="openimg" id="mopen">'+L.openBig+'</button>':'')+
      '<button class="copy imgbtn" id="mprompt">'+L.copyPrompt+'</button></div>'+
    '<div class="field"><label>'+L.promptLabel+esc(m.size||'1024x1024')+L.promptEnd+'</label><textarea rows="3" id="mpt"></textarea></div></div></div>';
  $('#mpt').value=T(m.prompt)||'';
  if(m.image) $('#mopen').onclick=()=>window.open(m.image,'_blank');
  $('#mprompt').onclick=()=>copy(T(m.prompt)||'');
}
const KEY='mp-done-'+(C.slug||'x');
const done=new Set(JSON.parse(localStorage.getItem(KEY)||'[]'));
function save(){localStorage.setItem(KEY,JSON.stringify([...done]));const c=$('#cnt');if(c)c.textContent=done.size;}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1300);}
function fill(tpl,p){return (tpl||'').replace(/{url}/g,encodeURIComponent(p.url||C.primaryUrl||'')).replace(/{rawurl}/g,p.url||C.primaryUrl||'').replace(/{title}/g,encodeURIComponent(p.title||'')).replace(/{text}/g,encodeURIComponent(p.text||''));}
function copy(txt){navigator.clipboard.writeText(txt).then(()=>toast(L.copied),()=>{const ta=document.createElement('textarea');ta.value=txt;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();toast(L.copied);});}
function cjkLen(s){let n=0;for(const ch of (s||'')){n+=/[^\\x00-\\xff]/.test(ch)?2:1;}return n;}
function pvPick(p,fields){
  const by=re=>{const f=fields.find(f=>re.test(f.label));return f?f.val:'';};
  const title=p.title||by(/标题|Title|Tagline|タイトル|Título/)||'';
  const body=p.text||by(/正文|Body|Description|本文|Texto|Descripción/)||(fields[0]?fields[0].val:'');
  return {title,body};
}
function preview(p,fields){
  const skin=p.id==='x'?'x':/^reddit/.test(p.id)?'reddit':p.id==='hn'?'hn':p.id==='linkedin'?'linkedin':(p.id==='xiaohongshu'||p.id==='xhs')?'xhs':(p.region==='cn'?'cn':'generic');
  const c=pvPick(p,fields);
  const name=(C.repos&&C.repos[0]&&T(C.repos[0].label))||'You';
  const ini=esc(name.slice(0,1).toUpperCase());
  const host=(((C.primaryUrl||'').replace(/^https?:/,'').split('/').filter(Boolean))[0])||'';
  const showImg=C.masterImage&&C.masterImage.image&&(p.needsImage||skin==='xhs');
  const img=showImg?'<img class="pvimg" src="'+esc(C.masterImage.image)+'" alt="">':'';
  const cut=(s,n)=>{s=s||'';return esc(s.length>n?s.slice(0,n)+'…':s);};
  if(skin==='hn') return '<div class="pv hn"><div style="font-weight:600">'+cut(c.title||c.body,80)+' <span class="hnmeta">('+esc(host.split('/')[0])+')</span></div><div class="hnmeta">▲ 1 point · by you · '+L.pvNow+' · 0 comments</div></div>';
  if(skin==='reddit') return '<div class="pv reddit"><div class="pvsub">'+esc(p.previewSub||'r/community')+' · '+L.pvNow+'</div><div class="pvtitle">'+esc(c.title)+'</div><div class="pvbody">'+cut(c.body,220)+'</div>'+img+'</div>';
  if(skin==='xhs'){const lines=(c.body||'').split('\\n');return '<div class="pv xhs">'+img+'<div class="pvtitle">'+esc(lines[0]||c.title)+'</div><div class="pvbody">'+cut(lines.slice(1).join('\\n'),140)+'</div></div>';}
  const isX=skin==='x',isLi=skin==='linkedin';
  const handle=isX?('@'+(C.slug||'you').replace(/[^a-z0-9_]/gi,'').slice(0,15)):(isLi?L.pvPro:host.split('/')[0]);
  const charline=isX?'<div class="pvcnt">'+cjkLen(c.body)+'/280 '+L.pvChars+'</div>':'';
  return '<div class="pv '+(isX?'x':isLi?'linkedin':'cn')+'">'+
    '<div class="pvhd"><div class="av">'+ini+'</div><div><div class="nm">'+esc(name)+'</div><div class="hnd">'+esc(handle)+'</div></div></div>'+
    (c.title&&!isX?'<div class="pvbody" style="font-weight:700;padding-bottom:0">'+esc(c.title)+'</div>':'')+
    '<div class="pvbody">'+cut(c.body,isX?280:400)+'</div>'+charline+img+
    ((isX||isLi)?'<div class="pvlink">🔗 '+esc(host)+'</div>':'')+'</div>';
}
const grid=$('#grid');
(C.platforms||[]).forEach(p=>{
  // 按当前语言解析这张卡的所有文案（pr = platform resolved）
  const pr=Object.assign({},p,{name:T(p.name),how:T(p.how),title:T(p.title),text:T(p.text),tips:T(p.tips),url:T(p.url)});
  const card=document.createElement('div');card.className='card'+(done.has(p.id)?' done':'');
  const region=p.region==='cn'?'<span class="tag cn">'+L.cn+'</span>':'<span class="tag intl">'+L.intl+'</span>';
  const star=p.priority?'<span class="star">'+'★'.repeat(p.priority)+'</span>':'';
  // 统一成 fields：title/text 是隐式字段，p.fields[] 是额外带标签字段（如 Product Hunt / Amazon 表单）
  const fields=[];
  if(pr.title) fields.push({label:T(p.titleLabel)||L.fTitle,val:pr.title,rows:2,limit:p.limit||0});
  if(pr.text) fields.push({label:T(p.textLabel)||L.fText,val:pr.text,rows:8,limit:0});
  (p.fields||[]).forEach(f=>fields.push({label:T(f.label),val:T(f.value),rows:f.rows||4,limit:f.limit||0}));
  let h='<div class="top"><span class="name">'+esc(pr.name)+'</span>'+region+star+
    '<label class="chk"><input type="checkbox" '+(done.has(p.id)?'checked':'')+'> '+L.done+'</label></div>';
  if(pr.how) h+='<div class="how">'+esc(pr.how)+'</div>';
  h+='<div class="row"><button class="open">'+L.open+'</button>';
  fields.forEach((f,i)=>{h+='<button class="copy" data-ci="'+i+'">'+L.copy+esc(f.label)+'</button>';});
  if(p.needsImage&&C.masterImage&&C.masterImage.image) h+='<button class="openimg" data-oi="1">'+L.useImg+'</button>';
  h+='<button class="pvbtn">'+L.preview+'</button>';
  h+='</div>';
  fields.forEach((f,i)=>{h+='<div class="field"><label>'+esc(f.label)+(f.limit?' <span class="cnt" data-cnt="'+i+'"></span>/'+f.limit:'')+'</label><textarea rows="'+f.rows+'" data-fi="'+i+'"></textarea></div>';});
  if(p.needsImage) h+='<div class="tips">'+L.needImg+'</div>';
  if(pr.tips) h+='<div class="tips">'+esc(pr.tips)+'</div>';
  h+='<div class="pvbox" style="display:none"></div>';
  card.innerHTML=h;
  fields.forEach((f,i)=>{const ta=card.querySelector('[data-fi="'+i+'"]');ta.value=f.val;if(f.limit){const c=card.querySelector('[data-cnt="'+i+'"]');const upd=()=>{const n=cjkLen(ta.value);c.textContent=n;c.style.color=n>f.limit?'#ff6b6b':'#3fb98a';};upd();ta.oninput=upd;}});
  card.querySelector('.open').onclick=()=>window.open(fill(pr.submitUrl||C.primaryUrl,pr),'_blank');
  const oi=card.querySelector('[data-oi="1"]'); if(oi) oi.onclick=()=>window.open((C.masterImage&&C.masterImage.image)||'#','_blank');
  card.querySelectorAll('.copy').forEach(b=>b.onclick=()=>copy(fields[+b.dataset.ci].val));
  const pvb=card.querySelector('.pvbtn'), pvbox=card.querySelector('.pvbox');
  if(pvb) pvb.onclick=()=>{ if(pvbox.style.display!=='none'&&pvbox.innerHTML){pvbox.style.display='none';return;} fields.forEach((f,i)=>{const ta=card.querySelector('[data-fi="'+i+'"]'); if(ta) f.val=ta.value;}); pvbox.innerHTML=preview(pr,fields); pvbox.style.display='block'; };
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
console.log(JSON.stringify({ ok: true, out, platforms: (campaign.platforms || []).length, langs: langsMeta }));

function escapeHtml(s) { return String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
