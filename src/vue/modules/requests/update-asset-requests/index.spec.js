import UpdateAssetRequestsModule from './index'

import Vuex from 'vuex'

import { updateAssetRequestsModule } from './store/index'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { Wallet } from '@tokend/js-sdk'

import * as Api from './_api'
import * as Config from './_config'

import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Asset update requests module', () => {
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
      modules: { 'update-asset-requests': updateAssetRequestsModule },
    })
  })

  describe('created hook', () => {
    it('calls initApi function', () => {
      sinon.stub(Api, 'initApi')

      shallowMount(UpdateAssetRequestsModule, {
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

      shallowMount(UpdateAssetRequestsModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(Config.initConfig)
        .to.have.been.calledOnceWithExactly(props.config)

      Config.initConfig.restore()
    })

    it('calls setAccountId method', () => {
      sinon.stub(UpdateAssetRequestsModule.methods, 'setAccountId')

      shallowMount(UpdateAssetRequestsModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(UpdateAssetRequestsModule.methods.setAccountId
        .withArgs(props.wallet.accountId)
      ).to.have.been.calledOnce

      UpdateAssetRequestsModule.methods.setAccountId.restore()
    })

    it('calls initFirstPageLoader method', () => {
      sinon.stub(UpdateAssetRequestsModule.methods, 'initFirstPageLoader')

      shallowMount(UpdateAssetRequestsModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(UpdateAssetRequestsModule.methods.initFirstPageLoader)
        .to.have.been.calledOnce

      UpdateAssetRequestsModule.methods.initFirstPageLoader.restore()
    })
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      wrapper = shallowMount(UpdateAssetRequestsModule, {
        store,
        localVue,
        propsData: props,
      })
    })

    describe('method', () => {
      describe('loadRequests', () => {
        it('calls loadUpdateAssetRequests method', async () => {
          sinon.stub(wrapper.vm, 'loadUpdateAssetRequests').resolves()

          await wrapper.vm.loadRequests()

          expect(wrapper.vm.loadUpdateAssetRequests).to.have.been.calledOnce

          wrapper.vm.loadUpdateAssetRequests.restore()
        })

        it('sets isLoaded property to true if loading was succeded', async () => {
          sinon.stub(wrapper.vm, 'loadUpdateAssetRequests').resolves()

          await wrapper.vm.loadRequests()

          expect(wrapper.vm.isLoaded).to.be.true

          wrapper.vm.loadUpdateAssetRequests.restore()
        })

        it('returns the response of loadUpdateAssetRequests method', async () => {
          const responseStub = { data: {} }

          sinon.stub(wrapper.vm, 'loadUpdateAssetRequests')
            .resolves(responseStub)

          const result = await wrapper.vm.loadRequests()

          expect(result).to.equal(responseStub)

          wrapper.vm.loadUpdateAssetRequests.restore()
        })

        it('calls ErrorHandler.processWithoutFeedback if an error was thrown', async () => {
          sinon.stub(wrapper.vm, 'loadUpdateAssetRequests').rejects()
          sinon.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadRequests()

          expect(ErrorHandler.processWithoutFeedback)
            .to.have.been.calledOnce

          wrapper.vm.loadUpdateAssetRequests.restore()
          ErrorHandler.processWithoutFeedback.restore()
        })

        it('set isLoadingFailed property to true if an error was thrown', async () => {
          sinon.stub(wrapper.vm, 'loadUpdateAssetRequests').rejects()
          sinon.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadRequests()

          expect(wrapper.vm.isLoadingFailed).to.be.true

          wrapper.vm.loadUpdateAssetRequests.restore()
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
          wrapper.setData({
            selectedRequest: {},
          })

          wrapper.vm.showRequestDetails({ id: '1' })

          expect(wrapper.vm.selectedRequest).to.deep.equal({ id: '1' })
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
