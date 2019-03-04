import { REQUEST_STATES } from '@/js/const/request-states.const'

export class AssetCreationRequest {
  constructor (record) {
    this.id = record.id
    this.assetCode = record.reference

    this.createdAt = record.createdAt
    this.updatedAt = record.updatedAt

    this.state = record.state
    this.stateI = record.stateI
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
