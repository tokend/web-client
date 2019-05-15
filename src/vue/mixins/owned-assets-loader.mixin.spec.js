import OwnedAssetsLoaderMixin from './owned-assets-loader.mixin'

import Vuex from 'vuex'

import { createLocalVue, mount } from '@vue/test-utils'

import { MockHelper } from '@/test'

import { vuexTypes } from '@/vuex'
import accountModule from '@/vuex/account.module'
import { api } from '@/api'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('asset-loader.mixin unit test', () => {
  describe('method', () => {
    let wrapper
    let mockHelper
    let assetsSpy

    let sampleBalancesData
    let store

    afterEach(() => {
      sinon.restore()
    })

    beforeEach(() => {
      const Component = {
        template: `<div></div>`,
      }

      mockHelper = new MockHelper()
      sampleBalancesData = {
        balances: [{
          id: 'BTC',
          availableForIssuance: 100,
          owner: { id: mockHelper.getMockWallet().accountId },
        }],
      }
      assetsSpy = sinon.stub(api, 'get').resolves({
        data: sampleBalancesData,
      })

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
      it('calls the api.get with the correct params', async () => {
        await wrapper.vm.loadOwnedAssets()

        expect(assetsSpy).to.have.been.calledOnce
      })

      it('changes owned assets data after loading', async () => {
        wrapper.setData({ ownedAssets: null })

        await wrapper.vm.loadOwnedAssets()

        expect(wrapper.vm.ownedAssets).to.not.equal(null)
      })
    })
  })
})
