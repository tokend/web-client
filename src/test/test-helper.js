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

  static isFieldValid (componentWrapper, invalidFieldName, invalidFieldValue) {
    componentWrapper.setData({
      form: {
        [invalidFieldName]: invalidFieldValue
      }
    })

    const field = componentWrapper.vm.$v.form[invalidFieldName]
    field.$touch()
    return !field.$invalid
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
