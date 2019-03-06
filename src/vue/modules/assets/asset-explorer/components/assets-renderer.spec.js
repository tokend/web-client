import AssetsRenderer from './assets-renderer'

import Vuex from 'vuex'

import { assetExplorerModule } from '../store/index'
import { Asset } from '../../shared/wrappers/asset'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Assets renderer', () => {
  const props = {
    config: {
      horizonUrl: 'https://test.api.com',
    },
  }

  let store

  beforeEach(() => {
    store = new Vuex.Store({
      modules: { 'asset-explorer': assetExplorerModule },
    })
  })

  describe('created hook', () => {
    it('calls initFirstPageLoader function', () => {
      sinon.stub(AssetsRenderer.methods, 'initFirstPageLoader')

      shallowMount(AssetsRenderer, {
        localVue,
        store,
        propsData: props,
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
        propsData: props,
      })
    })

    describe('method', () => {
      describe('loadAssetsPage', () => {
        it('calls loadAssets method with proper params', async () => {
          sinon.stub(wrapper.vm, 'loadAssets').resolves()

          await wrapper.vm.loadAssetsPage()

          expect(wrapper.vm.loadAssets)
            .to.have.been.calledOnceWithExactly({
              page: {
                limit: 12,
              },
            })

          wrapper.vm.loadAssets.restore()
        })

        it('sets isLoaded property to true if loading was succeded', async () => {
          sinon.stub(wrapper.vm, 'loadAssets').resolves()

          await wrapper.vm.loadAssetsPage()

          expect(wrapper.vm.isLoaded).to.be.true

          wrapper.vm.loadAssets.restore()
        })

        it('handles the error if loading was failed', async () => {
          sinon.stub(wrapper.vm, 'loadAssets').throws()
          sinon.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadAssetsPage()

          expect(wrapper.vm.isLoadFailed).to.be.true
          expect(ErrorHandler.processWithoutFeedback)
            .to.have.been.calledOnce

          wrapper.vm.loadAssets.restore()
          ErrorHandler.processWithoutFeedback.restore()
        })
      })

      describe('selectAsset', () => {
        it('sets selectedAsset property to passed param', () => {
          const asset = new Asset({ id: 'USD' }, '1.000000')

          wrapper.vm.selectAsset(asset)

          expect(wrapper.vm.selectedAsset).to.deep.equal(asset)
        })

        it('sets isUpdateMode property to false', () => {
          const asset = new Asset({ id: 'USD' }, '1.000000')

          wrapper.setData({
            isUpdateMode: true,
          })

          wrapper.vm.selectAsset(asset)

          expect(wrapper.vm.isUpdateMode).to.be.false
        })

        it('sets isDrawerShown property to true', () => {
          const asset = new Asset({ id: 'USD' }, '1.000000')

          wrapper.setData({
            isDrawerShown: false,
          })

          wrapper.vm.selectAsset(asset)

          expect(wrapper.vm.isDrawerShown).to.be.true
        })
      })
    })
  })
})
