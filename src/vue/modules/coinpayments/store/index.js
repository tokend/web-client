import { types } from './types'
import { api } from '../_api'

export const actions = {
  async [types.LOAD_DEPOSIT] ({ commit }, params) {
    const endpoint = `/integrations/coinpayments/deposit`
    const { data: response } = await api().postWithSignature(endpoint, params)
    return response.extras
  },
  async [types.LOAD_PENDING_ISSUANCES] ({ commit }, balanceId) {
    const params = {
      filter: {
        state: 1,
        'request_details.receiver': balanceId,
      },
      page: {
        order: 'desc',
      },
      include: ['request_details'],
    }
    const endpoint = `/v3/create_issuance_requests`
    const response = await api().getWithSignature(endpoint, params)
    return response
  },
}

export const coinpaymentsModule = {
  name: 'coinpayments',
  namespaced: true,
  actions,
}
