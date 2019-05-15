import { balanceExplorerModule, mutations, actions, getters } from './index'
import { types } from './types'
import { Asset } from '../../shared/wrappers/asset'

import { Wallet } from '@tokend/js-sdk'
import { api, useWallet } from '@/api'

describe('balance explorer module', () => {
  describe('vuex-types', () => {
    const getModuleKeys = (module) => {
      return Object.keys({
        ...module.actions,
        ...module.mutations,
        ...module.getters,
      })
    }

    it('every entity in module should be mentioned in vuex-types', () => {
      for (const key of getModuleKeys(balanceExplorerModule)) {
        expect(types).to.have.property(key)
      }
    })

    it('every key described in vuex-types should be a real vuex-entity', () => {
      const moduleKeys = [
        ...getModuleKeys(balanceExplorerModule),
      ]

      for (const key of Object.keys(types)) {
        expect(moduleKeys).to.include(key)
      }
    })
  })

  describe('mutations', () => {
    it('SET_ACCOUNT_BALANCES should properly modify state', () => {
      const state = {
        balances: [],
      }

      mutations[types.SET_ACCOUNT_BALANCES](state, [
        { id: 'BALANCE_1' },
        { id: 'BALANCE_2' },
      ])

      expect(state).to.deep.equal({
        balances: [
          { id: 'BALANCE_1' },
          { id: 'BALANCE_2' },
        ],
      })
    })

    it('SET_ASSETS should properly modify state', () => {
      const state = {
        assets: [],
      }

      mutations[types.SET_ASSETS](state, [
        { id: 'USD' },
        { id: 'BTC' },
      ])

      expect(state).to.deep.equal({
        assets: [
          { id: 'USD' },
          { id: 'BTC' },
        ],
      })
    })

    it('SET_KYC_REQUIRED_ASSET_TYPE should properly modify state', () => {
      const state = {
        kycRequiredAssetType: null,
      }

      mutations[types.SET_KYC_REQUIRED_ASSET_TYPE](state, 1)

      expect(state).to.deep.equal({ kycRequiredAssetType: 1 })
    })
  })

  describe('actions', () => {
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
        rootGetters: {
          accountId: 'SOME_ACCOUNT_ID',
        },
        commit: sinon.stub(),
        dispatch: sinon.stub(),
      }

      api.useBaseURL('https://test.api.com')
      useWallet(wallet)
    })

    describe('LOAD_ACCOUNT_BALANCES', () => {
      it('properly commit its set of mutations', async () => {
        sinon.stub(api, 'getWithSignature').resolves({
          data: {
            states: [
              {
                balance: { id: 'BALANCE_1' },
                asset: { id: 'USD' },
              },
              {
                balance: { id: 'BALANCE_2' },
                asset: { id: 'BTC' },
              },
            ],
          },
        })

        const expectedMutations = {
          [types.SET_ACCOUNT_BALANCES]: [
            { id: 'BALANCE_1' },
            { id: 'BALANCE_2' },
          ],
          [types.SET_ASSETS]: [
            { id: 'USD' },
            { id: 'BTC' },
          ],
        }

        await actions[types.LOAD_ACCOUNT_BALANCES](store)

        expect(store.commit.args)
          .to.deep.equal(Object.entries(expectedMutations))

        api.getWithSignature.restore()
      })
    })

    describe('LOAD_KYC_REQUIRED_ASSET_TYPE', () => {
      it('properly commit its set of mutations', async () => {
        sinon.stub(api, 'get').resolves({
          data: { value: { u32: 1 } },
        })

        const expectedMutations = {
          [types.SET_KYC_REQUIRED_ASSET_TYPE]: 1,
        }

        await actions[types.LOAD_KYC_REQUIRED_ASSET_TYPE](store)

        expect(store.commit.args)
          .to.deep.equal(Object.entries(expectedMutations))

        api.get.restore()
      })
    })
  })

  describe('getters', () => {
    it('assets', () => {
      const state = {
        assets: [
          { id: 'USD' },
          { id: 'BTC' },
        ],
        balances: [
          {
            state: { available: '10.000000' },
            asset: { id: 'USD' },
          },
          {
            state: { available: '100.000000' },
            asset: { id: 'BTC' },
          },
        ],
      }

      expect(getters[types.assets](state))
        .to.deep.equal([
          new Asset({ id: 'USD' }, '10.000000'),
          new Asset({ id: 'BTC' }, '100.000000'),
        ])
    })

    it('kycRequiredAssetType', () => {
      const state = { kycRequiredAssetType: 1 }

      expect(getters[types.kycRequiredAssetType](state))
        .to.equal(1)
    })
  })
})
