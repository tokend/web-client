const merge = require('webpack-merge')
const env = require('./local.env')

module.exports = merge(env, {
  NODE_ENV: '"dev"'
})
