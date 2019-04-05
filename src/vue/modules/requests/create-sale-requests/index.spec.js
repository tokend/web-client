import CreateSaleRequestsModule from './index'

import Vuex from 'vuex'
import { createSaleRequestsModule } from './store/index'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { Wallet } from '@tokend/js-sdk'

import * as Api from './_api'
import * as Config from './_config'

import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Create sale requests module', () => {
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
      modules: { 'create-sale-requests': createSaleRequestsModule },
    })
  })

  describe('created hook', () => {
    beforeEach(() => {
      sinon.stub(Api, 'initApi')
      sinon.stub(Config, 'initConfig')
      sinon.stub(CreateSaleRequestsModule.methods, 'setAccountId')
      sinon.stub(CreateSaleRequestsModule.methods, 'initFirstPageLoader')
    })

    afterEach(() => {
      Api.initApi.restore()
      Config.initConfig.restore()
      CreateSaleRequestsModule.methods.setAccountId.restore()
      CreateSaleRequestsModule.methods.initFirstPageLoader.restore()
    })

    it('calls initApi function', async () => {
      await shallowMount(CreateSaleRequestsModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(Api.initApi)
        .to.have.been.calledOnceWithExactly(props.wallet, props.config)
    })

    it('calls initConfig function', async () => {
      await shallowMount(CreateSaleRequestsModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(Config.initConfig)
        .to.have.been.calledOnceWithExactly(props.config)
    })

    it('calls setAccountId method', async () => {
      await shallowMount(CreateSaleRequestsModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(CreateSaleRequestsModule.methods.setAccountId
        .withArgs(props.wallet.accountId)
      ).to.have.been.calledOnce
    })

    it('calls initFirstPageLoader method', async () => {
      await shallowMount(CreateSaleRequestsModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(CreateSaleRequestsModule.methods.initFirstPageLoader)
        .to.have.been.calledOnce
    })
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      sinon.stub(CreateSaleRequestsModule, 'created').resolves()

      wrapper = shallowMount(CreateSaleRequestsModule, {
        store,
        localVue,
        propsData: props,
      })
    })

    afterEach(() => {
      CreateSaleRequestsModule.created.restore()
    })

    describe('method', () => {
      describe('loadRequests', () => {
        it('calls loadCreateSaleRequests method', async () => {
          sinon.stub(wrapper.vm, 'loadCreateSaleRequests').resolves()

          await wrapper.vm.loadRequests()

          expect(wrapper.vm.loadCreateSaleRequests)
            .to.have.been.calledOnce

          wrapper.vm.loadCreateSaleRequests.restore()
        })

        it('sets isLoaded property to true if loading was succeded', async () => {
          sinon.stub(wrapper.vm, 'loadCreateSaleRequests').resolves()

          await wrapper.vm.loadRequests()

          expect(wrapper.vm.isLoaded).to.be.true

          wrapper.vm.loadCreateSaleRequests.restore()
        })

        it('returns the response of loadCreateSaleRequests method', async () => {
          const responseStub = { data: {} }

          sinon.stub(wrapper.vm, 'loadCreateSaleRequests')
            .resolves(responseStub)

          const result = await wrapper.vm.loadRequests()

          expect(result).to.equal(responseStub)

          wrapper.vm.loadCreateSaleRequests.restore()
        })

        it('calls ErrorHandler.processWithoutFeedback if an error was thrown', async () => {
          sinon.stub(wrapper.vm, 'loadCreateSaleRequests').rejects()
          sinon.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadRequests()

          expect(ErrorHandler.processWithoutFeedback)
            .to.have.been.calledOnce

          wrapper.vm.loadCreateSaleRequests.restore()
          ErrorHandler.processWithoutFeedback.restore()
        })

        it('set isLoadingFailed property to true if an error was thrown', async () => {
          sinon.stub(wrapper.vm, 'loadCreateSaleRequests').rejects()
          sinon.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadRequests()

          expect(wrapper.vm.isLoadingFailed).to.be.true

          wrapper.vm.loadCreateSaleRequests.restore()
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
