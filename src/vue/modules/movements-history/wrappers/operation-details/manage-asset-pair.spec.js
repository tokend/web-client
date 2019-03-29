import { ManageAssetPairOp } from './manage-asset-pair'

import { ASSET_PAIR_POLICIES } from '@tokend/js-sdk'

describe('ManageAssetPairOp', () => {
  it('properly parses the record', () => {
    const record = {
      physicalPrice: '1.219021',
      physicalPriceCorrection: '2.310002',
      maxPriceStep: '2.100000',
      policies: {
        value: 0,
        flags: null,
      },
      baseAsset: {
        id: 'BTC',
      },
      quoteAsset: {
        id: 'ETH',
      },
    }

    const result = new ManageAssetPairOp(record)

    expect(result.physicalPrice).to.equal('1.219021')
    expect(result.maxPriceStep).to.equal('2.100000')
    expect(result.physicalPriceCorrection).to.equal('2.310002')
    expect(result.policy).to.equal(0)
    expect(result.baseAssetCode).to.equal('BTC')
    expect(result.quoteAssetCode).to.equal('ETH')
  })

  describe('getters', () => {
    it('isTradeable', () => {
      let record = new ManageAssetPairOp({
        policies: {
          value: ASSET_PAIR_POLICIES.tradeableSecondaryMarket,
        },
      })

      expect(record.isTradeable).to.be.true

      record = new ManageAssetPairOp({
        policies: {
          value: 0,
        },
      })

      expect(record.isTradeable).to.be.false
    })

    it('isPhysicalPriceRestricted', () => {
      let record = new ManageAssetPairOp({
        policies: {
          value: ASSET_PAIR_POLICIES.physicalPriceRestriction,
        },
      })

      expect(record.isPhysicalPriceRestricted).to.be.true

      record = new ManageAssetPairOp({
        policies: {
          value: 0,
        },
      })

      expect(record.isPhysicalPriceRestricted).to.be.false
    })

    it('isCurrentPriceRestricted', () => {
      let record = new ManageAssetPairOp({
        policies: {
          value: ASSET_PAIR_POLICIES.currentPriceRestriction,
        },
      })

      expect(record.isCurrentPriceRestricted).to.be.true

      record = new ManageAssetPairOp({
        policies: {
          value: 0,
        },
      })

      expect(record.isCurrentPriceRestricted).to.be.false
    })
  })
})
