// Autopilot playtest: serves the game, opens it in headless Chromium with ?debug, and has autopilot.js fly each sector
// objective to objective. Saves a screenshot at every new area, target, objective and the exit, plus report.json and
// report.md, under out/.
//
//   node playtest.mjs                    sectors 1-3, god mode then combat mode
//   node playtest.mjs --sectors 4-6 --modes god
//   node playtest.mjs --sectors 2 --modes combat --out out/run2
//   node playtest.mjs --sectors 1-36 --modes god --every 5   a picture every 5 seconds of flight as well
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const here = dirname(fileURLToPath(import.meta.url)), root = resolve(here, '..', '..');
const arg = (name, fallback) => { const i = process.argv.indexOf(`--${name}`); return i > 0 ? process.argv[i + 1] : fallback; };
const [from, to = from] = arg('sectors', '1-3').split('-').map(Number);
const modes = arg('modes', 'god,combat').split(',');
const out = resolve(here, arg('out', 'out'));
const limit = Number(arg('limit', 900));
const every = Number(arg('every', 30)); // seconds of flight between routine screenshots

// A plain static server for the repo, so the game loads over http.
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png' };
const server = createServer(async (req, res) => {
  const path = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  let body;
  try { body = await readFile(path); } catch { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[extname(path)] || 'application/octet-stream' }); res.end(body);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

// Playwright's own Chromium if it matches, else the newest one installed under ms-playwright.
async function chromePath() {
  if (process.env.CHROME) return process.env.CHROME;
  const base = join(homedir(), 'AppData', 'Local', 'ms-playwright');
  if (!existsSync(base)) return undefined;
  const builds = (await readdir(base)).filter(d => /^chromium-\d+$/.test(d)).sort((a, b) => +b.split('-')[1] - +a.split('-')[1]);
  for (const b of builds) for (const exe of [join(base, b, 'chrome-win64', 'chrome.exe'), join(base, b, 'chrome-win', 'chrome.exe')]) if (existsSync(exe)) return exe;
}
const browser = await chromium.launch({ executablePath: await chromePath(), args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (m.type() === 'error' && !m.text().startsWith('Failed to load resource')) errors.push(m.text()); });
page.on('response', r => { if (r.status() >= 400 && !r.url().endsWith('favicon.ico')) errors.push(`${r.status()} ${r.url()}`); });
await page.goto(`http://127.0.0.1:${port}/index.html?debug`);
await page.waitForFunction(() => window.radix && window.radix.level, null, { timeout: 60000 });
await page.waitForTimeout(2500);
await page.addScriptTag({ content: await readFile(join(here, 'autopilot.js'), 'utf8') });
const gl = await page.evaluate(() => { const c = document.querySelector('canvas'), g = c.getContext('webgl2'); const x = g && g.getExtension('WEBGL_debug_renderer_info'); return x ? g.getParameter(x.UNMASKED_RENDERER_WEBGL) : 'unknown'; });
console.log(`renderer: ${gl}`);

const frames = () => page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
const reports = [];
for (let sector = from; sector <= to; sector++) for (const mode of modes) {
  const info = await page.evaluate(([i, m]) => window.autopilot.begin(i, m), [sector - 1, mode]);
  const dir = join(out, `${String(sector).padStart(2, '0')}-${info.title.toLowerCase().replace(/\W+/g, '-')}-${mode}`);
  await mkdir(dir, { recursive: true });
  console.log(`\nSector ${sector} ${info.name} ${info.title} (${mode}): ${info.objectives.join(' / ')}`);
  const shots = [];
  const snap = async (entry) => {
    // Combat runs keep only the pictures that matter for difficulty.
    if (mode === 'combat' && !['died', 'stuck', 'exit', 'timeout', 'objective', 'low-hull', 'start'].includes(entry.type)) return;
    await frames();
    const name = `${String(shots.length + 1).padStart(2, '0')}-${entry.type}${entry.name ? '-' + entry.name.toLowerCase().replace(/\W+/g, '-') : ''}.png`;
    await page.screenshot({ path: join(dir, name) });
    shots.push({ file: name, ...entry });
  };
  await snap(info.start);
  const wallStart = Date.now();
  for (;;) {
    const r = await page.evaluate(([l, e]) => window.autopilot.run(30, l, e), [limit, every]);
    if (r.shot) {
      await snap(r);
      const what = r.type === 'zone' ? r.name : r.type === 'target' ? `${r.name} at ${r.gap}m` : r.type === 'objective' ? `done: ${r.completed} (${r.seconds}s)` : r.why || r.lastLeg || '';
      console.log(`  ${String(r.t).padStart(6)}s  ${r.type.padEnd(9)} ${what}  [hull ${r.health} shield ${r.shield}]`);
    }
    if (r.done) break;
    if (Date.now() - wallStart > 20 * 60 * 1000) { console.log('  wall-clock limit'); break; }
  }
  const report = await page.evaluate(() => window.autopilot.report());
  report.sector = sector; report.shots = shots;
  reports.push(report);
  await writeFile(join(dir, 'report.json'), JSON.stringify(report, null, 2));
  console.log(`  => ${report.result} after ${report.seconds}s of flight`);
}

// A readable summary.
const md = ['# Autopilot playtest', '', `Sectors ${from}-${to}, modes ${modes.join(', ')}. Renderer: ${gl}.`, ''];
for (const r of reports) {
  md.push(`## Sector ${r.sector}: ${r.title} (${r.mode})`, '', `Result: **${r.result}** after ${r.seconds}s of flight.`, '', '| Objective | Seconds | Hull lost | Shield lost | |', '|---|---|---|---|---|');
  for (const leg of r.legs) md.push(`| ${leg.goal || 'EXIT'} | ${leg.seconds} | ${leg.hullLost} | ${leg.shieldLost} | ${leg.ended || ''} |`);
  const notes = r.log.filter(e => ['detour', 'stalled', 'no-damage', 'stuck', 'died', 'timeout', 'squeeze'].includes(e.type));
  if (notes.length) { md.push('', 'Notes:'); for (const n of notes) md.push(`- ${n.t}s ${n.type}: ${n.why || n.name || n.toward || ''} at ${n.pos.join(', ')}${n.zone ? ` (${n.zone})` : ''}`); }
  md.push('', 'Screenshots:', ...r.shots.map(s => `- ${s.file}: ${s.type}${s.name ? ' ' + s.name : ''}${s.zone ? ` in ${s.zone}` : ''}, objective ${s.objective + 1}${s.goal ? ` (${s.goal})` : ''}`), '');
}
if (errors.length) md.push('## Page errors', '', ...[...new Set(errors)].slice(0, 20).map(e => `- ${e}`), '');
await writeFile(join(out, 'report.md'), md.join('\n'));
console.log(`\nWrote ${join(out, 'report.md')}${errors.length ? ` (${errors.length} page errors)` : ''}`);
await browser.close(); server.close();
