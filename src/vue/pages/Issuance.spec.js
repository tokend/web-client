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
  let usersResource
  let getters
  let store
  let wrapper

  beforeEach(() => {
    mockHelper = new MockHelper()
    operationsResource = mockHelper.getHorizonResourcePrototype('operations')
    usersResource = mockHelper.getApiResourcePrototype('users')
    getters = {
      ...walletModule.getters,
      ...accountModule.getters
    }
    issuanceHistorySampleData = [{
      participants: [
        {
          accountId: mockHelper.getMockWallet().accountId
        },
        {
          accountId: ''
        }
      ]
    }]
    sinon.stub(getters, vuexTypes.wallet).returns(
      mockHelper.getMockWallet()
    )
    sinon.stub(getters, vuexTypes.account).returns(
      mockHelper.getMockAccount()
    )
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

  it('loadIssuanceHistory() calls the horizon.operations.getPage() with the correct params', async () => {
    const spy = sinon.stub(operationsResource, 'getPage').resolves({
      data: [{}]
    })

    await wrapper.vm.loadIssuanceHistory()

    expect(
      spy
        .withArgs({
          account_id: mockHelper.getMockWallet().accountId,
          operation_type: OPERATION_TYPES.createIssuanceRequest,
          limit: 200
        })
        .calledOnce)
      .to.be.true
  })

  it('loadCounterpartyEmails() calls the api.users.get() with the correct params', async () => {
    const spy = sinon.stub(usersResource, 'get').resolves({
      data: {}
    })
    wrapper.setData({
      issuanceHistory: issuanceHistorySampleData
    })

    await wrapper.vm.loadCounterpartyEmails()

    expect(
      spy
        .withArgs(issuanceHistorySampleData[0].participants[1].accountId)
        .calledOnce)
      .to.be.true
  })

  it('loadIssuanceHistory() method is called inside created hook', () => {
    sinon.restore()
    const spy = sinon.stub(Issuance.methods, 'loadIssuanceHistory')
    shallowMount(Issuance, {
      store,
      localVue
    })
    expect(spy.calledOnce).to.be.true
  })

  it('loadCounterpartyEmails() method is called inside created hook', async () => {
    sinon.restore()
    sinon.stub(Issuance.methods, 'loadIssuanceHistory').resolves()
    const spy = sinon.stub(Issuance.methods, 'loadCounterpartyEmails')

    await shallowMount(Issuance, {
      store,
      localVue
    })

    expect(spy.calledOnce).to.be.true
  })

  it('loadIssuanceHistory() changes issuance history data after loading', async () => {
    sinon.stub(operationsResource, 'getPage').resolves(
      MockWrapper.makeHorizonResponse(issuanceHistorySampleData)
    )
    await wrapper.vm.loadIssuanceHistory()
    expect(wrapper.vm.issuanceHistory).to.not.equal(null)
  })

  it('getCounterpartyId(issuance) returns accountId different from user accountId', () => {
    const result = wrapper.vm.getCounterpartyId(issuanceHistorySampleData[0])
    expect(result).to.not.equal(mockHelper.getMockWallet().accountId)
  })

  it('loadCounterpartyEmails() sets issuance counterparty property', async () => {
    sinon.restore()
    const userSampleData = {
      email: 'example@mail.com',
      url: 'url'
    }

    wrapper.setData({
      issuanceHistory: issuanceHistorySampleData
    })
    sinon.stub(usersResource, 'get').resolves(
      MockWrapper.makeApiResponse(userSampleData)
    )

    await wrapper.vm.loadCounterpartyEmails()

    expect(wrapper.vm.issuanceHistory[0].counterparty)
      .to.equal(userSampleData.email)
  })
})
