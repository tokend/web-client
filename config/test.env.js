'use strict'
let merge = require('webpack-merge')
let devEnv = require('./dev-local.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"'
})
