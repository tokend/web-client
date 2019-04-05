import { PAYMENT_STATES } from '../const/payment-states'

export class Invoice {
  constructor ({ record, blobId, isConfirmed }) {
    this.amount = record.amount
    this.asset = record.asset
    this.subject = record.subject
    this.blobId = blobId

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
