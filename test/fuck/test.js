const {execSync} = require('child_process')


const toTest = [
  {
    cmd: 'fuck',
    output: `HOST=localhost
INDEX=/
PORT=8000
`
  }, {
    cmd: 'fuck get INDEX',
    output: `INDEX=/
`
  }, {
    cmd: 'fuck set INDEX /www/index.html && fuck get INDEX',
    output: `INDEX=/www/index.html
`
  }, {
    cmd: 'fuck edit INDEX /index.html && fuck get INDEX',
    output: `INDEX=/index.html
`
  }, {
    cmd: 'fuck delete INDEX && fuck get INDEX',
    output: `INDEX=/
`
  }
]

let pass = true
for (const {cmd, output} of toTest) {
  if (execSync(cmd, {encoding: 'utf-8'}) !== output) {
    console.warn('fuck:', '`' + cmd + '` failed!')
    pass = false
  }
}

if (pass) {
  console.log('✅ fuck: test passed!')
  process.exit(0)
} else {
  console.error('❌ fuck: test failed!')
}
