import { OfferRecord } from './offer.record'
import { recordResponses } from './test/records.mocks'

describe('record.offer', () => {
  let offerRecord
  let saleOfferRecord

  beforeEach(() => {
    offerRecord = new OfferRecord(recordResponses.offer)
    saleOfferRecord = new OfferRecord(recordResponses.saleOffer)
  })

  it('should proper parse owner', () => {
    expect(offerRecord.owner).to.equal(recordResponses.offer.owner_id)
    expect(saleOfferRecord.owner).to.equal(recordResponses.saleOffer.owner_id)
  })

  it('should proper parse baseAmount', () => {
    expect(offerRecord.baseAmount).to.equal(recordResponses.offer.base_amount)
    expect(saleOfferRecord.baseAmount).to.equal(recordResponses.saleOffer.base_amount)
  })

  it('should proper parse baseAssetCode', () => {
    expect(offerRecord.baseAssetCode).to.equal(recordResponses.offer.base_asset_code)
    expect(saleOfferRecord.baseAssetCode).to.equal(recordResponses.saleOffer.base_asset_code)
  })

  it('should proper parse quoteAssetCode', () => {
    expect(offerRecord.quoteAssetCode).to.equal(recordResponses.offer.quote_asset_code)
    expect(saleOfferRecord.quoteAssetCode).to.equal(recordResponses.saleOffer.quote_asset_code)
  })

  it('should proper parse baseBalanceId', () => {
    expect(offerRecord.baseBalanceId).to.equal(recordResponses.offer.base_balance_id)
    expect(saleOfferRecord.baseBalanceId).to.equal(recordResponses.saleOffer.base_balance_id)
  })

  it('should proper parse quoteBalanceId', () => {
    expect(offerRecord.quoteBalanceId).to.equal(recordResponses.offer.quote_balance_id)
    expect(saleOfferRecord.quoteBalanceId).to.equal(recordResponses.saleOffer.quote_balance_id)
  })

  it('should proper parse quoteAmount', () => {
    expect(offerRecord.quoteAmount).to.equal(recordResponses.offer.quote_amount)
    expect(saleOfferRecord.quoteAmount).to.equal(recordResponses.saleOffer.quote_amount)
  })

  it('should proper parse fee', () => {
    expect(offerRecord.fee).to.equal(recordResponses.offer.fee)
    expect(saleOfferRecord.fee).to.equal(recordResponses.saleOffer.fee)
  })

  it('should proper parse isBuy', () => {
    expect(offerRecord.isBuy).to.equal(recordResponses.offer.is_buy)
    expect(saleOfferRecord.isBuy).to.equal(recordResponses.saleOffer.is_buy)
  })

  it('should proper parse price', () => {
    expect(offerRecord.price).to.equal(recordResponses.offer.price)
    expect(saleOfferRecord.price).to.equal(recordResponses.saleOffer.price)
  })

  it('should proper parse createdAt', () => {
    expect(offerRecord.createdAt).to.equal(recordResponses.offer.created_at)
    expect(saleOfferRecord.createdAt).to.equal(recordResponses.saleOffer.created_at)
  })

  it('should proper parse orderBookId', () => {
    expect(offerRecord.orderBookId).to.equal(recordResponses.offer.order_book_id)
    expect(saleOfferRecord.orderBookId).to.equal(recordResponses.saleOffer.order_book_id)
  })

  it('offerType getter should return Investment on sale offer', () => {
    expect(saleOfferRecord.offerType).to.equal('Investment')
  })

  it('offerType getter should return Offer on common offer', () => {
    expect(offerRecord.offerType).to.equal('Offer')
  })

  it('isInvestment getter should return true on sale offer', () => {
    expect(saleOfferRecord.isInvestment).to.equal(true)
  })

  it('isInvestment getter should return false on common offer', () => {
    expect(offerRecord.isInvestment).to.equal(false)
  })

})
