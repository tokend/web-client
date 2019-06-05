import { Balance } from '../wrappers/balance'

import { types } from './types'
import { api } from '@/api'
import { AssetRecord } from '../wrappers/asset.record'
import { SaleRecord } from '../wrappers/sale.record'
import { base, PAYMENT_FEE_SUBTYPES } from '@tokend/js-sdk'
import { SECONDARY_MARKET_ORDER_BOOK_ID } from '@/js/const/offers'
import { vuexTypes } from '../../../../vuex'

const OFFER_FEE_TYPE = 'offerFee'

export const state = {
  balances: [],
  assets: [],
  accountBalances: [],
}

export const mutations = {
  [types.SET_BALANCES] (state, balances) {
    state.balances = balances
  },
  [types.SET_ASSETS] (state, assets) {
    state.assets = assets
  },
  [types.SET_ACCOUNT_BALANCES_DETAILS] (state, balancesDetails) {
    state.accountBalances = balancesDetails
  },
}

export const actions = {
  async [types.LOAD_BALANCES] ({ commit, rootGetters }) {
    const endpoint = `/v3/accounts/${rootGetters[vuexTypes.accountId]}`
    const { data: account } = await api.getWithSignature(endpoint, {
      include: ['balances.state'],
    })

    commit(types.SET_BALANCES, account.balances)
  },
  async [types.LOAD_ASSETS] ({ commit, getters }) {
    let response = await api.get('/v3/assets')
    let assets = response.data
    while (response.data.length) {
      response = await response.fetchNext()
      assets = [...assets, ...response.data]
    }

    commit(types.SET_ASSETS, assets)
  },
  /**
   *
   * @param {String} baseAsset - filter sales by base asset code
   */
  async [types.LOAD_SALE_BY_BASE_ASSET] ({ getters }, baseAsset) {
    let { data: sales } = await api.get('/v3/sales', {
      filter: {
        base_asset: baseAsset,
      },
    })

    return sales
      .map(i => new SaleRecord(i))
      .find(i => i.baseAsset.id === baseAsset)
  },

  async [types.LOAD_ACCOUNT_BALANCES_DETAILS] ({ commit, rootGetters }) {
    const endpoint = `/v3/accounts/${rootGetters[vuexTypes.accountId]}`
    const { data: account } = await api.getWithSignature(endpoint, {
      include: ['balances.asset', 'balances.state'],
    })

    const balances = account.balances
      .map(item => {
        item.assetDetails = new AssetRecord(item.asset)
        item.asset = item.assetDetails.code
        item.balance = item.state.available
        return item
      })
      .sort((a, b) => b.convertedBalance - a.convertedBalance)

    commit(vuexTypes.SET_ACCOUNT_BALANCES_DETAILS, balances)
  },
  /**
   * @param {object} opts
   * @param {object} opts.pair - pair to create offer for
   * @param {string} opts.pair.base
   * @param {string} opts.pair.quote
   * @param {string} opts.baseAmount
   * @param {string} opts.quoteAmount
   * @param {string} opts.price
   * @param {boolean} opts.isBuy
   * @returns {Promise<void>}
   */
  async [types.CREATE_OFFER] ({ getters, dispatch }, opts) {
    if (!getters.assetDetails(opts.pair.base)) {
      const operation = base.Operation.manageBalance({
        destination: opts.accountId,
        asset: opts.pair.base,
        action: base.xdr.ManageBalanceAction.createUnique(),
      })
      await api.postOperations(operation)
      dispatch(types.LOAD_ACCOUNT_BALANCES_DETAILS)
    }

    if (!getters.assetDetails(opts.pair.quote)) {
      const operation = base.Operation.manageBalance({
        destination: opts.accountId,
        asset: opts.pair.quote,
        action: base.xdr.ManageBalanceAction.createUnique(),
      })
      await api.postOperations(operation)
      dispatch(types.LOAD_ACCOUNT_BALANCES_DETAILS)
    }

    const feeType = base.xdr.FeeType.fromName(OFFER_FEE_TYPE).value
    const feeOpts = {
      asset: opts.pair.quote,
      amount: opts.quoteAmount,
      subtype: PAYMENT_FEE_SUBTYPES.outgoing,
      fee_type: feeType,
    }
    const endpoint = `/accounts/${opts.accountId}/calculated_fees`
    const { data: fee } = await api.getWithSignature(endpoint, feeOpts)
    const operationOpts = {
      amount: opts.baseAmount,
      price: opts.price,
      orderBookID: SECONDARY_MARKET_ORDER_BOOK_ID,
      isBuy: opts.isBuy,
      baseBalance: getters.assetDetails(opts.pair.base).id,
      quoteBalance: getters.assetDetails(opts.pair.quote).id,
      fee: fee.calculatedPercent,
    }
    const operation = base.ManageOfferBuilder.manageOffer(operationOpts)

    await api.postOperations(operation)
  },
}

export const getters = {
  [types.balances]: state => state.balances.map(b => new Balance(b)),
  [types.assets]: (state, rootGetters) => state.assets
    .map(a => new AssetRecord(a))
    .filter(a => a.isAllowedToRedeem && a.owner.id !==
      rootGetters[vuexTypes.accountId]),
  [types.assetsInBalance]: (state, getters) => {
    const balancesCodes = getters[types.balances].map(i => i.assetCode)
    return getters[types.assets].filter(a => balancesCodes.includes(a.code))
  },
  [types.selectedAssetBalance]: (state, getters) => assetCode => {
    return getters[types.balances].find(b => b.assetCode === assetCode).value
  },
  [types.assetDetails]: (state) => (assetCode) => {
    return state.accountBalances.find(i => i.asset.code === assetCode)
  },
}

export const RedeemFormModule = {
  name: 'redeem-form',
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
