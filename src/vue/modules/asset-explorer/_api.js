import { ApiCaller } from '@tokend/js-sdk'
import { config } from './_config'

let _instance = null

/**
 * @param {Wallet} wallet - wallet to sign the requests
 */
export function initApi (wallet) {
  const horizonURL = config().horizonURL

  _instance = ApiCaller.getInstance(`${horizonURL}/v2`)
  _instance.useWallet(wallet)
}

export function api () {
  if (!_instance) {
    throw new Error('API is not initialized')
  }

  return _instance
}
