import { Balance } from '../wrappers/balance'
import { Asset } from '../wrappers/asset'

import { api } from '../_api'
import { types } from './types'

import { base } from '@tokend/js-sdk'

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
  async [types.LOAD_ASSETS] () {
    return api().get('/assets')
  },
  async [types.LOAD_BALANCES] ({ commit, getters }) {
    const { data: account } = await api().getWithSignature(
      `/accounts/${getters[types.accountId]}`, {
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
  [types.getBalanceByAssetCode]: state => assetCode => {
    const record = state.balances.find(b => b.asset.code === assetCode)
    if (record) {
      return new Balance(record)
    }
  },
}

export const assetExplorerModule = {
  namespaced: true,
  mutations,
  actions,
  getters,
  state,
}
