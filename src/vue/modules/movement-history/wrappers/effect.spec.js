import {
  MatchedEffect,
  BalanceChangedEffect,
  ParticularBalanceChangeEffect,
} from '@/vue/modules/movement-history/wrappers/effect'

describe('BalanceChangedEffect', () => {
  it('should properly parse the record', () => {
    const record = {
      id: '261993005057',
      type: 'effects-issued',
      amount: '50000.000000',
      fee: {
        fixed: '2.100000',
        calculatedPercent: '0.120000',
      },
    }

    const result = new BalanceChangedEffect(record)

    expect(result.amount).to.equal('50000.000000')
    expect(result.fixedFee).to.equal('2.100000')
    expect(result.calculatedPercentFee).to.equal('0.120000')
  })
})

describe('ParticularBalanceChangeEffect', () => {
  it('should properly parse the record', () => {
    const record = {
      amount: '50000.000000',
      fee: {
        fixed: '2.000000',
        calculatedPercent: '1.000000',
      },
      balanceAddress: 'BCKJYFIZNQOC4EMZ3USW7VPLA4HQFWQGT4RBLPOT4B2D545ZN3ABV2UQ',
      assetCode: 'BTC6747',
    }

    const result = new ParticularBalanceChangeEffect(record)

    expect(result.amount).to.equal('50000.000000')
    expect(result.fixedFee).to.equal('2.000000')
    expect(result.calculatedPercentFee).to.equal('1.000000')
    expect(result.balanceId).to.equal('BCKJYFIZNQOC4EMZ3USW7VPLA4HQFWQGT4RBLPOT4B2D545ZN3ABV2UQ')
    expect(result.assetCode).to.equal('BTC6747')
  })
})

describe('MatchedEffect', () => {
  it('should properly parse the record', () => {
    const record = {
      id: '261993005060',
      type: 'effects-matched',
      offerId: 0,
      orderBookId: 1,
      price: '1.000000',
      charged: {
        amount: '50000.000000',
        fee: {
          fixed: '0.000000',
          calculatedPercent: '0.000000',
        },
        balanceAddress: 'BCKJYFIZNQOC4EMZ3USW7VPLA4HQFWQGT4RBLPOT4B2D545ZN3ABV2UQ',
        assetCode: 'BTC6747',
      },
      funded: {
        amount: '50000.000000',
        fee: {
          fixed: '0.000000',
          calculatedPercent: '0.000000',
        },
        balanceAddress: 'BDQ2VU5GVWAMEXJRDW5HYPHDKIS723DP5WMIZZ7CAZLON5OFONQWR3YF',
        assetCode: 'BTC31611',
      },
    }

    const result = new MatchedEffect(record)

    expect(result.orderBookId).to.equal(1)
    expect(result.offerId).to.equal(0)
    expect(result.price).to.equal('1.000000')

    expect(result.charged).to.be.instanceOf(ParticularBalanceChangeEffect)
    expect(result.funded).to.be.instanceOf(ParticularBalanceChangeEffect)
  })
})
