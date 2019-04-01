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

describe('Update asset requests module', () => {
  let sandbox
  let store

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    store = new Vuex.Store({
      modules: { 'update-asset-requests': updateAssetRequestsModule },
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('created hook', () => {
    beforeEach(() => {
      sandbox.stub(Api, 'initApi')
      sandbox.stub(Config, 'initConfig')
      sandbox.stub(UpdateAssetRequestsModule.methods, 'setAccountId')
      sandbox.stub(UpdateAssetRequestsModule.methods, 'initFirstPageLoader')
    })

    it('calls initApi function with correct params', () => {
      const props = {
        config: {
          horizonURL: 'https://test.api.com',
        },
        wallet: new Wallet(
          'test@mail.com',
          'SCPIPHBIMPBMGN65SDGCLMRN6XYGEV7WD44AIDO7HGEYJUNDKNKEGVYE',
          'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ',
          '4aadcd4eb44bb845d828c45dbd68d5d1196c3a182b08cd22f05c56fcf15b153c'
        ),
      }

      shallowMount(UpdateAssetRequestsModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(Api.initApi)
        .to.have.been.calledOnceWithExactly(props.wallet, props.config)
    })

    it('calls initConfig function with correct params', () => {
      const props = {
        config: {
          horizonURL: 'https://test.api.com',
          storageURL: 'https://storage.com',
        },
        wallet: { accountId: 'SOME_ACCOUNT_ID' },
      }

      shallowMount(UpdateAssetRequestsModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(Config.initConfig)
        .to.have.been.calledOnceWithExactly(props.config)
    })

    it('calls setAccountId method', () => {
      shallowMount(UpdateAssetRequestsModule, {
        localVue,
        store,
        propsData: {
          wallet: { accountId: 'SOME_ACCOUNT_ID' },
        },
      })

      expect(UpdateAssetRequestsModule.methods.setAccountId)
        .to.have.been.calledOnceWithExactly('SOME_ACCOUNT_ID')
    })

    it('calls initFirstPageLoader method', () => {
      shallowMount(UpdateAssetRequestsModule, {
        localVue,
        store,
        propsData: {
          wallet: { accountId: 'SOME_ACCOUNT_ID' },
        },
      })

      expect(UpdateAssetRequestsModule.methods.initFirstPageLoader)
        .to.have.been.calledOnce
    })
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      sandbox.stub(UpdateAssetRequestsModule, 'created').resolves()
      wrapper = shallowMount(UpdateAssetRequestsModule, {
        store,
        localVue,
      })
    })

    describe('method', () => {
      describe('loadRequests', () => {
        it('calls loadUpdateAssetRequests method, sets isLoaded property to true, and returns the requests response if loading succeded', async () => {
          const responseStub = { data: {} }
          sandbox.stub(wrapper.vm, 'loadUpdateAssetRequests')
            .resolves(responseStub)

          const result = await wrapper.vm.loadRequests()

          expect(wrapper.vm.loadUpdateAssetRequests).to.have.been.calledOnce
          expect(wrapper.vm.isLoaded).to.be.true
          expect(result).to.equal(responseStub)
        })

        it('calls ErrorHandler.processWithoutFeedback and sets isLoadingFailed property to true if an error was thrown', async () => {
          sandbox.stub(wrapper.vm, 'loadUpdateAssetRequests').rejects()
          sandbox.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadRequests()

          expect(ErrorHandler.processWithoutFeedback)
            .to.have.been.calledOnce
          expect(wrapper.vm.isLoadingFailed).to.be.true
        })
      })

      describe('initFirstPageLoader', () => {
        it('sets an instance of loadRequests method to the firstPageLoader property', async () => {
          sandbox.stub(wrapper.vm, 'loadRequests').resolves()
          wrapper.setData({
            firstPageLoader: () => {},
          })

          wrapper.vm.initFirstPageLoader()
          await wrapper.vm.firstPageLoader()

          expect(wrapper.vm.loadRequests).to.have.been.calledOnce
        })
      })

      describe('showRequestDetails', () => {
        it('sets component data properties properly', () => {
          wrapper.setData({
            selectedRequest: {},
            isUpdateMode: true,
            isDrawerShown: false,
          })

          wrapper.vm.showRequestDetails({ id: '1' })

          expect(wrapper.vm.selectedRequest).to.deep.equal({ id: '1' })
          expect(wrapper.vm.isUpdateMode).to.be.false
          expect(wrapper.vm.isDrawerShown).to.be.true
        })
      })
    })
  })
})
