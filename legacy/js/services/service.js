import request from '../builders/request_builder/index'
import store from '../../vuex/index'

import { initHorizonServer } from '../helpers/server.helper'
// eslint-disable-next-line
import { operationBuilder } from '../builders/operation_builder/operation_builder'
import get from 'lodash/get'

export class Service {
  /**
   * Service to work with offers
   * @param [opts]
   * @param {string} [opts.userAccountId]
   * @param {ArrayBuffer} [opts.userKeypair]
   * @param [opts.apiRequestBuilder]
   * @param [opts.horizonRequestBuilder]
   * @param [opts.accountId]
   * @param [opts.keypair]
   */
  constructor (opts) {
    this._apiRequestBuilder = get(opts, 'apiRequestBuilder') || request
    this._horizonRequestBuilder =
      get(opts, 'horizonRequestBuider') || initHorizonServer()
    this._operationBuilder = operationBuilder

    this._overwrittenKeypair = get(opts, 'keypair')
    this._overwrittenAccountId = get(opts, 'accountId')
  }

  get _accountId () {
    return this._overwrittenAccountId || store.getters.accountId
  }

  get _publicKey () {
    return store.getters.accountPublicKey
  }

  get _keypair () {
    return this._overwrittenKeypair || store.getters.accountKeypair
  }

  get _walletId () {
    return store.getters.walletId
  }
}
