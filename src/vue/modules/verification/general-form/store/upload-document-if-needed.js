import { DocumentUploader } from '@/js/helpers/document-uploader'

// will decide if upload is needed by two factors - the document is present and
// the document has no key (we assume that it means the document was
// uploaded before)
export function uploadDocumentIfNeeded (document) {
  if (document && !document.key) {
    return DocumentUploader.uploadSingleDocument(document)
  }

  return Promise.resolve()
}
