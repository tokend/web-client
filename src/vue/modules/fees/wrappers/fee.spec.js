import { Fee } from './fee'

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
    })
  })
})
