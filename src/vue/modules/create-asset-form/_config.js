import { base } from '@tokend/js-sdk'

export default Object.freeze({
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

  /**
   * Default asset signer for pre-issuance upload
   */
  NULL_ASSET_SIGNER: 'GAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHV4',
})
