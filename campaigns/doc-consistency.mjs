// doc-consistency 发布 campaign。
// 主线索：真书稿上第一次跑报了 147 条，其中 143 条是工具自己错 —— 这个故事同时是
// 最好的技术内容（HN/Reddit/Lobsters 吃这套）和最好的能力证明（它敢说自己错在哪）。
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));

const REPO = 'https://github.com/dongsheng123132/doc-consistency';
const BLOG = 'https://blog.hequbing.com/post?slug=doc-consistency-147-findings';
const MAIL = 'HEFANGSHENG@gmail.com';

// ── 海外 ─────────────────────────────────────────────────────────────────────
const hnBody = `I write and edit long technical documents — textbooks, bids, manuals. The errors that actually cost money there aren't typos, they're the ones that scale with length while attention doesn't: body text says "see Figure 3-12" and Figure 3-12 got lost in a merge three drafts ago.

So I wrote a checker. Deterministic rules only — cross-reference integrity, numbering continuity, TOC-vs-body reconciliation, chapter skeleton, terminology spelling drift, leftover placeholders, merge loss. No model calls, no network, no dependencies. ~1200 lines using only node:fs/path/zlib, including a minimal ZIP reader and OOXML parser so .docx works with nothing installed. That last part is deliberate: the documents this targets are unpublished manuscripts and sealed bids, and "upload it to my server" is a non-starter.

Then I ran it on a real 689-paragraph textbook draft. It reported 147 findings. 143 of them were its own bugs:

- 26 "duplicate figure numbers" were the list-of-figures at the front of the book, which reprints every caption with its page number. Every real caption in the body looked like a second occurrence.
- Every chapter in a textbook has "Learning Objectives" and "Exercises". That's the required structure, and I was reporting it as duplicate headings.
- "1. Understand projection methods;" is a list item, not a heading. Two cheap fixes killed the whole class: require two numbering segments for a bare "1.", and reject anything ending in sentence punctuation — no chapter title ends in a semicolon.

After fixing those: 4 findings, all real. One is six missing numbers in a figure sequence. One is M14X1 vs M14x1 — a thread spec with an inconsistent case, in an engineering drawing textbook, which a human proofreader is not going to catch.

The other three say the check couldn't be performed. That book's captions live inside the images or in Word SEQ fields, and field results aren't in the body text stream, so the tool genuinely cannot read them. It says so explicitly — "this check could not be performed, which is not the same as passing it" — rather than returning a clean report. A checker that hands you a clean bill of health where it can't see is a checker whose clean reports mean nothing.

Apache-2.0. ${REPO}
Longer writeup with the false-positive post-mortems: ${BLOG}`;

const redditBody = `I do editing work on long documents — textbooks, bid responses, manuals — and the expensive errors are never typos. They're the ones that scale with document length while human attention doesn't: "see Figure 3-12" pointing at a figure that got lost in a merge, numbering that skips after three people's chapters were combined, a TOC entry for a section that no longer exists.

So I made a checker. It only does deterministic things — cross-references, numbering, TOC-vs-body, chapter skeleton, terminology spelling variants, leftover TODO/TBD, merge loss against a baseline. No model, no network, no dependencies (it has its own minimal ZIP reader and OOXML parser, so .docx works with nothing installed). Fully offline, because the documents involved are usually unpublished or under seal.

Honest part: the first run on a real 689-paragraph textbook produced 147 findings and 143 were my bugs. The front-of-book list of figures was being counted as duplicate captions. Template sections that every chapter is supposed to have were reported as duplicate headings. Numbered list items were being read as headings. Fixed those, ended up with 4 real findings.

Known limits, up front:
- Word auto-numbering and auto-captions are fields, not body text. It cannot read them. When it detects that, it says the check could not be performed instead of returning a clean report.
- It does spelling-level terminology checks, not semantic ones. It will catch "AI Agent" vs "AI-Agent". It will not tell you whether "user" and "customer" mean the same thing in your document.
- It verifies that a document agrees with itself. That is not the same as the content being correct.

Apache-2.0, ${REPO}

Feedback welcome, particularly on false positives — that's where this kind of tool lives or dies.`;

const linkedinBody = `A 300-page document takes a person two days to read — and the second pass misses different things than the first.

That is not a discipline problem. Consistency errors grow with the number of pairs of places in a document; attention is a constant. Past a certain length the curves cross, and after that no amount of care closes the gap.

I have open-sourced the checker we use for that layer. It finds:

• Dangling cross-references — "see Figure 3-12" where Figure 3-12 no longer exists
• Numbering that skips or duplicates after a multi-author merge
• Table-of-contents entries with nothing behind them, and captions the TOC never listed
• Chapters missing a section that every other chapter has
• Terminology spelled three different ways
• Leftover TODO / TBD / placeholder company names in a delivered file
• Last cycle's dates and program names copied into this cycle's bid
• Paragraphs that quietly disappeared when three drafts became one

It runs entirely on your machine. No upload, no network, no model API — which matters when the file is an unpublished manuscript, a sealed bid, or a client contract.

Free, Apache-2.0: ${REPO}

What a tool cannot do is the part we do by hand: producing the corrected file with formatting intact, and building an RFP compliance matrix — every "shall" in the solicitation decomposed and mapped against your response, scored responsive / non-responsive / partially responsive.

Every engagement starts with a sample run on one chapter, so you see real findings before committing anything. If it turns up nothing real, we say so.

${MAIL}`;

const devtoBody = `## The problem

Long documents fail in a specific way. Not typos — those get caught. What survives to print is the class of error that scales with length while attention doesn't: the body says "see Figure 3-12" and Figure 3-12 was lost in a merge; the numbering skips after three authors' chapters were combined; the TOC lists a section that no longer exists.

## Zero dependencies, including the .docx reader

The whole thing is ~1200 lines using only \`node:fs\`, \`node:path\`, and \`node:zlib\`. A .docx is a ZIP of XML, so I wrote a ~40-line central-directory reader on top of \`inflateRawSync\` and a regex pass over \`word/document.xml\` for \`<w:p>\` / \`<w:t>\` / \`<w:pStyle>\`.

That is not minimalism for its own sake. This tool targets unpublished manuscripts and sealed bids. "Install these six packages and upload your file" is not an acceptable ask. Nothing to install and nothing leaving the machine is the product.

## The part worth writing about: 143 of the first 147 findings were wrong

I ran v1 against a real 689-paragraph engineering textbook. 147 findings. Only 4 were real.

**26 "duplicate figure numbers" were the list of figures.** Books reprint every caption with its page number at the front. Every real caption in the body then looks like a second occurrence. Detecting that region turned a false-positive class into a *new* check: TOC entries with nothing behind them, and captions the TOC never listed.

**Template sections read as duplicate headings.** Every chapter of a textbook has "Learning Objectives." That's the required structure. The skeleton rule already computed "sections most chapters have" — passing that set to the duplicate-heading rule fixed it. Two rules that needed to know about each other.

**List items read as headings.** \`1. Understand projection methods;\` matched "short line starting with a number." Two cheap fixes killed the class: require two numbering segments for a bare \`1.\`, and reject anything ending in sentence punctuation. No chapter title ends in a semicolon.

## Saying "I can't check this"

Three of the four surviving findings are not errors. They say the check *could not be performed*: that book's captions live inside the images or in Word SEQ fields, and field results never enter the body text stream.

The tool says so explicitly instead of returning a clean report.

> This check could not be performed. That is not the same as passing it.

A checker that hands you a clean bill of health where it cannot see is a checker whose clean reports mean nothing.

## Try it

\`\`\`bash
npx skills add dongsheng123132/doc-consistency
node scripts/check.mjs your-manuscript.docx
\`\`\`

\`--fail-on high\` exits non-zero while any high-severity finding remains, so it drops into CI — or into a contract, as an acceptance criterion a machine can adjudicate.

Apache-2.0: ${REPO}`;

const xText = `First run of my long-document consistency checker on a real 689-paragraph textbook: 147 findings.
143 were its own bugs. The list-of-figures at the front was being read as duplicate captions.
Fixed. 4 left, all real.
Offline, zero deps, Apache-2.0: ${REPO}`;

// ── 国内 ─────────────────────────────────────────────────────────────────────
const v2exBody = `做长文档编辑的活，真正费钱的错从来不是错别字，是那种随篇幅指数增长、而注意力随篇幅衰减的错：正文写「见图 3-12」，图 3-12 在三份稿子合并的时候丢了。

于是写了个查错工具。只做确定性的事：交叉引用悬空、编号跳号重号、目录与正文对账、章节骨架缺项、术语写法不一致、TODO/待填残留、合稿丢段。不调模型、不联网、零依赖 —— 1200 行只用了 node 自带的 fs/path/zlib，连读 .docx 的 ZIP 解包和 OOXML 解析都是自己写的。

最后一条是刻意的：这类工具面对的是未出版的书稿和还没开标的投标文件，「传到我服务器帮你查」根本谈不下去。

值得说的是第一次在真书稿上跑：689 段的工程制图教材，报了 147 条，其中 143 条是它自己错。

- 26 条「图号重号」，其实是书前面的图目录 —— 它把每条图题连同页码再列一遍，于是正文里每张图都成了「第二次出现」。修完之后目录反而变成一条新检查：目录列了正文没有 / 正文有目录漏了。
- 教材每章都有「学习目标」「课后作业」，那是体例，被我报成标题重复。
- 「1. 掌握投影法的概念及分类；」是列表项，被当成标题。两条便宜的规则解决一整类：裸的「1.」要求至少两段编号；标题不以句末标点收尾。

修完剩 4 条，全是真的。其中一条是 M14X1 和 M14x1 混用 —— 工程制图教材里的螺纹标注大小写不一致，人工校对基本不可能发现。

另外三条不是错误，是「这一项查不了」：那本书的图题嵌在图片里或用了 Word 自动题注域（域不落在正文文字流里），工具读不到。它会明说「本工具查不了，不代表没问题」，而不是给你一份干净报告。一个体检工具最大的危害不是漏检，是让人以为体检过了。

Apache-2.0：${REPO}
详细的假阳性复盘：${BLOG}`;

const zhihuBody = v2exBody;
const juejinBody = v2exBody;
const sspaiBody = v2exBody;

const jikeText = `写了个长文档一致性查错工具，开源了。

• 查交叉引用悬空（正文写「见图 3-12」但图没了）、编号跳号重号、目录与正文对账、章节骨架缺项、术语写法不一致、TODO 残留、合稿丢段
• 零依赖，1200 行只用 node 自带的 fs/path/zlib，读 .docx 的 ZIP 解包和 OOXML 解析都自己写的
• 不联网、不上传、不调模型 —— 面对的是未出版书稿和没开标的投标文件，上传这条路本来就走不通

第一次在真教材上跑报了 147 条，143 条是它自己错（书前面的图目录被当成第二次题注）。修完剩 4 条全是真的，其中一条是 M14X1 / M14x1 螺纹标注大小写不一致。

npx skills add dongsheng123132/doc-consistency

适合做教材、标书、手册、长篇连载的人。${REPO}`;

const weiboText = `长文档查错工具开源了：正文写「见图 3-12」但图丢了、编号跳号、目录对不上、术语三种写法、TODO 残留、合稿丢段 —— 一次查完。零依赖不联网不上传，稿子不出你自己的电脑。第一次在真教材上跑报 147 条，143 条是它自己错，修完剩 4 条全是真的。Apache-2.0 ${REPO}`;

const xhsText = `📄 写教材/标书/长篇的姐妹们，这个能救命

正文写「见图 3-12」，结果那张图在合稿的时候丢了 😭
编号从 5 跳到 7、目录和正文对不上、第二章叫「用户」第五章叫「客户」、交出去的文件里还留着「待填」

这些错的共同点：篇幅越长越多，而人越看越麻 🥲
300 页人通读两天，第二遍还漏得和第一遍不一样

做了个工具一次查完 ✅
• 交叉引用悬空
• 编号跳号 / 重号
• 目录 ↔ 正文对账
• 章节骨架缺项（别的章都有「学习目标」，这章没有）
• 术语三种写法
• TODO / 待填 / ×××公司 残留
• 合稿丢段

🔒 全程在自己电脑上跑，不联网不上传，稿子不出门（未出版的书稿谁敢传啊）

最好玩的是：第一次在真教材上跑，报了 147 条，143 条是它自己错 🤡 修完剩 4 条全是真的，其中一条是 M14X1 和 M14x1 大小写不一致，人眼真的看不出来

免费开源 ${REPO}

#长文档 #教材编写 #标书 #开源工具 #效率工具`;

const momentsText = `长文档查错工具开源了。正文写「见图 3-12」但图在合稿时丢了、编号跳号、目录对不上、术语前后不统一、交付件里还留着「待填」—— 一次查完，全程在自己电脑上跑，稿子不出门。第一次在真教材上跑报了 147 条，143 条是它自己错，修完剩 4 条全是真的。${REPO}`;

const mpBody = zhihuBody;
const bilibiliBody = zhihuBody;

// ── platforms ────────────────────────────────────────────────────────────────
const platforms = [
  // 海外优先：老外的单子在 LinkedIn 和 HN/Reddit
  {
    id: 'linkedin', name: 'LinkedIn', region: 'intl', priority: 3,
    how: '发个人动态。前两行是折叠前黄金位，已按此排版。投标经理/出版编辑都在这儿 —— 海外线索首选。',
    submitUrl: 'https://www.linkedin.com/feed/?shareActive=true',
    text: linkedinBody,
    tips: '发完去相关 group 再转一次：Proposal Management、APMP、Technical Communication。',
  },
  {
    id: 'hn', name: 'Hacker News (Show HN)', region: 'intl', priority: 3,
    how: '标题已 < 80 字符、零 emoji 零营销。正文粘进第一条评论。',
    submitUrl: 'https://news.ycombinator.com/submitlink?u={url}&t={title}',
    title: 'Show HN: Doc-consistency – find broken cross-refs in long documents, offline',
    text: hnBody,
    tips: '美东时间早上 8-10 点发。别在评论里说「check it out」。有人挑刺就正面回，HN 认这个。',
  },
  {
    id: 'reddit-techwriting', name: 'Reddit · r/technicalwriting', region: 'intl', priority: 3,
    how: '最对口的受众 —— 文档工程师天天被这些问题折磨。语气已按反自夸写。',
    submitUrl: 'https://www.reddit.com/r/technicalwriting/submit?title={title}',
    title: 'I made an offline consistency checker for long documents (cross-refs, numbering, TOC drift)',
    text: redditBody,
    tips: '先看该 sub 的 self-promo 规则，多数要求先有参与记录。别在标题里用 best/ultimate。',
  },
  {
    id: 'reddit-opensource', name: 'Reddit · r/opensource', region: 'intl', priority: 2,
    how: '同上，换个 sub。',
    submitUrl: 'https://www.reddit.com/r/opensource/submit?title={title}',
    title: 'Offline long-document consistency checker, zero dependencies (Apache-2.0)',
    text: redditBody,
    tips: '',
  },
  {
    id: 'reddit-commandline', name: 'Reddit · r/commandline', region: 'intl', priority: 2,
    how: '强调 CLI + --fail-on 退出码这条。',
    submitUrl: 'https://www.reddit.com/r/commandline/submit?title={title}',
    title: 'A zero-dependency CLI that checks long documents against themselves (.docx/.md/.txt)',
    text: redditBody,
    tips: '',
  },
  {
    id: 'x', name: 'X / Twitter', region: 'intl', priority: 3,
    how: 'URL 预填，点开就发。已压在 280 以内。',
    submitUrl: 'https://twitter.com/intent/tweet?text={text}',
    text: xText,
    tips: '发完在 thread 里补三条假阳性的细节，那个最容易被转。',
  },
  {
    id: 'devto', name: 'Dev.to', region: 'intl', priority: 3,
    how: '正文是完整技术博客，直接粘。tags 用 opensource, javascript, showdev, writing。',
    submitUrl: 'https://dev.to/new',
    title: 'How I wrote a zero-dependency .docx checker — and why 143 of its first 147 findings were wrong',
    text: devtoBody,
    tips: 'canonical_url 填博客那篇，避免 SEO 打架。',
  },
  {
    id: 'lobsters', name: 'Lobsters', region: 'intl', priority: 2,
    how: '需要邀请码才能发。有号就发，tags 选 practices / programming。',
    submitUrl: 'https://lobste.rs/stories/new',
    title: 'Doc-consistency: an offline consistency checker for long documents',
    text: hnBody,
    tips: 'Lobsters 比 HN 更反营销，正文越素越好。',
  },
  {
    id: 'producthunt', name: 'Product Hunt', region: 'intl', priority: 2,
    how: 'tagline 已 < 60 字符。首评讲那个 147→4 的故事。',
    submitUrl: 'https://www.producthunt.com/posts/new',
    title: 'Catch broken cross-references before your reader does',
    text: `An offline consistency checker for long documents. It reads .docx/.md/.txt and finds dangling cross-references, numbering that skips, TOC entries with nothing behind them, terminology spelled three ways, leftover placeholders, and paragraphs lost in a merge.

No network, no upload, no model calls, zero dependencies — the file never leaves your machine. Built for people shipping textbooks, bids, manuals and book manuscripts.

Apache-2.0. ${REPO}`,
    tips: '首评：第一次在真书稿上跑报了 147 条、143 条是自己错 —— 这个故事比任何功能列表都好使。',
  },
  {
    id: 'telegram', name: 'Telegram', region: 'intl', priority: 1,
    how: 'URL 预填。',
    submitUrl: 'https://t.me/share/url?url={url}&text={text}',
    text: 'Offline long-document consistency checker — dangling cross-refs, numbering gaps, TOC drift, merge loss. Zero deps, nothing leaves your machine. Apache-2.0.',
    tips: '',
  },
  {
    id: 'awesome', name: 'awesome-claude-code (PR)', region: 'intl', priority: 2,
    how: '提 PR 加一行到 skills 章节。',
    submitUrl: 'https://github.com/hesreallyhim/awesome-claude-code',
    title: 'Add doc-consistency',
    text: `- [doc-consistency](${REPO}) — Offline long-document consistency checker: dangling cross-references, numbering continuity, TOC-vs-body reconciliation, terminology drift, merge loss. Reads .docx/.md/.txt with zero dependencies and no network.`,
    tips: '先看 CONTRIBUTING 的格式要求，格式不对会被直接关。',
  },

  // 国内
  {
    id: 'v2ex', name: 'V2EX · 分享创造', region: 'cn', priority: 3,
    how: '发到「分享创造」节点。程序员社区，技术细节越具体越好。',
    submitUrl: 'https://www.v2ex.com/new',
    title: '写了个长文档一致性查错工具：第一次在真书稿上跑，147 条里 143 条是它自己错',
    text: v2exBody,
    tips: 'V2EX 讨厌软文。标题里那个「143 条是它自己错」就是护身符，别删。',
  },
  {
    id: 'jike', name: '即刻', region: 'cn', priority: 3,
    how: '干货无水分，bullet 用 •。',
    submitUrl: 'https://web.okjike.com/',
    text: jikeText,
    tips: '发到「AI 探索站」「独立开发者」圈子。',
  },
  {
    id: 'zhihu', name: '知乎专栏', region: 'cn', priority: 2,
    how: '观点 + 对比。正文直接粘。',
    submitUrl: 'https://zhuanlan.zhihu.com/write',
    title: '我给自己写的查错工具，第一次在真书稿上跑，147 条里 143 条是它自己错',
    text: zhihuBody,
    tips: '',
  },
  {
    id: 'juejin', name: '掘金', region: 'cn', priority: 2,
    how: '教程风。可以把零依赖 ZIP/OOXML 解析那段展开写。',
    submitUrl: 'https://juejin.cn/editor/drafts/new',
    title: '零依赖解析 .docx：我写了个长文档一致性查错工具，然后在真书稿上翻了车',
    text: juejinBody,
    tips: '标签选：开源、Node.js、前端工程化。',
  },
  {
    id: 'sspai', name: '少数派', region: 'cn', priority: 2,
    how: '轻量工具叙事，讲「谁会用、解决什么」。',
    submitUrl: 'https://sspai.com/write',
    title: '写教材和标书的人，最后一道质检该交给机器',
    text: sspaiBody,
    tips: '',
  },
  {
    id: 'weibo', name: '微博', region: 'cn', priority: 1,
    how: 'URL 预填。',
    submitUrl: 'https://service.weibo.com/share/share.php?title={text}&url={url}',
    text: weiboText,
    tips: '',
  },
  {
    id: 'xiaohongshu', name: '小红书', region: 'cn', priority: 2,
    how: '手动发。文案已按小红书体写（emoji、痛点、对比）。',
    submitUrl: 'https://creator.xiaohongshu.com/publish/publish',
    text: xhsText,
    tips: '配图建议：直接截一张体检报告的红点清单表格，比任何设计图都有说服力。',
  },
  {
    id: 'moments', name: '微信朋友圈', region: 'cn', priority: 1,
    how: '手动发，对话感。',
    submitUrl: 'weixin://',
    text: momentsText,
    tips: '',
  },
  {
    id: 'mp', name: '微信公众号', region: 'cn', priority: 2,
    how: '正文直接粘，排版后发。',
    submitUrl: 'https://mp.weixin.qq.com/',
    title: '查错工具的第一版，在真书稿上报了 147 条，其中 143 条是它自己错',
    text: mpBody,
    tips: '',
  },
  {
    id: 'bilibili', name: 'Bilibili 专栏', region: 'cn', priority: 1,
    how: '专栏文章。配一分钟录屏更好。',
    submitUrl: 'https://member.bilibili.com/platform/upload/text/edit',
    title: '长文档查错工具：147 条里 143 条是它自己错',
    text: bilibiliBody,
    tips: '',
  },
];

// X 有 280 硬限，超了直接发不出去 —— 生成时就卡死
const xLen = [...xText].reduce((n, ch) => n + (/[一-鿿　-〿＀-￯]/.test(ch) ? 2 : 1), 0)
  - REPO.length + 23;
if (xLen > 280) throw new Error(`X 文案 ${xLen} 字符，超了 280，必须删到 280 以内`);

const campaign = {
  slug: 'doc-consistency',
  title: 'doc-consistency 发布轰炸',
  subtitle: '长文档一致性体检 · 离线零依赖 · Apache-2.0 —— 主打「147 条里 143 条是它自己错」的诚实叙事',
  primaryUrl: REPO,
  repos: [
    { label: 'GitHub', url: REPO },
    { label: '博客复盘', url: BLOG },
    { label: 'ClawHub', url: 'https://clawhub.ai/skills/doc-consistency' },
  ],
  platforms,
};

const out = resolve(here, 'doc-consistency.json');
writeFileSync(out, JSON.stringify(campaign, null, 2) + '\n');
console.log(`✓ ${out}`);
console.log(`  平台 ${platforms.length} 个（海外 ${platforms.filter((p) => p.region === 'intl').length} / 国内 ${platforms.filter((p) => p.region === 'cn').length}）`);
console.log(`  X 文案 ${xLen}/280 字符`);
