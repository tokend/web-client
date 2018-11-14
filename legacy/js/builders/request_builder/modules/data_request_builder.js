import { RequestBuilder } from '../request_builder'

export class DataRequestBuider extends RequestBuilder {
  constructor (serverUrl) {
    super(serverUrl)
    this.segment = 'data'
  }

  enums () {
    this.filters.push('enums')
    return this
  }
}
