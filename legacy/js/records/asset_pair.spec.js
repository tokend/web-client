import { recordResponses } from './test/records.mocks'
import { AssetPairRecord } from './asset_pair.record'

describe('record.asset_pair', () => {
  let assetPairRecord
  beforeEach(() => {
    assetPairRecord = new AssetPairRecord(recordResponses.assetPair)
  })

  it('should proper parse base', () => {
    expect(assetPairRecord.base).to.equal(recordResponses.assetPair.base)
  })
  it('should proper parse quote', () => {
    expect(assetPairRecord.quote).to.equal(recordResponses.assetPair.quote)
  })
  it('should proper parse current_price', () => {
    expect(assetPairRecord.currentPrice).to.equal(recordResponses.assetPair.current_price)
  })
  it('should proper parse physical_price', () => {
    expect(assetPairRecord.physicalPrice).to.equal(recordResponses.assetPair.physical_price)
  })
  it('should proper parse physical_price_correction', () => {
    expect(assetPairRecord.physicalPriceCorrection).to.equal(recordResponses.assetPair.physical_price_correction)
  })
  it('should proper parse max_price_step', () => {
    expect(assetPairRecord.maxPriceStep).to.equal(recordResponses.assetPair.max_price_step)
  })
})
