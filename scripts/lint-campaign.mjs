#!/usr/bin/env node
// lint-campaign.mjs —— 用 dsh-copy 的分字段平台表检查 campaign 文案长度，构建前拦住「超限」这类错。
//
// 为什么要它：2026-11-11 拿 dsh-broadcast 审自己真实 campaign 时，抓到 X 正文 310>280、
// Hacker News 标题 84>80 两处人类肉眼漏掉的错。这类错不该靠人眼，应该在构建期就红。
//
// 用法：
//   node scripts/lint-campaign.mjs                       # 默认查 campaigns/dsh-geo-audit.json
//   node scripts/lint-campaign.mjs campaigns/foo.json
//   node scripts/lint-campaign.mjs --json                # 机器可读输出
//
// 退出码：0 全过（可能有提醒）/ 1 有超限 / 2 参数或文件错误
// 实现说明：**平台上限不在本文件重复定义**，一律 import 同仓族的 dsh-copy（外壳只转发，禁止复制实现）。
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const COPY_LIB = resolve(here, '../../dsh-namepool/dsh-copy/lib/index.mjs')

// campaign 里的平台 id → dsh-copy 的平台 id（顺序 = 先按 id 精确匹配，再按别名表）
const ALIAS = { hn: 'hackernews', ph: 'producthunt', xhs: 'xiaohongshu', mp: 'wechat', twitter: 'x' }

const args = process.argv.slice(2)
const asJson = args.includes('--json')
const file = resolve(process.cwd(), args.find((a) => !a.startsWith('--')) ?? 'campaigns/dsh-geo-audit.json')

let campaign
try {
  campaign = JSON.parse(readFileSync(file, 'utf8'))
} catch (e) {
  console.error(`✗ 读不到 campaign：${file}（${e.message}）`)
  process.exit(2)
}

let copy
try {
  copy = await import(COPY_LIB)
} catch (e) {
  console.error(`✗ import 不到 dsh-copy：${COPY_LIB}\n  ${e.message}`)
  process.exit(2)
}

const { checkCopy, resolvePlatform, VERIFIED_AT } = copy

const rows = []
const failures = []
const notes = []

// ── GEO 门禁（2026-11-17 加）──────────────────────────────────────────────
// 立项口径：发布板不是流量来源，是 AI 的语料。一份 campaign 缺了这三样，
// 构建能过、也能发出去，但不会被任何 AI 引用 —— 所以在这里挡，而不是在发布后复盘。
// 关掉：--no-geo（只对历史 campaign 用）。
const noGeo = args.includes('--no-geo')
const def = campaign.definition || {}
const facts = Array.isArray(campaign.facts) ? campaign.facts : []
const notDoing = Array.isArray(campaign.notDoing) ? campaign.notDoing : []
const geoRows = [
  { k: 'definition', ok: !!(def.zh || def.en), need: '一句定义句（zh 或 en）',
    got: (def.zh ? 'zh' : '') + (def.en ? (def.zh ? '+en' : 'en') : '') || '—' },
  { k: 'facts', ok: facts.length >= 2, need: '≥2 条可验证数字（体积/耗时/版本/价格）', got: `${facts.length} 条` },
  { k: 'notDoing', ok: notDoing.length >= 1, need: '≥1 条「明确不做什么」', got: `${notDoing.length} 条` },
]
const geoBad = geoRows.filter(r => !r.ok)
if (!noGeo && geoBad.length) {
  failures.push({
    card: 'campaign', field: 'geo',
    actual: geoBad.map(r => r.k).join(','),
    limit: 'definition / facts≥2 / notDoing≥1',
    overBy: `${geoBad.length} 项缺失`,
    metric: 'GEO 四件套',
  })
}

for (const card of campaign.platforms ?? []) {
  if (card.kind === 'note') {
    notes.push({ id: card.id ?? card.title, why: 'kind=note 说明卡，不参与平台长度校验' })
    continue
  }
  const mapped = ALIAS[card.id] ?? card.id
  let platform
  try {
    platform = resolvePlatform(mapped)
  } catch {
    const hint = card.submitUrl ? '（平台表未收录，暂不校验）' : '（没有 submitUrl，应是说明卡；加 kind:"note" 更明确）'
    notes.push({ id: card.id, why: `dsh-copy 未收录平台「${mapped}」，跳过长度校验${hint}` })
    continue
  }
  const input = { platform: mapped }
  if (card.title) input.title = card.title
  if (card.text) input.body = card.text
  if (!input.title && !input.body) {
    notes.push({ id: card.id, why: '没有 title/body，跳过' })
    continue
  }
  const report = checkCopy(input)
  for (const f of report.fields ?? []) {
    const row = {
      card: card.id,
      platform: platform.label ?? mapped,
      field: f.field,
      actual: f.actual,
      limit: f.limit,
      metric: f.metric,
      pass: f.pass,
      overBy: f.overBy,
    }
    rows.push(row)
    if (!f.pass) failures.push(row)
  }
}

const payload = {
  file,
  checkedAt: new Date().toISOString(),
  limitsFrom: `dsh-copy@${copy.VERSION}（表核对日 ${VERIFIED_AT}）`,
  rows,
  failures,
  notes,
}

if (asJson) {
  console.log(JSON.stringify(payload, null, 2))
} else {
  console.log(`campaign 文案体检 · ${file}`)
  console.log(`平台上限来自 ${payload.limitsFrom}`)
  console.log('')
  const w = (s) => String(s ?? '').padEnd(10, ' ')
  for (const r of rows) {
    const mark = r.pass ? '✓' : '✗'
    const limit = r.limit === null ? '未声明' : r.limit
    console.log(`  ${mark} ${w(r.card)} ${w(r.field)} ${String(r.actual).padStart(5)} / ${limit}  ${r.metric}`)
  }
  for (const n of notes) console.log(`  · 跳过 ${w(n.id)} ${n.why}`)
  console.log('')
  console.log('')
  console.log('GEO 四件套（发布板 = AI 的语料，不是流量）' + (noGeo ? '  [--no-geo 已跳过]' : ''))
  for (const r of geoRows) {
    console.log(`  ${r.ok ? '✓' : '✗'} ${r.k.padEnd(11)} ${r.got.padEnd(6)} ${r.need}`)
  }
  if (failures.length) {
    console.log('')
    console.log(`✗ ${failures.length} 处不过：`)
    for (const f of failures) console.log(`   · ${f.card}.${f.field} 超 ${f.overBy}（${f.actual}/${f.limit} ${f.metric}）`)
  } else {
    console.log('✓ 全部在限内，GEO 四件套齐')
  }
}

process.exit(failures.length ? 1 : 0)
