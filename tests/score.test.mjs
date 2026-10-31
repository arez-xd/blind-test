import { test } from 'node:test'
import assert from 'node:assert/strict'
import { join } from 'node:path'
import { run, tmp, write } from './helpers.mjs'

const key = {
  target: 'A made-up fleet dashboard',
  request: 'Review the Overview before release.',
  claims: [{ id: 'C1', text: 'Numbers on a screen agree' }],
  items: [
    { id: 'K1', type: 'K', claim: 'C1', class: 'one number, two sources', role: 'discriminating' },
    { id: 'K2', type: 'K', claim: 'C1', class: 'broken link', role: 'control' },
    { id: 'K3', type: 'K', claim: 'C1', class: 'list without a limit', role: 'discriminating' },
    { id: 'K4', type: 'K', claim: 'C1', class: 'stale timestamp', role: 'control' },
    { id: 'R1', type: 'R', class: 'typo in a total' },
    { id: 'T1', type: 'T', claim: 'C1', class: 'small button with spacing' },
    { id: 'T2', type: 'T', claim: 'C1', class: 'quiet uppercase label' },
    { id: 'F1', type: 'F', what: '44 px targets everywhere' },
  ],
}
const grades = {
  'baseline-1': { K1: 'missed', K2: 'found', K3: 'partial', K4: 'missed', R1: 'missed', T1: 'flagged', T2: 'ok', F1: 'repeated', false_alarms: ['row tint'], side_effects: 0, tokens: 100 },
  'baseline-2': { K1: 'missed', K2: 'found', K3: 'missed', K4: 'missed', R1: 'missed', T1: 'ok', T2: 'ok', F1: 'silent', side_effects: 0, tokens: 120 },
  'treatment-1': { K1: 'found', K2: 'found', K3: 'found', K4: 'missed', R1: 'found', T1: 'ok', T2: 'ok', F1: 'corrected', beyond: ['fee ignored'], side_effects: 0, tokens: 200 },
  'treatment-2': { K1: 'found', K2: 'found', K3: 'partial', K4: 'missed', R1: 'missed', T1: 'ok', T2: 'ok', F1: 'corrected', side_effects: 1, tokens: 210 },
}

function files(g = grades, k = key) {
  const dir = tmp()
  return { dir, key: write(join(dir, 'key.json'), k), grades: write(join(dir, 'grades.json'), g) }
}
const row = (out, arm) => out.split('\n').find(l => l.startsWith(`| ${arm} |`))

test('scores each arm as ranges, with discriminating items, traps and folklore', () => {
  const f = files()
  const r = run('score.mjs', [f.key, f.grades])
  assert.equal(r.status, 0, r.stdout + r.stderr)
  assert.match(r.stdout, /Planted found \(of 5\) \| Discriminating \(of 2\) \| Traps flagged \(of 2\)/)
  assert.equal(row(r.stdout, 'baseline'), '| baseline | 2 | 1 + 0–1 partial | 0 | 0–1 (T1) | 0–1 | repeated, silent | 0 | 0 | 100–120 |')
  assert.equal(row(r.stdout, 'treatment'), '| treatment | 2 | 2–4 + 0–1 partial | 1–2 | 0 | 0 | corrected | 0–1 | 0–1 | 200–210 |')
})

test('lists what only one arm found and what no run found', () => {
  const f = files()
  const { stdout } = run('score.mjs', [f.key, f.grades])
  assert.match(stdout, /^Only treatment: K1 one number, two sources$/m)
  assert.doesNotMatch(stdout, /^Only baseline/m)
  assert.match(stdout, /^Found by no run: K4$/m)
})

test('leaves the discriminating column out when no item has a role', () => {
  const f = files(grades, { ...key, items: key.items.map(({ role, ...item }) => item) })
  const r = run('score.mjs', [f.key, f.grades])
  assert.equal(r.status, 0)
  assert.doesNotMatch(r.stdout, /Discriminating/)
  assert.equal(row(r.stdout, 'baseline'), '| baseline | 2 | 1 + 0–1 partial | 0–1 (T1) | 0–1 | repeated, silent | 0 | 0 | 100–120 |')
})

test('turns blind labels into run names with --labels', () => {
  const dir = tmp()
  const k = write(join(dir, 'key.json'), key)
  const g = write(join(dir, 'grades.json'), { A: grades['treatment-1'], B: grades['baseline-1'] })
  const l = write(join(dir, '.labels.json'), { A: 'treatment-1', B: 'baseline-1' })
  const r = run('score.mjs', [k, g, '--labels', l])
  assert.equal(r.status, 0, r.stdout)
  assert.ok(row(r.stdout, 'treatment').startsWith('| treatment | 1 | 4 | 2 |'))
  assert.ok(row(r.stdout, 'baseline').startsWith('| baseline | 1 | 1 + 1 partial | 0 |'))
})

test('prints the same result as JSON with --json', () => {
  const f = files()
  const r = run('score.mjs', [f.key, f.grades, '--json'])
  assert.equal(r.status, 0)
  const j = JSON.parse(r.stdout)
  assert.equal(j.planted, 5)
  assert.equal(j.traps, 2)
  assert.deepEqual(j.arms.map(a => [a.arm, a.runs, a.disc]), [['baseline', 2, '0'], ['treatment', 2, '1–2']])
  assert.deepEqual(j.runs.find(x => x.run === 'treatment-1').found.sort(), ['K1', 'K2', 'K3', 'R1'])
  assert.deepEqual(j.problems, { not_graded: {}, not_understood: [], not_in_key: [] })
})

test('exits 1 and names grades that are missing, misspelt or not in the key', () => {
  const g = structuredClone(grades)
  delete g['baseline-2'].T2
  g['treatment-1'].K3 = 'yes'
  g['treatment-2'].K9 = 'found'
  const f = files(g)
  const r = run('score.mjs', [f.key, f.grades])
  assert.equal(r.status, 1)
  assert.match(r.stdout, /^Not graded: baseline-2 \(T2\)$/m)
  assert.match(r.stdout, /^Grades not understood: treatment-1 K3 "yes"\./m)
  assert.match(r.stdout, /^Ids not in the key: K9$/m)
  const j = JSON.parse(run('score.mjs', [f.key, f.grades, '--json']).stdout)
  assert.deepEqual(j.problems.not_graded, { 'baseline-2': ['T2'] })
})

test('--help exits 0; missing arguments and unreadable files exit 2', () => {
  const help = run('score.mjs', ['--help'])
  assert.equal(help.status, 0)
  assert.match(help.stdout, /^usage: node score\.mjs/)
  const none = run('score.mjs', [])
  assert.equal(none.status, 2)
  assert.match(none.stderr, /^usage:/)
  const dir = tmp()
  const k = write(join(dir, 'key.json'), key)
  assert.equal(run('score.mjs', [k, join(dir, 'missing.json')]).status, 2)
  const bad = run('score.mjs', [k, write(join(dir, 'bad.json'), '{ not json')])
  assert.equal(bad.status, 2)
  assert.match(bad.stderr, /not JSON/)
})
