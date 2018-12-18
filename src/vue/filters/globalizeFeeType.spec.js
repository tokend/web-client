import { globalizeFeeType } from './globalizeFeeType'

import { i18nOptions } from '@/i18n'
import i18next from 'i18next'

describe('globalizeFeeType filter test', () => {
  const translationCodes = {
    0: 'payment-fee',
    1: 'offer-fee',
    2: 'withdrawal-fee',
    3: 'issuance-fee',
    4: 'invest-fee',
    5: 'capital-deployment-fee',
    6: 'operation-fee',
    7: 'payout-fee'
  }

  beforeEach(() => {
    i18next.init(i18nOptions)
    sinon.restore()
  })

  for (const [code, translation] of Object.entries(translationCodes)) {
    it(`Code ${code} stands for ${translation} fee type`, () => {
      const spy = sinon.spy(i18next, 't')
      globalizeFeeType(code)

      expect(
        spy
          .withArgs(`fee.${translation}`)
          .calledOnce
      ).to.be.true
    })
  }
})
