import { REQUEST_STATES } from '@/js/const/request-states.const'

export class WithdrawalRequest {
  constructor (record) {
    this.state = record.stateI
  }

  get isApproved () {
    return this.state === REQUEST_STATES.approved
  }

  get isRejected () {
    return this.state === REQUEST_STATES.rejected ||
      this.state === REQUEST_STATES.permanentlyRejected
  }
}
