import { formatDate } from './formatDate'
import { i18nOptions } from '@/i18n'
import i18next from 'i18next'

describe('formatDate filter test', () => {
  beforeEach(() => {
    i18next.init(i18nOptions)
    sinon.restore()
    sinon.useFakeTimers({
      now: 1542968022000 // 23 Nov 2018
    })
  })

  it('formats the date', () => {
    expect(formatDate('2017-11-20T10:23:45Z'))
      .to
      .equal('November 20, 2017 at 10:23')
  })
})
