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
    for (const [key, value] of envEntries) {
      if (key && !result.hasOwnProperty(key)) {
        result[key] = value
      }
    }
  }
  return result
}


module.exports = load
