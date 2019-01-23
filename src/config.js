import { base } from '@tokend/js-sdk'

const featureFlags = {
  dashboard: true,
  fees: true,
  issuance: true,
  settings: true,
}

export default Object.assign(
  {
    DEBUG: true,
    HORIZON_SERVER: process.env.HORIZON_SERVER,
    FILE_STORAGE: '',
    NETWORK_PASSPHRASE: '',
    TRANSACTIONS_PER_PAGE: 12,
    REQUESTS_PER_PAGE: 10,
    DECIMAL_POINTS: 6,
    MINIMAL_NUMBER_INPUT_STEP: 0.000001,
    VALIDATE_EMAILS: process.env.NODE_ENV === 'production',
    FEATURE_FLAGS: featureFlags,
    NULL_ASSET_SIGNER: 'GAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHV4',
    LOCAL_STORAGE_KEY: 'tokend-client',
    DEFAULT_QUOTE_ASSET: 'USD',
    DEFAULT_TRADE_PAIRS_RE: [
      // Descending priority
      /BTC.*\/.*ETH/,
      /ETH.*\/.*BTC/,
    ],
    /**
     * Sets the logging level, for more options visit
     * https://www.npmjs.com/package/loglevel#documentation
     *
     */
    LOG_LEVEL: 'trace',
    DEFAULT_CONVERSION_ASSET: 'USD',
    CONVERSION_PRECISION: 2,
    MIN_AMOUNT: String(1 / (base.Operation.ONE || 1000000)),
    MAX_AMOUNT: base.Operation.MAX_INT64_AMOUNT,
  },
  process.env,
  document.ENV
)
