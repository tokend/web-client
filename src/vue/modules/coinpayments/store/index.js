import { types } from './types'
import { api } from '../_api'

const HORIZON_VERSION_PREFIX = 'v3'

export const actions = {
  async [types.LOAD_DEPOSIT] ({ commit }, params) {
    const endpoint = `/integrations/coinpayments/deposit`
    const response = await api().postWithSignature(endpoint, {
      data: {
        type: 'coinpayments_deposit',
        attributes: params,
      },
    })
    return response.data
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
    const endpoint = `/${HORIZON_VERSION_PREFIX}/create_issuance_requests`
    const response = await api().getWithSignature(endpoint, params)
    return response
  },
}

export const coinpaymentsModule = {
  name: 'coinpayments',
  namespaced: true,
  actions,
}
