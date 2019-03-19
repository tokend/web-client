import { Balance } from '../wrappers/balance'

import { types } from './types'
import { api } from '../_api'
import { AssetRecord } from '../wrappers/asset.record'
import { SaleRecord } from '../wrappers/sale.record'

const HORIZON_VERSION_PREFIX = 'v3'

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
    const endpoint = `/${HORIZON_VERSION_PREFIX}/accounts/${getters[types.accountId]}`
    const { data: account } = await api().getWithSignature(endpoint, {
      include: ['balances.state'],
    })

    commit(types.SET_BALANCES, account.balances)
  },
  async [types.LOAD_ASSETS] ({ commit, getters }) {
    let response = await api().get(`${HORIZON_VERSION_PREFIX}/assets`)
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
    let { data: sales } = await api().get(`${HORIZON_VERSION_PREFIX}/sales`, {
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
    // TODO:
    .filter(a => a.isAllowedToRedeem && a.owner.id !== state.accountId),
}

export const RedeemFormModule = {
  name: 'redeem-form',
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
