import { mutations, getters } from './index'
import { types } from './types'
import { filterFees } from '../helpers/filter-fees'

describe('fees.module', () => {
  const accountId = 'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ'
  const accountRoleId = '5'
  const fees = [{
    account: {
      id: accountId,
    },
    fixed: '1.000000',
  }, {
    accountRole: {
      id: accountRoleId,
    },
    fixed: '5.000000',
  }, {
    fixed: '7.000000',
  }]

  describe('mutations', () => {
    it('SET_ACCOUNT_ID should properly modify state', () => {
      const state = {
        accountId: '',
      }

      mutations[types.SET_ACCOUNT_ID](state, accountId)

      expect(state).to.deep.equal({ accountId })
    })

    it('SET_ACCOUNT_ROLE_ID should properly modify state', () => {
      const state = {
        accountRoleId: '',
      }

      mutations[types.SET_ACCOUNT_ROLE_ID](state, accountRoleId)

      expect(state).to.deep.equal({ accountRoleId })
    })

    it('SET_FEES should properly modify state', () => {
      const state = {
        accountId,
        accountRoleId,
        fees: [],
      }

      mutations[types.SET_FEES](state, fees)

      expect(state).to.deep.equal({
        accountId,
        accountRoleId,
        fees: filterFees(fees, accountId, accountRoleId),
      })
    })

    it('CONCAT_FEES should properly modify state', () => {
      const state = {
        accountId,
        accountRoleId,
        fees: filterFees(fees, accountId, accountRoleId),
      }

      mutations[types.CONCAT_FEES](state, fees)

      expect(state).to.deep.equal({
        accountId,
        accountRoleId,
        fees: filterFees(fees.concat(fees), accountId, accountRoleId),
      })
    })
  })

  describe('getters', () => {
    it('accountId', () => {
      const state = { accountId }

      expect(getters[types.accountId](state))
        .to.equal(accountId)
    })

    it('accountRoleId', () => {
      const state = { accountRoleId }

      expect(getters[types.accountRoleId](state))
        .to.equal(accountRoleId)
    })

    it('fees', () => {
      const state = { fees }

      expect(getters[types.fees](state))
        .to.deep.equal(fees)
    })
  })
})
