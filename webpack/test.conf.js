'use strict'
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./base.conf')

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
      // to prevent vue of printing hints about the dev tools to the console
      'process.env': { NODE_ENV: '"production"' },
    }),
  ],
})
