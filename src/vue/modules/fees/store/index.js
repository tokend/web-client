import { Fee } from '../wrappers/fee'

import { types } from './types'
import { api } from '../_api'

const HORIZON_VERSION_PREFIX = 'v3'

export const state = {
  accountId: '',
  accountRoleId: '',
  fees: [],
}

export const mutations = {
  [types.SET_ACCOUNT_ID] (state, accountId) {
    state.accountId = accountId
  },
  [types.SET_ACCOUNT_ROLE_ID] (state, accountRoleId) {
    state.accountRoleId = accountRoleId
  },
  [types.SET_FEES] (state, fees) {
    state.fees = fees
      .map(f => new Fee(f))
      .filter(f => !f.accountId || f.accountId === state.accountId)
      .filter(f => !f.accountRoleId || f.accountRoleId === state.accountRoleId)
  },
  [types.CONCAT_FEES] (state, fees) {
    state.fees = state.fees.concat(
      fees.map(f => new Fee(f))
        .filter(f => !f.accountId || f.accountId === state.accountId)
        .filter(f => !f.accountRoleId ||
          f.accountRoleId === state.accountRoleId
        )
    )
  },
}

export const actions = {
  [types.LOAD_FEES] ({ getters }, assetCode) {
    return api().get(`/${HORIZON_VERSION_PREFIX}/fees`, {
      page: {
        order: 'desc',
      },
      filter: {
        asset: assetCode,
      },
    })
  },
}

export const getters = {
  [types.accountId]: state => state.accountId,
  [types.accountRoleId]: state => state.accountRoleId,
  [types.fees]: state => state.fees,
}

export const feesModule = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
