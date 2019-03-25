import { CreateSaleRequest } from '../wrappers/create-sale-request'
import { Asset } from '../wrappers/asset'

import { base } from '@tokend/js-sdk'

import { types } from './types'
import { api } from '../_api'

const HORIZON_VERSION_PREFIX = 'v3'

export const state = {
  accountId: '',
  requests: [],
  balancesAssets: [],
}

export const mutations = {
  [types.SET_ACCOUNT_ID] (state, accountId) {
    state.accountId = accountId
  },
  [types.SET_REQUESTS] (state, requests) {
    state.requests = requests
  },
  [types.CONCAT_REQUESTS] (state, requests) {
    state.requests = state.requests
      .concat(requests)
  },
  [types.SET_BALANCES_ASSETS] (state, balancesAssets) {
    state.balancesAssets = balancesAssets
  },
}

export const actions = {
  [types.LOAD_REQUESTS] ({ getters }, baseAssetCode) {
    return api().getWithSignature(`/${HORIZON_VERSION_PREFIX}/create_sale_requests`, {
      page: {
        order: 'desc',
      },
      filter: {
        requestor: getters[types.accountId],
        'request_details.base_asset': baseAssetCode,
      },
      include: ['request_details', 'request_details.default_quote_asset'],
    })
  },

  async [types.LOAD_ACCOUNT_BALANCES] ({ commit, getters }) {
    const endpoint = `/${HORIZON_VERSION_PREFIX}/accounts/${getters[types.accountId]}`
    const { data: account } = await api().getWithSignature(endpoint, {
      include: ['balances.state', 'balances.asset'],
    })

    commit(types.SET_BALANCES_ASSETS, account.balances.map(b => b.asset))
  },

  async [types.CANCEL_REQUEST] (_, requestId) {
    const operation = base.SaleRequestBuilder.cancelSaleCreationRequest({
      requestID: requestId,
    })
    await api().postOperations(operation)
  },
}

export const getters = {
  [types.accountId]: state => state.accountId,
  [types.requests]: state => state.requests
    .map(r => new CreateSaleRequest(r)),
  [types.accountOwnedAssets]: state => state.balancesAssets
    .map(a => new Asset(a))
    .filter(a => a.owner === state.accountId),
}

export const createSaleRequestsModule = {
  name: 'create-sale-requests',
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
