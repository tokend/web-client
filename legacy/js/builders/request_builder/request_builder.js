import Vue from 'vue'
import store from '../../../vuex/index'

import { parseError } from '../../parsers/error.parser'
import { createTfaDialog } from '../../modals/tfa_dalog.modal'
import { createPasswordDialog } from '../../modals/password_dialog.modal'
import { initHorizonServer } from '../../helpers/server.helper'
import { errors } from '../../errors/factory'
import { vuexTypes } from '../../../vuex/types'
import response from '../response_builder/index'
import common from '../../services/common/common'

import { i18n } from '../../i18n/index'
import { EventDispatcher } from '../../events/event_dispatcher'
import { factorsService } from '../../services/factors.service'
import { WalletHelper } from '../../helpers/wallet.helper'
import set from 'lodash/set'
import get from 'lodash/get'

export class RequestBuilder {
  constructor (serverUrl) {
    this.url = `${serverUrl}/`
    this.segment = ''
    this.filters = []
    this.params = {}
    this.method = ''
    this.httpClient = Vue.http
    this.query = []
    this.config = {}
    this.currentPassword = ''
  }

  trashConfig (currentPassword) {
    this.currentPassword = currentPassword
    return this
  }

  sign (keypair) {
    this.config = initHorizonServer()._getConfig(this._getPrefix(), keypair)
    return this
  }

  header (header, value) {
    set(this.config, `headers[${header}]`, value)
    return this
  }

  setParams (params) {
    this.params = params
    return this
  }

  data (data) {
    this.params = { data }
    return this
  }

  dataItem (key, item) {
    set(this.params, `data[${key}]`, item)
    return this
  }

  attributes (attributes) {
    set(this.params, `data.attributes`, attributes)
    return this
  }

  attribute (key, attribute) {
    set(this.params, `data.attributes[${key}]`, attribute)
    return this
  }

  relationships (relationships) {
    set(this.params, `data.relationships`, relationships)
    return this
  }

  relationship (key, relationship) {
    set(this.params, `data.relationships[${key}]`, relationship)
    return this
  }

  type (type) {
    set(this.params, 'data.type', type)
    return this
  }

  json () {
    return this.header('Content-Type', 'application/json')
  }

  segment (segment) {
    this.segment = segment
    return this
  }

  get () {
    this.method = 'get'
    return this.httpClient.get(this._composeURL(), this.config)
      // eslint-disable-next-line promise/prefer-await-to-then
      .then(response => this._parseResponse(response))
      .catch(err => this._handleError(err))
  }

  post () {
    this.method = 'post'
    const password = get(this.params, 'data.password', '')
    return this.httpClient.post(this._composeURL(), this.params, this.config)
      // eslint-disable-next-line promise/prefer-await-to-then
      .then(response => this._parseResponse(response))
      .catch(err => this._handleError(err, password))
  }

  put () {
    this.method = 'put'
    return this.httpClient.put(this._composeURL(), this.params, this.config)
      // eslint-disable-next-line promise/prefer-await-to-then
      .then(response => this._parseResponse(response))
      .catch(err => this._handleError(err, this.currentPassword))
  }

  patch () {
    this.method = 'patch'
    const password = get(this.params, 'data.password', '')
    return this.httpClient.patch(this._composeURL(), this.params, this.config)
      // eslint-disable-next-line promise/prefer-await-to-then
      .then(response => this._parseResponse(response))
      .catch(err => this._handleError(err, password))
  }

  delete () {
    this.method = 'delete'
    const password = get(this.params, 'data.password', '')
    return this.httpClient.delete(this._composeURL(), this.config)
      // eslint-disable-next-line promise/prefer-await-to-then
      .then(response => this._parseResponse(response))
      .catch(err => this._handleError(err, password))
  }

  addQuery (key, value) {
    this.query.push({ key, value })
    return this
  }

  _getQuery () {
    if (this.query.length === 0) return ''
    return `?${this.query.map(param => `${param.key}=${param.value}`).join('&')}`
  }

  _composeURL () {
    return `${this.url}${this.filters.reduce((url, filter) => url.concat(`/${filter}`), this.segment)}${this._getQuery()}`
  }

  _getPrefix () {
    return `/${this.filters.reduce((url, filter) => url.concat(`/${filter}`), this.segment)}${this._getQuery()}`
  }

  async _handleError (error, password) {
    const parsedError = parseError(error)
    switch (parsedError.constructor) {
      case errors.OtpError:
        return createTfaDialog(this.repeat.bind(this), parsedError.meta)

      case errors.PasswordFactorError:
        const email = store.getters[vuexTypes.userEmail]
        const kdf = await common.getWalletKDF(email)
        if (password) {
          const opts = {
            ...parsedError.meta
          }
          const keychainData = opts.keychainData
          const factorId = opts.factorId
          const token = opts.token
          const salt = opts.salt
          const kdfAttr = kdf.attributes()

          const { walletKey } = WalletHelper.calculateWalletParams(
            password,
            email,
            salt,
            kdfAttr
          )
          const signedToken = WalletHelper.signToken(
            token,
            keychainData,
            walletKey
          )
          try {
            await factorsService.verifyFactor(factorId, token, signedToken)
            return this.repeat()
          } catch (error) {
            console.error(error)
            EventDispatcher.dispatchShowErrorEvent(i18n.unexpected_error())
          }
        } else {
          return createPasswordDialog(
            this.repeat.bind(this), {
              ...parsedError.meta,
              kdf: kdf.attributes(),
              email
            })
        }
        break
      default:
        return Promise.reject(parsedError)
    }
  }

  _parseResponse (rawResponse) {
    return response.getCommonResponse(rawResponse)
  }

  repeat () {
    const params = this.method === 'get' || this.method === 'delete'
      ? [this._composeURL(), this.config]
      : [this._composeURL(), this.params, this.config]

    return this.httpClient[this.method](...params)
      // eslint-disable-next-line promise/prefer-await-to-then
      .then(response => this._parseResponse(response))
      .catch(err => this._handleError(err))
  }
}
