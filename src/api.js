import { ApiCaller } from '@tokend/js-sdk'

export class Api {
  constructor () {
    this._api = null
  }

  /**
   * @param {Object} config - wallet to sign the requests
   * @param {String} config.horizonURL - the url of the horizon server
   * (without version prefix)
   */
  init (config) {
    const horizonURL = config.horizonURL
    this._api = ApiCaller.getInstance(horizonURL)
  }

  /**
   *
   * @param {Wallet} wallet - wallet to sign the requests
   */
  useWallet (wallet) {
    this._api.useWallet(wallet)
  }

  /**
   * @returns {sdk.ApiCaller}
   */
  get api () {
    if (!this._api) {
      throw new Error('API is not initialized')
    }

    return this._api
  }
}
