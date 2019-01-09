import Issuance from './Issuance'

import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

import { OPERATION_TYPES } from '@/js/const/xdr.const'
import { xdrEnumToConstant } from '@/js/utils/xdr-enum-to-constant.util'

import { vuexTypes } from '@/vuex'
import walletModule from '@/vuex/wallet.module'
import accountModule from '@/vuex/account.module'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { globalize } from '@/vue/filters/globalize'
import { formatMoney } from '@/vue/filters/formatMoney'

import { MockHelper, MockWrapper } from '@/test'

// HACK: https://github.com/vuejs/vue-test-utils/issues/532, waiting for
// Vue 2.6 so everything get fixed
Vue.config.silent = true

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(Vuex)
localVue.filter('globalize', globalize)
localVue.filter('formatMoney', formatMoney)

describe('Issuance component unit test', () => {
  let issuanceHistorySampleData
  let mockHelper
  let operationsResource

  let getters
  let store
  let wrapper

  beforeEach(() => {
    mockHelper = new MockHelper()
    operationsResource = mockHelper.getHorizonResourcePrototype('operations')
    getters = {
      ...walletModule.getters,
      ...accountModule.getters
    }

    issuanceHistorySampleData = [{
      participants: [{
        accountId: mockHelper.getMockWallet().accountId
      }, {
        accountId: ''
      }]
    }]

    sinon.stub(getters, vuexTypes.wallet).returns(
      mockHelper.getMockWallet()
    )
    sinon.stub(getters, vuexTypes.account).returns({
      accountId: mockHelper.getMockWallet().accountId,
      accountType: 'AccountTypeSyndycate'
    })
    sinon.stub(xdrEnumToConstant, 'arguments').returns({})

    store = new Vuex.Store({
      getters
    })

    sinon.stub(Issuance, 'created').resolves()
    wrapper = shallowMount(Issuance, {
      store,
      localVue
    })
  })

  afterEach(() => {
    sinon.restore()
  })

  it('loadHistory() calls the horizon.operations.getPage() with the correct params', async () => {
    const spy = sinon.stub(operationsResource, 'getPage').resolves({
      data: [{}]
    })

    await wrapper.vm.loadHistory()

    expect(spy
      .withArgs({
        account_id: mockHelper.getMockWallet().accountId,
        operation_type: OPERATION_TYPES.createIssuanceRequest,
        limit: 200
      })
      .calledOnce
    ).to.be.true
  })

  it('loadHistory() method is called inside created hook', () => {
    sinon.restore()
    const spy = sinon.stub(Issuance.methods, 'loadHistory')
    shallowMount(Issuance, {
      store,
      localVue
    })
    expect(spy.calledOnce).to.be.true
  })

  it('loadHistory() changes issuance history data after loading', async () => {
    sinon.stub(operationsResource, 'getPage').resolves(
      MockWrapper.makeHorizonResponse(issuanceHistorySampleData)
    )
    await wrapper.vm.loadHistory()
    expect(wrapper.vm.issuanceHistory).to.not.equal(null)
  })
})
