import { TradeRecord } from './trade.record'
import { recordResponses } from './test/records.mocks'
import { multiply } from '../utils/math.util'

describe('record.trade', () => {
  let tradeRecord
  beforeEach(() => {
    tradeRecord = new TradeRecord(recordResponses.trade)
  })

  it('should properly get baseAssetCode field', () => {
    expect(tradeRecord.baseAssetCode).to.equal(recordResponses.trade.base_asset)
  })
  it('should properly get quoteAssetCode field', () => {
    expect(tradeRecord.quoteAssetCode).to.equal(recordResponses.trade.quote_asset)
  })
  it('should properly get baseAmount field', () => {
    expect(tradeRecord.baseAmount).to.equal(recordResponses.trade.base_amount)
  })
  it('should properly get price field', () => {
    expect(tradeRecord.price).to.equal(recordResponses.trade.price)
  })
  it('should properly get createdAt field', () => {
    expect(tradeRecord.createdAt).to.equal(recordResponses.trade.created_at)
  })
  it ('quoteAmount getter should porperly calculate quote amount', () => {
    const properAmount = multiply(recordResponses.trade.base_amount, recordResponses.trade.price)
    expect(tradeRecord.quoteAmount).to.equal(properAmount)
  })
})
