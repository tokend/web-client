// TODO: remove
/* eslint-disable no-unused-vars */

import i18next from 'i18next'
import i18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'

// i18next api:
// https://www.i18next.com/overview/api

import moment from 'moment-timezone'

import _isObject from 'lodash/isObject'
import _get from 'lodash/get'
import _merge from 'lodash/merge'

import { MathUtil } from '@/js/utils'

async function loadLngResources (lang) {
  let result

  switch (lang) {
    case 'en':
      result = _merge(
        (await import(`./resources/en`)).default,
        (await import(`./resources/en.terms`)).default,
        (await import(`./resources/en.pre-issuance-guide`)).default,
        { countries: (await import(`./resources/en.countries`)).default },
      )
      break

    case 'ru':
      result = _merge(
        (await import(`./resources/ru`)).default,
        (await import(`./resources/ru.terms`)).default,
        (await import(`./resources/ru.pre-issuance-guide`)).default,
        { countries: (await import(`./resources/ru.countries`)).default },
      )
      break

    default:
      throw new Error(`loadLngResources: unknown language: ${lang}`)
  }

  return result
}

function parseResource (resource) {
  if (!_isObject(resource)) {
    throw new TypeError(`parseResource(): \`resource\` should be an object, got ${typeof resource}`)
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

function appendLngResources (lang, ...resources) {
  for (const resource of resources) {
    const parsed = parseResource(resource)

    console.log('appendLngResources: lng', lang)
    console.log('appendLngResources: parsed', parsed)

    if (parsed.translations) {
      // i18next.addResources(lang, 'translation', parsed.translations)
      i18next.addResourceBundle(lang, 'translation', parsed.translations,
        true, true
      )
    }

    if (parsed.config) {
      i18next.addResourceBundle(lang, 'config', parsed.config, true, true)
    }

    if (parsed.countries) {
      i18next.addResourceBundle(lang, 'countries', parsed.countries, true, true)
    }
  }
}

function buildI18nOptions () {
  return {
    fallbackLng: 'en',
    debug: true,
    resources: {
      // en: {
      //   translation: {
      //     ...i18n.translations,
      //   },
      //   config: {
      //     ...i18n.config,
      //   },
      // },
      // ru: {
      //   translation: {
      //     ...i18n.translations,
      //   },
      //   config: {
      //     ...i18n.config,
      //   },
      // },
    },
    whitelist: ['en', 'ru'],
    // set to true if you need en-US/en-UK lng's:
    nonExplicitWhitelist: false,
    interpolation: {
      format: (param, format) => {
        const lngConfig = getI18nNamespace('config')

        switch (format.toLowerCase()) {
          case 'date':
            return moment(param)
              .format(_get(lngConfig, 'date.presets.datetime'))
          case 'dmy':
            return moment(param)
              .format(_get(lngConfig, 'date.presets.dmy'))
          case 'dmyt':
            return moment(param)
              .format(_get(lngConfig, 'date.presets.dmyt'))
          case 'calendar':
            return moment(param)
              .calendar(null, _get(lngConfig, 'date.calendar'))
          case 'calendar-inline':
            return moment(param)
              .calendar(null, _get(lngConfig, 'date.calendarInline'))
          case 'money':
            const value = (_isObject(param) ? param.value : param) || '0'
            const defaultFormat =
              _get(lngConfig, 'number.formats.amounts.default')

            const result = MathUtil.format(value, defaultFormat)
            return param.currency ? result.concat(' ', param.currency) : result
          case 'number':
            return MathUtil
              .format(param, _get(lngConfig, 'number.formats.default'))
          case 'integer':
            return MathUtil
              .format(param, _get(lngConfig, 'number.formats.integer'))
          case 'percent':
            const convertedPercent = MathUtil.multiply(param, 100)
            return MathUtil.format(
              convertedPercent,
              _get(lngConfig, 'number.formats.percent')
            )
          default:
            console.warn(`Unknown format: ${format}, skipping…`)
            return param
        }
      },
    },
  }
}

export async function initI18n () {
  // i18next.on('initialized', arg => console.log('init:', arg))
  onI18nLanguageChange(async lng => {
    const lngResources = await loadLngResources(lng)
    appendLngResources(lng, lngResources)
    // i18next.addResource(lng, lngResources)

    console.log('changed:', lng)
    console.log('lngResources:', lngResources)
    console.log(i18next.getDataByLanguage('en'))
    console.log(i18next.getResourceBundle('en', 'config'))
    console.log(i18next.languages)
    console.log(i18next.language)
  })

  i18next
    .use(i18nextBrowserLanguageDetector)
    .init(
      buildI18nOptions(
        await loadLngResources('en')
      )
    )

  console.dir(i18next)
}

const lang = 'en'
export const i18nOptions = buildI18nOptions(
  lang,
  loadLngResources(lang)
)

export function mergeIntoI18nOptions (...localesJson) {
  Object.assign(
    i18nOptions,
    buildI18nOptions(
      lang,
      loadLngResources(lang, ...localesJson)
    )
  )
}

/**
 * Returns resource bundle of a namespace
 *
 * @param {string} namespace allowed values: translation, config, countries
 * @param {string} [language] if not set, the current one will be used
 */
export function getI18nNamespace (namespace, language = '') {
  if (!['translation', 'config', 'countries'].includes(namespace)) {
    throw new Error(`getI18nNamespace(): unknown namespace ${namespace}`)
  }

  const lng = language || i18next.language

  if (i18next.isInitialized) {
    return i18next.getResourceBundle(lng, namespace)
  }

  return {}
}

export function onI18nLanguageChange (handler) {
  i18next.on('languageChanged', handler)
}
