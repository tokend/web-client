const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const childProcess = require('child_process')

const VERSION = getVersion()

const PACKAGE_JSON = getPackageJson()
const SDK_VERSION = getPackageJsonSdkVersion()
const YARN_LOCK_CONTENT = readFile('../yarn.lock')
const CHANGELOG_MD_CONTENT = readFile('../CHANGELOG.md')

const issuesFound = []

function runAllValidations () {
  if (!VERSION) {
    return reportCheckSkipped()
  }

  validateSemverCompatibility()
  validatePackageJsonVersion()
  validatePackageJsonUseProdSdkVersion()
  validateSdkPulled()
  validateChangelogHasVersion()
  validateChangelogHasVersionOnTop()
  validateChangelogAnchorsLegend()
  report()
}

function validateSemverCompatibility () {
  const semverRe = /^\d+\.\d+\.\d+((-rc|-x)\.\d+)?$/i

  if (!semverRe.test(VERSION)) {
    issuesFound.push(`Version ${VERSION} is not semver compatible`)
  }
}

function validatePackageJsonVersion () {
  if (PACKAGE_JSON.version !== VERSION) {
    issuesFound
      .push(`package.json version should equal ${VERSION}, got ${PACKAGE_JSON.version}`)
  }
}

function validatePackageJsonUseProdSdkVersion () {
  const prodReleaseRe = /^\d+\.\d+\.\d+$/

  if (prodReleaseRe.test(VERSION) && !prodReleaseRe.test(SDK_VERSION)) {
    issuesFound
      .push(`${VERSION} should use prod version of @tokend/js-sdk, got ${SDK_VERSION}`)
  }
}

function validateSdkPulled () {
  console.log('SDK_VERSION')
  console.log(SDK_VERSION)
  const freshSdkVersionRe = new RegExp(`"@tokend/js-sdk@${SDK_VERSION}"`)

  if (!freshSdkVersionRe.test(YARN_LOCK_CONTENT)) {
    issuesFound
      .push('@tokend/js-sdk version of package.json mismatched with the one in yarn.lock')
  }
}

function validateChangelogHasVersion () {
  const todayYmd = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  const releaseTagRe =
    new RegExp(`^## \\[${escapeRe(VERSION)}\\] - ${todayYmd}$`, 'm')

  if (!releaseTagRe.test(CHANGELOG_MD_CONTENT)) {
    issuesFound
      .push(`"## [${VERSION}] - ${todayYmd}" is absent in CHANGELOG.md`)
  }
}

function validateChangelogHasVersionOnTop () {
  const todayYmd = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  const releaseTagIsNotTopRe = new RegExp(
    '## \\[\\d+\\.\\d+\\.\\d+((-rc|-x)\\.\\d+)?\\][\\s\\S]*' + // any other tag
    `## \\[${escapeRe(VERSION)}\\] - ${todayYmd}`, // the new
    'i'
  )

  if (releaseTagIsNotTopRe.test(CHANGELOG_MD_CONTENT)) {
    issuesFound.push(`The ${VERSION} is not the top tag in CHANGELOG.md`)
  }
}

function validateChangelogAnchorsLegend () {
  const baseRepoUrl = 'https://github.com/tokend/web-client'
  const anyReleaseTagRe =
    /## \[\d+\.\d+\.\d+((-rc|-x)\.\d+)?\] - \d{4}-\d{2}-\d{2}/gi

  const expectedAnchorsLegend =
    `[Unreleased]: ${baseRepoUrl}/compare/${VERSION}...HEAD\n` +
    CHANGELOG_MD_CONTENT
      .match(anyReleaseTagRe)
      .map(tag => tag.match(/\[(.*)\]/)[1])
      .map((cur, curId, arr) => {
        return curId === arr.length - 1
          ? `[${cur}]: ${baseRepoUrl}/releases/tag/${cur}`
          : `[${cur}]: ${baseRepoUrl}/compare/${arr[curId + 1]}...${cur}`
      })
      .join('\n')

  if (!CHANGELOG_MD_CONTENT.includes(expectedAnchorsLegend)) {
    issuesFound.push(`The anchors legend is invalid, should be:\n${expectedAnchorsLegend}`)
  }
}

function report () {
  /* eslint-disable no-console */
  if (issuesFound.length) {
    console.error(chalk`{red Release sanity check for {yellow ${VERSION}} failed!}`)

    for (const issue of issuesFound) {
      console.error(chalk`{red ${issue}}`)
    }

    process.exitCode = 1
  } else {
    console.log(chalk`{green Release sanity check for {yellow ${VERSION}} passed}`)
    console.log(chalk`{green Pulled @tokend/js-sdk version: {yellow ${SDK_VERSION}}}`)
  }
  /* eslint-enable no-console */
}

function reportCheckSkipped () {
  /* eslint-disable-next-line no-console */
  console.log(chalk.gray(`No version tag found, skipping release sanity check...`))
}

function getVersion () {
  if (process.argv[2]) {
    return process.argv[2]
  }

  const refsReport = exec('git log -1 --format="%D"').toString()
  const versionMatch = refsReport.match(/tag: ([\w\d\-_.]+)/i)
  return versionMatch ? versionMatch[1] : ''
}

function getPackageJson () {
  const packageJsonPath = path.resolve(__dirname, '../package.json')
  return require(packageJsonPath)
}

function getPackageJsonSdkVersion () {
  const packageJson = getPackageJson()
  const sdkVersion = (packageJson.dependencies || {})['@tokend/js-sdk']
  return sdkVersion || '<ERROR_GETTING_VERSION>'
}

function readFile (relativePath) {
  const resolvedPath = path.resolve(__dirname, relativePath)
  return fs.readFileSync(resolvedPath, 'utf8')
}

function escapeRe (string) {
  return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
}

function exec (command) {
  return childProcess.execSync(command, {
    cwd: path.resolve(__dirname, '..'),
  })
}

runAllValidations()
