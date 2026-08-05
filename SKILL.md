---
name: bomber
description: 全媒体轰炸机 —— 把一次开源/产品发布的文案，编译成一张自包含的 HTML「宣发发布台」，20+ 主流媒体入口一轮打完（海外 HN/Reddit/Product Hunt/X/LinkedIn/Lobsters/Dev.to/Telegram + 国内 V2EX/少数派/掘金/知乎/即刻/微博/小红书/公众号/视频号/B站…），每个平台一张卡片：[一键打开发布页] 在你登录态的浏览器里开好提交页，[复制标题/正文] 一键拷平台定制文案，X/HN/Reddit/微博/Telegram 直接 URL 预填。进度勾选记 localStorage。用于「轰炸机/全媒体轰炸/宣发/推广/发帖/开源发布/多平台分发/发布台/宣传文案一键去发」。不替你按最后的「提交」——发什么由你定。
---

# 全媒体发布轰炸机（宣发发布台）

把「一份文案 → 满世界手动复制粘贴」变成「打开一张发布台页面 → 每个平台一键开页+一键复制 → 你确认后自己点提交」。半自动，用**你自己带登录态的浏览器**，密钥/账号从不经过脚本。

> **合并说明**：本 skill = `dongsheng123132/social-copy-generator`（14 平台**文案撰写智能**）+ 发布台**启动机制**（真实 submit 网址 / 一键开页 / URL 预填 / 进度记忆）。
> - 各平台怎么写：见 `references/platform-copy-guidelines.md`（Twitter 280 硬算、Reddit 反自夸、HN 零营销、小红书 emoji 体…）。
> - 各平台 submit 网址与元信息：见 `catalog.json`（写 campaign 时按 id 取 `submitUrl`）。

## 何时用
用户说：轰炸机 / 全媒体轰炸 / 宣发 / 推广 / 发帖 / 开源发布 / 多平台分发 / 发布台 / 「宣传文案帮我写写然后一键去发」/ 把某仓库推出去。

> **名字**：中文名 **全媒体发布轰炸机**（简称「轰炸机」）；skill 调用名 `bomber`（斜杠命令 `/bomber`）。
> 原名 `media-publish`，开源仓库仍是 [`dongsheng123132/media-publish`](https://github.com/dongsheng123132/media-publish)，仓库名未改。

## 怎么用（两步）
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

## 边界（诚实）
- **不替你点「提交」**。发布台只开页 + 递文案，最后一步永远你自己按——避免误发。
- **不碰你的账号密码**。靠浏览器已有登录态，脚本不接触任何凭据。
- 各平台 submit 网址会随平台改版失效，改 `campaigns/*.json` 里的 `submitUrl` 即可。

## 已有 campaign
- `campaigns/opencodex-redline.*` — OpenCodex + Redline 开源发布（14 平台，中英分开）。
