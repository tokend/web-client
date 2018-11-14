import { mount, createLocalVue } from '@vue/test-utils'
import { i18n } from '../../../../js/i18n/index'

import Vue from 'vue'
import Vuex from 'vuex'
import VueMaterial from 'vue-material'
import VeeValidate from 'vee-validate'

import ChangePassword from './Security.ChangePassword'

Vue.use(VueMaterial)
Vue.use(VeeValidate)

const localVue = createLocalVue()

describe('Settings.Security component', () => {
  let ChangePasswordComponentWrapper
  let store, actions, getters

  beforeEach(() => {
    getters = {
      userEmail: () => 'john@mail.com',
      accountId: () => 'GABKZPE36PSDZ3GYYNS5ZXVMBSJYKIWGHSTFEQDRSDXQMUISOCKHN4BF'
    }
    store = new Vuex.Store({
      actions,
      getters
    })
    ChangePasswordComponentWrapper = mount(ChangePassword, { store, localVue })
  })

  it('Dialog form is not active after component create', () => {
    expect(ChangePasswordComponentWrapper.contains('.md-dialog')).to.equal(false)
  })

  it('Dialog form is active because isFormOpened is set to true', (done) => {
    ChangePasswordComponentWrapper.setData({
      isFormOpened: true
    })
    Vue.nextTick(() => {
      try {
        expect(ChangePasswordComponentWrapper.contains('.md-dialog')).to.equal(true)
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it ('properly mapped userEmail getter', () => {
    expect(ChangePasswordComponentWrapper.vm.userEmail).to.equal('john@mail.com')
  })

  it ('properly mapped accountId getter', () => {
    expect(ChangePasswordComponentWrapper.vm.accountId).to.equal('GABKZPE36PSDZ3GYYNS5ZXVMBSJYKIWGHSTFEQDRSDXQMUISOCKHN4BF')
  })

  it ('pwdUnconfirmedMessage returns empty string until password not provided', () => {
    expect(ChangePasswordComponentWrapper.vm.pwdUnconfirmedMessage).to.equal('')
  })

  it ('pwdUnconfirmedMessage returns empty string until confirmPassword not provided', () => {
    expect(ChangePasswordComponentWrapper.vm.pwdUnconfirmedMessage).to.equal('')
  })

  it ('pwdUnconfirmedMessage returns empty string if password is provided, but confirm password isn\'t', (done) => {
    ChangePasswordComponentWrapper.setData({
      form: {
        password: 'password',
        confirmPassword: ''
      }
    })
    Vue.nextTick(() => {
      try {
        expect(ChangePasswordComponentWrapper.vm.pwdUnconfirmedMessage).to.equal('')
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it ('pwdUnconfirmedMessage returns empty string if confirm password is provided, but password isn\'t', (done) => {
    ChangePasswordComponentWrapper.setData({
      form: {
        password: '',
        confirmPassword: 'password'
      }
    })
    Vue.nextTick(() => {
      try {
        expect(ChangePasswordComponentWrapper.vm.pwdUnconfirmedMessage).to.equal('')
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it ('pwdUnconfirmedMessage returns message if passwords don\'t match', (done) => {
    ChangePasswordComponentWrapper.setData({
      form: {
        password: 'password',
        confirmPassword: 'another password'
      }
    })
    Vue.nextTick(() => {
      try {
        expect(ChangePasswordComponentWrapper.vm.pwdUnconfirmedMessage).to.equal(i18n.set_pwd_do_not_match())
        done()
      } catch (e) {
        done(e)
      }
    })
  })
})
