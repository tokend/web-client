import { types } from './types'
// import { api } from '../_api'

// const HORIZON_VERSION_PREFIX = 'v3'

const hardCode = {
  address: 'ADRESS',
  amount: '123',
  asset: 'BTC',
  confirms_needed: '2',
  timeout: +new Date() + 9000,
  txn_id: '9379992',
}
export const state = {
}

export const mutations = {
  [types.SET_DEPOSIT_DETAILS] (state, data) {
    state.depositDetails[data.balanceId] = data.depositDetails
  },
}

export const actions = {
  [types.LOAD_DEPOSIT] ({ getters }) {
    return hardCode
  },
  [types.LOAD_PENDING_ISSUANCES] () {
    return { data: [hardCode, hardCode, hardCode, hardCode, hardCode, hardCode,
      hardCode, hardCode, hardCode, hardCode],
    fetchNext: function () {
      return { data: [hardCode, hardCode] }
    },
    }
  },
}

export const getters = {
}

export const coinpaymentsModule = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
