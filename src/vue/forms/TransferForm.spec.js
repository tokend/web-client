import TransferForm from './TransferForm'

import Vue from 'vue'
import Vuex from 'vuex'
import Vuelidate from 'vuelidate'

import { createLocalVue, shallowMount } from '@vue/test-utils'
import { MockHelper } from '@/test'

import { vuexTypes } from '@/vuex'
import accountModule from '@/vuex/account.module'

import { api } from '@/api'
import { errors, base, ASSET_POLICIES } from '@tokend/js-sdk'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

import { TestHelper } from '@/test/test-helper'

import { AssetRecord } from '@/js/records/entities/asset.record'

// HACK: https://github.com/vuejs/vue-test-utils/issues/532, waiting for
// Vue 2.6 so everything get fixed
Vue.config.silent = true

const localVue = createLocalVue()
localVue.use(Vuelidate)
localVue.use(Vuex)

describe('TransferForm component', () => {
  let mockHelper
  let wrapper
  let store
  let mockedAccountBalances

  afterEach(() => {
    sinon.restore()
  })

  beforeEach(() => {
    mockHelper = new MockHelper()

    sinon.stub(TransferForm, 'created').resolves()
    sinon.stub(accountModule.getters, vuexTypes.accountId)
      .returns(mockHelper.getDefaultAccountId)

    mockedAccountBalances = [
      {
        balance: '1',
        asset: new AssetRecord({
          id: 'BTC',
          policies: {
            flags: [
              { value: ASSET_POLICIES.transferable },
              { value: ASSET_POLICIES.baseAsset },
            ],
          },
        }),
      },
      {
        balance: '3',
        asset: new AssetRecord({
          id: 'USD',
          policies: {
            flags: [
              { value: ASSET_POLICIES.transferable },
              { value: ASSET_POLICIES.baseAsset },
              { value: ASSET_POLICIES.statsQuoteAsset },
            ],
          },
        }),
      },
      {
        balance: '0',
        asset: new AssetRecord({
          id: 'ETH',
          policies: [
            { value: ASSET_POLICIES.baseAsset },
          ],
        }),
      },
    ]
    sinon.stub(accountModule.actions, vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS)
      .resolves(mockedAccountBalances)

    store = new Vuex.Store({
      getters: accountModule.getters,
      actions: accountModule.actions,
    })
    wrapper = shallowMount(TransferForm, { store, localVue })
  })

  describe('getCounterparty()', () => {
    beforeEach(() => {
      sinon
        .stub(wrapper.vm, 'getAccountIdByIdentifier')
        .resolves(mockHelper.getDefaultAccountId)
    })

    it('check that handles email as argument', async () => {
      await wrapper.vm.getCounterparty('some@email.com')

      expect(wrapper.vm.getAccountIdByIdentifier.calledOnce).to.be.true
    })

    it('check that handles accountId as argument', async () => {
      await wrapper.vm.getCounterparty(mockHelper.getDefaultAccountId)

      expect(wrapper.vm.getAccountIdByIdentifier.called).to.be.false
    })
  })

  describe('updateView()', () => {
    beforeEach(() => {
      const mockedBalance = {
        accountId: mockHelper.getDefaultAccountId,
        asset: 'BTC',
        balance: '1.000000',
        balanceId: mockHelper.getDefaultBalanceId,
        convertedBalance: '0.000000',
        convertedLocked: '0.000000',
        convertedToAsset: 'USD',
        locked: '0.000000',
        requireReview: false,
      }
      wrapper = shallowMount(TransferForm, {
        store,
        localVue,
        computed: {
          balance () {
            return mockedBalance
          },
        },
      })
      sinon.stub(wrapper.vm, 'setAsset')
    })

    it('do not reset form if third argument (clear) not passed', () => {
      wrapper.vm.updateView('SOME_VIEW_MODE', {})

      expect(wrapper.vm.setAsset.called).to.be.false
    })

    it('do not reset form if third argument (clear) passed with value "false"', () => {
      wrapper.vm.updateView('SOME_VIEW_MODE', {}, false)

      expect(wrapper.vm.setAsset.called).to.be.false
    })

    it('reset form if third argument (clear) passed with value "true"', () => {
      wrapper.vm.updateView('SOME_VIEW_MODE', {}, true)

      expect(wrapper.vm.setAsset.calledOnce).to.be.true
    })
  })

  it('buildPaymentOperation()', () => {
    wrapper.vm.view.opts.sourceBalanceId = mockHelper.getDefaultBalanceId
    wrapper.vm.view.opts.destinationAccountId = mockHelper.getDefaultAccountId
    wrapper.vm.view.opts.amount = '5'
    wrapper.vm.view.opts.sourcePercentFee = '0.1'
    wrapper.vm.view.opts.sourceFixedFee = '0.1'
    wrapper.vm.view.opts.sourceFeeAsset = 'BTC'
    wrapper.vm.view.opts.destinationPercentFee = '0.1'
    wrapper.vm.view.opts.destinationFixedFee = '0.1'
    wrapper.vm.view.opts.destinationFeeAsset = 'BTC'
    wrapper.vm.view.opts.feeFromSource = false
    wrapper.vm.view.opts.subject = 'Some text'
    wrapper.vm.form.asset = { code: 'BTC' }

    sinon.stub(base.PaymentBuilder, 'payment').returns('some operation')

    const operation = wrapper.vm.buildPaymentOperation()

    expect(operation).to.equal('some operation')
  })

  describe('processTransfer()', () => {
    const expectedFees = {
      destinationFee: {
        fixed: '0.000001',
        calculatedPercent: '0.01',
        feeAsset: 'BTC',
      },
      sourceFee: {
        fixed: '0.000001',
        calculatedPercent: '0.01',
        feeAsset: 'BTC',
      },
      type: 0,
    }

    beforeEach(() => {
      const mockedBalance = {
        accountId: mockHelper.getDefaultAccountId,
        asset: 'BTC',
        balance: '1.000000',
        balanceId: mockHelper.getDefaultBalanceId,
        convertedBalance: '0.000000',
        convertedLocked: '0.000000',
        convertedToAsset: 'USD',
        locked: '0.000000',
        requireReview: false,
      }
      wrapper = shallowMount(TransferForm, {
        store,
        localVue,
        computed: {
          balance () {
            return +mockedBalance.balance
          },
        },
      })

      sinon.stub(wrapper.vm, 'getCounterparty')
        .resolves(mockHelper.getDefaultAccountId)

      sinon.stub(wrapper.vm, 'updateView')
      sinon.stub(wrapper.vm, 'disableForm')
      sinon.stub(wrapper.vm, 'enableForm')
      sinon.stub(ErrorHandler, 'process')
    })

    it('try to process transfer if the form is valid', async () => {
      sinon.stub(wrapper.vm, 'calculateFees')
        .resolves(expectedFees)
      sinon.stub(wrapper.vm.isFeesLoaded)

      wrapper.vm.form = {
        asset: { code: 'BTC' },
        amount: '1',
        recipient: mockHelper.getDefaultAccountId,
        subject: 'some subject',
        isPaidForRecipient: false,
      }

      await wrapper.vm.processTransfer()

      expect(wrapper.vm.getCounterparty.calledOnce).to.be.true
      expect(wrapper.vm.isFeesLoaded).equal(true)
      expect(wrapper.vm.calculateFees.calledOnce).to.be.true
    })

    it('calculateFees handle error', async () => {
      sinon.stub(wrapper.vm, 'calculateFees')
        .rejects()

      // make form valid to pass isFormValid()
      wrapper.vm.form = {
        asset: { code: 'BTC' },
        amount: '1',
        recipient: mockHelper.getDefaultAccountId,
        subject: 'some subject',
        isPaidForRecipient: false,
      }

      await wrapper.vm.processTransfer()

      expect(wrapper.vm.calculateFees.calledOnce).to.be.true
      expect(ErrorHandler.process.calledOnce).to.be.true
    })
  })

  describe('submit()', () => {
    it('check than called all methods ', async () => {
      sinon.stub(wrapper.vm, 'disableForm')
      sinon.stub(wrapper.vm, 'enableForm')
      sinon.stub(wrapper.vm, 'buildPaymentOperation').returns(true)
      sinon.stub(wrapper.vm, 'rerenderForm')

      sinon.stub(api, 'postOperations').resolves()
      sinon.stub(Bus, 'success')

      await wrapper.vm.submit()

      expect(wrapper.vm.disableForm.calledOnce).to.be.true
      expect(wrapper.vm.buildPaymentOperation.calledOnce).to.be.true
      expect(api.postOperations.calledOnce).to.be.true
      expect(Bus.success.calledOnce).to.be.true
      expect(accountModule.actions[vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS]
        .calledOnce).to.be.true
      expect(wrapper.vm.rerenderForm.calledOnce).to.be.true
      expect(wrapper.vm.enableForm.calledOnce).to.be.true
    })

    it('handle errors', async () => {
      sinon.stub(wrapper.vm, 'disableForm')
      sinon.stub(wrapper.vm, 'enableForm')
      sinon.stub(wrapper.vm, 'buildPaymentOperation').returns(true)

      sinon.stub(api, 'postOperations')
        .withArgs(true)
        .throws(TestHelper.getError(errors.NotFoundError))
      sinon.stub(ErrorHandler, 'process')

      await wrapper.vm.submit()

      expect(wrapper.vm.disableForm.calledOnce).to.be.true
      expect(wrapper.vm.buildPaymentOperation.calledOnce).to.be.true
      expect(api.postOperations.calledOnce).to.be.true
      expect(ErrorHandler.process.calledOnce).to.be.true
      expect(wrapper.vm.enableForm.calledOnce).to.be.true
    })
  })
})
