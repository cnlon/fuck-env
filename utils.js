const fs = require('fs')
const path = require('path')


const root = process.cwd()
const FUCK_ENV_DEFAULT = '.env,package.json'
const EOF = '\n'
const ENV_VALUE_RE = /^(\s*[$\w]+\s*=\s*)(.*)?(\s*)$/
const ENV_PAIR_RE = /^\s*([$\w]+)\s*=\s*(.*)?\s*$/
const LINEFEED_RE = /\\n/gm
const QUOTES_RE = /(^['"]|['"]$)/g


/**
 * Get files from environment variables
 */

function getFiles () {
  const FUCK_ENV = process.env.FUCK_ENV
    || process.env.npm_package_config_FUCK_ENV
    || FUCK_ENV_DEFAULT
  return FUCK_ENV.split(',').map(file => path.resolve(root, file))
}

const entries = function * entries (object) {
  if (!object) {
    return
  }
  const keys = Object.keys(object)
  let key
  while ((key = keys.shift())) {
    yield [key, object[key]]
  }
}

/**
 * Parse an env string into an object
 */

function * parse (raw) {
  for (const line of raw.split(EOF)) {
    const matched = line.match(ENV_PAIR_RE)
    if (matched === null) {
      yield [undefined, undefined, line]
      continue
    }

    const key = matched[1]

    let value = matched[2] || ''
    // Expand newlines in quoted values
    const length = value.length
    if (length !== 0
      && value.charAt(0) === '"'
      && value.charAt(length - 1) === '"'
    ) {
      value = value.replace(LINEFEED_RE, EOF)
    }
    value = value.replace(QUOTES_RE, '')

    yield [key, value, line]
  }
}

function isFilePackage (file) {
  return file.endsWith('package.json')
}

function loadFile (file) {
  return fs.readFileSync(file, 'utf-8')
}

function loadJson (file) {
  return require(file)
}

function prettify (env) {
  const list = []
  for (const key of Object.keys(env)) {
    let value = env[key]
    if (typeof value !== 'string') {
      if (Array.isArray(value)
        || (value !== null && typeof value === 'object')
      ) {
        value = JSON.stringify(value)
      } else {
        value = String(value)
      }
    }
    list.push(`${key}=${value}`)
  }
  list.sort()
  return list.join(EOF)
}


module.exports = {
  root,
  EOF,
  ENV_VALUE_RE,
  getFiles,
  entries,
  parse,
  isFilePackage,
  loadFile,
  loadJson,
  prettify,
}
