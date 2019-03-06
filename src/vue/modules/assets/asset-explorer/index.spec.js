import AssetExplorerModule from './index'

import Vuex from 'vuex'

import { assetExplorerModule } from './store/index'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { Wallet } from '@tokend/js-sdk'

import * as Api from './_api'
import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Asset explorer module', () => {
  const props = {
    config: {
      horizonUrl: 'https://test.api.com',
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
      modules: { 'asset-explorer': assetExplorerModule },
    })
  })

  describe('created hook', () => {
    beforeEach(() => {
      sinon.stub(Api, 'initApi')
      sinon.stub(AssetExplorerModule.methods, 'setAccountId')
      sinon.stub(AssetExplorerModule.methods, 'loadBalances').resolves()
    })

    afterEach(() => {
      Api.initApi.restore()
      AssetExplorerModule.methods.setAccountId.restore()
      AssetExplorerModule.methods.loadBalances.restore()
    })

    it('calls initApi function', async () => {
      await shallowMount(AssetExplorerModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(Api.initApi.withArgs(props.wallet, props.config))
        .to.have.been.calledOnce
    })

    it('calls setAccountId method', async () => {
      await shallowMount(AssetExplorerModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(AssetExplorerModule.methods.setAccountId
        .withArgs(props.wallet.accountId)
      ).to.have.been.calledOnce
    })

    it('calls loadBalances method', async () => {
      await shallowMount(AssetExplorerModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(AssetExplorerModule.methods.loadBalances)
        .to.have.been.calledOnce
    })
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      sinon.stub(AssetExplorerModule, 'created').resolves()

      wrapper = shallowMount(AssetExplorerModule, {
        store,
        localVue,
        propsData: props,
      })
    })

    afterEach(() => {
      AssetExplorerModule.created.restore()
    })

    describe('method', () => {
      describe('loadBalances', () => {
        it('calls loadAccountBalances method', async () => {
          sinon.stub(wrapper.vm, 'loadAccountBalances').resolves()

          await wrapper.vm.loadBalances()

          expect(wrapper.vm.loadAccountBalances)
            .to.have.been.calledOnce

          wrapper.vm.loadAccountBalances.restore()
        })

        it('sets isLoaded property to true if loading was succeded', async () => {
          sinon.stub(wrapper.vm, 'loadAccountBalances').resolves()

          await wrapper.vm.loadBalances()

          expect(wrapper.vm.isLoaded).to.be.true

          wrapper.vm.loadAccountBalances.restore()
        })

        it('handles the error if loading was failed', async () => {
          sinon.stub(wrapper.vm, 'loadAccountBalances').throws()
          sinon.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadBalances()

          expect(wrapper.vm.isLoadFailed).to.be.true
          expect(ErrorHandler.processWithoutFeedback)
            .to.have.been.calledOnce

          wrapper.vm.loadAccountBalances.restore()
          ErrorHandler.processWithoutFeedback.restore()
        })
      })
    })
  })
})
