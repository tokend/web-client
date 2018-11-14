import { Service } from './service'
import config from '../../../src/config'

export class ReviewableRequestsService extends Service {
  /**
   * Loads all token creation reviewable requests for current user
   *
   * @return {Promise<object>} - Promise object representing rr
   */
  loadTokensReviewableRequests () {
    return this._horizonRequestBuilder
      .reviewableRequestsHelper()
      .assets()
      .forRequestor(this._accountId)
      .order('desc')
      .limit(config.TRANSACTIONS_PER_PAGE)
      .callWithSignature(this._keypair)
  }

  /**
   * Loads all withdrawal reviewable requests for current user
   *
   * @param opts {Object}
   * @param opts.state {String} – filter requests by state
   *
   * @return {Promise<object>} - Promise object representing rr
   */
  loadWithdrawalsReviewableRequests (opts = {}) {
    return this._horizonRequestBuilder
      .reviewableRequestsHelper()
      .withdrawals()
      .forRequestor(this._accountId)
      .order('desc')
      .forState(opts.state)
      .limit(config.TRANSACTIONS_PER_PAGE)
      .callWithSignature(this._keypair)
  }

  loadLimitsUpdateReviewableRequests () {
    return this._horizonRequestBuilder
      .reviewableRequestsHelper()
      .limits_updates()
      .forRequestor(this._accountId)
      .order('desc')
      .limit(config.TRANSACTIONS_PER_PAGE)
      .callWithSignature(this._keypair)
  }

  /**
   * Loads all update kyc reviewable requests for current user
   *
   * @return {Promise<object>} - Promise object representing rr
   */
  loadKycReviewableRequests () {
    return this._horizonRequestBuilder
      .reviewableRequestsHelper()
      .update_kyc()
      .forRequestor(this._accountId)
      .order('desc')
      .limit(config.TRANSACTIONS_PER_PAGE)
      .callWithSignature(this._keypair)
  }

  /**
   * Loads all preissuance upload requests for current user
   *
   * @return {Promise<object>} - Promise object representing rr
   */
  loadPreIssuanceRequests () {
    return this._horizonRequestBuilder
      .reviewableRequestsHelper()
      .preissuances()
      .forRequestor(this._accountId)
      .order('desc')
      .limit(config.TRANSACTIONS_PER_PAGE)
      .callWithSignature(this._keypair)
  }

  /**
   * Load token creation reviewable request by id
   *
   * @param {string} id - id of reviewable requests
   * @return {Promise<Object>}
   */
  loadReviewableRequestById (id) {
    return this._horizonRequestBuilder.reviewableRequestsHelper()
      .assets()
      .reviewableRequest(id)
      .callWithSignature(this._keypair)
  }

  /**
   * Loads all sales rr for corresponding token code
   * @param {string} code - token code
   * @return {Promise<Object>}
   */
  loadSalesReviewableRequestByTokenCode (code) {
    return this._horizonRequestBuilder.reviewableRequestsHelper()
      .sales()
      .forBaseAsset(code)
      .forRequestor(this._accountId)
      .callWithSignature(this._keypair)
      // eslint-disable-next-line promise/prefer-await-to-then
      .then(response => response.records[0])
  }
}

export const reviewableRequestsService = new ReviewableRequestsService()
