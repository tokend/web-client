import { localizeFeeType } from './localizeFeeType'
import { i18nOptions } from '@/i18n'
import i18next from 'i18next'

describe('localizeFeeType filter test', () => {
  beforeEach(() => {
    i18next.init(i18nOptions)
    sinon.restore()
  })

  it('fee type code 0 stands for payment fee type', () => {
    const spy = sinon.spy(i18next, 't')
    localizeFeeType(0)

    expect(
      spy
        .withArgs('fee.payment_fee')
        .calledOnce
    ).to.equal(true)
  })

  it('fee type code 1 stands for offer fee type', () => {
    const spy = sinon.spy(i18next, 't')
    localizeFeeType(1)

    expect(
      spy
        .withArgs('fee.offer_fee')
        .calledOnce
    ).to.equal(true)
  })

  it('fee type code 2 stands for withdrawal fee type', () => {
    const spy = sinon.spy(i18next, 't')
    localizeFeeType(2)

    expect(
      spy
        .withArgs('fee.withdrawal_fee')
        .calledOnce
    ).to.equal(true)
  })

  it('fee type code 3 stands for issuance fee type', () => {
    const spy = sinon.spy(i18next, 't')
    localizeFeeType(3)

    expect(
      spy
        .withArgs('fee.issuance_fee')
        .calledOnce
    ).to.equal(true)
  })

  it('fee type code 4 stands for invest fee type', () => {
    const spy = sinon.spy(i18next, 't')
    localizeFeeType(4)

    expect(
      spy
        .withArgs('fee.invest_fee')
        .calledOnce
    ).to.equal(true)
  })

  it('fee type code 5 stands for capital deployment fee type', () => {
    const spy = sinon.spy(i18next, 't')
    localizeFeeType(5)

    expect(
      spy
        .withArgs('fee.capital_deployment_fee')
        .calledOnce
    ).to.equal(true)
  })

  it('fee type code 6 stands for operation fee type', () => {
    const spy = sinon.spy(i18next, 't')
    localizeFeeType(6)

    expect(
      spy
        .withArgs('fee.operation_fee')
        .calledOnce
    ).to.equal(true)
  })

  it('fee type code 7 stands for payout fee type', () => {
    const spy = sinon.spy(i18next, 't')
    localizeFeeType(7)

    expect(
      spy
        .withArgs('fee.payout_fee')
        .calledOnce
    ).to.equal(true)
  })
})
