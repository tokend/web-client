import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export class DateUtil {
  static _dayjs (date, format) {
    return format ? dayjs(date, format) : dayjs(date)
  }

  /** formatters: **/

  /**
   * Returns provided date in UNIX timestamp (in seconds)
   * @param {string|date} date - date to format
   * @param {string|null} [format] - if date is provided in custom unknown
   * format
   * @returns {string}
   */
  static toTimestamp (date, format = null) {
    return this._dayjs(date, format).unix()
  }
}
