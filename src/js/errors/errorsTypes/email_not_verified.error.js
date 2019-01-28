import { ExtendableError } from './extendable_error.error'

export class EmailNotVerifiedError extends ExtendableError {
  constructor () {
    super('EmailNotVerifiedError')
    this.errorType = 'Email not verified'
  }
}
