import { Issuance } from '../wrappers/issuance'

import { types } from './types'

import { Sdk } from '@/sdk'
import { OP_TYPES } from '@tokend/js-sdk'

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
    return Sdk.horizon.operations.getPage({
      account_id: getters[types.accountId],
      operation_type: OP_TYPES.createIssuanceRequest,
    })
  },
}

export const getters = {
  [types.accountId]: state => state.accountId,
  [types.issuances]: state => state.issuances
    .map(i => new Issuance(i, state.accountId)),
}

export const issuancesExplorerModule = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
