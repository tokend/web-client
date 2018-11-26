import { formatOrderNumber } from './formatOrderNumber'
import { i18nOptions } from '@/i18n'
import i18next from 'i18next'

describe('formatOrderNumber filter test', () => {
  beforeEach(() => {
    i18next.init(i18nOptions)
    sinon.restore()
  })

  it('formats the order number', () => {
    const spy = sinon.spy(i18next, 't')

    formatOrderNumber('10')

    expect(
      spy
        .withArgs('formats.order_number', {
          value: '10'
        })
        .calledOnce
    ).to.equal(true)
  })
})
