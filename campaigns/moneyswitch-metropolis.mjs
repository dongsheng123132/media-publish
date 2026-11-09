// MoneySwitch 全媒体发布 campaign（Monad Metropolis 评审期推广）
// 文案事实来源：launch-kit-2026-10.md / judge-post-2026-10.md / submission.md / 四平台分发包
// 生成 campaigns/moneyswitch-metropolis.json
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));

const GITHUB = 'https://github.com/dongsheng123132/moneyswitch';
const APP = 'https://app.moneyswitch.dev';
const SITE = 'https://moneyswitch.dev';

// ── 英文文案 ──
const hnTitle = 'Show HN: MoneySwitch – AI agents pay x402 APIs in USDC (self-hosted)';
const hnBody = `I wanted my AI agents (Claude Code, Codex) to be able to pay the paid APIs they increasingly hit — data queries, model calls, image generation — without handing them a private key that can spend everything.

MoneySwitch is a self-hosted server that holds the USDC wallet and gives the agent a budget-limited MoneyKey: per-request, daily and total caps, a host allowlist, and a human approval step (4-6 digit PIN) for anything above a threshold. The agent never sees the private key; every payment is an on-chain tx (EIP-3009, facilitator pays the gas).

It has paid for real on Monad mainnet ($0.01 Nansen query), and a Qwen 3.8 Max agent bought 5 Nansen queries within a $0.09 budget. Testnet is live: ${APP} — repo: ${GITHUB}`;

const redditTitle = 'I made an open-source, self-hosted way for Claude Code to pay paid APIs without ever seeing my private key';
const redditBody = `The problem: agents (Claude Code, Codex) increasingly call paid APIs — data, models, images — and the naive fix is dropping a wallet private key into .env. That's unlimited authorization.

I built MoneySwitch: a self-hosted server that holds the USDC wallet and issues the agent a budget-limited "MoneyKey" — per-request/daily/total caps, host allowlist, and a human PIN (4-6 digits) approval for anything above a threshold. The private key never leaves your server; every payment is an on-chain tx.

Honest trade-offs: it's early (v0.7.x), deliberately one instance = one payer (no hosting, no multi-tenant), testnet keys pay only test USDC, and you run it yourself. It has paid for real on Monad mainnet and on Base.

Testnet: ${APP} · Repo: ${GITHUB} (AGPL-3.0 server)
Feedback very welcome.`;

const tweet = `Your AI wants to buy APIs. Don't hand it your private key. MoneySwitch gives it a budget-limited MoneyKey: pays x402 APIs in USDC, pauses for your PIN above a threshold, never touches the key. Self-hosted, open source. ${GITHUB} #x402 #AIAgents`;

const linkedinText = `Shipped MoneySwitch — an open-source, self-hosted way to let AI agents pay for paid APIs, without giving them your wallet private key.

The problem: agents (Claude Code, Codex) increasingly call paid APIs, and the common fix — putting a private key in .env — means unlimited authorization, no budget, no audit.

MoneySwitch holds the USDC wallet and issues agents a budget-limited MoneyKey: per-request / daily / total caps, a host allowlist, and a 4-6 digit PIN approval for anything above a threshold. Every payment is on-chain; the agent never sees the private key.

Real usage: paid $0.01 on Monad mainnet for Nansen data; a Qwen agent made 5 purchases inside a $0.09 budget. Testnet live, open source (AGPL-3.0). ${GITHUB}`;

const phTagline = 'Give your AI agent an API key for money';
const phDesc = `A self-hosted server that lets AI agents pay for x402 APIs in USDC — within a budget you set. Agents get a MoneyKey (per-request / daily / total caps, host allowlist) instead of your private key; payments above a threshold wait for your 4-6 digit PIN. Every payment is an on-chain tx (EIP-3009, facilitator pays gas). Paid for real on Monad mainnet (Nansen, $0.01); testnet live at ${APP}. Open source (AGPL-3.0), one instance = one payer.`;
const phFirst = `Hey PH 👋 I kept watching my agents hit paid APIs — Nansen data, model calls, image gen — and the common fix ("just drop your private key in .env") felt like handing a stranger your credit card and hoping for the best.

So I built MoneySwitch: self-hosted, it holds the USDC wallet and hands the agent a budget-limited MoneyKey. Caps you set, hosts you allow, and anything above a threshold pauses for your PIN (4-6 digits) before any money moves. The private key never reaches the agent; every payment is on-chain.

It has paid for real on Monad mainnet — a Qwen 3.8 Max agent bought 5 Nansen queries inside a $0.09 budget, all verifiable on-chain. Testnet: ${APP}. It's early, I use it daily, and feedback is very welcome 🙏 ${GITHUB}`;

const devtoTitle = 'Building MoneySwitch: an "API key for money" so AI agents can pay for APIs';
const devtoText = `How I built MoneySwitch — a self-hosted server that gives AI agents a budget-limited key to pay x402 APIs in USDC, instead of a wallet private key.

TL;DR: agents get a MoneyKey (caps + host allowlist + PIN approval), the private key never leaves your server, every payment is on-chain (EIP-3009, facilitator pays gas).

Why: Claude Code / Codex increasingly call paid APIs (data, models, images). The naive fix — a private key in .env — is unlimited authorization. The missing layer is a "spending key": can pay, but only within the budget and rules you set, and a human approves anything above a threshold.

Proof it works: paid $0.01 on Monad mainnet for Nansen data; a Qwen 3.8 Max agent bought 5 Nansen queries inside a $0.09 budget. Testnet: ${APP}

Repo: ${GITHUB} · Self-hosted · AGPL-3.0 (server) · no token, no coin, one instance = one payer.

tags: opensource, x402, web3, ai`;

const tgText = `MoneySwitch — give your AI agent an API key for money: pays x402 APIs in USDC within your budget, asks you before big payments, never touches your private key. Self-hosted, open source. ${GITHUB}`;

// ── 中文文案 ──
const v2exTitle = '做了个开源项目 MoneySwitch：给 AI 一把"花钱的 API Key"，在预算内用 USDC 付 x402 接口';
const v2exBody = `一直有个问题：AI（Claude Code / Codex 这类）越来越多地要调付费 API——查数据、跑模型、出图，接口直接返回 HTTP 402 报价。让它自己付钱吧，就得把钱包私钥给它，等于无限授权；不让它付吧，工作流全断。

于是做了 MoneySwitch：自托管服务器，持有 USDC 钱包，给 AI 发一把额度受限的 MoneyKey——
- 日额度 / 总预算 / 单笔上限 / 审批阈值 / 域名白名单，都可配
- 单笔超阈值：请求暂停，AI 把审批链接发给你，输入 4-6 位确认码批准或拒绝
- 私钥只在你的服务器上，AI 从头到尾碰不到
- 每笔链上可查（EIP-3009 授权 + facilitator 代付 gas，付款方不用持有 native token）
- charged 用 yes/no/maybe 诚实记账，结果未知不自动重试

真实跑通：Monad 主网买过 Nansen 数据（0.01 USDC，链上可查）；一个 Qwen 3.8 Max agent 在 $0.09 预算内自买 5 次查询。测试网在线：${APP}

边界：one instance = one payer，一台只替一个出钱的人花钱，不做托管、不碰别人的钱；不造协议不发币，底层用 x402 官方 SDK + Monad + Circle USDC。服务端 AGPL-3.0，仓库：${GITHUB}

现在正好在 Monad Metropolis 黑客松评审期（10/14-10/27）。欢迎提 issue。`;

const juejinTitle = '给 AI 一把"花钱的 API Key"：MoneySwitch 如何让 Agent 在预算内自主付费';
const juejinBody = `摘要：x402 让"按用量付费的 API"成了常态，AI 自主调用付费接口是大势所趋；但"让 AI 付钱"和"把私钥给 AI"是两件事。MoneySwitch 用一把额度受限的 MoneyKey 把这两件事分开：AI 能花钱，但花多少你说了算，大额要人点头，每笔链上可查。

一、x402：API 开始按用量收费
HTTP 402 Payment Required —— 卖方 API 在需要付费时返回 402 和报价，付款方以 USDC 支付后获得结果。AWS、Cloudflare、Vercel 等基础设施已原生支持。

二、传统做法的两难
给 AI 私钥 = 无限授权，额度管不住、风险兜不住；每次人工手动付 = 工作流被频繁打断。中间缺的是一层"有额度的钥匙"。

三、MoneySwitch 的设计
- MoneyKey 不是钱也不是私钥：日额度 / 总预算 / 单笔上限 / 审批阈值 / 域名白名单
- 大额过人工：4-6 位确认码，AI 永不自我批准
- 诚实记账：charged yes / no / maybe，未知结果不自动重试
- 链上可查：EIP-3009 授权 + facilitator 代付 gas

四、真实跑通的证据
Monad 主网买过 Nansen 数据（0.01 USDC）；Qwen 3.8 Max agent 在 $0.09 预算内自买 5 次查询；新 agent 10 分钟路径：发 Key → 配额度 → 调用 → 审批 → 入账。

五、边界与承诺
one instance = one payer，非托管；不造协议不发币；服务端 AGPL-3.0，测试网与主网 key 分网。测试网：${APP}，仓库：${GITHUB}`;

const zhihuTitle = 'AI 会自己花钱了，但钱包私钥真的不能给它——这是我做 MoneySwitch 的原因';
const zhihuBody = `先把观点放这：让 AI 自己花钱这件事，方向是对的；把钱包私钥给 AI 这件事，是错的。两者不该被绑在一起。

x402 协议正在让"按用量付费的 API"成为常态——查数据、跑模型、生成图片，接口直接返回 402 报价。AI 要真正干活，就得能付钱。于是出现了两种主流做法：

做法一：把私钥塞进 .env。等于无限授权——AI 花多少钱你管不住，泄露就是全部家当。
做法二：每次人工手动付。安全，但 AI 的工作流被反复打断，等于没让 AI 干活。

我的答案是第三种：给 AI 一把"花钱的 API Key"（MoneyKey）——有额度、有上限、大额先问你、每笔链上可查，私钥 AI 永远碰不到。像给员工发一张限定额度的公司卡，而不是把保险柜钥匙给他。

有人会说：自托管不麻烦吗？是麻烦，但 one instance = one payer 换来的是清晰的责任边界——我不替陌生人管钱，你也别把身家押给第三方托管。

它已经真实跑通：Monad 主网付过 Nansen 数据费（0.01 USDC，链上可查），一个 Qwen agent 在 $0.09 预算内自买 5 次查询。测试网 2 分钟上手：${APP}

开源仓库：${GITHUB}（服务端 AGPL-3.0）。欢迎讨论。`;

const jikeText = `给 AI 一把"花钱的 API Key"，它就能自己在预算内买付费 API 了。

• 私钥 AI 碰不到，MoneyKey 有额度有上限
• 大额先问你，输 4-6 位确认码才放行
• 每笔链上可查，charged yes/no/maybe 老实记账
• 测试网 2 分钟上手，开源自托管

写给：被"让 AI 自己付钱"困扰的 Claude Code / Codex 玩家。
测试网：${APP}
仓库：${GITHUB}`;

const sspaiTitle = 'MoneySwitch：给 AI 一把"花钱的 API Key"，私钥不落地';
const sspaiBody = v2exBody;

const mpTitle = '给 AI 一把"花钱的 API Key"：私钥不落地，钱却照花';
const mpBody = `AI 正在学会花钱。x402 协议让"按用量付费的 API"成了常态：查数据、跑模型、生成图片，接口直接返回 402 报价，付了钱才给结果。于是问题来了——让 AI 自己付钱，是不是就得把钱包私钥给它？

把私钥交给 AI，等于给它无限授权：额度你管不住、风险你兜不住、每笔钱花在哪你事后才知道。可如果每次都人工手动付，AI 的工作流又被频繁打断。

这个叫 MoneySwitch 的开源项目，给的是第三种方案：给 AI 一把"花钱的 API Key"。

一、AI 开始自己花钱了，问题也来了
x402 是基于 HTTP 402 Payment Required 的支付协议：卖方 API 在需要付费时返回 402 和报价，付款方以 USDC 支付后获得结果。AWS、Cloudflare、Vercel 等基础设施已经原生支持。
给 AI 私钥，风险不可控；不给，AI 寸步难行。中间缺的是一把有额度的钥匙——能花钱，但花多少你说了算，大额要人点头，每笔都能查。

二、MoneySwitch：一把"花钱的 API Key"
(1) MoneyKey 不是钱，也不是私钥：日额度、总预算、单笔上限、审批阈值、域名白名单都能配，私钥只存在于你的服务器。
(2) 大额过人工：单笔达到审批阈值请求暂停，AI 把链接发给你，输入 4-6 位确认码批准或拒绝，不用登录，AI 永不自我批准。
(3) 诚实记账：charged yes / no / maybe，结果未知不自动重试，避免同一笔钱重复付。
(4) 链上可查：EIP-3009 授权 + facilitator 代付 gas，付款方无需持有 native token。

三、真实跑通的证据
Monad 主网真实买过 Nansen Token Screener 数据（0.01 USDC，交易哈希链上可查）；一个 Qwen 3.8 Max agent 按 $0.09 预算自己完成 5 次 Nansen 查询；新 agent 10 分钟路径：发 Key → 配额度 → 调用 → 审批 → 入账。

四、边界与承诺
one instance = one payer：一台部署只替一个出钱的人花钱，不注册、不替陌生人管钱。不造协议、不发币，底层用 x402 官方 SDK、Monad、Circle USDC。服务端/核心/后台 AGPL-3.0-only，skill 包等 Apache-2.0；测试网 key 只付测试币，主网 key 分网管理。

眼下，MoneySwitch 正在参加 Monad Metropolis 黑客松的评审期（10/14-10/27）。给 AI 花钱这件事，正在从"敢不敢"变成"怎么设计得更安全"。

测试网在线体验：${APP}；官网：${SITE}；代码：${GITHUB}`;

const xhsTitle = '你的 AI 会花钱了，但私钥千万别给它';
const xhsText = `最近挖到一个很妙的开源项目：给 AI 一把"花钱的 API Key"。

背景先放这：现在越来越多的 API 开始按用量收费（x402 协议，HTTP 402 就是"要付钱"）。AI 写代码、查数据、出图，都会碰到付费接口。问题是——让 AI 自己付钱，就得把钱包私钥给它？

反正我不敢。

MoneySwitch 解决的就是这件事：

✅ 不给私钥：AI 拿到的是叫 MoneyKey 的钥匙，有额度、有上限，私钥它从头到尾碰不到

✅ 大额先问人：单笔超过你设的阈值，AI 把链接发给你，你输 4-6 位确认码批准，它才继续

✅ 每笔可查：charged 用 yes/no/maybe 老实记账，结果未知不自动重试

✅ 2 分钟上手：测试网贴两行配置就能跑（MONEY_API_BASE + MONEY_API_KEY）

✅ 开源自托管：一台只替一个出钱的人干活，不做托管、不碰别人的钱

我最种草的一点：它让 AI 按 $0.09 预算自己买过 5 次 Nansen 数据查询，链上都能查到。人机之间的信任，终于不用靠"把私钥交给它"来赌了。

想玩的直接去测试网：${APP}，开源代码在 GitHub 搜 moneyswitch。

#AI编程 #开源项目 #x402 #AIAgent #程序员日常 #效率工具`;

const weiboText = `AI 开始自己花钱了——x402 付费 API 越来越多，但把钱包私钥直接给 AI 这件事，我是真不建议。私钥等于无限授权，一旦泄露就是全部家当。有个开源项目 MoneySwitch 换了个思路：给 AI 一把"花钱的 API Key"，额度你定、大额先问你、每笔链上可查、私钥不落地。${APP} #AI #开源 #x402`;

const momentsText = `给 AI 一把"花钱的 API Key"🦞 它在预算内用 USDC 付 x402 接口，大额先问我，私钥它碰不到。开源自托管，测试网 2 分钟上手 👉 ${APP}`;

const douyinText = `你敢把钱包私钥给 AI 吗？反正我不敢。MoneySwitch：给 AI 一把"花钱的 API Key"，额度你定、大额先问你、私钥不落地、链上可查。测试网 2 分钟上手。#AI编程 #AIAgent #x402 #开源`;

const shipinhaoTitle = '你敢把钱包私钥给 AI 吗？';
const shipinhaoBody = `给 AI 一把"花钱的 API Key"，它就能自己在预算内付 x402 付费接口。
1. 私钥 AI 碰不到，MoneyKey 有额度有上限
2. 大额先问你，输 4-6 位确认码才放行
3. 每笔链上可查，诚实记账
4. 测试网 2 分钟上手：${APP}
#AI #x402 #开源`;

const biliTitle = '给 AI 一把"花钱的 API Key"：私钥不落地，钱却照花';
const biliBody = v2exBody;

// ── 通配主图：直接用真实海报（shots/01.png 复制到 output/moneyswitch-master.png），不走 AI 生图 ──
const campaign = {
  slug: 'moneyswitch-metropolis',
  title: 'MoneySwitch 全媒体发布台',
  subtitle: '给 AI 一把"花钱的 API Key" · Monad Metropolis 评审期推广（10/14-10/27）',
  primaryUrl: GITHUB,
  langs: ['zh', 'en'],
  defaultLang: 'zh',
  masterImage: {
    image: 'moneyswitch-master.png',
    prompt: '（已使用真实产品海报作为通配主图，无需 AI 生成）',
    size: '1920x1080',
  },
  repos: [
    { label: 'GitHub 仓库', url: GITHUB },
    { label: '官网', url: SITE },
    { label: '测试网', url: APP },
  ],
  platforms: [
    { id: 'hn', name: 'Hacker News', region: 'intl', priority: 3, how: 'Show HN：标题带仓库链接，正文贴首评。美西早 8-10 点最佳',
      submitUrl: 'https://news.ycombinator.com/submitlink?u={url}&t={title}', url: GITHUB,
      title: hnTitle, text: hnBody,
      tips: '标题已卡在 80 字符内；HN 与 Reddit 别同一天发；前几小时守评论区。' },
    { id: 'reddit_claude', name: 'Reddit · r/ClaudeAI', region: 'intl', priority: 3, how: '先看置顶规则再发',
      submitUrl: 'https://www.reddit.com/r/ClaudeAI/submit?title={title}', url: GITHUB,
      title: redditTitle, text: redditBody,
      tips: 'r/ClaudeAI 最对口；别用营销词，诚实说 trade-off。' },
    { id: 'reddit_llama', name: 'Reddit · r/LocalLLaMA', region: 'intl', priority: 2,
      submitUrl: 'https://www.reddit.com/r/LocalLLaMA/submit?title={title}', url: GITHUB,
      title: redditTitle, text: redditBody,
      tips: '强调自托管 / 不依赖第三方 / 开源协议。' },
    { id: 'reddit_prog', name: 'Reddit · r/programming', region: 'intl', priority: 2,
      submitUrl: 'https://www.reddit.com/r/programming/submit?title={title}', url: GITHUB,
      title: redditTitle, text: redditBody,
      tips: 'r/programming 量大，标题保持描述性。' },
    { id: 'ph', name: 'Product Hunt', region: 'intl', priority: 3, how: '按表单逐格填：Name / Tagline(≤60) / Description(≤500) / Tags / First comment',
      submitUrl: 'https://www.producthunt.com/posts/new',
      fields: [
        { label: 'Name', value: 'MoneySwitch', rows: 2 },
        { label: 'Tagline', value: phTagline, limit: 60, rows: 2 },
        { label: 'Description', value: phDesc, limit: 500, rows: 6 },
        { label: 'Launch tags（选 3 个）', value: 'Developer Tools · Artificial Intelligence · Blockchain', rows: 2 },
        { label: 'First comment（essential）', value: phFirst, rows: 9 },
      ],
      tips: '建议评审结果公布后 11/4-11/6 发布（周二/三最稳）；发布日当天首评立即发；备好主图+演示 GIF。' },
    { id: 'x', name: 'X / Twitter', region: 'intl', priority: 3, how: '点「一键打开」自动预填推文，再配主图',
      submitUrl: 'https://twitter.com/intent/tweet?text={text}', text: tweet, needsImage: true,
      tips: '已按 280 硬限压过；配主图/演示 GIF 转化翻倍。' },
    { id: 'devto', name: 'Dev.to', region: 'intl', priority: 2, how: '标题+摘要+tags，正文贴短文',
      submitUrl: 'https://dev.to/new',
      title: devtoTitle, text: devtoText,
      tips: 'tags 用 opensource, x402, web3, ai。' },
    { id: 'linkedin', name: 'LinkedIn', region: 'intl', priority: 2, how: '前 2 行是折叠前黄金位',
      submitUrl: 'https://www.linkedin.com/feed/?shareActive=true',
      text: linkedinText, needsImage: true,
      tips: '职业化语气，突出"解决了什么"。' },
    { id: 'lobsters', name: 'Lobsters', region: 'intl', priority: 1, how: '需邀请码，质量高',
      submitUrl: 'https://lobste.rs/stories/new',
      title: hnTitle, text: hnBody,
      tips: '有邀请码再发；打 tag: ai, crypto。' },
    { id: 'telegram', name: 'Telegram', region: 'intl', priority: 1, how: '一键预填分享到频道/群',
      submitUrl: 'https://t.me/share/url?url={rawurl}&text={text}', url: GITHUB, text: tgText,
      tips: '短一句 + 链接即可。' },
    { id: 'awesome', name: 'awesome-x402（PR 已提交）', region: 'intl', priority: 1, how: '无需操作',
      submitUrl: 'https://github.com/xpaysh/awesome-x402/pull/1837',
      text: 'PR #1837 已于 2026-10-15 提交（dongsheng123132:add-moneyswitch → xpaysh/awesome-x402 main），等待合并即可。如需跟进：https://github.com/xpaysh/awesome-x402/pull/1837',
      tips: '已提交，等维护者合并；别重复开 PR。' },
    { id: 'v2ex', name: 'V2EX · 分享创造', region: 'cn', priority: 3, how: '选「分享创造」节点',
      submitUrl: 'https://www.v2ex.com/new',
      title: v2exTitle, text: v2exBody,
      tips: '⭐ 程序员聚集最对口；标题别标题党。' },
    { id: 'juejin', name: '掘金', region: 'cn', priority: 2, how: '编辑器贴正文，可扩成教程',
      submitUrl: 'https://juejin.cn/editor/drafts/new',
      title: juejinTitle, text: juejinBody,
      tips: '可加代码块/截图扩成教程；tags：AI、开源、效率工具。' },
    { id: 'zhihu', name: '知乎专栏', region: 'cn', priority: 2,
      submitUrl: 'https://zhuanlan.zhihu.com/write',
      title: zhihuTitle, text: zhihuBody,
      tips: '知乎吃"观点+对比"，开头抛痛点。' },
    { id: 'sspai', name: '少数派', region: 'cn', priority: 2, how: '投稿',
      submitUrl: 'https://sspai.com/write',
      title: sspaiTitle, text: sspaiBody,
      tips: '配图讲"轻量自托管"和"私钥不落地"两个点。' },
    { id: 'jike', name: '即刻', region: 'cn', priority: 2, how: '发动态，配图',
      submitUrl: 'https://web.okjike.com/', text: jikeText, needsImage: true,
      tips: '• bullet + 链接，不堆 emoji。' },
    { id: 'mp', name: '微信公众号', region: 'cn', priority: 2, how: '长文排版后发',
      submitUrl: 'https://mp.weixin.qq.com/',
      title: mpTitle, text: mpBody,
      tips: '文末放仓库+测试网链接；备选标题：AI 会花钱了，但私钥真的不能给它 / x402 时代，AI 的"钱包"应该长什么样。' },
    { id: 'xiaohongshu', name: '小红书', region: 'cn', priority: 2, how: 'creator 后台发（网页登录），必须配图',
      submitUrl: 'https://creator.xiaohongshu.com/publish/publish',
      title: xhsTitle, text: xhsText, needsImage: true,
      tips: 'emoji 小标题 + ✅ 清单 + 单独一行 tags；配图用顶部通配主图。' },
    { id: 'weibo', name: '微博', region: 'cn', priority: 1, how: '一键预填分享',
      submitUrl: 'https://service.weibo.com/share/share.php?title={text}&url={rawurl}', url: GITHUB,
      text: weiboText, needsImage: true,
      tips: '一句话 + #话题#，配主图。' },
    { id: 'moments', name: '微信朋友圈', region: 'cn', priority: 1, how: '手机端发（网页无提交页），配图',
      submitUrl: 'weixin://', text: momentsText, needsImage: true,
      tips: '朋友圈只能手机发；文案+主图先在这拷好。' },
    { id: 'douyin', name: '抖音', region: 'cn', priority: 1, how: 'creator 后台传短视频，标题当封面文案',
      submitUrl: 'https://creator.douyin.com/', text: douyinText, needsImage: true,
      tips: '配 8 镜分镜脚本（飞书分发包里有）；封面可用主图。' },
    { id: 'shipinhao', name: '视频号', region: 'cn', priority: 1, how: '配短视频',
      submitUrl: 'https://channels.weixin.qq.com/platform/post/create',
      title: shipinhaoTitle, text: shipinhaoBody, needsImage: true,
      tips: '标题已卡在 30 字内；描述用编号步骤。' },
    { id: 'bili', name: 'Bilibili 专栏', region: 'cn', priority: 1, how: '文字专栏',
      submitUrl: 'https://member.bilibili.com/platform/upload/text/edit',
      title: biliTitle, text: biliBody,
      tips: '配 1 分钟演示视频转化最高。' },
  ],
};

const out = resolve(here, 'moneyswitch-metropolis.json');
writeFileSync(out, JSON.stringify(campaign, null, 2), 'utf8');
console.log('wrote', out, '·', campaign.platforms.length, 'platforms');
