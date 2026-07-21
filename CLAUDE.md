# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目是什么

把一次宣发的文案编译成一张**自包含单文件 HTML「发布台」**：40+ 平台（见 catalog.json），每平台一张卡 —— [一键打开发布页]（在用户带登录态的浏览器里 `window.open` 提交页）+ [复制标题/正文]（平台定制文案）+ X/HN/Reddit/微博/Telegram 等 URL 预填。零 npm 依赖（只用 `node:` 内置模块），无构建系统、无测试框架、无 lint。

本目录同时是一个 Claude Code skill（`media-publish`，见 SKILL.md —— campaign JSON 结构的权威文档）。

**硬边界（产品原则，不可破）**：不替用户点「提交」，不碰账号密码/凭据 —— 发布台只开页 + 递文案，靠浏览器已有登录态。

## 常用命令

```bash
node campaigns/<slug>.mjs        # 文案构造脚本 → 生成同名 campaigns/<slug>.json
node scripts/build-launcher.mjs campaigns/<slug>.json output/发布台-<slug>.html   # 编译发布台
node scripts/gen-images.mjs campaigns/<slug>.json output/发布台-<slug>.html       # （可选）生成通配主图并回填重编
```

- build-launcher 不传输出路径时产物会落在 campaigns/ 目录里 —— **始终显式传 output/ 路径**。
- gen-images 走可配置文生图 CLI：默认 `~/.claude/skills/uking-aigc/scripts/gen-image.mjs`，环境变量 `MP_GEN_IMAGE` 可指向任意约定 `--prompt/--out/--size/--json` 的 CLI；密钥由该 CLI 自行解析，本项目不接触任何 key/端点。支持 `--only master,<平台id>` 只生成部分图。
- 验证产物：浏览器打开 HTML（Git Bash：`start "" "$(cygpath -w output/发布台-<slug>.html)"`）。

## 数据流与架构

```
catalog.json（平台注册表，写 campaign 时按 id 取 submitUrl/charLimit）
references/*.md（文案撰写规则，写 title/text 前先读对口那份）
        │
campaigns/<slug>.mjs ──node──▶ campaigns/<slug>.json ──build-launcher──▶ output/发布台-<slug>.html
                                       ▲
                          gen-images.mjs 回填 masterImage.image 后自动重编
```

- **catalog.json** — 平台注册表：`id → submitUrl`（`{url}/{rawurl}/{title}/{text}` 占位符）+ `region`（intl/cn，决定角标）+ `kind`（software/commerce/service）+ `charLimit`（0 = 无硬限）+ `manual`（无网页提交页，卡片只给复制按钮）。平台改版导致 submitUrl 失效时改这里 + 已生成的 campaign JSON。
- **campaigns/\*.mjs** — 文案构造脚本（模板字符串写文案），跑一遍写出同名 `.json`。**改文案改 .mjs 再重跑，不要直接改 .json**。注意：`gen-images.mjs` 会把图片相对路径**回填进 .json**（`masterImage.image`），重跑 .mjs 会冲掉它 —— 重跑后需再跑一次 gen-images，或在 .mjs 里保留 image 字段。
- **scripts/build-launcher.mjs** — 引擎。整个发布台 UI（CSS / 客户端 JS / 各平台预览皮肤 / 多语言）都在这一个文件的 HTML 模板字符串里：
  - 占位符注入、进度勾选（localStorage `mp-done-<slug>`）、语言记忆（`mp-lang`）都在**客户端** JS 里做，campaign 数据整体 JSON 内嵌进页面；
  - 多语言：任何文案字段既可以是纯字符串（各语言通用），也可以是 `{en,zh,ja,es}` 对象；回退链：当前语言 → `defaultLang` → `langs[0]` → 任一存在的语言。**界面字符串**在文件内 `LANG` 字典 —— 新增界面语言要同时加 `LANG` 和 `LNAME`；
  - 字数统计 `cjkLen`：CJK/全角每字算 2（配合 X 的 280 硬限实时标红）；
  - 👁 预览按平台换皮：x / reddit / hn / linkedin / xhs / cn / generic；
  - 坑：外层是 JS 模板字符串，内嵌客户端 JS 的正则/转义里反斜杠要双写（如 `\\n`、`\\x00`）。
- **references/** — 两套文案规则，写 campaign 前按类型读对口的一份：
  - `platform-copy-guidelines.md`：软件/开源 → 开发者社区（HN 零营销、Reddit 反自夸、X 280 硬算、小红书 emoji 体…）；
  - `product-copy-guidelines.md`：实体产品/工厂带货 → 电商 + 消费社交（卖点前置、关键词即流量、信任背书、几乎每卡 `needsImage`）。
- **output/index.html** — 手工维护的发布台画廊，是 GitHub Pages 入口（根 index.html 重定向到 `./output/`）。**新增 campaign 后要手动在这里加一张卡**。

## campaign JSON 要点

结构详见 SKILL.md。`platforms[].id` 是进度记忆 key，须唯一；`title`/`text` 是隐式字段，额外表单字段（Product Hunt tagline、Amazon 五点描述等）放 `fields[]`（label/value/rows/limit）；`needsImage:true` 的卡共用顶部通配主图。

## 配图策略

默认只生成**一张 1:1 通配主图**（`campaign.masterImage.prompt`），所有需配图平台共用；只有当某平台确需不同画面时，才在该平台卡加 `imagePrompt` 让 gen-images 额外出一张。
