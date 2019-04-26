import { types } from './types'
import { api } from '@/api'
import { Fee } from '../wrappers/fee'

export const state = {
  accountId: '',
  fees: [],
}

export const mutations = {
  [types.SET_ACCOUNT_ID] (state, accountId) {
    state.accountId = accountId
  },
  [types.SET_ACCOUNT_FEES] (state, fees) {
    state.fees = fees
  },
}

export const actions = {
  async [types.LOAD_ACCOUNT_FEES] ({ commit, getters }) {
    const endpoint = `/v3/accounts/${getters[types.accountId]}`

    const { data } = await api().getWithSignature(endpoint, {
      include: ['fees'],
    })

    commit(types.SET_ACCOUNT_FEES, data.fees)
  },
}

export const getters = {
  [types.accountId]: state => state.accountId,
  [types.fees]: state => state.fees.map(f => new Fee(f)),
}

export const feesModule = {
  name: 'fees',
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
