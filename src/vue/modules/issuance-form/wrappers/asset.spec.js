import { Asset } from './asset'

describe('Asset', () => {
  describe('constructor', () => {
    it('should properly parse record', () => {
      const record = {
        id: 'USD',
        owner: { id: 'SOME_ACCOUNT_ID' },
        availableForIssuance: '100.000000',
        details: { name: 'Dollar' },
      }

      const result = new Asset(record)

      expect(result.code).to.equal('USD')
      expect(result.name).to.equal('Dollar')

      expect(result.availableForIssuance).to.equal('100.000000')
      expect(result.owner).to.equal('SOME_ACCOUNT_ID')
    })
  })

  describe('getters', () => {
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
