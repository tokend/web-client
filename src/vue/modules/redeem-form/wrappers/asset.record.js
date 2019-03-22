import { ASSET_SUBTYPE } from '@/js/const/asset-subtypes.const'

export class AssetRecord {
  constructor (record = {}) {
    this._record = record

    this.code = record.id
    this.details = record.details
    this.owner = record.owner
  }

  get nameAndCode () {
    const name = this.name || this.code
    return `${name} (${this.code})`
  }

  get isAllowedToRedeem () {
    return this.details.subtype === ASSET_SUBTYPE.bond
  }
}
