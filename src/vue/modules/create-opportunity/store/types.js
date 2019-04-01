const actions = {
  LOAD_KV_KYC_REQUIRED: 'LOAD_KV_KYC_REQUIRED',
  LOAD_BLOB_ID: 'LOAD_BLOB_ID',
  LOAD_ASSETS: 'LOAD_ASSETS',
  LOAD_BASE_ASSETS_PAIRS_BY_STATS_QUOTE_ASSET: 'LOAD_BASE_ASSETS_PAIRS_BY_STATS_QUOTE_ASSET',
}
const mutations = {
  SET_ASSETS: 'SET_ASSETS',
  SET_BASE_ASSETS_PAIRS_BY_STATS_QUOTE_ASSET: 'SET_BASE_ASSETS_PAIRS_BY_STATS_QUOTE_ASSET',
}

const getters = {
  assets: 'assets',
  pairs: 'pairs',
  baseAssets: 'baseAssets',
  statsQuoteAsset: 'statsQuoteAsset',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
