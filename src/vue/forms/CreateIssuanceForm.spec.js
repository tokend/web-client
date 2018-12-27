import CreateIssuanceForm from './CreateIssuanceForm'

import Vue from 'vue'
import Vuex from 'vuex'
import Vuelidate from 'vuelidate'

import { createLocalVue, mount, shallowMount } from '@vue/test-utils'

// import { TestHelper } from '@/test/test-helper'
import { MockHelper, MockWrapper } from '@/test'

import { globalize } from '@/vue/filters/globalize'
import { formatMoney } from '@/vue/filters/formatMoney'

// import { errors } from '@tokend/js-sdk'
// import { Bus } from '@/js/helpers/event-bus'

import { vuexTypes } from '@/vuex'
import walletModule from '@/vuex/wallet.module'

// HACK: https://github.com/vuejs/vue-test-utils/issues/532, waiting for
// Vue 2.6 so everything get fixed
Vue.config.silent = true

const localVue = createLocalVue()
localVue.use(Vuelidate)
localVue.use(Vuex)
localVue.filter('globalize', globalize)
localVue.filter('formatMoney', formatMoney)

describe('CreateIssuanceForm component unit test', () => {
  afterEach(() => {
    sinon.restore()
  })

  describe('validation rules assigned correctly', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(CreateIssuanceForm, { localVue })
    })

    const expectedResults = {
      asset: ['required'],
      amount: ['required', 'amount'],
      email: ['required', 'email'],
      reference: ['required']
    }

    for (const [model, rules] of Object.entries(expectedResults)) {
      it(`${model} model is validating by proper set of rules`, () => {
        expect(Object.keys(wrapper.vm.$v.form[model].$params))
          .to
          .deep
          .equal(rules)
      })
    }

    const fieldBindings = {
      '#create-issuance-asset': 'asset',
      '#create-issuance-amount': 'amount',
      '#create-issuance-email': 'email',
      '#create-issuance-reference': 'reference'
    }

    for (const [selector, model] of Object.entries(fieldBindings)) {
      it(`$v.form.${model} is touched after blur event emitted on ${selector}`, () => {
        const spy = sinon.stub(wrapper.vm, 'touchField')
        wrapper
          .find(selector)
          .vm
          .$emit('blur')

        expect(spy.calledOnce)
          .to
          .be
          .true
      })
    }
  })

  describe('methods', () => {
    const sampleData = {
      form: {
        asset: 'Bitcoin (BTC)',
        amount: 10,
        email: 'foo@bar.com',
        reference: 'ref'
      },
      userOwnedTokens: [{
        code: 'BTC',
        details: {
          name: 'Bitcoin'
        },
        availableForIssuance: 100
      }, {
        code: 'ETH',
        details: {
          name: 'Ethereum'
        },
        availableForIssuance: 200
      }]
    }
    let wrapper
    let mockHelper
    let accountResource
    let store

    beforeEach(() => {
      mockHelper = new MockHelper()
      accountResource = mockHelper.getHorizonResourcePrototype('account')
      const getters = walletModule.getters
      sinon.stub(getters, vuexTypes.wallet).returns(mockHelper.getMockWallet())

      store = new Vuex.Store({
        getters
      })
      sinon.stub(CreateIssuanceForm, 'created').resolves()
      wrapper = shallowMount(CreateIssuanceForm, {
        store,
        localVue
      })
      sinon.stub(wrapper.vm, 'isFormValid').returns(true)
    })

    it('loadUserOwnedTokens() calls the horizon.account.getDetails() with the correct params', async () => {
      const responseData = [{
        assetDetails: {
          owner: mockHelper.getMockWallet().accountId,
          ...sampleData.userOwnedTokens[0]
        }
      }]
      const spy = sinon.stub(accountResource, 'getDetails').resolves(
        MockWrapper.makeHorizonResponse(responseData)
      )

      await wrapper.vm.loadUserOwnedTokens()

      expect(
        spy
          .withArgs(mockHelper.getMockWallet().accountId)
          .calledOnce)
        .to.be.true
    })

    it('loadUserOwnedTokens() method is called inside created hook', () => {
      sinon.restore()
      const spy = sinon.stub(CreateIssuanceForm.methods, 'loadUserOwnedTokens')

      shallowMount(CreateIssuanceForm, {
        store,
        localVue,
        data: _ => sampleData,
        sync: false
      })

      expect(spy.calledOnce).to.be.true
    })

    it('loadUserOwnedTokens() changes fees data after loading', async () => {
      const responseData = [{
        assetDetails: {
          owner: mockHelper.getMockWallet().accountId,
          ...sampleData.userOwnedTokens[0]
        }
      }]
      sinon.stub(accountResource, 'getDetails').resolves(
        MockWrapper.makeHorizonResponse(responseData)
      )

      await wrapper.vm.loadUserOwnedTokens()

      expect(wrapper.vm.userOwnedTokens).to.not.equal(null)
    })

    it('ownedTokenAssets returns formatted owned assets', () => {
      wrapper.setData({
        userOwnedTokens: sampleData.userOwnedTokens
      })
      expect(wrapper.vm.ownedTokenAssets)
        .to.deep.equal(['Bitcoin (BTC)', 'Ethereum (ETH)'])
    })
  })
})
