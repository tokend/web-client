const PAYMENT_STATES = {
  pending: 'processing',
  rejected: 'failed'
}

export class OpRecord {
  constructor (record) {
    this._record = record
    this.id = record.id
    this.date = record.ledgerCloseTime
    this.state = PAYMENT_STATES[record.state] || record.state
  }
}
