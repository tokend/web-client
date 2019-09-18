import { REQUEST_STATES } from '@/js/const/request-states.const'
import safeGet from 'lodash/get'

export class Request {
  constructor (record) {
    this.id = record.id

    this.createdAt = record.createdAt
    this.updatedAt = record.updatedAt

    this.requestor = safeGet(record, 'requestor.id')
    this.hash = record.hash
    this.pendingTasks = record.pendingTasks

    this.stateI = record.stateI || safeGet(record, 'status.value')
    this.typeI = safeGet(record, 'xdrType.value')
    this.rejectReason = record.rejectReason
  }

  get isApproved () {
    return this.stateI === REQUEST_STATES.approved
  }

  get isPending () {
    return this.stateI === REQUEST_STATES.pending
  }

  get isRejected () {
    return this.stateI === REQUEST_STATES.rejected
  }

  get isPermanentlyRejected () {
    return this.stateI === REQUEST_STATES.permanentlyRejected
  }

  get isCanceled () {
    return this.stateI === REQUEST_STATES.canceled
  }
}
