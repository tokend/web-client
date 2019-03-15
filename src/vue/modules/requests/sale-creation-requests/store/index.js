import { SaleCreationRequest } from '../wrappers/sale-creation-request'
import { Asset } from '../wrappers/asset'

import { base } from '@tokend/js-sdk'

import { types } from './types'
import { api } from '../_api'

const HORIZON_VERSION_PREFIX = 'v3'

export const state = {
  accountId: '',
  saleCreationRequests: [],
  accountOwnedAssets: [],
}

export const mutations = {
  [types.SET_ACCOUNT_ID] (state, accountId) {
    state.accountId = accountId
  },
  [types.SET_SALE_CREATION_REQUESTS] (state, saleCreationRequests) {
    state.saleCreationRequests = saleCreationRequests
  },
  [types.CONCAT_SALE_CREATION_REQUESTS] (state, saleCreationRequests) {
    state.saleCreationRequests = state.saleCreationRequests
      .concat(saleCreationRequests)
  },
  [types.SET_ACCOUNT_OWNED_ASSETS] (state, accountOwnedAssets) {
    state.accountOwnedAssets = accountOwnedAssets
  },
}

export const actions = {
  [types.LOAD_SALE_CREATION_REQUESTS] ({ getters }) {
    return api().getWithSignature(`/${HORIZON_VERSION_PREFIX}/create_sale_requests`, {
      page: {
        order: 'desc',
      },
      filter: {
        requestor: getters[types.accountId],
      },
      include: ['request_details', 'request_details.default_quote_asset'],
    })
  },

  async [types.LOAD_ACCOUNT_BALANCES] ({ commit, getters }) {
    const endpoint = `/${HORIZON_VERSION_PREFIX}/accounts/${getters[types.accountId]}`
    const { data: account } = await api().getWithSignature(endpoint, {
      include: ['balances.state', 'balances.asset'],
    })

    commit(types.SET_ACCOUNT_OWNED_ASSETS, account.balances.map(b => b.asset))
  },

  async [types.CANCEL_SALE_CREATION_REQUEST] (_, requestId) {
    const operation = base.ManageAssetBuilder.cancelSaleRequest({
      requestID: requestId,
    })
    await api().postOperations(operation)
  },
}

export const getters = {
  [types.accountId]: state => state.accountId,
  [types.saleCreationRequests]: state => state.saleCreationRequests
    .map(r => new SaleCreationRequest(r)),
  [types.accountOwnedAssets]: state => state.accountOwnedAssets
    .map(a => new Asset(a)),
}

export const saleCreationRequestsModule = {
  name: 'sale-creation-requests',
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
