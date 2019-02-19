import { CheckSaleStateOp } from './check-sale-state'

describe('CheckSaleStateOp', () => {
  it('properly parses the record', () => {
    const record = {
      sale: {
        id: '22',
        type: 'sales',
      },
      effect: {
        value: 2,
        name: 'closed',
      },
    }

    const result = new CheckSaleStateOp(record)

    expect(result.isSaleClosed).to.be.true
    expect(result.saleId).to.equal('22')
  })
})
