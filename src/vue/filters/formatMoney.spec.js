import { formatMoney } from './formatMoney'
import { i18nOptions } from '@/i18n'
import i18next from 'i18next'

describe('formatMoney filter test', () => {
  beforeEach(() => {
    i18next.init(i18nOptions)
  })

  it('formats the money amount', () => {
    expect(formatMoney('1000.21000'))
      .to
      .equal('1,000.21')
  })

  it('formats the money amount with preset currency', () => {
    expect(formatMoney({
      value: '5012.200',
      currency: 'USD'
    })).to.equal('$5,012.2')
  })
})
