import { REQUEST_STATES } from '../const/const'

export class RequestRecord {
  constructor (record = {}) {
    this._record = record

    this.id = record.id || '0'
    this.requestor = record.requestor
    this.reviewer = record.reviewer
    this.reference = record.reference
    this.rejectReason = record.reject_reason
    this.hash = record.hash
    this.createdAt = record.created_at
    this.updatedAt = record.updated_at
    this.state = record.request_state
    this.stateI = record.request_state_i
  }

  get isPending () {
    return this.stateI === REQUEST_STATES.pending
  }
  get isApproved () {
    return this.stateI === REQUEST_STATES.approved
  }
  get isCancelled () {
    return this.stateI === REQUEST_STATES.cancelled
  }
  get isRejected () {
    return this.stateI === REQUEST_STATES.rejected
  }
  get isPermanentlyRejected () {
    return this.stateI === REQUEST_STATES.permanentlyRejected
  }
}
