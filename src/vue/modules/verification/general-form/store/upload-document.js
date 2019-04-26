import { DocumentUploader } from '@/js/helpers/document-uploader'

export function uploadDocument (document) {
  if (document && !document.key) {
    return DocumentUploader.uploadSingleDocument(document)
  }

  return Promise.resolve()
}
