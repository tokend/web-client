import { types } from './types'
import { api } from '../_api'

export const actions = {
  async [types.LOAD_DEPOSIT] ({ commit }, params) {
    const endpoint = `/integrations/coinpayments/deposit`
    const { data: response } = await api().postWithSignature(endpoint, params)
    return response.extras
  },
  async [types.LOAD_PENDING_ISSUANCES] ({ commit }, accountId) {
    const params = {
      asset: '',
      order: 'desc',
    }
    const endpoint = `/operations/accounts/${accountId}/payments`
    const { data: response } = await api().getWithSignature(endpoint, params)
    return response
  },
}

export const coinpaymentsModule = {
  name: 'coinpayments',
  namespaced: true,
  actions,
}
