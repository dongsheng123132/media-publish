# 发布目录：去哪注册、去哪发、按什么顺序（2026-11 核实）

> 和「发帖」不同：这一层不是写文案，是**占位置**——在 35 个站的数据库里各留一个能被 AI 和 Google 读到的页面。
> 数据文件 `templates/launch-platforms.json`，引擎 `scripts/build-matrix.mjs`。

## 0. 先定性质：发布板不是流量来源，是证据链

它给你三样东西，**没有一样是安装量**：

1. **能被 AI 与搜索读到的第三方页面**（语料 + dofollow 外链）
2. 首批愿意留一句真评论的人（评分冷启动）
3. 一条「这个产品存在且有人在用」的公开记录

安装量来自 App Store 搜索、短视频、小语种榜。所以顺序永远是：
**先让自己可被搜到 → 再一次铺满目录 → 最后才谈名次。**

## 1. AI 凭什么推荐你（这条决定 listing 怎么写）

同一份推荐里，写了「支持 MCP」的被点名，没写清的那个被回了「官方信息没有明确提及」。三个机制：

| 机制 | 你要做的 | 反面 |
|---|---|---|
| 第三方页面背书 | 目录站 / 评测站 / 商店页三处能互相对上 | 只有自家官网，AI 不敢引 |
| 可判定的硬事实 | 一句话带数字和明确能力（"支持 MCP"、"24h 连续录音"、"3–5 米"） | 「强大、智能、极致」，AI 无法判定 |
| 出现在清单型内容里 | 挤进 "best X for Y" / "alternatives to Z" | 不在任何清单里，永远不进候选池 |

**所以：目录站就是 AI 的语料库。** 每上一个目录 = 多一个 AI 敢引用的独立页面。这是「一次铺开」而不是「每周挤一个」的真正理由。

listing 四件套（每条都要能被单独抄走）：

1. 定义句：`X 是一个给 <谁> 用的 <什么>，它 <做什么>，不需要 <什么>。`
2. 三个可验证数字（体积 / 耗时 / 价格 / 版本 / 条数）。
3. 一个明确的「不做什么」（比功能列表更能让 AI 区分你和竞品）。
4. 一条可点开的证据链接（仓库 / 文档 / App Store）。

## 2. 三条泳道别混用

| 泳道 | 主战场 | 次战场 | 别浪费时间 |
|---|---|---|---|
| 消费者 iOS App | App Store 推荐提名、r/TestFlight、indie-apps.com、Indie App Catalog、r/iosapps | Product Hunt、Uneed、Peerlist、AlternativeTo | DevHunt、TAAFT、Glama、mcp.so、Show HN（无技术故事时） |
| 开发者工具 / 开源 | Show HN、Peerlist、DevHunt、MCP 四件套（真 MCP 才上） | Product Hunt、Uneed、Fazier、V2EX、Indie Hackers | 所有 iOS 应用目录 |
| AI 产品 / Agent | Peerlist、Uneed、CodeHype、TAAFT、Future Tools、官方 MCP Registry | Product Hunt、Fazier、Toolify（付费） | 所有 iOS 应用目录 |

判据一句：**那家站的访客，会不会是这个产品的用户？** 不会 → 只剩外链价值，排最后。

## 3. 注册身份先办齐

| 方式 | 平台 | 备注 |
|---|---|---|
| GitHub 登录 | DevHunt、Glama、mcp.so、Smithery、官方 MCP Registry | 与仓库同源，审核快 |
| **实名/身份验证** | **Peerlist** | 只收已验证个人资料（真名+真人照片）；工作证明免费，身份证验证小额一次性；卡住就发不了 |
| 邮箱 | PH、Uneed、Fazier、TinyLaunch、CodeHype、StartupBase、Launching Next、AlternativeTo、SaaSHub、TAAFT、Future Tools、indie-apps、Indie App Catalog、Discover Indie Apps、Launch Indie Apps、Indie App Santa、BetaList、Indie Hackers、Hacking with Swift | 用 catch-all 别名（`promo@<域名>`），别用主邮箱 |
| 要养号 | Reddit（r/iosapps 要 300+ karma 且 90 天；r/apple 要近月 5 条非自推发言） | 现在就开始养 |
| 开发者账号 | App Store Connect（推荐提名） | 已有 |

**所有平台用同一头像、同一句简介、同一官网 URL。**「名字 + 一句话 + 分类」三处一致，是 AI 把你看成同一实体的前提。

## 4. 时间表

**T-3 周**：提 App Store 推荐提名（过期补不回）→ 注册（Peerlist 认证最慢，先办；PH 新号要满 7 天）→ 养 Reddit → 做一页官网 → 公开 TestFlight 发 r/TestFlight。

**T-1 周**：物料一套（240×240 方图、1270×760 画廊、tagline ≤60、描述 ≤500、3 个 tag、5–8 张真截图）→ 写死定义句 → Uneed 先提交（免费排队 30–50 天）→ 选发布日（优先周一）。

**发布周**：D0 上午 PH → 当天 Peerlist（若周一）→ D0–D2 一次性铺 Uneed/Fazier/TinyLaunch/Launching Next → D3 Show HN（有技术故事才发）→ D5 Indie Hackers。

**D8–D30**：长尾目录扫完（AlternativeTo 填 5–10 个被替代品、SaaSHub 填竞品、indie-apps、Indie App Catalog）→ r/iosapps（上架满 30 天）、r/apple（周日）、r/iOSProgramming（周六，一年一次）→ 复盘哪家来了点击/评论，一条没来的下次直接删。

## 5. 费用与门槛速查

| 平台 | 最便宜的路 | 硬门槛 | 外链 |
|---|---|---|---|
| Product Hunt | 免费 | 个人号满 7 天；有 waitlist 不推荐 | nofollow |
| Peerlist | 免费 | 个人实名验证；周一 UTC 开榜；项目必须完成 | 周榜前 5 才有 |
| Uneed | 免费排队 30–50 天 | 免费线分数 <10 出局；**提交后要回 dashboard 选档** | 分数 ≥20 才 dofollow |
| Fazier | 免费 | **首页/页脚挂 Fazier 回链**；30 天审核 | 付费才有 |
| DevHunt | 免费上架 | 只收开发者工具；GitHub 登录 | 免费 nofollow / $49 dofollow |
| TinyLaunch | 免费排队 | 挂 badge | 前三 + badge 才 dofollow |
| CodeHype | 免费 14 天队列 | 要有 HTTPS 官网；AI 产品为主 | 挂 badge 期间 dofollow |
| StartupBase | 免费（4–5 周） | 挂 badge | 付费才有 |
| AlternativeTo | 免费 | 账号 + 验证邮箱；免费队列极长 | dofollow |
| SaaSHub | 免费 | **自有域名官网**；必须填竞品 | dofollow |
| TAAFT | 编辑审核 | 必须是 AI 产品 | 付费档 $437（2026-11 页面） |
| indie-apps.com | 免费即时上线 | 一个人做的 Apple App | 付费档才有 |
| Indie App Catalog | 免费 | 美区 App Store | — |
| Discover Indie Apps | $9 | 已上架 | dofollow |
| Indie App Santa | $150/天 | 必须真有限时优惠 | — |
| BetaList | 纯付费 | 自有域名落地页 | — |
| **Crowdstax** | 免费审核提交 | 先过审再谈钱；mobile app 没写在收录类型里 | 免费档产品页外链 / Pro $4.99 起永久 dofollow |

## 6. 六个会让你白忙的坑

1. **提交 ≠ 排期**：Uneed 提交只是存草稿，必须回 dashboard 选「免费排队 / Fast-track / Skip」。
2. **「免费」经常等于「挂 badge」**：Fazier / TinyLaunch / StartupBase / CodeHype 都要回链；没有官网 = 这几家不存在。
3. **Peerlist 三个卡点**：实名验证、项目必须 100% 完成、周一 UTC 零点。求票 = spam。
4. **r/iosapps 不是发布当天能发的**：要上架满 30 天 + 300 karma + 90 天账号。
5. **App Store 直链不够用的五家**：Fazier、TinyLaunch、StartupBase、BetaList、SaaSHub。
6. **买票/批量新号投票**：Uneed 下架，PH 2026 算法专罚求票。

## 7. 怎么跑

```bash
node scripts/build-matrix.mjs templates/launch-platforms.json \
  --product <产品>.json --out 发布台-<产品>.html
```

产品 JSON 最小字段：`{slug, name, lanes:["ios"|"dev"|"ai"], url, state, todo:[判断句…]}`。
产物零依赖单文件：只开页、递物料、记进度（localStorage 按 slug 隔离），**提交永远你自己按**。

数据里每条平台都带 `verified`（核实日期）与 `source`（证据链接）；`src3p:true` = 第三方口径，
`unverified:true` = 没核到官方提交页，**不要排进日程**。

## 8. 第三个投递面：ClawMe（手机上只做「点一下去注册」）

| 渠道 | 干什么 | 不适合 |
|---|---|---|
| 发布台（电脑浏览器） | 看全量、切泳道、勾进度、复制物料 | 碎片时间 |
| 目录页（电脑浏览器） | **真正提交**（截图、长文、仓库 URL） | 出门在外 |
| ClawMe（iPhone） | **打开 → 注册 → 回来勾掉** | 任何要上传/长文的动作 |

平台数据里带 `phone: true/false`：要传截图/写长文/进 App Store Connect 的（本轮 21 家）是 `phone:false`。

```bash
node scripts/send-clawme.mjs launch/platforms.json --product launch/products/blockwipe.json --dry-run
node scripts/send-clawme.mjs launch/platforms.json --product launch/products/blockwipe.json --limit 3 --wait
```

一次投递 = **1 张简报 alert + N 张 open_url 卡（N≤3）**：iOS 端 `alert` 只有 message + 「知道了」，
塞不进链接按钮；`open_url` 是唯一「点一下就落到具体页面」的类型。进度存 `~/.clawme-bomber/<slug>.json`。

**实测坑（2026-11-17）**：ClawMe 后端若在带代理变量的终端里启动（`https_proxy` + `NODE_USE_ENV_PROXY=1`），
APNs 报 `The pending stream has been canceled` —— 卡片照样入队、App 里能看到，**但锁屏推送不响**。
改用 LaunchAgent（`net.clawme.bridge`，不继承 shell 环境）后 `delivery:{ok:true,sent:1,total:1}`。
**判据是 `delivery.ok`，不是 HTTP 201。**

## 9. 反向工程：被「发现型引擎」找到，和正确的邮件营销

引擎/简报会主动发现「Move to Top」这类功能并写信，它读的元数据是：

| 它读什么 | 要写成什么 |
|---|---|
| repo description / topics | 一句话定义 + 产品名当搜索词 |
| npm 包名 / keywords | `dsh-<用户会搜的词>`，名字本身就是关键词 |
| README 第一段 | 定义句 + 安装命令 + 一句「不做什么」 |
| peerDependencies | 写清宿主版本，机器才知道「给谁用」 |

**被 AI/引擎发现，不靠内容多，靠字段齐。**

自己跑同一台引擎的正确形态：源（Crowdstax 71 家目录 / PH 日榜 / GitHub trending / HN Show / App Store 新上架）
→ 判据（这人最近 30 天有没有在做同类产品）→ 3 句话的信（我看到你在做 X / 我们做了什么 / 链接，不用回复）
→ 台账。红线：一封一写、留退订、同人 30 天不超 2 封、不买名单。

## 出处

- 33 个 iOS 渠道逐条规则（含 Reddit 各版门槛、媒体 pitch）：<https://launchindieapps.com/guides/where-to-launch-ios-app>（2026-11-05；该站是作者自己的付费站，页面已自我披露）
- Uneed 免费线/分数：<https://afterlaunch.io/learn/how-to-launch-on-uneed>
- Peerlist 排名机制：<https://help.peerlist.io/individual/launchpad/frequently-asked-questions-about-spotlight-by-peerlist>
- DevHunt 免费 vs $49：<https://devhunt.org/faq>
- MCP 目录横向对比：<https://github.com/mcpfinder/mcpfinder>
