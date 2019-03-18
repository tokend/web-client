import AssetCreationRequestActionsBar from './asset-creation-request-actions-bar'
import FormMixin from '@/vue/mixins/form.mixin'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { AssetCreationRequest } from '../wrappers/asset-creation-request'
import { REQUEST_STATES } from '@/js/const/request-states.const'

import Vuex from 'vuex'

import { assetCreationRequestsModule } from '../store/index'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Asset creation request actions bar', () => {
  let wrapper

  beforeEach(() => {
    const store = new Vuex.Store({
      modules: { 'asset-creation-requests': assetCreationRequestsModule },
    })

    wrapper = shallowMount(AssetCreationRequestActionsBar, {
      localVue,
      store,
      mixins: [FormMixin],
      propsData: { request: new AssetCreationRequest({}) },
    })
  })

  describe('computed property', () => {
    describe('canBeUpdated', () => {
      it('returns true for rejected request', () => {
        wrapper.setProps({
          request: new AssetCreationRequest({
            stateI: REQUEST_STATES.rejected,
          }),
        })

        expect(wrapper.vm.canBeUpdated).to.be.true
      })

      it('returns true for pending request', () => {
        wrapper.setProps({
          request: new AssetCreationRequest({
            stateI: REQUEST_STATES.pending,
          }),
        })

        expect(wrapper.vm.canBeUpdated).to.be.true
      })

      it('returns false for non-rejected and non-pending request', () => {
        wrapper.setProps({
          request: new AssetCreationRequest({
            stateI: 0,
          }),
        })

        expect(wrapper.vm.canBeUpdated).to.be.false
      })
    })

    describe('canBeCanceled', () => {
      it('returns true for pending request', () => {
        wrapper.setProps({
          request: new AssetCreationRequest({
            stateI: REQUEST_STATES.pending,
          }),
        })

        expect(wrapper.vm.canBeCanceled).to.be.true
      })

      it('returns false for non-pending request', () => {
        wrapper.setProps({
          request: new AssetCreationRequest({
            stateI: 0,
          }),
        })

        expect(wrapper.vm.canBeCanceled).to.be.false
      })
    })
  })

  describe('methods', () => {
    describe('cancelRequest', () => {
      beforeEach(() => {
        sinon.stub(wrapper.vm, 'hideConfirmation')
        sinon.stub(Bus, 'success')
        sinon.stub(ErrorHandler, 'process')
        sinon.stub(wrapper.vm, 'cancelAssetCreationRequest').resolves()
      })

      afterEach(() => {
        wrapper.vm.hideConfirmation.restore()
        Bus.success.restore()
        ErrorHandler.process.restore()
        wrapper.vm.cancelAssetCreationRequest.restore()
      })

      it('calls hideConfirmation method', async () => {
        await wrapper.vm.cancelRequest()

        expect(wrapper.vm.hideConfirmation).to.have.been.calledOnce
      })

      it('sets isRequestCanceling property to true', async () => {
        await wrapper.vm.cancelRequest()

        expect(wrapper.vm.isRequestCanceling).to.be.true
      })

      it('calls cancelAssetCreationRequest method with correct request ID', async () => {
        wrapper.setProps({
          request: new AssetCreationRequest({ id: '1' }),
        })
        await wrapper.vm.cancelRequest()

        expect(wrapper.vm.cancelAssetCreationRequest)
          .to.have.been.calledOnceWithExactly('1')
      })

      it('calls Bus.success if the request was canceled', async () => {
        await wrapper.vm.cancelRequest()

        expect(Bus.success).to.have.been.calledOnce
      })

      it('emits cancel event if the request was canceled', async () => {
        const cancelEvent = 'cancel'

        await wrapper.vm.cancelRequest()

        expect(wrapper.emitted()[cancelEvent]).to.exist
      })

      it('calls ErrorHandler.process if an error was thrown', async () => {
        wrapper.vm.cancelAssetCreationRequest.restore()
        sinon.stub(wrapper.vm, 'cancelAssetCreationRequest').rejects()

        await wrapper.vm.cancelRequest()

        expect(ErrorHandler.process).to.have.been.calledOnce
      })

      it('sets isRequestCanceling to false if an error was thrown', async () => {
        wrapper.vm.cancelAssetCreationRequest.restore()
        sinon.stub(wrapper.vm, 'cancelAssetCreationRequest').rejects()

        await wrapper.vm.cancelRequest()

        expect(wrapper.vm.isRequestCanceling).to.be.false
      })
    })
  })
})
