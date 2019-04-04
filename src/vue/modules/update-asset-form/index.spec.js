import UpdateAssetForm from './index'

import Vuelidate from 'vuelidate'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { Wallet } from '@tokend/js-sdk'

import * as Api from './_api'

const localVue = createLocalVue()
localVue.use(Vuelidate)

describe('Update asset form module', () => {
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
        sandbox.stub(UpdateAssetForm.methods, 'init').resolves()

        await shallowMount(UpdateAssetForm, { localVue })

        expect(UpdateAssetForm.methods.init).to.have.been.calledOnce
      }
    )
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      sandbox.stub(UpdateAssetForm, 'created').resolves()

      wrapper = shallowMount(UpdateAssetForm, { localVue })
    })

    describe('method', () => {
      describe('init', () => {
        it('initializes API, calls loadUpdateAssetRecord method, and sets isLoaded property to true',
          async () => {
            const props = {
              config: {
                horizonUrl: 'https://test.api.com',
                storageURL: 'https://storage.com',
              },
              wallet: new Wallet(
                'test@mail.com',
                'SCPIPHBIMPBMGN65SDGCLMRN6XYGEV7WD44AIDO7HGEYJUNDKNKEGVYE',
                'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ',
                '4aadcd4eb44bb845d828c45dbd68d5d1196c3a182b08cd22f05c56fcf15b153c'
              ),
            }

            sandbox.stub(Api, 'initApi')
            sandbox.stub(wrapper.vm, 'loadUpdateAssetRecord').resolves()

            wrapper.setProps(props)

            await wrapper.vm.init()

            expect(Api.initApi)
              .to.have.been.calledOnceWithExactly(props.wallet, props.config)
            expect(wrapper.vm.loadUpdateAssetRecord).to.have.been.calledOnce
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

      describe('loadUpdateAssetRecord', () => {
        it('calls getUpdateRequest method and sets returned result to request property, if result is not empty',
          async () => {
            const request = { id: '1' }
            sandbox.stub(wrapper.vm, 'getUpdateRequest')
              .resolves(request)

            await wrapper.vm.loadUpdateAssetRecord()

            expect(wrapper.vm.getUpdateRequest).to.have.been.calledOnce
            expect(wrapper.vm.request).to.equal(request)
          }
        )

        it('calls getAssetByCode method and sets result to asset property if getUpdateRequest method return empty result',
          async () => {
            const asset = { code: '1' }
            sandbox.stub(wrapper.vm, 'getUpdatableRequest').resolves()
            sandbox.stub(wrapper.vm, 'getAssetByCode').resolves(asset)

            await wrapper.vm.loadUpdateAssetRecord()

            expect(wrapper.vm.getAssetByCode)
              .to.have.been.calledOnce
            expect(wrapper.vm.asset).to.equal(asset)
          }
        )
      })

      describe('getUpdateRequest', () => {
        it('calls getUpdateAssetRequestById method with correct id and returns its result if request ID prop is not empty',
          async () => {
            const request = { id: '1' }
            sandbox.stub(wrapper.vm, 'getUpdateAssetRequestById')
              .resolves(request)

            wrapper.setProps({
              requestId: '1',
            })

            const result = await wrapper.vm.getUpdateRequest()

            expect(wrapper.vm.getUpdateAssetRequestById)
              .to.have.been.calledOnceWithExactly('1')
            expect(result).to.equal(request)
          }
        )

        it('calls getUpdatableRequest method and returns its result if request ID prop is empty, but asset code prop is present',
          async () => {
            const request = { id: '1' }
            sandbox.stub(wrapper.vm, 'getUpdatableRequest')
              .resolves(request)

            wrapper.setProps({
              assetCode: 'USD',
            })

            const result = await wrapper.vm.getUpdateRequest()

            expect(wrapper.vm.getUpdatableRequest)
              .to.have.been.calledOnce
            expect(result).to.equal(request)
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
        it('calls submitUpdateAssetRequest, Bus.success methods, emits submit events, and sets isDisabled property to true',
          async () => {
            sandbox.stub(wrapper.vm, 'submitUpdateAssetRequest').resolves()
            sandbox.stub(Bus, 'success')

            await wrapper.vm.submit()

            expect(wrapper.vm.submitUpdateAssetRequest)
              .to.have.been.calledOnce
            expect(Bus.success).to.have.been.calledOnce

            expect(wrapper.emitted()['request-updated']).to.exist
            expect(wrapper.emitted()['close']).to.exist

            expect(wrapper.vm.isDisabled).to.be.true
          }
        )

        it('handles a thrown error properly and set isDisabled property to false',
          async () => {
            sandbox.stub(wrapper.vm, 'submitUpdateAssetRequest').rejects()
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
