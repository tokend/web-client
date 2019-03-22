import { ApiCaller } from '@tokend/js-sdk'

let _api = null

/**
 * @param {Wallet} wallet - wallet to sign the requests
 * @param {Wallet} config - wallet to sign the requests
 * @param {Wallet} config.horizonURL - the url of the horizon server
 * (without version prefix)
 */
export function initApi (wallet, config) {
  const horizonURL = config.horizonURL

  _api = ApiCaller.getInstance(horizonURL)
  _api.useWallet(wallet)
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
