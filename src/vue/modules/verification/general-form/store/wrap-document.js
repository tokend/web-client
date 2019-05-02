import { DocumentContainer } from '@/js/helpers/DocumentContainer'

export function wrapDocument (document, type) {
  return new DocumentContainer({
    ...document,
    type,
  })
}
