import LoginForm from './LoginForm'

import Vuelidate from 'vuelidate'
import Vuex from 'vuex'
import Vue from 'vue'

import { Wallet, errors } from '@tokend/js-sdk'
import { vuexTypes } from '@/vuex'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import { globalize } from '@/vue/filters/globalize'

import { MockHelper } from '@/test'

// HACK: https://github.com/vuejs/vue-test-utils/issues/532, waiting for
// Vue 2.6 so everything get fixed
Vue.config.silent = true

const localVue = createLocalVue()
localVue.use(Vuelidate)
localVue.use(Vuex)
localVue.filter('globalize', globalize)

describe('LoginForm component unit test', () => {
  let mockHelper
  beforeEach(() => {
    sinon.restore()
    mockHelper = new MockHelper()
  })

  describe('methods', () => {
    let spies
    let wrapper
    let sdk = {
      api: {
        users: {}
      }
    }

    beforeEach(() => {
      spies = {
        loadWallet: sinon.spy()
      }

      const store = new Vuex.Store({
        modules: {
          'new-wallet': {
            namespaced: true,
            actions: {
              [vuexTypes.LOAD_WALLET]: spies.loadWallet
            },
            getters: {
              [vuexTypes.wallet]: sinon.stub().returns(new Wallet(
                'foo@mail.com',
                'SCKPYOBGIQ5CM3NEZYM25H5SIWZONRUHNMXZ47JBLM6RMBGDIY5NLERG',
                'GBYJOGI4T7RHIOJFXXSCMOQYXC5BD63Z4FVCUAWZ27UQ4CQPZGG432T6',
                '4aadcd4eb44bb845d828c45dbd68d5d1196c3a182b08cd22f05c56fcf15b153c'
              ))
            }
          }
        }
      })

      sdk.api.users = mockHelper.getApiResourcePrototype('users')
      sdk.api.users.create = sinon.spy()

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

      wrapper.setMethods({
        isUserExist: sinon.stub().resolves(true)
      })
      wrapper.setData({
        form: {
          email,
          password
        }
      })

      await wrapper.vm.submit()
      // Vue will dispatch the action with the store object as a first param
      // so it's much easier to check only needed param instead of doing
      // spy.withArgs()
      expect(spies.loadWallet.calledOnce).to.be.true
      expect(spies.loadWallet.args[0][1]).to.deep.equal({ email, password })
    })

    it('submit() creates user when it doesn\'t exist', async () => {
      wrapper.setMethods({
        isUserExist: sinon.stub().resolves(false)
      })
      await wrapper.vm.submit()
      expect(sdk.api.users.create.calledOnce).to.be.true
    })

    it('submit() doesn\'t create user when it exists', async () => {
      wrapper.setMethods({
        isUserExist: sinon.stub().resolves(true)
      })
      await wrapper.vm.submit()
      expect(sdk.api.users.create.calledOnce).to.be.false
    })

    it('isUserExist method returns false for 404 error', async () => {
      sinon.stub(sdk.api.users, 'get').throws(new errors.NotFoundError({
        status: 404,
        response: {
          data: {
            errors: [{
              title: 'Not found',
              detail: 'User not found'
            }]
          }
        }
      }))
      expect(await wrapper.vm.isUserExist()).to.be.false
    })
  })
})
