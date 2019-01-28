import _get from 'lodash/get'
import { Bus } from '@/js/helpers/event-bus'

export class ErrorHandler {
  static processUnexpected (error) {
    console.error(error)
    if (error.showBanner) {
      error.showBanner('Something went wrong. Please try again later')
      return
    }
    Bus.error('Something went wrong. Please try again later')
  }

  static deriveTxErrorMessages (rawError) {
    return _get(rawError, 'response.data.extras.result_codes.messages', [])
  }
}
