import { Document } from '@tokend/js-sdk'

export function wrapDocument (document, type) {
  return new Document({
    ...document,
  }, type)
}
