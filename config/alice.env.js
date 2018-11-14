const merge = require('webpack-merge')
const env = require('./default.env')

module.exports = merge(env, {
  NODE_ENV: '"dev"',
  HORIZON_SERVER: '"https://api.alice.tokend.io"',
  FILE_STORAGE: '"https://storage.alice.tokend.io"',
  NETWORK_PASSPHRASE: '"Tokend Alice Network!"'
})
