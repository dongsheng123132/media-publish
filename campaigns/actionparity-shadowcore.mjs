// ActionParity（动作同源标准）+ 影核协议 ShadowCore Profile 的公开发布 campaign。
// 文案依据：仓库真实状态（v0.1.0 工作草案 / 18 测试全绿 / 三个试点 / docs/LAUNCH.md 分阶段闸门）。
// 定位纪律（来自 docs/LAUNCH.md「controlled public draft」阶段）：
//   说 working draft，不说 industry standard；招设计伙伴，不卖产品；HN/Reddit/Lobsters 零营销腔。
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));

const AP = 'https://github.com/dongsheng123132/action-parity';
const COMPARE = 'https://github.com/dongsheng123132/action-parity/compare/main...agent/tking-pilot-compatibility';

// ── 英文正文 ────────────────────────────────────────────────────────────────
const hnBody = `I kept hitting the same wall: an AI can now generate a lot of a desktop app, but it cannot reliably test the GUI it just produced. The usual workaround is Computer Use — screenshot, guess the button, inject a click, screenshot again. That breaks on resolution, locale, theme, focus, animation and version changes.

The real cost isn't slow tests. It's that the paths which actually break in production go untested: reconnect, stale writes, duplicate commands, cross-device state. None of those can be verified from a screenshot.

So we drafted ActionParity. The rule is deliberately narrow: every business-meaningful user action gets one stable Action ID and one canonical implementation in a headless Action Core. GUI, CLI, MCP, API and tests all bind to that same action, and a validator proves machine-readably that they haven't drifted. It explicitly does NOT say "every button needs a CLI command" — tab switching, hover, drag and animation stay UI concerns tested by UI automation.

There's a cross-device sub-profile (ShadowCore): one authoritative Action Core, every surface is a native shadow, and devices sync actions/state/events rather than screens. Opaque resume cursors, idempotency keys, state versions, and a nine-step gate before a remote write reaches the core. "Last write wins" is not allowed to be an undeclared default.

Honest limits: the first retrofit ADDS code — all three pilots grew net lines because manifests, adapters and contract tests are new surface. It pays back at the second interface or the first important behavior change, not on day one. ShadowCore is a 0.1 non-normative draft: it has schema, fixtures and tests, but no two-product closed loop yet, and it won't enter the normative text before that exists. Real GUI tests are not eliminated — a contract test cannot prove a button is visible, reachable, or legible at 200% zoom.

Three pilots so far (Tauri+Rust, plain Python, and one production Windows app), 100% strict parity on declared bindings. Two findings only a real executable surfaced: a provider record that would have leaked an API key into an agent-visible surface, and a manifest declaring "no confirmation required" while the CLI still inferred confirmation from effect class.

Apache-2.0, and there are six design questions we genuinely have not settled. Disagreement is more useful to us than stars right now. ${AP}`;

const redditBody = `AI can write a lot of a desktop app now, but it still can't test the GUI it just made. The standard workaround is Computer Use: screenshot, guess the button, inject a click, screenshot again. It breaks on resolution, locale, theme, focus, animation and version bumps.

The consequence isn't just slow tests. It's that nobody ends up testing the paths that actually break in production — reconnect, stale writes, duplicate commands, cross-device state. You can't verify any of those from a screenshot.

So we wrote a draft standard called ActionParity. The rule is narrow: every business-meaningful user action gets one stable Action ID and one canonical implementation in a headless Action Core. GUI, CLI, MCP, API and tests all bind to that same action, and a validator proves there's no drift.

It explicitly does NOT mean "every button needs a CLI command". Tab switching, hover, drag and animation are UI concerns and stay with UI automation.

There's a cross-device sub-profile (ShadowCore) for products on more than one machine: opaque resume cursors, idempotency keys, state versions, and a nine-step gate before a remote write touches the core. Sync actions, state and events — not screens.

Trade-offs, honestly:
- The first retrofit ADDS code. All three pilots grew net lines. It pays back at the second interface or the first important behavior change, not on day one.
- It's a 0.1 working draft, not an industry standard. ShadowCore has schema, fixtures and tests but no two-product closed loop yet.
- No AP-4 real-GUI journey report, no cross-vendor implementation, no long-term defect-rate benchmark.
- Real GUI tests are NOT eliminated. A contract test can't prove a button is visible, reachable, or legible at 200% zoom.

Three pilots so far (Tauri+Rust, plain Python, one production Windows app), 100% strict parity on declared bindings. Two things only a real executable caught: a provider record that would have leaked an API key into an agent-visible surface, and a manifest that declared "no confirmation required" while the CLI still inferred confirmation from effect class.

Apache-2.0. Six design questions are still open (partition strategy, merge semantics for stale writes, trusted confirmation channels on Android/HarmonyOS, cross-schema event replay, binding identifiers for non-Web toolkits, blob references). Feedback and disagreement welcome.

${AP}`;

// X: 280 硬限（URL 计 23）。无空行、无 bullet、hook 开头。
const tweetCore = `AI can write a GUI app but still can't test one. Screenshots, guessed buttons, injected clicks. ActionParity: GUI, CLI, MCP and tests all call one action core, so an agent verifies behavior without pixels. 0.1 draft, Apache-2.0, come break it: `;
const tweet = tweetCore + AP;

const linkedinText = `AI can now generate much of a desktop application. It still cannot reliably test the interface it just produced.

The common workaround — screenshot, guess the button, inject a click — is fragile under resolution, locale, theme and version changes. The deeper cost is that the paths which actually fail in production (reconnect, stale writes, duplicate commands, cross-device state) end up untested.

We published ActionParity as an open working draft: every business-meaningful action has one stable Action ID and one canonical implementation in a headless Action Core; GUI, CLI, MCP, API and tests all bind to it; a validator proves machine-readably that they have not drifted. A cross-device sub-profile (ShadowCore) syncs actions, state and events between devices rather than screens.

Evidence so far: three pilots (Tauri+Rust, plain Python, one production Windows application), 100% strict parity on declared bindings, and two defects that only a real executable surfaced — a credential that would have leaked into an agent-visible surface, and a confirmation policy the runtime disagreed with.

It is a 0.1 draft, not an industry standard, and the first retrofit adds code before it saves any. We are looking for design partners across frameworks who will challenge it with real implementations.

Apache-2.0: ${AP}`;

const devtoBody = `## The problem

An AI can generate a lot of a desktop app. It cannot reliably test the GUI it just produced.

${redditBody.split('\n\n').slice(2).join('\n\n')}`;

const tgText = `ActionParity — an open working draft where an app's GUI, CLI, MCP tools and tests all invoke one shared Action Core, so an agent can verify behavior without screenshots. Apache-2.0, six open design questions, feedback wanted. ${AP}`;

const phFirst = `Hey PH 👋 This is a specification, not a product — no signup, nothing to buy.

The itch: AI can now write much of a desktop app, but it still can't test the GUI it produced. Screenshot-and-click automation breaks on resolution, locale, theme and version changes, so the paths that really fail in production (reconnect, stale writes, duplicate commands, cross-device state) end up untested.

ActionParity says: every business-meaningful action gets one stable Action ID and one canonical headless implementation. GUI, CLI, MCP, API and tests bind to that same action, and a validator proves they haven't drifted. A cross-device sub-profile (ShadowCore) syncs actions, state and events instead of screens.

Three pilots so far, 100% strict parity on declared bindings. It's a 0.1 working draft — the first retrofit adds code before it saves any, and real GUI tests are still required. Six design questions are genuinely unsettled and open as issues.

Looking for design partners across frameworks more than upvotes 🙏 ${AP}`;

const phDesc = `An open standard (Apache-2.0 working draft) for apps whose GUI buttons, CLI, MCP tools and tests all invoke the same canonical Action Core — so an AI agent can verify the application's behavior without screenshots, guessed buttons or injected clicks. Includes a JSON Schema, a parity validator, three real pilot manifests, and the ShadowCore cross-device profile that syncs actions, state and events between devices instead of pixels.`;

// ── 中文正文 ────────────────────────────────────────────────────────────────
const cnBody = `一直有个矛盾：AI 现在能写出大量 GUI 软件，却测不了自己写出来的界面。

主流办法是 Computer Use —— 截图、猜按钮、模拟鼠标、再截图。分辨率、语言、主题、焦点、动画、版本号，变一个就挂一次。

真正的代价不是「测得慢」，而是大家干脆不测那些会在客户现场炸掉的路径：断线重连、陈旧写、重复命令、跨设备状态不一致。这些没有一条能靠截图验证。

于是我们写了一份草案标准 ActionParity（动作同源）。规则很窄：

- 每个有业务意义的用户动作，有唯一稳定的 Action ID，只在无界面的 Action Core 里实现一次；
- GUI、CLI、MCP、API、测试全部绑定同一个动作；
- 用验证器机器可读地证明它们没有漂移。

它明确**不**要求「每个按钮都配一条 CLI」。切标签页、悬停、拖窗口、播动画属于界面动作，照旧由 UI 自动化去测。

跨设备的部分是子规范「影核协议」：一个产品只有一个权威动作核心，各端都是它的原生影子；设备之间同步动作、状态和事件，不同步屏幕。不透明游标续传、幂等键、状态版本，远程写之前先过一道九步闸门（挑战绑定调用者 + Action ID + 输入摘要 + 状态版本；状态陈旧就返回 conflict，且不消费挑战、不执行）。「最后写入者获胜」不允许成为未声明的默认行为。

诚实说代价：

- 第一次改造**净增代码量**。三个试点都变长了，因为多了清单、适配器和契约测试。回本发生在第二个界面出现之后、或第一次重要行为变更时，不是第一天。
- 影核协议目前是 0.1 非规范性草案。Schema、8 个同步测试、5 个信封 fixture 是真的，但跨设备的双产品闭环还没跑完；在那之前它不会进入规范性正文。
- 真实 GUI 测试没有被取消。契约测试证明不了按钮可见、键盘可达、200% 缩放下看得清。

已有三个真实试点（Tauri + Rust / 纯 Python / 一个在跑的 Windows 生产应用），声明绑定的严格一致性 100%。两个只有真机 exe 才暴露的问题：一条供应商记录会把 API Key 漏进 Agent 可见接口（后来把该字段从序列化类型里整个删掉，只保留 has_saved_key）；以及清单声明「不需要确认」，CLI 却仍按副作用等级自行推断确认。

Apache-2.0。有六个我们确实没想清楚的设计问题（分区策略、陈旧写的「显式合并」语义、Android/鸿蒙上的可信确认通道、跨 schema 版本的事件重放、非 Web 端的绑定标识、大对象引用），都开在 issue 里。带着反对意见来更好。

${AP}`;

const cnShort = `开源了一份草案标准 ActionParity（动作同源）：让一个软件的 GUI 按钮、CLI、MCP 工具和测试，调用同一个动作核心 —— AI 不用截图就能验证它做对没做对。跨设备的子规范叫「影核协议」：同步动作/状态/事件，不同步屏幕。0.1 工作草案，Apache-2.0，六个设计问题还没答案，来吵架比来 star 有用 👉 ${AP}`;

const weiboText = `AI 能写 GUI，却测不了 GUI。我们开源了一份草案标准 ActionParity：GUI 按钮、CLI、MCP 工具和测试调同一个动作核心，AI 不用截图就能验证。跨设备子规范叫「影核协议」，同步动作不同步屏幕。0.1 草案 Apache-2.0 ${AP} #AI编程##开源##软件架构#`;

const xhsText = `AI 能写界面，却测不了界面 😵‍💫

做过桌面软件的都懂：让 AI 测 GUI，只能截图→猜按钮→点一下→再截图。换个分辨率挂、换个语言挂、加个动画也挂。

结果就是——真正会在客户电脑上炸掉的那些路径，反而没人测：
🔌 断线重连
🕰️ 陈旧写覆盖新数据
🔁 重复命令执行两次
📱 手机和电脑状态对不上

我们试着用一份开放标准解决它：

📌 ActionParity（动作同源）
每个有意义的动作只写一次，GUI / CLI / MCP / 测试全都调它，验证器机器可读地证明没跑偏。

📌 影核协议（跨设备子规范）
一个核心，多个影子。设备之间同步动作、状态、事件，**不同步屏幕**。

✅ 三个真实试点跑过，严格一致性 100%
✅ Apache-2.0 全开源，自测永远免费
⚠️ 诚实说：第一次改造是**加**代码不是减代码，回本在第二个界面出现之后

还有 6 个设计问题我们真没想清楚，欢迎来吵 🙋

仓库搜 dongsheng123132/action-parity

#AI编程 #开源 #软件架构 #程序员 #独立开发`;

const bilibiliDesc = `60~90 秒演示脚本（照着录）：
1. GUI 里点一下「渲染」按钮；
2. 屏幕上打出它触发的 Action ID 和 execution ID；
3. 用旧的 legacy CLI 参数跑同一个动作；
4. 用新的通用 action CLI 跑，输出纯 JSON；
5. 展示 GUI 随 CLI 调用一起更新；
6. 故意改坏一个绑定；
7. 跑验证器，一致性检查报红；
8. 改回来，输出一致性报告。

全程不解释架构，只给证据。

${cnShort}`;

// ── 硬约束自检（platform-copy-guidelines.md：X 280 / HN 标题 80）──────────────
function tweetLen(s) {
  // CJK 与 emoji 计 2，URL 固定计 23
  const noUrl = s.replace(/https?:\/\/\S+/g, '');
  const urls = (s.match(/https?:\/\/\S+/g) || []).length;
  let n = 0;
  for (const ch of noUrl) n += /[一-鿿　-〿＀-￯\u{1F300}-\u{1FAFF}]/u.test(ch) ? 2 : 1;
  return n + urls * 23;
}
const hnTitle = 'Show HN: ActionParity – GUI, CLI, MCP and tests invoking one shared action core';
if (tweetLen(tweet) > 280) throw new Error(`X 文案 ${tweetLen(tweet)} 字符，超 280`);
if (hnTitle.length >= 80) throw new Error(`HN 标题 ${hnTitle.length} 字符，须 < 80`);

const masterPrompt = 'Square 1:1 social poster, flat vector illustration, deep indigo background with a faint dot grid. Center: one glowing solid geometric core (a hexagonal prism) emitting clean light beams outward to five thin translucent outlined device silhouettes arranged in an arc — a desktop window, a phone, a terminal prompt, a tablet, and a small robot/agent glyph — each silhouette rendered as a semi-transparent shadow projection of the same core, never as a screenshot. Thin labeled connector lines between core and shadows. Accent colors electric cyan and warm amber, high contrast, precise technical diagram aesthetic, no photorealism, no text baked into the artwork except a small wordmark "ActionParity" at the top and "一核多影" beneath it.';

const campaign = {
  slug: 'actionparity-shadowcore',
  title: 'ActionParity 动作同源标准 + 影核协议 · 公开发布',
  subtitle: '0.1 工作草案 · Apache-2.0 · 招设计伙伴，不是卖产品 —— HN/Reddit/Lobsters 一律零营销腔',
  primaryUrl: AP,
  masterImage: { prompt: masterPrompt, size: '1024x1024' },
  repos: [
    { label: 'action-parity', url: AP },
    { label: '影核协议中文版', url: 'https://github.com/dongsheng123132/action-parity/blob/main/docs/SHADOW-SYNC.zh-CN.md' },
  ],
  platforms: [
    // ── 发布前置闸门（必须先做完，否则读者点过去看不到影核协议）──
    { id:'pre-gate', name:'⛔ 发布前置闸门（先做完再点下面任何一张卡）', region:'cn', priority:3,
      how:'影核协议全部内容还在 agent/tking-pilot-compatibility 分支上，main 上一个都没有。现在发出去，所有链接都是空的。',
      submitUrl: COMPARE,
      text:`发布前必须完成，逐条勾掉：

1. 把 agent/tking-pilot-compatibility 合进 main（点上面按钮直接开 compare 页开 PR）
2. 打一个 v0.2 草案 tag，release note 写「working draft」不写「standard」
3. 把六个开放设计问题开成 6 个 GitHub issue，打 help wanted + rfc 标签
   —— 现在仓库只有 1 个 open issue，引流过去读者无事可做，转化接近零
4. 确认 README 顶部有中文入口 README.zh-CN.md 的链接
5. 跑一遍 npm run check，确认 18 个测试全绿再发

第 3 条最重要：这轮宣发的 KPI 不是阅读量，是「非创始人提的 spec issue」和「独立实现报告」数。`,
      tips:'这张卡不是发布渠道，是自检清单。全部勾完再开始轰炸。' },

    // ── 海外 ──
    { id:'hn', name:'Hacker News（Show HN）', region:'intl', priority:3,
      how:'标题 + 仓库链接提交，正文贴到第一条评论。周二~周四 美西早 8-10 点最佳',
      submitUrl:'https://news.ycombinator.com/submitlink?u={url}&t={title}', url:AP,
      title:hnTitle, text:hnBody,
      tips:'HN 最吃「诚实的限制」。正文里那段 honest limits 千万别删，删了就变营销贴。前 3 小时守评论区。与 Reddit 别同一天。' },
    { id:'reddit_programming', name:'Reddit · r/programming', region:'intl', priority:3,
      how:'纯文本贴，标题描述性、不标题党',
      submitUrl:'https://www.reddit.com/r/programming/submit?title={title}',
      title:"We're drafting an open standard so an app's GUI, CLI, MCP tools and tests all call one action core",
      text:redditBody,
      tips:'r/programming 对「又一个标准」很警惕。开头先讲问题、trade-off 部分往前放，结尾才放链接。绝不能出现 check it out。' },
    { id:'reddit_claude', name:'Reddit · r/ClaudeAI', region:'intl', priority:2,
      submitUrl:'https://www.reddit.com/r/ClaudeAI/submit?title={title}',
      title:'A draft standard so agents can verify a desktop app without screenshots (Apache-2.0)',
      text:redditBody,
      tips:'这个社区最痛的是 Computer Use 又慢又贵，把「不烧截图预算」那条往前提。' },
    { id:'reddit_arch', name:'Reddit · r/softwarearchitecture', region:'intl', priority:2,
      submitUrl:'https://www.reddit.com/r/softwarearchitecture/submit?title={title}',
      title:'One action core behind GUI/CLI/MCP: a draft parity standard, and the cost of the first retrofit',
      text:redditBody,
      tips:'架构社区吃「代价分析」。把「第一次改造净增代码量」当卖点写，不当免责声明写。' },
    { id:'lobsters', name:'Lobsters', region:'intl', priority:1,
      how:'需邀请码。tag 选 api / testing / practices',
      submitUrl:'https://lobste.rs/stories/new',
      title:'ActionParity: one canonical action core behind an app\'s GUI, CLI, MCP and tests',
      text:hnBody, tips:'有邀请码再发。Lobsters 比 HN 更技术、更不容忍营销。' },
    { id:'devto', name:'Dev.to', region:'intl', priority:2,
      how:'技术博客长文，tags: opensource, testing, ai, architecture',
      submitUrl:'https://dev.to/new',
      title:'Testing a GUI app without screenshots: the four verification layers we drafted',
      text:devtoBody, tips:'Dev.to 吃「四层验证表格」，把那张表贴成 markdown 表格当全文骨架。' },
    { id:'x', name:'X / Twitter', region:'intl', priority:2,
      how:'一键打开会自动预填推文；配主图再发',
      submitUrl:'https://twitter.com/intent/tweet?text={text}', text:tweet, needsImage:true,
      tips:'已按 280 硬限算过（URL 计 23）。配「一核多影」主图，转化明显更高。想展开就发 thread：第 2 条放四层验证表，第 3 条放六个开放问题。' },
    { id:'linkedin', name:'LinkedIn', region:'intl', priority:2,
      how:'前 2 行是折叠前黄金位',
      submitUrl:'https://www.linkedin.com/feed/?shareActive=true',
      text:linkedinText, tips:'企业读者关心「谁付钱、值不值」。这里可以点到「减少 GUI 测试抖动和发版成本」，但别提你们要卖的服务。' },
    { id:'ph', name:'Product Hunt', region:'intl', priority:1,
      how:'按表单逐格填。注意：这是规范不是产品，PH 转化本来就低，不勉强',
      submitUrl:'https://www.producthunt.com/posts/new',
      fields:[
        { label:'Name', value:'ActionParity' },
        { label:'Tagline', value:'One action core behind your app\'s GUI, CLI, MCP and tests', limit:60, rows:2 },
        { label:'Description', value:phDesc, limit:500, rows:6 },
        { label:'Launch tags（选 3 个）', value:'Developer Tools · Artificial Intelligence · Open Source', rows:2 },
        { label:'First comment（essential）', value:phFirst, rows:9 },
      ],
      tips:'PH 用户找的是能马上用的产品，标准类内容天然吃亏。首评开头就说清「这是规范不是产品」，反而少挨骂。优先级最低，可跳过。' },
    { id:'telegram', name:'Telegram', region:'intl', priority:1,
      how:'一键预填分享到频道/群',
      submitUrl:'https://t.me/share/url?url={rawurl}&text={text}', url:AP, text:tgText,
      tips:'短一句 + 链接即可。' },
    { id:'awesome', name:'awesome 列表 PR（长尾）', region:'intl', priority:1,
      how:'给相关 awesome 列表提一行 PR，长尾流量',
      submitUrl:'https://github.com/hesreallyhim/awesome-claude-code',
      text:`PR 描述：Add ActionParity — an open standard (Apache-2.0 draft) where an app's GUI, CLI, MCP tools and tests all invoke one canonical Action Core, so an agent can verify behavior without screenshots. Includes JSON Schema, parity validator, and the ShadowCore cross-device profile. ${AP}\n\n同样值得提 PR 的列表：awesome-mcp-servers、awesome-ai-agents、awesome-testing。照各仓库 CONTRIBUTING 的格式加一行。`,
      tips:'长尾但持久。一次提 3~4 个列表。' },

    // ── 国内 ──
    { id:'mp', name:'微信公众号（主阵地）', region:'cn', priority:3,
      how:'发长文。正文用另外单独写好的那篇推文全文，不是这里的短版',
      submitUrl:'https://mp.weixin.qq.com/',
      title:'我们在定一个协议：让 AI 不用截图，就能测完一个 GUI 软件',
      text:cnBody,
      tips:'⭐ 公众号是这轮的主阵地。正文用完整长文（含四层验证表 + 六个开放问题 + 商业中立性声明），这里的 text 只是精简版兜底。表格要转图片，公众号编辑器粘 markdown 表格会掉格式。文末放「阅读原文」指 GitHub。' },
    { id:'v2ex', name:'V2EX · 分享创造', region:'cn', priority:3,
      how:'选「分享创造」节点',
      submitUrl:'https://www.v2ex.com/new',
      title:'我们在定一个开放标准：让 GUI、CLI、MCP 和测试共用同一个动作核心',
      text:cnBody,
      tips:'⭐ 国内程序员最对口。V2EX 极度反感自吹，「诚实说代价」那段必须留，而且要早出现。' },
    { id:'zhihu', name:'知乎专栏', region:'cn', priority:2,
      how:'知乎吃「观点 + 对比」，开头先抛痛点',
      submitUrl:'https://zhuanlan.zhihu.com/write',
      title:'AI 能写 GUI，却测不了 GUI —— 我们试着用一个协议解决它',
      text:cnBody,
      tips:'开头三段就是痛点，别急着上架构图。可以顺手回答几个「AI 测试 / Computer Use」相关问题引流。' },
    { id:'juejin', name:'掘金', region:'cn', priority:2,
      how:'教程风：带代码块，可跑',
      submitUrl:'https://juejin.cn/editor/drafts/new',
      title:'ActionParity 实践：让 GUI、CLI、MCP 与 AI 共用一个动作核心',
      text:`${cnBody}\n\n---\n\n五分钟自己验一遍：\n\n\`\`\`bash\ngit clone ${AP}\ncd action-parity && npm install\nnpm run check    # 18 个测试应该全绿\nnpm run report   # 看一份真实产品的一致性报告\n\`\`\``,
      tips:'掘金吃可跑的命令。把上面那段 bash 放到正文靠前的位置。tags：开源、架构、AI、测试。' },
    { id:'jike', name:'即刻', region:'cn', priority:2,
      how:'发动态，配主图',
      submitUrl:'https://web.okjike.com/', text:cnShort, needsImage:true,
      tips:'即刻要干货无水分，一句话版 + 主图即可。' },
    { id:'sspai', name:'少数派', region:'cn', priority:1,
      how:'投稿。注意：少数派偏「工具叙事」，协议类内容是弱匹配',
      submitUrl:'https://sspai.com/write',
      title:'当 AI 开始接管软件操作，我们需要一份新的接口约定',
      text:cnBody,
      tips:'弱匹配。要发就改成「AI 时代软件该怎么被操作」的思辨向，别写成规范文档。优先级低。' },
    { id:'weibo', name:'微博', region:'cn', priority:1,
      how:'一键预填分享',
      submitUrl:'https://service.weibo.com/share/share.php?title={text}&url={rawurl}', url:AP,
      text:weiboText, needsImage:true, tips:'一句话 + 话题标签，配主图。' },
    { id:'xiaohongshu', name:'小红书', region:'cn', priority:1,
      how:'creator 后台发，必须配图',
      submitUrl:'https://creator.xiaohongshu.com/publish/publish',
      text:xhsText, needsImage:true,
      tips:'协议类内容在小红书天然吃亏。已经把文案改写成「痛点科普」体（AI 测不了 GUI），别直接搬技术正文。做成 4~6 张图的图集转化更高。' },
    { id:'bilibili', name:'Bilibili 专栏 / 视频', region:'cn', priority:2,
      how:'录 60~90 秒演示，转化比文章高得多',
      submitUrl:'https://member.bilibili.com/platform/upload/text/edit',
      title:'点一下按钮，和敲一条命令，跑的是同一个动作 —— 90 秒看懂动作同源',
      text:bilibiliDesc, needsImage:true,
      tips:'⭐ 演示视频是这套东西最好的证据形式：「改坏一个绑定 → 验证器立刻报红」比任何架构图都有说服力。录完了 X / 视频号 / 抖音都能复用。' },
    { id:'shipinhao', name:'视频号', region:'cn', priority:1,
      how:'标题 < 30 字，配 B 站那条同款视频',
      submitUrl:'https://channels.weixin.qq.com/platform/post/create',
      title:'点按钮和敲命令，跑的是同一个动作',
      text:cnShort, needsImage:true, tips:'和公众号联动，同一天发。' },

    // ── 定向社区（这类标准最该去的地方，没有网页提交页，手动发）──
    { id:'gh-discussion', name:'自己仓库开 RFC 讨论帖', region:'intl', priority:3,
      how:'在 action-parity 的 Discussions 开一帖，专门招设计伙伴',
      submitUrl:'https://github.com/dongsheng123132/action-parity/discussions/new/choose',
      title:'Looking for design partners: six unsettled questions in the ShadowCore profile',
      text:`We are looking for 10 design partners from different frameworks (Electron, Tauri, .NET, Swift, Python, ArkUI) to challenge this draft with real implementations.

Six questions we genuinely have not settled:

1. Partition strategy — a stream must be totally ordered or declare an explicit partition strategy. What should that declaration look like, and does total order become a bottleneck under concurrent multi-device writes?
2. Merge semantics — we require an owner to reject or explicitly merge a stale write, but we never defined "explicitly merge". Field-level CRDT, or is reject-and-retry the more honest answer?
3. Trusted confirmation channels — the confirmation field only records method, challenge id and time; the owner verifies authenticity through a trusted platform channel. That channel is clear on iOS. What is it on Android, HarmonyOS and Linux?
4. Cross-schema event replay — snapshots cover compaction, but can an old cursor range still be replayed after task@2 becomes task@3? Should migration functions be normative?
5. Binding identifiers off the web — data-action-id works for Web and Tauri. What is the equivalent for Windows native controls, SwiftUI and ArkUI? Binding checks must not depend on pixels.
6. Blob references — content addressing, chunking, expiry and authorization are entirely unspecified.

Answer any one of them from real production experience and you will have shaped the spec more than a hundred stars would.`,
      tips:'⭐ 这是所有流量的落点。必须在 HN/Reddit 发帖之前建好，否则人来了没地方参与。' },
    { id:'mcp-community', name:'MCP 社区（modelcontextprotocol）', region:'intl', priority:2,
      how:'去 MCP 的 GitHub Discussions 发一帖，讲清和 MCP 的分工，不抢地盘',
      submitUrl:'https://github.com/modelcontextprotocol/servers/discussions',
      text:`定位话术（务必这么说，别说成竞品）：

MCP makes tools discoverable and callable. UI Automation makes screens operable. ActionParity's only claim is narrower: it proves that a tool call and a button click perform the SAME action, and it publishes a machine-readable report when they drift.

We deliberately do not re-specify transport, tool discovery or schema description — MCP, OpenAPI and OpenRPC already do that. The gap we target is parity evidence across an application's own surfaces.

Would value feedback from MCP server authors on whether an ActionParity manifest could generate an MCP tool list mechanically.

${AP}`,
      tips:'⭐ MCP 社区是最精准的受众。核心纪律：强调互补、不强调替代。抢地盘会被围攻。' },
    { id:'framework-communities', name:'框架社区（Tauri / Electron / .NET / 无障碍）', region:'intl', priority:2,
      how:'去各自 Discord / Discussions 发，一次一个，每个都要改写开场白',
      submitUrl:'https://github.com/tauri-apps/tauri/discussions',
      text:`各社区开场白（分别改写，别群发同一段）：

【Tauri】Tauri Commands 已经是很好的动作实现机制。我们在草拟一份规范，把「GUI 命令 / CLI / MCP 调同一个动作」的一致性变成可验证的报告。参考实现里有两个 Tauri + Rust 的试点。想问 Tauri 用户：invoke 层之上再加一层动作清单，是负担还是解脱？

【Electron】Electron 应用最容易出现 GUI 里直接写业务逻辑。我们想知道从 ipcMain handler 抽出动作核心，在真实 Electron 项目里的实际代价。

【.NET / WPF】希望了解 Windows 原生控件上，绑定标识（automation ID）能否稳定支撑「不依赖像素的绑定检查」。

【无障碍社区】这份规范要求每个 GUI 界面有稳定的非视觉绑定标识。它和 accessibility ID 高度重叠 —— 想请无障碍专家判断：这种复用会帮到辅助技术，还是会让开发者拿无障碍属性当自动化钩子从而滥用它？

${AP}`,
      tips:'⭐ 一次只发一个社区，间隔几天。群发同一段是被识别为 spam 的最快方式。无障碍社区那条尤其值得发 —— 他们的反对意见最有价值。' },
  ],
};

const out = resolve(here, 'actionparity-shadowcore.json');
writeFileSync(out, JSON.stringify(campaign, null, 2), 'utf8');
console.log('wrote', out, '·', campaign.platforms.length, 'platforms');
console.log('X 文案字符数:', tweetLen(tweet), '/ 280');
console.log('HN 标题字符数:', hnTitle.length, '/ 80');
