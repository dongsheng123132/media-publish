// AI2Work 基准首次公开发布的 campaign。
//
// 文案主线（各平台共用，语气按平台调）：
//   1. 锁死模型，只换外面那层命令行 agent —— 别的榜都在换模型
//   2. 一个晚上查出自己评测的 4 个 bug，其中一个让排行榜换了冠军
//   3. 两张榜（工具给足 / 工具不够）几乎相反，所以不发综合总分
//   4. **暂时不发榜**，因为 n=1 不够 —— 这句是最有说服力的一句，别删
//   5. 导流 U-King
//
// ⚠️ 仓库尚未 push。发布前必须先把 ai2work-bench 推上去，否则所有链接 404。
import { writeFileSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));

// 公众号是主阵地，正文必须**整篇嵌进卡片**供一键复制——
// 只放一句「正文见某某目录」等于把这张卡片作废了。
const ARTICLE_PATH = 'C:/Users/ZhuanZ/Desktop/claude/u-claw/u-king简化版-u盘版本/推广物料/三期-AI2Work基准/公众号-我们做了个AI办公基准然后发现它四处漏水.md';
const article = readFileSync(ARTICLE_PATH, 'utf8');

const REPO = 'https://github.com/dongsheng123132/ai2work-bench';
const UKING = 'https://u-king.org';   // 品牌域，实测 200

// ---------------------------------------------------------------- 英文

const hnTitle = 'Show HN: An AI office-work benchmark, and 4 bugs we found in our own judge';

const hnText = `Most agent benchmarks swap the model and keep the scaffold fixed. We did the opposite: pinned one model (same endpoint, same slug, same effort) and swapped nine real shipping CLI agents — Claude Code, Codex CLI, Goose, OpenCode, Qwen Code, Kimi Code, Hermes, Pi, oh-my-pi. The task isn't coding: clean a dirty CSV and deliver a Word/Excel/PPT set where the numbers reconcile and the totals are real formulas.

First results looked great — same model, scores from 0 to 95. Then we audited ourselves and the story fell apart:

1. Our judge matched the bare string "1202". Chinese business documents write "1,202" with a thousands separator. We were penalizing the agents that wrote more professionally — and our own bundled generator happens to omit separators.

2. One agent's Excel had 41 formulas. Our reader saw zero. openpyxl writes the formula but not the cached value, and the sheet library drops any cell with an empty cached value. Open the file in Excel and every number is there. We had been scoring "we can't read it" as "you got it wrong."

3. Our PPT check required every slide to have >= 8 characters of body text — while the task itself asked for a closing slide. We had banned the slide we ourselves required.

4. When our API credit ran out, upstream returned 403, the agent exited without doing anything, exit code 0, judge scored it 0/100 and recorded it as a valid result. "Service refused" became "this agent has zero capability", with no alarm anywhere.

Fixing #1 and #2 flipped the open-source ranking: oh-my-pi +16, Pi +16, Qwen +11. The previous #1 spot had been given by a bug.

Then the root cause: our own Excel generator had zero lines of formula or chart support, while the task demanded both. Eight of nine agents worked around it — five patched our generator's source (one hand-wrote OOXML chart XML), three wrote external post-processing scripts. The one that didn't work around it scored 0. So that leaderboard wasn't measuring office skill; it was measuring "what do you do when the tool you're given can't do the job."

After fixing the toolchain, the same agents cluster at 95-100. Most of the "huge capability gap" was our own defects.

The accidental upside: we now have two leaderboards that are nearly inverted. OpenCode is tied for #1 when tools are sufficient and dead last when they aren't. That's not a contradiction, it's two different abilities — so we don't publish a combined score.

We are not publishing the leaderboard yet. Four of nine agents have n=1, and we measured the same agent scoring 84 to 100 under identical conditions. Our own aggregator refuses to give a verdict below n=2. Shipping a ranking we've proven unreliable would undo the point.

Everything is in the repo: twelve incident writeups, the scoring-caliber changelog with old results preserved, and four self-check gates each verified by deliberately breaking them.

${REPO}`;

const redditTitle = 'I pinned one model and swapped 9 CLI agents to test office work — then found 4 bugs in my own judge';

const redditText = `Most agent benchmarks vary the model. I wanted the other axis: same model, same endpoint, same effort setting, nine different CLI agents (Claude Code, Codex CLI, Goose, OpenCode, Qwen Code, Kimi Code, Hermes, Pi, oh-my-pi). Task is office work, not coding — clean a messy CSV, produce Word/Excel/PPT where the numbers reconcile and totals are actual formulas. Deterministic checkers only, no LLM-as-judge.

First run looked like a great result: same model, 0 to 95. Then I started auditing and found four bugs in my own harness:

- The judge matched the bare string "1202", but Chinese business docs write "1,202". I was penalizing the agents that formatted more professionally.
- One agent's spreadsheet had 41 formulas; my reader saw zero, because openpyxl writes formulas without cached values and the library drops those cells. The file opens fine in Excel with every number present.
- My PPT check required >= 8 characters per slide, while the task explicitly asked for a closing slide. I had banned the slide I asked for.
- When my API credit ran out, the agent exited immediately with code 0 and got scored 0/100 as a valid result. "Upstream refused" was recorded as "zero capability."

Fixing the first two flipped the ranking — oh-my-pi +16, Pi +16, Qwen +11, and the #1 open-source spot changed hands. The old #1 was a bug artifact.

The bigger problem: the Excel generator I handed the agents had zero formula and zero chart support, while the task required both. Eight of nine worked around it (five patched my generator, three wrote external scripts). So that whole leaderboard was measuring improvisation, not office skill. After I fixed the toolchain, everyone clusters at 95-100.

Honest limitations: four of nine agents only have n=1, and I measured the same agent scoring 84-100 under identical conditions. So I'm **not** publishing the leaderboard yet — it needs about 54 more runs. What's public right now is the methodology, the raw evidence, and every bug I found in myself.

Repo has twelve incident writeups and a scoring-caliber changelog that keeps the old (wrong) results alongside the corrected ones.

${REPO}

Feedback welcome, especially from maintainers of any of the nine — if a result looks wrong, the raw traces are all there and there's a dispute template.`;

const xText = `Pinned one model, swapped 9 CLI agents, measured office work.

Then found 4 bugs in our own judge. One flipped the #1 spot.

Worst: an agent's Excel had 41 formulas. Our reader saw 0 — we'd scored "can't read it" as "you got it wrong."

${REPO}`;

const devtoTitle = 'We built an AI office-work benchmark, then found four bugs in our own judge';

const linkedinText = `Most AI agent benchmarks vary the model and keep the harness fixed. We tried the other axis: pin one model, swap nine shipping CLI agents, and measure office work — clean a dirty CSV, deliver Word/Excel/PPT where the numbers reconcile.

The first results looked publishable: same model, scores from 0 to 95.

Then we audited our own scorer and found four defects. The most consequential: one agent's spreadsheet contained 41 formulas that our reader reported as zero, because the writing library emits formulas without cached values. Open the file in Excel and every figure is present. We had been recording "we cannot read this" as "you got it wrong."

Correcting two of the four bugs changed the open-source ranking, including the #1 position.

We are not publishing the leaderboard. Four of nine agents have a single run each, and we measured the same agent scoring between 84 and 100 under identical conditions. Publishing a ranking we have already shown to be unreliable would defeat the purpose.

What we are publishing is the audit: twelve incident writeups, the scoring changelog with the incorrect results preserved next to the corrections, and four self-check gates each validated by deliberately breaking them.

${REPO}`;

// ---------------------------------------------------------------- 中文

const cnCore = `别的 AI 榜都在换模型比高低。我们把变量倒过来：**锁死模型，只换外面那层命令行 agent**——同一个端点、同一个模型、同一份配置，九个 agent 跑同一道办公题（脏 CSV 清洗，交出数字对得上、公式是算出来的 Word/Excel/PPT）。

第一版结果很漂亮：同一个模型，0 到 95 分。

然后我们开始查自己，一个晚上查出**四个 bug**：

1. 判分器查裸串「1202」，而中文商务文档规范写法是「1,202 万元」——**我们惩罚了写得更专业的那一份**。而我们自带的生成器恰好不加千位分隔符。
2. 有个 agent 的 Excel 里有 41 个公式，判分器看见 0 个。用 Excel 打开数字全在。**「我读不出来」被判成了「它做错了」**。
3. 判分器要求 PPT 每页不少于 8 个字，而题面自己要求有一页「结束页」——**我们禁止了自己要求的那一页**。
4. API 余额耗尽、上游返回 403、agent 一个字没干就退出，判分器给它 0 分并当成有效成绩。**「服务被拒」被写成了「这个 agent 能力为 0」。**

修完前两个，**开源组第一从 Goose 换成了 oh-my-pi**（oh-my-pi +16、Pi +16、Qwen +11——它们的共同点是都写千位分隔符）。

再往下挖到根因：**我们提供的 Excel 生成器，formula 和 chart 代码都是 0 行**，而题目要求这两样。九个 agent 里八个都在绕（五个直接改我们的源码，三个写外挂脚本），唯一没绕的那个得了 0 分。

**所以那张榜测的根本不是办公能力，是「工具不够用时你怎么办」。**

把工具补齐重跑，大家几乎拉平在 95–100。之前那些「巨大差异」，绝大部分是我们自己的缺陷。

但意外收获是两张榜，而且几乎相反：**OpenCode 在「工具给足」时并列第一（100），在「工具不够」时垫底（66）**。这不是矛盾，是两种能力——所以我们**不发综合总分**。

**这份榜我们暂时不发**：九家里四家只跑了一次，而我们实测过同一条件下同一个 agent 能跑出 84 到 100。发一个自己已经证明不可信的榜，会毁掉前面所有工作。

现在公开的是**查自己的全过程**：十二条事故记录、判分口径变更史（旧的错结果原样保留）、四道自检闸门（每道都故意改坏验证过会变红）。`;

const cnTail = `\n\n代码与全部原始数据：${REPO}\n\n（能把九个命令行 AI 装在同一台机器上共用配置跑同一道题，这台机器本身就不好搭——Codex 要挂协议桥、Hermes 配置在反直觉的目录、Goose 单任务能往硬盘灌 1.8GB 日志。我们能做这个评测，是因为本来就在做这件事：U-King ${UKING}）`;

const zhihuText = article;   // 长文平台，直接用完整正文
const v2exText = cnCore.replace(/\*\*/g, '') + cnTail;
const juejinText = article;   // 长文平台，直接用完整正文
const sspaiText = article;   // 长文平台，直接用完整正文

const jikeText = `别的 AI 榜都在换模型，我们把变量倒过来：锁死模型，只换外面那层 CLI agent。

九个 agent 跑同一道办公题，第一版结果「同一个模型 0 到 95 分」，看着特别能发。

然后查自己，一晚上查出四个 bug：
· 判分器查裸串「1202」，惩罚了写「1,202 万元」的（更规范的写法）
· 一个 agent 的 Excel 有 41 个公式，判分器看见 0 个——我们把「读不出来」判成了「做错了」
· 要求 PPT 每页 ≥8 字，却又要求有「结束页」——禁止了自己要求的那一页
· 余额断了返回 403，agent 没干活就退出，判 0 分当成有效成绩

修完，开源组第一从 Goose 换成了 oh-my-pi。

**那个第一名的位置，是 bug 给的。**

榜暂时不发——四家只跑了一次，而同条件下同一个 agent 能跑出 84 到 100。

先把查自己的过程公开了：${REPO}

—— 顺带说下我们为什么能做这个测：
把九个命令行 AI 装在同一台机器上、共用一套配置跑同一道题，这台机器本身就不好搭
（Codex 要挂协议桥、Hermes 配置在反直觉的目录、Goose 单任务能往硬盘灌 1.8GB 日志）。
我们能做，是因为本来就在做这件事 👉 U-King ${UKING}`;

const weiboText = `别的 AI 榜换模型，我们换壳：锁死同一个模型，只比外面那层命令行 agent。

结果查出自己评测的四个 bug，其中一个让开源组第一换了人。

最离谱的：一个 agent 的 Excel 里有 41 个公式，我们的判分器看见 0 个——把「我读不出来」判成了「它做错了」。

榜暂时不发，n=1 不够。先公开查自己的全过程。

${REPO}

九个 AI CLI 一键装好配好 👉 ${UKING}

#AI评测# #AIAgent#`;

const xhsText = `做了个 AI 办公能力榜，结果发现自己四处漏水 😅

别的榜都在换模型比高低，我们反过来：**锁死模型，只换外面那层 AI 工具**，九个一起跑同一道办公题（脏数据清洗 → Word/Excel/PPT 三件套）

第一版结果特别好看：同一个模型，0 到 95 分 📊

然后开始查自己……一晚上查出四个 bug 👇

1️⃣ 判分器查「1202」，但中文商务文档规范写法是「1,202 万元」——**我们惩罚了写得更专业的那份**
2️⃣ 某个 AI 的 Excel 里有 41 个公式，判分器看见 0 个（用 Excel 打开数字全在）
3️⃣ 要求 PPT 每页 ≥8 字，可题目自己要求有「结束页」——禁了自己要求的那页 🤦
4️⃣ 余额断了，AI 没干活就退出，判 0 分还当成有效成绩

修完之后，**第一名换人了** 🔄

最后发现根因更尴尬：**我们给的 Excel 工具根本不支持公式和图表**，而题目要求这两样。九个 AI 里八个被迫自己想办法绕过去 😂

榜暂时不发（数据量不够，同一个 AI 同样条件能跑出 84~100）

但查自己的全过程全公开了 👉 ${REPO}

💡 顺带说下我们为什么能做这个测：把九个命令行 AI 装在同一台机器上、共用配置跑同一道题，这机器本身就不好搭（Codex 要挂协议桥、Hermes 配置藏在反直觉的目录、Goose 单个任务能往硬盘灌 1.8GB 日志 😱）

我们能做，是因为本来就在做这件事 —— **U-King：九个 AI 一键装好配好** 👉 ${UKING}`;

const momentsText = `做了个 AI 办公能力基准，然后发现它四处漏水。

一个晚上查出自己评测的四个 bug，其中一个让排行榜换了冠军。

榜暂时不发——数据量不够，发一个自己已经证明不可信的东西，会毁掉前面所有工作。

先把查自己的过程公开了。${REPO}

（我们能做这个测，是因为本来就在做「把九个 AI 一键装好」这件事 —— U-King ${UKING}）`;

const mpText = article;


// ---------------------------------------------------------------- campaign

const campaign = {
  slug: 'ai2work-bench',
  title: 'AI2Work 基准 · 首次公开',
  subtitle: '锁死模型只换 CLI agent 测办公能力 —— 以及我们查出的自己四个 bug',
  primaryUrl: REPO,
  repos: [
    { label: 'AI2Work 基准', url: REPO },
    { label: 'U-King', url: UKING },
  ],
  platforms: [
    // ── 海外：先发 HN / Reddit，反应最能验证框架站不站得住
    { id: 'hn', name: 'Hacker News', region: 'intl', priority: 3,
      how: '标题已控在 80 字符内，正文零营销、技术细节开场。发完盯前 30 分钟的评论。',
      submitUrl: 'https://news.ycombinator.com/submitlink?u={url}&t={title}',
      title: hnTitle, text: hnText,
      tips: 'HN 最吃「我搞砸了并且讲清楚为什么」。别改成营销腔，别加 emoji。北京时间 22:00–24:00 约等于美西早上。' },

    { id: 'reddit_llama', name: 'Reddit · r/LocalLLaMA', region: 'intl', priority: 3,
      how: '低调真诚，正文已明写局限（n=1、暂不发榜）。',
      submitUrl: 'https://www.reddit.com/r/LocalLLaMA/submit?title={title}',
      title: redditTitle, text: redditText,
      tips: '绝不能出现 check it out / best / amazing。结尾已留 Feedback welcome + 申诉入口。' },

    { id: 'reddit_claude', name: 'Reddit · r/ClaudeAI', region: 'intl', priority: 2,
      how: '同上文案，Claude Code 是被测之一，社区会有兴趣。',
      submitUrl: 'https://www.reddit.com/r/ClaudeAI/submit?title={title}',
      title: redditTitle, text: redditText,
      tips: '这个 sub 对「Claude 拿了第一」会敏感——正文里已经说明它是商业对照组、且我们不发综合总分。' },

    { id: 'x', name: 'X / Twitter', region: 'intl', priority: 2,
      how: 'URL 预填，已控在 280 字符内。',
      submitUrl: 'https://twitter.com/intent/tweet?text={text}',
      text: xText,
      tips: '可 @ 一下被测 agent 的官方账号请他们来核对——这是「欢迎对质」的姿态，不是碰瓷。' },

    { id: 'devto', name: 'Dev.to', region: 'intl', priority: 2,
      how: '英文技术长文，可直接用 HN 正文扩写。',
      submitUrl: 'https://dev.to/new',
      title: devtoTitle, text: hnText,
      tags: 'ai, benchmarking, opensource, cli',
      tips: 'tags 建议：ai / benchmarking / opensource / cli。' },

    { id: 'linkedin', name: 'LinkedIn', region: 'intl', priority: 1,
      how: '专业口吻，去掉技术细节的调侃。',
      submitUrl: 'https://www.linkedin.com/feed/?shareActive=true',
      text: linkedinText, tips: '受众偏管理层，重点放在「我们主动公开了自己的错误」。' },

    // ── 国内
    { id: 'v2ex', name: 'V2EX · 分享创造', region: 'cn', priority: 3,
      how: '技术向，去掉 markdown 加粗。',
      submitUrl: 'https://www.v2ex.com/new/create',
      title: 'AI2Work：锁死模型只换 CLI agent 测办公能力，以及我们查出的自己四个 bug',
      text: v2exText, tips: 'V2EX 反感软文。文案主线是「我们查自己」，天然合规；U-King 那段放最后一句带过。' },

    { id: 'zhihu', name: '知乎专栏', region: 'cn', priority: 3,
      how: '观点 + 对比，最适合展开双榜那部分。',
      submitUrl: 'https://zhuanlan.zhihu.com/write',
      title: '我们做了个 AI 办公能力基准，然后发现它四处漏水',
      text: zhihuText, tips: '知乎适合把「OpenCode 一个第一一个垫底」这个反转做成小标题。' },

    { id: 'juejin', name: '掘金', region: 'cn', priority: 2,
      how: '偏教程/复盘风。',
      submitUrl: 'https://juejin.cn/editor/drafts/new',
      title: '锁死模型只换 CLI agent：一个办公能力基准，和它的四个自查 bug',
      text: juejinText, tips: '掘金读者吃「踩坑复盘」，四个 bug 可以各配一段代码/XML 片段。' },

    { id: 'sspai', name: '少数派', region: 'cn', priority: 2,
      how: '轻量工具叙事。',
      submitUrl: 'https://sspai.com/write',
      title: '九个命令行 AI 做同一份报表，谁更靠谱？',
      text: sspaiText, tips: '少数派受众偏效率工具用户，可把 U-King 那段稍微展开。' },

    { id: 'jike', name: '即刻', region: 'cn', priority: 2,
      how: '干货无水分，已改写成短版。',
      submitUrl: 'https://web.okjike.com/',
      text: jikeText, tips: '即刻开发者多，「第一名是 bug 给的」这句最容易被转。' },

    { id: 'weibo', name: '微博', region: 'cn', priority: 2,
      how: '短 + 话题标签。',
      submitUrl: 'https://weibo.com/',
      text: weiboText, tips: '已带 #AI评测# #AIAgent#。' },

    { id: 'xiaohongshu', name: '小红书', region: 'cn', priority: 2,
      how: 'emoji 体 + 对比，已改写。',
      submitUrl: 'https://creator.xiaohongshu.com/publish/publish',
      text: xhsText, tips: '配图建议：那张「修之前 vs 修之后」的排名对照表截图。' },

    { id: 'moments', name: '微信朋友圈', region: 'cn', priority: 2,
      how: '个人口吻、对话感。',
      submitUrl: 'https://weixin.qq.com/',
      text: momentsText, tips: '手动发。配公众号文章卡片。' },

    { id: 'mp', name: '微信公众号', region: 'cn', priority: 3,
      how: '主阵地。正文用仓库里那份完整 Markdown 稿。',
      submitUrl: 'https://mp.weixin.qq.com/',
      title: '我们做了个 AI 办公能力基准，然后发现它四处漏水',
      text: mpText, tips: '完整稿在 推广物料/三期-AI2Work基准/ 下。这是导流 U-King 的主阵地。' },
  ],
};

const out = resolve(here, 'ai2work-bench.json');
writeFileSync(out, JSON.stringify(campaign, null, 2), 'utf8');
console.log('已生成', out, '·', campaign.platforms.length, '个平台');
