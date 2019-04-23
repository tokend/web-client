import { UpdateAssetRequest } from './update-asset-request'

describe('Update asset request', () => {
  describe('constructor', () => {
    it('should properly parse record', () => {
      const record = {
        id: '10',
        requestDetails: {
          asset: { id: 'USD' },
          policies: 16,
          creatorDetails: {
            name: 'American Dollar',
            logo: { key: 'logo-key' },
            terms: { key: 'terms-key' },
          },
        },
      }

      const result = new UpdateAssetRequest(record)

      expect(result.id).to.equal('10')

      expect(result.code).to.equal('USD')
      expect(result.name).to.equal('American Dollar')

      expect(result.policy).to.equal(16)

      expect(result.logo).to.deep.equal({ key: 'logo-key' })
      expect(result.logoKey).to.equal('logo-key')

      expect(result.terms).to.deep.equal({ key: 'terms-key' })
      expect(result.termsKey).to.equal('terms-key')
    })
  })
})
