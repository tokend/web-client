import merge from 'lodash/merge'
import { uploadDocumentsDeep } from '@/js/helpers/upload-documents'

// TODO: find a way to document mergeAttrs’ source in each implementation
// TODO: find a better way to document `attrs` in each implementation

/**
 * @typedef {import('@tokend/js-sdk').base.xdr.Operation} Operation
 */

/**
  * Collects attributes, build operations from the collected data.
  * Helps in cases when you got a form split to multiple steps, or forms
  * with amounts of children components that collects the form data.
  *
  * Separates complex operation building logic from the representation.
  *
  * @interface
  */
export class Former {
  /**
   * @constructor
   * @param {*} [populateSource] a source to populate the instance with
   */
  constructor (populateSource) {
    /**
     * The collected attributes
     * @type {object}
     * @public
     */
    this.attrs = {}

    /**
     * Most of the `Operation`s have both update and create variants. Here
     * we simplify check/switch between them.
     * @private
     */
    this._opBuilder = this._buildOpCreate

    if (populateSource) {
      this.populate(populateSource)
    }
  }

  /**
   * Return `true` if the creation operation builder used
   * @returns {boolean}
   */
  get isCreateOpBuilder () { return this._opBuilder === this._buildOpCreate }

  /**
   * Return `true` if the update operation builder used
   * @returns {boolean}
   */
  get isUpdateOpBuilder () { return this._opBuilder === this._buildOpUpdate }

  /**
   * Returns `true` if a `requestId` is provided in the collected attrs, thus
   * means the operation builder will update an existing request
   * @returns {boolean}
   */
  get willUpdateRequest () {
    const id = this.attrs.requestId
    return Boolean(id && typeof id === 'string' && id !== '0')
  }

  /**
   * Use builder for the creation operation
   * @returns {Former}
   */
  useCreateOpBuilder () {
    this._opBuilder = this._buildOpCreate
    return this
  }

  /**
   * Use builder for the update operation
   * @returns {Former}
   */
  useUpdateOpBuilder () {
    this._opBuilder = this._buildOpUpdate
    return this
  }

  /**
   * Merge an object into the `attrs`
   * @param {object} source - the object to merge
   * @returns {Former}
   */
  mergeAttrs (source) {
    this.attrs = merge(this.attrs, source)
    return this
  }

  /**
   * Build the operations
   * @returns {Promise<Array<Operation>>}
   */
  async buildOps () {
    await uploadDocumentsDeep(this.attrs)
    return [this._opBuilder()]
  }

  /**
   * Populate the `attrs` with predefined structures
   * @abstract
   * @param {object} source
   * @returns {Former}
   */
  populate (source) { throw new ReferenceError('Not implemented') }

  /**
   * Build the creation operation
   * @abstract
   * @returns {Operation}
   */
  _buildOpCreate () { throw new ReferenceError('Not implemented') }

  /**
   * Build the update operation
   * @abstract
   * @returns {Operation}
   */
  _buildOpUpdate () { throw new ReferenceError('Not implemented') }
}
