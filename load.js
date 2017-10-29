const {
  getFiles,
  entries,
  parse,
  isFilePackage,
  loadFile,
  loadJson,
} = require('./utils')


function load (...files) {
  if (files.length === 0) {
    files = getFiles()
  }
  const result = {}
  for (const file of files) {
    const isPackage = isFilePackage(file)
    const load = isPackage ? loadJson : loadFile
    let raw
    try {
      raw = load(file)
    } catch (error) {
      continue
    }
    const envEntries = isPackage
      ? entries(raw.config)
      : parse(raw)
    for (let [key, value] of envEntries) {
      if (!key || result.hasOwnProperty(key)) {
        continue
      }
      result[key] = proxy(value)
    }
  }
  return result
}

function proxy (value) {
  if (typeof value !== 'string') {
    return value
  }
  if (!value.startsWith('$npm_package_') && !value.startsWith('$npm_config_')) {
    return value
  }
  const key = value.slice(1)
  if (!process.env.hasOwnProperty(key)) {
    return value
  }
  return process.env[key]
}


module.exports = load
