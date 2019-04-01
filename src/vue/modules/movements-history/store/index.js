import { Movement } from '../wrappers/movement'
import { Balance } from '../wrappers/balance'

import { types } from './types'
import { api } from '../_api'

export const state = {
  accountId: '',
  balances: [],
  movements: [],
}

export const mutations = {
  [types.SET_ACCOUNT_ID] (state, accountId) {
    state.accountId = accountId
  },
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
  [types.LOAD_MOVEMENTS] ({ getters }, assetCode) {
    const balance = getters[types.getBalanceByAssetCode](assetCode)

    if (!balance) {
      throw new Error(`No balance found for ${assetCode}`)
    }

    return api().getWithSignature(`/v3/history`, {
      page: {
        order: 'desc',
      },
      filter: {
        account: getters[types.accountId],
        balance: balance.id,
      },
      include: ['effect', 'operation.details'],
    })
  },

  async [types.LOAD_BALANCES] ({ commit, getters }) {
    const endpoint = `/v3/accounts/${getters[types.accountId]}`
    const { data: account } = await api().getWithSignature(endpoint, {
      include: ['balances.state'],
    })

    commit(types.SET_BALANCES, account.balances)
  },
}

export const getters = {
  [types.accountId]: state => state.accountId,
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
