import IssuanceForm from './IssuanceForm'
import OwnedAssetsLoaderMixin from '@/vue/mixins/owned-assets-loader.mixin'

import Vue from 'vue'
import Vuex from 'vuex'
import Vuelidate from 'vuelidate'

import { base } from '@tokend/js-sdk'

import { createLocalVue, mount, shallowMount } from '@vue/test-utils'

import { MockHelper, MockWrapper } from '@/test'

import { Bus } from '@/js/helpers/event-bus'

import config from '@/config'

import { vuexTypes } from '@/vuex'
import accountModule from '@/vuex/account.module'
import { ErrorHandler } from '@/js/helpers/error-handler'

// HACK: https://github.com/vuejs/vue-test-utils/issues/532, waiting for
// Vue 2.6 so everything get fixed
Vue.config.silent = true

const localVue = createLocalVue()
localVue.use(Vuelidate)
localVue.use(Vuex)

describe('IssuanceForm', () => {
  const sampleIssuanceData = {
    form: {
      asset: { code: 'BTC' },
      amount: 10,
      receiver: 'foo@bar.com',
      reference: 'ref',
    },
    ownedAssets: [{
      code: 'BTC',
      details: {
        name: 'Bitcoin',
      },
      availableForIssuance: 100,
    }, {
      code: 'ETH',
      details: {
        name: 'Ethereum',
      },
      availableForIssuance: 200,
    }],
    isLoaded: true,
  }

  afterEach(() => {
    sinon.restore()
  })

  describe('validation rules assigned correctly', () => {
    let wrapper

    beforeEach(() => {
      sinon.stub(IssuanceForm, 'created').resolves()
      const getters = accountModule.getters
      sinon.stub(getters, vuexTypes.accountRoleId)
        .returns(config.ACCOUNT_ROLES.syndicate)
      const store = new Vuex.Store({
        getters,
      })
      wrapper = mount(IssuanceForm, {
        localVue,
        data: () => Object.assign({}, sampleIssuanceData),
        sync: false,
        store,
      })
    })

    const expectedResults = {
      asset: ['required'],
      amount: ['required', 'amountRange', 'maxDecimalDigitsCount'],
      receiver: ['required', 'emailOrAccountId'],
      reference: ['required', 'maxLength'],
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
      '#issuance-reference': 'reference',
    }

    for (const [selector, model] of Object.entries(fieldBindings)) {
      it(`$v.form.${model} is touched after blur event emitted on ${selector}`, () => {
        const spy = sinon.stub(wrapper.vm, 'touchField')

        wrapper.find(selector).vm.$emit('blur')

        expect(spy.calledOnce).to.be.true
      })
    }
  })

  describe('component', () => {
    let wrapper
    let mockHelper

    let accountResource
    let publicResource
    let transactionsResource

    let store

    beforeEach(() => {
      mockHelper = new MockHelper()

      accountResource = mockHelper.getHorizonResourcePrototype('account')
      publicResource = mockHelper.getHorizonResourcePrototype('public')
      transactionsResource =
        mockHelper.getHorizonResourcePrototype('transactions')

      const getters = accountModule.getters
      sinon.stub(getters, vuexTypes.accountRoleId)
        .returns(config.ACCOUNT_ROLES.syndicate)
      store = new Vuex.Store({
        getters,
      })

      sinon.stub(IssuanceForm, 'created').resolves()
      wrapper = shallowMount(IssuanceForm, {
        store,
        mixins: [OwnedAssetsLoaderMixin],
        localVue,
        data: () => Object.assign({}, sampleIssuanceData),
        sync: false,
      })
      sinon.stub(wrapper.vm, 'isFormValid').returns(true)
    })

    describe('created hook', () => {
      beforeEach(() => {
        IssuanceForm.created.restore()
      })

      it('initializes asset selector', async () => {
        const initAssetSelectorStub = sinon
          .stub(IssuanceForm.methods, 'initAssetSelector')
          .resolves()

        const wrp = await shallowMount(IssuanceForm, { localVue, store })

        expect(initAssetSelectorStub).to.has.been.calledOnce
        expect(wrp.vm.isLoaded).to.equal(true)

        initAssetSelectorStub.restore()
      })

      it('handles an occurred error without any feedback to the user', async () => {
        const theError = new Error()
        const initAssetSelectorStub = sinon
          .stub(IssuanceForm.methods, 'initAssetSelector')
          .throws(theError)
        sinon.stub(ErrorHandler, 'processWithoutFeedback')

        const wrp = await shallowMount(IssuanceForm, { localVue, store })

        expect(wrp.vm.isLoaded).to.equal(false)
        expect(ErrorHandler.processWithoutFeedback).to.has.been
          .calledOnceWithExactly(theError)

        initAssetSelectorStub.restore()
        ErrorHandler.processWithoutFeedback.restore()
      })
    })

    describe('method', () => {
      describe('submit', () => {
        let getBalanceSpy
        let operationBuilderSpy
        let submitTransactionsSpy
        let loadAssetsSpy

        beforeEach(() => {
          getBalanceSpy = sinon.stub(wrapper.vm, 'getReceiverBalance')
            .resolves({})
          operationBuilderSpy = sinon.stub(base.CreateIssuanceRequestBuilder,
            'createIssuanceRequest'
          ).returns({})
          submitTransactionsSpy = sinon.stub(transactionsResource,
            'submitOperations'
          ).resolves()
          loadAssetsSpy = sinon.stub(wrapper.vm, 'loadOwnedAssets').resolves()
        })

        it('loads receiver balance', async () => {
          await wrapper.vm.submit()

          expect(getBalanceSpy
            .withArgs(wrapper.vm.form.receiver, wrapper.vm.form.asset.code)
            .calledOnce
          ).to.be.true
        })

        it('creates pre-issuance operation if the receiver balance is provided', async () => {
          await wrapper.vm.submit()

          expect(operationBuilderSpy.calledOnce).to.be.true
        })

        it('submits issuance operation if the receiver balance is provided', async () => {
          await wrapper.vm.submit()

          expect(submitTransactionsSpy.calledOnce).to.be.true
        })

        it('loads user owned assets after successful submitting', async () => {
          sinon.stub(Bus, 'success')

          await wrapper.vm.submit()

          expect(loadAssetsSpy.calledOnce).to.be.true
        })

        it('shows the error if the receiver balance is not provided', async () => {
          wrapper.vm.getReceiverBalance.restore()
          sinon.stub(wrapper.vm, 'getReceiverBalance').resolves(null)
          const spy = sinon.stub(Bus, 'error')

          await wrapper.vm.submit()

          expect(spy.calledOnce).to.be.true
        })
      })

      describe('getReceiverBalance', () => {
        const sampleBalanceData = {
          asset: 'BTC',
          balanceId: 'BCQOBAIMVNNH7RHZTD4OVSRUX2W575VUK4RUYELRHDPXSXJ5TMS2BHAV',
        }
        const receiver = sampleIssuanceData.form.receiver
        const asset = sampleIssuanceData.form.asset.code

        let getAccountIdSpy
        let fetchBalancesSpy

        beforeEach(() => {
          getAccountIdSpy = sinon.stub(wrapper.vm, 'getReceiverAccountId')
            .resolves(mockHelper.getMockWallet().accountId)
          fetchBalancesSpy = sinon.stub(accountResource, 'getBalances')
            .resolves(MockWrapper.makeHorizonResponse([sampleBalanceData]))
        })

        it('loads receiver account ID', async () => {
          await wrapper.vm.getReceiverBalance(receiver, asset)

          expect(getAccountIdSpy
            .withArgs(receiver)
            .calledOnce
          ).to.be.true
        })

        it('fetches receiver balances', async () => {
          await wrapper.vm.getReceiverBalance(receiver, asset)

          expect(fetchBalancesSpy
            .withArgs(mockHelper.getMockWallet().accountId)
            .calledOnce
          ).to.be.true
        })

        it('returns a balance for provided asset', async () => {
          const result = await wrapper.vm.getReceiverBalance(receiver, asset)

          expect(result).to.deep.equal(sampleBalanceData)
        })
      })

      describe('getReceiverAccountId', () => {
        it('loads account ID by email if receiver is a valid email', async () => {
          const receiver = 'foo@bar.com'
          const spy = sinon.stub(publicResource, 'getAccountIdByEmail')
            .resolves({ data: {} })

          await wrapper.vm.getReceiverAccountId(receiver)

          expect(spy
            .withArgs(receiver)
            .calledOnce
          ).to.be.true
        })

        it('returns receiver if it is not a valid email', async () => {
          const receiver = 'receiver'

          const result = await wrapper.vm.getReceiverAccountId(receiver)

          expect(result).to.equal(receiver)
        })
      })
    })

    // TODO: initAssetSelector and reinitAssetSelector tests
  })
})
