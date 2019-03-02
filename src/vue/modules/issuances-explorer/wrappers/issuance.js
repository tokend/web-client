import _get from 'lodash/get'

export class Issuance {
  constructor (record, accountId) {
    this.id = record.id
    this.amount = record.amount
    this.asset = record.asset
    this.date = record.ledgerCloseTime
    this.reference = record.reference

    this.accountId = accountId
    this.participants = record.participants
  }

  get counterparty () {
    const participant = this.participants
      .find(p => p.accountId !== this.accountId) ||
      this.participants.find(p => !p.balanceId)

    return _get(participant, 'accountId')
  }
}
