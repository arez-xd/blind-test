import { spawn, spawnSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const root = join(dirname(fileURLToPath(import.meta.url)), '..')
export const script = name => join(root, 'skills', 'blind-test', 'scripts', name)

// Runs a script to the end: { status, stdout, stderr }.
export const run = (name, args = [], options = {}) => spawnSync(process.execPath, [script(name), ...args], { encoding: 'utf8', ...options })

export const tmp = () => mkdtempSync(join(tmpdir(), 'blind-test-'))

export function write(file, data) {
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, typeof data === 'string' ? data : JSON.stringify(data, null, 2))
  return file
}

// Starts target-server.mjs on a free port; resolves once it listens.
export function serve(folder, extra = []) {
  const child = spawn(process.execPath, [script('target-server.mjs'), folder, '--port', '0', ...extra], { stdio: ['ignore', 'pipe', 'pipe'] })
  return new Promise((resolve, reject) => {
    let out = ''
    child.stdout.on('data', d => {
      out += d
      const m = out.match(/http:\/\/127\.0\.0\.1:(\d+)/)
      if (m) resolve({ url: `http://127.0.0.1:${m[1]}`, stop: () => new Promise(r => { child.once('exit', r); child.kill() }) })
    })
    child.once('exit', code => reject(new Error(`target-server exited with ${code}`)))
  })
}
