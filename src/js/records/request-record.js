import { REQUEST_STATES } from '../const/request-states.const'
import get from 'lodash/get'

export class RequestRecord {
  constructor (record = {}) {
    this._record = record

    this.id = record.id || '0'
    this.state = record.state || record.requestState
    this.stateI = record.stateI || record.requestStateI
    this.typeI = get(record, 'xdrType.value')

    this.createdAt = record.createdAt
    this.updatedAt = record.updatedAt
    this.requestor = get(record, 'requestor.id')
    this.reference = record.reference
    this.rejectReason = record.rejectReason

    this.hash = record.hash
    this.pendingTasks = record.pendingTasks
  }

  // Returns id to update. If the request is not updatable, '0' returned.
  get updatableId () {
    const isUpdatable = this.isPending || this.isRejected
    return isUpdatable ? String(this.id) : '0'
  }

  get isExists () {
    return this.id && typeof this.id === 'string' && this.id !== '0'
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
