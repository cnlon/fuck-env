const {HOST, PORT, INDEX} = process.env
if (HOST === 'localhost' && PORT === '8000' && INDEX === '/') {
  console.log('✅ fuck-env: test passed!')
  process.exit(0)
}
console.error('❌ fuck-env: test failed!')
process.exit(1)
