import Fees from './Fees'

import Vuex from 'vuex'
import Vue from 'vue'

import { vuexTypes } from '@/vuex'
import walletModule from '@/vuex/wallet.module'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { globalize } from '@/vue/filters/globalize'
import { globalizeFeeType } from '@/vue/filters/globalizeFeeType'
import { globalizeFeeSubType } from '@/vue/filters/globalizeFeeSubType'

import { MockHelper, MockWrapper } from '@/test'

// HACK: https://github.com/vuejs/vue-test-utils/issues/532, waiting for
// Vue 2.6 so everything get fixed
Vue.config.silent = true

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.filter('globalize', globalize)
localVue.filter('globalizeFeeType', globalizeFeeType)
localVue.filter('globalizeFeeSubType', globalizeFeeSubType)

describe('Fees component unit test', () => {
  let mockHelper
  let wrapper
  let feesResource

  beforeEach(async () => {
    sinon.restore()
    mockHelper = new MockHelper()
    const getters = walletModule.getters

    sinon.stub(getters, vuexTypes.wallet).returns(
      mockHelper.getMockWallet()
    )

    const store = new Vuex.Store({
      modules: {
        'new-wallet': {
          namespaced: true,
          getters
        }
      }
    })

    feesResource = mockHelper.getHorizonResourcePrototype('fees')
    sinon.stub(feesResource, 'getAll').resolves(
      MockWrapper.makeHorizonResponse({
        fees: {
          ali: new Array(1),
          btc: new Array(2)
        }
      })
    )

    wrapper = shallowMount(Fees, {
      store,
      localVue
    })
    await wrapper.vm.loadFees()
  })

  it('Fees loaded by current account ID', () => {
    expect(
      feesResource.getAll
        .withArgs({ account_id: mockHelper.getMockWallet().accountId })
        .calledTwice)
      .to
      .be
      .true
  })

  it('fetchFees() changes fees data after loading', async () => {
    await wrapper.vm.loadFees()
    expect(wrapper.vm.fees).to.not.equal(null)
  })

  it('assetFees returns only the fees with the code currentAssetCode', () => {
    wrapper.setData({
      currentAssetCode: 'ALI'
    })
    expect(wrapper.vm.assetFees.length).to.equal(1)
  })

  it('assetFees property changes after changing currentAssetCode', () => {
    wrapper.setData({
      currentAssetCode: 'BTC'
    })
    expect(wrapper.vm.assetFees.length).to.equal(2)
  })

  it('assetCodes returns array of assets', () => {
    expect(wrapper.vm.assetCodes).to.deep.equal(['ALI', 'BTC'])
  })
})
