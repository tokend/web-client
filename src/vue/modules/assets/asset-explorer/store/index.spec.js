import { assetExplorerModule, mutations, getters, actions } from './index'
import { types } from './types'

import { Wallet, base } from '@tokend/js-sdk'

import { api, useWallet } from '@/api'

describe('Asset explorer module', () => {
  describe('vuex-types', () => {
    const getModuleKeys = (module) => {
      return Object.keys({
        ...module.actions,
        ...module.mutations,
        ...module.getters,
      })
    }

    it('every entity in module should be mentioned in vuex-types', () => {
      for (const key of getModuleKeys(assetExplorerModule)) {
        expect(types).to.have.property(key)
      }
    })

    it('every key described in vuex-types should be a real vuex-entity', () => {
      const moduleKeys = [
        ...getModuleKeys(assetExplorerModule),
      ]

      for (const key of Object.keys(types)) {
        expect(moduleKeys).to.include(key)
      }
    })
  })

  describe('mutations', () => {
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

    describe('CREATE_BALANCE', () => {
      it('creates ManageBalance operation and calls postOperations method', async () => {
        const assetCode = 'USD'
        sinon.stub(base.Operation, 'manageBalance')
        sinon.stub(api, 'postOperations').resolves()

        await actions[types.CREATE_BALANCE](store, assetCode)

        expect(base.Operation.manageBalance)
          .to.have.been.calledOnceWithExactly({
            asset: 'USD',
            destination: 'SOME_ACCOUNT_ID',
            action: base.xdr.ManageBalanceAction.createUnique(),
          })
        expect(api.postOperations).to.have.been.calledOnce

        base.Operation.manageBalance.restore()
        api.postOperations.restore()
      })
    })
  })

  describe('getters', () => {
    it('kycRequiredAssetType', () => {
      const state = { kycRequiredAssetType: 1 }

      expect(getters[types.kycRequiredAssetType](state))
        .to.equal(1)
    })
  })
})
