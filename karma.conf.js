const webpackConfig = require('./build/webpack.dev.conf')

module.exports = function (config) {
  config.set({
    autoWatch: false,
    singleRun: true,
    browsers: ['ChromeHeadless'],
    files: [
      'src/**/*.spec.js',
      'src/**/*.e2e.js'
    ],
    preprocessors: {
      'src/**/*.spec.js': [ 'webpack' ],
      'src/**/*.e2e.js': [ 'webpack' ]
    },

    webpack: webpackConfig,
    frameworks: ['mocha', 'sinon', 'chai'],
    reporters: ['progress']
  })
}
