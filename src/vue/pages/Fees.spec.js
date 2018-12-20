import Fees from './Fees'

import Vuex from 'vuex'

import { vuexTypes } from '@/vuex'
import walletModule from '@/vuex/wallet.module'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { globalize } from '@/vue/filters/globalize'
import { formatFeeType } from '@/vue/filters/formatFeeType'
import { formatFeeSubType } from '@/vue/filters/formatFeeSubType'
import { formatMoney } from '@/vue/filters/formatMoney'
import { formatPercent } from '@/vue/filters/formatPercent'

import { MockHelper, MockWrapper } from '@/test'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.filter('globalize', globalize)
localVue.filter('formatFeeType', formatFeeType)
localVue.filter('formatFeeSubType', formatFeeSubType)
localVue.filter('formatMoney', formatMoney)
localVue.filter('formatPercent', formatPercent)

describe('Fees component unit test', () => {
  const mockHelper = new MockHelper()
  const feesResource = mockHelper.getHorizonResourcePrototype('fees')
  const feesSampleData = {
    ali: [0],
    btc: [0, 1]
  }
  const getters = walletModule.getters
  let store = new Vuex.Store({
    modules: {
      'new-wallet': {
        namespaced: true,
        getters
      }
    }
  })
  let wrapper

  beforeEach(() => {
    sinon.stub(Fees, 'created').resolves()
    wrapper = shallowMount(Fees, {
      store,
      localVue
    })
  })

  afterEach(() => {
    sinon.restore()
  })

  it('loadFees() calls the horizon.fees.getAll() in the created hook with the correct params', () => {
    sinon.restore()
    sinon.stub(feesResource, 'getAll').resolves()
    sinon.stub(getters, vuexTypes.wallet).returns(
      mockHelper.getMockWallet()
    )
    shallowMount(Fees, {
      localVue,
      store: new Vuex.Store({
        modules: {
          'new-wallet': {
            namespaced: true,
            getters
          }
        }
      })
    })
    expect(
      feesResource.getAll
        .withArgs({ account_id: mockHelper.getMockWallet().accountId })
        .calledOnce)
      .to
      .be
      .true
  })

  it('loadFees() changes fees data after loading', async () => {
    sinon.stub(feesResource, 'getAll').resolves(
      MockWrapper.makeHorizonResponse({ fees: feesSampleData })
    )
    await wrapper.vm.loadFees()
    expect(wrapper.vm.fees)
      .to
      .not
      .equal(null)
  })

  it('assetFees returns only the fees with the code filters.asset', () => {
    wrapper.setData({
      fees: feesSampleData,
      filters: {
        asset: 'BTC'
      }
    })
    expect(wrapper.vm.assetFees)
      .to
      .deep
      .equal(feesSampleData.btc)
  })

  it('assetCodes returns array of assets', () => {
    wrapper.setData({
      fees: feesSampleData
    })
    expect(wrapper.vm.assetCodes)
      .to
      .deep
      .equal(['ALI', 'BTC'])
  })
})
