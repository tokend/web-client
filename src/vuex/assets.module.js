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
    for (const asset of newAssets) {
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

    while (pageResponse.data.length === ASSETS_PAGE_LIMIT) {
      pageResponse = await pageResponse.fetchNext()
      assets.push(...pageResponse.data)
    }

    commit(vuexTypes.SET_ASSETS, assets)
  },
}

export const getters = {
  [vuexTypes.assets]: state => state.assets.map(a => new AssetRecord(a)),
  [vuexTypes.assetByCode]: (_, getters) => assetCode =>
    getters[vuexTypes.assets].find(item => item.code === assetCode),

  [vuexTypes.balancesAssets]: (a, getters, b, rootGetters) => {
    return rootGetters[vuexTypes.accountBalances]
      .map(item => item.asset)
  },
  [vuexTypes.fiatAssets]: (a, getters, b, rootGetters) =>
    rootGetters[vuexTypes.accountBalances]
      .map(item => item.asset)
      .filter(item => item.isBaseAsset),
  [vuexTypes.depositableAssets]: (a, getters, b, rootGetters) =>
    rootGetters[vuexTypes.accountBalances]
      .map(item => item.asset)
      .filter(item => item.isDepositable),
  [vuexTypes.coinpaymentsAssets]: (a, getters, b, rootGetters) =>
    rootGetters[vuexTypes.accountBalances]
      .map(item => item.asset)
      .filter(item => item.isCoinpayments),
  [vuexTypes.assetsWithPolicies]: (a, getters, b, rootGetters) => policies => {
    const filteredAssets = rootGetters[vuexTypes.accountBalances]
      .map(item => item.asset)
      .reduce((filteredAssets, asset) => {
        let isPoliciesValid = policies.reduce(function (result, policy) {
          return result && !!(asset.policy & policy)
        }, true)
        if (isPoliciesValid) filteredAssets.push(asset)
        return filteredAssets
      }, [])
    return filteredAssets
  },
}

export default {
  state,
  mutations,
  actions,
  getters,
}
