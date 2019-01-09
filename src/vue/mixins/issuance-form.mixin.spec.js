import IssuanceFormMixin from './issuance-form.mixin'

import Vuex from 'vuex'

import { createLocalVue, mount } from '@vue/test-utils'

import { MockHelper, MockWrapper } from '@/test'

import { vuexTypes } from '@/vuex'
import accountModule from '@/vuex/account.module'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('issuance-form.mixin unit test', () => {
  let wrapper
  let mockHelper
  let assetsSpy

  let assetsResource
  let sampleAssetsData
  let store

  afterEach(() => {
    sinon.restore()
  })

  beforeEach(() => {
    const Component = {
      template: `<div></div>`
    }

    mockHelper = new MockHelper()
    assetsResource = mockHelper.getHorizonResourcePrototype('assets')
    sampleAssetsData = [{
      code: 'BTC',
      availableForIssuance: 100,
      owner: mockHelper.getMockWallet().accountId
    }]
    assetsSpy = sinon.stub(assetsResource, 'getAll').resolves(
      MockWrapper.makeHorizonResponse(sampleAssetsData)
    )

    const getters = accountModule.getters
    sinon.stub(getters, vuexTypes.account)
      .returns({ accountId: mockHelper.getMockWallet().accountId })
    store = new Vuex.Store({
      getters
    })

    wrapper = mount(Component, {
      mixins: [IssuanceFormMixin],
      store,
      localVue
    })
  })

  it('loadAssets() calls the horizon.assets.getAll() with the correct params', async () => {
    await wrapper.vm.loadAssets()
    expect(assetsSpy.calledOnce).to.be.true
  })

  it('loadAssets() changes user tokens data after loading', async () => {
    wrapper.setData({ ownedAssets: null })
    await wrapper.vm.loadAssets()
    expect(wrapper.vm.ownedAssets).to.deep.equal(sampleAssetsData)
  })
})
