import { Balance } from '../wrappers/balance'
import { Movement } from '../wrappers/movement'

import { types } from './types'
import { api } from '../_api'

export const state = {
  accountId: '',
  balances: [],
  assetPairs: [],
  movements: [],
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
  [types.SET_MOVEMENTS] (state, movements) {
    state.movements = movements
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
  /**
   * Load pairs by passed asset
   *
   * @param {Object} opts
   * @param {String} opts.asset - asset code
   */
  async [types.LOAD_ASSET_PAIRS] ({ commit, getters }, opts) {
    const endpoint = `/v3/asset_pairs`
    const { data: pairs } = await api().getWithSignature(endpoint, {
      filter: {
        asset: opts.asset,
      },
      include: [
        'quote_asset',
      ],
    })

    pairs.unshift({
      id: 'PET:PET',
      price: '1.000000',
      policies: { 'value': 0, 'flags': null },
      baseAsset: { 'type': 'assets', 'id': 'PET' },
      quoteAsset: { 'type': 'assets', 'id': 'PET' },
    })

    commit(types.SET_ASSET_PAIRS, pairs)
  },

  async [types.LOAD_MOVEMENTS] ({ getters, commit }, assetCode) {
    if (!getters[types.balances].length) {
      await actions[types.LOAD_BALANCES]({ getters, commit })
    }

    const balance = getters[types.getBalanceByAssetCode](assetCode)

    if (!balance) {
      throw new Error(`No balance found for ${assetCode}`)
    }

    const endpoint = `/v3/history`
    const { data: movements } = await api().getWithSignature(endpoint, {
      page: {
        order: 'desc',
      },
      filter: {
        account: getters[types.accountId],
        balance: balance.id,
      },
      include: ['effect', 'operation.details'],
    })

    commit(types.SET_MOVEMENTS, movements)
  },
}

export const getters = {
  [types.accountId]: state => state.accountId,
  [types.balances]: state => state.balances.map(b => new Balance(b)),
  [types.movements]: state => state.movements.map(m => new Movement(m)),
  [types.assetPairs]: state => state.assetPairs,
  [types.getBalanceByAssetCode]: (_, getters) => assetCode => getters
    .balances
    .find(b => b.assetCode === assetCode),
}

export const createInvoiceFormModule = {
  name: 'create-invoice-form',
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
