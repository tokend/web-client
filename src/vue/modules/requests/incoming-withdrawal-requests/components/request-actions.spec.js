import RequestActions from './request-actions'
import FormMixin from '@/vue/mixins/form.mixin'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { IncomingWithdrawalRequest } from '../wrappers/incoming-withdrawal-request'
import { REQUEST_STATES } from '@/js/const/request-states.const'

import Vuex from 'vuex'

import { incomingWithdrawalRequestsModule } from '../store/index'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Incoming withdrawal request actions', () => {
  let wrapper

  beforeEach(() => {
    const store = new Vuex.Store({
      modules: {
        'incoming-withdrawal-requests': incomingWithdrawalRequestsModule,
      },
    })

    wrapper = shallowMount(RequestActions, {
      localVue,
      store,
      mixins: [FormMixin],
      propsData: { request: new IncomingWithdrawalRequest({}) },
    })
  })

  describe('computed property', () => {
    describe('canBeReviewed', () => {
      it('returns true for pending request', () => {
        wrapper.setProps({
          request: new IncomingWithdrawalRequest({
            stateI: REQUEST_STATES.pending,
          }),
        })

        expect(wrapper.vm.canBeReviewed).to.be.true
      })

      it('returns false for approved request', () => {
        wrapper.setProps({
          request: new IncomingWithdrawalRequest({
            stateI: REQUEST_STATES.approved,
          }),
        })

        expect(wrapper.vm.canBeReviewed).to.be.false
      })

      it('returns false for permanently rejected request', () => {
        wrapper.setProps({
          request: new IncomingWithdrawalRequest({
            stateI: REQUEST_STATES.permanentlyRejected,
          }),
        })

        expect(wrapper.vm.canBeReviewed).to.be.false
      })
    })
  })

  describe('methods', () => {
    describe('approveRequest', () => {
      beforeEach(() => {
        sinon.stub(Bus, 'success')
        sinon.stub(ErrorHandler, 'process')
        sinon.stub(wrapper.vm, 'approveWithdrawalRequest').resolves()
      })

      afterEach(() => {
        Bus.success.restore()
        ErrorHandler.process.restore()
        wrapper.vm.approveWithdrawalRequest.restore()
      })

      it('sets isRequestApproving property to true', async () => {
        await wrapper.vm.approveRequest()

        expect(wrapper.vm.isRequestApproving).to.be.true
      })

      it('calls approveWithdrawalRequest method with correct withdrawal request instance', async () => {
        const request = new IncomingWithdrawalRequest({ id: '1' })
        wrapper.setProps({ request })
        await wrapper.vm.approveRequest()

        expect(wrapper.vm.approveWithdrawalRequest)
          .to.have.been.calledOnceWithExactly(request)
      })

      it('calls Bus.success if approveWithdrawalRequest did not throw an error', async () => {
        await wrapper.vm.approveRequest()

        expect(Bus.success).to.have.been.calledOnce
      })

      it('emits cancel event approveWithdrawalRequest did not throw an error', async () => {
        const updatedEvent = 'request-updated'

        await wrapper.vm.approveRequest()

        expect(wrapper.emitted()[updatedEvent]).to.exist
      })

      it('calls ErrorHandler.process if an error was thrown', async () => {
        wrapper.vm.approveWithdrawalRequest.restore()
        sinon.stub(wrapper.vm, 'approveWithdrawalRequest').rejects()

        await wrapper.vm.approveRequest()

        expect(ErrorHandler.process).to.have.been.calledOnce
      })

      it('sets isRequestApproving to false if an error was thrown', async () => {
        wrapper.vm.approveWithdrawalRequest.restore()
        sinon.stub(wrapper.vm, 'approveWithdrawalRequest').rejects()

        await wrapper.vm.approveRequest()

        expect(wrapper.vm.isRequestApproving).to.be.false
      })
    })
  })
})
