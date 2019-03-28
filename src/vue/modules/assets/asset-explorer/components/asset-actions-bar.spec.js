import AssetActionsBar from './asset-actions-bar'

import Vuex from 'vuex'

import { assetExplorerModule } from '../store/index'
import { Asset } from '../../shared/wrappers/asset'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Asset explorer module', () => {
  const props = {
    asset: new Asset({
      id: 'USD',
    }),
  }

  let store
  let wrapper

  beforeEach(() => {
    store = new Vuex.Store({
      modules: { 'asset-explorer': assetExplorerModule },
    })

    wrapper = shallowMount(AssetActionsBar, {
      store,
      localVue,
      propsData: props,
    })
  })

  describe('method', () => {
    describe('addBalance', () => {
      beforeEach(() => {
        sinon.stub(wrapper.vm, 'createBalance').resolves()
        sinon.stub(Bus, 'success')
        sinon.stub(ErrorHandler, 'process')
      })

      afterEach(() => {
        wrapper.vm.createBalance.restore()
        Bus.success.restore()
        ErrorHandler.process.restore()
      })

      it('calls Bus.error if balance creation is not allowed', async () => {
        const kycRequiredAssetType = 'KYC_REQUIRED'
        wrapper.setProps({
          kycRequiredAssetType,
          asset: new Asset({
            type: kycRequiredAssetType,
          }),
          isAccountUnverified: true,
        })
        sinon.stub(Bus, 'error')

        await wrapper.vm.addBalance()

        expect(Bus.error).to.have.been.calledOnce

        Bus.error.restore()
      })

      it('calls createBalance method with correct params', async () => {
        sinon.stub(wrapper.vm, 'loadAccountBalances').resolves()

        await wrapper.vm.addBalance()

        expect(wrapper.vm.createBalance)
          .to.have.been.calledOnceWithExactly('USD')

        wrapper.vm.loadAccountBalances.restore()
      })

      it('calls loadAccountBalances method', async () => {
        sinon.stub(wrapper.vm, 'loadAccountBalances').resolves()

        await wrapper.vm.addBalance()

        expect(wrapper.vm.loadAccountBalances)
          .to.have.been.calledOnce

        wrapper.vm.loadAccountBalances.restore()
      })

      it('sets isPending property to true if operation was succeded', async () => {
        sinon.stub(wrapper.vm, 'loadAccountBalances').resolves()

        await wrapper.vm.addBalance()

        expect(wrapper.vm.isPending).to.be.true

        wrapper.vm.loadAccountBalances.restore()
      })

      it('emits proper event if operation was succeded', async () => {
        sinon.stub(wrapper.vm, 'loadAccountBalances').resolves()
        const balanceAddedEvent = 'balance-added'

        await wrapper.vm.addBalance()

        expect(wrapper.emitted()[balanceAddedEvent]).to.exist

        wrapper.vm.loadAccountBalances.restore()
      })

      it('calls Bus.success method if operation was succeded', async () => {
        sinon.stub(wrapper.vm, 'loadAccountBalances').resolves()

        await wrapper.vm.addBalance()

        expect(Bus.success).to.have.been.calledOnce

        wrapper.vm.loadAccountBalances.restore()
      })

      it('handles the error if operation was failed', async () => {
        sinon.stub(wrapper.vm, 'loadAccountBalances').throws()

        await wrapper.vm.addBalance()

        expect(wrapper.vm.isPending).to.be.false
        expect(ErrorHandler.process).to.have.been.calledOnce

        wrapper.vm.loadAccountBalances.restore()
      })
    })
  })
})
