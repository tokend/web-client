import { FEE_TYPES } from '@tokend/js-sdk'
export class FeesRecord {
  constructor ({ fixed = '', calculatedPercent = '', assetCode, type }) {
    this.fixed = fixed
    this.calculatedPercent = calculatedPercent
    this.assetCode = assetCode
    this.type = type
  }
}

export class CoupledFeesRecord {
  constructor ({ destination, source, assetCode }) {
    if (
      !(destination instanceof FeesRecord) ||
      !(source instanceof FeesRecord)
    ) {
      throw new Error('One of the input objects is not FeesRecord')
    }
    this.destination = destination
    this.source = source
    this.assetCode = assetCode
    this.IsAnyExternalFee = false
  }

  get isAnyDestinationFee () {
    return Boolean(+this.destination.calculatedPercent) ||
      Boolean(+this.destination.fixed)
  }
  get isAnySourceFee () {
    return !!this.source.calculatedPercent ||
    !!this.source.fixed
  }
  get isWithdrawable () {
    return this.type === FEE_TYPES.withdrawalFee
  }
  get getIsAnyExternalFee () {
    return this.IsAnyExternalFee
  }
  set setIsAnyExternalFee (opts) {
    // WARNING: Wait for update back-end about externalSystemType
    if (opts.feeType !== FEE_TYPES.withdrawalFee) {
      return false
    }
    this.IsAnyExternalFee = opts.asset.externalSystemType &&
    opts.asset.owner === opts.masterAccountId
  }
}
