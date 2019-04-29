import { ApiCaller, WalletsManager } from '@tokend/js-sdk'

let _api = null
let _walletsManager = null

export class Api {
  /**
   * @param {Object} config - wallet to sign the requests
   * @param {String} config.horizonURL - the url of the horizon server
   * (without version prefix)
   */
  static async init (config) {
    const horizonURL = config.horizonURL
    _api = await ApiCaller.getInstanceWithPassphrase(horizonURL)
    _walletsManager = new WalletsManager(_api)
  }

  /**
   * @param {Object} config - wallet to sign the requests
   * @param {String} config.horizonURL - the url of the horizon server
   * (without version prefix)
   */
  static initSync (config) {
    _api = ApiCaller.getInstance(config.horizonURL)
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
  static get (path, opts) {
    return _api.get(path, opts)
  }

  /**
   * @param {String} path - endpoint path for the request
   * @param {Object} [opts] - request options
   *
   * @returns {Promise} - API response
   */
  static getWithSignature (path, opts) {
    return _api.getWithSignature(path, opts)
  }

  static get networkDetails () {
    return this.api.networkDetails
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

  /**
   * @returns {sdk.WalletsManager}
   */
  static get walletsManager () {
    if (!_walletsManager) {
      throw new Error('WalletsManager is not initialized')
    }

    return _walletsManager
  }
}
