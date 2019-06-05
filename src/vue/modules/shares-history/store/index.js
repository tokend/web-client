import { Movement } from '../wrappers/movement'
import { Balance } from '../wrappers/balance'

import { types } from './types'
import { api } from '@/api'
import { vuexTypes } from '@/vuex'

export const state = {
  balances: [],
  shares: [],
}

export const mutations = {
  [types.SET_BALANCES] (state, balances) {
    state.balances = balances
  },
  [types.SET_SHARES] (state, shares) {
    state.shares = shares
  },
  [types.CONCAT_SHARES] (state, shares) {
    state.shares = state.shares.concat(shares)
  },
}

export const actions = {
  [types.LOAD_SHARES] ({ getters }, assetCode) {
    const balance = getters[types.getBalanceByAssetCode](assetCode)

    if (!balance) {
      throw new Error(`No balance found for ${assetCode}`)
    }

    return api.getWithSignature('/v3/movements', {
      page: {
        order: 'desc',
        limit: 10,
      },
      filter: {
        asset: assetCode,
      },
      include: ['effect', 'operation.details'],
    })
  },

  async [types.LOAD_BALANCES] ({ commit, rootGetters }) {
    const endpoint = `/v3/accounts/${rootGetters[vuexTypes.accountId]}`
    const { data: account } = await api.getWithSignature(endpoint, {
      include: ['balances.state'],
    })

    commit(types.SET_BALANCES, account.balances)
  },
}

export const getters = {
  [types.shares]: state => state.shares.map(m => new Movement(m)),
  [types.balances]: state => state.balances.map(b => new Balance(b)),
  [types.getBalanceByAssetCode]: (_, getters) => assetCode => getters
    .balances
    .find(b => b.assetCode === assetCode),
}

export const sharesHistoryModule = {
  name: 'shares-history',
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
