import { RequestBuilder } from '../request_builder'

export class KDFRequestBuilder extends RequestBuilder {
  constructor (serverUrl) {
    super(serverUrl)
    this.segment = 'kdf'
  }

  forEmail (email) {
    this.addQuery('email', email)
    return this
  }

  isRecovery (isRecovery) {
    this.addQuery('is_recovery', isRecovery)
    return this
  }
}
