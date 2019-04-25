import { ApiCaller } from '@tokend/js-sdk'

let _api = null

/**
 * @param {Wallet} wallet - wallet to sign the requests
 * @param {String} horizonURL - the url of the horizon server
 * (without version prefix)
 */
export function initApi (wallet = null, horizonURL) {
  _api = ApiCaller.getInstance(horizonURL)
  if (wallet) _api.useWallet(wallet)
}

/**
 * @returns {sdk.ApiCaller}
 */
export function api () {
  if (!_api) {
    throw new Error('API is not initialized')
  }

  return _api
}
