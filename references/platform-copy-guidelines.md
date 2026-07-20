# 各平台文案撰写规则

> 合并自 `dongsheng123132/social-copy-generator` (v2.0.0) 的 per-platform guidelines。
> 生成 campaign 的 `text`/`title` 时按对应平台的规则写，再交给 build-launcher 编译成发布台。

## 海外（英文）

### Twitter / X — 硬限 280 字符
- **上限 280**（CJK 每字算 2、emoji 算 2、URL 固定算 23）。输出前**必须数字符**，超了狠心删到 280 以内。
- 段间**不空行**（每个换行都占字符）；**不用 bullet**（太费）；用短句。
- 开头是 hook（提问或强断言），不是产品名。结尾一个短链（无论多长都算 23）。hashtag ≤ 3，和链接同一行。
- 塞不下就提示「thread 里展开」。

### LinkedIn — 专业、成果导向
- 语气职业化，突出「解决了什么、带来什么结果」。无字数硬限，但前 2 行是黄金位（折叠前可见）。

### Hacker News — Show HN，极简零营销
- 标题 `Show HN: [name] – [one-line]`，**< 80 字符**，无 emoji、无吹嘘。
- 正文 2-3 段：what / why / how / link。技术受众，开头抛最有意思的技术细节。**绝无营销腔**。

### Reddit — 低调、真诚、反自夸
- 标题描述性、不标题党（mod 会删）。正文：做了啥、为什么做、怎么装。
- 语气谦逊「I made a thing」，**诚实说 trade-off / 限制**。结尾「Feedback welcome」。
- 对口 sub：r/ClaudeAI、r/LocalLLaMA、r/programming、r/commandline。
- **绝不说** "check it out!" / "you need this!" / "ultimate/best/amazing" —— 秒踩。

### Product Hunt
- Tagline **< 60 字符**、有冲击力、说清价值。描述 2-3 句：what + how + who。首评讲创始故事 + 下一步。

### Dev.to — 英文技术博客
- 标题 "How I…" / "Building…" 描述性。摘要 1-2 句说清解决什么问题。tags: claudecode, opensource, productivity, cli。语气对话但技术。

### Telegram — 频道/群分享
- 短，一句话价值 + 链接。可用 `t.me/share/url` 预填。

## 国内（中文）

### 即刻 Jike — 开发者社区、干货无水分
- bullet 用 •，附安装命令，结尾点明目标人群。不堆 emoji。

### 小红书 Xiaohongshu — 口语、emoji 多、爱对比
- 开头一个共鸣式提问。emoji 小标题（📊🔧💡🔗）。✅ 做清单。放 before/after 对比数据。结尾 CTA。单独一行放 tags。

### 朋友圈 / WeChat Moments — 个人、对话感
- 讲「为什么」不只「是什么」。别 emoji 过载。GitHub 链接放最后。

### 微博 Weibo — 短、话题标签
- 一句话 + #话题#。可用 `service.weibo.com/share` 预填。

### 视频号 / Video Account — 配视频
- 标题 **< 30 字**、hook + 数字。描述用编号步骤。结尾 hashtag。

### 抖音 Douyin — 配短视频
- 标题钩子 + 数字，正文极短，靠视频本身。creator 后台手动传。

### 知乎 Zhihu — 观点 + 对比
- 开头抛痛点。标题给观点。正文吃「观点+对比」结构。

### V2EX — 程序员社区、技术向
- 发 /go/create 选「分享创造」。标题直说是什么、别标题党。正文说清原理和用法，附 GitHub 链接，语气平实不推销。

### 掘金 Juejin — 教程风
- 标题 "xxx 实现 xxx" / "xxx 使用指南"。摘要 1-2 句说清解决什么。正文可写成带代码块+截图的教程。tags: Claude Code、开发工具、效率提升。

### 少数派 sspai — 轻量工具叙事
- 适合「绿色 / 轻量 / 免安装」这类叙事，配图讲清一两个核心点。

### Bilibili 专栏 — 配 1 分钟演示
- 视频转化最高，标题 hook + 数字。
