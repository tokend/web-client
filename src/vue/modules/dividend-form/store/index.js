import { Balance } from '../wrappers/balance'
import { FEE_TYPES } from '@tokend/js-sdk'

import { types } from './types'
import { api, loadingDataViaLoop } from '../_api'
import { AssetRecord } from '../wrappers/asset.record'

export const state = {
  accountId: '',
  balances: [],
  assets: [],
  balanceHolders: [],
}

export const mutations = {
  [types.SET_ACCOUNT_ID] (state, accountId) {
    state.accountId = accountId
  },
  [types.SET_BALANCES] (state, balances) {
    state.balances = balances
  },
  [types.SET_ASSETS] (state, assets) {
    state.assets = assets
  },
  [types.SET_BALANCE_HOLDERS] (state, balanceHolders) {
    state.balanceHolders = balanceHolders
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
  async [types.LOAD_ASSETS] ({ commit, getters }) {
    const endpoint = `/v3/assets`
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
   */
  async [types.LOAD_BALANCE_HOLDERS] ({ commit }, opts) {
    const endpoint = `/v3/balances`
    const { data: holders } = await api().getWithSignature(endpoint, {
      filter: {
        asset: opts.assetCode,
      },
      include: ['state'],
    })

    commit(types.SET_BALANCE_HOLDERS, holders)
  },
  /**
   *
   * @param {Object} opts
   * @param {String} opts.assetCode - asset code
   * @param {String} opts.subtype - subtype fee
   * @param {String} opts.accountId - account id
   * @param {String} opts.amount - amount to calculate fee
   */
  async [types.LOAD_FEES] ({ commit }, opts) {
    const endpoint = `/v3/accounts/${opts.accountId}/calculated_fees`
    const { data: fees } = await api().getWithSignature(endpoint, {
      asset: opts.assetCode,
      fee_type: FEE_TYPES.paymentFee,
      subtype: opts.subtype,
      amount: opts.amount || '0',
    })
    return fees
  },
  /**
   *
   * @param {Object} opts
   * @param {String} opts.accountId - account id
   */
  async [types.LOAD_ACCOUNT_ID] ({ commit }, opts) {
    const endpoint = `/balances/${opts.accountId}/account`
    const { _rawResponse: account } = await api().getWithSignature(endpoint, {})

    return account.data.account_id
  },
}

export const getters = {
  [types.accountId]: state => state.accountId,
  [types.balances]: state => state.balances.map(b => new Balance(b)),
  [types.assets]: state => state.assets.filter(
    item => item.balance.id && item.isTransferable && item.isBaseAsset
  ),
  [types.ownedAssets]: state => state.assets.filter(item =>
    item.owner === state.accountId && item.isShareSubtype
  ),
  [types.balanceHolders]: state => state.balanceHolders
    .map(item => new Balance(item)),
}

export const dividendFormModule = {
  name: 'dividend-form',
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
