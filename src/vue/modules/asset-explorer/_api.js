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

  _api = ApiCaller.getInstance(`${horizonURL}/v2`)
  _api.useWallet(wallet)
}

export function api () {
  if (!_api) {
    throw new Error('API is not initialized')
  }

  return _api
}
