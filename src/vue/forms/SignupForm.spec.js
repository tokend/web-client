import SignupForm from './SignupForm'

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

describe('SignupForm component test', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(SignupForm, { localVue })
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

    it('confirmPassword', () => {
      wrapper.setData({
        form: {
          email: 'valid@mail.com',
          password: 'pwd123',
          confirmPassword: 'pwd456'
        }
      })

      expect(wrapper.vm.isFormValid()).to.be.false

      wrapper.setData({
        form: {
          email: 'valid@mail.com',
          password: 'pwd123',
          confirmPassword: 'pwd123'
        }
      })

      expect(wrapper.vm.isFormValid()).to.be.true
    })
  })
})
