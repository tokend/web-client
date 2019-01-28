import { ExtendableError } from './extendable_error.error'
import { Bus } from '@/js/helpers/event-bus'

export class TransactionError extends ExtendableError {
  constructor (message, code) {
    super(`Tx error: ${code}: ${message}`)
    this.errorType = 'TransactionError'
    this.message = message
  }

  showBanner () {
    Bus.error(this.message)
    return true
  }
}
