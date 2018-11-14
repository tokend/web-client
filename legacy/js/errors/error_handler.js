import _get from 'lodash/get'
import { i18n } from '../i18n/index'
import { EventDispatcher } from '../events/event_dispatcher'

export class ErrorHandler {
  static processUnexpected (error) {
    console.error(error)
    if (error.showBanner) {
      error.showBanner(i18n.unexpected_error())
      return
    }
    EventDispatcher.dispatchShowErrorEvent(i18n.unexpected_error())
  }

  static deriveTxErrorMessages (rawError) {
    return _get(rawError, 'response.data.extras.result_codes.messages', [])
  }
}
