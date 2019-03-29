import IncomingWitdrawalRequestsModule from './index'

import Vuex from 'vuex'

import { incomingWithdrawalRequestsModule } from './store/index'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { Wallet } from '@tokend/js-sdk'

import * as Api from './_api'

import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Incoming withdrawal requests module', () => {
  const props = {
    config: { horizonURL: 'https://test.api.com' },
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
      modules: {
        'incoming-withdrawal-requests': incomingWithdrawalRequestsModule,
      },
    })
  })

  describe('created hook', () => {
    it('calls initApi function with provided params', () => {
      sinon.stub(Api, 'initApi')

      shallowMount(IncomingWitdrawalRequestsModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(Api.initApi)
        .to.have.been.calledOnceWithExactly(props.wallet, props.config)

      Api.initApi.restore()
    })

    it('calls setAccountId method', () => {
      sinon.stub(IncomingWitdrawalRequestsModule.methods, 'setAccountId')

      shallowMount(IncomingWitdrawalRequestsModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(IncomingWitdrawalRequestsModule.methods.setAccountId
        .withArgs(props.wallet.accountId)
      ).to.have.been.calledOnce

      IncomingWitdrawalRequestsModule.methods.setAccountId.restore()
    })

    it('calls initFirstPageLoader method', () => {
      sinon.stub(IncomingWitdrawalRequestsModule.methods, 'initFirstPageLoader')

      shallowMount(IncomingWitdrawalRequestsModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(IncomingWitdrawalRequestsModule.methods.initFirstPageLoader)
        .to.have.been.calledOnce

      IncomingWitdrawalRequestsModule.methods.initFirstPageLoader.restore()
    })
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      wrapper = shallowMount(IncomingWitdrawalRequestsModule, {
        store,
        localVue,
        propsData: props,
      })
    })

    describe('method', () => {
      describe('loadRequests', () => {
        it('calls loadIncomingWithdrawalRequests method', async () => {
          sinon.stub(wrapper.vm, 'loadIncomingWithdrawalRequests').resolves()

          await wrapper.vm.loadRequests()

          expect(wrapper.vm.loadIncomingWithdrawalRequests)
            .to.have.been.calledOnce

          wrapper.vm.loadIncomingWithdrawalRequests.restore()
        })

        it('sets isLoaded property to true if loading was succeded', async () => {
          sinon.stub(wrapper.vm, 'loadIncomingWithdrawalRequests').resolves()

          await wrapper.vm.loadRequests()

          expect(wrapper.vm.isLoaded).to.be.true

          wrapper.vm.loadIncomingWithdrawalRequests.restore()
        })

        it('returns the response of loadIncomingWithdrawalRequests method', async () => {
          const responseStub = { data: {} }

          sinon.stub(wrapper.vm, 'loadIncomingWithdrawalRequests')
            .resolves(responseStub)

          const result = await wrapper.vm.loadRequests()

          expect(result).to.equal(responseStub)

          wrapper.vm.loadIncomingWithdrawalRequests.restore()
        })

        it('calls ErrorHandler.processWithoutFeedback if an error was thrown', async () => {
          sinon.stub(wrapper.vm, 'loadIncomingWithdrawalRequests').rejects()
          sinon.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadRequests()

          expect(ErrorHandler.processWithoutFeedback)
            .to.have.been.calledOnce

          wrapper.vm.loadIncomingWithdrawalRequests.restore()
          ErrorHandler.processWithoutFeedback.restore()
        })

        it('set isLoadingFailed property to true if an error was thrown', async () => {
          sinon.stub(wrapper.vm, 'loadIncomingWithdrawalRequests').rejects()
          sinon.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadRequests()

          expect(wrapper.vm.isLoadingFailed).to.be.true

          wrapper.vm.loadIncomingWithdrawalRequests.restore()
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
