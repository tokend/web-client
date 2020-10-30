import { Former } from './Former'

/**
 * Collects the attributes for asset-related operations
 * @class
 * @implements {Former}
 */
export class IssuanceFormer extends Former {
    attrs = this.attrs || this._defaultAttrs

    get _defaultAttrs () {
      return {
      }
    }
}
