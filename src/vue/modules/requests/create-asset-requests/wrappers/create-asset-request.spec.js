import { CreateAssetRequest } from './create-asset-request'
import { ASSET_POLICIES } from '@tokend/js-sdk'

describe('Create asset request', () => {
  describe('constructor', () => {
    it('should properly parse record', () => {
      const record = {
        requestDetails: {
          asset: { id: 'USD' },
          type: 0,
          initialPreissuedAmount: '100.000000',
          maxIssuanceAmount: '1000.000000',
          preIssuanceAssetSigner: 'SIGNER_ID',
          policies: 3,
          creatorDetails: {
            name: 'Dollar',
            terms: { key: 'terms-key' },
            logo: { key: 'logo-key' },
          },
        },
      }

      const result = new CreateAssetRequest(record)

      expect(result.assetCode).to.equal('USD')
      expect(result.assetType).to.equal(0)
      expect(result.assetName).to.equal('Dollar')

      expect(result.initialPreissuedAmount).to.equal('100.000000')
      expect(result.maxIssuanceAmount).to.equal('1000.000000')
      expect(result.preIssuanceAssetSigner).to.equal('SIGNER_ID')

      expect(result.policy).to.equal(3)

      expect(result.terms).to.deep.equal({ key: 'terms-key' })
      expect(result.termsKey).to.equal('terms-key')

      expect(result.logo).to.deep.equal({ key: 'logo-key' })
      expect(result.logoKey).to.equal('logo-key')
    })
  })

  describe('getters', () => {
    describe('isTransferable', () => {
      it('returns true if the request has transferable policy', () => {
        const request = new CreateAssetRequest({
          requestDetails: {
            policies: ASSET_POLICIES.transferable,
          },
        })

        expect(request.isTransferable).to.be.true
      })

      it('returns false if the request does not have transferable policy', () => {
        const request = new CreateAssetRequest({
          requestDetails: { policies: 0 },
        })

        expect(request.isTransferable).to.be.false
      })
    })

    describe('isWithdrawable', () => {
      it('returns true if the request has withdrawable policy', () => {
        const request = new CreateAssetRequest({
          requestDetails: {
            policies: ASSET_POLICIES.withdrawable,
          },
        })

        expect(request.isWithdrawable).to.be.true
      })

      it('returns false if the request does not have withdrawable policy', () => {
        const request = new CreateAssetRequest({
          requestDetails: { policies: 0 },
        })

        expect(request.isWithdrawable).to.be.false
      })
    })
  })
})
