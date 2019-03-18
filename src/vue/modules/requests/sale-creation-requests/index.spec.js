import SaleCreationRequestsModule from './index'

import Vuex from 'vuex'
import { types } from './store/types'
import { saleCreationRequestsModule } from './store/index'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { Wallet } from '@tokend/js-sdk'

import * as Api from './_api'
import * as Config from './_config'

import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Sale creation requests module', () => {
  const props = {
    config: {
      horizonURL: 'https://test.api.com',
      storageURL: 'https://test.storage.com',
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
    sinon.stub(saleCreationRequestsModule.getters, types.accountOwnedAssets)
      .returns([{ code: 'USD' }])

    store = new Vuex.Store({
      modules: { 'sale-creation-requests': saleCreationRequestsModule },
    })
  })

  afterEach(() => {
    saleCreationRequestsModule.getters[types.accountOwnedAssets].restore()
  })

  describe('created hook', () => {
    beforeEach(() => {
      sinon.stub(Api, 'initApi')
      sinon.stub(Config, 'initConfig')
      sinon.stub(SaleCreationRequestsModule.methods, 'setAccountId')
      sinon.stub(SaleCreationRequestsModule.methods, 'initAssetSelector')
        .resolves()
    })

    afterEach(() => {
      Api.initApi.restore()
      Config.initConfig.restore()
      SaleCreationRequestsModule.methods.setAccountId.restore()
      SaleCreationRequestsModule.methods.initAssetSelector.restore()
    })

    it('calls initApi function', async () => {
      await shallowMount(SaleCreationRequestsModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(Api.initApi)
        .to.have.been.calledOnceWithExactly(props.wallet, props.config)
    })

    it('calls initConfig function', async () => {
      await shallowMount(SaleCreationRequestsModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(Config.initConfig)
        .to.have.been.calledOnceWithExactly(props.config)
    })

    it('calls setAccountId method', async () => {
      await shallowMount(SaleCreationRequestsModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(SaleCreationRequestsModule.methods.setAccountId
        .withArgs(props.wallet.accountId)
      ).to.have.been.calledOnce
    })

    it('calls initAssetSelector method', () => {
      shallowMount(SaleCreationRequestsModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(SaleCreationRequestsModule.methods.initAssetSelector)
        .to.have.been.calledOnce
    })
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      sinon.stub(SaleCreationRequestsModule, 'created').resolves()

      wrapper = shallowMount(SaleCreationRequestsModule, {
        store,
        localVue,
        propsData: props,
      })
    })

    afterEach(() => {
      SaleCreationRequestsModule.created.restore()
    })

    describe('method', () => {
      describe('loadBalances', () => {
        it('calls loadAccountBalances method', async () => {
          sinon.stub(wrapper.vm, 'loadAccountBalances').resolves()

          await wrapper.vm.loadBalances()

          expect(wrapper.vm.loadAccountBalances).to.have.been.calledOnce

          wrapper.vm.loadAccountBalances.restore()
        })

        it('sets isLoaded property to true if loading was succeded', async () => {
          sinon.stub(wrapper.vm, 'loadAccountBalances').resolves()

          await wrapper.vm.loadBalances()

          expect(wrapper.vm.isLoaded).to.be.true

          wrapper.vm.loadAccountBalances.restore()
        })

        it('returns the response of loadAccountBalances method', async () => {
          const response = { data: {} }
          sinon.stub(wrapper.vm, 'loadAccountBalances')
            .resolves(response)

          const result = await wrapper.vm.loadBalances()

          expect(result).to.equal(response)

          wrapper.vm.loadAccountBalances.restore()
        })

        it('calls ErrorHandler.processWithoutFeedback if an error was thrown', async () => {
          sinon.stub(wrapper.vm, 'loadAccountBalances').rejects()
          sinon.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadBalances()

          expect(ErrorHandler.processWithoutFeedback)
            .to.have.been.calledOnce

          wrapper.vm.loadAccountBalances.restore()
          ErrorHandler.processWithoutFeedback.restore()
        })

        it('set isLoadingFailed property to true if an error was thrown', async () => {
          sinon.stub(wrapper.vm, 'loadAccountBalances').rejects()
          sinon.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadBalances()

          expect(wrapper.vm.isLoadingFailed).to.be.true

          wrapper.vm.loadAccountBalances.restore()
          ErrorHandler.processWithoutFeedback.restore()
        })
      })

      describe('initAssetSelector', () => {
        beforeEach(() => {
          sinon.stub(wrapper.vm, 'loadBalances').resolves()
        })

        afterEach(() => {
          wrapper.vm.loadBalances.restore()
        })

        it('calls loadBalance method', async () => {
          await wrapper.vm.initAssetSelector()

          expect(wrapper.vm.loadBalances).to.have.been.calledOnce
        })

        it('sets filters.baseAsset property if there are owned assets', async () => {
          await wrapper.vm.initAssetSelector()

          expect(wrapper.vm.filters.baseAsset).to.deep.equal({ code: 'USD' })
        })
      })
    })
  })
})
