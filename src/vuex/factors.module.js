import { api } from '@/api'
import { vuexTypes } from './types'

const FACTOR_TYPES = Object.freeze({
  totp: 'totp',
  password: 'password',
  email: 'email',
  phone: 'phone',
  telegram: 'telegram',
})

// Factors with lower priority will not trigger 2fa flow, so we can ignore
// them. However, if 0-priority factor
// exists, we should delete it before creating new.
// Such case appears, for example, when creating totp-factor:
// 1 - user creates factor to receive the secret for time-based algorithm,
// it has priority 0
// 2 - user confirms factor by providing totp, it now receives priority 1 and
// will trigger 2fa when needed
const ENABLED_FACTOR_PRIORITY = 1

const state = {
  factors: [],
}

export const mutations = {
  [vuexTypes.SET_FACTORS] (state, factors) {
    state.factors = factors
  },
}

export const actions = {
  async [vuexTypes.LOAD_FACTORS] ({ commit, rootGetters }) {
    const endpoint = `/wallets/${rootGetters[vuexTypes.walletId]}/factors`
    const { data } = await api.getWithSignature(endpoint)
    commit(vuexTypes.SET_FACTORS, data)
  },
}

export const getters = {
  [vuexTypes.factors]: state => state.factors,
  [vuexTypes.factorsPassword]: state => state.factors.filter(
    factor => factor.type === FACTOR_TYPES.password
  ),
  [vuexTypes.factorsEmail]: state => state.factors.filter(
    factor => factor.type === FACTOR_TYPES.email
  ),

  [vuexTypes.factorsTotp]: state => state.factors.filter(
    factor => factor.type === FACTOR_TYPES.totp
  ),
  [vuexTypes.factorsTotpEnabled]: (_, getters) =>
    getters[vuexTypes.factorsTotp].filter(
      factor => factor.priority === ENABLED_FACTOR_PRIORITY
    ),
  [vuexTypes.isTotpEnabled]: (_, getters) =>
    !!getters[vuexTypes.factorsTotpEnabled].length,

  [vuexTypes.factorsPhone]: state => state.factors.filter(
    factor => factor.type === FACTOR_TYPES.phone
  ),
  [vuexTypes.factorsPhoneEnabled]: (_, getters) =>
    getters[vuexTypes.factorsPhone].filter(
      factor => factor.priority === ENABLED_FACTOR_PRIORITY
    ),
  [vuexTypes.isPhoneEnabled]: (_, getters) =>
    !!getters[vuexTypes.factorsPhoneEnabled].length,

  [vuexTypes.factorsTelegram]: state => state.factors.filter(
    factor => factor.type === FACTOR_TYPES.telegram,
  ),
  [vuexTypes.factorsTelegramEnabled]: (_, getters) =>
    getters[vuexTypes.factorsTelegram].filter(
      factor => factor.priority === ENABLED_FACTOR_PRIORITY
    ),
  [vuexTypes.isTelegramEnabled]: (_, getters) =>
    !!getters[vuexTypes.factorsTelegramEnabled].length,
}

export default {
  actions,
  getters,
  mutations,
  state,
}
