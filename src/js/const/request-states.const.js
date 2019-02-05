export const REQUEST_STATES = Object.freeze({
  pending: 1,
  canceled: 2,
  approved: 3,
  rejected: 4,
  permanentlyRejected: 5,
  waitForAutoApproval: 6,
})

export const REQUEST_STATES_STR = Object.freeze({
  pending: 'pending',
  canceled: 'canceled',
  approved: 'approved',
  rejected: 'rejected',
  permanentlyRejected: 'permanently_rejected',
  waitingForAutoReview: 'waitingForAutoReview',
})
