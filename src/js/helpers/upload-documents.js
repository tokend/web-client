import { documentsManager } from '@/api'
import { DocumentContainer } from './DocumentContainer'
import isObject from 'lodash/isObject'

/**
 * Uploads an array of documents to the storage.
 *
 * @param {DocumentContainer[]} documents - array of {@link DocumentContainer}
 * instances to be uploaded
 * @param {string} [accountId] - documents' owner account ID
 */
export async function uploadDocuments (documents, accountId) {
  await Promise.all(documents.map(doc => uploadDocument(doc, accountId)))
}

export async function uploadDocumentsDeep (obj, accountId) {
  const docs = collectDocsToUploadDeep(obj)
  await uploadDocuments(docs, accountId)
}

/**
 * Uploads a document to the storage.
 *
 * @param {DocumentContainer} document - instance of {@link DocumentContainer}
 * to be uploaded
 * @param {string} [accountId] - document's owner account ID
 *
 * @returns {Promise<DocumentContainer>} Modified document with set key
 */
export async function uploadDocument (document, accountId) {
  if (document && !document.key) {
    const details = document.getDetailsForUpload()

    const key = await documentsManager.uploadDocument({ ...details, accountId })
    document.setKey(key)

    return key
  }
}

function collectDocsToUploadDeep (obj = {}) {
  const docs = []
  for (const val of Object.values(obj)) {
    if (val instanceof DocumentContainer && !val.isUploaded) {
      docs.push(val)
      continue
    }
    if (isObject(val)) {
      docs.push(...collectDocsToUploadDeep(val))
    }
  }
  return docs
}
