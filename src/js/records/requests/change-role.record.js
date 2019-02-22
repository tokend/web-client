import { RequestRecord } from '../request-record'
import _get from 'lodash/get'

export class ChangeRoleRequestRecord extends RequestRecord {
  constructor (record) {
    super(record)

    this.accountToUpdateRole = _get(
      record, 'included[0].relationships.accountToUpdateRole.data.id'
    )
    this.accountRoleToSet = String(_get(
      record, 'included[0].attributes.accountRoleToSet'
    ))
    this.blobId = _get(record, 'included[0].attributes.kycData.blobId')
    this.externalDetails = _get(record, 'data[0].attributes.externalDetails.data')
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
