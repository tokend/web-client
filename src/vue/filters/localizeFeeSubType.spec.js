import { localizeFeeSubType } from './localizeFeeSubType'
import { i18nOptions } from '@/i18n'
import i18next from 'i18next'

describe('localizeFeeSubType filter test', () => {
  beforeEach(() => {
    i18next.init(i18nOptions)
    sinon.restore()
  })

  it('fee subtype code 0 stands for incoming/outgoing fee subtype', () => {
    const spy = sinon.spy(i18next, 't')
    localizeFeeSubType(0)

    expect(
      spy
        .withArgs('fee.incoming_outgoing')
        .calledOnce
    ).to.equal(true)
  })

  it('fee subtype 1 stands for outgoing fee', () => {
    const spy = sinon.spy(i18next, 't')
    localizeFeeSubType(1)

    expect(
      spy
        .withArgs('fee.outgoing')
        .calledOnce
    ).to.equal(true)
  })

  it('fee subtype code 2 stands for incoming fee subtype', () => {
    const spy = sinon.spy(i18next, 't')
    localizeFeeSubType(2)

    expect(
      spy
        .withArgs('fee.incoming')
        .calledOnce
    ).to.equal(true)
  })
})
