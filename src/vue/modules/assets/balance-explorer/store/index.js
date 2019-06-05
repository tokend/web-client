import { Asset } from '../../shared/wrappers/asset'

import { api } from '@/api'
import { types } from './types'
import { vuexTypes } from '@/vuex'

export const state = {
  assets: [],
  balances: [],
}

export const mutations = {
  [types.SET_ACCOUNT_BALANCES] (state, balances) {
    state.balances = balances
  },
  [types.SET_ASSETS] (state, assets) {
    state.assets = assets
  },
}

export const actions = {
  async [types.LOAD_ACCOUNT_BALANCES] (
    { commit, rootGetters }, quoteAssetCode
  ) {
    const endpoint = `/v3/accounts/${rootGetters[vuexTypes.accountId]}/converted_balances/${quoteAssetCode}`
    const { data } = await api.getWithSignature(endpoint, {
      include: ['states', 'balance', 'balance.state', 'balance.asset'],
    })

    commit(types.SET_ACCOUNT_BALANCES, data.states.map(s => s.balance))
    commit(types.SET_ASSETS, data.states.map(s => s.balance.asset))
  },
}

export const getters = {
  [types.assets]: state => state.assets
    .map(asset => {
      const balance = state.balances.find(b => b.asset.id === asset.id)
      return new Asset(asset, balance ? balance.state.available : '')
    }),
}

export const balanceExplorerModule = {
  namespaced: true,
  name: 'balance-explorer',
  mutations,
  actions,
  getters,
  state,
}
