import Polyglot from 'node-polyglot'
import en from './en'

const locale = 'en'
const translations = { en }
const polyglot = new Polyglot()

polyglot.extend(translations[locale])

export { polyglot }
