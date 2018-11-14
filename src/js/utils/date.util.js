import moment from 'moment'

const INPUT_DATE_FORMAT = 'DD/MM/YYYY'

export class DateUtil {
  static get ISOFormat () {
    return 'YYYY-MM-DDT00:00:00+00:00'
  }

  /**
   * Returns minimum acceptable date for the app
   * @returns {string}
   */
  static get minDate () {
    return this.toISO('01/01/1900')
  }

  /** formatters: **/

  /**
   * Returns provided date in human-friendly format
   * @param {string|date} date - date to format
   * @param {string|null} [format] - if date is provided in custom unknown
   * format
   * @returns {string}
   */
  static toHuman (date, format = null) {
    return this._moment(date, format).calendar(null, {
      sameDay: '[Today at] HH:mm',
      lastDay: '[Yesterday at] HH:mm',
      lastWeek: '[Last] dddd [at] HH:mm',
      nextWeek: '[Next] dddd [at] HH:mm',
      sameElse: 'DD/MM/YYYY'
    })
  }

  /**
   * Returns provided date in ISO format
   * @param {string|date} date - date to format
   * @param {string|null} [format] - if date is provided in custom unknown
   * format
   * @returns {string}
   */
  static toISO (date, format = null) {
    return this._moment(date, format).format(this.ISOFormat)
  }

  /**
   * Returns provided date in UNIX timestamp (in seconds)
   * @param {string|date} date - date to format
   * @param {string|null} [format] - if date is provided in custom unknown
   * ormat
   * @returns {string}
   */
  static toTimestamp (date, format = null) {
    return this._moment(date, format).format('X')
  }

  /**
   * Returns provided date in miliseconds
   * @param {string|date} date - date to format
   * @param {string|null} [format] - if date is provided in custom unknown
   * format
   * @returns {string}
   */
  static toMs (date, format = null) {
    return this._moment(date, format).format('x')
  }

  /**
   * Returns provided date in input format
   * @param {string|date} date - date to format
   * @param {string|null} [format] - if date is provided in custom unknown
   * format
   * @returns {string}
   */
  static toInput (date, format = null) {
    return this._moment(date, format).format(INPUT_DATE_FORMAT)
  }

  static _moment (date, format) {
    if (format) {
      return moment(date, format)
    }
    return moment(date)
  }
}
