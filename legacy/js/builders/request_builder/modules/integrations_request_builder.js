import { RequestBuilder } from '../request_builder'

export class IntegrationsRequestBuilder extends RequestBuilder {
  constructor (serverUrl) {
    super(serverUrl)
    this.segment = 'integrations'
  }

  discourse () {
    this.filters.push('discourse-sso')
    return this
  }
}
