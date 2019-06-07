import { types } from './types'
import { vuexTypes } from '@/vuex'
import { api } from '@/api'

export const state = {
  pairs: [],
}

export const mutations = {
  [types.SET_BASE_ASSETS_PAIRS_BY_STATS_QUOTE_ASSET] (state, pairs) {
    state.pairs = pairs
  },
}

export const actions = {
  async [types.LOAD_KV_KYC_REQUIRED] ({ commit, getters }) {
    const { data } = await api.get('/v3/key_values/asset_type:kyc_required')
    return data.value.u32
  },
  async [types.LOAD_BLOB_ID] ({ commit }, data) {
    const response = await api
      .postWithSignature('/blobs', {
        data: data,
      })
    return response.data.id
  },
  async [types.LOAD_BASE_ASSETS_PAIRS_BY_STATS_QUOTE_ASSET] (
    { commit, rootGetters }
  ) {
    const { data } = await api.get('/v3/asset_pairs', {
      filter: {
        quote_asset: rootGetters[vuexTypes.statsQuoteAsset].code,
      },
    })
    commit(types.SET_BASE_ASSETS_PAIRS_BY_STATS_QUOTE_ASSET, data)
  },
}

export const getters = {
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
