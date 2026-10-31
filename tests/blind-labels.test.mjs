import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { run, tmp, write } from './helpers.mjs'

function runsFolder() {
  const dir = tmp(), runs = join(dir, 'runs')
  write(join(runs, 'baseline-1', 'review.md'), 'b1')
  write(join(runs, 'treatment-1', 'review.md'), 't1')
  write(join(runs, 'treatment-2', 'review.html'), '<p>t2</p>')
  write(join(runs, 'notes-only', 'a.md'), 'a')
  write(join(runs, 'notes-only', 'b.md'), 'b')
  write(join(runs, '.cache', 'x.md'), 'x')
  write(join(runs, 'stray.md'), 'a file next to the runs')
  return { runs, out: join(dir, 'graded') }
}
const labels = out => JSON.parse(readFileSync(join(out, '.labels.json'), 'utf8'))

test('copies each result under a label and keeps the map in .labels.json', () => {
  const { runs, out } = runsFolder()
  const r = run('blind-labels.mjs', [runs, out])
  assert.equal(r.status, 0, r.stderr)
  const map = labels(out)
  assert.deepEqual(Object.keys(map).sort(), ['A', 'B', 'C'])
  assert.deepEqual(Object.values(map).sort(), ['baseline-1', 'treatment-1', 'treatment-2'])
  const content = { 'baseline-1': 'b1', 'treatment-1': 't1', 'treatment-2': '<p>t2</p>' }
  for (const [label, name] of Object.entries(map)) {
    const ext = name === 'treatment-2' ? '.html' : '.md'
    assert.equal(readFileSync(join(out, label + ext), 'utf8'), content[name])
  }
  assert.equal(readdirSync(out).filter(f => !f.startsWith('.')).length, 3)
  assert.match(r.stdout, /skipped \(no single result file\): notes-only/)
  assert.doesNotMatch(r.stdout, /\.cache/)
})

test('takes the named file with --file', () => {
  const dir = tmp(), runs = join(dir, 'runs'), out = join(dir, 'graded')
  write(join(runs, 'baseline-1', 'review.md'), 'b1')
  write(join(runs, 'baseline-1', 'log.txt'), 'log')
  write(join(runs, 'treatment-1', 'review.md'), 't1')
  write(join(runs, 'treatment-1', 'notes.md'), 'notes')
  assert.equal(run('blind-labels.mjs', [runs, out, '--file', 'review.md']).status, 0)
  for (const [label, name] of Object.entries(labels(out))) {
    assert.equal(readFileSync(join(out, label + '.md'), 'utf8'), name === 'baseline-1' ? 'b1' : 't1')
  }
})

test('goes on past Z with AA, AB', () => {
  const dir = tmp(), runs = join(dir, 'runs'), out = join(dir, 'graded')
  for (let i = 1; i <= 28; i++) write(join(runs, `run-${i}`, 'review.md'), String(i))
  assert.equal(run('blind-labels.mjs', [runs, out]).status, 0)
  const names = Object.keys(labels(out))
  assert.equal(names.length, 28)
  assert.deepEqual(names.slice(24), ['Y', 'Z', 'AA', 'AB'])
  assert.ok(existsSync(join(out, 'AB.md')))
})

test('refuses a graded folder that already has a label map', () => {
  const { runs, out } = runsFolder()
  assert.equal(run('blind-labels.mjs', [runs, out]).status, 0)
  const again = run('blind-labels.mjs', [runs, out])
  assert.equal(again.status, 2)
  assert.match(again.stderr, /already has \.labels\.json/)
})

test('exits 1 when no run has a single result; --help 0; usage errors 2', () => {
  const dir = tmp(), runs = join(dir, 'runs')
  write(join(runs, 'r1', 'a.md'), 'a')
  write(join(runs, 'r1', 'b.md'), 'b')
  assert.equal(run('blind-labels.mjs', [runs, join(dir, 'graded')]).status, 1)
  assert.equal(run('blind-labels.mjs', [join(dir, 'missing'), join(dir, 'graded')]).status, 2)
  assert.equal(run('blind-labels.mjs', []).status, 2)
  assert.equal(run('blind-labels.mjs', ['--help']).status, 0)
})
