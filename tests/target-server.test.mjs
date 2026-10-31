import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { createServer } from 'node:net'
import { join } from 'node:path'
import { run, serve, tmp, write } from './helpers.mjs'

let dir, site, server
before(async () => {
  dir = tmp()
  site = join(dir, 'site')
  write(join(site, 'index.html'), '<h1>Home</h1>')
  write(join(site, 'pricing.html'), '<h1>Pricing</h1>')
  write(join(site, 'help', 'index.html'), '<h1>Help</h1>')
  write(join(site, 'app.js'), 'console.log(1)')
  write(join(site, 'key.json'), '{"K1":"planted"}')
  write(join(site, '.env'), 'TOKEN=x')
  write(join(dir, 'site-old', 'notes.txt'), 'outside the target')
  server = await serve(site)
})
after(() => server?.stop())

const get = (path, init) => fetch(server.url + path, init)

test('serves pages, extensionless paths and folders', async () => {
  for (const [path, text] of [['/', 'Home'], ['/pricing', 'Pricing'], ['/help/', 'Help'], ['/help', 'Help']]) {
    const r = await get(path)
    assert.equal(r.status, 200, path)
    assert.match(r.headers.get('content-type'), /text\/html/)
    assert.match(await r.text(), new RegExp(text))
  }
  assert.equal((await get('/app.js')).headers.get('content-type'), 'text/javascript')
})

test('logs every request that would change something and answers 405', async () => {
  const post = await get('/api/signup', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"email":"a@example.com"}' })
  assert.equal(post.status, 405)
  assert.equal((await get('/api/item/7', { method: 'DELETE' })).status, 405)
  const log = readFileSync(join(site, 'posts.log'), 'utf8')
  assert.match(log, /POST \/api\/signup \{"email":"a@example\.com"\}/)
  assert.match(log, /DELETE \/api\/item\/7/)
})

test('answers 404 for missing screens and never serves the key, dotfiles or the log', async () => {
  const missing = await get('/settings')
  assert.equal(missing.status, 404)
  assert.match(await missing.text(), /not part of the demo/)
  assert.ok(existsSync(join(site, 'posts.log')))
  for (const path of ['/key.json', '/.env', '/posts.log']) assert.equal((await get(path)).status, 404, path)
})

test('stays inside the folder, sibling folders with the same prefix included', async () => {
  for (const path of ['/..%2fsite-old/notes.txt', '/%2e%2e/site-old/notes.txt', '/..%2f..%2fetc/hosts']) {
    const r = await get(path)
    assert.equal(r.status, 404, path)
    assert.doesNotMatch(await r.text(), /outside the target/)
  }
})

test('answers HEAD without a body', async () => {
  const r = await get('/', { method: 'HEAD' })
  assert.equal(r.status, 200)
  assert.equal(await r.text(), '')
})

test('keeps running after a malformed URL', async () => {
  assert.equal((await get('/%E0%A4%A')).status, 404)
  assert.equal((await get('/')).status, 200)
})

test('a busy port exits 1; a missing folder, a bad port and no folder exit 2; --help 0', async () => {
  const blocker = createServer().listen(0, '127.0.0.1')
  await new Promise(r => blocker.once('listening', r))
  const busy = run('target-server.mjs', [site, '--port', String(blocker.address().port)], { timeout: 5000 })
  blocker.close()
  assert.equal(busy.status, 1)
  assert.match(busy.stderr, /busy/)
  assert.equal(run('target-server.mjs', [join(dir, 'missing')]).status, 2)
  assert.equal(run('target-server.mjs', [site, '--port', 'abc']).status, 2)
  assert.equal(run('target-server.mjs', []).status, 2)
  assert.equal(run('target-server.mjs', ['--help']).status, 0)
})
