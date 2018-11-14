import { offersService } from '../services/offer.service'
import { SECONDARY_MARKET_ORDER_BOOK_ID } from '../const/const'
import { RECORDS_VERBOSE } from './help/records.const'
import { i18n } from 'L@/js/i18n'

export class OfferRecord {
  constructor (record) {
    this._record = record
    this.id = record.offer_id
    this.owner = record.owner_id
    this.baseAmount = record.base_amount
    this.baseAssetCode = record.base_asset_code
    this.quoteAssetCode = record.quote_asset_code
    this.baseBalanceId = record.base_balance_id
    this.quoteBalanceId = record.quote_balance_id
    this.quoteAmount = record.quote_amount
    this.fee = record.fee
    this.isBuy = record.is_buy
    this.price = record.price
    this.date = record.created_at
    this.orderBookId = record.order_book_id
  }

  get offerType () {
    return +this.orderBookId === 0
      ? RECORDS_VERBOSE.offer
      : RECORDS_VERBOSE.investment
  }

  get isInvestment () {
    return +this.orderBookId !== +SECONDARY_MARKET_ORDER_BOOK_ID
  }

  cancelSelf () {
    return offersService.cancelOffer(this._composeCancelOpts())
  }

  _composeCancelOpts () {
    return {
      baseBalance: this.baseBalanceId,
      quoteBalance: this.quoteBalanceId,
      offerId: this.id,
      price: this.price,
      orderBookId: SECONDARY_MARKET_ORDER_BOOK_ID
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
      baseAmount: { processor: 'formatAmount', processorArg: { asset: this.baseAssetCode } },
      quoteAmount: { processor: 'formatAmount', processorArg: { asset: this.quoteAssetCode } },
      order: {
        processor: 'processedValue',
        processorArg: {
          value: this.isBuy ? i18n.trd_order_buy() : i18n.trd_order_sell()
        }
      },
      price: { processor: 'formatAmount', processorArg: { asset: this.quoteAssetCode } },
      fee: { processor: 'formatAmount', processorArg: { asset: this.baseAssetCode } },
      date: { processor: 'formatDateTime' }
    }
  }
}
