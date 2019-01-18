import TransferForm from './TransferForm'

import Vue from 'vue'
import Vuex from 'vuex'
import Vuelidate from 'vuelidate'

import { createLocalVue, shallowMount } from '@vue/test-utils'
import { MockHelper } from '@/test'
import { globalize } from '@/vue/filters/globalize'
import accountModule from '@/vuex/account.module'
import { vuexTypes } from '@/vuex'
import {
  errors,
  base,
  FEE_TYPES,
  PAYMENT_FEE_SUBTYPES,
  ASSET_POLICIES
} from '@tokend/js-sdk'
import { Bus } from '@/js/helpers/event-bus'
import { TestHelper } from '@/test/test-helper'

// HACK: https://github.com/vuejs/vue-test-utils/issues/532, waiting for
// Vue 2.6 so everything get fixed
Vue.config.silent = true

const localVue = createLocalVue()
localVue.use(Vuelidate)
localVue.use(Vuex)
localVue.filter('globalize', globalize)

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
        asset: 'BTC',
        balance: '1',
        assetDetails: {
          policies: [
            { value: ASSET_POLICIES.transferable },
            { value: ASSET_POLICIES.baseAsset }
          ]
        }
      },
      {
        asset: 'USD',
        balance: '3',
        assetDetails: {
          policies: [
            { value: ASSET_POLICIES.transferable },
            { value: ASSET_POLICIES.baseAsset },
            { value: ASSET_POLICIES.statsQuoteAsset }
          ]
        }
      },
      {
        asset: 'ETH',
        balance: '0',
        assetDetails: {
          policies: [
            { value: ASSET_POLICIES.baseAsset }
          ]
        }
      }
    ]
    sinon.stub(accountModule.getters, vuexTypes.accountBalances)
      .returns(mockedAccountBalances)
    sinon.stub(accountModule.actions, vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS)
      .resolves(mockedAccountBalances)

    store = new Vuex.Store({
      getters: accountModule.getters,
      actions: accountModule.actions
    })
    wrapper = shallowMount(TransferForm, {
      store,
      localVue
    })
  })

  describe('loadPaymentFee()', () => {
    const paymentDetails = {
      asset: 'BTC',
      subtype: PAYMENT_FEE_SUBTYPES.outgoing,
      account: 'SOME_ACCOUNT_ID',
      amount: 10
    }
    let feesResource
    let feesStub

    beforeEach(() => {
      feesResource = mockHelper.getHorizonResourcePrototype('fees')
      feesStub = sinon.stub(feesResource, 'get')
        .withArgs(FEE_TYPES.paymentFee, paymentDetails)
    })

    it('fetches fees', async () => {
      const expectedResult = { someKey: 'someData' }
      feesStub.resolves({ data: expectedResult })

      const result = await wrapper.vm.loadPaymentFee(paymentDetails)

      expect(feesResource.get.calledOnce).to.be.true
      expect(result).to.deep.equal(expectedResult)
    })

    it('handle errors', async () => {
      feesStub.throws(TestHelper.getError(errors.NotFoundError))
      sinon.stub(Bus, 'error')

      await wrapper.vm.loadPaymentFee(paymentDetails)

      expect(feesResource.get.calledOnce).to.be.true
      expect(Bus.error.calledOnce).to.be.true
    })
  })

  describe('getCounterparty()', () => {
    let usersApiResource

    beforeEach(() => {
      usersApiResource = mockHelper.getApiResourcePrototype('users')
      const expectedCounterpartyData = {
        data: [{ id: mockHelper.getDefaultAccountId }]
      }
      sinon.stub(usersApiResource, 'getPage').resolves(expectedCounterpartyData)
    })

    it('check that handles email as argument', async () => {
      await wrapper.vm.getCounterparty('some@email.com')

      expect(usersApiResource.getPage.calledOnce).to.be.true
    })

    it('check that handles accountId as argument', async () => {
      await wrapper.vm.getCounterparty(mockHelper.getDefaultAccountId)

      expect(usersApiResource.getPage.called).to.be.false
    })
  })

  describe('updateView()', () => {
    beforeEach(() => {
      sinon.stub(wrapper.vm, 'setTokenCode')
    })

    it('do not reset form if third argument (clear) not passed', () => {
      wrapper.vm.updateView('SOME_VIEW_MODE', {})

      expect(wrapper.vm.setTokenCode.called).to.be.false
    })

    it('do not reset form if third argument (clear) passed with value "false"', () => {
      wrapper.vm.updateView('SOME_VIEW_MODE', {}, false)

      expect(wrapper.vm.setTokenCode.called).to.be.false
    })

    it('reset form if third argument (clear) passed with value "true"', () => {
      wrapper.vm.updateView('SOME_VIEW_MODE', {}, true)

      expect(wrapper.vm.setTokenCode.calledOnce).to.be.true
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
    wrapper.vm.form.tokenCode = 'BTC'

    sinon.stub(base.PaymentV2Builder, 'paymentV2').returns('some operation')

    const operation = wrapper.vm.buildPaymentOperation()

    expect(operation).to.equal('some operation')
  })

  describe('processTransfer()', () => {
    function stubFeesWithValidResult () {
      const expectedFees = {
        destination: {
          fixed: '0.000001',
          percent: '0.01',
          feeAsset: 'BTC'
        },
        source: {
          fixed: '0.000001',
          percent: '0.01',
          feeAsset: 'BTC'
        }
      }
      sinon.stub(wrapper.vm, 'getFees').resolves(expectedFees)
    }

    beforeEach(() => {
      const mockedBalance = {
        accountId: mockHelper.getDefaultAccountId,
        asset: 'ETH',
        balance: '0.000000',
        balanceId: mockHelper.getDefaultBalanceId,
        convertedBalance: '0.000000',
        convertedLocked: '0.000000',
        convertedToAsset: 'USD',
        locked: '0.000000',
        requireReview: false
      }
      wrapper = shallowMount(TransferForm, {
        store,
        localVue,
        computed: {
          balance () {
            return mockedBalance
          }
        }
      })

      sinon.stub(wrapper.vm, 'getCounterparty')
        .resolves(mockHelper.getDefaultAccountId)

      sinon.stub(wrapper.vm, 'updateView')
      sinon.stub(wrapper.vm, 'disableForm')
      sinon.stub(wrapper.vm, 'enableForm')
    })

    it('do not try to process transfer if form is not valid', async () => {
      stubFeesWithValidResult()

      wrapper.vm.form = {
        tokenCode: null,
        amount: '',
        recipient: '',
        subject: '',
        isPaidForRecipient: false
      }

      await wrapper.vm.processTransfer()

      expect(wrapper.vm.disableForm.calledOnce).to.be.false
      expect(wrapper.vm.getCounterparty.called).to.be.false
      expect(wrapper.vm.getFees.called).to.be.false
      expect(wrapper.vm.updateView.called).to.be.false
      expect(wrapper.vm.enableForm.calledOnce).to.be.false
    })

    it('try to process transfer if form is valid', async () => {
      stubFeesWithValidResult()

      wrapper.vm.form = {
        tokenCode: 'BTC',
        amount: '10',
        recipient: mockHelper.getDefaultAccountId,
        subject: 'some subject',
        isPaidForRecipient: false
      }

      await wrapper.vm.processTransfer()

      expect(wrapper.vm.disableForm.calledOnce).to.be.true
      expect(wrapper.vm.getCounterparty.calledOnce).to.be.true
      expect(wrapper.vm.getFees.calledOnce).to.be.true
      expect(wrapper.vm.updateView.calledOnce).to.be.true
      expect(wrapper.vm.enableForm.calledOnce).to.be.true
    })

    it('handle errors', async () => {
      sinon.stub(wrapper.vm, 'getFees')
        .throws(TestHelper.getError(errors.NotFoundError))
      sinon.stub(Bus, 'error')

      await wrapper.vm.processTransfer()

      expect(Bus.error.calledOnce).to.be.true
    })
  })

  describe('computed properties', () => {
    it('userTransferableTokens()', () => {
      const expectUserTransferableTokens = [
        mockedAccountBalances[0],
        mockedAccountBalances[1]
      ]
      expect(wrapper.vm.userTransferableTokens)
        .to.deep.equal(expectUserTransferableTokens)
    })

    it('tokenCodes()', () => {
      const expectUserTransferableTokens = [
        mockedAccountBalances[0],
        mockedAccountBalances[1]
      ]
      wrapper = shallowMount(TransferForm, {
        store,
        localVue,
        computed: {
          userTransferableTokens () {
            return expectUserTransferableTokens
          }
        }
      })

      expect(wrapper.vm.tokenCodes)
        .to.deep.equal(['BTC', 'USD'])
    })

    it('balance()', () => {
      wrapper.vm.form.tokenCode = 'USD'

      expect(wrapper.vm.balance).to.equal(mockedAccountBalances[1])
    })

    describe('isLimitExceeded()', () => {
      it('check than amount > than balance', () => {
        wrapper = shallowMount(TransferForm, {
          localVue,
          store,
          computed: {
            balance () {
              return mockedAccountBalances[0]
            }
          }
        })

        wrapper.vm.form.amount = '2'

        expect(wrapper.vm.isLimitExceeded).to.be.true
      })

      it('check than amount < than balance', () => {
        wrapper = shallowMount(TransferForm, {
          localVue,
          store,
          computed: {
            balance () {
              return mockedAccountBalances[1]
            }
          }
        })

        wrapper.vm.form.amount = '1'

        expect(wrapper.vm.isLimitExceeded).to.be.false
      })
    })
  })

  describe('submit()', () => {
    it('check than called all methods ', async () => {
      sinon.stub(wrapper.vm, 'disableForm')
      sinon.stub(wrapper.vm, 'enableForm')
      sinon.stub(wrapper.vm, 'buildPaymentOperation').returns(true)

      const transactionsResource =
        mockHelper.getHorizonResourcePrototype('transactions')
      sinon.stub(transactionsResource, 'submitOperations')
        .withArgs(true)
        .resolves()
      sinon.stub(wrapper.vm, 'rerenderForm')
      sinon.stub(Bus, 'success')

      await wrapper.vm.submit()

      expect(wrapper.vm.disableForm.calledOnce).to.be.true
      expect(wrapper.vm.buildPaymentOperation.calledOnce).to.be.true
      expect(transactionsResource.submitOperations.calledOnce).to.be.true
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

      const transactionsResource =
        mockHelper.getHorizonResourcePrototype('transactions')
      sinon.stub(transactionsResource, 'submitOperations')
        .withArgs(true)
        .throws(TestHelper.getError(errors.NotFoundError))
      sinon.stub(Bus, 'error')

      await wrapper.vm.submit()

      expect(wrapper.vm.disableForm.calledOnce).to.be.true
      expect(wrapper.vm.buildPaymentOperation.calledOnce).to.be.true
      expect(transactionsResource.submitOperations.calledOnce).to.be.true
      expect(Bus.error.calledOnce).to.be.true
      expect(wrapper.vm.enableForm.calledOnce).to.be.true
    })
  })
})
