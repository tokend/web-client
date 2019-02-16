import Fees from './Fees'

import Vuex from 'vuex'

import { vuexTypes } from '@/vuex'
import account from '@/vuex/account.module'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { globalize } from '@/vue/filters/globalize'
import { formatFeeType } from '@/vue/filters/formatFeeType'
import { formatFeeSubType } from '@/vue/filters/formatFeeSubType'
import { formatMoney } from '@/vue/filters/formatMoney'
import { formatPercent } from '@/vue/filters/formatPercent'

import { MockHelper, MockWrapper } from '@/test'
import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.filter('globalize', globalize)
localVue.filter('formatFeeType', formatFeeType)
localVue.filter('formatFeeSubType', formatFeeSubType)
localVue.filter('formatMoney', formatMoney)
localVue.filter('formatPercent', formatPercent)

describe('Fees’', () => {
  const feesSampleData = {
    ali: [{
      fixed: '1',
      percent: '0.1',
    }],
    btc: [{
      fixed: '1',
      percent: '0',
    }],
  }
  let mockHelper
  let feesResource
  let getters
  let store
  let wrapper

  beforeEach(() => {
    mockHelper = new MockHelper()
    feesResource = mockHelper.getHorizonResourcePrototype('fees')
    getters = account.getters

    sinon.stub(getters, vuexTypes.accountId).returns('STORED_ACCOUNT_ID')

    store = new Vuex.Store({ getters })

    sinon.stub(Fees, 'created').resolves()
    wrapper = shallowMount(Fees, {
      store,
      localVue,
    })
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('created hook', () => {
    beforeEach(() => {
      Fees.created.restore()
    })

    it('initializes asset selector', async () => {
      const initAssetSelectorStub = sinon
        .stub(Fees.methods, 'initAssetSelector')
        .resolves()
      const loadFeesStub = sinon
        .stub(Fees.methods, 'loadFees')
        .resolves()
      sinon.stub(ErrorHandler, 'processWithoutFeedback')

      const wrp = await shallowMount(Fees, { localVue, store })

      expect(initAssetSelectorStub).to.has.been.calledOnce
      expect(loadFeesStub).to.has.been.called
      expect(wrp.vm.isLoaded).to.equal(false)
      expect(wrp.vm.isLoadingFailed).to.equal(false)
      expect(ErrorHandler.processWithoutFeedback).to.has.not.been.called

      initAssetSelectorStub.restore()
      loadFeesStub.restore()
      ErrorHandler.processWithoutFeedback.restore()
    })

    it('handles an occurred error without any feedback to the user', async () => {
      const theError = new Error()
      const initAssetSelectorStub = sinon
        .stub(Fees.methods, 'initAssetSelector')
        .throws(theError)
      sinon.stub(ErrorHandler, 'processWithoutFeedback')

      const wrp = await shallowMount(Fees, { localVue, store })

      expect(wrp.vm.isLoaded).to.equal(false)
      expect(wrp.vm.isLoadingFailed).to.equal(true)
      expect(ErrorHandler.processWithoutFeedback).to.has.been
        .calledOnceWithExactly(theError)

      initAssetSelectorStub.restore()
      ErrorHandler.processWithoutFeedback.restore()
    })
  })

  it('loadFees() calls the horizon.fees.getAll() with the correct params', async () => {
    const spy = sinon.stub(feesResource, 'getAll').resolves({
      data: {
        fees: {},
      },
    })

    await wrapper.vm.loadFees()

    expect(spy).to.has.been.calledOnceWithExactly({
      account_id: wrapper.vm.accountId,
    })
  })

  it('loadFees() changes fees data after loading', async () => {
    sinon.stub(feesResource, 'getAll').resolves(
      MockWrapper.makeHorizonResponse({ fees: feesSampleData })
    )

    await wrapper.vm.loadFees()

    expect(wrapper.vm.fees).to.not.equal(null)
  })

  it('valuableAssetFees returns only the fees with the code filters.asset', () => {
    wrapper.setData({
      fees: feesSampleData,
      filters: {
        asset: { code: 'BTC' },
      },
    })

    expect(wrapper.vm.valuableAssetFees).to.deep.equal(feesSampleData.btc)
  })

  // TODO: test initAssetSelector, loadAssets
})
