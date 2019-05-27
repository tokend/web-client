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

  setAdditional (value) {
    this.additional = value
  }

  removeAdditional () {
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
    return Number(this.fixed) === 0 &&
      Number(this.calculatedPercent) === 0 &&
      Number(this.additional) === 0
  }

  get isWithdrawal () {
    return this.type === FEE_TYPES.withdrawalFee
  }

  get isPayment () {
    return this.type === FEE_TYPES.paymentFee
  }

  get isOffer () {
    return this.type === FEE_TYPES.offerFee
  }

  get isInvest () {
    return this.type === FEE_TYPES.investFee
  }

  get isIssuance () {
    return this.type === FEE_TYPES.issuanceFee
  }

  get isIncoming () {
    return this.subtype === PAYMENT_FEE_SUBTYPES.incoming
  }

  get isOutgoing () {
    return this.subtype === PAYMENT_FEE_SUBTYPES.outgoing
  }
}
