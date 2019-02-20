'use strict'
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./base.conf')

const log = require('loglevel')

log.setDefaultLevel('error')

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css?$/,
        loader: 'style-loader!css-loader',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      // to prevent vue of printing hints about the dev tools to the console
      'process.env': { NODE_ENV: '"production"' },
    }),
  ],
})
