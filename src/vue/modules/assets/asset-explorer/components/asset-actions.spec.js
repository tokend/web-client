import AssetActions from './asset-actions'

import Vuex from 'vuex'

import { assetExplorerModule } from '../store/index'
import { Asset } from '../../shared/wrappers/asset'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Asset actions', () => {
  let sandbox
  let wrapper

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    wrapper = shallowMount(AssetActions, {
      store: new Vuex.Store({
        modules: { 'asset-explorer': assetExplorerModule },
      }),
      propsData: { asset: new Asset({}) },
      localVue,
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('method', () => {
    it('calls Bus.error if balance creation is not allowed', async () => {
      const kycRequiredAssetType = 'KYC_REQUIRED'
      wrapper.setProps({
        kycRequiredAssetType,
        asset: new Asset({
          type: kycRequiredAssetType,
        }),
        isAccountUnverified: true,
      })
      sandbox.stub(Bus, 'error')

      await wrapper.vm.addBalance()

      expect(Bus.error).to.have.been.calledOnce
    })

    it('creates new balance, reloads all of them, and emit proper event if balance creation was successfull', async () => {
      wrapper.setProps({
        asset: new Asset({ id: 'USD' }),
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
