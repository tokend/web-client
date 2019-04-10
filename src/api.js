import { ApiCaller } from '@tokend/js-sdk'

const HORIZON_VERSION_PREFIX = 'v3'
const IDENTITIES_PATH = 'identities'

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
   * @param {Wallet} wallet - wallet to sign the requests
   */
  static useWallet (wallet) {
    _api.useWallet(wallet)
  }

  /**
   * @param {String} path - endpoint path for the request
   * @param {Object} [opts] - request options
   *
   * @returns {Promise} - API response
   */
  static getWithSignature (path, opts) {
    return _api.getWithSignature(this._getEndpoint(path), opts)
  }

  /**
   * @param {String} path - endpoint path for the request
   *
   * @returns {String} - endpoint path, containing horizon version
   */
  static _getEndpoint (path) {
    // TODO: refactor it. maked near deadline
    if (path.split('/')[0] !== IDENTITIES_PATH) {
      return `/${HORIZON_VERSION_PREFIX}/${path}`
    } else {
      return `/${path}`
    }
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
