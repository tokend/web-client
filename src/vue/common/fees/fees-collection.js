import { Fee } from './fee'
import { MathUtil } from '@/js/utils'

const EMPTY_FEE = {
  fixed: '0',
  calculatedPercent: '0',
}

export class FeesCollection {
  constructor ({ fees, asset, masterAccountId }) {
    if (!fees.every(f => f instanceof Fee)) {
      throw new Error('opts.fees must be array of Fee instances')
    }

    this._isPaidForDestination = false
    this._fees = fees
    this._asset = asset
    this._masterAccountId = masterAccountId
  }

  [Symbol.iterator] () {
    return this.fees
  }

  get isPaidForDestination () {
    return this._isPaidForDestination
  }

  set isPaidForDestination (value) {
    this._isPaidForDestination = value

    if (value) {
      this._outgoingFee.setAdditional(this._incomingFee.total)
    } else {
      this._outgoingFee.resetAdditional()
    }
  }

  get isExternalFeePresent () {
    return this._asset.externalSystemType &&
      this._asset.owner === this._masterAccountId &&
      this._fees.some(fee => fee.isWithdrawal)
  }

  get assetCode () {
    return this._asset.code
  }

  get totalFee () {
    return this.fees.reduce((sum, item) => MathUtil.add(sum, item))
  }

  get valuableFees () {
    return this.fees.filter(f => !f.isEmpty)
  }

  get fees () {
    return [this.sourceFee, this.destinationFee, ...this.additionalFees]
      .filter(f => f !== undefined)
  }

  get sourceFee () {
    return this._outgoingFee
  }

  get destinationFee () {
    if (this.isPaidForDestination) {
      return new Fee({ ...this._incomingFee, ...EMPTY_FEE })
    } else {
      return this._incomingFee
    }
  }

  get _incomingFee () {
    return this._fees.find(f => f.isIncoming)
  }

  get _outgoingFee () {
    return this._fees.find(f => f.isOutgoing)
  }

  get additionalFees () {
    return this._fees
      .filter(f => ![this._incomingFee, this._outgoingFee].includes(f))
  }
}
