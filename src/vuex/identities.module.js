import { vuexTypes } from './types'
import { api } from '@/api'
import { errors } from '@/js/errors'

export const state = {
  usersIdentities: {},
}

export const mutations = {
  [vuexTypes.SET_IDENTITIES] (state, accountIdIdentities) {
    state.usersIdentities[accountIdIdentities.address] = {
      accountId: accountIdIdentities.address,
      phoneNumber: accountIdIdentities.phoneNumber,
      email: accountIdIdentities.email,
      telegramUsername: accountIdIdentities.telegramUsername,
    }
  },
}

export const actions = {
  async [vuexTypes.LOAD_IDENTITIES_BY_ACCOUNT_ID] ({ commit }, accountId) {
    const { data } = await api.get('/identities', {
      filter: { address: accountId },
      page: { limit: 1 },
    })

    if (data && data[0]) {
      commit(vuexTypes.SET_IDENTITIES, data[0])
    } else {
      throw new errors.UserDoesntExistError()
    }
  },
}

export const getters = {
  [vuexTypes.usersIdentities]: state => state.usersIdentities,
  [vuexTypes.emailByAccountId]: (a, getters, b, rootGetters) => accountId =>
    rootGetters[vuexTypes.usersIdentities][accountId]
      ? rootGetters[vuexTypes.usersIdentities][accountId].email
      : '',
  [vuexTypes.phoneNumberByAccountId]: (a, getters, b, rootGetters) =>
    accountId =>
      rootGetters[vuexTypes.usersIdentities][accountId]
        ? rootGetters[vuexTypes.usersIdentities][accountId].phoneNumber
        : '',
  [vuexTypes.telegramUsernameByAccountId]: (a, getters, b, rootGetters) =>
    accountId =>
      rootGetters[vuexTypes.usersIdentities][accountId]
        ? rootGetters[vuexTypes.usersIdentities][accountId].telegramUsername
        : '',
}

export default {
  state,
  mutations,
  actions,
  getters,
}
