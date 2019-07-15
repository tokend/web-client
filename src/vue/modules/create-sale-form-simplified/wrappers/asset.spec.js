import { Asset } from './asset'
import { ASSET_POLICIES } from '@tokend/js-sdk'

describe('Asset', () => {
  describe('constructor', () => {
    it('should properly parse record', () => {
      const record = {
        id: 'USD',
        owner: { id: 'SOME_ACCOUNT_ID' },
        availableForIssuance: '100.000000',
        policies: { value: 16 },
        details: { name: 'Dollar' },
      }

      const result = new Asset(record)

      expect(result.code).to.equal('USD')
      expect(result.name).to.equal('Dollar')

      expect(result.availableForIssuance).to.equal('100.000000')
      expect(result.policy).to.equal(16)
      expect(result.owner).to.equal('SOME_ACCOUNT_ID')
    })
  })

  describe('getters', () => {
    describe('isBaseAsset', () => {
      it('returns proper value', () => {
        const baseAsset = new Asset({
          policies: { value: ASSET_POLICIES.baseAsset },
        })
        const notBaseAsset = new Asset({
          policies: { value: 0 },
        })

        expect(baseAsset.isBaseAsset).to.be.true
        expect(notBaseAsset.isBaseAsset).to.be.false
      })
    })

    describe('isDefaultQuoteAsset', () => {
      it('returns proper value', () => {
        const defaultQuoteAsset = new Asset({
          policies: { value: ASSET_POLICIES.statsQuoteAsset },
        })
        const notDefaultQuoteAsset = new Asset({
          policies: { value: 0 },
        })

        expect(defaultQuoteAsset.isDefaultQuoteAsset).to.be.true
        expect(notDefaultQuoteAsset.isDefaultQuoteAsset).to.be.false
      })
    })

    describe('nameAndCode', () => {
      it('returns asset code and name in the format [name (code)] if name is present', () => {
        const asset = new Asset({
          id: 'USD',
          details: { name: 'Dollar' },
        })

        expect(asset.nameAndCode).to.equal('Dollar (USD)')
      })

      it('returns asset code and name in the format [code (code)] if name is absent', () => {
        const asset = new Asset({ id: 'USD' })

        expect(asset.nameAndCode).to.equal('USD (USD)')
      })
    })
  })
})
