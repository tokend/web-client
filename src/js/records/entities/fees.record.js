import { FEE_TYPES } from '@tokend/js-sdk'
export class FeesRecord {
  constructor (record) {
    this._record = record

    this.source = record.source
    this.destination = record.destination
    this.type = record.type
    this.assetCode = record.asset.code
    this.externalSystemType = record.asset.externalSystemType
    this.isWithdrawalFees = this._isWithdrawalFees()
    this.isAnyFeeForDestination = this._isAnyFeeForDestination()
  }
  _isWithdrawalFees () {
    return this.type === FEE_TYPES.withdrawalFee
  }
  _isAnyFeeForDestination () {
    const fixed = Number(this.destination.fixed)
    const calculatedPercent = Number(this.destination.calculatedPercent)
    return Boolean(fixed) || Boolean(calculatedPercent)
  }
}
