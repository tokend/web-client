import { Movement } from '../wrappers/movement'

import { types } from './types'
import { api } from '@/api'
import { vuexTypes } from '@/vuex'
import _isEmpty from 'lodash/isEmpty'

export const state = {
  movements: [],
}

export const mutations = {
  [types.SET_MOVEMENTS] (state, movements) {
    state.movements = movements
  },
  [types.CONCAT_MOVEMENTS] (state, movements) {
    state.movements = state.movements.concat(movements)
  },
}

export const actions = {
  [types.LOAD_MOVEMENTS] ({ rootGetters }, assetCode) {
    const balance = rootGetters[vuexTypes.accountBalanceByCode](assetCode)

    if (_isEmpty(balance)) {
      throw new Error(`No balance found for ${assetCode}`)
    }

    return api.getWithSignature('/v3/history', {
      page: {
        order: 'desc',
        limit: 10,
      },
      filter: {
        account: rootGetters[vuexTypes.accountId],
        balance: balance.id,
      },
      include: ['effect', 'operation.details'],
    })
  },

  [types.LOAD_SHARE_MOVEMENTS] ({ rootGetters }, assetCode) {
    const balance = rootGetters[vuexTypes.accountBalanceByCode](assetCode)
    if (_isEmpty(balance)) {
      throw new Error(`No balance found for ${assetCode}`)
    }

    return api.getWithSignature('/v3/movements', {
      page: {
        order: 'desc',
        limit: 10,
      },
      filter: {
        asset: assetCode,
      },
      include: ['effect', 'operation.details'],
    })
  },
}

export const getters = {
  [types.movements]: state => state.movements.map(m => new Movement(m)),
}

export const movementsHistoryModule = {
  name: 'movements-history',
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
