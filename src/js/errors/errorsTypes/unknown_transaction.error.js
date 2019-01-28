import { ExtendableError } from './extendable_error.error'

export class UnknownTransactionError extends ExtendableError {
  constructor () {
    super('Unknown transaction')
    this.errorType = 'UnknownTransactionError'
  }
}
