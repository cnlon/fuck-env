const {NAME, HOST, PORT, INDEX} = process.env
if (NAME === 'fuck-env-test-demo'
  && HOST === 'localhost'
  && PORT === '8000'
  && INDEX === '/'
) {
  console.log('✅ fuck-env: test passed!')
  process.exit(0)
}
console.error('❌ fuck-env: test failed!')
process.exit(1)
