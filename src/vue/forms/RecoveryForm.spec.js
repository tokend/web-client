import RecoveryForm from './RecoveryForm'

import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import { TestHelper } from '@/test/test-helper'
import { MockHelper } from '@/test'
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
    const fields = {
      email: {
        valid: ['valid@mail.com', 'alice@mail.com', 'qq@mail.com'],
        invalid: ['qweq', '@wqeqe', 'mail.com', '']
      },
      password: {
        valid: ['qwe123', 'wTqw12Zewq', '1234qwe'],
        invalid: ['qq', 'qqq13', '']
      },
      recoverySeed: {
        valid: [
          'SARPAUUZMPDS2HKGVCZZJZUQJNDYSEM4IFPINJWILIWPMFEGF4PDGVRH',
          'SA4R2XPR4NN4BMEYBCHHVJIWUE2KT3NLB5RZBT4QXHT2IEQW5GRJ5CUA',
          'SDXVH22GAK7E65G2M6ZGAUW3SDWRCTQJVNWNHIJR5SXRIJ5NT5ANZLW5'
        ],
        invalid: [
          'GAEYQRQD4NIG7MRIZJ4NMZZEH7XPS7JRVYFYLBXF7HNBJQADUKJ6N6LL',
          'foobar',
          ''
        ]
      }
    }

    for (const [fieldName, fieldValues] of Object.entries(fields)) {
      for (const fieldValue of fieldValues.valid) {
        it(`considers ${fieldValue} a valid ${fieldName}`, () => {
          expect(TestHelper.isFieldValid(
            wrapper,
            fieldName,
            fieldValue
          ))
            .to.be.true
        })
      }
      for (const fieldValue of fieldValues.invalid) {
        it(`considers ${fieldValue} an invalid ${fieldName}`, () => {
          expect(TestHelper.isFieldValid(
            wrapper,
            fieldName,
            fieldValue
          ))
            .to.be.false
        })
      }
    }

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

    const fieldBindings = {
      '#recovery-email': 'form.email',
      '#recovery-password': 'form.password',
      '#recovery-confirm-password': 'form.confirmPassword',
      '#recovery-seed': 'form.recoverySeed'
    }

    for (const [selector, model] of Object.entries(fieldBindings)) {
      it(`$v.${model} is touched after blur event emitted on ${selector}`, async () => {
        const touchField = sinon.spy()

        wrapper.setMethods({ touchField })
        wrapper.find(selector).vm.$emit('blur')

        expect(touchField.withArgs(model).calledOnce).to.be.true
      })
    }
  })

  describe('submit method', () => {
    let mockHelper = new MockHelper()
    // let wrapper
    let sdk = {
      api: {
        users: {}
      }
    }

    beforeEach(() => {
      wrapper = shallowMount(RecoveryForm, {
        localVue
      })

      sdk.api.wallets = mockHelper.getApiResourcePrototype('wallets')
    })

    it('calls SDK wallets.recovery with proper set of params', async () => {
      sdk.api.wallets.recovery = sinon.spy()
      const form = {
        email: 'alice@mail.com',
        password: 'qwe123',
        confirmPassword: 'qwe123',
        recoverySeed: 'SDE44JILVL2YU5VXESXRT4ZZYN7U2DHOZTMMIOMVEVIGL5BATGCYZD7Q'
      }

      wrapper.setData({ form })

      await wrapper.vm.submit()

      expect(sdk.api.wallets.recovery.withArgs(
        form.email,
        form.recoverySeed,
        form.password
      ).calledOnce)
        .to
        .be
        .true
    })

    afterEach(() => {
      sinon.restore()
      mockHelper = new MockHelper()
    })
  })
})
