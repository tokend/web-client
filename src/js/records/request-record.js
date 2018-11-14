import { REQUEST_STATES } from '../const/request-states.const'
import _get from 'lodash/get'

export class RequestRecord {
  constructor (record = {}) {
    this._record = record

    this.id = record.id || '0'
    this.requestor = record.requestor
    this.reviewer = record.reviewer
    this.reference = record.reference
    this.rejectReason = record.rejectReason
    this.hash = record.hash
    this.createdAt = record.createdAt
    this.updatedAt = record.updatedAt
    this.state = record.requestState
    this.stateI = record.requestStateI

    this.requestType = _get(record, 'details.requestType')
    this.requestTypeI = _get(record, 'details.requestTypeI')

    this.twoStepWithdrawal = _get(record, 'details.twoStepWithdrawal')
    this.limitsUpdate = _get(record, 'details.limitsUpdate')
    this.amlAlert = _get(record, 'details.amlAlert')
    this.updateSaleDetails = _get(record, 'details.updateSaleDetails')
    this.updateSaleEndTime = _get(record, 'details.updateSaleEndTime')
    this.promotionUpdateRequest = _get(record, 'details.promotionUpdateRequest')
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
