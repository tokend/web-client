import { assetExplorerModule, mutations, getters, actions } from './index'
import { types } from './types'

import { Wallet, base } from '@tokend/js-sdk'

import { Asset } from '../../shared/wrappers/asset'

import * as Api from '../_api'

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
    it('SET_ACCOUNT_ID should properly modify state', () => {
      const state = {
        accountId: '',
      }

      mutations[types.SET_ACCOUNT_ID](state, 'SOME_ACCOUNT_ID')

      expect(state).to.deep.equal({ accountId: 'SOME_ACCOUNT_ID' })
    })

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

    it('CONCAT_ASSETS should properly modify state', () => {
      const state = {
        assets: [
          { id: 'USD' },
          { id: 'BTC' },
        ],
      }

      mutations[types.CONCAT_ASSETS](state, [
        { id: 'ETH' },
        { id: 'EOS' },
      ])

      expect(state).to.deep.equal({
        assets: [
          { id: 'USD' },
          { id: 'BTC' },
          { id: 'ETH' },
          { id: 'EOS' },
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
          accountId: 'SOME_ACCOUNT_ID',
        },
        commit: sinon.stub(),
        dispatch: sinon.stub(),
      }

      Api.initApi(wallet, config)
    })

    describe('LOAD_ACCOUNT_BALANCES', () => {
      it('properly commit its set of mutations', async () => {
        sinon.stub(Api.api(), 'getWithSignature').resolves({
          data: {
            balances: [
              { asset: { id: 'USD' } },
              { asset: { id: 'BTC' } },
            ],
          },
        })

        const expectedMutations = {
          [types.SET_ACCOUNT_BALANCES]: [
            { asset: { id: 'USD' } },
            { asset: { id: 'BTC' } },
          ],
        }

        await actions[types.LOAD_ACCOUNT_BALANCES](store)

        expect(store.commit.args)
          .to.deep.equal(Object.entries(expectedMutations))

        Api.api().getWithSignature.restore()
      })
    })

    describe('LOAD_KYC_REQUIRED_ASSET_TYPE', () => {
      it('properly commit its set of mutations', async () => {
        sinon.stub(Api.api(), 'get').resolves({
          data: { value: { u32: 1 } },
        })

        const expectedMutations = {
          [types.SET_KYC_REQUIRED_ASSET_TYPE]: 1,
        }

        await actions[types.LOAD_KYC_REQUIRED_ASSET_TYPE](store)

        expect(store.commit.args)
          .to.deep.equal(Object.entries(expectedMutations))

        Api.api().get.restore()
      })
    })

    describe('CREATE_BALANCE', () => {
      it('creates ManageBalance operation and calls postOperations method', async () => {
        const assetCode = 'USD'
        sinon.stub(base.Operation, 'manageBalance')
        sinon.stub(Api.api(), 'postOperations').resolves()

        await actions[types.CREATE_BALANCE](store, assetCode)

        expect(base.Operation.manageBalance)
          .to.have.been.calledOnceWithExactly({
            asset: 'USD',
            destination: 'SOME_ACCOUNT_ID',
            action: base.xdr.ManageBalanceAction.createUnique(),
          })
        expect(Api.api().postOperations).to.have.been.calledOnce

        base.Operation.manageBalance.restore()
        Api.api().postOperations.restore()
      })
    })
  })

  describe('getters', () => {
    it('accountId', () => {
      const state = { accountId: 'SOME_ACCOUNT_ID' }

      expect(getters[types.accountId](state))
        .to.equal('SOME_ACCOUNT_ID')
    })

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
        ],
      }

      expect(getters[types.assets](state))
        .to.deep.equal([
          new Asset({ id: 'USD' }, '10.000000'),
          new Asset({ id: 'BTC' }, ''),
        ])
    })

    it('kycRequiredAssetType', () => {
      const state = { kycRequiredAssetType: 1 }

      expect(getters[types.kycRequiredAssetType](state))
        .to.equal(1)
    })
  })
})
