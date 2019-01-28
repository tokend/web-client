import { ExtendableError } from './extendable_error.error'

export class WrongPasswordError extends ExtendableError {
  constructor () {
    super('Wrong password')
    this.errorType = 'WRONG_PASSWORD'
  }
}
