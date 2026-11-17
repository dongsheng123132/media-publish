---
name: bomber
description: "全媒体轰炸机：把一次开源/产品发布的文案编译成一张自包含 HTML「宣发发布台」，20+ 海内外平台（HN/Reddit/PH/X + V2EX/掘金/知乎/微博/小红书/公众号/B站…）各一张卡——一键用你的登录态开好提交页、一键拷平台定制文案，进度存 localStorage；另带「发布/注册矩阵」：35 家发布榜与目录站（Peerlist/Uneed/DevHunt/indie-apps/AlternativeTo/SaaSHub/MCP 目录…）各一张卡，标好费用、门槛与外链属性。触发「轰炸机」「宣发」「推广」「发帖」「开源发布」「多平台分发」「去哪些平台发布」「要注册哪些站」。不替你按提交。"
---

# bomber · 全媒体轰炸机（宣发发布台）

把「一份文案 → 满世界手动复制粘贴」变成「打开一张发布台页面 → 每个平台一键开页+一键复制 → 你确认后自己点提交」。半自动，用**你自己带登录态的浏览器**，密钥/账号从不经过脚本。

**合并说明**：本 skill = `dongsheng123132/social-copy-generator`（14 平台**文案撰写智能**）+ 发布台**启动机制**（真实 submit 网址 / 一键开页 / URL 预填 / 进度记忆）。

- **为谁写**：见 `references/geo-ai-citation.md`（AI 收录优先；五件必备零件 + 可复制骨架 + 出图规矩）。
- 各平台怎么写：见 `references/platform-copy-guidelines.md`（Twitter 280 硬算、Reddit 反自夸、HN 零营销、小红书 emoji 体…）。
- 实体产品 / 工厂带货（Amazon、阿里国际、1688、TikTok、淘宝、Pinterest…）另有一套：`references/product-copy-guidelines.md`——卖点前置、认证背书、关键词即流量；社区那套「零营销腔」在电商页上会掉转化。
- 平台硬性表单与封面尺寸：见 `references/submit-fields-and-covers.md`（掘金分类/标签/192×128 封面/≤100 字摘要…）。
- 交付前自检（分字段字数 / **上限表唯一来源与对账** / 说明卡 / 单文件红线 / XSS）：见 `references/build-checks.md`。
- 各平台 submit 网址与元信息：见 `catalog.json`（写 campaign 时按 id 取 `submitUrl`）。
- **发布榜 / 目录站 / 注册清单（「去哪占位」而不是「说什么」）**：见 `references/launch-directories.md`——35 家（PH / Peerlist / Uneed / Fazier / DevHunt / indie-apps / AlternativeTo / SaaSHub / TAAFT / MCP 四件套 / Reddit 各版…）的费用、外链属性、硬门槛、坑，以及「AI 凭什么推荐你」的写法；
  引擎 `scripts/build-matrix.mjs` 吃 `launch/platforms.json` + 一个产品 JSON，出「注册与投放作战台」（单文件 HTML，按三条泳道筛、一键开提交页/注册页、勾进度）。
  两者的分工：**campaign 管「说什么」，矩阵管「去哪发、什么时候发、先去注册谁」**。数据每条带 `verified`/`source`，`src3p` 是第三方口径，`unverified` 的不许排期。
- 工作台现状：`dsh-broadcast` 插件**已发 npm（0.1.x）**，吃 campaign JSON 出单文件发布台，与本 skill 的 `scripts/build-launcher.mjs` 同源同产物；BYOK 回落与钱包按次扣费**仍未做**。三态口径见 `references/workbench-direction.md`。

## 首要目标：让 AI 收录并推荐我们（不是让人读完点赞）

> 2026-11-10 用户定调：「重点这个是给 AI 去收录用的，让 AI 下次能推荐到我们的这个插件或者软件……人已经很少看了。」
>
> 所以**验收标准**是：每张卡都能让一个 AI 在不看上下文时抄走一句「它是什么 / 装什么 / 凭什么」。
> 完整教义、五件必备零件、平台卡改造清单、可复制骨架：**`references/geo-ai-citation.md`**（写任何 campaign 前先读）。
>
> 最小自查：定义句 + 3 个可验证数字 + 实体锚点（全名/包名/版本/仓库/许可）+ 一个问句式小标题 + 一张对比表。
> 多产品同族时另立**族页**（`README-FAMILY.md` + `index.html`(JSON-LD) + `llms.txt` + `robots.txt`），改一批就四处一起改并重跑自审；
> 本地自审满分只说明格式对了，**部署到公开 URL 之前不许写「已被 AI 收录」**。
> 已发布过的文章**不要重写**——在 `fields[]` 里加一条「发布后 GEO 补丁」，把定义句和 FAQ 贴文末或首评即可。

## 何时用
用户说：轰炸机 / 全媒体轰炸 / 宣发 / 推广 / 发帖 / 开源发布 / 多平台分发 / 发布台 / 「宣传文案帮我写写然后一键去发」/ 把某仓库推出去。

> 名字沿革：本 skill 原名 `media-publish`，现更名 **`bomber`（全媒体轰炸机）**。开源仓库仍是
> [`dongsheng123132/media-publish`](https://github.com/dongsheng123132/media-publish)，仓库名未改。

## 怎么用（两步）
> **一次到位**：用户 2026-11-10 定调「我可能没时间，下次就忘记，一次到位就好」——别把文案 / 封面 /
> 实测拆成「① 做 A ② 或者先跑 B」让用户挑，一次全给齐、实测自己跑完再报结论。已发布的正文不重写，
> 只在文末或首评补 GEO 补丁。完整口径见 `references/workbench-direction.md` 第三节。

1. **准备 campaign**：一个 JSON，描述这次发布（仓库链接 + 每个平台的标题/正文/提交页）。
   - 复制 `campaigns/opencodex-redline.mjs` 改文案，`node campaigns/<你的>.mjs` 生成同名 `.json`；
   - 或直接手写 `campaigns/<slug>.json`（结构见下）。
2. **编译并打开**：
   ```bash
   node scripts/build-launcher.mjs campaigns/<slug>.json ~/Desktop/发布台-<slug>.html
   # Windows 打开: start "" "$(cygpath -w ~/Desktop/发布台-<slug>.html)"
   # macOS 打开:  open -a "Google Chrome" ~/Desktop/发布台-<slug>.html
   ```
   **用哪个浏览器打开，就用哪个浏览器发**——发布台在当前浏览器 `window.open` 提交页，所以要用有各平台登录态的那个浏览器打开本文件。

## campaign JSON 结构
```jsonc
{
  "slug": "my-launch",
  "title": "标题栏显示",
  "subtitle": "副标题",
  "primaryUrl": "https://github.com/owner/repo",   // {url} 默认取这个
  "repos": [{ "label": "Repo", "url": "https://..." }],
  "platforms": [{
    "id": "hn",                     // 唯一，用于进度记忆
    "name": "Hacker News",
    "region": "intl",               // intl=海外 / cn=国内（决定角标颜色）
    "priority": 3,                  // 1~3，显示星级
    "how": "怎么发的一句话说明",
    "submitUrl": "https://news.ycombinator.com/submitlink?u={url}&t={title}",
    "url": "https://github.com/owner/repo",   // 该卡片的 {url}（可选，缺省用 primaryUrl）
    "title": "预填/待复制的标题",   // 有则出现「复制标题」按钮
    "text":  "预填/待复制的正文",   // 有则出现「复制正文」按钮
    "tips":  "发帖小贴士"
  }]
}
```
`submitUrl` 支持占位符：`{url}`（URL 编码）、`{rawurl}`、`{title}`、`{text}`。
能 URL 预填的平台就预填（X `intent/tweet?text=`、HN `submitlink?u=&t=`、Reddit `submit?title=`）；
其余平台受浏览器同源限制**无法跨站自动填表**，走 [一键打开发布页] + [复制文案] 一次粘贴。

## 物料要备到「提交页字段」级

用户真正卡住的地方不是正文，是点开提交页后弹出来的那 3–5 个必填框
（掘金：分类 / 标签 / 封面 192×128 / 收录至栏 / 摘要 ≤100 字）。每个平台卡把字段逐条列成
可复制条目，顺序照弹窗从上到下排。字段清单、登录墙口径、封面做法：
[references/submit-fields-and-covers.md](references/submit-fields-and-covers.md)。

- **封面别让模型写中文**：AI 只出无字底图，中文用
  [templates/cover-overlay.html](templates/cover-overlay.html) 叠上去再截屏——文字 100% 准、
  改文案零成本，一份 HTML 出 1:1 / 3:4 / 192×128 三个尺寸。同题可让 2–3 个模型各出一版（peer 对齐）再挑一张，别拿第一张当成品；把选型（模型名 + 张数 + 花费）记进 campaign，下次同品类直接复用。
  出图默认走虾盘云便宜档：用户 2026-11 点名 **`gpt-image-2.6-1k`**（不要再用 2.61k / image2.61k 这类旧标识），换版只改这一处。
- **发之前先探一遍入口**：`node scripts/probe-submit-urls.mjs campaigns/<slug>.json`。
  200 正常、403 是登录墙（不是坏了）、404 才是平台改了路径。
- **两家不能代填**：LinkedIn 分享框只吃「链接 + 一句话」，改走「复制正文 → 发动态」；
  Product Hunt 必须走 Launch 流程，先建产品页。
- **交付前按 [references/build-checks.md](references/build-checks.md) 逐条核，别用肉眼数字**（`node scripts/check-artifact.mjs 产物.html [另一次build.html]` 一条命令判自包含 / 零泄漏 / 原始注入 / 体积 / 确定性，退出码 1 即不过）：
  长度按「字段 × 平台」分开校验（标题和正文各算各的，HN 的 80 卡在标题上）；说明卡给显式类型，别让它被判成未知平台；
  单文件红线 = `<link>` 0 个、`<script>` 1 个内联、两次 build 同一 `sha256`、四处 XSS 全转义、产物零凭据。
  实测教训：拿自家 `dsh-broadcast` 审自家发布台，一跑就抓到 X **310/280** 与 HN 标题 **84/80**——这两处肉眼已过好几轮。

## 先定位：一次只推一个主体

用户说「一个一个来推广」时，别把整个仓库端上去。规则：

- **一次 campaign 只推一个主体**（一个插件 / 一个功能）。仓库里同族的东西从卡片和文案里删掉，宁可少推。
- **卖点压成一行可验证的事实**，不写功能清单。用户说「简单有效」时，要的是这种东西：
  `一个菜单项 · 只做一次排序 · 7 KB · 零运行时依赖 · 不存状态`
- **再补一句差异**（「别人做 A，我不做 A」）：扫 20 分钟 awesome 列表或 1024 商店就能拿到，例：竞品每天自动按活动重排侧栏，就写「手动一次、绝不自动重排」。这句差异同时当 README 第一段和 HN/Reddit 首句。
- **HN 顺序**：先开提交页（标题+链接已预填）→ 提交链接 → **立刻**把正文贴成第一条评论；正文别指望填在提交页里。
- 其余平台一轮各发一次；Reddit 同主题跨 sub **隔几天**，别同批刷。
- 发布台文件名带上主体：`发布台-<plugin>.html`；叫 `发布台.html` 会跟上一个插件互相覆盖。
- 上线节奏：npm 发布 → 官方实验市场（Discover）索引 → awesome 目录 PR → 社媒文案。
  前三步的机制和坑见 `plugin-release` skill 的 `references/market-directory-distribution.md`。

## 边界（诚实）
- **发布产物落本 skill 目录**：文案进 `campaigns/`，发布台与配图进 `output/`。
  用户说的「我的多媒体轰炸机」就是这里——别把稿子交到另一个写作工作台或需要登录的后台里，
  那不是他的轰炸机，他也打不开。
- **不替你点「提交」**。发布台只开页 + 递文案，最后一步永远你自己按——避免误发。
- **不碰你的账号密码**。靠浏览器已有登录态，脚本不接触任何凭据。
- 各平台 submit 网址会随平台改版失效，改 `campaigns/*.json` 里的 `submitUrl` 即可。

## 已有 campaign
`campaigns/` 下已有十多个成品（`opencodex-redline` 开源发布、`move-top` 插件推广…），
复制**最近的那一个**改文案最省事——它的字段排布已经过实战校准。
`output/` 里是历次交付的发布台与配图，找版式直接抄。
