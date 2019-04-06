import { Asset } from './asset'

describe('Asset', () => {
  describe('constructor', () => {
    it('should properly parse record', () => {
      const record = {
        id: 'USD',
        owner: { id: 'SOME_ACCOUNT_ID' },
        details: {
          name: 'Dollar',
          logo: { key: 'logo-key' },
        },
      }

      const result = new Asset(record)

      expect(result.code).to.equal('USD')
      expect(result.owner).to.equal('SOME_ACCOUNT_ID')

      expect(result.name).to.equal('Dollar')
      expect(result.logoKey).to.equal('logo-key')
    })
  })

  describe('methods', () => {
    describe('logoUrl', () => {
      it('returns storage logo URL if logo key is present', () => {
        const asset = new Asset({
          details: {
            logo: { key: 'logo-key' },
          },
        })

        expect(asset.logoUrl('https://storage.com'))
          .to.equal('https://storage.com/logo-key')
      })

      it('returns empty string if logo key is absent', () => {
        const asset = new Asset({})

        expect(asset.logoUrl('https://storage.com')).to.equal('')
      })
    })
  })

  describe('getters', () => {
    describe('nameAndCode', () => {
      it('returns asset code and name in the format [name (code)] if name is present', () => {
        const asset = new Asset({
          id: 'USD',
          details: {
            name: 'Dollar',
          },
        })

        expect(asset.nameAndCode).to.equal('Dollar (USD)')
      })

      it('returns asset code and name in the format [code (code)] if name is absent', () => {
        const asset = new Asset({
          id: 'USD',
        })

        expect(asset.nameAndCode).to.equal('USD (USD)')
      })
    })
  })
})
