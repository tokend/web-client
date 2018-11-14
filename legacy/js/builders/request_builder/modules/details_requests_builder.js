import { RequestBuilder } from '../request_builder'

export class DetailsRequestBuilder extends RequestBuilder {
  constructor (serverUrl) {
    super(serverUrl)
    this.segment = 'details'
  }
}
