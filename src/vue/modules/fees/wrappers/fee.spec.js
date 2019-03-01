import { Fee } from './fee'
import { FEE_SCOPES } from '../const/fee-scopes'

describe('Fee', () => {
  describe('constructor', () => {
    it('should properly parse record', () => {
      const record = {
        appliedTo: {
          asset: 'USD',
          feeType: 0,
          subtype: 1,
          lowerBound: '1000.000000',
          upperBound: '10000.000000',
        },
        account: {
          id: 'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ'
        },
        accountRole: {
          id: '5',
        },
        fixed: '0.500000',
        percent: '1.000000',
      }

      const result = new Fee(record)

      expect(result.fixed).to.equal('0.500000')
      expect(result.percent).to.equal('1.000000')

      expect(result.asset).to.equal('USD')

      expect(result.type).to.equal(0)
      expect(result.subtype).to.equal(1)

      expect(result.lowerBound).to.equal('1000.000000')
      expect(result.upperBound).to.equal('10000.000000')

      expect(result.accountId).to.equal('GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ')
      expect(result.accountRoleId).to.equal('5')
    })
  })

  describe('method', () => {
    describe('_getScope', () => {
      it('should return account scope if account ID is present', () => {
        const fee = new Fee({
          account: {
            id: 'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ',
          },
        })

        const result = fee._getScope()

        expect(result).to.equal(FEE_SCOPES.account)
      })

      it('should return account role scope if account role ID is present', () => {
        const fee = new Fee({
          accountRole: {
            id: '5',
          },
        })

        const result = fee._getScope()

        expect(result).to.equal(FEE_SCOPES.accountRole)
      })

      it('should return general scope if neither account ID nor account role ID is present', () => {
        const fee = new Fee({})

        const result = fee._getScope()

        expect(result).to.equal(FEE_SCOPES.general)
      })
    })
  })
})
