import { ASSET_SUBTYPE } from '@/js/const/asset-subtypes.const'

export class AssetRecord {
  constructor (record = {}) {
    this._record = record

    this.code = record.id
    this.details = record.details
    this.owner = record.owner

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

  get isAllowedToRedeem () {
    return this.details.subtype === ASSET_SUBTYPE.bond
  }
}
