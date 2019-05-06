import { PreIssuanceRequest } from './pre-issuance-request'

describe('Pre-issuance request', () => {
  describe('constructor', () => {
    it('should properly parse record', () => {
      const record = {
        requestDetails: {
          asset: { id: 'USD' },
          amount: '100.000000',
        },
      }

      const result = new PreIssuanceRequest(record)

      expect(result.assetCode).to.equal('USD')
      expect(result.amount).to.equal('100.000000')
    })
  })
})
