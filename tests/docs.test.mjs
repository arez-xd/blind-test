import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { root, run } from './helpers.mjs'

const skill = join(root, 'skills', 'blind-test')
const read = p => readFileSync(join(root, p), 'utf8')

test('the self-test example scores as its report says', () => {
  const ex = join(root, 'examples', 'self-test')
  const r = run('score.mjs', [join(ex, 'key.json'), join(ex, 'grades.json'), '--labels', join(ex, 'labels.json')])
  assert.equal(r.status, 0, r.stdout)
  const baseline = /\| baseline \| 2 \| 5–6 \+ 4–5 partial \| 0 \| 0 \|/, treatment = /\| treatment \| 2 \| 13 \| 7 \| 0 \|/
  for (const text of [r.stdout, read('examples/self-test/report.md')]) {
    assert.match(text, baseline)
    assert.match(text, treatment)
  }
})

test('SKILL.md, package.json and the changelog agree on the version', () => {
  const front = read('skills/blind-test/SKILL.md').match(/^---\n([\s\S]*?)\n---/)[1]
  assert.match(front, /^name: blind-test$/m)
  assert.match(front, /^description: .{200,}$/m)
  const version = front.match(/^version: (.+)$/m)[1]
  assert.equal(JSON.parse(read('package.json')).version, version)
  assert.match(read('CHANGELOG.md'), new RegExp(`^## \\[${version.replaceAll('.', '\\.')}\\]`, 'm'))
})

test('every file the skill points to exists', () => {
  const docs = ['SKILL.md', ...readdirSync(join(skill, 'references')).map(f => `references/${f}`)]
  const paths = new Set(docs.flatMap(d => readFileSync(join(skill, d), 'utf8').match(/\b(?:references|scripts|templates)\/[\w.-]+/g) || []).map(p => p.replace(/\.+$/, '')))
  assert.ok(paths.size >= 10, [...paths].join(', '))
  for (const p of paths) assert.ok(existsSync(join(skill, p)), p)
})

test('the JSON in the templates and references parses', () => {
  const template = JSON.parse(read('skills/blind-test/templates/key.template.json'))
  assert.deepEqual([...new Set(template.items.map(i => i.type))], ['K', 'T', 'F'])
  let blocks = 0
  for (const f of readdirSync(join(skill, 'references'))) {
    for (const [, json] of read(`skills/blind-test/references/${f}`).matchAll(/```json\n([\s\S]*?)```/g)) { JSON.parse(json); blocks++ }
  }
  assert.ok(blocks >= 2)
})
