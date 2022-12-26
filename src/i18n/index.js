import i18next from 'i18next'
import i18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'

// i18next api:
// https://www.i18next.com/overview/api

// list of iso639 codes on wiki
// https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes

// TODO: make i18n.language and i18n.languages responsive

import _isObject from 'lodash/isObject'
import _merge from 'lodash/merge'

class I18n {
  constructor () {
    this._i18nextInstance = i18next.createInstance()
    this._i18nextConfig = this._buildDefaultConfig()
    this._languageChangeListeners = []
  }

  async init () {
    await this._i18nextInstance
      .use(i18nextBrowserLanguageDetector)
      .init(this._i18nextConfig)

    // on init, i18n detected and set language, now we should apply it
    await this.changeLanguage(this.language)
  }

  async changeLanguage (lng) {
    if (!this._i18nextInstance.options.resources[lng]) {
      const lngResources = await this._loadResources(lng)
      this._appendResources(lng, lngResources)
    }

    this._i18nextInstance.changeLanguage(lng)
    this._languageChangeListeners.forEach(cb => cb(lng))
  }

  async _loadResources (lang) {
    let result

    // TODO: replace require.ensures with imports

    switch (lang) {
      case 'en':
        result = _merge(
          await require.ensure([], require => require('./resources/en')),
          await require.ensure([], require => require('./resources/en.terms')),
          await require.ensure([], require => require('./resources/en.pre-issuance-guide')),
          await require.ensure([], require => require('./resources/en.countries')),
        )
        break

      case 'ru':
        result = _merge(
          await require.ensure([], require => require('./resources/ru')),
          await require.ensure([], require => require('./resources/ru.terms')),
          await require.ensure([], require => require('./resources/ru.pre-issuance-guide')),
          await require.ensure([], require => require('./resources/ru.countries')),
        )
        break

      default:
        throw new Error(`I18n._loadResources(): unknown language: ${lang}`)
    }

    return result
  }

  _appendResources (lang, ...resources) {
    for (const resource of resources) {
      const parsed = this._parseResource(resource)

      if (parsed.translations) {
        this._i18nextInstance.addResourceBundle(
          lang, 'translation', parsed.translations, true, true
        )
      }

      if (parsed.config) {
        this._i18nextInstance.addResourceBundle(
          lang, 'config', parsed.config, true, true
        )
      }

      if (parsed.countries) {
        this._i18nextInstance.addResourceBundle(
          lang, 'countries', parsed.countries, true, true
        )
      }
    }
  }

  _parseResource (resource) {
    if (!_isObject(resource)) {
      throw new TypeError(`I18n._parseResource(): 'resource' should be an object, got ${typeof resource}`)
    }

    let result = {}

    if (resource.translations) {
      result.translations = resource.translations
    }

    if (resource.config) {
      result.config = resource.config
    }

    if (resource.countries) {
      result.countries = resource.countries
    }

    return result
  }

  onLanguageChanged (listener) {
    if (typeof listener !== 'function') {
      throw new TypeError(`onLanguageChanged(): expect 'listener' to be a function, got ${typeof listener}`)
    }

    this._languageChangeListeners.push(listener)

    // subscription remover
    return () => {
      this._languageChangeListeners = this._languageChangeListeners
        .filter(item => item !== listener)
    }
  }

  get languages () {
    return this._i18nextInstance.options.whitelist
      .filter(item => item !== 'cimode')
  }

  get language () {
    return this._i18nextInstance.language
  }

  t (...args) {
    return this._i18nextInstance.t(...args)
  }

  getFixedT (...args) {
    return this._i18nextInstance.getFixedT(...args)
  }

  exists (...args) {
    return this._i18nextInstance.exists(...args)
  }

  _buildDefaultConfig () {
    return {
      fallbackLng: 'en',
      debug: false,
      resources: {},
      whitelist: ['en', 'ru'],
      // set to true if you need en-US/en-UK lng's:
      nonExplicitWhitelist: false,
      interpolation: {
        format: (param, format) => {
          switch (format.toLowerCase()) {
            default:
              console.warn(`Unknown format: ${format}, skipping…`)
              return param
          }
        },
      },
    }
  }
}

export const i18n = new I18n()
export { default as i18nComponent } from './i18n-component'
