import { documentsManager } from '@/api'

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
