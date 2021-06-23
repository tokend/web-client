import { vuexTypes } from './types'
import { api } from '@/api'
import { FeeRecord } from '@/js/records/entities/fee.record'

export const state = {
  fees: [],
}

export const mutations = {
  [vuexTypes.SET_ACCOUNT_FEES] (state, fees) {
    state.fees = fees
  },
}

export const actions = {
  async [vuexTypes.LOAD_ACCOUNT_FEES] ({ commit, rootGetters }) {
    const endpoint = `/v3/accounts/${rootGetters[vuexTypes.accountId]}`

    const { data } = await api.getWithSignature(endpoint, {
      include: ['fees'],
    })

    commit(vuexTypes.SET_ACCOUNT_FEES, data.fees)
  },
}

export const getters = {
  [vuexTypes.fees]: state => state.fees.map(f => new FeeRecord(f)),
}

export default {
  state,
  getters,
  actions,
  mutations,
}
