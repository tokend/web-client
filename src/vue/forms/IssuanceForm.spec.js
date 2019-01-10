import IssuanceForm from './IssuanceForm'

import Vue from 'vue'
import Vuex from 'vuex'
import Vuelidate from 'vuelidate'

import { createLocalVue, mount, shallowMount } from '@vue/test-utils'

import { MockHelper, MockWrapper } from '@/test'

import { globalize } from '@/vue/filters/globalize'
import { formatMoney } from '@/vue/filters/formatMoney'

import { vuexTypes } from '@/vuex'
import accountModule from '@/vuex/account.module'

// HACK: https://github.com/vuejs/vue-test-utils/issues/532, waiting for
// Vue 2.6 so everything get fixed
Vue.config.silent = true

const localVue = createLocalVue()
localVue.use(Vuelidate)
localVue.use(Vuex)
localVue.filter('globalize', globalize)
localVue.filter('formatMoney', formatMoney)

describe('IssuanceForm component unit test', () => {
  const sampleIssuanceData = {
    form: {
      asset: 'BTC',
      amount: 10,
      receiver: 'foo@bar.com',
      reference: 'ref'
    },
    ownedAssets: [{
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

  afterEach(() => {
    sinon.restore()
  })

  describe('validation rules assigned correctly', () => {
    let wrapper

    beforeEach(() => {
      sinon.stub(IssuanceForm, 'created').resolves()
      wrapper = mount(IssuanceForm, { localVue })
    })

    const expectedResults = {
      asset: ['required'],
      amount: ['required', 'amountRange'],
      receiver: ['required', 'emailOrAccountId'],
      reference: ['required']
    }

    for (const [model, rules] of Object.entries(expectedResults)) {
      it(`${model} model is validating by proper set of rules`, () => {
        expect(Object.keys(wrapper.vm.$v.form[model].$params))
          .to.deep.equal(rules)
      })
    }

    const fieldBindings = {
      '#issuance-asset': 'asset',
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
    const sampleBalanceData = {
      asset: 'BTC',
      balanceId: 'BCQOBAIMVNNH7RHZTD4OVSRUX2W575VUK4RUYELRHDPXSXJ5TMS2BHAV'
    }

    let wrapper
    let mockHelper

    let accountResource
    let usersResource
    let transactionsResource

    let store

    beforeEach(() => {
      mockHelper = new MockHelper()

      accountResource = mockHelper.getHorizonResourcePrototype('account')
      usersResource = mockHelper.getApiResourcePrototype('users')
      transactionsResource =
        mockHelper.getHorizonResourcePrototype('transactions')

      const getters = accountModule.getters
      sinon.stub(getters, vuexTypes.account)
        .returns({ accountId: mockHelper.getMockWallet().accountId })
      store = new Vuex.Store({
        getters
      })

      sinon.stub(IssuanceForm, 'created').resolves()
      wrapper = shallowMount(IssuanceForm, {
        store,
        localVue,
        data: _ => Object.assign({}, sampleIssuanceData)
      })
      sinon.stub(wrapper.vm, 'isFormValid').returns(true)
    })

    it('assetListValues returns formatted owned assets for select field', () => {
      wrapper.setData({
        ownedAssets: sampleIssuanceData.ownedAssets
      })
      expect(wrapper.vm.assetListValues)
        .to.deep.equal([{
          value: 'BTC', label: 'Bitcoin (BTC)'
        }, {
          value: 'ETH', label: 'Ethereum (ETH)'
        }])
    })

    it('availableAmount returns available assets for issuance', () => {
      wrapper.setData(sampleIssuanceData)
      expect(wrapper.vm.availableAmount)
        .to.deep.equal({
          value: sampleIssuanceData.ownedAssets[0].availableForIssuance,
          currency: sampleIssuanceData.ownedAssets[0].code
        })
    })

    it('getAccountInfoByEmail() loads receiver account info with the correct params', async () => {
      const sampleReceiverData = {
        data: [{
          id: mockHelper.getMockWallet().accountId,
          attributes: {
            email: 'foo@bar.com'
          }
        }]
      }
      const spy = sinon.stub(usersResource, 'getPage')
        .resolves(MockWrapper.makeApiResponse(sampleReceiverData))

      await wrapper.vm.getAccountInfoByEmail(sampleIssuanceData.form.receiver)

      expect(spy
        .withArgs({ email: sampleIssuanceData.form.receiver })
        .called
      ).to.be.true
    })

    it('getReceiverBalance() loads receiver balances info with the correct params', async () => {
      const spy = sinon.stub(accountResource, 'getBalances')
        .resolves(MockWrapper.makeHorizonResponse([sampleBalanceData]))

      await wrapper.vm.getReceiverBalance(mockHelper.getMockWallet().accountId,
        sampleIssuanceData.form.asset)

      expect(spy
        .withArgs(mockHelper.getMockWallet().accountId)
        .calledOnce
      ).to.be.true
    })

    it('submit() calls horizon.submitOperations()', async () => {
      sinon.stub(wrapper.vm, 'getReceiverBalance').resolves(sampleBalanceData)
      const spy = sinon.stub(transactionsResource,
        'submitOperations').resolves()

      await wrapper.vm.submit()

      expect(spy.calledOnce).to.be.true
    })
  })
})
