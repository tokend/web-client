import { ExtendableError } from './extendable_error.error'
import { Bus } from '@/js/helpers/event-bus'

export class ExpiredSignatureError extends ExtendableError {
  constructor () {
    super('EmailNotVerifiedError')
    this.errorType = 'Email not verified'
    this.message = 'Expired signature error. Please check if the time on your device is correct and try again'
  }

  showBanner () {
    Bus.error(this.message)
    return true
  }
}
