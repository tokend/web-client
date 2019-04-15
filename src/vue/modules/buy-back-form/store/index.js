import { Balance } from '../wrappers/balance'

import { types } from './types'
import { api } from '../_api'
import { AssetRecord } from '../wrappers/asset.record'
import { SaleRecord } from '../wrappers/sale.record'
import { MathUtil } from '@/js/utils'

export const state = {
  accountId: '',
  balances: [],
  assets: [],
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
    let response = await api().get('/v3/assets')
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
    let { data: sales } = await api().get('/v3/sales', {
      filter: {
        base_asset: baseAsset,
      },
    })

    return sales
      .map(i => new SaleRecord(i))
      .find(i => i.baseAsset.id === baseAsset)
  },
}

export const getters = {
  [types.accountId]: state => state.accountId,
  [types.balances]: state => state.balances.map(b => new Balance(b)),
  [types.assets]: state => state.assets
    .map(a => new AssetRecord(a))
    .filter(a => a.isAllowedToBuyBack && a.owner.id === state.accountId),
  [types.assetsInBalance]: (state, getters) => {
    const balancesCodes = getters[types.balances].map(i => i.assetCode)
    return getters[types.assets].filter(a => balancesCodes.includes(a.code))
  },
  [types.allowedToBuy]: (state, getters) => assetCode => {
    const balance = getters[types.balances]
      .find(a => a.assetCode === assetCode).value
    const asset = getters[types.assets]
      .find(a => a.code === assetCode)

    return MathUtil.subtract(asset.issued, balance)
  },
}

export const BuyBackFormModule = {
  name: 'buy-back-form',
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
