import { PAYMENT_STATES } from '../const/payment-states'

export class Invoice {
  constructor ({ record, system, isConfirmed }) {
    this.amount = record.amount
    this.asset = record.quoteAsset
    this.subject = record.subject
    this.system = system

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
