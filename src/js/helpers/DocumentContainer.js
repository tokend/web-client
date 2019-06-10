import config from '@/config'
import { FileUtil } from '@/js/utils/file.util'
import { DOCUMENT_POLICIES } from '@/js/const/document-policies.const'
import { api } from '@/api'

/**
 * Wrapper to simplify work with documents
 */
export class DocumentContainer {
  /**
   * @param {object} [opts]
   * @param {File} [opts.file] - file representing a document
   * @param {string} [opts.key] - key to access file in storage
   * @param {string} opts.name - file name
   * @param {string} opts.mimeType - file MIME type
   * @param {string} opts.type - document type {@link documentTypes} of the
   *        document (!! nothing common with MIME-type)
   */
  constructor (opts) {
    if (!opts.file && !opts.key) {
      throw new Error('Document initialized without raw file or file key')
    }
    this.mimeType = opts.mimeType || opts.mime_type
    this.file = opts.file
    this.name = opts.name
    this.type = opts.type
    this.key = opts.key

    this._arrayBuffer = []
    this._privateUrl = ''
    this._dataUrl = ''
  }

  getDetailsForSave () {
    return {
      mime_type: this.mimeType,
      name: this.name,
      key: this.key,
    }
  }

  getDetailsForUpload () {
    if (!DOCUMENT_POLICIES[this.type]) {
      throw new Error('Unknown document type: ' + this.type)
    }
    return {
      type: DOCUMENT_POLICIES[this.type],
      mimeType: this.mimeType,
      file: this.file,
    }
  }

  async getPrivateUrl () {
    if (!this.key) {
      throw new Error(`
        To derive private url file must be already uploaded and contain
        the key
      `)
    }
    const { data } = await api.getWithSignature(`/documents/${this.key}`)
    return data.url
  }

  setKey (key) {
    this.key = key
  }

  get isUploaded () {
    return !!(this.key && !this.file)
  }

  /**
   * URL from where the public file can be downloaded.
   * (!! works only with public files)
   *
   * @returns {string} publicUrl
   */
  get publicUrl () {
    if (!this.key) return ''
    return `${config.FILE_STORAGE}/${this.key}`
  }

  /**
   * Data URL of the new file to allow browser open it before uploaded.
   * Call {@link deriveDataUrl} before using this getter
   *
   * @returns {string} dataUrl
   */
  get dataUrl () {
    return this._dataUrl
  }

  /**
   * File converted to AB format. You should upload files in this format.
   * Call {@link deriveArrayBuffer} before using this getter
   *
   * @returns {ArrayBuffer} arrayBuffer
   */
  get arrayBuffer () {
    return this._arrayBuffer
  }

  async deriveDataUrl () {
    if (!this.file) {
      throw new Error('Data url can be derived only if raw file is present')
    }
    this._dataUrl = await FileUtil.readFileAsDataURL(this.file)
  }

  async deriveArrayBuffer () {
    if (!this.file) {
      throw new Error('Array buffer can be derived only if file is present')
    }
    this._arrayBuffer = await FileUtil.readFileAsArrayBuffer(this.file)
  }
}
