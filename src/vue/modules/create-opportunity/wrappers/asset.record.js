import { ASSET_POLICIES } from '@tokend/js-sdk'
import _get from 'lodash/get'

export class AssetRecord {
  constructor (record = {}) {
    this._record = record

    this.code = record.id
    this.name = _get(record, 'details.name')

    this.policies = this._policies()
    this.policy = this._policy()
  }

  _policies () {
    const policies = this._record.policies.flags || []
    return policies.map(policy => policy.value)
  }

  _policy () {
    return this._policies().reduce((s, p) => s | p, 0)
  }

  get nameAndCode () {
    const name = this.name || this.code
    return `${name} (${this.code})`
  }

  get isBaseAsset () {
    return !!(this.policy & ASSET_POLICIES.baseAsset)
  }

  get isStatsQuoteAsset () {
    return !!(this.policy & ASSET_POLICIES.statsQuoteAsset)
  }
}
