import RequestsRenderer from './requests-renderer'

import Vuex from 'vuex'

import { createSaleRequestsModule } from '../store/index'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { Asset } from '../wrappers/asset'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Create sale requests renderer', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store({
      modules: { 'create-sale-requests': createSaleRequestsModule },
    })
  })

  describe('created hook', () => {
    it('calls initFirstPageLoader method', () => {
      sinon.stub(RequestsRenderer.methods, 'initFirstPageLoader')

      shallowMount(RequestsRenderer, {
        localVue,
        store,
      })

      expect(RequestsRenderer.methods.initFirstPageLoader)
        .to.have.been.calledOnce

      RequestsRenderer.methods.initFirstPageLoader.restore()
    })
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      wrapper = shallowMount(RequestsRenderer, {
        store,
        localVue,
      })
    })

    describe('watcher', () => {
      describe('baseAsset', () => {
        it('should call initFirstPageLoader method if the value has been changed', async () => {
          sinon.stub(wrapper.vm, 'initFirstPageLoader').resolves()

          wrapper.setProps({ baseAsset: new Asset({ id: 'USD' }) })
          await wrapper.vm.$nextTick()

          expect(wrapper.vm.initFirstPageLoader).to.have.been.calledOnce

          wrapper.vm.initFirstPageLoader.restore()
        })
      })
    })

    describe('method', () => {
      describe('loadRequests', () => {
        beforeEach(() => {
          wrapper.setProps({
            baseAsset: new Asset({ id: 'USD' }),
          })
        })

        it('calls loadCreateSaleRequests method with correct params', async () => {
          sinon.stub(wrapper.vm, 'loadCreateSaleRequests').resolves()

          await wrapper.vm.loadRequests()

          expect(wrapper.vm.loadCreateSaleRequests)
            .to.have.been.calledOnceWithExactly('USD')

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
