import BalanceExplorerModule from './index'

import Vuex from 'vuex'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { vuexTypes } from '@/vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Balance explorer module', () => {
  let sandbox
  let store

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    store = new Vuex.Store({
      getters: {
        [vuexTypes.accountBalances]: _ => [],
        [vuexTypes.accountId]: _ => 'SOME_ACCOUNT_ID',
        [vuexTypes.defaultQuoteAsset]: _ => {},
      },
      modules: {
        accountId: 'SOME_ACCOUNT_ID',
      },
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('created hook', () => {
    it('inits API, sets account ID, and loads balances', async () => {
      sandbox.stub(BalanceExplorerModule.methods, 'load')

      await shallowMount(BalanceExplorerModule, {
        localVue,
        store,
      })

      expect(BalanceExplorerModule.methods.load)
        .to.have.been.calledOnce
    })
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      sandbox.stub(BalanceExplorerModule, 'created').resolves()

      wrapper = shallowMount(BalanceExplorerModule, {
        store,
        localVue,
      })
    })

    describe('method', () => {
      describe('load', () => {
        it('calls load methods and sets isLoaded property to true if loading succeded', async () => {
          sandbox.stub(wrapper.vm, 'loadAccountBalances').resolves()

          await wrapper.vm.load()

          expect(wrapper.vm.loadAccountBalances).to.have.been.calledOnce
          expect(wrapper.vm.isLoaded).to.be.true
        })

        it('handles the error if loading was failed', async () => {
          sandbox.stub(wrapper.vm, 'loadAccountBalances').throws()
          sandbox.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.load()

          expect(wrapper.vm.isLoadFailed).to.be.true
          expect(ErrorHandler.processWithoutFeedback).to.have.been.calledOnce
        })
      })
    })
  })
})
