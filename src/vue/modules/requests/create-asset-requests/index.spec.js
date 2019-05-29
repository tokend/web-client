import CreateAssetRequestsModule from './index'

import Vuex from 'vuex'

import { createAssetRequestsModule } from './store/index'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Create asset requests module', () => {
  let sandbox
  let store

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    store = new Vuex.Store({
      modules: {
        'create-asset-requests': createAssetRequestsModule,
      },
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('created hook', () => {
    beforeEach(() => {
      sandbox.stub(CreateAssetRequestsModule.methods, 'initFirstPageLoader')
      sandbox.stub(CreateAssetRequestsModule.methods, 'loadAssetTypes')
    })

    it('calls initFirstPageLoader method', async () => {
      await shallowMount(CreateAssetRequestsModule, {
        localVue,
        store,
      })

      expect(CreateAssetRequestsModule.methods.initFirstPageLoader)
        .to.have.been.calledOnce
    })

    it('calls loadAssetTypes method', async () => {
      await shallowMount(CreateAssetRequestsModule, {
        localVue,
        store,
      })

      expect(CreateAssetRequestsModule.methods.loadAssetTypes)
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

      describe('loadAssetTypes', () => {
        it('calls proper methods to load asset types', async () => {
          sandbox.stub(wrapper.vm, 'loadKycRequiredAssetType').resolves()
          sandbox.stub(wrapper.vm, 'loadSecurityAssetType').resolves()

          await wrapper.vm.loadAssetTypes()

          expect(wrapper.vm.loadSecurityAssetType, 'loadSecurityAssetType')
            .to.have.been.calledOnce
          expect(wrapper.vm.loadKycRequiredAssetType, 'loadKycRequiredAssetType')
            .to.have.been.calledOnce
        })

        it('handles an error properly if it was thrown', async () => {
          sandbox.stub(wrapper.vm, 'loadKycRequiredAssetType').rejects()
          sandbox.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadAssetTypes()

          expect(ErrorHandler.processWithoutFeedback)
            .to.have.been.calledOnce
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
