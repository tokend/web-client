import set from 'lodash/set'
import unset from 'lodash/unset'
import merge from 'lodash/merge'

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
     * @abstract
     * @public
     */
    this.attrs = undefined

    if (populateSource) {
      this.populate(populateSource)
    }
  }

  /**
   * Set an attr by field path
   * @param {string} path
   * @param {*} value
   */
  setAttr (path, value) {
    set(this.attrs, path, value)
    return this
  }

  /**
   * Remove an attr by field path
   * @param {string} path
   */
  unsetAttr (path) {
    unset(this.attrs, path)
    return this
  }

  /**
   * Merge an object into the `attrs`
   * @param {object} source - the object to merge
   * @returns {Former}
   */
  mergeAttrs (source) {
    merge(this.attrs, source)
    return this
  }

  /**
   * Build the operations
   * @abstract
   * @returns {Promise<Array<Operation>>}
   */
  async buildOps () { throw new ReferenceError('Not implemented') }

  /**
   * Populate the `attrs` with predefined structures
   * @abstract
   * @param {*} source
   * @returns {Former}
   */
  populate (source) { throw new ReferenceError('Not implemented') }
}
