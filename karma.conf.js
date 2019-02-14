const webpackConfig = require('./webpack/test.conf')

module.exports = function (config) {
  // HACK: Chrome relies on this variable, so by overwriting it we can ensure
  // that all the tests related to Date object will be executed in deterministic
  // environment
  process.env.TZ = 'Etc/UTC'

  config.set({
    autoWatch: false,
    singleRun: true,
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox'],
      },
    },
    files: [
      'src/vue/modules/**/*.spec.js',
      // 'src/**/*.e2e.js',
    ],
    preprocessors: {
      'src/**/*.spec.js': [ 'webpack' ],
      // 'src/**/*.e2e.js': [ 'webpack' ],
    },

    webpack: webpackConfig,
    frameworks: ['mocha', 'sinon', 'chai', 'sinon-chai'],
    reporters: ['progress'],
  })
}
