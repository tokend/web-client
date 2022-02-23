import { MockWrapper } from '../test'
import { mutations, actions, getters } from './account.module'
import { vuexTypes } from './types'

import accountJSON from '../test/mocks/account'
import balancesDetailsJSON from '../test/mocks/account-balances-details'
import { api } from '@/api'

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
    let store

    beforeEach(() => {
      store = {
        state: {},
        getters: {
          accountId: 'GAIEBMXUPSGW2J5ELJFOY6PR5IWXXJNHIJSDKTDHK76HHRNYRL2QYU4O',
        },
        rootGetters: {},
        commit: sinon.stub(),
        dispatch: sinon.stub(),
      }
    })

    it('LOAD_ACCOUNT properly commit it\'s set of mutations', async () => {
      sinon.stub(api, 'getWithSignature')
        .resolves(MockWrapper.makeJsonapiResponse(accountJSON))

      const expectedMutations = {
        [vuexTypes.SET_ACCOUNT]:
          MockWrapper.makeJsonapiResponseData(accountJSON),
      }

      await actions[vuexTypes.LOAD_ACCOUNT](store, 'ACCOUNT_ID_STUB')

      expect(store.commit.args).to.deep.equal(Object.entries(expectedMutations))
    })

    it('LOAD_ACCOUNT_BALANCES_DETAILS commits proper set of mutations',
      async () => {
        const balancesMock = MockWrapper
          .makeJsonapiResponseData(balancesDetailsJSON)
        sinon.stub(api, 'getWithSignature').resolves({ data: balancesMock })

        const balances = balancesMock.states.map(state => state.balance)
        const assetsPayload = balances.map(b => b.asset)

        await actions[vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS](store)

        expect(store.commit).to.have.been.calledWithExactly(
          vuexTypes.UPDATE_ASSETS, assetsPayload, { root: true },
        )
        expect(store.commit).to.have.been.calledWithExactly(
          vuexTypes.SET_ACCOUNT_BALANCES_DETAILS, balances,
        )
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
