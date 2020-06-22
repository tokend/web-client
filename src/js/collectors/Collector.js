import merge from 'lodash/merge'
import isObject from 'lodash/isObject'
import { DocumentContainer } from '@/js//helpers/DocumentContainer'
import { uploadDocument } from '@/js/helpers/upload-documents'

/**
 * @typedef {import('@tokend/js-sdk').base.xdr.Operation} Operation
 */

/**
  * Collects attributes to store, process and build operations from them.
  * Helps in cases when you got a form split to multiple steps, or forms
  * with amounts of children components that collects the form data.
  * @class
  */
export class Collector {
  /**
   * @constructor
   */
  constructor () {
    this.attrs = {}
  }

  /**
   * Merge an object into collection
   * @param {object} source - the object to merge
   * @returns {Collector}
   */
  add (source) {
    this.attrs = merge(this.attrs, source)
    return this
  }

  /**
   * Parse the predefined structure to populate the collector
   * @param {object} source
   * @returns {Collector}
   */
  from (source) {
    throw new ReferenceError('Not implemented')
  }

  /**
   * Build the operations
   * @returns {Promise<Array<Operation>>}
   */
  async buildOps () {
    throw new ReferenceError('Not implemented')
  }

  _uploadDocs () {
    return Promise.all(this._collectUploadDocsPromises())
  }

  _collectUploadDocsPromises (obj = this.attrs) {
    const promises = []
    for (const val of Object.values(obj)) {
      if (val instanceof DocumentContainer && !val.isUploaded) {
        promises.push(uploadDocument(val))
        continue
      }

      if (isObject(val)) {
        promises.push(...this._collectUploadDocsPromises(val))
      }
    }
    return promises
  }
}
