import { Movement } from '../wrappers/movement'

import { types } from './types'
import { api } from '@/api'

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
  [types.LOAD_MOVEMENTS] ({ rootGetters }, filters) {
    return api.getWithSignature('/v3/history', {
      page: {
        order: 'desc',
        limit: 10,
      },
      filter: {
        account: filters.accountId,
        asset: filters.assetCode,
      },
      include: ['effect', 'operation.details'],
    })
  },
}

export const getters = {
  [types.movements]: state => state.movements.map(m => new Movement(m)),
}

export const userMovementsHistoryModule = {
  name: 'user-movements-history',
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
