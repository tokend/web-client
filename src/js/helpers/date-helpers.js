import moment from 'moment'

export function formatDate (date) {
  return moment(date).format('DD.MM.YYYY [at] H:mm')
}

export function formatDateDMY (date) {
  return moment(date).format('DD.MM.YYYY')
}

export function formatDateDMYT (date) {
  return moment(date).format('DD.MM.YYYY [at] H:mm')
}

export function formatCalendar (date) {
  return moment(date).calendar(null, {
    sameDay: '[Today at] H:mm',
    lastDay: '[Yesterday at] H:mm',
    nextDay: '[Tomorrow at] H:mm',
    lastWeek: '[Last] dddd [at] H:mm',
    nextWeek: '[Next] dddd [at] H:mm',
    sameElse: 'MMMM D, YYYY [at] H:mm',
  })
}

export function formatCalendarInline (date) {
  return moment(date).calendar(null, {
    sameDay: '[today at] H:mm',
    lastDay: '[yesterday at] H:mm',
    nextDay: '[tomorrow at] H:mm',
    lastWeek: '[last] dddd [at] H:mm',
    nextWeek: '[next] dddd [at] H:mm',
    sameElse: '[at] MMMM D, YYYY [at] H:mm',
  })
}

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
