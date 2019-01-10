import { i18nOptions } from '@/i18n'
import i18next from 'i18next'
import _cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'

export class TestHelper {
  static useTranslations (translations) {
    const options = _cloneDeep(i18nOptions)
    options.lng = 'en'
    options.debug = false
    options.resources.en.translation = translations
    i18next.init(options)
  }

  static resetTranslations () {
    const options = _cloneDeep(i18nOptions)
    options.lng = 'en'
    options.debug = false
    i18next.init(options)
  }

  static getError (constructor) {
    return new constructor({
      status: 0,
      response: {
        data: {
          errors: [{
            title: 'Error',
            detail: 'Mocked error'
          }]
        }
      }
    })
  }

  static isEmittedOnce (wrapper, handlingEvent, eventData) {
    return wrapper.emitted()[handlingEvent] &&
      wrapper.emitted()[handlingEvent].length === 1 &&
      isEqual(wrapper.emitted()[handlingEvent][0][0], eventData)
  }
}
