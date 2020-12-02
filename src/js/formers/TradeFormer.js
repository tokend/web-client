import { Former } from './Former'
// import { base, FEE_TYPES } from '@tokend/js-sdk'

/**
 * Collects the attributes for transfer-related operations
 * @class
 * @implements {Former}
 */
export class TradeFormer extends Former {
    attrs = this.attrs || this._defaultAttrs
    get _defaultAttrs () {
    }

    buildOps () {
    }
}
