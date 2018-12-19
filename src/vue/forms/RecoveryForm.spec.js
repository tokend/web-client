import RecoveryForm from './RecoveryForm'

import Vue from 'vue'
import Vuelidate from 'vuelidate'
import VueRouter from 'vue-router'

import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import { MockHelper } from '@/test'
import { globalize } from '@/vue/filters/globalize'

const localVue = createLocalVue()

localVue.use(Vuelidate)
localVue.use(VueRouter)
localVue.filter('globalize', globalize)

// HACK: https://github.com/vuejs/vue-test-utils/issues/532, waiting for
// Vue 2.6 so everything get fixed
Vue.config.silent = true

describe('RecoveryForm component test', () => {
  afterEach(() => {
    sinon.restore()
  })

  describe('validation rules assigned correctly', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(RecoveryForm, { localVue })
    })

    const expectedResults = {
      email: ['required', 'email'],
      password: ['required', 'password'],
      confirmPassword: ['required', 'password', 'sameAsPassword'],
      recoverySeed: ['required', 'seed']
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
      '#recovery-email': 'email',
      '#recovery-password': 'password',
      '#recovery-confirm-password': 'confirmPassword',
      '#recovery-seed': 'recoverySeed'
    }

    for (const [selector, model] of Object.entries(fieldBindings)) {
      it(`$v.form.${model} is touched after blur event emitted on ${selector}`, () => {
        const spy = sinon.stub(wrapper.vm, '_touchField')

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
      wrapper = shallowMount(RecoveryForm, {
        localVue
      })
    })

    it('calls SDK wallets.recovery with proper set of params', async () => {
      const resource = mockHelper.getApiResourcePrototype('wallets')
      const spy = sinon.stub(resource, 'recovery').resolves()

      const form = {
        email: 'alice@mail.com',
        password: 'qwe123',
        confirmPassword: 'qwe123',
        recoverySeed: 'SDE44JILVL2YU5VXESXRT4ZZYN7U2DHOZTMMIOMVEVIGL5BATGCYZD7Q'
      }

      wrapper.setData({ form })

      await wrapper.vm.submit()

      expect(spy.withArgs(
        form.email,
        form.recoverySeed,
        form.password
      ).calledOnce)
        .to
        .be
        .true
    })
  })
})
