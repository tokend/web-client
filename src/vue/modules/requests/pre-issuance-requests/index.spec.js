import PreIssuanceRequestsModule from './index'

import Vuex from 'vuex'
import { preIssuanceRequestsModule } from './store/index'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import * as Api from './_api'

import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Pre issuance requests module', () => {
  let sandbox
  let store

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    store = new Vuex.Store({
      modules: { 'pre-issuance-requests': preIssuanceRequestsModule },
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('created hook', () => {
    beforeEach(() => {
      sandbox.stub(Api, 'initApi')
      sandbox.stub(PreIssuanceRequestsModule.methods, 'setAccountId')
      sandbox.stub(PreIssuanceRequestsModule.methods, 'initFirstPageLoader')
    })

    it('calls initApi function with correct params', () => {
      shallowMount(PreIssuanceRequestsModule, {
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

    it('calls setAccountId method', () => {
      shallowMount(PreIssuanceRequestsModule, {
        localVue,
        store,
        propsData: {
          wallet: { accountId: 'SOME_ACCOUNT_ID' },
        },
      })

      expect(PreIssuanceRequestsModule.methods.setAccountId)
        .to.have.been.calledOnceWithExactly('SOME_ACCOUNT_ID')
    })

    it('calls initFirstPageLoader method', () => {
      shallowMount(PreIssuanceRequestsModule, {
        localVue,
        store,
        propsData: {
          wallet: { accountId: 'SOME_ACCOUNT_ID' },
        },
      })

      expect(PreIssuanceRequestsModule.methods.initFirstPageLoader)
        .to.have.been.calledOnce
    })
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      sandbox.stub(PreIssuanceRequestsModule, 'created')
      wrapper = shallowMount(PreIssuanceRequestsModule, {
        store,
        localVue,
      })
    })

    describe('method', () => {
      describe('loadRequests', () => {
        it('loads requests properly and returns the response if loading succeded', async () => {
          const responseStub = { data: {} }
          sandbox.stub(wrapper.vm, 'loadPreIssuanceRequests')
            .resolves(responseStub)

          const result = await wrapper.vm.loadRequests()

          expect(wrapper.vm.loadPreIssuanceRequests).to.have.been.calledOnce
          expect(wrapper.vm.isLoaded).to.be.true
          expect(result).to.equal(responseStub)
        })

        it('handles an error properly if it was thrown', async () => {
          sandbox.stub(wrapper.vm, 'loadPreIssuanceRequests').rejects()
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
    })
  })
})
