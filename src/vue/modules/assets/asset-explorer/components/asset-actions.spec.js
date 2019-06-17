import AssetActions from './asset-actions'

import Vuex from 'vuex'

import { assetExplorerModule } from '../store/index'
import { AssetRecord } from '@/js/records/entities/asset.record'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { vuexTypes } from '@/vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Asset actions', () => {
  let sandbox
  let wrapper

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    wrapper = shallowMount(AssetActions, {
      store: new Vuex.Store({
        getters: {
          [vuexTypes.accountBalanceByCode]: a => {
            return function (a) {
              return {}
            }
          },
        },
        modules: { 'asset-explorer': assetExplorerModule },
      }),
      propsData: { asset: new AssetRecord({}) },
      localVue,
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('method', () => {
    it('creates new balance, reloads all of them, and emit proper event if balance creation was successfull', async () => {
      wrapper.setProps({
        asset: new AssetRecord({ id: 'USD' }),
      })

      sandbox.stub(wrapper.vm, 'createBalance').resolves()
      sandbox.stub(wrapper.vm, 'loadAccountBalances').resolves()
      sandbox.stub(Bus, 'success')

      await wrapper.vm.addBalance()

      expect(wrapper.vm.createBalance)
        .to.have.been.calledOnceWithExactly('USD')
      expect(wrapper.vm.loadAccountBalances)
        .to.have.been.calledOnce

      expect(Bus.success).to.have.been.calledOnce
      expect(wrapper.vm.isPending).to.be.true
      expect(wrapper.emitted()['balance-added']).to.exist
    })

    it('handles the error and sets isPending property to false if operation was failed', async () => {
      sandbox.stub(wrapper.vm, 'createBalance').throws()
      sandbox.stub(ErrorHandler, 'process')

      await wrapper.vm.addBalance()

      expect(wrapper.vm.isPending).to.be.false
      expect(ErrorHandler.process).to.have.been.calledOnce
    })
  })
})
