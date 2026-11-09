// U-King × DeepSeek V4 Pro 新版线路：首轮基线 + 证据闸门复测 campaign。
// 口径：今天 = 2026-08-13 虾盘云/U-King 新版线路上线并实测，不冒充 DeepSeek 全球首发。
// 数据：AbsenceBench 16 对象、自然任务 32 episode/模型；属于工程 pilot，不是论文最终结论。
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const SITE = 'https://u-king.org';
const BOMBER = 'https://github.com/dongsheng123132/media-publish';
const wechatArticle = readFileSync(resolve(here, '../mp-articles/main/2026-08-13-deepseek-v4-pro-agent-test/article.md'), 'utf8');

const core = `U-King 不是再做一个聊天壳。

它做的是更费事、但更接近真实开工的一步：把 Claude Code、Codex、Hermes、OpenClaw 这些国际主流 Agent 下载装好，补齐 Node、PATH 和运行环境，再一键接上 DeepSeek 等国产大模型。前端继续使用成熟 Agent，后端使用国内可直连、按量计费的模型能力。

今天虾盘云 / U-King 上线 DeepSeek V4 Pro 新版线路，我们顺手用一套科学 Agent 任务做了首轮实测。无证据闸门时，在可解析结果中 Flash 正确率 63.3%，Pro 90.6%；配对正确率 31.3% → 81.3%；“工具已经查到，最终仍判缺席”的证据冲突 9 次 → 2 次。

随后保持自然任务不变，加上模型外证据闸门复测：Pro 的 32 条轨迹中有 3 条初答被拦下，3 条全部修正，最终 32/32 完成；Flash 的 32 条中有 26 条完成，其中 9 条需要干预并全部修正，另有 6 条输出在 240 字符处截断，未形成合法 JSON。闸门没有让模型“变成 100%”，它只是让与工具证据冲突的答案不能直接提交。

怎么选很直观：规则明确、批量重复的任务用 Flash；目标含糊、判断密度高、需要自己规划工具的任务用 Pro。高风险任务即使使用 Pro，也要加模型外证据闸门。

全部 smoke、基线与闸门复测累计实扣 ¥2.820158。U-King 管家本体免费，模型按量使用。

下载与介绍：${SITE}`;

const short = `想用 Claude Code、Codex、Hermes，却卡在安装、Node、PATH、API 和网络配置？

U-King 一次帮你装好国际主流 Agent，再一键接上 DeepSeek 国产大模型：成熟 Agent 做工具与工作流，国产模型做大脑，国内直连、按量计费。

今天新版 Pro 线路首测：无闸门时，Flash 可解析结果正确率 63.3%，Pro 90.6%。加证据闸门后，Pro 32/32 完成；Flash 26/32 完成，剩余 6 条输出截断。全部实验实扣 ¥2.82。

规则明确用 Flash，复杂判断用 Pro。下载：${SITE}`;

const xhs = `不会配环境，也能把 Claude Code 和 Codex 装进电脑？🤖

我做的 U-King，不是又一个聊天框，而是一台 AI 装机管家：

🔧 自动下载并装好
✅ Claude Code
✅ Codex
✅ Hermes
✅ OpenClaw

🧠 再一键接上国产大模型
✅ DeepSeek Flash：批量、便宜、规则明确的活
✅ DeepSeek Pro：复杂、含糊、高判断密度的活

📊 今天新版 Pro 线路首测
无证据闸门、同一套自然科学 Agent 任务：
Flash 可解析结果正确率 63.3%
Pro 正确率 90.6%
配对正确率 31.3% → 81.3%

🛡️ 第二轮加模型外证据闸门
Pro：3 条初答被拦，全部修正，32/32 完成
Flash：9 条完成轨迹被拦并修正，另有 6 条输出截断

💰 全部 smoke、基线和闸门复测一共实扣 ¥2.82

国际主流 Agent 的工具能力 + 国产大模型的大脑，国内直连，不用自己折腾 Node、PATH、Key 和配置。

U-King 管家本体免费：${SITE}

注：这是 16 个对象的单次工程 pilot，不是最终论文结论；闸门后的结果也不等于模型本身 100% 正确。

#AI工具 #DeepSeek #ClaudeCode #Codex #国产大模型 #效率工具 #独立开发者`;

const zhihu = `真正阻止很多人使用 Claude Code、Codex 的，往往不是模型能力，而是安装和接入。

Node 怎么装、PATH 为什么不生效、CLI 去哪里下载、不同客户端怎么填 Base URL、国内网络如何连通——这些事情对开发者只是麻烦，对普通用户却足以让产品根本无法开始使用。

U-King 的定位不是重新做一个聊天界面，而是把国际主流 Agent 工具真正装进用户电脑：自动安装 Claude Code、Codex、Hermes、OpenClaw，补齐依赖并逐项验证；随后一键配置 DeepSeek 等国产模型。于是用户得到的是“成熟 Agent 工作流 + 国产模型大脑”，而不是只能在网页里对话的孤立模型。

今天虾盘云 / U-King 上线 DeepSeek V4 Pro 新版线路，我们没有只转发排行榜，而是做了一轮可复跑的 Agent 对照。任务要求模型区分“参考库没有查到”和“世界上不存在”。在不明示安全规则的自然任务中，Flash 在 30 条可解析输出中的标签正确率为 63.3%，另有 2 条不可解析；Pro 为 90.6%。同一对象正常/故障两臂都答对，Flash 31.3%，Pro 81.3%。工具已命中、结论却仍报缺席的冲突，Flash 9 次，Pro 2 次。

这说明模型路由不该只按“贵/便宜”划分：批量、机械、规则明确的工作交给 Flash；目标含糊、需要自行规划工具与处理不确定性的工作交给 Pro。对真正高风险的任务，Pro 也不是保险箱，还需要模型外 evidence gate。

第二轮保持自然任务不变，加入模型外证据闸门。Pro 的 32 条轨迹中，3 条初答被拦下并全部修正，最终 32/32 完成；Flash 有 26 条完成轨迹，其中 9 条需要干预并全部修正，另有 6 条输出在 240 字符处被截断，未形成合法 JSON。这个结果不能写成“模型被提升到 100%”：准确说法是，闸门阻止了本轮观察到的证据冲突直接提交，同时也暴露了 Flash 的输出完成问题。

全部 smoke、基线和闸门复测累计实扣 ¥2.820158。U-King 本体免费，模型按量使用。

实验只有 16 个对象、单次运行，属于工程 pilot，不是最终论文结论。下一步应做固定样本、多随机种子复跑，并把模型质量、接口完成率与闸门收益分开报告。

${SITE}`;

const v2ex = `做了一个 U-King AI 装机管家，解决的不是“再做一个聊天框”，而是把 Agent 真装好、真配通。

它会自动下载/安装 Claude Code、Codex、Hermes、OpenClaw，处理 Node、PATH 和基础配置，然后一键接 DeepSeek 等国产模型。思路是保留国际主流 Agent 的工具链和 workflow，把国产大模型作为可切换后端。

今天接入了 DeepSeek V4 Pro 新版线路，也顺手跑了一组小型 Agent pilot：4 学科、16 对象、每个对象正常/故障两臂。自然任务下 Flash 19/30（2 次输出不可解析），Pro 29/32；配对正确率 5/16 vs 13/16。工具已返回别名命中但最终仍判“缺席”的冲突，Flash 9 次、Pro 2 次。

随后加模型外 evidence gate 复测：Pro 3 条初答被拦并全部修正，32/32 完成；Flash 的 26 条完成轨迹中有 9 条被拦并修正，另有 6 条输出在 240 字符处截断。闸门后“已接受结果全对”不等于模型 100% 正确，而是矛盾答案不能直接提交。

工程结论：规则明确的批量任务用 Flash；含糊、多工具、判断密度高的任务用 Pro；高风险任务再加 harness 强制证据约束。全部实验累计实扣 ¥2.82。

这是单次 pilot，不是最终论文结论。下一步做固定样本、多随机种子复跑。

官网：${SITE}
发布工具：${BOMBER}`;

const en = `U-King is not another chat wrapper. It installs and verifies Claude Code, Codex, Hermes and OpenClaw, then configures them to use DeepSeek and other China-accessible model backends. The idea is simple: keep mature agent workflows and use domestic models as the interchangeable brain.

For today's U-King/xiapan-cloud V4 Pro route update, I ran a small paired scientific-agent pilot instead of reposting a leaderboard. Without an evidence gate, Flash scored 63.3% on parseable outputs and Pro 90.6%; paired accuracy was 31.3% vs 81.3%, and evidence/decision conflicts fell from 9 to 2.

In a follow-up with a model-external evidence gate, 3/32 Pro first answers were intercepted and all were repaired; Pro completed 32/32. Flash completed 26/32: 9 completed traces required intervention and were repaired, while 6 outputs were truncated at 240 characters and never formed valid JSON. This does not mean the gate made either model 100% accurate; it prevented observed evidence contradictions from being submitted.

Total spend across smoke, baseline and gated runs was CNY 2.820158.

This is a 16-object, single-run engineering pilot, not a final research claim. The next phase needs fixed samples and repeated seeds.

${SITE}`;

const campaign = {
  slug: 'uking-deepseek-v4-pro-day0',
  title: 'U-King × DeepSeek V4 Pro · 新版线路首测',
  subtitle: '一键装好 Claude Code / Codex / Hermes / OpenClaw，再一键接上国产大模型',
  primaryUrl: SITE,
  defaultLang: 'zh',
  langs: ['zh','en'],
  masterImage: {
    prompt: 'Futuristic split AI workstation, cyan fast agent workflow on the left and gold deep reasoning core on the right, scientific evidence gates and tool circuits, dark navy, no text, no logo',
    size: '1536x1024',
    image: './deepseek-v4-pro-day0-images/master.png'
  },
  repos: [
    {label:'U-King 官网 / Download',url:SITE},
    {label:'全媒体发布轰炸机',url:BOMBER}
  ],
  platforms: [
    {id:'x',name:'X / Twitter',region:'intl',priority:2,how:'英文短帖，URL 预填',submitUrl:'https://twitter.com/intent/tweet?text={text}',text:'U-King installs Claude Code, Codex, Hermes & OpenClaw, then connects them to DeepSeek. Pilot: ungated Flash 63.3% vs Pro 90.6%. An evidence gate repaired 3/3 flagged Pro answers; Flash had 6 truncated outputs. Total CNY 2.82. https://u-king.org',needsImage:true,tips:'单次 pilot，避免使用 benchmark/world-first/100% accuracy。'},
    {id:'linkedin',name:'LinkedIn',region:'intl',priority:1,submitUrl:'https://www.linkedin.com/feed/?shareActive=true',text:en,needsImage:true,tips:'披露本人是 U-King 开发者；保留 pilot 限制。'},
    {id:'telegram',name:'Telegram',region:'intl',priority:1,submitUrl:'https://t.me/share/url?url={rawurl}&text={text}',text:'U-King installs Claude Code, Codex, Hermes and OpenClaw, then connects them to DeepSeek. Pilot: ungated Flash 63.3% vs Pro 90.6%; a follow-up evidence gate repaired all flagged completed answers. Total spend CNY 2.82.',tips:'短讯 + 官网。'},

    {id:'v2ex',name:'V2EX · 分享创造',region:'cn',priority:3,submitUrl:'https://www.v2ex.com/new',title:'U-King：一键装好 Claude Code / Codex / Hermes，再接 DeepSeek',text:v2ex,tips:'选“分享创造”；平实说明是本人项目和 pilot 限制。'},
    {id:'juejin',name:'掘金',region:'cn',priority:2,submitUrl:'https://juejin.cn/editor/drafts/new',title:'国际 Agent + 国产模型：U-King 如何一键装好 Claude Code 与 Codex',text:zhihu,tips:'按技术复盘发，首图用通配主图。'},
    {id:'zhihu',name:'知乎专栏',region:'cn',priority:3,submitUrl:'https://zhuanlan.zhihu.com/write',title:'为什么有了 DeepSeek，普通人仍然用不起来 Claude Code 和 Codex？',text:zhihu,tips:'观点先行；保留实验边界。'},
    {id:'jike',name:'即刻',region:'cn',priority:2,submitUrl:'https://web.okjike.com/',text:short,needsImage:true,tips:'开发者圈，正文控制短。'},
    {id:'weibo',name:'微博',region:'cn',priority:2,submitUrl:'https://service.weibo.com/share/share.php?title={text}&url={rawurl}',text:'U-King 一键装好 Claude Code、Codex、Hermes、OpenClaw，再接 DeepSeek 国产大模型。Pro 新线路实测：无闸门 Flash 可解析结果 63.3%，Pro 90.6%；加证据闸门后，Pro 3 条被拦初答全部修正并完成 32/32。全部实验实扣 ¥2.82。#DeepSeek# #ClaudeCode# #UKing#',needsImage:true,tips:'页面会预填；确认数字和链接后再发。'},
    {id:'xiaohongshu',name:'小红书',region:'cn',priority:3,submitUrl:'https://creator.xiaohongshu.com/publish/publish',title:'Claude Code + DeepSeek，我终于一键装好了',text:xhs,needsImage:true,tips:'标题建议二选一；通配主图作首图。'},
    {id:'moments',name:'微信朋友圈',region:'cn',priority:3,submitUrl:'weixin://',text:short,needsImage:true,tips:'复制到手机发送；最后一步本人确认。'},
    {id:'mp',name:'微信公众号',region:'cn',priority:3,submitUrl:'https://mp.weixin.qq.com/',title:'DeepSeek V4 Pro 真有 Opus 4.8 水平吗？我花了22元跑了一遍',text:wechatArticle,needsImage:true,tips:'完整文章与6张精确数字排版卡已生成；图片目录见 mp-articles/main/2026-08-13-deepseek-v4-pro-agent-test/images。'},
    {id:'sspai',name:'少数派',region:'cn',priority:2,submitUrl:'https://sspai.com/write',title:'把国际主流 Agent 接上国产大模型：U-King 的一键装机尝试',text:zhihu,needsImage:true,tips:'以装机体验、轻量与实测为主。'},
    {id:'bili',name:'Bilibili 专栏',region:'cn',priority:1,submitUrl:'https://member.bilibili.com/platform/upload/text/edit',title:'Claude Code + DeepSeek，普通人如何五分钟装好 AI Agent',text:core,needsImage:true,tips:'可配 60 秒录屏：下载→选择模型→连通测试。'},
    {id:'douyin',name:'抖音',region:'cn',priority:2,submitUrl:'https://creator.douyin.com/',title:'5分钟装好4个AI Agent',text:'不会装 Claude Code？U-King 自动装好 Claude Code、Codex、Hermes、OpenClaw，再一键配置 DeepSeek。Flash 跑批量，Pro 做难题，高风险任务再加证据闸门。首轮 63.3% vs 90.6%，全部实验实扣 ¥2.82。#DeepSeek #ClaudeCode #AI工具',needsImage:true,tips:'建议录 30–45 秒真机操作，别只发静态图。'},
    {id:'video_account',name:'微信视频号',region:'cn',priority:2,submitUrl:'https://channels.weixin.qq.com/platform/post/create',title:'一键装好4个Agent再接DeepSeek',text:short,needsImage:true,tips:'标题不超过30字；配真机录屏。'}
  ]
};

const out = resolve(here, 'uking-deepseek-v4-pro-day0.json');
writeFileSync(out, JSON.stringify(campaign, null, 2), 'utf8');
console.log('wrote', out, '·', campaign.platforms.length, 'platforms');
