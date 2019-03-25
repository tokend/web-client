import AssetUpdateRequestAttributesViewer from './asset-update-request-attributes-viewer'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { AssetUpdateRequest } from '../wrappers/asset-update-request'

import * as Config from '../_config'

const localVue = createLocalVue()

describe('Asset update request attributes viewer', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(AssetUpdateRequestAttributesViewer, {
      localVue,
      propsData: { request: new AssetUpdateRequest({}) },
    })
  })

  describe('computed property', () => {
    beforeEach(() => {
      Config.initConfig({
        horizonURL: 'https://horizon.com',
        storageURL: 'https://storage.com',
      })
    })

    describe('assetTermsUrl', () => {
      it('returns request.termsUrl', () => {
        const expectedUrl = 'https://test.com/terms'
        sinon.stub(wrapper.vm.request, 'termsUrl').returns(expectedUrl)

        expect(wrapper.vm.assetTermsUrl).to.equal(expectedUrl)

        wrapper.vm.request.termsUrl.restore()
      })
    })
  })
})
