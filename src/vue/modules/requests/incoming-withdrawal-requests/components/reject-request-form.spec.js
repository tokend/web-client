import RejectRequestForm from './reject-request-form'

import Vuex from 'vuex'
import Vuelidate from 'vuelidate'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { Bus } from '@/js/helpers/event-bus'

import { incomingWithdrawalRequestsModule } from '../store/index'
import { IncomingWithdrawalRequest } from '../wrappers/incoming-withdrawal-request'

import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.use(Vuelidate)
localVue.use(Vuex)

describe('Reject incoming withdrawal request form', () => {
  let wrapper

  beforeEach(() => {
    const store = new Vuex.Store({
      modules: {
        'incoming-withdrawal-requests': incomingWithdrawalRequestsModule,
      },
    })

    wrapper = shallowMount(RejectRequestForm, {
      localVue,
      store,
    })
  })

  describe('validation rules assigned correctly', () => {
    const expectedResults = {
      rejectReason: ['required', 'maxLength'],
    }

    for (const [model, rules] of Object.entries(expectedResults)) {
      it(`${model} model is validating by proper set of rules`, () => {
        expect(Object.keys(wrapper.vm.$v.form[model].$params))
          .to.deep.equal(rules)
      })
    }

    const fieldBindings = {
      '#withdrawal-request-reject-reason': 'rejectReason',
    }

    for (const [selector, model] of Object.entries(fieldBindings)) {
      it(`$v.form.${model} is touched after blur event emitted on ${selector}`, () => {
        sinon.stub(wrapper.vm, 'touchField')

        wrapper.find(selector).vm.$emit('blur')

        expect(wrapper.vm.touchField).to.have.been.calledOnce

        wrapper.vm.touchField.restore()
      })
    }
  })

  describe('component', () => {
    describe('method', () => {
      beforeEach(() => {
        sinon.stub(Bus, 'success')
        sinon.stub(ErrorHandler, 'process')
        sinon.stub(wrapper.vm, 'rejectWithdrawalRequest').resolves()
      })

      afterEach(() => {
        Bus.success.restore()
        ErrorHandler.process.restore()
        wrapper.vm.rejectWithdrawalRequest.restore()
      })

      it('sets isRequestRejecting property to true', async () => {
        await wrapper.vm.rejectRequest()

        expect(wrapper.vm.isRequestRejecting).to.be.true
      })

      it('calls rejectWithdrawalRequest method with correct params', async () => {
        const request = new IncomingWithdrawalRequest({ id: '1' })
        wrapper.setProps({ request })
        wrapper.setData({ form: { rejectReason: 'Some reason' } })

        await wrapper.vm.rejectRequest()

        expect(wrapper.vm.rejectWithdrawalRequest)
          .to.have.been.calledOnceWithExactly({
            request,
            reason: 'Some reason',
          })
      })

      it('calls Bus.success if rejectWithdrawalRequest did not throw an error', async () => {
        await wrapper.vm.rejectRequest()

        expect(Bus.success).to.have.been.calledOnce
      })

      it('emits reject event if rejectWithdrawalRequest did not throw an error', async () => {
        const rejectedEvent = 'request-rejected'

        await wrapper.vm.rejectRequest()

        expect(wrapper.emitted()[rejectedEvent]).to.exist
      })

      it('calls ErrorHandler.process if an error was thrown', async () => {
        wrapper.vm.rejectWithdrawalRequest.restore()
        sinon.stub(wrapper.vm, 'rejectWithdrawalRequest').rejects()

        await wrapper.vm.rejectRequest()

        expect(ErrorHandler.process).to.have.been.calledOnce
      })

      it('sets isRequestRejecting to false if an error was thrown', async () => {
        wrapper.vm.rejectWithdrawalRequest.restore()
        sinon.stub(wrapper.vm, 'rejectWithdrawalRequest').rejects()

        await wrapper.vm.rejectRequest()

        expect(wrapper.vm.isRequestRejecting).to.be.false
      })
    })
  })
})
