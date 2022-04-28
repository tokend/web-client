const UnusedWebpackPlugin = require('unused-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
const fs = require('fs')
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)
const root = path.resolve(__dirname, resolveApp('src'))
const { ArgumentParser } = require('argparse')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

const parser = new ArgumentParser({
  add_help: true,
})

const isTestEnv = process.env.NODE_ENV === 'test'
const isProductionEnv = process.env.NODE_ENV === 'prod'

if (isProductionEnv && !process.env.VUE_APP_BUNDLE_ANALYZER) {
  parser.add_argument('build')
  parser.add_argument('--set-build-version', {
    metavar: 'VALUE',
    help: 'Set build version env key. Equivalent to --env-arg BUILD_VERSION [VALUE]',
    type: 'str',
    dest: 'setBuildVersion',
  })
  const args = parser.parse_args()

  if (args.setBuildVersion) {
    process.env.VUE_APP_BUILD_VERSION = args.setBuildVersion
  }
}

const optionalPlugins = []

if (!isTestEnv) {
  optionalPlugins.push(
    new UnusedWebpackPlugin({
      directories: [path.join(__dirname, 'src')],
      failOnUnused: process.env.NODE_ENV === 'production',
      exclude: ['*.spec.js', '*.e2e.js', '*.md', 'test/*'],
    }),
  )
}

if (process.env.VUE_APP_BUNDLE_ANALYZER === 'true') {
  optionalPlugins.push(new BundleAnalyzerPlugin())
}

module.exports = {
  devServer: {
    port: 8095,
  },
  runtimeCompiler: true,
  transpileDependencies: ['marked', 'd3-array', 'd3-scale'],
  configureWebpack: {
    devtool: isProductionEnv
      ? 'source-map'
      : isTestEnv
        ? 'inline-cheap-module-source-map'
        : 'eval-source-map',
    ...(isTestEnv ? { externals: [nodeExternals({
      allowlist: ['vue-simplemde'],
    })] } : {}),
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, resolveApp('static/images/pre-issuance-guide')),
            to: 'static/images/pre-issuance-guide',
          },
          {
            from: path.resolve(__dirname, resolveApp('static/init-loader')),
            to: 'static/init-loader',
          },
          {
            from: path.resolve(__dirname, resolveApp('static/noscript')),
            to: 'static/noscript',
          },
          {
            from: path.resolve(__dirname, resolveApp('static/branding/favicon.png')),
            to: 'static/branding/favicon.png',
          },
          {
            from: path.resolve(__dirname, resolveApp('static/env.js')),
            to: 'static/env.js',
          },
        ],
      }),
      new NodePolyfillPlugin(),
      ...optionalPlugins,
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

    if (isTestEnv) {
      const scssRule = config.module.rule('scss')
      scssRule.uses.clear()
      scssRule
        .use('null-loader')
        .loader('null-loader')
    } else {
      const moduleTypes = ['vue-modules', 'vue', 'normal-modules', 'normal']
      moduleTypes.forEach(rule => {
        config.module.rule('scss')
          .oneOf(rule)
          .use('resolve-url-loader')
          .loader('resolve-url-loader')
          .before('sass-loader')
          .end()
          .use('sass-loader')
          .loader('sass-loader')
          .tap(options => ({
            ...options,
            sourceMap: true,
          }))
      })
    }
  },
}
