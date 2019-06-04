import { Fee } from './fee'

describe('Fee', () => {
  describe('methods', () => {
    describe('setAdditional', () => {
      it('sets passed additional fee', () => {
        const fee = new Fee({})

        fee.setAdditional('5.000000')

        expect(fee.additional).to.equal('5.000000')
      })
    })

    describe('removeAdditional', () => {
      it('removes additional fee', () => {
        const fee = new Fee({})
        fee.setAdditional('5.000000')

        fee.removeAdditional()

        expect(fee.additional).to.equal('0')
      })
    })
  })

  describe('getters', () => {
    describe('calculated', () => {
      it('calculates a sum of fixed and percent fee', () => {
        const fee = new Fee({
          fixed: '10.000000',
          calculatedPercent: '5.000000',
        })
        fee.setAdditional('3.000000')

        expect(fee.calculated).to.equal('15.000000')
      })
    })

    describe('total', () => {
      it('calculates a sum of fixed, percent, and additional fee', () => {
        const fee = new Fee({
          fixed: '10.000000',
          calculatedPercent: '5.000000',
        })
        fee.setAdditional('3.000000')

        expect(fee.total).to.equal('18.000000')
      })
    })

    describe('isEmpty', () => {
      it('returns true only for empty fees', () => {
        const emptyFee = new Fee({
          fixed: '0.000000',
          calculatedPercent: '0.000000',
        })
        expect(emptyFee.isEmpty).to.be.true

        const nonEmptyFee = new Fee({
          fixed: '5.000000',
          calculatedPercent: '1.000000',
        })
        expect(nonEmptyFee.isEmpty).to.be.false

        const additionalFee = new Fee({
          fixed: '0.000000',
          calculatedPercent: '0.000000',
        })
        additionalFee.setAdditional('3.000000')
        expect(additionalFee.isEmpty).to.be.false

        const notSetFee = new Fee({})
        expect(notSetFee.isEmpty).to.be.false
      })
    })
  })
})
