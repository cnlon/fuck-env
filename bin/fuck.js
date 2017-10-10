#!/usr/bin/env node
const fuckCmd = require('./fuckCmd')
const args = process.argv.slice(2)
fuckCmd(args)
