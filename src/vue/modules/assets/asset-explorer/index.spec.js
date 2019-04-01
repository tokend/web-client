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
  let sandbox
  let store

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    store = new Vuex.Store({
      modules: { 'asset-explorer': assetExplorerModule },
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('created hook', () => {
    it('inits API, sets account ID, and loads balances', async () => {
      sandbox.stub(Api, 'initApi')
      sandbox.stub(AssetExplorerModule.methods, 'setAccountId')
      sandbox.stub(AssetExplorerModule.methods, 'loadBalances')

      const props = {
        config: {
          horizonURL: 'https://test.api.com',
          storageURL: 'https://storage.com',
        },
        wallet: new Wallet(
          'test@mail.com',
          'SCPIPHBIMPBMGN65SDGCLMRN6XYGEV7WD44AIDO7HGEYJUNDKNKEGVYE',
          'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ',
          '4aadcd4eb44bb845d828c45dbd68d5d1196c3a182b08cd22f05c56fcf15b153c'
        ),
      }

      await shallowMount(AssetExplorerModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(Api.initApi).to.has.been.calledOnceWithExactly(
        props.wallet, props.config
      )
      expect(AssetExplorerModule.methods.setAccountId)
        .to.have.been.calledOnceWithExactly(props.wallet.accountId)
      expect(AssetExplorerModule.methods.loadBalances)
        .to.have.been.calledOnce
    })
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      sandbox.stub(AssetExplorerModule, 'created').resolves()

      wrapper = shallowMount(AssetExplorerModule, {
        store,
        localVue,
        propsData: {
          config: {
            storageURL: 'https://storage.com',
          },
          wallet: {
            accountId: 'SOME_ACCOUNT_ID',
          },
        },
      })
    })

    afterEach(() => {
      AssetExplorerModule.created.restore()
    })

    describe('method', () => {
      describe('loadBalances', () => {
        it('calls loadAccountBalances method sets isLoaded property to true if loading was succeded', async () => {
          sandbox.stub(wrapper.vm, 'loadAccountBalances').resolves()

          await wrapper.vm.loadBalances()

          expect(wrapper.vm.loadAccountBalances)
            .to.have.been.calledOnce
          expect(wrapper.vm.isLoaded).to.be.true
        })

        it('handles the error if loading was failed', async () => {
          sandbox.stub(wrapper.vm, 'loadAccountBalances').throws()
          sandbox.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadBalances()

          expect(wrapper.vm.isLoadFailed).to.be.true
          expect(ErrorHandler.processWithoutFeedback)
            .to.have.been.calledOnce
        })
      })
    })
  })
})
