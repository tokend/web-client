import { Sdk } from '../sdk'
import { vuexTypes } from './types'

const FACTOR_TYPES = Object.freeze({
  totp: 'totp',
  password: 'password',
  email: 'email'
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
  factors: []
}

export const mutations = {
  SET_FACTORS (state, factors) {
    state.factors = factors
  }
}

export const actions = {
  async LOAD_FACTORS ({ commit }) {
    const response = await Sdk.api.factors.getAll()
    commit(vuexTypes.SET_FACTORS, response.data)
  }
}

export const getters = {
  factors: state => state.factors,
  factorsTotp: state => state.factors.filter(
    factor => factor.resourceType === FACTOR_TYPES.totp
  ),
  factorsPassword: state => state.factors.filter(
    factor => factor.resourceType === FACTOR_TYPES.password
  ),
  factorsEmail: state => state.factors.filter(
    factor => factor.resourceType === FACTOR_TYPES.email
  ),
  factorsTotpEnabled: (_, getters) => getters.factorsTotp.filter(
    factor => factor.priority === ENABLED_FACTOR_PRIORITY
  ),
  isTotpEnabled: (_, getters) => !!getters.factorsTotpEnabled.length
}

export default {
  actions,
  getters,
  mutations,
  state
}
