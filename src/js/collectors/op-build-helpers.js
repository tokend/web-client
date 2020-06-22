import { DocumentContainer } from '@/js/helpers/DocumentContainer'

export function doc (doc) {
  if (doc instanceof DocumentContainer) {
    return doc.getDetailsForSave()
  }

  if (DocumentContainer.isDoc(doc)) {
    return new DocumentContainer(doc).getDetailsForSave()
  }

  return DocumentContainer.getEmptyDetailsForSave()
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
