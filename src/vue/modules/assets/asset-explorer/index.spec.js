import AssetExplorerModule from './index'

import Vuex from 'vuex'

import { assetExplorerModule } from './store/index'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import * as Api from '@/api'
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
      sandbox.stub(AssetExplorerModule.methods, 'load')

      await shallowMount(AssetExplorerModule, {
        localVue,
        store,
        propsData: {
          config: { horizonURL: 'https://test.api.com' },
          wallet: { accountId: 'SOME_ACCOUNT_ID' },
        },
      })

      expect(Api.initApi).to.has.been.calledOnceWithExactly(
        { accountId: 'SOME_ACCOUNT_ID' },
        { horizonURL: 'https://test.api.com' }
      )
      expect(AssetExplorerModule.methods.setAccountId)
        .to.have.been.calledOnceWithExactly('SOME_ACCOUNT_ID')
      expect(AssetExplorerModule.methods.load)
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
          config: { storageURL: 'https://storage.com' },
          wallet: { accountId: 'SOME_ACCOUNT_ID' },
        },
      })
    })

    afterEach(() => {
      AssetExplorerModule.created.restore()
    })

    describe('method', () => {
      describe('load', () => {
        it('calls load methods and sets isLoaded property to true if loading succeded', async () => {
          sandbox.stub(wrapper.vm, 'loadAccountBalances').resolves()
          sandbox.stub(wrapper.vm, 'loadKycRequiredAssetType').resolves()
          sandbox.stub(wrapper.vm, 'loadSecurityAssetType').resolves()

          await wrapper.vm.load()

          expect(wrapper.vm.loadAccountBalances).to.have.been.calledOnce
          expect(wrapper.vm.loadKycRequiredAssetType).to.have.been.calledOnce
          expect(wrapper.vm.isLoaded).to.be.true
        })

        it('handles the error if loading was failed', async () => {
          sandbox.stub(wrapper.vm, 'loadAccountBalances').throws()
          sandbox.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.load()

          expect(wrapper.vm.isLoadFailed).to.be.true
          expect(ErrorHandler.processWithoutFeedback)
            .to.have.been.calledOnce
        })
      })
    })
  })
})
