import CreateAssetRequestsModule from './index'

import Vuex from 'vuex'

import { createAssetRequestsModule } from './store/index'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import * as Api from './_api'
import * as Config from './_config'

import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Create asset requests module', () => {
  let sandbox
  let store

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    store = new Vuex.Store({
      modules: { 'create-asset-requests': createAssetRequestsModule },
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('created hook', () => {
    beforeEach(() => {
      sandbox.stub(Api, 'initApi')
      sandbox.stub(Config, 'initConfig')
      sandbox.stub(CreateAssetRequestsModule.methods, 'setAccountId')
      sandbox.stub(CreateAssetRequestsModule.methods, 'initFirstPageLoader')
    })

    it('calls initApi function with correct params', () => {
      shallowMount(CreateAssetRequestsModule, {
        localVue,
        store,
        propsData: {
          config: 'SOME_CONFIG',
          wallet: 'SOME_WALLET',
        },
      })

      expect(Api.initApi)
        .to.have.been.calledOnceWithExactly('SOME_WALLET', 'SOME_CONFIG')
    })

    it('calls initConfig function with correct params', () => {
      shallowMount(CreateAssetRequestsModule, {
        localVue,
        store,
        propsData: {
          config: 'SOME_CONFIG',
          wallet: { accountId: 'SOME_ACCOUNT_ID' },
        },
      })

      expect(Config.initConfig)
        .to.have.been.calledOnceWithExactly('SOME_CONFIG')
    })

    it('calls setAccountId method', () => {
      shallowMount(CreateAssetRequestsModule, {
        localVue,
        store,
        propsData: {
          wallet: { accountId: 'SOME_ACCOUNT_ID' },
        },
      })

      expect(CreateAssetRequestsModule.methods.setAccountId)
        .to.have.been.calledOnceWithExactly('SOME_ACCOUNT_ID')
    })

    it('calls initFirstPageLoader method', () => {
      shallowMount(CreateAssetRequestsModule, {
        localVue,
        store,
        propsData: {
          wallet: { accountId: 'SOME_ACCOUNT_ID' },
        },
      })

      expect(CreateAssetRequestsModule.methods.initFirstPageLoader)
        .to.have.been.calledOnce
    })
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      sandbox.stub(CreateAssetRequestsModule, 'created').resolves()
      wrapper = shallowMount(CreateAssetRequestsModule, {
        store,
        localVue,
      })
    })

    describe('method', () => {
      describe('loadRequests', () => {
        it('loads requests and returns the response if loading succeded', async () => {
          const responseStub = { data: {} }
          sandbox.stub(wrapper.vm, 'loadCreateAssetRequests')
            .resolves(responseStub)

          const result = await wrapper.vm.loadRequests()

          expect(wrapper.vm.loadCreateAssetRequests).to.have.been.calledOnce
          expect(wrapper.vm.isLoaded).to.be.true
          expect(result).to.equal(responseStub)
        })

        it('handles an error properly if it was thrown', async () => {
          sandbox.stub(wrapper.vm, 'loadCreateAssetRequests').rejects()
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
