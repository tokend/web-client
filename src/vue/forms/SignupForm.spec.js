import SignupForm from './SignupForm'

import Vue from 'vue'
import Vuelidate from 'vuelidate'

import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { TestHelper } from '@/test/test-helper'
import { MockHelper } from '@/test'
import { globalize } from '@/vue/filters/globalize'
import { errors } from '@tokend/js-sdk'
import { Bus } from '@/js/helpers/event-bus'

const localVue = createLocalVue()

localVue.use(Vuelidate)
localVue.filter('globalize', globalize)

// HACK: https://github.com/vuejs/vue-test-utils/issues/532, waiting for
// Vue 2.6 so everything get fixed
Vue.config.silent = true

describe('SignupForm component test', () => {
  afterEach(() => {
    sinon.restore()
  })

  describe('validation works correctly', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(SignupForm, { localVue })
    })

    const expectedResults = {
      email: ['required', 'email'],
      password: ['required', 'password'],
      confirmPassword: ['required', 'password', 'sameAsPassword'],
    }

    for (const [model, rules] of Object.entries(expectedResults)) {
      it(`${model} model is validating by proper set of rules`, () => {
        expect(Object.keys(wrapper.vm.$v.form[model].$params))
          .to
          .deep
          .equal(rules)
      })
    }

    const fieldBindings = {
      '#signup-email': 'email',
      '#signup-password': 'password',
      '#signup-confirm-password': 'confirmPassword',
    }

    for (const [selector, model] of Object.entries(fieldBindings)) {
      it(`$v.form.${model} is touched after blur event emitted on ${selector}`, () => {
        const spy = sinon.stub(wrapper.vm, 'touchField')

        wrapper
          .find(selector)
          .vm
          .$emit('blur')

        expect(spy.calledOnce)
          .to
          .be
          .true
      })
    }
  })

  describe('submit method', () => {
    let mockHelper
    let wrapper

    beforeEach(() => {
      mockHelper = new MockHelper()
      wrapper = shallowMount(SignupForm, {
        localVue,
        propsData: {
          submitEvent: 'submit-event',
        },
        data: _ => ({
          form: {
            email: 'alice@mail.com',
            password: 'qwe123',
            confirmPassword: 'qwe123',
          },
        }),
      })
    })

    it('loads kdf params for provided email', async () => {
      const resource = mockHelper.getApiResourcePrototype('wallets')
      sinon.stub(ErrorHandler, 'process')
      const spy = sinon.stub(resource, 'getKdfParams').resolves()

      await wrapper.vm.submit()

      expect(spy.withArgs('alice@mail.com').calledOnce)
        .to
        .be
        .true
    })

    it('emits the global error event if user exist', async () => {
      const resource = mockHelper.getApiResourcePrototype('wallets')
      sinon.stub(resource, 'getKdfParams').resolves()
      sinon.stub(ErrorHandler, 'processWithoutFeedback')
      const spy = sinon.stub(Bus, 'error')

      await wrapper.vm.submit()

      expect(spy.calledOnce).to.be.true
      expect(wrapper.emitted()['submit-event']).to.not.exist
    })

    it('properly emits the submitted event if user doesn\'t exist', async () => {
      const resource = mockHelper.getApiResourcePrototype('wallets')
      const form = {
        email: 'foo@bar.com',
        password: 'Nwr2mW21m',
        confirmPassword: 'Nwr2mW21m',
      }

      wrapper.setData({ form })

      sinon.stub(ErrorHandler, 'process')
      sinon.stub(resource, 'getKdfParams')
        .throws(TestHelper.getError(errors.NotFoundError))

      await wrapper.vm.submit()

      expect(wrapper.emitted()['submit-event']).to.exist
      expect(wrapper.emitted()['submit-event'].length).to.equal(1)
      expect(wrapper.emitted()['submit-event'][0]).to.deep.equal([form])
    })
  })
})
