import AssetUpdateRequestActionsBar from './asset-update-request-actions-bar'
import FormMixin from '@/vue/mixins/form.mixin'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { AssetUpdateRequest } from '../wrappers/asset-update-request'
import { REQUEST_STATES } from '@/js/const/request-states.const'

import Vuex from 'vuex'

import { assetUpdateRequestsModule } from '../store/index'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Asset update request actions bar', () => {
  let wrapper

  beforeEach(() => {
    const store = new Vuex.Store({
      modules: { 'asset-update-requests': assetUpdateRequestsModule },
    })

    wrapper = shallowMount(AssetUpdateRequestActionsBar, {
      localVue,
      store,
      mixins: [FormMixin],
      propsData: { request: new AssetUpdateRequest({}) },
    })
  })

  describe('computed property', () => {
    describe('canBeUpdated', () => {
      it('returns true for rejected request', () => {
        wrapper.setProps({
          request: new AssetUpdateRequest({
            stateI: REQUEST_STATES.rejected,
          }),
        })

        expect(wrapper.vm.canBeUpdated).to.be.true
      })

      it('returns true for pending request', () => {
        wrapper.setProps({
          request: new AssetUpdateRequest({
            stateI: REQUEST_STATES.pending,
          }),
        })

        expect(wrapper.vm.canBeUpdated).to.be.true
      })

      it('returns false for non-rejected and non-pending request', () => {
        wrapper.setProps({
          request: new AssetUpdateRequest({
            stateI: 0,
          }),
        })

        expect(wrapper.vm.canBeUpdated).to.be.false
      })
    })

    describe('canBeCanceled', () => {
      it('returns true for pending request', () => {
        wrapper.setProps({
          request: new AssetUpdateRequest({
            stateI: REQUEST_STATES.pending,
          }),
        })

        expect(wrapper.vm.canBeCanceled).to.be.true
      })

      it('returns false for non-pending request', () => {
        wrapper.setProps({
          request: new AssetUpdateRequest({
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
        sinon.stub(wrapper.vm, 'cancelAssetUpdateRequest').resolves()
      })

      afterEach(() => {
        wrapper.vm.hideConfirmation.restore()
        Bus.success.restore()
        ErrorHandler.process.restore()
        wrapper.vm.cancelAssetUpdateRequest.restore()
      })

      it('calls hideConfirmation method', async () => {
        await wrapper.vm.cancelRequest()

        expect(wrapper.vm.hideConfirmation).to.have.been.calledOnce
      })

      it('sets isRequestCanceling property to true', async () => {
        await wrapper.vm.cancelRequest()

        expect(wrapper.vm.isRequestCanceling).to.be.true
      })

      it('calls cancelAssetUpdateRequest method with correct request ID', async () => {
        wrapper.setProps({
          request: new AssetUpdateRequest({ id: '1' }),
        })
        await wrapper.vm.cancelRequest()

        expect(wrapper.vm.cancelAssetUpdateRequest)
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
        wrapper.vm.cancelAssetUpdateRequest.restore()
        sinon.stub(wrapper.vm, 'cancelAssetUpdateRequest').rejects()

        await wrapper.vm.cancelRequest()

        expect(ErrorHandler.process).to.have.been.calledOnce
      })

      it('sets isRequestCanceling to false if an error was thrown', async () => {
        wrapper.vm.cancelAssetUpdateRequest.restore()
        sinon.stub(wrapper.vm, 'cancelAssetUpdateRequest').rejects()

        await wrapper.vm.cancelRequest()

        expect(wrapper.vm.isRequestCanceling).to.be.false
      })
    })
  })
})
