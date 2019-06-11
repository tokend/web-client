import { base } from '@tokend/js-sdk'
import normalizeUrl from 'normalize-url'
import packageJson from '../package.json'

function normalizeEnvUrls (env) {
  let envCopy = Object.assign(env)

  if (envCopy.hasOwnProperty('HORIZON_SERVER')) {
    envCopy.HORIZON_SERVER = normalizeUrl(envCopy.HORIZON_SERVER)
  }
  if (envCopy.hasOwnProperty('FILE_STORAGE')) {
    envCopy.FILE_STORAGE = normalizeUrl(envCopy.FILE_STORAGE)
  }

  return envCopy
}

export default Object.assign(
  {
    /**
     * URL of the Horizon server. The application is going to fetch all the
     * needed network configs from the provided value.
     */
    HORIZON_SERVER: '',

    /**
     * URL of the storage server. Here will be stored pics and other uploadable
     * files.
     */
    FILE_STORAGE: '',

    /**
     * Will skip the email confirmation step during sign up. Instead of the
     * sipped step, the user will be instantly logged in and redirected
     * to the application.
     */
    SKIP_EMAIL_CONFIRMATION_STEP: false,

    /**
     * Sets the logging level, for more options visit
     * https://www.npmjs.com/package/loglevel#documentation
     */
    LOG_LEVEL: 'trace',

    /**
     * Default lower acceptable amount by most input fields. Tends to be
     * dropped one day
     */
    MIN_AMOUNT: String(1 / (base.Operation.ONE || 1000000)),

    /**
     * Default higher acceptable amount by most input fields. Tends to be
     * dropped one day
     */
    MAX_AMOUNT: String(base.Operation.MAX_INT64_AMOUNT),

    // deprecated constants

    /**
     * Default limit of the number of transactions per a page
     */
    TRANSACTIONS_PER_PAGE: 12,

    /**
     * Default limit of the number of requests per a page
     */
    REQUESTS_PER_PAGE: 10,

    /**
     * Default amount precision, the number of digits
     * after a point
     */
    DECIMAL_POINTS: 6,

    /**
     * Default acceptable step for amount change,
     * depends on amount precision
     */
    MINIMAL_NUMBER_INPUT_STEP: 0.000001,

    /**
     * Default asset signer for pre-issuance upload
     */
    NULL_ASSET_SIGNER: 'GAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHV4',

    /**
     * Should be populated by DevOps team during the deployment
     * The field being displayed on login screen.
     */
    BUILD_VERSION: packageJson.version,

    /**
     * User will be logged out after IDLE_TIMEOUT (milliseconds) time of
     * inactivity
     */
    IDLE_TIMEOUT: 1000 * 60 * 15,

    /**
     * Module scheme to use. The module scheme will be used to combine module
     * set of the application.
     */
    MODULE_SCHEME_NAME: 'vanilla',

    /**
     * Data reload interval
     */
    RELOAD_DATA_TICKER_INTERVAL_MS: 10000,

    /**
     * Link to iOS application manifest file.
     */
    IOS_MANIFEST_LINK: 'itms-services://?action=download-manifest&url=https://s3-eu-west-1.amazonaws.com/ios-tokend-app/manifest.plist',

    /**
     * URL of the Sentry DSN. It’s a representation of the configuration
     * required by the Sentry SDKs.
     */
    SENTRY_DSN: '',
  },
  // process.env,
  process.env
    ? Object.assign(process.env, normalizeEnvUrls(process.env))
    : process.env,
  document.ENV
    ? Object.assign(document.ENV, normalizeEnvUrls(document.ENV))
    : document.ENV,
)
