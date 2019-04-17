import { PAYMENT_STATES } from '../const/payment-states'
import { Asset } from './asset'

export class Invoice {
  constructor ({ record, system, isConfirmed }) {
    this.amount = record.amount
    this.asset = new Asset(record.asset)
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
}
