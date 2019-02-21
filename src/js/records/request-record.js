import { REQUEST_STATES } from '../const/request-states.const'
import _get from 'lodash/get'

export class RequestRecord {
  constructor (record = {}) {
    this._record = record

    this.id = record.id || '0'
    this.requestor = _get(record, 'requestor.id')
    this.reviewer = _get(record, 'reviewer.id')
    this.reference = record.reference
    this.rejectReason = record.rejectReason
    this.hash = record.hash
    this.createdAt = record.createdAt
    this.updatedAt = record.updatedAt
    this.state = record.state
    this.stateI = record.stateI

    this.requestType = _get(record, 'details.requestType')

    this.twoStepWithdrawal = _get(record, 'details.twoStepWithdrawal')
    this.limitsUpdate = _get(record, 'details.limitsUpdate')
    this.amlAlert = _get(record, 'details.amlAlert')
    this.updateSaleDetails = _get(record, 'details.updateSaleDetails')
    this.updateSaleEndTime = _get(record, 'details.updateSaleEndTime')
    this.promotionUpdateRequest = _get(record, 'details.promotionUpdateRequest')

    this.allTasks = record.allTasks
    this.pendingTasks = record.pendingTasks
    this.externalDetails = record.externalDetails
  }

  get isPending () {
    return this.stateI === REQUEST_STATES.pending
  }
  get isApproved () {
    return this.stateI === REQUEST_STATES.approved
  }
  get isCanceled () {
    return this.stateI === REQUEST_STATES.canceled
  }
  get isRejected () {
    return this.stateI === REQUEST_STATES.rejected
  }
  get isPermanentlyRejected () {
    return this.stateI === REQUEST_STATES.permanentlyRejected
  }
}
