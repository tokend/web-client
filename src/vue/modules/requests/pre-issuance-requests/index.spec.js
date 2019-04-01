import PreIssuanceRequestsModule from './index'

import Vuex from 'vuex'
import { preIssuanceRequestsModule } from './store/index'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { Wallet } from '@tokend/js-sdk'
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

      shallowMount(PreIssuanceRequestsModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(Api.initApi)
        .to.have.been.calledOnceWithExactly(props.wallet, props.config)
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
        it('calls loadPreIssuanceRequests method, sets isLoaded property to true, and returns the requests response if loading succeded', async () => {
          const responseStub = { data: {} }
          sandbox.stub(wrapper.vm, 'loadPreIssuanceRequests')
            .resolves(responseStub)

          const result = await wrapper.vm.loadRequests()

          expect(wrapper.vm.loadPreIssuanceRequests).to.have.been.calledOnce
          expect(wrapper.vm.isLoaded).to.be.true
          expect(result).to.equal(responseStub)
        })

        it('calls ErrorHandler.processWithoutFeedback and sets isLoadingFailed property to true if an error was thrown', async () => {
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
