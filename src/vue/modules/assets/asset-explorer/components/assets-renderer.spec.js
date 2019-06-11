import AssetsRenderer from './assets-renderer'

import Vuex from 'vuex'

import { assetExplorerModule } from '../store/index'
import { AssetRecord } from '@/js/records/entities/asset.record'

import { createLocalVue, shallowMount } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Assets renderer', () => {
  let sandbox
  let store

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    store = new Vuex.Store({
      getters: {
        assets: _ => [],
        accountBalances: _ => [],
      },
      modules: { 'asset-explorer': assetExplorerModule },
    })
  })

  afterEach(() => sandbox.restore())

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
      describe('selectAsset', () => {
        it('sets selectedAsset property to passed param, isUpdateMode property to false, and isDrawerShown property to true', () => {
          const asset = new AssetRecord({ id: 'USD' }, [{
            asset: { code: 'USD' },
            balance: '1.000000',
          }])

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
