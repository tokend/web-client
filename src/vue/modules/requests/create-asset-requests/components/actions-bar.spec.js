import ActionsBar from './actions-bar'
import FormMixin from '@/vue/mixins/form.mixin'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { CreateAssetRequest } from '../wrappers/create-asset-request'
import { REQUEST_STATES } from '@/js/const/request-states.const'

import Vuex from 'vuex'

import { createAssetRequestsModule } from '../store/index'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Asset creation request actions bar', () => {
  let wrapper

  beforeEach(() => {
    const store = new Vuex.Store({
      modules: { 'create-asset-requests': createAssetRequestsModule },
    })

    wrapper = shallowMount(ActionsBar, {
      localVue,
      store,
      mixins: [FormMixin],
      propsData: { request: new CreateAssetRequest({}) },
    })
  })

  describe('computed property', () => {
    describe('canBeUpdated', () => {
      it('returns true for rejected request', () => {
        wrapper.setProps({
          request: new CreateAssetRequest({
            stateI: REQUEST_STATES.rejected,
          }),
        })

        expect(wrapper.vm.canBeUpdated).to.be.true
      })

      it('returns true for pending request', () => {
        wrapper.setProps({
          request: new CreateAssetRequest({
            stateI: REQUEST_STATES.pending,
          }),
        })

        expect(wrapper.vm.canBeUpdated).to.be.true
      })

      it('returns false for approved request', () => {
        wrapper.setProps({
          request: new CreateAssetRequest({
            stateI: REQUEST_STATES.approved,
          }),
        })

        expect(wrapper.vm.canBeUpdated).to.be.false
      })
    })

    describe('canBeCanceled', () => {
      it('returns true for pending request', () => {
        wrapper.setProps({
          request: new CreateAssetRequest({
            stateI: REQUEST_STATES.pending,
          }),
        })

        expect(wrapper.vm.canBeCanceled).to.be.true
      })

      it('returns false for approved request', () => {
        wrapper.setProps({
          request: new CreateAssetRequest({
            stateI: REQUEST_STATES.approved,
          }),
        })

        expect(wrapper.vm.canBeCanceled).to.be.false
      })

      it('returns false for rejected request', () => {
        wrapper.setProps({
          request: new CreateAssetRequest({
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
        sinon.stub(wrapper.vm, 'cancelCreateAssetRequest').resolves()
      })

      afterEach(() => {
        wrapper.vm.hideConfirmation.restore()
        Bus.success.restore()
        ErrorHandler.process.restore()
        wrapper.vm.cancelCreateAssetRequest.restore()
      })

      it('calls hideConfirmation method', async () => {
        await wrapper.vm.cancelRequest()

        expect(wrapper.vm.hideConfirmation).to.have.been.calledOnce
      })

      it('sets isRequestCanceling property to true', async () => {
        await wrapper.vm.cancelRequest()

        expect(wrapper.vm.isRequestCanceling).to.be.true
      })

      it('calls cancelCreateAssetRequest method with correct request ID', async () => {
        wrapper.setProps({
          request: new CreateAssetRequest({ id: '1' }),
        })
        await wrapper.vm.cancelRequest()

        expect(wrapper.vm.cancelCreateAssetRequest)
          .to.have.been.calledOnceWithExactly('1')
      })

      it('calls Bus.success if cancelCreateAssetRequest did not throw an error', async () => {
        await wrapper.vm.cancelRequest()

        expect(Bus.success).to.have.been.calledOnce
      })

      it('emits cancel event cancelCreateAssetRequest did not throw an error', async () => {
        const cancelEvent = 'cancel'

        await wrapper.vm.cancelRequest()

        expect(wrapper.emitted()[cancelEvent]).to.exist
      })

      it('calls ErrorHandler.process if an error was thrown', async () => {
        wrapper.vm.cancelCreateAssetRequest.restore()
        sinon.stub(wrapper.vm, 'cancelCreateAssetRequest').rejects()

        await wrapper.vm.cancelRequest()

        expect(ErrorHandler.process).to.have.been.calledOnce
      })

      it('sets isRequestCanceling to false if an error was thrown', async () => {
        wrapper.vm.cancelCreateAssetRequest.restore()
        sinon.stub(wrapper.vm, 'cancelCreateAssetRequest').rejects()

        await wrapper.vm.cancelRequest()

        expect(wrapper.vm.isRequestCanceling).to.be.false
      })
    })
  })
})
