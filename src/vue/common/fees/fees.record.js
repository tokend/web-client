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
    const isFeesValid = destination instanceof FeesRecord &&
      source instanceof FeesRecord

    if (!isFeesValid) {
      throw new Error('Destination and source must be FeesRecord instances')
    }

    this.destination = destination
    this.source = source
    this.assetCode = assetCode
    this.isAnyExternalFee = false
  }

  get isAnyDestinationFee () {
    return Boolean(+this.destination.calculatedPercent) ||
      Boolean(+this.destination.fixed)
  }

  get isAnySourceFee () {
    return Boolean(this.source.calculatedPercent) ||
      Boolean(this.source.fixed)
  }

  get isWithdrawable () {
    return this.type === FEE_TYPES.withdrawalFee
  }

  set setIsAnyExternalFee (opts) {
    // WARNING: Wait for update back-end about externalSystemType
    if (opts.feeType !== FEE_TYPES.withdrawalFee) {
      return false
    }
    this.isAnyExternalFee = opts.asset.externalSystemType &&
    opts.asset.owner === opts.masterAccountId
  }
}
