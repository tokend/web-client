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

/**
 * @param {Response} response - response from API
 *
 * @returns {Array} - data from API response
 */
export async function loadingDataViaLoop (response) {
  let data = response.data
  while (response.data.length) {
    response = await response.fetchNext()
    data = [...data, ...response.data]
  }
  return data
}
