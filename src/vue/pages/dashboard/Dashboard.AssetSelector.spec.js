import AssetSelector from './Dashboard.AssetSelector'

import Vue from 'vue'
import Vuex from 'vuex'
import Vuelidate from 'vuelidate'

import { createLocalVue, shallowMount } from '@vue/test-utils'
import { globalize } from '@/vue/filters/globalize'
import accountModule from '@/vuex/account.module'
import { vuexTypes } from '@/vuex'
import { MockHelper } from '@/test'
import { ASSET_POLICIES } from '@tokend/js-sdk'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { AssetRecord } from '@/js/records/entities/asset.record'

Vue.config.silent = true

const localVue = createLocalVue()
localVue.use(Vuelidate)
localVue.use(Vuex)
localVue.filter('globalize', globalize)

describe('Dashboard.AssetSelector component', () => {
  let mockHelper
  let store
  let wrapper
  let mockedAccountBalances
  let mockedAssets

  afterEach(() => {
    sinon.restore()
  })

  beforeEach(() => {
    mockHelper = new MockHelper()
    mockedAccountBalances = [
      {
        asset: 'BTC',
        balance: '1',
        assetDetails: new AssetRecord({
          policies: [
            { value: ASSET_POLICIES.transferable },
            { value: ASSET_POLICIES.baseAsset },
          ],
          details: { logo: { key: 'some-key' } },
        }),
      },
      {
        asset: 'USD',
        balance: '3',
        assetDetails: new AssetRecord({
          policies: [
            { value: ASSET_POLICIES.transferable },
            { value: ASSET_POLICIES.baseAsset },
            { value: ASSET_POLICIES.statsQuoteAsset },
          ],
        }),
      },
      {
        asset: 'ETH',
        balance: '0',
        assetDetails: new AssetRecord({
          policies: [
            { value: ASSET_POLICIES.baseAsset },
          ],
        }),
      },
    ]
    mockedAssets = [
      new AssetRecord({
        code: 'USD',
        details: {
          name: 'Dollar',
        },
        policies: [
          {
            value: ASSET_POLICIES.transferable,
          },
          {
            value: ASSET_POLICIES.baseAsset,
          },
          {
            value: ASSET_POLICIES.statsQuoteAsset,
          },
        ],
      }),
      new AssetRecord({
        code: 'BTC',
        details: {
          name: 'Bitcoin',
        },
        policies: [
          {
            value: ASSET_POLICIES.transferable,
          },
          {
            value: ASSET_POLICIES.baseAsset,
          },
        ],
      }),
      new AssetRecord({
        code: 'ETH',
        details: {
          name: 'Ethereum',
        },
        policies: [
          {
            value: ASSET_POLICIES.transferable,
          },
          {
            value: ASSET_POLICIES.baseAsset,
          },
        ],
      }),
    ]
    sinon.stub(accountModule.getters, vuexTypes.accountBalances)
      .returns(mockedAccountBalances)

    store = new Vuex.Store({
      getters: accountModule.getters,
      actions: accountModule.actions,
    })

    sinon.stub(AssetSelector, 'created')
    wrapper = shallowMount(AssetSelector, {
      store,
      localVue,
    })
  })

  describe('loadAssets()', () => {
    let assetsResource

    beforeEach(() => {
      assetsResource = mockHelper.getHorizonResourcePrototype('assets')
      sinon.stub(ErrorHandler, 'processWithoutFeedback')
    })

    it('is called inside created hook', () => {
      AssetSelector.created.restore()
      sinon.stub(AssetSelector.methods, 'loadAssets')

      shallowMount(AssetSelector, {
        store,
        localVue,
      })

      expect(AssetSelector.methods.loadAssets.calledOnce).to.be.true
    })

    it('works correctly', async () => {
      const expectAssets = { data: [] }
      sinon.stub(assetsResource, 'getAll').resolves(expectAssets)

      await wrapper.vm.loadAssets()

      expect(wrapper.vm.assets).to.deep.equal(expectAssets.data)
      expect(assetsResource.getAll.calledOnce).to.be.true
      expect(ErrorHandler.processWithoutFeedback.calledOnce).to.be.false
    })

    it('handle errors', async () => {
      sinon.stub(assetsResource, 'getAll').rejects()

      await wrapper.vm.loadAssets()

      expect(assetsResource.getAll.calledOnce).to.be.true
      expect(wrapper.vm.assets).to.deep.equal([])
      expect(ErrorHandler.processWithoutFeedback.calledOnce).to.be.true
    })
  })

  describe('computed properties', () => {
    describe('currentAssetForSelect()', () => {
      it('returns asset if this.assets list is not empty', () => {
        wrapper.vm.currentAsset = 'ETH'
        wrapper.vm.assets = mockedAssets

        expect(wrapper.vm.currentAssetForSelect).to.equal(mockedAssets[2])
      })

      it('returns empty object if this.assets list is empty', () => {
        wrapper.vm.currentAsset = 'ETH'
        wrapper.vm.assets = []

        expect(wrapper.vm.currentAssetForSelect).to.deep.equal({})
      })
    })

    describe('currentAssetBalanceDetails()', () => {
      it('returns balance information when current selected asset exists in balances', () => {
        const expectedResult =
          mockedAccountBalances.find(i => i.asset === 'ETH')

        wrapper.vm.currentAsset = 'ETH'

        expect(wrapper.vm.currentAssetBalanceDetails)
          .to.deep.equal(expectedResult)
      })

      it('returns empty object when current selected asset does not exists in balances', () => {
        wrapper.vm.currentAsset = 'SOME ASSET'

        expect(wrapper.vm.currentAssetBalanceDetails).to.deep.equal({})
      })
    })
    it('assetsList()', () => {
      wrapper.vm.assets = mockedAssets
      const sortedAssets = mockedAssets
        .sort((a, b) => a.code.localeCompare(b.code))

      expect(wrapper.vm.assetsList)
        .to.deep.equal(sortedAssets)
    })
  })
})
