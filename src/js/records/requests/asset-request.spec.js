import { AssetRequest } from './asset-request.record'
import { Document } from '@tokend/js-sdk'

describe('Asset request', () => {
  describe('constructor', () => {
    it('should properly parse record', () => {
      const record = {
        requestDetails: {
          asset: { id: 'USD' },
          type: 1,
          maxIssuanceAmount: '2000.000000',
          initialPreissuedAmount: '1000.000000',
          preIssuanceAssetSigner: 'SIGNER_ID',
          policies: 16,
          creatorDetails: {
            name: 'American Dollar',
            logo: { key: 'logo-key' },
            terms: { key: 'terms-key' },
          },
        },
      }

      const result = new AssetRequest(record)

      expect(result.assetCode).to.equal('USD')
      expect(result.assetType).to.equal(1)
      expect(result.assetName).to.equal('American Dollar')

      expect(result.initialPreissuedAmount).to.equal('1000.000000')
      expect(result.maxIssuanceAmount).to.equal('2000.000000')
      expect(result.preIssuanceAssetSigner).to.equal('SIGNER_ID')

      expect(result.policy).to.equal(16)

      expect(result.logo).to.be.an.instanceof(Document)
      expect(result.logo).to.have.property('key', 'logo-key')
      expect(result.logoKey).to.equal('logo-key')

      expect(result.terms).to.be.an.instanceof(Document)
      expect(result.terms).to.have.property('key', 'terms-key')
      expect(result.termsKey).to.equal('terms-key')
    })
  })
})
