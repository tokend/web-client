import { formatNumber } from './formatNumber'
import { i18nOptions } from '@/i18n'
import i18next from 'i18next'

describe('formatNumber filter test', () => {
  beforeEach(() => {
    i18next.init(i18nOptions)
    sinon.restore()
  })

  it('formats the number', () => {
    const spy = sinon.spy(i18next, 't')

    formatNumber('2000.50500')

    expect(
      spy
        .withArgs('formats.number', {
          value: '2000.50500'
        })
        .calledOnce
    ).to.equal(true)
  })
})
