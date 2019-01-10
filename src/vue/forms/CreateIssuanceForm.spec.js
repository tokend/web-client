import CreateIssuanceForm from './CreateIssuanceForm'

import Vue from 'vue'
import Vuex from 'vuex'
import Vuelidate from 'vuelidate'

import { createLocalVue, mount, shallowMount } from '@vue/test-utils'

import { MockHelper } from '@/test'

import { globalize } from '@/vue/filters/globalize'
import { formatMoney } from '@/vue/filters/formatMoney'

import { vuexTypes } from '@/vuex'
import accountModule from '@/vuex/account.module'
import { Bus } from '@/js/helpers/event-bus'
import { base } from '@tokend/js-sdk'

// HACK: https://github.com/vuejs/vue-test-utils/issues/532, waiting for
// Vue 2.6 so everything get fixed
Vue.config.silent = true

const localVue = createLocalVue()
localVue.use(Vuelidate)
localVue.use(Vuex)
localVue.filter('globalize', globalize)
localVue.filter('formatMoney', formatMoney)

describe('CreateIssuanceForm component unit test', () => {
  const sampleIssuanceData = {
    form: {
      assetCode: 'BTC',
      amount: 10,
      receiver: 'foo@bar.com',
      reference: 'ref'
    },
    ownedAssets: [
      {
        code: 'BTC',
        details: {
          name: 'Bitcoin'
        },
        availableForIssuance: 100
      },
      {
        code: 'ETH',
        details: {
          name: 'Ethereum'
        },
        availableForIssuance: 200
      }
    ]
  }

  const sampleAccountData = {
    id: 'GBTRYNKYER5QMJ7LMVI2I5PIZWDLXVUCNZZKQSWPOOQCUUCCYX3X7532'
  }

  afterEach(() => {
    sinon.restore()
  })

  /* eslint-disable */

  describe('validation rules assigned correctly', () => {
    let wrapper

    beforeEach(() => {
      sinon.stub(CreateIssuanceForm, 'created').resolves()
      wrapper = mount(CreateIssuanceForm, { localVue })
    })

    const expectedResults = {
      assetCode: ['required'],
      amount: ['required', 'amount'],
      receiver: ['required', 'email'],
      reference: ['required']
    }

    for (const [model, rules] of Object.entries(expectedResults)) {
      it(`${model} model is validating by proper set of rules`, () => {
        expect(Object.keys(wrapper.vm.$v.form[model].$params))
          .to.deep.equal(rules)
      })
    }

    const fieldBindings = {
      '#issuance-asset': 'assetCode',
      '#issuance-amount': 'amount',
      '#issuance-receiver': 'receiver',
      '#issuance-reference': 'reference'
    }

    for (const [selector, model] of Object.entries(fieldBindings)) {
      it(`$v.form.${model} is touched after blur event emitted on ${selector}`, () => {
        const spy = sinon.stub(wrapper.vm, 'touchField')

        wrapper.find(selector).vm.$emit('blur')

        expect(spy.calledOnce).to.be.true
      })
    }
  })

  describe('methods', () => {
    let wrapper
    let mockHelper

    let transactionsResource

    let store

    beforeEach(() => {
      mockHelper = new MockHelper()

      transactionsResource =
        mockHelper.getHorizonResourcePrototype('transactions')

      sinon.stub(getters, vuexTypes.account)
        .returns({ accountId: mockHelper.getMockWallet().accountId })
      store = new Vuex.Store({
        getters
      })

      sinon.stub(CreateIssuanceForm, 'created').resolves()
      wrapper = shallowMount(CreateIssuanceForm, {
        store,
        localVue,
        data: () => Object.assign({}, sampleIssuanceData)
      })
      sinon.stub(wrapper.vm, 'isFormValid').returns(true)
    })

    it('load tokens list is called', async () => {
      sinon.stub(wrapper.vm, 'loadAllTokens')
        .resolves(sampleIssuanceData.ownedAssets)

      await wrapper.vm.getAccountOwnedTokens()

      expect(wrapper.vm.loadAllTokens.calledOnce).to.be.true
    })

    it('submit() calls loadBalanceIdByEmailAndCode()', async () => {
      sinon.stub(wrapper.vm, 'loadBalanceIdByEmailAndCode').resolves(true)

      await wrapper.vm.submit()

      expect(wrapper.vm.loadBalanceIdByEmailAndCode.calledOnce).to.be.true
    })

    it('submit() calls horizon.submitOperations()', async () => {
      const builder = base.CreateIssuanceRequestBuilder

      sinon.stub(wrapper.vm, 'loadBalanceIdByEmailAndCode').resolves(true)
      sinon.stub(builder, 'createIssuanceRequest')
        .resolves({
          asset: 'BTC',
          amount: 12,
          receiver: 'BCQOBAIMVNNH7RHZTD4OVSRUX2W575VUK4RUYELRHDPXSXJ5TMS2BHAV',
          reference: 'reference',
          externalDetails: {}
        })
      sinon.stub(transactionsResource, 'submitOperations').resolves()

      await wrapper.vm.submit()

      expect(wrapper.vm.loadBalanceIdByEmailAndCode.calledOnce).to.be.true
      expect(builder.createIssuanceRequest.calledOnce).to.be.true
      expect(transactionsResource.submitOperations.calledOnce).to.be.true
    })
  })

  describe('check that loadBalanceIdByEmailAndCode() works correctly', () => {
    let wrapper

    let mockHelper

    let store

    beforeEach(() => {
      sinon.stub(CreateIssuanceForm, 'created').resolves()

      mockHelper = new MockHelper()

      const getters = accountModule.getters
      sinon.stub(getters, vuexTypes.account)
        .returns({ accountId: mockHelper.getMockWallet().accountId })
      store = new Vuex.Store({
        getters
      })

      wrapper = shallowMount(CreateIssuanceForm, {
        store,
        localVue,
        data: () => Object.assign({}, sampleIssuanceData)
      })
    })

    it('loadBalanceIdByEmailAndCode() calls loadAccountByEmail()', async () => {
      sinon.stub(wrapper.vm, 'loadAccountByEmail')
        .withArgs('some@mail.com')
        .resolves()

      await wrapper.vm.loadBalanceIdByEmailAndCode('some@mail.com')

      expect(wrapper.vm.loadAccountByEmail.calledOnce).to.be.true
    })

    it('loadBalanceIdByEmailAndCode() returns Bus.error event when loadAccountByEmail() returns invalid value', async () => {
      sinon.stub(wrapper.vm, 'loadAccountByEmail')
        .withArgs('some@mail.com')
        .resolves(false)
      sinon.stub(Bus, 'error')

      await wrapper.vm.loadBalanceIdByEmailAndCode('some@mail.com')

      expect(wrapper.vm.loadAccountByEmail.calledOnce).to.be.true
      expect(Bus.error.calledOnce).to.be.true
    })

    it('loadBalanceIdByEmailAndCode() calls loadBalancesByAccountIdAndAssetCode() if loadAccountByEmail() returns valid value', async () => {
      sinon.stub(wrapper.vm, 'loadAccountByEmail')
        .withArgs('some@mail.com')
        .resolves(sampleAccountData)
      sinon.stub(wrapper.vm, 'loadBalancesByAccountIdAndAssetCode')
        .withArgs(sampleAccountData.id, 'BTC')
        .resolves(['some id'])
      sinon.stub(Bus, 'error')

      await wrapper.vm.loadBalanceIdByEmailAndCode('some@mail.com', 'BTC')

      expect(wrapper.vm.loadAccountByEmail.calledOnce).to.be.true
      expect(wrapper.vm.loadBalancesByAccountIdAndAssetCode.calledOnce)
        .to.be.true
      expect(Bus.error.calledOnce).to.be.false
    })

    it('loadBalanceIdByEmailAndCode() returns Bus.error event when loadBalancesByAccountIdAndAssetCode() returns invalid value', async () => {
      sinon.stub(wrapper.vm, 'loadAccountByEmail')
        .withArgs('some@mail.com')
        .resolves(sampleAccountData)
      sinon.stub(wrapper.vm, 'loadBalancesByAccountIdAndAssetCode')
        .withArgs(sampleAccountData.id, 'BTC')
        .resolves([])
      sinon.stub(Bus, 'error')

      await wrapper.vm.loadBalanceIdByEmailAndCode('some@mail.com', 'BTC')

      expect(wrapper.vm.loadAccountByEmail.calledOnce).to.be.true
      expect(wrapper.vm.loadBalancesByAccountIdAndAssetCode.calledOnce)
        .to.be.true
      expect(Bus.error.calledOnce).to.be.true
    })
  })
})
