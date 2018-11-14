import { dispatchAppEvent } from './helpers'
import { commonEvents } from './common_events'

const duration = 7000

export class EventDispatcher {
  static dispatchShowSnackbarEvent (config) {
    dispatchAppEvent(commonEvents.showSnackbarEvent, config)
  }

  static dispatchShowLoaderEvent () {
    dispatchAppEvent(commonEvents.showLoaderEvent)
  }

  static dispatchHideLoaderEvent () {
    dispatchAppEvent(commonEvents.hideLoaderEvent)
  }

  static dispatchShowErrorEvent (msg) {
    const config = {
      position: 'center',
      isInfinity: false,
      showButton: false,
      type: 'success',
      duration,
      msg
    }
    dispatchAppEvent(commonEvents.showSnackbarEvent, config)
  }

  static dispatchShowSuccessEvent (msg) {
    const config = {
      position: 'center',
      isInfinity: false,
      showButton: true,
      btnText: 'Close',
      type: 'error',
      duration,
      msg
    }
    dispatchAppEvent(commonEvents.showSnackbarEvent, config)
  }
}
