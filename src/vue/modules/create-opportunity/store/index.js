import { types } from './types'
import { api } from '@/api'
import { AssetRecord } from '../wrappers/asset.record'

export const state = {
  assets: [],
  pairs: [],
}

export const mutations = {
  [types.SET_ASSETS] (state, assets) {
    state.assets = assets
  },
  [types.SET_BASE_ASSETS_PAIRS_BY_STATS_QUOTE_ASSET] (state, pairs) {
    state.pairs = pairs
  },
}

export const actions = {
  async [types.LOAD_KV_KYC_REQUIRED] ({ commit, getters }) {
    const { data } = await api().get('/v3/key_values/asset_type:kyc_required')
    return data.value.u32
  },
  async [types.LOAD_ASSETS] ({ commit, getters }) {
    let response = await api().get('/v3/assets')
    let assets = response.data
    while (response.data.length) {
      response = await response.fetchNext()
      assets = [...assets, ...response.data]
    }

    commit(types.SET_ASSETS, assets.map(a => new AssetRecord(a)))
  },
  async [types.LOAD_BLOB_ID] ({ commit }, data) {
    const response = await api()
      .postWithSignature('/blobs', {
        data: data,
      })
    return response.data.id
  },
  async [types.LOAD_BASE_ASSETS_PAIRS_BY_STATS_QUOTE_ASSET] (
    { commit, getters }
  ) {
    const { data } = await api().get('/v3/asset_pairs', {
      filter: {
        quote_asset: getters[types.statsQuoteAsset].code,
      },
    })
    commit(types.SET_BASE_ASSETS_PAIRS_BY_STATS_QUOTE_ASSET, data)
  },
}

export const getters = {
  [types.assets]: state => state.assets,
  [types.baseAssets]: state => state.assets.filter(item => item.isBaseAsset),
  [types.statsQuoteAsset]: state =>
    state.assets.find(item => item.isStatsQuoteAsset),
  [types.pairs]: state => state.pairs,
}

export const createAssetSaleModule = {
  name: 'create-opportunity',
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
