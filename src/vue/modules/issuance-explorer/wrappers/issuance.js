import _get from 'lodash/get'
import { REQUEST_STATES } from '@/js/const/request-states.const'

export class Issuance {
  constructor (record) {
    this.id = record.id
    this.amount = _get(record, 'requestDetails.amount')
    this.asset = _get(record, 'requestDetails.asset.id')
    this.date = record.createdAt
    this.reference = record.reference
    this.counterparty = _get(record, 'requestDetails.receiver.id')
    this.stateI = record.stateI || record.requestStateI
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
