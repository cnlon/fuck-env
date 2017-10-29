require('../../')

const {NAME, HOST, PORT, INDEX} = process.env
if (NAME === 'api-test-demo'
  && HOST === 'localhost'
  && PORT === '8000'
  && INDEX === '/'
) {
  console.log('✅ api: test passed!')
  process.exit(0)
}
console.error('❌ api: test failed!')
process.exit(1)
