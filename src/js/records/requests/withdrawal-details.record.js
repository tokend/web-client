import _get from 'lodash/get'
import { REQUEST_STATES } from '@/js/const/request-states.const'

export class WithdrawalDetailsRequestRecord {
  constructor (record = {}) {
    this.id = record.id || '0'
    this.requestor = _get(record, 'requestor.id')
    this.rejectReason = record.rejectReason
    this.hash = record.hash
    this.createdAt = record.createdAt
    this.updatedAt = record.updatedAt
    this.state = record.state
    this.stateI = record.stateI
    this.pendingTasks = record.pendingTasks

    this.amount = _get(record, 'requestDetails.amount')
    this.fixedFee = _get(record, 'requestDetails.fee.fixed')
    this.percentFee = _get(record, 'requestDetails.fee.calculatedPercent')
    this.address = _get(record, 'requestDetails.creatorDetails.address')
    this.balanceId = _get(record, 'requestDetails.balance.id')
  }

  get isPending () {
    return this.stateI === REQUEST_STATES.pending
  }
  get isApproved () {
    return this.stateI === REQUEST_STATES.approved
  }
  get isPermanentlyRejected () {
    return this.stateI === REQUEST_STATES.permanentlyRejected
  }
  get isRejected () {
    return this.stateI === REQUEST_STATES.rejected
  }
}
