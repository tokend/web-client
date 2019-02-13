import { Balance } from '../wrappers/balance'
import { Asset } from '../wrappers/asset'

import { api } from '../_api'
import { types } from './types'
import { base } from '@tokend/js-sdk'

const HORIZON_VERSION_PREFIX = 'v3'

export const state = {
  assets: [],
  accountId: '',
  balances: [],
}

export const mutations = {
  [types.SET_ASSETS] (state, assets) {
    state.assets = assets
  },
  [types.CONCAT_ASSETS] (state, assets) {
    state.assets = state.assets.concat(assets)
  },
  [types.SET_BALANCES] (state, balances) {
    state.balances = balances || []
  },
  [types.SET_ACCOUNT_ID] (state, id) {
    state.accountId = id
  },
}

export const actions = {
  async [types.LOAD_ASSETS] (_, query) {
    return api().get(`/${HORIZON_VERSION_PREFIX}/assets`, query)
  },
  async [types.LOAD_BALANCES] ({ commit, getters }) {
    const endpoint = `/${HORIZON_VERSION_PREFIX}/accounts/${getters[types.accountId]}`
    const { data: account } = await api().getWithSignature(endpoint, {
      include: ['balances.state'],
    })

    commit(types.SET_BALANCES, account.balances)
  },
  async [types.CREATE_BALANCE] ({ getters }, assetCode) {
    const operation = base.Operation.manageBalance({
      asset: assetCode,
      destination: getters[types.accountId],
      action: base.xdr.ManageBalanceAction.createUnique(),
    })

    await api().postOperations(operation)
  },
}

export const getters = {
  [types.assets]: state => state.assets.map(a => new Asset(a)),
  [types.accountId]: state => state.accountId,
  [types.getBalanceByAssetCode]: state => assetCode => state.balances
    .map(b => new Balance(b))
    .find(b => b.assetCode === assetCode),
}

export const assetExplorerModule = {
  namespaced: true,
  mutations,
  actions,
  getters,
  state,
}
