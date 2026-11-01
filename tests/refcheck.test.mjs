import { test } from 'node:test'
import assert from 'node:assert/strict'
import { join } from 'node:path'
import { run, tmp, write } from './helpers.mjs'

const original = `# Review

## Findings

1. The guard is mounted after the router (\`src/routes/index.ts:14\`), see also routes.ts, line 9.
2. The fee uses percent as basis points: cancellation.ts#L30.

## Conventions the change was held to

- Roles are checked at the router (\`src/routes/index.ts:15\`).
`

test('passes a rewrite that keeps every place, with shorter paths', () => {
  const dir = tmp()
  const a = write(join(dir, 'A.md'), original)
  const b = write(join(dir, 'A.normalized.md'), '### 1\n- Places: index.ts:14, routes.ts:9, index.ts:15\n### 2\n- Places: cancellation.ts:30\n')
  const r = run('refcheck.mjs', [a, b])
  assert.equal(r.status, 0, r.stdout + r.stderr)
  assert.match(r.stdout, /A\.md: 4 places in the original, 0 missing/)
})

test('lists each missing place with the heading it sat under', () => {
  const dir = tmp()
  const a = write(join(dir, 'A.md'), original)
  const b = write(join(dir, 'A.normalized.md'), '### 1\n- Places: index.ts:14, routes.ts:9\n### 2\n- Places: cancellation.ts:30\n')
  const r = run('refcheck.mjs', [a, b])
  assert.equal(r.status, 1)
  assert.match(r.stdout, /1 missing from the rewrite/)
  assert.match(r.stdout, /index\.ts:15 {2}under ## Conventions the change was held to/)
})

test('pairs folders by label and reports a result with no rewrite', () => {
  const dir = tmp(), graded = join(dir, 'graded'), norm = join(dir, 'normalized')
  write(join(graded, 'A.md'), 'see app.ts:3')
  write(join(graded, 'B.md'), 'see app.ts:4')
  write(join(graded, 'C.md'), 'see app.ts:5')
  write(join(graded, '.labels.json'), '{}')
  write(join(norm, 'A.normalized.md'), 'app.ts:3')
  write(join(norm, 'B', 'B.md'), 'the original copy, app.ts:4')
  write(join(norm, 'B', 'B.normalized.md'), 'app.ts:4')
  const r = run('refcheck.mjs', [graded, norm])
  assert.equal(r.status, 1)
  assert.match(r.stdout, /A: 1 places in the original, 0 missing/)
  assert.match(r.stdout, /B: 1 places in the original, 0 missing/)
  assert.match(r.stdout, /no rewrite found for: C/)
})

test('explains its usage', () => {
  assert.equal(run('refcheck.mjs', ['--help']).status, 0)
  assert.equal(run('refcheck.mjs', []).status, 2)
  assert.equal(run('refcheck.mjs', [join(tmp(), 'nope.md'), join(tmp(), 'nope2.md')]).status, 2)
})
