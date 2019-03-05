import { Issuance } from '../wrappers/issuance'

import { types } from './types'

import { api } from '../_api'

const HORIZON_VERSION_PREFIX = 'v3'

export const state = {
  accountId: '',
  issuances: [],
}

export const mutations = {
  [types.SET_ACCOUNT_ID] (state, accountId) {
    state.accountId = accountId
  },
  [types.SET_ISSUANCES] (state, issuances) {
    state.issuances = issuances
  },
  [types.CONCAT_ISSUANCES] (state, issuances) {
    state.issuances = state.issuances.concat(issuances)
  },
}

export const actions = {
  [types.LOAD_ISSUANCES] ({ getters }) {
    return api().getWithSignature(`/${HORIZON_VERSION_PREFIX}/create_issuance_requests`, {
      page: {
        order: 'desc',
      },
      filter: {
        requestor: getters[types.accountId],
      },
      include: ['request_details'],
    })
  },
}

export const getters = {
  [types.accountId]: state => state.accountId,
  [types.issuances]: state => state.issuances.map(i => new Issuance(i)),
}

export const issuancesExplorerModule = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
