import AssetUpdateRequestAttributesViewer from './asset-update-request-attributes-viewer'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { AssetUpdateRequest } from '../wrappers/asset-update-request'

import * as Config from '../_config'

const localVue = createLocalVue()

describe('Asset update request attributes viewer', () => {
  const props = {
    request: new AssetUpdateRequest({}),
  }

  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(AssetUpdateRequestAttributesViewer, {
      localVue,
      propsData: props,
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
        const expectedTermsUrl = 'https://test.com/terms'
        sinon.stub(wrapper.vm.request, 'termsUrl').returns(expectedTermsUrl)

        expect(wrapper.vm.assetTermsUrl).to.equal(expectedTermsUrl)

        wrapper.vm.request.termsUrl.restore()
      })
    })
  })
})
