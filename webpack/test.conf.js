// const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./base.conf')

// function resolve (dir) {
//   return path.join(__dirname, '..', dir)
// }

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css?$/,
        loader: 'style-loader!css-loader',
      },
      // {
      //   test: /\.js$/,
      //   loader: 'babel-loader',
      //   include: [resolve('src')],
      // },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      // to prevent vue of printing hints about the dev tools to the console
      'process.env': { NODE_ENV: '"production"' },
    }),
  ],
})
