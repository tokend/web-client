import { Movement } from '../wrappers/movement'
import { Balance } from '../wrappers/balance'

import { types } from './types'
import { api } from '@/api'
import { vuexTypes } from '@/vuex'

export const state = {
  balances: [],
  movements: [],
}

export const mutations = {
  [types.SET_BALANCES] (state, balances) {
    state.balances = balances
  },
  [types.SET_MOVEMENTS] (state, movements) {
    state.movements = movements
  },
  [types.CONCAT_MOVEMENTS] (state, movements) {
    state.movements = state.movements.concat(movements)
  },
}

export const actions = {
  [types.LOAD_MOVEMENTS] ({ getters, rootGetters }, assetCode) {
    const balance = getters[types.getBalanceByAssetCode](assetCode)

    if (!balance) {
      throw new Error(`No balance found for ${assetCode}`)
    }

    return api.getWithSignature('/v3/history', {
      page: {
        order: 'desc',
        limit: 10,
      },
      filter: {
        account: rootGetters[vuexTypes.accountId],
        balance: balance.id,
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
  [types.movements]: state => state.movements.map(m => new Movement(m)),
  [types.balances]: state => state.balances.map(b => new Balance(b)),
  [types.getBalanceByAssetCode]: (_, getters) => assetCode => getters
    .balances
    .find(b => b.assetCode === assetCode),
}

export const movementsHistoryModule = {
  name: 'movements-history',
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
