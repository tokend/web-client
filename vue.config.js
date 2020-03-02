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

    // Merge all the CSS into one file
    config.optimization.splitChunks({
      cacheGroups: {
        default: false,
        styles: {
          name: 'styles',
          test: m => m.constructor.name === 'CssModule',
          chunks: 'all',
          minChunks: 1,
          enforce: true,
        },
      },
    })

    // Embed CSS bundle into <head>
    config.plugin('html-inline-css-webpack-plugin')
      .use(require('html-inline-css-webpack-plugin').default)

    // Remove link to the CSS bundle from <head>
    config.plugin('html-webpack-exclude-assets-plugin')
      .use(require('html-webpack-exclude-assets-plugin'))
    config
      .plugin('html')
      .tap(args => {
        args[0].excludeAssets = [/styles.*.css/]
        return args
      })

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
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
  },
}
