import { RequestBuilder } from '../request_builder'

export class ChartsRequestBuilder extends RequestBuilder {
  constructor (serverUrl) {
    super(serverUrl)
    this.segment = 'charts'
  }

  token (token) {
    this.filters.push(token)
    return this
  }
}
