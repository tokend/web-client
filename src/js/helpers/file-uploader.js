import Vue from 'vue'
import config from '@/config'
import { Sdk } from '@/sdk'

export class FileUploader {
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
  static async uploadFile (opts) {
    const { type, mimeType, file } = opts
    const configResponse = await Sdk.api.documents.create(type, mimeType)
    const config = configResponse.attributes()
    await this._uploadFile(file, config, mimeType)
    return configResponse.attribute('key')
  }

  static async uploadFiles (...files) {
    return Promise.all(files.map(file => this.uploadFile(file)))
  }

  /**
   * @async
   * Loads file by specified URL
   * @param url {string} - full URL where document is placed
   * @return {Blob}
   */
  static async loadFileByURL (url) {
    const response = await Vue.http.get(url, { responseType: 'blob' })
    return response.body
  }

  /**
   * @param {DocumentContainer} document - instance of {@link DocumentContainer}
   * to be uploaded
   * @returns {Promise<object>}
   */
  static async uploadSingleDocument (document) {
    const details = document.getDetailsForUpload()
    const key = await this.uploadFile(details)
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
