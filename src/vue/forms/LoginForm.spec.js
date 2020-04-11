import LoginForm from './LoginForm'

import Vuelidate from 'vuelidate'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Vue from 'vue'

import { vuexTypes } from '@/vuex'
import { vueRoutes } from '@/vue-router/routes'
import { createLocalVue, shallowMount, mount } from '@vue/test-utils'
import { globalize } from '@/vue/filters/globalize'

import walletModule from '@/vuex/wallet.module'
import accountModule from '@/vuex/account.module'
import kycModule from '@/vuex/kyc.module'
import { rootModule } from '@/vuex/index'

// HACK: https://github.com/vuejs/vue-test-utils/issues/532, waiting for
// Vue 2.6 so everything get fixed
Vue.config.silent = true

const localVue = createLocalVue()
localVue.use(Vuelidate)
localVue.use(VueRouter)
localVue.use(Vuex)
localVue.filter('globalize', globalize)

describe('LoginForm component unit test', () => {
  afterEach(() => {
    sinon.restore()
  })

  describe('validation rules assigned correctly', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(LoginForm, { localVue })
    })

    const expectedResults = {
      email: ['required', 'email', 'maxLength'],
      password: ['required', 'maxLength'],
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
      '[name=login-email]': 'email',
      '[name=login-password]': 'password',
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

  describe('methods', () => {
    let wrapper

    let spyLoadWallet

    beforeEach(() => {
      const actions = {
        ...walletModule.actions,
        ...accountModule.actions,
        ...kycModule.actions,
        ...rootModule.actions,
      }
      const getters = walletModule.getters

      spyLoadWallet = sinon.stub(actions, vuexTypes.LOG_IN).resolves()
      sinon.stub(actions, vuexTypes.LOAD_WALLET).resolves()
      sinon.stub(actions, vuexTypes.LOAD_ACCOUNT).resolves()
      sinon.stub(actions, vuexTypes.LOAD_KYC).resolves()
      sinon.stub(getters, vuexTypes.walletAccountId).returns('SOME_ACCOUNT_ID')
      sinon.stub(getters, vuexTypes.walletEmail).returns('SOME_EMAIL')

      const store = new Vuex.Store({
        actions,
        getters,
      })

      const router = new VueRouter({
        mode: 'history',
        routes: [{
          name: vueRoutes.app.name,
          path: '/foo',
        }],
      })

      wrapper = shallowMount(LoginForm, {
        store,
        router,
        localVue,
      })
      sinon.stub(wrapper.vm, 'isFormValid').returns(true)
    })

    it('submit() loads wallet with provided credentials', async () => {
      const email = 'alice@mail.com'
      const password = 'qwe123'

      wrapper.setData({
        form: { email, password },
      })

      await wrapper.vm.submit()

      expect(spyLoadWallet
        .withArgs(sinon.match.any, { email, password })
        .calledOnce
      )
        .to
        .be
        .true
    })
  })
})
