import { base } from '@tokend/js-sdk'

export function doc (doc) {
  if (doc instanceof base.Document) {
    return doc.toJSON()
  }

  if (base.Document.isDoc(doc)) {
    return new base.Document(doc).toJSON()
  }

  return new base.Document().toJSON()
}

export function reqId (val) {
  return String(val || 0) // '0' - for new requests
}

export function str (val) {
  if (val === 0) return '0'
  return String(val || '') // cuz String(undefined) returns 'undefined'
}

export function num (val) {
  return Number(val || 0)
}
