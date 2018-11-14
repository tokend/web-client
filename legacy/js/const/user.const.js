export const userStates = Object.freeze({
  nil: 'nil',
  waitingForApproval: 'waiting_for_approval',
  approved: 'approved',
  rejected: 'rejected'
})

export const userTypes = Object.freeze({
  general: 'general',
  syndicate: 'syndicate'
})

export const userStatesNum = Object.freeze({
  nil: 1,
  waitingForApproval: 2,
  approved: 4,
  rejected: 8
})
