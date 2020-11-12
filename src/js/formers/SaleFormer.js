import { Former } from './Former'

/**
 * Collects the attributes for sale operations
 * @class
 * @implements {Former}
 */
export class SaleFormer extends Former {
  attrs = this.attrs || this._defaultAttrs

  get _defaultAttrs () {
    return {
      type: '',
      name: '',
      baseAsset: {},
      capAsset: {},
      startTime: '',
      endTime: '',
      softCap: '',
      hardCap: '',
      assetsToSell: '',
      quoteAssets: [],
      isWhitelisted: false,
    }
  }

  /**
 *
 * @param {Object} source
 * @param {}
 */
  populate (source) {
    this.attrs.type = source.type
    this.attrs.name = source.name
    this.attrs.baseAsset = source.baseAsset
    this.attrs.capAsset = source.capAsset
    this.attrs.startTime = source.startTime
    this.attrs.endTime = source.endTime
    this.attrs.softCap = source.softCap
    this.attrs.hardCap = source.hardCap
    this.attrs.assetsToSell = source.assetsToSell
    this.attrs.quoteAssets = source.quoteAssets
    this.attrs.isWhitelisted = source.isWhitelisted
  }
}
