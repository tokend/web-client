import { RequestRecord } from '../request-record'
import _get from 'lodash/get'

export class ChangeRoleRequestRecord extends RequestRecord {
  constructor (record) {
    super(record)

    this.accountToUpdateRole = _get(
      record, 'requestDetails.accountToUpdateRole'
    )
    this.accountRoleToSet = _get(
      record, 'requestDetails.accountRoleToSet'
    )
    this.blobId = _get(record, 'requestDetails.kycData.blobId')
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
