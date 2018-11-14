import moment from 'moment'

export class DateHelper {
  static toIso (date) {
    if (!date) return ''
    return (new Date(date)).toISOString()
  }

  static toTimestamp (date) {
    return '' + moment(date).utc().format('X')
  }
}
