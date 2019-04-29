import { Balance } from '../wrappers/balance'

import { types } from './types'
import { api } from '@/api'

export const state = {
  accountId: '',
  balances: [],
}

export const mutations = {
  [types.SET_ACCOUNT_ID] (state, accountId) {
    state.accountId = accountId
  },
  [types.SET_BALANCES] (state, balances) {
    state.balances = balances
  },
}

export const actions = {
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
  [types.balances]: state => state.balances.map(b => new Balance(b)),
}

export const loyaltyPointsInvoicesModule = {
  name: 'loyalty-points-invoices',
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
