import { Asset } from './asset'

describe('Asset', () => {
  describe('constructor', () => {
    it('should properly parse record', () => {
      const record = {
        id: 'USD',
        issued: '100.000000',
        maxIssuanceAmount: '3000.000000',
        availableForIssuance: '2900.000000',
        owner: {
          id: 'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ',
        },
        details: {
          name: 'American Dollar',
          logo: {
            key: 'logo-key',
          },
          terms: {
            key: 'terms-key',
          },
        },
      }
      const balance = '10.000000'

      const result = new Asset(record, balance)

      expect(result.code).to.equal('USD')
      expect(result.name).to.equal('American Dollar')

      expect(result.issued).to.equal('100.000000')
      expect(result.maxIssuanceAmount).to.equal('3000.000000')
      expect(result.availableForIssuance).to.equal('2900.000000')

      expect(result.logoKey).to.equal('logo-key')
      expect(result.termsKey).to.equal('terms-key')

      expect(result.owner).to.equal('GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ')
      expect(result.balance).to.equal('10.000000')
    })
  })
})
