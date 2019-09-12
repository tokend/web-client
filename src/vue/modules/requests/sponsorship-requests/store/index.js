import { SponsorshipRequest } from '../wrappers/sponsorship-request'

import { base } from '@tokend/js-sdk'

import { types } from './types'
import { api } from '@/api'
import { vuexTypes } from '@/vuex'

export const state = {
  requests: [],
}

export const mutations = {
  [types.SET_REQUESTS] (state, requests) {
    state.requests = requests
  },
  [types.CONCAT_REQUESTS] (state, requests) {
    state.requests = state.requests.concat(requests)
  },
}

export const actions = {
  [types.LOAD_REQUESTS] ({ rootGetters }) {
    return api.getWithSignature('/v3/create_withdraw_requests', {
      page: {
        order: 'desc',
      },
      filter: {
        reviewer: rootGetters[vuexTypes.accountId],
      },
      include: ['request_details'],
    })
  },

  async [types.APPROVE_REQUEST] (_, request) {
    const operation = createReviewSponsorshipRequestOp({
      request,
      reason: '',
      action: base.xdr.ReviewRequestOpAction.approve().value,
    })

    await api.postOperations(operation)
  },

  async [types.REJECT_REQUEST] (_, { request, reason }) {
    const operation = createReviewSponsorshipRequestOp({
      request,
      reason,
      action: base.xdr.ReviewRequestOpAction.permanentReject().value,
    })

    await api.postOperations(operation)
  },
}

function createReviewSponsorshipRequestOp ({ request, action, reason }) {
  const reviewDetails = {
    tasksToAdd: 0,
    tasksToRemove: request.pendingTasks,
    externalDetails: {},
  }

  return base.ReviewRequestBuilder.reviewWithdrawRequest({
    requestID: request.id,
    requestHash: request.hash,
    requestType: request.typeI,
    reviewDetails,
    requestDetails: JSON.stringify(reviewDetails),
    action,
    reason,
  })
}

export const getters = {
  [types.requests]: state => state.requests
    .map(r => new SponsorshipRequest(r)),
}

export const sponsorshipRequestsModule = {
  name: 'sponsorship-requests',
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
