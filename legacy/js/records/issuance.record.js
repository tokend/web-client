import { TxRecord } from './tx.record'
import { RECORDS_VERBOSE, DIRECTION_VERBOSE } from './help/records.const'
import get from 'lodash/get'

export class IssuanceRecord extends TxRecord {
  constructor (record, userAccountId) {
    super(record, RECORDS_VERBOSE.issuance)
    this.userAccountId = userAccountId

    this.amount = record.amount
    this.asset = record.asset
    this.fixedFee = record.fee_fixed
    this.percentFee = record.fee_percent
    this.subject = record.reference
    this.counterparty = this._getCounterparty()
    this.direction = this._getDirection()
  }

  _getCounterparty () {
    const counterparty =
      this._record
        .participants
        .find(participant => participant.account_id !== this.userAccountId)
    return get(counterparty, 'account_id') || ''
  }

  _getDirection () {
    return DIRECTION_VERBOSE.in
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
      sender: { processor: 'processedValue', processorArg: { value: this.counterparty } },
      senderEmail: { processor: 'email', processorArg: { id: this.counterparty } },
      amount: { processor: 'formatAmount', processorArg: { asset: this.asset } },
      convertedAmount: {
        processor: 'convert',
        processorArg: {
          amount: this.amount,
          asset: this.asset
        }
      },
      fixedFee: { processor: 'formatAmount', processorArg: { asset: this.asset } },
      percentFee: { processor: 'formatAmount', processorArg: { asset: this.asset } },
      asset: { processor: 'raw' },
      date: { processor: 'formatDate' }
    }
  }
}
