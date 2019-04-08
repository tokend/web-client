import CreateAssetForm from './index'

import Vuelidate from 'vuelidate'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import * as Api from './_api'
import * as Config from './_config'

const localVue = createLocalVue()
localVue.use(Vuelidate)

describe('Create asset form module', () => {
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('created hook', () => {
    it('calls init method',
      async () => {
        sandbox.stub(CreateAssetForm.methods, 'init').resolves()

        await shallowMount(CreateAssetForm, {
          localVue,
        })

        expect(CreateAssetForm.methods.init).to.have.been.calledOnce
      }
    )
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      sandbox.stub(CreateAssetForm, 'created').resolves()

      wrapper = shallowMount(CreateAssetForm, {
        localVue,
      })
    })

    describe('method', () => {
      describe('init', () => {
        it('initializes API and config, calls load methods, and sets isLoaded property to true',
          async () => {
            wrapper.setProps({
              config: 'SOME_CONFIG',
              wallet: 'SOME_WALLET',
            })

            sandbox.stub(Api, 'initApi')
            sandbox.stub(Config, 'initConfig')
            sandbox.stub(wrapper.vm, 'loadKycRequiredAssetType').resolves()
            sandbox.stub(wrapper.vm, 'tryLoadRequest').resolves()

            await wrapper.vm.init()

            expect(Api.initApi)
              .to.have.been.calledOnceWithExactly('SOME_WALLET', 'SOME_CONFIG')
            expect(Config.initConfig)
              .to.have.been.calledOnceWithExactly('SOME_CONFIG')

            expect(wrapper.vm.loadKycRequiredAssetType)
              .to.have.been.calledOnce
            expect(wrapper.vm.tryLoadRequest).to.have.been.calledOnce

            expect(wrapper.vm.isLoaded).to.be.true
          }
        )

        it('handles an error if it was thrown, and sets isLoadFailed property to true',
          async () => {
            sandbox.stub(Api, 'initApi').throws()
            sandbox.stub(ErrorHandler, 'processWithoutFeedback')

            await wrapper.vm.init()

            expect(ErrorHandler.processWithoutFeedback)
              .to.have.been.calledOnce
            expect(wrapper.vm.isLoadFailed).to.be.true
          }
        )
      })

      describe('tryLoadRequest', () => {
        it('loads request, only if request ID was passed as a prop',
          async () => {
            const request = { id: '1' }
            sandbox.stub(wrapper.vm, 'getCreateAssetRequestById')
              .resolves(request)

            await wrapper.vm.tryLoadRequest()

            expect(wrapper.vm.getCreateAssetRequestById)
              .to.have.been.not.called
            expect(wrapper.vm.request).to.not.equal(request)

            wrapper.setProps({
              requestId: '1',
            })

            await wrapper.vm.tryLoadRequest()

            expect(wrapper.vm.getCreateAssetRequestById)
              .to.have.been.calledOnceWithExactly('1')
            expect(wrapper.vm.request).to.equal(request)
          }
        )
      })

      describe('moveToNextStep', () => {
        it('increments currentStep property', () => {
          wrapper.setData({
            currentStep: 1,
          })

          wrapper.vm.moveToNextStep()

          expect(wrapper.vm.currentStep).to.equal(2)
        })
      })

      describe('submit', () => {
        it('calls proper methods and sets isDefault proeprty to true',
          async () => {
            sandbox.stub(wrapper.vm, 'submitCreateAssetRequest').resolves()
            sandbox.stub(Bus, 'success')
            sandbox.stub(wrapper.vm, 'emitSubmitEvents')

            await wrapper.vm.submit()

            expect(wrapper.vm.submitCreateAssetRequest)
              .to.have.been.calledOnce
            expect(Bus.success).to.have.been.calledOnce
            expect(wrapper.vm.emitSubmitEvents).to.have.been.calledOnce
            expect(wrapper.vm.isDisabled).to.be.true
          }
        )

        it('handles a thrown error properly and set isDisabled property to false',
          async () => {
            sandbox.stub(wrapper.vm, 'submitCreateAssetRequest').rejects()
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

      describe('emitSubmitEvents', () => {
        it('emits request updated and close events if request ID was passed as a prop',
          () => {
            wrapper.setProps({
              requestId: '1',
            })

            wrapper.vm.emitSubmitEvents()

            expect(wrapper.emitted()['request-updated']).to.exist
            expect(wrapper.emitted()['close']).to.exist
          }
        )

        it('emits only close event if request ID was not passed as a prop',
          () => {
            wrapper.vm.emitSubmitEvents()

            expect(wrapper.emitted()['close']).to.exist
            expect(wrapper.emitted()['request-updated']).to.not.exist
          }
        )
      })
    })
  })
})
