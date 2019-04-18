import AssetsRenderer from './assets-renderer'

import Vuex from 'vuex'

import { assetExplorerModule } from '../store/index'
import { Asset } from '../../shared/wrappers/asset'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Assets renderer', () => {
  let sandbox
  let store

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    store = new Vuex.Store({
      modules: { 'asset-explorer': assetExplorerModule },
    })
  })

  afterEach(() => sandbox.restore())

  describe('created hook', () => {
    it('calls initFirstPageLoader function', () => {
      sandbox.stub(AssetsRenderer.methods, 'initFirstPageLoader')

      shallowMount(AssetsRenderer, {
        localVue,
        store,
        propsData: { config: {} },
      })

      expect(AssetsRenderer.methods.initFirstPageLoader)
        .to.have.been.calledOnce

      AssetsRenderer.methods.initFirstPageLoader.restore()
    })
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      wrapper = shallowMount(AssetsRenderer, {
        store,
        localVue,
        propsData: { config: {} },
      })
    })

    describe('method', () => {
      describe('loadAssetsPage', () => {
        it('calls loadAssets method with proper params and sets isLoaded property to true if loading was succeded', async () => {
          sandbox.stub(wrapper.vm, 'loadAssets').resolves()

          await wrapper.vm.loadAssetsPage()

          expect(wrapper.vm.loadAssets)
            .to.have.been.calledOnceWithExactly({
              page: {
                limit: 12,
              },
            })
          expect(wrapper.vm.isLoaded).to.be.true
        })

        it('handles the error if loading was failed', async () => {
          sandbox.stub(wrapper.vm, 'loadAssets').throws()
          sandbox.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadAssetsPage()

          expect(wrapper.vm.isLoadFailed).to.be.true
          expect(ErrorHandler.processWithoutFeedback)
            .to.have.been.calledOnce

          wrapper.vm.loadAssets.restore()
          ErrorHandler.processWithoutFeedback.restore()
        })
      })

      describe('selectAsset', () => {
        it('sets selectedAsset property to passed param, isUpdateMode property to false, and isDrawerShown property to true', () => {
          const asset = new Asset({ id: 'USD' }, '1.000000')

          wrapper.setData({
            isUpdateMode: true,
            isDrawerShown: false,
          })

          wrapper.vm.selectAsset(asset)

          expect(wrapper.vm.selectedAsset).to.deep.equal(asset)
          expect(wrapper.vm.isUpdateMode).to.be.false
          expect(wrapper.vm.isDrawerShown).to.be.true
        })
      })
    })
  })
})
