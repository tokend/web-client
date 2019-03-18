import SaleCreationRequestActionsBar from './sale-creation-request-actions-bar'
import FormMixin from '@/vue/mixins/form.mixin'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { SaleCreationRequest } from '../wrappers/sale-creation-request'
import { REQUEST_STATES } from '@/js/const/request-states.const'

import Vuex from 'vuex'

import { saleCreationRequestsModule } from '../store/index'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Sale creation request actions bar', () => {
  let wrapper

  beforeEach(() => {
    const store = new Vuex.Store({
      modules: { 'sale-creation-requests': saleCreationRequestsModule },
    })

    wrapper = shallowMount(SaleCreationRequestActionsBar, {
      localVue,
      store,
      mixins: [FormMixin],
      propsData: { request: new SaleCreationRequest({}) },
    })
  })

  describe('computed property', () => {
    describe('canBeUpdated', () => {
      it('returns true for rejected request', () => {
        wrapper.setProps({
          request: new SaleCreationRequest({
            stateI: REQUEST_STATES.rejected,
          }),
        })

        expect(wrapper.vm.canBeUpdated).to.be.true
      })

      it('returns true for pending request', () => {
        wrapper.setProps({
          request: new SaleCreationRequest({
            stateI: REQUEST_STATES.pending,
          }),
        })

        expect(wrapper.vm.canBeUpdated).to.be.true
      })

      it('returns false for non-rejected and non-pending request', () => {
        wrapper.setProps({
          request: new SaleCreationRequest({
            stateI: 0,
          }),
        })

        expect(wrapper.vm.canBeUpdated).to.be.false
      })
    })

    describe('canBeCanceled', () => {
      it('returns true for pending request', () => {
        wrapper.setProps({
          request: new SaleCreationRequest({
            stateI: REQUEST_STATES.pending,
          }),
        })

        expect(wrapper.vm.canBeCanceled).to.be.true
      })

      it('returns false for non-pending request', () => {
        wrapper.setProps({
          request: new SaleCreationRequest({
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
        sinon.stub(wrapper.vm, 'cancelSaleCreationRequest').resolves()
      })

      afterEach(() => {
        wrapper.vm.hideConfirmation.restore()
        Bus.success.restore()
        ErrorHandler.process.restore()
        wrapper.vm.cancelSaleCreationRequest.restore()
      })

      it('calls hideConfirmation method', async () => {
        await wrapper.vm.cancelRequest()

        expect(wrapper.vm.hideConfirmation).to.have.been.calledOnce
      })

      it('sets isRequestCanceling property to true', async () => {
        await wrapper.vm.cancelRequest()

        expect(wrapper.vm.isRequestCanceling).to.be.true
      })

      it('calls cancelSaleCreationRequest method with correct request ID', async () => {
        wrapper.setProps({
          request: new SaleCreationRequest({ id: '1' }),
        })
        await wrapper.vm.cancelRequest()

        expect(wrapper.vm.cancelSaleCreationRequest)
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
        wrapper.vm.cancelSaleCreationRequest.restore()
        sinon.stub(wrapper.vm, 'cancelSaleCreationRequest').rejects()

        await wrapper.vm.cancelRequest()

        expect(ErrorHandler.process).to.have.been.calledOnce
      })

      it('sets isRequestCanceling to false if an error was thrown', async () => {
        wrapper.vm.cancelSaleCreationRequest.restore()
        sinon.stub(wrapper.vm, 'cancelSaleCreationRequest').rejects()

        await wrapper.vm.cancelRequest()

        expect(wrapper.vm.isRequestCanceling).to.be.false
      })
    })
  })
})
