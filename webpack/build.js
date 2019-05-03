const path = require('path')

const ArgumentParser = require('argparse').ArgumentParser
const parser = new ArgumentParser({ addHelp: true })
parser.addArgument(['--env-file'], {
  metavar: 'ENV_PATH',
  help: 'Path to the env file to use',
  dest: 'envFile',
})
parser.addArgument(['--env-arg'], {
  metavar: 'KEY VALUE',
  action: 'append',
  help: 'Set an env key',
  dest: 'envArgs',
  type: 'string',
  nargs: 2,
})
parser.addArgument(['--set-build-version'], {
  metavar: 'VALUE',
  help: 'Set build version env key. Equivalent to --env-arg BUILD_VERSION [VALUE]',
  type: 'string',
  dest: 'setBuildVersion',
})
parser.addArgument(['--scheme-name'], {
  metavar: 'FILE_PATH',
  help: 'Path to the module file that contains module scheme to use',
  dest: 'schemeName',
})
const args = parser.parseArgs()

let appEnv = {}
function makeEnvArgValue (val) { return `"${val}"` }
if (args.envFile) {
  appEnv = {
    ...appEnv,
    ...require(path.resolve(args.envFile)),
  }
}
if (args.envArgs) {
  appEnv = {
    ...appEnv,
    ...args.envArgs
      .reduce((res, [key, val]) => ({
        ...res,
        ...{ [key]: makeEnvArgValue(val) },
      }), {}),
  }
}
if (args.setBuildVersion) {
  appEnv.BUILD_VERSION = makeEnvArgValue(args.setBuildVersion)
}
if (args.schemeName) {
  appEnv.MODULE_SCHEME_NAME = makeEnvArgValue(args.schemeName)
}

/* eslint-disable-next-line no-console */
console.log(
  'Using the following env config:\n',
  appEnv
)
process.env.APP_ENV_JSON = JSON.stringify(appEnv)

const ora = require('ora')
const rm = require('rimraf')
const chalk = require('chalk')
const webpack = require('webpack')
const webpackConfig = require('./prod.conf')

const spinner = ora('building for production...')

spinner.start()

rm(path.join(path.resolve(__dirname, '../dist'), 'static'), err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()

    if (err) {
      throw err
    }

    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    }) + '\n\n')

    if (stats.hasErrors()) {
      /* eslint-disable-next-line no-console */
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    /* eslint-disable-next-line no-console */
    console.log(chalk.cyan('  Build complete.\n'))
  })
})
