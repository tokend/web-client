import { PAYMENT_STATES } from '../const/payment-states'

export class Invoice {
  constructor ({ record, isConfirmed }) {
    this.subject = record.subject
    this.totalPrice = record.totalPrice

    this.asset = record.quoteAsset
    this.reference = record.reference
    this.system = record.system

    this.state = isConfirmed
      ? PAYMENT_STATES.successful
      : PAYMENT_STATES.pending
  }

  get isPending () {
    return this.state === PAYMENT_STATES.pending
  }

  get isSuccessful () {
    return this.state === PAYMENT_STATES.successful
  }

  setSuccessfulState () {
    this.state = PAYMENT_STATES.successful
  }
}
