import { filterFees } from './filter-fees'
import { Fee } from '../wrappers/fee'

describe('filterFees function', () => {
  it('properly filters received fees', () => {
    const filteredAccountId = 'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ'
    const filteredAccountRoleId = '5'

    const fees = [{
      account: {
        id: filteredAccountId,
      },
      fixed: '1.000000',
    }, {
      accountRole: {
        id: filteredAccountRoleId,
      },
      fixed: '5.000000',
    }, {
      fixed: '7.000000',
    }, {
      accountRole: {
        id: '3',
      },
      fixed: '10.000000',
    }, {
      account: {
        id: 'GBLPOFIGESQI7LG4ILTYHOMYTA7FBLG6G76DMNGZJDJSIO7VM3Z4YZ2J',
      },
      fixed: '5.000000',
    }]

    const expectedFees = fees.slice(0, 3).map(f => new Fee(f))

    const result = filterFees(fees, filteredAccountId, filteredAccountRoleId)

    expect(result).to.deep.equal(expectedFees)
  })
})
