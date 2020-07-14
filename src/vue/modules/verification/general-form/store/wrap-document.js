import { Document } from '@tokend/js-sdk'
import { DOCUMENT_POLICIES } from '@/js/const/document-policies.const'

export function wrapDocument (document, type) {
  return new Document({
    ...document,
  }, DOCUMENT_POLICIES[type])
}
