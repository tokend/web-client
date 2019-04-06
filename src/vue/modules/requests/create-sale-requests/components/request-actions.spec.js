import RequestActions from './request-actions'
import FormMixin from '@/vue/mixins/form.mixin'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { CreateSaleRequest } from '../wrappers/create-sale-request'
import { REQUEST_STATES } from '@/js/const/request-states.const'

import Vuex from 'vuex'

import { createSaleRequestsModule } from '../store/index'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Create sale request actions', () => {
  let sandbox
  let wrapper

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    const store = new Vuex.Store({
      modules: { 'create-sale-requests': createSaleRequestsModule },
    })

    wrapper = shallowMount(RequestActions, {
      localVue,
      store,
      mixins: [FormMixin],
      propsData: { request: new CreateSaleRequest({}) },
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('computed property', () => {
    describe('canBeUpdated', () => {
      it('returns true only for rejected and pending requests', () => {
        wrapper.setProps({
          request: new CreateSaleRequest({ stateI: REQUEST_STATES.rejected }),
        })
        expect(wrapper.vm.canBeUpdated).to.be.true

        wrapper.setProps({
          request: new CreateSaleRequest({ stateI: REQUEST_STATES.pending }),
        })
        expect(wrapper.vm.canBeUpdated).to.be.true

        wrapper.setProps({
          request: new CreateSaleRequest({ stateI: REQUEST_STATES.approved }),
        })
        expect(wrapper.vm.canBeUpdated).to.be.false

        wrapper.setProps({
          request: new CreateSaleRequest({ stateI: REQUEST_STATES.canceled }),
        })
        expect(wrapper.vm.canBeUpdated).to.be.false

        wrapper.setProps({
          request: new CreateSaleRequest({
            stateI: REQUEST_STATES.permanentlyRejected,
          }),
        })
        expect(wrapper.vm.canBeUpdated).to.be.false
      })
    })

    describe('canBeCanceled', () => {
      it('returns true only for pending request', () => {
        wrapper.setProps({
          request: new CreateSaleRequest({ stateI: REQUEST_STATES.pending }),
        })
        expect(wrapper.vm.canBeCanceled).to.be.true

        wrapper.setProps({
          request: new CreateSaleRequest({ stateI: REQUEST_STATES.rejected }),
        })
        expect(wrapper.vm.canBeCanceled).to.be.false

        wrapper.setProps({
          request: new CreateSaleRequest({ stateI: REQUEST_STATES.approved }),
        })
        expect(wrapper.vm.canBeCanceled).to.be.false

        wrapper.setProps({
          request: new CreateSaleRequest({ stateI: REQUEST_STATES.canceled }),
        })
        expect(wrapper.vm.canBeCanceled).to.be.false

        wrapper.setProps({
          request: new CreateSaleRequest({
            stateI: REQUEST_STATES.permanentlyRejected,
          }),
        })
        expect(wrapper.vm.canBeCanceled).to.be.false
      })
    })
  })

  describe('methods', () => {
    describe('cancelRequest', () => {
      it('calls proper set of methods and emits proper event if request cancellation succeded', async () => {
        wrapper.setProps({
          request: new CreateSaleRequest({ id: '1' }),
        })
        sandbox.stub(wrapper.vm, 'hideConfirmation')
        sandbox.stub(wrapper.vm, 'cancelCreateSaleRequest').resolves()
        sandbox.stub(Bus, 'success')

        await wrapper.vm.cancelRequest()

        expect(wrapper.vm.hideConfirmation).to.have.been.calledOnce
        expect(wrapper.vm.isRequestCanceling).to.be.true

        expect(wrapper.vm.cancelCreateSaleRequest)
          .to.have.been.calledOnceWithExactly('1')

        expect(Bus.success).to.have.been.calledOnce
        expect(wrapper.emitted()['cancel']).to.exist
      })

      it('calls ErrorHandler.process and sets isRequestCanceling to false if an error was thrown', async () => {
        sandbox.stub(wrapper.vm, 'cancelCreateSaleRequest').rejects()
        sandbox.stub(ErrorHandler, 'process')

        await wrapper.vm.cancelRequest()

        expect(ErrorHandler.process).to.have.been.calledOnce
        expect(wrapper.vm.isRequestCanceling).to.be.false
      })
    })
  })
})
