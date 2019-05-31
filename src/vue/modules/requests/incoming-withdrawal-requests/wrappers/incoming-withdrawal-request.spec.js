import { IncomingWithdrawalRequest } from './incoming-withdrawal-request'

describe('Incoming withdrawal request', () => {
  describe('constructor', () => {
    it('should properly parse record', () => {
      const record = {
        requestDetails: {
          amount: '10.000000',
          asset: { id: 'USD' },
          fee: {
            fixed: '1.000000',
            calculatedPercent: '3.000000',
          },
          creatorDetails: { comment: 'Some comment' },
        },
      }

      const result = new IncomingWithdrawalRequest(record)

      expect(result.amount).to.equal('10.000000')
      expect(result.asset.code).to.equal('USD')
      expect(result.fixedFee).to.equal('1.000000')
      expect(result.calculatedPercentFee).to.equal('3.000000')

      expect(result.comment).to.equal('Some comment')
    })
  })

  describe('getters', () => {
    describe('totalFee', () => {
      it('returns the sum of fixed and calculated percent fees', () => {
        const request = new IncomingWithdrawalRequest({
          requestDetails: {
            fee: {
              fixed: '1.000000',
              calculatedPercent: '2.000000',
            },
          },
        })

        expect(request.totalFee).to.equal('3.000000')
      })
    })
  })
})
