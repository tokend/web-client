import { ExtendableError } from './extendable_error.error'
import { EventDispatcher } from '../events/event_dispatcher'

export class TransactionError extends ExtendableError {
  constructor (message, code) {
    super(`Tx error: ${code}: ${message}`)
    this.errorType = 'TransactionError'
    this.message = message
  }

  showBanner () {
    EventDispatcher.dispatchShowErrorEvent(this.message)
    return true
  }
}
