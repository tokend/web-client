import { ManageOfferOp } from './manage-offer'

describe('ManageOfferOp', () => {
  it('properly parses the record', () => {
    const record = {
      id: '137438953473',
      type: 'operations-manage-offer',
      offerId: 2,
      orderBookId: 0,
      baseAmount: '5.853040',
      price: '66.110000',
      isBuy: false,
      fee: {
        fixed: '0.000000',
        calculatedPercent: '0.000000',
      },
      isDeleted: false,
      baseAsset: {
        id: 'BASE65489',
        type: 'assets',
      },
      quoteAsset: {
        id: 'QUOTE34117',
        type: 'assets',
      },
    }

    const result = new ManageOfferOp(record)

    expect(result.orderBookId).to.equal(0)
    expect(result.baseAmount).to.equal('5.853040')
    expect(result.isDeleted).to.equal(false)
    expect(result.offerId).to.equal(2)
    expect(result.price).to.equal('66.110000')
    expect(result.isBuy).to.equal(false)
    expect(result.baseAssetCode).to.equal('BASE65489')
    expect(result.quoteAssetCode).to.equal('QUOTE34117')
    expect(result.quoteAmount).to.equal('386.944475') // base * price
  })
})
