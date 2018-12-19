import { i18nOptions } from '@/i18n'
import i18next from 'i18next'
import _cloneDeep from 'lodash/cloneDeep'

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
}
