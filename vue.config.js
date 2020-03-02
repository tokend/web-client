const { IgnorePlugin } = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const path = require('path')
const fs = require('fs')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)
const root = path.resolve(__dirname, resolveApp('src'))

module.exports = {
  devServer: {
    port: 8095,
  },
  runtimeCompiler: true,
  transpileDependencies: process.env.NODE_ENV === 'production'
    ? ['marked', 'd3-array', 'd3-scale']
    : ['marked', 'd3-array', 'd3-scale'],
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map',
    plugins: [
      new IgnorePlugin(/ed25519/),
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, resolveApp('static')),
          to: 'static',
          ignore: ['.*'],
        },
      ]),
    ],
    resolve: {
      symlinks: false,
      alias: {
        '@': `${root}/`,
        '@validators': `${root}/validators`,
        '@static': path.resolve(__dirname, resolveApp('static')),
        '@scss': `${root}/scss`,
        '@modules': `${root}/vue/modules`,
        '@test': `${root}/test`,
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        sourceMap: true,
        sourceMapContents: false,
      },
    },
  },

  chainWebpack: config => {
    // Exclude workers to not be parsed by other JS loaders
    config.module.rule('js').exclude.add(/\/workers\/.+\.js$/)

    // Worker loader configuration
    const workerRule = config.module.rule('worker')
    workerRule
      .test(/\/workers\/.+\.js$/)
      .use('worker-loader')
      .loader('worker-loader')
      .options({ inline: true, fallback: false })
      .end()
      .use('babel-loader')
      .loader('babel-loader')

    // Pre-fetching ALL the chunks harms the app performance
    config.plugins.delete('prefetch')

    config.module
      .rule('scss')
      .oneOf('vue')
      .use('resolve-url-loader')
      .loader('resolve-url-loader')
      .before('sass-loader')
      .end()
      .end()
      .oneOf('vue-modules')
      .use('resolve-url-loader')
      .loader('resolve-url-loader')
      .before('sass-loader')
      .end()
      .end()
      .oneOf('normal')
      .use('resolve-url-loader')
      .loader('resolve-url-loader')
      .before('sass-loader')
      .end()
      .end()
      .oneOf('normal-modules')
      .use('resolve-url-loader')
      .loader('resolve-url-loader')
      .before('sass-loader')
      .end()
      .end()
      .end()
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
  },
}
