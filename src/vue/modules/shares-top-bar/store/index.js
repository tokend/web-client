import { Balance } from '../wrappers/balance'

import { types } from './types'
import { api } from '@/api'
import { AssetRecord } from '../wrappers/asset.record'
import { vuexTypes } from '@/vuex'

export const state = {
  balances: [],
  assets: [],
}

export const mutations = {
  [types.SET_BALANCES] (state, balances) {
    state.balances = balances
  },
  [types.SET_ASSETS] (state, assets) {
    state.assets = assets
  },
}

export const actions = {
  async [types.LOAD_BALANCES] ({ commit, rootGetters }) {
    const endpoint = `/v3/accounts/${rootGetters[vuexTypes.accountId]}`
    const { data: account } = await api.getWithSignature(endpoint, {
      include: ['balances.state'],
    })

    commit(types.SET_BALANCES, account.balances)
  },

  async [types.LOAD_ASSETS] ({ commit, rootGetters }) {
    const { data: assets } = await api.getWithSignature('/v3/assets', {
      include: ['owner'],
      filter: {
        owner: rootGetters[vuexTypes.accountId],
      },
    })

    commit(types.SET_ASSETS, assets)
  },
}

export const getters = {
  [types.balances]: state => state.balances.map(b => new Balance(b)),
  [types.assets]: state => state.assets
    .map(a => new AssetRecord(a, state.balances))
    .filter(i => i.balance.id),
}

export const SharesTopBarModule = {
  name: 'shares-top-bar',
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
