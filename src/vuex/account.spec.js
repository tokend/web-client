import { MockHelper, MockWrapper } from '../test'
import { mutations, actions, getters } from './account.module'
import { vuexTypes } from './types'

import accountJSON from '../test/mocks/account'
import balancesDetailsJSON from '../test/mocks/account-balances-details'

describe('account.module', () => {
  afterEach(() => {
    sinon.restore()
  })

  describe('mutations', () => {
    let state, obj

    beforeEach(() => {
      state = {
        account: {},
        balancesDetails: []
      }

      obj = { foo: 'bar', alpha: 'bravo' }
    })

    it('SET_ACCOUNT should properly modify state', () => {
      mutations.SET_ACCOUNT(state, obj)

      expect(state).to.deep.equal({
        account: obj,
        balancesDetails: []
      })
    })

    it('SET_ACCOUNT_BALANCES_DETAILS should properly modify state', () => {
      mutations.SET_ACCOUNT_BALANCES_DETAILS(state, obj)
      expect(state).to.deep.equal({
        account: {},
        balancesDetails: obj
      })
    })
  })

  describe('actions', () => {
    let mockHelper
    let store

    beforeEach(() => {
      mockHelper = new MockHelper()
      store = {
        state: {},
        getters: {
          accountId: 'GAIEBMXUPSGW2J5ELJFOY6PR5IWXXJNHIJSDKTDHK76HHRNYRL2QYU4O'
        },
        commit: sinon.stub(),
        dispatch: sinon.stub()
      }
    })

    it('LOAD_ACCOUNT properly commit it\'s set of mutations', async () => {
      mockHelper.mockHorizonMethod('account', 'get', accountJSON)

      const expectedMutations = {
        [vuexTypes.SET_ACCOUNT]: MockWrapper.makeHorizonData(accountJSON)
      }

      await actions.LOAD_ACCOUNT(store)

      expect(store.commit.args).to.deep.equal(Object.entries(expectedMutations))
    })

    it('LOAD_ACCOUNT_BALANCES_DETAILS commits proper set of mutations',
      async () => {
        mockHelper.mockHorizonMethod(
          'account',
          'getDetails',
          balancesDetailsJSON
        )
        const type = vuexTypes.SET_ACCOUNT_BALANCES_DETAILS
        const payload = MockWrapper.makeHorizonData(balancesDetailsJSON)
        const expectedMutations = {
          [type]: payload
        }

        await actions.LOAD_ACCOUNT_BALANCES_DETAILS(store)

        expect(store.commit.args)
          .to
          .deep
          .equal(Object.entries(expectedMutations))
      })
  })

  describe('getters', () => {
    it('account', () => {
      const account = MockWrapper.makeHorizonData(accountJSON)
      const state = { account }

      expect(getters.account(state)).to.deep.equal(account)
    })

    it('accountId', () => {
      const id = 'GDH5GJRAA43JUFR62ETZD7R3LCTCTKMXQ5DDMOFI5TMAPTQVIUY5FJPG'
      const state = { account: { id } }

      expect(getters.accountId(state)).to.deep.equal(id)
    })

    it('accountIsBlocked', () => {
      const state = {
        account: {
          isBlocked: true
        }
      }

      expect(getters.accountIsBlocked(state)).to.equal(true)
    })

    it('accountBlockReasons', () => {
      const blockReasons = [1, 2]
      const state = { account: { blockReasons } }

      expect(getters.accountBlockReasons(state)).to.deep.equal(blockReasons)
    })

    it('accountType', () => {
      const accountType = 'AccountTypeVerified'
      const state = { account: { accountType } }

      expect(getters.accountType(state)).to.equal(accountType)
    })

    it('accountTypeI', () => {
      const accountTypeI = 7
      const state = { account: { accountTypeI } }

      expect(getters.accountTypeI(state)).to.equal(accountTypeI)
    })

    it('accountThresholds', () => {
      const thresholds = {
        lowThreshold: 10,
        medThreshold: 20,
        highThreshold: 30
      }
      const state = {
        account: {
          thresholds
        }
      }

      expect(getters.accountThresholds(state)).to.deep.equal(thresholds)
    })

    it('accountReferrer', () => {
      const referrer = 'GDH5GJRAA43JUFR62ETZD7R3LCTCTKMXQ5DDMOFI5TMAPTQVIUY5FJPG'
      const state = { account: { referrer } }
      expect(getters.accountReferrer(state)).to.equal(referrer)
    })

    it('accountReferrals', () => {
      const referrals = [
        'GDH5GJRAA43JUFR62ETZD7R3LCTCTKMXQ5DDMOFI5TMAPTQVIUY5FJPG',
        'GCQRB4AW7GM6OVRFSTRKSIW6MUAKH4VWIXZ75YWRCBI2UQ7HXUB4URRD',
        'GCHSQIZACYBXLVZJG4VEHVJ3OTNICYPP74BQN4EOGWJQBPARKIMYOJQA'
      ]
      const state = { account: { referrals } }

      expect(getters.accountReferrals(state)).to.deep.equal(referrals)
    })

    it('accountPoliciesTypeI', () => {
      const accountPoliciesTypeI = 6
      const state = {
        account: {
          policies: {
            accountPoliciesTypeI
          }
        }
      }

      expect(getters.accountPoliciesTypeI(state)).to.equal(accountPoliciesTypeI)
    })

    it('accountPoliciesTypes', () => {
      const accountPoliciesTypes = [2, 4, 8]
      const state = {
        account: {
          policies: {
            accountPoliciesTypes
          }
        }
      }

      expect(getters.accountPoliciesTypes(state))
        .to
        .deep
        .equal(accountPoliciesTypes)
    })

    it('accountBalances', () => {
      // TODO
    })

    it('accountDepositAddresses', () => {
      const externalSystemAccounts = [
        {
          'type': {
            'name': 'Bitcoin',
            'value': 1
          },
          'data': 'mutsYGuQyAKjyT4a7d9t2T2kDhjbxwFZju',
          'asset_code': 'BTC'
        },
        {
          'type': {
            'name': 'Ethereum',
            'value': 2
          },
          'data': '0xD338E268D1F052B5c58D5F4ceA6AEdD4f5F1E35e',
          'asset_code': 'ETH'
        },
        {
          'type': {
            'name': 'Litecoin',
            'value': 10
          },
          'data': 'mgTbDyNGwJeewjdXmU9cRQe8WDauVqn4WK',
          'asset_code': 'LTC'
        }
      ]

      const expectedResult = {
        1: 'mutsYGuQyAKjyT4a7d9t2T2kDhjbxwFZju',
        2: '0xD338E268D1F052B5c58D5F4ceA6AEdD4f5F1E35e',
        10: 'mgTbDyNGwJeewjdXmU9cRQe8WDauVqn4WK'
      }

      const state = { account: { externalSystemAccounts } }
      expect(getters.accountDepositAddresses(state))
        .to
        .deep
        .equal(expectedResult)
    })

    it('accountKycBlobId', () => {
      const blobId = 'TLHGZSU4WIQIVBGVT7QFDNWIH4LKF6NQOXUCDW5NJUH7MWWDRFLQ'
      const state = {
        account: {
          accountKyc: {
            kycData: {
              blobId
            }
          }
        }
      }

      expect(getters.accountKycBlobId(state)).to.deep.equal(blobId)
    })
  })
})
