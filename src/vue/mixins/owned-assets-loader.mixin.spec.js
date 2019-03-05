import OwnedAssetsLoaderMixin from './owned-assets-loader.mixin'

import Vuex from 'vuex'

import { createLocalVue, mount } from '@vue/test-utils'

import { MockHelper, MockWrapper } from '@/test'

import { vuexTypes } from '@/vuex'
import accountModule from '@/vuex/account.module'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('asset-loader.mixin unit test', () => {
  describe('method', () => {
    let wrapper
    let mockHelper
    let assetsSpy

    let assetsResource
    let sampleAssetsData
    let store

    afterEach(() => {
      sinon.restore()
    })

    beforeEach(() => {
      const Component = {
        template: `<div></div>`,
      }

      mockHelper = new MockHelper()
      assetsResource = mockHelper.getHorizonResourcePrototype('assets')
      sampleAssetsData = [{
        code: 'BTC',
        availableForIssuance: 100,
        owner: mockHelper.getMockWallet().accountId,
      }]
      assetsSpy = sinon.stub(assetsResource, 'getAll').resolves(
        MockWrapper.makeHorizonResponse(sampleAssetsData)
      )

      const getters = accountModule.getters
      sinon.stub(getters, vuexTypes.accountId)
        .returns(mockHelper.getMockWallet().accountId)
      store = new Vuex.Store({
        getters,
      })

      wrapper = mount(Component, {
        mixins: [OwnedAssetsLoaderMixin],
        store,
        localVue,
      })
    })

    describe('loadOwnedAssets', () => {
      it('calls the horizon.assets.getAll() with the correct params', async () => {
        await wrapper.vm.loadOwnedAssets()

        expect(assetsSpy
          .withArgs({ owner: mockHelper.getMockWallet().accountId })
          .calledOnce
        ).to.be.true
      })

      it('changes owned assets data after loading', async () => {
        wrapper.setData({ ownedAssets: null })

        await wrapper.vm.loadOwnedAssets()

        expect(wrapper.vm.ownedAssets).to.not.equal(null)
      })
    })
  })
})
