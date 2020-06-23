import AssetForm from './index'

import Vuelidate from 'vuelidate'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { api } from '@/api'

const localVue = createLocalVue()
localVue.use(Vuelidate)

describe('Asset form module', () => {
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      wrapper = shallowMount(AssetForm, { localVue })
    })

    describe('method', () => {
      describe('toNextStep', () => {
        it('increments currentStep property', () => {
          wrapper.setData({
            currentStep: 1,
          })

          wrapper.vm.toNextStep()

          expect(wrapper.vm.currentStep).to.equal(2)
        })
      })

      describe('submit', () => {
        it('calls proper methods and sets isDefault property to true',
          async () => {
            sandbox.stub(wrapper.vm.former, 'buildOps').resolves(['op1'])
            sandbox.stub(api, 'postOperations')
            sandbox.stub(Bus, 'success')

            await wrapper.vm.submit()

            expect(wrapper.vm.former.buildOps).to.have.been.calledOnce
            expect(api.postOperations).to.have.been.calledOnceWith()
            expect(Bus.success).to.have.been.calledOnceWith('asset-form.request-submitted-msg')
            expect(wrapper.emitted('submitted')).to.exist
            expect(wrapper.vm.isDisabled).to.be.true
          }
        )

        it('handles a thrown error properly and set isDisabled property to false',
          async () => {
            sandbox.stub(wrapper.vm.former, 'buildOps').rejects()
            sandbox.stub(ErrorHandler, 'process')
            wrapper.setData({
              isDisabled: true,
            })

            await wrapper.vm.submit()

            expect(ErrorHandler.process).to.have.been.calledOnce
            expect(wrapper.vm.isDisabled).to.be.false
          }
        )
      })
    })
  })
})
