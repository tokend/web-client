import { base } from '@tokend/js-sdk'
import { DOCUMENT_POLICIES } from '@/js/const/document-policies.const'

export function doc (doc) {
  if (doc instanceof base.Document) {
    return doc.toJSON()
  }

  if (doc && typeof doc === 'object' && Boolean(doc.file || doc.key)) {
    return new base.Document(doc, DOCUMENT_POLICIES[doc.type]).toJSON()
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
