import { FEE_TYPES, PAYMENT_FEE_SUBTYPES } from '@tokend/js-sdk'
import { Balance } from '../wrappers/balance'

import { types } from './types'
import { api, loadingDataViaLoop } from '@/api'
import { AssetRecord } from '../wrappers/asset.record'
import { vuexTypes } from '@/vuex'

export const state = {
  balances: [],
  assets: [],
  fees: {},
}

export const mutations = {
  [types.SET_BALANCES] (state, balances) {
    state.balances = balances
  },
  [types.SET_ASSETS] (state, assets) {
    state.assets = assets
  },
  [types.SET_FEES] (state, fees) {
    state.fees = fees
  },
}

export const actions = {
  async [types.LOAD_BALANCES] ({ commit, rootGetters }) {
    const endpoint = `/v3/accounts/${rootGetters[vuexTypes.accountId]}`
    const { data: account } = await api().getWithSignature(endpoint, {
      include: ['balances.state'],
    })

    commit(types.SET_BALANCES, account.balances)
  },
  async [types.LOAD_ASSETS] ({ commit, getters }) {
    const endpoint = '/v3/assets'
    let response = await api().getWithSignature(endpoint)
    let assets = await loadingDataViaLoop(response)

    commit(
      types.SET_ASSETS,
      assets.map(item => new AssetRecord(item, getters[types.balances]))
    )
  },
  /**
   *
   * @param {Object} opts
   * @param {String} opts.assetCode - asset code
   * @param {String} opts.amount - amount to calculate fee
   */
  async [types.LOAD_FEES] ({ commit, rootGetters }, opts) {
    const endpoint = `/v3/accounts/${rootGetters[vuexTypes.accountId]}/calculated_fees`
    const { data: fees } = await api().getWithSignature(endpoint, {
      asset: opts.assetCode,
      fee_type: FEE_TYPES.withdrawalFee,
      subtype: PAYMENT_FEE_SUBTYPES.outgoing,
      amount: opts.amount || '0',
    })

    commit(types.SET_FEES, fees)
  },
}

export const getters = {
  [types.balances]: state => state.balances.map(b => new Balance(b)),
  [types.assets]: state => state.assets,
  [types.withdrawableFiatAssets]: state => state.assets.filter(
    item => item.isWithdrawable && item.balance.id && item.isFiat
  ),
  [types.fees]: state => state.fees,
}

export const withdrawalFiatBankModule = {
  name: 'withdrawal-fiat-bank',
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
