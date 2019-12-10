import { types } from './types'
import { vuexTypes } from '@/vuex'
import { api } from '@/api'
import { Fee } from '../wrappers/fee'

export const state = {
  fees: [],
}

export const mutations = {
  [types.SET_ACCOUNT_FEES] (state, fees) {
    state.fees = fees
  },
}

export const actions = {
  async [types.LOAD_ACCOUNT_FEES] ({ commit, rootGetters }) {
    const endpoint = `/v3/accounts/${rootGetters[vuexTypes.accountId]}`

    const { data } = await api.getWithSignature(endpoint, {
      include: ['fees'],
    })

    commit(types.SET_ACCOUNT_FEES, data.fees)
  },
}

export const getters = {
  [types.fees]: state => state.fees.map(f => new Fee(f)),
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
