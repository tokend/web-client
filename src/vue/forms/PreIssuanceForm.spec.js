import PreIssuanceForm from './PreIssuanceForm'

import Vue from 'vue'
import Vuex from 'vuex'

import { base } from '@tokend/js-sdk'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { MockHelper } from '@/test'

import { globalize } from '@/vue/filters/globalize'
import { formatMoney } from '@/vue/filters/formatMoney'

import { vuexTypes } from '@/vuex'
import accountModule from '@/vuex/account.module'

// HACK: https://github.com/vuejs/vue-test-utils/issues/532, waiting for
// Vue 2.6 so everything get fixed
Vue.config.silent = true

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.filter('globalize', globalize)
localVue.filter('formatMoney', formatMoney)

describe('PreIssuanceForm component unit test', () => {
  afterEach(() => {
    sinon.restore()
  })

  describe('methods', () => {
    const sampleIssuanceData = {
      ownedAssets: [{
        code: 'PLT'
      }],
      issuance: {
        asset: 'PLT',
        amount: 10
      },
      preIssuanceDocument: {}
    }

    let wrapper
    let mockHelper
    let transactionsResource
    let store

    beforeEach(() => {
      mockHelper = new MockHelper()
      transactionsResource =
        mockHelper.getHorizonResourcePrototype('transactions')

      const getters = accountModule.getters
      sinon.stub(getters, vuexTypes.account)
        .returns({ accountId: mockHelper.getMockWallet().accountId })
      store = new Vuex.Store({
        getters
      })

      sinon.stub(PreIssuanceForm, 'created').resolves()
      wrapper = shallowMount(PreIssuanceForm, {
        store,
        localVue,
        data: _ => Object.assign({}, sampleIssuanceData)
      })
    })

    it('submit() calls horizon.submitOperations()', async () => {
      const spy = sinon.stub(transactionsResource,
        'submitOperations').resolves()
      sinon.stub(base.PreIssuanceRequestOpBuilder,
        'createPreIssuanceRequestOp').returns({})

      await wrapper.vm.submit()

      expect(spy.calledOnce).to.be.true
    })

    it('isAssetDefined() returns true if the user owns certain asset', () => {
      const response = wrapper.vm.isAssetDefined(
        sampleIssuanceData.ownedAssets[0].code
      )
      expect(response).to.be.true
    })

    it('isAssetDefined() returns false if the user does not own certain asset', () => {
      const response = wrapper.vm.isAssetDefined('Sample Token')
      expect(response).to.be.false
    })

    it('parsePreIssuance() converts pre-issuance and sets it to the issuance property', () => {
      wrapper.setData({
        issuance: null
      })
      const preIssuance = {
        preEmission: '00000003504c54000000000005f5e10042c5f77f000000408e138ec30b5f7aaecfcb42436868c04430868ed4847184a583bff7473f1deac5c519980bd7210afe77df44eadce3c2deada7da57b38aded1379ad2051be88d030000001437743250577a7939527a324a4d3253466d416f7800000000',
        used: false
      }
      wrapper.vm.parsePreIssuance(preIssuance)

      expect(wrapper.vm.issuance).to.not.equal(null)
    })
  })
})
