import RecoveryForm from './RecoveryForm'

import Vue from 'vue'
import Vuelidate from 'vuelidate'
import VueRouter from 'vue-router'

import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import { globalize } from '@/vue/filters/globalize'
import { vueRoutes } from '@/vue-router/routes'

import { Api } from '@/api'

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
      recoverySeed: ['required', 'seed'],
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
      '[name=recovery-email]': 'email',
      '[name=recovery-password]': 'password',
      '[name=recovery-confirm-password]': 'confirmPassword',
      '[name=recovery-seed]': 'recoverySeed',
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
      Api.initSync({ horizonURL: 'https://test.api.com' })

      const router = new VueRouter({
        mode: 'history',
        routes: [{
          name: vueRoutes.login.name,
          path: '/foo',
        }],
      })

      wrapper = shallowMount(RecoveryForm, {
        localVue,
        router,
      })
    })

    it('calls SDK wallets.recovery with proper set of params and logs in the user', async () => {
      const recoveryStub = sinon.stub(Api.walletsManager, 'recovery').resolves()
      const loginStub = sinon.stub(wrapper.vm, 'login').resolves()

      const form = {
        email: 'alice@mail.com',
        password: 'qwe123',
        confirmPassword: 'qwe123',
        recoverySeed: 'SDE44JILVL2YU5VXESXRT4ZZYN7U2DHOZTMMIOMVEVIGL5BATGCYZD7Q',
      }

      wrapper.setData({ form })

      await wrapper.vm.submit()

      expect(recoveryStub).to.have.been.calledOnceWithExactly(
        form.email,
        form.recoverySeed,
        form.password
      )
      expect(loginStub).to.have.been.calledOnce
    })

    // TODO: add login method test
  })
})
