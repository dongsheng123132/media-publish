// 构造「专业服务类」宣发 campaign —— 律师 / 律所（示范模板）。
// 与软件类、产品类都不同：服务类靠「权威背书 + 答疑科普 + 本地获客」，
// 走知乎/公众号/抖音普法/大众点评/百家号/Google Business，而不是电商或开发者社区。
// 复制本文件改成你自己的服务（会计/咨询/设计/装修/教育…）即可。
// 合规提醒：律师广告禁用「胜诉率/包赢/最好」等承诺性、绝对化用语——本模板刻意规避。
// 生成: node campaigns/lawyer-services.mjs  ->  campaigns/lawyer-services.json
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));

// ── 服务事实（换成你自己的）──────────────────────────────
const SITE = 'https://law.example.com';   // TODO: 换成你的律所主页/预约页
const LAWYER = '张明';                      // 律师姓名
const FIRM = '某某律师事务所';               // 律所
const CITY = '北京';                        // 执业城市
const FIELD = '劳动争议 · 合同纠纷';         // 专注领域

const masterPrompt = 'Professional, trustworthy poster for a Chinese employment lawyer, clean corporate style, deep blue and warm gold accents, a tidy law office bookshelf and a balance-scale icon, elegant serif Chinese wordmark placeholder for the lawyer name, calm confident mood, plenty of negative space for text, no real faces, no photorealistic person, flat modern editorial illustration, 1:1 square';

const campaign = {
  slug: 'lawyer-services',
  langs: ['zh', 'en'],
  defaultLang: 'zh',
  title: {
    zh: `${LAWYER}律师 · ${FIELD} · 上线宣发`,
    en: `Lawyer ${LAWYER} · Employment & Contract Disputes · Launch`,
  },
  subtitle: {
    zh: `${CITY} · ${FIRM} · 专注${FIELD}，先答疑再委托，按阶段收费`,
    en: `${CITY}-based employment & contract dispute lawyer · free first consult · staged fees`,
  },
  primaryUrl: SITE,
  masterImage: { prompt: masterPrompt, size: '1024x1024' },
  repos: [
    { label: { zh: '预约咨询', en: 'Book a consult' }, url: SITE },
  ],
  platforms: [
    {
      id: 'zhihu', name: '知乎 · 专业回答', region: 'cn', priority: 3,
      how: { zh: '答同领域高热问题 + 发专栏，签名带执业信息', en: 'Answer hot questions in your field + column' },
      submitUrl: 'https://zhuanlan.zhihu.com/write',
      title: { zh: '被公司「协商解除」还能拿到 N+1 吗？一文讲清劳动者能主张什么' },
      text: {
        zh: `我是${LAWYER}，${CITY}执业律师，专注${FIELD}。\n\n很多人被 HR 一句「协商解除」就慌了，其实你能主张的远不止一句"同意"。这篇按真实办案经验讲清楚：\n\n1）协商解除 vs 单方解除：赔偿基数、N / N+1 / 2N 分别什么情形；\n2）哪些证据要在离职前就固定（考勤、工资流水、工作沟通记录）；\n3）常见的三个坑：签了《离职证明》就不能仲裁了吗？竞业限制补偿怎么算？年终奖能不能要回？\n\n先厘清事实再决定要不要维权，别急着签字。评论区可以描述你的情况，我看到会挑典型的答。需要一对一可看主页预约。`,
      },
      tips: { zh: '知乎吃「专业+真实案例+不推销」；先给干货，签名放执业信息即可。' },
    },
    {
      id: 'mp', name: '微信公众号', region: 'cn', priority: 3,
      how: { zh: '发深度普法长文，结尾放预约方式', en: 'Long-form legal explainer, CTA at the end' },
      submitUrl: 'https://mp.weixin.qq.com/',
      title: { zh: '劳动仲裁前，这 5 份证据你固定了吗？（附时间线自查清单）' },
      text: {
        zh: `${FIELD}案件，八成胜负在「证据」而不在「道理」。\n\n作为${CITY}专注劳动争议的律师，我把最常用的自查清单整理出来：\n① 劳动关系证明（合同/工牌/社保）\n② 工资构成与实发流水（区分基本工资与绩效）\n③ 加班与考勤证据（打卡、审批、聊天记录）\n④ 解除/调岗的书面通知与沟通记录\n⑤ 关键对话的合法录音\n\n每一项怎么固定、什么时候固定，文里都写了。收藏起来，真用得上再找专业律师，也能省不少沟通成本。\n\n有具体问题，公众号后台留言或看菜单栏预约咨询。`,
      },
      tips: { zh: '公众号适合系统长文 + 清单；结尾放二维码/预约，别通篇广告。' },
    },
    {
      id: 'xiaohongshu', name: '小红书', region: 'cn', priority: 3, needsImage: true,
      how: { zh: 'creator 后台发，普法避坑清单体，必须配图', en: 'Creator backend; myth-busting list, image required' },
      submitUrl: 'https://creator.xiaohongshu.com/publish/publish', needsImage: true,
      text: {
        zh: `被裁员先别慌😮‍💨 这 4 件事做完再签字\n\n我是${LAWYER}，${CITY}劳动法律师，最近太多人踩坑：\n\n✅ 先问清是「协商解除」还是「无过失辞退」——赔偿差一倍\n✅ 别当场签《离职证明》和《结算确认》，先拍照留证\n✅ 工资流水/考勤/沟通记录，离职前统统导出备份\n✅ 竞业限制有没有补偿？没补偿的可能不用遵守\n\n⚠️ 不是所有情况都要打官司，先厘清事实、算清账，再决定。\n\n评论区说你的情况，我挑典型的回~\n\n#劳动法 #被裁员 #职场维权 #劳动仲裁 #法律科普`,
      },
      tips: { zh: 'emoji 小标题 + ✅清单 + ⚠️提醒；单独一行 tags；配主图。不承诺结果。' },
    },
    {
      id: 'douyin', name: '抖音 · 普法', region: 'cn', priority: 3, needsImage: true,
      how: { zh: 'creator 后台传竖版普法短视频，标题当钩子', en: 'Upload vertical legal-tip short; title is the hook' },
      submitUrl: 'https://creator.douyin.com/', needsImage: true,
      text: { zh: `公司让你「主动离职」千万别答应❗${FIELD}律师提醒：主动辞职拿不到经济补偿，等来的可能不是 N+1 而是 0。3 步教你怎么回应 HR。有类似情况评论区扣个「1」。#劳动法 #法律科普 #职场维权 #被裁员` },
      tips: { zh: '前 3 秒抛冲突钩子；口播干货为主；挂主页预约。规避「一定/包赢」。' },
    },
    {
      id: 'shipinhao', name: '视频号', region: 'cn', priority: 2, needsImage: true,
      how: { zh: '同款普法短视频，导流私域/预约', en: 'Same short video, funnel to private domain' },
      submitUrl: 'https://channels.weixin.qq.com/platform/post/create', needsImage: true, limit: 30,
      title: { zh: '被辞退别急着签字，先做这 3 件事' },
      text: { zh: `${CITY}劳动法律师${LAWYER}｜被辞退先固定证据、算清赔偿、再谈解除。需要一对一看主页预约。#劳动法 #法律科普` },
      tips: { zh: '视频号连微信生态，适合导流公众号/加微信预约。标题 ≤30 字。' },
    },
    {
      id: 'dianping', name: '大众点评', region: 'cn', priority: 2, needsImage: true,
      how: { zh: '完善律所主页信息 + 服务项目 + 案例（脱敏）', en: 'Complete firm profile + services + anonymized cases' },
      submitUrl: 'https://www.dianping.com/', needsImage: true,
      title: { zh: `${FIRM}（${CITY}）· ${LAWYER}律师 · 劳动争议/合同纠纷咨询` },
      text: { zh: `专注${FIELD}，提供劳动仲裁、经济补偿协商、合同审查与纠纷代理。首次咨询先厘清事实与方案，按阶段收费、明码标价。到店/线上均可预约。地址与营业时间见主页。` },
      tips: { zh: '本地获客靠点评主页完整度 + 真实评价；服务项目、收费方式写清楚。' },
    },
    {
      id: 'baidu', name: '百度百家号', region: 'cn', priority: 2,
      how: { zh: '发 SEO 友好的问答式普法文，覆盖搜索长尾', en: 'SEO Q&A legal article for long-tail search' },
      submitUrl: 'https://baijiahao.baidu.com/',
      title: { zh: '2024 劳动仲裁流程怎么走？需要哪些材料？多久出结果？（律师详解）' },
      text: { zh: `很多人搜「劳动仲裁怎么申请」，本文按流程讲清：一、去哪申请（用人单位所在地或劳动合同履行地仲裁委）；二、要交哪些材料（申请书、身份证明、劳动关系与主张的证据）；三、时限（一般 45 天内审结，复杂可延）；四、对裁决不服怎么办。作者：${CITY}${LAWYER}律师，专注${FIELD}。具体个案建议咨询专业律师。` },
      tips: { zh: '百度吃搜索——标题用用户会搜的疑问句，正文结构化答清。' },
    },
    {
      id: 'weibo', name: '微博', region: 'cn', priority: 1, needsImage: true,
      how: { zh: '蹭劳动维权热点，一句话科普 + 话题', en: 'Ride trending topics; one-line tip + hashtag' },
      submitUrl: 'https://service.weibo.com/share/share.php?title={text}&url={rawurl}', url: SITE, needsImage: true,
      text: { zh: `【提醒】被公司「协商解除」，先别急着签字：搞清是协商还是辞退、固定好工资考勤证据、算清 N 还是 N+1，再谈。${CITY}劳动法律师${LAWYER} #劳动法# #职场维权#` },
      tips: { zh: '一句话 + #话题#，蹭热点普法引流，配主图。' },
    },
    {
      id: 'bilibili', name: 'Bilibili', region: 'cn', priority: 1, needsImage: true,
      how: { zh: '录 3-5 分钟普法讲解，专栏/视频均可', en: '3–5 min legal explainer video/column' },
      submitUrl: 'https://member.bilibili.com/platform/upload/text/edit',
      title: { zh: '劳动仲裁全流程实操：从申请到拿钱，律师一次讲透' },
      text: { zh: `${CITY}${LAWYER}律师，专注${FIELD}。这期把劳动仲裁从「决定要不要打」到「材料怎么准备」「开庭说什么」「拿到裁决怎么执行」讲一遍。适合正被裁员/欠薪困扰的朋友。个案不同，评论区可留言。` },
      tips: { zh: 'B站适合系统长讲解，转粉率高；封面用主图。' },
    },
    {
      id: 'maimai', name: '脉脉', region: 'cn', priority: 1,
      how: { zh: '职场社区发普法/答疑，触达在职人群与 HR', en: 'Workplace community; reach employees & HR' },
      submitUrl: 'https://maimai.cn/',
      text: { zh: `在职场，最容易被忽略的是「离职那一下」的法律动作。作为${CITY}专注${FIELD}的律师，常见三类问题：协商解除的赔偿、竞业限制的效力、年终奖与提成的归属。有相关困惑可在评论描述，我尽量给方向。` },
      tips: { zh: '脉脉是职场人群，讲实务、给方向，不硬广。' },
    },
    {
      id: 'linkedin', name: 'LinkedIn', region: 'intl', priority: 1,
      how: { zh: '涉外/外企劳动法业务，英文职业化表达', en: 'Cross-border / foreign-company employment law' },
      submitUrl: 'https://www.linkedin.com/feed/?shareActive=true',
      text: {
        en: `I'm ${LAWYER}, an employment & contract disputes lawyer based in ${CITY}, China. I help employees and foreign companies navigate terminations, severance, non-compete clauses and labor arbitration under PRC law. First consultation focuses on clarifying the facts and options before any engagement; fees are staged and transparent. Happy to connect with HR leaders and expats who need a clear read on Chinese employment law. ${SITE}`,
        zh: `我是${LAWYER}，${CITY}执业律师，专注${FIELD}，服务劳动者与外企，处理解除、经济补偿、竞业限制与劳动仲裁。首次咨询先厘清事实与方案，按阶段收费、透明。${SITE}`,
      },
      tips: { zh: '面向外企 HR / 在华外籍人士，英文表达，突出「PRC labor law」。' },
    },
    {
      id: 'googlebiz', name: 'Google Business', region: 'intl', priority: 1, needsImage: true,
      how: { zh: '完善本地商户资料 + 发 Post，做本地 SEO', en: 'Complete profile + Post for local SEO' },
      submitUrl: 'https://business.google.com/posts', needsImage: true, limit: 1500,
      text: {
        en: `${FIRM} — Employment & Contract Disputes Lawyer in ${CITY}. Services: labor arbitration, severance negotiation, non-compete review, contract disputes. Free first consultation to clarify your situation. Book online or visit our office. ${SITE}`,
        zh: `${FIRM} · ${CITY}劳动争议与合同纠纷律师。服务：劳动仲裁、经济补偿协商、竞业限制审查、合同纠纷。首次咨询免费厘清情况。线上预约或到所。${SITE}`,
      },
      tips: { zh: '本地 SEO：资料填全（地址/电话/时间/照片），定期发 Post。' },
    },
  ],
};

const out = resolve(here, 'lawyer-services.json');
writeFileSync(out, JSON.stringify(campaign, null, 2), 'utf8');
console.log('wrote', out, '·', campaign.platforms.length, 'platforms ·', campaign.langs.join('/'));
