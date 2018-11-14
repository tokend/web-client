import { RequestBuilder } from '../request_builder'

export class WalletRequestBuilder extends RequestBuilder {
  constructor (serverUrl) {
    super(serverUrl)
    this.segment = 'wallets'
  }

  factors () {
    this.filters.push('factors')
    return this
  }

  factorId (id) {
    this.filters.push('factors')
    this.filters.push(id)
    return this
  }

  verification () {
    this.filters.push('verification')
    return this
  }

  walletId (id) {
    this.filters.push(id)
    return this
  }
}
