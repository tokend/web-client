import RecoveryForm from './RecoveryForm'

import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import { TestHelper } from '@/test/test-helper'
import { globalize } from '@/vue/filters/globalize'

const localVue = createLocalVue()

localVue.use(Vuelidate)
localVue.filter('globalize', globalize)

// HACK: https://github.com/vuejs/vue-test-utils/issues/532, waiting for
// Vue 2.6 so everything get fixed
Vue.config.silent = true

describe('RecoveryForm component test', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(RecoveryForm, { localVue })
  })

  describe('validation works correctly', () => {
    it('email', () => {
      let isValid = TestHelper.isFieldValid(wrapper, 'email', 'invalid-mail-com')
      expect(isValid).to.be.false
      isValid = TestHelper.isFieldValid(wrapper, 'email', 'valid@mail.com')
      expect(isValid).to.be.true
    })

    it('password', () => {
      let isValid = TestHelper.isFieldValid(wrapper, 'password', 'qqq')
      expect(isValid).to.be.false
      isValid = TestHelper.isFieldValid(wrapper, 'password', 'qqq123')
      expect(isValid).to.be.true
    })

    it('recoverySeed', () => {
      let isValid = TestHelper.isFieldValid(wrapper, 'recoverySeed', 'qqq')
      expect(isValid).to.be.false
      isValid = TestHelper.isFieldValid(wrapper, 'recoverySeed', 'SCLEBNULYANXPNXV5ACUN62KZKASKKKYJJJYDG2EALGWI5WWKOIVH57E')
      expect(isValid).to.be.true
    })

    it('confirmPassword', () => {
      wrapper.setData({
        form: {
          email: 'valid@mail.com',
          password: 'pwd123',
          confirmPassword: 'pwd456',
          recoverySeed: 'SCLEBNULYANXPNXV5ACUN62KZKASKKKYJJJYDG2EALGWI5WWKOIVH57E'
        }
      })

      expect(wrapper.vm.isFormValid()).to.be.false

      wrapper.setData({
        form: {
          email: 'valid@mail.com',
          password: 'pwd123',
          confirmPassword: 'pwd123',
          recoverySeed: 'SCLEBNULYANXPNXV5ACUN62KZKASKKKYJJJYDG2EALGWI5WWKOIVH57E'
        }
      })

      expect(wrapper.vm.isFormValid()).to.be.true
    })
  })

  describe('submit method', () => {
    // let mockHelper = new MockHelper()
    // // let wrapper
    // let sdk = {
    //   api: {
    //     users: {}
    //   }
    // }
    //
    // beforeEach(() => {
    //   wrapper = shallowMount(SignupForm, {
    //     localVue,
    //     propsData: {
    //       submitEvent: 'submit-event'
    //     },
    //     data: _ => ({
    //       form: {
    //         email: 'alice@mail.com',
    //         password: 'qwe123',
    //         confirmPassword: 'qwe123'
    //       }
    //     })
    //   })
    //
    //   sdk.api.wallets = mockHelper.getApiResourcePrototype('wallets')
    // })
    //
    // afterEach(() => {
    //   sinon.restore()
    //   mockHelper = new MockHelper()
    // })
  })
})
