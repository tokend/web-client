import { mutations, actions, getters } from './index'
import { types } from './types'
import { Fee } from '../wrappers/fee'

import { Wallet } from '@tokend/js-sdk'
import * as Api from '../_api'

describe('fees.module', () => {
  const accountId = 'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ'
  const fees = [
    {
      fixed: '1.000000',
    },
    {
      percent: '2.000000',
    },
  ]

  describe('mutations', () => {
    it('SET_ACCOUNT_ID should properly modify state', () => {
      const state = {
        accountId: '',
      }

      mutations[types.SET_ACCOUNT_ID](state, accountId)

      expect(state).to.deep.equal({ accountId })
    })

    it('SET_ACCOUNT_FEES should properly modify state', () => {
      const state = {
        fees: [],
      }

      mutations[types.SET_ACCOUNT_FEES](state, fees)

      expect(state).to.deep.equal({ fees })
    })
  })

  describe('actions', () => {
    const config = {
      horizonUrl: 'https://test.api.com',
    }
    const wallet = new Wallet(
      'test@mail.com',
      'SCPIPHBIMPBMGN65SDGCLMRN6XYGEV7WD44AIDO7HGEYJUNDKNKEGVYE',
      'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ',
      '4aadcd4eb44bb845d828c45dbd68d5d1196c3a182b08cd22f05c56fcf15b153c'
    )

    let store

    beforeEach(() => {
      store = {
        state: {},
        getters: {
          accountId,
        },
        commit: sinon.stub(),
        dispatch: sinon.stub(),
      }

      Api.initApi(wallet, config)
    })

    it('LOAD_ACCOUNT_FEES properly commit its set of mutations', async () => {
      sinon.stub(Api.api(), 'getWithSignature').resolves({
        data: {
          fees: [{ foo: 'bar' }],
        },
      })

      const expectedMutations = {
        [types.SET_ACCOUNT_FEES]:
        [{ foo: 'bar' }],
      }

      await actions[types.LOAD_ACCOUNT_FEES](store)

      expect(store.commit.args).to.deep.equal(Object.entries(expectedMutations))

      Api.api().getWithSignature.restore()
    })
  })

  describe('getters', () => {
    it('accountId', () => {
      const state = { accountId }

      expect(getters[types.accountId](state))
        .to.equal(accountId)
    })

    it('fees', () => {
      const state = { fees }

      expect(getters[types.fees](state))
        .to.deep.equal(fees.map(f => new Fee(f)))
    })
  })
})
