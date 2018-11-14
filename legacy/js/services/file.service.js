import { Service } from './service'
import Vue from 'vue'
import config from '../../../src/config'

export class FileService extends Service {
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
  async uploadFile (opts) {
    const { type, mimeType, file } = opts
    const configResponse = await this._loadUploadConfig(type, mimeType)
    const config = configResponse.attributes()
    await this._uploadFile(file, config, mimeType)
    return configResponse.attribute('key')
  }

  async uploadFiles (...files) {
    return Promise.all(files.map(file => this.uploadFile(file)))
  }

  /**
   * Loads document details by it's id
   *
   * @param {String|Number} id
   * @return {Promise<object>} - Promise representing document details
   */
  loadDocumentDetailsById (id) {
    return this._apiRequestBuilder.users()
      .accountId(this._accountId)
      .documents()
      .documentId(id)
      .sign(this._keypair)
      .get()
  }

  /**
   * @async
   * Loads file by specified URL
   * @param url {string} - full URL where document is placed
   * @return {Blob}
   */
  async loadFileByURL (url) {
    const response = await Vue.http.get(url, { responseType: 'blob' })
    return response.body
  }

  /**
   * @param {DocumentContainer} document - instance of {@link DocumentContainer}
   * to be uploaded
   * @returns {Promise<object>}
   */
  async uploadSingleDocument (document) {
    const details = document.getDetailsForUpload()
    const key = await this.uploadFile(details)
    document.setKey(key)
    return document
  }

  /**
   * Loads config from
   * @param type - document type {@link documentTypes}
   * @param mimeType - MIME-type of the file
   * @return {Promise<object>}
   * @private
   */
  _loadUploadConfig (type, mimeType) {
    return this._apiRequestBuilder.users()
      .accountId(this._accountId)
      .documents()
      .data({ type })
      .attributes({ content_type: mimeType })
      .sign(this._keypair)
      .json()
      .post()
  }

  /**
   * Uploads file sending multipart/form-data request to the server
   * @param file {ArrayBuffer}
   * @param policy {policy}
   * @param mimeString
   * @return {*}
   * @private
   */
  _uploadFile (file, policy, mimeString) {
    const formData = new FormData()
    delete policy.url
    for (const key in policy) {
      formData.append(key, policy[key])
    }
    const blob = new Blob([file], { type: mimeString })
    formData.append('file', blob)
    // TODO: posting should not be on this lvl of abstraction
    return Vue.http.post(config.FILE_STORAGE, formData)
  }
}

export const fileService = new FileService()
