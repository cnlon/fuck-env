const load = require('./load')


function fuck (...files) {
  const result = load(...files)
  for (const key of Object.keys(result)) {
    if (process.env.hasOwnProperty(key)) {
      continue
    }
    process.env[key] = result[key]
  }
  return result
}


module.exports = fuck
