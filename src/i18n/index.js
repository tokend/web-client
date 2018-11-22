import Polyglot from 'node-polyglot'
import en from './en'
import backwards from './backwards'

const locale = 'en'
const translations = { en }
const polyglot = new Polyglot()

polyglot.extend(translations[locale])
polyglot.extend(backwards)

export { polyglot }
