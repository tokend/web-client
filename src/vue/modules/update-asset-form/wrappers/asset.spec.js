import { Asset } from './asset'

describe('Asset', () => {
  describe('constructor', () => {
    it('should properly parse record', () => {
      const record = {
        id: 'USD',
        policies: { value: 16 },
        details: {
          name: 'American Dollar',
          logo: { key: 'logo-key' },
          terms: { key: 'terms-key' },
        },
      }

      const result = new Asset(record)

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
