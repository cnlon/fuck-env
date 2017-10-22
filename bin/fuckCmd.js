const fs = require('fs')
const path = require('path')
const load = require('../load')
const {
  EOF,
  ENV_VALUE_RE,
  root,
  getFiles,
  isFilePackage,
  parse,
  loadFile,
  prettify,
} = require('../utils')


const cmds = {
  init (files) {
    if (files.length === 0) {
      files.push('.env')
    }
    for (let file of files) {
      file = path.resolve(root, file)
      if (!fs.existsSync(file)) {
        fs.writeFileSync(file, '')
      }
    }
  },
  get (keys) {
    if (keys.length === 0) {
      return
    }
    const env = load()
    const result = {}
    for (const key of keys) {
      if (env.hasOwnProperty(key)) {
        result[key] = env[key]
      }
    }
    log(result)
  },
  set (pairs) {
    return edit(pairs, true)
  },
  edit (pairs) {
    return edit(pairs, false)
  },
  delete (keys) {
    if (keys.length === 0) {
      return
    }
    const keySet = new Set(keys)
    for (const file of getFiles()) {
      if (isFilePackage(file)) {
        continue
      }
      let raw
      try {
        raw = loadFile(file)
      } catch (error) {
        continue
      }
      const lines = []
      let changed = false
      for (const res of parse(raw)) {
        const key = res[0]
        if (keySet.has(key)) {
          changed = true
          continue
        }
        const line = res[2]
        lines.push(line)
      }
      if (!changed) {
        continue
      }
      const result = lines.join(EOF)
      fs.writeFileSync(file, result)
    }
  },
  list (filters) {
    const env = load()
    const result = filter(env, filters)
    log(result)
  }
}

function log (env) {
  const result = prettify(env)
  if (result) {
    console.log(result)
  }
}

function filter (result, regexpSources) {
  const source = regexpSources.shift()
  if (!source) {
    return result
  }
  const keys = Object.keys(result)
  if (keys.length === 0) {
    return result
  }
  let regexp
  try {
    regexp = new RegExp(source)
  } catch (error) {
    // TODO: Warn invalid regular expressions
    return filter(result, regexpSources)
  }
  const newResult = {}
  for (const key of keys) {
    if (regexp.test(key)) {
      newResult[key] = result[key]
    }
  }
  return filter(newResult, regexpSources)
}

function edit (pairs, toAppend) {
  if (pairs.length === 0) {
    return
  }
  const map = {}
  while (pairs.length) {
    map[pairs.shift()] = pairs.shift() || ''
  }
  let lastFile, lastRaw
  for (const file of getFiles()) {
    if (isFilePackage(file)) {
      continue
    }
    let raw
    try {
      raw = loadFile(file)
    } catch (error) {
      continue
    }

    lastFile = file
    lastRaw = raw

    const lines = []
    let changed = false
    for (const res of parse(raw)) {
      const key = res[0]
      const line = res[2]
      if (!key || !map.hasOwnProperty(key)) {
        lines.push(line)
        continue
      }
      const newLine = line.replace(ENV_VALUE_RE, ($0, $1, $2, $3) => {
        return $1 + map[key] + $3
      })
      lines.push(newLine)
      delete map[key]
      changed = true
    }
    if (!changed) {
      continue
    }
    const result = lines.join(EOF)
    fs.writeFileSync(file, result)
  }
  if (lastFile && toAppend) {
    const lines = []
    for (const key of Object.keys(map)) {
      const line = `${key}=${map[key] || ''}`
      lines.push(line)
    }
    if (lines.length !== 0) {
      const result = lines.join(EOF)
      const content = lastRaw.endsWith(EOF)
        ? lastRaw + result + EOF
        : lastRaw
          ? lastRaw + EOF + result
          : result
      fs.writeFileSync(lastFile, content)
    }
  }
}


module.exports = function fuckCmd (args) {
  const name = args.shift() || 'list'
  const cmd = cmds[name]
  if (!cmd) {
    console.error('Unknown command:', cmd)
    process.exit(1)
  }
  const exitCode = cmd(args) || 0
  process.exit(exitCode)
}
