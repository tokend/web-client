import safeGet from 'lodash/get'

export class Document {
  constructor (id, request, blob) {
    this.id = id

    this.createdAt = safeGet(request, 'createdAt')
    this.owner = safeGet(request, 'requestor')

    const blobValue = JSON.parse(blob.value)

    this.key = safeGet(blobValue, 'file.key')
    this.hash = safeGet(blobValue, 'file.hash')
    this.name = safeGet(blobValue, 'file.name')
    this.mimeType = safeGet(blobValue, 'file.mime_type')
    this.description = safeGet(blobValue, 'description')
  }
}
