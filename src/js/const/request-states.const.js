export const REQUEST_STATES = Object.freeze({
  pending: 1,
  cancelled: 2,
  approved: 3,
  rejected: 4,
  permanentlyRejected: 5,
  waitForAutoApproval: 6
})

export const REQUEST_STATES_STR = Object.freeze({
  pending: 'pending',
  cancelled: 'cancelled',
  approved: 'approved',
  rejected: 'rejected',
  permanentlyRejected: 'permanentlyRejected',
  waitingForAutoReview: 'waitingForAutoReview'
})
