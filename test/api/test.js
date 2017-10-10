require('../../')

const {HOST, PORT, INDEX} = process.env
if (HOST === 'localhost' && PORT === '8000' && INDEX === '/') {
  console.log('✅ api: test passed!')
  process.exit(0)
}
console.error('❌ api: test failed!')
process.exit(1)
