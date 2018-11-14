import { RequestBuilder } from '../request_builder'

export class PublicRequestBuilder extends RequestBuilder {
  constructor (serverUrl) {
    super(serverUrl)
    this.segment = 'public'
  }

  ledgers () {
    this.filters.push('ledgers')
    return this
  }
}
