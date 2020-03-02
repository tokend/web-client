import { base } from '@tokend/js-sdk'
import packageJson from '../package.json'

const config = {
}

Object.keys(process.env).forEach(varName => {
  if (varName.startsWith('VUE_APP')) {
    let key = varName.replace('VUE_APP_', '')
    const value = normalize(process.env[varName])
    config[key] = value
  }
})

function normalize (value) {
  if (value === 'true') {
    return true
  }

  if (value === 'false') {
    return false
  }

  return value
}

export default Object.assign(
  {
    /**
     * App name
     */
    APP_NAME: 'TokenD',

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
     * User will be logged out after IDLE_TIMEOUT (minutes) time of
     * inactivity
     */
    IDLE_TIMEOUT: 15,

    /**
     * Data reload interval
     */
    RELOAD_DATA_TICKER_INTERVAL_MS: 10000,

    /**
     * Link to iOS application manifest file. If empty, links for iOS download
     * section will not be shown.
     */
    IOS_MANIFEST_LINK: 'itms-services://?action=download-manifest&url=https://s3-eu-west-1.amazonaws.com/ios-tokend-app/manifest.plist',

    /**
     * Link to android version of mobile client of the application. If empty,
     * links for Android download will not be shown.
     */
    PLAY_MARKET_LINK: 'https://play.google.com/store/apps/details?id=org.tokend.template',

    /**
     * Link for Windows version of offline issuance application. If empty, link
     * for download of the application will not be shown.
     */
    OFFLINE_ISSUANCE_WIN_LINK: 'https://s3-eu-west-1.amazonaws.com/881e65d1943e42/pu/TokenD+pre-issuance+tool-win32-x64.zip',

    /**
     * Link for MacOS version of offline issuance application. If empty, link
     * for download of the application will not be shown.
     */
    OFFLINE_ISSUANCE_MAC_LINK: 'https://s3-eu-west-1.amazonaws.com/881e65d1943e42/pu/TokenD+pre-issuance+tool-darwin-x64.zip',

    /**
     * Link for sources of offline issuance application. If empty, link
     * for sources of the application will not be shown.
     */
    OFFLINE_ISSUANCE_SOURCE_LINK: 'https://github.com/tokend/offline-issuance',

    /**
     * URL of the Sentry DSN. It’s a representation of the configuration
     * required by the Sentry SDKs.
     */
    SENTRY_DSN: '',

    /**
     * Keep session interval
     */
    KEEP_SESSION_INTERVAL: 1000 * 60 * 2,

    /**
     * Sets timeout before reload on some screens. Depends on block close time
     * of your instance configuration, we recommend using value equal to
     * *block close time* + 500ms
     */
    RELOAD_TIMEOUT: 5500,

    /**
     * Session storage key
     */
    STORAGE_KEY: 'TokenDStore-v2',

  },
  // process.env,
  process.env
    ? config
    : process.env,
  document.ENV
    ? config
    : document.ENV,
)
