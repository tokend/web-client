import { formatInteger } from './formatInteger'
import { i18nOptions } from '@/i18n'
import i18next from 'i18next'

describe('formatInteger filter test', () => {
  beforeEach(() => {
    i18next.init(i18nOptions)
    sinon.restore()
  })

  it('formats the integer', () => {
    const spy = sinon.spy(i18next, 't')
    formatInteger('2321.12312')

    expect(spy
      .withArgs('formats.integer', { value: '2321.12312' })
      .calledOnce
    )
      .to.equal(true)
  })
})
