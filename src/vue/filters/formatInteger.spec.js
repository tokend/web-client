import { formatInteger } from './formatInteger'
import { i18nOptions } from '@/i18n'
import i18next from 'i18next'

describe('formatInteger filter test', () => {
  beforeEach(() => {
    i18next.init(i18nOptions)
  })

  it('formats the integer', () => {
    expect(formatInteger('2321.12312'))
      .to
      .equal('2,321')
  })
})
