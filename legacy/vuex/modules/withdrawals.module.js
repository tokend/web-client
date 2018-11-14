import { reviewableRequestsService } from '../../js/services/reviewable_requests.service'
import { RecordFactory } from '../../js/records/factory'
import { Paginator } from '../../js/helpers/paginator'

const state = {
  withdrawals: new Paginator(
    RecordFactory.createWithdrawRecord.bind(RecordFactory)
  )
}

const actions = {
  async GET_ALL_WITHDRAWALS ({ state }) {
    const withdrawalsPaginator = state.withdrawals
    withdrawalsPaginator.attachInitLoader(
      reviewableRequestsService
        .loadWithdrawalsReviewableRequests
        .bind(reviewableRequestsService)
    )
    await withdrawalsPaginator.init()
  },

  async NEXT_WITHDRAWALS ({ state }) {
    const withrawalsPaginator = state.withdrawals
    await withrawalsPaginator.next()
  }
}

const getters = {
  withdrawals: state => state.withdrawals.records,
  isWithdrawalsLoaded: state => state.withdrawals.isLoaded
}

export default {
  actions,
  getters,
  state
}
