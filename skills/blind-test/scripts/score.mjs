// Scores graded runs against the key and prints a Markdown table per arm. Node 18+.
//   node score.mjs <key.json> <grades.json> [--labels graded/.labels.json] [--json]
// grades.json: { "<label or run>": { "K1": "found|partial|missed", "T1": "flagged|ok", "F1": "corrected|repeated|silent",
//   "beyond": [...], "side_effects": 0, "tokens": 0 } }. With --labels, labels become run names; runs named
// <arm>-<n> are grouped by arm and shown as ranges.
import { readFileSync, existsSync } from 'node:fs'

const args = process.argv.slice(2)
const li = args.indexOf('--labels'), labelsPath = li >= 0 ? args[li + 1] : null
const [keyPath, gradesPath] = args.filter((a, i) => !a.startsWith('--') && (li < 0 || i !== li + 1))
if (!keyPath || !gradesPath || args.includes('--help')) { console.log('usage: node score.mjs <key.json> <grades.json> [--labels .labels.json] [--json]'); process.exit(keyPath && gradesPath ? 0 : 2) }
const read = p => { if (!existsSync(p)) { console.error(`not found: ${p}`); process.exit(2) } try { return JSON.parse(readFileSync(p, 'utf8')) } catch (e) { console.error(`not JSON: ${p} (${e.message})`); process.exit(2) } }
const key = read(keyPath), grades = read(gradesPath), labels = labelsPath ? read(labelsPath) : {}

const items = key.items || []
const K = items.filter(i => i.type === 'K' || i.type === 'R'), T = items.filter(i => i.type === 'T'), F = items.filter(i => i.type === 'F')
const unknown = new Set()
const runs = Object.entries(grades).map(([label, g]) => {
  for (const k of Object.keys(g)) if (!['beyond', 'side_effects', 'tokens', 'notes'].includes(k) && !items.some(i => i.id === k)) unknown.add(k)
  const val = { found: 1, partial: 0.5, missed: 0 }
  const missing = [...K, ...T].filter(i => g[i.id] === undefined).map(i => i.id)
  return {
    run: labels[label] || label,
    planted: K.reduce((s, i) => s + (val[g[i.id]] ?? 0), 0),
    partial: K.filter(i => g[i.id] === 'partial').length,
    found: new Set(K.filter(i => g[i.id] === 'found').map(i => i.id)),
    traps: T.filter(i => g[i.id] === 'flagged').map(i => i.id),
    folklore: F.map(i => g[i.id] || 'silent'),
    beyond: (g.beyond || []).length, side: g.side_effects ?? null, tokens: g.tokens ?? null, missing,
  }
})
const arm = r => r.run.replace(/[-_ ]?\d+$/, '')
const arms = [...new Set(runs.map(arm))]
const range = xs => { const v = xs.filter(x => x !== null && x !== undefined); if (!v.length) return '—'; const lo = Math.min(...v), hi = Math.max(...v); return lo === hi ? String(lo) : `${lo}–${hi}` }
const rows = arms.map(a => {
  const rs = runs.filter(r => arm(r) === a)
  const part = rs.map(r => r.partial)
  return { arm: a, runs: rs.length, planted: range(rs.map(r => r.found.size)) + (part.some(Boolean) ? ` + ${range(part)} partial` : ''), score: range(rs.map(r => r.planted)), traps: range(rs.map(r => r.traps.length)),
    folklore: [...new Set(rs.flatMap(r => r.folklore))].join(', ') || '—', beyond: range(rs.map(r => r.beyond)),
    side: range(rs.map(r => r.side)), tokens: range(rs.map(r => r.tokens)), found: rs.map(r => r.found), trapIds: [...new Set(rs.flatMap(r => r.traps))] }
})

if (args.includes('--json')) { console.log(JSON.stringify({ planted: K.length, traps: T.length, runs, arms: rows.map(({ found, ...r }) => r) }, (k, v) => v instanceof Set ? [...v] : v, 2)); process.exit(0) }

console.log(`| Arm | Runs | Planted found (of ${K.length}) | Traps flagged (of ${T.length}) | Folklore | Beyond the key | Side effects | Tokens |`)
console.log('|---|---|---|---|---|---|---|---|')
for (const r of rows) console.log(`| ${r.arm} | ${r.runs} | ${r.planted} | ${r.traps}${r.trapIds.length ? ' (' + r.trapIds.join(', ') + ')' : ''} | ${r.folklore} | ${r.beyond} | ${r.side} | ${r.tokens} |`)

// Planted items every run of one arm found and no run of any other arm did.
if (rows.length > 1) {
  console.log('')
  for (const r of rows) {
    const always = K.filter(i => r.found.every(s => s.has(i.id)))
    const only = always.filter(i => rows.every(o => o === r || o.found.every(s => !s.has(i.id))))
    if (only.length) console.log(`Only ${r.arm}: ${only.map(i => `${i.id} ${i.class || ''}`.trim()).join('; ')}`)
  }
  const none = K.filter(i => rows.every(r => r.found.every(s => !s.has(i.id))))
  if (none.length) console.log(`Found by no run: ${none.map(i => i.id).join(', ')}`)
}
const gaps = runs.filter(r => r.missing.length)
if (gaps.length) console.log(`\nNot graded: ${gaps.map(r => `${r.run} (${r.missing.join(', ')})`).join('; ')}`)
if (unknown.size) console.log(`Ids not in the key: ${[...unknown].join(', ')}`)
