import { Asset } from '../../shared/wrappers/asset'

import { api } from '../_api'
import { types } from './types'

const HORIZON_VERSION_PREFIX = 'v3'

export const state = {
  assets: [],
  accountId: '',
  balances: [],
}

export const mutations = {
  [types.SET_ACCOUNT_ID] (state, id) {
    state.accountId = id
  },
  [types.SET_ACCOUNT_BALANCES] (state, balances) {
    state.balances = balances || []
  },
  [types.SET_ASSETS] (state, assets) {
    state.assets = assets
  },
}

export const actions = {
  async [types.LOAD_ACCOUNT_BALANCES] ({ commit, getters }) {
    const endpoint = `/${HORIZON_VERSION_PREFIX}/accounts/${getters[types.accountId]}`
    const { data: account } = await api().getWithSignature(endpoint, {
      include: ['balances.state', 'balances.asset'],
    })
    commit(types.SET_ACCOUNT_BALANCES, account.balances)
    commit(types.SET_ASSETS, account.balances.map(b => b.asset))
  },
}

export const getters = {
  [types.accountId]: state => state.accountId,
  [types.assets]: state => state.assets.map(asset => {
    const balance = state.balances.find(b => b.asset.id === asset.id) || ''
    return new Asset(asset, balance ? balance.state.available : '')
  }),
}

export const balanceExplorerModule = {
  namespaced: true,
  mutations,
  actions,
  getters,
  state,
}
