import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import duration from 'dayjs/plugin/duration'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import calendar from 'dayjs/plugin/calendar'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isBetween from 'dayjs/plugin/isBetween'
import updateLocale from 'dayjs/plugin/updateLocale'
import timezone from 'dayjs/plugin/timezone'

import ru from 'dayjs/locale/ru'

dayjs.extend(utc)
dayjs.extend(duration)
dayjs.extend(customParseFormat)
dayjs.extend(calendar)
dayjs.extend(isSameOrAfter)
dayjs.extend(isBetween)
dayjs.extend(updateLocale)
dayjs.extend(timezone)

dayjs.updateLocale('ru', {
  weekdays: [
    'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота',
  ],
  calendar: {
    lastDay: '[Вчера в] H:mm',
    sameDay: '[Сегодня в] H:mm',
    nextDay: '[Завтра в] H:mm',
    lastWeek: function () {
      const format = 'dddd H:mm'
      switch (this.day()) {
        case 0:
          return `Прошлое ${this.format(format).toLowerCase()}`
        case 3:
        case 5:
        case 6:
          return `Прошлая ${this.format(format).toLowerCase()}`
        default:
          return `Прошлый ${this.format(format).toLowerCase()}`
      }
    },
    nextWeek: 'dddd H:mm',
    sameElse: 'D MMMM YYYY HH:mm',
  },
})

const LOCALES = {
  ru,
}

export class DateUtil {
  static _dayjs (date, format) {
    return format ? dayjs(date, format) : dayjs(date)
  }

  /**
   * Returns date instance of DateUtil
   * @param {string|date|object} [date] - date
   * @param {string} [format] - if date is provided in custom unknown
   * format
   * @returns {object}
   */
  static date (date, format) {
    return this._dayjs(date, format)
  }

  /**
   * Returns date instance of DateUtil in utc mode
   * The local time will be kept
   * @param {string|date|object} [date] - date
   * @param {string} [format] - if date is provided in custom unknown
   * format
   * @returns {object}
   */
  static utc (date, format) {
    return this._dayjs(date, format).utc(true)
  }

  /**
   * Returns a new date instance of DateUtil in the given timezone
   * @param {string|date|object} [date] - date
   * @param {string} [timezone] - your custom timezone
   * @returns {object}
   */
  static tz (date, timezone) {
    return dayjs.tz(date, timezone)
  }

  /**
   * Returns new duration instance of DateUtil
   * @param {object} units - config with units as keys
   * @returns {object}
   */
  static duration (units) {
    return dayjs.duration(units)
  }

  /**
   * Returns milliseconds of duration instance of DateUtil
   * @param {object} duration - duration instance
   * @returns {number}
   */
  static millisecondOf (duration) {
    return duration.asMilliseconds()
  }

  /** formatters: **/

  /**
   * Returns date in given format
   * @param {string|date|object} date - date to format
   * @param {string} format - format, e.g. 'MM-DD-YYYY HH:mm:ss'
   * @returns {string}
   */
  static format (date, format) {
    return this._dayjs(date).format(format)
  }

  /**
   * Returns provided date in UNIX timestamp (in seconds)
   * @param {string|date|object} [date] - date to format
   * @param {string} [format] - if date is provided in custom unknown
   * format
   * @returns {string}
   */
  static toTimestamp (date, format) {
    return this._dayjs(date, format).unix()
  }

  /**
   * Return instance of the native Date object
   * @param {string|date|object} [date] - date to format
   * @param {string} [format] - if date is provided in custom unknown
   * format
   * @returns {date}
   */
  static toDate (date, format) {
    return this._dayjs(date, format).toDate()
  }

  /**
   * Returns date as string in ISO 8601 utc format
   * @param {string|date|object} [date] - date to format
   * @param {string} [format] - if date is provided in custom unknown
   * format
   * @returns {string}
   */
  static toISO (date, format) {
    return this._dayjs(date, format).toISOString()
  }

  /**
   * Returns utc date as string in RFC 3399 utc format
   * The local time will be kept
   * @param {string|date|object} [date] - date to format
   * @returns {object}
   */
  static toRFC3339 (date) {
    if (!date) {
      return ''
    }

    return this._dayjs(date).utc(true).format('YYYY-MM-DDTHH:mm:ss') + 'Z'
  }

  /**
   * Returns provided date in human-friendly format
   * @param {string|date|object} [date] - date to format
   * @param {string} [format] - if date is provided in custom unknown
   * format
   * @param {object} [calendar] - config of specifying calendar output formats,
   * e.g. { nextDay: '[Tomorrow]' }
   * @returns {string}
   */
  static toHuman (date, format, calendar) {
    return this._dayjs(date, format).calendar(dayjs.tz(), calendar)
  }

  /**
   * Returns the difference between two date-time in the specified unit
   * Default: returns difference in the milliseconds
   * @param {string|number|date|object} [targetDate] - target date
   * @param {string|number|date|object} [comparisonDate] - comparison date
   * @param {string} [unit] - string of unit time (e.g. 'year')
   * @param {boolean} [isFloat] - set it if you want a floating point number
   * @returns {number}
   */
  static diff (targetDate, comparisonDate, unit, isFloat = false) {
    return this._dayjs(targetDate).diff(
      this._dayjs(comparisonDate), unit, isFloat
    )
  }

  /** queries: **/

  /**
   * Returns true/false depending on whether the target date is earlier than the
   * comparison date
   * @param {string|number|date|object} [targetDate] - target date
   * @param {string|number|date|object} [comparisonDate] - comparison date
   * @returns {boolean}
   */
  static isBefore (targetDate, comparisonDate) {
    return this._dayjs(targetDate).isBefore(comparisonDate)
  }

  /**
   * Returns true/false depending on whether the target date is later than the
   * comparison date
   * @param {string|number|date|object} [targetDate] - target date
   * @param {string|number|date|object} [comparisonDate] - comparison date
   * @returns {boolean}
   */
  static isAfter (targetDate, comparisonDate) {
    return this._dayjs(targetDate).isAfter(comparisonDate)
  }

  /**
   * Returns true/false depending on whether the target date is same or is later
   * than the comparsion date
   * @param {string|number|date|object} [targetDate] - target date
   * @param {string|number|date|object} [comparisonDate] - comparison date
   * @returns {boolean}
   */
  static isSameOrAfter (targetDate, comparisonDate) {
    return this._dayjs(targetDate).isSameOrAfter(comparisonDate)
  }

  /**
   * Returns true/false depending on whether the target date is in the given
   * range
   * @param {string|number|date|object} [targetDate] - target date
   * @param {string|number|date|object} [startDate] - start date of range
   * @param {string|number|date|object} [endDate] - end date of range
   * @param {string} [unit] - string of unit time (e.g. 'year')
   * @param {string} [inclusivity] - inclusivity, e.g.
   * '()' or '[)' or '(]' or '[]'
   * @returns {boolean}
   */
  static isBetween (targetDate, startDate, endDate, unit, inclusivity) {
    return this._dayjs(targetDate).isBetween(
      startDate, endDate, unit, inclusivity
    )
  }

  /** manipulations: **/

  /**
   * Returns a cloned instance of DateUtil and set it to the start of a unit
   * of time
   * @param {string} unit - string of unit time (e.g. 'year')
   * @param {string|number|date|object} [date] - date to manipulate
   * @param {string} [format] - if date is provided in custom unknown
   * format
   * @returns {object}
   */
  static startOf (unit, date, format) {
    return this._dayjs(date, format).startOf(unit)
  }

  /**
   * Returns a new date instance of DateUtil by adding time unit to date
   * @param {string|number|date|object} targetDate - target date
   * @param {number} value - amount of time unit
   * @param {string} [unit] - string of unit time (e.g. 'year')
   * @returns {object}
   */
  static add (targetDate, value, unit) {
    return this._dayjs(targetDate).add(value, unit)
  }

  /**
   * Returns a new date instance of DateUtil by subtracting time unit from date
   * @param {string|number|date|object} targetDate - target date
   * @param {number} value - amount of time unit
   * @param {string} [unit] - string of unit time (e.g. 'year')
   * @returns {object}
   */
  static subtract (targetDate, value, unit) {
    return this._dayjs(targetDate).subtract(value, unit)
  }

  /**
   * Sets a new locale and returns the name of new locale
   * @param {string|object} [preset] - a name of the new locale to set
   * the locale from a preset, or an object with its own locale properties
   * @param {object} [object] - object with own locale properties in case
   * if name of locale defined by first parameter
   * @param {boolean} [isLocal]
   * @returns {string}
   */
  static locale (preset, object, isLocal = false) {
    return !object && typeof preset === 'string'
      ? dayjs.locale(LOCALES[preset])
      : dayjs.locale(preset, object, isLocal)
  }

  /**
   * Change default timezone from local time zone to your custom timezone
   * @param {string} [timezone] - your custom timezone
   */
  static setDefaultTimezone (timezone) {
    dayjs.tz.setDefault(timezone)
  }
}
