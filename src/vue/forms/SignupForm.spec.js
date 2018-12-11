import SignupForm from './SignupForm'

import Vue from 'vue'
import Vuelidate from 'vuelidate'

import { createLocalVue, shallowMount } from '@vue/test-utils'
import { TestHelper } from '@/test/test-helper'
import { MockHelper } from '@/test'
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
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(SignupForm, { localVue })
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

  describe('submit method', () => {
    let mockHelper = new MockHelper()
    // let wrapper
    let sdk = {
      api: {
        users: {}
      }
    }

    beforeEach(() => {
      wrapper = shallowMount(SignupForm, {
        localVue,
        propsData: {
          submitEvent: 'submit-event'
        },
        data: _ => ({
          form: {
            email: 'alice@mail.com',
            password: 'qwe123',
            confirmPassword: 'qwe123'
          }
        })
      })

      sdk.api.wallets = mockHelper.getApiResourcePrototype('wallets')
    })

    afterEach(() => {
      sinon.restore()
      mockHelper = new MockHelper()
    })

    it('loads kdf params for provided email', async () => {
      sdk.api.wallets.getKdfParams = sinon.spy()

      await wrapper.vm.submit()

      expect(sdk.api.wallets.getKdfParams.withArgs('alice@mail.com').calledOnce)
        .to
        .be
        .true
    })

    it('emits the global error event if user exist', async () => {
      Bus.error = sinon.spy()
      sdk.api.wallets.getKdfParams = sinon
        .stub()
        .resolves()

      await wrapper.vm.submit()

      expect(Bus.error.calledOnce).to.be.true
    })

    it('doesn\'t emit the submitted event if user exist', async () => {
      Bus.error = sinon.spy()
      sdk.api.wallets.getKdfParams = sinon
        .stub()
        .resolves()

      await wrapper.vm.submit()

      expect(wrapper.emitted()['submit-event']).to.not.exist
    })

    describe('properly emits the submitted event if user doesn\'t exist', () => {
      const form = {
        email: 'foo@bar.com',
        password: 'Tw15m#ewq',
        confirmPassword: 'Tw15m#ewq'
      }
      beforeEach(async () => {
        sdk.api.wallets.getKdfParams = sinon
          .stub()
          .throws(new errors.NotFoundError({
            response: {
              data: {
                errors: [{
                  status: 404,
                  title: 'Not Found',
                  details: 'User not found'
                }]
              }
            }
          }))

        wrapper.setData({ form })

        await wrapper.vm.submit()
      })

      it('emits event', () => {
        expect(wrapper.emitted()['submit-event']).to.exist
      })
      it('emits event exactly one time', () => {
        expect(wrapper.emitted()['submit-event'].length).to.equal(1)
      })
      it('emits event with valid params', () => {
        expect(wrapper.emitted()['submit-event'][0]).to.deep.equal([form])
      })
    })
  })
})
