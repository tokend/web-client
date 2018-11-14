import { RequestRecord } from '../request-record'
import _get from 'lodash/get'

export class UpdateKycRequestRecord extends RequestRecord {
  constructor (record) {
    super(record)

    this.accountToUpdateKyc = _get(
      record, 'details.updateKyc.accountToUpdateKyc'
    )
    this.accountTypeToSet = _get(
      record, 'details.updateKyc.accountTypeToSet.int'
    )
    this.accountTypeToSetStr = _get(
      record, 'details.updateKyc.accountTypeToSet.string'
    )
    this.kycLevel = _get(record, 'details.updateKyc.kycLevel')
    this.blobId = _get(record, 'details.updateKyc.kycData.blobId')
    this.allTasks = _get(record, 'details.updateKyc.allTasks')
    this.pendingTasks = _get(record, 'details.updateKyc.pendingTasks')
    this.sequenceNumber = _get(record, 'details.updateKyc.sequenceNumber')
    this.externalDetails = _get(record, 'details.updateKyc.externalDetails')
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
