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
  let sandbox
  let wrapper

  beforeEach(() => {
    sandbox = sinon.createSandbox()
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

  afterEach(() => {
    sandbox.restore()
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
        sandbox.stub(wrapper.vm, 'touchField')

        wrapper.find(selector).vm.$emit('blur')

        expect(wrapper.vm.touchField).to.have.been.calledOnce

        wrapper.vm.touchField.restore()
      })
    }
  })

  describe('component', () => {
    describe('method', () => {
      describe('rejectRequest', () => {
        it('calls proper set of methods and emits proper event if request rejecting succeded', async () => {
          const request = new IncomingWithdrawalRequest({ id: '1' })
          wrapper.setProps({ request })
          wrapper.setData({ form: { rejectReason: 'Some reason' } })

          sandbox.stub(Bus, 'success')
          sandbox.stub(ErrorHandler, 'process')
          sandbox.stub(wrapper.vm, 'rejectWithdrawalRequest').resolves()

          await wrapper.vm.rejectRequest()

          expect(wrapper.vm.isRequestRejecting).to.be.true
          expect(wrapper.vm.rejectWithdrawalRequest)
            .to.have.been.calledOnceWithExactly({
              request,
              reason: 'Some reason',
            })

          expect(Bus.success).to.have.been.calledOnce
          expect(wrapper.emitted()['request-rejected']).to.exist
        })

        it('handles an error properly if it was thrown', async () => {
          sandbox.stub(wrapper.vm, 'rejectWithdrawalRequest').rejects()
          sandbox.stub(ErrorHandler, 'process')

          await wrapper.vm.rejectRequest()

          expect(ErrorHandler.process).to.have.been.calledOnce
          expect(wrapper.vm.isRequestRejecting).to.be.false
        })
      })
    })
  })
})
