import { SaleRecord } from './sale.record'
import { recordResponses, mockAccountId } from './test/records.mocks'

describe('record.sale', () => {
  let saleRecord
  let doesNotAcceptBTCSaleRecord
  let doesNotAcceptETHSaleRecord
  beforeEach(() => {
    saleRecord = new SaleRecord(recordResponses.sale, mockAccountId)
    doesNotAcceptBTCSaleRecord = new SaleRecord(recordResponses.saleNoBTC, mockAccountId)
    doesNotAcceptETHSaleRecord = new SaleRecord(recordResponses.saleNoETH, mockAccountId)
  })

  it('should properly parse owner field', () => {
    expect(saleRecord.owner).to.equal(recordResponses.sale.owner_id)
  })
  it('should properly parse baseAsset field', () => {
    expect(saleRecord.baseAsset).to.equal(recordResponses.sale.base_asset)
  })
  it('should properly parse defaultQuoteAsset field', () => {
    expect(saleRecord.defaultQuoteAsset).to.equal(recordResponses.sale.default_quote_asset)
  })
  it('should properly parse quoteAssets field', () => {
    expect(saleRecord.quoteAssets).to.deep.equal(recordResponses.sale.quote_assets.quote_assets)
  })
  it('should properly parse baseHardCap field', () => {
    expect(saleRecord.baseHardCap).to.equal(recordResponses.sale.base_hard_cap)
  })
  it('should properly parse startTime field', () => {
    expect(saleRecord.startTime).to.equal(recordResponses.sale.start_time)
  })
  it('should properly parse endTime field', () => {
    expect(saleRecord.endTime).to.equal(recordResponses.sale.end_time)
  })
  it('should properly parse softCap field', () => {
    expect(saleRecord.softCap).to.equal(recordResponses.sale.soft_cap)
  })
  it('should properly parse hardCap field', () => {
    expect(saleRecord.hardCap).to.equal(recordResponses.sale.hard_cap)
  })
  it('should properly parse currentCap field', () => {
    expect(saleRecord.currentCap).to.equal(recordResponses.sale.current_cap)
  })
  it('should properly parse name field', () => {
    expect(saleRecord.name).to.equal(recordResponses.sale.details.name)
  })
  it('should properly parse descriptionID field', () => {
    expect(saleRecord.descriptionID).to.equal(recordResponses.sale.details.description)
  })
  it('should properly parse shortDescription field', () => {
    expect(saleRecord.shortDescription).to.equal(recordResponses.sale.details.short_description)
  })
  it('should properly parse youTubeVideoId field', () => {
    expect(saleRecord.youTubeVideoId).to.equal(recordResponses.sale.details.youtube_video_id)
  })
  it('should properly parse statistics field', () => {
    expect(saleRecord.statistics).to.deep.equal(recordResponses.sale.statistics)
  })
  it('should properly parse investors field', () => {
    expect(saleRecord.investors).to.equal(recordResponses.sale.statistics.investors)
  })
  it('should properly parse averageInvestment field', () => {
    expect(saleRecord.averageInvestment).to.equal(recordResponses.sale.statistics.average_amount)
  })
  it('should properly parse syndicateEmail field', () => {
    expect(saleRecord.syndicateEmail).to.equal('')
  })
  it('should properly parse syndicateDetails field', () => {
    expect(saleRecord.syndicateDetails).to.deep.equal({})
  })
  it('should properly parse description field', () => {
    expect(saleRecord.description).to.equal('')
  })
  it('getter quoteAssetCodes should properly derive data', () => {
    expect(saleRecord.quoteAssetCodes).to.deep.equal(['BTC', 'ETH', 'SWM' ])
  })
  it('getter quoteAssetPrices should properly derive data', () => {
    expect(saleRecord.quoteAssetPrices).to.deep.equal({
      'BTC': recordResponses.sale.quote_assets.quote_assets.find(asset => asset.asset === 'BTC').price,
      'ETH': recordResponses.sale.quote_assets.quote_assets.find(asset => asset.asset === 'ETH').price,
      'SWM': recordResponses.sale.quote_assets.quote_assets.find(asset => asset.asset === 'SWM').price
    })
  })
  it('getter currentCaps should properly derive data', () => {
    expect(saleRecord.currentCaps).to.deep.equal({
      'BTC': recordResponses.sale.quote_assets.quote_assets.find(asset => asset.asset === 'BTC').current_cap,
      'ETH': recordResponses.sale.quote_assets.quote_assets.find(asset => asset.asset === 'ETH').current_cap,
      'SWM': recordResponses.sale.quote_assets.quote_assets.find(asset => asset.asset === 'SWM').current_cap
    })
  })
  it('getter totalCurrentCaps should properly derive data', () => {
    expect(saleRecord.totalCurrentCaps).to.deep.equal({
      'BTC': recordResponses.sale.quote_assets.quote_assets.find(asset => asset.asset === 'BTC').total_current_cap,
      'ETH': recordResponses.sale.quote_assets.quote_assets.find(asset => asset.asset === 'ETH').total_current_cap,
      'SWM': recordResponses.sale.quote_assets.quote_assets.find(asset => asset.asset === 'SWM').total_current_cap
    })
  })
  it('getter hardCaps should properly derive data', () => {
    expect(saleRecord.hardCaps).to.deep.equal({
      'BTC': recordResponses.sale.quote_assets.quote_assets.find(asset => asset.asset === 'BTC').hard_cap,
      'ETH': recordResponses.sale.quote_assets.quote_assets.find(asset => asset.asset === 'ETH').hard_cap,
      'SWM': recordResponses.sale.quote_assets.quote_assets.find(asset => asset.asset === 'SWM').hard_cap
    })
  })
  it ('getter accepts BTC should return false for sale that doesn\'t accept BTC' , () => {
    expect(doesNotAcceptBTCSaleRecord.acceptsBTC).to.equal(false)
  })
  it ('getter accepts BTC should return true because asset accepts BTC' , () => {
    expect(saleRecord.acceptsBTC).to.equal(true)
  })
  it ('getter accepts ETH should return false for sale that doesn\'t accept ETH' , () => {
    expect(doesNotAcceptETHSaleRecord.acceptsETH).to.equal(false)
  })
  it ('getter accepts ETH should return true because asset accepts ETH' , () => {
    expect(saleRecord.acceptsETH).to.equal(true)
  })
})
