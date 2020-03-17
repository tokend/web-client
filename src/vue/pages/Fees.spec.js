import Fees from './Fees'

import Vuex from 'vuex'

import { vuexTypes } from '@/vuex'
import account from '@/vuex/account.module'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { globalize } from '@/vue/filters/globalize'

import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.filter('globalize', globalize)

describe('Fees’', () => {
  let getters
  let store

  beforeEach(() => {
    getters = account.getters

    sinon.stub(getters, vuexTypes.accountId).returns('STORED_ACCOUNT_ID')

    store = new Vuex.Store({ getters })

    sinon.stub(Fees, 'created').resolves()
    shallowMount(Fees, {
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
      sinon.stub(ErrorHandler, 'processWithoutFeedback')

      await shallowMount(Fees, { localVue, store })

      expect(initAssetSelectorStub).to.has.been.calledOnce
      expect(ErrorHandler.processWithoutFeedback).to.has.not.been.called

      initAssetSelectorStub.restore()
      ErrorHandler.processWithoutFeedback.restore()
    })

    it('handles an occurred error without any feedback to the user', async () => {
      const theError = new Error()
      const initAssetSelectorStub = sinon
        .stub(Fees.methods, 'loadAssets')
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

  // TODO: test initAssetSelector, loadAssets
})
