import { Fee } from './fee'
import { FeesCollection } from './fees-collection'

import { PAYMENT_FEE_SUBTYPES } from '@tokend/js-sdk'

describe('FeesCollection', () => {
  describe('getters', () => {
    describe('total', () => {
      it('calculates a sum of all present fees', () => {
        const feesCollection = new FeesCollection({
          fees: [
            new Fee({
              fixed: '10.000000',
              calculatedPercent: '5.000000',
            }),
            new Fee({
              fixed: '7.000000',
              calculatedPercent: '3.000000',
            }),
            new Fee({
              fixed: '3.000000',
              calculatedPercent: '8.000000',
            }),
          ],
        })

        expect(feesCollection.totalFee).to.deep.equal({
          fixed: '20.000000',
          calculatedPercent: '16.000000',
        })
      })
    })

    describe('additionalFees', () => {
      it('returns all fees thart are not incoming of outgoing', () => {
        const feesCollection = new FeesCollection({
          fees: [
            new Fee({}),
            new Fee({ subtype: PAYMENT_FEE_SUBTYPES.incoming }),
            new Fee({ subtype: PAYMENT_FEE_SUBTYPES.outgoing }),
            new Fee({ fixed: '3.000000' }),
          ],
        })

        expect(feesCollection.additionalFees).to.deep.equal([
          new Fee({}),
          new Fee({ fixed: '3.000000' }),
        ])
      })
    })

    describe('destinationFee', () => {
      it('returns empty fee if source pays for destination or incoming fee otherwise', () => {
        const feesCollection = new FeesCollection({
          fees: [
            new Fee({ subtype: PAYMENT_FEE_SUBTYPES.outgoing }),
            new Fee({
              subtype: PAYMENT_FEE_SUBTYPES.incoming,
              fixed: '3.000000',
              calculatedPercent: '8.000000',
            }),
          ],
        })

        expect(feesCollection.destinationFee.fixed).to.equal('3.000000')
        expect(feesCollection.destinationFee.calculatedPercent)
          .to.equal('8.000000')

        feesCollection.isPaidForDestination = true

        expect(feesCollection.destinationFee.fixed).to.equal('0')
        expect(feesCollection.destinationFee.calculatedPercent)
          .to.equal('0')
      })
    })
  })
})
