import SaleCreationRequestsRenderer from './sale-creation-requests-renderer'

import Vuex from 'vuex'

import { saleCreationRequestsModule } from '../store/index'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { Asset } from '../wrappers/asset'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Sale creation requests renderer', () => {
  const props = {
    baseAsset: new Asset({ id: 'USD' }),
  }
  let store

  beforeEach(() => {
    store = new Vuex.Store({
      modules: { 'sale-creation-requests': saleCreationRequestsModule },
    })
  })

  describe('created hook', () => {
    it('calls initFirstPageLoader method', () => {
      sinon.stub(SaleCreationRequestsRenderer.methods, 'initFirstPageLoader')

      shallowMount(SaleCreationRequestsRenderer, {
        localVue,
        store,
      })

      expect(SaleCreationRequestsRenderer.methods.initFirstPageLoader)
        .to.have.been.calledOnce

      SaleCreationRequestsRenderer.methods.initFirstPageLoader.restore()
    })
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      wrapper = shallowMount(SaleCreationRequestsRenderer, {
        store,
        propsData: props,
        localVue,
      })
    })

    describe('watcher', () => {
      describe('baseAsset', () => {
        it('should call initFirstPageLoader method if the value has been changed', async () => {
          sinon.stub(wrapper.vm, 'initFirstPageLoader').resolves()

          wrapper.setProps({ baseAsset: 'USD' })

          await wrapper.vm.$nextTick()

          expect(wrapper.vm.initFirstPageLoader).to.have.been.calledOnce

          wrapper.vm.initFirstPageLoader.restore()
        })
      })
    })

    describe('method', () => {
      describe('loadRequests', () => {
        it('calls loadSaleCreationRequests method with correct params', async () => {
          sinon.stub(wrapper.vm, 'loadSaleCreationRequests').resolves()

          await wrapper.vm.loadRequests()

          expect(wrapper.vm.loadSaleCreationRequests)
            .to.have.been.calledOnceWithExactly('USD')

          wrapper.vm.loadSaleCreationRequests.restore()
        })

        it('sets isLoaded property to true if loading was succeded', async () => {
          sinon.stub(wrapper.vm, 'loadSaleCreationRequests').resolves()

          await wrapper.vm.loadRequests()

          expect(wrapper.vm.isLoaded).to.be.true

          wrapper.vm.loadSaleCreationRequests.restore()
        })

        it('returns the response of loadSaleCreationRequests method', async () => {
          const response = { data: {} }
          sinon.stub(wrapper.vm, 'loadSaleCreationRequests')
            .resolves(response)

          const result = await wrapper.vm.loadRequests()

          expect(result).to.deep.equal(response)

          wrapper.vm.loadSaleCreationRequests.restore()
        })

        it('calls ErrorHandler.processWithoutFeedback if an error was thrown', async () => {
          sinon.stub(wrapper.vm, 'loadSaleCreationRequests').rejects()
          sinon.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadRequests()

          expect(ErrorHandler.processWithoutFeedback)
            .to.have.been.calledOnce

          wrapper.vm.loadSaleCreationRequests.restore()
          ErrorHandler.processWithoutFeedback.restore()
        })

        it('set isLoadingFailed property to true if an error was thrown', async () => {
          sinon.stub(wrapper.vm, 'loadSaleCreationRequests').rejects()
          sinon.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadRequests()

          expect(wrapper.vm.isLoadingFailed).to.be.true

          wrapper.vm.loadSaleCreationRequests.restore()
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
