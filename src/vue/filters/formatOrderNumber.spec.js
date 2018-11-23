import { formatOrderNumber } from './formatOrderNumber'
import { i18nOptions } from '@/i18n'
import i18next from 'i18next'

describe('formatOrderNumber filter test', () => {
  beforeEach(() => {
    i18next.init(i18nOptions)
  })

  it('formats the order number', () => {
    expect(formatOrderNumber('10'))
      .to
      .equal('10th')
  })
})
