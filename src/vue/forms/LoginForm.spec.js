import LoginForm from './LoginForm'
// import walletModule from '@/vuex/wallet.module'

import Vuelidate from 'vuelidate'
import Vuex from 'vuex'
import Vue from 'vue'

import { vuexTypes } from '@/vuex'
import { errors } from '@tokend/js-sdk'
import { createLocalVue, shallowMount, mount } from '@vue/test-utils'
import { globalize } from '@/vue/filters/globalize'

import walletModule from '@/vuex/wallet.module'

import { MockHelper } from '@/test'
import { TestHelper } from '@/test/test-helper'

// HACK: https://github.com/vuejs/vue-test-utils/issues/532, waiting for
// Vue 2.6 so everything get fixed
Vue.config.silent = true

const localVue = createLocalVue()
localVue.use(Vuelidate)
localVue.use(Vuex)
localVue.filter('globalize', globalize)

describe('LoginForm component unit test', () => {
  beforeEach(() => {
    sinon.restore()
  })

  describe('validation rules assigned correctly', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(LoginForm, { localVue })
    })

    const expectedResults = {
      email: ['required'],
      password: ['required']
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
      '#login-email': 'email',
      '#login-password': 'password'
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
    let mockHelper

    let spyLoadWallet

    beforeEach(() => {
      mockHelper = new MockHelper()
      const actions = walletModule.actions
      const getters = walletModule.getters

      spyLoadWallet = sinon.stub(actions, vuexTypes.LOAD_WALLET).resolves()
      sinon.stub(getters, vuexTypes.wallet).returns(
        mockHelper.getMockWallet()
      )

      const store = new Vuex.Store({
        modules: {
          'new-wallet': {
            namespaced: true,
            actions,
            getters
          }
        }
      })

      wrapper = shallowMount(LoginForm, {
        store,
        localVue,
        methods: {
          isFormValid: sinon.stub().returns(true),
          _doLegacyStuff: sinon.stub().resolves()
        }
      })
    })

    it('submit() loads wallet with provided credentials', async () => {
      const email = 'alice@mail.com'
      const password = 'qwe123'

      sinon.stub(wrapper.vm, 'isUserExist').resolves(true)

      wrapper.setData({
        form: { email, password }
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

    it('submit() creates user when it doesn\'t exist', async () => {
      sinon.stub(wrapper.vm, 'isUserExist').resolves(false)

      const resource = mockHelper.getApiResourcePrototype('users')
      const spy = sinon.stub(resource, 'create').resolves()

      await wrapper.vm.submit()

      expect(spy.calledOnce).to.be.true
    })

    it('submit() doesn\'t create user when it exists', async () => {
      sinon.stub(wrapper.vm, 'isUserExist').resolves(true)

      const resource = mockHelper.getApiResourcePrototype('users')
      const spy = sinon.stub(resource, 'create').resolves()

      await wrapper.vm.submit()

      expect(spy.notCalled).to.be.true
    })

    it('isUserExist method returns false for 404 error', async () => {
      const resource = mockHelper.getApiResourcePrototype('users')

      sinon
        .stub(resource, 'get')
        .throws(TestHelper.getError(errors.NotFoundError))

      const result = await wrapper.vm.isUserExist()

      expect(result).to.be.false
    })
  })
})
