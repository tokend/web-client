import { tokensService } from 'L@/js/services/tokens.service'
import {
  reviewableRequestsService
} from 'L@/js/services/reviewable_requests.service'
import { salesService } from 'L@/js/services/sales.service'
import { RecordFactory } from 'L@/js/records/factory'
import { Paginator } from 'L@/js/helpers/paginator'
import { vuexTypes } from '../types'
import config from '@/config'
import cloneDeep from 'lodash/cloneDeep'

const state = {
  tokenCreationRequests: new Paginator({
    txPerPage: config.REQUESTS_PER_PAGE,
    recordWrp: RecordFactory.createTokenСreationRecord.bind(RecordFactory)
  }),
  withdrawalUploadRequests: new Paginator({
    txPerPage: config.REQUESTS_PER_PAGE,
    recordWrp: RecordFactory.createWithdrawRecord.bind(RecordFactory)
  }),
  preIssuanceUploadRequests: new Paginator({
    txPerPage: config.REQUESTS_PER_PAGE,
    recordWrp: RecordFactory.createPreIssuanceRequestRecord.bind(RecordFactory)
  }),
  limitsRequests: new Paginator({
    recordWrp: RecordFactory.createLimitRequestRecord.bind(RecordFactory)
  }),
  saleCreationRequests: {},
  isInitialized: false
}

const mutations = {
  UPDATE_SALE_REQUEST_LIST (state, tokenCodes) {
    tokenCodes.forEach(code => {
      state.saleCreationRequests[code] = new Paginator({
        recordWrp: (record) => RecordFactory.createSaleCreationRecord(
          record,
          code
        )
      })
    })
  },

  UPDATE_SALE_REQUEST_LIST_ITEM (state, { code, paginator }) {
    const lists = cloneDeep(state.saleCreationRequests)
    lists[code] = paginator
    state.saleCreationRequests = lists
  },

  SET_SALE_REQUEST_LIST_INITIALIZED (state) {
    state.isInitialized = true
  }
}

const actions = {
  INIT_SALE_REQUESTS_LIST ({ commit, rootGetters }) {
    const tokenCodes = Object.keys(rootGetters.accountOwnedTokenCodes)
    commit(vuexTypes.UPDATE_SALE_REQUEST_LIST, tokenCodes)
    commit(vuexTypes.SET_SALE_REQUEST_LIST_INITIALIZED)
  },

  async GET_USER_TOKENS_CREATION_REQUESTS ({ state }) {
    state.tokenCreationRequests.attachInitLoader(() =>
      tokensService.loadTokenCreationRequestsForState()
    )
    return state.tokenCreationRequests.init()
  },

  async NEXT_USER_TOKENS_CREATION_REQUESTS ({ state }) {
    return state.tokenCreationRequests.next()
  },

  async GET_USER_WITHDRAWAL_REQUESTS ({ state }, opts) {
    state.withdrawalUploadRequests.attachInitLoader(
      () => reviewableRequestsService.loadWithdrawalsReviewableRequests(opts)
    )
    return state.withdrawalUploadRequests.init()
  },

  async NEXT_USER_WITHDRAWAL_REQUESTS ({ state }) {
    state.withdrawalRequests.attachInitLoader(
      () => reviewableRequestsService.loadWithdrawalsReviewableRequests()
    )
    return state.withdrawalRequests.next()
  },

  async GET_USER_PREISSUANCE_UPLOAD_REQUESTS ({ state }) {
    state.preIssuanceUploadRequests.attachInitLoader(() =>
      reviewableRequestsService.loadPreIssuanceRequests()
    )
    return state.preIssuanceUploadRequests.init()
  },

  async NEXT_USER_PREISSUANCE_UPLOAD_REQUESTS ({ state }) {
    return state.preIssuanceUploadRequests.next()
  },

  async GET_USER_SALE_CREATION_REQUESTS (
    { state, dispatch, commit },
    tokenCode
  ) {
    if (!state.isInitialized) dispatch(vuexTypes.INIT_SALE_REQUESTS_LIST)
    let paginator
    if (state.saleCreationRequests[tokenCode]) {
      paginator = state.saleCreationRequests[tokenCode]
    } else {
      state.saleCreationRequests[tokenCode] = new Paginator({
        recordWrp: record => RecordFactory.createSaleCreationRecord(
          record, tokenCode
        )
      })
      paginator = state.saleCreationRequests[tokenCode]
    }

    paginator.attachInitLoader(() => salesService.loadSalesRequests(tokenCode))

    await paginator.init()
    commit(vuexTypes.UPDATE_SALE_REQUEST_LIST_ITEM, { tokenCode, paginator })
  },

  async NEXT_USER_SALE_CREATION_REQUESTS (
    { state, commit, dispatch },
    tokenCode
  ) {
    const paginator = state.saleCreationRequests[tokenCode]
    await paginator.next()
    commit(vuexTypes.UPDATE_SALE_REQUEST_LIST_ITEM, paginator)
  },

  async GET_LIMITS_REQUESTS ({ state }) {
    const limitsRequests = state.limitsRequests
    limitsRequests.attachInitLoader(
      reviewableRequestsService.loadLimitsUpdateReviewableRequests.bind(
        reviewableRequestsService
      )
    )
    await limitsRequests.init()
  },

  async NEXT_LIMITS_REQUESTS ({ state }) {
    await state.limitsRequests.next()
  }
}

const getters = {
  tokenCreationRequests: state => state.tokenCreationRequests,
  withdrawalRequests: state => state.withdrawalRequests,
  preIssuanceUploadRequests: state => state.preIssuanceUploadRequests,
  saleCreationRequests: state => state.saleCreationRequests,
  limitsRequests: state => state.limitsRequests.records,
  isLimitsRequestsLoaded: state => state.limitsRequests.isLoaded
}

export default {
  actions,
  getters,
  mutations,
  state
}
