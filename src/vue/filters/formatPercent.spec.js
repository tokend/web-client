import { formatPercent } from './formatPercent'
import { i18nOptions } from '@/i18n'
import i18next from 'i18next'

describe('formatPercent filter test', () => {
  beforeEach(() => {
    i18next.init(i18nOptions)
    sinon.restore()
  })

  it('formats the [percent]', () => {
    const spy = sinon.spy(i18next, 't')
    formatPercent('25.256')

    expect(spy
      .withArgs('formats.percent', { value: '25.256' })
      .calledOnce
    )
      .to.be.true
  })
})
