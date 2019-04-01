import RequestAttributesViewer from './request-attributes-viewer'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { UpdateAssetRequest } from '../wrappers/update-asset-request'

import * as Config from '../_config'

const localVue = createLocalVue()

describe('Update asset request attributes viewer', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(RequestAttributesViewer, {
      localVue,
      propsData: { request: new UpdateAssetRequest({}) },
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
