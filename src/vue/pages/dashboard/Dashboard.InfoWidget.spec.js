import InfoWidget from './Dashboard.InfoWidget'

import Vue from 'vue'
import Vuex from 'vuex'
import Vuelidate from 'vuelidate'

import { createLocalVue, shallowMount } from '@vue/test-utils'
import { globalize } from '@/vue/filters/globalize'
import accountModule from '@/vuex/account.module'
import { vuexTypes } from '@/vuex'
import { MockHelper } from '@/test'
import { RecordWrapper } from '@/js/records'

Vue.config.silent = true

const localVue = createLocalVue()
localVue.use(Vuelidate)
localVue.use(Vuex)
localVue.filter('globalize', globalize)

describe('Dashboard.InfoWidget component', () => {
  let mockHelper
  let store
  let wrapper

  afterEach(() => {
    sinon.restore()
  })

  beforeEach(() => {
    mockHelper = new MockHelper()
    sinon.stub(accountModule.getters, vuexTypes.accountId)
      .returns(mockHelper.getDefaultAccountId)

    store = new Vuex.Store({
      getters: accountModule.getters,
      actions: accountModule.actions,
    })

    wrapper = shallowMount(InfoWidget, {
      store,
      localVue,
    })
  })

  describe('watchers', () => {
    it('currentAsset', () => {
      sinon.stub(wrapper.vm, 'loadList')
      wrapper.vm.currentAsset = 'ETH'

      expect(wrapper.vm.loadList.calledOnce).to.be.true
    })
  })

  it('loadList()', async () => {
    const paymentsResource = mockHelper.getHorizonResourcePrototype('payments')
    const expectedPayments = { data: [{ foo: 'bar' }] }
    sinon.stub(paymentsResource, 'getPage').resolves(expectedPayments)
    sinon.stub(RecordWrapper, 'operation').returns({})

    await wrapper.vm.loadList()

    expect(paymentsResource.getPage.calledOnce).to.be.true
    expect(RecordWrapper.operation.calledOnce).to.be.true
    expect(wrapper.vm.transactions.length).to.equal(1)
  })

  describe('toggleDetails()', () => {
    it('set a value that similar to the old', () => {
      wrapper.vm.index = 1
      wrapper.vm.toggleDetails(1)

      expect(wrapper.vm.index).to.equal(-1)
    })

    it('set a value that not similar to the old', () => {
      wrapper.vm.index = 1
      wrapper.vm.toggleDetails(2)

      expect(wrapper.vm.index).to.equal(2)
    })
  })

  describe('isSelected()', () => {
    it('pass value that identically to currently selected', () => {
      wrapper.vm.index = 2

      expect(wrapper.vm.isSelected(2)).to.equal(true)
    })

    it('pass value that different to currently selected', () => {
      wrapper.vm.index = 1

      expect(wrapper.vm.isSelected(2)).to.equal(false)
    })
  })
})
