import SignupForm from './SignupForm'

import Vue from 'vue'
import Vuelidate from 'vuelidate'

import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { TestHelper } from '@/test/test-helper'
import { walletsManager } from '@/api'
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
      email: ['required', 'email', 'maxLength'],
      password: ['required', 'password', 'maxLength'],
      confirmPassword: ['required', 'password', 'maxLength', 'sameAsPassword'],
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
      '[name=signup-email]': 'email',
      '[name=signup-password]': 'password',
      '[name=signup-confirm-password]': 'confirmPassword',
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
    let wrapper

    beforeEach(() => {
      wrapper = shallowMount(SignupForm, {
        localVue,
        propsData: {
          submitEvent: 'submit',
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
      sinon.stub(ErrorHandler, 'process')
      const spy = sinon.stub(walletsManager, 'getKdfParams').resolves()

      await wrapper.vm.submit()

      expect(spy.withArgs('alice@mail.com').calledOnce)
        .to
        .be
        .true
    })

    it('emits the global error event if user exist', async () => {
      sinon.stub(walletsManager, 'getKdfParams').resolves()
      sinon.stub(ErrorHandler, 'processWithoutFeedback')
      const spy = sinon.stub(Bus, 'error')

      await wrapper.vm.submit()

      expect(spy.calledOnce).to.be.true
      expect(wrapper.emitted()['submit']).to.not.exist
    })

    it('properly emits the submitted event if user doesn\'t exist', async () => {
      const form = {
        email: 'foo@bar.com',
        password: 'Nwr2mW21m',
        confirmPassword: 'Nwr2mW21m',
      }

      wrapper.setData({ form })

      sinon.stub(ErrorHandler, 'process')
      sinon.stub(walletsManager, 'getKdfParams')
        .throws(TestHelper.getError(errors.NotFoundError))

      await wrapper.vm.submit()

      expect(wrapper.emitted()['submit']).to.exist
      expect(wrapper.emitted()['submit'].length).to.equal(1)
      expect(wrapper.emitted()['submit'][0]).to.deep.equal([form])
    })
  })
})
