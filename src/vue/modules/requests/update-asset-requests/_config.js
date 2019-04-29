let _config = null

/**
 * @param {string} horizonURL - the URL of the horizon server (without version)
 * @param {string} storageURL - the URL of the storage server
 */
export function initConfig (storageURL) {
  if (!storageURL) {
    throw new Error('storageURL is not provided')
  }

  _config = {
    storageURL,
  }
}

export function config () {
  if (!_config) {
    throw new Error('Config instance is not initialized')
  }

  return _config
}
