import moment from 'moment'

export function toRFC3339 (date) {
  if (!date) {
    return ''
  }

  // moment don't allow you to format date with "Z" in the end instead of
  // the timezone
  return moment(date).format('YYYY-MM-DDTHH:mm:ss') + 'Z'
}

export function fromRFC3339 (date) {
  if (!date) {
    return ''
  }

  return moment(date).format('YYYY-MM-DD')
}
