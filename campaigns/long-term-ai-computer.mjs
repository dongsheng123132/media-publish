// 长程 AI 计算机开放挑战：平台定制文案 → campaign JSON。
// 边界：不把 v4 的 97.5% vs 55% 单独宣传；准确口径见 2origin-harness/bench/RESULTS-v4.md。
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const BLOG = 'https://blog.hequbing.com/post?slug=long-term-ai-computer-challenge';
const ARCH = 'https://github.com/dongsheng123132/2origin-computer';
const SUBMIT = 'https://github.com/dongsheng123132/2origin-computer/issues/new?template=long-task-challenge.yml';
const EVIDENCE = 'https://github.com/dongsheng123132/2origin-harness/blob/HEAD/bench/RESULTS-v4.md';

const cnCore = `公司很小，胃口很大；宣传部只有一个人，所以锣敲得响了一点。

今天正式发布「长程 AI 计算机」开放挑战：Model = CPU，State = Memory，Harness = OS。模型会换，上下文会清空，但状态不死，任务就能继续。

欢迎提交传统 AI 做不好、做不完、做着做着会失忆的真实任务。代码、实验、失败和撤回全部公开。

博客：${BLOG}
技术入口：${ARCH}`;

const cnEvidence = `最新 ShadowWork Bench v4 接入了第三方 mem0。发布前复核又改写了我们自己的结论：答案在语料里时，2Origin 与自写 RAG 都是 90%，没有证据说明状态更会「找」；真正分得开的是拒绝把别的任务事实认成当前任务事实：2Origin 100%，mem0 60%，RAG 55%。

单模型、单任务、单次运行；两跳推理指标仍作废。完整口径：${EVIDENCE}`;

const enCore = `I run a one-person company, so the engineer and the marketing department are unfortunately the same person — hence the loud gong.

Today I am opening a Long-Term AI Computer challenge. Model = CPU. State = Memory. Harness = OS. Models change and context disappears; the task should still continue.

Submit real work that current AI cannot finish without losing its own state. Code, benchmarks, failures, and retractions are public.

Announcement: ${BLOG}
Architecture: ${ARCH}`;

const hnBody = `I have been building a small open architecture around one question: if the model is the CPU, what are the disk, buses, kernel, and state format that let a task survive sessions and model swaps?

2Origin Computer separates durable task state from the chat transcript. The reference harness keeps verified facts, decisions, next steps, audited actions, and source evidence outside the model context, then compiles only the relevant state back in.

The latest benchmark added mem0 as an external control and also caught a bad interpretation in our own headline result. When the answer was present in the corpus, 2Origin and our lexical RAG tied at 90%. The measurable difference was rejection of real facts belonging to another task: 100% for 2Origin vs 60% for mem0 and 55% for RAG. Single model/task/run; the reasoning probe remains retracted. Full limitations are in the repo.

We are now looking for real multi-session tasks that can break the architecture. Feedback and counterexamples are welcome.

${ARCH}`;

const redditBody = `I built an open architecture for persistent AI tasks and I am looking for real workloads that can break it.

The basic split is: Model = CPU, durable State = Memory, Harness = OS. Instead of treating an ever-growing transcript as project state, the harness stores verified facts, decisions, next steps, sources, and audited actions outside the context window.

Important limitation: our latest run does not show that structured state retrieves available facts better than lexical RAG — both scored 90% when the answer was actually present. The measured difference was task-boundary rejection: 2Origin rejected facts from other real tasks at 100%, vs 60% for mem0 and 55% for our RAG (single model/task/run; n=20 for this slice). The two-hop reasoning probe failed and remains retracted.

I am opening a challenge for multi-session software work, large documents, persistent research, and other tasks where an agent loses track of what is currently true. Feedback, earlier comparable systems, and attempts to break it are welcome.

Architecture: ${ARCH}
Evidence: ${EVIDENCE}`;

// 280 字符硬限：URL 按 23 计；本条不堆 hashtag。
const tweet = `A one-person company is opening a Long-Term AI Computer challenge. Model=CPU. State=Memory. Harness=OS. Models change; the task should continue. Code, failures and retractions are public. Bring a task that makes agents forget what is true: ${ARCH}`;

const xhs = `一个人的公司，开始挑战 AI 的「失忆症」🥁

别人发布产品，是市场部敲锣。
我这里比较特殊：研发本人一边修 Bug，一边出来敲锣😂

💡 我们的思路
Model = CPU
State = Memory
Harness = OS

✅ 模型可以换
✅ 上下文可以清空
✅ 状态和任务继续活着
✅ 失败与撤回也公开

今天正式接榜：百万字内容、几十万字标书、跨模型软件项目、多模态长期整理……传统 AI 做不好、做不完、做着做着会忘的，欢迎来。

不保证全赢，但先把成功标准和失败标准写清楚。

${BLOG}

#长程AI #AIAgent #独立开发者 #2Origin #人工智能`;

const zhihu = `今天的大模型为什么很聪明，却很难把一个项目连续做几天、几周、几个月？

因为聊天记录不等于项目状态。里面混着当前事实、旧方案、已经撤回的结论和其他任务的信息。我们的尝试是把架构拆开：Model = CPU，State = Memory，Harness = OS。

最新 v4 实验加入了第三方 mem0，也让我们主动改写了旧宣传口径。答案在语料里时，2Origin 与自写词法 RAG 都是 90%，所以没有证据说状态更会「找」。真正分得开的是任务边界：拒绝把别的任务事实认成当前任务事实，2Origin 100%，mem0 60%，RAG 55%。

这仍然只是单模型、单任务、单次运行，两跳推理指标已撤回。现在我们开放征集真实长程任务，用现实产物继续检验这条路线。

${BLOG}`;

const v2ex = `做了一个「长程 AI 计算机」开放挑战，想找真实任务把架构打穿。

核心不是再造模型，而是把 Model 当 CPU、持久 State 当 Memory、Harness 当 OS。任务的已验证事实、决策、下一步、来源和审计动作不再只活在聊天记录里。

最新 ShadowWork Bench v4 加入了 mem0 2.0.17 对照，也抓到了我们自己的错误归因：答案在对照语料里时，2Origin 与自写 RAG 都是 90%，所以「更会找」没证据；真正拉开差距的是拒绝别的任务事实，2Origin 100%，mem0 60%，RAG 55%。单模型/单任务/单次运行，两跳指标仍作废。

想征集多会话软件工程、长文档、持续研究、多模态资料等真实任务。提交前先共同写成功标准和公开边界。也欢迎更早的相当实现、复现和反例。

架构：${ARCH}
证据：${EVIDENCE}`;

const campaign = {
  slug: 'long-term-ai-computer',
  title: '长程 AI 计算机 · 开放挑战',
  subtitle: '一人公司敲锣：模型会换、上下文会清空，状态不死，任务继续',
  primaryUrl: BLOG,
  defaultLang: 'zh',
  langs: ['zh', 'en'],
  masterImage: {
    prompt: 'Deep indigo editorial technology illustration: a tiny independent developer holding a bronze gong between a fragmenting chat transcript and a stable three-module AI computer architecture. No text, no logos, no watermark.',
    size: '1536x1024',
    image: './long-term-ai-computer-images/master.png'
  },
  repos: [
    { label: '接榜令 / Announcement', url: BLOG },
    { label: 'Architecture', url: ARCH },
    { label: 'Submit a challenge', url: SUBMIT },
    { label: 'Evidence v4', url: EVIDENCE }
  ],
  platforms: [
    { id:'hn', name:'Hacker News', region:'intl', priority:3, how:'Show HN：极简技术标题；正文作为首条评论',
      submitUrl:'https://news.ycombinator.com/submitlink?u={url}&t={title}', url:ARCH,
      title:'Show HN: 2Origin – an open architecture for persistent AI computers', text:hnBody,
      tips:'无营销腔。重点讲架构、v4 主动改写结论和开放反例。' },
    { id:'reddit_localllama', name:'Reddit · r/LocalLLaMA', region:'intl', priority:3,
      submitUrl:'https://www.reddit.com/r/LocalLLaMA/submit?title={title}', url:ARCH,
      title:'An open architecture for persistent AI tasks — looking for workloads that can break it', text:redditBody,
      tips:'先读版规；保留 trade-off 与失败指标，避免 world-first 标题。' },
    { id:'reddit_machinelearning', name:'Reddit · r/MachineLearning', region:'intl', priority:2,
      submitUrl:'https://www.reddit.com/r/MachineLearning/submit?title={title}', url:EVIDENCE,
      title:'[P] Persistent task state with an external memory control and a retracted interpretation', text:redditBody,
      tips:'按 Project 标签规则发；如果版规不接受自有博客，只发证据仓库。' },
    { id:'x', name:'X / Twitter', region:'intl', priority:2, how:'一键预填；配主视觉',
      submitUrl:'https://twitter.com/intent/tweet?text={text}', text:tweet, needsImage:true,
      tips:'已按 280 字符硬限压缩。' },
    { id:'linkedin', name:'LinkedIn', region:'intl', priority:2,
      submitUrl:'https://www.linkedin.com/feed/?shareActive=true', text:enCore,
      tips:'前两行保留一人公司与 long-term task 的冲突。' },
    { id:'devto', name:'Dev.to', region:'intl', priority:1,
      submitUrl:'https://dev.to/new', title:'Building a Long-Term AI Computer: Model as CPU, State as Memory', text:hnBody,
      tips:'扩成技术文，tags 用 ai, opensource, agents, architecture。' },
    { id:'telegram', name:'Telegram', region:'intl', priority:1,
      submitUrl:'https://t.me/share/url?url={rawurl}&text={text}', url:ARCH,
      text:'Open challenge: an architecture for AI tasks that survive sessions and model swaps. Code, failures and retractions are public.',
      tips:'一句话 + 技术仓库。' },
    { id:'v2ex', name:'V2EX · 分享创造', region:'cn', priority:3,
      submitUrl:'https://www.v2ex.com/new', title:'做了一个「长程 AI 计算机」开放挑战，想找真实任务把架构打穿',
      text:v2ex, tips:'选择「分享创造」；语气平实，守评论区。' },
    { id:'juejin', name:'掘金', region:'cn', priority:2,
      submitUrl:'https://juejin.cn/editor/drafts/new', title:'Model 是 CPU：长程 AI 计算机如何把状态从聊天记录里拆出来',
      text:zhihu, tips:'补一张架构图和 v4 拆分表，按教程/复盘体发布。' },
    { id:'zhihu', name:'知乎专栏', region:'cn', priority:3,
      submitUrl:'https://zhuanlan.zhihu.com/write', title:'为什么上下文越长，AI 仍然会把别的任务事实当成自己的？',
      text:zhihu, tips:'观点 + 对比；完整限制不能删。' },
    { id:'jike', name:'即刻', region:'cn', priority:2,
      submitUrl:'https://web.okjike.com/', text:cnCore,
      tips:'技术圈动态，主图 + 博客链接。' },
    { id:'weibo', name:'微博', region:'cn', priority:2,
      submitUrl:'https://service.weibo.com/share/share.php?title={text}&url={rawurl}', url:BLOG,
      text:`一个人的公司，今天把「长程 AI 计算机」挂上榜了：Model=CPU，State=Memory，Harness=OS。传统 AI 做不完、做着做着会失忆的任务，欢迎来打。代码、失败和撤回都公开。#长程AI计算机# #2Origin#`,
      needsImage:true, tips:'一张主图；评论区置顶挑战 Issue。' },
    { id:'xiaohongshu', name:'小红书', region:'cn', priority:3,
      submitUrl:'https://creator.xiaohongshu.com/publish/publish', text:xhs, needsImage:true,
      tips:'主图作为首图；标题用「一个人的公司，开始挑战 AI 的失忆症」。' },
    { id:'moments', name:'微信朋友圈', region:'cn', priority:2,
      submitUrl:'weixin://', text:cnCore, needsImage:true,
      tips:'手机端手动发；文案和主图已备好。' },
    { id:'mp', name:'微信公众号', region:'cn', priority:3,
      submitUrl:'https://mp.weixin.qq.com/',
      title:'公司只有一个人，口气却想挑战整个 AI 行业：长程 AI 计算机正式接榜',
      text:`网站长文已发布，复制正文或使用博客全文：${BLOG}\n\n证据口径补充：${cnEvidence}`,
      needsImage:true, tips:'不要删掉 v4 主动改写结论和实验边界。' },
    { id:'sspai', name:'少数派', region:'cn', priority:1,
      submitUrl:'https://sspai.com/write', title:'一个人的 AI 计算机实验：让任务跨会话继续活着',
      text:zhihu, tips:'以个人实践与工具链为主，弱化“全球第一”。' },
    { id:'bili', name:'Bilibili 专栏', region:'cn', priority:1,
      submitUrl:'https://member.bilibili.com/platform/upload/text/edit',
      title:'模型只是 CPU：一个人为什么敢造长程 AI 计算机', text:cnCore,
      tips:'配 60 秒口播和架构图。' },
    { id:'douyin', name:'抖音', region:'cn', priority:2,
      submitUrl:'https://creator.douyin.com/',
      text:'公司只有一个人，为什么敢挑战 AI 的长期失忆？模型当 CPU，状态当内存，Harness 当操作系统。传统 AI 做着做着会忘的任务，欢迎丢过来。#人工智能 #AIAgent #独立开发者',
      needsImage:true, tips:'用 60 秒口播；主视觉可做封面，最后一步手动发布。' },
    { id:'video_account', name:'微信视频号', region:'cn', priority:1,
      submitUrl:'https://channels.weixin.qq.com/platform/post/create',
      title:'一个人的公司，挑战 AI 长期失忆', text:cnCore, needsImage:true,
      tips:'标题不超过 30 字；配 60 秒口播。' },
  ]
};

const out = resolve(here, 'long-term-ai-computer.json');
writeFileSync(out, JSON.stringify(campaign, null, 2), 'utf8');
console.log('wrote', out, '·', campaign.platforms.length, 'platforms');

