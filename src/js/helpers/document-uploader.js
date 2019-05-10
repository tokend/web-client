import Vue from 'vue'

import config from '@/config'
import { api } from '@/api'

import _omit from 'lodash/omit'

export class DocumentUploader {
  /**
   * @async
   * Uploads the file into storage
   *
   * @param opts
   * @param opts.type {string} - document type {@link documentTypes} of the
   * document (!! nothing common with MIME-type)
   * @param opts.mimeType - MIME-type of the file being uploaded
   * @param opts.file {ArrayBuffer} - file itself
   * @param opts.accountId {string} - document's owner account ID
   *
   * @return {string}
   */
  static async uploadDocument (opts) {
    const { type, mimeType, file, accountId } = opts
    const config = await this._createDocumentAnchorConfig(
      { type, mimeType, accountId }
    )

    await this._uploadFile(
      file, _omit(config, ['id', 'url', 'type']), mimeType
    )

    return config.key
  }

  static async uploadDocuments (...files) {
    return Promise.all(files.map(file => this.uploadDocument(file)))
  }

  /**
   * @param {DocumentContainer} document - instance of {@link DocumentContainer}
   * to be uploaded
   * @param {string} accountId - document's owner account ID
   *
   * @returns {Promise<object>}
   */
  static async uploadSingleDocument (document, accountId) {
    const details = document.getDetailsForUpload()
    const key = await this.uploadDocument({ ...details, accountId })
    document.setKey(key)
    return document
  }

  static async _createDocumentAnchorConfig ({ type, mimeType, accountId }) {
    const { data: config } = await api.postWithSignature('/documents', {
      data: {
        type,
        attributes: { content_type: mimeType },
        relationships: {
          owner: {
            data: { id: accountId },
          },
        },
      },
    })

    return config
  }

  /**
   * Uploads file sending multipart/form-data request to the server
   * @param file {ArrayBuffer}
   * @param policy {policy}
   * @param mimeType
   * @return {*}
   * @private
   */
  static async _uploadFile (file, policy, mimeType) {
    const formData = this._createFileFormData(file, policy, mimeType)

    // TODO: posting should not be on this level of abstraction
    await Vue.http.post(config.FILE_STORAGE, formData)
  }

  static _createFileFormData (file, policy, mimeType) {
    const formData = new FormData()

    for (const key in policy) {
      // converts camelCase policy to kebab-case
      const convertedPolicy = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      formData.append(convertedPolicy, policy[key])
    }

    const blob = new Blob([file], { type: mimeType })
    formData.append('file', blob)

    return formData
  }
}
