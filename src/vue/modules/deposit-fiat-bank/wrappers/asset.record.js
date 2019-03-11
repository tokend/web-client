import _get from 'lodash/get'
import config from '@/config'

export class AssetRecord {
  constructor (record = {}, balances = []) {
    this._record = record

    this.code = record.id
    this.details = record.details
    this.name = _get(record, 'details.name')
    this.externalSystemType = _get(record, 'details.externalSystemType')
    this.trailingDigitsCount = record.trailingDigits || config.DECIMAL_POINTS

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
  get nameAndCode () {
    const name = this.name || this.code
    return `${name} (${this.code})`
  }

  get isDepositable () {
    return !!this.externalSystemType
  }

  get isFiat () {
    return !!this.details.isFiat
  }
}
