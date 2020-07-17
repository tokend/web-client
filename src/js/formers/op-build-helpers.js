import { Document } from '@tokend/js-sdk'

/** @returns {Document} */
export function doc (doc) {
  if (doc instanceof Document) {
    return doc
  }

  const newDoc = new Document(doc)
  return newDoc.isUploaded ? newDoc : new Document()
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
