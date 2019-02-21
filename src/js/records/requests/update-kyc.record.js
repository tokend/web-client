import { RequestRecord } from '../request-record'
import _get from 'lodash/get'

export class UpdateKycRequestRecord extends RequestRecord {
  constructor (record) {
    super(record)

    this.accountToUpdateKyc = _get(
      record, 'details.changeRole.destinationAccount'
    )
    this.accountRoleToSet = _get(
      record, 'details.changeRole.accountRoleToSet.int'
    )
    this.accountRoleToSetStr = _get(
      record, 'details.changeRole.accountRoleToSet.string'
    )
    this.kycLevel = _get(record, 'details.changeRole.kycLevel')
    this.blobId = _get(record, 'details.changeRole.creatorDetails.blobId')
    this.allTasks = _get(record, 'details.changeRole.allTasks')
    this.pendingTasks = _get(record, 'details.changeRole.pendingTasks')
    this.sequenceNumber = _get(record, 'details.changeRole.sequenceNumber')
    this.externalDetails = _get(record, 'details.changeRole.externalDetails')
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
