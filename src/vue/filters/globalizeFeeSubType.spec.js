import { globalizeFeeSubType } from './globalizeFeeSubType'

import { i18nOptions } from '@/i18n'
import i18next from 'i18next'

describe('globalizeFeeSubType filter test', () => {
  const translationCodes = {
    0: 'incoming-outgoing',
    1: 'outgoing',
    2: 'incoming'
  }

  beforeEach(() => {
    i18next.init(i18nOptions)
    sinon.restore()
  })

  for (const [code, translation] of Object.entries(translationCodes)) {
    it(`Code ${code} stands for ${translation} fee subtype`, () => {
      const spy = sinon.spy(i18next, 't')
      globalizeFeeSubType(code)

      expect(
        spy
          .withArgs(`fee.${translation}`)
          .calledOnce
      ).to.be.true
    })
  }
})
