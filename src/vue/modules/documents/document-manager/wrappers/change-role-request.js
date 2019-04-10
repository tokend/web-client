import safeGet from 'lodash/get'

export class ChangeRoleRequest {
  constructor (rawRequest) {
    this.createdAt = safeGet(rawRequest, 'createdAt')
    this.requestor = safeGet(rawRequest, 'requestor.id')
    this.blobId = safeGet(rawRequest, 'requestDetails.creatorDetails.blobId')
  }
}
