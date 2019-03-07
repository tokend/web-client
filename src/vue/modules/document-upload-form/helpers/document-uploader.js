import Vue from 'vue'

import { config } from '../_config'
import { api } from '../_api'

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
   *
   * @return {string}
   */
  static async uploadDocument (opts, accountId) {
    const { type, mimeType, file } = opts
    const { data: config } = await api().postWithSignature(
      `/accounts/${accountId}/documents`,
      {
        data: {
          type,
          attributes: { content_type: mimeType },
        },
      }
    )

    await this._uploadFile(file, config, mimeType)
    return config.key
  }

  /**
   * @param {DocumentContainer} document - instance of {@link DocumentContainer}
   * to be uploaded
   * @returns {Promise<object>}
   */
  static async uploadSingleDocument (document, accountId) {
    const details = document.getDetailsForUpload()
    const key = await this.uploadDocument(details, accountId)
    document.setKey(key)
    return document
  }

  /**
   * Uploads file sending multipart/form-data request to the server
   * @param file {ArrayBuffer}
   * @param policy {policy}
   * @param mimeString
   * @return {*}
   * @private
   */
  static _uploadFile (file, policy, mimeString) {
    const formData = new FormData()

    for (const key in policy) {
      // converts camelCase policy to kebab-case
      formData.append(key.replace(/([A-Z])/g, '-$1').toLowerCase(), policy[key])
    }
    const blob = new Blob([file], { type: mimeString })
    formData.append('file', blob)
    // TODO: posting should not be on this lvl of abstraction
    return Vue.http.post(config().storageURL, formData)
  }
}
