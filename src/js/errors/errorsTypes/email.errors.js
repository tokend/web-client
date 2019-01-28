import { ExtendableError } from './extendable_error.error'
import { Bus } from '@/js/helpers/event-bus'

export class InvalidEmailError extends ExtendableError {
  constructor () {
    super('InvalidEmailError')
    this.errorType = 'Invalid email error'
  }

  showBanner () {
    Bus.error('Email is invalid in some way')
  }
}

export class RoleEmailError extends ExtendableError {
  constructor () {
    super('RoleEmailError')
    this.errorType = 'Role email error'
  }

  showBanner () {
    Bus.error('Role emails are not allowed')
  }
}

export class DisposableEmailError extends ExtendableError {
  constructor () {
    super('DisposableEmailError')
    this.errorType = 'Disposable email error'
  }

  showBanner () {
    Bus.error('Email is not from allowed domain')
  }
}
