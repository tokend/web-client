import { ApiCaller } from '@tokend/js-sdk'

let versionPrefix = 'v2'
let _instance = null

/**
 * @param {Wallet} wallet - wallet to sign the requests
 * @param {string} horizonURL - the URL of horizon (without version prefix)
 */
export function initApi (wallet, horizonURL) {
  _instance = ApiCaller.getInstance(`${horizonURL}/${versionPrefix}`)
  _instance.useWallet(wallet)
}

export function api () {
  if (!_instance) {
    throw new Error('API is not initialized')
  }

  return _instance
}
