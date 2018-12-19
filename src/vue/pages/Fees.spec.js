import Fees from './Fees'

import Vuex from 'vuex'

import { vuexTypes } from '@/vuex'
import walletModule from '@/vuex/wallet.module'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { globalize } from '@/vue/filters/globalize'
import { globalizeFeeType } from '@/vue/filters/globalizeFeeType'
import { globalizeFeeSubType } from '@/vue/filters/globalizeFeeSubType'
import { formatMoney } from '@/vue/filters/formatMoney'
import { formatPercent } from '@/vue/filters/formatPercent'

import { MockHelper, MockWrapper } from '@/test'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.filter('globalize', globalize)
localVue.filter('globalizeFeeType', globalizeFeeType)
localVue.filter('globalizeFeeSubType', globalizeFeeSubType)
localVue.filter('formatMoney', formatMoney)
localVue.filter('formatPercent', formatPercent)

describe('Fees component unit test', () => {
  let mockHelper
  let wrapper
  let feesResource
  let feesSampleData = {
    fees: {
      ali: [0],
      btc: [0, 1]
    }
  }

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
      MockWrapper.makeHorizonResponse(feesSampleData)
    )

    wrapper = await shallowMount(Fees, {
      store,
      localVue
    })
  })

  it('loadFees() calls the horizon.fees.getAll() with the correct params', () => {
    expect(
      feesResource.getAll
        .withArgs({ account_id: mockHelper.getMockWallet().accountId })
        .calledOnce)
      .to
      .be
      .true
  })

  it('loadFees() changes fees data after loading', async () => {
    wrapper.setData({
      fees: null
    })
    await wrapper.vm.loadFees()
    expect(wrapper.vm.fees).to.not.equal(null)
  })

  it('assetFees returns only the fees with the code filters.asset', () => {
    wrapper.setData({
      filters: {
        asset: 'BTC'
      }
    })
    expect(wrapper.vm.assetFees).to.deep.equal(feesSampleData.fees.btc)
  })

  it('assetCodes returns array of assets', () => {
    expect(wrapper.vm.assetCodes).to.deep.equal(['ALI', 'BTC'])
  })
})
