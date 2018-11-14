import { TxRecord } from './tx.record'
import get from 'lodash/get'
import { RECORDS_VERBOSE, DIRECTION_VERBOSE } from './help/records.const'

export class WithdrawalRecord extends TxRecord {
  constructor (record) {
    super(record, RECORDS_VERBOSE.withdrawal)
    this.amount = record.amount
    this.fixedFee = record.fee_fixed
    this.percentFee = record.fee_percent
    this.counterparty = get(record, 'external_details.address')
    this.direction = DIRECTION_VERBOSE.out
    this.destinationAsset = record.dest_asset
    this.destinationAmount = record.dest_amount
    this.asset = record.dest_asset
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
      counterparty: { processor: 'raw' },
      counterpartyEmail: { processor: 'email', processorArg: { id: this.counterparty } },
      destinationAsset: { processor: 'raw' },
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
      destinationAmount: {
        processor: 'formatAmount',
        processorArg: { asset: this.destinationAmount }
      },
      date: { processor: 'formatDate' }
    }
  }
}
