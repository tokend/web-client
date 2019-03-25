import RequestAttributesViewer from './request-attributes-viewer'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { CreateAssetRequest } from '../wrappers/create-asset-request'

import * as Config from '../_config'

const localVue = createLocalVue()

describe('Asset creation request attributes viewer', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(RequestAttributesViewer, {
      localVue,
      propsData: { request: new CreateAssetRequest({}) },
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
