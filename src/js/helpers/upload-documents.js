import { documentUploader } from '@/api'

/**
 * @param {DocumentContainer} document - instance of {@link DocumentContainer}
 * to be uploaded
 * @param {string} [accountId] - documents' owner account ID
 *
 */
export async function uploadDocuments (documents, accountId) {
  await Promise.all(documents.map(doc => uploadDocument(doc, accountId)))
}

/**
 * @param {DocumentContainer} document - instance of {@link DocumentContainer}
 * to be uploaded
 * @param {string} [accountId] - document's owner account ID
 *
 * @returns {Promise<DocumentContainer>} Modified document with set key
 */
export async function uploadDocument (document, accountId) {
  if (document && !document.key) {
    const details = document.getDetailsForUpload()

    const key = await documentUploader.uploadDocument({ ...details, accountId })
    document.setKey(key)

    return key
  }
}
