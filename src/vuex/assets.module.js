import { vuexTypes } from './types'
import { AssetRecord } from '@/js/records/entities/asset.record'
import { api } from '@/api'

const ASSETS_PAGE_LIMIT = 100

export const state = {
  assets: [],
}

export const mutations = {
  [vuexTypes.SET_ASSETS] (state, assets) {
    state.assets = assets
  },

  [vuexTypes.UPDATE_ASSETS] (state, newAssets) {
    for (const asset in newAssets) {
      const foundIndex = state.assets
        .findIndex(item => item.id === asset.id)

      if (foundIndex !== -1) {
        state.assets[foundIndex] = asset
      }
    }
  },
}

export const actions = {
  async [vuexTypes.LOAD_ASSETS] ({ commit }) {
    let pageResponse
    let assets

    pageResponse = await api.get('/v3/assets', {
      page: { limit: ASSETS_PAGE_LIMIT },
    })
    assets = pageResponse.data

    while (pageResponse.data.length) {
      pageResponse = await pageResponse.fetchNext()
      assets.push(...pageResponse.data)
    }

    commit(vuexTypes.SET_ASSETS, assets)
  },
}

export const getters = {
  [vuexTypes.assets]: state => state.assets.map(a => new AssetRecord(a)),
  [vuexTypes.getAssetByCode]: (_, getters) => assetCode =>
    getters[vuexTypes.assets].find(item => item.code === assetCode),
}

export default {
  state,
  mutations,
  actions,
  getters,
}
