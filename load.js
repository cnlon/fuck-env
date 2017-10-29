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
      if (key && !result.hasOwnProperty(key)) {
        if (value.startsWith('$npm_package_') || value.startsWith('$npm_config_')) {
          value = process.env[value.slice(1)] || ''
        }
        result[key] = value
      }
    }
  }
  return result
}


module.exports = load
