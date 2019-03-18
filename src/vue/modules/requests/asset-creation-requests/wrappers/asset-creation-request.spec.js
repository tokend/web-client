import { AssetCreationRequest } from './asset-creation-request'
import { ASSET_POLICIES } from '@tokend/js-sdk'

describe('Asset creation request', () => {
  describe('constructor', () => {
    it('should properly parse record', () => {
      const record = {
        requestDetails: {
          asset: 'USD',
          type: 0,
          initialPreissuedAmount: '100.000000',
          maxIssuanceAmount: '1000.000000',
          preIssuanceAssetSigner: 'GBLPOFIGESQI7LG4ILTYHOMYTA7FBLG6G76DMNGZJDJSIO7VM3Z4YZ2J',
          policies: 3,
          creatorDetails: {
            name: 'Dollar',
            terms: {
              key: 'dpurex4infnebjhcost7fvlv776hudvnj3shl3gdjk57xjtkflvvbwmz',
            },
            logo: {
              key: 'dpurex4infnebjhcost7fvpmwbkjdkfxwegfwxy7lhthh7i3oydard55',
            },
          },
        },
      }

      const result = new AssetCreationRequest(record)

      expect(result.assetCode).to.equal('USD')
      expect(result.assetType).to.equal(0)
      expect(result.assetName).to.equal('Dollar')

      expect(result.initialPreissuedAmount).to.equal('100.000000')
      expect(result.maxIssuanceAmount).to.equal('1000.000000')
      expect(result.preissuedAssetSigner).to.equal('GBLPOFIGESQI7LG4ILTYHOMYTA7FBLG6G76DMNGZJDJSIO7VM3Z4YZ2J')

      expect(result.policy).to.equal(3)

      expect(result.terms).to.deep.equal({
        key: 'dpurex4infnebjhcost7fvlv776hudvnj3shl3gdjk57xjtkflvvbwmz',
      })
      expect(result.termsKey).to.equal('dpurex4infnebjhcost7fvlv776hudvnj3shl3gdjk57xjtkflvvbwmz')

      expect(result.logo).to.deep.equal({
        key: 'dpurex4infnebjhcost7fvpmwbkjdkfxwegfwxy7lhthh7i3oydard55',
      })
      expect(result.logoKey).to.equal('dpurex4infnebjhcost7fvpmwbkjdkfxwegfwxy7lhthh7i3oydard55')
    })
  })

  describe('methods', () => {
    describe('logoUrl', () => {
      it('returns storage logo URL if logo key is present', () => {
        const storageUrl = 'https://storage.com'
        const request = new AssetCreationRequest({
          requestDetails: {
            creatorDetails: {
              logo: {
                key: 'ASSET_LOGO_KEY',
              },
            },
          },
        })
        const expectedUrl = 'https://storage.com/ASSET_LOGO_KEY'

        expect(request.logoUrl(storageUrl)).to.equal(expectedUrl)
      })

      it('returns empty string if logo key is absent', () => {
        const storageUrl = 'https://storage.com'
        const request = new AssetCreationRequest({})

        expect(request.logoUrl(storageUrl)).to.equal('')
      })
    })

    describe('termsUrl', () => {
      it('returns storage terms URL if logo key is present', () => {
        const storageUrl = 'https://storage.com'
        const request = new AssetCreationRequest({
          requestDetails: {
            creatorDetails: {
              terms: {
                key: 'ASSET_TERMS_KEY',
              },
            },
          },
        })
        const expectedUrl = 'https://storage.com/ASSET_TERMS_KEY'

        expect(request.termsUrl(storageUrl)).to.equal(expectedUrl)
      })

      it('returns empty string if logo key is absent', () => {
        const storageUrl = 'https://storage.com'
        const request = new AssetCreationRequest({})

        expect(request.termsUrl(storageUrl)).to.equal('')
      })
    })
  })

  describe('getters', () => {
    describe('isTransferable', () => {
      it('returns true if the request has transferable policy', () => {
        const request = new AssetCreationRequest({
          requestDetails: {
            policies: ASSET_POLICIES.transferable,
          },
        })

        expect(request.isTransferable).to.be.true
      })

      it('returns false if the request does not have transferable policy', () => {
        const request = new AssetCreationRequest({
          requestDetails: {
            policies: 0,
          },
        })

        expect(request.isTransferable).to.be.false
      })
    })

    describe('isWithdrawable', () => {
      it('returns true if the request has withdrawable policy', () => {
        const request = new AssetCreationRequest({
          requestDetails: {
            policies: ASSET_POLICIES.withdrawable,
          },
        })

        expect(request.isWithdrawable).to.be.true
      })

      it('returns false if the request does not have withdrawable policy', () => {
        const request = new AssetCreationRequest({
          requestDetails: {
            policies: 0,
          },
        })

        expect(request.isWithdrawable).to.be.false
      })
    })
  })
})
