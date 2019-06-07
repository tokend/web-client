import { PAYMENT_STATES } from '../const/payment-states.const'
import { MathUtil } from '@/js/utils'

export class Invoice {
  constructor (record) {
    this.subject = record.subject
    this.price = record.price
    this.amount = record.amount

    this.asset = record.asset
    this.reference = record.reference

    this.system = record.system
    this.loyaltyAccount = record.loyaltyAccount

    this.state = PAYMENT_STATES.none
  }

  get totalPrice () {
    return MathUtil.multiply(this.price, this.amount)
  }

  get isPending () {
    return this.state === PAYMENT_STATES.pending
  }

  get isSuccessful () {
    return this.state === PAYMENT_STATES.successful
  }

  setPendingState () {
    this.state = PAYMENT_STATES.pending
  }

  setSuccessfulState () {
    this.state = PAYMENT_STATES.successful
  }
}
