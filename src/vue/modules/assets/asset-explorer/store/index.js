import { Asset } from '../../shared/wrappers/asset'

import { api } from '../_api'
import { types } from './types'
import { base } from '@tokend/js-sdk'

const HORIZON_VERSION_PREFIX = 'v3'

export const state = {
  accountId: '',
  assets: [],
  balances: [],
}

export const mutations = {
  [types.SET_ACCOUNT_ID] (state, id) {
    state.accountId = id
  },
  [types.SET_ACCOUNT_BALANCES] (state, balances) {
    state.balances = balances || []
  },
  [types.SET_ASSETS] (state, assets) {
    state.assets = assets
  },
  [types.CONCAT_ASSETS] (state, assets) {
    state.assets = state.assets.concat(assets)
  },
}

export const actions = {
  async [types.LOAD_ACCOUNT_BALANCES] ({ commit, getters }) {
    const endpoint = `/${HORIZON_VERSION_PREFIX}/accounts/${getters[types.accountId]}`
    const { data: account } = await api().getWithSignature(endpoint, {
      include: ['balances.state'],
    })

    commit(types.SET_ACCOUNT_BALANCES, account.balances)
  },

  async [types.LOAD_ASSETS] (_, query) {
    return api().get(`/${HORIZON_VERSION_PREFIX}/assets`, query)
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
  [types.accountId]: state => state.accountId,
  [types.assets]: state => state.assets.map(asset => {
    const balance = state.balances.find(b => b.asset.id === asset.id)

    return new Asset(asset, balance ? balance.state.available : '')
  }),

}

export const assetExplorerModule = {
  namespaced: true,
  mutations,
  actions,
  getters,
  state,
}
