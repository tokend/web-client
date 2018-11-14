export const CREATE_TOKEN_REQUEST_STATES = Object.freeze({
  pending: {
    code: 1,
    codeVerbose: 'pending',
    text: 'Pending'
  },
  cancelled: {
    code: 2,
    codeVerbose: 'cancelled',
    text: 'Cancelled'
  },
  approved: {
    code: 3,
    codeVerbose: 'approved',
    text: 'Approved'
  },
  rejected: {
    code: 4,
    codeVerbose: 'rejected',
    text: 'Rejected'
  },
  permanentlyRejected: {
    code: 5,
    codeVerbose: 'permanentlyRejected',
    text: 'Permamnntly rejected'
  }
})
