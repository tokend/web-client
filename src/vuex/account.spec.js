import { MockHelper, MockWrapper } from '../test'
import { mutations, actions, getters } from './account.module'
import { vuexTypes } from './types'

import accountJSON from '../test/mocks/account'
import balancesDetailsJSON from '../test/mocks/account-balances-details'
import { AssetRecord } from '../js/records/entities/asset.record'
import { Api } from '@/api'

describe('account.module', () => {
  afterEach(() => {
    sinon.restore()
  })

  describe('mutations', () => {
    let state, obj

    beforeEach(() => {
      state = {
        account: {},
        balancesDetails: [],
      }

      obj = { foo: 'bar', alpha: 'bravo' }
    })

    it('SET_ACCOUNT should properly modify state', () => {
      mutations[vuexTypes.SET_ACCOUNT](state, obj)

      expect(state).to.deep.equal({
        account: obj,
        balancesDetails: [],
      })
    })

    it('SET_ACCOUNT_BALANCES_DETAILS should properly modify state', () => {
      mutations[vuexTypes.SET_ACCOUNT_BALANCES_DETAILS](state, obj)

      expect(state).to.deep.equal({
        account: {},
        balancesDetails: obj,
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
          accountId: 'GAIEBMXUPSGW2J5ELJFOY6PR5IWXXJNHIJSDKTDHK76HHRNYRL2QYU4O',
        },
        commit: sinon.stub(),
        dispatch: sinon.stub(),
      }
    })

    it('LOAD_ACCOUNT properly commit it\'s set of mutations', async () => {
      sinon.stub(mockHelper.apiInstance, 'getWithSignature')
        .resolves(MockWrapper.makeJsonapiResponse(accountJSON))

      const expectedMutations = {
        [vuexTypes.SET_ACCOUNT]:
          MockWrapper.makeJsonapiResponseData(accountJSON),
      }

      await actions[vuexTypes.LOAD_ACCOUNT](store)

      expect(store.commit.args).to.deep.equal(Object.entries(expectedMutations))
    })

    it('LOAD_ACCOUNT_BALANCES_DETAILS commits proper set of mutations',
      async () => {
        sinon.stub(Api, 'getWithSignature').resolves({
          data: { balances: balancesDetailsJSON },
        })
        const type = vuexTypes.SET_ACCOUNT_BALANCES_DETAILS
        const payload = balancesDetailsJSON
          .map(item => {
            item.assetDetails = new AssetRecord(item.asset)
            item.asset = item.assetDetails.code
            return item
          })
          .sort((a, b) => b.convertedBalance - a.convertedBalance)
        const expectedMutations = {
          [type]: payload,
        }

        await actions[vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS](store)

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

      expect(getters[vuexTypes.account](state))
        .to
        .deep
        .equal(account)
    })

    it('accountId', () => {
      const id = 'GDH5GJRAA43JUFR62ETZD7R3LCTCTKMXQ5DDMOFI5TMAPTQVIUY5FJPG'
      const state = { account: { id } }

      expect(getters[vuexTypes.accountId](state))
        .to
        .deep
        .equal(id)
    })

    it('accountRoleId', () => {
      const accountRoleId = 2
      const state = { account: { role: { id: accountRoleId } } }

      expect(getters[vuexTypes.accountRoleId](state))
        .to
        .equal(accountRoleId)
    })

    it('accountBalances', () => {
      // TODO
    })
  })
})
