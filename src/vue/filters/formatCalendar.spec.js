import { formatCalendar } from './formatCalendar'
import { i18nOptions } from '@/i18n'
import i18next from 'i18next'

describe('formatDate filter test', () => {
  beforeEach(() => {
    i18next.init(i18nOptions)
  })

  afterEach(() => {
    sinon.restore()
  })

  it('formats the date', () => {
    const spy = sinon.spy(i18next, 't')

    formatCalendar('2017-11-20T10:23:45Z')

    expect(spy
      .withArgs(
        'formats.calendar', {
          value: '2017-11-20T10:23:45Z',
        })
      .calledOnce
    ).to.equal(true)
  })
})
