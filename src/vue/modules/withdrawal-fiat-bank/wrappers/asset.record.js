import { ASSET_POLICIES } from '@tokend/js-sdk'
import _get from 'lodash/get'
import config from '@/config'

export class AssetRecord {
  constructor (record = {}, balances = []) {
    this._record = record

    this.code = record.id
    this.details = record.details
    this.name = _get(record, 'details.name')
    this.trailingDigitsCount = record.trailingDigits || config.DECIMAL_POINTS

    this.policies = this._policies()
    this.policy = this._policy()

    this.balance = this._getBalance(balances)
  }

  _getBalance (balances) {
    const balance = balances.find(balance => balance.assetCode === this.code)
    if (balance) {
      return {
        currency: balance.assetCode,
        id: balance.id,
        value: balance.value,
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

  get isWithdrawable () {
    return !!(this.policy & ASSET_POLICIES.withdrawable) ||
      !!(this.policy & ASSET_POLICIES.withdrawableV2)
  }

  get isFiat () {
    return !!this.details.isFiat
  }
}
