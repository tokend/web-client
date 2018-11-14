import moment from 'moment'

const FORMAT_PRESETS = Object.freeze({
  'Dm': 'DD MMM',
  'DM': 'DD MMMM',
  'DmT': 'DD MMM HH:mm', // TODO: am, pm
  'DmTs': 'DD MMM HH:mm:ss', // TODO: am, pm
  'DMT': 'DD MMMM HH:mm', // TODO: am, pm
  'DMTs': 'DD MMMM HH:mm:ss', // TODO: am, pm
  'Dom': 'Do MMM',
  'DoM': 'Do MMMM',
  'DomT': 'Do MMM HH:mm', // TODO: am, pm
  'DomTs': 'Do MMM HH:mm:ss', // TODO: am, pm
  'DoMT': 'Do MMMM HH:mm', // TODO: am, pm
  'DoMTs': 'Do MMMM HH:mm:ss', // TODO: am, pm
  'Dmy': 'DD MMM YY',
  'DmyT': 'DD MMM YY HH:mm', // TODO: am, pm
  'DmY': 'DD MMM YYYY',
  'DmYT': 'DD MMM YYYY HH:mm' // TODO: am, pm
})

export function formatDate (value, formatPreset) {
  const format = FORMAT_PRESETS[formatPreset]
  if (!format) {
    console.error(
      'formatDate: Unknown format preset.\n' +
      `Possible date presets are: ${Object.keys(FORMAT_PRESETS).join(', ')}`
    )
    return 'Invalid format preset'
  } else {
    return moment(value).format(format)
  }
}
