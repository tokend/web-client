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

  let store

  beforeEach(() => {
    store = new Vuex.Store({
      modules: { 'pre-issuance-requests': preIssuanceRequestsModule },
    })
  })

  describe('created hook', () => {
    it('calls initApi function', () => {
      sinon.stub(Api, 'initApi')

      shallowMount(PreIssuanceRequestsModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(Api.initApi)
        .to.have.been.calledOnceWithExactly(props.wallet, props.config)

      Api.initApi.restore()
    })

    it('calls setAccountId method', () => {
      sinon.stub(PreIssuanceRequestsModule.methods, 'setAccountId')

      shallowMount(PreIssuanceRequestsModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(PreIssuanceRequestsModule.methods.setAccountId
        .withArgs(props.wallet.accountId)
      ).to.have.been.calledOnce

      PreIssuanceRequestsModule.methods.setAccountId.restore()
    })

    it('calls initFirstPageLoader method', () => {
      sinon.stub(PreIssuanceRequestsModule.methods, 'initFirstPageLoader')

      shallowMount(PreIssuanceRequestsModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(PreIssuanceRequestsModule.methods.initFirstPageLoader)
        .to.have.been.calledOnce

      PreIssuanceRequestsModule.methods.initFirstPageLoader.restore()
    })
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      wrapper = shallowMount(PreIssuanceRequestsModule, {
        store,
        localVue,
        propsData: props,
      })
    })

    describe('method', () => {
      describe('loadRequests', () => {
        it('calls loadPreIssuanceRequests method', async () => {
          sinon.stub(wrapper.vm, 'loadPreIssuanceRequests').resolves()

          await wrapper.vm.loadRequests()

          expect(wrapper.vm.loadPreIssuanceRequests).to.have.been.calledOnce

          wrapper.vm.loadPreIssuanceRequests.restore()
        })

        it('sets isLoaded property to true if loading was succeded', async () => {
          sinon.stub(wrapper.vm, 'loadPreIssuanceRequests').resolves()

          await wrapper.vm.loadRequests()

          expect(wrapper.vm.isLoaded).to.be.true

          wrapper.vm.loadPreIssuanceRequests.restore()
        })

        it('returns the response of loadPreIssuanceRequests method', async () => {
          sinon.stub(wrapper.vm, 'loadPreIssuanceRequests')
            .resolves({ data: {} })

          const result = await wrapper.vm.loadRequests()

          expect(result).to.deep.equal({ data: {} })

          wrapper.vm.loadPreIssuanceRequests.restore()
        })

        it('calls ErrorHandler.processWithoutFeedback if an error was thrown', async () => {
          sinon.stub(wrapper.vm, 'loadPreIssuanceRequests').rejects()
          sinon.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadRequests()

          expect(ErrorHandler.processWithoutFeedback)
            .to.have.been.calledOnce

          wrapper.vm.loadPreIssuanceRequests.restore()
          ErrorHandler.processWithoutFeedback.restore()
        })

        it('set isLoadingFailed property to true if an error was thrown', async () => {
          sinon.stub(wrapper.vm, 'loadPreIssuanceRequests').rejects()
          sinon.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadRequests()

          expect(wrapper.vm.isLoadingFailed).to.be.true

          wrapper.vm.loadPreIssuanceRequests.restore()
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
    })
  })
})
