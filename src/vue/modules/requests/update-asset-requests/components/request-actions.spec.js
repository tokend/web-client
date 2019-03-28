import RequestActions from './request-actions'
import FormMixin from '@/vue/mixins/form.mixin'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { UpdateAssetRequest } from '../wrappers/update-asset-request'
import { REQUEST_STATES } from '@/js/const/request-states.const'

import Vuex from 'vuex'

import { updateAssetRequestsModule } from '../store/index'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Update asset request actions', () => {
  let wrapper

  beforeEach(() => {
    const store = new Vuex.Store({
      modules: { 'update-asset-requests': updateAssetRequestsModule },
    })

    wrapper = shallowMount(RequestActions, {
      localVue,
      store,
      mixins: [FormMixin],
      propsData: { request: new UpdateAssetRequest({}) },
    })
  })

  describe('computed property', () => {
    describe('canBeUpdated', () => {
      it('returns true for rejected request', () => {
        wrapper.setProps({
          request: new UpdateAssetRequest({
            stateI: REQUEST_STATES.rejected,
          }),
        })

        expect(wrapper.vm.canBeUpdated).to.be.true
      })

      it('returns true for pending request', () => {
        wrapper.setProps({
          request: new UpdateAssetRequest({
            stateI: REQUEST_STATES.pending,
          }),
        })

        expect(wrapper.vm.canBeUpdated).to.be.true
      })

      it('returns false for approved request', () => {
        wrapper.setProps({
          request: new UpdateAssetRequest({
            stateI: REQUEST_STATES.approved,
          }),
        })

        expect(wrapper.vm.canBeUpdated).to.be.false
      })
    })

    describe('canBeCanceled', () => {
      it('returns true for pending request', () => {
        wrapper.setProps({
          request: new UpdateAssetRequest({
            stateI: REQUEST_STATES.pending,
          }),
        })

        expect(wrapper.vm.canBeCanceled).to.be.true
      })

      it('returns false for approved request', () => {
        wrapper.setProps({
          request: new UpdateAssetRequest({
            stateI: REQUEST_STATES.approved,
          }),
        })

        expect(wrapper.vm.canBeCanceled).to.be.false
      })

      it('returns false for rejected request', () => {
        wrapper.setProps({
          request: new UpdateAssetRequest({
            stateI: REQUEST_STATES.rejected,
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
        sinon.stub(wrapper.vm, 'cancelUpdateAssetRequest').resolves()
      })

      afterEach(() => {
        wrapper.vm.hideConfirmation.restore()
        Bus.success.restore()
        ErrorHandler.process.restore()
        wrapper.vm.cancelUpdateAssetRequest.restore()
      })

      it('calls hideConfirmation method', async () => {
        await wrapper.vm.cancelRequest()

        expect(wrapper.vm.hideConfirmation).to.have.been.calledOnce
      })

      it('sets isRequestCanceling property to true', async () => {
        await wrapper.vm.cancelRequest()

        expect(wrapper.vm.isRequestCanceling).to.be.true
      })

      it('calls cancelUpdateAssetRequest method with correct request ID', async () => {
        wrapper.setProps({
          request: new UpdateAssetRequest({ id: '1' }),
        })
        await wrapper.vm.cancelRequest()

        expect(wrapper.vm.cancelUpdateAssetRequest)
          .to.have.been.calledOnceWithExactly('1')
      })

      it('calls Bus.success if cancelUpdateAssetRequest did not throw an error', async () => {
        await wrapper.vm.cancelRequest()

        expect(Bus.success).to.have.been.calledOnce
      })

      it('emits cancel event cancelUpdateAssetRequest did not throw an error', async () => {
        const cancelEvent = 'cancel'

        await wrapper.vm.cancelRequest()

        expect(wrapper.emitted()[cancelEvent]).to.exist
      })

      it('calls ErrorHandler.process if an error was thrown', async () => {
        wrapper.vm.cancelUpdateAssetRequest.restore()
        sinon.stub(wrapper.vm, 'cancelUpdateAssetRequest').rejects()

        await wrapper.vm.cancelRequest()

        expect(ErrorHandler.process).to.have.been.calledOnce
      })

      it('sets isRequestCanceling to false if an error was thrown', async () => {
        wrapper.vm.cancelUpdateAssetRequest.restore()
        sinon.stub(wrapper.vm, 'cancelUpdateAssetRequest').rejects()

        await wrapper.vm.cancelRequest()

        expect(wrapper.vm.isRequestCanceling).to.be.false
      })
    })
  })
})
