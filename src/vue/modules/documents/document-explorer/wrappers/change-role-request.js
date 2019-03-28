import safeGet from 'lodash/get'

export class ChangeRoleRequest {
  constructor (record) {
    this.createdAt = safeGet(record, 'createdAt')
    this.requestor = safeGet(record, 'requestor.id')
    this.blobId = safeGet(record, 'requestDetails.creatorDetails.blobId')
  }
}
