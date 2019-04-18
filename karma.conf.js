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
      'test/disallow-console-calls.js',
      'src/**/*.spec.js',
      'src/**/*.e2e.js',
    ],
    preprocessors: {
      'test/disallow-console-calls.js': ['webpack'],
      'src/**/*.spec.js': [ 'webpack' ],
      'src/**/*.e2e.js': [ 'webpack' ],
    },

    webpack: webpackConfig,
    frameworks: ['mocha', 'sinon', 'chai', 'sinon-chai'],
    reporters: ['spec'],
    captureTimeout: 210000,
    browserDisconnectTolerance: 3, 
    browserDisconnectTimeout : 210000,
    browserNoActivityTimeout : 210000,
  })
}
