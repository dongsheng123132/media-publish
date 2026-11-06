# 全媒体发布轰炸机

作者 / Author：He Fangsheng (贺方升 / 贺去病; Dosen)· [hequbing.com](https://www.hequbing.com)

一份文案 → 一张自包含 HTML「发布台」，20+ 主流媒体入口（X / HN / Reddit / Product Hunt / LinkedIn / V2EX / 掘金 / 知乎 / 小红书 / 微博 / 公众号 / 抖音 / B站…），每个平台一张卡：**[一键打开发布页]**（在你登录态浏览器里开好提交页）+ **[复制标题/正文]**（平台定制文案）+ X/HN/Reddit/微博/Telegram **URL 预填**。**一张通配主图**自动生成，需配图的平台共用。进度勾选记 localStorage。

> 半自动：用**你自己带登录态的浏览器**，密钥/账号从不经过脚本。**不替你点「提交」**，最后一步永远你自己按。

## 目录结构

```
scripts/
  build-launcher.mjs      引擎：campaign JSON → 单文件 HTML 发布台
  gen-images.mjs          自动生图：调你自己的生图接口生成「通配主图」，回填并重编译
catalog.json              40+ 平台目录：id → submitUrl(+{url}/{title}/{text} 占位) + 字数限制
                          kind=software 开发者社区 / commerce 电商工厂 / service 专业服务
references/
  platform-copy-guidelines.md   软件类各平台文案规则（Twitter 280 硬算 / Reddit 反自夸 / HN 零营销…）
  product-copy-guidelines.md    产品/工厂类文案规则（Amazon 五点 / Alibaba MOQ · OEM / TikTok 钩子…）
campaigns/
  opencodex-redline.mjs    🧑‍💻 软件类模板：开发者社区首发（20 平台，中/EN）
  magcharge-3in1.mjs       📦 产品/工厂类模板：电商+跨境带货（20 平台，EN/中/日/ES 多语言）
  lawyer-services.mjs      ⚖️ 专业服务类模板：律师，权威+本地获客（12 平台，中/EN）
  *.json                   编译产物：这次发布的完整 campaign 数据
output/
  index.html               导航首页：列出所有发布台
  发布台-*.html            最终发布台（浏览器打开即用）
  *-images/master.png      自动生成的通配/主图
SKILL.md                   作为 Claude Code skill 的说明（本目录即 skill 源）
```

## 用法

```bash
# 1) 改文案（复制 campaigns/opencodex-redline.mjs 改成你的项目）
node campaigns/<你的>.mjs                 # → campaigns/<你的>.json

# 2) 编译发布台
node scripts/build-launcher.mjs campaigns/<你的>.json output/发布台-<你的>.html

# 3)（可选）自动生成通配主图 —— 调你自己的虾盘云生图接口
node scripts/gen-images.mjs campaigns/<你的>.json output/发布台-<你的>.html

# 4) 用有各平台登录态的浏览器打开 output/发布台-<你的>.html
```

## 模板类型（换一套平台+文案 = 一个新行业）

引擎与平台目录通用，`campaigns/*.mjs` 就是「行业模板」。已内置三类，复制改文案即可扩展：

| 类型 | 渠道逻辑 | 典型平台 | 模板 |
|------|----------|----------|------|
| 🧑‍💻 软件 / 开源 | 开发者社区、技术信任 | HN / Reddit / PH / 掘金 / V2EX | `opencodex-redline` |
| 📦 产品 / 工厂 | 电商成交、跨境带货 | Amazon / Alibaba / TikTok / 小红书 / 1688 | `magcharge-3in1` |
| ⚖️ 专业服务 | 权威背书、本地获客、答疑 | 知乎 / 公众号 / 抖音普法 / 大众点评 / Google Business | `lawyer-services` |

> 想加的方向（App/Google Play、课程/知识付费、本地店铺/餐饮…）都是「再写一个 `.mjs`」的事——复制最接近的模板，改常量与各平台文案。

## 多语言

- `campaign.langs`：语言下拉顺序，如 `["en","zh","ja","es"]`，第一个是默认；`campaign.defaultLang` 可另指定默认。
- **任意文案字段**（`title`/`subtitle`/`name`/`how`/`title`/`text`/`tips`/`fields[].label`/`value`/`repos[].label`）都可以写成：
  - 纯字符串（对所有语言通用，**向后兼容**旧 campaign），或
  - 语言对象 `{ en:"…", zh:"…", ja:"…", es:"…" }`。
- 发布台顶部下拉切换语言时，**UI 与所有平台文案一起换**；某字段缺某语言时回退 `lang → defaultLang → langs[0] → 任一存在`。
- 内置 UI 语言：`zh / en / ja / es`（要加更多语言，在 `build-launcher.mjs` 的 `LANG` 表补一项即可）。

## 配图策略

- **默认一张「通配主图」**（`campaign.masterImage`，1:1 方图）配所有平台 —— 不给每个平台单独作图。
- 只有当某平台**确需展示不同内容**时，才在该平台卡加 `imagePrompt`，`gen-images` 会额外生成一张。
- 生图走**可配置的文生图 CLI**：默认走本机 `uking-aigc`，用环境变量 `MP_GEN_IMAGE` 可指向你自己的任意 text-to-image CLI（约定 `--prompt/--out/--size/--json`）。密钥由该 CLI 自行解析，**本项目不接触任何 key/端点**。

## 由来

合并自 `dongsheng123132/social-copy-generator`（14 平台文案撰写智能）+ 发布台启动机制（真实 submit 网址 / 一键开页 / URL 预填 / 进度记忆 / 自动生图）。同类可参考 Postiz（排期+预览）、easy-uploader（视频平台自动上传）、cross-post（API 直发）。
