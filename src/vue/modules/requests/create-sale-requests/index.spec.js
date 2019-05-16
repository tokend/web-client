import CreateSaleRequestsModule from './index'

import Vuex from 'vuex'
import { createSaleRequestsModule } from './store/index'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Create sale requests module', () => {
  let sandbox
  let store

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    store = new Vuex.Store({
      modules: {
        'create-sale-requests': createSaleRequestsModule,
      },
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('created hook', () => {
    beforeEach(() => {
      sandbox.stub(CreateSaleRequestsModule.methods, 'initFirstPageLoader')
    })

    it('calls initFirstPageLoader method', () => {
      shallowMount(CreateSaleRequestsModule, {
        localVue,
        store,
        propsData: {
          storageUrl: 'https://storage.com',
        },
      })

      expect(CreateSaleRequestsModule.methods.initFirstPageLoader)
        .to.have.been.calledOnce
    })
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      sandbox.stub(CreateSaleRequestsModule, 'created').resolves()

      wrapper = shallowMount(CreateSaleRequestsModule, {
        store,
        localVue,
      })
    })

    afterEach(() => {
      CreateSaleRequestsModule.created.restore()
    })

    describe('method', () => {
      describe('loadRequests', () => {
        it('loads requests and returns the response if loading succeded', async () => {
          const responseStub = { data: {} }
          sandbox.stub(wrapper.vm, 'loadCreateSaleRequests')
            .resolves(responseStub)

          const result = await wrapper.vm.loadRequests()

          expect(wrapper.vm.loadCreateSaleRequests).to.have.been.calledOnce
          expect(wrapper.vm.isLoaded).to.be.true
          expect(result).to.equal(responseStub)
        })

        it('handles an error properly if it was thrown', async () => {
          sandbox.stub(wrapper.vm, 'loadCreateSaleRequests').rejects()
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
