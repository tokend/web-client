import { RequestBuilder } from '../request_builder'

export class UsersRequestBuilder extends RequestBuilder {
  constructor (serverUrl) {
    super(serverUrl)
    this.segment = 'users'
  }

  accountId (accountId) {
    this.filters.push(accountId)
    return this
  }

  documents () {
    this.filters.push('documents')
    return this
  }

  documentId (id) {
    this.filters.push(id)
    return this
  }

  blobs () {
    this.filters.push('blobs')
    return this
  }

  blobID (id) {
    this.filters.push(id)
    return this
  }

  entities () {
    this.filters.push('entities')
    return this
  }

  entity () {
    this.filters.push('entity')
    return this
  }

  entityID (id) {
    this.filters.push(id)
    return this
  }

  favorites () {
    this.filters.push('favorites')
    return this
  }

  favoriteId (id) {
    this.filters.push(id)
    return this
  }
}
