import { FEE_TYPES, PAYMENT_FEE_SUBTYPES } from '@tokend/js-sdk'
import { MathUtil } from '@/js/utils'

const EMPTY_ADDITIONAL_FEE = '0'

export class Fee {
  constructor (record) {
    this.type = record.type
    this.subtype = record.subtype

    this.amount = record.amount
    this.fixed = record.fixed
    this.calculatedPercent = record.calculatedPercent
    this.additional = EMPTY_ADDITIONAL_FEE
  }

  get isAdditionalPresent () {
    return this.additional !== EMPTY_ADDITIONAL_FEE
  }

  get total () {
    return MathUtil.add(this.calculated, this.additional)
  }

  get calculated () {
    return MathUtil.add(this.fixed, this.calculatedPercent)
  }

  get isEmpty () {
    return Number(this.fixed) === 0 && Number(this.calculatedPercent) === 0
  }

  get isIncoming () {
    return this.subtype === PAYMENT_FEE_SUBTYPES.incoming
  }

  get isOutgoing () {
    return this.subtype === PAYMENT_FEE_SUBTYPES.outgoing
  }

  get isWithdrawal () {
    return this.type === FEE_TYPES.withdrawalFee
  }

  setAdditional (value) {
    this.additional = value
  }

  resetAdditional () {
    this.additional = EMPTY_ADDITIONAL_FEE
  }
}
