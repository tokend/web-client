import { ExtendableError } from './extendable_error.error'
import { EventDispatcher } from '../events/event_dispatcher'
import { i18n } from '../i18n/index'

export class ExpiredSignatureError extends ExtendableError {
  constructor () {
    super('EmailNotVerifiedError')
    this.errorType = 'Email not verified'
    this.message = i18n.auth_expired_signature()
  }

  showBanner () {
    EventDispatcher.dispatchShowErrorEvent(this.message)
    return true
  }
}
