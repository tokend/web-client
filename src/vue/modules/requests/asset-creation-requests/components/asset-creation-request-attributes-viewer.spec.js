import AssetCreationRequestAttributesViewer from './asset-creation-request-attributes-viewer'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { AssetCreationRequest } from '../wrappers/asset-creation-request'

import * as Config from '../_config'

const localVue = createLocalVue()

describe('Asset creation request attributes viewer', () => {
  const props = {
    request: new AssetCreationRequest({}),
  }

  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(AssetCreationRequestAttributesViewer, {
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
