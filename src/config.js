import { base } from '@tokend/js-sdk'

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
     * Disables certain features of the application. Set a property to false to
     * restrict usage of the feature by all users of the system
     */
    featureFlags: {
      dashboard: true,
      fees: true,
      trade: true,
      operations: true,
      issuance: true,
      assets: true,
      requests: true,
      settings: true,
      limits: true,
    },

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
  },
  process.env,
  document.ENV
)
