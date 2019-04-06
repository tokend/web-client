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
  let sandbox
  let wrapper

  beforeEach(() => {
    sandbox = sinon.createSandbox()
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

  afterEach(() => {
    sandbox.restore()
  })

  describe('computed property', () => {
    describe('canBeReviewed', () => {
      it('returns true only for pending request', () => {
        wrapper.setProps({
          request: new IncomingWithdrawalRequest({
            stateI: REQUEST_STATES.pending,
          }),
        })
        expect(wrapper.vm.canBeReviewed).to.be.true

        wrapper.setProps({
          request: new IncomingWithdrawalRequest({
            stateI: REQUEST_STATES.approved,
          }),
        })
        expect(wrapper.vm.canBeReviewed).to.be.false

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
      it('calls proper set of methods and emits proper event if request approval succeded', async () => {
        const request = new IncomingWithdrawalRequest({ id: '1' })
        wrapper.setProps({ request })

        sandbox.stub(Bus, 'success')
        sandbox.stub(ErrorHandler, 'process')
        sandbox.stub(wrapper.vm, 'approveWithdrawalRequest').resolves()

        await wrapper.vm.approveRequest()

        expect(wrapper.vm.isRequestApproving).to.be.true
        expect(wrapper.vm.approveWithdrawalRequest)
          .to.have.been.calledOnceWithExactly(request)
        expect(Bus.success).to.have.been.calledOnce
        expect(wrapper.emitted()['request-updated']).to.exist
      })

      it('handles an error properly if it was thrown', async () => {
        sandbox.stub(wrapper.vm, 'approveWithdrawalRequest').rejects()
        sandbox.stub(ErrorHandler, 'process')

        await wrapper.vm.approveRequest()

        expect(ErrorHandler.process).to.have.been.calledOnce
        expect(wrapper.vm.isRequestApproving).to.be.false
      })
    })
  })
})
