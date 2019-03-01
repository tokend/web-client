import { ApiCaller } from '@tokend/js-sdk'

let _api = null

/**
 * @param {Object} config
 * @param {String} config.horizonURL - the url of the horizon server
 * (without version prefix)
 */
export function initApi (config) {
  const horizonURL = config.horizonURL

  _api = ApiCaller.getInstance(horizonURL)
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
