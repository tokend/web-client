import { ApiCaller, WalletsManager, FactorsManager } from '@tokend/js-sdk'

let _api = null
let _walletsManager = null
let _factorsManager = null

/**
 * @param {Wallet} wallet - wallet to sign the requests
 * @param {String} horizonURL - the url of the horizon server
 * (without version prefix)
 */
export async function initApi (wallet = null, horizonURL) {
  _api = await ApiCaller.getInstanceWithPassphrase(horizonURL)
  if (wallet) _api.useWallet(wallet)
  _walletsManager = new WalletsManager(_api)
  _factorsManager = new FactorsManager(_api)
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

/* ------------------------- */

export function networkDetails () {
  return this.api().networkDetails
}

export function walletsManager () {
  if (!_walletsManager) {
    throw new Error('WalletsManager is not initialized')
  }

  return _walletsManager
}

export function factorsManager () {
  if (!_factorsManager) {
    throw new Error('FactorsManager is not initialized')
  }

  return _factorsManager
}
