#!/usr/bin/env node
// gen-images.mjs — 给 campaign 里带 imagePrompt 的平台卡自动生成配图。
// 调用**用户自己的**生图接口（uking-aigc/gen-image.mjs → 虾盘云 gpt-image-2，key 读 ~/.uking/device.json），
// 生成后把图片路径回填进 campaign JSON 的 platform.image，并重新编译发布台 HTML。
// 用法: node gen-images.mjs <campaign.json> <发布台.html 输出路径> [--only id1,id2]
// 图片存到 <html同目录>/<slug>-images/<平台id>.png，HTML 用相对路径引用。
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { homedir } from 'node:os';
import { resolve, dirname, join, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const cfgPath = process.argv[2];
const htmlOut = process.argv[3];
if (!cfgPath || !htmlOut) { console.error('usage: node gen-images.mjs <campaign.json> <out.html> [--only ids]'); process.exit(2); }
const onlyIx = process.argv.indexOf('--only');
const only = onlyIx > -1 ? new Set((process.argv[onlyIx + 1] || '').split(',').map(s => s.trim())) : null;

const GEN = join(homedir(), '.claude', 'skills', 'uking-aigc', 'scripts', 'gen-image.mjs');
if (!existsSync(GEN)) { console.error('找不到生图脚本:', GEN); process.exit(1); }

const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
const htmlDir = dirname(resolve(htmlOut));
const imgDir = join(htmlDir, `${cfg.slug || 'campaign'}-images`);
mkdirSync(imgDir, { recursive: true });

// 生图目标：默认只有 1 张「通配主图」(cfg.masterImage)；
// 只有当某平台确需不同内容时，才在该平台卡上加 imagePrompt，这里会一并生成（多图仅按需）。
const targets = [];
if (cfg.masterImage && cfg.masterImage.prompt && (!only || only.has('master'))) {
  targets.push({ key: 'master', name: '通配主图', prompt: cfg.masterImage.prompt, size: cfg.masterImage.size || '1024x1024',
    apply: rel => { cfg.masterImage.image = rel; } });
}
(cfg.platforms || []).forEach(p => {
  if (p.imagePrompt && (!only || only.has(p.id))) {
    targets.push({ key: p.id, name: p.name, prompt: p.imagePrompt, size: p.imageSize || '1024x1024',
      apply: rel => { p.image = rel; } });
  }
});
if (!targets.length) { console.log('没有需要生图的目标（campaign 无 masterImage、也无 imagePrompt）'); process.exit(0); }
console.log(`要生图 ${targets.length} 张（每张上游需 1~4 分钟）…`);

for (const t of targets) {
  const outPng = join(imgDir, `${t.key}.png`);
  console.log(`▶ ${t.name} (${t.size}) …`);
  const r = spawnSync(process.execPath, [GEN, '--prompt', t.prompt, '--out', outPng, '--size', t.size, '--json'],
    { encoding: 'utf8', timeout: 620000 });
  let ok = false, file = outPng;
  try {
    const line = (r.stdout || '').trim().split('\n').filter(Boolean).pop();
    const j = JSON.parse(line);
    ok = !!j.ok; if (j.file) file = j.file;
  } catch { ok = r.status === 0 && existsSync(outPng); }
  if (ok) {
    if (resolve(file) !== resolve(outPng) && existsSync(file)) { try { copyFileSync(file, outPng); } catch {} }
    t.apply(relative(htmlDir, outPng).split('\\').join('/'));
    console.log(`  ✓ ${t.key}.png`);
  } else {
    console.error(`  ✗ 失败: ${(r.stderr || r.stdout || '').slice(-200)}`);
  }
}

writeFileSync(cfgPath, JSON.stringify(cfg, null, 2), 'utf8');
console.log('回填 campaign JSON 完成，重新编译发布台…');
const selfDir = dirname(fileURLToPath(import.meta.url));
const b = spawnSync(process.execPath, [join(selfDir, 'build-launcher.mjs'), cfgPath, htmlOut], { encoding: 'utf8' });
process.stdout.write(b.stdout || ''); process.stderr.write(b.stderr || '');
console.log('完成。图片目录:', imgDir);
