import { Former } from './Former'

/**
 * Collects the attributes for invest operations
 * @class
 * @implements {Former}
 */
export class InvestFormer extends Former {
    attrs = this.attrs || this._defaultAttrs

    get _defaultAttrs () {
      return {
        asset: '',
        amount: '0',
      }
    }

    buildOps () {
      const operation = this._opBuilder()
      return [operation]
    }

    _opBuilder () {

    }
}
