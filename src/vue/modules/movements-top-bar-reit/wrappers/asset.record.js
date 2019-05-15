import { ASSET_SUBTYPE } from '@/js/const/asset-subtypes.const'
import _get from 'lodash/get'
import { ASSET_POLICIES } from '@tokend/js-sdk'

export class AssetRecord {
  constructor (record = {}, balances = []) {
    this._record = record

    this.code = record.id
    this.name = _get(record, 'details.name')
    this.details = record.details
    this.owner = record.owner

    this.policies = this._policies()
    this.policy = this._policy()
    this.isCoinpayments = _get(record, 'details.isCoinpayments')
    this.externalSystemType = _get(record, 'details.externalSystemType')
    this.balance = this._getBalance(balances)
  }

  _getBalance (balances) {
    const balance = balances.find(balance => balance.asset.id === this.code)
    if (balance) {
      return {
        value: balance.state.available,
        currency: balance.asset,
        id: balance.id,
      }
    } else {
      return {}
    }
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

  get isBond () {
    return !this.details.isFiat && this.details.subtype === ASSET_SUBTYPE.bond
  }

  get isFiat () {
    return !!this.details.isFiat && this.details.subtype === undefined
  }

  get isWithdrawable () {
    return !!(this.policy & ASSET_POLICIES.withdrawable) ||
      !!(this.policy & ASSET_POLICIES.withdrawableV2)
  }

  get isDepositable () {
    return !!this.externalSystemType
  }
}
