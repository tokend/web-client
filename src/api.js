import { ApiCaller } from '@tokend/js-sdk'

const HORIZON_VERSION_PREFIX = 'v3'

let _api = null

export class Api {
  /**
   * @param {Object} config - wallet to sign the requests
   * @param {String} config.horizonURL - the url of the horizon server
   * (without version prefix)
   */
  static init (config) {
    const horizonURL = config.horizonURL
    _api = ApiCaller.getInstance(horizonURL)
  }

  /**
   *
   * @param {Wallet} wallet - wallet to sign the requests
   */
  static useWallet (wallet) {
    _api.useWallet(wallet)
  }

  static getWithSignature (endpoint) {
    return _api.getWithSignature(this._getEndpoint(endpoint))
  }

  static _getEndpoint (path) {
    return `/${HORIZON_VERSION_PREFIX}/${path}`
  }

  /**
   * @returns {sdk.ApiCaller}
   */
  static get api () {
    if (!_api) {
      throw new Error('API is not initialized')
    }

    return _api
  }
}
