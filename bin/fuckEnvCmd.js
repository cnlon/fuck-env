#!/usr/bin/env node
const path = require('path')
const {spawn} = require('cross-spawn')
const load = require('../load')


const ENV_UNIX_RE = /\$(\w+)|\${(\w+)}/g
const ENV_RE = /^(\w+)=(['"]?)(.*)\2$/
const isWin32 = process.platform === 'win32'


module.exports = function fuckEnvCmd (args) {
  const env = {}
  let cmd
  while (args.length) {
    cmd = args.shift()
    const match = ENV_RE.exec(cmd)
    if (!match) {
      break
    }
    const key = match[1]
    const value = match[3]
    env[key] = value
  }
  if (isWin32) {
    cmd = path.normalize(cmd)
    for (const key of Object.keys(env)) {
      env[key] = env[key].replace(ENV_UNIX_RE, '%$1$2%')
    }
  }
  const subprocess = spawn(cmd, args, {
    stdio: 'inherit',
    env: Object.assign({}, process.env, load(), env),
    shell: isWin32
  })
  process.on('SIGTERM', () => subprocess.kill('SIGTERM'))
  process.on('SIGINT', () => subprocess.kill('SIGINT'))
  process.on('SIGBREAK', () => subprocess.kill('SIGBREAK'))
  process.on('SIGHUP', () => subprocess.kill('SIGHUP'))
  subprocess.on('exit', process.exit)
}
