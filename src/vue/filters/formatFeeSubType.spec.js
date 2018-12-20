import { formatFeeSubType } from './formatFeeSubType'

import { i18nOptions } from '@/i18n'
import i18next from 'i18next'

import { FEE_TYPES, PAYMENT_FEE_SUBTYPES } from '@tokend/js-sdk'

describe('formatFeeSubType filter test', () => {
  beforeEach(() => {
    i18next.init(i18nOptions)
    sinon.restore()
  })

  for (const subtype of Object.values(PAYMENT_FEE_SUBTYPES)) {
    it(`Filter calls the i18next.t() with the payment fee type and subtype ${subtype}`, () => {
      const spy = sinon.spy(i18next, 't')
      formatFeeSubType({
        type: FEE_TYPES.paymentFee,
        subtype: subtype
      })
      expect(
        spy
          .withArgs('formats.fee_subtype', {
            value: {
              type: FEE_TYPES.paymentFee,
              subtype: subtype
            },
            interpolation: {
              escapeValue: false
            }
          })
          .calledOnce
      ).to.be.true
    })
  }
})
