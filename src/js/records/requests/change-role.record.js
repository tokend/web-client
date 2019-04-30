import _get from 'lodash/get'

export class ChangeRoleRequestRecord {
  constructor (record) {
    this._record = record

    this.id = record.id || '0'
    this.requestor = _get(record, 'requestor.id')
    this.reviewer = _get(record, 'reviewer.id')
    this.reference = record.reference
    this.rejectReason = record.rejectReason
    this.resetReason = _get(
      record, 'requestDetails.creatorDetails.resetReason'
    )
    this.blockReason = _get(
      record, 'requestDetails.creatorDetails.blockReason'
    )

    this.relatedRequestId = _get(
      record, 'requestDetails.creatorDetails.latestApprovedRequestId'
    )

    this.creatorDetails = _get(record, 'requestDetails.creatorDetails')

    this.hash = record.hash
    this.createdAt = record.createdAt
    this.updatedAt = record.updatedAt
    this.state = record.state
    this.stateI = record.stateI

    this.requestType = _get(record, 'requestDetails.type')

    this.allTasks = record.allTasks
    this.pendingTasks = record.pendingTasks
    this.externalDetails = record.externalDetails

    this.accountToUpdateRole = _get(
      record, 'requestDetails.accountToUpdateRole.id'
    )

    this.accountRoleToSet = _get(record, 'requestDetails.accountRoleToSet')
    this.blobId = _get(record, 'requestDetails.creatorDetails.blobId')
    this.externalDetails = (_get(record, 'externalDetails.data') || [])
      .slice() // to avoid modifying record itself
      .pop() // because only the last object in external details
  }

  get rejector () {
    if (!this.externalDetails || !this.externalDetails.length) return
    for (const detail of this.externalDetails.slice().reverse()) {
      if (detail.rejector) {
        return detail.rejector
      }
    }
    return ''
  }
}
