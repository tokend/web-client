import { api } from '../api'
import { types } from './types'
import { AssetRecord } from '../asset-record'
import { BalanceRecord } from '../balance-record'

import { base } from '@tokend/js-sdk'

export const state = {
  assets: [],
  balances: [],

  balancesOwnerId: '',
}

export const mutations = {
  [types.SET_ASSETS] (state, assets) {
    state.assets = assets
  },
  [types.SET_NEXT_ASSETS] (state, assets) {
    state.assets = state.assets.concat(assets)
  },
  [types.SET_BALANCES] (state, balances) {
    state.balances = balances || []
  },
  [types.SET_BALANCES_OWNER_ID] (state, id) {
    state.balancesOwnerId = id
  },
}

export const actions = {
  async [types.LOAD_ASSETS] () {
    return api().get('/assets')
  },
  async [types.LOAD_BALANCES] ({ commit, getters }) {
    const { data: account } = await api().getWithSignature(
      `/accounts/${getters.balancesOwnerId}`, {
        include: ['balances.state'],
      })

    commit(types.SET_BALANCES, account.balances)
  },
  async [types.CREATE_BALANCE] ({ getters }, assetCode) {
    const operation = base.Operation.manageBalance({
      asset: assetCode,
      destination: getters[types.balancesOwnerId],
      action: base.xdr.ManageBalanceAction.createUnique(),
    })

    await api().postOperations(operation)
  },
}

export const getters = {
  [types.balancesOwnerId]: state => state.balancesOwnerId,

  [types.assets]: state => state.assets.map(a => new AssetRecord(a)),
  [types.balances]: state => state.balances
    .map(b => new BalanceRecord(b))
    .reduce((res, b) => ({
      ...res,
      [b.assetCode]: b,
    }), {}),
}
