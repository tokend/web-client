import { mutations, actions, getters } from './index'
import { types } from './types'
import { Asset } from '../../shared/wrappers/asset'

import { Wallet } from '@tokend/js-sdk'
import * as Api from '../_api'

describe('balance explorer module', () => {
  const accountId = 'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ'
  const assets = [
    { id: 'USD' },
    { id: 'BTC' },
  ]
  const balances = [
    {
      id: 'BDQ7Q6R75X7TQ5LORGV2CDGA7KMRRQYX2X52ZHUE7YOFASWKN3MWHEGL',
      state: {
        available: '10.000000',
      },
      asset: {
        id: 'USD',
      },
    },
    {
      id: 'BDQ7Q6R75X7TQ5LORGV2CDGA7KMRRQYX2X52ZHUE7YOFASWKN3MWHEGL',
      state: {
        available: '1.000000',
      },
      asset: {
        id: 'BTC',
      },
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

    it('SET_ACCOUNT_BALANCES should properly modify state', () => {
      const state = {
        balances: [],
      }

      mutations[types.SET_ACCOUNT_BALANCES](state, balances)

      expect(state).to.deep.equal({ balances })
    })

    it('SET_ASSETS should properly modify state', () => {
      const state = {
        assets: [],
      }

      mutations[types.SET_ASSETS](state, assets)

      expect(state).to.deep.equal({ assets })
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

    it('LOAD_ACCOUNT_BALANCES properly commit its set of mutations', async () => {
      sinon.stub(Api.api(), 'getWithSignature').resolves({
        data: {
          balances,
        },
      })

      const expectedMutations = {
        [types.SET_ACCOUNT_BALANCES]: balances,
        [types.SET_ASSETS]: assets,
      }

      await actions[types.LOAD_ACCOUNT_BALANCES](store)

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

    it('assets', () => {
      const state = { assets, balances }
      const expectedAssets = [
        new Asset({ id: 'USD' }, '10.000000'),
        new Asset({ id: 'BTC' }, '1.000000'),
      ]

      expect(getters[types.assets](state))
        .to.deep.equal(expectedAssets)
    })
  })
})
