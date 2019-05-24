import { FEE_TYPES, PAYMENT_FEE_SUBTYPES } from '@tokend/js-sdk'
import { MathUtil } from '@/js/utils'

export class Fee {
  constructor (record) {
    this.type = record.type
    this.subtype = record.subtype

    this.amount = record.amount
    this.fixed = record.fixed
    this.calculatedPercent = record.calculatedPercent
  }

  get isIncoming () {
    return this.subtype === PAYMENT_FEE_SUBTYPES.incoming
  }

  get isOutgoing () {
    return this.subtype === PAYMENT_FEE_SUBTYPES.outgoing
  }

  get total () {
    return MathUtil.add(this.fixed, this.calculatedPercent)
  }

  get isWithdrawal () {
    return this.type === FEE_TYPES.withdrawalFee
  }

  get isEmpty () {
    return Number(this.fixed) === 0 && Number(this.calculatedPercent) === 0
  }
}
