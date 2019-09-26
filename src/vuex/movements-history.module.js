import { Movement } from '@/vue/modules/movements-history/wrappers/movement'

import { vuexTypes } from './types'
import { api } from '@/api'

export const state = {
  movements: [],
}

export const mutations = {
  [vuexTypes.SET_MOVEMENTS] (state, movements) {
    state.movements = movements
  },
  [vuexTypes.CONCAT_MOVEMENTS] (state, movements) {
    state.movements = state.movements.concat(movements)
  },
}

export const actions = {
  [vuexTypes.LOAD_MOVEMENTS] ({ rootGetters }, filters) {
    const accountId = filters.accountId
      ? filters.accountId
      : rootGetters[vuexTypes.accountId]

    return api.getWithSignature('/v3/history', {
      page: {
        order: 'desc',
      },
      filter: {
        asset: filters.assetCode,
        account: accountId,
      },
      include: ['effect', 'operation.details'],
    })
  },

  [vuexTypes.LOAD_SHARE_MOVEMENTS] ({ rootGetters }, assetCode) {
    return api.getWithSignature('/v3/movements', {
      page: {
        order: 'desc',
      },
      filter: {
        asset: assetCode,
      },
      include: ['effect', 'operation.details'],
    })
  },
}

export const getters = {
  [vuexTypes.movements]: state => state.movements.map(m => new Movement(m)),
}

export default {
  name: 'movementsHistory',
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
