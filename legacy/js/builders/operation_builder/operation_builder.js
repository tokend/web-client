import response from '../response_builder/index'
import { parseError } from '../../parsers/error.parser'
import { createTfaDialog } from '../../modals/tfa_dalog.modal'
import { initHorizonServer } from '../../helpers/server.helper'

export class OperationBuilder {
  constructor () {
    this.operations = []
    this.config = {}
    this.repeatDetails = {}
    this.isRawError = false
  }

  operation () {
    this.operations = []
    return this
  }

  add (operation) {
    if (!operation) return this
    this.operations.push(operation)
    return this
  }

  addMany (operations) {
    if (!operations) return this
    this.operations = operations
    return this
  }

  withRawError () {
    this.isRawError = true
    return this
  }

  submit (source, keypair) {
    const server = initHorizonServer()
    const operations = this.operations
    return server.submitOperationGroup(operations, source, keypair)
      // eslint-disable-next-line promise/prefer-await-to-then
      .then(rawResponse => response.getTransactionResponse(rawResponse))
      .catch(err => this._handleError(err))
  }

  repeat () {
    const server = initHorizonServer()
    const config = this.repeatDetails.config
    const tx = this.repeatDetails.tx
    return server.repeatTransaction(config, tx)
      // eslint-disable-next-line promise/prefer-await-to-then
      .then(rawResponse => response.getTransactionResponse(rawResponse))
      .catch(err => this._handleError(err))
  }

  _handleError (error) {
    const parsedError = parseError(error)
    if (parsedError.message === 'TFA required') {
      this.repeatDetails = error.repeatDetails
      return createTfaDialog(this.repeat.bind(this), parsedError.meta)
    } else {
      return Promise.reject(this.isRawError ? error : parsedError)
    }
  }
}

export const operationBuilder = new OperationBuilder()
