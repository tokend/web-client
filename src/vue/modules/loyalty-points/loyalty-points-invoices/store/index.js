import { Balance } from '../wrappers/balance'

import { types } from './types'
import { api } from '@/api'
import { vuexTypes } from '@/vuex'

export const state = {
  balances: [],
}

export const mutations = {
  [types.SET_BALANCES] (state, balances) {
    state.balances = balances
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
}

export const getters = {
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
