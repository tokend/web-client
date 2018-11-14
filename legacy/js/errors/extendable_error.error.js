import { EventDispatcher } from '../events/event_dispatcher'

export class ExtendableError extends Error {
  constructor (message) {
    super(message)
    this.name = this.constructor.name

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = (new Error(message)).stack
    }
  }

  showBanner (message) {
    EventDispatcher.dispatchShowErrorEvent(message)
  }
}
