import { ExtendableError } from './extendable_error.error'
import { EventDispatcher } from '../events/event_dispatcher'
import { i18n } from '../i18n/index'

export class InvalidEmailError extends ExtendableError {
  constructor () {
    super('InvalidEmailError')
    this.errorType = 'Invalid email error'
  }

  showBanner () {
    EventDispatcher.dispatchShowErrorEvent(i18n.auth_invalid_email_error())
  }
}

export class RoleEmailError extends ExtendableError {
  constructor () {
    super('RoleEmailError')
    this.errorType = 'Role email error'
  }

  showBanner () {
    EventDispatcher.dispatchShowErrorEvent(i18n.auth_role_mail_error())
  }
}

export class DisposableEmailError extends ExtendableError {
  constructor () {
    super('DisposableEmailError')
    this.errorType = 'Disposable email error'
  }

  showBanner () {
    EventDispatcher.dispatchShowErrorEvent(i18n.auth_disposable_mail_error())
  }
}
