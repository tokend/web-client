import AssetCreationRequestsModule from './index'

import Vuex from 'vuex'

import { assetCreationRequestsModule } from './store/index'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { Wallet } from '@tokend/js-sdk'

import * as Api from './_api'
import * as Config from './_config'

import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Asset creation requests module', () => {
  const props = {
    config: {
      horizonURL: 'https://test.api.com',
      storageURL: 'https://test.storage.com',
    },
    wallet: new Wallet(
      'test@mail.com',
      'SCPIPHBIMPBMGN65SDGCLMRN6XYGEV7WD44AIDO7HGEYJUNDKNKEGVYE',
      'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ',
      '4aadcd4eb44bb845d828c45dbd68d5d1196c3a182b08cd22f05c56fcf15b153c'
    ),
  }

  let store

  beforeEach(() => {
    store = new Vuex.Store({
      modules: { 'asset-creation-requests': assetCreationRequestsModule },
    })
  })

  describe('created hook', () => {
    it('calls initApi function', () => {
      sinon.stub(Api, 'initApi')

      shallowMount(AssetCreationRequestsModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(Api.initApi)
        .to.have.been.calledOnceWithExactly(props.wallet, props.config)

      Api.initApi.restore()
    })

    it('calls initConfig function', () => {
      sinon.stub(Config, 'initConfig')

      shallowMount(AssetCreationRequestsModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(Config.initConfig)
        .to.have.been.calledOnceWithExactly(props.config)

      Config.initConfig.restore()
    })

    it('calls setAccountId method', () => {
      sinon.stub(AssetCreationRequestsModule.methods, 'setAccountId')

      shallowMount(AssetCreationRequestsModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(AssetCreationRequestsModule.methods.setAccountId
        .withArgs(props.wallet.accountId)
      ).to.have.been.calledOnce

      AssetCreationRequestsModule.methods.setAccountId.restore()
    })

    it('calls initFirstPageLoader method', () => {
      sinon.stub(AssetCreationRequestsModule.methods, 'initFirstPageLoader')

      shallowMount(AssetCreationRequestsModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(AssetCreationRequestsModule.methods.initFirstPageLoader)
        .to.have.been.calledOnce

      AssetCreationRequestsModule.methods.initFirstPageLoader.restore()
    })
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      wrapper = shallowMount(AssetCreationRequestsModule, {
        store,
        localVue,
        propsData: props,
      })
    })

    describe('method', () => {
      describe('loadRequests', () => {
        it('calls loadAssetCreationRequests method', async () => {
          sinon.stub(wrapper.vm, 'loadAssetCreationRequests').resolves()

          await wrapper.vm.loadRequests()

          expect(wrapper.vm.loadAssetCreationRequests).to.have.been.calledOnce

          wrapper.vm.loadAssetCreationRequests.restore()
        })

        it('sets isLoaded property to true if loading was succeded', async () => {
          sinon.stub(wrapper.vm, 'loadAssetCreationRequests').resolves()

          await wrapper.vm.loadRequests()

          expect(wrapper.vm.isLoaded).to.be.true

          wrapper.vm.loadAssetCreationRequests.restore()
        })

        it('returns the response of loadAssetCreationRequests method', async () => {
          const response = { data: {} }
          sinon.stub(wrapper.vm, 'loadAssetCreationRequests')
            .resolves(response)

          const result = await wrapper.vm.loadRequests()

          expect(result).to.equal(response)

          wrapper.vm.loadAssetCreationRequests.restore()
        })

        it('calls ErrorHandler.processWithoutFeedback if an error was thrown', async () => {
          sinon.stub(wrapper.vm, 'loadAssetCreationRequests').rejects()
          sinon.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadRequests()

          expect(ErrorHandler.processWithoutFeedback)
            .to.have.been.calledOnce

          wrapper.vm.loadAssetCreationRequests.restore()
          ErrorHandler.processWithoutFeedback.restore()
        })

        it('set isLoadingFailed property to true if an error was thrown', async () => {
          sinon.stub(wrapper.vm, 'loadAssetCreationRequests').rejects()
          sinon.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadRequests()

          expect(wrapper.vm.isLoadingFailed).to.be.true

          wrapper.vm.loadAssetCreationRequests.restore()
          ErrorHandler.processWithoutFeedback.restore()
        })
      })

      describe('initFirstPageLoader', () => {
        it('sets an instance of loadRequests method to the firstPageLoader property', async () => {
          sinon.stub(wrapper.vm, 'loadRequests').resolves()
          wrapper.setData({
            firstPageLoader: () => {},
          })

          wrapper.vm.initFirstPageLoader()
          await wrapper.vm.firstPageLoader()

          expect(wrapper.vm.loadRequests).to.have.been.calledOnce
        })
      })

      describe('showRequestDetails', () => {
        it('sets isUpdateMode property to false', () => {
          wrapper.setData({
            isUpdateMode: true,
          })

          wrapper.vm.showRequestDetails()

          expect(wrapper.vm.isUpdateMode).to.be.false
        })

        it('sets selectedRequest property to passed param', () => {
          const request = {
            id: '1',
          }
          wrapper.setData({
            selectedRequest: {},
          })

          wrapper.vm.showRequestDetails(request)

          expect(wrapper.vm.selectedRequest).to.deep.equal(request)
        })

        it('sets isDrawerShown property to true', () => {
          wrapper.setData({
            isDrawerShown: false,
          })

          wrapper.vm.showRequestDetails()

          expect(wrapper.vm.isDrawerShown).to.be.true
        })
      })
    })
  })
})
