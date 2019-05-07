import { Issuance } from './issuance'

describe('Issuance', () => {
  describe('constructor', () => {
    it('should properly parse record', () => {
      const result = new Issuance({
        record: {
          asset: 'USD',
          amount: '100.000000',
        },
        xdr: 'SOME_XDR_VALUE',
        isUsed: false,
      })

      expect(result.asset).to.equal('USD')
      expect(result.amount).to.equal('100.000000')
      expect(result.xdr).to.equal('SOME_XDR_VALUE')
      expect(result.isUsed).to.be.false
    })
  })
})
