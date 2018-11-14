import { TxRecord } from './tx.record'

import { add } from '../utils/math.util'
import { RECORDS_VERBOSE, DIRECTION_VERBOSE } from './help/records.const'

export class TransferRecord extends TxRecord {
  constructor (record, userAccountId) {
    super(record, RECORDS_VERBOSE.transfer)
    this.userAccountId = userAccountId
    this.amount = record.amount
    this.asset = record.asset
    this.id = record.id
    this.receiver = record.to
    this.sender = record.from
    this.subject = record.subject
    this.counterparty = this._getCounterParty()
    this.direction = this._getDirection()
    // TODO: need parse fees separately later to show in extended details
    this.fee = this._getFee()
    this.participants = this._getParticipants()
  }

  _getDirection () {
    const userAccountId = this.userAccountId
    return this._record.from === userAccountId
      ? DIRECTION_VERBOSE.out
      : DIRECTION_VERBOSE.in
  }

  _getFee () {
    const sendersFee = add(
      this._record.source_payment_fee,
      this._record.source_fixed_fee
    )
    const recipientsFee = add(
      this._record.destination_payment_fee,
      this._record.destination_fixed_fee
    )
    const sourcePaysForDest = this._record.source_pays_for_dest
    const direction = this.direction

    if (direction === DIRECTION_VERBOSE.in) {
      return sourcePaysForDest ? 'Sender paid' : recipientsFee
    }
    return sourcePaysForDest ? add(sendersFee, recipientsFee) : sendersFee
  }

  _getParticipants () {
    return this._record.participants.map(participant =>
      participant.account_id
    )
  }

  _getCounterParty () {
    const direction = this._getDirection()
    return direction === DIRECTION_VERBOSE.in
      ? this._record.from
      : this._record.to
  }
}
