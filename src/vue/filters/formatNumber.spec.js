import { formatNumber } from './formatNumber'
import { i18nOptions } from '@/i18n'
import i18next from 'i18next'

describe('formatNumber filter test', () => {
  beforeEach(() => {
    i18next.init(i18nOptions)
  })

  it('formats the number', () => {
    expect(formatNumber('2000.50500'))
      .to
      .equal('2,000.505')
  })
})
