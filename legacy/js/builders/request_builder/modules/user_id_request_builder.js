import { RequestBuilder } from '../request_builder'

export class UserIDRequestBuilder extends RequestBuilder {
  constructor (serverUrl) {
    super(serverUrl)
    this.segment = 'user_id'
  }

  forEmail (email) {
    this.addQuery('email', email)
    return this
  }
}
