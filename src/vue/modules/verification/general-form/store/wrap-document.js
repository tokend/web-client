import { base } from '@tokend/js-sdk'

export function wrapDocument (document, type) {
  return new base.Document({
    ...document,
    type,
  })
}
