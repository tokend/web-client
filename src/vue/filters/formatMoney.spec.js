import { formatMoney } from './formatMoney'
import { i18nOptions } from '@/i18n'
import i18next from 'i18next'

describe('formatMoney filter test', () => {
  beforeEach(() => {
    i18next.init(i18nOptions)
    sinon.restore()
  })

  it('formats the money amount', () => {
    const spy = sinon.spy(i18next, 't')

    formatMoney('1000.21000')

    expect(
      spy
        .withArgs('formats.money', { value: '1000.21000' })
        .calledOnce
    ).to.equal(true)
  })

  it('formats the money amount with preset currency', () => {
    const spy = sinon.spy(i18next, 't')
    formatMoney({
      value: '5012.200',
      currency: 'USD'
    })

    expect(
      spy
        .withArgs('formats.money', {
          value: {
            value: '5012.200',
            currency: 'USD'
          }
        })
        .calledOnce
    ).to.equal(true)
  })
})
