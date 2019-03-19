import { Balance } from '../wrappers/balance'

import { types } from './types'
import { api } from '../_api'

const HORIZON_VERSION_PREFIX = 'v3'

export const state = {
  accountId: '',
  balances: [],
  assetPairs: [],
}

export const mutations = {
  [types.SET_ACCOUNT_ID] (state, accountId) {
    state.accountId = accountId
  },
  [types.SET_BALANCES] (state, balances) {
    state.balances = balances
  },
  [types.SET_ASSET_PAIRS] (state, assetPairs) {
    state.assetPairs = assetPairs
  },
}

export const actions = {
  async [types.LOAD_BALANCES] ({ commit, getters }) {
    const endpoint = `/${HORIZON_VERSION_PREFIX}/accounts/${getters[types.accountId]}`
    const { data: account } = await api().getWithSignature(endpoint, {
      include: ['balances.state'],
    })

    commit(types.SET_BALANCES, account.balances)
  },
  /**
   * Load pairs by passed asset
   *
   * @param {Object} opts
   * @param {String} opts.asset - asset code
   */
  async [types.LOAD_ASSET_PAIRS] ({ commit, getters }, opts) {
    const endpoint = `/${HORIZON_VERSION_PREFIX}/asset_pairs`
    const { data: pairs } = await api().getWithSignature(endpoint, {
      filter: {
        asset: opts.asset,
      },
    })

    commit(types.SET_ASSET_PAIRS, pairs)
  },
}

export const getters = {
  [types.accountId]: state => state.accountId,
  [types.balances]: state => state.balances.map(b => new Balance(b)),
  [types.assetPairs]: state => state.assetPairs,
}

export const createInvoiceFormModule = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
