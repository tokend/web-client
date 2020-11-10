import { Fee } from './fee'
import { MathUtil } from '@/js/utils'

const EMPTY_FEE = {
  fixed: '0',
  calculatedPercent: '0',
}

export class FeesCollection {
  constructor ({ fees, assetCode, masterAccountId }) {
    if (!fees.every(f => f instanceof Fee)) {
      throw new Error('opts.fees must be array of Fee instances')
    }

    this._isPaidForDestination = false
    this._fees = fees
    this.assetCode = assetCode
    this._masterAccountId = masterAccountId
  }

  get isPaidForDestination () {
    return this._isPaidForDestination
  }

  set isPaidForDestination (value) {
    this._isPaidForDestination = value

    if (value) {
      this._outgoingFee.setAdditional(this._incomingFee.total)
    } else {
      this._outgoingFee.removeAdditional()
    }
  }

  get isHaveWithdrawalFee () {
    return this._fees.find(fee => fee.isWithdrawal)
  }

  get fees () {
    return [this.sourceFee, this.destinationFee, ...this.additionalFees]
      .filter(f => f !== undefined)
  }

  get totalFee () {
    return {
      fixed: this.fees
        .reduce((sum, item) => MathUtil.add(sum, item.fixed), '0'),
      calculatedPercent: this.fees
        .reduce((sum, item) => MathUtil.add(sum, item.calculatedPercent), '0'),
    }
  }

  get valuableFees () {
    return this.fees.filter(f => !f.isEmpty)
  }

  get isAnyValuable () {
    return this.valuableFees.length > 0
  }

  get isAny () {
    return !this.isExternalFeePresent && this.valuableFees.length
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

  get additionalFees () {
    return this._fees
      .filter(f => ![this._incomingFee, this._outgoingFee].includes(f))
  }

  get _incomingFee () {
    return this._fees.find(f => f.isIncoming)
  }

  get _outgoingFee () {
    return this._fees.find(f => f.isOutgoing)
  }
}
