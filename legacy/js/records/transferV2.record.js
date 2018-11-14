import { TxRecord } from './tx.record'

import { add } from '../utils/math.util'
import { RECORDS_VERBOSE, DIRECTION_VERBOSE } from './help/records.const'
import _safeGet from 'lodash/get'

export class TransferV2Record extends TxRecord {
  constructor (record, userAccountId) {
    super(record, RECORDS_VERBOSE.transfer)
    this.userAccountId = userAccountId
    this.id = record.id

    this.amount = record.amount
    this.asset = record.asset
    this.counterparty = this._getCounterParty()
    this.direction = this._getDirection()
    this.fees = this._getFees()
    this.sourceFees = this.fees.source
    this.destinationFees = this.fees.destination
    this.sourcePaysForDest = record.source_pays_for_dest
    this.sourceFeeAsset = _safeGet(
      record,
      'source_fee_data.actual_payment_fee_asset_code'
    )
    this.destinationFeeAsset = _safeGet(
      record,
      'destination_fee_data.actual_payment_fee_asset_code'
    )
    this.participants = this._getParticipants()
    this.receiver = record.to
    this.sender = record.from
    this.subject = record.subject
  }

  _getDirection () {
    const userAccountId = this.userAccountId
    return this._record.from === userAccountId
      ? DIRECTION_VERBOSE.out
      : DIRECTION_VERBOSE.in
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

  _getFees () {
    return {
      source: add(
        _safeGet(this._record, 'source_fee_data.actual_payment_fee'),
        _safeGet(this._record, 'source_fee_data.fixed_fee')),
      destination: add(
        _safeGet(this._record, 'destination_fee_data.actual_payment_fee'),
        _safeGet(this._record, 'destination_fee_data.fixed_fee'))
    }
  }

  get listView () {
    return {
      email: 'raw',
      amount: 'formatAmount',
      type: 'translate',
      direction: 'raw'
    }
  }

  get detailsView () {
    return {
      id: { processor: 'raw' },
      amount: { processor: 'formatAmount', processorArg: { asset: this.asset } },
      convertedAmount: {
        processor: 'convert',
        processorArg: {
          amount: this.amount,
          asset: this.asset
        }
      },
      sourceFees: { processor: 'formatAmount', processorArg: { asset: this.asset } },
      destinationFees: { processor: 'formatAmount', processorArg: { asset: '' } },
      sourceFeeAsset: { processor: 'raw' },
      destinationFeeAsset: { processor: 'raw' },
      sourcePaysForDest: { processor: 'raw' },
      date: { processor: 'formatDate' },
      subject: { processor: 'raw' },
      ...(this._getDirection === DIRECTION_VERBOSE.in
        ? { sender: { processor: 'raw' } }
        : { receiver: { processor: 'raw' } }),
      ...(this._getDirection === DIRECTION_VERBOSE.in
        ? { senderEmail: { processor: 'email', processorArg: { id: this.counterparty } } }
        : { receiverEmail: { processor: 'email', processorArg: { id: this.counterparty } } })
    }
  }
}
