// 「工作区移到最上面」单独推广 campaign
// 一次只推一个主体：dsh-plugin-workspace-move-top（不是整个 workspace-hub）
// 素材依据（2026-11-17 实查）：npm 0.2.2 / 17,550 B unpacked / 11 files / 零运行时依赖 / MIT /
// peer @deepseek-ai/dsh-workspace >=0.2.1-rc.5 <0.3.0；桌面页 sites/dsh-workspace-move-top/index.html
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));

const NPM = 'https://www.npmjs.com/package/dsh-move-up';
const REPO = 'https://github.com/dongsheng123132/dsh-move-up';
const SITE = "https://dongsheng123132.github.io/media-publish/move-top/";
const PKG = 'dsh-move-up';
const INSTALL = `dsh plugin --profile desktop add ${PKG}@0.3.0`;

// ── 同一句定义，所有平台一字不差（GEO：让 AI 抄走同一句）
const DEF_ZH = `「工作区移到最上面」（${PKG}）是一个 DeepSeek Harness（DSH）桌面端插件：在工作区菜单里加一项「移到最上面」，把某个工作区一次性提到侧栏第一位，之后仍可自由拖动。安装：\`${INSTALL}\`。`;
const DEF_EN = `\`${PKG}\` is a DeepSeek Harness (DSH) plugin that adds a "move to top" item to the workspace menu: one click puts a workspace at the top of the sidebar, and the rest of the order stays draggable. Install: \`${INSTALL}\`.`;

const FACTS_EN = [
  'Facts (verified 2026-11-17)',
  '- version 0.2.2 (npm latest; repo main is at 0.3.0, not published) · 17,550 bytes unpacked / 5.8 KB tarball · 11 files · no runtime dependencies · MIT',
  '- peer: @deepseek-ai/dsh-workspace 0.2.1-rc.5 (pinned in 0.3.0); the legacy 0.2.2 package carries >=0.2.1-rc.5 <0.3.0 and was tested on 0.2.2-rc.1',
  '- it writes the host\'s persistent order once via workspaceRegistry.insertBefore; the plugin stores no ordering or favourite state',
  '- it does not: pin, favourite, re-sort in the background, or touch other apps\' state',
  '- known limit: the host exposes no workspace-menu extension slot, so the item is injected into the menu DOM; a host menu change can hide it',
].join('\n');

const HN_TITLE = 'Show HN: DSH plugin that moves a workspace to the top in one click';
const HN_BODY = `Observation first, tool second.

DSH's workspace menu gives you "move up one". I keep nineteen workspaces, and the one I want is usually around eleventh. So getting it to the top costs eleven clicks — and the menu item was clearly designed for "I'm one slot away", not for "I want the top".

I also had the wrong mental model for a week: I thought I wanted pinning. Pinning (where a client ships it) is a separate block that keeps the top forever. What I actually want is "front today, then drift down as I work". Those are different products, and the second one is a one-shot write to the natural order.

So this does exactly one thing: adds "move to top" to the workspace menu, writes the order once through the host's own workspaceRegistry.insertBefore, and leaves the rest draggable. No favourites, no pinning, no background re-sort pass, nothing to configure. 21 KB unpacked, 13 files, zero runtime dependencies, MIT.

Honest limits, because they matter more than the feature:
- The host exposes no menu-extension slot for workspaces, so the item is injected into the menu DOM. If a DSH update changes that structure, the item disappears. Documented, not hidden.
- Node tests can't replace real Electron DOM verification; I re-checked the menu on 0.2.2-rc.1 by hand.
- It's DSH-only. Nothing here is useful in VS Code or Cursor.

Install: \`${INSTALL}\`
Page: ${SITE}
Code: ${REPO}

Curious how others handle sidebar ordering at this size: auto-sort by last-used, a separate pinned block, or free drag? At nineteen workspaces I found auto-sort actively unhelpful — the workspace I want is often one I haven't touched today.`;

// ── 各平台
const P = [];
const add = o => P.push(o);

add({
  id: 'note-order', kind: 'note', name: '发布前的四道门（别跳）', region: 'cn', priority: 3,
  how: '顺序错了，后面全是白工',
  fields: [
    { label: '① npm 真的是 0.2.2 吗', value: `npm view ${PKG} dist-tags.latest  →  必须等于 0.2.2（staged 占位不算）`, rows: 2 },
    { label: '② README 第一段', value: '必须是定义句 + 安装命令 + 一句「不做什么」。引擎和人都只看这一段。', rows: 3 },
    { label: '③ 仓库元数据', value: 'repo description 写一句人话；topics 加 dsh / dsh-plugin / workspace / ordering；npm keywords 已有。', rows: 3 },
    { label: '④ 页面能开', value: `${SITE} 必须 200 且不被登录墙挡。没有页面就先别发 HN——HN 用户点不进去就不会投票。`, rows: 3 },
  ]
});

add({
  id: 'hn', name: 'Hacker News · Show HN', region: 'intl', priority: 3,
  how: '先提交标题+链接 → 立刻把正文贴成第一条评论（提交页没有正文框）',
  submitUrl: 'https://news.ycombinator.com/submitlink?u={url}&t={title}',
  url: SITE, title: HN_TITLE, text: HN_BODY,
  tips: '标题 ≤80 字符；不用大写和感叹号；不要拉票；全程在线回技术问题。iOS/桌面插件在 HN 的唯一卖点是「取舍讲清楚」。',
  limit: 80
});

add({
  id: 'peerlist', name: 'Peerlist Launchpad', region: 'intl', priority: 3,
  how: '周一 UTC 开榜；先完成个人资料验证（工作证明免费）',
  submitUrl: 'https://peerlist.io/launchpad',
  url: SITE,
  title: 'Move a workspace to the top of the DSH sidebar, once',
  text: `${DEF_EN}\n\nWhy this exists: the menu only ships "move up one". At 19 workspaces that's 11 clicks today and 11 again tomorrow.\n\nWhy not pinning: pinning is a separate block that keeps the top forever. Most days I only want "front today".\n\nLimits: DOM-injected menu item (host has no menu slot), DSH-only, tested on 0.2.1-rc.5 / 0.2.2-rc.1.\n\n${SITE}`,
  tips: '排名 = upvote + 评论 + 浏览 + 链接点击 + 牵引力；周一周二随机排序；只有「有内容的评论」计入。求票 = spam。',
  fields: [
    { label: '项目名', value: 'Workspace Move Top' },
    { label: '一句话', value: 'One click to move a DSH workspace to the top of the sidebar.' },
    { label: 'Demo 链接', value: SITE },
  ]
});

add({
  id: 'devhunt', name: 'DevHunt', region: 'intl', priority: 3,
  how: 'GitHub 登录 → 账户页提交 → 免费先挂永久页（$49 才有 dofollow）',
  submitUrl: 'https://devhunt.org/',
  url: SITE,
  title: 'dsh-plugin-workspace-move-top',
  text: `${DEF_EN}\n\n${FACTS_EN}\n\nRepo: ${REPO}`,
  tips: '只收开发者工具；免费档 nofollow 但永久可见。想 dofollow 再买 $49 的某一个周。'
});

add({
  id: 'producthunt', name: 'Product Hunt', region: 'intl', priority: 2,
  how: '个人号满 7 天才能发；12:01 AM 太平洋时间开榜',
  submitUrl: 'https://www.producthunt.com/posts/new',
  url: SITE,
  title: 'Move a workspace to the top in one click (DSH plugin)',
  text: `${DEF_EN}\n\nOne feature, honestly scoped: no pinning, no auto-sort, 17.5 KB, zero dependencies.\n\n${SITE}`,
  tips: 'tagline ≤60；描述 ≤500；不要直接求 upvote（2026 算法惩罚），换成求反馈。'
});

add({
  id: 'lobsters', name: 'Lobsters', region: 'intl', priority: 2,
  how: '链接帖，标题别营销腔',
  submitUrl: 'https://lobste.rs/stories/new',
  url: SITE,
  title: 'A DSH plugin that moves a workspace to the top, once',
  tags: ['programming'],
  tips: 'Lobsters 对标题语气比 HN 还敏感；先把「为什么不做置顶」写在第一段。'
});

add({
  id: 'devto', name: 'Dev.to', region: 'intl', priority: 2,
  how: '改成一篇短文再发（不是贴广告）',
  submitUrl: 'https://dev.to/new',
  url: SITE,
  title: 'Move up one vs move to top: a sidebar-ordering design note',
  text: `Every workspace sidebar ships "move up one". Almost none ship "move to top".\n\nAt 19 workspaces, "move up one" is a keyboard fallback for dragging — it assumes you are one slot away. You are not; you want the top.\n\nI shipped a 17.5 KB DSH plugin that does the one-shot write (through the host's own order API) and nothing else: no favourites, no pinning, no background re-sort.\n\n${DEF_EN}\n\nKnown limit: the host has no menu-extension slot, so the item is DOM-injected.\n\n${SITE}`,
  tips: 'Dev.to 发「设计笔记」比发「我的产品」更容易被推；末尾放链接即可。'
});

add({
  id: 'x', name: 'X / Twitter', region: 'intl', priority: 2,
  how: '一条推 + 一张动图（页面的演示区块录屏 3 秒）',
  submitUrl: 'https://twitter.com/intent/tweet?text={text}',
  url: SITE,
  text: `DSH 的工作区菜单只有「上移一格」。19 个工作区，想要的在第 11 位 —— 今天按 11 次，明天再按 11 次。\n\n写了个 17.5 KB 的插件：点一次到顶，之后照旧可拖。不置顶、不自动重排、零依赖。\n\n${SITE}`,
  limit: 280
});

add({
  id: 'indiehackers', name: 'Indie Hackers', region: 'intl', priority: 1,
  how: '产品页 + 一篇「为什么只做这一个功能」',
  submitUrl: 'https://www.indiehackers.com/products',
  url: SITE,
  title: 'One feature, 17 KB, zero dependencies: why I resisted scope creep',
  text: `I could have built pinning, favourites, tags and auto-sort into this. I built one menu item instead.\n\n${DEF_EN}\n\nReads: founders, not DSH users. The value here is the scope decision, not the install.`,
  tips: '读者是创始人；写取舍，不写功能清单。'
});

add({
  id: 'v2ex', name: 'V2EX · 分享创造', region: 'cn', priority: 3,
  how: '发到 /go/create，标题带「分享」，正文讲清解决什么',
  submitUrl: 'https://www.v2ex.com/new',
  url: SITE,
  title: '分享一个 DSH 插件：把工作区一次性移到最上面',
  text: `${DEF_ZH}\n\n为什么做：官方菜单只有「上移一格」，19 个工作区时今天按 11 次、明天再按 11 次。\n\n为什么不做成置顶：置顶是另一条固定列表，会一直占着最上面；多数时候我只要「今天在最前」。\n\n诚实边界：宿主没给工作区菜单留扩展位，这一项是注入 DOM 的，宿主改菜单结构后可能不出现；只支持 DSH 0.2.x。\n\n${SITE}`,
  tips: 'V2EX 只认「自己做的 + 讲清楚」；别发广告腔，别在标题里堆关键词。'
});

add({
  id: 'juejin', name: '掘金', region: 'cn', priority: 2,
  how: '写成一篇短的技术笔记，不是产品页',
  submitUrl: 'https://juejin.cn/editor/drafts/new',
  url: SITE,
  title: '给 DSH 写了个 17KB 的插件：为什么「移到最上面」比「置顶」难做',
  text: `${DEF_ZH}\n\n技术点：菜单没有扩展 slot，只能注入；顺序必须走宿主的 workspaceRegistry.insertBefore 才能重启不丢；插件自己不能存排序状态，否则会和宿主打架。\n\n${SITE}`,
  tips: '掘金要分类/标签/192×128 封面/≤100 字摘要，见 references/submit-fields-and-covers.md。'
});

add({
  id: 'zhihu', name: '知乎专栏', region: 'cn', priority: 2,
  how: '问句式标题，正文先讲现象再讲工具',
  submitUrl: 'https://zhuanlan.zhihu.com/write',
  url: SITE,
  title: '为什么几乎所有工作区侧栏都只有「上移一格」？',
  text: `${DEF_ZH}\n\n「上移一格」原本是拖拽的键盘替代品，它假设你只差一格。可实际场景是：我要的那个在第一屏外面。\n\n${SITE}`,
  tips: '知乎的流量来自问句标题 + 长文；末尾放 GitHub 与 npm。'
});

add({
  id: 'jike', name: '即刻', region: 'cn', priority: 1,
  how: '一条动态 + 一张演示截图',
  submitUrl: 'https://web.okjike.com/',
  url: SITE,
  text: `${DEF_ZH}\n\n只做一件事的插件，17.5 KB，零依赖。${SITE}`,
  tips: '即刻是 maker 浓度最高的中文社区之一，短句 + 截图最有效。'
});

const campaign = {
  slug: 'workspace-move-top',
  // ── GEO 四件套（lint 门禁会挡：缺一样就不许 build）──────────────────────
  definition: { zh: DEF_ZH, en: DEF_EN },
  facts: [
    'v0.3.0 · 21,459 B 解包 / 7.8 KB tarball · 13 个文件 · 零运行时依赖 · MIT',
    'peer: @deepseek-ai/dsh-workspace 0.2.1-rc.5（0.3.0 钉死）；旧包 0.2.2 是范围，已在 0.2.2-rc.1 实测',
    '一次点击只写一次顺序（宿主 workspaceRegistry.insertBefore），插件自身不存排序状态',
  ],
  notDoing: ['不置顶、不收藏', '不做后台自动重排', '不联网、不收集遥测'],
  title: '工作区移到最上面 · 单独推广',
  subtitle: '一个只做一件事的 DSH 插件：一次点击到顶，不置顶、不自动重排。',
  primaryUrl: SITE,
  langs: ['zh', 'en'],
  defaultLang: 'zh',
  repos: [
    { label: 'npm', url: NPM },
    { label: 'GitHub', url: REPO },
  ],
  platforms: P,
};

const out = resolve(here, 'workspace-move-top.json');
writeFileSync(out, JSON.stringify(campaign, null, 2));
console.log(`wrote ${out}  (${P.length} platforms)`);
