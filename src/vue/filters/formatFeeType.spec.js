import { formatFeeType } from './formatFeeType'

import { i18nOptions } from '@/i18n'
import i18next from 'i18next'

import { FEE_TYPES } from '@tokend/js-sdk'

describe('formatFeeType filter test', () => {
  beforeEach(() => {
    i18next.init(i18nOptions)
    sinon.restore()
  })

  for (const type of Object.values(FEE_TYPES)) {
    it(`Filter calls the i18next.t() with the code ${type}`, () => {
      const spy = sinon.spy(i18next, 't')
      formatFeeType(type)

      expect(
        spy
          .withArgs('formats.fee_type', { value: type })
          .calledOnce
      ).to.be.true
    })
  }
})
