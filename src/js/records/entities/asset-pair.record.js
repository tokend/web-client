import { ASSET_PAIR_POLICIES } from '@tokend/js-sdk'

export class AssetPairRecord {
  constructor (record = {}) {
    this._record = record

    this.baseAssetCode = record.base
    this.quoteAssetCode = record.quote

    this.currentPrice = record.currentPrice
    this.maxPriceStep = record.maxPriceStep
    this.physicalPrice = record.physicalPrice
    this.physicalPriceCorrection = record.physicalPriceCorrection

    this.policies = this._policies()
    this.policy = this._policy()
  }

  _policies () {
    const policies = this._record.policies || []
    return policies.map(policy => policy.value)
  }

  _policy () {
    return this._policies().reduce((s, p) => s | p, 0)
  }

  get baseAndQuote () {
    return `${this.baseAssetCode}/${this.quoteAssetCode}`
  }

  get isTradable () {
    return !!(this.policy & ASSET_PAIR_POLICIES.tradeableSecondaryMarket)
  }

  get isPhysicalPriceRestricted () {
    return !!(this.policy & ASSET_PAIR_POLICIES.physicalPriceRestriction)
  }

  get isCurrentPriceRestricted () {
    return !!(this.policy & ASSET_PAIR_POLICIES.currentPriceRestriction)
  }
}
